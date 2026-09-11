#!/usr/bin/env python3
"""Inspect and configure the VPS-wide Cloudflare Tunnel."""

from __future__ import annotations

import argparse
import json
import os
import urllib.error
import urllib.parse
import urllib.request

API = "https://api.cloudflare.com/client/v4"
TUNNEL_NAME = "shared-edge-vps"
PRODUCTION = "tuannguyenviet.site"


def request(path: str, method: str = "GET", body: dict | None = None) -> dict:
    token = os.environ.get("CF_API_TOKEN")
    if not token:
        raise SystemExit("CF_API_TOKEN is required")
    req = urllib.request.Request(
        API + path,
        data=json.dumps(body).encode() if body is not None else None,
        method=method,
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as response:
            payload = json.load(response)
    except urllib.error.HTTPError as error:
        details = error.read().decode("utf-8", "replace")
        raise SystemExit(f"Cloudflare API {method} {path}: HTTP {error.code}: {details}") from error
    if not payload.get("success"):
        raise SystemExit(f"Cloudflare API {method} {path}: {payload.get('errors')}")
    return payload


def result_list(path: str) -> list[dict]:
    return request(path).get("result", [])


def find_tunnel(account_id: str) -> dict | None:
    query = urllib.parse.urlencode({"is_deleted": "false", "per_page": 100})
    matches = [
        tunnel
        for tunnel in result_list(f"/accounts/{account_id}/cfd_tunnel?{query}")
        if tunnel["name"] == TUNNEL_NAME
    ]
    if len(matches) > 1:
        raise SystemExit(f"multiple active tunnels named {TUNNEL_NAME}")
    return matches[0] if matches else None


def find_dns(zone_id: str, hostname: str) -> list[dict]:
    query = urllib.parse.urlencode({"name": hostname, "per_page": 100})
    return result_list(f"/zones/{zone_id}/dns_records?{query}")


def status(account_id: str, zone_id: str) -> None:
    tunnel = find_tunnel(account_id)
    print(
        json.dumps(
            {
                "tunnel": None
                if tunnel is None
                else {"id": tunnel["id"], "name": tunnel["name"], "status": tunnel.get("status")},
                "production_dns": [
                    {key: record.get(key) for key in ("id", "type", "name", "content", "proxied")}
                    for record in find_dns(zone_id, PRODUCTION)
                ],
            },
            indent=2,
        )
    )


def configure(account_id: str, zone_id: str) -> None:
    tunnel = find_tunnel(account_id)
    if tunnel is None:
        raise SystemExit(f"{TUNNEL_NAME} does not exist; create it through the protected bootstrap process")

    request(
        f"/accounts/{account_id}/cfd_tunnel/{tunnel['id']}/configurations",
        "PUT",
        {
            "config": {
                "ingress": [
                    {"hostname": PRODUCTION, "service": "http://edge-caddy:8080"},
                    {"service": "http_status:404"},
                ],
                "warp-routing": {"enabled": False},
            }
        },
    )

    records = find_dns(zone_id, PRODUCTION)
    if len(records) != 1:
        raise SystemExit(f"expected exactly one production DNS record, found {len(records)}")
    record = records[0]
    expected = f"{tunnel['id']}.cfargotunnel.com"
    if record["type"] != "CNAME" or not record.get("proxied"):
        raise SystemExit("refusing to replace non-proxied or non-CNAME production record")
    if record["content"] != expected:
        request(
            f"/zones/{zone_id}/dns_records/{record['id']}",
            "PUT",
            {"type": "CNAME", "name": PRODUCTION, "content": expected, "proxied": True, "ttl": 1},
        )
    print(f"configured {PRODUCTION} on {TUNNEL_NAME} ({tunnel['id']})")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("action", choices=("status", "configure"))
    parser.add_argument("--account-id", required=True)
    parser.add_argument("--zone-id", required=True)
    args = parser.parse_args()
    if args.action == "status":
        status(args.account_id, args.zone_id)
    else:
        configure(args.account_id, args.zone_id)


if __name__ == "__main__":
    main()
