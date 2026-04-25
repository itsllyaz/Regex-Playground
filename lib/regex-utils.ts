export interface RegexPreset {
  name: string
  pattern: string
  description: string
  flags: string
}

export const REGEX_PRESETS: RegexPreset[] = [
  {
    name: "Email",
    pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-z]{2,}",
    description: "Matches email addresses",
    flags: "gi",
  },
  {
    name: "Phone",
    pattern: "\\+?\\d{1,3}[- ]?\\d{3}[- ]?\\d{4}",
    description: "Matches phone numbers",
    flags: "g",
  },
  {
    name: "URL",
    pattern: "https?://[^\\s]+",
    description: "Matches URLs starting with http or https",
    flags: "gi",
  },
  {
    name: "Password",
    pattern: "^(?=.*[A-Z])(?=.*\\d).{8,}$",
    description: "Password with uppercase and digit, min 8 chars",
    flags: "",
  },
]

export const COMMON_TOKENS = [
  { token: "\\d", description: "Any digit (0-9)" },
  { token: "\\w", description: "Any word character (a-z, A-Z, 0-9, _)" },
  { token: "\\s", description: "Any whitespace" },
  { token: ".", description: "Any character except newline" },
  { token: "^", description: "Start of string/line" },
  { token: "$", description: "End of string/line" },
  { token: "+", description: "One or more" },
  { token: "*", description: "Zero or more" },
  { token: "?", description: "Zero or one (optional)" },
  { token: "{n}", description: "Exactly n times" },
  { token: "{n,m}", description: "Between n and m times" },
  { token: "[abc]", description: "Any of a, b, or c" },
  { token: "[^abc]", description: "Not a, b, or c" },
  { token: "(abc)", description: "Capture group" },
  { token: "(?:abc)", description: "Non-capturing group" },
  { token: "a|b", description: "a or b" },
  { token: "\\b", description: "Word boundary" },
]

export interface RegexExplanation {
  part: string
  explanation: string
  type: "anchor" | "quantifier" | "group" | "character" | "special" | "literal" | "assertion"
}

export function explainRegex(pattern: string): RegexExplanation[] {
  const explanations: RegexExplanation[] = []
  let i = 0

  while (i < pattern.length) {
    const char = pattern[i]
    const nextChar = pattern[i + 1]

    // Escape sequences
    if (char === "\\") {
      if (nextChar === "d") {
        explanations.push({ part: "\\d", explanation: "Any digit (0-9)", type: "character" })
        i += 2
        continue
      }
      if (nextChar === "D") {
        explanations.push({ part: "\\D", explanation: "Any non-digit", type: "character" })
        i += 2
        continue
      }
      if (nextChar === "w") {
        explanations.push({ part: "\\w", explanation: "Any word character (a-z, A-Z, 0-9, _)", type: "character" })
        i += 2
        continue
      }
      if (nextChar === "W") {
        explanations.push({ part: "\\W", explanation: "Any non-word character", type: "character" })
        i += 2
        continue
      }
      if (nextChar === "s") {
        explanations.push({ part: "\\s", explanation: "Any whitespace character", type: "character" })
        i += 2
        continue
      }
      if (nextChar === "S") {
        explanations.push({ part: "\\S", explanation: "Any non-whitespace character", type: "character" })
        i += 2
        continue
      }
      if (nextChar === "b") {
        explanations.push({ part: "\\b", explanation: "Word boundary", type: "anchor" })
        i += 2
        continue
      }
      if (nextChar === "B") {
        explanations.push({ part: "\\B", explanation: "Non-word boundary", type: "anchor" })
        i += 2
        continue
      }
      if (nextChar === "n") {
        explanations.push({ part: "\\n", explanation: "Newline character", type: "special" })
        i += 2
        continue
      }
      if (nextChar === "t") {
        explanations.push({ part: "\\t", explanation: "Tab character", type: "special" })
        i += 2
        continue
      }
      if (nextChar === ".") {
        explanations.push({ part: "\\.", explanation: "Literal dot character", type: "literal" })
        i += 2
        continue
      }
      if (nextChar === "+") {
        explanations.push({ part: "\\+", explanation: "Literal plus character", type: "literal" })
        i += 2
        continue
      }
      if (nextChar === "*") {
        explanations.push({ part: "\\*", explanation: "Literal asterisk character", type: "literal" })
        i += 2
        continue
      }
      if (nextChar === "?") {
        explanations.push({ part: "\\?", explanation: "Literal question mark", type: "literal" })
        i += 2
        continue
      }
      if (nextChar === "[") {
        explanations.push({ part: "\\[", explanation: "Literal opening bracket", type: "literal" })
        i += 2
        continue
      }
      if (nextChar === "]") {
        explanations.push({ part: "\\]", explanation: "Literal closing bracket", type: "literal" })
        i += 2
        continue
      }
      if (nextChar === "(") {
        explanations.push({ part: "\\(", explanation: "Literal opening parenthesis", type: "literal" })
        i += 2
        continue
      }
      if (nextChar === ")") {
        explanations.push({ part: "\\)", explanation: "Literal closing parenthesis", type: "literal" })
        i += 2
        continue
      }
      if (nextChar === "\\") {
        explanations.push({ part: "\\\\", explanation: "Literal backslash", type: "literal" })
        i += 2
        continue
      }
      if (nextChar === "/") {
        explanations.push({ part: "\\/", explanation: "Literal forward slash", type: "literal" })
        i += 2
        continue
      }
      // Generic escaped character
      if (nextChar) {
        explanations.push({ part: `\\${nextChar}`, explanation: `Escaped character: ${nextChar}`, type: "literal" })
        i += 2
        continue
      }
    }

    // Anchors
    if (char === "^") {
      explanations.push({ part: "^", explanation: "Start of string", type: "anchor" })
      i++
      continue
    }
    if (char === "$") {
      explanations.push({ part: "$", explanation: "End of string", type: "anchor" })
      i++
      continue
    }

    // Character classes
    if (char === "[") {
      let classContent = "["
      let j = i + 1
      const isNegated = pattern[j] === "^"
      while (j < pattern.length && pattern[j] !== "]") {
        classContent += pattern[j]
        j++
      }
      classContent += "]"
      const innerContent = classContent.slice(isNegated ? 2 : 1, -1)
      explanations.push({
        part: classContent,
        explanation: isNegated 
          ? `Any character NOT in: ${innerContent}` 
          : `Any character in: ${innerContent}`,
        type: "character"
      })
      i = j + 1
      continue
    }

    // Groups
    if (char === "(") {
      let groupContent = "("
      let depth = 1
      let j = i + 1
      while (j < pattern.length && depth > 0) {
        if (pattern[j] === "(" && pattern[j - 1] !== "\\") depth++
        if (pattern[j] === ")" && pattern[j - 1] !== "\\") depth--
        groupContent += pattern[j]
        j++
      }
      
      // Check for lookahead/lookbehind
      if (groupContent.startsWith("(?=")) {
        explanations.push({
          part: groupContent,
          explanation: `Positive lookahead: must be followed by ${groupContent.slice(3, -1)}`,
          type: "assertion"
        })
      } else if (groupContent.startsWith("(?!")) {
        explanations.push({
          part: groupContent,
          explanation: `Negative lookahead: must NOT be followed by ${groupContent.slice(3, -1)}`,
          type: "assertion"
        })
      } else if (groupContent.startsWith("(?<=")) {
        explanations.push({
          part: groupContent,
          explanation: `Positive lookbehind: must be preceded by ${groupContent.slice(4, -1)}`,
          type: "assertion"
        })
      } else if (groupContent.startsWith("(?<!")) {
        explanations.push({
          part: groupContent,
          explanation: `Negative lookbehind: must NOT be preceded by ${groupContent.slice(4, -1)}`,
          type: "assertion"
        })
      } else if (groupContent.startsWith("(?:")) {
        explanations.push({
          part: groupContent,
          explanation: `Non-capturing group: ${groupContent.slice(3, -1)}`,
          type: "group"
        })
      } else {
        const innerGroup = groupContent.slice(1, -1)
        if (innerGroup.includes("|")) {
          const alternatives = innerGroup.split("|")
          explanations.push({
            part: groupContent,
            explanation: `Capture group: either ${alternatives.map(a => `'${a}'`).join(" or ")}`,
            type: "group"
          })
        } else {
          explanations.push({
            part: groupContent,
            explanation: `Capture group: ${innerGroup}`,
            type: "group"
          })
        }
      }
      i = j
      continue
    }

    // Quantifiers
    if (char === "+") {
      if (nextChar === "?") {
        explanations.push({ part: "+?", explanation: "One or more (lazy/non-greedy)", type: "quantifier" })
        i += 2
        continue
      }
      explanations.push({ part: "+", explanation: "One or more (greedy)", type: "quantifier" })
      i++
      continue
    }
    if (char === "*") {
      if (nextChar === "?") {
        explanations.push({ part: "*?", explanation: "Zero or more (lazy/non-greedy)", type: "quantifier" })
        i += 2
        continue
      }
      explanations.push({ part: "*", explanation: "Zero or more (greedy)", type: "quantifier" })
      i++
      continue
    }
    if (char === "?") {
      if (nextChar === "?") {
        explanations.push({ part: "??", explanation: "Zero or one (lazy/non-greedy)", type: "quantifier" })
        i += 2
        continue
      }
      explanations.push({ part: "?", explanation: "Zero or one (optional)", type: "quantifier" })
      i++
      continue
    }

    // Curly brace quantifiers
    if (char === "{") {
      let quantContent = "{"
      let j = i + 1
      while (j < pattern.length && pattern[j] !== "}") {
        quantContent += pattern[j]
        j++
      }
      quantContent += "}"
      const inner = quantContent.slice(1, -1)
      if (inner.includes(",")) {
        const [min, max] = inner.split(",")
        if (max === "") {
          explanations.push({
            part: quantContent,
            explanation: `${min} or more times`,
            type: "quantifier"
          })
        } else {
          explanations.push({
            part: quantContent,
            explanation: `Between ${min} and ${max} times`,
            type: "quantifier"
          })
        }
      } else {
        explanations.push({
          part: quantContent,
          explanation: `Exactly ${inner} times`,
          type: "quantifier"
        })
      }
      i = j + 1
      continue
    }

    // Special characters
    if (char === ".") {
      explanations.push({ part: ".", explanation: "Any character except newline", type: "special" })
      i++
      continue
    }
    if (char === "|") {
      explanations.push({ part: "|", explanation: "OR (alternation)", type: "special" })
      i++
      continue
    }

    // Literal character
    explanations.push({ part: char, explanation: `Literal character: '${char}'`, type: "literal" })
    i++
  }

  return explanations
}

export interface Match {
  text: string
  index: number
  length: number
  groups: string[]
}

export function findMatches(pattern: string, flags: string, text: string): Match[] {
  try {
    const regex = new RegExp(pattern, flags)
    const matches: Match[] = []
    
    if (flags.includes("g")) {
      let match
      while ((match = regex.exec(text)) !== null) {
        matches.push({
          text: match[0],
          index: match.index,
          length: match[0].length,
          groups: match.slice(1),
        })
        // Prevent infinite loops for zero-length matches
        if (match[0].length === 0) {
          regex.lastIndex++
        }
      }
    } else {
      const match = regex.exec(text)
      if (match) {
        matches.push({
          text: match[0],
          index: match.index,
          length: match[0].length,
          groups: match.slice(1),
        })
      }
    }
    
    return matches
  } catch {
    return []
  }
}

export function validateRegex(pattern: string, flags: string): { valid: boolean; error?: string } {
  try {
    new RegExp(pattern, flags)
    return { valid: true }
  } catch (e) {
    return { valid: false, error: (e as Error).message }
  }
}

export function exportAsJSON(pattern: string, flags: string, explanations: RegexExplanation[], matches: Match[]) {
  return JSON.stringify({
    pattern,
    flags,
    fullRegex: `/${pattern}/${flags}`,
    explanations: explanations.map(e => ({ part: e.part, meaning: e.explanation })),
    matchCount: matches.length,
    matches: matches.map(m => ({
      match: m.text,
      position: m.index,
      captureGroups: m.groups,
    })),
  }, null, 2)
}

export function exportAsMarkdown(pattern: string, flags: string, explanations: RegexExplanation[], matches: Match[]) {
  let md = `# Regex Pattern\n\n`
  md += `\`\`\`\n/${pattern}/${flags}\n\`\`\`\n\n`
  md += `## Explanation\n\n`
  md += `| Part | Meaning |\n|------|--------|\n`
  explanations.forEach(e => {
    md += `| \`${e.part}\` | ${e.explanation} |\n`
  })
  md += `\n## Matches (${matches.length})\n\n`
  matches.forEach((m, i) => {
    md += `${i + 1}. **"${m.text}"** at position ${m.index}`
    if (m.groups.length > 0) {
      md += ` (groups: ${m.groups.map((g, gi) => `$${gi + 1}="${g}"`).join(", ")})`
    }
    md += `\n`
  })
  return md
}
