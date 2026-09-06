"use client"

import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash'
import cpp from 'react-syntax-highlighter/dist/esm/languages/prism/cpp'
import go from 'react-syntax-highlighter/dist/esm/languages/prism/go'
import java from 'react-syntax-highlighter/dist/esm/languages/prism/java'
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json'
import markdown from 'react-syntax-highlighter/dist/esm/languages/prism/markdown'
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python'
import rust from 'react-syntax-highlighter/dist/esm/languages/prism/rust'
import sql from 'react-syntax-highlighter/dist/esm/languages/prism/sql'
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript'

// PrismLight ships only markup/css/clike/javascript; everything else is opt-in.
// The full Prism build registers ~300 languages and is a very large client chunk.
// To use a new language in a fence, import it above and register it here.
SyntaxHighlighter.registerLanguage('bash', bash)
SyntaxHighlighter.registerLanguage('cpp', cpp)
SyntaxHighlighter.registerLanguage('go', go)
SyntaxHighlighter.registerLanguage('java', java)
SyntaxHighlighter.registerLanguage('json', json)
SyntaxHighlighter.registerLanguage('markdown', markdown)
SyntaxHighlighter.registerLanguage('python', python)
SyntaxHighlighter.registerLanguage('rust', rust)
SyntaxHighlighter.registerLanguage('sql', sql)
SyntaxHighlighter.registerLanguage('typescript', typescript)

export function MarkdownComponents() {
  // resolvedTheme, not theme: with the default "system" setting `theme` is the
  // string "system", so code blocks would stay light until an explicit toggle.
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return {
    h2({ node, children, ...props }: any) {
      const text = String(children)
      const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
      return (
        <h2 id={id} {...props}>
          {children}
        </h2>
      )
    },
    h3({ node, children, ...props }: any) {
      const text = String(children)
      const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
      return (
        <h3 id={id} {...props}>
          {children}
        </h3>
      )
    },
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '')
      const language = match ? match[1] : ''

      if (!inline && language) {
        return (
          <SyntaxHighlighter
            {...props}
            style={mounted && resolvedTheme === 'dark' ? oneDark : oneLight}
            language={language}
            PreTag="div"
            className="rounded-lg my-4"
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        )
      }

      return (
        <code className={className} {...props}>
          {children}
        </code>
      )
    },
    table({ node, children, ...props }: any) {
      // Wrapped so a wide table scrolls on its own instead of stretching the page.
      return (
        <div className="my-6 max-w-full overflow-x-auto">
          <table {...props}>{children}</table>
        </div>
      )
    },
    img({ node, src, alt, ...props }: any) {
      // Handle images with proper styling
      return (
        <span className="block my-6">
          <img
            src={src}
            alt={alt || ''}
            className="rounded-lg max-w-full h-auto"
            loading="lazy"
            {...props}
          />
          {alt && (
            <span className="block text-center text-sm text-muted-foreground mt-2 italic">
              {alt}
            </span>
          )}
        </span>
      )
    },
  }
}
