'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Shield, Database, Lock, Users, Bug, Network } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const challengeCategories = [
  {
    icon: Shield,
    title: 'Phishing Detection',
    description: 'Learn to identify and avoid phishing attacks in emails, websites, and messages.',
    difficulty: 'Beginner',
    challenges: 45,
    color: 'from-blue-500/20 to-cyan-500/20',
    borderColor: 'border-blue-500/30',
  },
  {
    icon: Database,
    title: 'SQL Injection',
    description: 'Understand database vulnerabilities and how to prevent SQL injection attacks.',
    difficulty: 'Intermediate',
    challenges: 32,
    color: 'from-purple-500/20 to-pink-500/20',
    borderColor: 'border-purple-500/30',
  },
  {
    icon: Lock,
    title: 'Password Security',
    description: 'Master password best practices and learn about authentication security.',
    difficulty: 'Beginner',
    challenges: 28,
    color: 'from-green-500/20 to-emerald-500/20',
    borderColor: 'border-green-500/30',
  },
  {
    icon: Users,
    title: 'Social Engineering',
    description: 'Recognize manipulation tactics and defend against human-targeted attacks.',
    difficulty: 'Advanced',
    challenges: 25,
    color: 'from-orange-500/20 to-amber-500/20',
    borderColor: 'border-orange-500/30',
  },
  {
    icon: Bug,
    title: 'Malware Analysis',
    description: 'Identify and analyze different types of malware and their behaviors.',
    difficulty: 'Advanced',
    challenges: 18,
    color: 'from-red-500/20 to-rose-500/20',
    borderColor: 'border-red-500/30',
  },
  {
    icon: Network,
    title: 'Network Security',
    description: 'Learn to secure networks and detect suspicious network activity.',
    difficulty: 'Expert',
    challenges: 8,
    color: 'from-indigo-500/20 to-violet-500/20',
    borderColor: 'border-indigo-500/30',
  },
]

const difficultyColors: Record<string, string> = {
  Beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
  Intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Advanced: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Expert: 'bg-red-500/20 text-red-400 border-red-500/30',
}

export function ChallengesPreview() {
  return (
    <section className="py-24 relative bg-secondary/20">
      <div className="absolute inset-0 cyber-grid opacity-20" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            Explore Our{' '}
            <span className="gradient-text">Challenge Categories</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            From beginner-friendly phishing detection to expert-level network security, 
            we have challenges for every skill level.
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {challengeCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className={`glass rounded-xl p-6 h-full border ${category.borderColor} transition-all duration-300 hover:neon-glow-sm relative overflow-hidden`}>
                {/* Gradient Background */}
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                
                <div className="relative">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg bg-secondary/50">
                      <category.icon className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant="outline" className={difficultyColors[category.difficulty]}>
                      {category.difficulty}
                    </Badge>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold mb-2 text-foreground">
                    {category.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {category.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {category.challenges} challenges
                    </span>
                    <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link href="/challenges">
            <Button size="lg" className="neon-glow group">
              Browse All Challenges
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
