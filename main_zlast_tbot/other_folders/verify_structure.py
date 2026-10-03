#!/usr/bin/env python3
"""
Verification script for the restructured project.
Checks that all required files and folders are in place.
"""
import os
import sys

def check_file(path, description):
    """Check if a file exists."""
    if os.path.isfile(path):
        print(f"✅ {description}: {path}")
        return True
    else:
        print(f"❌ {description} MISSING: {path}")
        return False

def check_dir(path, description):
    """Check if a directory exists."""
    if os.path.isdir(path):
        print(f"✅ {description}: {path}")
        return True
    else:
        print(f"❌ {description} MISSING: {path}")
        return False

def main():
    print("=" * 60)
    print("URL Detector System - Structure Verification")
    print("=" * 60)
    print()
    
    all_good = True
    
    # Backend
    print("📁 Backend Structure:")
    all_good &= check_dir("backend", "Backend folder")
    all_good &= check_dir("backend/core", "Backend core folder")
    all_good &= check_dir("backend/services", "Backend services folder")
    all_good &= check_file("backend/app.py", "Backend API server")
    all_good &= check_file("backend/core/database.py", "Database module")
    all_good &= check_file("backend/core/ml_detector.py", "ML detector module")
    all_good &= check_file("backend/services/virustotal.py", "VirusTotal service")
    all_good &= check_file("backend/requirements.txt", "Backend requirements")
    print()
    
    # Bot
    print("🤖 Bot Structure:")
    all_good &= check_dir("bot", "Bot folder")
    all_good &= check_file("bot/telegram_bot.py", "Telegram bot")
    all_good &= check_file("bot/requirements.txt", "Bot requirements")
    print()
    
    # Frontend
    print("🌐 Frontend Structure:")
    all_good &= check_dir("frontend", "Frontend folder")
    all_good &= check_dir("frontend/src", "Frontend source folder")
    all_good &= check_file("frontend/package.json", "Frontend package.json")
    all_good &= check_file("frontend/src/App.jsx", "Frontend App component")
    all_good &= check_file("frontend/src/main.jsx", "Frontend entry point")
    print()
    
    # Data
    print("💾 Data Structure:")
    all_good &= check_dir("data", "Data folder")
    all_good &= check_dir("data/database", "Database folder")
    all_good &= check_dir("data/models", "Models folder")
    
    # Check if models exist
    if os.path.isfile("data/models/ml_model.pkl"):
        print(f"✅ ML model: data/models/ml_model.pkl")
    else:
        print(f"⚠️  ML model not found (will be created on first run)")
    
    if os.path.isfile("data/models/label_encoder.pkl"):
        print(f"✅ Label encoder: data/models/label_encoder.pkl")
    else:
        print(f"⚠️  Label encoder not found (will be created on first run)")
    
    # Database will be created on first run
    if os.path.isfile("data/database/bot_data.db"):
        print(f"✅ Database: data/database/bot_data.db")
    else:
        print(f"⚠️  Database not found (will be created on first run)")
    print()
    
    # Documentation
    print("📖 Documentation:")
    all_good &= check_dir("docs", "Documentation folder")
    all_good &= check_file("PROJECT_STRUCTURE.md", "Project structure doc")
    all_good &= check_file("SETUP_GUIDE.md", "Setup guide")
    all_good &= check_file("RESTRUCTURE_COMPLETE.md", "Restructure summary")
    print()
    
    # Configuration
    print("⚙️  Configuration:")
    all_good &= check_file(".env", "Environment file")
    all_good &= check_file(".env.example", "Example environment file")
    print()
    
    # Start Scripts
    print("🚀 Start Scripts:")
    all_good &= check_file("start_all.bat", "Start all services script")
    all_good &= check_file("start_backend.bat", "Start backend script")
    all_good &= check_file("start_bot.bat", "Start bot script")
    print()
    
    # Summary
    print("=" * 60)
    if all_good:
        print("✅ ALL CHECKS PASSED!")
        print()
        print("Your project is properly structured and ready to use!")
        print()
        print("Next steps:")
        print("1. Run: start_all.bat")
        print("2. Access web: http://localhost:3002")
        print("3. Login: admin / admin123")
        print()
        return 0
    else:
        print("❌ SOME CHECKS FAILED!")
        print()
        print("Please review the missing files/folders above.")
        print("Refer to SETUP_GUIDE.md for help.")
        print()
        return 1

if __name__ == "__main__":
    sys.exit(main())
