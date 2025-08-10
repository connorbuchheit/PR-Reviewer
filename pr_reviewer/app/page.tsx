"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  GitPullRequest,
  Play,
  RotateCcw,
  Eye,
  Clock,
  GitBranch,
  FileText,
  AlertTriangle,
  CheckCircle,
  Package,
  Zap,
  Brain,
  Activity,
  TrendingUp,
} from "lucide-react"

export default function PRReviewAgent() {
  const [selectedCriteria, setSelectedCriteria] = useState("performance")
  const [isReviewing, setIsReviewing] = useState(false)
  const [showReplay, setShowReplay] = useState(false)

  const mockPRData = {
    title: "Optimize database queries and add caching layer",
    number: 142,
    author: "sarah-dev",
    branch: "feature/db-optimization",
    files: 8,
    additions: 156,
    deletions: 43,
    status: "reviewed",
  }

  const mockReviewResults = {
    summary:
      "This PR introduces significant performance improvements through query optimization and Redis caching. The implementation follows repository patterns well but could benefit from additional error handling and test coverage.",
    score: 85,
    categories: {
      performance: 92,
      security: 78,
      style: 88,
      testing: 65,
    },
    comments: [
      {
        file: "src/database/queries.ts",
        line: 23,
        type: "suggestion",
        message: "Consider using a prepared statement here to prevent SQL injection and improve performance.",
        code: "const query = `SELECT * FROM users WHERE id = ${userId}`",
      },
      {
        file: "src/cache/redis.ts",
        line: 15,
        type: "optimization",
        message: "Add connection pooling to handle high-concurrency scenarios better.",
        code: "const client = redis.createClient()",
      },
    ],
    packages: [
      { name: "ioredis", reason: "Better Redis client with TypeScript support" },
      { name: "@types/node", reason: "Missing type definitions for Node.js" },
    ],
  }

  const mockReasoningSteps = [
    {
      id: 1,
      type: "retrieval",
      title: "Repository Analysis",
      description: "Analyzing repository structure and coding patterns",
      timestamp: "2024-01-15T10:30:00Z",
      duration: "2.3s",
      status: "completed",
    },
    {
      id: 2,
      type: "reasoning",
      title: "Style Guide Application",
      description: "Applying performance-focused review criteria",
      timestamp: "2024-01-15T10:30:02Z",
      duration: "1.8s",
      status: "completed",
    },
    {
      id: 3,
      type: "generation",
      title: "Comment Generation",
      description: "Generating line-level and file-level comments",
      timestamp: "2024-01-15T10:30:04Z",
      duration: "3.1s",
      status: "completed",
    },
    {
      id: 4,
      type: "tool_call",
      title: "Package Analysis",
      description: "Analyzing dependencies and suggesting improvements",
      timestamp: "2024-01-15T10:30:07Z",
      duration: "1.5s",
      status: "completed",
    },
  ]

  const handleReview = () => {
    setIsReviewing(true)
    setTimeout(() => {
      setIsReviewing(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">PR Review Agent</h1>
              <p className="text-slate-600">AI-powered code review with reasoning replay</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Activity className="h-3 w-3 mr-1" />
              AgentOps Active
            </Badge>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - PR Info & Controls */}
          <div className="space-y-6">
            {/* PR Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitPullRequest className="h-5 w-5" />
                  Pull Request #{mockPRData.number}
                </CardTitle>
                <CardDescription>{mockPRData.title}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Author:</span>
                  <span className="font-medium">{mockPRData.author}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Branch:</span>
                  <Badge variant="outline" className="text-xs">
                    <GitBranch className="h-3 w-3 mr-1" />
                    {mockPRData.branch}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  <div>
                    <div className="font-semibold text-slate-900">{mockPRData.files}</div>
                    <div className="text-slate-600">Files</div>
                  </div>
                  <div>
                    <div className="font-semibold text-green-600">+{mockPRData.additions}</div>
                    <div className="text-slate-600">Added</div>
                  </div>
                  <div>
                    <div className="font-semibold text-red-600">-{mockPRData.deletions}</div>
                    <div className="text-slate-600">Deleted</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Review Criteria */}
            <Card>
              <CardHeader>
                <CardTitle>Review Criteria</CardTitle>
                <CardDescription>Define your review focus and style guide</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="criteria">Review Mode</Label>
                  <Select value={selectedCriteria} onValueChange={setSelectedCriteria}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="performance">Performance Focus</SelectItem>
                      <SelectItem value="security">Security Focus</SelectItem>
                      <SelectItem value="style">Style & Conventions</SelectItem>
                      <SelectItem value="testing">Testing Coverage</SelectItem>
                      <SelectItem value="comprehensive">Comprehensive Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="custom-criteria">Custom Criteria</Label>
                  <Textarea
                    id="custom-criteria"
                    placeholder="Enter specific review criteria, style guides, or focus areas..."
                    className="min-h-[80px]"
                  />
                </div>
                <Button onClick={handleReview} disabled={isReviewing} className="w-full">
                  {isReviewing ? (
                    <>
                      <Activity className="h-4 w-4 mr-2 animate-spin" />
                      Reviewing...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start Review
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Replay & Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Eye className="h-4 w-4 mr-2" />
                  View Reasoning Flow
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Replay Session
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Counterfactual Analysis
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Review Results */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="results" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="results">Review Results</TabsTrigger>
                <TabsTrigger value="reasoning">Reasoning Flow</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="replay">Replay</TabsTrigger>
              </TabsList>

              <TabsContent value="results" className="space-y-6">
                {/* Review Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Review Summary
                      <Badge className="bg-green-100 text-green-800">Score: {mockReviewResults.score}/100</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-slate-700">{mockReviewResults.summary}</p>

                    {/* Category Scores */}
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(mockReviewResults.categories).map(([category, score]) => (
                        <div key={category} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize font-medium">{category}</span>
                            <span>{score}%</span>
                          </div>
                          <Progress value={score} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Comments */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Review Comments
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mockReviewResults.comments.map((comment, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant={comment.type === "suggestion" ? "default" : "secondary"}>
                              {comment.type === "suggestion" ? (
                                <AlertTriangle className="h-3 w-3 mr-1" />
                              ) : (
                                <Zap className="h-3 w-3 mr-1" />
                              )}
                              {comment.type}
                            </Badge>
                            <span className="text-sm text-slate-600">
                              {comment.file}:{comment.line}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm">{comment.message}</p>
                        <div className="bg-slate-50 rounded p-2 text-sm font-mono">{comment.code}</div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Package Suggestions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Package Suggestions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {mockReviewResults.packages.map((pkg, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div>
                          <div className="font-medium text-blue-900">{pkg.name}</div>
                          <div className="text-sm text-blue-700">{pkg.reason}</div>
                        </div>
                        <Button size="sm" variant="outline">
                          Install
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reasoning" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Reasoning Flow Visualization</CardTitle>
                    <CardDescription>Interactive graph showing the agent's decision-making process</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96 bg-slate-50 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-300">
                      <div className="text-center space-y-2">
                        <Brain className="h-12 w-12 text-slate-400 mx-auto" />
                        <p className="text-slate-600">Interactive reasoning flow graph would appear here</p>
                        <p className="text-sm text-slate-500">Built with React Flow for node-based visualization</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="timeline" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Agent Timeline
                    </CardTitle>
                    <CardDescription>Step-by-step breakdown of the review process</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockReasoningSteps.map((step, index) => (
                        <div key={step.id} className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <CheckCircle className="h-4 w-4 text-blue-600" />
                            </div>
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{step.title}</h4>
                              <div className="flex items-center gap-2 text-sm text-slate-500">
                                <span>{step.duration}</span>
                                <Badge variant="outline" className="text-xs">
                                  {step.type}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-slate-600">{step.description}</p>
                            <p className="text-xs text-slate-500">{new Date(step.timestamp).toLocaleTimeString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="replay" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Deterministic Replay</CardTitle>
                    <CardDescription>Re-run the review with different parameters or compare outcomes</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline" className="h-20 flex-col bg-transparent">
                        <RotateCcw className="h-6 w-6 mb-2" />
                        Exact Replay
                      </Button>
                      <Button variant="outline" className="h-20 flex-col bg-transparent">
                        <TrendingUp className="h-6 w-6 mb-2" />
                        Counterfactual
                      </Button>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Label>Replay with different criteria:</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select criteria to compare" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="security">Security Focus</SelectItem>
                          <SelectItem value="style">Style Focus</SelectItem>
                          <SelectItem value="testing">Testing Focus</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full">
                      <Play className="h-4 w-4 mr-2" />
                      Start Comparison Replay
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
