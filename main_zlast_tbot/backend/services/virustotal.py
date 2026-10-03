"""
VirusTotal API Integration
Handles URL scanning with VirusTotal API v3
Implements caching to reduce API calls
"""
import requests
import os
import time
import base64
import sqlite3
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

VT_API_KEY = os.getenv("VT_API_KEY") or os.getenv("VIRUSTOTAL_API_KEY")
CACHE_EXPIRY_HOURS = 24  # Cache results for 24 hours

try:
    from core.database import (
        get_cached_verdict as db_get_cached_verdict,
        cache_verdict as db_cache_verdict,
        init_db
    )
except ImportError:
    try:
        from backend.core.database import (
            get_cached_verdict as db_get_cached_verdict,
            cache_verdict as db_cache_verdict,
            init_db
        )
    except ImportError:
        db_get_cached_verdict = None
        db_cache_verdict = None

def get_cached_verdict(url):
    """
    Check if URL verdict is cached and still valid.
    Returns: verdict string or None if not cached/expired
    """
    if db_get_cached_verdict is not None:
        try:
            verdict = db_get_cached_verdict(url, expiry_hours=CACHE_EXPIRY_HOURS)
            if verdict:
                print(f"[VT Cache] HIT - Using cached verdict: {verdict}")
                return verdict
            else:
                print(f"[VT Cache] MISS - No cached result")
                return None
        except Exception as e:
            print(f"[VT Cache] Error reading cache: {e}")
            return None

    # SQLite fallback if core.database is unavailable
    try:
        db_path = os.path.join(os.path.dirname(__file__), "..", "..", "data", "database", "bot_data.db")
        if not os.path.exists(db_path):
            return None
        conn = sqlite3.connect(db_path, timeout=5.0)
        c = conn.cursor()
        c.execute("SELECT verdict, timestamp FROM vt_cache WHERE url = ?", (url,))
        result = c.fetchone()
        conn.close()
        if result:
            verdict, timestamp = result
            cache_age_hours = (time.time() - timestamp) / 3600
            if cache_age_hours < CACHE_EXPIRY_HOURS:
                return verdict
        return None
    except Exception as e:
        print(f"[VT Cache] Fallback read error: {e}")
        return None

def cache_verdict(url, verdict, malicious=0, suspicious=0, harmless=0):
    """Cache VirusTotal verdict for future use"""
    if db_cache_verdict is not None:
        try:
            db_cache_verdict(url, verdict, malicious=malicious, suspicious=suspicious, harmless=harmless)
            print(f"[VT Cache] Cached verdict: {verdict}")
            return
        except Exception as e:
            print(f"[VT Cache] Error caching verdict: {e}")

    try:
        db_path = os.path.join(os.path.dirname(__file__), "..", "..", "data", "database", "bot_data.db")
        conn = sqlite3.connect(db_path, timeout=5.0)
        c = conn.cursor()
        c.execute("""
            INSERT OR REPLACE INTO vt_cache 
            (url, verdict, malicious, suspicious, harmless, timestamp)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (url, verdict, malicious, suspicious, harmless, int(time.time())))
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"[VT Cache] Fallback cache error: {e}")


def scan_url_vt(url):
    """
    Scan a URL using VirusTotal API v3 with caching.
    
    Process:
    1. Check SQLite cache first
    2. If not cached or expired, query VirusTotal API
    3. Cache the result for future use
    
    Returns: verdict string ('malicious', 'suspicious', 'safe', 'unavailable', 'error', or 'timeout')
    """
    if not VT_API_KEY:
        print("⚠️ VirusTotal API key not configured")
        return "unavailable"
    
    # Step 1: Check cache first
    try:
        cached_verdict = get_cached_verdict(url)
        if cached_verdict:
            return cached_verdict
    except Exception as cache_error:
        print(f"[VT Cache] Cache check error: {cache_error}")
        # Continue without cache
    
    # Step 2: Query VirusTotal API
    try:
        headers = {
            "x-apikey": VT_API_KEY,
            "Accept": "application/json"
        }
        
        # Encode URL to base64 for lookup - handle special characters
        try:
            # Ensure URL is properly encoded
            url_bytes = url.encode('utf-8')
            url_id = base64.urlsafe_b64encode(url_bytes).decode('ascii').strip("=")
        except Exception as encode_error:
            print(f"[VT] URL encoding error: {encode_error}")
            return "error"
        
        lookup_url = f"https://www.virustotal.com/api/v3/urls/{url_id}"
        
        print(f"[VT] Querying API for: {url[:100]}...")  # Truncate long URLs in log
        
        # Add timeout to prevent hanging (20 seconds for VT API)
        lookup_response = requests.get(lookup_url, headers=headers, timeout=20)
        
        if lookup_response.status_code == 200:
            # URL already analyzed, get results
            data = lookup_response.json()
            stats = data["data"]["attributes"]["last_analysis_stats"]
            
            malicious = stats.get("malicious", 0)
            suspicious = stats.get("suspicious", 0)
            harmless = stats.get("harmless", 0)
            undetected = stats.get("undetected", 0)
            
            print(f"[VT] Results - Malicious: {malicious}, Suspicious: {suspicious}, Harmless: {harmless}")
            
            # Determine verdict based on results
            if malicious > 0:
                verdict = "malicious"
            elif suspicious > 2:  # More than 2 engines suspicious
                verdict = "suspicious"
            elif harmless > 0 or undetected > 0:
                verdict = "safe"
            else:
                verdict = "safe"
            
            # Step 3: Cache the result
            try:
                cache_verdict(url, verdict, malicious, suspicious, harmless)
            except Exception as cache_error:
                print(f"[VT Cache] Cache write error: {cache_error}")
                # Continue without caching
            
            return verdict
        
        elif lookup_response.status_code == 404:
            # URL not in VirusTotal database
            print(f"[VT] URL not in database")
            verdict = "unavailable"
            cache_verdict(url, verdict)  # Cache unavailable status too
            return verdict
        
        elif lookup_response.status_code == 429:
            print("[VT] Rate limit exceeded")
            return "rate_limited"
        
        else:
            print(f"[VT] API error: {lookup_response.status_code}")
            return "error"
            
    except requests.exceptions.Timeout:
        print("[VT] Request timeout")
        return "timeout"
    except requests.exceptions.ConnectionError:
        print("[VT] Connection error")
        return "error"
    except Exception as e:
        print(f"[VT] Unexpected error: {type(e).__name__}: {str(e)}")
        return "error"


def get_combined_verdict(url, ml_detector, ml_threshold=0.85):
    """
    Hybrid Detection System - Two-Tiered Analysis
    
    Design:
    - Tier 1 (VirusTotal): Primary source of truth with real-time threat intelligence
    - Tier 2 (ML Model): Fast analysis with extracted features
    
    Verdict Synthesis Logic:
    1. If VirusTotal returns malicious/suspicious → Override ML, return VT verdict
    2. If VirusTotal returns benign/unknown → Rely on ML model
    3. ML verdict only accepted if confidence >= threshold (default 85%)
    4. If both low confidence → Label as "benign (low confidence)"
    
    Returns: (final_verdict, ml_confidence, vt_result, ml_label, ml_probabilities)
    """
    # Tier 2: Machine Learning Model (runs in parallel)
    ml_label, ml_conf, ml_probs = ml_detector.predict(url)
    print(f"[ML] Prediction: {ml_label}, Confidence: {ml_conf:.2%}")
    
    # Tier 1: VirusTotal API (primary source of truth)
    vt_result = scan_url_vt(url)
    print(f"[VT] Result: {vt_result}")
    
    # Verdict Synthesis Logic
    final_verdict = None
    
    # Rule 1: VirusTotal malicious/suspicious → Override ML
    if vt_result == "malicious":
        print("[VERDICT] VirusTotal detected malicious - OVERRIDING ML")
        final_verdict = "malicious"
    
    elif vt_result == "suspicious":
        print("[VERDICT] VirusTotal detected suspicious - OVERRIDING ML")
        final_verdict = "suspicious"
    
    # Rule 2: VirusTotal benign/unknown → Use ML model
    elif vt_result in ["safe", "unavailable", "error", "timeout", "rate_limited"]:
        print(f"[VERDICT] VirusTotal result: {vt_result} - Using ML model")
        
        # Rule 3: ML verdict only if confidence >= threshold
        if ml_conf >= ml_threshold:
            print(f"[VERDICT] ML confidence {ml_conf:.2%} >= {ml_threshold:.2%} - Accepting ML verdict")
            final_verdict = ml_label
        else:
            # Rule 4: Low confidence handling
            print(f"[VERDICT] ML confidence {ml_conf:.2%} < {ml_threshold:.2%} - Low confidence")
            
            # If VT says safe, trust it over low-confidence ML
            if vt_result == "safe":
                print(f"[VERDICT] VT says safe - Trusting VT over low-confidence ML")
                final_verdict = "benign"
            # If VT unavailable/error and ML says benign, accept it
            elif ml_label == "benign":
                final_verdict = "benign"
            # If VT unavailable/error and ML says threat (low confidence), be cautious
            else:
                print(f"[VERDICT] VT unavailable and ML uncertain - Marking as suspicious")
                final_verdict = "suspicious"
    
    else:
        # Fallback: Unknown VT result
        print(f"[VERDICT] Unknown VirusTotal result: {vt_result} - Using ML")
        final_verdict = ml_label if ml_conf >= ml_threshold else "suspicious"
    
    print(f"[FINAL] Verdict: {final_verdict}, ML: {ml_label} ({ml_conf:.2%}), VT: {vt_result}")
    
    return final_verdict, ml_conf, vt_result, ml_label, ml_probs
