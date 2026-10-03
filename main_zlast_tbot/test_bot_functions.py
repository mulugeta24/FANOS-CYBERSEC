"""
Test script to verify bot functions work correctly
"""
import sys
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from core.database import init_db, get_accurate_stats, add_scan, add_user_report, get_scans, get_user_reports
from core.ml_detector import MLDetector

def test_database():
    """Test database functions."""
    print("=" * 60)
    print("Testing Database Functions")
    print("=" * 60)
    
    try:
        # Initialize database
        init_db()
        print("✅ Database initialized")
        
        # Test add_scan
        scan_id = add_scan(
            url="http://test.example.com",
            final_verdict="benign",
            ml_prediction="benign",
            ml_confidence=0.95,
            vt_result="safe",
            user_id=12345,
            source="test"
        )
        print(f"✅ Scan added with ID: {scan_id}")
        
        # Test add_user_report
        report_id = add_user_report(
            url="http://test.example.com",
            original_verdict="benign",
            user_verdict="malicious",
            user_id=12345,
            scan_id=scan_id,
            notes="Test report"
        )
        print(f"✅ User report added with ID: {report_id}")
        
        # Test get_scans
        scans = get_scans(limit=5)
        print(f"✅ Retrieved {len(scans)} scans")
        
        # Test get_user_reports
        reports = get_user_reports(limit=5)
        print(f"✅ Retrieved {len(reports)} user reports")
        
        # Test get_accurate_stats
        stats = get_accurate_stats()
        print(f"✅ Statistics retrieved:")
        print(f"   Total checked: {stats['total_checked']}")
        print(f"   Malicious: {stats['malicious_count']}")
        print(f"   Benign: {stats['benign_count']}")
        print(f"   By type: {stats['by_type']}")
        
        print("\n✅ All database tests passed!")
        return True
        
    except Exception as e:
        print(f"\n❌ Database test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_ml_detector():
    """Test ML detector."""
    print("\n" + "=" * 60)
    print("Testing ML Detector")
    print("=" * 60)
    
    try:
        detector = MLDetector()
        print("✅ ML Model loaded")
        
        # Test URL prediction
        test_url = "http://example.com"
        label, confidence, probs = detector.predict(test_url)
        print(f"✅ Prediction for {test_url}:")
        print(f"   Label: {label}")
        print(f"   Confidence: {confidence:.2%}")
        print(f"   Probabilities: {probs}")
        
        print("\n✅ ML detector test passed!")
        return True
        
    except Exception as e:
        print(f"\n❌ ML detector test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_bot_functions():
    """Test bot-specific functions."""
    print("\n" + "=" * 60)
    print("Testing Bot Functions")
    print("=" * 60)
    
    try:
        # Import bot functions
        sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'bot'))
        from telegram_bot import normalize_url, is_valid_url, check_rate_limit
        
        # Test normalize_url
        test_cases = [
            ("example.com", "http://example.com"),
            ("http://example.com", "http://example.com"),
            ("https://example.com", "https://example.com"),
        ]
        
        for input_url, expected in test_cases:
            result = normalize_url(input_url)
            assert result == expected, f"normalize_url failed: {input_url} -> {result} (expected {expected})"
        print("✅ normalize_url works correctly")
        
        # Test is_valid_url
        valid_urls = [
            "http://example.com",
            "https://example.com/path",
            "http://192.168.1.1",
        ]
        
        invalid_urls = [
            "",
            "ab",
            "x" * 2001,  # Too long
        ]
        
        for url in valid_urls:
            assert is_valid_url(url), f"is_valid_url failed: {url} should be valid"
        print("✅ is_valid_url accepts valid URLs")
        
        for url in invalid_urls:
            assert not is_valid_url(url), f"is_valid_url failed: {url} should be invalid"
        print("✅ is_valid_url rejects invalid URLs")
        
        # Test rate limiting
        test_user_id = 99999
        for i in range(10):
            result = check_rate_limit(test_user_id)
            assert result, f"Rate limit check {i+1} failed"
        print("✅ Rate limiting allows 10 requests")
        
        # 11th request should fail
        result = check_rate_limit(test_user_id)
        assert not result, "Rate limit should block 11th request"
        print("✅ Rate limiting blocks 11th request")
        
        print("\n✅ All bot function tests passed!")
        return True
        
    except Exception as e:
        print(f"\n❌ Bot function test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("\n🧪 Running Bot Tests\n")
    
    results = []
    
    # Run tests
    results.append(("Database", test_database()))
    results.append(("ML Detector", test_ml_detector()))
    results.append(("Bot Functions", test_bot_functions()))
    
    # Summary
    print("\n" + "=" * 60)
    print("Test Summary")
    print("=" * 60)
    
    for name, passed in results:
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{name}: {status}")
    
    all_passed = all(result[1] for result in results)
    
    if all_passed:
        print("\n🎉 All tests passed! Bot is production-ready!")
    else:
        print("\n⚠️ Some tests failed. Please review the errors above.")
    
    sys.exit(0 if all_passed else 1)
