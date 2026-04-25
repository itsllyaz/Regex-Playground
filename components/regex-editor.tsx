"use client"

import * as React from "react"
import { COMMON_TOKENS, REGEX_PRESETS, type RegexPreset, validateRegex } from "@/lib/regex-utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { 
  AlertCircle, 
  CheckCircle2, 
  Plus,
  Code2,
  Sparkles
} from "lucide-react"

interface RegexEditorProps {
  pattern: string
  setPattern: (pattern: string) => void
  flags: string
  setFlags: (flags: string) => void
}

export function RegexEditor({ pattern, setPattern, flags, setFlags }: RegexEditorProps) {
  const [showTokens, setShowTokens] = React.useState(false)
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  
  const validation = validateRegex(pattern, flags)
  
  const handlePresetClick = (preset: RegexPreset) => {
    setPattern(preset.pattern)
    setFlags(preset.flags)
  }
  
  const insertToken = (token: string) => {
    if (inputRef.current) {
      const start = inputRef.current.selectionStart
      const end = inputRef.current.selectionEnd
      const newPattern = pattern.slice(0, start) + token + pattern.slice(end)
      setPattern(newPattern)
      // Focus and set cursor position after the inserted token
      setTimeout(() => {
        inputRef.current?.focus()
        inputRef.current?.setSelectionRange(start + token.length, start + token.length)
      }, 0)
    } else {
      setPattern(pattern + token)
    }
  }
  
  const toggleFlag = (flag: string) => {
    if (flags.includes(flag)) {
      setFlags(flags.replace(flag, ""))
    } else {
      setFlags(flags + flag)
    }
  }

  return (
    <div className="flex h-full flex-col gap-4">
      {/* Regex Input */}
      <Card className="py-4">
        <CardHeader className="pb-3 pt-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="size-4 text-muted-foreground" />
              <CardTitle className="text-base">Pattern</CardTitle>
            </div>
            {pattern && (
              validation.valid ? (
                <Badge variant="outline" className="gap-1 border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-3" />
                  Valid
                </Badge>
              ) : (
                <Badge variant="outline" className="gap-1 border-destructive/50 bg-destructive/10 text-destructive">
                  <AlertCircle className="size-3" />
                  Invalid
                </Badge>
              )
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="relative">
            <div className="flex items-center rounded-lg border bg-muted/30 font-mono text-sm">
              <span className="px-3 text-muted-foreground">/</span>
              <textarea
                ref={inputRef}
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="Enter regex pattern..."
                className="min-h-[60px] flex-1 resize-none bg-transparent px-1 py-3 outline-none placeholder:text-muted-foreground"
                spellCheck={false}
              />
              <span className="px-1 text-muted-foreground">/</span>
              <input
                type="text"
                value={flags}
                onChange={(e) => setFlags(e.target.value.replace(/[^gimsuy]/g, ""))}
                placeholder="flags"
                className="w-16 bg-transparent px-2 py-3 outline-none placeholder:text-muted-foreground"
                spellCheck={false}
              />
            </div>
          </div>
          
          {!validation.valid && pattern && (
            <p className="text-sm text-destructive">{validation.error}</p>
          )}
          
          {/* Flags */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">Flags:</span>
            {[
              { flag: "g", label: "Global", description: "Match all occurrences" },
              { flag: "i", label: "Case Insensitive", description: "Ignore case" },
              { flag: "m", label: "Multiline", description: "^ and $ match line starts/ends" },
              { flag: "s", label: "Dotall", description: ". matches newlines" },
            ].map(({ flag, label, description }) => (
              <Tooltip key={flag}>
                <TooltipTrigger asChild>
                  <Button
                    variant={flags.includes(flag) ? "default" : "outline"}
                    size="sm"
                    className="h-7 px-2 font-mono text-xs"
                    onClick={() => toggleFlag(flag)}
                  >
                    {flag}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-medium">{label}</p>
                  <p className="text-muted-foreground">{description}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Quick Tokens */}
      <Card className="py-4">
        <CardHeader className="pb-3 pt-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-muted-foreground" />
              <CardTitle className="text-base">Quick Insert</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTokens(!showTokens)}
            >
              {showTokens ? "Less" : "More"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1.5">
            {(showTokens ? COMMON_TOKENS : COMMON_TOKENS.slice(0, 8)).map((t) => (
              <Tooltip key={t.token}>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-2 font-mono text-xs"
                    onClick={() => insertToken(t.token)}
                  >
                    <Plus className="mr-1 size-3" />
                    {t.token}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t.description}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Presets */}
      <Card className="flex-1 py-4">
        <CardHeader className="pb-3 pt-0">
          <CardTitle className="text-base">Preset Patterns</CardTitle>
          <CardDescription>Click to use a common regex pattern</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[180px] px-6">
            <div className="space-y-2 pr-4">
              {REGEX_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handlePresetClick(preset)}
                  className="w-full rounded-lg border p-3 text-left transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{preset.name}</span>
                    <Badge variant="secondary" className="font-mono text-xs">
                      /{preset.flags || "—"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{preset.description}</p>
                  <code className="mt-2 block truncate font-mono text-xs text-muted-foreground">
                    {preset.pattern}
                  </code>
                </button>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
