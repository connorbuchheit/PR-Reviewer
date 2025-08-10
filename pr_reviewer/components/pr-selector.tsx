"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  GitPullRequest,
  Search,
  Filter,
  Calendar,
  User,
  GitBranch,
  FileText,
  TrendingUp,
  X,
  CheckCircle,
  AlertTriangle,
  Merge,
} from "lucide-react"
import type { PRData } from "@/types/pr-data"

interface PRSelectorProps {
  prs: PRData[]
  selectedPR: PRData
  onSelectPR: (pr: PRData) => void
  onClose: () => void
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "open":
      return <GitPullRequest className="h-4 w-4 text-blue-400" />
    case "reviewed":
      return <CheckCircle className="h-4 w-4 text-green-400" />
    case "merged":
      return <Merge className="h-4 w-4 text-purple-400" />
    case "closed":
      return <X className="h-4 w-4 text-red-400" />
    default:
      return <GitPullRequest className="h-4 w-4 text-gray-400" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "open":
      return "bg-blue-900/30 text-blue-400 border-blue-600"
    case "reviewed":
      return "bg-green-900/30 text-green-400 border-green-600"
    case "merged":
      return "bg-purple-900/30 text-purple-400 border-purple-600"
    case "closed":
      return "bg-red-900/30 text-red-400 border-red-600"
    default:
      return "bg-gray-900/30 text-gray-400 border-gray-600"
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

export function PRSelector({ prs, selectedPR, onSelectPR, onClose }: PRSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  const filteredPRs = prs.filter((pr) => {
    const matchesSearch =
      pr.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pr.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pr.branch.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || pr.status === statusFilter
    const matchesPriority = priorityFilter === "all" || pr.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const handlePRClick = (pr: PRData) => {
    onSelectPR(pr)
    onClose()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getReviewStats = () => {
    const total = prs.length
    const reviewed = prs.filter((pr) => pr.status === "reviewed").length
    const merged = prs.filter((pr) => pr.status === "merged").length
    const open = prs.filter((pr) => pr.status === "open").length
    return { total, reviewed, merged, open }
  }

  const stats = getReviewStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Pull Request Dashboard
          </h1>
          <p className="text-white/70">Select a PR to review and analyze</p>
        </div>
        <Button
          onClick={onClose}
          variant="outline"
          className="border-slate-600 text-white hover:bg-slate-800 bg-transparent"
        >
          <X className="h-4 w-4 mr-2" />
          Close
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-black border-slate-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-sm text-white/60">Total PRs</div>
          </CardContent>
        </Card>
        <Card className="bg-black border-slate-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{stats.open}</div>
            <div className="text-sm text-white/60">Open</div>
          </CardContent>
        </Card>
        <Card className="bg-black border-slate-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{stats.reviewed}</div>
            <div className="text-sm text-white/60">Reviewed</div>
          </CardContent>
        </Card>
        <Card className="bg-black border-slate-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{stats.merged}</div>
            <div className="text-sm text-white/60">Merged</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-black border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Filter className="h-5 w-5 text-purple-400" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input
                  placeholder="Search PRs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-600 text-white placeholder:text-white/50"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="merged">Merged</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Priority</label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PR List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredPRs.map((pr) => (
          <Card
            key={pr.id}
            className={`bg-black border-slate-700 cursor-pointer transition-all duration-200 hover:border-purple-500 hover:shadow-lg ${
              selectedPR.id === pr.id ? "ring-2 ring-purple-500 border-purple-500" : ""
            }`}
            onClick={() => handlePRClick(pr)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(pr.status)}
                  <span className="font-medium text-white">#{pr.number}</span>
                  <Badge className={`text-xs ${getStatusColor(pr.status)}`}>{pr.status}</Badge>
                  <Badge className={`text-xs ${getPriorityColor(pr.priority)}`}>{pr.priority}</Badge>
                </div>
                {pr.reviewScore && (
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-400" />
                    <span className="text-sm font-medium text-green-400">{pr.reviewScore}</span>
                  </div>
                )}
              </div>
              <CardTitle className="text-lg text-white leading-tight">{pr.title}</CardTitle>
              {pr.description && (
                <CardDescription className="text-white/60 text-sm line-clamp-2">{pr.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-white/60">
                  <User className="h-3 w-3" />
                  <span>{pr.author}</span>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <GitBranch className="h-3 w-3" />
                  <span className="font-mono text-xs">{pr.branch}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-white/60">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(pr.updatedAt)}</span>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <FileText className="h-3 w-3" />
                  <span>{pr.files} files</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {pr.labels.slice(0, 3).map((label) => (
                    <Badge key={label} variant="outline" className="text-xs border-slate-600 text-white/60">
                      {label}
                    </Badge>
                  ))}
                  {pr.labels.length > 3 && (
                    <Badge variant="outline" className="text-xs border-slate-600 text-white/60">
                      +{pr.labels.length - 3}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-green-400">+{pr.additions}</span>
                  <span className="text-red-400">-{pr.deletions}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPRs.length === 0 && (
        <Card className="bg-black border-slate-700">
          <CardContent className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No PRs Found</h3>
            <p className="text-white/60">Try adjusting your search criteria or filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
