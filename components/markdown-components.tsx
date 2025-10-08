"use client"

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import Image from 'next/image'

export function MarkdownComponents() {
  const { theme } = useTheme()
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
            style={mounted && theme === 'dark' ? oneDark : oneLight}
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
    img({ node, src, alt, ...props }: any) {
      // Handle images with proper styling
      return (
        <span className="block my-6">
          <img
            src={src}
            alt={alt || ''}
            className="rounded-lg w-full h-auto"
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

