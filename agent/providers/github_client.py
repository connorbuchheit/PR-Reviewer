from typing import List, Dict, Any, Optional
from dataclasses import dataclass
import json
from pathlib import Path


@dataclass
class FileDiff:
    """Represents a file diff in a PR."""
    file_path: str
    additions: int
    deletions: int
    diff_content: str
    status: str


@dataclass
class PRInfo:
    """Represents basic PR information."""
    pr_number: int
    title: str
    description: str
    base_branch: str
    head_branch: str
    files_changed: List[FileDiff]
    total_additions: int
    total_deletions: int


class MockGitHubClient:
    """Mock GitHub client for development and testing."""
    
    def __init__(self, mock_data_dir: str = "data/mock_repos"):
        self.mock_data_dir = Path(mock_data_dir)
        self.mock_data_dir.mkdir(parents=True, exist_ok=True)
        self._create_sample_data()
    
    def _create_sample_data(self):
        """Create sample mock data if it doesn't exist."""
        sample_pr_file = self.mock_data_dir / "sample_pr.json"
        
        if not sample_pr_file.exists():
            sample_data = {
                "pr_number": 1,
                "title": "Add user authentication feature",
                "description": "This PR adds JWT-based user authentication.",
                "base_branch": "main",
                "head_branch": "feature/auth",
                "files_changed": [
                    {
                        "file_path": "src/auth/__init__.py",
                        "additions": 15,
                        "deletions": 0,
                        "diff_content": "Sample diff content",
                        "status": "added"
                    }
                ],
                "total_additions": 80,
                "total_deletions": 0
            }
            
            with open(sample_pr_file, "w") as f:
                json.dump(sample_data, f, indent=2)
    
    def get_pr(self, repo: str, pr_number: int) -> PRInfo:
        """Get PR information and diff."""
        sample_file = self.mock_data_dir / "sample_pr.json"
        
        with open(sample_file, "r") as f:
            data = json.load(f)
        
        files_changed = [
            FileDiff(**file_data) for file_data in data["files_changed"]
        ]
        
        return PRInfo(
            pr_number=data["pr_number"],
            title=data["title"],
            description=data["description"],
            base_branch=data["base_branch"],
            head_branch=data["head_branch"],
            files_changed=files_changed,
            total_additions=data["total_additions"],
            total_deletions=data["total_deletions"]
        )
    
    def get_file_content(self, repo: str, file_path: str, ref: str = "main") -> str:
        """Get file content from a specific branch/ref."""
        mock_files = {
            "src/auth/jwt_auth.py": "import jwt\nclass JWTAuth:\n    pass",
            "src/auth/models.py": "from pydantic import BaseModel\nclass User(BaseModel):\n    pass",
            "requirements.txt": "fastapi>=0.68.0\npydantic>=2.0.0"
        }
        
        return mock_files.get(file_path, f"# Mock content for {file_path}")
    
    def get_repo_files(self, repo: str, ref: str = "main") -> List[str]:
        """Get list of files in the repository."""
        return [
            "src/auth/__init__.py",
            "src/auth/jwt_auth.py", 
            "src/auth/models.py",
            "src/main.py",
            "requirements.txt",
            "README.md"
        ]
    
    def get_commit_history(self, repo: str, file_path: str, limit: int = 5) -> List[Dict[str, Any]]:
        """Get commit history for a specific file."""
        return [
            {
                "sha": "abc123",
                "message": f"Update {file_path}",
                "author": "developer@example.com",
                "date": "2024-01-15T10:00:00Z"
            }
        ] 