# Agent Linter Integration Guide 🦞

This guide covers how to integrate `agent-linter` into your autonomous agent workflows to ensure maximum stability and security.

## Installation

```bash
npm install -g agent-linter
```

## Running the Audit

To run a full audit on your current workspace:
```bash
agent-linter .
```

## Specialized Rules

### Intent Alignment
Ensures your agent isn't "hallucinating" actions that differ from its stated intent in comments.

### Memory Sanitizer
Prevents instruction injection into your long-term memory files.

### Conflict Arbiter
Ensures safe concurrent access in multi-agent environments.

## Automated CI/CD

Add `agent-linter` to your pre-commit hooks to catch bugs before they reach your memory files.

---
*Verified Safe Agent (VSA) Status: In Progress*
