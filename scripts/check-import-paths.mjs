#!/usr/bin/env node
/** Fail CI/Vercel if barrel imports use wrong folder casing vs git. */
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const tracked = new Set(
  execSync('git ls-files "src/components/*/"', { cwd: ROOT, encoding: 'utf8' })
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((p) => p.split('/').slice(0, 3).join('/')),
)

const checks = [
  ['src/components/index.js', /\bfrom ['"]\.\/([^'"]+)['"]/g],
  ['src/index.css', /@import ["']\.\/components\/([^/'"]+)/g],
  ['src/App.jsx', /import\(['"]\.\/components\/([^'"]+)['"]\)/g],
]

const errors = []

for (const [file, pattern] of checks) {
  const text = readFileSync(join(ROOT, file), 'utf8')
  for (const match of text.matchAll(pattern)) {
    const segment = match[1].split('/')[0]
    const expected = [...tracked].find((p) => p.endsWith(`/${segment}`))
    const canonical = [...tracked].find(
      (p) => p.toLowerCase() === `src/components/${segment}`.toLowerCase(),
    )
    if (canonical && !canonical.endsWith(`/${segment}`)) {
      errors.push(`${file}: use "${canonical.split('/').pop()}" not "${segment}"`)
    }
  }
}

if (errors.length) {
  console.error('[import-paths] Case mismatch (breaks Linux/Vercel):\n')
  errors.forEach((e) => console.error(`  - ${e}`))
  process.exit(1)
}

console.log('[import-paths] OK')
