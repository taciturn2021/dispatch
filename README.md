# Beacon - Multi-Channel Notification System

A real-time notification delivery system supporting Email, SMS, Push, and Discord with intelligent rate limiting, retry logic, and user preferences.


## 🏗️ System Architecture

```
┌─────────────┐
│  Client App │
└──────┬──────┘
       │ POST /api/notifications
       ▼
┌──────────────────┐
│   Bun API Server │
│  - Validation    │
│  - Rate Limiting │
│  - Deduplication │
└────┬─────────┬───┘
     │         │
     │         └──────────────┐
     │                        │
     ▼                        ▼
┌─────────────┐      ┌──────────────┐
│ Redis       │      │ Redis Queue  │
│ Pub/Sub     │      │ (Reliability)│
└──────┬──────┘      └──────┬───────┘
       │                    │
       ▼                    ▼
┌──────────────┐    ┌──────────────┐
│ Real-time    │    │ Queue Worker │
│ Worker       │    │ (Background) │
└──────┬───────┘    └──────┬───────┘
       │                   │
       └───────┬───────────┘
               ▼
       ┌───────────────┐
       │ Channel Router│
       └───┬───────────┘
           │
    ┌──────┼──────┬──────┐
    ▼      ▼      ▼      ▼
  Email  SMS   Push  Discord
```

## 📊 Redis Data Structures

| Structure | Key Pattern | Purpose |
|-----------|-------------|---------|
| Pub/Sub Channels | `notification:user:{userId}` | Real-time delivery |
| Lists | `queue:{channel}` | Job queues per channel |
| Sorted Sets | `queue:retry` | Delayed retry queue |
| Sorted Sets | `ratelimit:{userId}:{channel}` | Sliding window rate limits |
| Hashes | `user:prefs:{userId}` | User notification preferences |
| Strings (TTL) | `dedup:{hash}` | Prevent duplicate sends |
| Strings | `notification:{id}:status` | Track notification state |

## 🔧 Tech Stack

- **Runtime**: Bun (TypeScript)
- **Cache/Queue**: Redis
- **Database**: PostgreSQL (optional, for history)
- **Email**: Resend / SendGrid / Nodemailer
- **Discord**: Discord.js or Webhooks
- **SMS**: Twilio (optional)
- **Push**: Firebase / OneSignal (optional)



