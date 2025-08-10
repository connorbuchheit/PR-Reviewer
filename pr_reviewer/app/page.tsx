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
import { KnowledgeBaseFull } from "@/components/knowledge-base-full"
import { PolicyViolations } from "@/components/policy-violations"
import { KnowledgeConflicts } from "@/components/knowledge-conflicts"
import { PRSelector } from "@/components/pr-selector"
import { mockPRs, mockReviewResults } from "@/data/mock-prs"
import type { PRData } from "@/types/pr-data"
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
  List,
} from "lucide-react"

export default function PRReviewAgent() {
  const [selectedCriteria, setSelectedCriteria] = useState("performance")
  const [isReviewing, setIsReviewing] = useState(false)
  const [showPRSelector, setShowPRSelector] = useState(false)
  const [selectedPR, setSelectedPR] = useState<PRData>(mockPRs[0]) // Default to first PR

  const currentReviewResults = mockReviewResults[selectedPR.id] || {
    summary: "Review analysis not yet available for this PR.",
    score: 0,
    categories: { performance: 0, security: 0, style: 0, testing: 0 },
    comments: [],
    packages: [],
  }

  const handleReview = () => {
    setIsReviewing(true)
    setTimeout(() => {
      setIsReviewing(false)
    }, 3000)
  }

  const handleSelectPR = (pr: PRData) => {
    setSelectedPR(pr)
  }

  if (showPRSelector) {
    return (
      <div className="min-h-screen bg-slate-800 p-6">
        <div className="max-w-7xl mx-auto">
          <PRSelector
            prs={mockPRs}
            selectedPR={selectedPR}
            onSelectPR={handleSelectPR}
            onClose={() => setShowPRSelector(false)}
          />
        </div>
      </div>
    )
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
                Luci
              </h1>
              <p className="text-white/70">Audit arena for e<b>Luci</b>dating GitHub PR review agent workflows</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowPRSelector(true)}
              variant="outline"
              className="border-slate-600 text-white hover:bg-slate-800 bg-transparent"
            >
              <List className="h-4 w-4 mr-2" />
              Browse PRs
            </Button>
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
                    Pull Request #{selectedPR.number}
                  </span>
                </CardTitle>
                <CardDescription className="text-white/70">{selectedPR.title}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Author:</span>
                  <span className="font-medium text-white">{selectedPR.author}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Branch:</span>
                  <Badge variant="outline" className="text-xs border-slate-600 text-white/80">
                    <GitBranch className="h-3 w-3 mr-1" />
                    {selectedPR.branch}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Status:</span>
                  <Badge variant="outline" className="text-xs border-slate-600 text-white/80 capitalize">
                    {selectedPR.status}
                  </Badge>
                </div>
                {selectedPR.description && (
                  <div className="text-sm">
                    <span className="text-white/60 block mb-1">Description:</span>
                    <p className="text-white/80 text-xs leading-relaxed">{selectedPR.description}</p>
                  </div>
                )}
                <div className="flex flex-wrap gap-1">
                  {selectedPR.labels.map((label) => (
                    <Badge key={label} variant="outline" className="text-xs border-slate-600 text-white/60">
                      {label}
                    </Badge>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  <div>
                    <div className="font-semibold text-white">{selectedPR.files}</div>
                    <div className="text-white/60">Files</div>
                  </div>
                  <div>
                    <div className="font-semibold text-green-400">+{selectedPR.additions}</div>
                    <div className="text-white/60">Added</div>
                  </div>
                  <div>
                    <div className="font-semibold text-red-400">-{selectedPR.deletions}</div>
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
              <TabsList className="w-full bg-slate-800 border-slate-700 p-1 h-12">
                <div className="grid grid-cols-7 w-full gap-1">
                  <TabsTrigger
                    value="results"
                    className="flex-1 text-xs font-medium px-2 py-2 data-[state=active]:bg-black data-[state=active]:text-purple-400 data-[state=active]:shadow-sm transition-all duration-200 hover:bg-slate-700/50"
                  >
                    Results
                  </TabsTrigger>
                  <TabsTrigger
                    value="policies"
                    className="flex-1 text-xs font-medium px-2 py-2 data-[state=active]:bg-black data-[state=active]:text-purple-400 data-[state=active]:shadow-sm transition-all duration-200 hover:bg-slate-700/50"
                  >
                    Policies
                  </TabsTrigger>
                  <TabsTrigger
                    value="conflicts"
                    className="flex-1 text-xs font-medium px-2 py-2 data-[state=active]:bg-black data-[state=active]:text-purple-400 data-[state=active]:shadow-sm transition-all duration-200 hover:bg-slate-700/50"
                  >
                    KB Conflicts
                  </TabsTrigger>
                  <TabsTrigger
                    value="knowledge"
                    className="flex-1 text-xs font-medium px-2 py-2 data-[state=active]:bg-black data-[state=active]:text-purple-400 data-[state=active]:shadow-sm transition-all duration-200 hover:bg-slate-700/50"
                  >
                    Knowledge Base
                  </TabsTrigger>
                  <TabsTrigger
                    value="reasoning"
                    className="flex-1 text-xs font-medium px-2 py-2 data-[state=active]:bg-black data-[state=active]:text-purple-400 data-[state=active]:shadow-sm transition-all duration-200 hover:bg-slate-700/50"
                  >
                    Flow
                  </TabsTrigger>
                  <TabsTrigger
                    value="timeline"
                    className="flex-1 text-xs font-medium px-2 py-2 data-[state=active]:bg-black data-[state=active]:text-purple-400 data-[state=active]:shadow-sm transition-all duration-200 hover:bg-slate-700/50"
                  >
                    Timeline
                  </TabsTrigger>
                  <TabsTrigger
                    value="replay"
                    className="flex-1 text-xs font-medium px-2 py-2 data-[state=active]:bg-black data-[state=active]:text-purple-400 data-[state=active]:shadow-sm transition-all duration-200 hover:bg-slate-700/50"
                  >
                    Chain of Thought
                  </TabsTrigger>
                </div>
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
                        Score: {currentReviewResults.score}/100
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-white/80">{currentReviewResults.summary}</p>

                    {/* Category Scores */}
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(currentReviewResults.categories).map(([category, score]) => (
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
                {currentReviewResults.comments.length > 0 && (
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
                      {currentReviewResults.comments.map((comment, index) => (
                        <div key={index} className="border border-slate-700 rounded-lg p-4 space-y-2 bg-slate-900/50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={comment.type === "suggestion" ? "default" : "secondary"}
                                className={
                                  comment.type === "error"
                                    ? "bg-red-900/30 text-red-400 border-red-600"
                                    : comment.type === "warning"
                                      ? "bg-yellow-900/30 text-yellow-400 border-yellow-600"
                                      : "bg-purple-900/30 text-purple-400 border-purple-600"
                                }
                              >
                                {comment.type === "error" ? (
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                ) : comment.type === "warning" ? (
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
                )}

                {/* Package Suggestions */}
                {currentReviewResults.packages.length > 0 && (
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
                      {currentReviewResults.packages.map((pkg, index) => (
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
                )}
              </TabsContent>

              <TabsContent value="policies" className="space-y-6">
                <PolicyViolations prId={selectedPR.id} />
              </TabsContent>

              <TabsContent value="conflicts" className="space-y-6">
                <KnowledgeConflicts prId={selectedPR.id} />
              </TabsContent>

              <TabsContent value="knowledge" className="space-y-6">
                <KnowledgeBaseFull />
              </TabsContent>

              <TabsContent value="reasoning" className="space-y-6">
                <ReasoningFlowGraph prId={selectedPR.id} />
              </TabsContent>

              <TabsContent value="timeline" className="space-y-6">
                <ReasoningTimeline prId={selectedPR.id} />
              </TabsContent>

              <TabsContent value="replay" className="space-y-6">
                <EnhancedChainOfThoughtReplay prId={selectedPR.id} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
