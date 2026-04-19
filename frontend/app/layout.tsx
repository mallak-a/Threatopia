import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { FloatingAIAssistant } from '@/components/floating-ai-assistant'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
})

export const metadata: Metadata = {
  title: {
    default: 'Threatopia | Cybersecurity Learning Platform',
    template: '%s | Threatopia',
  },
  description: 'Learn. Detect. Defend. Master cybersecurity through interactive challenges, simulations, and AI-powered guidance.',
  keywords: ['cybersecurity', 'security training', 'phishing', 'SQL injection', 'security awareness', 'cyber defense'],
  authors: [{ name: 'Threatopia' }],
  openGraph: {
    title: 'Threatopia | Cybersecurity Learning Platform',
    description: 'Master cybersecurity through interactive challenges and AI-powered guidance.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Threatopia',
    description: 'Learn. Detect. Defend.',
  },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0f1a' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <FloatingAIAssistant />
          <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
