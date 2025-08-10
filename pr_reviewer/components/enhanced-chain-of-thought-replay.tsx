"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Play,
  Pause,
  RotateCcw,
  Brain,
  Eye,
  Lightbulb,
  Search,
  Code,
  AlertTriangle,
  CheckCircle,
  Package,
  FileText,
  Zap,
  Clock,
  TrendingUp,
  Database,
  Users,
  XCircle,
} from "lucide-react"
import type { EnhancedChainOfThoughtStep } from "@/types/knowledge-retrieval"

// Enhanced mock data with knowledge retrieval and conflicts
const mockEnhancedChainOfThought: EnhancedChainOfThoughtStep[] = [
  {
    id: "cot_1",
    timestamp: 0,
    type: "thought",
    content:
      "I need to start by understanding what this PR is trying to accomplish. Let me examine the title and description first.",
    context: "Initial Context Gathering",
    confidence: 0.95,
    relatedNode: "context_gathering",
  },
  {
    id: "cot_2",
    timestamp: 800,
    type: "observation",
    content:
      "The PR title mentions 'Optimize database queries and add caching layer' - this suggests performance improvements are the main focus.",
    context: "PR Analysis",
    confidence: 0.92,
    relatedNode: "context_gathering",
  },
  {
    id: "cot_3",
    timestamp: 1500,
    type: "action",
    content: "Scanning repository structure to understand current architecture patterns...",
    context: "Repository Analysis",
    actionType: "analyze_code",
    relatedNode: "context_gathering",
  },
  {
    id: "cot_4",
    timestamp: 2300,
    type: "observation",
    content:
      "I can see this codebase follows a repository pattern with service layers. The current approach uses direct SQL queries without caching.",
    context: "Architecture Understanding",
    confidence: 0.88,
    relatedNode: "context_gathering",
    appliedPolicies: ["pattern_repository"],
    knowledgeConfidence: 0.91,
  },
  {
    id: "cot_5",
    timestamp: 3100,
    type: "thought",
    content:
      "Since the user specified 'Performance Focus' as the review criteria, I should weight query optimization and caching strategies heavily in my analysis.",
    context: "Criteria Application",
    confidence: 0.94,
    relatedNode: "style_analysis",
  },
  {
    id: "cot_6",
    timestamp: 3900,
    type: "decision",
    content:
      "I'll focus 40% on performance, 30% on reliability (error handling), and 30% on maintainability. This aligns with the performance-focused criteria.",
    context: "Review Strategy",
    confidence: 0.91,
    relatedNode: "style_analysis",
  },
  {
    id: "cot_7",
    timestamp: 4700,
    type: "action",
    content: "Analyzing database queries in src/database/queries.ts...",
    context: "Code Analysis",
    actionType: "analyze_code",
    metadata: { file: "src/database/queries.ts" },
    relatedNode: "db_analysis",
  },
  {
    id: "cot_8",
    timestamp: 5500,
    type: "observation",
    content: "Found several optimized queries that should reduce N+1 problems. Good use of indexing strategies.",
    context: "Performance Assessment",
    confidence: 0.87,
    metadata: { score: 92 },
    relatedNode: "db_analysis",
  },
  {
    id: "cot_9",
    timestamp: 6200,
    type: "thought",
    content:
      "Wait, I'm seeing a potential SQL injection vulnerability on line 23. This is concerning from a security perspective. Let me check our security policies.",
    context: "Security Analysis",
    confidence: 0.95,
    metadata: { file: "src/database/queries.ts", line: 23 },
    relatedNode: "db_analysis",
  },
  {
    id: "cot_10",
    timestamp: 6800,
    type: "action",
    content:
      "Flagging security issue and preparing recommendation for prepared statements based on company security policy...",
    context: "Security Remediation",
    actionType: "generate_comment",
    metadata: { file: "src/database/queries.ts", line: 23 },
    relatedNode: "db_analysis",
    appliedPolicies: ["policy_sql_injection"],
    knowledgeConfidence: 0.95,
  },
  {
    id: "cot_11",
    timestamp: 7600,
    type: "action",
    content: "Moving to analyze Redis caching implementation in src/cache/redis.ts...",
    context: "Cache Analysis",
    actionType: "analyze_code",
    metadata: { file: "src/cache/redis.ts" },
    relatedNode: "cache_analysis",
  },
  {
    id: "cot_12",
    timestamp: 8400,
    type: "observation",
    content:
      "The Redis setup is basic but functional. I see appropriate TTL settings, but no connection pooling. Let me check our policies on this...",
    context: "Caching Strategy Review",
    confidence: 0.78,
    relatedNode: "cache_analysis",
  },
  {
    id: "cot_13",
    timestamp: 9100,
    type: "reflection",
    content:
      "⚠️ KNOWLEDGE CONFLICT: I found conflicting guidance about connection pooling requirements. Security policy mandates it, but team practices suggest it's optional for small services. I need to flag this for human review rather than make a potentially incorrect recommendation.",
    context: "Conflict Detection",
    confidence: 0.45,
    relatedNode: "cache_analysis",
    conflictingKnowledge: ["security_pooling_policy", "team_pooling_guideline"],
    knowledgeConfidence: 0.45,
  },
]

const getStepIcon = (type: string, actionType?: string) => {
  if (type === "action" && actionType) {
    switch (actionType) {
      case "analyze_code":
        return <Code className="h-4 w-4" />
      case "check_patterns":
        return <Search className="h-4 w-4" />
      case "evaluate_security":
        return <AlertTriangle className="h-4 w-4" />
      case "generate_comment":
        return <FileText className="h-4 w-4" />
      case "recommend_package":
        return <Package className="h-4 w-4" />
      default:
        return <Zap className="h-4 w-4" />
    }
  }

  switch (type) {
    case "thought":
      return <Brain className="h-4 w-4" />
    case "observation":
      return <Eye className="h-4 w-4" />
    case "reflection":
      return <Lightbulb className="h-4 w-4" />
    case "decision":
      return <CheckCircle className="h-4 w-4" />
    case "action":
      return <Zap className="h-4 w-4" />
    default:
      return <Brain className="h-4 w-4" />
  }
}

const getStepColor = (type: string, hasConflict?: boolean) => {
  if (hasConflict) {
    return "bg-red-900/30 border-red-600 text-red-400"
  }

  switch (type) {
    case "thought":
      return "bg-purple-900/30 border-purple-600 text-purple-400"
    case "observation":
      return "bg-blue-900/30 border-blue-600 text-blue-400"
    case "reflection":
      return "bg-yellow-900/30 border-yellow-600 text-yellow-400"
    case "decision":
      return "bg-green-900/30 border-green-600 text-green-400"
    case "action":
      return "bg-orange-900/30 border-orange-600 text-orange-400"
    default:
      return "bg-gray-900/30 border-gray-600 text-gray-400"
  }
}

export function EnhancedChainOfThoughtReplay() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [progress, setProgress] = useState(0)

  const totalDuration = mockEnhancedChainOfThought[mockEnhancedChainOfThought.length - 1]?.timestamp || 16000

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isPlaying && currentStep < mockEnhancedChainOfThought.length) {
      const currentStepData = mockEnhancedChainOfThought[currentStep]
      const nextStepData = mockEnhancedChainOfThought[currentStep + 1]

      if (nextStepData) {
        const delay = (nextStepData.timestamp - currentStepData.timestamp) / playbackSpeed
        interval = setTimeout(() => {
          setCurrentStep((prev) => prev + 1)
          setProgress((nextStepData.timestamp / totalDuration) * 100)
        }, delay)
      } else {
        setIsPlaying(false)
      }
    }

    return () => {
      if (interval) clearTimeout(interval)
    }
  }, [isPlaying, currentStep, playbackSpeed, totalDuration])

  const handlePlay = () => {
    if (currentStep >= mockEnhancedChainOfThought.length) {
      setCurrentStep(0)
      setProgress(0)
    }
    setIsPlaying(true)
  }

  const handlePause = () => {
    setIsPlaying(false)
  }

  const handleReset = () => {
    setIsPlaying(false)
    setCurrentStep(0)
    setProgress(0)
  }

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed)
  }

  const visibleSteps = mockEnhancedChainOfThought.slice(0, currentStep + 1)

  return (
    <div className="space-y-6">
      <Card className="bg-black border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-400" />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Enhanced Chain of Thought Replay
            </span>
          </CardTitle>
          <CardDescription className="text-white/70">
            Watch the AI's reasoning process with real-time knowledge retrieval and conflict detection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Playback Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-800 rounded-lg gap-4">
            <div className="flex items-center gap-2">
              {!isPlaying ? (
                <Button onClick={handlePlay} size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600">
                  <Play className="h-4 w-4 mr-2" />
                  Play
                </Button>
              ) : (
                <Button
                  onClick={handlePause}
                  size="sm"
                  variant="outline"
                  className="border-slate-600 text-white bg-transparent"
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
              )}
              <Button
                onClick={handleReset}
                size="sm"
                variant="outline"
                className="border-slate-600 text-white bg-transparent"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/60">Speed:</span>
                {[0.5, 1, 2, 4].map((speed) => (
                  <Button
                    key={speed}
                    onClick={() => handleSpeedChange(speed)}
                    size="sm"
                    variant={playbackSpeed === speed ? "default" : "outline"}
                    className={
                      playbackSpeed === speed
                        ? "bg-gradient-to-r from-purple-600 to-pink-600"
                        : "border-slate-600 text-white bg-transparent"
                    }
                  >
                    {speed}x
                  </Button>
                ))}
              </div>
              <div className="text-sm text-white/60">
                Step {currentStep + 1} of {mockEnhancedChainOfThought.length}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-white/60">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-slate-800" />
          </div>
        </CardContent>
      </Card>

      {/* Chain of Thought Steps */}
      <div className="space-y-4 max-h-[600px] overflow-y-auto">
        {visibleSteps
          .slice()
          .reverse()
          .map((step, reverseIndex) => {
            const originalIndex = visibleSteps.length - 1 - reverseIndex
            const isCurrentStep = originalIndex === currentStep
            const timeFromStart = (step.timestamp / 1000).toFixed(1)
            const thoughtNumber = originalIndex + 1
            const hasConflict = step.conflictingKnowledge && step.conflictingKnowledge.length > 0

            return (
              <div key={step.id} className="space-y-3">
                {/* Main Thought Step */}
                <div
                  className={`transition-all duration-700 transform ${
                    isCurrentStep
                      ? "scale-102 shadow-lg animate-in slide-in-from-top-2"
                      : reverseIndex === 0 && originalIndex === currentStep - 1
                        ? "animate-in slide-in-from-top-1 duration-500"
                        : "opacity-90"
                  }`}
                >
                  <Card
                    className={`bg-black border-slate-700 ${isCurrentStep ? "ring-2 ring-purple-500" : ""} ${hasConflict ? "ring-2 ring-red-500" : ""}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {/* Step Icon with Number */}
                        <div className="flex flex-col items-center gap-1">
                          <div
                            className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center ${getStepColor(step.type, hasConflict)} ${
                              isCurrentStep ? "ring-2 ring-purple-400 ring-offset-2 ring-offset-black" : ""
                            } ${hasConflict ? "ring-2 ring-red-400 ring-offset-2 ring-offset-black" : ""}`}
                          >
                            {hasConflict ? <XCircle className="h-4 w-4" /> : getStepIcon(step.type, step.actionType)}
                          </div>
                          <Badge
                            variant="outline"
                            className={`text-xs px-1.5 py-0.5 border-slate-600 ${
                              isCurrentStep
                                ? "bg-purple-900/30 text-purple-400"
                                : hasConflict
                                  ? "bg-red-900/30 text-red-400"
                                  : "text-white/70"
                            }`}
                          >
                            #{thoughtNumber}
                          </Badge>
                        </div>

                        {/* Step Content */}
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge
                                variant="outline"
                                className={`text-xs capitalize border-slate-600 ${
                                  isCurrentStep ? "bg-purple-900/30 text-purple-400" : ""
                                } ${hasConflict ? "bg-red-900/30 text-red-400" : "text-white/70"}`}
                              >
                                {step.type}
                              </Badge>
                              {step.context && (
                                <span
                                  className={`text-sm ${
                                    isCurrentStep
                                      ? "text-purple-300 font-medium"
                                      : hasConflict
                                        ? "text-red-300 font-medium"
                                        : "text-white/60"
                                  }`}
                                >
                                  {step.context}
                                </span>
                              )}
                              {hasConflict && (
                                <Badge className="text-xs bg-red-900/30 text-red-400 border-red-600">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  Conflict Detected
                                </Badge>
                              )}
                              {isCurrentStep && (
                                <div className="flex items-center gap-1">
                                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                                  <span className="text-xs text-purple-400 font-medium">Processing</span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-white/50">
                              <Clock className="h-3 w-3" />
                              {timeFromStart}s
                              {step.confidence && (
                                <Badge
                                  variant="outline"
                                  className={`text-xs border-slate-600 ${hasConflict ? "text-red-400" : "text-white/70"}`}
                                >
                                  {Math.round(step.confidence * 100)}% confident
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Step Content */}
                          <div
                            className={`p-3 rounded-lg transition-colors ${
                              hasConflict
                                ? "bg-red-900/20 border border-red-800"
                                : step.type === "thought"
                                  ? isCurrentStep
                                    ? "bg-purple-900/20 border border-purple-800"
                                    : "bg-purple-900/10"
                                  : step.type === "action"
                                    ? isCurrentStep
                                      ? "bg-orange-900/20 border border-orange-800"
                                      : "bg-orange-900/10"
                                    : step.type === "observation"
                                      ? isCurrentStep
                                        ? "bg-blue-900/20 border border-blue-800"
                                        : "bg-blue-900/10"
                                      : step.type === "decision"
                                        ? isCurrentStep
                                          ? "bg-green-900/20 border border-green-800"
                                          : "bg-green-900/10"
                                        : isCurrentStep
                                          ? "bg-yellow-900/20 border border-yellow-800"
                                          : "bg-yellow-900/10"
                            }`}
                          >
                            <p
                              className={`text-sm leading-relaxed ${isCurrentStep || hasConflict ? "font-medium text-white" : "text-white/80"}`}
                            >
                              {step.content}
                            </p>
                          </div>

                          {/* Knowledge Indicators */}
                          {(step.appliedPolicies || step.knowledgeConfidence || step.conflictingKnowledge) && (
                            <div className="flex flex-wrap gap-2 text-xs">
                              {step.appliedPolicies && (
                                <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-600">
                                  <Database className="h-3 w-3 mr-1" />
                                  {step.appliedPolicies.length} policies applied
                                </Badge>
                              )}
                              {step.knowledgeConfidence && (
                                <Badge
                                  variant="outline"
                                  className={`border-slate-600 ${hasConflict ? "bg-red-900/30 text-red-400" : "bg-blue-900/30 text-blue-400"}`}
                                >
                                  <TrendingUp className="h-3 w-3 mr-1" />
                                  {Math.round(step.knowledgeConfidence * 100)}% knowledge confidence
                                </Badge>
                              )}
                              {step.conflictingKnowledge && (
                                <Badge variant="outline" className="bg-red-900/30 text-red-400 border-red-600">
                                  <Users className="h-3 w-3 mr-1" />
                                  {step.conflictingKnowledge.length} conflicts - human review required
                                </Badge>
                              )}
                            </div>
                          )}

                          {/* Metadata */}
                          {step.metadata && (
                            <div className="flex flex-wrap gap-2 text-xs">
                              {step.metadata.file && (
                                <Badge variant="outline" className="border-slate-600 text-white/70">
                                  <FileText className="h-3 w-3 mr-1" />
                                  {step.metadata.file}
                                  {step.metadata.line && `:${step.metadata.line}`}
                                </Badge>
                              )}
                              {step.metadata.score && (
                                <Badge variant="outline" className="border-slate-600 text-white/70">
                                  <TrendingUp className="h-3 w-3 mr-1" />
                                  Score: {step.metadata.score}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )
          })}
      </div>

      {/* Progress Summary */}
      {visibleSteps.length > 0 && (
        <Card className="border-dashed border-2 border-slate-600 bg-slate-900/50">
          <CardContent className="p-4 text-center">
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                <span>
                  <strong className="text-white">{visibleSteps.length}</strong> thoughts processed
                </span>
              </div>
              <div className="w-1 h-1 bg-slate-400 rounded-full" />
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                <span>
                  <strong className="text-white">{visibleSteps.filter((s) => s.knowledgeRetrieval).length}</strong>{" "}
                  knowledge retrievals
                </span>
              </div>
              <div className="w-1 h-1 bg-slate-400 rounded-full" />
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <span>
                  <strong className="text-red-400">{visibleSteps.filter((s) => s.conflictingKnowledge).length}</strong>{" "}
                  conflicts detected
                </span>
              </div>
              <div className="w-1 h-1 bg-slate-400 rounded-full" />
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>
                  <strong className="text-white">
                    {((visibleSteps[visibleSteps.length - 1]?.timestamp || 0) / 1000).toFixed(1)}s
                  </strong>{" "}
                  elapsed
                </span>
              </div>
              {!isPlaying && currentStep >= mockEnhancedChainOfThought.length - 1 && (
                <>
                  <div className="w-1 h-1 bg-slate-400 rounded-full" />
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-orange-400" />
                    <span className="text-orange-400 font-medium">Human Review Required</span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
