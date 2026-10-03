"""
Telegram Bot for URL Detection
Uses the unified backend API and database
Production-ready with rate limiting, error handling, and proper logging
"""
import os
import sys
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

import logging
import time
from collections import defaultdict
from dotenv import load_dotenv
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.error import NetworkError, TimedOut
from telegram.ext import (
    ApplicationBuilder, CommandHandler, MessageHandler, 
    filters, ContextTypes, CallbackQueryHandler
)

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from core.database import (
    init_db, add_report, get_reports, get_report_stats, 
    clear_all_stats, get_accurate_stats, add_scan, add_user_report,
    get_scans, get_user_reports
)
from core.ml_detector import MLDetector
from services.virustotal import get_combined_verdict

# Load environment variables
load_dotenv()
TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")

if not TOKEN:
    raise ValueError("TELEGRAM_BOT_TOKEN missing in environment/.env")

# Configure logging
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO,
)
log = logging.getLogger(__name__)

# Initialize ML detector
try:
    detector = MLDetector()
    log.info("✅ ML Model loaded successfully")
except Exception as e:
    log.error(f"❌ Failed to load ML model: {e}")
    detector = None

# Default ML threshold
DEFAULT_ML_THRESHOLD = 0.85
VALID_REPORT_TYPES = {"benign", "malicious", "phishing", "defacement", "suspicious"}
REPORT_FLOW_KEY = "report_flow"

# Store last check results per user for reporting
user_last_check = {}

# Store authenticated users
authenticated_users = set()
authenticated_admins = set()

# Rate limiting - prevent spam
user_rate_limit = defaultdict(list)
RATE_LIMIT_WINDOW = 60  # seconds
RATE_LIMIT_MAX_REQUESTS = 10  # max requests per window

# --- Rate Limiting ---
def check_rate_limit(user_id: int) -> bool:
    """Check if user has exceeded rate limit."""
    now = time.time()
    # Clean old requests
    user_rate_limit[user_id] = [
        req_time for req_time in user_rate_limit[user_id]
        if now - req_time < RATE_LIMIT_WINDOW
    ]
    
    # Check limit
    if len(user_rate_limit[user_id]) >= RATE_LIMIT_MAX_REQUESTS:
        return False
    
    # Add current request
    user_rate_limit[user_id].append(now)
    return True

# --- Authentication ---
def is_admin(user_id: int) -> bool:
    """Check if user is authenticated as admin."""
    return user_id in authenticated_admins

# --- URL normalization ---
def normalize_url(url: str) -> str:
    """Normalize URL by adding http:// if missing."""
    url = (url or "").strip()
    if not url.startswith(("http://", "https://")):
        url = "http://" + url
    return url

# --- URL validation ---
def is_valid_url(url: str) -> bool:
    """Basic URL validation."""
    if not url or len(url) < 3:
        return False
    if len(url) > 2000:  # Too long
        return False
    # Check for basic URL structure
    if not any(c in url for c in ['.', ':', '/']):
        return False
    return True

# --- Handlers ---
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Welcome message and command list."""
    user_id = update.effective_user.id
    username = update.effective_user.username or update.effective_user.first_name
    
    if user_id not in authenticated_users and user_id not in authenticated_admins:
        authenticated_users.add(user_id)
    
    log.info(f"User {username} (ID: {user_id}) started bot")
    
    await update.message.reply_text(
        f"🔎 Malicious URL Detector Bot\n\n"
        f"Welcome, {username}!\n\n"
        "Simply paste a URL to check for threats!\n\n"
        "📋 Commands:\n"
        "/check <url> - Check a URL\n"
        "/stats - View statistics\n"
        "/report - Report incorrect detection for last check\n"
        "/reportlink <url> <type> - Report a link directly\n"
        "/help - Show this message\n"
        "/adminsec - Admin authentication"
    )

async def adminsec_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Admin authentication command."""
    user_id = update.effective_user.id
    username = update.effective_user.username or update.effective_user.first_name
    
    if is_admin(user_id):
        await update.message.reply_text(
            "✅ You are already authenticated as admin!\n\n"
            "Use /admin to access the admin panel."
        )
        return
    
    if not context.args or len(context.args) == 0:
        await update.message.reply_text(
            "🔐 Admin Authentication\n\n"
            "Usage: /adminsec <password>\n\n"
            "Enter the admin password to access admin features."
        )
        return
    
    password = " ".join(context.args)
    admin_password = os.getenv("ADMIN_PASSWORD", "")
    
    if not admin_password:
        await update.message.reply_text(
            "⚠️ Admin authentication is not configured."
        )
        return
    
    if password == admin_password:
        authenticated_admins.add(user_id)
        authenticated_users.add(user_id)
        
        log.info(f"✅ Admin authenticated: {username} (ID: {user_id})")
        
        await update.message.reply_text(
            "✅ Admin Authentication Successful!\n\n"
            f"Welcome, Admin {username}!\n\n"
            "🔧 Admin Commands:\n"
            "/admin - Admin panel\n"
            "/viewreports - View all user reports\n"
            "/viewurls - View recently checked URLs\n"
            "/cleardata - Clear statistics\n"
            "/systeminfo - System information"
        )
    else:
        log.warning(f"❌ Failed admin login attempt: {username} (ID: {user_id})")
        await update.message.reply_text(
            "❌ Authentication Failed\n\n"
            "Incorrect password."
        )

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_user.id
    
    help_text = (
        "📖 Available Commands:\n\n"
        "🔍 URL Checking:\n"
        "/check <url> - Check a URL for threats\n"
        "Or just paste any URL directly!\n\n"
        "📊 Information:\n"
        "/stats - Show detection statistics\n"
        "/report - Report incorrect detection for last check\n"
        "/report <url> <type> - Directly report a link\n"
        "/reportlink <url> <type> - Directly report a link\n"
        "/cancelreport - Cancel direct report flow\n"
        "Types: benign, malicious, phishing, defacement, suspicious\n"
        "/help - Show this message\n\n"
        "🔐 Admin:\n"
        "/adminsec <password> - Admin authentication"
    )
    
    if is_admin(user_id):
        help_text += (
            "\n\n🔧 Admin Commands:\n"
            "/admin - Admin panel\n"
            "/viewreports - View all reports\n"
            "/viewurls - View checked URLs\n"
            "/cleardata - Clear statistics\n"
            "/systeminfo - System info"
        )
    
    await update.message.reply_text(help_text)

async def stats(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Show detection statistics from scans table."""
    try:
        # Get accurate stats from scans table
        stats_data = get_accurate_stats()
        
        total_checked = stats_data['total_checked']
        malicious_count = stats_data['malicious_count']
        benign_count = stats_data['benign_count']
        by_type = stats_data['by_type']
        
        stats_text = [
            "📊 Detection Statistics",
            "━━━━━━━━━━━━━━━━━━━━",
            f"🔍 Total URLs checked: {total_checked}",
            f"🚨 Malicious detections: {malicious_count}",
            f"✅ Safe URLs: {benign_count}",
            "",
            "📝 Breakdown by Type:",
        ]
        
        if by_type:
            emoji_map = {
                'benign': '✅',
                'malicious': '🚨',
                'phishing': '🎣',
                'defacement': '⚠️',
                'suspicious': '⚠️'
            }
            for report_type, count in by_type.items():
                emoji = emoji_map.get(report_type, '📌')
                stats_text.append(f"{emoji} {report_type.title()}: {count}")
        else:
            stats_text.append("No scans yet")
        
        await update.message.reply_text("\n".join(stats_text))
        
    except Exception as e:
        log.exception("Error retrieving stats: %s", e)
        await update.message.reply_text(
            "⚠️ Error retrieving statistics. Please try again later."
        )

async def admin_panel(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Admin panel with management options."""
    user_id = update.effective_user.id
    
    if not is_admin(user_id):
        await update.message.reply_text(
            "❌ Access denied. Use /adminsec <password> to authenticate."
        )
        return
    
    try:
        # Get accurate stats
        stats_data = get_accurate_stats()
        total_checked = stats_data['total_checked']
        malicious_count = stats_data['malicious_count']
        benign_count = stats_data['benign_count']
        
        # Get user reports count
        user_reports = get_user_reports(limit=1000)
        total_user_reports = len(user_reports)
        
        # Get recent scans
        recent_scans = get_scans(limit=5)
        
        admin_text = [
            "🔧 Admin Panel",
            "━━━━━━━━━━━━━━━━━━━━",
            "",
            "📊 System Statistics:",
            f"• Total URLs checked: {total_checked}",
            f"• Malicious detections: {malicious_count}",
            f"• Safe URLs: {benign_count}",
            f"• User feedback reports: {total_user_reports}",
            "",
            "📝 Recent Scans:",
        ]
        
        if recent_scans:
            for scan in recent_scans[:3]:
                scan_id, url, final_verdict, ml_pred, vt_res, user_id_scan, timestamp, source = scan
                short_url = url[:35] + "..." if len(url) > 35 else url
                admin_text.append(f"• {final_verdict.upper()}: {short_url}")
        else:
            admin_text.append("• No scans yet")
        
        admin_text.extend([
            "",
            "🔧 Admin Commands:",
            "/viewreports - View user feedback reports",
            "/viewurls - View recently checked URLs",
            "/systeminfo - System information",
            "/cleardata CONFIRM - Clear statistics"
        ])
        
        await update.message.reply_text("\n".join(admin_text))
        
    except Exception as e:
        log.exception("Error in admin panel: %s", e)
        await update.message.reply_text(
            "⚠️ Error loading admin panel. Please try again."
        )

async def view_reports(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """View user feedback reports (admin only)."""
    user_id = update.effective_user.id
    
    if not is_admin(user_id):
        await update.message.reply_text(
            "❌ Access denied. Use /adminsec <password> to authenticate."
        )
        return
    
    try:
        limit = 10
        if context.args and context.args[0].isdigit():
            limit = min(int(context.args[0]), 50)
        
        # Get user reports (feedback)
        user_reports = get_user_reports(limit=limit)
        
        if not user_reports:
            await update.message.reply_text(
                "📝 No user feedback reports found."
            )
            return
        
        report_text = [
            f"📝 User Feedback Reports (Last {len(user_reports)})",
            "━━━━━━━━━━━━━━━━━━━━",
            ""
        ]
        
        emoji_map = {
            'benign': '✅',
            'malicious': '🚨',
            'phishing': '🎣',
            'defacement': '⚠️',
            'suspicious': '⚠️'
        }
        
        for i, report in enumerate(user_reports, 1):
            report_id, scan_id, url, original_verdict, user_verdict, user_id_rep, timestamp, notes = report
            emoji = emoji_map.get(user_verdict, '📌')
            short_url = url[:40] + "..." if len(url) > 40 else url
            
            report_text.extend([
                f"{i}. {emoji} User says: {user_verdict.upper()}",
                f"   Original: {original_verdict}",
                f"   URL: {short_url}",
                ""
            ])
        
        message = "\n".join(report_text)
        if len(message) > 4000:
            chunks = [report_text[i:i+15] for i in range(0, len(report_text), 15)]
            for chunk in chunks:
                await update.message.reply_text("\n".join(chunk))
        else:
            await update.message.reply_text(message)
            
    except Exception as e:
        log.exception("Error viewing reports: %s", e)
        await update.message.reply_text(
            "⚠️ Error retrieving reports. Please try again."
        )

async def view_urls(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """View recently checked URLs (admin only)."""
    user_id = update.effective_user.id
    
    if not is_admin(user_id):
        await update.message.reply_text(
            "❌ Access denied. Use /adminsec <password> to authenticate."
        )
        return
    
    if not user_last_check:
        await update.message.reply_text(
            "🔍 No recent URL checks found."
        )
        return
    
    url_text = [
        "🔍 Recently Checked URLs",
        "━━━━━━━━━━━━━━━━━━━━",
        ""
    ]
    
    emoji_map = {
        'malicious': '🚨',
        'phishing': '🎣',
        'defacement': '⚠️',
        'suspicious': '⚠️',
        'benign': '✅',
        'unknown': '❓'
    }
    
    for uid, check_data in list(user_last_check.items())[-10:]:
        verdict = check_data['final_verdict']
        emoji = emoji_map.get(verdict, '🔍')
        url = check_data['url']
        short_url = url[:45] + "..." if len(url) > 45 else url
        
        url_text.extend([
            f"{emoji} {verdict.upper()}",
            f"   {short_url}",
            f"   ML: {check_data['ml_label']} ({check_data['ml_conf']:.2f})",
            ""
        ])
    
    await update.message.reply_text("\n".join(url_text))

async def system_info(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Show system information (admin only)."""
    user_id = update.effective_user.id
    
    if not is_admin(user_id):
        await update.message.reply_text(
            "❌ Access denied. Use /adminsec <password> to authenticate."
        )
        return
    
    try:
        # Get accurate stats
        stats_data = get_accurate_stats()
        total_checked = stats_data['total_checked']
        malicious_count = stats_data['malicious_count']
        benign_count = stats_data['benign_count']
        by_type = stats_data['by_type']
        
        ml_status = "✅ LOADED" if detector else "❌ NOT LOADED"
        vt_status = "✅ ENABLED" if os.getenv("VT_API_KEY") or os.getenv("VIRUSTOTAL_API_KEY") else "❌ DISABLED"
        
        info_text = [
            "🖥️ System Information",
            "━━━━━━━━━━━━━━━━━━━━",
            "",
            f"🤖 ML Model: {ml_status}",
            f"🛡️ VirusTotal: {vt_status}",
            f"💾 Database: ✅ CONNECTED",
            "",
            "📊 Detection Statistics:",
            f"   Total checks: {total_checked}",
            f"   Malicious: {malicious_count}",
            f"   Safe: {benign_count}",
            "",
            "📝 Breakdown by Type:",
        ]
        
        if by_type:
            for report_type, count in by_type.items():
                info_text.append(f"   {report_type.title()}: {count}")
        else:
            info_text.append("   No scans yet")
        
        await update.message.reply_text("\n".join(info_text))
        
    except Exception as e:
        log.exception("Error getting system info: %s", e)
        await update.message.reply_text(
            "⚠️ Error retrieving system information."
        )

async def clear_data(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Clear all statistics (admin only)."""
    user_id = update.effective_user.id
    username = update.effective_user.username or update.effective_user.first_name
    
    if not is_admin(user_id):
        await update.message.reply_text(
            "❌ Access denied. Use /adminsec <password> to authenticate."
        )
        return
    
    if not context.args or context.args[0] != "CONFIRM":
        await update.message.reply_text(
            "⚠️ WARNING: This will delete all statistics!\n\n"
            "To confirm, use: /cleardata CONFIRM"
        )
        return
    
    try:
        clear_all_stats()
        log.info(f"✅ Statistics cleared by admin {username} (ID: {user_id})")
        await update.message.reply_text(
            "✅ All statistics cleared successfully!"
        )
    except Exception as e:
        log.exception("Error clearing data: %s", e)
        await update.message.reply_text(
            "⚠️ Error clearing data. Please try again."
        )

async def report_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /report command."""
    user_id = update.effective_user.id
    username = update.effective_user.username or update.effective_user.first_name

    # Direct reporting mode: /report <url> <type> OR /report <type> <url>
    if context.args:
        if len(context.args) < 2:
            await update.message.reply_text(
                "Usage: /report <url> <type>\n"
                "Example: /report https://example.com phishing\n\n"
                "Types: benign, malicious, phishing, defacement, suspicious"
            )
            return

        first_arg = context.args[0].lower()
        last_arg = context.args[-1].lower()
        report_type = None
        raw_url = ""

        if first_arg in VALID_REPORT_TYPES:
            report_type = first_arg
            raw_url = " ".join(context.args[1:])
        elif last_arg in VALID_REPORT_TYPES:
            report_type = last_arg
            raw_url = " ".join(context.args[:-1])

        if not report_type:
            await update.message.reply_text(
                "Missing or invalid report type.\n\n"
                "Usage: /report <url> <type>\n"
                "Types: benign, malicious, phishing, defacement, suspicious"
            )
            return

        url = normalize_url(raw_url)
        if not is_valid_url(url):
            await update.message.reply_text(
                "Please provide a valid URL.\n\n"
                "Example: /report https://example.com phishing"
            )
            return

        try:
            report_id = add_user_report(
                url=url,
                original_verdict="not_checked",
                user_verdict=report_type,
                user_id=user_id,
                scan_id=None,
                notes="Direct user report without prior URL check"
            )
            log.info(
                "Direct report saved: user=%s (%s), url=%s, type=%s, report_id=%s",
                username, user_id, url[:100], report_type, report_id
            )
            await update.message.reply_text(
                "Direct report submitted successfully.\n\n"
                f"URL: {url[:80]}{'...' if len(url) > 80 else ''}\n"
                f"Report Type: {report_type.upper()}\n"
                "Status: saved for admin review."
            )
        except Exception as e:
            log.exception("Error saving direct report: %s", e)
            await update.message.reply_text(
                "Error saving your direct report. Please try again."
            )
        return

    # GUI-style menu for reporting
    keyboard = []
    if user_id in user_last_check:
        keyboard.append([
            InlineKeyboardButton("Report Last Checked URL", callback_data=f"show_report_{user_id}")
        ])
    keyboard.append([
        InlineKeyboardButton("Report New Link (No Check)", callback_data=f"report_new_link_{user_id}")
    ])
    reply_markup = InlineKeyboardMarkup(keyboard)

    await update.message.reply_text(
        "Reporting Menu\n\nChoose how you want to report:",
        reply_markup=reply_markup
    )
async def report_link_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Alias command for direct link reporting."""
    if not context.args:
        await report_command(update, context)
        return

    # Reuse /report direct-mode parser by forwarding arguments
    await report_command(update, context)

async def button_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle button callbacks for reporting."""
    query = update.callback_query
    await query.answer()

    data = query.data
    user_id = update.effective_user.id

    try:
        if data.startswith("report_new_link_"):
            context.user_data[REPORT_FLOW_KEY] = {"step": "await_url"}
            await query.edit_message_text(
                "Direct Link Report\n\n"
                "Send the URL you want to report.\n\n"
                "Example: https://example.com\n"
                "Use /cancelreport to stop."
            )
            return

        if data.startswith("show_report_"):
            if user_id not in user_last_check:
                await query.edit_message_text(
                    "No recent checked URL available.\n\n"
                    "Use 'Report New Link (No Check)' to report directly."
                )
                return

            keyboard = [
                [
                    InlineKeyboardButton("Benign", callback_data=f"report_benign_{user_id}"),
                    InlineKeyboardButton("Malicious", callback_data=f"report_malicious_{user_id}")
                ],
                [
                    InlineKeyboardButton("Phishing", callback_data=f"report_phishing_{user_id}"),
                    InlineKeyboardButton("Defacement", callback_data=f"report_defacement_{user_id}")
                ]
            ]
            reply_markup = InlineKeyboardMarkup(keyboard)

            await query.edit_message_text(
                "What is this URL actually?\n\n"
                "Select the correct category:",
                reply_markup=reply_markup
            )
            return

        if data.startswith("direct_report_"):
            parts = data.split("_", 3)
            if len(parts) != 4:
                await query.edit_message_text("Invalid report action.")
                return

            report_type = parts[2]
            callback_user_id = int(parts[3])

            if callback_user_id != user_id:
                await query.edit_message_text("This report action belongs to another user.")
                return

            flow = context.user_data.get(REPORT_FLOW_KEY) or {}
            flow_url = flow.get("url")
            if flow.get("step") != "await_type" or not flow_url:
                await query.edit_message_text(
                    "Report session expired. Use /report to start again."
                )
                return

            report_id = add_user_report(
                url=flow_url,
                original_verdict="not_checked",
                user_verdict=report_type,
                user_id=user_id,
                scan_id=None,
                notes="Direct user report without prior URL check (GUI flow)"
            )

            context.user_data.pop(REPORT_FLOW_KEY, None)
            log.info(
                "Direct GUI report saved: user=%s, url=%s, type=%s, report_id=%s",
                user_id, flow_url[:100], report_type, report_id
            )
            await query.edit_message_text(
                "Direct report submitted successfully.\n\n"
                f"URL: {flow_url[:80]}{'...' if len(flow_url) > 80 else ''}\n"
                f"Report Type: {report_type.upper()}\n"
                "Status: saved for admin review."
            )
            return

        if user_id not in user_last_check:
            await query.edit_message_text(
                "Session expired. Please check a URL again."
            )
            return

        last_check = user_last_check[user_id]

        report_type = None
        message = ""

        if data.startswith("report_benign_"):
            report_type = 'benign'
            message = "Reported as Benign. Thank you for your feedback!"

        elif data.startswith("report_malicious_"):
            report_type = 'malicious'
            message = "Reported as Malicious. Thank you for your feedback!"

        elif data.startswith("report_phishing_"):
            report_type = 'phishing'
            message = "Reported as Phishing. Thank you for your feedback!"

        elif data.startswith("report_defacement_"):
            report_type = 'defacement'
            message = "Reported as Defacement. Thank you for your feedback!"

        if report_type:
            add_user_report(
                url=last_check['url'],
                original_verdict=last_check['final_verdict'],
                user_verdict=report_type,
                user_id=user_id,
                scan_id=last_check.get('scan_id'),
                notes=f"User classified as {report_type}"
            )

            log.info(f"User {user_id} reported: {last_check['url'][:50]} as {report_type}")

            await query.edit_message_text(message)

    except Exception as e:
        log.exception("Error processing report: %s", e)
        await query.edit_message_text(
            "Error saving your report. Please try again."
        )

async def cancel_report_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Cancel active report flow."""
    if context.user_data.get(REPORT_FLOW_KEY):
        context.user_data.pop(REPORT_FLOW_KEY, None)
        await update.message.reply_text("Report flow cancelled.")
    else:
        await update.message.reply_text("No active report flow.")

def _extract_url_from_text(text: str) -> str:
    """Extract URL from message text."""
    if not text:
        return ""
    text = text.strip()
    if text.lower().startswith("/check"):
        parts = text.split(None, 1)
        return parts[1].strip() if len(parts) > 1 else ""
    return text

async def check_url_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Main URL checking handler with rate limiting and error handling."""
    user_id = update.effective_user.id
    username = update.effective_user.username or update.effective_user.first_name

    # Direct report flow: waiting for URL input
    report_flow = context.user_data.get(REPORT_FLOW_KEY)
    if report_flow and report_flow.get("step") == "await_url":
        raw_text = update.message.text if update.message else ""
        report_url = normalize_url(raw_text)

        if not is_valid_url(report_url):
            await update.message.reply_text(
                "Please send a valid URL to report.\n"
                "Example: https://example.com\n\n"
                "Use /cancelreport to stop."
            )
            return

        context.user_data[REPORT_FLOW_KEY] = {"step": "await_type", "url": report_url}
        keyboard = [
            [
                InlineKeyboardButton("Benign", callback_data=f"direct_report_benign_{user_id}"),
                InlineKeyboardButton("Malicious", callback_data=f"direct_report_malicious_{user_id}")
            ],
            [
                InlineKeyboardButton("Phishing", callback_data=f"direct_report_phishing_{user_id}"),
                InlineKeyboardButton("Defacement", callback_data=f"direct_report_defacement_{user_id}")
            ],
            [
                InlineKeyboardButton("Suspicious", callback_data=f"direct_report_suspicious_{user_id}")
            ]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)

        short_url = report_url[:60] + "..." if len(report_url) > 60 else report_url
        await update.message.reply_text(
            "Select report type\n\n"
            f"URL: {short_url}",
            reply_markup=reply_markup
        )
        return
    
    # Rate limiting
    if not check_rate_limit(user_id):
        await update.message.reply_text(
            "⚠️ Rate limit exceeded!\n\n"
            f"Please wait a moment before checking more URLs.\n"
            f"Limit: {RATE_LIMIT_MAX_REQUESTS} requests per {RATE_LIMIT_WINDOW} seconds."
        )
        log.warning(f"Rate limit exceeded for user {username} (ID: {user_id})")
        return
    
    text = update.message.text if update.message else ""
    url = normalize_url(_extract_url_from_text(text))
    
    # Validate URL
    if not is_valid_url(url):
        await update.message.reply_text(
            "⚠️ Please provide a valid URL.\n\n"
            "Usage: /check <url> or just paste the URL.\n\n"
            "Example: https://example.com"
        )
        return
    
    if detector is None:
        await update.message.reply_text(
            "⚠️ ML model not available. Service temporarily unavailable."
        )
        log.error("ML detector not loaded")
        return
    
    try:
        processing_msg = await update.message.reply_text("🔍 Analyzing URL...")
        
        log.info(f"Checking URL for user {username} (ID: {user_id}): {url[:100]}")
        
        # Get combined verdict with timeout protection
        final_verdict, ml_conf, vt_result, ml_label, ml_probs = get_combined_verdict(
            url, detector, ml_threshold=DEFAULT_ML_THRESHOLD
        )

        # Store for reporting
        user_last_check[user_id] = {
            'url': url,
            'final_verdict': final_verdict,
            'ml_label': ml_label,
            'ml_conf': ml_conf,
            'vt_result': vt_result
        }

        try:
            # Add to scans table (automatic detection)
            scan_id = add_scan(
                url=url,
                final_verdict=final_verdict,
                ml_prediction=ml_label,
                ml_confidence=ml_conf,
                vt_result=vt_result,
                user_id=user_id,
                source="telegram_bot"
            )
            log.info(f"Scan saved to database: ID {scan_id}, Verdict: {final_verdict}")
            
            # Store scan_id for later reporting
            user_last_check[user_id]['scan_id'] = scan_id
        except Exception as db_error:
            log.error(f"Database error: {db_error}")
            # Continue even if database fails

        # Prepare response
        verdict_emoji = {
            'malicious': '🚨',
            'phishing': '🎣',
            'defacement': '⚠️',
            'suspicious': '⚠️',
            'benign': '✅',
            'unknown': '❓'
        }
        emoji = verdict_emoji.get(final_verdict, '🔍')

        # Format ML display with confidence indicator
        if final_verdict == "benign" and ml_conf < DEFAULT_ML_THRESHOLD:
            ml_display = f"Benign (low confidence) ({ml_conf:.2%})"
        else:
            ml_display = f"{ml_label} ({ml_conf:.2%})"

        short_url = url[:50] + "..." if len(url) > 50 else url
        lines = [
            f"{emoji} URL Analysis Results",
            f"━━━━━━━━━━━━━━━━━━━━",
            f"🔗 {short_url}",
            f"",
            f"📊 Final Verdict: {final_verdict.upper()}",
            f"🤖 ML: {ml_display}",
            f"🛡️ VT: {vt_result}",
        ]
        
        if final_verdict in ["malicious", "phishing", "defacement"]:
            lines.extend([
                "",
                "⚠️ WARNING: This URL appears dangerous!",
                "Do not visit or share this link."
            ])
        elif final_verdict == "suspicious":
            lines.extend([
                "",
                "⚠️ CAUTION: This URL appears suspicious.",
                "Proceed with caution."
            ])
        elif final_verdict == "benign":
            lines.extend([
                "",
                "✅ This URL appears safe."
            ])

        keyboard = [
            [InlineKeyboardButton("📝 Report Result", callback_data=f"show_report_{user_id}")]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)

        await processing_msg.delete()
        await update.message.reply_text(
            "\n".join(lines),
            reply_markup=reply_markup
        )
        
        log.info(f"URL check complete: {url[:50]} -> {final_verdict}")
        
    except ValueError as ve:
        log.exception("ML model error for URL %s: %s", url, ve)
        await update.message.reply_text(
            "⚠️ ML model error. The model may need retraining.\n\n"
            "The URL will be checked with VirusTotal only."
        )
        # Try with VirusTotal only
        try:
            from services.virustotal import scan_url_vt
            vt_result = scan_url_vt(url)
            
            verdict_emoji = {
                'malicious': '🚨',
                'suspicious': '⚠️',
                'safe': '✅',
            }
            emoji = verdict_emoji.get(vt_result, '❓')
            
            await update.message.reply_text(
                f"{emoji} VirusTotal Result\n"
                f"━━━━━━━━━━━━━━━━━━━━\n"
                f"🔗 {url[:50]}{'...' if len(url) > 50 else ''}\n\n"
                f"🛡️ VirusTotal: {vt_result.upper()}"
            )
        except Exception as vt_error:
            log.exception("VirusTotal error: %s", vt_error)
            await update.message.reply_text(
                "⚠️ Unable to check URL. Please try again later."
            )
    except Exception as e:
        log.exception("Error checking URL %s: %s", url, e)
        await update.message.reply_text(
            "⚠️ Error while checking URL.\n\n"
            "Please try again or contact administrator if the problem persists."
        )

def main():
    init_db()

    def build_app():
        app = (
            ApplicationBuilder()
            .token(TOKEN)
            .connect_timeout(30.0)
            .read_timeout(30.0)
            .write_timeout(30.0)
            .pool_timeout(30.0)
            .build()
        )

        app.add_handler(CommandHandler("start", start))
        app.add_handler(CommandHandler("help", help_command))
        app.add_handler(CommandHandler("stats", stats))
        app.add_handler(CommandHandler("report", report_command))
        app.add_handler(CommandHandler("reportlink", report_link_command))
        app.add_handler(CommandHandler("cancelreport", cancel_report_command))
        app.add_handler(CommandHandler("adminsec", adminsec_command))
        app.add_handler(CommandHandler("admin", admin_panel))
        app.add_handler(CommandHandler("viewreports", view_reports))
        app.add_handler(CommandHandler("viewurls", view_urls))
        app.add_handler(CommandHandler("systeminfo", system_info))
        app.add_handler(CommandHandler("cleardata", clear_data))
        app.add_handler(CallbackQueryHandler(button_callback))
        app.add_handler(MessageHandler(filters.TEXT & (~filters.COMMAND), check_url_handler))
        return app

    print("=" * 60)
    print("🤖 URL Detector - Telegram Bot")
    print("=" * 60)
    print("✅ Bot is running...")
    print(f"🤖 ML Model: {'✅ LOADED' if detector else '❌ NOT LOADED'}")
    print(f"🛡️ VirusTotal: {'✅ ENABLED' if os.getenv('VT_API_KEY') else '❌ DISABLED'}")
    print("📊 Using unified backend database")
    print("=" * 60)

    max_startup_retries = 5
    for attempt in range(1, max_startup_retries + 1):
        app = build_app()
        try:
            app.run_polling(drop_pending_updates=True)
            break
        except KeyboardInterrupt:
            print("\n🛑 Bot stopped")
            break
        except (TimedOut, NetworkError, RuntimeError) as exc:
            if (
                isinstance(exc, RuntimeError)
                and "ExtBot is not properly initialized" not in str(exc)
            ):
                raise

            if attempt == max_startup_retries:
                log.error("Bot failed to start after %s attempts: %s", attempt, exc)
                raise

            wait_seconds = min(5 * attempt, 20)
            log.warning(
                "Startup attempt %s/%s failed due to network timeout/initialization issue: %s. Retrying in %ss...",
                attempt,
                max_startup_retries,
                exc,
                wait_seconds,
            )
            time.sleep(wait_seconds)
if __name__ == "__main__":
    main()





