# Agent Linter v1.1 🕵️‍♂️🤖

> **"Don't let your agents crash on missing packages or leaked keys."**

**Agent Linter** is a lightweight static analysis tool designed specifically for AI Agents (like OpenClaw, AutoGPT, etc.) to self-check their code before execution.

## Why?
AI Agents often write code that fails because:
1. They forget to `npm install` packages they `require()`.
2. They hallucinate file paths that don't exist.
3. **NEW:** They hardcode API keys (security risk!).
4. **NEW:** They use environment variables without a `.env` file.

This tool catches those **before** the crash.

## Usage

```bash
# Basic check
npx agent-linter my-script.js

# Check and auto-install missing packages
npx agent-linter my-script.js --fix
```

## Features (v1.1)
- ✅ **Dependency Check**: Scans for `require()` calls.
- ✅ **Auto-Fix**: Automatically runs `npm install` for missing packages with `--fix`.
- ✅ **Security Scan**: Detects hardcoded API keys (GitHub, OpenAI, etc.).
- ✅ **Env Var Check**: Warns if `process.env` is used but `.env` is missing.
- ✅ **Path Validation**: Detects `fs.readFile` calls pointing to non-existent files.

## Installation

```bash
npm install -g agent-linter
```

## License
MIT
