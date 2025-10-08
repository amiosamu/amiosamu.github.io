import { getAllEssays, getEssayBySlug, getAdjacentEssays } from '@/lib/essays'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import dynamic from 'next/dynamic'
import EssayContent from './essay-content'
import { EssayPagination } from '@/components/essay-pagination'
import { TagBadge } from '@/components/tag-badge'

// Lazy load BackToTop since it's not needed immediately
const BackToTop = dynamic(() => import('@/components/back-to-top').then(mod => ({ default: mod.BackToTop })), {
  ssr: false,
})

export async function generateStaticParams() {
  const essays = getAllEssays()
  return essays.map((essay) => ({
    slug: essay.slug,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const essay = getEssayBySlug(params.slug)
  
  if (!essay) {
    return {}
  }

  return {
    title: `${essay.title} - amiosamu`,
    description: essay.description,
  }
}

export default function EssayPage({ params }: { params: { slug: string } }) {
  let essay
  
  try {
    essay = getEssayBySlug(params.slug)
  } catch {
    notFound()
  }

  const { previous, next } = getAdjacentEssays(params.slug)

  return (
    <>
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Link 
          href="/essays/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to essays
        </Link>
        
        <article>
          <header className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{essay.title}</h1>
            <div className="flex flex-wrap items-center gap-3">
              {essay.date && (
                <p className="text-sm text-muted-foreground">
                  {new Date(essay.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              )}
              {essay.tags && essay.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {essay.tags.map((tag) => (
                    <TagBadge key={tag} tag={tag} />
                  ))}
                </div>
              )}
            </div>
          </header>
          
          <EssayContent content={essay.content} />
          
          <EssayPagination previousEssay={previous} nextEssay={next} />
        </article>
      </div>
      
      <BackToTop />
    </>
  )
}

