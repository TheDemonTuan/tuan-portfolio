package main

import (
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func stub(active, reading, writing, waiting string) string {
	return "Active connections: " + active + " \nserver accepts handled requests\n 10 10 10 \nReading: " + reading + " Writing: " + writing + " Waiting: " + waiting + " \n"
}

func TestParseActiveRequests(t *testing.T) {
	tests := []struct {
		name string
		body string
		want int64
	}{
		{"probe overhead only", stub("2", "0", "2", "0"), 0},
		{"requests and idle keepalives counted", stub("7", "1", "2", "4"), 5},
		{"reading connections counted", stub("4", "2", "2", "0"), 2},
		{"largest counter without sum overflow", stub("9223372036854775807", "9223372036854775805", "2", "0"), 9223372036854775805},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := parseActiveRequests(tt.body)
			if err != nil || got != tt.want {
				t.Fatalf("parseActiveRequests = %d, %v; want %d", got, err, tt.want)
			}
		})
	}
}

func TestParseActiveRequestsRejectsInvalidObservations(t *testing.T) {
	valid := stub("2", "0", "2", "0")
	tests := map[string]string{
		"zero active":             stub("0", "0", "0", "0"),
		"missing outer probe":     stub("1", "0", "1", "0"),
		"sum below active":        stub("3", "0", "2", "0"),
		"sum above active":        stub("2", "1", "2", "0"),
		"reading above active":    stub("2", "3", "0", "0"),
		"waiting above active":    stub("2", "0", "2", "1"),
		"sum overflow":            stub("2", "9223372036854775807", "9223372036854775807", "4"),
		"counter overflow":        stub("9223372036854775808", "0", "2", "0"),
		"negative":                stub("2", "-1", "3", "0"),
		"signed number":           stub("+2", "0", "2", "0"),
		"decimal":                 stub("2.0", "0", "2", "0"),
		"truncated":               strings.TrimSuffix(valid, "\n"),
		"extra field":             valid + "extra\n",
		"extra prefix":            "prefix\n" + valid,
		"wrong label":             strings.Replace(valid, "Reading:", "Reading=", 1),
		"invalid cumulative":      strings.Replace(valid, "10 10 10", "10 x 10", 1),
		"overflow cumulative":     strings.Replace(valid, "10 10 10", "10 9223372036854775808 10", 1),
		"missing cumulative line": strings.Replace(valid, " 10 10 10 \n", "", 1),
		"HTML error":              "<h1>502 Bad Gateway</h1>",
		"empty":                   "",
	}
	for name, body := range tests {
		t.Run(name, func(t *testing.T) {
			if count, err := parseActiveRequests(body); err == nil {
				t.Fatalf("accepted invalid observation as %d active requests", count)
			}
		})
	}
}

type roundTripFunc func(*http.Request) (*http.Response, error)

func (fn roundTripFunc) RoundTrip(r *http.Request) (*http.Response, error) { return fn(r) }

func TestHealthObservation(t *testing.T) {
	tests := []struct {
		name       string
		status     int
		body       string
		requestErr error
		wantStatus int
		wantCount  int64
	}{
		{"idle", 200, stub("2", "0", "2", "0"), nil, 200, 0},
		{"busy", 200, stub("5", "1", "2", "2"), nil, 200, 3},
		{"unreachable", 0, "", errors.New("connection refused"), 503, 0},
		{"status denied", 403, stub("2", "0", "2", "0"), nil, 503, 0},
		{"redirect not success", 301, "", nil, 503, 0},
		{"invalid counters", 200, stub("1", "0", "1", "0"), nil, 503, 0},
		{"oversized", 200, strings.Repeat("x", 1025), nil, 503, 0},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			client := &http.Client{Transport: roundTripFunc(func(r *http.Request) (*http.Response, error) {
				if r.Method != "GET" || r.URL.String() != statusURL {
					t.Fatalf("unexpected status request: %s %s", r.Method, r.URL)
				}
				if tt.requestErr != nil {
					return nil, tt.requestErr
				}
				return &http.Response{StatusCode: tt.status, Header: make(http.Header), Body: io.NopCloser(strings.NewReader(tt.body))}, nil
			})}
			handler := healthHandler{"green", "container-123", client, statusURL}
			response := httptest.NewRecorder()
			handler.ServeHTTP(response, httptest.NewRequest("GET", "/healthz", nil))
			if response.Code != tt.wantStatus {
				t.Fatalf("status = %d; want %d", response.Code, tt.wantStatus)
			}
			var result health
			if err := json.Unmarshal(response.Body.Bytes(), &result); err != nil {
				t.Fatal(err)
			}
			if result.DeploymentSlot != "green" || result.InstanceID != "container-123" {
				t.Fatalf("identity missing: %+v", result)
			}
			if tt.wantStatus == 200 {
				if !result.OK || !result.ActiveRequestsKnown || result.ActiveRequests == nil || *result.ActiveRequests != tt.wantCount {
					t.Fatalf("incorrect healthy observation: %+v", result)
				}
			} else if result.OK || result.ActiveRequestsKnown || result.ActiveRequests != nil {
				t.Fatalf("unknown observation represented as healthy/known/zero: %+v", result)
			}
		})
	}
}

func TestHealthRoutes(t *testing.T) {
	handler := healthHandler{}
	for _, method := range []string{"HEAD", "POST", "PUT", "DELETE", "OPTIONS"} {
		response := httptest.NewRecorder()
		handler.ServeHTTP(response, httptest.NewRequest(method, "/healthz", nil))
		if response.Code != 405 || response.Header().Get("Allow") != "GET" {
			t.Fatalf("%s: status %d, Allow %q", method, response.Code, response.Header().Get("Allow"))
		}
	}
	for _, path := range []string{"/", "/healthz/", "/internal/nginx-status"} {
		response := httptest.NewRecorder()
		handler.ServeHTTP(response, httptest.NewRequest("GET", path, nil))
		if response.Code != 404 {
			t.Fatalf("%s: status %d; want 404", path, response.Code)
		}
	}
}

func TestIdentity(t *testing.T) {
	for _, slot := range []string{"blue", "green"} {
		got, err := identity(slot, "portfolio-host", 123)
		if err != nil || got != "portfolio-host-123" {
			t.Fatalf("identity = %q, %v", got, err)
		}
	}
	for _, slot := range []string{"", "BLUE", "green\n", "other"} {
		if _, err := identity(slot, "host", 1); err == nil {
			t.Fatalf("accepted invalid slot %q", slot)
		}
	}
	for _, host := range []string{"", "bad host", "host\n", "host/name", "host:80"} {
		if _, err := identity("blue", host, 1); err == nil {
			t.Fatalf("accepted invalid hostname %q", host)
		}
	}
	for _, started := range []int64{0, -1} {
		if _, err := identity("blue", "host", started); err == nil {
			t.Fatalf("accepted invalid start timestamp %d", started)
		}
	}
}
