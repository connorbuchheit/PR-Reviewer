"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Clock,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  Brain,
  Search,
  Code,
  Package,
  FileText,
  Timer,
} from "lucide-react"

interface TimelineStep {
  timestamp: string
  node_id: string
  title: string
  type: "retrieval" | "reasoning" | "analysis" | "tool_call" | "generation"
  duration: string
  durationMs: number
  status: "completed" | "in_progress" | "failed"
  reasoning?: string
  details?: {
    inputs?: any
    outputs?: any
    confidence?: number
  }
}

const mockTimelineData: TimelineStep[] = [
  {
    timestamp: "10:30:00.000",
    node_id: "context_gathering",
    title: "Repository Context Analysis",
    type: "retrieval",
    duration: "2.3s",
    durationMs: 2300,
    status: "completed",
    reasoning: "Analyzed repository structure, existing patterns, and tech stack to understand the codebase context.",
    details: {
      inputs: { pr_files: 8, lines_changed: 199 },
      outputs: { patterns_found: 3, tech_stack_identified: true },
      confidence: 0.95,
    },
  },
  {
    timestamp: "10:30:02.300",
    node_id: "style_analysis",
    title: "Apply Performance Review Criteria",
    type: "reasoning",
    duration: "1.8s",
    durationMs: 1800,
    status: "completed",
    reasoning: "Applied performance-focused review criteria, weighting query optimization and caching strategies.",
    details: {
      inputs: { criteria: "performance", style_guide: "loaded" },
      outputs: { focus_areas: 4, weight_distribution: "calculated" },
      confidence: 0.92,
    },
  },
  {
    timestamp: "10:30:04.100",
    node_id: "db_analysis",
    title: "Database Query Evaluation",
    type: "analysis",
    duration: "2.1s",
    durationMs: 2100,
    status: "completed",
    reasoning:
      "Evaluated database query optimizations and identified both performance improvements and security concerns.",
    details: {
      inputs: { files_analyzed: 1, queries_reviewed: 5 },
      outputs: { performance_score: 92, security_issues: 1 },
      confidence: 0.85,
    },
  },
  {
    timestamp: "10:30:06.200",
    node_id: "cache_analysis",
    title: "Redis Caching Implementation",
    type: "analysis",
    duration: "1.9s",
    durationMs: 1900,
    status: "completed",
    reasoning: "Analyzed Redis caching implementation, found good strategy but identified scalability concerns.",
    details: {
      inputs: { cache_files: 1, redis_operations: 3 },
      outputs: { implementation_score: 78, scalability_issues: 1 },
      confidence: 0.78,
    },
  },
  {
    timestamp: "10:30:08.100",
    node_id: "dependency_analysis",
    title: "Package Recommendations",
    type: "tool_call",
    duration: "1.5s",
    durationMs: 1500,
    status: "completed",
    reasoning:
      "Analyzed current dependencies and identified better alternatives for TypeScript support and performance.",
    details: {
      inputs: { current_packages: 2, analysis_queries: 2 },
      outputs: { recommendations: 2, compatibility_checked: true },
      confidence: 0.88,
    },
  },
  {
    timestamp: "10:30:09.600",
    node_id: "error_handling_analysis",
    title: "Error Handling Evaluation",
    type: "reasoning",
    duration: "1.4s",
    durationMs: 1400,
    status: "completed",
    reasoning:
      "Evaluated error handling patterns, found basic implementation but identified gaps for production reliability.",
    details: {
      inputs: { error_patterns_checked: 5, code_blocks: 8 },
      outputs: { coverage_score: 65, missing_patterns: 3 },
      confidence: 0.82,
    },
  },
  {
    timestamp: "10:30:11.000",
    node_id: "test_analysis",
    title: "Test Coverage Assessment",
    type: "analysis",
    duration: "1.2s",
    durationMs: 1200,
    status: "completed",
    reasoning: "Assessed test coverage and quality, found good unit tests but lacking integration test coverage.",
    details: {
      inputs: { test_files: 2, coverage_data: "65%" },
      outputs: { unit_test_score: 80, integration_score: 45 },
      confidence: 0.75,
    },
  },
  {
    timestamp: "10:30:12.200",
    node_id: "summary_generation",
    title: "Review Summary Creation",
    type: "generation",
    duration: "2.8s",
    durationMs: 2800,
    status: "completed",
    reasoning: "Synthesized all analysis results into a comprehensive review summary with actionable recommendations.",
    details: {
      inputs: { analysis_nodes: 6, scores_aggregated: 4 },
      outputs: { summary_generated: true, recommendations: 5 },
      confidence: 0.87,
    },
  },
]

const getStepIcon = (type: string) => {
  switch (type) {
    case "retrieval":
      return <Search className="h-4 w-4" />
    case "reasoning":
      return <Brain className="h-4 w-4" />
    case "analysis":
      return <Code className="h-4 w-4" />
    case "tool_call":
      return <Package className="h-4 w-4" />
    case "generation":
      return <FileText className="h-4 w-4" />
    default:
      return <CheckCircle className="h-4 w-4" />
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case "retrieval":
      return "text-blue-600 bg-blue-50"
    case "reasoning":
      return "text-purple-600 bg-purple-50"
    case "analysis":
      return "text-green-600 bg-green-50"
    case "tool_call":
      return "text-orange-600 bg-orange-50"
    case "generation":
      return "text-pink-600 bg-pink-50"
    default:
      return "text-gray-600 bg-gray-50"
  }
}

export function ReasoningTimeline() {
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set())

  const toggleExpanded = (nodeId: string) => {
    const newExpanded = new Set(expandedSteps)
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId)
    } else {
      newExpanded.add(nodeId)
    }
    setExpandedSteps(newExpanded)
  }

  const totalDuration = mockTimelineData.reduce((sum, step) => sum + step.durationMs, 0)
  const formatTime = (timestamp: string) => {
    return new Date(`2024-01-15T${timestamp}Z`).toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      fractionalSecondDigits: 3,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Timer className="h-5 w-5" />
          Reasoning Timeline
        </CardTitle>
        <CardDescription>
          Chronological breakdown of the review process ({(totalDuration / 1000).toFixed(1)}s total)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Timeline Overview */}
        <div className="mb-6 p-4 bg-slate-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Timeline Overview</span>
            <span className="text-sm text-slate-600">{(totalDuration / 1000).toFixed(1)}s total</span>
          </div>
          <div className="flex gap-1 h-2 bg-slate-200 rounded-full overflow-hidden">
            {mockTimelineData.map((step, index) => {
              const widthPercent = (step.durationMs / totalDuration) * 100
              return (
                <div
                  key={step.node_id}
                  className={`h-full ${getTypeColor(step.type).split(" ")[1]} transition-all hover:opacity-80`}
                  style={{ width: `${widthPercent}%` }}
                  title={`${step.title}: ${step.duration}`}
                />
              )
            })}
          </div>
        </div>

        {/* Timeline Steps */}
        <div className="space-y-4">
          {mockTimelineData.map((step, index) => {
            const isExpanded = expandedSteps.has(step.node_id)
            const widthPercent = (step.durationMs / totalDuration) * 100

            return (
              <div key={step.node_id} className="relative">
                {/* Timeline connector line */}
                {index < mockTimelineData.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-8 bg-slate-200" />
                )}

                <div className="flex items-start gap-4">
                  {/* Timeline dot */}
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-full border-2 border-white shadow-sm flex items-center justify-center ${getTypeColor(step.type)}`}
                  >
                    {getStepIcon(step.type)}
                  </div>

                  {/* Step content */}
                  <div className="flex-1 min-w-0">
                    <div
                      className="cursor-pointer hover:bg-slate-50 p-3 rounded-lg transition-colors"
                      onClick={() => toggleExpanded(step.node_id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-slate-900">{step.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {step.type}
                          </Badge>
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-slate-400" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-slate-400" />
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {step.duration}
                          </span>
                          <span>{formatTime(step.timestamp)}</span>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                      </div>

                      {/* Duration bar */}
                      <div className="mb-2">
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                          <span>Processing time</span>
                          <span>{widthPercent.toFixed(1)}% of total</span>
                        </div>
                        <Progress value={widthPercent} className="h-1" />
                      </div>

                      {/* Brief reasoning */}
                      <p className="text-sm text-slate-600">{step.reasoning}</p>
                    </div>

                    {/* Expanded details */}
                    {isExpanded && step.details && (
                      <div className="mt-3 p-4 bg-slate-50 rounded-lg border-l-4 border-blue-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          {step.details.confidence && (
                            <div>
                              <span className="font-medium text-slate-700">Confidence:</span>
                              <div className="flex items-center gap-2 mt-1">
                                <Progress value={step.details.confidence * 100} className="h-2 flex-1" />
                                <span className="text-green-600 font-medium">
                                  {Math.round(step.details.confidence * 100)}%
                                </span>
                              </div>
                            </div>
                          )}

                          <div>
                            <span className="font-medium text-slate-700">Inputs:</span>
                            <div className="mt-1 text-xs text-slate-600">
                              {step.details.inputs &&
                                Object.entries(step.details.inputs).map(([key, value]) => (
                                  <div key={key} className="flex justify-between">
                                    <span>{key}:</span>
                                    <span className="font-mono">{String(value)}</span>
                                  </div>
                                ))}
                            </div>
                          </div>

                          <div>
                            <span className="font-medium text-slate-700">Outputs:</span>
                            <div className="mt-1 text-xs text-slate-600">
                              {step.details.outputs &&
                                Object.entries(step.details.outputs).map(([key, value]) => (
                                  <div key={key} className="flex justify-between">
                                    <span>{key}:</span>
                                    <span className="font-mono">{String(value)}</span>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
