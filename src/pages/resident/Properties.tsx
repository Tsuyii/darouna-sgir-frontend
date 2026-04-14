import { useEffect, useState } from 'react'
import api from '../../lib/api'
import { MOCK, mockResidentApartment } from '../../lib/mockData'

interface ResidentApartment {
  id: string
  number: string
  floor: number
  area?: number
  rooms?: number
  status: string
  building?: {
    name: string
    address?: string
    city?: string
    gardien?: string
    totalUnits?: number
  }
}

const STAT_ITEMS = (apt: ResidentApartment) => [
  { icon: 'layers',        label: 'Floor',      value: apt.floor != null ? `Floor ${apt.floor}` : '—' },
  { icon: 'straighten',   label: 'Area',       value: apt.area ? `${apt.area} m²` : '—' },
  { icon: 'bedroom_parent', label: 'Rooms',    value: apt.rooms ? `${apt.rooms} rooms` : '—' },
  { icon: 'tag',           label: 'Unit',       value: apt.number },
]

export default function ResidentProperties() {
  const [apt, setApt] = useState<ResidentApartment | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (MOCK) {
      setApt(mockResidentApartment as ResidentApartment)
      setLoading(false)
      return
    }
    async function load() {
      try {
        // Get the current user to find their apartment
        const meRes = await api.get('/api/v1/auth/me')
        const user = meRes.data.data
        if (user?.apartment) {
          const aptRes = await api.get(`/api/v1/apartments/${user.apartment}`)
          setApt(aptRes.data.data)
        }
      } catch {
        // silently fail — user may not have an apartment assigned
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="px-6 pt-8 flex items-center justify-center min-h-[40vh]">
        <span className="material-symbols-outlined animate-spin text-primary text-3xl">progress_activity</span>
      </div>
    )
  }

  if (!apt) {
    return (
      <div className="px-6 space-y-4">
        <div className="space-y-1">
          <h2 className="font-headline text-2xl font-black text-primary tracking-tight">My Property</h2>
          <p className="text-on-surface-variant text-sm font-medium">Your apartment details</p>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl p-8 ambient-depth flex flex-col items-center gap-3 text-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">domain_disabled</span>
          <p className="text-on-surface-variant text-sm">No apartment assigned to your account yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-6 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="font-headline text-2xl font-black text-primary tracking-tight">My Property</h2>
        <p className="text-on-surface-variant text-sm font-medium">Your apartment details and building info</p>
      </div>

      {/* Hero card */}
      <div className="relative bg-gradient-to-br from-[#064E3B] to-[#10B981] rounded-2xl p-6 text-white shadow-xl overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                domain
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-widest font-bold bg-white/20 px-3 py-1 rounded-full">
              {apt.status === 'occupied' ? 'Occupied' : apt.status}
            </span>
          </div>
          <p className="text-white/70 text-xs uppercase tracking-widest font-semibold mb-1">
            {apt.building?.name ?? 'Your Building'}
          </p>
          <h3 className="font-headline text-3xl font-black mb-1">Apartment {apt.number}</h3>
          {apt.building?.address && (
            <p className="text-white/60 text-sm">
              {apt.building.address}{apt.building.city ? `, ${apt.building.city}` : ''}
            </p>
          )}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {STAT_ITEMS(apt).map((s) => (
          <div key={s.label} className="bg-surface-container-lowest rounded-2xl p-4 ambient-depth">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-primary text-[18px]">{s.icon}</span>
            </div>
            <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wider mb-0.5">{s.label}</p>
            <p className="font-headline font-black text-on-surface text-base">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Building info */}
      {apt.building && (
        <div className="bg-surface-container-lowest rounded-2xl p-5 ambient-depth space-y-4">
          <h3 className="font-headline font-black text-on-surface text-base">Building Info</h3>

          {[
            apt.building.name     && { icon: 'apartment',    label: 'Building',    value: apt.building.name },
            apt.building.city     && { icon: 'location_on',  label: 'City',        value: apt.building.city },
            apt.building.totalUnits && { icon: 'meeting_room', label: 'Total Units', value: `${apt.building.totalUnits} apartments` },
            apt.building.gardien  && { icon: 'badge',         label: 'Caretaker',   value: apt.building.gardien },
          ].filter(Boolean).map((row: any) => (
            <div key={row.label} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-surface-container-low flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary text-[18px]">{row.icon}</span>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-semibold">{row.label}</p>
                <p className="text-sm font-semibold text-on-surface truncate">{row.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Emergency contact */}
      <div className="bg-error-container/10 rounded-2xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-error-container/30 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-error text-xl">emergency</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-on-error-container">Emergency?</p>
          <p className="text-xs text-on-surface-variant">Contact your caretaker or file a complaint via Support.</p>
        </div>
      </div>
    </div>
  )
}
