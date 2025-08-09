#!/usr/bin/env python3
"""
PR Review Agent CLI - Main entry point for the application.
"""

import click
import json
from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.text import Text
from rich.progress import Progress, SpinnerColumn, TextColumn
from pathlib import Path
import sys
import os

# Add parent directory to path for imports
sys.path.append(str(Path(__file__).parent.parent.parent))

from agent.orchestrator.review_orchestrator import ReviewOrchestrator
from config.settings import settings


console = Console()


@click.group()
@click.version_option(version="1.0.0")
def cli():
    """PR Review Agent - Intelligent code review with full reasoning trace logging."""
    pass


@cli.command()
@click.option('--repo', default='demo-repo', help='Repository name')
@click.option('--pr', default=1, help='Pull request number')
@click.option('--criteria', default='strict style', help='Review criteria')
@click.option('--output', '-o', help='Output file for results')
def review(repo, pr, criteria, output):
    """Review a pull request with the specified criteria."""
    
    if not settings.openai_api_key:
        console.print("[red]Error: OpenAI API key not found. Set OPENAI_API_KEY environment variable.[/red]")
        return
    
    console.print(Panel(f"[bold blue]PR Review Agent[/bold blue]\n"
                       f"Repository: {repo}\n"
                       f"PR: #{pr}\n"
                       f"Criteria: {criteria}", 
                       title="Review Configuration"))
    
    orchestrator = ReviewOrchestrator()
    
    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        console=console
    ) as progress:
        task = progress.add_task("Reviewing PR...", total=None)
        
        try:
            result = orchestrator.review_pull_request(repo, pr, criteria)
            progress.update(task, description="Review completed!")
            
            if result["success"]:
                _display_review_results(result, output)
            else:
                console.print(f"[red]Review failed: {result.get('error', 'Unknown error')}[/red]")
                
        except Exception as e:
            progress.update(task, description="Review failed!")
            console.print(f"[red]Error during review: {str(e)}[/red]")


@cli.command()
@click.option('--session-id', help='Specific session ID to view')
@click.option('--output', '-o', help='Output file for results')
def sessions(session_id, output):
    """List review sessions or view a specific session."""
    
    orchestrator = ReviewOrchestrator()
    
    if session_id:
        # View specific session
        session_details = orchestrator.get_session_details(session_id)
        if session_details:
            _display_session_details(session_details, output)
        else:
            console.print(f"[red]Session {session_id} not found[/red]")
    else:
        # List all sessions
        sessions_list = orchestrator.list_sessions()
        _display_sessions_list(sessions_list, output)


@cli.command()
@click.argument('session_id')
@click.option('--criteria', help='New criteria for replay')
@click.option('--output', '-o', help='Output file for results')
def replay(session_id, criteria, output):
    """Replay a review session with optional new criteria."""
    
    if not settings.openai_api_key:
        console.print("[red]Error: OpenAI API key not found. Set OPENAI_API_KEY environment variable.[/red]")
        return
    
    orchestrator = ReviewOrchestrator()
    
    console.print(Panel(f"[bold blue]Replaying Session[/bold blue]\n"
                       f"Session ID: {session_id}\n"
                       f"New Criteria: {criteria or 'Original criteria'}", 
                       title="Replay Configuration"))
    
    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        console=console
    ) as progress:
        task = progress.add_task("Replaying session...", total=None)
        
        try:
            result = orchestrator.replay_session(session_id, criteria)
            progress.update(task, description="Replay completed!")
            
            if "error" in result:
                console.print(f"[red]Replay failed: {result['error']}[/red]")
            else:
                _display_review_results(result, output)
                
        except Exception as e:
            progress.update(task, description="Replay failed!")
            console.print(f"[red]Error during replay: {str(e)}[/red]")


@cli.command()
def stats():
    """Show review statistics."""
    
    orchestrator = ReviewOrchestrator()
    
    try:
        stats = orchestrator.get_review_statistics()
        _display_statistics(stats)
    except Exception as e:
        console.print(f"[red]Error getting statistics: {str(e)}[/red]")


@cli.command()
def config():
    """Show current configuration."""
    
    console.print(Panel(
        f"[bold blue]Configuration[/bold blue]\n"
        f"OpenAI Model: {settings.openai_model}\n"
        f"Temperature: {settings.openai_temperature}\n"
        f"Top P: {settings.openai_top_p}\n"
        f"Logs Directory: {settings.logs_dir}\n"
        f"Max Retrieval Docs: {settings.max_retrieval_docs}\n"
        f"Max Context Length: {settings.max_context_length}",
        title="Current Settings"
    ))


def _display_review_results(result, output_file):
    """Display review results in a formatted way."""
    
    review = result["review"]
    session_id = result["session_id"]
    
    # Create results table
    table = Table(title=f"PR Review Results - Session {session_id}")
    table.add_column("Metric", style="cyan")
    table.add_column("Value", style="green")
    
    table.add_row("Comments", str(len(review.get("comments", []))))
    table.add_row("Package Suggestions", str(len(review.get("package_suggestions", []))))
    table.add_row("Style Score", f"{review.get('style_adherence_score', 'N/A')}")
    table.add_row("Security Rating", review.get("security_risk_rating", "N/A"))
    table.add_row("Optimization Potential", review.get("optimization_potential", "N/A"))
    
    console.print(table)
    
    # Display high-level summary
    console.print(Panel(
        review.get("high_level_summary_md", "**No summary available**"),
        title="High-Level Summary",
        style="bold blue"
    ))
    
    # Display comment summary
    console.print(Panel(
        review.get("comment_summary", "No comment summary available"),
        title="Comment Summary",
        style="bold green"
    ))
    
    # Display comments
    if review.get("comments"):
        comments_table = Table(title="Comments")
        comments_table.add_column("File", style="cyan")
        comments_table.add_column("Line", style="yellow")
        comments_table.add_column("Comment", style="white")
        comments_table.add_column("Severity", style="red")
        
        for comment in review["comments"]:
            comments_table.add_row(
                comment.get("file_path", "Unknown"),
                str(comment.get("line_number", "N/A")),
                comment.get("comment_text", "No comment")[:100] + "..." if len(comment.get("comment_text", "")) > 100 else comment.get("comment_text", "No comment"),
                comment.get("severity", "info")
            )
        
        console.print(comments_table)
    
    # Display package suggestions
    if review.get("package_suggestions"):
        packages_table = Table(title="Package Suggestions")
        packages_table.add_column("Package", style="cyan")
        packages_table.add_column("Reason", style="white")
        packages_table.add_column("Version", style="yellow")
        
        for pkg in review["package_suggestions"]:
            packages_table.add_row(
                pkg.get("name", "Unknown"),
                pkg.get("reason", "No reason provided"),
                pkg.get("version", "Latest")
            )
        
        console.print(packages_table)
    
    # Save to file if requested
    if output_file:
        try:
            with open(output_file, 'w') as f:
                json.dump(result, f, indent=2, default=str)
            console.print(f"[green]Results saved to {output_file}[/green]")
        except Exception as e:
            console.print(f"[red]Error saving to file: {str(e)}[/red]")


def _display_sessions_list(sessions_list, output_file):
    """Display list of review sessions."""
    
    table = Table(title="Review Sessions")
    table.add_column("Session ID", style="cyan")
    table.add_column("Repository", style="green")
    table.add_column("PR Number", style="yellow")
    table.add_column("Criteria", style="white")
    table.add_column("Status", style="red")
    table.add_column("Timestamp", style="blue")
    
    for session in sessions_list["sessions"]:
        summary = session["summary"]
        status = "✅" if summary["success"] else "❌"
        
        table.add_row(
            session["session_id"][:20] + "...",
            summary.get("repo", "Unknown"),
            str(summary.get("pr_number", "Unknown")),
            summary.get("criteria", "No criteria")[:50] + "...",
            status,
            summary.get("timestamp", "Unknown")[:19] if summary.get("timestamp") else "Unknown"
        )
    
    console.print(table)
    console.print(f"Total Sessions: {sessions_list['total_sessions']}")
    
    # Save to file if requested
    if output_file:
        try:
            with open(output_file, 'w') as f:
                json.dump(sessions_list, f, indent=2, default=str)
            console.print(f"[green]Sessions list saved to {output_file}[/green]")
        except Exception as e:
            console.print(f"[red]Error saving to file: {str(e)}[/red]")


def _display_session_details(session_details, output_file):
    """Display detailed session information."""
    
    session = session_details["session"]
    steps = session_details["steps"]
    
    # Session overview
    console.print(Panel(
        f"[bold blue]Session Details[/bold blue]\n"
        f"Session ID: {session.get('session_id', 'Unknown')}\n"
        f"Repository: {session['pr_info'].get('repo', 'Unknown')}\n"
        f"PR Number: {session['pr_info'].get('pr_number', 'Unknown')}\n"
        f"Criteria: {session.get('criteria_text', 'No criteria')}\n"
        f"Status: {'✅ Success' if session.get('success') else '❌ Failed'}\n"
        f"Start Time: {session.get('start_time', 'Unknown')}\n"
        f"End Time: {session.get('end_time', 'Unknown')}",
        title="Session Overview"
    ))
    
    # Steps table
    if steps:
        steps_table = Table(title="Reasoning Steps")
        steps_table.add_column("Step ID", style="cyan")
        steps_table.add_column("Type", style="green")
        steps_table.add_column("Timestamp", style="yellow")
        steps_table.add_column("Status", style="red")
        
        for step in steps:
            steps_table.add_row(
                step.get("step_id", "Unknown"),
                step.get("step_type", "Unknown").value,
                step.get("timestamp", "Unknown")[:19] if step.get("timestamp") else "Unknown",
                "✅" if not step.get("error") else "❌"
            )
        
        console.print(steps_table)
    
    # Save to file if requested
    if output_file:
        try:
            with open(output_file, 'w') as f:
                json.dump(session_details, f, indent=2, default=str)
            console.print(f"[green]Session details saved to {output_file}[/green]")
        except Exception as e:
            console.print(f"[red]Error saving to file: {str(e)}[/red]")


def _display_statistics(stats):
    """Display review statistics."""
    
    console.print(Panel(
        f"[bold blue]Review Statistics[/bold blue]\n"
        f"Total Sessions: {stats['total_sessions']}\n"
        f"Successful: {stats['successful_sessions']}\n"
        f"Failed: {stats['failed_sessions']}\n"
        f"Success Rate: {stats['success_rate']:.1%}\n"
        f"Total Comments: {stats['total_comments']}\n"
        f"Total Package Suggestions: {stats['total_package_suggestions']}\n"
        f"Avg Comments per Session: {stats['average_comments_per_session']:.1f}",
        title="Overall Statistics"
    ))
    
    # Criteria distribution
    if stats['criteria_distribution']:
        criteria_table = Table(title="Criteria Distribution")
        criteria_table.add_column("Criteria", style="cyan")
        criteria_table.add_column("Count", style="green")
        
        for criteria, count in sorted(stats['criteria_distribution'].items(), key=lambda x: x[1], reverse=True):
            criteria_table.add_row(criteria, str(count))
        
        console.print(criteria_table)
    
    # Repository distribution
    if stats['repository_distribution']:
        repo_table = Table(title="Repository Distribution")
        repo_table.add_column("Repository", style="cyan")
        repo_table.add_column("Count", style="green")
        
        for repo, count in sorted(stats['repository_distribution'].items(), key=lambda x: x[1], reverse=True):
            repo_table.add_row(repo, str(count))
        
        console.print(repo_table)


if __name__ == "__main__":
    cli() 