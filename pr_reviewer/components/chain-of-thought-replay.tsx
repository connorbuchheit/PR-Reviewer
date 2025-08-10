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
} from "lucide-react"

interface ChainOfThoughtStep {
  id: string
  timestamp: number
  type: "thought" | "observation" | "action" | "reflection" | "decision"
  content: string
  context?: string
  confidence?: number
  relatedNode?: string
  actionType?: "analyze_code" | "check_patterns" | "evaluate_security" | "generate_comment" | "recommend_package"
  metadata?: {
    file?: string
    line?: number
    pattern?: string
    score?: number
  }
}

const mockChainOfThought: ChainOfThoughtStep[] = [
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
      "Wait, I'm seeing a potential SQL injection vulnerability on line 23. This is concerning from a security perspective.",
    context: "Security Analysis",
    confidence: 0.95,
    metadata: { file: "src/database/queries.ts", line: 23 },
    relatedNode: "db_analysis",
  },
  {
    id: "cot_10",
    timestamp: 6800,
    type: "action",
    content: "Flagging security issue and preparing recommendation for prepared statements...",
    context: "Security Remediation",
    actionType: "generate_comment",
    metadata: { file: "src/database/queries.ts", line: 23 },
    relatedNode: "db_analysis",
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
      "The Redis setup is basic but functional. I see appropriate TTL settings, but no connection pooling for production scalability.",
    context: "Caching Strategy Review",
    confidence: 0.78,
    relatedNode: "cache_analysis",
  },
  {
    id: "cot_13",
    timestamp: 9100,
    type: "reflection",
    content:
      "The caching implementation follows good separation of concerns, but it's missing some production-ready optimizations.",
    context: "Implementation Quality",
    confidence: 0.82,
    relatedNode: "cache_analysis",
  },
  {
    id: "cot_14",
    timestamp: 9800,
    type: "action",
    content: "Checking for better Redis client alternatives that support TypeScript and connection pooling...",
    context: "Package Analysis",
    actionType: "recommend_package",
    relatedNode: "dependency_analysis",
  },
  {
    id: "cot_15",
    timestamp: 10300,
    type: "decision",
    content:
      "I'll recommend 'ioredis' as it provides better TypeScript support and built-in connection pooling capabilities.",
    context: "Package Recommendation",
    confidence: 0.88,
    metadata: { pattern: "ioredis" },
    relatedNode: "dependency_analysis",
  },
  {
    id: "cot_16",
    timestamp: 11000,
    type: "thought",
    content:
      "Now I need to evaluate the error handling patterns. Database operations are critical and need robust error handling.",
    context: "Error Handling Review",
    confidence: 0.85,
    relatedNode: "error_handling_analysis",
  },
  {
    id: "cot_17",
    timestamp: 11700,
    type: "observation",
    content: "I see basic try-catch blocks, but missing connection retry logic and graceful degradation patterns.",
    context: "Error Pattern Analysis",
    confidence: 0.82,
    relatedNode: "error_handling_analysis",
  },
  {
    id: "cot_18",
    timestamp: 12400,
    type: "action",
    content: "Analyzing test coverage to understand how well these changes are tested...",
    context: "Test Analysis",
    actionType: "analyze_code",
    relatedNode: "test_analysis",
  },
  {
    id: "cot_19",
    timestamp: 13200,
    type: "observation",
    content:
      "Test coverage is at 65% with good unit tests, but I'm not seeing integration tests for the database + cache interaction.",
    context: "Coverage Assessment",
    confidence: 0.75,
    metadata: { score: 65 },
    relatedNode: "test_analysis",
  },
  {
    id: "cot_20",
    timestamp: 14000,
    type: "reflection",
    content:
      "Overall, this PR shows strong performance improvements and good architectural understanding, but has some security and testing gaps.",
    context: "Overall Assessment",
    confidence: 0.87,
    relatedNode: "summary_generation",
  },
  {
    id: "cot_21",
    timestamp: 14800,
    type: "decision",
    content:
      "I'll give this an 85/100 score: excellent performance (92), good style (88), concerning security (78), and needs better testing (65).",
    context: "Final Scoring",
    confidence: 0.89,
    metadata: { score: 85 },
    relatedNode: "summary_generation",
  },
  {
    id: "cot_22",
    timestamp: 15600,
    type: "action",
    content: "Generating comprehensive review summary with actionable recommendations...",
    context: "Summary Generation",
    actionType: "generate_comment",
    relatedNode: "summary_generation",
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

const getStepColor = (type: string) => {
  switch (type) {
    case "thought":
      return "bg-purple-50 border-purple-200 text-purple-800"
    case "observation":
      return "bg-blue-50 border-blue-200 text-blue-800"
    case "reflection":
      return "bg-yellow-50 border-yellow-200 text-yellow-800"
    case "decision":
      return "bg-green-50 border-green-200 text-green-800"
    case "action":
      return "bg-orange-50 border-orange-200 text-orange-800"
    default:
      return "bg-gray-50 border-gray-200 text-gray-800"
  }
}

export function ChainOfThoughtReplay() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [progress, setProgress] = useState(0)

  const totalDuration = mockChainOfThought[mockChainOfThought.length - 1]?.timestamp || 16000

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isPlaying && currentStep < mockChainOfThought.length) {
      const currentStepData = mockChainOfThought[currentStep]
      const nextStepData = mockChainOfThought[currentStep + 1]

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
    if (currentStep >= mockChainOfThought.length) {
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

  const visibleSteps = mockChainOfThought.slice(0, currentStep + 1)
  const currentStepData = mockChainOfThought[currentStep]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Chain of Thought Replay
          </CardTitle>
          <CardDescription>Watch the AI's internal reasoning process as it reviews the PR step by step</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Playback Controls */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2">
              {!isPlaying ? (
                <Button onClick={handlePlay} size="sm">
                  <Play className="h-4 w-4 mr-2" />
                  Play
                </Button>
              ) : (
                <Button onClick={handlePause} size="sm" variant="outline">
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
              )}
              <Button onClick={handleReset} size="sm" variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">Speed:</span>
                {[0.5, 1, 2, 4].map((speed) => (
                  <Button
                    key={speed}
                    onClick={() => handleSpeedChange(speed)}
                    size="sm"
                    variant={playbackSpeed === speed ? "default" : "outline"}
                    className="px-2"
                  >
                    {speed}x
                  </Button>
                ))}
              </div>
              <div className="text-sm text-slate-600">
                Step {currentStep + 1} of {mockChainOfThought.length}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
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

            return (
              <div
                key={step.id}
                className={`transition-all duration-700 transform ${
                  isCurrentStep
                    ? "scale-102 shadow-lg animate-in slide-in-from-top-2"
                    : reverseIndex === 0 && originalIndex === currentStep - 1
                      ? "animate-in slide-in-from-top-1 duration-500"
                      : "opacity-90"
                }`}
              >
                <Card className={`${isCurrentStep ? "ring-2 ring-blue-500 bg-blue-50/30" : ""}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {/* Step Icon with Number */}
                      <div className="flex flex-col items-center gap-1">
                        <div
                          className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center ${getStepColor(step.type)} ${
                            isCurrentStep ? "ring-2 ring-blue-400 ring-offset-2" : ""
                          }`}
                        >
                          {getStepIcon(step.type, step.actionType)}
                        </div>
                        <Badge
                          variant="outline"
                          className={`text-xs px-1.5 py-0.5 ${
                            isCurrentStep ? "bg-blue-100 text-blue-800 border-blue-300" : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          #{thoughtNumber}
                        </Badge>
                      </div>

                      {/* Step Content */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={`text-xs capitalize ${
                                isCurrentStep ? "bg-blue-100 text-blue-800 border-blue-300" : ""
                              }`}
                            >
                              {step.type}
                            </Badge>
                            {step.context && (
                              <span
                                className={`text-sm ${isCurrentStep ? "text-blue-700 font-medium" : "text-slate-600"}`}
                              >
                                {step.context}
                              </span>
                            )}
                            {isCurrentStep && (
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                                <span className="text-xs text-blue-600 font-medium">Processing</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Clock className="h-3 w-3" />
                            {timeFromStart}s
                            {step.confidence && (
                              <Badge variant="outline" className="text-xs">
                                {Math.round(step.confidence * 100)}% confident
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Step Content */}
                        <div
                          className={`p-3 rounded-lg transition-colors ${
                            step.type === "thought"
                              ? isCurrentStep
                                ? "bg-purple-100 border border-purple-200"
                                : "bg-purple-50"
                              : step.type === "action"
                                ? isCurrentStep
                                  ? "bg-orange-100 border border-orange-200"
                                  : "bg-orange-50"
                                : step.type === "observation"
                                  ? isCurrentStep
                                    ? "bg-blue-100 border border-blue-200"
                                    : "bg-blue-50"
                                  : step.type === "decision"
                                    ? isCurrentStep
                                      ? "bg-green-100 border border-green-200"
                                      : "bg-green-50"
                                    : isCurrentStep
                                      ? "bg-yellow-100 border border-yellow-200"
                                      : "bg-yellow-50"
                          }`}
                        >
                          <p className={`text-sm leading-relaxed ${isCurrentStep ? "font-medium" : ""}`}>
                            {step.content}
                          </p>
                        </div>

                        {/* Metadata */}
                        {step.metadata && (
                          <div className="flex flex-wrap gap-2 text-xs">
                            {step.metadata.file && (
                              <Badge variant="outline" className={isCurrentStep ? "bg-blue-50" : ""}>
                                <FileText className="h-3 w-3 mr-1" />
                                {step.metadata.file}
                                {step.metadata.line && `:${step.metadata.line}`}
                              </Badge>
                            )}
                            {step.metadata.score && (
                              <Badge variant="outline" className={isCurrentStep ? "bg-blue-50" : ""}>
                                <TrendingUp className="h-3 w-3 mr-1" />
                                Score: {step.metadata.score}
                              </Badge>
                            )}
                            {step.metadata.pattern && (
                              <Badge variant="outline" className={isCurrentStep ? "bg-blue-50" : ""}>
                                <Package className="h-3 w-3 mr-1" />
                                {step.metadata.pattern}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )
          })}
      </div>

      {/* Progress Summary */}
      {visibleSteps.length > 0 && (
        <Card className="border-dashed border-2 border-slate-200 bg-slate-50/50">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                <span>
                  <strong className="text-slate-900">{visibleSteps.length}</strong> thoughts processed
                </span>
              </div>
              <div className="w-1 h-1 bg-slate-400 rounded-full" />
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>
                  <strong className="text-slate-900">
                    {((visibleSteps[visibleSteps.length - 1]?.timestamp || 0) / 1000).toFixed(1)}s
                  </strong>{" "}
                  elapsed
                </span>
              </div>
              {!isPlaying && currentStep >= mockChainOfThought.length - 1 && (
                <>
                  <div className="w-1 h-1 bg-slate-400 rounded-full" />
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-green-600 font-medium">Review Complete</span>
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
