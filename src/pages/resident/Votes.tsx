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

export default function ResidentVotes() {
  const [votes, setVotes] = useState<Vote[]>([])
  const [loading, setLoading] = useState(true)
  const [voting, setVoting] = useState<string | null>(null)

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

  async function castVote(voteId: string, optionId: string) {
    if (voting) return
    setVoting(voteId)
    try {
      if (!MOCK) {
        await api.post(`/api/v1/votes/${voteId}/cast`, { optionId })
      }
      setVotes((prev) =>
        prev.map((v) => {
          if (v.id !== voteId) return v
          return {
            ...v,
            totalVotes: v.userVotedOptionId ? v.totalVotes : v.totalVotes + 1,
            userVotedOptionId: optionId,
            options: v.options.map((o) => ({
              ...o,
              votes: o.id === optionId
                ? o.votes + (v.userVotedOptionId === optionId ? 0 : 1)
                : o.votes - (v.userVotedOptionId === o.id ? 1 : 0),
            })),
          }
        })
      )
    } catch {
      // silently fail
    } finally {
      setVoting(null)
    }
  }

  const open = votes.filter((v) => v.status === 'open')
  const closed = votes.filter((v) => v.status === 'closed')

  return (
    <div className="px-6 space-y-6">
      <div className="space-y-1">
        <h2 className="font-headline text-2xl font-black text-primary tracking-tight">Votes</h2>
        <p className="text-on-surface-variant text-sm font-medium">Participate in building decisions</p>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2].map((i) => <div key={i} className="h-48 bg-surface-container-lowest rounded-2xl" />)}
        </div>
      ) : votes.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl p-8 ambient-depth flex flex-col items-center gap-3 text-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">how_to_vote</span>
          <p className="text-on-surface-variant text-sm">No votes available right now.</p>
        </div>
      ) : (
        <>
          {open.length > 0 && (
            <section className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Open ({open.length})
              </p>
              {open.map((v) => <VoteCard key={v.id} vote={v} onVote={castVote} busy={voting === v.id} />)}
            </section>
          )}
          {closed.length > 0 && (
            <section className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Closed ({closed.length})
              </p>
              {closed.map((v) => <VoteCard key={v.id} vote={v} onVote={castVote} busy={false} />)}
            </section>
          )}
        </>
      )}
    </div>
  )
}

function VoteCard({ vote, onVote, busy }: { vote: Vote; onVote: (vId: string, oId: string) => void; busy: boolean }) {
  const isOpen = vote.status === 'open'
  const hasVoted = vote.userVotedOptionId !== null
  const showResults = hasVoted || !isOpen

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-5 ambient-depth space-y-4">
      {/* Header */}
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
          <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{vote.description}</p>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-2.5">
        {vote.options.map((opt) => {
          const p = pct(opt.votes, vote.totalVotes)
          const isSelected = vote.userVotedOptionId === opt.id
          const isWinner = !isOpen && opt.votes === Math.max(...vote.options.map((o) => o.votes))

          if (showResults) {
            return (
              <div key={opt.id} className={`rounded-xl p-3 space-y-1.5 ${isSelected ? 'bg-primary/10' : 'bg-surface-container-low'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isSelected && (
                      <span className="material-symbols-outlined text-primary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    )}
                    {isWinner && !isSelected && (
                      <span className="material-symbols-outlined text-tertiary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
                    )}
                    <p className={`text-sm font-semibold ${isSelected ? 'text-primary' : 'text-on-surface'}`}>{opt.text}</p>
                  </div>
                  <span className={`text-xs font-bold ${isSelected ? 'text-primary' : 'text-on-surface-variant'}`}>{p}%</span>
                </div>
                <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${isSelected ? 'bg-primary' : isWinner ? 'bg-tertiary' : 'bg-outline-variant'}`}
                    style={{ width: `${p}%` }}
                  />
                </div>
                <p className="text-[10px] text-on-surface-variant/60">{opt.votes} vote{opt.votes !== 1 ? 's' : ''}</p>
              </div>
            )
          }

          return (
            <button
              key={opt.id}
              onClick={() => onVote(vote.id, opt.id)}
              disabled={busy}
              className="w-full text-left bg-surface-container-low rounded-xl px-4 py-3 text-sm font-semibold text-on-surface hover:bg-surface-container transition-colors active:scale-[0.98] disabled:opacity-60 flex items-center gap-2"
            >
              <span className="w-5 h-5 rounded-full border-2 border-outline-variant shrink-0" />
              {opt.text}
            </button>
          )
        })}
      </div>

      <p className="text-[10px] text-on-surface-variant/60 font-semibold">
        {vote.totalVotes} total vote{vote.totalVotes !== 1 ? 's' : ''}
        {hasVoted && isOpen && ' · Your vote has been recorded'}
      </p>
    </div>
  )
}
