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
- **UI:** High-contrast, sharp interface for maximum readability.

### 2. **Project Explorer** `views/ProjectExplorer.tsx`
- **Role:** Codebase Navigation & Analysis.
- **Capabilities:** Upload local files/folders. Features a floating **"Summarize File"** button for instant AI summaries of code logic. Allows selecting code snippets to "Explain" or "Implement" new features directly via the Assistant.

### 3. **Test Forge** `views/TestGenerator.tsx`
- **Input:** Raw source code (Python, JS, Go, Java, etc.).
- **Output:** Comprehensive unit test suites (Jest, PyTest, JUnit).
- **Behavior:** Covers happy paths, edge cases, and mocks dependencies automatically.

### 4. **Auto-Debugger** `views/Debugger.tsx`
- **Input:** Broken code + Error logs/Stack traces.
- **Output:** Root cause analysis and fixed code snippets.
- **Behavior:** Correlates logic errors with runtime exceptions to provide a precise fix.

### 5. **Code Auditor** `views/CodeReview.tsx`
- **Input:** Code snippets.
- **Output:** Detailed Markdown report covering Security (OWASP), Performance, and Clean Code principles.
- **Persistence:** Automatically saves review history for compliance auditing.

### 6. **Log Sentinel** `views/LogAnalyzer.tsx`
- **Input:** Unstructured raw server logs.
- **Output:** Structured incident reports with severity classification and remediation steps.

### 7. **Refactor Engine** `views/RefactorBot.tsx`
- **Input:** Legacy or "Spaghetti" code.
- **Output:** Modernized, optimized, and readable code reducing cyclomatic complexity.

### 8. **Data Vault** `views/DatabaseManager.tsx`
- **Privacy First:** All data is stored locally in the browser (LocalStorage).
- **Portability:** Export your entire session history to a JSON database file (`helix_db.json`) and import it on any machine.

---

## 📂 Feature Spotlight: Project Explorer

The **Project Explorer** is the neural hub for interacting with your local codebase. It provides a file-system interface directly within the browser, augmented by AI context actions.

### **Core Capabilities**

#### **1. Summarize File**
- **Trigger:** Click the "Summarize" button in the toolbar or the floating action button that appears on hover.
- **Function:** Sends the entire file content to the Helix Assistant.
- **Output:** A concise, bullet-point executive summary of the file. It highlights:
  - **Primary Responsibility:** What the file does.
  - **Key Functions:** Important methods and their purposes.
  - **Dependencies:** Critical imports and external connections.

#### **2. Implement Feature**
- **Trigger:** Click the "Implement" button.
- **Function:** Opens a dialogue with the Assistant pre-loaded with the file's context.
- **Workflow:** You describe a new feature (e.g., "Add a dark mode toggle" or "Handle API error retries"). The AI generates the specific code modifications required to implement that feature within the existing file structure.

#### **3. Explain Code & Selection**
- **Full File Explanation:** The "Explain" button provides a comprehensive walkthrough of the entire file's logic, data flow, and architecture.
- **Smart Selection:** Highlight any snippet of text within the code viewer. A **"Explain Selection"** button dynamically appears. Clicking this focuses the AI on just that specific block, perfect for decoding complex algorithms or regex patterns without losing context of the surrounding code.

---

## ⚡ Installation & Setup

Helix is designed as a modern React application. While it can run in containerized AI environments, you can also run it locally.

### **Prerequisites**
- **Node.js** (v18 or higher)
- **Gemini API Key:** Obtainable from [Google AI Studio](https://aistudiocdn.com/google-ai-studio).

### **Setup Steps**

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/ksharma6309/helix-devagent.git
    cd helix-devagent
    ```

2.  **Install Dependencies**
    *(If using a bundler like Vite/Create React App)*
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory:
    ```env
    REACT_APP_API_KEY=your_actual_gemini_api_key
    ```
    *Note: The application expects `process.env.API_KEY` to be available.*

4.  **Run the Application**
    ```bash
    npm start
    # or
    npm run dev
    ```

5.  **Access Helix**
    Open your browser to `http://localhost:3000` (or the port specified by your runner).

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
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (Cyber-Glass Aesthetic with High Contrast)
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
│   │   ├── ProjectExplorer.tsx # File Navigation & Summarization
│   │   ├── TestGenerator.tsx   # Test Forge
│   │   ├── Debugger.tsx        # Auto-Debugger
│   │   ├── CodeReview.tsx      # Code Auditor
│   │   └── DatabaseManager.tsx # Data Vault
│   └── types.ts            # TypeScript Interfaces
└── README.md
```

---
## 📷 Screenshots

**Dashboard -**
<img width="1870" height="808" alt="Screenshot 2025-12-15 160711" src="https://github.com/user-attachments/assets/1adc0c27-ca01-4512-b807-c897cb7807c6" />


**Chatbot Assistant -**
<img width="1856" height="799" alt="Screenshot 2025-12-15 162938" src="https://github.com/user-attachments/assets/d057535a-8ffc-401b-b549-6cb3c5986123" />


**Project Explorer -**
<img width="1840" height="811" alt="Screenshot 2025-12-15 163151" src="https://github.com/user-attachments/assets/98d09260-fd6d-4bc6-8c73-4da92d299b0f" />


**Test Generator -**
<img width="1863" height="755" alt="Screenshot 2025-12-15 175413" src="https://github.com/user-attachments/assets/2003dcde-2a28-493b-8453-ae4ff1c9a0a5" />


**Code Debugger -**
<img width="1855" height="814" alt="Screenshot 2025-12-15 175615" src="https://github.com/user-attachments/assets/abe6efeb-4316-4078-bc17-58814eb13cdf" />


**Code Reviewer -**
<img width="1844" height="821" alt="Screenshot 2025-12-15 175711" src="https://github.com/user-attachments/assets/92fe3d70-e4ad-4bb7-8faf-50c0f6ed931d" />


**Data Logs -**
<img width="1835" height="798" alt="Screenshot 2025-12-15 175737" src="https://github.com/user-attachments/assets/97eb1ba6-8a3a-446b-a8a3-32af0bdad8ba" />


---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👩‍💻 Author

**Khushboo Sharma**

GitHub: https://github.com/ksharma6309

LinkedIn: https://www.linkedin.com/in/khushboo-sharma-b5b372125/