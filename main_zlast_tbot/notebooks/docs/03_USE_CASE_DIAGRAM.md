# Use Case Diagram

## Actors
1. **User**: End user interacting with the bot
2. **System**: Automated processes
3. **VirusTotal API**: External service
4. **ML Model**: Machine learning classifier

## Use Case Diagram

```
                    Malicious URL Detector Bot
    ┌────────────────────────────────────────────────────────┐
    │                                                          │
    │                                                          │
    │    ┌──────────────┐                                     │
    │    │ Start Bot    │◄────────────────┐                  │
    │    └──────────────┘                 │                  │
    │                                     │                  │
    │    ┌──────────────┐                 │                  │
    │    │ Get Help     │◄────────────────┤                  │
    │    └──────────────┘                 │                  │
    │                                     │                  │
    │    ┌──────────────┐                 │                  │
┌───┼───►│ Check URL    │◄────────────────┤                  │
│   │    └──────┬───────┘                 │                  │
│   │           │                         │                  │
│   │           │ «include»               │                  │
│   │           ▼                         │                  │
│   │    ┌──────────────┐          ┌─────┴──────┐           │
│   │    │ Normalize    │          │            │           │
│   │    │ URL          │          │   User     │           │
│   │    └──────┬───────┘          │            │           │
│   │           │                  └────────────┘           │
│   │           │ «include»                                 │
│   │           ▼                                           │
│   │    ┌──────────────┐                                   │
│   │    │ Check Cache  │                                   │
│   │    └──────┬───────┘                                   │
│   │           │                                           │
│   │           │ «extend»                                  │
│   │           ▼                                           │
│   │    ┌──────────────┐         ┌──────────────┐         │
│   │    │ Query        │◄────────┤ VirusTotal   │         │
│   │    │ VirusTotal   │         │ API          │         │
│   │    └──────┬───────┘         └──────────────┘         │
│   │           │                                           │
│   │           │ «include»                                 │
│   │           ▼                                           │
│   │    ┌──────────────┐         ┌──────────────┐         │
│   │    │ ML           │◄────────┤ ML Model     │         │
│   │    │ Prediction   │         │              │         │
│   │    └──────┬───────┘         └──────────────┘         │
│   │           │                                           │
│   │           │ «include»                                 │
│   │           ▼                                           │
│   │    ┌──────────────┐                                   │
│   │    │ Combine      │                                   │
│   │    │ Results      │                                   │
│   │    └──────┬───────┘                                   │
│   │           │                                           │
│   │           │ «include»                                 │
│   │           ▼                                           │
│   │    ┌──────────────┐                                   │
│   │    │ Update       │                                   │
│   │    │ Statistics   │                                   │
│   │    └──────┬───────┘                                   │
│   │           │                                           │
│   │           ▼                                           │
│   │    ┌──────────────┐                                   │
│   │    │ Display      │                                   │
│   │    │ Results      │                                   │
│   │    └──────────────┘                                   │
│   │                                                        │
│   │    ┌──────────────┐                                   │
└───┼───►│ Report URL   │◄────────────────┐                │
    │    └──────┬───────┘                 │                │
    │           │                         │                │
    │           │ «include»               │                │
    │           ▼                         │                │
    │    ┌──────────────┐                 │                │
    │    │ Select       │                 │                │
    │    │ Category     │                 │                │
    │    └──────┬───────┘                 │                │
    │           │                         │                │
    │           │ «include»               │                │
    │           ▼                         │                │
    │    ┌──────────────┐                 │                │
    │    │ Save Report  │                 │                │
    │    └──────────────┘                 │                │
    │                                     │                │
    │    ┌──────────────┐                 │                │
    │    │ View         │◄────────────────┘                │
    │    │ Statistics   │                                   │
    │    └──────────────┘                                   │
    │                                                        │
    └────────────────────────────────────────────────────────┘
```

## Use Case Descriptions

### UC-01: Start Bot
**Actor**: User
**Description**: User initiates conversation with bot
**Preconditions**: User has Telegram account
**Postconditions**: Welcome message displayed
**Flow**:
1. User sends /start command
2. Bot displays welcome message with available commands

### UC-02: Check URL
**Actor**: User
**Description**: User submits URL for threat analysis
**Preconditions**: Bot is running
**Postconditions**: URL analyzed and result displayed
**Flow**:
1. User sends URL or /check command with URL
2. System normalizes URL format
3. System checks cache for existing result
4. If not cached, query VirusTotal API
5. Run ML prediction
6. Combine results using decision logic
7. Update statistics
8. Display results with report buttons

### UC-03: Report URL
**Actor**: User
**Description**: User reports actual category of checked URL
**Preconditions**: URL has been checked in current session
**Postconditions**: Report saved to database
**Flow**:
1. User clicks category button (Benign/Malicious/Phishing/Defacement)
2. System retrieves last check data
3. System saves report with metadata
4. System updates report statistics
5. Confirmation message displayed

### UC-04: View Statistics
**Actor**: User
**Description**: User views detection and reporting statistics
**Preconditions**: Bot is running
**Postconditions**: Statistics displayed
**Flow**:
1. User sends /stats command
2. System queries database for statistics
3. System formats statistics message
4. Display total checks, detections, and reports
