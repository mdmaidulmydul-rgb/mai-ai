export default function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-2 py-1">
      <span className="text-white/50 text-sm">Thinking</span>
      <div className="flex gap-1">
        <span className="thinking-dot w-1.5 h-1.5 rounded-full bg-primary inline-block"></span>
        <span className="thinking-dot w-1.5 h-1.5 rounded-full bg-primary inline-block"></span>
        <span className="thinking-dot w-1.5 h-1.5 rounded-full bg-primary inline-block"></span>
      </div>
    </div>
  )
}
