import { Globe, Code, FileText, Brain, Zap, Search } from 'lucide-react'

const capabilities = [
  {
    icon: Brain,
    title: 'Autonomous Planning',
    desc: 'Breaks complex tasks into steps and executes them',
    example: 'Research and summarize a topic for me',
  },
  {
    icon: Code,
    title: 'Code Generation',
    desc: 'Writes, reviews, and debugs code in any language',
    example: 'Build a Python web scraper',
  },
  {
    icon: Globe,
    title: 'Web Research',
    desc: 'Searches and synthesizes information from the web',
    example: 'Find the latest AI news and summarize',
  },
  {
    icon: FileText,
    title: 'Document Creation',
    desc: 'Creates reports, essays, emails, and more',
    example: 'Write a business proposal for my startup',
  },
]

export default function AgentCapabilities() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4">
        <Zap className="w-8 h-8 text-white" />
      </div>
      <h2 className="text-2xl font-semibold text-white mb-2">MAI AI</h2>
      <p className="text-white/50 text-sm mb-10 text-center max-w-md">
        Your autonomous AI agent. Give me any task — I'll plan it, execute it, and deliver results.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
        {capabilities.map((cap) => (
          <div
            key={cap.title}
            className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-primary/30 transition cursor-pointer group"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                <cap.icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">{cap.title}</p>
                <p className="text-white/40 text-xs mt-0.5">{cap.desc}</p>
                <p className="text-primary/70 text-xs mt-2 group-hover:text-primary transition">
                  "{cap.example}"
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
