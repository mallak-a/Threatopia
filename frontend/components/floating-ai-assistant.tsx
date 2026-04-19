'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Send, User, Sparkles, Paperclip, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
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
    content: 'Threatopia AI online. How can I assist you with your current task?',
    timestamp: new Date()
  }
]

export function FloatingAIAssistant() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100)
    }
  }, [messages, isTyping, isOpen])

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    
    if (!inputValue.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
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
        content: `I am analyzing the context of your query. This feature is integrated directly into your workspace for instant intelligence gathering.`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, responseMessage])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          size="icon" 
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(var(--neon-blue),0.5)] transition-all hover:scale-110 z-50 group"
        >
          <Bot className="h-6 w-6 transition-transform group-hover:rotate-12" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-neon-cyan border-2 border-background"></span>
          </span>
          <span className="sr-only">Open AI Assistant</span>
        </Button>
      </SheetTrigger>
      
      <SheetContent side="right" className="w-[400px] sm:w-[450px] p-0 flex flex-col border-l border-neon-blue/20 bg-background/95 backdrop-blur-xl">
        <SheetHeader className="p-4 border-b border-border/50 bg-background/50">
          <SheetTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-neon-cyan" />
            <span className="gradient-text">Threatopia AI</span>
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 flex flex-col relative overflow-hidden">
          <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />
          
          <ScrollArea className="flex-1 p-4 w-full">
            <div className="space-y-4 pb-4">
              <AnimatePresence initial={false}>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={cn(
                      "flex gap-3 max-w-[90%]",
                      message.role === 'user' ? "ml-auto flex-row-reverse" : ""
                    )}
                  >
                    <Avatar className={cn(
                      "h-8 w-8 border",
                      message.role === 'assistant' ? "border-neon-cyan shadow-[0_0_8px_rgba(0,212,255,0.3)]" : "border-primary"
                    )}>
                      <AvatarFallback className={message.role === 'assistant' ? "bg-navy-deep" : "bg-primary/20"}>
                        {message.role === 'assistant' ? (
                          <Bot className="h-4 w-4 text-neon-cyan" />
                        ) : (
                          <User className="h-4 w-4 text-primary" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className={cn(
                      "rounded-2xl p-3 relative z-10 text-sm",
                      message.role === 'user' 
                        ? "bg-primary/10 text-foreground rounded-tr-sm border border-primary/20" 
                        : "bg-navy-mid/90 text-foreground rounded-tl-sm neon-border glass-light"
                    )}>
                      <p className="leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                      <span className="text-[9px] text-muted-foreground mt-1.5 block opacity-70">
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
                  className="flex gap-3 max-w-[80%]"
                >
                  <Avatar className="h-8 w-8 border border-neon-cyan neon-glow-sm">
                    <AvatarFallback className="bg-navy-deep">
                      <Bot className="h-4 w-4 text-neon-cyan" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-navy-mid/90 rounded-2xl rounded-tl-sm p-3 neon-border flex items-center gap-1 h-10">
                    <span className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-border/50 bg-background/80 backdrop-blur-md relative z-10">
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {["Scan logs", "Explain alert"].map((prompt) => (
                  <Button
                    key={prompt}
                    variant="outline"
                    size="sm"
                    className="text-[11px] h-7 px-2 bg-secondary/30 border-secondary/50 hover:border-neon-cyan hover:text-neon-cyan"
                    onClick={() => {
                      setInputValue(prompt)
                      setTimeout(() => handleSendMessage(), 50)
                    }}
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    {prompt}
                  </Button>
                ))}
              </div>
            )}
            
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <div className="relative flex-1 group">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask the assistant..."
                  className="pl-3 pr-10 py-5 bg-navy-mid/50 border-neon-blue/30 focus-visible:ring-neon-blue group-hover:border-neon-blue/50 transition-colors rounded-xl text-sm"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <Button type="button" size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-neon-cyan">
                    <Paperclip className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <Button 
                type="submit" 
                size="icon" 
                disabled={!inputValue.trim() || isTyping}
                className="h-[42px] w-[42px] shrink-0 rounded-xl bg-primary hover:bg-primary/90 shadow-[0_0_10px_rgba(var(--neon-blue),0.3)] transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
