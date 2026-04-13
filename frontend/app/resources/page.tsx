'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  BookOpen, FileText, Video, Download, ExternalLink, 
  Search, Filter, Terminal, Shield, Globe, Lock,
  Newspaper, Podcast, Github, Wrench
} from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const resources = {
  tools: [
    { name: 'Burp Suite', description: 'Web vulnerability scanner and proxy tool', category: 'Web Security', link: '#' },
    { name: 'Nmap', description: 'Network discovery and security auditing', category: 'Network', link: '#' },
    { name: 'Wireshark', description: 'Network protocol analyzer', category: 'Network', link: '#' },
    { name: 'Metasploit', description: 'Penetration testing framework', category: 'Exploitation', link: '#' },
    { name: 'John the Ripper', description: 'Password cracking tool', category: 'Passwords', link: '#' },
    { name: 'Ghidra', description: 'Software reverse engineering suite', category: 'Reverse Engineering', link: '#' },
    { name: 'OWASP ZAP', description: 'Web application security scanner', category: 'Web Security', link: '#' },
    { name: 'Hashcat', description: 'Advanced password recovery', category: 'Passwords', link: '#' },
  ],
  guides: [
    { title: 'Complete Guide to Web Penetration Testing', type: 'PDF', pages: 120, downloads: 5400 },
    { title: 'Network Security Best Practices', type: 'PDF', pages: 85, downloads: 3200 },
    { title: 'Incident Response Handbook', type: 'PDF', pages: 60, downloads: 2800 },
    { title: 'Cloud Security Architecture', type: 'PDF', pages: 95, downloads: 2100 },
    { title: 'Malware Analysis Techniques', type: 'PDF', pages: 110, downloads: 1900 },
    { title: 'OSINT Investigation Methods', type: 'PDF', pages: 75, downloads: 1700 },
  ],
  videos: [
    { title: 'Introduction to Ethical Hacking', duration: '45:30', views: '125K', instructor: 'Alex Chen' },
    { title: 'SQL Injection Deep Dive', duration: '38:15', views: '89K', instructor: 'Sarah Mitchell' },
    { title: 'Buffer Overflow Exploits', duration: '52:00', views: '67K', instructor: 'Marcus Johnson' },
    { title: 'Active Directory Attacks', duration: '1:05:20', views: '54K', instructor: 'Emily Rodriguez' },
    { title: 'Wireless Network Hacking', duration: '42:45', views: '48K', instructor: 'Alex Chen' },
    { title: 'Linux Privilege Escalation', duration: '55:30', views: '41K', instructor: 'Marcus Johnson' },
  ],
  blogs: [
    { title: 'Zero-Day Vulnerabilities: A 2024 Retrospective', date: 'Dec 15, 2024', readTime: '8 min' },
    { title: 'The Rise of AI-Powered Cyber Attacks', date: 'Dec 10, 2024', readTime: '6 min' },
    { title: 'Securing Your Cloud Infrastructure', date: 'Dec 5, 2024', readTime: '10 min' },
    { title: 'Understanding Ransomware Tactics', date: 'Nov 28, 2024', readTime: '7 min' },
    { title: 'API Security: Common Mistakes to Avoid', date: 'Nov 20, 2024', readTime: '5 min' },
    { title: 'Building a Home Lab for Security Testing', date: 'Nov 15, 2024', readTime: '12 min' },
  ],
}

const categories = [
  { id: 'all', label: 'All Resources', icon: BookOpen },
  { id: 'tools', label: 'Tools', icon: Wrench },
  { id: 'guides', label: 'Guides', icon: FileText },
  { id: 'videos', label: 'Videos', icon: Video },
  { id: 'blogs', label: 'Blog Posts', icon: Newspaper },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')

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
                Resource Library
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
                Your Cybersecurity{' '}
                <span className="gradient-text">Knowledge Hub</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Access our curated collection of tools, guides, tutorials, and articles 
                to accelerate your cybersecurity journey.
              </p>
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-lg bg-card border-border"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Resources Tabs */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full flex flex-wrap justify-start gap-2 bg-transparent h-auto p-0 mb-8">
                {categories.map((cat) => (
                  <TabsTrigger
                    key={cat.id}
                    value={cat.id}
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 rounded-lg"
                  >
                    <cat.icon className="h-4 w-4 mr-2" />
                    {cat.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* All Resources */}
              <TabsContent value="all" className="space-y-12">
                {/* Tools Section */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <Wrench className="h-6 w-6 text-primary" />
                      Security Tools
                    </h2>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab('tools')}>
                      View All
                    </Button>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {resources.tools.slice(0, 4).map((tool) => (
                      <Card key={tool.name} className="hover:border-primary/50 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold">{tool.name}</h3>
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{tool.description}</p>
                          <Badge variant="secondary" className="text-xs">{tool.category}</Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Guides Section */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <FileText className="h-6 w-6 text-primary" />
                      Downloadable Guides
                    </h2>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab('guides')}>
                      View All
                    </Button>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {resources.guides.slice(0, 3).map((guide) => (
                      <Card key={guide.title} className="hover:border-primary/50 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-16 bg-red-500/20 rounded flex items-center justify-center flex-shrink-0">
                              <FileText className="h-6 w-6 text-red-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-sm mb-1 line-clamp-2">{guide.title}</h3>
                              <p className="text-xs text-muted-foreground mb-2">
                                {guide.pages} pages | {guide.downloads.toLocaleString()} downloads
                              </p>
                              <Button size="sm" variant="outline" className="h-7 text-xs">
                                <Download className="h-3 w-3 mr-1" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Videos Section */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <Video className="h-6 w-6 text-primary" />
                      Video Tutorials
                    </h2>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab('videos')}>
                      View All
                    </Button>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {resources.videos.slice(0, 3).map((video) => (
                      <Card key={video.title} className="hover:border-primary/50 transition-colors cursor-pointer">
                        <CardContent className="p-0">
                          <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-t-lg flex items-center justify-center relative">
                            <div className="w-14 h-14 rounded-full bg-background/80 flex items-center justify-center">
                              <Video className="h-6 w-6 text-primary" />
                            </div>
                            <Badge className="absolute bottom-2 right-2 bg-background/80 text-foreground">
                              {video.duration}
                            </Badge>
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-sm mb-1 line-clamp-1">{video.title}</h3>
                            <p className="text-xs text-muted-foreground">
                              {video.instructor} | {video.views} views
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Tools Tab */}
              <TabsContent value="tools">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
                >
                  {resources.tools.map((tool) => (
                    <motion.div key={tool.name} variants={itemVariants}>
                      <Card className="h-full hover:border-primary/50 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold">{tool.name}</h3>
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{tool.description}</p>
                          <Badge variant="secondary" className="text-xs">{tool.category}</Badge>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>

              {/* Guides Tab */}
              <TabsContent value="guides">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {resources.guides.map((guide) => (
                    <motion.div key={guide.title} variants={itemVariants}>
                      <Card className="hover:border-primary/50 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-16 bg-red-500/20 rounded flex items-center justify-center flex-shrink-0">
                              <FileText className="h-6 w-6 text-red-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-sm mb-1">{guide.title}</h3>
                              <p className="text-xs text-muted-foreground mb-3">
                                {guide.pages} pages | {guide.downloads.toLocaleString()} downloads
                              </p>
                              <Button size="sm" variant="outline" className="h-8">
                                <Download className="h-4 w-4 mr-2" />
                                Download PDF
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>

              {/* Videos Tab */}
              <TabsContent value="videos">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {resources.videos.map((video) => (
                    <motion.div key={video.title} variants={itemVariants}>
                      <Card className="hover:border-primary/50 transition-colors cursor-pointer overflow-hidden">
                        <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative">
                          <div className="w-16 h-16 rounded-full bg-background/80 flex items-center justify-center hover:scale-110 transition-transform">
                            <Video className="h-8 w-8 text-primary" />
                          </div>
                          <Badge className="absolute bottom-3 right-3 bg-background/80 text-foreground">
                            {video.duration}
                          </Badge>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-1">{video.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {video.instructor} | {video.views} views
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>

              {/* Blogs Tab */}
              <TabsContent value="blogs">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {resources.blogs.map((blog) => (
                    <motion.div key={blog.title} variants={itemVariants}>
                      <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
                        <CardContent className="p-6">
                          <Badge variant="outline" className="mb-3">Article</Badge>
                          <h3 className="font-semibold text-lg mb-2">{blog.title}</h3>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span>{blog.date}</span>
                            <span>|</span>
                            <span>{blog.readTime} read</span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-16 bg-card/30">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
            <p className="text-muted-foreground mb-6">
              Subscribe to our newsletter for the latest security resources, tools, and tutorials.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input placeholder="Enter your email" type="email" className="flex-1" />
              <Button className="neon-glow-sm">Subscribe</Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
