import sys
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

"""
Machine Learning URL Detector
Loads and uses the trained ML model for URL classification
"""
import pickle
import os
import re
from urllib.parse import urlparse

# Suspicious keywords and TLDs from training
SUSPICIOUS_KEYWORDS = ['login', 'secure', 'bank', 'update', 'confirm', 'account']
SUSPICIOUS_TLDS = ['zip', 'country', 'xyz', 'info', 'top']

class MLDetector:
    """ML-based URL detector using trained model."""
    
    def __init__(self, model_path=None, label_encoder_path=None):
        """Initialize the ML detector with model and label encoder."""
        # Default paths relative to project root
        if model_path is None:
            model_path = os.path.join(
                os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
                "data", "models", "ml_model.pkl"
            )
        if label_encoder_path is None:
            label_encoder_path = os.path.join(
                os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
                "data", "models", "label_encoder.pkl"
            )
        
        # Load model and encoder
        with open(model_path, "rb") as f:
            self.model = pickle.load(f)
        
        with open(label_encoder_path, "rb") as f:
            self.label_encoder = pickle.load(f)
        
        print(f"✅ ML Model loaded from: {model_path}")
    
    def extract_features(self, url):
        """
        Extract features from URL for ML model.
        Uses the SAME feature extraction as training (preprocess_urls.py)
        """
        # Ensure URL has scheme
        if not url.startswith(('http://', 'https://')):
            url = 'http://' + url
        
        try:
            parsed = urlparse(url)
        except ValueError:
            parsed = urlparse('http://' + url)
        
        domain = parsed.netloc
        path = parsed.path
        query = parsed.query
        
        features = {}
        
        # Basic features (SAME ORDER AS TRAINING)
        features['URL_LENGTH'] = len(url)
        features['NUMBER_SPECIAL_CHARACTERS'] = len(re.findall(r'[^a-zA-Z0-9]', url))
        features['HAS_IP'] = 1 if re.search(r'(\d{1,3}\.){3}\d{1,3}', domain) else 0
        features['HAS_AT'] = 1 if '@' in url else 0
        features['HAS_HTTPS'] = 1 if parsed.scheme == 'https' else 0
        features['NUM_SUBDOMAINS'] = max(0, len(domain.split('.')) - 2)
        features['DOMAIN_LENGTH'] = len(domain)
        features['NUM_DIGITS'] = len(re.findall(r'\d', url))
        features['NUM_HYPHENS'] = url.count('-')
        features['NUM_DOTS'] = url.count('.')
        features['SUSPICIOUS_KEYWORDS'] = sum(url.lower().count(k) for k in SUSPICIOUS_KEYWORDS)
        
        tld = domain.split('.')[-1] if len(domain.split('.')) > 1 else ''
        features['SUSPICIOUS_TLD'] = 1 if tld in SUSPICIOUS_TLDS else 0
        features['HAS_IP_IN_PATH'] = 1 if re.search(r'(\d{1,3}\.){3}\d{1,3}', path + query) else 0
        
        # Advanced features
        features['PATH_LENGTH'] = len(path)
        features['QUERY_LENGTH'] = len(query)
        features['IS_LONG_URL'] = 1 if len(url) > 75 else 0
        features['IS_SHORT_DOMAIN'] = 1 if len(domain) < 5 else 0
        
        # Return features in the SAME ORDER as training
        return [
            features['URL_LENGTH'],
            features['NUMBER_SPECIAL_CHARACTERS'],
            features['HAS_IP'],
            features['HAS_AT'],
            features['HAS_HTTPS'],
            features['NUM_SUBDOMAINS'],
            features['DOMAIN_LENGTH'],
            features['NUM_DIGITS'],
            features['NUM_HYPHENS'],
            features['NUM_DOTS'],
            features['SUSPICIOUS_KEYWORDS'],
            features['SUSPICIOUS_TLD'],
            features['HAS_IP_IN_PATH'],
            features['PATH_LENGTH'],
            features['QUERY_LENGTH'],
            features['IS_LONG_URL'],
            features['IS_SHORT_DOMAIN'],
        ]
    
    def predict(self, url):
        """
        Predict URL category.
        Returns: (label, confidence, probabilities_dict)
        """
        features = self.extract_features(url)
        
        # Get prediction
        prediction = self.model.predict([features])[0]
        probabilities = self.model.predict_proba([features])[0]
        
        # Get label using label encoder
        label = self.label_encoder.inverse_transform([prediction])[0]
        confidence = max(probabilities)
        
        # Convert probabilities array to dictionary using label encoder classes
        prob_dict = {}
        for i, class_label in enumerate(self.label_encoder.classes_):
            prob_dict[class_label] = float(probabilities[i])
        
        return label, confidence, prob_dict
