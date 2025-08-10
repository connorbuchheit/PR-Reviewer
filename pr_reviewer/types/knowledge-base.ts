export interface KnowledgeSource {
  id: string
  name: string
  type: "github" | "confluence" | "google_drive" | "slack" | "jira" | "notion" | "pdf" | "wiki"
  url?: string
  lastUpdated: string
  status: "active" | "syncing" | "error" | "stale"
  confidence: number
  priority: "high" | "medium" | "low"
  scope: "repository" | "organization" | "team" | "global"
}

export interface KnowledgeItem {
  id: string
  sourceId: string
  title: string
  content: string
  type: "policy" | "pattern" | "guideline" | "example" | "requirement" | "architecture"
  tags: string[]
  lastUpdated: string
  confidence: number
  relevanceScore?: number
  conflictsWith?: string[] // IDs of conflicting knowledge items
}

export interface PolicyViolation {
  id: string
  severity: "error" | "warning" | "info"
  policyId: string
  policyTitle: string
  description: string
  suggestion: string
  confidence: number
  sourceFile?: string
  sourceLine?: number
}

export interface KnowledgeContext {
  prContext: {
    files: string[]
    technologies: string[]
    changeType: "feature" | "bugfix" | "refactor" | "security" | "performance"
  }
  relevantPolicies: KnowledgeItem[]
  recentPatterns: KnowledgeItem[]
  violations: PolicyViolation[]
}
