"""
API Blueprint for Enterprise Web Security Scanner
Provides RESTful endpoints for initiating, monitoring, managing, and exporting web security assessments.
"""
import uuid
import logging
from flask import Blueprint, request, jsonify, send_file, current_app
import jwt

from scanner.models import (
    create_scan_job, get_scan_job, list_scan_jobs, update_scan_job,
    get_scan_assets, get_scan_urls, get_scan_endpoints, get_scan_technologies,
    get_scan_findings, get_finding_by_id, update_finding_status, get_scan_evidence
)
from scanner.target_validation.validator import validate_target, extract_domain
from scanner.orchestration.scanner_orchestrator import launch_scan_job_async, cancel_job_execution
from scanner.reporting.pdf_report import generate_pdf_report
from scanner.reporting.json_report import generate_json_report

log = logging.getLogger(__name__)

scanner_bp = Blueprint('scanner_api', __name__)

def get_current_user_optional():
    """Extracts username and admin status from Authorization header if present, else defaults to 'authorized_user'."""
    token = request.headers.get('Authorization')
    if not token:
        return {'username': 'authorized_operator', 'is_admin': False, 'user_id': 1}
    
    try:
        if token.startswith('Bearer '):
            token = token.split(' ')[1]
        secret = current_app.config.get('SECRET_KEY', 'default-jwt-secret-key-change-in-production')
        data = jwt.decode(token, secret, algorithms=['HS256'])
        return {
            'username': data.get('username', 'authorized_operator'),
            'is_admin': data.get('is_admin', False),
            'user_id': data.get('user_id', 1)
        }
    except Exception:
        return {'username': 'authorized_operator', 'is_admin': False, 'user_id': 1}

# ============================================================================
# Target Validation Helper Endpoint
# ============================================================================

@scanner_bp.route('/validate-target', methods=['POST'])
def check_target():
    """Pre-validates a target URL and checks SSRF restrictions before scan initiation."""
    data = request.get_json() or {}
    target_url = data.get('target_url', '').strip()
    allow_private = data.get('allow_private', False)

    if not target_url:
        return jsonify({'valid': False, 'error': 'Target URL is required'}), 400

    result = validate_target(target_url, allow_private=allow_private)
    return jsonify(result), (200 if result['valid'] else 400)

# ============================================================================
# Scan Job Lifecycle Endpoints
# ============================================================================

@scanner_bp.route('/jobs', methods=['POST'])
def start_scan():
    """Initiates a new enterprise web security assessment."""
    user = get_current_user_optional()
    data = request.get_json() or {}

    target_url = data.get('target_url', '').strip()
    auth_confirmed = data.get('authorization_confirmed', False)

    if not target_url:
        return jsonify({'error': 'Target URL is required'}), 400

    # Authorization Check (Mandatory requirement)
    if not auth_confirmed:
        return jsonify({
            'error': 'Authorization confirmation required. You must certify that you own or are explicitly authorized to test this target.'
        }), 403

    allow_private = data.get('allow_private', False)
    
    # Pre-validate target
    val = validate_target(target_url, allow_private=allow_private)
    if not val['valid']:
        return jsonify({'error': val.get('error', 'Target URL failed validation or SSRF checks')}), 400

    normalized_url = val['normalized_url']
    target_domain = val['domain']

    # Build Scope Configuration
    scope_config = {
        'allowed_domains': data.get('allowed_domains', [target_domain]),
        'excluded_domains': data.get('excluded_domains', []),
        'excluded_paths': data.get('excluded_paths', []),
        'include_subdomains': data.get('include_subdomains', True),
        'max_urls': min(int(data.get('max_urls', 30)), 100),
        'max_depth': min(int(data.get('max_depth', 2)), 4),
        'allow_active_probes': data.get('allow_active_probes', True),
        'allow_private': allow_private
    }

    job_id = f"scan_{uuid.uuid4().hex[:12]}"
    authorized_by = user.get('username', 'authorized_operator')

    # Persist Job in PostgreSQL
    job = create_scan_job(
        job_id=job_id,
        user_id=user.get('user_id', 1),
        target_url=normalized_url,
        target_domain=target_domain,
        scope_config=scope_config,
        authorized_by=authorized_by
    )

    if not job:
        return jsonify({'error': 'Failed to initialize database scan job'}), 500

    # Launch background scan pipeline
    launch_scan_job_async(
        job_id=job_id,
        target_url=normalized_url,
        scope_config=scope_config,
        allow_private=allow_private
    )

    return jsonify({
        'message': 'Web Security Assessment initiated successfully',
        'job_id': job_id,
        'job': job
    }), 201

@scanner_bp.route('/jobs', methods=['GET'])
def list_scans():
    """Lists recent web scanner jobs."""
    user = get_current_user_optional()
    limit = min(int(request.args.get('limit', 50)), 100)
    jobs = list_scan_jobs(user_id=None, limit=limit)
    return jsonify({'jobs': jobs}), 200

@scanner_bp.route('/jobs/<job_id>', methods=['GET'])
def get_scan(job_id):
    """Retrieves current status, progress, and statistics for a specific scan."""
    job = get_scan_job(job_id)
    if not job:
        return jsonify({'error': 'Scan job not found'}), 404
    return jsonify({'job': job}), 200

@scanner_bp.route('/jobs/<job_id>/cancel', methods=['POST'])
def cancel_scan(job_id):
    """Cancels an in-progress scan."""
    job = get_scan_job(job_id)
    if not job:
        return jsonify({'error': 'Scan job not found'}), 404
    
    if job.get('status') in ['completed', 'failed', 'cancelled']:
        return jsonify({'message': f"Scan is already {job.get('status')}"}), 200

    cancel_job_execution(job_id)
    return jsonify({'message': 'Scan cancellation signal sent'}), 200

# ============================================================================
# Asset & Discovery Endpoints
# ============================================================================

@scanner_bp.route('/jobs/<job_id>/assets', methods=['GET'])
def get_assets(job_id):
    """Retrieves all discovered assets (DNS, IPs, subdomains, open ports)."""
    asset_type = request.args.get('type')
    assets = get_scan_assets(job_id, asset_type=asset_type)
    return jsonify({'job_id': job_id, 'assets': assets, 'count': len(assets)}), 200

@scanner_bp.route('/jobs/<job_id>/technologies', methods=['GET'])
def get_technologies(job_id):
    """Retrieves fingerprinted web technologies for a scan."""
    techs = get_scan_technologies(job_id)
    return jsonify({'job_id': job_id, 'technologies': techs, 'count': len(techs)}), 200

@scanner_bp.route('/jobs/<job_id>/urls', methods=['GET'])
def get_urls(job_id):
    """Retrieves crawled URLs and response codes."""
    urls = get_scan_urls(job_id)
    return jsonify({'job_id': job_id, 'urls': urls, 'count': len(urls)}), 200

@scanner_bp.route('/jobs/<job_id>/endpoints', methods=['GET'])
def get_endpoints(job_id):
    """Retrieves discovered API routes."""
    endpoints = get_scan_endpoints(job_id)
    return jsonify({'job_id': job_id, 'endpoints': endpoints, 'count': len(endpoints)}), 200

# ============================================================================
# Findings & Evidence Endpoints
# ============================================================================

@scanner_bp.route('/jobs/<job_id>/findings', methods=['GET'])
def get_findings(job_id):
    """Retrieves security assessment findings with optional filters."""
    severity = request.args.get('severity')
    status = request.args.get('status')
    category = request.args.get('category')

    findings = get_scan_findings(job_id, severity=severity, status=status, category=category)
    return jsonify({'job_id': job_id, 'findings': findings, 'count': len(findings)}), 200

@scanner_bp.route('/findings/<finding_id>', methods=['GET'])
def get_finding(finding_id):
    """Retrieves full technical details, impact, remediation, and evidence for a finding."""
    finding = get_finding_by_id(finding_id)
    if not finding:
        return jsonify({'error': 'Finding not found'}), 404
    return jsonify({'finding': finding}), 200

@scanner_bp.route('/findings/<finding_id>/status', methods=['PATCH'])
def set_finding_status(finding_id):
    """Updates the workflow status of a finding (e.g., Confirmed, False Positive, Resolved)."""
    data = request.get_json() or {}
    new_status = data.get('status')
    if not new_status:
        return jsonify({'error': 'Status field is required'}), 400

    try:
        updated = update_finding_status(finding_id, new_status)
        if not updated:
            return jsonify({'error': 'Finding not found'}), 404
        return jsonify({'message': f'Finding status updated to {new_status}', 'status': new_status}), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400

@scanner_bp.route('/jobs/<job_id>/evidence', methods=['GET'])
def get_evidence(job_id):
    """Retrieves non-sensitive technical evidence items for a job."""
    finding_id = request.args.get('finding_id')
    evidence_items = get_scan_evidence(job_id, finding_id=finding_id)
    return jsonify({'job_id': job_id, 'evidence': evidence_items, 'count': len(evidence_items)}), 200

# ============================================================================
# Report Generation Endpoints
# ============================================================================

@scanner_bp.route('/jobs/<job_id>/report/json', methods=['GET'])
def export_json(job_id):
    """Exports structured JSON report."""
    job = get_scan_job(job_id)
    if not job:
        return jsonify({'error': 'Scan job not found'}), 404

    assets = get_scan_assets(job_id)
    technologies = get_scan_technologies(job_id)
    urls = get_scan_urls(job_id)
    endpoints = get_scan_endpoints(job_id)
    findings = get_scan_findings(job_id)

    report_data = generate_json_report(job, assets, technologies, urls, endpoints, findings)
    return jsonify(report_data), 200

@scanner_bp.route('/jobs/<job_id>/report/pdf', methods=['GET'])
def export_pdf(job_id):
    """Generates and downloads professional PDF security assessment report."""
    job = get_scan_job(job_id)
    if not job:
        return jsonify({'error': 'Scan job not found'}), 404

    assets = get_scan_assets(job_id)
    technologies = get_scan_technologies(job_id)
    urls = get_scan_urls(job_id)
    findings = get_scan_findings(job_id)

    pdf_buffer = generate_pdf_report(job, assets, technologies, urls, findings)
    filename = f"fanos_security_assessment_{job.get('target_domain', 'target')}_{job_id[:8]}.pdf"

    return send_file(
        pdf_buffer,
        as_attachment=True,
        download_name=filename,
        mimetype='application/pdf'
    )
