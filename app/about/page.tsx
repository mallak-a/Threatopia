'use client'

import { motion } from 'framer-motion'
import { Shield, Target, Users, Award, Zap, Globe, Lock, BookOpen } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const stats = [
  { label: 'Active Learners', value: '50,000+', icon: Users },
  { label: 'Challenges Completed', value: '2M+', icon: Target },
  { label: 'Countries Reached', value: '120+', icon: Globe },
  { label: 'Industry Partners', value: '50+', icon: Award },
]

const values = [
  {
    icon: Shield,
    title: 'Security First',
    description: 'We believe cybersecurity education should be accessible to everyone. Our platform is built with security best practices at its core.',
  },
  {
    icon: BookOpen,
    title: 'Continuous Learning',
    description: 'The threat landscape evolves daily. Our content is constantly updated to reflect the latest attack vectors and defense strategies.',
  },
  {
    icon: Users,
    title: 'Community Driven',
    description: 'Our challenges are created by security professionals worldwide, ensuring diverse perspectives and real-world relevance.',
  },
  {
    icon: Zap,
    title: 'Hands-On Experience',
    description: 'Theory alone is not enough. Our interactive labs and CTF challenges provide practical experience in safe environments.',
  },
]

const team = [
  { name: 'Alex Chen', role: 'CEO & Founder', specialty: 'Penetration Testing' },
  { name: 'Sarah Mitchell', role: 'CTO', specialty: 'Cloud Security' },
  { name: 'Marcus Johnson', role: 'Head of Content', specialty: 'Malware Analysis' },
  { name: 'Emily Rodriguez', role: 'Lead Instructor', specialty: 'Network Security' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 cyber-grid opacity-30" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <Badge className="mb-4 bg-primary/20 text-primary border-primary/50">
                Our Mission
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
                Empowering the Next Generation of{' '}
                <span className="gradient-text">Cyber Defenders</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Threatopia was founded with a simple mission: make world-class cybersecurity 
                education accessible to everyone. We combine cutting-edge technology with 
                gamified learning to create an engaging platform that transforms beginners 
                into skilled security professionals.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 border-y border-border bg-card/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={itemVariants}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/20 text-primary mb-4">
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <p className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                These principles guide everything we do at Threatopia
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-6"
            >
              {values.map((value) => (
                <motion.div key={value.title} variants={itemVariants}>
                  <Card className="h-full bg-card/50 border-border hover:border-primary/50 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                          <value.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {value.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-card/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Team</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Industry veterans dedicated to your cybersecurity education
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {team.map((member) => (
                <motion.div key={member.name} variants={itemVariants}>
                  <Card className="text-center bg-card/50 border-border hover:border-primary/50 transition-colors">
                    <CardContent className="p-6">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <h3 className="font-semibold text-lg">{member.name}</h3>
                      <p className="text-primary text-sm mb-2">{member.role}</p>
                      <Badge variant="secondary" className="text-xs">
                        {member.specialty}
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Journey</h2>
              <p className="text-muted-foreground">
                From a small idea to a global platform
              </p>
            </motion.div>

            <div className="space-y-8">
              {[
                { year: '2020', title: 'Founded', desc: 'Threatopia was born from a passion for cybersecurity education' },
                { year: '2021', title: 'First 10K Users', desc: 'Reached our first milestone of 10,000 active learners' },
                { year: '2022', title: 'Enterprise Launch', desc: 'Launched enterprise training solutions for businesses' },
                { year: '2023', title: 'Global Expansion', desc: 'Expanded to 100+ countries with localized content' },
                { year: '2024', title: 'AI Integration', desc: 'Introduced AI-powered learning paths and assistance' },
              ].map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 w-16 text-right">
                    <span className="text-primary font-bold">{item.year}</span>
                  </div>
                  <div className="flex-shrink-0 w-px bg-primary/30 relative">
                    <div className="absolute top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary" />
                  </div>
                  <div className="pb-8">
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
