import { useEffect, useState } from 'react'
import api from '../../lib/api'
import { MOCK, mockComplaints } from '../../lib/mockData'

type ComplaintStatus = 'open' | 'in_progress' | 'resolved' | 'closed'
interface Complaint {
  id: string
  subject: string
  description: string
  category: string
  priority: string
  status: ComplaintStatus
  createdAt: string
  response?: string | null
}

const STATUS_META: Record<ComplaintStatus, { label: string; bg: string; text: string; icon: string }> = {
  open:        { label: 'Open',        bg: 'bg-surface-container-highest', text: 'text-on-surface-variant', icon: 'radio_button_unchecked' },
  in_progress: { label: 'In Progress', bg: 'bg-secondary-container/30',    text: 'text-secondary',          icon: 'autorenew' },
  resolved:    { label: 'Resolved',    bg: 'bg-tertiary-container/20',      text: 'text-tertiary',            icon: 'check_circle' },
  closed:      { label: 'Closed',      bg: 'bg-surface-container-high',     text: 'text-on-surface-variant', icon: 'cancel' },
}

const PRIORITY_COLOR: Record<string, string> = {
  low:    'text-on-surface-variant',
  normal: 'text-on-surface-variant',
  medium: 'text-secondary',
  high:   'text-error',
  urgent: 'text-error',
}

const CATEGORY_ICON: Record<string, string> = {
  noise:       'volume_up',
  maintenance: 'build',
  safety:      'security',
  plumbing:    'water_drop',
  electricity: 'bolt',
  cleaning:    'cleaning_services',
  other:       'category',
}

const CATEGORIES = [
  { value: 'noise',       label: 'Noise' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'safety',      label: 'Safety' },
  { value: 'plumbing',    label: 'Plumbing' },
  { value: 'electricity', label: 'Electricity' },
  { value: 'cleaning',    label: 'Cleaning' },
  { value: 'other',       label: 'Other' },
]

function fmt(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function ResidentSupport() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

  // Form state
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [priority, setPriority] = useState<'normal' | 'urgent'>('normal')

  useEffect(() => {
    if (MOCK) {
      setComplaints(mockComplaints as Complaint[])
      setLoading(false)
      return
    }
    api.get('/api/v1/complaints')
      .then((res) => setComplaints(res.data.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!subject.trim() || !description.trim() || !category) return
    setSubmitting(true)
    try {
      if (MOCK) {
        const newC: Complaint = {
          id: `cp${Date.now()}`,
          subject,
          description,
          category,
          priority,
          status: 'open',
          createdAt: new Date().toISOString(),
          response: null,
        }
        setComplaints((prev) => [newC, ...prev])
      } else {
        const res = await api.post('/api/v1/complaints', { subject, description, category, priority })
        setComplaints((prev) => [res.data.data, ...prev])
      }
      setSubject('')
      setDescription('')
      setCategory('')
      setPriority('normal')
      setShowForm(false)
    } catch {
      // silently fail
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="px-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h2 className="font-headline text-2xl font-black text-primary tracking-tight">Support</h2>
          <p className="text-on-surface-variant text-sm font-medium">File and track complaints</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="gloss-button text-white text-sm font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-900/10 active:scale-[0.97] transition-transform"
        >
          <span className="material-symbols-outlined text-[18px]">{showForm ? 'close' : 'add'}</span>
          {showForm ? 'Cancel' : 'New'}
        </button>
      </div>

      {/* File complaint form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-surface-container-lowest rounded-2xl p-5 ambient-depth space-y-4"
        >
          <h3 className="font-headline font-black text-on-surface">File a Complaint</h3>

          {/* Subject */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief description of the issue"
              className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Category</label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full appearance-none bg-surface-container-low rounded-xl px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
                required
              >
                <option value="" disabled>Select category…</option>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[18px]">expand_more</span>
            </div>
          </div>

          {/* Priority toggle */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Urgency</label>
            <div className="grid grid-cols-2 gap-3">
              {(['normal', 'urgent'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
                    priority === p
                      ? p === 'urgent'
                        ? 'bg-error-container/30 text-error ring-2 ring-error/20'
                        : 'bg-primary/10 text-primary ring-2 ring-primary/20'
                      : 'bg-surface-container-low text-on-surface-variant'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{p === 'urgent' ? 'bolt' : 'schedule'}</span>
                  {p === 'urgent' ? 'Urgent' : 'Normal'}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Details</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue in detail — location, when it started, etc."
              rows={4}
              className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full gloss-button glass-glow text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
            {submitting ? 'Submitting…' : 'Submit Complaint'}
          </button>
        </form>
      )}

      {/* Complaints list */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <span className="material-symbols-outlined animate-spin text-primary text-3xl">progress_activity</span>
        </div>
      ) : complaints.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl p-8 ambient-depth flex flex-col items-center gap-3 text-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">inbox</span>
          <p className="text-on-surface-variant text-sm">No complaints yet. Tap "New" to file one.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
            {complaints.length} complaint{complaints.length !== 1 ? 's' : ''}
          </p>
          {complaints.map((c) => {
            const s = STATUS_META[c.status] ?? STATUS_META.open
            const catIcon = CATEGORY_ICON[c.category] ?? 'category'
            const isOpen = expanded === c.id
            return (
              <div key={c.id} className="bg-surface-container-lowest rounded-2xl ambient-depth overflow-hidden">
                <button
                  className="w-full text-left p-5"
                  onClick={() => setExpanded(isOpen ? null : c.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-primary text-[18px]">{catIcon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="font-semibold text-sm text-on-surface truncate">{c.subject}</p>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${s.bg} ${s.text}`}>
                          {s.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-on-surface-variant">
                        <span className="capitalize">{c.category}</span>
                        <span>·</span>
                        <span className={`font-semibold capitalize ${PRIORITY_COLOR[c.priority] ?? ''}`}>{c.priority}</span>
                        <span>·</span>
                        <span>{fmt(c.createdAt)}</span>
                      </div>
                    </div>
                    <span className={`material-symbols-outlined text-on-surface-variant text-[18px] shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                      expand_more
                    </span>
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 space-y-3 border-t border-surface-container pt-4">
                    <p className="text-sm text-on-surface-variant leading-relaxed">{c.description}</p>
                    {c.response && (
                      <div className="bg-primary/5 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="material-symbols-outlined text-primary text-[16px]">support_agent</span>
                          <p className="text-xs font-bold text-primary uppercase tracking-wider">Syndic Response</p>
                        </div>
                        <p className="text-sm text-on-surface leading-relaxed">{c.response}</p>
                      </div>
                    )}
                    {c.status === 'resolved' && !c.response && (
                      <div className="flex items-center gap-2 text-tertiary">
                        <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        <p className="text-sm font-semibold">This complaint has been resolved.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
