from typing import List, Dict, Any
from app_logging.schemas.models import RetrievedDocument
from ..providers.github_client import MockGitHubClient, PRInfo
from ..criteria.criteria_processor import CriteriaProcessor
from config.settings import settings


class ContextRetriever:
    """Retrieves relevant context for PR reviews."""
    
    def __init__(self, github_client: MockGitHubClient, criteria_processor: CriteriaProcessor):
        self.github_client = github_client
        self.criteria_processor = criteria_processor
    
    def retrieve_context(self, repo: str, pr_info: PRInfo, criteria_data: Dict[str, Any]) -> List[RetrievedDocument]:
        """Retrieve all relevant context for the PR review."""
        documents = []
        
        # Get criteria-specific documents
        criteria_docs = self.criteria_processor.get_relevant_documents(criteria_data)
        documents.extend(criteria_docs)
        
        # Get repository-specific context
        repo_context = self._get_repository_context(repo, pr_info)
        documents.extend(repo_context)
        
        # Get file-specific context
        file_context = self._get_file_context(repo, pr_info)
        documents.extend(file_context)
        
        # Get commit history context
        commit_context = self._get_commit_context(repo, pr_info)
        documents.extend(commit_context)
        
        # Sort by relevance and limit
        documents.sort(key=lambda x: x.relevance_score or 0, reverse=True)
        return documents[:settings.max_retrieval_docs]
    
    def _get_repository_context(self, repo: str, pr_info: PRInfo) -> List[RetrievedDocument]:
        """Get repository-level context like README, style guides, etc."""
        documents = []
        
        # Get README content
        try:
            readme_content = self.github_client.get_file_content(repo, "README.md")
            if readme_content and not readme_content.startswith("# Mock content"):
                documents.append(RetrievedDocument(
                    content=readme_content,
                    source="README.md",
                    relevance_score=0.8,
                    metadata={"type": "repository_documentation"}
                ))
        except Exception:
            pass
        
        # Get requirements.txt for dependency context
        try:
            requirements_content = self.github_client.get_file_content(repo, "requirements.txt")
            if requirements_content and not requirements_content.startswith("# Mock content"):
                documents.append(RetrievedDocument(
                    content=requirements_content,
                    source="requirements.txt",
                    relevance_score=0.7,
                    metadata={"type": "dependencies"}
                ))
        except Exception:
            pass
        
        # Get repository file structure
        repo_files = self.github_client.get_repo_files(repo)
        if repo_files:
            file_structure = "\n".join(repo_files)
            documents.append(RetrievedDocument(
                content=f"Repository file structure:\n{file_structure}",
                source="repository_structure",
                relevance_score=0.6,
                metadata={"type": "file_structure"}
            ))
        
        return documents
    
    def _get_file_context(self, repo: str, pr_info: PRInfo) -> List[RetrievedDocument]:
        """Get context for files being changed in the PR."""
        documents = []
        
        for file_diff in pr_info.files_changed:
            try:
                # Get the current file content
                file_content = self.github_client.get_file_content(repo, file_diff.file_path)
                
                if file_content and not file_content.startswith("# Mock content"):
                    # Create a context document for this file
                    context_content = f"File: {file_diff.file_path}\n"
                    context_content += f"Status: {file_diff.status}\n"
                    context_content += f"Additions: {file_diff.additions}, Deletions: {file_diff.deletions}\n\n"
                    context_content += f"Current content:\n{file_content}"
                    
                    documents.append(RetrievedDocument(
                        content=context_content,
                        source=file_diff.file_path,
                        relevance_score=0.9,
                        metadata={
                            "type": "file_content",
                            "file_path": file_diff.file_path,
                            "status": file_diff.status,
                            "additions": file_diff.additions,
                            "deletions": file_diff.deletions
                        }
                    ))
                
                # Get related files (e.g., __init__.py for modules)
                if file_diff.file_path.endswith("__init__.py"):
                    # Look for related module files
                    module_dir = file_diff.file_path.rsplit("/", 1)[0]
                    try:
                        module_files = [f for f in self.github_client.get_repo_files(repo) 
                                      if f.startswith(module_dir) and f != file_diff.file_path]
                        if module_files:
                            related_content = f"Related module files:\n" + "\n".join(module_files)
                            documents.append(RetrievedDocument(
                                content=related_content,
                                source=f"{module_dir}/related_files",
                                relevance_score=0.7,
                                metadata={"type": "related_files", "module": module_dir}
                            ))
                    except Exception:
                        pass
                        
            except Exception as e:
                # Log error but continue with other files
                print(f"Error retrieving context for {file_diff.file_path}: {e}")
        
        return documents
    
    def _get_commit_context(self, repo: str, pr_info: PRInfo) -> List[RetrievedDocument]:
        """Get context from recent commit history."""
        documents = []
        
        for file_diff in pr_info.files_changed:
            try:
                commit_history = self.github_client.get_commit_history(repo, file_diff.file_path, limit=3)
                
                if commit_history:
                    history_content = f"Recent commit history for {file_diff.file_path}:\n"
                    for commit in commit_history:
                        history_content += f"- {commit['sha'][:8]}: {commit['message']} ({commit['date']})\n"
                    
                    documents.append(RetrievedDocument(
                        content=history_content,
                        source=f"{file_diff.file_path}_commits",
                        relevance_score=0.6,
                        metadata={"type": "commit_history", "file_path": file_diff.file_path}
                    ))
            except Exception:
                pass
        
        return documents
    
    def get_enhanced_context(self, repo: str, pr_info: PRInfo, criteria_data: Dict[str, Any]) -> Dict[str, Any]:
        """Get enhanced context with metadata for the review process."""
        documents = self.retrieve_context(repo, pr_info, criteria_data)
        
        # Group documents by type
        context_by_type = {}
        for doc in documents:
            doc_type = doc.metadata.get("type", "general")
            if doc_type not in context_by_type:
                context_by_type[doc_type] = []
            context_by_type[doc_type].append(doc)
        
        # Create enhanced context summary
        enhanced_context = {
            "documents": documents,
            "context_by_type": context_by_type,
            "total_documents": len(documents),
            "criteria_focus": criteria_data.get("focus", "General review"),
            "repository": repo,
            "pr_summary": {
                "title": pr_info.title,
                "files_changed": len(pr_info.files_changed),
                "total_additions": pr_info.total_additions,
                "total_deletions": pr_info.total_deletions
            }
        }
        
        return enhanced_context 