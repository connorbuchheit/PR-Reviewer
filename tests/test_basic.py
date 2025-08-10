"""Basic tests for the PR Review Agent system."""
import sys
from pathlib import Path
import pytest

sys.path.append(str(Path(__file__).parent.parent))

from agent.providers.github_client import MockGitHubClient
from agent.criteria.criteria_processor import CriteriaProcessor
from app_logging.logger.session_logger import SessionLogger
from app_logging.schemas.models import PRReview, Comment, PackageSuggestion

def test_mock_github_client():
    """Test the mock GitHub client."""
    client = MockGitHubClient()
    
    # Test getting PR info
    pr_info = client.get_pr("test-repo", 1)
    assert pr_info.pr_number == 1
    assert pr_info.title == "Add user authentication feature"
    assert len(pr_info.files_changed) > 0
    
    # Test getting file content
    content = client.get_file_content("test-repo", "src/auth/jwt_auth.py")
    assert "import jwt" in content
    
    # Test getting repo files
    files = client.get_repo_files("test-repo")
    assert "requirements.txt" in files

def test_criteria_processor():
    """Test the criteria processor."""
    processor = CriteriaProcessor()
    
    # Test preset criteria
    result = processor.process_criteria("strict style")
    assert "preset_used" in result
    assert result["preset_used"] == "strict style"
    
    # Test custom criteria
    result = processor.process_criteria("focus on security and performance")
    assert "focus" in result
    assert "Custom criteria" in result["focus"]

def test_session_logger():
    """Test the session logger."""
    logger = SessionLogger()
    
    # Test starting a session
    session = logger.start_session("test-123", {"repo": "test"}, "test criteria")
    assert session.session_id == "test-123"
    assert session.criteria_text == "test criteria"

def test_pr_review_models():
    """Test the Pydantic models."""
    # Test Comment model
    comment = Comment(
        file_path="test.py",
        line_number=10,
        comment_text="Test comment"
    )
    assert comment.file_path == "test.py"
    assert comment.line_number == 10
    
    # Test PackageSuggestion model
    suggestion = PackageSuggestion(
        name="test-package",
        reason="Testing purposes"
    )
    assert suggestion.name == "test-package"
    
    # Test PRReview model
    review = PRReview(
        comments=[comment],
        package_suggestions=[suggestion],
        comment_summary="Test review",
        high_level_summary_md="**Test**"
    )
    assert len(review.comments) == 1
    assert len(review.package_suggestions) == 1

if __name__ == "__main__":
    # Run basic tests
    test_mock_github_client()
    test_criteria_processor()
    test_session_logger()
    test_pr_review_models()
    print("All basic tests passed!") 