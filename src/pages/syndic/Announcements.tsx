import { useEffect, useState } from 'react'
import api from '../../lib/api'
import { MOCK, mockAnnouncements } from '../../lib/mockData'

interface Announcement {
  id: string
  title: string
  content: string
  category: string
  priority: string
  status: string
  likesCount: number
  viewsCount: number
  createdAt: string
}

const CATEGORY_META: Record<string, { label: string; bg: string; text: string; icon: string }> = {
  maintenance: { label: 'Maintenance', bg: 'bg-secondary-container/30', text: 'text-secondary',          icon: 'build' },
  event:       { label: 'Event',       bg: 'bg-tertiary-container/20',  text: 'text-tertiary',            icon: 'event' },
  general:     { label: 'General',     bg: 'bg-surface-container-high', text: 'text-on-surface-variant',  icon: 'info' },
  emergency:   { label: 'Emergency',   bg: 'bg-error-container/20',     text: 'text-error',               icon: 'emergency' },
}

const CATEGORIES = [
  { value: 'general',     label: 'General' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'event',       label: 'Event' },
  { value: 'emergency',   label: 'Emergency' },
]

const PRIORITIES = [
  { value: 'low',    label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high',   label: 'High' },
  { value: 'urgent', label: 'Urgent' },
]

function fmt(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function SyndicAnnouncements() {
  const [items, setItems] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('general')
  const [priority, setPriority] = useState('medium')

  useEffect(() => {
    if (MOCK) {
      setItems(mockAnnouncements as Announcement[])
      setLoading(false)
      return
    }
    api.get('/api/v1/announcements')
      .then((res) => setItems(res.data.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return
    setSubmitting(true)
    try {
      if (MOCK) {
        const newAnn: Announcement = {
          id: `an${Date.now()}`,
          title, content, category, priority,
          status: 'published',
          likesCount: 0,
          viewsCount: 0,
          createdAt: new Date().toISOString(),
        }
        setItems((prev) => [newAnn, ...prev])
      } else {
        const res = await api.post('/api/v1/announcements', { title, content, category, priority, status: 'published' })
        setItems((prev) => [res.data.data, ...prev])
      }
      setTitle('')
      setContent('')
      setCategory('general')
      setPriority('medium')
      setShowForm(false)
    } catch {
      // silently fail
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    setDeleting(id)
    try {
      if (!MOCK) await api.delete(`/api/v1/announcements/${id}`)
      setItems((prev) => prev.filter((a) => a.id !== id))
    } catch {
      // silently fail
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="px-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h2 className="font-headline text-2xl font-black text-primary tracking-tight">Announcements</h2>
          <p className="text-on-surface-variant text-sm font-medium">Post updates to all residents</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="gloss-button text-white text-sm font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-900/10 active:scale-[0.97] transition-transform"
        >
          <span className="material-symbols-outlined text-[18px]">{showForm ? 'close' : 'add'}</span>
          {showForm ? 'Cancel' : 'New'}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <form onSubmit={handleCreate} className="bg-surface-container-lowest rounded-2xl p-5 ambient-depth space-y-4">
          <h3 className="font-headline font-black text-on-surface">New Announcement</h3>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Announcement title"
              className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Category</label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full appearance-none bg-surface-container-low rounded-xl px-3 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[16px]">expand_more</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Priority</label>
              <div className="relative">
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full appearance-none bg-surface-container-low rounded-xl px-3 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {PRIORITIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[16px]">expand_more</span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your announcement…"
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
            {submitting ? 'Publishing…' : 'Publish Announcement'}
          </button>
        </form>
      )}

      {/* Stats summary */}
      {!loading && items.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total',     value: items.length,                                  icon: 'campaign' },
            { label: 'Likes',     value: items.reduce((s, a) => s + a.likesCount, 0),  icon: 'thumb_up' },
            { label: 'Views',     value: items.reduce((s, a) => s + a.viewsCount, 0),  icon: 'visibility' },
          ].map((s) => (
            <div key={s.label} className="bg-surface-container-lowest rounded-2xl p-4 ambient-depth text-center">
              <span className="material-symbols-outlined text-primary text-xl">{s.icon}</span>
              <p className="font-headline font-black text-on-surface text-lg mt-1">{s.value}</p>
              <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-semibold">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => <div key={i} className="h-36 bg-surface-container-lowest rounded-2xl" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl p-8 ambient-depth flex flex-col items-center gap-3 text-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">campaign</span>
          <p className="text-on-surface-variant text-sm">No announcements yet. Tap "New" to create one.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((ann) => {
            const m = CATEGORY_META[ann.category] ?? CATEGORY_META.general
            return (
              <article key={ann.id} className="bg-surface-container-lowest rounded-2xl p-5 ambient-depth space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${m.bg} ${m.text}`}>
                        <span className="material-symbols-outlined text-[12px]">{m.icon}</span>
                        {m.label}
                      </span>
                      {ann.priority === 'urgent' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-error-container/20 text-error">Urgent</span>
                      )}
                      <span className="ml-auto text-[10px] text-on-surface-variant/60 font-semibold">{fmt(ann.createdAt)}</span>
                    </div>
                    <h4 className="font-headline font-black text-on-surface text-base">{ann.title}</h4>
                    <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-2">{ann.content}</p>
                    <div className="flex items-center gap-4 text-xs text-on-surface-variant/70">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">thumb_up</span>
                        {ann.likesCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">visibility</span>
                        {ann.viewsCount}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(ann.id)}
                    disabled={deleting === ann.id}
                    className="p-2 rounded-xl bg-error-container/10 text-error hover:bg-error-container/20 transition-colors shrink-0 active:scale-90 disabled:opacity-40"
                    title="Delete"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
