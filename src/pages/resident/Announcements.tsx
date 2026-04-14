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

function fmt(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function ResidentAnnouncements() {
  const [items, setItems] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState<Set<string>>(new Set())

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

  async function handleLike(id: string) {
    if (liked.has(id)) return
    setLiked((prev) => new Set(prev).add(id))
    setItems((prev) =>
      prev.map((a) => a.id === id ? { ...a, likesCount: a.likesCount + 1 } : a)
    )
    if (!MOCK) {
      api.post(`/api/v1/announcements/${id}/like`).catch(() => {})
    }
  }

  return (
    <div className="px-6 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="font-headline text-2xl font-black text-primary tracking-tight">Building Feed</h2>
        <p className="text-on-surface-variant text-sm font-medium">Announcements from your syndic</p>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => <div key={i} className="h-36 bg-surface-container-lowest rounded-2xl" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl p-8 ambient-depth flex flex-col items-center gap-3 text-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">campaign</span>
          <p className="text-on-surface-variant text-sm">No announcements yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((ann) => {
            const m = CATEGORY_META[ann.category] ?? CATEGORY_META.general
            const isLiked = liked.has(ann.id)
            return (
              <article key={ann.id} className="bg-surface-container-lowest rounded-2xl p-5 ambient-depth space-y-3">
                {/* Top row */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${m.bg} ${m.text}`}>
                    <span className="material-symbols-outlined text-[13px]">{m.icon}</span>
                    {m.label}
                  </div>
                  {ann.priority === 'urgent' && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-error-container/20 text-error">
                      Urgent
                    </span>
                  )}
                  <span className="ml-auto text-[10px] text-on-surface-variant/60 font-semibold">{fmt(ann.createdAt)}</span>
                </div>

                {/* Title + content */}
                <div>
                  <h4 className="font-headline font-black text-on-surface text-base mb-1">{ann.title}</h4>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{ann.content}</p>
                </div>

                {/* Footer: likes + views */}
                <div className="flex items-center gap-4 pt-1">
                  <button
                    onClick={() => handleLike(ann.id)}
                    className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                      isLiked ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-[18px]"
                      style={{ fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      thumb_up
                    </span>
                    {ann.likesCount}
                  </button>
                  <div className="flex items-center gap-1.5 text-xs text-on-surface-variant/60">
                    <span className="material-symbols-outlined text-[16px]">visibility</span>
                    {ann.viewsCount} views
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
