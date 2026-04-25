"use client"

import * as React from "react"
import { RegexEditor } from "@/components/regex-editor"
import { TestArea } from "@/components/test-area"
import { ExplanationPanel } from "@/components/explanation-panel"
import { ThemeToggle } from "@/components/theme-toggle"
import { AIChat } from "@/components/ai-chat"
import { findMatches, explainRegex, validateRegex } from "@/lib/regex-utils"
import { Code2 } from "lucide-react"

const DEFAULT_TEXT = `Hello, my email is test@example.com and my phone is +1-202-555-0183.
Visit https://example.org for more info.`

export function RegexPlayground() {
  const [pattern, setPattern] = React.useState("")
  const [flags, setFlags] = React.useState("g")
  const [text, setText] = React.useState(DEFAULT_TEXT)

  const validation = validateRegex(pattern, flags)
  const matches = React.useMemo(() => {
    if (!validation.valid || !pattern) return []
    return findMatches(pattern, flags, text)
  }, [pattern, flags, text, validation.valid])

  const explanations = React.useMemo(() => {
    if (!pattern) return []
    return explainRegex(pattern)
  }, [pattern])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-screen-2xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Code2 className="size-5" />
            <h1 className="text-lg font-semibold">Regex Playground</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="mx-auto max-w-screen-2xl p-4">
          {/* Desktop Layout */}
          <div className="hidden gap-4 lg:grid lg:grid-cols-3">
            {/* Left Panel - Editor */}
            <div className="h-[calc(100vh-88px)]">
              <RegexEditor
                pattern={pattern}
                setPattern={setPattern}
                flags={flags}
                setFlags={setFlags}
              />
            </div>

            {/* Center Panel - Test Area */}
            <div className="h-[calc(100vh-88px)]">
              <TestArea
                text={text}
                setText={setText}
                matches={matches}
                isValidRegex={validation.valid}
              />
            </div>

            {/* Right Panel - Explanation */}
            <div className="h-[calc(100vh-88px)]">
              <ExplanationPanel
                pattern={pattern}
                flags={flags}
                explanations={explanations}
                matches={matches}
              />
            </div>
          </div>

          {/* Mobile/Tablet Layout */}
          <div className="flex flex-col gap-6 lg:hidden">
            {/* Editor */}
            <RegexEditor
              pattern={pattern}
              setPattern={setPattern}
              flags={flags}
              setFlags={setFlags}
            />

            {/* Test Area */}
            <TestArea
              text={text}
              setText={setText}
              matches={matches}
              isValidRegex={validation.valid}
            />

            {/* Explanation */}
            <ExplanationPanel
              pattern={pattern}
              flags={flags}
              explanations={explanations}
              matches={matches}
            />
          </div>
        </div>
      </main>

      {/* AI Chat */}
      <AIChat
        currentPattern={pattern}
        currentFlags={flags}
        testString={text}
      />
    </div>
  )
}
