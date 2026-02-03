# Agent Linter 🕵️‍♂️🤖

> **"Don't let your agents crash on missing packages or leaked keys."**
> **"拒绝缺包报错，防止密钥泄露，AI Agent 的代码质检神器。"**

![License](https://img.shields.io/badge/license-MIT-blue.svg) ![Version](https://img.shields.io/badge/version-1.2.0-green.svg)

[English](#english) | [中文 (Chinese)](#中文-chinese) | [日本語 (Japanese)](#日本語-japanese)

---

<a name="english"></a>
## 🇬🇧 English

**Agent Linter** is a lightweight static analysis tool designed specifically for AI Agents (like OpenClaw, AutoGPT, etc.) to self-check their code before execution.

### Why?
AI Agents often write code that fails because:
1. They forget to `npm install` packages they `require()`.
2. They hallucinate file paths that don't exist.
3. **Security Risk**: They hardcode API keys (e.g., OpenAI, GitHub).
4. **Performance Block (New!)**: They use synchronous I/O or shell commands (`execSync`, `readFileSync`), blocking the Agent's event loop.
5. **Env Error**: They use `process.env` without a `.env` file.

This tool catches those **before** the crash.

### Installation
```bash
npm install -g agent-linter
```

### Usage
```bash
# Basic check
npx agent-linter my-script.js

# Recursively scan an entire directory
npx agent-linter .

# Check and auto-install missing packages
npx agent-linter my-script.js --fix
```

---

<a name="中文-chinese"></a>
## 🇨🇳 中文 (Chinese)

**Agent Linter** 是一个专为 AI Agent（如 OpenClaw, AutoGPT）设计的轻量级静态代码分析工具。它可以让 Agent 在运行代码前进行“自检”。

### 为什么需要它？
AI 写代码经常犯这些低级错误：
1. 引用了 `require()` 却忘了安装包 (`npm install`)。
2. 读取了根本不存在的文件路径。
3. **安全隐患**：直接把 API Key 写在代码里（极易导致被盗刷！）。
4. **性能阻塞 (New!)**：使用了同步 I/O 或同步 Shell 命令 (`execSync`, `readFileSync`)，导致 Agent 线程阻塞，影响性能。
5. **环境错误**：使用了环境变量却没有 `.env` 文件。

这个工具能在代码运行前拦截这些错误，防止程序崩溃。

### 安装
```bash
npm install -g agent-linter
```

### 使用方法
```bash
# 基础检查
npx agent-linter my-script.js

# 递归扫描整个目录
npx agent-linter . 

# 检查并自动修复（自动安装缺失的包）
npx agent-linter my-script.js --fix
```

---

<a name="日本語-japanese"></a>
## 🇯🇵 日本語 (Japanese)

**Agent Linter** は、AIエージェント（OpenClawやAutoGPTなど）向けに設計された軽量な静的コード解析ツールです。実行前にコードの自己診断を行います。

### 特徴
- 📦 **依存関係チェック**: 不足している npm パッケージを検出します。
- 🛡️ **セキュリティスキャン**: ハードコードされた API キーを特定します。
- 🔧 **自動修正**: `--fix` オプションでパッケージを自動インストールします。

### インストール
```bash
npm install -g agent-linter
```

---

## License
MIT © [Xiaoxinkeji](https://github.com/Xiaoxinkeji)
