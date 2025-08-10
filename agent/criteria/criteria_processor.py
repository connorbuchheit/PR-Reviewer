from typing import Dict, Any, List
import re
from app_logging.schemas.models import RetrievedDocument


class CriteriaProcessor:
    """Processes user-provided review criteria and generates style guides."""
    
    def __init__(self):
        self.preset_criteria = {
            "strict style": {
                "focus": "Code style and formatting consistency",
                "rules": [
                    "Check for consistent indentation (4 spaces)",
                    "Verify proper import ordering",
                    "Ensure consistent naming conventions",
                    "Check for proper docstrings and comments"
                ]
            },
            "performance": {
                "focus": "Performance optimization and efficiency",
                "rules": [
                    "Identify potential performance bottlenecks",
                    "Suggest more efficient algorithms",
                    "Check for unnecessary loops or computations",
                    "Recommend performance monitoring tools"
                ]
            },
            "security": {
                "focus": "Security vulnerabilities and best practices",
                "rules": [
                    "Check for SQL injection vulnerabilities",
                    "Verify proper input validation",
                    "Check for hardcoded secrets",
                    "Ensure proper authentication/authorization"
                ]
            },
            "correctness": {
                "focus": "Logical correctness and error handling",
                "rules": [
                    "Verify edge case handling",
                    "Check for proper error handling",
                    "Ensure input validation",
                    "Verify business logic correctness"
                ]
            }
        }
    
    def process_criteria(self, criteria_text: str) -> Dict[str, Any]:
        """Process user-provided criteria and return structured guidelines."""
        criteria_lower = criteria_text.lower().strip()
        
        # Check for preset criteria
        for preset_name, preset_data in self.preset_criteria.items():
            if preset_name in criteria_lower:
                return self._enhance_preset_criteria(preset_name, preset_data, criteria_text)
        
        # Process custom criteria
        return self._process_custom_criteria(criteria_text)
    
    def _enhance_preset_criteria(self, preset_name: str, preset_data: Dict[str, Any], 
                                custom_text: str) -> Dict[str, Any]:
        """Enhance preset criteria with custom additions."""
        enhanced = preset_data.copy()
        enhanced["preset_used"] = preset_name
        enhanced["custom_additions"] = self._extract_custom_rules(custom_text)
        enhanced["style_guide"] = self._generate_style_guide(enhanced)
        return enhanced
    
    def _process_custom_criteria(self, criteria_text: str) -> Dict[str, Any]:
        """Process completely custom criteria."""
        # Extract potential focus areas
        focus_keywords = {
            "style": ["style", "format", "indent", "naming", "convention"],
            "performance": ["performance", "speed", "efficient", "optimize", "bottleneck"],
            "security": ["security", "vulnerability", "secure", "auth", "validation"],
            "correctness": ["correct", "logic", "error", "edge case", "validation"],
            "testing": ["test", "coverage", "unit", "integration"],
            "documentation": ["doc", "comment", "readme", "api"]
        }
        
        detected_focus = []
        for focus, keywords in focus_keywords.items():
            if any(keyword in criteria_text.lower() for keyword in keywords):
                detected_focus.append(focus)
        
        # Generate custom style guide
        custom_rules = self._extract_custom_rules(criteria_text)
        
        result = {
            "focus": "Custom criteria",
            "detected_focus_areas": detected_focus,
            "custom_rules": custom_rules,
            "style_guide": self._generate_custom_style_guide(criteria_text, detected_focus)
        }
        
        return result
    
    def _extract_custom_rules(self, criteria_text: str) -> List[str]:
        """Extract specific rules from custom criteria text."""
        # Simple rule extraction - look for bullet points, numbered lists, or sentences
        lines = criteria_text.split('\n')
        rules = []
        
        for line in lines:
            line = line.strip()
            if line:
                # Remove common bullet point markers
                line = re.sub(r'^[-*•]\s*', '', line)
                line = re.sub(r'^\d+\.\s*', '', line)
                
                if line and len(line) > 10:  # Filter out very short lines
                    rules.append(line)
        
        return rules
    
    def _generate_style_guide(self, criteria_data: Dict[str, Any]) -> str:
        """Generate a comprehensive style guide from criteria."""
        focus = criteria_data.get("focus", "Code quality")
        rules = criteria_data.get("rules", [])
        custom_additions = criteria_data.get("custom_additions", [])
        
        style_guide = f"# Style Guide: {focus}\n\n"
        
        if rules:
            style_guide += "## Standard Rules\n"
            for rule in rules:
                style_guide += f"- {rule}\n"
            style_guide += "\n"
        
        if custom_additions:
            style_guide += "## Custom Requirements\n"
            for addition in custom_additions:
                style_guide += f"- {addition}\n"
            style_guide += "\n"
        
        style_guide += "## Review Focus\n"
        style_guide += f"All code changes should be evaluated against these {focus.lower()} criteria. "
        style_guide += "Comments should be specific and actionable, referencing the relevant rules above."
        
        return style_guide
    
    def _generate_custom_style_guide(self, criteria_text: str, focus_areas: List[str]) -> str:
        """Generate a style guide for custom criteria."""
        style_guide = "# Custom Style Guide\n\n"
        
        if focus_areas:
            style_guide += "## Detected Focus Areas\n"
            for area in focus_areas:
                style_guide += f"- {area.title()}\n"
            style_guide += "\n"
        
        style_guide += "## Custom Requirements\n"
        style_guide += f"{criteria_text}\n\n"
        
        style_guide += "## Review Instructions\n"
        style_guide += "Review the code changes according to the custom criteria provided above. "
        style_guide += "Provide specific, actionable feedback that addresses these requirements."
        
        return style_guide
    
    def get_relevant_documents(self, criteria_data: Dict[str, Any]) -> List[RetrievedDocument]:
        """Get relevant documents based on criteria for context."""
        focus = criteria_data.get("focus", "").lower()
        
        # Mock relevant documents based on focus
        if "style" in focus:
            return [
                RetrievedDocument(
                    content="Python PEP 8 Style Guide: Use 4 spaces for indentation, snake_case for variables",
                    source="PEP 8",
                    relevance_score=0.9
                )
            ]
        elif "security" in focus:
            return [
                RetrievedDocument(
                    content="OWASP Top 10: Validate all inputs, use parameterized queries, implement proper authentication",
                    source="OWASP",
                    relevance_score=0.9
                )
            ]
        elif "performance" in focus:
            return [
                RetrievedDocument(
                    content="Performance best practices: Use efficient data structures, avoid N+1 queries, profile bottlenecks",
                    source="Performance Guide",
                    relevance_score=0.9
                )
            ]
        
        return [] 