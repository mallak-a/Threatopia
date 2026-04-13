'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Shield, Lock, Globe, Terminal, Server, Bug, 
  FileCode, Wifi, Database, Cloud, ArrowRight,
  Clock, Users, Star, BookOpen, Play
} from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'

const learningPaths = [
  {
    id: 'beginner',
    title: 'Cybersecurity Fundamentals',
    description: 'Start your journey with core security concepts, threat awareness, and basic defense strategies.',
    icon: Shield,
    duration: '8 weeks',
    modules: 12,
    students: '15,000+',
    level: 'Beginner',
    color: 'from-green-500/20 to-emerald-500/20',
    topics: ['Security Basics', 'Network Fundamentals', 'Common Threats', 'Password Security', 'Safe Browsing'],
  },
  {
    id: 'network',
    title: 'Network Security',
    description: 'Master network protocols, firewalls, intrusion detection, and network-based attack prevention.',
    icon: Globe,
    duration: '10 weeks',
    modules: 15,
    students: '8,500+',
    level: 'Intermediate',
    color: 'from-blue-500/20 to-cyan-500/20',
    topics: ['TCP/IP Deep Dive', 'Firewall Configuration', 'IDS/IPS Systems', 'VPNs', 'Network Monitoring'],
  },
  {
    id: 'web',
    title: 'Web Application Security',
    description: 'Learn to identify and exploit web vulnerabilities including OWASP Top 10 and beyond.',
    icon: FileCode,
    duration: '12 weeks',
    modules: 18,
    students: '12,000+',
    level: 'Intermediate',
    color: 'from-purple-500/20 to-pink-500/20',
    topics: ['SQL Injection', 'XSS Attacks', 'CSRF', 'Authentication Flaws', 'API Security'],
  },
  {
    id: 'pentest',
    title: 'Penetration Testing',
    description: 'Become an ethical hacker with hands-on penetration testing methodologies and tools.',
    icon: Terminal,
    duration: '16 weeks',
    modules: 24,
    students: '6,200+',
    level: 'Advanced',
    color: 'from-red-500/20 to-orange-500/20',
    topics: ['Reconnaissance', 'Exploitation', 'Post-Exploitation', 'Reporting', 'Tool Mastery'],
  },
  {
    id: 'cloud',
    title: 'Cloud Security',
    description: 'Secure cloud environments across AWS, Azure, and GCP with modern cloud-native strategies.',
    icon: Cloud,
    duration: '10 weeks',
    modules: 14,
    students: '5,800+',
    level: 'Advanced',
    color: 'from-sky-500/20 to-indigo-500/20',
    topics: ['IAM Best Practices', 'Container Security', 'Serverless Security', 'Cloud Compliance', 'Multi-Cloud'],
  },
  {
    id: 'malware',
    title: 'Malware Analysis',
    description: 'Reverse engineer malware, understand attack patterns, and develop detection strategies.',
    icon: Bug,
    duration: '14 weeks',
    modules: 20,
    students: '3,400+',
    level: 'Expert',
    color: 'from-amber-500/20 to-yellow-500/20',
    topics: ['Static Analysis', 'Dynamic Analysis', 'Reverse Engineering', 'Sandbox Evasion', 'Threat Intel'],
  },
]

const featuredCourses = [
  { title: 'OWASP Top 10 Masterclass', instructor: 'Sarah Mitchell', rating: 4.9, students: 2340, duration: '6h 30m' },
  { title: 'Linux Security Essentials', instructor: 'Marcus Johnson', rating: 4.8, students: 1890, duration: '8h 15m' },
  { title: 'Cryptography Fundamentals', instructor: 'Emily Rodriguez', rating: 4.7, students: 1560, duration: '5h 45m' },
  { title: 'Incident Response Playbook', instructor: 'Alex Chen', rating: 4.9, students: 980, duration: '4h 20m' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function LearnPage() {
  const [selectedPath, setSelectedPath] = useState(learningPaths[0])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="relative py-16 overflow-hidden">
          <div className="absolute inset-0 cyber-grid opacity-30" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <Badge className="mb-4 bg-primary/20 text-primary border-primary/50">
                Learning Paths
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
                Master Cybersecurity with{' '}
                <span className="gradient-text">Structured Learning</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Choose from our expert-crafted learning paths designed to take you from 
                beginner to professional. Each path includes hands-on labs, real-world 
                challenges, and industry-recognized certifications.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Learning Paths Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {learningPaths.map((path) => (
                <motion.div key={path.id} variants={itemVariants}>
                  <Card 
                    className={`h-full cursor-pointer transition-all duration-300 hover:border-primary/50 ${
                      selectedPath.id === path.id ? 'border-primary ring-2 ring-primary/20' : ''
                    }`}
                    onClick={() => setSelectedPath(path)}
                  >
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${path.color} flex items-center justify-center mb-4`}>
                        <path.icon className="h-6 w-6 text-foreground" />
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={
                          path.level === 'Beginner' ? 'default' :
                          path.level === 'Intermediate' ? 'secondary' :
                          path.level === 'Advanced' ? 'outline' : 'destructive'
                        }>
                          {path.level}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl">{path.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {path.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {path.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          {path.modules} modules
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-3 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {path.students} enrolled
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Selected Path Details */}
        <section className="py-12 bg-card/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              key={selectedPath.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${selectedPath.color}`} />
                <CardContent className="p-8">
                  <div className="grid lg:grid-cols-2 gap-8">
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedPath.color} flex items-center justify-center`}>
                          <selectedPath.icon className="h-8 w-8 text-foreground" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">{selectedPath.title}</h2>
                          <Badge variant="outline">{selectedPath.level}</Badge>
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {selectedPath.description}
                      </p>
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-4 rounded-lg bg-secondary/50">
                          <Clock className="h-5 w-5 mx-auto mb-2 text-primary" />
                          <p className="font-semibold">{selectedPath.duration}</p>
                          <p className="text-xs text-muted-foreground">Duration</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-secondary/50">
                          <BookOpen className="h-5 w-5 mx-auto mb-2 text-primary" />
                          <p className="font-semibold">{selectedPath.modules}</p>
                          <p className="text-xs text-muted-foreground">Modules</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-secondary/50">
                          <Users className="h-5 w-5 mx-auto mb-2 text-primary" />
                          <p className="font-semibold">{selectedPath.students}</p>
                          <p className="text-xs text-muted-foreground">Enrolled</p>
                        </div>
                      </div>
                      <Link href="/register">
                        <Button size="lg" className="w-full sm:w-auto neon-glow">
                          Start Learning Path
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-4">What You Will Learn</h3>
                      <div className="space-y-3">
                        {selectedPath.topics.map((topic, index) => (
                          <div key={topic} className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium text-primary">
                              {index + 1}
                            </div>
                            <span>{topic}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Featured Courses */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Featured Courses</h2>
              <p className="text-muted-foreground">
                Popular standalone courses to boost your skills
              </p>
            </div>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {featuredCourses.map((course) => (
                <motion.div key={course.title} variants={itemVariants}>
                  <Card className="h-full hover:border-primary/50 transition-colors">
                    <CardContent className="p-6">
                      <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg mb-4 flex items-center justify-center">
                        <Play className="h-10 w-10 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2 line-clamp-1">{course.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{course.instructor}</p>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                          <span className="text-sm font-medium">{course.rating}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          ({course.students.toLocaleString()} students)
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {course.duration}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
