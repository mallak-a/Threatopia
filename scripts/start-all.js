const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')

const rootDir = path.resolve(__dirname, '..')

const COLORS = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  red: '\x1b[31m',
}

function colorizeLabel(label) {
  const color = label === 'frontend' ? COLORS.cyan : COLORS.magenta
  return `${color}[${label}]${COLORS.reset}`
}

function colorizeUrls(text) {
  return text.replace(/(https?:\/\/[^\s]+)/g, `${COLORS.green}$1${COLORS.reset}`)
}

const npmCommand = 'npm'

function runCommand(command, args, label, cwd, env) {
  const isWindows = process.platform === 'win32'
  const spawnCommand = isWindows ? `${command} ${args.join(' ')}` : command
  const spawnArgs = isWindows ? [] : args

  const child = spawn(spawnCommand, spawnArgs, {
    cwd: cwd || rootDir,
    shell: isWindows,
    stdio: ['inherit', 'pipe', 'pipe'],
    env: env || process.env,
  })

  const prefix = colorizeLabel(label)

  child.stdout.on('data', (chunk) => {
    const message = chunk.toString()
    process.stdout.write(`${prefix} ${colorizeUrls(message)}`)
  })

  child.stderr.on('data', (chunk) => {
    const message = chunk.toString()
    process.stderr.write(`${prefix} ${colorizeUrls(message)}`)
  })

  child.on('exit', (code) => {
    console.log(`${prefix} exited with code ${code}`)
  })

  child.on('error', (error) => {
    console.error(`${prefix} error: ${error.message}`)
  })

  return child
}

function cleanupFrontendBuild() {
  const nextDir = path.join(rootDir, 'frontend', '.next')
  if (fs.existsSync(nextDir)) {
    fs.rmSync(nextDir, { recursive: true, force: true })
    console.log(`${COLORS.yellow}Removed stale frontend .next build directory${COLORS.reset}`)
  }
}

console.log(`${COLORS.yellow}Starting Threatopia frontend and backend together...${COLORS.reset}`)
cleanupFrontendBuild()

const frontend = runCommand(
  npmCommand,
  ['run', 'dev'],
  'frontend',
  path.join(rootDir, 'frontend'),
  { ...process.env, TURBO_FORCE: 'false' }
)
const backend = runCommand(npmCommand, ['run', 'dev'], 'backend', path.join(rootDir, 'backend'))

function shutdown(signal) {
  frontend.kill(signal)
  backend.kill(signal)
  process.exit()
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))
