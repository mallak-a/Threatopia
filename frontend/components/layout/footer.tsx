'use client'

import Link from 'next/link'
import { Shield, Github, Twitter, Linkedin, Mail } from 'lucide-react'

const footerLinks = {
  product: [
    { label: 'Challenges', href: '/challenges' },
    { label: 'Simulations', href: '/simulations' },
    { label: 'Leaderboard', href: '/leaderboard' },
    { label: 'AI Assistant', href: '/assistant' },
  ],
  company: [
    { label: 'About', href: '/about' },
    { label: 'Resources', href: '/resources' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
}

const socialLinks = [
  { icon: Twitter, href: 'https://twitter.com/threatopia', label: 'Twitter' },
  { icon: Github, href: 'https://github.com/threatopia', label: 'GitHub' },
  { icon: Linkedin, href: 'https://linkedin.com/company/threatopia', label: 'LinkedIn' },
  { icon: Mail, href: 'mailto:contact@threatopia.com', label: 'Email' },
]

export function Footer() {
  return (
    <footer className="border-t border-primary/20 bg-background/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="relative">
                <Shield className="h-8 w-8 text-primary" />
                <div className="absolute inset-0 blur-md bg-primary/30" />
              </div>
              <span className="text-xl font-bold gradient-text">THREATOPIA</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm mb-6">
              Master cybersecurity through interactive challenges, real-world simulations, 
              and AI-powered guidance. Learn to detect and defend against modern threats.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-secondary/50 hover:bg-primary/20 hover:text-primary transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              {new Date().getFullYear()} Threatopia. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="text-primary">Learn.</span>{' '}
              <span className="text-primary">Detect.</span>{' '}
              <span className="text-primary">Defend.</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
