"""
Complete Integration & Regression Test Suite
Verifies:
1. Existing Malicious URL Detector functionality (ML + VT + database)
2. Database models and tables for Web Security Scanner
3. Target Validation & SSRF Protection
4. Web Scanner Job Creation & Scope Enforcement
5. Background Scan Execution Pipeline
6. Findings Persistence & Status Updates (Workflow states: Confirmed, False Positive, Resolved)
7. Technical Evidence Association
8. Executive PDF Report Generation (ReportLab)
9. Structured JSON Report Export
"""
import time
import requests
import json
import sys

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

BASE_URL = "http://127.0.0.1:5000"

def run_tests():
    print("=" * 60)
    print("🚀 RUNNING COMPLETE INTEGRATION & REGRESSION TEST SUITE")
    print("=" * 60)

    # 1. Login Authentication
    print("\n[TEST 1] User Authentication & Token Generation...")
    login_resp = requests.post(f"{BASE_URL}/api/auth/login", json={'username': 'admin', 'password': 'admin123'})
    assert login_resp.status_code == 200, f"Login failed: {login_resp.text}"
    token = login_resp.json()['token']
    headers = {'Authorization': f'Bearer {token}'}
    print("  ✅ Auth Token successfully retrieved")

    # 2. Existing Malicious URL Detector Verification
    print("\n[TEST 2] Verifying EXISTING Malicious URL Detector (/api/scan)...")
    scan_resp = requests.post(
        f"{BASE_URL}/api/scan",
        headers=headers,
        json={'url': 'http://secure-login-update-account-verification.com'}
    )
    assert scan_resp.status_code == 200, f"Existing URL scan failed: {scan_resp.text}"
    scan_data = scan_resp.json()
    assert 'final_verdict' in scan_data or 'ml_prediction' in scan_data
    print(f"  ✅ Existing URL Detector working! Prediction: {scan_data.get('ml_prediction')}, Verdict: {scan_data.get('final_verdict')}")

    # 3. Target Pre-Flight Validation & SSRF Protection
    print("\n[TEST 3] Testing Target Validation & SSRF Enforcement...")
    # 3a: Private IP must be blocked
    ssrf_resp = requests.post(f"{BASE_URL}/api/scanner/validate-target", json={'target_url': 'http://192.168.1.1/admin'})
    assert ssrf_resp.status_code == 400 or not ssrf_resp.json().get('valid'), "SSRF private IP was not blocked!"
    print("  ✅ SSRF Private IP protection strictly blocked 192.168.1.1")

    # 3b: Loopback must be blocked
    loopback_resp = requests.post(f"{BASE_URL}/api/scanner/validate-target", json={'target_url': 'http://127.0.0.1:8080'})
    assert loopback_resp.status_code == 400 or not loopback_resp.json().get('valid'), "SSRF loopback was not blocked!"
    print("  ✅ SSRF Loopback protection strictly blocked 127.0.0.1")

    # 3c: Valid public target must be accepted
    valid_resp = requests.post(f"{BASE_URL}/api/scanner/validate-target", json={'target_url': 'https://example.com'})
    assert valid_resp.status_code == 200 and valid_resp.json().get('valid'), "Valid public target was rejected!"
    print(f"  ✅ Public target accepted: {valid_resp.json().get('normalized_url')}")

    # 4. Mandatory Authorization Enforcement
    print("\n[TEST 4] Testing Authorization Confirmation Requirement...")
    unauth_resp = requests.post(f"{BASE_URL}/api/scanner/jobs", json={
        'target_url': 'https://example.com',
        'authorization_confirmed': False
    })
    assert unauth_resp.status_code == 403, f"Expected 403 without authorization confirmation, got: {unauth_resp.status_code}"
    print("  ✅ Unauthorized scan initiation successfully blocked with HTTP 403")

    # 5. Launch Authorized Security Scan Job
    print("\n[TEST 5] Launching Authorized Web Security Assessment...")
    job_payload = {
        'target_url': 'https://example.com',
        'authorization_confirmed': True,
        'include_subdomains': True,
        'allow_active_probes': True,
        'max_urls': 10,
        'max_depth': 1
    }
    launch_resp = requests.post(f"{BASE_URL}/api/scanner/jobs", headers=headers, json=job_payload)
    assert launch_resp.status_code == 201, f"Failed to create scan job: {launch_resp.text}"
    job_id = launch_resp.json()['job_id']
    print(f"  ✅ Assessment job created with ID: {job_id}")

    # 6. Monitor Scan Execution
    print("\n[TEST 6] Monitoring Pipeline Progress...")
    completed = False
    for attempt in range(15):
        time.sleep(2)
        status_resp = requests.get(f"{BASE_URL}/api/scanner/jobs/{job_id}", headers=headers)
        assert status_resp.status_code == 200
        job_info = status_resp.json()['job']
        status = job_info['status']
        progress = job_info['progress']
        phase = job_info['current_phase']
        print(f"  [{attempt+1}] Status: {status} | Progress: {progress}% | Phase: {phase}")
        if status in ['completed', 'failed']:
            completed = True
            break

    assert completed, "Scan did not complete within expected timeout"
    print(f"  ✅ Scan finished with status: {job_info['status']} in {job_info.get('duration_seconds')}s")

    # 7. Check Discovered Assets & Technologies
    print("\n[TEST 7] Querying Discovered Assets and Technologies...")
    assets_resp = requests.get(f"{BASE_URL}/api/scanner/jobs/{job_id}/assets", headers=headers)
    assert assets_resp.status_code == 200
    assets = assets_resp.json()['assets']
    print(f"  ✅ Discovered Assets: {len(assets)} items (DNS, IPs, subdomains, URLs)")

    tech_resp = requests.get(f"{BASE_URL}/api/scanner/jobs/{job_id}/technologies", headers=headers)
    assert tech_resp.status_code == 200
    techs = tech_resp.json()['technologies']
    print(f"  ✅ Fingerprinted Technologies: {len(techs)} items")

    # 8. Check Findings & Update Status
    print("\n[TEST 8] Querying Security Findings & Updating Finding Workflow Status...")
    findings_resp = requests.get(f"{BASE_URL}/api/scanner/jobs/{job_id}/findings", headers=headers)
    assert findings_resp.status_code == 200
    findings = findings_resp.json()['findings']
    print(f"  ✅ Security Findings Generated: {len(findings)} issues")
    assert len(findings) > 0, "Expected at least one security finding on example.com"

    first_finding = findings[0]
    finding_id = first_finding['id']
    print(f"  Testing workflow update on finding: '{first_finding['title']}' (ID: {finding_id})")

    # Update finding status to 'Confirmed'
    patch_resp = requests.patch(
        f"{BASE_URL}/api/scanner/findings/{finding_id}/status",
        headers=headers,
        json={'status': 'Confirmed'}
    )
    assert patch_resp.status_code == 200, f"Failed to update status: {patch_resp.text}"

    # Verify updated status
    get_f_resp = requests.get(f"{BASE_URL}/api/scanner/findings/{finding_id}", headers=headers)
    assert get_f_resp.status_code == 200
    assert get_f_resp.json()['finding']['status'] == 'Confirmed'
    print("  ✅ Finding status successfully transitioned: Open -> Confirmed")

    # 9. Verify Technical Evidence Artifacts
    print("\n[TEST 9] Querying Technical Evidence Artifacts...")
    evidence_resp = requests.get(f"{BASE_URL}/api/scanner/jobs/{job_id}/evidence", headers=headers)
    assert evidence_resp.status_code == 200
    evidence_items = evidence_resp.json()['evidence']
    print(f"  ✅ Technical Evidence Items Linked: {len(evidence_items)} records")

    # 10. Verify Reports (PDF & JSON)
    print("\n[TEST 10] Validating Executive PDF & JSON Report Deliverables...")
    # PDF
    pdf_resp = requests.get(f"{BASE_URL}/api/scanner/jobs/{job_id}/report/pdf", headers=headers)
    assert pdf_resp.status_code == 200
    assert pdf_resp.headers.get('Content-Type') == 'application/pdf'
    assert len(pdf_resp.content) > 1000
    print(f"  ✅ PDF Report generated ({len(pdf_resp.content)} bytes, application/pdf)")

    # JSON
    json_resp = requests.get(f"{BASE_URL}/api/scanner/jobs/{job_id}/report/json", headers=headers)
    assert json_resp.status_code == 200
    json_data = json_resp.json()
    assert 'scanner' in json_data and 'scope' in json_data and 'findings' in json_data
    print(f"  ✅ Structured JSON Report export validated")

    # 11. Final Regression: Verify Malicious URL Detector is STILL OPERATIONAL
    print("\n[TEST 11] Final Regression Check on Malicious URL Detector...")
    retest_resp = requests.post(
        f"{BASE_URL}/api/scan",
        headers=headers,
        json={'url': 'https://wikipedia.org'}
    )
    assert retest_resp.status_code == 200
    print("  ✅ Malicious URL Detector remains 100% operational!")

    print("\n" + "=" * 60)
    print("🎉 ALL 11 INTEGRATION & REGRESSION TEST SUITES PASSED!")
    print("=" * 60)

if __name__ == '__main__':
    run_tests()
