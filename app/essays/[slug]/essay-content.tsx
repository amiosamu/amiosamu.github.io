"use client"

import ReactMarkdown from 'react-markdown'
import { MarkdownComponents } from '@/components/markdown-components'

export default function EssayContent({ content }: { content: string }) {
  const components = MarkdownComponents()
  
  return (
    <div className="prose dark:prose-invert max-w-none">
      <ReactMarkdown components={components}>
        {content}
      </ReactMarkdown>
    </div>
  )
}

