export interface KnowledgeConflict {
  id: string
  title: string
  description: string
  severity: "high" | "medium" | "low"
  conflictType: "policy_contradiction" | "pattern_mismatch" | "version_conflict" | "scope_disagreement"
  sources: ConflictingSource[]
  context: {
    prFile?: string
    prLine?: number
    codeSnippet?: string
    reviewStep: string
  }
  impact: "blocks_review" | "requires_clarification" | "informational"
  timestamp: string
  status: "pending" | "escalated" | "resolved"
  humanReviewRequired: boolean
  suggestedResolution?: string
}

export interface ConflictingSource {
  sourceId: string
  sourceName: string
  sourceType: "github" | "confluence" | "pdf" | "notion" | "slack"
  position: string // What this source says
  confidence: number
  lastUpdated: string
  authority: "high" | "medium" | "low" // How authoritative this source is
  scope: "repository" | "team" | "organization" | "global"
}

export interface ConflictResolution {
  conflictId: string
  resolution: "source_a" | "source_b" | "custom" | "escalate"
  reasoning: string
  resolvedBy: "human" | "system"
  timestamp: string
  customGuidance?: string
}
