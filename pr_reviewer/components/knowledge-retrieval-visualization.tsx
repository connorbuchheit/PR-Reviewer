"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Search,
  Database,
  FileText,
  Shield,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  Brain,
} from "lucide-react"
import type { KnowledgeRetrievalStep } from "@/types/knowledge-retrieval"

interface KnowledgeRetrievalVisualizationProps {
  step: KnowledgeRetrievalStep
  isActive?: boolean
}

const mockRetrievalStep: KnowledgeRetrievalStep = {
  id: "retrieval_1",
  timestamp: 6200,
  query: {
    id: "query_1",
    query: "SQL injection prevention patterns database queries",
    context: "Analyzing database query security in src/database/queries.ts",
    timestamp: 6200,
    retrievalType: "policy",
    filters: {
      sources: ["company_policies", "security_guidelines"],
      types: ["policy", "guideline"],
      minConfidence: 0.8,
      maxAge: 90,
    },
  },
  results: [
    {
      id: "result_1",
      queryId: "query_1",
      item: {
        id: "policy_sql_injection",
        sourceId: "security_guidelines",
        title: "SQL Injection Prevention Policy",
        content:
          "All database queries must use parameterized statements or prepared queries. Direct string interpolation is prohibited.",
        type: "policy",
        tags: ["security", "database", "sql-injection"],
        lastUpdated: "2024-01-10T09:15:00Z",
        confidence: 0.95,
      },
      relevanceScore: 0.92,
      retrievalReason: "High semantic match for SQL security patterns",
      usedInReasoning: true,
    },
    {
      id: "result_2",
      queryId: "query_1",
      item: {
        id: "example_prepared_statements",
        sourceId: "github_repo",
        title: "Prepared Statement Examples",
        content: "const query = 'SELECT * FROM users WHERE id = ?'; db.query(query, [userId]);",
        type: "example",
        tags: ["database", "security", "typescript"],
        lastUpdated: "2024-01-14T15:30:00Z",
        confidence: 0.88,
      },
      relevanceScore: 0.85,
      retrievalReason: "Code pattern match from repository examples",
      usedInReasoning: true,
    },
    {
      id: "result_3",
      queryId: "query_1",
      item: {
        id: "guideline_db_best_practices",
        sourceId: "company_policies",
        title: "Database Best Practices",
        content: "Use ORM query builders when possible, validate all inputs, implement connection pooling.",
        type: "guideline",
        tags: ["database", "performance", "security"],
        lastUpdated: "2024-01-12T11:20:00Z",
        confidence: 0.82,
      },
      relevanceScore: 0.71,
      retrievalReason: "Related database practices",
      usedInReasoning: false,
    },
  ],
  selectedKnowledge: [
    {
      id: "result_1",
      queryId: "query_1",
      item: {
        id: "policy_sql_injection",
        sourceId: "security_guidelines",
        title: "SQL Injection Prevention Policy",
        content:
          "All database queries must use parameterized statements or prepared queries. Direct string interpolation is prohibited.",
        type: "policy",
        tags: ["security", "database", "sql-injection"],
        lastUpdated: "2024-01-10T09:15:00Z",
        confidence: 0.95,
      },
      relevanceScore: 0.92,
      retrievalReason: "High semantic match for SQL security patterns",
      usedInReasoning: true,
    },
  ],
  reasoning:
    "Found company security policy that directly prohibits the pattern detected in the code. This gives me high confidence to flag this as a policy violation.",
  confidence: 0.95,
  impactOnDecision: "high",
}

const getRetrievalTypeIcon = (type: string) => {
  switch (type) {
    case "semantic":
      return <Brain className="h-4 w-4" />
    case "keyword":
      return <Search className="h-4 w-4" />
    case "pattern":
      return <Zap className="h-4 w-4" />
    case "policy":
      return <Shield className="h-4 w-4" />
    case "example":
      return <FileText className="h-4 w-4" />
    default:
      return <Database className="h-4 w-4" />
  }
}

const getImpactColor = (impact: string) => {
  switch (impact) {
    case "high":
      return "bg-red-900/30 text-red-400 border-red-600"
    case "medium":
      return "bg-yellow-900/30 text-yellow-400 border-yellow-600"
    case "low":
      return "bg-blue-900/30 text-blue-400 border-blue-600"
    case "none":
      return "bg-gray-900/30 text-gray-400 border-gray-600"
    default:
      return "bg-gray-900/30 text-gray-400 border-gray-600"
  }
}

export function KnowledgeRetrievalVisualization({ step, isActive = false }: KnowledgeRetrievalVisualizationProps) {
  const [isExpanded, setIsExpanded] = useState(isActive)

  const usedCount = step.results.filter((r) => r.usedInReasoning).length
  const totalCount = step.results.length

  return (
    <Card className={`bg-black border-slate-700 ${isActive ? "ring-2 ring-orange-500" : ""}`}>
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-slate-800/50 transition-colors">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-full bg-orange-900/30 text-orange-400`}>
                  <Database className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-white">Knowledge Retrieval</span>
                <Badge variant="outline" className="text-xs border-slate-600 text-white/70">
                  {getRetrievalTypeIcon(step.query.retrievalType)}
                  <span className="ml-1">{step.query.retrievalType}</span>
                </Badge>
                {isActive && (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                    <span className="text-xs text-orange-400 font-medium">Searching</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge className={`text-xs ${getImpactColor(step.impactOnDecision)}`}>
                  {step.impactOnDecision} impact
                </Badge>
                <span className="text-xs text-white/50">
                  {usedCount}/{totalCount} used
                </span>
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-white/60" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-white/60" />
                )}
              </div>
            </CardTitle>
            <CardDescription className="text-left">
              <span className="font-mono text-xs bg-slate-800 px-2 py-1 rounded text-white/80">{step.query.query}</span>
            </CardDescription>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0 space-y-4">
            {/* Query Details */}
            <div className="p-3 bg-slate-800 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-white">Search Context:</span>
                <span className="text-white/60">{step.query.context}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-white">Confidence:</span>
                <div className="flex items-center gap-2">
                  <Progress value={step.confidence * 100} className="w-16 h-2 bg-slate-700" />
                  <span className="text-white/60">{Math.round(step.confidence * 100)}%</span>
                </div>
              </div>
            </div>

            {/* Retrieved Knowledge */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm flex items-center gap-2 text-white">
                <Search className="h-4 w-4" />
                Retrieved Knowledge ({step.results.length} results)
              </h4>

              {step.results.map((result, index) => (
                <div
                  key={result.id}
                  className={`border rounded-lg p-3 ${
                    result.usedInReasoning
                      ? "bg-green-900/20 border-green-600"
                      : "bg-slate-800/50 border-slate-600 opacity-75"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs border-slate-600 text-white/70">
                        {result.item.type}
                      </Badge>
                      <span className="font-medium text-sm text-white">{result.item.title}</span>
                      {result.usedInReasoning && (
                        <Badge className="text-xs bg-green-900/30 text-green-400 border-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Used
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/60">
                      <TrendingUp className="h-3 w-3" />
                      {Math.round(result.relevanceScore * 100)}% match
                    </div>
                  </div>

                  <p className="text-sm text-white/70 mb-2">{result.item.content}</p>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-white/50">
                      <Clock className="h-3 w-3" />
                      <span>From {result.item.sourceId}</span>
                      <span>•</span>
                      <span>{new Date(result.item.lastUpdated).toLocaleDateString()}</span>
                    </div>
                    <span className="text-white/60 italic">{result.retrievalReason}</span>
                  </div>

                  {result.conflictsWith && result.conflictsWith.length > 0 && (
                    <div className="mt-2 p-2 bg-yellow-900/20 border border-yellow-600 rounded text-xs">
                      <div className="flex items-center gap-1 text-yellow-400">
                        <AlertTriangle className="h-3 w-3" />
                        <span className="font-medium">Conflicts with {result.conflictsWith.length} other sources</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Reasoning Impact */}
            <div className="p-3 bg-blue-900/20 border border-blue-600 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-4 w-4 text-blue-400" />
                <span className="font-medium text-sm text-blue-300">Impact on Reasoning</span>
              </div>
              <p className="text-sm text-blue-200">{step.reasoning}</p>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
