import { getAllEssays, getEssayBySlug } from '@/lib/essays'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import EssayContent from './essay-content'

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

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
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
          {essay.date && (
            <p className="text-sm text-muted-foreground">
              {new Date(essay.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          )}
        </header>
        
        <EssayContent content={essay.content} />
      </article>
    </div>
  )
}

