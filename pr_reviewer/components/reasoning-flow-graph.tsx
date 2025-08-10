"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brain, Search, Code, FileText, Package, Clock, CheckCircle, ArrowRight, Zap } from "lucide-react"

interface ReasoningNode {
  node_id: string
  type: "retrieval" | "reasoning" | "analysis" | "tool_call" | "generation"
  title: string
  duration: string
  confidence?: number
  status: "completed" | "in_progress" | "failed"
  inputs?: any
  outputs?: any
  reasoning?: string
  connections: string[]
}

const mockReasoningNodes: ReasoningNode[] = [
  {
    node_id: "context_gathering",
    type: "retrieval",
    title: "Repository Context Analysis",
    duration: "2.3s",
    confidence: 0.95,
    status: "completed",
    reasoning: "Need to understand current architecture before evaluating changes",
    connections: ["style_analysis"],
  },
  {
    node_id: "style_analysis",
    type: "reasoning",
    title: "Apply Performance Review Criteria",
    duration: "1.8s",
    confidence: 0.92,
    status: "completed",
    reasoning: "Performance criteria emphasizes query efficiency and caching strategies",
    connections: ["db_analysis", "cache_analysis"],
  },
  {
    node_id: "db_analysis",
    type: "analysis",
    title: "Database Query Evaluation",
    duration: "2.1s",
    confidence: 0.85,
    status: "completed",
    reasoning: "Query optimization shows good performance understanding, but security vulnerability detected",
    connections: ["error_handling_analysis", "dependency_analysis"],
  },
  {
    node_id: "cache_analysis",
    type: "analysis",
    title: "Redis Caching Implementation",
    duration: "1.9s",
    confidence: 0.78,
    status: "completed",
    reasoning: "Caching strategy is sound but needs production-ready optimizations",
    connections: ["dependency_analysis", "error_handling_analysis"],
  },
  {
    node_id: "dependency_analysis",
    type: "tool_call",
    title: "Package Recommendations",
    duration: "1.5s",
    confidence: 0.88,
    status: "completed",
    reasoning: "Analyzed current packages and identified better alternatives",
    connections: ["summary_generation"],
  },
  {
    node_id: "error_handling_analysis",
    type: "reasoning",
    title: "Error Handling Evaluation",
    duration: "1.4s",
    confidence: 0.82,
    status: "completed",
    reasoning: "Error handling exists but not comprehensive for production reliability",
    connections: ["test_analysis"],
  },
  {
    node_id: "test_analysis",
    type: "analysis",
    title: "Test Coverage Assessment",
    duration: "1.2s",
    confidence: 0.75,
    status: "completed",
    reasoning: "Good unit test foundation but lacks comprehensive integration testing",
    connections: ["summary_generation"],
  },
  {
    node_id: "summary_generation",
    type: "generation",
    title: "Review Summary Creation",
    duration: "2.8s",
    confidence: 0.87,
    status: "completed",
    reasoning: "Synthesized all analysis results into comprehensive review summary",
    connections: [],
  },
]

const getNodeIcon = (type: string) => {
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

const getNodeColor = (type: string) => {
  switch (type) {
    case "retrieval":
      return "bg-blue-900/30 border-blue-600 text-blue-400"
    case "reasoning":
      return "bg-purple-900/30 border-purple-600 text-purple-400"
    case "analysis":
      return "bg-green-900/30 border-green-600 text-green-400"
    case "tool_call":
      return "bg-orange-900/30 border-orange-600 text-orange-400"
    case "generation":
      return "bg-pink-900/30 border-pink-600 text-pink-400"
    default:
      return "bg-gray-900/30 border-gray-600 text-gray-400"
  }
}

export function ReasoningFlowGraph() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  const selectedNodeData = selectedNode ? mockReasoningNodes.find((n) => n.node_id === selectedNode) : null

  return (
    <div className="space-y-6">
      <Card className="bg-black border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-400" />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Reasoning Flow Graph
            </span>
          </CardTitle>
          <CardDescription className="text-white/70">
            Interactive visualization of the agent's decision-making process
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Graph Container */}
          <div className="relative bg-slate-900 rounded-lg p-8 min-h-[500px] overflow-auto">
            {/* SVG for connections */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
              {mockReasoningNodes.map((node) =>
                node.connections.map((targetId) => {
                  const targetNode = mockReasoningNodes.find((n) => n.node_id === targetId)
                  if (!targetNode) return null

                  const sourceIndex = mockReasoningNodes.findIndex((n) => n.node_id === node.node_id)
                  const targetIndex = mockReasoningNodes.findIndex((n) => n.node_id === targetId)

                  const sourceX = 150 + (sourceIndex % 3) * 250
                  const sourceY = 100 + Math.floor(sourceIndex / 3) * 150
                  const targetX = 150 + (targetIndex % 3) * 250
                  const targetY = 100 + Math.floor(targetIndex / 3) * 150

                  return (
                    <line
                      key={`${node.node_id}-${targetId}`}
                      x1={sourceX}
                      y1={sourceY}
                      x2={targetX}
                      y2={targetY}
                      stroke="#64748b"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                      className={hoveredNode === node.node_id || hoveredNode === targetId ? "stroke-purple-400" : ""}
                    />
                  )
                }),
              )}
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
                </marker>
              </defs>
            </svg>

            {/* Nodes */}
            {mockReasoningNodes.map((node, index) => {
              const x = 50 + (index % 3) * 250
              const y = 50 + Math.floor(index / 3) * 150

              return (
                <div
                  key={node.node_id}
                  className={`absolute cursor-pointer transition-all duration-200 ${
                    selectedNode === node.node_id ? "scale-105 shadow-lg" : "hover:scale-102"
                  }`}
                  style={{
                    left: x,
                    top: y,
                    zIndex: selectedNode === node.node_id ? 10 : 2,
                    transform: selectedNode === node.node_id ? "scale(1.05)" : "scale(1)",
                  }}
                  onClick={() => setSelectedNode(node.node_id)}
                  onMouseEnter={() => setHoveredNode(node.node_id)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <div
                    className={`
                    w-48 p-3 rounded-lg border-2 bg-black shadow-sm
                    ${getNodeColor(node.type)}
                    ${selectedNode === node.node_id ? "ring-2 ring-purple-500" : ""}
                  `}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {getNodeIcon(node.type)}
                      <Badge variant="outline" className="text-xs border-slate-600 text-white/70">
                        {node.type}
                      </Badge>
                    </div>
                    <h4 className="font-medium text-sm mb-1 text-white">{node.title}</h4>
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-white/60">
                        <Clock className="h-3 w-3" />
                        {node.duration}
                      </span>
                      {node.confidence && (
                        <span className="text-green-400 font-medium">{Math.round(node.confidence * 100)}%</span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Node Details Panel */}
      {selectedNodeData && (
        <Card className="bg-black border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getNodeIcon(selectedNodeData.type)}
              <span className="text-white">{selectedNodeData.title}</span>
              <Badge variant="outline" className="border-slate-600 text-white/70">
                {selectedNodeData.type}
              </Badge>
            </CardTitle>
            <CardDescription className="text-white/70">Detailed reasoning and analysis for this step</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-white/60">Duration:</span>
                <div className="flex items-center gap-1 mt-1">
                  <Clock className="h-3 w-3 text-white/60" />
                  <span className="text-white">{selectedNodeData.duration}</span>
                </div>
              </div>
              {selectedNodeData.confidence && (
                <div>
                  <span className="font-medium text-white/60">Confidence:</span>
                  <div className="flex items-center gap-1 mt-1">
                    <Zap className="h-3 w-3 text-white/60" />
                    <span className="text-white">{Math.round(selectedNodeData.confidence * 100)}%</span>
                  </div>
                </div>
              )}
              <div>
                <span className="font-medium text-white/60">Status:</span>
                <div className="flex items-center gap-1 mt-1">
                  <CheckCircle className="h-3 w-3 text-green-400" />
                  <span className="text-white">{selectedNodeData.status}</span>
                </div>
              </div>
            </div>

            {selectedNodeData.reasoning && (
              <div>
                <span className="font-medium text-white/60">Reasoning:</span>
                <p className="mt-1 text-sm text-white/80 bg-slate-800 p-3 rounded">{selectedNodeData.reasoning}</p>
              </div>
            )}

            {selectedNodeData.connections.length > 0 && (
              <div>
                <span className="font-medium text-white/60">Connected to:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedNodeData.connections.map((connId) => {
                    const connectedNode = mockReasoningNodes.find((n) => n.node_id === connId)
                    return connectedNode ? (
                      <Button
                        key={connId}
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedNode(connId)}
                        className="text-xs bg-transparent border-slate-600 text-white hover:bg-slate-800"
                      >
                        <ArrowRight className="h-3 w-3 mr-1" />
                        {connectedNode.title}
                      </Button>
                    ) : null
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
