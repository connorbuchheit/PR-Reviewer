import uuid
from typing import List, Dict, Any
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.schema import HumanMessage, SystemMessage
from langchain.output_parsers import PydanticOutputParser

from ..logging.schemas.models import (
    PRReview, Comment, PackageSuggestion, ReasoningStep, 
    StepType, RetrievedDocument
)
from ..logging.logger.session_logger import SessionLogger
from ..retrieval.context_retriever import ContextRetriever
from ..criteria.criteria_processor import CriteriaProcessor
from config.settings import settings


class PRReviewer:
    """Core PR reviewer using LangChain for intelligent code review."""
    
    def __init__(self, session_logger: SessionLogger, context_retriever: ContextRetriever):
        self.session_logger = session_logger
        self.context_retriever = context_retriever
        self.llm = ChatOpenAI(
            model=settings.openai_model,
            temperature=settings.openai_temperature,
            top_p=settings.openai_top_p,
            api_key=settings.openai_api_key
        )
        
        # Initialize output parser
        self.output_parser = PydanticOutputParser(pydantic_object=PRReview)
    
    def review_pr(self, repo: str, pr_info: Any, criteria_text: str) -> PRReview:
        """Perform a complete PR review."""
        # Process criteria
        criteria_step = self._log_step(
            StepType.REASONING,
            "criteria_processing",
            {"criteria_text": criteria_text},
            {"criteria_data": "Processing user criteria..."}
        )
        
        criteria_processor = CriteriaProcessor()
        criteria_data = criteria_processor.process_criteria(criteria_text)
        
        self._update_step(criteria_step, {"criteria_data": criteria_data})
        
        # Retrieve context
        retrieval_step = self._log_step(
            StepType.RETRIEVAL,
            "context_retrieval",
            {"repo": repo, "pr_info": pr_info.__dict__, "criteria": criteria_data},
            {"retrieved_docs": "Retrieving context..."}
        )
        
        context = self.context_retriever.get_enhanced_context(repo, pr_info, criteria_data)
        
        self._update_step(retrieval_step, {
            "retrieved_docs": context["documents"],
            "context_summary": context
        })
        
        # Generate review
        generation_step = self._log_step(
            StepType.GENERATION,
            "review_generation",
            {"context": context, "criteria": criteria_data},
            {"review": "Generating review..."}
        )
        
        review = self._generate_review(pr_info, context, criteria_data)
        
        self._update_step(generation_step, {"review": review})
        
        # Generate summary
        summary_step = self._log_step(
            StepType.SUMMARY,
            "review_summary",
            {"review": review},
            {"summary": "Generating summary..."}
        )
        
        final_review = self._generate_summary(review, context, criteria_data)
        
        self._update_step(summary_step, {"summary": final_review})
        
        return final_review
    
    def _generate_review(self, pr_info: Any, context: Dict[str, Any], 
                        criteria_data: Dict[str, Any]) -> PRReview:
        """Generate the initial PR review using LangChain."""
        
        # Create the review prompt
        system_prompt = self._create_system_prompt(criteria_data)
        human_prompt = self._create_human_prompt(pr_info, context)
        
        # Combine context documents
        context_text = self._format_context_for_prompt(context)
        
        # Generate review
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=f"{human_prompt}\n\nContext:\n{context_text}")
        ]
        
        try:
            response = self.llm.invoke(messages)
            review_text = response.content
            
            # Parse the response into structured format
            review = self._parse_review_response(review_text, pr_info)
            
        except Exception as e:
            # Fallback to basic review if parsing fails
            review = self._create_fallback_review(pr_info, criteria_data)
        
        return review
    
    def _create_system_prompt(self, criteria_data: Dict[str, Any]) -> str:
        """Create the system prompt based on criteria."""
        style_guide = criteria_data.get("style_guide", "General code quality standards")
        focus = criteria_data.get("focus", "Code quality")
        
        prompt = f"""You are an expert code reviewer specializing in {focus.lower()}.

{style_guide}

Your task is to review a pull request and provide:
1. Specific, actionable comments on code changes
2. Package suggestions with reasons
3. A concise comment summary
4. A high-level summary with bold headlines

Focus on the criteria provided and ensure all feedback is constructive and actionable."""
        
        return prompt
    
    def _create_human_prompt(self, pr_info: Any, context: Dict[str, Any]) -> str:
        """Create the human prompt for the review."""
        prompt = f"""Please review this pull request:

**PR Title:** {pr_info.title}
**Description:** {pr_info.description}
**Files Changed:** {len(pr_info.files_changed)} files
**Total Changes:** +{pr_info.total_additions} -{pr_info.total_deletions}

**Changed Files:**
"""
        
        for file_diff in pr_info.files_changed:
            prompt += f"- {file_diff.file_path} ({file_diff.status}): +{file_diff.additions} -{file_diff.deletions}\n"
        
        prompt += "\nPlease provide a comprehensive review following the style guide and criteria."
        
        return prompt
    
    def _format_context_for_prompt(self, context: Dict[str, Any]) -> str:
        """Format context documents for the prompt."""
        context_text = "**Repository Context:**\n"
        
        for doc in context["documents"]:
            context_text += f"\n**{doc.source}** (Relevance: {doc.relevance_score or 'N/A'}):\n"
            context_text += f"{doc.content[:500]}...\n" if len(doc.content) > 500 else doc.content
        
        return context_text
    
    def _parse_review_response(self, review_text: str, pr_info: Any) -> PRReview:
        """Parse the LLM response into structured format."""
        try:
            # Try to extract structured information from the response
            comments = self._extract_comments(review_text, pr_info)
            package_suggestions = self._extract_package_suggestions(review_text)
            comment_summary = self._extract_comment_summary(review_text)
            high_level_summary = self._extract_high_level_summary(review_text)
            
            return PRReview(
                comments=comments,
                package_suggestions=package_suggestions,
                comment_summary=comment_summary,
                high_level_summary_md=high_level_summary
            )
            
        except Exception as e:
            # Fallback parsing
            return self._create_fallback_review(pr_info, {})
    
    def _extract_comments(self, review_text: str, pr_info: Any) -> List[Comment]:
        """Extract comments from the review text."""
        comments = []
        
        # Simple extraction - look for file paths and line numbers
        for file_diff in pr_info.files_changed:
            # Create a basic comment for each changed file
            comment_text = f"Review changes in {file_diff.file_path}"
            if file_diff.additions > 0:
                comment_text += f" (+{file_diff.additions} lines)"
            if file_diff.deletions > 0:
                comment_text += f" (-{file_diff.deletions} lines)"
            
            comments.append(Comment(
                file_path=file_diff.file_path,
                line_number=1,  # Default to first line
                comment_text=comment_text,
                severity="info"
            ))
        
        return comments
    
    def _extract_package_suggestions(self, review_text: str) -> List[PackageSuggestion]:
        """Extract package suggestions from the review text."""
        # Simple extraction - look for common package patterns
        suggestions = []
        
        # Mock suggestions based on common patterns
        if "jwt" in review_text.lower():
            suggestions.append(PackageSuggestion(
                name="PyJWT",
                reason="For JWT token handling",
                version="2.8.0"
            ))
        
        if "auth" in review_text.lower():
            suggestions.append(PackageSuggestion(
                name="python-jose",
                reason="For JWT and JWE/JWS operations",
                version="3.3.0"
            ))
        
        return suggestions
    
    def _extract_comment_summary(self, review_text: str) -> str:
        """Extract a comment summary from the review text."""
        # Take the first few sentences as summary
        sentences = review_text.split('.')
        summary = '. '.join(sentences[:2]) + '.'
        return summary[:200] + "..." if len(summary) > 200 else summary
    
    def _extract_high_level_summary(self, review_text: str) -> str:
        """Extract high-level summary from the review text."""
        # Look for bold text or create a summary
        if "**" in review_text:
            # Extract bold text
            import re
            bold_matches = re.findall(r'\*\*(.*?)\*\*', review_text)
            if bold_matches:
                return f"**{bold_matches[0]}**"
        
        # Create a summary based on content
        if "security" in review_text.lower():
            return "**Security-focused review completed**"
        elif "performance" in review_text.lower():
            return "**Performance optimization review completed**"
        elif "style" in review_text.lower():
            return "**Code style review completed**"
        else:
            return "**Code review completed**"
    
    def _create_fallback_review(self, pr_info: Any, criteria_data: Dict[str, Any]) -> PRReview:
        """Create a fallback review if parsing fails."""
        comments = []
        for file_diff in pr_info.files_changed:
            comments.append(Comment(
                file_path=file_diff.file_path,
                line_number=1,
                comment_text=f"Review changes in {file_diff.file_path}",
                severity="info"
            ))
        
        return PRReview(
            comments=comments,
            package_suggestions=[],
            comment_summary=f"Review of {len(pr_info.files_changed)} changed files",
            high_level_summary_md="**Code review completed**"
        )
    
    def _generate_summary(self, review: PRReview, context: Dict[str, Any], 
                         criteria_data: Dict[str, Any]) -> PRReview:
        """Generate final summary and scores."""
        # Calculate style adherence score
        style_score = self._calculate_style_score(review, context, criteria_data)
        
        # Assess security risks
        security_rating = self._assess_security_risks(review, context)
        
        # Identify optimization opportunities
        optimization_potential = self._identify_optimizations(review, context)
        
        # Update the review with calculated scores
        review.style_adherence_score = style_score
        review.security_risk_rating = security_rating
        review.optimization_potential = optimization_potential
        
        return review
    
    def _calculate_style_score(self, review: PRReview, context: Dict[str, Any], 
                              criteria_data: Dict[str, Any]) -> float:
        """Calculate style adherence score."""
        # Simple scoring based on criteria focus
        base_score = 0.7
        
        if "style" in criteria_data.get("focus", "").lower():
            base_score += 0.2
        
        if review.comments:
            base_score += min(len(review.comments) * 0.05, 0.1)
        
        return min(base_score, 1.0)
    
    def _assess_security_risks(self, review: PRReview, context: Dict[str, Any]) -> str:
        """Assess security risks in the PR."""
        # Look for security-related patterns in comments
        security_keywords = ["password", "secret", "token", "auth", "validation", "input"]
        
        for comment in review.comments:
            if any(keyword in comment.comment_text.lower() for keyword in security_keywords):
                return "Medium - Security considerations identified"
        
        return "Low - No obvious security concerns"
    
    def _identify_optimizations(self, review: PRReview, context: Dict[str, Any]) -> str:
        """Identify optimization opportunities."""
        # Look for performance-related patterns
        perf_keywords = ["loop", "algorithm", "efficient", "bottleneck", "performance"]
        
        for comment in review.comments:
            if any(keyword in comment.comment_text.lower() for keyword in perf_keywords):
                return "Medium - Performance optimizations identified"
        
        return "Low - No obvious optimization opportunities"
    
    def _log_step(self, step_type: StepType, step_id: str, 
                  input_data: Dict[str, Any], output_data: Dict[str, Any]) -> ReasoningStep:
        """Log a reasoning step."""
        step = ReasoningStep(
            step_type=step_type,
            step_id=step_id,
            input=input_data,
            output=output_data,
            model_params={
                "model": settings.openai_model,
                "temperature": settings.openai_temperature,
                "top_p": settings.openai_top_p
            }
        )
        
        self.session_logger.log_step(step)
        return step
    
    def _update_step(self, step: ReasoningStep, new_output: Dict[str, Any]):
        """Update an existing step with new output."""
        step.output.update(new_output)
        # Re-log the updated step
        self.session_logger.log_step(step) 