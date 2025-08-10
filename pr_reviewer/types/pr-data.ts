export interface PRData {
  id: string
  title: string
  number: number
  author: string
  branch: string
  files: number
  additions: number
  deletions: number
  status: "open" | "reviewed" | "merged" | "closed"
  createdAt: string
  updatedAt: string
  description?: string
  labels: string[]
  reviewScore?: number
  priority: "high" | "medium" | "low"
}

export interface ReviewResults {
  summary: string
  score: number
  categories: {
    performance: number
    security: number
    style: number
    testing: number
  }
  comments: Array<{
    file: string
    line: number
    type: "suggestion" | "optimization" | "warning" | "error"
    message: string
    code: string
  }>
  packages: Array<{
    name: string
    reason: string
  }>
}
