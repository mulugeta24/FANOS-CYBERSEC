# Malicious URL Detector Bot - Complete Documentation

## Table of Contents
1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Features](#features)
4. [Technology Stack](#technology-stack)
5. [Installation](#installation)

## Overview

The Malicious URL Detector Bot is an intelligent Telegram bot that analyzes URLs for potential security threats using a combination of Machine Learning and VirusTotal API integration. The bot provides real-time threat detection and allows users to report classification results for continuous improvement.

### Key Objectives
- Detect malicious URLs before users visit them
- Provide fast, accurate threat classification
- Collect user feedback for model improvement
- Maintain high availability with minimal latency

### Target Users
- General internet users concerned about security
- Security researchers
- Organizations monitoring URL threats
- Educational institutions

## System Architecture

### High-Level Architecture
```
┌─────────────┐
│   Telegram  │
│    Users    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│      Telegram Bot API               │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│         Bot Application             │
│  ┌─────────────────────────────┐   │
│  │   Command Handlers          │   │
│  │   - /start, /help, /stats   │   │
│  │   - /check, /report         │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │   URL Analysis Engine       │   │
│  │   - ML Model                │   │
│  │   - VirusTotal Integration  │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │   Reporting System          │   │
│  │   - Inline Keyboards        │   │
│  │   - Callback Handlers       │   │
│  └─────────────────────────────┘   │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│      SQLite Database                │
│  - URL Cache                        │
│  - Statistics                       │
│  - User Reports                     │
└─────────────────────────────────────┘
```

## Features

### 1. URL Detection
- Real-time URL analysis
- Multi-source verification (ML + VirusTotal)
- Cached results for faster responses
- Support for various URL formats

### 2. Classification Categories
- **Benign**: Safe, legitimate URLs
- **Malicious**: Known harmful URLs
- **Phishing**: Scam/credential theft attempts
- **Defacement**: Compromised websites

### 3. User Reporting
- One-click category reporting
- Session-based report tracking
- Statistical aggregation
- Feedback loop for model improvement

### 4. Performance Features
- Thread-local database connections
- WAL mode for concurrent access
- Result caching
- Optimized query patterns

## Technology Stack

### Core Technologies
- **Python 3.9+**: Main programming language
- **python-telegram-bot**: Telegram Bot API wrapper
- **SQLite**: Embedded database
- **scikit-learn**: Machine Learning framework
- **requests/httpx**: HTTP client for API calls

### Key Libraries
```
python-telegram-bot>=20.0
python-dotenv
scikit-learn
pandas
numpy
requests
```

## Installation

See `02_INSTALLATION.md` for detailed setup instructions.
