"use client"

import { memo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { MarkdownComponents } from '@/components/markdown-components'

function SolutionContentComponent({ content }: { content: string }) {
  const components = MarkdownComponents()

  return (
    <div className="prose max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  )
}

export default memo(SolutionContentComponent)
