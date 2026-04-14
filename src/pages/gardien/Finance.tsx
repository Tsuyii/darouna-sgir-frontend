import { useEffect, useState } from 'react'
import api from '../../lib/api'
import { MOCK } from '../../lib/mockData'

interface Task {
  id: string
  title: string
  status: 'pending' | 'assigned' | 'in_progress' | 'submitted_for_approval' | 'submitted' | 'approved' | 'rejected'
  createdAt: string
}

const MOCK_TASKS: Task[] = [
  { id: 'gf1', title: 'Nettoyage parking',        status: 'approved',    createdAt: '2026-04-10T08:00:00Z' },
  { id: 'gf2', title: 'Vérification interphone',  status: 'approved',    createdAt: '2026-04-08T09:00:00Z' },
  { id: 'gf3', title: 'Sortie poubelles',          status: 'approved',    createdAt: '2026-04-05T10:00:00Z' },
  { id: 'gf4', title: 'Remplacement ampoule',      status: 'in_progress', createdAt: '2026-04-12T08:00:00Z' },
  { id: 'gf5', title: 'Nettoyage hall entrée',     status: 'pending',     createdAt: '2026-04-13T09:00:00Z' },
  { id: 'gf6', title: 'Nettoyage cage escalier',   status: 'approved',    createdAt: '2026-03-28T08:00:00Z' },
]

export default function GardienFinance() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (MOCK) {
      setTasks(MOCK_TASKS)
      setLoading(false)
      return
    }
    api.get('/api/v1/tasks/gardien')
      .then((res) => setTasks(res.data.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const now = new Date()
  const approved    = tasks.filter((t) => t.status === 'approved')
  const inProgress  = tasks.filter((t) => t.status === 'in_progress')
  const pending     = tasks.filter((t) => ['pending', 'assigned'].includes(t.status))
  const submitted   = tasks.filter((t) => ['submitted', 'submitted_for_approval'].includes(t.status))

  const thisMonthApproved = approved.filter((t) => {
    const d = new Date(t.createdAt)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })

  return (
    <div className="px-6 pb-8 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <p className="text-on-surface-variant font-medium text-xs uppercase tracking-widest">Gardien Overview</p>
        <h2 className="font-headline text-2xl font-black text-on-surface tracking-tight">Work Summary</h2>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-36 bg-surface-container-lowest rounded-xl" />
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-surface-container-lowest rounded-xl" />)}
          </div>
          <div className="h-48 bg-surface-container-lowest rounded-xl" />
        </div>
      ) : (
        <>
          {/* Hero — this month's completed tasks */}
          <div
            className="rounded-xl p-6 text-white relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #064E3B 0%, #10B981 100%)', boxShadow: 'inset 1px 1px 2px rgba(255,255,255,0.3)' }}
          >
            <div className="absolute -top-6 -right-6 w-28 h-28 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-white/5 rounded-full blur-[60px]" />
            <div className="relative z-10">
              <p className="text-[10px] uppercase tracking-widest font-bold text-primary-fixed/80 mb-3">
                {now.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}
              </p>
              <div className="flex items-end gap-4">
                <p className="font-headline text-6xl font-black leading-none">{thisMonthApproved.length}</p>
                <div className="pb-1">
                  <p className="font-bold text-base">Tasks Completed</p>
                  <p className="text-xs text-primary-fixed/70 mt-0.5">Approved by syndic</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-surface-container-lowest rounded-xl p-4 ambient-depth text-center">
              <p className="font-headline text-2xl font-bold text-primary">{approved.length}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mt-1">Approved</p>
            </div>
            <div className="bg-surface-container-lowest rounded-xl p-4 ambient-depth text-center">
              <p className="font-headline text-2xl font-bold text-blue-600">{inProgress.length}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mt-1">In Progress</p>
            </div>
            <div className="bg-surface-container-lowest rounded-xl p-4 ambient-depth text-center">
              <p className="font-headline text-2xl font-bold text-on-surface">{pending.length}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mt-1">Pending</p>
            </div>
          </div>

          {/* Completed tasks list */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-headline text-lg font-bold text-on-surface">Completed Tasks</h3>
              <span className="text-xs font-bold text-on-surface-variant">{approved.length} total</span>
            </div>

            {approved.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-xl p-6 text-center text-on-surface-variant text-sm ambient-depth">
                No completed tasks yet this month.
              </div>
            ) : (
              <div className="space-y-2">
                {approved.map((t) => (
                  <div key={t.id} className="bg-surface-container-low rounded-xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary shrink-0">
                      <span
                        className="material-symbols-outlined text-lg"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        verified
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-on-surface truncate">{t.title}</p>
                      <p className="text-xs text-on-surface-variant">
                        {new Date(t.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-primary-container/20 text-on-primary-container shrink-0">
                      Approved
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Monthly breakdown */}
          <div className="bg-surface-container-lowest rounded-xl p-5 ambient-depth space-y-3">
            <h3 className="font-headline text-base font-bold text-on-surface">Monthly Breakdown</h3>
            <div className="space-y-0">
              {[
                { label: 'Total assigned',          value: tasks.length,    icon: 'assignment' },
                { label: 'Completed & approved',    value: approved.length, icon: 'verified' },
                { label: 'Awaiting approval',       value: submitted.length, icon: 'pending_actions' },
                { label: 'In progress',             value: inProgress.length, icon: 'autorenew' },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between py-3 border-b border-surface-container last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-on-surface-variant">{row.icon}</span>
                    <span className="text-sm text-on-surface-variant">{row.label}</span>
                  </div>
                  <span className="font-bold text-sm text-on-surface">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
