"use client"

import { useEffect, useState } from 'react'
import type { Components } from 'react-markdown'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useTheme } from 'next-themes'

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

function CodeBlock({ language, code }: { language: string; code: string }) {
  // resolvedTheme, not theme: with the default "system" setting `theme` is the
  // string "system", so code blocks would stay light until an explicit toggle.
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <SyntaxHighlighter
      style={mounted && resolvedTheme === 'dark' ? oneDark : oneLight}
      language={language}
      PreTag="div"
      className="rounded-lg my-4"
    >
      {code}
    </SyntaxHighlighter>
  )
}

// Module-level on purpose. react-markdown uses these functions as element
// types, so building the object inside a component gives every render new
// types and React remounts each overridden element. That once detached the
// essay headings the table of contents had already looked up, pinning its
// highlight to the last heading. Keep hooks inside child components instead.
//
// Heading ids come from rehype-slug in the content components; lib/toc-utils.ts
// generates the same ids with github-slugger.
export const markdownComponents: Components = {
  code({ node, className, children, ...props }) {
    const language = /language-(\w+)/.exec(className || '')?.[1]

    if (language) {
      return <CodeBlock language={language} code={String(children).replace(/\n$/, '')} />
    }

    return (
      <code className={className} {...props}>
        {children}
      </code>
    )
  },
  table({ node, children, ...props }) {
    // Wrapped so a wide table scrolls on its own instead of stretching the page.
    return (
      <div className="my-6 max-w-full overflow-x-auto">
        <table {...props}>{children}</table>
      </div>
    )
  },
  img({ node, src, alt, ...props }) {
    return (
      <span className="block my-6">
        {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary markdown images; static export has no image optimizer */}
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
