'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, HelpCircle, ChevronDown, MessageSquare } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const faqCategories = [
  { id: 'general', label: 'General' },
  { id: 'account', label: 'Account' },
  { id: 'challenges', label: 'Challenges' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'technical', label: 'Technical' },
]

const faqs = [
  {
    category: 'general',
    question: 'What is Threatopia?',
    answer: 'Threatopia is a comprehensive cybersecurity training platform that offers hands-on CTF (Capture The Flag) challenges, interactive labs, and structured learning paths. We help individuals and organizations build practical security skills through gamified learning experiences.',
  },
  {
    category: 'general',
    question: 'Who is Threatopia for?',
    answer: 'Threatopia is designed for anyone interested in cybersecurity, from complete beginners to experienced professionals. Our platform offers content for students, career changers, IT professionals looking to specialize in security, and enterprises seeking to train their teams.',
  },
  {
    category: 'general',
    question: 'Do I need prior experience to start?',
    answer: 'No prior experience is required! Our beginner learning paths start from the fundamentals and gradually build up your skills. We provide all the guidance and resources you need to get started, regardless of your current technical background.',
  },
  {
    category: 'account',
    question: 'How do I create an account?',
    answer: 'Creating an account is easy. Click the "Get Started" button on our homepage, fill in your details, and you can start learning immediately. We offer both free and premium account options.',
  },
  {
    category: 'account',
    question: 'Can I change my username?',
    answer: 'Yes, you can change your username once every 30 days. Go to your Profile settings, click on "Edit Profile," and update your username. Note that your previous username may become available to other users.',
  },
  {
    category: 'account',
    question: 'How do I reset my password?',
    answer: 'Click on "Forgot Password" on the login page, enter your registered email address, and we will send you a password reset link. The link expires after 24 hours for security purposes.',
  },
  {
    category: 'challenges',
    question: 'What are CTF challenges?',
    answer: 'CTF (Capture The Flag) challenges are security puzzles where you apply your skills to find hidden "flags" - secret strings that prove you completed the challenge. They cover areas like web security, cryptography, reverse engineering, and more.',
  },
  {
    category: 'challenges',
    question: 'Are the challenges safe to attempt?',
    answer: 'Absolutely! All our challenges run in isolated sandbox environments. You can safely practice hacking techniques without any legal concerns or risk to your own systems. This is ethical hacking in a controlled setting.',
  },
  {
    category: 'challenges',
    question: 'How are points calculated?',
    answer: 'Points are awarded based on challenge difficulty (Easy: 100pts, Medium: 250pts, Hard: 500pts, Expert: 1000pts). First-blood bonuses give extra points to early solvers. Your total points determine your rank on the leaderboard.',
  },
  {
    category: 'challenges',
    question: 'Can I get hints for challenges?',
    answer: 'Yes, each challenge has hints available. Using hints will reduce the points you earn for that challenge (typically 10-25% per hint). We encourage trying without hints first, but they are there when you need them.',
  },
  {
    category: 'pricing',
    question: 'Is Threatopia free?',
    answer: 'We offer a generous free tier that includes access to beginner challenges, basic learning paths, and community features. Premium subscriptions unlock advanced challenges, exclusive labs, certifications, and priority support.',
  },
  {
    category: 'pricing',
    question: 'What does the premium subscription include?',
    answer: 'Premium includes: unlimited access to all challenges and labs, personalized learning paths, downloadable resources, certification exams, priority support, and exclusive advanced content. Enterprise plans also include team management and analytics.',
  },
  {
    category: 'pricing',
    question: 'Do you offer refunds?',
    answer: 'Yes, we offer a 14-day money-back guarantee for premium subscriptions. If you are not satisfied, contact our support team within 14 days of purchase for a full refund, no questions asked.',
  },
  {
    category: 'technical',
    question: 'What system requirements do I need?',
    answer: 'Threatopia runs entirely in your browser - no special software required. We recommend a modern browser (Chrome, Firefox, Edge, or Safari) and a stable internet connection. Some advanced labs may require a computer with at least 8GB RAM.',
  },
  {
    category: 'technical',
    question: 'Can I use Threatopia on mobile devices?',
    answer: 'Our platform is responsive and works on tablets and mobile devices for learning content and basic challenges. However, for the best experience with hands-on labs and complex challenges, we recommend using a desktop or laptop computer.',
  },
  {
    category: 'technical',
    question: 'Do I need to install any tools?',
    answer: 'Most challenges can be completed using our built-in web-based tools and terminals. For advanced challenges, you may want to set up a local environment with tools like Burp Suite or Wireshark. We provide setup guides for all recommended tools.',
  },
]

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('general')
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (question: string) => {
    setOpenItems(prev =>
      prev.includes(question)
        ? prev.filter(q => q !== question)
        : [...prev, question]
    )
  }

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory
    return matchesSearch && matchesCategory
  })

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
                Help Center
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
                Frequently Asked{' '}
                <span className="gradient-text">Questions</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Find answers to common questions about Threatopia. Cannot find what 
                you are looking for? Contact our support team.
              </p>
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-lg bg-card border-border"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              {faqCategories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={activeCategory === cat.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveCategory(cat.id)}
                  className={activeCategory === cat.id ? 'neon-glow-sm' : ''}
                >
                  {cat.label}
                </Button>
              ))}
            </div>

            {/* FAQ Items */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-12">
                  <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    No questions found matching your search.
                  </p>
                </div>
              ) : (
                filteredFaqs.map((faq, index) => (
                  <motion.div
                    key={faq.question}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border border-border rounded-lg overflow-hidden bg-card/50"
                  >
                    <button
                      onClick={() => toggleItem(faq.question)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary/30 transition-colors"
                    >
                      <span className="font-medium pr-4">{faq.question}</span>
                      <ChevronDown
                        className={cn(
                          'h-5 w-5 text-muted-foreground transition-transform flex-shrink-0',
                          openItems.includes(faq.question) && 'rotate-180'
                        )}
                      />
                    </button>
                    <div
                      className={cn(
                        'overflow-hidden transition-all duration-300',
                        openItems.includes(faq.question) ? 'max-h-96' : 'max-h-0'
                      )}
                    >
                      <div className="p-4 pt-0 text-muted-foreground leading-relaxed border-t border-border">
                        {faq.answer}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
              <MessageSquare className="h-12 w-12 mx-auto text-primary mb-4" />
              <h2 className="text-2xl font-bold mb-2">Still have questions?</h2>
              <p className="text-muted-foreground mb-6">
                Our support team is here to help you with any questions or issues.
              </p>
              <Link href="/contact">
                <Button size="lg" className="neon-glow">
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
