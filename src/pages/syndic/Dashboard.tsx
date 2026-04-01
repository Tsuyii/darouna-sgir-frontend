import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../lib/api'

interface BuildingStats {
  totalUnits: number
  occupancy: number
  revenue: number
  openTasks: number
}

interface Building {
  id: string
  name: string
}

interface Task {
  id: string
  title: string
  status: 'pending' | 'in_progress' | 'completed' | 'approved' | 'rejected'
  priority?: string
  createdAt: string
}

const STATUS_META: Record<string, { label: string; color: string; textColor: string }> = {
  pending:     { label: 'Pending',     color: 'bg-surface-container-high',    textColor: 'text-on-surface-variant' },
  in_progress: { label: 'In Progress', color: 'bg-primary-container/20',      textColor: 'text-on-primary-container' },
  completed:   { label: 'Completed',   color: 'bg-tertiary-container/20',     textColor: 'text-on-tertiary-container' },
  approved:    { label: 'Approved',    color: 'bg-tertiary-container/20',     textColor: 'text-on-tertiary-container' },
  rejected:    { label: 'Rejected',    color: 'bg-error-container/20',        textColor: 'text-on-error-container' },
}

const TASK_ICONS: Record<string, string> = {
  pending:     'warning',
  in_progress: 'electric_bolt',
  completed:   'check_circle',
  approved:    'check_circle',
  rejected:    'cancel',
}

const TASK_ICON_COLORS: Record<string, string> = {
  pending:     'text-error',
  in_progress: 'text-tertiary',
  completed:   'text-primary',
  approved:    'text-primary',
  rejected:    'text-error',
}

export default function SyndicDashboard() {
  const navigate = useNavigate()
  const [building, setBuilding] = useState<Building | null>(null)
  const [stats, setStats] = useState<BuildingStats | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const buildingsRes = await api.get('/api/buildings')
        const buildings: Building[] = buildingsRes.data.data ?? []
        if (buildings.length === 0) { setLoading(false); return }

        const first = buildings[0]
        setBuilding(first)

        const [statsRes, tasksRes] = await Promise.all([
          api.get(`/api/buildings/${first.id}/stats`),
          api.get('/api/tasks'),
        ])
        setStats(statsRes.data.data)
        const allTasks: Task[] = tasksRes.data.data ?? []
        setTasks(allTasks.slice(0, 3))
      } catch {
        // graceful degradation — show skeleton state
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const collectionRate = stats ? Math.round((stats.revenue / Math.max(stats.totalUnits * 3000, 1)) * 100) : 0
  const clampedRate = Math.min(collectionRate, 100)

  return (
    <div className="px-6 space-y-10 pb-12">
      {/* Hero: Collection Rate */}
      <section>
        <div className="relative bg-gradient-to-tr from-[#064E3B] to-[#10B981] rounded-2xl p-8 text-white shadow-2xl overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10 flex flex-col gap-8">
            {loading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-12 w-1/2 bg-white/20 rounded-xl" />
                <div className="h-6 w-full bg-white/10 rounded-full" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-16 bg-white/10 rounded-xl" />
                  <div className="h-16 bg-white/10 rounded-xl" />
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <div className="flex items-end justify-between mb-1">
                    <span className="text-5xl font-headline font-black tracking-tighter">
                      {stats ? `${clampedRate}.0%` : '—'}
                    </span>
                    <span className="text-[10px] font-label uppercase tracking-widest opacity-80 pb-1 font-bold">
                      Collected
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="relative h-6 w-full rounded-full overflow-hidden shadow-inner"
                       style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                    <div
                      className="h-full bg-gradient-to-r from-[#10B981] to-[#34D399] rounded-full relative flex items-center justify-end pr-2 shadow-[0_0_20px_rgba(52,211,153,0.6)] transition-all duration-700"
                      style={{ width: `${stats ? clampedRate : 0}%` }}
                    >
                      <div className="w-1.5 h-1.5 bg-white rounded-full shadow-sm" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
                    <p className="text-[10px] font-label uppercase tracking-wider text-emerald-100 font-semibold">Revenue</p>
                    <p className="text-lg font-bold font-headline mt-1">
                      {stats ? `${stats.revenue.toLocaleString()} MAD` : '—'}
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
                    <p className="text-[10px] font-label uppercase tracking-wider text-emerald-100 font-semibold">Open Tasks</p>
                    <p className="text-lg font-bold font-headline mt-1">
                      {stats ? stats.openTasks : '—'}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Budget Variance */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <h3 className="font-headline text-xl text-primary tracking-tight font-black">Budget Variance</h3>
          <span className="bg-tertiary-container/10 text-on-tertiary-container px-3 py-1 rounded-full text-xs font-semibold font-label">
            {stats ? `${stats.occupancy ?? 0}% Occupancy` : 'Loading…'}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface-container-lowest p-6 rounded-2xl ambient-depth flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant font-bold">Total Units</p>
                <h4 className="text-2xl font-black font-headline text-primary">
                  {loading ? '—' : (stats?.totalUnits ?? 0)}
                </h4>
              </div>
              <div className="w-10 h-10 rounded-full bg-tertiary-container/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-tertiary">apartment</span>
              </div>
            </div>
            <div className="h-2 bg-surface-container rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${stats ? Math.min((stats.totalUnits / 100) * 100, 100) : 0}%` }} />
            </div>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-2xl ambient-depth flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant font-bold">Open Tasks</p>
                <h4 className="text-2xl font-black font-headline text-primary">
                  {loading ? '—' : (stats?.openTasks ?? 0)}
                </h4>
              </div>
              <div className="w-10 h-10 rounded-full bg-secondary-container/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary">build_circle</span>
              </div>
            </div>
            <div className="h-2 bg-surface-container rounded-full overflow-hidden">
              <div className="h-full bg-secondary rounded-full" style={{ width: `${stats ? Math.min((stats.openTasks / 20) * 100, 100) : 0}%` }} />
            </div>
          </div>
        </div>
      </section>

      {/* Maintenance Snapshot */}
      <section className="space-y-6">
        <h3 className="font-headline text-xl text-primary tracking-tight font-black">Maintenance Snapshot</h3>
        {loading ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2].map((i) => (
              <div key={i} className="h-16 bg-surface-container-lowest rounded-xl" />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-2xl p-6 text-center text-on-surface-variant text-sm font-medium ambient-depth">
            No tasks yet — all clear!
          </div>
        ) : (
          <div className="bg-surface-container-low rounded-2xl p-2 space-y-2">
            {tasks.map((task) => {
              const sm = STATUS_META[task.status] ?? STATUS_META.pending
              const icon = TASK_ICONS[task.status] ?? 'info'
              const iconColor = TASK_ICON_COLORS[task.status] ?? 'text-on-surface-variant'
              return (
                <div
                  key={task.id}
                  className="bg-surface-container-lowest p-4 rounded-xl flex items-center justify-between hover:translate-x-1 transition-transform shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${sm.color}`}>
                      <span className={`material-symbols-outlined ${iconColor}`}>{icon}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{task.title}</p>
                      <p className="text-[10px] font-label text-on-surface-variant uppercase font-medium">
                        {new Date(task.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                      </p>
                    </div>
                  </div>
                  <span className={`${sm.color} ${sm.textColor} px-3 py-1 rounded-full text-[10px] font-bold font-label uppercase`}>
                    {sm.label}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-2 gap-4">
        <button
          onClick={() => navigate('/syndic/finance')}
          className="bg-surface-container-lowest p-6 rounded-2xl ambient-depth flex flex-col items-center justify-center gap-3 active:scale-95 transition-all group"
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
            <span className="material-symbols-outlined text-emerald-800 text-3xl">payments</span>
          </div>
          <span className="font-body text-xs font-bold text-emerald-950 uppercase tracking-tight">Issue Charge</span>
        </button>
        <button
          onClick={() => navigate('/syndic/tasks')}
          className="bg-surface-container-lowest p-6 rounded-2xl ambient-depth flex flex-col items-center justify-center gap-3 active:scale-95 transition-all group"
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
            <span className="material-symbols-outlined text-emerald-800 text-3xl">build_circle</span>
          </div>
          <span className="font-body text-xs font-bold text-emerald-950 uppercase tracking-tight">View Tasks</span>
        </button>
      </section>

      {/* Property Card */}
      <section className="pb-4">
        <div className="relative h-48 rounded-2xl overflow-hidden group shadow-lg bg-gradient-to-br from-[#064E3B] to-[#10B981]">
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 to-transparent" />
          <div className="absolute bottom-4 left-6 text-white">
            <p className="text-[10px] font-label uppercase tracking-widest text-emerald-300 font-bold">Active Property</p>
            <h4 className="font-headline text-xl font-black">
              {loading ? 'Loading…' : (building?.name ?? 'Residence Al-Andalus')}
            </h4>
          </div>
        </div>
      </section>
    </div>
  )
}
