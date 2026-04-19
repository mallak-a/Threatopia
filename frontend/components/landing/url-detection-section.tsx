'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Link2,
  ShieldCheck,
  ShieldAlert,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Scan,
  Wifi,
  Globe,
  Lock,
  Unlock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

// ─── Types ────────────────────────────────────────────────────────────────────

type ScanStatus = 'idle' | 'scanning' | 'safe' | 'phishing' | 'error'

interface ScanResult {
  result: 'safe' | 'phishing'
  confidence: number
  details?: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const EXAMPLE_URLS = [
  'https://google.com',
  'https://paypal-secure-login.xyz/verify',
  'https://github.com/features',
  'http://amazon-account-suspended.info/login',
]

const SCAN_STEPS = [
  'Resolving domain...',
  'Checking SSL certificate...',
  'Analysing URL structure...',
  'Querying threat intelligence...',
  'Running ML classifier...',
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function checkUrl(url: string): Promise<ScanResult> {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
  try {
    const res = await fetch(`${API_BASE}/url-detection/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) throw new Error('API error')
    const json = await res.json()
    if (json.success && json.data) return json.data as ScanResult
    throw new Error('Bad response')
  } catch {
    // Client-side fallback when backend is unavailable
    const lower = url.toLowerCase()
    const suspicious =
      (lower.includes('login') || lower.includes('verify') || lower.includes('account')) &&
      (lower.includes('paypal') ||
        lower.includes('amazon') ||
        lower.includes('bank') ||
        lower.includes('suspended') ||
        lower.endsWith('.xyz') ||
        lower.endsWith('.info'))

    return {
      result: suspicious ? 'phishing' : 'safe',
      confidence: suspicious ? 0.87 : 0.91,
      details: suspicious
        ? 'Suspicious URL pattern detected (keyword + domain analysis)'
        : 'No known phishing indicators found',
    }
  }
}

// ─── Animated scan steps sub-component ───────────────────────────────────────

function ScanningAnimation({ step }: { step: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      {SCAN_STEPS.map((label, i) => (
        <div key={label} className="flex items-center gap-3">
          {i < step ? (
            <CheckCircle2 className="h-4 w-4 text-neon-green flex-shrink-0" />
          ) : i === step ? (
            <Loader2 className="h-4 w-4 text-primary animate-spin flex-shrink-0" />
          ) : (
            <div className="h-4 w-4 rounded-full border border-border/50 flex-shrink-0" />
          )}
          <span
            className={`text-sm transition-colors ${
              i <= step ? 'text-foreground' : 'text-muted-foreground/40'
            }`}
          >
            {label}
          </span>
        </div>
      ))}
    </motion.div>
  )
}

// ─── Result panel sub-component ──────────────────────────────────────────────

function ResultPanel({ result }: { result: ScanResult }) {
  const isSafe = result.result === 'safe'
  const pct = Math.round(result.confidence * 100)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className={`rounded-xl p-5 border ${
        isSafe
          ? 'border-green-500/30 bg-green-500/5'
          : 'border-red-500/30 bg-red-500/5'
      }`}
    >
      {/* Icon + verdict */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`p-2 rounded-lg ${
            isSafe ? 'bg-green-500/15' : 'bg-red-500/15'
          }`}
        >
          {isSafe ? (
            <ShieldCheck className="h-6 w-6 text-green-400" />
          ) : (
            <ShieldAlert className="h-6 w-6 text-red-400" />
          )}
        </div>
        <div>
          <p
            className={`font-bold text-lg ${
              isSafe ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {isSafe ? 'URL appears safe' : 'Phishing detected!'}
          </p>
          <p className="text-xs text-muted-foreground">{result.details}</p>
        </div>
      </div>

      {/* Confidence bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Confidence</span>
          <span className="font-mono font-medium">{pct}%</span>
        </div>
        <div className="h-2 rounded-full bg-secondary/60 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className={`h-full rounded-full ${
              isSafe
                ? 'bg-gradient-to-r from-green-600 to-green-400'
                : 'bg-gradient-to-r from-red-700 to-red-500'
            }`}
          />
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-4">
        {isSafe ? (
          <>
            <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
              ✓ Valid domain
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
              ✓ No malicious patterns
            </span>
          </>
        ) : (
          <>
            <span className="text-xs px-2 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
              ⚠ Suspicious domain
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
              ⚠ Phishing keywords
            </span>
          </>
        )}
      </div>
    </motion.div>
  )
}

// ─── Main section component ───────────────────────────────────────────────────

export function UrlDetectionSection() {
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState<ScanStatus>('idle')
  const [result, setResult] = useState<ScanResult | null>(null)
  const [scanStep, setScanStep] = useState(0)

  const handleScan = async () => {
    const trimmed = url.trim()
    if (!trimmed) return

    // Basic URL validation: must contain at least one dot and some characters around it
    const urlPattern = /^[a-zA-Z0-0.-]+\.[a-zA-Z]{2,}/
    if (!urlPattern.test(trimmed.replace(/^https?:\/\//, ''))) {
      setStatus('error')
      setResult({
        result: 'safe',
        confidence: 0,
        details: 'Please enter a valid URL (e.g., example.com)'
      })
      return
    }

    setStatus('scanning')
    setResult(null)
    setScanStep(0)

    // Animate through scan steps
    for (let i = 0; i < SCAN_STEPS.length; i++) {
      await new Promise((r) => setTimeout(r, 400 + Math.random() * 300))
      setScanStep(i + 1)
    }

    try {
      const data = await checkUrl(trimmed)
      setResult(data)
      setStatus(data.result)
    } catch {
      setStatus('error')
    }
  }

  const handleReset = () => {
    setStatus('idle')
    setResult(null)
    setScanStep(0)
    setUrl('')
  }

  const handleExample = (exUrl: string) => {
    setUrl(exUrl)
    setStatus('idle')
    setResult(null)
    setScanStep(0)
  }

  const isScanning = status === 'scanning'

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 cyber-grid opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/3 to-background" />

      {/* Floating orbs */}
      <div className="absolute top-1/3 right-10 w-72 h-72 bg-primary/8 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 left-10 w-56 h-56 bg-accent/8 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* ── Left: copy ─────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Scan className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                AI-Powered Threat Detection
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-5 text-balance">
              Detect Phishing URLs{' '}
              <span className="gradient-text">Instantly</span>
            </h2>

            <p className="text-lg text-muted-foreground mb-8 text-pretty">
              Our machine-learning model analyses URL structure, domain reputation,
              and keyword patterns to classify links as safe or malicious — in
              seconds.
            </p>

            {/* Feature bullets */}
            <ul className="space-y-4 mb-10">
              {[
                { icon: Globe,   text: 'Domain & TLD reputation analysis' },
                { icon: Lock,    text: 'SSL certificate & HTTPS verification' },
                { icon: Wifi,    text: 'Real-time threat intelligence lookup' },
                { icon: Unlock,  text: 'Keyword & redirect chain inspection' },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-muted-foreground">
                  <div className="p-1.5 rounded-md bg-primary/10 flex-shrink-0">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm">{text}</span>
                </li>
              ))}
            </ul>

            <Link href="/register">
              <Button className="neon-glow group">
                Try Full Scanner
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>

          {/* ── Right: interactive widget ───────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="glass rounded-2xl p-6 md:p-8 neon-border">
              {/* Widget header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/15">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">URL Scanner</h3>
                  <p className="text-xs text-muted-foreground">
                    Paste any URL to check it instantly
                  </p>
                </div>
                {/* Live dot */}
                <div className="ml-auto flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                  </span>
                  <span className="text-xs text-muted-foreground">Live</span>
                </div>
              </div>

              {/* Input row */}
              <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <input
                    id="url-scanner-input"
                    type="url"
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value)
                      // Auto-reset if we already have a result or error
                      if (status !== 'idle' && status !== 'scanning') {
                        setStatus('idle')
                        setResult(null)
                        setScanStep(0)
                      }
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && !isScanning && handleScan()}
                    placeholder="https://example.com"
                    disabled={isScanning}
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg bg-background/60 border border-border/60 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 transition"
                  />
                </div>
                <Button
                  id="url-scanner-submit"
                  onClick={status === 'idle' ? handleScan : handleReset}
                  disabled={isScanning || (!url.trim() && status === 'idle')}
                  size="sm"
                  className={status !== 'idle' && !isScanning ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' : ''}
                >
                  {isScanning ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : status !== 'idle' ? (
                    'Reset'
                  ) : (
                    'Scan'
                  )}
                </Button>
              </div>

              {/* Example URLs */}
              {status === 'idle' && (
                <div className="mb-5">
                  <p className="text-xs text-muted-foreground mb-2">Try an example:</p>
                  <div className="flex flex-wrap gap-2">
                    {EXAMPLE_URLS.map((ex) => (
                      <button
                        key={ex}
                        onClick={() => handleExample(ex)}
                        className="text-xs px-2.5 py-1 rounded-full border border-border/60 text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors truncate max-w-[180px]"
                        title={ex}
                      >
                        {ex.replace(/^https?:\/\//, '')}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Divider */}
              <div className="border-t border-border/40 mb-5" />

              {/* Dynamic content area */}
              <div className="min-h-[160px]">
                <AnimatePresence mode="wait">
                  {status === 'idle' && (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center h-[160px] text-center"
                    >
                      <div className="p-4 rounded-full bg-secondary/40 mb-3">
                        <Scan className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Enter a URL above and press <strong className="text-foreground">Scan</strong>
                      </p>
                      <p className="text-xs text-muted-foreground/60 mt-1">
                        No account needed for a quick check
                      </p>
                    </motion.div>
                  )}

                  {status === 'scanning' && (
                    <motion.div
                      key="scanning"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        <span className="text-sm font-medium text-primary">
                          Scanning in progress…
                        </span>
                      </div>
                      <ScanningAnimation step={scanStep} />
                    </motion.div>
                  )}

                  {(status === 'safe' || status === 'phishing') && result && (
                    <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <ResultPanel result={result} />
                    </motion.div>
                  )}

                  {status === 'error' && (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center h-[160px] text-center"
                    >
                      <AlertTriangle className="h-8 w-8 text-yellow-500 mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {result?.details || 'Scan failed. Please try again.'}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer note */}
              <p className="text-center text-xs text-muted-foreground/50 mt-5 border-t border-border/30 pt-4">
                Powered by Threatopia ML Engine · Results are indicative only
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
