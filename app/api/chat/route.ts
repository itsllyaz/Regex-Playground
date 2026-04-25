import { streamText } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"

export async function POST(req: Request) {
  const apiKey = req.headers.get("x-gemini-api-key")

  if (!apiKey) {
    return new Response("Missing Gemini API key", { status: 401 })
  }

  const { messages, context } = await req.json()

  const google = createGoogleGenerativeAI({
    apiKey,
  })

  const systemPrompt = `You are a helpful regex assistant embedded in a Regex Playground tool. Your job is to help users understand, debug, and improve their regular expressions.

Current context:
- Pattern: ${context?.pattern || "(no pattern entered)"}
- Flags: ${context?.flags || "(no flags)"}
- Test String: ${context?.testString || "(no test string)"}

Guidelines:
- Be concise and helpful
- When explaining regex, break down each part clearly
- Suggest improvements when appropriate
- Use code formatting for regex patterns
- If the user asks about their current pattern, analyze it based on the context above
- Help debug why patterns might not be matching
- Suggest common regex patterns for common use cases`

  const result = streamText({
    model: google("gemini-2.0-flash"),
    system: systemPrompt,
    messages,
  })

  return result.toDataStreamResponse()
}
