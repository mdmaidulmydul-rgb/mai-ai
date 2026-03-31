import { CheckCircle, Circle, Loader2, XCircle } from 'lucide-react'

interface TaskStep {
  id: number
  label: string
  status: 'pending' | 'running' | 'done' | 'error'
  detail?: string
}

export default function TaskPlan({ tasks }: { tasks: TaskStep[] }) {
  if (!tasks || tasks.length === 0) return null

  return (
    <div className="mt-3 space-y-1.5 border-t border-white/10 pt-3">
      <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Task Plan</p>
      {tasks.map((task) => (
        <div key={task.id} className="flex items-start gap-2">
          {task.status === 'done' && <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />}
          {task.status === 'running' && <Loader2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5 animate-spin" />}
          {task.status === 'pending' && <Circle className="w-4 h-4 text-white/30 flex-shrink-0 mt-0.5" />}
          {task.status === 'error' && <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />}
          <div>
            <p className={`text-xs ${task.status === 'done' ? 'text-white/70' : task.status === 'running' ? 'text-white' : 'text-white/40'}`}>
              {task.label}
            </p>
            {task.detail && task.status === 'done' && (
              <p className="text-xs text-white/30 mt-0.5">{task.detail}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
