#!/usr/bin/env node
/**
 * PNG → WebP pipeline for src/assets (incremental by mtime).
 * Usage:
 *   node scripts/convert-assets-webp.mjs           # all assets
 *   node scripts/convert-assets-webp.mjs path.png # single file(s)
 */

import sharp from 'sharp'
import { readdir, stat } from 'node:fs/promises'
import { join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)))
const ASSETS_DIR = join(ROOT, 'src/assets')
const QUALITY = 82
const SKIP_DIRS = new Set(['_inbox', 'node_modules'])

async function walkPngs(dir, files = []) {
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return files
  }

  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue
      await walkPngs(fullPath, files)
      continue
    }
    if (entry.isFile() && entry.name.toLowerCase().endsWith('.png')) {
      files.push(fullPath)
    }
  }

  return files
}

function toWebpPath(pngPath) {
  return pngPath.replace(/\.png$/i, '.webp')
}

async function needsConversion(pngPath, webpPath) {
  const pngStat = await stat(pngPath)
  try {
    const webpStat = await stat(webpPath)
    return webpStat.mtimeMs < pngStat.mtimeMs
  } catch {
    return true
  }
}

async function convertOne(pngPath) {
  const webpPath = toWebpPath(pngPath)
  if (!(await needsConversion(pngPath, webpPath))) {
    return { status: 'skipped', pngPath, webpPath, saved: 0 }
  }

  const before = (await stat(pngPath)).size
  await sharp(pngPath).webp({ quality: QUALITY, effort: 4 }).toFile(webpPath)
  const after = (await stat(webpPath)).size

  return {
    status: 'converted',
    pngPath,
    webpPath,
    saved: Math.max(0, before - after),
    before,
    after,
  }
}

function formatBytes(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${bytes} B`
}

async function resolveInputs(args) {
  if (args.length === 0) {
    return walkPngs(ASSETS_DIR)
  }

  const paths = []
  for (const arg of args) {
    const abs = resolve(ROOT, arg)
    if (abs.toLowerCase().endsWith('.png')) {
      paths.push(abs)
      continue
    }
    paths.push(...(await walkPngs(abs)))
  }
  return [...new Set(paths)].sort()
}

async function main() {
  const args = process.argv.slice(2)
  const pngPaths = await resolveInputs(args)

  if (!pngPaths.length) {
    console.log('No PNG files found.')
    return
  }

  let converted = 0
  let skipped = 0
  let pngTotal = 0
  let webpTotal = 0
  let savedTotal = 0

  for (const pngPath of pngPaths) {
    const result = await convertOne(pngPath)
    const rel = relative(ROOT, result.pngPath)

    if (result.status === 'skipped') {
      skipped += 1
      const webpStat = await stat(result.webpPath)
      const pngStat = await stat(result.pngPath)
      pngTotal += pngStat.size
      webpTotal += webpStat.size
      continue
    }

    converted += 1
    savedTotal += result.saved
    pngTotal += result.before
    webpTotal += result.after
    console.log(
      `${rel} → ${formatBytes(result.before)} → ${formatBytes(result.after)} (−${formatBytes(result.saved)})`,
    )
  }

  console.log('')
  console.log(
    `WebP pipeline: ${converted} converted, ${skipped} up-to-date, ${pngPaths.length} PNG(s) scanned`,
  )
  console.log(`Size: ${formatBytes(pngTotal)} PNG → ${formatBytes(webpTotal)} WebP (−${formatBytes(savedTotal)})`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
