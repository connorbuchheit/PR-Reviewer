import type { KnowledgeConflict } from "@/components/knowledge-conflicts"

export const knowledgeConflictsData: Record<string, KnowledgeConflict[]> = {
  pr_142: [
    {
      id: "conflict_1",
      title: "Database Connection Pooling Requirements",
      description: "Security policy requires pooling, but team guidelines suggest it's optional for small services.",
      severity: "high",
      conflictType: "policy_contradiction",
      sources: [
        {
          sourceId: "security_guidelines",
          sourceName: "Security Guidelines",
          sourceType: "pdf",
          position: "All database connections MUST use connection pooling for security and performance.",
          confidence: 0.95,
          lastUpdated: "2024-01-10T09:15:00Z",
          authority: "high",
          scope: "organization",
        },
        {
          sourceId: "team_patterns",
          sourceName: "Team Best Practices",
          sourceType: "notion",
          position: "Connection pooling is recommended but not required for services with < 100 concurrent users.",
          confidence: 0.82,
          lastUpdated: "2024-01-15T08:45:00Z",
          authority: "medium",
          scope: "team",
        },
      ],
      context: {
        prFile: "src/cache/redis.ts",
        prLine: 15,
        codeSnippet: "const client = redis.createClient()",
        reviewStep: "cache_analysis",
      },
      impact: "blocks_review",
      timestamp: "2024-01-15T10:30:00Z",
      status: "pending",
      humanReviewRequired: true,
      suggestedResolution: "Escalate to security team for clarification on small service exceptions.",
    },
    {
      id: "conflict_2",
      title: "SQL Query Security Standards",
      description: "Clear security violation detected with no conflicting guidance - requires immediate fix.",
      severity: "high",
      conflictType: "security_violation",
      sources: [
        {
          sourceId: "security_policy",
          sourceName: "Security Policy",
          sourceType: "confluence",
          position: "All SQL queries must use parameterized statements to prevent injection attacks.",
          confidence: 0.98,
          lastUpdated: "2024-01-01T00:00:00Z",
          authority: "high",
          scope: "organization",
        },
      ],
      context: {
        prFile: "src/database/queries.ts",
        prLine: 23,
        codeSnippet: "const query = `SELECT * FROM users WHERE id = ${userId}`",
        reviewStep: "security_analysis",
      },
      impact: "blocks_review",
      timestamp: "2024-01-15T10:25:00Z",
      status: "pending",
      humanReviewRequired: true,
      suggestedResolution: "Fix SQL injection vulnerability before approval.",
    },
  ],
  pr_140: [], // No conflicts - clean TypeScript migration
  pr_139: [], // No conflicts - clean bug fix
  pr_138: [], // No conflicts - excellent testing
  pr_136: [
    {
      id: "conflict_1",
      title: "Dependency Update Documentation",
      description: "Breaking changes in dependencies but unclear documentation update requirements.",
      severity: "medium",
      conflictType: "process_ambiguity",
      sources: [
        {
          sourceId: "deployment_guide",
          sourceName: "Deployment Guide",
          sourceType: "wiki",
          position: "All breaking changes must be documented in deployment notes.",
          confidence: 0.85,
          lastUpdated: "2024-01-05T10:00:00Z",
          authority: "medium",
          scope: "team",
        },
        {
          sourceId: "changelog_practice",
          sourceName: "Changelog Practices",
          sourceType: "slack",
          position: "Dependency updates don't require detailed documentation unless they affect API.",
          confidence: 0.65,
          lastUpdated: "2024-01-12T14:30:00Z",
          authority: "low",
          scope: "team",
        },
      ],
      context: {
        prFile: "package.json",
        reviewStep: "documentation_analysis",
      },
      impact: "requires_clarification",
      timestamp: "2024-01-15T10:20:00Z",
      status: "pending",
      humanReviewRequired: false,
      suggestedResolution: "Add brief documentation note for major version updates.",
    },
  ],
}
