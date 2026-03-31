'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, Globe, Code, FileText, Cpu, Loader2, Bot, User, Plus, Trash2 } from 'lucide-react'
import ThinkingIndicator from '@/components/ThinkingIndicator'
import TaskPlan from '@/components/TaskPlan'
import AgentCapabilities from '@/components/AgentCapabilities'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  tasks?: TaskStep[]
}

interface TaskStep {
  id: number
  label: string
  status: 'pending' | 'running' | 'done' | 'error'
  detail?: string
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [currentTasks, setCurrentTasks] = useState<TaskStep[]>([])
  const chatEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isThinking])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isThinking) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsThinking(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      const data = await res.json()

      if (data.tasks) {
        setCurrentTasks(data.tasks)
        for (let i = 0; i < data.tasks.length; i++) {
          await new Promise(r => setTimeout(r, 800))
          setCurrentTasks(prev =>
            prev.map((t, idx) => ({
              ...t,
              status: idx <= i ? 'done' : idx === i + 1 ? 'running' : 'pending',
            }))
          )
        }
      }

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || data.error || 'Sorry, something went wrong.',
        timestamp: new Date(),
        tasks: data.tasks,
      }

      setMessages(prev => [...prev, assistantMsg])
      setCurrentTasks([])
    } catch (err) {
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Connection error. Please check your API key and try again.',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errMsg])
    } finally {
      setIsThinking(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const clearChat = () => {
    setMessages([])
    setCurrentTasks([])
  }

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">MAI AI</h1>
            <p className="text-xs text-white/50">Autonomous Agent</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={clearChat}
            className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
        {messages.length === 0 && (
          <AgentCapabilities />
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`agent-message flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
              msg.role === 'user'
                ? 'bg-primary/20 text-primary'
                : 'bg-gradient-to-br from-primary to-secondary text-white'
            }`}>
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              msg.role === 'user'
                ? 'bg-primary/20 text-white'
                : 'bg-white/5 text-white/90 border border-white/10'
            }`}>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
              {msg.tasks && <TaskPlan tasks={msg.tasks} />}
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
              <ThinkingIndicator />
              {currentTasks.length > 0 && <TaskPlan tasks={currentTasks} />}
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </main>

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tell MAI what to do..."
            rows={1}
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-4 pr-12 py-3 text-white placeholder-white/30 focus:outline-none focus:border-primary/50 resize-none text-sm"
          />
          <button
            type="submit"
            disabled={!input.trim() || isThinking}
            className="absolute right-2 bottom-2 p-2 rounded-xl bg-primary hover:bg-primary/80 disabled:opacity-30 disabled:hover:bg-primary transition"
          >
            {isThinking ? (
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            ) : (
              <Send className="w-4 h-4 text-white" />
            )}
          </button>
        </form>
        <p className="text-center text-white/30 text-xs mt-2">
          MAI AI can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  )
}
