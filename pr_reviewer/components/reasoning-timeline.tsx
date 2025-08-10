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
import { reasoningTimelineData } from "@/data/reasoning-timeline-data"

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

interface ReasoningTimelineProps {
  prId?: string
}

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
      return "text-blue-400 bg-blue-500/40"
    case "reasoning":
      return "text-purple-400 bg-purple-500/40"
    case "analysis":
      return "text-green-400 bg-green-500/40"
    case "tool_call":
      return "text-orange-400 bg-orange-500/40"
    case "generation":
      return "text-pink-400 bg-pink-500/40"
    default:
      return "text-gray-400 bg-gray-500/40"
  }
}

const getTimelineBarColor = (type: string) => {
  switch (type) {
    case "retrieval":
      return "bg-blue-500/60 hover:bg-blue-500/80"
    case "reasoning":
      return "bg-purple-500/60 hover:bg-purple-500/80"
    case "analysis":
      return "bg-green-500/60 hover:bg-green-500/80"
    case "tool_call":
      return "bg-orange-500/60 hover:bg-orange-500/80"
    case "generation":
      return "bg-pink-500/60 hover:bg-pink-500/80"
    default:
      return "bg-gray-500/60 hover:bg-gray-500/80"
  }
}

export function ReasoningTimeline({ prId = "pr_142" }: ReasoningTimelineProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set())

  const mockTimelineData = reasoningTimelineData[prId] || reasoningTimelineData.pr_142

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
    <Card className="bg-black border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Timer className="h-5 w-5 text-purple-400" />
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Reasoning Timeline
          </span>
        </CardTitle>
        <CardDescription className="text-white/70">
          Chronological breakdown of the review process ({(totalDuration / 1000).toFixed(1)}s total)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Timeline Overview */}
        <div className="mb-6 p-4 bg-slate-800 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white">Timeline Overview</span>
            <span className="text-sm text-white/60">{(totalDuration / 1000).toFixed(1)}s total</span>
          </div>
          <div className="flex gap-1 h-2 bg-slate-700 rounded-full overflow-hidden">
            {mockTimelineData.map((step, index) => {
              const widthPercent = (step.durationMs / totalDuration) * 100

              return (
                <div
                  key={step.node_id}
                  className={`h-full transition-all duration-200 cursor-pointer hover:scale-y-125 hover:shadow-lg ${getTimelineBarColor(step.type)}`}
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
                  <div className="absolute left-6 top-12 w-0.5 h-8 bg-slate-600" />
                )}

                <div className="flex items-start gap-4">
                  {/* Timeline dot */}
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-full border-2 border-slate-600 shadow-sm flex items-center justify-center ${getTypeColor(step.type)}`}
                  >
                    {getStepIcon(step.type)}
                  </div>

                  {/* Step content */}
                  <div className="flex-1 min-w-0">
                    <div
                      className="cursor-pointer hover:bg-slate-800/50 p-3 rounded-lg transition-colors"
                      onClick={() => toggleExpanded(step.node_id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-white">{step.title}</h4>
                          <Badge variant="outline" className="text-xs border-slate-600 text-white/70">
                            {step.type}
                          </Badge>
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-white/40" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-white/40" />
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-white/60">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {step.duration}
                          </span>
                          <span>{formatTime(step.timestamp)}</span>
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        </div>
                      </div>

                      {/* Duration bar */}
                      <div className="mb-2">
                        <div className="flex items-center justify-between text-xs text-white/50 mb-1">
                          <span>Processing time</span>
                          <span>{widthPercent.toFixed(1)}% of total</span>
                        </div>
                        <Progress value={widthPercent} className="h-1 bg-slate-800" />
                      </div>

                      {/* Brief reasoning */}
                      <p className="text-sm text-white/70">{step.reasoning}</p>
                    </div>

                    {/* Expanded details */}
                    {isExpanded && step.details && (
                      <div className="mt-3 p-4 bg-slate-800 rounded-lg border-l-4 border-purple-500">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          {step.details.confidence && (
                            <div>
                              <span className="font-medium text-white/70">Confidence:</span>
                              <div className="flex items-center gap-2 mt-1">
                                <Progress value={step.details.confidence * 100} className="h-2 flex-1 bg-slate-700" />
                                <span className="text-green-400 font-medium">
                                  {Math.round(step.details.confidence * 100)}%
                                </span>
                              </div>
                            </div>
                          )}

                          <div>
                            <span className="font-medium text-white/70">Inputs:</span>
                            <div className="mt-1 text-xs text-white/60">
                              {step.details.inputs &&
                                Object.entries(step.details.inputs).map(([key, value]) => (
                                  <div key={key} className="flex justify-between">
                                    <span>{key}:</span>
                                    <span className="font-mono text-white">{String(value)}</span>
                                  </div>
                                ))}
                            </div>
                          </div>

                          <div>
                            <span className="font-medium text-white/70">Outputs:</span>
                            <div className="mt-1 text-xs text-white/60">
                              {step.details.outputs &&
                                Object.entries(step.details.outputs).map(([key, value]) => (
                                  <div key={key} className="flex justify-between">
                                    <span>{key}:</span>
                                    <span className="font-mono text-white">{String(value)}</span>
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
