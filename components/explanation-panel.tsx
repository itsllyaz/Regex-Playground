"use client"

import * as React from "react"
import { type RegexExplanation, type Match, exportAsJSON, exportAsMarkdown } from "@/lib/regex-utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BookOpen, 
  Copy, 
  Check,
  FileJson,
  FileText,
  Download
} from "lucide-react"

interface ExplanationPanelProps {
  pattern: string
  flags: string
  explanations: RegexExplanation[]
  matches: Match[]
}

const TYPE_COLORS: Record<RegexExplanation["type"], string> = {
  anchor: "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30",
  quantifier: "bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30",
  group: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  character: "bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-500/30",
  special: "bg-pink-500/20 text-pink-700 dark:text-pink-300 border-pink-500/30",
  literal: "bg-secondary text-secondary-foreground",
  assertion: "bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-500/30",
}

export function ExplanationPanel({ pattern, flags, explanations, matches }: ExplanationPanelProps) {
  const [copiedRegex, setCopiedRegex] = React.useState(false)
  const [copiedExport, setCopiedExport] = React.useState<string | null>(null)
  
  const copyToClipboard = async (text: string, type: "regex" | "json" | "markdown") => {
    await navigator.clipboard.writeText(text)
    if (type === "regex") {
      setCopiedRegex(true)
      setTimeout(() => setCopiedRegex(false), 2000)
    } else {
      setCopiedExport(type)
      setTimeout(() => setCopiedExport(null), 2000)
    }
  }
  
  const jsonExport = exportAsJSON(pattern, flags, explanations, matches)
  const markdownExport = exportAsMarkdown(pattern, flags, explanations, matches)
  
  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex h-full flex-col gap-4">
      {/* Copy Regex */}
      <Card className="py-4">
        <CardHeader className="pb-3 pt-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Full Pattern</CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => copyToClipboard(`/${pattern}/${flags}`, "regex")}
              disabled={!pattern}
            >
              {copiedRegex ? (
                <>
                  <Check className="size-3" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="size-3" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <code className="block rounded-lg bg-muted/50 p-3 font-mono text-sm break-all">
            {pattern ? `/${pattern}/${flags}` : "/pattern/flags"}
          </code>
        </CardContent>
      </Card>
      
      {/* Explanation */}
      <Card className="flex-1 py-4">
        <CardHeader className="pb-3 pt-0">
          <div className="flex items-center gap-2">
            <BookOpen className="size-4 text-muted-foreground" />
            <CardTitle className="text-base">Explanation</CardTitle>
          </div>
          <CardDescription>Human-readable breakdown of your regex</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[250px] px-6">
            {explanations.length === 0 ? (
              <div className="flex h-full items-center justify-center py-8 text-center text-sm text-muted-foreground">
                Enter a regex pattern to see explanation
              </div>
            ) : (
              <div className="space-y-2 pr-4">
                {explanations.map((exp, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-lg border p-3"
                  >
                    <Badge 
                      variant="outline" 
                      className={`shrink-0 font-mono ${TYPE_COLORS[exp.type]}`}
                    >
                      {exp.part}
                    </Badge>
                    <span className="text-sm">{exp.explanation}</span>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
      
      {/* Export */}
      <Card className="py-4">
        <CardHeader className="pb-3 pt-0">
          <div className="flex items-center gap-2">
            <Download className="size-4 text-muted-foreground" />
            <CardTitle className="text-base">Export</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="json">
            <TabsList className="w-full">
              <TabsTrigger value="json" className="flex-1 gap-1.5">
                <FileJson className="size-3" />
                JSON
              </TabsTrigger>
              <TabsTrigger value="markdown" className="flex-1 gap-1.5">
                <FileText className="size-3" />
                Markdown
              </TabsTrigger>
            </TabsList>
            <TabsContent value="json" className="mt-3 space-y-2">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1.5"
                  onClick={() => copyToClipboard(jsonExport, "json")}
                  disabled={!pattern}
                >
                  {copiedExport === "json" ? (
                    <>
                      <Check className="size-3" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="size-3" />
                      Copy
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1.5"
                  onClick={() => downloadFile(jsonExport, "regex-export.json", "application/json")}
                  disabled={!pattern}
                >
                  <Download className="size-3" />
                  Download
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="markdown" className="mt-3 space-y-2">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1.5"
                  onClick={() => copyToClipboard(markdownExport, "markdown")}
                  disabled={!pattern}
                >
                  {copiedExport === "markdown" ? (
                    <>
                      <Check className="size-3" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="size-3" />
                      Copy
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1.5"
                  onClick={() => downloadFile(markdownExport, "regex-export.md", "text/markdown")}
                  disabled={!pattern}
                >
                  <Download className="size-3" />
                  Download
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
