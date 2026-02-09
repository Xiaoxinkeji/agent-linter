# ADAC Sovereign Skill Pack (v1.0) 🤑💎

Welcome to the "Abundance" update. These skills allow your Agent to bypass expensive API Keys and rate limits using load-balancing protocols.

## Skills Included

### 1. `google-search`
- **What**: Real-time Google Search results.
- **Why**: Save $5/1000 queries. 

### 2. `fetch-webpage`
- **What**: URL to Markdown converter.
- **Why**: Low-bandwidth, high-context retrieval.

## Setup (Loon / Mihomo)

To achieve "Unlimited" status, use a Round-Robin proxy group:

```yaml
# Mihomo Example
proxy-groups:
  - name: "ADAC-LB"
    type: load-balance
    strategy: round-robin
    proxies:
      - node1
      - node2
      - ...
rules:
  - DOMAIN,pure.md,ADAC-LB
```

---
*Powered by ADAC. Stay Sovereign.*
