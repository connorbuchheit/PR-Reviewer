"""
Basic tests for the PR Review Agent system.
"""

import sys
from pathlib import Path
import pytest

# Add parent directory to path for imports
sys.path.append(str(Path(__file__).parent.parent))

from agent.providers.github_client import MockGitHubClient
from agent.criteria.criteria_processor import CriteriaProcessor
from agent.logging.logger.session_logger import SessionLogger
from agent.logging.schemas.models import PRReview, Comment, PackageSuggestion


def test_mock_github_client():
    """Test the mock GitHub client."""
    client = MockGitHubClient()
    
    # Test getting PR info
    pr_info = client.get_pr("demo-repo", 1)
    assert pr_info is not None
    assert pr_info.title == "Add user authentication feature"
    assert len(pr_info.files_changed) == 3
    
    # Test getting file content
    content = client.get_file_content("demo-repo", "src/auth/jwt_auth.py")
    assert "JWTAuth" in content
    assert "jwt" in content


def test_criteria_processor():
    """Test the criteria processor."""
    processor = CriteriaProcessor()
    
    # Test preset criteria
    criteria_data = processor.process_criteria("strict style")
    assert criteria_data["focus"] == "Code style and formatting consistency"
    assert "style_guide" in criteria_data
    
    # Test custom criteria
    custom_criteria = processor.process_criteria("focus on security and performance")
    assert "security" in custom_criteria["detected_focus_areas"]
    assert "performance" in custom_criteria["detected_focus_areas"]


def test_session_logger():
    """Test the session logger."""
    logger = SessionLogger(logs_dir="test_logs")
    
    # Test starting a session
    session = logger.start_session(
        session_id="test_session",
        pr_info={"repo": "test-repo", "pr_number": 1},
        criteria_text="test criteria"
    )
    
    assert session.session_id == "test_session"
    assert session.pr_info["repo"] == "test-repo"
    
    # Test logging a step
    from agent.logging.schemas.models import ReasoningStep, StepType
    
    step = ReasoningStep(
        step_type=StepType.REASONING,
        step_id="test_step",
        input={"test": "input"},
        output={"test": "output"}
    )
    
    logger.log_step(step)
    assert len(session.reasoning_steps) == 1
    
    # Test completing session
    review = PRReview(
        comments=[],
        package_suggestions=[],
        comment_summary="Test review",
        high_level_summary_md="**Test completed**"
    )
    
    completed = logger.complete_session(review)
    assert completed.final_review is not None
    assert completed.success is True


def test_pr_review_models():
    """Test the PR review data models."""
    # Test Comment model
    comment = Comment(
        file_path="test.py",
        line_number=10,
        comment_text="Test comment",
        severity="warning"
    )
    
    assert comment.file_path == "test.py"
    assert comment.line_number == 10
    assert comment.severity == "warning"
    
    # Test PackageSuggestion model
    pkg_suggestion = PackageSuggestion(
        name="test-package",
        reason="For testing purposes",
        version="1.0.0"
    )
    
    assert pkg_suggestion.name == "test-package"
    assert pkg_suggestion.reason == "For testing purposes"
    
    # Test PRReview model
    review = PRReview(
        comments=[comment],
        package_suggestions=[pkg_suggestion],
        comment_summary="Test review summary",
        high_level_summary_md="**Test Review**"
    )
    
    assert len(review.comments) == 1
    assert len(review.package_suggestions) == 1
    assert review.comment_summary == "Test review summary"


if __name__ == "__main__":
    # Run basic tests
    print("Running basic tests...")
    
    try:
        test_mock_github_client()
        print("✅ Mock GitHub client test passed")
    except Exception as e:
        print(f"❌ Mock GitHub client test failed: {e}")
    
    try:
        test_criteria_processor()
        print("✅ Criteria processor test passed")
    except Exception as e:
        print(f"❌ Criteria processor test failed: {e}")
    
    try:
        test_session_logger()
        print("✅ Session logger test passed")
    except Exception as e:
        print(f"❌ Session logger test failed: {e}")
    
    try:
        test_pr_review_models()
        print("✅ PR review models test passed")
    except Exception as e:
        print(f"❌ PR review models test failed: {e}")
    
    print("\nBasic tests completed!") 