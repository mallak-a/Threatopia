/**
 * Threatopia – Automatic Database Setup Script
 *
 * Usage (from the repository root):
 *   npm run setup-db
 *
 * What it does:
 *   1. Loads backend/.env so DATABASE_URL is available
 *   2. Generates the Prisma client
 *   3. Runs all pending database migrations (non-interactive)
 *   4. Seeds the database with sample users, challenges, and data
 */

const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')

const backendDir = path.resolve(__dirname, '..', 'backend')
const envFile = path.join(backendDir, '.env')

const COLORS = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  bold: '\x1b[1m',
}

function log(message, color = COLORS.reset) {
  console.log(`${color}${message}${COLORS.reset}`)
}

// ---------------------------------------------------------------------------
// Load backend/.env before anything else so DATABASE_URL is available
// ---------------------------------------------------------------------------
if (!fs.existsSync(envFile)) {
  log('\n❌  backend/.env file not found!\n', COLORS.red)
  log('Please create it by copying the example file:', COLORS.yellow)
  log('  cp backend/.env.example backend/.env\n', COLORS.cyan)
  log('Then fill in your PostgreSQL DATABASE_URL and JWT_SECRET.', COLORS.yellow)
  process.exit(1)
}

// Manually parse the .env file (no external dependency needed)
const envContent = fs.readFileSync(envFile, 'utf8')
for (const line of envContent.split('\n')) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) continue
  const eqIndex = trimmed.indexOf('=')
  if (eqIndex === -1) continue
  const key = trimmed.slice(0, eqIndex).trim()
  const value = trimmed.slice(eqIndex + 1).trim()
  if (!process.env[key]) process.env[key] = value
}

// ---------------------------------------------------------------------------
// Validate DATABASE_URL
// ---------------------------------------------------------------------------
if (!process.env.DATABASE_URL) {
  log('\n❌  DATABASE_URL is not set in backend/.env\n', COLORS.red)
  log('Add a line like:', COLORS.yellow)
  log('  DATABASE_URL=postgresql://user:password@localhost:5432/threatopia\n', COLORS.cyan)
  process.exit(1)
}

// ---------------------------------------------------------------------------
// Helper: run a shell command and return a promise
// ---------------------------------------------------------------------------
function runCommand(command, args, cwd, description) {
  return new Promise((resolve, reject) => {
    log(`\n🔄  ${description}...`, COLORS.cyan)

    const child = spawn(command, args, {
      cwd,
      stdio: ['inherit', 'pipe', 'pipe'],
      shell: true,
      env: process.env,
    })

    let stdout = ''
    let stderr = ''

    child.stdout.on('data', (data) => {
      const text = data.toString()
      stdout += text
      process.stdout.write(`   ${text.replace(/\n/g, '\n   ')}`)
    })

    child.stderr.on('data', (data) => {
      const text = data.toString()
      stderr += text
      process.stderr.write(`   ${text.replace(/\n/g, '\n   ')}`)
    })

    child.on('close', (code) => {
      if (code === 0) {
        log(`✅  ${description} — done`, COLORS.green)
        resolve(stdout)
      } else {
        log(`❌  ${description} failed (exit code ${code})`, COLORS.red)
        reject(new Error(`${description} failed`))
      }
    })

    child.on('error', (error) => {
      log(`❌  ${description} — spawn error: ${error.message}`, COLORS.red)
      reject(error)
    })
  })
}

// ---------------------------------------------------------------------------
// Main setup flow
// ---------------------------------------------------------------------------
async function setupDatabase() {
  log('\n' + COLORS.bold + '🚀  Threatopia – Automatic Database Setup' + COLORS.reset, COLORS.yellow)
  log(`   Backend dir : ${backendDir}`, COLORS.cyan)
  log(`   Database URL: ${process.env.DATABASE_URL.replace(/:([^@]+)@/, ':****@')}`, COLORS.cyan)

  try {
    // Step 1: Generate the Prisma client from schema.prisma
    await runCommand(
      'npx',
      ['prisma', 'generate'],
      backendDir,
      'Step 1/3 – Generating Prisma client'
    )

    // Step 2: Apply migrations (non-interactive, works in all environments)
    // Uses `migrate deploy` instead of `migrate dev` so it never pauses for input.
    // If you are running this for the first time on a fresh database, Prisma will
    // automatically create the migration baseline.
    await runCommand(
      'npx',
      ['prisma', 'migrate', 'deploy'],
      backendDir,
      'Step 2/3 – Applying database migrations'
    )

    // Step 3: Seed the database with sample data
    await runCommand(
      'npx',
      ['tsx', 'prisma/seed.ts'],
      backendDir,
      'Step 3/3 – Seeding database with sample data'
    )

    log('\n🎉  Database setup completed successfully!\n', COLORS.green)
    log('📋  Demo accounts you can use to log in:', COLORS.cyan)
    log('   Student : alex@example.com   / demo123', COLORS.reset)
    log('   Student : sarah@example.com  / demo123', COLORS.reset)
    log('   Admin   : admin@threatopia.com / admin123\n', COLORS.reset)
    log('▶️   Start the application with:  npm run dev\n', COLORS.yellow)
  } catch (error) {
    log(`\n💥  Setup failed: ${error.message}`, COLORS.red)
    log('\nTroubleshooting tips:', COLORS.yellow)
    log('  • Make sure PostgreSQL is running and accessible', COLORS.reset)
    log('  • Verify your DATABASE_URL in backend/.env', COLORS.reset)
    log('  • Check that the database user has CREATE/ALTER privileges', COLORS.reset)
    log('  • To reset and retry: npx prisma migrate reset --force (inside backend/)', COLORS.reset)
    process.exit(1)
  }
}

// Run immediately when called directly
if (require.main === module) {
  setupDatabase()
}

module.exports = { setupDatabase }