"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  MessageCircle,
  X,
  Send,
  Key,
  ExternalLink,
  Bot,
  User,
  Sparkles,
  Trash2,
} from "lucide-react"

interface AIChatProps {
  currentPattern: string
  currentFlags: string
  testString: string
}

export function AIChat({ currentPattern, currentFlags, testString }: AIChatProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [apiKey, setApiKey] = useState("")
  const [savedApiKey, setSavedApiKey] = useState<string | null>(null)
  const [isSettingKey, setIsSettingKey] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stored = localStorage.getItem("gemini-api-key")
    if (stored) {
      setSavedApiKey(stored)
    }
  }, [])

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: "/api/chat",
    headers: {
      "x-gemini-api-key": savedApiKey || "",
    },
    body: {
      context: {
        pattern: currentPattern,
        flags: currentFlags,
        testString: testString,
      },
    },
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem("gemini-api-key", apiKey.trim())
      setSavedApiKey(apiKey.trim())
      setApiKey("")
      setIsSettingKey(false)
    }
  }

  const handleClearApiKey = () => {
    localStorage.removeItem("gemini-api-key")
    setSavedApiKey(null)
    setMessages([])
  }

  const handleClearChat = () => {
    setMessages([])
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl ${
          isOpen ? "hidden" : ""
        }`}
      >
        <Sparkles className="h-5 w-5" />
        <span className="font-medium">Ask AI</span>
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 w-[380px] shadow-2xl border-border/50 bg-card/95 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 p-1.5">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <CardTitle className="text-base font-semibold">Regex AI Assistant</CardTitle>
            </div>
            <div className="flex items-center gap-1">
              {savedApiKey && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleClearChat}
                  title="Clear chat"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {!savedApiKey ? (
              <div className="p-4 space-y-4">
                <div className="text-center space-y-2">
                  <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <Key className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium">Enter your Gemini API Key</h3>
                  <p className="text-sm text-muted-foreground">
                    To chat with AI about regex patterns, you need a Gemini API key.
                  </p>
                </div>

                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full rounded-lg border border-dashed border-border p-3 text-sm text-muted-foreground hover:bg-muted/50 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  Get your free API key from Google AI Studio
                </a>

                <div className="space-y-2">
                  <Input
                    type="password"
                    placeholder="Paste your API key here..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSaveApiKey()}
                  />
                  <Button
                    onClick={handleSaveApiKey}
                    disabled={!apiKey.trim()}
                    className="w-full"
                  >
                    Save API Key
                  </Button>
                </div>

                <p className="text-xs text-center text-muted-foreground">
                  Your API key is stored locally in your browser and never sent to our servers.
                </p>
              </div>
            ) : (
              <>
                <ScrollArea className="h-[320px] p-4">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
                      <div className="rounded-full bg-muted p-3">
                        <MessageCircle className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">How can I help with regex?</p>
                        <p className="text-xs text-muted-foreground max-w-[240px]">
                          Ask me to explain patterns, help debug, or suggest improvements.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 justify-center pt-2">
                        <Badge
                          variant="secondary"
                          className="cursor-pointer hover:bg-secondary/80"
                          onClick={() => {
                            const fakeEvent = {
                              target: { value: "Explain my current regex pattern" },
                            } as React.ChangeEvent<HTMLInputElement>
                            handleInputChange(fakeEvent)
                          }}
                        >
                          Explain my pattern
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="cursor-pointer hover:bg-secondary/80"
                          onClick={() => {
                            const fakeEvent = {
                              target: { value: "How can I improve this regex?" },
                            } as React.ChangeEvent<HTMLInputElement>
                            handleInputChange(fakeEvent)
                          }}
                        >
                          Improve regex
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex gap-2 ${
                            message.role === "user" ? "justify-end" : "justify-start"
                          }`}
                        >
                          {message.role === "assistant" && (
                            <div className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 p-1.5 h-fit">
                              <Bot className="h-3 w-3 text-white" />
                            </div>
                          )}
                          <div
                            className={`rounded-lg px-3 py-2 max-w-[280px] text-sm ${
                              message.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            <p className="whitespace-pre-wrap">{message.content}</p>
                          </div>
                          {message.role === "user" && (
                            <div className="rounded-full bg-muted p-1.5 h-fit">
                              <User className="h-3 w-3" />
                            </div>
                          )}
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex gap-2 justify-start">
                          <div className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 p-1.5 h-fit">
                            <Bot className="h-3 w-3 text-white" />
                          </div>
                          <div className="rounded-lg px-3 py-2 bg-muted">
                            <div className="flex gap-1">
                              <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                              <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                              <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </ScrollArea>

                <form
                  onSubmit={handleSubmit}
                  className="border-t p-3 flex gap-2"
                >
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Ask about regex..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>

                <div className="px-3 pb-3 flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Using your Gemini API key
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs text-muted-foreground hover:text-destructive"
                    onClick={handleClearApiKey}
                  >
                    Remove key
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </>
  )
}
