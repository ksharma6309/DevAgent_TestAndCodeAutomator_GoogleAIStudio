# Helix DevAgent AI 🧬

**Helix DevAgent AI** is a futuristic, autonomous agentic suite designed to evolve the Software Development Life Cycle (SDLC). 

Powered by **Google Gemini 2.5 Flash**, it serves as a neural interface where developers command specialized AI agents to handle unit testing, debugging, code auditing, and architectural strategy.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/react-v19-61dafb.svg)
![TypeScript](https://img.shields.io/badge/typescript-v5-3178c6.svg)
![Gemini](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-8e7cc3.svg)

---

## 💡 The Vision

### The Problem
Modern software engineering involves a high "context-switching tax." Developers spend hours writing boilerplate tests, parsing obscure error logs, and debating style in code reviews. Existing tools are fragmented across CLIs, CI/CD pipelines, and web portals.

### The Solution
**Helix DevAgent AI** unifies these workflows into a **Single Pane of Glass**. Instead of manually writing a Jest suite, you activate the **Test Forge**. Instead of Googling a stack trace, you deploy the **Auto-Debugger**. It transforms the IDE from a text editor into an **Intelligent Command Center**.

---

## 🚀 Modules

### 1. **Helix Assistant** `views/ChatAssistant.tsx`
- **Role:** Central Intelligence & Strategy.
- **Capabilities:** Answers high-level architectural questions, explains complex DevOps concepts, and retains context across the session in a persistent local database.

### 2. **Test Forge** `views/TestGenerator.tsx`
- **Input:** Raw source code (Python, JS, Go, Java, etc.).
- **Output:** Comprehensive unit test suites (Jest, PyTest, JUnit).
- **Behavior:** Covers happy paths, edge cases, and mocks dependencies automatically.

### 3. **Auto-Debugger** `views/Debugger.tsx`
- **Input:** Broken code + Error logs/Stack traces.
- **Output:** Root cause analysis and fixed code snippets.
- **Behavior:** Correlates logic errors with runtime exceptions to provide a precise fix.

### 4. **Code Auditor** `views/CodeReview.tsx`
- **Input:** Code snippets.
- **Output:** Detailed Markdown report covering Security (OWASP), Performance, and Clean Code principles.
- **Persistence:** Automatically saves review history for compliance auditing.

### 5. **Log Sentinel** `views/LogAnalyzer.tsx`
- **Input:** Unstructured raw server logs.
- **Output:** Structured incident reports with severity classification and remediation steps.

### 6. **Refactor Engine** `views/RefactorBot.tsx`
- **Input:** Legacy or "Spaghetti" code.
- **Output:** Modernized, optimized, and readable code reducing cyclomatic complexity.

### 7. **Data Vault** `views/DatabaseManager.tsx`
- **Privacy First:** All data is stored locally in the browser (LocalStorage).
- **Portability:** Export your entire session history to a JSON database file (`helix_db.json`) and import it on any machine.

---

## 🧠 Why Google AI Studio?

We chose **Google AI Studio** and the **Gemini 2.5 Flash** model as the core engine for Helix because of its specific advantages for real-time developer tools.

### For the Developer
- **Low Latency & High Throughput:** Gemini 2.5 Flash is optimized for speed, making real-time code generation and debugging feel instantaneous.
- **Large Context Window:** It can ingest massive log files or long code snippets (up to 1M tokens) without losing context.
- **Multimodal Capabilities:** It can natively understand text, code, and structured data seamlessly.

---

## 🛠️ Tech Stack

- **Frontend Framework:** [React 19](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (Cyber-Glass Aesthetic)
- **AI Engine:** [Google Gemini API](https://ai.google.dev/) (`gemini-2.5-flash`)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Charts:** [Recharts](https://recharts.org/)
- **Build Tooling:** ES Modules (No-bundler setup for rapid prototyping)

---

## 📂 Project Structure

```bash
/
├── index.html              # Entry point
├── src/
│   ├── App.tsx             # Main Router & Layout
│   ├── components/         # Reusable UI (Buttons, Sidebar, Markdown)
│   ├── services/           # AI Integration (Gemini Service)
│   ├── utils/              # Storage & Persistence Logic
│   ├── views/              # Main Application Screens
│   │   ├── Dashboard.tsx       # Command Center
│   │   ├── ChatAssistant.tsx   # Helix Assistant
│   │   ├── TestGenerator.tsx   # Test Forge
│   │   ├── Debugger.tsx        # Auto-Debugger
│   │   ├── CodeReview.tsx      # Code Auditor
│   │   └── DatabaseManager.tsx # Data Vault
│   └── types.ts            # TypeScript Interfaces
└── README.md
```

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👩‍💻 Author

**Khushboo Sharma**

GitHub: https://github.com/ksharma6309

LinkedIn: https://www.linkedin.com/in/khushboo-sharma-b5b372125/