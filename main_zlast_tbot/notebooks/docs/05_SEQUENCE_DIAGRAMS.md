# Sequence Diagrams

## 1. URL Check Sequence

```
User    Bot     Utils   VTCache  VTAPI   MLModel  Database
 │       │        │        │       │        │         │
 │──URL──>│       │        │       │        │         │
 │       │        │        │       │        │         │
 │       │─normalize_url─>│        │       │         │
 │       │<──────────────┘│        │       │         │
 │       │                │        │       │         │
 │       │─get_combined_verdict──>│        │         │
 │       │                │        │       │         │
 │       │                │─get_cached────>│         │
 │       │                │<───result──────┘         │
 │       │                │        │       │         │
 │       │                │ [if not cached]│         │
 │       │                │        │       │         │
 │       │                │─get_vt_report─>│         │
 │       │                │        │───API call────> │
 │       │                │        │<──response───── │
 │       │                │<──result───────┘         │
 │       │                │        │       │         │
 │       │                │─set_cache─────>│         │
 │       │                │        │───save────────> │
 │       │                │        │<──────────────┘ │
 │       │                │        │       │         │
 │       │                │─predict_with_prob──────> │
 │       │                │<──ml_result─────────────┘
 │       │                │        │       │         │
 │       │                │─combine_logic─>│         │
 │       │<──final_verdict────────┘        │         │
 │       │                │        │       │         │
 │       │─increment_stat────────────────────────────>│
 │       │<──────────────────────────────────────────┘│
 │       │                │        │       │         │
 │       │─display_result─>│       │       │         │
 │<──────┘                │        │       │         │
 │                        │        │       │         │
```

## 2. Report Submission Sequence

```
User    Bot     Database
 │       │         │
 │─click─>│        │
 │ button │        │
 │       │         │
 │       │─get_last_check
 │       │  (from memory)
 │       │         │
 │       │─add_report────>│
 │       │         │      │
 │       │         │─INSERT INTO
 │       │         │  reports
 │       │         │      │
 │       │<────report_id──┘
 │       │         │
 │       │─increment_stat─>│
 │       │         │      │
 │       │         │─UPDATE
 │       │         │  stats
 │       │         │      │
 │       │<───────────────┘
 │       │         │
 │       │─confirmation──>│
 │<──────┘         │
 │                 │
```

## 3. Statistics Retrieval Sequence

```
User    Bot     Database
 │       │         │
 │─/stats>│        │
 │       │         │
 │       │─get_stat("total_checked")──>│
 │       │<────────value───────────────┘
 │       │         │
 │       │─get_stat("malicious")───────>│
 │       │<────────value───────────────┘
 │       │         │
 │       │─get_report_stats()──────────>│
 │       │         │                    │
 │       │         │─SELECT report_type,
 │       │         │  COUNT(*) GROUP BY
 │       │         │                    │
 │       │<────────dict────────────────┘
 │       │         │
 │       │─format_message
 │       │         │
 │<──stats│        │
 │  message        │
 │                 │
```

## 4. Bot Initialization Sequence

```
System  Bot     Database  MLModel  Telegram
 │       │         │         │         │
 │─start─>│        │         │         │
 │       │         │         │         │
 │       │─load_env()        │         │
 │       │         │         │         │
 │       │─init_db()────────>│         │
 │       │         │         │         │
 │       │         │─CREATE TABLES     │
 │       │         │  IF NOT EXISTS    │
 │       │         │         │         │
 │       │         │─PRAGMA journal_mode
 │       │         │  =WAL   │         │
 │       │         │         │         │
 │       │<────────┘         │         │
 │       │         │         │         │
 │       │─load_model()──────────────> │
 │       │<────────────────────────────┘
 │       │         │         │         │
 │       │─build_application()─────────>│
 │       │         │         │         │
 │       │─add_handlers()    │         │
 │       │         │         │         │
 │       │─run_polling()─────────────> │
 │       │         │         │<─getMe──┘
 │       │         │         │         │
 │       │         │         │─deleteWebhook
 │       │         │         │         │
 │       │<────────────────────ready───┘
 │       │         │         │         │
 │  [Bot Running]  │         │         │
 │                 │         │         │
```

## 5. Error Handling Sequence

```
User    Bot     Database  External
 │       │         │         │
 │──URL──>│        │         │
 │       │         │         │
 │       │─query──────────────────> X
 │       │         │         │  (timeout)
 │       │         │         │
 │       │─[catch exception]─┘
 │       │         │
 │       │─log_error()
 │       │         │
 │       │─try_fallback()
 │       │         │
 │       │─[if DB fails]
 │       │         │
 │       │─log_warning()
 │       │         │
 │       │─continue_with_result
 │       │         │
 │<──result       │
 │  (partial)     │
 │                │
```
