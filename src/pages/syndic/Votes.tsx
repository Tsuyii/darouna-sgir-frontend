import { useEffect, useState } from 'react'
import api from '../../lib/api'
import { MOCK, mockVotes } from '../../lib/mockData'

interface VoteOption {
  id: string
  text: string
  votes: number
}

interface Vote {
  id: string
  title: string
  description: string
  status: 'open' | 'closed'
  endsAt: string
  createdAt: string
  totalVotes: number
  options: VoteOption[]
  userVotedOptionId: string | null
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function pct(votes: number, total: number) {
  if (total === 0) return 0
  return Math.round((votes / total) * 100)
}

export default function SyndicVotes() {
  const [votes, setVotes] = useState<Vote[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [closing, setClosing] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [endsAt, setEndsAt] = useState('')
  const [options, setOptions] = useState(['', ''])

  useEffect(() => {
    if (MOCK) {
      setVotes(mockVotes as Vote[])
      setLoading(false)
      return
    }
    api.get('/api/v1/votes')
      .then((res) => setVotes(res.data.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    const validOpts = options.filter((o) => o.trim())
    if (!title.trim() || validOpts.length < 2) return
    setSubmitting(true)
    try {
      if (MOCK) {
        const newVote: Vote = {
          id: `v${Date.now()}`,
          title, description,
          status: 'open',
          endsAt: endsAt || new Date(Date.now() + 7 * 86400000).toISOString(),
          createdAt: new Date().toISOString(),
          totalVotes: 0,
          options: validOpts.map((text, i) => ({ id: `o${Date.now()}${i}`, text, votes: 0 })),
          userVotedOptionId: null,
        }
        setVotes((prev) => [newVote, ...prev])
      } else {
        const res = await api.post('/api/v1/votes', {
          title, description,
          endsAt: endsAt || undefined,
          options: validOpts.map((text) => ({ text })),
        })
        setVotes((prev) => [res.data.data, ...prev])
      }
      setTitle('')
      setDescription('')
      setEndsAt('')
      setOptions(['', ''])
      setShowForm(false)
    } catch {
      // silently fail
    } finally {
      setSubmitting(false)
    }
  }

  async function handleClose(id: string) {
    setClosing(id)
    try {
      if (!MOCK) await api.post(`/api/v1/votes/${id}/close`)
      setVotes((prev) => prev.map((v) => v.id === id ? { ...v, status: 'closed' } : v))
    } catch {
      // silently fail
    } finally {
      setClosing(null)
    }
  }

  function addOption() {
    if (options.length < 6) setOptions((prev) => [...prev, ''])
  }

  function updateOption(i: number, val: string) {
    setOptions((prev) => prev.map((o, idx) => idx === i ? val : o))
  }

  function removeOption(i: number) {
    if (options.length <= 2) return
    setOptions((prev) => prev.filter((_, idx) => idx !== i))
  }

  const open = votes.filter((v) => v.status === 'open')
  const closed = votes.filter((v) => v.status === 'closed')

  return (
    <div className="px-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h2 className="font-headline text-2xl font-black text-primary tracking-tight">Votes</h2>
          <p className="text-on-surface-variant text-sm font-medium">Create and manage building votes</p>
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
          <h3 className="font-headline font-black text-on-surface">New Vote</h3>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Question</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What are residents voting on?"
              className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide context for residents…"
              rows={2}
              className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Ends On</label>
            <input
              type="date"
              value={endsAt}
              onChange={(e) => setEndsAt(e.target.value)}
              min={new Date().toISOString().slice(0, 10)}
              className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Options</label>
            {options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => updateOption(i, e.target.value)}
                  placeholder={`Option ${i + 1}`}
                  className="flex-1 bg-surface-container-low rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:ring-2 focus:ring-primary/20"
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(i)}
                    className="p-2 rounded-xl bg-error-container/10 text-error hover:bg-error-container/20 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">remove</span>
                  </button>
                )}
              </div>
            ))}
            {options.length < 6 && (
              <button
                type="button"
                onClick={addOption}
                className="flex items-center gap-2 text-sm text-primary font-semibold px-4 py-2 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                Add option
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full gloss-button glass-glow text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-[18px]">how_to_vote</span>
            {submitting ? 'Creating…' : 'Create Vote'}
          </button>
        </form>
      )}

      {/* Lists */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2].map((i) => <div key={i} className="h-48 bg-surface-container-lowest rounded-2xl" />)}
        </div>
      ) : votes.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl p-8 ambient-depth flex flex-col items-center gap-3 text-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">how_to_vote</span>
          <p className="text-on-surface-variant text-sm">No votes yet. Tap "New" to create one.</p>
        </div>
      ) : (
        <>
          {open.length > 0 && (
            <section className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Open ({open.length})</p>
              {open.map((v) => (
                <VoteCard key={v.id} vote={v} onClose={handleClose} closing={closing === v.id} />
              ))}
            </section>
          )}
          {closed.length > 0 && (
            <section className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Closed ({closed.length})</p>
              {closed.map((v) => (
                <VoteCard key={v.id} vote={v} onClose={handleClose} closing={false} />
              ))}
            </section>
          )}
        </>
      )}
    </div>
  )
}

function VoteCard({ vote, onClose, closing }: { vote: Vote; onClose: (id: string) => void; closing: boolean }) {
  const isOpen = vote.status === 'open'
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-5 ambient-depth space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-primary text-[20px]">how_to_vote</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
              isOpen ? 'bg-tertiary-container/20 text-tertiary' : 'bg-surface-container-high text-on-surface-variant'
            }`}>
              {isOpen ? 'Open' : 'Closed'}
            </span>
            <span className="text-[10px] text-on-surface-variant/60 font-semibold">
              {isOpen ? `Ends ${fmtDate(vote.endsAt)}` : `Ended ${fmtDate(vote.endsAt)}`}
            </span>
          </div>
          <h4 className="font-headline font-black text-on-surface text-base">{vote.title}</h4>
          {vote.description && <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{vote.description}</p>}
        </div>
        {isOpen && (
          <button
            onClick={() => onClose(vote.id)}
            disabled={closing}
            className="shrink-0 px-3 py-1.5 rounded-xl bg-error-container/10 text-error text-xs font-semibold hover:bg-error-container/20 transition-colors disabled:opacity-40"
          >
            {closing ? '…' : 'Close'}
          </button>
        )}
      </div>

      {/* Results */}
      <div className="space-y-2.5">
        {vote.options.map((opt) => {
          const p = pct(opt.votes, vote.totalVotes)
          const isWinner = !isOpen && opt.votes === Math.max(...vote.options.map((o) => o.votes))
          return (
            <div key={opt.id} className={`rounded-xl p-3 space-y-1.5 ${isWinner ? 'bg-primary/5' : 'bg-surface-container-low'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isWinner && <span className="material-symbols-outlined text-primary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>}
                  <p className={`text-sm font-semibold ${isWinner ? 'text-primary' : 'text-on-surface'}`}>{opt.text}</p>
                </div>
                <span className={`text-xs font-bold ${isWinner ? 'text-primary' : 'text-on-surface-variant'}`}>{p}%</span>
              </div>
              <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${isWinner ? 'bg-primary' : 'bg-outline-variant'}`}
                  style={{ width: `${p}%` }}
                />
              </div>
              <p className="text-[10px] text-on-surface-variant/60">{opt.votes} vote{opt.votes !== 1 ? 's' : ''}</p>
            </div>
          )
        })}
      </div>

      <p className="text-[10px] text-on-surface-variant/60 font-semibold">{vote.totalVotes} total vote{vote.totalVotes !== 1 ? 's' : ''}</p>
    </div>
  )
}
