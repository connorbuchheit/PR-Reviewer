# PR Review Agent + AgentOps Replay

## Overview
This project is a **GitHub Pull Request (PR) Review Agent** with **full reasoning trace logging and replay capabilities**.  
The system both **reviews PRs intelligently** and **logs every reasoning step, tool call, and retrieved document** so we can visualize and deterministically replay sessions.

---

## Goals
1. **Repo-Specific PR Reviews**
   - Learn the style and patterns of a given repo.
   - Provide comments that match style conventions.
   - Suggest relevant packages, refactors, and optimizations.

2. **Criteria-Driven Evaluation (via CAG)**
   - Allow the user to define review criteria in a textbox at runtime (e.g., "focus on performance", or give a specific style guide to work with).
   - Use **Context-Aware Generation (CAG)** with LangChain to contextualize the model’s output with the provided style guide or repo norms.

3. **Transparent AgentOps Layer**
   - Capture **structured logs** of prompts, tool calls, retrieved docs, model I/O, and reasoning traces.
   - Visualize decision flow and timeline.
   - Enable deterministic replay for debugging, compliance, and experimentation.

---

## Core Features
- **PR Review Agent**
  - Fetches PR diff & context from GitHub (or mock repo for demo).
  - Retrieves style guide & recent repo commits to learn patterns.
  - Generates file-level and line-level comments.
  - Suggests package imports, refactor strategies, and missing tests.
  - Produces a **bold high-level summary** + personalized learning advice.

- **CAG-Driven Contextualization**
  - User-provided style guide, review mode, or evaluation criteria.
  - Injects this into prompts so that all agent outputs are **criteria-aligned**.
  - Optionally generate a synthetic style guide for demo purposes.

- **Structured Logging**
  - Log schema includes:
    ```json
    {
      "timestamp": "...",
      "step_type": "retrieval|reasoning|generation|tool_call",
      "input": "...",
      "output": "...",
      "retrieved_docs": [],
      "style_guide": "...",
      "package_suggestions": [],
      "model_params": { "temp": 0.2, "top_p": 0.95, "model": "..." }
    }
    ```
  - Store logs in JSONL or Postgres.
  - Preserve **private chain-of-thought** for internal replay, not public output.

- **Visualization & Replay**
  - Graph view (React Flow) showing reasoning steps and data flow.
  - Timeline view with click-to-expand details.
  - Deterministic replay mode: re-run session from stored inputs.
  - Counterfactual replay: change style guide and compare outputs.

---

## Guiding Principles
- **Always contextualize** the model’s review with relevant repo style guides, past commits, or user-provided rules.
- **Make suggestions actionable**: include concrete package names, functions, or code snippets.
- **Log everything** relevant to the agent’s decision-making process.
- **Keep the replay deterministic**: store all model inputs & parameters.
- **Visual clarity > raw data dump** in the UI — think judge-friendly.

---

## Tech Stack [Flexible to change later]
- **Agent Orchestration:** LangChain + Hugging Face (or OpenAI API)
- **Logging Backend:** JSONL + (optionally) Postgres
- **Frontend:** React + React Flow + TailwindCSS
- **Visualization:** Graph view + Timeline
- **Storage:** Local or S3 for artifacts

---

##  MVP Scope
1. PR review agent with:
   - Repo-specific style adaptation.
   - Criteria-driven mode (strict style, correctness, security, performance).
   - Structured package suggestions.
2. Logger that:
   - Captures prompts, retrieved docs, outputs, and reasoning steps.
   - Exposes data to visualization layer.
3. Frontend that:
   - Shows reasoning flow graph.
   - Shows timeline of agent steps.
4. Demo flow:
   - Submit PR → Agent reviews → Replay reasoning in UI.

---

## Stretch Goals
- Compliance Pack: flag disallowed dependencies or coding patterns.
- Counterfactual Replay: alter review criteria and compare outputs.
- Scorecards: style adherence %, security risk rating, optimization potential.

---

## Demo Script
1. Select a demo repo with a messy PR.
2. Pick a review mode (e.g., “Performance Focus”).
3. Agent generates:
   - Line/file comments.
   - Package suggestions.
   - Bold high-level summary + learning tips.
4. Show replay:
   - Graph of reasoning flow.
   - Timeline with click-to-view step details.
5. Change review mode → replay → show updated output instantly.

---

## Repo Structure
```
/agent/           # PR review agent code
/logging/         # Logging middleware & schema
/frontend/        # React UI for visualization & replay
/data/            # Demo repos, mock PRs, style guides
README.md         # This file
```

---

## Quick Start
```bash
# Install deps
pip install -r requirements.txt

# Run agent on demo PR
python agent/run_agent.py --repo demo-repo --pr 1 --criteria "strict style"

# Start frontend
cd pr_reviewer
npm install
npm run dev
```
