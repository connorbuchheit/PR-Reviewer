"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
  Database,
  Github,
  FileText,
  Slack,
  RefreshCw,
  Clock,
  Shield,
  TrendingUp,
  Wifi,
  WifiOff,
  Package,
  Search,
  Filter,
  Settings,
  ExternalLink,
} from "lucide-react"
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
      return <Github className="h-5 w-5" />
    case "confluence":
    case "notion":
    case "wiki":
      return <FileText className="h-5 w-5" />
    case "slack":
      return <Slack className="h-5 w-5" />
    case "pdf":
      return <FileText className="h-5 w-5" />
    case "s3":
      return <Database className="h-5 w-5" />
    case "jira":
      return <Package className="h-5 w-5" />
    default:
      return <Database className="h-5 w-5" />
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
      return <Wifi className="h-4 w-4" />
    case "syncing":
      return <RefreshCw className="h-4 w-4 animate-spin" />
    case "error":
      return <WifiOff className="h-4 w-4" />
    case "stale":
      return <Clock className="h-4 w-4" />
    default:
      return <Database className="h-4 w-4" />
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-900/30 text-red-400 border-red-600"
    case "medium":
      return "bg-yellow-900/30 text-yellow-400 border-yellow-600"
    case "low":
      return "bg-blue-900/30 text-blue-400 border-blue-600"
    default:
      return "bg-gray-900/30 text-gray-400 border-gray-600"
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

export function KnowledgeBaseFull() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 2000)
  }

  const activeCount = mockKnowledgeSources.filter((s) => s.status === "active").length
  const syncingCount = mockKnowledgeSources.filter((s) => s.status === "syncing").length
  const errorCount = mockKnowledgeSources.filter((s) => s.status === "error").length
  const staleCount = mockKnowledgeSources.filter((s) => s.status === "stale").length
  const totalCount = mockKnowledgeSources.length
  const avgConfidence = mockKnowledgeSources.reduce((sum, s) => sum + s.confidence, 0) / totalCount

  const filteredSources = mockKnowledgeSources.filter(
    (source) =>
      source.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getProviderName(source.type).toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <Card className="bg-black border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="h-6 w-6 text-purple-400" />
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent text-2xl">
                Knowledge Base Management
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                size="sm"
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-800 bg-transparent"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                Sync All
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-800 bg-transparent"
              >
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
            </div>
          </CardTitle>
          <CardDescription className="text-white/70 text-lg">
            Manage and monitor all knowledge sources for the PR Review Agent
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="bg-black border-slate-700">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">{activeCount}</div>
            <div className="text-sm text-white/60">Active Sources</div>
          </CardContent>
        </Card>
        <Card className="bg-black border-slate-700">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">{syncingCount}</div>
            <div className="text-sm text-white/60">Syncing</div>
          </CardContent>
        </Card>
        <Card className="bg-black border-slate-700">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">{staleCount}</div>
            <div className="text-sm text-white/60">Stale</div>
          </CardContent>
        </Card>
        <Card className="bg-black border-slate-700">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-red-400 mb-2">{errorCount}</div>
            <div className="text-sm text-white/60">Errors</div>
          </CardContent>
        </Card>
        <Card className="bg-black border-slate-700">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">{Math.round(avgConfidence * 100)}%</div>
            <div className="text-sm text-white/60">Avg Confidence</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="bg-black border-slate-700">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                placeholder="Search knowledge sources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-600 text-white placeholder:text-white/50"
              />
            </div>
            <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-800 bg-transparent">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Knowledge Sources Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSources.map((source) => (
          <Card key={source.id} className="bg-black border-slate-700 hover:bg-slate-900/50 transition-colors">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${getStatusColor(source.status)}`}>{getSourceIcon(source.type)}</div>
                  <div>
                    <h3 className="font-semibold text-white text-lg">{source.name}</h3>
                    <p className="text-sm text-purple-400">via {getProviderName(source.type)}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className={`${getStatusColor(source.status)}`}>
                    {getStatusIcon(source.status)}
                    <span className="ml-2 capitalize">{source.status}</span>
                  </Badge>
                  <Badge className={`${getPriorityColor(source.priority)}`}>{source.priority} priority</Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Confidence and Scope */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-white/60 mb-2">Confidence Level</div>
                  <div className="flex items-center gap-3">
                    <Progress value={source.confidence * 100} className="flex-1 h-3 bg-slate-800" />
                    <span className="text-sm font-medium text-white">{Math.round(source.confidence * 100)}%</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-white/60 mb-2">Scope</div>
                  <Badge variant="outline" className="border-slate-600 text-white/70 capitalize">
                    {source.scope}
                  </Badge>
                </div>
              </div>

              {/* Last Updated */}
              <div>
                <div className="text-sm text-white/60 mb-1">Last Updated</div>
                <div className="flex items-center gap-2 text-sm text-white">
                  <Clock className="h-4 w-4 text-white/40" />
                  {getTimeAgo(source.lastUpdated)}
                  <span className="text-white/40">•</span>
                  <span className="text-white/60">{new Date(source.lastUpdated).toLocaleDateString()}</span>
                </div>
              </div>

              {/* URL if available */}
              {source.url && (
                <div>
                  <div className="text-sm text-white/60 mb-1">Source URL</div>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-slate-800 px-2 py-1 rounded text-white/80 flex-1 truncate">
                      {source.url}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-600 text-white hover:bg-slate-800 bg-transparent"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-slate-700">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-slate-600 text-white hover:bg-slate-800 bg-transparent"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-slate-600 text-white hover:bg-slate-800 bg-transparent"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Configure
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-slate-600 text-white hover:bg-slate-800 bg-transparent"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Health Summary */}
      <Card className="bg-black border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-400" />
            <span className="text-white">System Health</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-slate-800 rounded-lg">
              <div className="text-2xl font-bold text-green-400 mb-2">98.5%</div>
              <div className="text-sm text-white/60">Uptime</div>
            </div>
            <div className="text-center p-4 bg-slate-800 rounded-lg">
              <div className="text-2xl font-bold text-blue-400 mb-2">1.2s</div>
              <div className="text-sm text-white/60">Avg Response</div>
            </div>
            <div className="text-center p-4 bg-slate-800 rounded-lg">
              <div className="text-2xl font-bold text-purple-400 mb-2">2.4M</div>
              <div className="text-sm text-white/60">Queries Today</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
