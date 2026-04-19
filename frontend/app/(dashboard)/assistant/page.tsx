'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Sparkles, Terminal, Shield, Cpu, RefreshCw, Paperclip, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: 'Welcome back, Operator. I am your Threatopia AI Assistant. How can I assist you with your cybersecurity training today?',
    timestamp: new Date(Date.now() - 60000)
  }
]

const suggestedPrompts = [
  "Explain SQL Injection",
  "How do I use Nmap?",
  "Analyze this firewall rule",
  "Help with the cryptography challenge"
]

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I've analyzed your request regarding "${content}". This looks like a perfect opportunity to dive deeper into our threat models. Would you like me to open the relevant simulation environment or provide a theoretical breakdown first?`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, responseMessage])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-5xl mx-auto gap-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Bot className="h-8 w-8 text-neon-cyan pulse-neon rounded-full" />
            <span className="gradient-text">AI Assistant</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Advanced cybersecurity intelligence at your command.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10">
            <RefreshCw className="h-4 w-4 mr-2" />
            New Session
          </Button>
          <Button variant="outline" size="icon" className="sm:hidden border-neon-blue/30 text-neon-blue">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        {/* Main Chat Area */}
        <Card className="flex flex-col flex-1 border-neon-blue/20 bg-background/50 glass relative overflow-hidden">
          <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />
          
          <ScrollArea className="flex-1 p-4 w-full">
            <div className="space-y-6 pb-4">
              <AnimatePresence initial={false}>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex gap-4 max-w-[85%]",
                      message.role === 'user' ? "ml-auto flex-row-reverse" : ""
                    )}
                  >
                    <Avatar className={cn(
                      "h-10 w-10 border-2",
                      message.role === 'assistant' ? "border-neon-cyan shadow-[0_0_10px_rgba(0,212,255,0.3)]" : "border-primary"
                    )}>
                      <AvatarFallback className={message.role === 'assistant' ? "bg-navy-deep" : "bg-primary/20"}>
                        {message.role === 'assistant' ? (
                          <Bot className="h-6 w-6 text-neon-cyan" />
                        ) : (
                          <User className="h-6 w-6 text-primary" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className={cn(
                      "rounded-2xl p-4 relative z-10",
                      message.role === 'user' 
                        ? "bg-primary/10 text-foreground rounded-tr-sm border border-primary/20" 
                        : "bg-navy-mid/80 text-foreground rounded-tl-sm neon-border glass-light"
                    )}>
                      <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                      <span className="text-[10px] text-muted-foreground mt-2 block opacity-70">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4 max-w-[80%]"
                >
                  <Avatar className="h-10 w-10 border-2 border-neon-cyan neon-glow-sm">
                    <AvatarFallback className="bg-navy-deep">
                      <Bot className="h-6 w-6 text-neon-cyan" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-navy-mid/80 rounded-2xl rounded-tl-sm p-4 neon-border flex items-center gap-1">
                    <span className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t border-border/50 bg-background/80 backdrop-blur-md relative z-10">
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {suggestedPrompts.map((prompt) => (
                  <Button
                    key={prompt}
                    variant="outline"
                    size="sm"
                    className="text-xs bg-secondary/30 border-secondary/50 hover:border-neon-cyan hover:text-neon-cyan transition-colors"
                    onClick={() => handleSendMessage(prompt)}
                  >
                    <Sparkles className="h-3 w-3 mr-1.5" />
                    {prompt}
                  </Button>
                ))}
              </div>
            )}
            
            <form 
              onSubmit={(e) => {
                e.preventDefault()
                handleSendMessage(inputValue)
              }}
              className="flex gap-2"
            >
              <div className="relative flex-1 group">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about threats, tools, or request analysis..."
                  className="pl-4 pr-12 py-6 bg-navy-mid/50 border-neon-blue/30 focus-visible:ring-neon-blue group-hover:border-neon-blue/50 transition-colors rounded-xl text-base"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <Button type="button" size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-neon-cyan">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button 
                type="submit" 
                size="icon" 
                disabled={!inputValue.trim() || isTyping}
                className="h-[52px] w-[52px] rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(var(--neon-blue),0.4)] transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              >
                <Send className="h-5 w-5" />
                <span className="sr-only">Send message</span>
              </Button>
            </form>
            <div className="text-center mt-2">
              <span className="text-[10px] text-muted-foreground">
                AI can make mistakes. Verify critical security information.
              </span>
            </div>
          </div>
        </Card>

        {/* Side Panel (Context/Tools) */}
        <div className="hidden lg:flex flex-col w-80 gap-4">
          <Card className="border-neon-blue/20 bg-background/50 glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-neon-blue">
                <Terminal className="h-4 w-4" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">AI Core</span>
                  <span className="text-neon-green flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
                    Online
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Latency</span>
                  <span className="text-foreground">24ms</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Model</span>
                  <span className="text-foreground">ThreatNet-v4</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-neon-blue/20 bg-background/50 glass flex-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-neon-cyan">
                <Shield className="h-4 w-4" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start text-sm hover:bg-neon-cyan/10 hover:text-neon-cyan">
                <Cpu className="h-4 w-4 mr-2" />
                Analyze Pcap File
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm hover:bg-neon-cyan/10 hover:text-neon-cyan">
                <Terminal className="h-4 w-4 mr-2" />
                Generate Sandbox Config
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm hover:bg-neon-cyan/10 hover:text-neon-cyan">
                <Shield className="h-4 w-4 mr-2" />
                Verify Exploit Pattern
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm text-muted-foreground">
                <MoreHorizontal className="h-4 w-4 mr-2" />
                More options
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
