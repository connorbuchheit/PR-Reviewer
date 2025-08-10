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
  connections: string[] // IDs of connected nodes
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
      return "bg-blue-100 border-blue-300 text-blue-800"
    case "reasoning":
      return "bg-purple-100 border-purple-300 text-purple-800"
    case "analysis":
      return "bg-green-100 border-green-300 text-green-800"
    case "tool_call":
      return "bg-orange-100 border-orange-300 text-orange-800"
    case "generation":
      return "bg-pink-100 border-pink-300 text-pink-800"
    default:
      return "bg-gray-100 border-gray-300 text-gray-800"
  }
}

export function ReasoningFlowGraph() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  const selectedNodeData = selectedNode ? mockReasoningNodes.find((n) => n.node_id === selectedNode) : null

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Reasoning Flow Graph
          </CardTitle>
          <CardDescription>Interactive visualization of the agent's decision-making process</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Graph Container */}
          <div className="relative bg-slate-50 rounded-lg p-8 min-h-[500px] overflow-auto">
            {/* SVG for connections */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
              {mockReasoningNodes.map((node) =>
                node.connections.map((targetId) => {
                  const targetNode = mockReasoningNodes.find((n) => n.node_id === targetId)
                  if (!targetNode) return null

                  // Simple positioning logic (in a real implementation, you'd use a proper graph layout algorithm)
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
                      stroke="#94a3b8"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                      className={hoveredNode === node.node_id || hoveredNode === targetId ? "stroke-blue-500" : ""}
                    />
                  )
                }),
              )}
              {/* Arrow marker definition */}
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
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
                    w-48 p-3 rounded-lg border-2 bg-white shadow-sm
                    ${getNodeColor(node.type)}
                    ${selectedNode === node.node_id ? "ring-2 ring-blue-500" : ""}
                  `}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {getNodeIcon(node.type)}
                      <Badge variant="outline" className="text-xs">
                        {node.type}
                      </Badge>
                    </div>
                    <h4 className="font-medium text-sm mb-1">{node.title}</h4>
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {node.duration}
                      </span>
                      {node.confidence && (
                        <span className="text-green-600 font-medium">{Math.round(node.confidence * 100)}%</span>
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getNodeIcon(selectedNodeData.type)}
              {selectedNodeData.title}
              <Badge variant="outline">{selectedNodeData.type}</Badge>
            </CardTitle>
            <CardDescription>Detailed reasoning and analysis for this step</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-slate-600">Duration:</span>
                <div className="flex items-center gap-1 mt-1">
                  <Clock className="h-3 w-3" />
                  {selectedNodeData.duration}
                </div>
              </div>
              {selectedNodeData.confidence && (
                <div>
                  <span className="font-medium text-slate-600">Confidence:</span>
                  <div className="flex items-center gap-1 mt-1">
                    <Zap className="h-3 w-3" />
                    {Math.round(selectedNodeData.confidence * 100)}%
                  </div>
                </div>
              )}
              <div>
                <span className="font-medium text-slate-600">Status:</span>
                <div className="flex items-center gap-1 mt-1">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  {selectedNodeData.status}
                </div>
              </div>
            </div>

            {selectedNodeData.reasoning && (
              <div>
                <span className="font-medium text-slate-600">Reasoning:</span>
                <p className="mt-1 text-sm text-slate-700 bg-slate-50 p-3 rounded">{selectedNodeData.reasoning}</p>
              </div>
            )}

            {selectedNodeData.connections.length > 0 && (
              <div>
                <span className="font-medium text-slate-600">Connected to:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedNodeData.connections.map((connId) => {
                    const connectedNode = mockReasoningNodes.find((n) => n.node_id === connId)
                    return connectedNode ? (
                      <Button
                        key={connId}
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedNode(connId)}
                        className="text-xs"
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
