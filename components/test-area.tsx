"use client"

import * as React from "react"
import { type Match } from "@/lib/regex-utils"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, Target } from "lucide-react"

interface TestAreaProps {
  text: string
  setText: (text: string) => void
  matches: Match[]
  isValidRegex: boolean
}

// Match highlight colors for different groups
const MATCH_COLORS = [
  { bg: "bg-amber-500/30 dark:bg-amber-400/30", border: "ring-amber-500/50" },
  { bg: "bg-cyan-500/30 dark:bg-cyan-400/30", border: "ring-cyan-500/50" },
  { bg: "bg-pink-500/30 dark:bg-pink-400/30", border: "ring-pink-500/50" },
  { bg: "bg-lime-500/30 dark:bg-lime-400/30", border: "ring-lime-500/50" },
  { bg: "bg-indigo-500/30 dark:bg-indigo-400/30", border: "ring-indigo-500/50" },
]

export function TestArea({ text, setText, matches, isValidRegex }: TestAreaProps) {
  // Create highlighted text with matches
  const renderHighlightedText = () => {
    if (!isValidRegex || matches.length === 0) {
      return <span>{text}</span>
    }

    const parts: React.ReactNode[] = []
    let lastIndex = 0

    // Sort matches by index to handle them in order
    const sortedMatches = [...matches].sort((a, b) => a.index - b.index)

    sortedMatches.forEach((match, matchIndex) => {
      // Add text before this match
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`}>
            {text.slice(lastIndex, match.index)}
          </span>
        )
      }

      // Add the highlighted match
      const colorIndex = matchIndex % MATCH_COLORS.length
      const color = MATCH_COLORS[colorIndex]
      
      parts.push(
        <mark
          key={`match-${match.index}`}
          className={`${color.bg} rounded px-0.5 ring-1 ${color.border}`}
          title={`Match ${matchIndex + 1}: "${match.text}"${match.groups.length > 0 ? ` (${match.groups.length} groups)` : ""}`}
        >
          {match.text}
        </mark>
      )

      lastIndex = match.index + match.length
    })

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(
        <span key={`text-${lastIndex}`}>
          {text.slice(lastIndex)}
        </span>
      )
    }

    return parts
  }

  return (
    <div className="flex h-full flex-col gap-4">
      {/* Input Area */}
      <Card className="flex-1 py-4">
        <CardHeader className="pb-3 pt-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="size-4 text-muted-foreground" />
              <CardTitle className="text-base">Test String</CardTitle>
            </div>
            {matches.length > 0 && (
              <Badge variant="secondary">
                {matches.length} match{matches.length !== 1 ? "es" : ""}
              </Badge>
            )}
          </div>
          <CardDescription>Enter or paste text to test your regex</CardDescription>
        </CardHeader>
        <CardContent className="h-[calc(100%-80px)]">
          <div className="relative h-full rounded-lg border bg-muted/30">
            {/* Textarea for input */}
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Hello, my email is test@example.com and my phone is +1-202-555-0183.&#10;Visit https://example.org for more info."
              className="absolute inset-0 h-full w-full resize-none bg-transparent p-4 font-mono text-sm text-transparent caret-foreground outline-none placeholder:text-muted-foreground"
              spellCheck={false}
            />
            {/* Highlighted overlay */}
            <div 
              className="pointer-events-none absolute inset-0 h-full w-full overflow-auto whitespace-pre-wrap break-words p-4 font-mono text-sm"
              aria-hidden="true"
            >
              {text ? renderHighlightedText() : (
                <span className="text-muted-foreground">
                  {"Hello, my email is test@example.com and my phone is +1-202-555-0183.\nVisit https://example.org for more info."}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Match Details */}
      <Card className="py-4">
        <CardHeader className="pb-3 pt-0">
          <div className="flex items-center gap-2">
            <Target className="size-4 text-muted-foreground" />
            <CardTitle className="text-base">Match Details</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[200px] px-6">
            {matches.length === 0 ? (
              <div className="flex h-full items-center justify-center py-8 text-center text-sm text-muted-foreground">
                {isValidRegex ? "No matches found" : "Enter a valid regex to see matches"}
              </div>
            ) : (
              <div className="space-y-2 pr-4">
                {matches.map((match, index) => {
                  const colorIndex = index % MATCH_COLORS.length
                  const color = MATCH_COLORS[colorIndex]
                  return (
                    <div
                      key={`${match.index}-${index}`}
                      className="rounded-lg border p-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Badge className={`${color.bg} text-foreground border-0`}>
                            #{index + 1}
                          </Badge>
                          <code className="font-mono text-sm">{`"${match.text}"`}</code>
                        </div>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          pos {match.index}
                        </span>
                      </div>
                      {match.groups.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {match.groups.map((group, gi) => (
                            <Badge
                              key={gi}
                              variant="outline"
                              className="font-mono text-xs"
                            >
                              ${gi + 1}: {`"${group}"`}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
