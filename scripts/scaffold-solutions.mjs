#!/usr/bin/env node
/**
 * Creates a draft stub in solutions/ for every catalog problem that doesn't
 * have one yet. Safe to re-run: existing files are never touched, so this only
 * ever fills gaps (e.g. after adding problems to content/problems.json).
 *
 *   npm run scaffold
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const catalogPath = path.join(root, 'content', 'problems.json')
const solutionsDir = path.join(root, 'solutions')

const unescapeHtml = (value) =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")

// The leading lines are YAML comments: visible when you open the file, but
// dropped by the parser, so they can never drift out of sync with the catalog.
function stub(problem) {
  return `---
# ${unescapeHtml(problem.name)} · ${problem.difficulty} · ${unescapeHtml(problem.category)}
# ${problem.leetcode_url}
draft: true
pattern: ""
time: ""
space: ""
---

## Intuition

## Approach

## Code

\`\`\`python

\`\`\`
`
}

if (!fs.existsSync(catalogPath)) {
  console.error(`Catalog not found at ${catalogPath}`)
  process.exit(1)
}

const { problems } = JSON.parse(fs.readFileSync(catalogPath, 'utf8'))
fs.mkdirSync(solutionsDir, { recursive: true })

let created = 0
let skipped = 0

for (const problem of problems) {
  const target = path.join(solutionsDir, `${problem.slug}.md`)
  if (fs.existsSync(target)) {
    skipped += 1
    continue
  }
  fs.writeFileSync(target, stub(problem), 'utf8')
  created += 1
}

console.log(
  `scaffold: ${created} stub(s) created, ${skipped} existing file(s) left untouched (${problems.length} in catalog)`
)
