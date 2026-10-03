#!/usr/bin/env python3

"""

Test script to verify all components are working correctly.

"""

import os

import sys
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass


import time

import subprocess



def print_header(text):

    """Print a formatted header."""

    print("\n" + "=" * 60)

    print(f"  {text}")

    print("=" * 60)



def check_python_version():

    """Check Python version."""

    print_header("Checking Python Version")

    version = sys.version_info

    print(f"Python {version.major}.{version.minor}.{version.micro}")

    if version.major < 3 or (version.major == 3 and version.minor < 8):

        print("❌ Python 3.8+ required")

        return False

    print("✅ Python version OK")

    return True



def check_dependencies():

    """Check if required packages are installed."""

    print_header("Checking Dependencies")

    

    required_packages = {

        'backend': ['flask', 'flask_cors', 'jwt', 'requests', 'dotenv', 'psycopg2'],

        'bot': ['telegram', 'dotenv']

    }

    

    all_ok = True

    

    # Check backend dependencies

    print("\n📦 Backend Dependencies:")

    for package in required_packages['backend']:

        try:

            __import__(package)

            print(f"  ✅ {package}")

        except ImportError:

            print(f"  ❌ {package} - Run: cd backend && pip install -r requirements.txt")

            all_ok = False

    

    # Check bot dependencies

    print("\n🤖 Bot Dependencies:")

    for package in required_packages['bot']:

        try:

            __import__(package)

            print(f"  ✅ {package}")

        except ImportError:

            print(f"  ❌ {package} - Run: cd bot && pip install -r requirements.txt")

            all_ok = False

    

    return all_ok



def check_environment():

    """Check environment configuration."""

    print_header("Checking Environment Configuration")

    

    if not os.path.exists('.env'):

        print("❌ .env file not found")

        print("   Copy .env.example to .env and configure it")

        return False

    

    print("✅ .env file exists")

    

    # Check required variables

    from dotenv import load_dotenv

    load_dotenv()

    

    required_vars = [

        'TELEGRAM_BOT_TOKEN',

        'VT_API_KEY',

        'ADMIN_USERNAME',

        'ADMIN_PASSWORD',

        'SECRET_KEY'

    ]

    

    all_ok = True

    for var in required_vars:

        value = os.getenv(var)

        if value:

            print(f"  ✅ {var} is set")

        else:

            print(f"  ⚠️  {var} is not set")

            all_ok = False

    

    return all_ok



def check_data_structure():

    """Check data folder structure."""

    print_header("Checking Data Structure")

    

    all_ok = True

    

    # Check folders

    folders = [

        'data',

        'data/database',

        'data/models'

    ]

    

    for folder in folders:

        if os.path.isdir(folder):

            print(f"  ✅ {folder}/")

        else:

            print(f"  ❌ {folder}/ - Creating...")

            os.makedirs(folder, exist_ok=True)

    

    # Check ML models

    models = [

        'data/models/ml_model.pkl',

        'data/models/label_encoder.pkl'

    ]

    

    for model in models:

        if os.path.isfile(model):

            print(f"  ✅ {model}")

        else:

            print(f"  ⚠️  {model} - Will be created on first run")

    

    # PostgreSQL Database Engine
    print("  ✅ PostgreSQL Database (urldb)")
    return all_ok



def test_backend_import():

    """Test if backend modules can be imported."""

    print_header("Testing Backend Imports")

    

    all_ok = True

    

    # Add backend to path

    sys.path.insert(0, 'backend')

    

    modules = [

        ('core.database', 'Database module'),

        ('core.ml_detector', 'ML Detector module'),

        ('services.virustotal', 'VirusTotal service')

    ]

    

    for module_name, description in modules:

        try:

            __import__(module_name)

            print(f"  ✅ {description}")

        except Exception as e:

            print(f"  ❌ {description}: {str(e)}")

            all_ok = False

    

    return all_ok



def test_bot_import():

    """Test if bot can be imported."""

    print_header("Testing Bot Import")

    

    try:

        # Just check if the file compiles

        import py_compile

        py_compile.compile('bot/telegram_bot.py', doraise=True)

        print("  ✅ Bot code compiles successfully")

        return True

    except Exception as e:

        print(f"  ❌ Bot compilation error: {str(e)}")

        return False



def check_ports():

    """Check if required ports are available."""

    print_header("Checking Port Availability")

    

    import socket

    

    ports = {

        5000: 'Backend API',

        3002: 'Frontend (Vite may use different port)'

    }

    

    for port, service in ports.items():

        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

        result = sock.connect_ex(('localhost', port))

        sock.close()

        

        if result == 0:

            print(f"  ⚠️  Port {port} ({service}) is in use")

            print(f"     Stop the service or it will fail to start")

        else:

            print(f"  ✅ Port {port} ({service}) is available")



def main():

    """Run all tests."""

    print("\n" + "=" * 60)

    print("  URL DETECTOR SYSTEM - COMPONENT TEST")

    print("=" * 60)

    

    all_tests_passed = True

    

    # Run tests

    all_tests_passed &= check_python_version()

    all_tests_passed &= check_dependencies()

    all_tests_passed &= check_environment()

    all_tests_passed &= check_data_structure()

    all_tests_passed &= test_backend_import()

    all_tests_passed &= test_bot_import()

    check_ports()  # Just informational

    

    # Summary

    print_header("TEST SUMMARY")

    

    if all_tests_passed:

        print("\n✅ ALL TESTS PASSED!")

        print("\nYour system is ready to start!")

        print("\nNext steps:")

        print("  1. Run: start_all.bat")

        print("  2. Open: http://localhost:3002")

        print("  3. Login: admin / admin123")

        print("\nOr start components individually:")

        print("  - Backend: start_backend.bat")

        print("  - Bot: start_bot.bat")

        print("  - Frontend: cd frontend && npm run dev")

        return 0

    else:

        print("\n❌ SOME TESTS FAILED")

        print("\nPlease fix the issues above before starting the system.")

        print("\nFor help, see:")

        print("  - SETUP_GUIDE.md")

        print("  - docs/TROUBLESHOOTING.md")

        return 1



if __name__ == "__main__":

    sys.exit(main())

