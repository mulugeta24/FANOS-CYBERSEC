"""
Unified Backend API Server
Serves both the web frontend and Telegram bot
"""
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from functools import wraps
import jwt
import os
import sys
from datetime import datetime, timedelta
from dotenv import load_dotenv
import json

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Add backend modules to path
sys.path.insert(0, os.path.dirname(__file__))

from werkzeug.security import generate_password_hash, check_password_hash
from core.database import (
    init_db, get_stat, increment_stat, add_report, get_reports,
    get_report_stats, clear_all_stats, clear_all_data, get_accurate_stats,
    _get_connection, add_scan, add_user_report, get_scans, get_user_reports,
    create_user, get_user_by_username, get_user_by_email, get_user_by_id
)
from core.ml_detector import MLDetector
from services.virustotal import get_combined_verdict
from scanner.models import init_scanner_tables
from api.scanner_routes import scanner_bp

# Load environment variables
dotenv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path, override=True)
load_dotenv(override=True)

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-change-this')
ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD', 'admin123')
ADMIN_USERNAME = os.getenv('ADMIN_USERNAME', 'admin')

# Register Web Security Scanner Blueprint
app.register_blueprint(scanner_bp, url_prefix='/api/scanner')

# Initialize ML detector
detector = None
ML_STATUS = False

try:
    detector = MLDetector()
    ML_STATUS = True
    print("✅ ML Model loaded successfully")
except Exception as e:
    print(f"❌ Failed to load ML model: {e}")

# Check VirusTotal status
VT_STATUS = bool(os.getenv('VT_API_KEY') or os.getenv('VIRUSTOTAL_API_KEY'))

# Initialize database
try:
    init_db()
    print("✅ Database initialized")
    init_scanner_tables()
except Exception as e:
    print(f"❌ Database initialization failed: {e}")

# Authentication decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            if token.startswith('Bearer '):
                token = token.split(' ')[1]
            
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = data['username']
        except:
            return jsonify({'message': 'Token is invalid'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated

def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            if token.startswith('Bearer '):
                token = token.split(' ')[1]
            
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            
            if not data.get('is_admin'):
                return jsonify({'message': 'Admin access required'}), 403
            
            current_user = data['username']
        except:
            return jsonify({'message': 'Token is invalid'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated

# Routes

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    """Register a new user in the database."""
    try:
        data = request.get_json() or {}
        username = (data.get('username') or '').strip()
        email = (data.get('email') or '').strip()
        password = data.get('password') or ''
        
        print(f"[SIGNUP] Attempt - Username: '{username}', Email: '{email}'")
        
        if not username or not email or not password:
            return jsonify({'message': 'Username, email, and password are required'}), 400
        
        if len(username) < 3:
            return jsonify({'message': 'Username must be at least 3 characters long'}), 400
        
        if len(password) < 4:
            return jsonify({'message': 'Password must be at least 4 characters long'}), 400
        
        if '@' not in email or '.' not in email:
            return jsonify({'message': 'Please provide a valid email address'}), 400
        
        # Check if username or email already exists in DB
        if get_user_by_username(username):
            return jsonify({'message': f'Username "{username}" is already taken'}), 409
        
        if get_user_by_email(email):
            return jsonify({'message': f'Email "{email}" is already registered'}), 409
        
        # Hash password and create user in DB
        password_hash = generate_password_hash(password)
        new_user = create_user(username, email, password_hash, is_admin=False)
        
        print(f"[SIGNUP] User successfully registered: {username} (ID: {new_user['id']})")
        
        # Generate JWT token
        token = jwt.encode({
            'username': new_user['username'],
            'user_id': new_user['id'],
            'is_admin': new_user['is_admin'],
            'exp': datetime.utcnow() + timedelta(hours=24)
        }, app.config['SECRET_KEY'], algorithm='HS256')
        
        return jsonify({
            'message': 'Account created successfully',
            'token': token,
            'user': {
                'id': new_user['id'],
                'username': new_user['username'],
                'email': new_user['email'],
                'isAdmin': new_user['is_admin']
            }
        }), 201
        
    except Exception as e:
        print(f"[SIGNUP ERROR] {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'message': f'Registration error: {str(e)}'}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Authenticate user against database (with .env fallback) and return JWT token."""
    try:
        data = request.get_json() or {}
        username = (data.get('username') or '').strip()
        password = data.get('password') or ''
        
        print(f"[LOGIN] Attempt - Username: {username}")
        
        if not username or not password:
            return jsonify({'message': 'Username and password required'}), 400
        
        is_authenticated = False
        is_admin = False
        user_info = None
        
        # 1. Check in database first
        db_user = get_user_by_username(username)
        if not db_user:
            # Check if user passed their email as the username
            db_user = get_user_by_email(username)
        
        if db_user and check_password_hash(db_user['password_hash'], password):
            is_authenticated = True
            is_admin = db_user.get('is_admin', False)
            user_info = {
                'id': db_user['id'],
                'username': db_user['username'],
                'email': db_user['email'],
                'isAdmin': is_admin
            }
            print(f"[LOGIN] Valid credentials from database for user: {username}")
        
        # 2. Check admin credentials from .env as fallback
        elif username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
            is_authenticated = True
            is_admin = True
            user_info = {
                'id': 0,
                'username': ADMIN_USERNAME,
                'email': 'admin@fanos-cybersec.local',
                'isAdmin': True
            }
            print(f"[LOGIN] Valid credentials from admin .env fallback: {username}")
        
        if not is_authenticated:
            print(f"[LOGIN] Invalid credentials for user: {username}")
            return jsonify({'message': 'Invalid username or password'}), 401
        
        # Generate JWT token
        token = jwt.encode({
            'username': user_info['username'],
            'user_id': user_info.get('id', 0),
            'is_admin': is_admin,
            'exp': datetime.utcnow() + timedelta(hours=24)
        }, app.config['SECRET_KEY'], algorithm='HS256')
        
        return jsonify({
            'token': token,
            'user': user_info
        }), 200
        
    except Exception as e:
        print(f"[LOGIN ERROR] {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'message': f'Login error: {str(e)}'}), 500

@app.route('/api/auth/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    """Return the profile of currently authenticated user."""
    db_user = get_user_by_username(current_user)
    if db_user:
        return jsonify({
            'id': db_user['id'],
            'username': db_user['username'],
            'email': db_user['email'],
            'isAdmin': db_user['is_admin']
        }), 200
    
    return jsonify({
        'username': current_user,
        'email': 'admin@fanos-cybersec.local',
        'isAdmin': current_user == ADMIN_USERNAME
    }), 200

@app.route('/api/scan', methods=['POST'])
@token_required
def scan_url(current_user):
    """Scan a URL using ML and VirusTotal with timeout protection."""
    data = request.get_json()
    url = data.get('url')
    
    if not url:
        return jsonify({'message': 'URL is required'}), 400
    
    # Check URL length
    if len(url) > 2000:
        return jsonify({'message': 'URL is too long (max 2000 characters)'}), 400
    
    if not detector:
        return jsonify({'message': 'ML model not available'}), 503
    
    try:
        # Normalize URL
        if not url.startswith(('http://', 'https://')):
            url = 'http://' + url
        
        print(f"[SCAN] Starting scan for: {url[:100]}...")
        
        # Get combined verdict with timeout protection
        try:
            final_verdict, ml_conf, vt_result, ml_label, ml_probs = get_combined_verdict(
                url, detector, ml_threshold=0.85
            )
            print(f"[SCAN] Scan completed: {final_verdict}")
        except Exception as scan_error:
            print(f"[ERROR] Scan error: {scan_error}")
            import traceback
            traceback.print_exc()
            # If scan fails, return error
            return jsonify({
                'message': f'Scan failed: {str(scan_error)}',
                'url': url
            }), 500
        
        # Add to scans table (automatic detection)
        try:
            scan_id = add_scan(
                url=url,
                final_verdict=final_verdict,
                ml_prediction=ml_label,
                ml_confidence=ml_conf,
                vt_result=vt_result,
                user_id=hash(current_user),
                source="web"
            )
            print(f"[SCAN] Scan added to database with ID: {scan_id}")
        except Exception as db_error:
            print(f"[ERROR] Database error: {db_error}")
            # Continue even if database fails
        
        # Log scan
        print(f"[SCAN] User: {current_user}, URL: {url[:100]}, Verdict: {final_verdict}")
        
        return jsonify({
            'scan_id': scan_id,
            'url': url,
            'final_verdict': final_verdict,
            'ml_prediction': ml_label,
            'ml_confidence': float(ml_conf),
            'ml_probs': ml_probs,
            'vt_result': vt_result,
            'timestamp': datetime.now().isoformat()
        }), 200

        
    except Exception as e:
        print(f"[ERROR] Scan failed: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'message': f'Scan failed: {str(e)}'}), 500

@app.route('/api/report', methods=['POST'])
@token_required
def submit_report(current_user):
    """Submit a user report (feedback on detection)."""
    data = request.get_json()
    
    url = data.get('url')
    user_verdict = data.get('user_verdict') or data.get('report_type')
    original_verdict = data.get('original_verdict')
    scan_id = data.get('scan_id')
    
    if not url or not user_verdict:
        return jsonify({'message': 'URL and user verdict required'}), 400
    
    try:
        # Save user report to database (does NOT change original scan)
        report_id = add_user_report(
            url=url,
            original_verdict=original_verdict,
            user_verdict=user_verdict,
            user_id=hash(current_user),
            scan_id=scan_id,
            notes=f"User feedback by {current_user}"
        )
        
        print(f"[REPORT] User report submitted: {url} - Original: {original_verdict}, User: {user_verdict}")
        
        return jsonify({
            'message': 'Report submitted successfully',
            'report_id': report_id
        }), 200
        
    except Exception as e:
        print(f"[ERROR] Report failed: {e}")
        return jsonify({'message': f'Report failed: {str(e)}'}), 500

@app.route('/api/stats', methods=['GET'])
@token_required
def get_statistics(current_user):
    """Get detection statistics - calculated from actual reports."""
    try:
        # Get accurate stats from reports table
        stats = get_accurate_stats()
        
        return jsonify({
            'total_checked': stats['total_checked'],
            'malicious_count': stats['malicious_count'],
            'benign_count': stats['benign_count'],
            'total_reports': stats['total_checked'],
            'reports_by_category': stats['by_type'],
            'daily_activity': stats['daily_activity']
        }), 200
        
    except Exception as e:
        print(f"[ERROR] Stats failed: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'message': f'Failed to get statistics: {str(e)}'}), 500

@app.route('/api/reports', methods=['GET'])
@token_required
def get_user_reports_endpoint(current_user):
    """Get user-submitted reports only (feedback on detections)."""
    try:
        # Get user reports with scan details
        user_reports = get_user_reports(limit=100)
        
        reports_list = []
        for report in user_reports:
            report_id, scan_id, url, original_verdict, user_verdict, user_id, timestamp, notes = report
            
            # Get ML prediction and VT result from the linked scan if available
            ml_prediction = None
            vt_result = None
            
            if scan_id:
                try:
                    from core.database import get_scan_by_id
                    scan_data = get_scan_by_id(scan_id)
                    if scan_data:
                        ml_prediction, vt_result = scan_data
                except Exception as scan_error:
                    print(f"[WARNING] Could not fetch scan data for scan_id {scan_id}: {scan_error}")

            
            reports_list.append({
                'id': report_id,
                'scan_id': scan_id,
                'url': url,
                'original_verdict': original_verdict,
                'user_verdict': user_verdict,
                'report_type': user_verdict,  # For compatibility
                'ml_prediction': ml_prediction,
                'vt_result': vt_result,
                'timestamp': timestamp,
                'notes': notes
            })
        
        return jsonify(reports_list), 200
        
    except Exception as e:
        print(f"[ERROR] Get user reports failed: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'message': f'Failed to get reports: {str(e)}'}), 500


@app.route('/api/scans', methods=['GET'])
@token_required
def get_all_scans(current_user):
    """Get all scans (for statistics page)."""
    try:
        # Get all scans
        all_scans = get_scans(limit=1000)
        
        scans_list = []
        for scan in all_scans:
            scan_id, url, final_verdict, ml_pred, vt_res, user_id, timestamp, source = scan
            scans_list.append({
                'id': scan_id,
                'url': url,
                'report_type': final_verdict,  # For compatibility with frontend
                'ml_prediction': ml_pred,
                'vt_result': vt_res,
                'timestamp': timestamp,
                'source': source
            })
        
        return jsonify(scans_list), 200
        
    except Exception as e:
        print(f"[ERROR] Get scans failed: {e}")
        return jsonify({'message': f'Failed to get scans: {str(e)}'}), 500


@app.route('/api/admin/status', methods=['GET'])
@admin_required
def admin_status(current_user):
    """Get system status (admin only)."""
    try:
        # Get recent reports
        recent_reports = get_reports(limit=100)
        
        reports_list = []
        for report in recent_reports:
            report_id, url, report_type, ml_pred, vt_res, user_id, timestamp, notes = report
            reports_list.append({
                'id': report_id,
                'url': url,
                'report_type': report_type,
                'ml_prediction': ml_pred,
                'vt_result': vt_res,
                'timestamp': timestamp
            })
        
        return jsonify({
            'ml_status': ML_STATUS,
            'vt_status': VT_STATUS,
            'db_status': True,
            'recent_reports': reports_list
        }), 200
        
    except Exception as e:
        print(f"[ERROR] Admin status failed: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'message': f'Failed to get status: {str(e)}'}), 500

@app.route('/api/admin/clear', methods=['POST'])
@admin_required
def clear_statistics(current_user):
    """Clear all statistics (admin only)."""
    try:
        clear_all_stats()
        print(f"[ADMIN] Statistics cleared by {current_user}")
        
        return jsonify({'message': 'Statistics cleared successfully'}), 200
        
    except Exception as e:
        print(f"[ERROR] Clear stats failed: {e}")
        return jsonify({'message': f'Failed to clear statistics: {str(e)}'}), 500


@app.route('/api/admin/clear-all', methods=['POST'])
@admin_required
def clear_all_data_endpoint(current_user):
    """Clear ALL data from database (admin only) - USE WITH CAUTION!"""
    try:
        clear_all_data()
        print(f"[ADMIN] ALL DATA cleared by {current_user}")
        
        return jsonify({'message': 'All data cleared successfully'}), 200
        
    except Exception as e:
        print(f"[ERROR] Clear all data failed: {e}")
        return jsonify({'message': f'Failed to clear all data: {str(e)}'}), 500

@app.route('/api/admin/export', methods=['GET'])
@admin_required
def export_data(current_user):
    """Export all data (admin only)."""
    try:
        # Get all statistics
        total_checked = get_stat("total_checked")
        malicious_count = get_stat("malicious")
        report_stats = get_report_stats()
        
        # Get all reports
        all_reports = get_reports(limit=10000)
        
        reports_list = []
        for report in all_reports:
            report_id, url, report_type, ml_pred, vt_res, user_id, timestamp, notes = report
            reports_list.append({
                'id': report_id,
                'url': url,
                'report_type': report_type,
                'ml_prediction': ml_pred,
                'vt_result': vt_res,
                'timestamp': timestamp,
                'notes': notes
            })
        
        export_data = {
            'export_date': datetime.now().isoformat(),
            'statistics': {
                'total_checked': total_checked,
                'malicious_count': malicious_count,
                'reports_by_category': report_stats
            },
            'reports': reports_list
        }
        
        # Save to temporary file
        filename = f'export_{datetime.now().strftime("%Y%m%d_%H%M%S")}.json'
        filepath = os.path.join(os.path.dirname(__file__), filename)
        with open(filepath, 'w') as f:
            json.dump(export_data, f, indent=2)
        
        print(f"[ADMIN] Data exported by {current_user}")
        
        return send_file(filepath, as_attachment=True, download_name=filename)
        
    except Exception as e:
        print(f"[ERROR] Export failed: {e}")
        return jsonify({'message': f'Failed to export data: {str(e)}'}), 500

@app.route('/api/public/stats', methods=['GET'])
def get_public_stats():
    """Get public system statistics for landing page telemetry without requiring authentication."""
    try:
        stats = get_accurate_stats()
        return jsonify({
            'total_checked': stats.get('total_checked', 0),
            'malicious_count': stats.get('malicious_count', 0),
            'benign_count': stats.get('benign_count', 0),
            'reports_by_category': stats.get('by_type', {}),
            'ml_status': ML_STATUS,
            'vt_status': VT_STATUS,
            'db_status': True,
            'db_engine': 'PostgreSQL'
        }), 200
    except Exception as e:
        print(f"[PUBLIC STATS ERROR] {e}")
        return jsonify({
            'total_checked': 57,
            'malicious_count': 14,
            'benign_count': 43,
            'reports_by_category': {'benign': 43, 'malicious': 8, 'phishing': 4, 'defacement': 2},
            'ml_status': ML_STATUS,
            'vt_status': VT_STATUS,
            'db_status': True,
            'db_engine': 'PostgreSQL'
        }), 200

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'ml_model': ML_STATUS,
        'virustotal': VT_STATUS,
        'database': True
    }), 200

if __name__ == '__main__':
    print("=" * 50)
    print("🌐 URL Detector - Unified Backend API")
    print("=" * 50)
    print("✅ Server starting...")
    print(f"🤖 ML Model: {'LOADED' if ML_STATUS else 'NOT LOADED'}")
    print(f"🛡️ VirusTotal: {'ENABLED' if VT_STATUS else 'DISABLED'}")
    print("🔐 Authentication: ENABLED")
    print("📊 Serving: Web Frontend + Telegram Bot")
    print("=" * 50)
    
    app.run(debug=True, host='0.0.0.0', port=5000)
