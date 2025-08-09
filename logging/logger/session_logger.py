import json
import os
from datetime import datetime
from typing import List, Dict, Any, Optional
from pathlib import Path

from ..schemas.models import SessionLog, ReasoningStep, PRReview
from config.settings import settings


class SessionLogger:
    """Handles logging of PR review sessions to JSONL files."""
    
    def __init__(self, logs_dir: str = None):
        self.logs_dir = Path(logs_dir or settings.logs_dir)
        self.logs_dir.mkdir(parents=True, exist_ok=True)
        self.current_session: Optional[SessionLog] = None
    
    def start_session(self, session_id: str, pr_info: Dict[str, Any], criteria_text: str) -> SessionLog:
        """Start a new review session."""
        self.current_session = SessionLog(
            session_id=session_id,
            pr_info=pr_info,
            criteria_text=criteria_text
        )
        return self.current_session
    
    def log_step(self, step: ReasoningStep) -> None:
        """Log a reasoning step to the current session."""
        if not self.current_session:
            raise ValueError("No active session. Call start_session() first.")
        
        self.current_session.reasoning_steps.append(step)
        
        # Also write to JSONL file for immediate persistence
        self._write_step_to_jsonl(step)
    
    def complete_session(self, final_review: PRReview, success: bool = True, error_message: str = None) -> SessionLog:
        """Complete the current session with final results."""
        if not self.current_session:
            raise ValueError("No active session. Call start_session() first.")
        
        self.current_session.final_review = final_review
        self.current_session.end_time = datetime.utcnow()
        self.current_session.success = success
        self.current_session.error_message = error_message
        
        # Write complete session to file
        self._write_session_to_file()
        
        return self.current_session
    
    def _write_step_to_jsonl(self, step: ReasoningStep) -> None:
        """Write a single step to JSONL file for immediate persistence."""
        session_file = self.logs_dir / f"{self.current_session.session_id}_steps.jsonl"
        
        step_data = step.model_dump()
        step_data["session_id"] = self.current_session.session_id
        
        with open(session_file, "a", encoding="utf-8") as f:
            f.write(json.dumps(step_data, default=str) + "\n")
    
    def _write_session_to_file(self) -> None:
        """Write the complete session to a JSON file."""
        session_file = self.logs_dir / f"{self.current_session.session_id}_complete.json"
        
        with open(session_file, "w", encoding="utf-8") as f:
            json.dump(self.current_session.model_dump(), f, default=str, indent=2)
    
    def get_session(self, session_id: str) -> Optional[SessionLog]:
        """Retrieve a completed session by ID."""
        session_file = self.logs_dir / f"{session_id}_complete.json"
        
        if not session_file.exists():
            return None
        
        with open(session_file, "r", encoding="utf-8") as f:
            session_data = json.load(f)
            return SessionLog(**session_data)
    
    def list_sessions(self) -> List[str]:
        """List all available session IDs."""
        sessions = []
        for file_path in self.logs_dir.glob("*_complete.json"):
            session_id = file_path.stem.replace("_complete", "")
            sessions.append(session_id)
        return sorted(sessions, reverse=True)
    
    def get_session_steps(self, session_id: str) -> List[ReasoningStep]:
        """Get all reasoning steps for a session from JSONL."""
        steps_file = self.logs_dir / f"{session_id}_steps.jsonl"
        
        if not steps_file.exists():
            return []
        
        steps = []
        with open(steps_file, "r", encoding="utf-8") as f:
            for line in f:
                if line.strip():
                    step_data = json.loads(line)
                    steps.append(ReasoningStep(**step_data))
        
        return steps 