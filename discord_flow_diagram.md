## Visual Flow Diagram
```
┌─────────────────┐
│   API Request   │
│  (Bun Server)   │
└────────┬────────┘
         │
         ├─ Validate
         ├─ Rate Limit Check (Redis Sorted Set) TBI
         ├─ Dedup Check (Redis String) TBI
         └─ User Prefs Check (Redis Hash) TBI
         │
         ▼
    ┌────────────────────┐
    │   DUAL PUBLISH     │
    └────┬──────────┬────┘
         │          │
         │          └──────────────────┐ (TBI)
         │                             │
         ▼                             ▼
┌─────────────────┐          ┌──────────────────┐
│  Redis Pub/Sub  │          │  Redis Queue     │
│  (Fast Path)    │          │  (Reliable Path) │
└────────┬────────┘          └────────┬─────────┘
         │                            │
         ▼                            ▼
┌──────────────────┐        ┌──────────────────┐
│ Realtime Worker  │        │  Queue Worker    │
│ (Subscribed)     │        │  (Polling BRPOP) │
└────────┬─────────┘        └────────┬─────────┘
         │                           │
         └──────────┬────────────────┘
                    │
                    ▼
            ┌───────────────┐
            │ Check Status  │
            │ (Already sent?)│
            └───────┬───────┘
                    │
                    ▼
            ┌───────────────┐
            │Discord Handler│
            └───────┬───────┘
                    │
         ┌──────────┼──────────┐
         │          │          │
         ▼          ▼          ▼
    Success    Network    Discord
                Error      Rate Limit
         │          │          │
         ▼          ▼          ▼
   Mark Sent   Retry Queue  Retry Queue
                (exponential backoff)