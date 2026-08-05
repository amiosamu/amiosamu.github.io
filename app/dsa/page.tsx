import type { Metadata } from 'next'
import { getAllProblems, getCategories } from '@/lib/problems'
import ProblemBrowser from './problem-browser'

export const metadata: Metadata = {
  title: 'DSA - amiosamu',
  description: 'Solutions and notes for the NeetCode 250.',
}

export default function DsaPage() {
  return <ProblemBrowser problems={getAllProblems()} categories={getCategories()} />
}
