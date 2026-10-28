import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const SOURCE_ROOT = path.join(ROOT, 'src')
const MAX_LINES = 350
const LEGACY_OVERSIZED = new Set(['src/App.jsx'])

function walk(dir) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(dir, entry.name)
    return entry.isDirectory() ? walk(target) : [target]
  })
}

const files = walk(SOURCE_ROOT).filter((file) => /\.(js|jsx|mjs)$/.test(file))
const failures = []
const warnings = []

for (const file of files) {
  const relative = path.relative(ROOT, file).replaceAll('\\', '/')
  const content = fs.readFileSync(file, 'utf8')
  const lineCount = content.split(/\r?\n/).length

  if (lineCount > MAX_LINES) {
    if (LEGACY_OVERSIZED.has(relative)) warnings.push(`${relative}: ${lineCount} linhas (legado; refatoração incremental)`)
    else failures.push(`${relative}: ${lineCount} linhas excede o teto de ${MAX_LINES}`)
  }

  if (/\bintensity\b|intensidade/i.test(content)) failures.push(`${relative}: "intensidade" foi removida do domínio do Atlas`)
  if (content.includes('controlfinance-app.onrender.com/atlas-api')) failures.push(`${relative}: referência ao backend legado do ControlFinance`)
}

if (warnings.length) {
  console.warn('Avisos de qualidade:')
  for (const warning of warnings) console.warn(' - ' + warning)
}

if (failures.length) {
  console.error('Falhas de qualidade:')
  for (const failure of failures) console.error(' - ' + failure)
  process.exit(1)
}

console.log(`Quality gate OK: ${files.length} arquivos verificados.`)
