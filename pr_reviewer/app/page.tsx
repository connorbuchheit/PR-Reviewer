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
import { ReasoningFlowGraph } from "@/components/reasoning-flow-graph"
import { ReasoningTimeline } from "@/components/reasoning-timeline"
import { EnhancedChainOfThoughtReplay } from "@/components/enhanced-chain-of-thought-replay"
import { KnowledgeBaseStatus } from "@/components/knowledge-base-status"
import { PolicyViolations } from "@/components/policy-violations"
import { KnowledgeConflicts } from "@/components/knowledge-conflicts"
import {
  GitPullRequest,
  Play,
  RotateCcw,
  Eye,
  GitBranch,
  FileText,
  AlertTriangle,
  Package,
  Zap,
  Brain,
  Activity,
  TrendingUp,
  Database,
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

  const handleReview = () => {
    setIsReviewing(true)
    setTimeout(() => {
      setIsReviewing(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-slate-800 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                PR Review Agent
              </h1>
              <p className="text-white/70">AI-powered code review with reasoning replay</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-600">
              <Activity className="h-3 w-3 mr-1" />
              AgentOps Active
            </Badge>
            <Badge variant="outline" className="bg-blue-900/30 text-blue-400 border-blue-600">
              <Database className="h-3 w-3 mr-1" />
              KB Synced
            </Badge>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - PR Info & Controls */}
          <div className="space-y-6">
            {/* PR Information */}
            <Card className="bg-black border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <GitPullRequest className="h-5 w-5 text-purple-400" />
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Pull Request #{mockPRData.number}
                  </span>
                </CardTitle>
                <CardDescription className="text-white/70">{mockPRData.title}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Author:</span>
                  <span className="font-medium text-white">{mockPRData.author}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Branch:</span>
                  <Badge variant="outline" className="text-xs border-slate-600 text-white/80">
                    <GitBranch className="h-3 w-3 mr-1" />
                    {mockPRData.branch}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  <div>
                    <div className="font-semibold text-white">{mockPRData.files}</div>
                    <div className="text-white/60">Files</div>
                  </div>
                  <div>
                    <div className="font-semibold text-green-400">+{mockPRData.additions}</div>
                    <div className="text-white/60">Added</div>
                  </div>
                  <div>
                    <div className="font-semibold text-red-400">-{mockPRData.deletions}</div>
                    <div className="text-white/60">Deleted</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Review Criteria */}
            <Card className="bg-black border-slate-700">
              <CardHeader>
                <CardTitle className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Review Criteria
                </CardTitle>
                <CardDescription className="text-white/70">Define your review focus and style guide</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="criteria" className="text-white">
                    Review Mode
                  </Label>
                  <Select value={selectedCriteria} onValueChange={setSelectedCriteria}>
                    <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="performance">Performance Focus</SelectItem>
                      <SelectItem value="security">Security Focus</SelectItem>
                      <SelectItem value="style">Style & Conventions</SelectItem>
                      <SelectItem value="testing">Testing Coverage</SelectItem>
                      <SelectItem value="comprehensive">Comprehensive Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="custom-criteria" className="text-white">
                    Custom Criteria
                  </Label>
                  <Textarea
                    id="custom-criteria"
                    placeholder="Enter specific review criteria, style guides, or focus areas..."
                    className="min-h-[80px] bg-slate-800 border-slate-600 text-white placeholder:text-white/50"
                  />
                </div>
                <Button
                  onClick={handleReview}
                  disabled={isReviewing}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
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

            {/* Knowledge Base Status */}
            <KnowledgeBaseStatus />

            {/* Quick Actions */}
            <Card className="bg-black border-slate-700">
              <CardHeader>
                <CardTitle className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Replay & Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent border-slate-600 text-white hover:bg-slate-800"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Reasoning Flow
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent border-slate-600 text-white hover:bg-slate-800"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Replay Session
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent border-slate-600 text-white hover:bg-slate-800"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Counterfactual Analysis
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Review Results */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="results" className="w-full">
              <TabsList className="grid w-full grid-cols-6 bg-slate-800 border-slate-700">
                <TabsTrigger
                  value="results"
                  className="data-[state=active]:bg-black data-[state=active]:text-purple-400"
                >
                  Results
                </TabsTrigger>
                <TabsTrigger
                  value="policies"
                  className="data-[state=active]:bg-black data-[state=active]:text-purple-400"
                >
                  Policies
                </TabsTrigger>
                <TabsTrigger
                  value="conflicts"
                  className="data-[state=active]:bg-black data-[state=active]:text-purple-400"
                >
                  KB Conflicts
                </TabsTrigger>
                <TabsTrigger
                  value="reasoning"
                  className="data-[state=active]:bg-black data-[state=active]:text-purple-400"
                >
                  Flow
                </TabsTrigger>
                <TabsTrigger
                  value="timeline"
                  className="data-[state=active]:bg-black data-[state=active]:text-purple-400"
                >
                  Timeline
                </TabsTrigger>
                <TabsTrigger
                  value="replay"
                  className="data-[state=active]:bg-black data-[state=active]:text-purple-400"
                >
                  Chain of Thought
                </TabsTrigger>
              </TabsList>

              <TabsContent value="results" className="space-y-6">
                {/* Review Summary */}
                <Card className="bg-black border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Review Summary
                      </span>
                      <Badge className="bg-green-900/30 text-green-400 border-green-600">
                        Score: {mockReviewResults.score}/100
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-white/80">{mockReviewResults.summary}</p>

                    {/* Category Scores */}
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(mockReviewResults.categories).map(([category, score]) => (
                        <div key={category} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize font-medium text-white">{category}</span>
                            <span className="text-white/80">{score}%</span>
                          </div>
                          <Progress value={score} className="h-2 bg-slate-800" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Comments */}
                <Card className="bg-black border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-purple-400" />
                      <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Review Comments
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mockReviewResults.comments.map((comment, index) => (
                      <div key={index} className="border border-slate-700 rounded-lg p-4 space-y-2 bg-slate-900/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={comment.type === "suggestion" ? "default" : "secondary"}
                              className="bg-purple-900/30 text-purple-400 border-purple-600"
                            >
                              {comment.type === "suggestion" ? (
                                <AlertTriangle className="h-3 w-3 mr-1" />
                              ) : (
                                <Zap className="h-3 w-3 mr-1" />
                              )}
                              {comment.type}
                            </Badge>
                            <span className="text-sm text-white/60">
                              {comment.file}:{comment.line}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-white/80">{comment.message}</p>
                        <div className="bg-slate-800 rounded p-2 text-sm font-mono text-white/90">{comment.code}</div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Package Suggestions */}
                <Card className="bg-black border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-purple-400" />
                      <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Package Suggestions
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {mockReviewResults.packages.map((pkg, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-blue-900/20 border border-blue-800 rounded-lg"
                      >
                        <div>
                          <div className="font-medium text-blue-300">{pkg.name}</div>
                          <div className="text-sm text-blue-400/80">{pkg.reason}</div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-blue-600 text-blue-400 hover:bg-blue-900/30 bg-transparent"
                        >
                          Install
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="policies" className="space-y-6">
                <PolicyViolations />
              </TabsContent>

              <TabsContent value="conflicts" className="space-y-6">
                <KnowledgeConflicts />
              </TabsContent>

              <TabsContent value="reasoning" className="space-y-6">
                <ReasoningFlowGraph />
              </TabsContent>

              <TabsContent value="timeline" className="space-y-6">
                <ReasoningTimeline />
              </TabsContent>

              <TabsContent value="replay" className="space-y-6">
                <EnhancedChainOfThoughtReplay />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
