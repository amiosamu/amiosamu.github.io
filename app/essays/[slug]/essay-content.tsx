"use client"

import { memo } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import { markdownComponents } from '@/components/markdown-components'

function EssayContentComponent({ content }: { content: string }) {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

// Memoize to prevent unnecessary re-renders
export default memo(EssayContentComponent)
