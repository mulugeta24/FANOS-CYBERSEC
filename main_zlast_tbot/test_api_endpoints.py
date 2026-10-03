#!/usr/bin/env python3
"""
Test script to verify all Flask REST API endpoints against PostgreSQL
"""
import requests
import json

BASE_URL = "http://localhost:5000/api"

def test_api():
    print("=" * 60)
    print("  TESTING FLASK API WITH POSTGRESQL BACKEND")
    print("=" * 60)

    # 1. Health check
    print("\n1. Testing GET /api/health...")
    r = requests.get(f"{BASE_URL}/health")
    print(f"   Status: {r.status_code}, Body: {r.json()}")
    assert r.status_code == 200

    # 2. Login
    print("\n2. Testing POST /api/auth/login...")
    r = requests.post(f"{BASE_URL}/auth/login", json={"username": "admin", "password": "admin123"})
    print(f"   Status: {r.status_code}")
    assert r.status_code == 200
    token = r.json()["token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("   Token acquired successfully.")

    # 3. GET /api/stats
    print("\n3. Testing GET /api/stats...")
    r = requests.get(f"{BASE_URL}/stats", headers=headers)
    print(f"   Status: {r.status_code}")
    assert r.status_code == 200
    stats = r.json()
    print(f"   Total checked: {stats.get('total_checked')}, Malicious: {stats.get('malicious_count')}")

    # 4. POST /api/scan
    print("\n4. Testing POST /api/scan (safe URL)...")
    scan_url = "https://en.wikipedia.org/wiki/Computer_security"
    r = requests.post(f"{BASE_URL}/scan", json={"url": scan_url}, headers=headers)
    print(f"   Status: {r.status_code}, Verdict: {r.json().get('final_verdict')}")
    assert r.status_code == 200
    scan_id = r.json().get("scan_id")
    print(f"   Saved scan ID in PostgreSQL: {scan_id}")

    # 5. POST /api/report
    print("\n5. Testing POST /api/report (user feedback)...")
    r = requests.post(f"{BASE_URL}/report", json={
        "url": scan_url,
        "original_verdict": "benign",
        "user_verdict": "benign",
        "scan_id": scan_id,
        "notes": "Verified safe via automated test"
    }, headers=headers)
    print(f"   Status: {r.status_code}")
    assert r.status_code == 200

    # 6. GET /api/scans
    print("\n6. Testing GET /api/scans...")
    r = requests.get(f"{BASE_URL}/scans", headers=headers)
    print(f"   Status: {r.status_code}, Total scans retrieved: {len(r.json())}")
    assert r.status_code == 200
    assert len(r.json()) > 0

    # 7. GET /api/reports
    print("\n7. Testing GET /api/reports...")
    r = requests.get(f"{BASE_URL}/reports", headers=headers)
    print(f"   Status: {r.status_code}, User feedback reports: {len(r.json())}")
    assert r.status_code == 200
    assert len(r.json()) > 0

    # 8. GET /api/admin/status
    print("\n8. Testing GET /api/admin/status...")
    r = requests.get(f"{BASE_URL}/admin/status", headers=headers)
    print(f"   Status: {r.status_code}, DB status: {r.json().get('db_status')}")
    assert r.status_code == 200

    # 9. GET /api/admin/export
    print("\n9. Testing GET /api/admin/export...")
    r = requests.get(f"{BASE_URL}/admin/export", headers=headers)
    print(f"   Status: {r.status_code}, Export content type: {r.headers.get('Content-Type')}")
    assert r.status_code == 200

    print("\n" + "=" * 60)
    print("  ALL API ENDPOINTS TESTED AND VERIFIED SUCCESSFULLY!")
    print("=" * 60)

if __name__ == "__main__":
    test_api()
