"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertTriangle,
  Users,
  Clock,
  Shield,
  Code,
  ExternalLink,
  MessageSquare,
  XCircle,
  Zap,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import type { KnowledgeConflict } from "@/components/knowledge-conflicts"

const mockKnowledgeConflicts: KnowledgeConflict[] = [
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
    title: "TypeScript Strict Mode Configuration",
    description: "Repository uses strict mode, but team discussion suggests relaxing some rules.",
    severity: "medium",
    conflictType: "pattern_mismatch",
    sources: [
      {
        sourceId: "github_repo",
        sourceName: "Current Repository",
        sourceType: "github",
        position: "tsconfig.json has strict: true with all strict checks enabled",
        confidence: 0.98,
        lastUpdated: "2024-01-14T15:30:00Z",
        authority: "high",
        scope: "repository",
      },
      {
        sourceId: "slack_discussions",
        sourceName: "Engineering Discussions",
        sourceType: "slack",
        position: "Team discussed relaxing strictNullChecks for faster development",
        confidence: 0.65,
        lastUpdated: "2024-01-15T10:30:00Z",
        authority: "low",
        scope: "team",
      },
    ],
    context: {
      prFile: "tsconfig.json",
      reviewStep: "style_analysis",
    },
    impact: "requires_clarification",
    timestamp: "2024-01-15T10:25:00Z",
    status: "pending",
    humanReviewRequired: true,
  },
]

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "high":
      return "bg-red-900/30 text-red-400 border-red-600"
    case "medium":
      return "bg-yellow-900/30 text-yellow-400 border-yellow-600"
    case "low":
      return "bg-blue-900/30 text-blue-400 border-blue-600"
    default:
      return "bg-gray-900/30 text-gray-400 border-gray-600"
  }
}

const getConflictTypeIcon = (type: string) => {
  switch (type) {
    case "policy_contradiction":
      return <Shield className="h-4 w-4" />
    case "pattern_mismatch":
      return <Code className="h-4 w-4" />
    case "version_conflict":
      return <Clock className="h-4 w-4" />
    case "scope_disagreement":
      return <Users className="h-4 w-4" />
    default:
      return <AlertTriangle className="h-4 w-4" />
  }
}

const getAuthorityColor = (authority: string) => {
  switch (authority) {
    case "high":
      return "bg-green-900/30 text-green-400 border-green-600"
    case "medium":
      return "bg-yellow-900/30 text-yellow-400 border-yellow-600"
    case "low":
      return "bg-red-900/30 text-red-400 border-red-600"
    default:
      return "bg-gray-900/30 text-gray-400 border-gray-600"
  }
}

export function KnowledgeConflicts() {
  const [resolutionNotes, setResolutionNotes] = useState("")
  const [expandedConflicts, setExpandedConflicts] = useState<Set<string>>(new Set())

  const toggleExpanded = (conflictId: string) => {
    const newExpanded = new Set(expandedConflicts)
    if (newExpanded.has(conflictId)) {
      newExpanded.delete(conflictId)
    } else {
      newExpanded.add(conflictId)
    }
    setExpandedConflicts(newExpanded)
  }

  const highSeverityCount = mockKnowledgeConflicts.filter((c) => c.severity === "high").length
  const blockingCount = mockKnowledgeConflicts.filter((c) => c.impact === "blocks_review").length
  const pendingCount = mockKnowledgeConflicts.filter((c) => c.status === "pending").length

  return (
    <div className="space-y-6">
      <Card className="bg-black border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Knowledge Base Conflicts
            </span>
          </CardTitle>
          <CardDescription className="text-white/70">
            Conflicting information detected across knowledge sources
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Simple Stats */}
          <div className="grid grid-cols-3 gap-4 p-3 bg-slate-800 rounded-lg">
            <div className="text-center">
              <div className="text-xl font-bold text-red-400">{blockingCount}</div>
              <div className="text-xs text-white/60">Blocking</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-yellow-400">{highSeverityCount}</div>
              <div className="text-xs text-white/60">High Severity</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-white">{pendingCount}</div>
              <div className="text-xs text-white/60">Pending</div>
            </div>
          </div>

          {/* Simple Conflicts List */}
          <div className="space-y-3">
            {mockKnowledgeConflicts.map((conflict) => {
              const isExpanded = expandedConflicts.has(conflict.id)

              return (
                <div key={conflict.id} className="border border-slate-700 rounded-lg bg-slate-900/30">
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className={`p-2 rounded ${getSeverityColor(conflict.severity)}`}>
                          {getConflictTypeIcon(conflict.conflictType)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-sm mb-1 text-white">{conflict.title}</h3>
                          <p className="text-sm text-white/70 mb-2">{conflict.description}</p>
                          <div className="flex items-center gap-2">
                            <Badge className={`text-xs ${getSeverityColor(conflict.severity)}`}>
                              {conflict.severity}
                            </Badge>
                            {conflict.impact === "blocks_review" && (
                              <Badge className="text-xs bg-red-900/30 text-red-400 border-red-600">
                                <XCircle className="h-3 w-3 mr-1" />
                                Blocks Review
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(conflict.id)}
                        className="flex-shrink-0 text-white hover:bg-slate-800"
                      >
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </Button>
                    </div>

                    {/* Context */}
                    {conflict.context.prFile && (
                      <div className="mb-3 p-2 bg-slate-800 rounded text-xs">
                        <span className="font-medium text-white">File:</span>{" "}
                        <span className="text-white/70">{conflict.context.prFile}</span>
                        {conflict.context.prLine && <span className="text-white/70">:{conflict.context.prLine}</span>}
                      </div>
                    )}

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="pt-3 border-t border-slate-700 space-y-3">
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm text-white">Conflicting Sources:</h4>
                          {conflict.sources.map((source, index) => (
                            <div key={source.sourceId} className="border border-slate-600 rounded p-3 bg-slate-800/50">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-sm text-white">{source.sourceName}</span>
                                <Badge className={`text-xs ${getAuthorityColor(source.authority)}`}>
                                  {source.authority}
                                </Badge>
                              </div>
                              <p className="text-sm text-white/70 italic">"{source.position}"</p>
                              <div className="text-xs text-white/50 mt-1">
                                {Math.round(source.confidence * 100)}% confident • {source.scope}
                              </div>
                            </div>
                          ))}
                        </div>

                        {conflict.suggestedResolution && (
                          <div className="p-3 bg-blue-900/20 border border-blue-800 rounded">
                            <div className="flex items-center gap-2 mb-1">
                              <Zap className="h-4 w-4 text-blue-400" />
                              <span className="font-medium text-sm text-blue-300">Suggested Resolution</span>
                            </div>
                            <p className="text-sm text-blue-200">{conflict.suggestedResolution}</p>
                          </div>
                        )}

                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-slate-600 text-white hover:bg-slate-800 bg-transparent"
                          >
                            <Users className="h-3 w-3 mr-1" />
                            Escalate
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-slate-600 text-white hover:bg-slate-800 bg-transparent"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View Sources
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Simple Resolution Notes */}
          <Card className="border-dashed border-slate-600 bg-slate-900/30">
            <CardHeader>
              <CardTitle className="text-sm text-white">Resolution Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add notes for human reviewers..."
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                className="mb-3 bg-slate-800 border-slate-600 text-white placeholder:text-white/50"
              />
              <Button
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <MessageSquare className="h-3 w-3 mr-1" />
                Send to Review Queue
              </Button>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}
