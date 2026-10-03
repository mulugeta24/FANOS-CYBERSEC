# Testing Documentation

## Testing Strategy

### Test Pyramid
```
        ┌─────────────┐
        │   Manual    │  ← User Acceptance Testing
        │   Testing   │
        ├─────────────┤
        │ Integration │  ← API & Database Tests
        │   Tests     │
        ├─────────────┤
        │    Unit     │  ← Function & Module Tests
        │   Tests     │
        └─────────────┘
```

## Unit Tests

### Database Tests

**test_database.py**:
```python
import unittest
import database
import os

class TestDatabase(unittest.TestCase):
    
    def setUp(self):
        """Setup test database"""
        database.DB_FILE = "test_bot_data.db"
        database.init_db()
    
    def tearDown(self):
        """Cleanup test database"""
        database.close_db_connections()
        if os.path.exists("test_bot_data.db"):
            os.remove("test_bot_data.db")
    
    def test_init_db(self):
        """Test database initialization"""
        self.assertTrue(os.path.exists("test_bot_data.db"))
    
    def test_get_stat_nonexistent(self):
        """Test getting non-existent stat returns 0"""
        result = database.get_stat("nonexistent")
        self.assertEqual(result, 0)
    
    def test_increment_stat(self):
        """Test incrementing statistics"""
        database.increment_stat("test_key")
        result = database.get_stat("test_key")
        self.assertEqual(result, 1)
        
        database.increment_stat("test_key")
        result = database.get_stat("test_key")
        self.assertEqual(result, 2)
    
    def test_cache_operations(self):
        """Test cache set and get"""
        url = "http://example.com"
        result = "benign"
        
        database.set_cache(url, result)
        cached = database.get_cache(url)
        
        self.assertEqual(cached, result)
    
    def test_add_report(self):
        """Test adding report"""
        report_id = database.add_report(
            url="http://test.com",
            report_type="malicious",
            ml_prediction="benign",
            vt_result="suspicious",
            user_id=123456,
            notes="Test report"
        )
        self.assertIsNotNone(report_id)
        self.assertGreater(report_id, 0)
    
    def test_get_report_stats(self):
        """Test report statistics"""
        database.add_report("http://test1.com", "benign", user_id=1)
        database.add_report("http://test2.com", "malicious", user_id=2)
        database.add_report("http://test3.com", "benign", user_id=3)
        
        stats = database.get_report_stats()
        self.assertEqual(stats.get("benign"), 2)
        self.assertEqual(stats.get("malicious"), 1)

if __name__ == '__main__':
    unittest.main()
```

### ML Model Tests

**test_ml_model.py**:
```python
import unittest
from ml_model import MLDetector

class TestMLDetector(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        """Load model once for all tests"""
        cls.detector = MLDetector(
            model_path="ml_model.pkl",
            label_encoder_path="label_encoder.pkl"
        )
    
    def test_predict_benign(self):
        """Test prediction for known benign URL"""
        url = "https://google.com"
        label, conf, probs = self.detector.predict_with_prob(url)
        self.assertIn(label, ["benign", "malicious", "phishing", "defacement"])
        self.assertGreaterEqual(conf, 0.0)
        self.assertLessEqual(conf, 1.0)
    
    def test_predict_returns_valid_label(self):
        """Test that prediction returns valid label"""
        url = "http://example.com"
        label = self.detector.predict(url)
        valid_labels = ["benign", "malicious", "phishing", "defacement"]
        self.assertIn(label, valid_labels)
    
    def test_predict_with_prob_structure(self):
        """Test prediction with probability structure"""
        url = "http://test.com"
        label, conf, probs = self.detector.predict_with_prob(url)
        
        self.assertIsInstance(label, str)
        self.assertIsInstance(conf, float)
        self.assertIsInstance(probs, dict)
        self.assertGreater(len(probs), 0)

if __name__ == '__main__':
    unittest.main()
```

### Utils Tests

**test_utils.py**:
```python
import unittest
from unittest.mock import Mock, patch
from utils import get_combined_verdict
from ml_model import MLDetector

class TestUtils(unittest.TestCase):
    
    def setUp(self):
        """Setup mock detector"""
        self.detector = Mock(spec=MLDetector)
    
    @patch('utils.get_cached')
    @patch('utils.get_vt_report')
    def test_combined_verdict_vt_malicious(self, mock_vt, mock_cache):
        """Test that VT malicious overrides ML"""
        mock_cache.return_value = None
        mock_vt.return_value = "malicious"
        self.detector.predict_with_prob.return_value = ("benign", 0.9, {})
        
        verdict, ml_conf, vt_result, ml_label, probs = get_combined_verdict(
            "http://test.com", self.detector
        )
        
        self.assertEqual(verdict, "malicious")
        self.assertEqual(vt_result, "malicious")
    
    @patch('utils.get_cached')
    def test_combined_verdict_cached(self, mock_cache):
        """Test that cached results are used"""
        mock_cache.return_value = "benign"
        self.detector.predict_with_prob.return_value = ("benign", 0.9, {})
        
        verdict, ml_conf, vt_result, ml_label, probs = get_combined_verdict(
            "http://test.com", self.detector
        )
        
        self.assertEqual(vt_result, "benign")

if __name__ == '__main__':
    unittest.main()
```

---

## Integration Tests

### Bot Integration Test

**test_bot_integration.py**:
```python
import unittest
from unittest.mock import AsyncMock, Mock, patch
from bot import check_url_handler, normalize_url

class TestBotIntegration(unittest.TestCase):
    
    def test_normalize_url_with_http(self):
        """Test URL normalization with http"""
        url = "http://example.com"
        result = normalize_url(url)
        self.assertEqual(result, "http://example.com")
    
    def test_normalize_url_without_protocol(self):
        """Test URL normalization without protocol"""
        url = "example.com"
        result = normalize_url(url)
        self.assertEqual(result, "http://example.com")
    
    def test_normalize_url_with_spaces(self):
        """Test URL normalization with spaces"""
        url = "  example.com  "
        result = normalize_url(url)
        self.assertEqual(result, "http://example.com")

if __name__ == '__main__':
    unittest.main()
```

---

## Manual Testing Checklist

### Functional Testing

#### URL Detection
- [ ] Check URL with /check command
- [ ] Check URL by pasting directly
- [ ] Check URL with http://
- [ ] Check URL with https://
- [ ] Check URL without protocol
- [ ] Check malformed URL
- [ ] Check very long URL
- [ ] Check URL with special characters

#### Reporting
- [ ] Click "Benign" button
- [ ] Click "Malicious" button
- [ ] Click "Phishing" button
- [ ] Click "Defacement" button
- [ ] Report without checking URL first
- [ ] Report after session timeout

#### Commands
- [ ] /start command
- [ ] /help command
- [ ] /stats command
- [ ] /report command
- [ ] Invalid command

#### Statistics
- [ ] View stats with no data
- [ ] View stats after checks
- [ ] View stats after reports
- [ ] Verify counter accuracy

### Performance Testing

#### Load Testing
```python
# test_load.py
import asyncio
import time
from bot import check_url_handler

async def simulate_user(user_id):
    """Simulate single user"""
    # Mock update and context
    # Call check_url_handler
    pass

async def load_test(num_users=10):
    """Simulate multiple concurrent users"""
    start = time.time()
    tasks = [simulate_user(i) for i in range(num_users)]
    await asyncio.gather(*tasks)
    duration = time.time() - start
    print(f"Processed {num_users} requests in {duration:.2f}s")

if __name__ == '__main__':
    asyncio.run(load_test(50))
```

#### Database Stress Test
```python
# test_db_stress.py
import threading
import database
import time

def worker(worker_id, iterations=100):
    """Worker thread"""
    for i in range(iterations):
        database.increment_stat(f"worker_{worker_id}")
        database.set_cache(f"http://test{worker_id}-{i}.com", "benign")

def stress_test(num_threads=10, iterations=100):
    """Stress test database"""
    database.init_db()
    
    start = time.time()
    threads = []
    
    for i in range(num_threads):
        t = threading.Thread(target=worker, args=(i, iterations))
        threads.append(t)
        t.start()
    
    for t in threads:
        t.join()
    
    duration = time.time() - start
    total_ops = num_threads * iterations * 2
    print(f"Completed {total_ops} operations in {duration:.2f}s")
    print(f"Rate: {total_ops/duration:.2f} ops/sec")

if __name__ == '__main__':
    stress_test(20, 100)
```

---

## Test Execution

### Run All Tests
```bash
# Run unit tests
python -m unittest discover -s . -p "test_*.py"

# Run with coverage
pip install coverage
coverage run -m unittest discover
coverage report
coverage html
```

### Continuous Integration

**GitHub Actions** (.github/workflows/test.yml):
```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Set up Python
      uses: actions/setup-python@v2
      with:
        python-version: 3.9
    
    - name: Install dependencies
      run: |
        pip install -r requirements.txt
        pip install coverage
    
    - name: Run tests
      run: |
        coverage run -m unittest discover
        coverage report
```

---

## Test Data

### Sample URLs for Testing
```python
TEST_URLS = {
    "benign": [
        "https://google.com",
        "https://github.com",
        "https://stackoverflow.com"
    ],
    "malicious": [
        # Use known malicious URLs from test databases
    ],
    "phishing": [
        # Use known phishing URLs from test databases
    ]
}
```

### Mock Responses
```python
MOCK_VT_RESPONSE = {
    "benign": {"malicious": 0, "suspicious": 0, "harmless": 85},
    "malicious": {"malicious": 45, "suspicious": 10, "harmless": 30},
    "suspicious": {"malicious": 5, "suspicious": 20, "harmless": 60}
}
```
