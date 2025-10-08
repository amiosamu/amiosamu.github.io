"use client"

import { memo } from 'react'
import ReactMarkdown from 'react-markdown'
import { MarkdownComponents } from '@/components/markdown-components'
import { TableOfContents } from '@/components/table-of-contents'

function EssayContentComponent({ content }: { content: string }) {
  const components = MarkdownComponents()
  
  return (
    <>
      <TableOfContents content={content} />
      <div className="prose dark:prose-invert max-w-none">
        <ReactMarkdown components={components}>
          {content}
        </ReactMarkdown>
      </div>
    </>
  )
}

// Memoize to prevent unnecessary re-renders
export default memo(EssayContentComponent)

