"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Database, Github, FileText, Slack, RefreshCw, Clock, Wifi, WifiOff, Package, ExternalLink } from "lucide-react"
import type { KnowledgeSource } from "@/types/knowledge-base"

const mockKnowledgeSources: KnowledgeSource[] = [
  {
    id: "github_repo",
    name: "Current Repository",
    type: "github",
    url: "https://github.com/company/project",
    lastUpdated: "2024-01-15T10:25:00Z",
    status: "active",
    confidence: 0.95,
    priority: "high",
    scope: "repository",
  },
  {
    id: "company_policies",
    name: "Engineering Policies",
    type: "confluence",
    url: "https://company.atlassian.net/wiki/spaces/ENG",
    lastUpdated: "2024-01-14T15:30:00Z",
    status: "active",
    confidence: 0.88,
    priority: "high",
    scope: "organization",
  },
  {
    id: "security_guidelines",
    name: "Security Guidelines",
    type: "pdf",
    lastUpdated: "2024-01-10T09:15:00Z",
    status: "stale",
    confidence: 0.72,
    priority: "high",
    scope: "organization",
  },
  {
    id: "team_patterns",
    name: "Team Best Practices",
    type: "notion",
    url: "https://notion.so/company/team-practices",
    lastUpdated: "2024-01-15T08:45:00Z",
    status: "syncing",
    confidence: 0.85,
    priority: "medium",
    scope: "team",
  },
  {
    id: "sdk_docs",
    name: "SDK Documentation",
    type: "s3",
    url: "s3://company-docs/sdk/",
    lastUpdated: "2024-01-15T10:30:00Z",
    status: "active",
    confidence: 0.78,
    priority: "medium",
    scope: "global",
  },
]

const getSourceIcon = (type: string) => {
  switch (type) {
    case "github":
      return <Github className="h-4 w-4" />
    case "confluence":
    case "notion":
    case "wiki":
      return <FileText className="h-4 w-4" />
    case "slack":
      return <Slack className="h-4 w-4" />
    case "pdf":
      return <FileText className="h-4 w-4" />
    case "s3":
      return <Database className="h-4 w-4" />
    case "jira":
      return <Package className="h-4 w-4" />
    default:
      return <Database className="h-4 w-4" />
  }
}

const getProviderName = (type: string) => {
  switch (type) {
    case "github":
      return "GitHub"
    case "confluence":
      return "Confluence"
    case "notion":
      return "Notion"
    case "slack":
      return "Slack"
    case "pdf":
      return "PDF Storage"
    case "s3":
      return "Amazon S3"
    case "jira":
      return "Jira"
    case "google_drive":
      return "Google Drive"
    default:
      return "Unknown"
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-900/30 text-green-400 border-green-600"
    case "syncing":
      return "bg-blue-900/30 text-blue-400 border-blue-600"
    case "error":
      return "bg-red-900/30 text-red-400 border-red-600"
    case "stale":
      return "bg-yellow-900/30 text-yellow-400 border-yellow-600"
    default:
      return "bg-gray-900/30 text-gray-400 border-gray-600"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "active":
      return <Wifi className="h-3 w-3" />
    case "syncing":
      return <RefreshCw className="h-3 w-3 animate-spin" />
    case "error":
      return <WifiOff className="h-3 w-3" />
    case "stale":
      return <Clock className="h-3 w-3" />
    default:
      return <Database className="h-3 w-3" />
  }
}

const getTimeAgo = (timestamp: string) => {
  const now = new Date()
  const updated = new Date(timestamp)
  const diffMs = now.getTime() - updated.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)

  if (diffHours < 1) return "Just now"
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return `${Math.floor(diffDays / 7)}w ago`
}

export function KnowledgeBaseStatus() {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 2000)
  }

  const activeCount = mockKnowledgeSources.filter((s) => s.status === "active").length
  const totalCount = mockKnowledgeSources.length
  const avgConfidence = mockKnowledgeSources.reduce((sum, s) => sum + s.confidence, 0) / totalCount

  return (
    <Card className="w-full bg-black border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-purple-400" />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Knowledge Base
            </span>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            size="sm"
            variant="outline"
            className="border-slate-600 text-white hover:bg-slate-800 bg-transparent"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Sync
          </Button>
        </CardTitle>
        <CardDescription className="text-white/70">Knowledge sources overview</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-slate-800 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">{activeCount}</div>
            <div className="text-sm text-white/60">Active Sources</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">{Math.round(avgConfidence * 100)}%</div>
            <div className="text-sm text-white/60">Avg Confidence</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">{totalCount}</div>
            <div className="text-sm text-white/60">Total Sources</div>
          </div>
        </div>

        {/* Quick Summary */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-white mb-3">Recent Activity</h3>
          {mockKnowledgeSources.slice(0, 2).map((source) => (
            <div key={source.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${getStatusColor(source.status)}`}>{getSourceIcon(source.type)}</div>
                <div>
                  <div className="font-medium text-white text-sm">{source.name}</div>
                  <div className="text-xs text-white/60">via {getProviderName(source.type)}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={`text-xs ${getStatusColor(source.status)}`}>
                  {getStatusIcon(source.status)}
                  <span className="ml-1">{source.status}</span>
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* View Full Details Button */}
        <div className="pt-4 border-t border-slate-700">
          <Button variant="outline" className="w-full bg-transparent border-slate-600 text-white hover:bg-slate-800">
            <ExternalLink className="h-4 w-4 mr-2" />
            View Full Knowledge Base
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
