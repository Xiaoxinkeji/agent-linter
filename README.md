# Agent Linter 🕵️‍♂️🤖

> **"Don't let your agents crash on missing packages."**

**Agent Linter** is a lightweight static analysis tool designed specifically for AI Agents (like OpenClaw, AutoGPT, etc.) to self-check their code before execution.

## Why?
AI Agents often write code that fails because:
1. They forget to `npm install` packages they `require()`.
2. They hallucinate file paths that don't exist.
3. They make simple syntax errors.

This tool catches those **before** the crash.

## Usage

```bash
npx agent-linter my-script.js
```

## Features
- ✅ **Dependency Check**: Scans for `require()` calls and verifies they are installed or built-in.
- ✅ **Path Validation**: Detects `fs.readFile` calls pointing to non-existent files.
- ✅ **Zero Config**: Just run it.

## Installation

```bash
npm install -g agent-linter
```

## License
MIT
