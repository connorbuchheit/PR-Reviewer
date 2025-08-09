from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum


class StepType(str, Enum):
    """Types of agent execution steps."""
    RETRIEVAL = "retrieval"
    REASONING = "reasoning"
    GENERATION = "generation"
    TOOL_CALL = "tool_call"
    SUMMARY = "summary"


class Comment(BaseModel):
    """A single comment on a PR."""
    file_path: str = Field(..., description="Path to the file being commented on")
    line_number: int = Field(..., description="Line number for the comment")
    comment_text: str = Field(..., description="The comment content")
    end_line_number: Optional[int] = Field(None, description="End line number for multi-line comments")
    severity: str = Field("info", description="Comment severity: info, warning, error")


class PackageSuggestion(BaseModel):
    """A package suggestion for the PR."""
    name: str = Field(..., description="Package name")
    reason: str = Field(..., description="Reason for suggesting this package")
    snippet: Optional[str] = Field(None, description="Code snippet showing usage")
    version: Optional[str] = Field(None, description="Recommended version")


class PRReview(BaseModel):
    """Complete PR review output."""
    comments: List[Comment] = Field(default_factory=list, description="List of file/line comments")
    package_suggestions: List[PackageSuggestion] = Field(default_factory=list, description="Package suggestions")
    comment_summary: str = Field(..., description="Short summary of all comments")
    high_level_summary_md: str = Field(..., description="Bold headline summary in markdown")
    style_adherence_score: Optional[float] = Field(None, description="Style adherence percentage")
    security_risk_rating: Optional[str] = Field(None, description="Security risk assessment")
    optimization_potential: Optional[str] = Field(None, description="Optimization opportunities")


class RetrievedDocument(BaseModel):
    """A document retrieved during the review process."""
    content: str = Field(..., description="Document content")
    source: str = Field(..., description="Source of the document")
    relevance_score: Optional[float] = Field(None, description="Relevance score")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Additional metadata")


class ReasoningStep(BaseModel):
    """A single step in the agent's reasoning process."""
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    step_type: StepType = Field(..., description="Type of reasoning step")
    step_id: str = Field(..., description="Unique identifier for this step")
    input: Dict[str, Any] = Field(..., description="Input data for this step")
    output: Dict[str, Any] = Field(..., description="Output data from this step")
    retrieved_docs: List[RetrievedDocument] = Field(default_factory=list, description="Documents retrieved")
    style_guide: Optional[str] = Field(None, description="Style guide used for this step")
    package_suggestions: List[PackageSuggestion] = Field(default_factory=list, description="Package suggestions from this step")
    model_params: Dict[str, Any] = Field(default_factory=dict, description="Model parameters used")
    reasoning_trace: Optional[str] = Field(None, description="Private reasoning trace")
    error: Optional[str] = Field(None, description="Error message if step failed")


class SessionLog(BaseModel):
    """Complete session log for a PR review."""
    session_id: str = Field(..., description="Unique session identifier")
    pr_info: Dict[str, Any] = Field(..., description="PR metadata")
    criteria_text: str = Field(..., description="User-provided review criteria")
    start_time: datetime = Field(default_factory=datetime.utcnow)
    end_time: Optional[datetime] = Field(None, description="Session completion time")
    reasoning_steps: List[ReasoningStep] = Field(default_factory=list, description="All reasoning steps")
    final_review: Optional[PRReview] = Field(None, description="Final review output")
    success: bool = Field(True, description="Whether the session completed successfully")
    error_message: Optional[str] = Field(None, description="Error message if session failed") 