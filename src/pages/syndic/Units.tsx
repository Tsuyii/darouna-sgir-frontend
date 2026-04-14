import { useEffect, useState } from 'react'
import api from '../../lib/api'
import { MOCK, mockBuildings, mockApartments } from '../../lib/mockData'

interface Building {
  id: string
  name: string
  address?: string
  city?: string
  totalUnits?: number
  occupancy?: number
  revenue?: number
  openTasks?: number
}

interface Apartment {
  id: string
  number: string
  floor?: number
  status: 'occupied' | 'vacant' | 'maintenance'
  buildingId: string
  resident?: { name: string } | null
}

const APT_STATUS: Record<string, { label: string; bg: string; text: string }> = {
  occupied:    { label: 'Occupied',    bg: 'bg-tertiary-container/20', text: 'text-on-tertiary-container' },
  vacant:      { label: 'Vacant',      bg: 'bg-surface-container',     text: 'text-on-surface-variant' },
  maintenance: { label: 'Maintenance', bg: 'bg-error-container/20',    text: 'text-on-error-container' },
}

export default function SyndicUnits() {
  const [buildings, setBuildings] = useState<Building[]>([])
  const [apartments, setApartments] = useState<Apartment[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (MOCK) {
      setBuildings(mockBuildings)
      setApartments(mockApartments)
      setLoading(false)
      return
    }
    async function load() {
      try {
        const [bRes, aRes] = await Promise.all([
          api.get('/api/v1/buildings'),
          api.get('/api/v1/apartments'),
        ])
        const bList: Building[] = bRes.data.data ?? []
        // Fetch stats for each building
        const withStats = await Promise.all(
          bList.map(async (b) => {
            try {
              const s = await api.get(`/api/v1/buildings/${b.id}/stats`)
              return { ...b, ...s.data.data }
            } catch {
              return b
            }
          })
        )
        setBuildings(withStats)
        setApartments(aRes.data.data ?? [])
      } catch {
        // graceful degradation
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = buildings.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    (b.city ?? '').toLowerCase().includes(search.toLowerCase())
  )

  const totalUnits = buildings.reduce((s, b) => s + (b.totalUnits ?? 0), 0)
  const avgOccupancy = buildings.length
    ? Math.round(buildings.reduce((s, b) => s + (b.occupancy ?? 0), 0) / buildings.length)
    : 0

  return (
    <div className="px-6 pb-8 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="font-headline text-2xl font-black text-primary tracking-tight">Property Portfolio</h2>
        <p className="text-on-surface-variant text-sm font-medium">Buildings and apartments under management</p>
      </div>

      {/* Stats row */}
      {loading ? (
        <div className="grid grid-cols-3 gap-3 animate-pulse">
          {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-surface-container-lowest rounded-xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-surface-container-lowest rounded-xl p-4 ambient-depth border-l-4 border-primary">
            <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">Total Units</p>
            <p className="font-headline text-2xl font-black text-primary mt-1">{totalUnits}</p>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-4 ambient-depth border-l-4 border-tertiary-container">
            <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">Avg Occ.</p>
            <p className="font-headline text-2xl font-black text-primary mt-1">{avgOccupancy}%</p>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-4 ambient-depth border-l-4 border-outline-variant">
            <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">Buildings</p>
            <p className="font-headline text-2xl font-black text-primary mt-1">{buildings.length}</p>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-xl">search</span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search buildings or cities…"
          className="w-full pl-12 pr-4 py-3 bg-surface-container-low rounded-xl text-sm font-medium text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary-fixed-dim"
        />
      </div>

      {/* Building list */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2].map((i) => <div key={i} className="h-32 bg-surface-container-lowest rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl p-8 text-center text-on-surface-variant text-sm font-medium ambient-depth">
          No buildings found.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((building) => {
            const isExpanded = expandedId === building.id
            const bApts = apartments.filter((a) => a.buildingId === building.id)
            const occ = building.occupancy ?? 0
            const occColor = occ >= 90 ? 'text-tertiary' : occ >= 70 ? 'text-secondary' : 'text-error'

            return (
              <div key={building.id} className="bg-surface-container-lowest rounded-xl ambient-depth overflow-hidden">
                {/* Building card */}
                <div className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#064E3B] to-[#10B981] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>domain</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-headline font-bold text-on-surface text-base truncate">{building.name}</h3>
                    {building.address && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="material-symbols-outlined text-outline" style={{ fontSize: 13 }}>location_on</span>
                        <p className="text-xs text-on-surface-variant font-medium truncate">{building.address}{building.city ? `, ${building.city}` : ''}</p>
                      </div>
                    )}
                    <div className="flex items-center gap-4 mt-2">
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-tighter text-outline">Occupancy</span>
                        <p className={`text-sm font-bold ${occColor}`}>{occ}%</p>
                      </div>
                      <div className="w-px h-6 bg-surface-variant" />
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-tighter text-outline">Units</span>
                        <p className="text-sm font-bold text-secondary">{building.totalUnits ?? bApts.length}</p>
                      </div>
                      {(building.openTasks ?? 0) > 0 && (
                        <>
                          <div className="w-px h-6 bg-surface-variant" />
                          <div>
                            <span className="text-[9px] font-bold uppercase tracking-tighter text-outline">Tasks</span>
                            <p className="text-sm font-bold text-error">{building.openTasks}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : building.id)}
                    className="shrink-0 flex flex-col items-center gap-1 bg-gradient-to-br from-[#064E3B] to-[#10B981] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-emerald-900/20 active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined text-sm">{isExpanded ? 'expand_less' : 'expand_more'}</span>
                    Manage
                  </button>
                </div>

                {/* Apartments panel */}
                {isExpanded && (
                  <div className="border-t border-surface-container-high bg-surface-container-low px-4 py-4 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-3">
                      Apartments ({bApts.length})
                    </p>
                    {bApts.length === 0 ? (
                      <p className="text-sm text-on-surface-variant text-center py-4">No apartments found.</p>
                    ) : (
                      bApts.map((apt) => {
                        const sm = APT_STATUS[apt.status] ?? APT_STATUS.vacant
                        return (
                          <div key={apt.id} className="bg-surface-container-lowest rounded-xl px-4 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-surface-container-low flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary text-sm">apartment</span>
                              </div>
                              <div>
                                <p className="font-bold text-sm text-on-surface">Apt {apt.number}</p>
                                {apt.floor != null && (
                                  <p className="text-[10px] text-on-surface-variant">Floor {apt.floor}</p>
                                )}
                                {apt.resident && (
                                  <p className="text-[10px] text-on-surface-variant">{apt.resident.name}</p>
                                )}
                              </div>
                            </div>
                            <span className={`${sm.bg} ${sm.text} text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full`}>
                              {sm.label}
                            </span>
                          </div>
                        )
                      })
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
