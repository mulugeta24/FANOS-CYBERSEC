*: Intelligent handling of low-confidence predictions
4. **Production-Ready**: Rate limiting, timeouts, error handling, and logging
5. **Comprehensive Dashboard**: Real-time monitoring, analytics, and management
6. **Transparent Results**: Clear indication of confidence levels and decision reasoning

This design ensures the system is scalable, maintainable, and ready for production deployment while providing an excellent user experience for both end users and administrators.
a Tables**: scans vs user_reports for proper data management
3. **Confidence-Aware Verdicts*age components
│   │   ├── services/        # API client
│   │   └── context/         # Authentication context
│   └── package.json
├── data/
│   ├── database/            # SQLite database
│   ├── models/              # ML model files
│   └── raw/                 # Training dataset
└── notebooks/               # Jupyter notebooks for training
```

### 3.5.2. Key Improvements Over Initial Design

1. **Unified Backend**: Single Flask API serves both bot and frontend, eliminating code duplication
2. **Separate DatI components
│   │   ├── pages/           # Podular architecture:

```
project/
├── backend/
│   ├── api/
│   │   └── auth.py          # Authentication endpoints
│   ├── core/
│   │   ├── database.py      # Database operations
│   │   └── ml_detector.py   # ML model wrapper
│   ├── services/
│   │   └── virustotal.py    # VirusTotal integration
│   ├── models/              # Trained ML models
│   └── app.py               # Flask API server
├── bot/
│   └── telegram_bot.py      # Telegram bot
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable Uaching, and data management).

## 3.5. System Architecture

### 3.5.1. Modular Structure

The system is organized into a clean, mmprehensive logging for debugging

**Security**:
- JWT-based authentication for web dashboard
- Admin password protection
- Rate limiting to prevent abuse
- Input validation for all user inputs
- SQL injection prevention (parameterized queries)

This comprehensive design ensures that the system is both responsive (using the ML model for fast analysis), accurate (leveraging comprehensive data from VirusTotal), transparent (showing confidence levels and reasoning), and production-ready (with proper error handling, cML only
- Both fail → Return error with helpful message
- Comeout
- Prevents hanging requests

**Data Separation**:
- **scans table**: Automatic detections, used for statistics
- **user_reports table**: User feedback, does NOT modify original verdicts
- Maintains data integrity and audit trail

**Caching Strategy**:
- VirusTotal results cached for 24 hours
- Reduces API calls and improves response time
- Automatic cache expiry and cleanup

**Error Handling**:
- Graceful fallbacks for all failure scenarios
- ML model errors → Use VirusTotal only
- VirusTotal errors → Use rusTotal API: 20-second timeout
- Backend API: 60-second timeout for URL scanning
- Frontend: 65-second client-side ti: SUSPICIOUS (cautious approach)

4. **Verdict Display Transparency**:
   - Show final verdict prominently
   - Display ML prediction with confidence percentage
   - Show VirusTotal result
   - Add "(low confidence)" indicator when ML confidence < 85%
   - Provide explanatory notes about decision reasoning

#### Production-Ready Features

**Rate Limiting**:
- Telegram bot: 10 requests per 60 seconds per user
- Prevents spam and abuse
- Automatic cleanup of old request timestamps

**Timeout Protection**:
- Vi **Case C**: If VirusTotal unavailable AND ML says threat (low confidence)
     - → Final verdictsafe", "unavailable", "error", or "timeout"
   - AND ML confidence ≥ 85%
   - → Final verdict: ML prediction (trust confident ML)

3. **Low Confidence Handling (ML Confidence < 85%)**:
   - **Case A**: If VirusTotal says "safe"
     - → Final verdict: BENIGN (trust VT over uncertain ML)
     - Display: "Benign (low confidence)" with note
   
   - **Case B**: If VirusTotal unavailable AND ML says "benign"
     - → Final verdict: BENIGN (benign is safe default)
     - Display: "Benign (low confidence)"
   
   -ides ML)

2. **High Confidence ML (ML Confidence ≥ 85%)**:
   - If VirusTotal returns "ion and confidence score
- Uses label encoder to convert numeric prediction to category
- Returns: label (benign/malicious/phishing/defacement), confidence (0-1), probabilities for all classes

#### Intelligent Verdict Synthesis Logic

The final verdict is determined by a carefully designed, confidence-aware logic:

1. **VirusTotal Override (Highest Priority)**:
   - If VirusTotal returns "malicious" → Final verdict: MALICIOUS (overrides ML)
   - If VirusTotal returns "suspicious" → Final verdict: SUSPICIOUS (overry source of truth due to extensive, real-time threat intelligence
- Returns: malicious, suspicious, safe, unavailable, error, or timeout

**Tier 2 (Machine Learning Model)**:
- In parallel, extracted features are fed into pre-trained XGBoost model
- Model calculates classificatur expiry)
- If not cached, queries VirusTotal API with 20-second timeout
- Caches result to prevent redundant API calls
- Considered the primars (login, secure, bank, update, confirm, account)
- SUSPICIOUS_TLD: Binary indicator for suspicious top-level domains (zip, country, xyz, info, top)
- HAS_IP_IN_PATH: Binary indicator for IP in path or query
- PATH_LENGTH: Length of URL path
- QUERY_LENGTH: Length of query string
- IS_LONG_URL: Binary indicator for URLs > 75 characters
- IS_SHORT_DOMAIN: Binary indicator for domains < 5 characters

#### Two-Tiered Analysis

**Tier 1 (VirusTotal API)**:
- System first checks SQLite database for cached verdict (24-hoTTPS protocol
- NUM_SUBDOMAINS: Count of subdomains
- DOMAIN_LENGTH: Length of domain name

**Advanced Features**:
- NUM_DIGITS: Count of numeric characters
- NUM_HYPHENS: Count of hyphen characters
- NUM_DOTS: Count of dot characters
- SUSPICIOUS_KEYWORDS: Count of suspicious wordfeatures are extracted:

**Basic Features**:
- URL_LENGTH: Total character count
- NUMBER_SPECIAL_CHARACTERS: Count of non-alphanumeric characters
- HAS_IP: Binary indicator for IP address in domain
- HAS_AT: Binary indicator for @ symbol
- HAS_HTTPS: Binary indicator for Hs accuracy, efficiency, and transparency.

#### URL Feature Extraction

For every submitted URL, a comprehensive set of 17 call (bot)
3. System checks SQLite cache for previous VirusTotal result
4. If not cached, makes API call to VirusTotal (with 20-second timeout)
5. Extracts 17 features from URL and runs through ML model
6. Applies intelligent verdict synthesis logic
7. Stores result in scans table
8. Returns formatted response to user
9. User can submit feedback, stored in user_reports table

### 3.4.3. Design Used: Hybrid Detection System

The project's design is based on an intelligent hybrid detection system that prioritize
   - **VirusTotal API**: External threat intelligence service (with caching)
   - **ML Model Files**: Serialized XGBoost model and label encoder

**Request Flow**:
1. User sends URL to Telegram bot or web interface
2. Request reaches Flask API with JWT authentication (web) or direct -bot framework, polling for messages
   - **Flask Backend API**: Unified REST API serving both bot and frontend on port 5000
   - **React Frontend**: Single-page application served on port 3002 (development) or via web server (production)

3. **Data Layer**:
   - **SQLite Database**: Local database file storing all persistent datahboard through any modern web browser

2. **Application Layer**:
   - **Telegram Bot**: Python application using python-telegramerdict, user_verdict, user_id, timestamp, notes)
  - **vt_cache**: VirusTotal cache (url, verdict, malicious, suspicious, harmless, timestamp)
  - **stats**: Legacy statistics (key, value)
  - **reports**: Legacy reports for backward compatibility

#### Network Topology

The system operates on a modern three-tier architecture:

1. **Presentation Layer**:
   - **Telegram Client**: Users interact with the bot through the Telegram mobile/desktop app
   - **Web Browser**: Administrators access the React-based dasght, serverless database with the following schema:
  - **scans**: Automatic URL detections (id, url, final_verdict, ml_prediction, ml_confidence, vt_result, user_id, timestamp, source)
  - **user_reports**: User feedback (id, scan_id, url, original_vomponent library for professional UI design
- **Recharts**: Charting library for data visualization in the dashboard
- **Axios**: HTTP client for making API requests with timeout handling
- **React Router**: Client-side routing for single-page application navigation
- **Vite**: Fast build tool and development server for React applications

#### Database Architecture
- **SQLite**: Lightwei
#### Frontend Frameworks & Libraries
- **React**: Modern JavaScript library for building user interfaces
- **Material-UI (MUI)**: Comprehensive React cet
- **requests**: A simple HTTP library for making API calls to VirusTotal with timeout protection
- **matplotlib**: For data visualization during model training and evaluation
- **python-dotenv**: Used to securely manage API keys and tokens in a .env file, separate from the main codebase
- **sqlite3**: The built-in Python library for managing the SQLite database, providing a lightweight yet powerful solution for persistent data storage
- **PyJWT**: For secure token-based authentication in the web application
essing and feature engineering, while xgboost was selected as the classifier due to its superior performance on structured data
- **pandas**: Used for data manipulation and analysis of the CSV datasries
- **Flask**: Lightweight web framework for building the unified backend API
- **Flask-CORS**: Enable cross-origin resource sharing for frontend-backend communication
- **python-telegram-bot**: A robust, object-oriented framework for building Telegram bots, providing a clean and efficient way to handle messages and commands
- **scikit-learn & xgboost**: The core libraries for the machine learning model. scikit-learn was used for data preproc: Used for the frontend web application to provide a modern, responsive user interface.

#### Backend Frameworks & Librath a Telegram bot for instant access and a web dashboard for comprehensive management. The separation of automatic detections from user feedback was identified as a critical requirement for maintaining data integrity and enabling continuous model improvement.

### 3.4.2. Tools, Languages, Frameworks, and Network Topology

#### Programming Language
- **Python**: Chosen as the primary backend language due to its extensive libraries for machine learning, data processing, and bot development.
- **JavaScript (React)** intelligence provided by an external API service.

Further research was conducted on user experience design for security tools, leading to the decision to implement bobe both effective and practical. Initially, an in-depth literature review was conducted on common malicious URL detection techniques, including heuristic analysis, machine learning-based classification, and blacklist/whitelist approaches. Additionally, existing URL analysis services were analyzed to identify their strengths and weaknesses. Based on these findings, a hybrid approach was selected, combining the speed and adaptability of a machine learning model with the comprehensive threatFinding Techniques

The development of the project was guided by a thorough fact-finding process to ensure that the solution would d VirusTotal integration
   - Ensure code is well-commented, follows best practices, and allows for future extensions

7. **Implement Comprehensive Monitoring and Analytics**: Provide administrators with detailed insights:
   - Real-time statistics dashboard with charts and graphs
   - Detection rates by category (benign, malicious, phishing, defacement)
   - User feedback reports for continuous improvement
   - System health monitoring (ML model status, VirusTotal API status)

## 3.4. Methodology

### 3.4.1. Fact-andlers and rate limiting
   - **Frontend**: React application with Material-UI components
   - **Core**: ML detector, database manager, anegram bot with command hligent Verdict Display**: Design a transparent verdict system that clearly indicates confidence levels:
   - Show "Benign (low confidence)" when ML confidence is below 85%
   - Display explanatory notes about why certain verdicts were chosen
   - Provide detailed breakdown of ML prediction, VirusTotal result, and final verdict

6. **Ensure Modular and Maintainable Architecture**: Design the system with a modular architecture:
   - **Backend**: Unified Flask API serving both bot and frontend
   - **Bot**: Telthentication, real-time statistics, URL analysis tool, reports management, and system settings.

5. **Implement Intelvt_cache table**: Cache VirusTotal results with 24-hour expiry to reduce API calls
   - Ensure data integrity, proper indexing, and scalability for growing user base

4. **Create Dual User Interfaces**:
   - **Telegram Bot**: Build a conversational interface that allows users to easily submit URLs for analysis using simple commands like /check or by pasting the URL directly. Implement rate limiting (10 requests per 60 seconds) to prevent abuse.
   - **Web Dashboard**: Develop a React-based admin dashboard with au table**: Store user feedback separately without modifying original scan verdicts
   - **ser_reportsmachine learning model as a reliable secondary source of analysis, particularly for newly created or uncategorized URLs. Implement confidence-aware decision making where low-confidence ML predictions defer to VirusTotal results.

3. **Implement a Production-Ready Data Storage Solution**: Design and implement a robust SQLite database architecture with separate tables for different data types:
   - **scans table**: Store automatic URL detections with ML predictions, VirusTotal results, and final verdicts
   - **ue (VirusTotal API). Design an intelligent logic that prioritizes the VirusTotal verdict while using the evaluate a supervised machine learning model (XGBoost) capable of classifying URLs into distinct categories: benign, phishing, malicious, and defacement. The model should achieve a classification accuracy of at least 85% on a balanced dataset of 17 engineered URL features including length, special characters, suspicious keywords, and TLD analysis.

2. **Integrate a Hybrid Detection System**: Create a hybrid system that combines the trained machine learning model with a reputable external threat intelligence sourcrching goal can be broken down into several specific, measurable objectives:

1. **Develop a Multi-Class Machine Learning Model**: Train and em performance and user feedback. This approach significantly reduces the time-to-detection gap, empowers users with an accessible security tool, and automates a process that is currently inefficient and prone to human error.

## 3.3. Objective of the Project

The primary objective of this project is to develop and implement a comprehensive malicious URL detection system with both Telegram bot and web-based interfaces that serve as highly effective tools for detecting and classifying malicious URLs. This overatem provides instant threat analysis directly at the point of interaction while enabling administrators to monitor systnefficiency**: The manual reporting and updating system is inefficient for handling the vast number of new malicious URLs that appear daily.
- **No Feedback Loop**: Existing systems don't allow users to report incorrect detections, preventing continuous improvement.

The proposed project directly addresses these limitations by offering a proactive, real-time, and user-friendly solution. By integrating a hybrid detection model within a messaging platform like Telegram and providing a web-based admin dashboard, the sys., misspellings, unusual characters) or may not have the knowledge to identify them.
- **Iocess, however, has several limitations:

- **Latency**: The time lag between a new malicious URL's creation and its inclusion in public blocklists can range from hours to days. During this period, the URL can actively be used to compromise unsuspecting users.
- **Lack of Accessibility**: Some security tools are integrated into specific browsers or require technical expertise to use, limiting accessibility for the general population.
- **Human Error**: Users may overlook subtle signs of a malicious URL (e.gcurity vendors. These vendors then analyze the URL, add it to their blacklists, and update browser-based security features. This pres a critical window of opportunity for attackers to cause significant harm before a URL is officially flagged as malicious. Therefore, there is a clear need for a proactive, automated, and accessible solution that can provide real-time threat analysis of URLs to prevent user exposure to these risks.

### Justification (Based on the Current/Existing System)

The current/existing system for URL threat detection primarily operates on a reactive model. When a malicious URL is discovered, it is manually reported to seing threats. This reactive approach leavesents a significant and growing threat to individuals and organizations. These threats exploit human trust and vulnerabilities to steal sensitive information, distribute harmful software, and compromise online security. The sheer volume and dynamic nature of these malicious URLs make it nearly impossible for a user to manually verify their safety. The existing system, often reliant on human-driven reporting and slow, reactive blocklist updates, is insufficient to provide timely protection against new and evolvng links, malware distribution sites, and defaced web pages—repr successfully delivers a functional, modular, and production-ready system that effectively addresses the problem of malicious URLs. Its hybrid approach ensures high accuracy, the Telegram interface makes it a practical security tool for everyday users, and the web dashboard provides administrators with comprehensive monitoring and management capabilities.

## 3.2. Problem Statement & Justification

### 3.2.1. Problem Statement

In the modern digital landscape, the proliferation of malicious URLs—including phishiwith proper data separation for production use.

The projectas a reliable fallback or supplementary tool. A key innovation is the confidence-aware verdict system: when ML confidence falls below the 85% threshold and VirusTotal confirms a URL is safe, the system trusts VirusTotal over uncertain ML predictions, significantly reducing false positives. To enhance performance and reduce redundant API calls, a SQLite database was implemented with separate tables for automatic detections (scans) and user feedback (user_reports), providing a scalable and efficient solution y scanning URLs against a vast repository of security vendors and blocklists.

The system's intelligent verdict synthesis logic prioritizes external threat intelligence from VirusTotal while using the machine learning model tegrates with the VirusTotal API, a reputable external service that provides real-time, comprehensive threat intelligence bring and management, and a unified backend API serving both interfaces.

The core of the system is a two-tiered, hybrid detection model. The first tier leverages a machine learning classifier, specifically a trained XGBoost model, to analyze a URL's intrinsic features, such as its length, number of special characters, subdomain count, and presence of suspicious keywords. This model provides a fast, initial assessment of the URL's risk profile with 17 carefully engineered features. The second tier in detection system. The primary objective was to create a robust, scalable, and accessible tool capable of automatically identifying and classifying URLs that pose a threat to users, such as phishing, malware, and defacement sites. The solution is integrated with multiple platforms: a Telegram bot for instant messaging-based analysis, a web-based admin dashboard for monitous Link Detector Bot

## 3.1. Summary of the Project

This project presents the design, development, and implementation of a comprehensive hybrid malicious URL# 3. Chapter Three: Malicio