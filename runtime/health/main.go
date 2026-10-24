// portfolio-runtime supervises nginx and reports conservative drain observations.
package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net"
	"net/http"
	"os"
	"os/exec"
	"os/signal"
	"regexp"
	"strconv"
	"strings"
	"syscall"
	"time"
)

const statusURL = "http://127.0.0.1:8080/internal/nginx-status"

var statusPattern = regexp.MustCompile(`\AActive connections: ([0-9]+) \nserver accepts handled requests\n ([0-9]+) ([0-9]+) ([0-9]+) \nReading: ([0-9]+) Writing: ([0-9]+) Waiting: ([0-9]+) \n\z`)

// parseActiveRequests accepts only the complete nginx stub_status wire format.
// Both the outer proxied health request and this inner status request must be
// present. Idle keepalives remain counted: a conservative drain is safer than
// declaring a slot idle while a client still holds a connection to it.
func parseActiveRequests(body string) (int64, error) {
	match := statusPattern.FindStringSubmatch(body)
	if match == nil {
		return 0, errors.New("invalid nginx status format")
	}
	var counters [7]int64
	for i, value := range match[1:] {
		parsed, err := strconv.ParseInt(value, 10, 64)
		if err != nil {
			return 0, fmt.Errorf("invalid nginx counter: %w", err)
		}
		counters[i] = parsed
	}
	active := counters[0]
	reading, writing, waiting := counters[4], counters[5], counters[6]
	// Subtraction avoids overflow when comparing untrusted counter sums.
	if active < 2 || reading > active || writing > active-reading || waiting != active-reading-writing {
		return 0, errors.New("inconsistent nginx active connections")
	}
	return active - 2, nil
}

type health struct {
	OK                  bool   `json:"ok"`
	DeploymentSlot      string `json:"deployment_slot"`
	InstanceID          string `json:"instance_id"`
	ActiveRequestsKnown bool   `json:"active_requests_known"`
	ActiveRequests      *int64 `json:"active_requests,omitempty"`
}

type healthHandler struct {
	slot       string
	instanceID string
	client     *http.Client
	statusURL  string
}

func (h healthHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Cache-Control", "no-store")
	if r.URL.Path != "/healthz" {
		http.NotFound(w, r)
		return
	}
	if r.Method != http.MethodGet {
		w.Header().Set("Allow", http.MethodGet)
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	observation := health{DeploymentSlot: h.slot, InstanceID: h.instanceID}
	count, err := h.observe(r.Context())
	status := http.StatusOK
	if err != nil {
		// Unknown is never encoded as an invented zero, nor as a healthy result.
		status = http.StatusServiceUnavailable
	} else {
		observation.OK = true
		observation.ActiveRequestsKnown = true
		observation.ActiveRequests = &count
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(observation)
}

func (h healthHandler) observe(ctx context.Context) (int64, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, h.statusURL, nil)
	if err != nil {
		return 0, err
	}
	resp, err := h.client.Do(req)
	if err != nil {
		return 0, err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return 0, fmt.Errorf("nginx status HTTP %d", resp.StatusCode)
	}
	body, err := io.ReadAll(io.LimitReader(resp.Body, 1025))
	if err != nil {
		return 0, err
	}
	if len(body) > 1024 {
		return 0, errors.New("nginx status too large")
	}
	return parseActiveRequests(string(body))
}

func identity(slot, hostname string, started int64) (string, error) {
	if slot != "blue" && slot != "green" {
		return "", errors.New("DEPLOY_SLOT must be blue or green")
	}
	if hostname == "" || strings.ContainsAny(hostname, "\r\n\t /:") || started <= 0 {
		return "", errors.New("invalid runtime instance identity")
	}
	return hostname + "-" + strconv.FormatInt(started, 10), nil
}

func run() int {
	hostname, err := os.Hostname()
	if err != nil {
		log.Print(err)
		return 1
	}
	slot := os.Getenv("DEPLOY_SLOT")
	instanceID, err := identity(slot, hostname, time.Now().UnixNano())
	if err != nil {
		log.Print(err)
		return 1
	}
	listener, err := net.Listen("tcp4", "127.0.0.1:8081")
	if err != nil {
		log.Print(err)
		return 1
	}
	defer listener.Close()
	// No environment proxy and no idle status connections that could pollute
	// the next observation. A probe times out before nginx's proxy deadline.
	transport := &http.Transport{DisableKeepAlives: true, ResponseHeaderTimeout: time.Second}
	defer transport.CloseIdleConnections()
	client := &http.Client{
		Transport: transport,
		Timeout:   1500 * time.Millisecond,
		CheckRedirect: func(_ *http.Request, _ []*http.Request) error {
			return http.ErrUseLastResponse
		},
	}
	server := &http.Server{
		Handler:           healthHandler{slot, instanceID, client, statusURL},
		ReadHeaderTimeout: 2 * time.Second,
		ReadTimeout:       2 * time.Second,
		WriteTimeout:      2 * time.Second,
		IdleTimeout:       2 * time.Second,
		MaxHeaderBytes:    4096,
	}
	defer server.Close()

	signals := make(chan os.Signal, 2)
	signal.Notify(signals, syscall.SIGTERM, syscall.SIGINT, syscall.SIGQUIT)
	defer signal.Stop(signals)
	nginx := exec.Command("nginx", "-g", "daemon off;")
	nginx.Stdout, nginx.Stderr = os.Stdout, os.Stderr
	// The group allows cleanup of any workers orphaned by a crashed master.
	nginx.SysProcAttr = &syscall.SysProcAttr{Setpgid: true}
	if err := nginx.Start(); err != nil {
		log.Print(err)
		return 1
	}
	childExit := make(chan error, 1)
	go func() { childExit <- nginx.Wait() }()
	serverExit := make(chan error, 1)
	go func() { serverExit <- server.Serve(listener) }()

	var shutdown <-chan time.Time
	var timer *time.Timer
	defer func() {
		if timer != nil {
			timer.Stop()
		}
	}()
	failed := false
	stop := func() {
		if timer == nil {
			// SIGTERM means fast shutdown to nginx; translate to its graceful
			// signal instead, retaining the helper until the child is reaped.
			_ = nginx.Process.Signal(syscall.SIGQUIT)
			timer = time.NewTimer(20 * time.Second)
			shutdown = timer.C
		}
	}
	for {
		select {
		case <-signals:
			stop()
		case err := <-serverExit:
			log.Printf("health listener stopped: %v", err)
			failed = true
			stop()
		case <-shutdown:
			_ = syscall.Kill(-nginx.Process.Pid, syscall.SIGKILL)
			shutdown = nil
			failed = true
		case err := <-childExit:
			// nginx normally reaps its workers. If its master died early, kill
			// and reap the adopted group before PID 1 exits, leaving no strays.
			_ = syscall.Kill(-nginx.Process.Pid, syscall.SIGKILL)
			for {
				_, waitErr := syscall.Wait4(-1, nil, 0, nil)
				if errors.Is(waitErr, syscall.EINTR) {
					continue
				}
				if waitErr != nil {
					break
				}
			}
			if err != nil {
				log.Printf("nginx exited: %v", err)
				return 1
			}
			if failed {
				return 1
			}
			return 0
		}
	}
}

func main() {
	os.Exit(run())
}
