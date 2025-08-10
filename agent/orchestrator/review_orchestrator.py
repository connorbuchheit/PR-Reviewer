import uuid
from datetime import datetime
from typing import Dict, Any, Optional
from pathlib import Path

from app_logging.logger.session_logger import SessionLogger
from ..reviewer.pr_reviewer import PRReviewer
from ..retrieval.context_retriever import ContextRetriever
from ..criteria.criteria_processor import CriteriaProcessor
from ..providers.github_client import MockGitHubClient
from app_logging.schemas.models import SessionLog, PRReview
from config.settings import settings


class ReviewOrchestrator:
    """Orchestrates the complete PR review process."""
    
    def __init__(self):
        self.session_logger = SessionLogger()
        self.github_client = MockGitHubClient()
        self.criteria_processor = CriteriaProcessor()
        self.context_retriever = ContextRetriever(self.github_client, self.criteria_processor)
        self.pr_reviewer = PRReviewer(self.session_logger, self.context_retriever)
    
    def review_pull_request(self, repo: str, pr_number: int, criteria_text: str) -> Dict[str, Any]:
        """Execute a complete PR review workflow."""
        session_id = self._generate_session_id()
        
        try:
            # Start session logging
            pr_info = self.github_client.get_pr(repo, pr_number)
            session = self.session_logger.start_session(
                session_id=session_id,
                pr_info={
                    "repo": repo,
                    "pr_number": pr_number,
                    "title": pr_info.title,
                    "description": pr_info.description,
                    "files_changed": len(pr_info.files_changed),
                    "total_additions": pr_info.total_additions,
                    "total_deletions": pr_info.total_deletions
                },
                criteria_text=criteria_text
            )
            
            # Execute review
            review = self.pr_reviewer.review_pr(repo, pr_info, criteria_text)
            
            # Complete session
            completed_session = self.session_logger.complete_session(review)
            
            return {
                "session_id": session_id,
                "success": True,
                "review": review.model_dump(),
                "session": completed_session.model_dump(),
                "metadata": {
                    "repo": repo,
                    "pr_number": pr_number,
                    "criteria": criteria_text,
                    "timestamp": datetime.utcnow().isoformat()
                }
            }
            
        except Exception as e:
            # Log error and complete session with error
            error_message = str(e)
            print(f"Error during PR review: {error_message}")
            
            # Create error review
            error_review = PRReview(
                comments=[],
                package_suggestions=[],
                comment_summary="Review failed due to error",
                high_level_summary_md="**Review failed**"
            )
            
            # Complete session with error
            if hasattr(self.session_logger, 'current_session') and self.session_logger.current_session:
                self.session_logger.complete_session(error_review, success=False, error_message=error_message)
            
            return {
                "session_id": session_id,
                "success": False,
                "error": error_message,
                "review": None,
                "metadata": {
                    "repo": repo,
                    "pr_number": pr_number,
                    "criteria": criteria_text,
                    "timestamp": datetime.utcnow().isoformat()
                }
            }
    
    def get_session_details(self, session_id: str) -> Optional[Dict[str, Any]]:
        """Get detailed information about a review session."""
        session = self.session_logger.get_session(session_id)
        if not session:
            return None
        
        # Get detailed steps
        steps = self.session_logger.get_session_steps(session_id)
        
        return {
            "session": session.model_dump(),
            "steps": [step.model_dump() for step in steps],
            "step_count": len(steps)
        }
    
    def list_sessions(self) -> Dict[str, Any]:
        """List all available review sessions."""
        session_ids = self.session_logger.list_sessions()
        sessions = []
        
        for session_id in session_ids:
            session_info = self.get_session_details(session_id)
            if session_info:
                sessions.append({
                    "session_id": session_id,
                    "summary": {
                        "repo": session_info["session"]["pr_info"].get("repo", "Unknown"),
                        "pr_number": session_info["session"]["pr_info"].get("pr_number", "Unknown"),
                        "criteria": session_info["session"]["criteria_text"][:100] + "...",
                        "success": session_info["session"]["success"],
                        "timestamp": session_info["session"]["start_time"]
                    }
                })
        
        return {
            "total_sessions": len(sessions),
            "sessions": sessions
        }
    
    def replay_session(self, session_id: str, new_criteria: str = None) -> Dict[str, Any]:
        """Replay a session with potentially new criteria."""
        original_session = self.session_logger.get_session(session_id)
        if not original_session:
            return {"error": "Session not found"}
        
        # Use new criteria if provided, otherwise use original
        criteria_text = new_criteria or original_session.criteria_text
        
        # Extract original parameters
        pr_info = original_session.pr_info
        repo = pr_info.get("repo", "demo-repo")
        pr_number = pr_info.get("pr_number", 1)
        
        # Execute new review
        return self.review_pull_request(repo, pr_number, criteria_text)
    
    def get_review_statistics(self) -> Dict[str, Any]:
        """Get statistics about all review sessions."""
        sessions = self.session_logger.list_sessions()
        
        total_sessions = len(sessions)
        successful_sessions = 0
        failed_sessions = 0
        total_comments = 0
        total_package_suggestions = 0
        
        criteria_counts = {}
        repo_counts = {}
        
        for session_id in sessions:
            session_details = self.get_session_details(session_id)
            if session_details:
                session = session_details["session"]
                
                if session["success"]:
                    successful_sessions += 1
                    if session.get("final_review"):
                        review = session["final_review"]
                        total_comments += len(review.get("comments", []))
                        total_package_suggestions += len(review.get("package_suggestions", []))
                else:
                    failed_sessions += 1
                
                # Count criteria usage
                criteria = session["criteria_text"][:50]  # Truncate for grouping
                criteria_counts[criteria] = criteria_counts.get(criteria, 0) + 1
                
                # Count repo usage
                repo = session["pr_info"].get("repo", "Unknown")
                repo_counts[repo] = repo_counts.get(repo, 0) + 1
        
        return {
            "total_sessions": total_sessions,
            "successful_sessions": successful_sessions,
            "failed_sessions": failed_sessions,
            "success_rate": successful_sessions / total_sessions if total_sessions > 0 else 0,
            "total_comments": total_comments,
            "total_package_suggestions": total_package_suggestions,
            "average_comments_per_session": total_comments / successful_sessions if successful_sessions > 0 else 0,
            "criteria_distribution": criteria_counts,
            "repository_distribution": repo_counts
        }
    
    def _generate_session_id(self) -> str:
        """Generate a unique session ID."""
        timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        unique_id = str(uuid.uuid4())[:8]
        return f"review_{timestamp}_{unique_id}"
    
    def cleanup_old_sessions(self, days_to_keep: int = 30) -> Dict[str, Any]:
        """Clean up old session logs."""
        # This is a placeholder for cleanup functionality
        # In a production system, you might want to implement actual cleanup
        return {
            "message": "Cleanup functionality not implemented in MVP",
            "days_to_keep": days_to_keep
        } 