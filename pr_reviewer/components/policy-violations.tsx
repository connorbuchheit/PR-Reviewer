"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Shield, Info, XCircle, ExternalLink, Clock } from "lucide-react"
import { policyViolationsData } from "@/data/policy-violations-data"

interface PolicyViolationsProps {
  prId?: string
}

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case "error":
      return <XCircle className="h-4 w-4" />
    case "warning":
      return <AlertTriangle className="h-4 w-4" />
    case "info":
      return <Info className="h-4 w-4" />
    default:
      return <Shield className="h-4 w-4" />
  }
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "error":
      return "bg-red-900/30 text-red-400 border-red-600"
    case "warning":
      return "bg-yellow-900/30 text-yellow-400 border-yellow-600"
    case "info":
      return "bg-blue-900/30 text-blue-400 border-blue-600"
    default:
      return "bg-gray-900/30 text-gray-400 border-gray-600"
  }
}

export function PolicyViolations({ prId = "pr_142" }: PolicyViolationsProps) {
  const mockPolicyViolations = policyViolationsData[prId] || []

  const errorCount = mockPolicyViolations.filter((v) => v.severity === "error").length
  const warningCount = mockPolicyViolations.filter((v) => v.severity === "warning").length
  const infoCount = mockPolicyViolations.filter((v) => v.severity === "info").length

  return (
    <Card className="bg-black border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-purple-400" />
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Policy Compliance
          </span>
        </CardTitle>
        <CardDescription className="text-white/70">
          Detected violations and recommendations based on company policies
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary */}
        <div className="flex items-center gap-4 p-3 bg-slate-800 rounded-lg">
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-400" />
            <span className="text-sm font-medium text-white">{errorCount} Errors</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium text-white">{warningCount} Warnings</span>
          </div>
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium text-white">{infoCount} Info</span>
          </div>
        </div>

        {/* Violations */}
        {mockPolicyViolations.length > 0 ? (
          <div className="space-y-3">
            {mockPolicyViolations.map((violation) => (
              <div key={violation.id} className={`border rounded-lg p-4 ${getSeverityColor(violation.severity)}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getSeverityIcon(violation.severity)}
                    <span className="font-medium text-sm text-white">{violation.policyTitle}</span>
                    <Badge variant="outline" className={`text-xs capitalize ${getSeverityColor(violation.severity)}`}>
                      {violation.severity}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/60">
                    <Clock className="h-3 w-3" />
                    {Math.round(violation.confidence * 100)}% confident
                  </div>
                </div>

                <p className="text-sm mb-2 text-white/80">{violation.description}</p>

                {violation.sourceFile && (
                  <div className="text-xs text-white/60 mb-2">
                    📁 {violation.sourceFile}
                    {violation.sourceLine && `:${violation.sourceLine}`}
                  </div>
                )}

                <div className="bg-slate-800/50 rounded p-2 text-sm mb-3">
                  <strong className="text-white">Suggestion:</strong>{" "}
                  <span className="text-white/80">{violation.suggestion}</span>
                </div>

                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs border-slate-600 text-white/70">
                    Policy ID: {violation.policyId}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs bg-transparent border-slate-600 text-white hover:bg-slate-800"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View Policy
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Shield className="h-12 w-12 text-green-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-green-400 mb-2">All Policies Compliant</h3>
            <p className="text-white/60">No policy violations detected in this PR.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
