import type { KnowledgeItem, ChainOfThoughtStep } from "./some-module" // Assuming these are declared in another module

export interface KnowledgeQuery {
  id: string
  query: string
  context: string
  timestamp: number
  retrievalType: "semantic" | "keyword" | "pattern" | "policy" | "example"
  filters: {
    sources?: string[]
    types?: string[]
    minConfidence?: number
    maxAge?: number // in days
  }
}

export interface RetrievedKnowledge {
  id: string
  queryId: string
  item: KnowledgeItem
  relevanceScore: number
  retrievalReason: string
  usedInReasoning: boolean
  conflictsWith?: RetrievedKnowledge[]
}

export interface KnowledgeRetrievalStep {
  id: string
  timestamp: number
  query: KnowledgeQuery
  results: RetrievedKnowledge[]
  selectedKnowledge: RetrievedKnowledge[]
  reasoning: string
  confidence: number
  impactOnDecision: "high" | "medium" | "low" | "none"
}

// Enhanced ChainOfThoughtStep to include knowledge retrieval
export interface EnhancedChainOfThoughtStep extends ChainOfThoughtStep {
  knowledgeRetrieval?: KnowledgeRetrievalStep
  appliedPolicies?: string[]
  conflictingKnowledge?: string[]
  knowledgeConfidence?: number
}
