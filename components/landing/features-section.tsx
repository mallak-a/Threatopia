'use client'

import { motion } from 'framer-motion'
import { 
  Shield, 
  Brain, 
  Target, 
  Trophy, 
  Users, 
  Laptop,
  Lock,
  Zap,
  BarChart3
} from 'lucide-react'

const features = [
  {
    icon: Target,
    title: 'Interactive Challenges',
    description: 'Learn by doing with hands-on challenges covering phishing, SQL injection, password security, and more.',
    color: 'text-chart-1',
  },
  {
    icon: Brain,
    title: 'AI Security Assistant',
    description: 'Get personalized guidance and explanations from our AI assistant trained on cybersecurity best practices.',
    color: 'text-chart-2',
  },
  {
    icon: Laptop,
    title: 'Real-World Simulations',
    description: 'Practice in safe, realistic environments that mirror actual corporate security scenarios.',
    color: 'text-chart-3',
  },
  {
    icon: Trophy,
    title: 'Gamified Learning',
    description: 'Earn points, unlock badges, and compete on leaderboards as you progress through your security journey.',
    color: 'text-chart-4',
  },
  {
    icon: Users,
    title: 'Community & Teams',
    description: 'Join a community of security enthusiasts. Create teams, share progress, and learn together.',
    color: 'text-chart-5',
  },
  {
    icon: BarChart3,
    title: 'Progress Analytics',
    description: 'Track your learning journey with detailed analytics and personalized improvement recommendations.',
    color: 'text-primary',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

export function FeaturesSection() {
  return (
    <section className="py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 cyber-grid-dense opacity-30" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Why Threatopia</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            Everything You Need to{' '}
            <span className="gradient-text">Master Cybersecurity</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Our platform combines interactive learning, AI guidance, and real-world 
            simulations to give you practical cybersecurity skills.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group relative"
            >
              <div className="glass rounded-xl p-6 h-full transition-all duration-300 hover:neon-glow-sm">
                {/* Icon */}
                <div className={`inline-flex p-3 rounded-lg bg-secondary/50 mb-4 ${feature.color}`}>
                  <feature.icon className="h-6 w-6" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>

                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute top-2 right-2 w-2 h-8 bg-primary/30 rounded-full" />
                  <div className="absolute top-2 right-2 w-8 h-2 bg-primary/30 rounded-full" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
