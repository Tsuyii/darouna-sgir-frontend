import { useEffect, useState } from 'react'
import api from '../../lib/api'
import { MOCK, mockAllTasks } from '../../lib/mockData'

type TaskStatus = 'pending' | 'assigned' | 'in_progress' | 'submitted_for_approval' | 'approved' | 'rejected'
type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  assignedTo?: { name: string } | null
  createdAt: string
}

const STATUS_META: Record<TaskStatus, { label: string; bg: string; text: string; icon: string; iconColor: string }> = {
  pending:                { label: 'Pending',     bg: 'bg-surface-container-high',  text: 'text-on-surface-variant', icon: 'pending_actions', iconColor: 'text-on-surface-variant' },
  assigned:               { label: 'Assigned',    bg: 'bg-secondary-container/30',  text: 'text-secondary',          icon: 'person',          iconColor: 'text-secondary' },
  in_progress:            { label: 'In Progress', bg: 'bg-blue-50',                 text: 'text-blue-700',           icon: 'autorenew',       iconColor: 'text-blue-500' },
  submitted_for_approval: { label: 'Review',      bg: 'bg-primary-fixed/30',        text: 'text-on-primary-fixed-variant', icon: 'rate_review', iconColor: 'text-primary' },
  approved:               { label: 'Approved',    bg: 'bg-tertiary-container/20',   text: 'text-on-tertiary-container', icon: 'verified',     iconColor: 'text-tertiary' },
  rejected:               { label: 'Rejected',    bg: 'bg-error-container/20',      text: 'text-on-error-container', icon: 'cancel',         iconColor: 'text-error' },
}

const PRIORITY_META: Record<TaskPriority, { label: string; color: string }> = {
  low:    { label: 'Low',    color: 'text-on-surface-variant' },
  medium: { label: 'Medium', color: 'text-secondary' },
  high:   { label: 'High',   color: 'text-error' },
  urgent: { label: 'Urgent', color: 'text-error' },
}

const FILTER_TABS: { label: string; value: string }[] = [
  { label: 'All',     value: 'all' },
  { label: 'Review',  value: 'submitted_for_approval' },
  { label: 'Active',  value: 'in_progress' },
  { label: 'Pending', value: 'pending' },
  { label: 'Done',    value: 'approved' },
]

export default function SyndicTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [updating, setUpdating] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (MOCK) {
      setTasks(mockAllTasks)
      setLoading(false)
      return
    }
    api.get('/api/v1/tasks')
      .then((res) => setTasks(res.data.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function handleApprove(id: string, approved: boolean) {
    setUpdating(id)
    try {
      if (MOCK) {
        setTasks((prev) =>
          prev.map((t) => t.id === id ? { ...t, status: approved ? 'approved' : 'rejected' } : t)
        )
        return
      }
      await api.post(`/api/v1/tasks/${id}/approve`, { approved })
      setTasks((prev) =>
        prev.map((t) => t.id === id ? { ...t, status: approved ? 'approved' : 'rejected' } : t)
      )
    } catch { /* ignore */ } finally { setUpdating(null) }
  }

  async function handleCreate() {
    if (!newTitle.trim()) return
    setCreating(true)
    try {
      if (MOCK) {
        const newTask: Task = {
          id: `mock-${Date.now()}`,
          title: newTitle,
          description: newDesc,
          status: 'pending',
          priority: 'medium',
          assignedTo: null,
          createdAt: new Date().toISOString(),
        }
        setTasks((prev) => [newTask, ...prev])
        setShowCreate(false)
        setNewTitle('')
        setNewDesc('')
        return
      }
      const res = await api.post('/api/v1/tasks', { title: newTitle, description: newDesc })
      setTasks((prev) => [res.data.data, ...prev])
      setShowCreate(false)
      setNewTitle('')
      setNewDesc('')
    } catch { /* ignore */ } finally { setCreating(false) }
  }

  const filtered = filter === 'all' ? tasks : tasks.filter((t) => t.status === filter)
  const reviewCount = tasks.filter((t) => t.status === 'submitted_for_approval').length

  return (
    <div className="px-6 pb-8 space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <h2 className="font-headline text-2xl font-black text-primary tracking-tight">Task Management</h2>
          <p className="text-on-surface-variant text-sm font-medium">Review and manage maintenance tasks</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="w-10 h-10 rounded-full bg-gradient-to-br from-[#064E3B] to-[#10B981] text-white flex items-center justify-center shadow-lg shadow-emerald-900/20 active:scale-90 transition-transform"
        >
          <span className="material-symbols-outlined">add</span>
        </button>
      </div>

      {/* Review banner */}
      {reviewCount > 0 && (
        <div className="bg-primary-fixed/20 rounded-xl px-4 py-3 flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">rate_review</span>
          <p className="text-sm font-bold text-on-primary-container">
            {reviewCount} task{reviewCount > 1 ? 's' : ''} awaiting your approval
          </p>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              filter === tab.value
                ? 'bg-gradient-to-br from-[#064E3B] to-[#10B981] text-white shadow-lg shadow-emerald-900/20'
                : 'bg-surface-container text-on-surface-variant'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Task list */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-surface-container-lowest rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl p-8 text-center text-on-surface-variant text-sm font-medium ambient-depth">
          No tasks in this category.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((task) => {
            const sm = STATUS_META[task.status]
            const pm = PRIORITY_META[task.priority] ?? PRIORITY_META.medium
            const busy = updating === task.id
            const isReview = task.status === 'submitted_for_approval'

            return (
              <div
                key={task.id}
                className={`bg-surface-container-lowest rounded-xl p-5 ambient-depth ${isReview ? 'ring-1 ring-primary-fixed' : ''}`}
              >
                {/* Status + priority row */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`material-symbols-outlined text-base ${sm.iconColor}`}>{sm.icon}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${sm.bg} ${sm.text}`}>
                      {sm.label}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${pm.color}`}>
                    {pm.label}
                  </span>
                </div>

                {/* Title + meta */}
                <h3 className="font-headline font-bold text-on-surface text-base mb-1">{task.title}</h3>
                <p className="text-xs text-on-surface-variant mb-1 line-clamp-2">{task.description}</p>
                <div className="flex items-center gap-4 mt-2 text-[10px] text-on-surface-variant font-medium">
                  {task.assignedTo && (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined" style={{ fontSize: 12 }}>person</span>
                      {task.assignedTo.name}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined" style={{ fontSize: 12 }}>calendar_today</span>
                    {new Date(task.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                  </span>
                </div>

                {/* Approve / Reject actions */}
                {isReview && (
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleApprove(task.id, false)}
                      disabled={busy}
                      className="flex-1 py-2.5 rounded-xl bg-surface-container-high text-on-surface-variant text-xs font-bold uppercase tracking-wider disabled:opacity-60 active:scale-[0.98] transition-all"
                    >
                      {busy ? '…' : 'Reject'}
                    </button>
                    <button
                      onClick={() => handleApprove(task.id, true)}
                      disabled={busy}
                      className="flex-[2] py-2.5 rounded-xl bg-gradient-to-br from-[#064E3B] to-[#10B981] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-emerald-900/20 disabled:opacity-60 active:scale-[0.98] transition-all"
                    >
                      {busy ? 'Approving…' : 'Approve'}
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Create Task Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-6">
          <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" onClick={() => setShowCreate(false)} />
          <div className="relative w-full max-w-md bg-surface-container-lowest rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-headline text-lg font-black text-primary">Create Task</h3>
              <button onClick={() => setShowCreate(false)} className="p-1 text-on-surface-variant">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Title</label>
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Clean rooftop terrace"
                className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-sm text-on-surface font-medium focus:outline-none focus:ring-2 focus:ring-primary-fixed-dim"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Description</label>
              <textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Describe what needs to be done…"
                rows={3}
                className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-sm text-on-surface font-medium focus:outline-none focus:ring-2 focus:ring-primary-fixed-dim resize-none"
              />
            </div>
            <button
              onClick={handleCreate}
              disabled={creating || !newTitle.trim()}
              className="w-full py-3.5 rounded-xl bg-gradient-to-br from-[#064E3B] to-[#10B981] text-white font-bold text-sm shadow-lg shadow-emerald-900/20 disabled:opacity-60 active:scale-[0.98] transition-all"
            >
              {creating ? 'Creating…' : 'Create Task'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
