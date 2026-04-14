import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import api from '../../lib/api'
import { MOCK, mockNotifications } from '../../lib/mockData'

interface Notification {
  id: string
  title: string
  message: string
  type: string
  read: boolean
  createdAt: string
}

const NOTIF_ICON: Record<string, string> = {
  payment:      'payments',
  announcement: 'campaign',
  complaint:    'support_agent',
  vote:         'how_to_vote',
  charge:       'receipt_long',
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function TopAppBar() {
  const { user, role, logout } = useAuthStore()
  const navigate = useNavigate()
  const initials = user?.name?.slice(0, 2).toUpperCase() ?? 'U'

  const [showNotifs, setShowNotifs] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unread, setUnread] = useState(0)
  const panelRef = useRef<HTMLDivElement>(null)

  // Load notifications on mount
  useEffect(() => {
    if (MOCK) {
      setNotifications(mockNotifications as Notification[])
      setUnread(mockNotifications.filter((n) => !n.read).length)
      return
    }
    api.get('/api/v1/notifications')
      .then((res) => {
        const list: Notification[] = res.data.data ?? []
        setNotifications(list)
        setUnread(list.filter((n) => !n.read).length)
      })
      .catch(() => {})
  }, [])

  // Close panel on outside click
  useEffect(() => {
    if (!showNotifs) return
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setShowNotifs(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showNotifs])

  function handleAvatarClick() {
    if (role) navigate(`/${role}`, { replace: false })
  }

  async function handleLogout() {
    await logout()
    navigate('/', { replace: true })
  }

  async function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnread(0)
    if (!MOCK) {
      api.put('/api/v1/notifications/mark-all-read').catch(() => {})
    }
  }

  async function markRead(id: string) {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n))
    setUnread((prev) => Math.max(0, prev - 1))
    if (!MOCK) {
      api.put(`/api/v1/notifications/${id}/read`).catch(() => {})
    }
  }

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-[#FAF9F6]/80 backdrop-blur-xl flex justify-between items-center px-6 h-20 shadow-[0_20px_40px_rgba(43,105,84,0.06)]">
        <div className="flex items-center gap-3">
          <button
            onClick={handleAvatarClick}
            className="w-11 h-11 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-headline font-black text-sm select-none active:scale-90 transition-transform"
            title="Go to dashboard"
          >
            {initials}
          </button>
          <div className="flex flex-col">
            <span className="font-headline font-black text-[#064E3B] tracking-tight text-lg leading-tight">
              {user?.name ?? 'Welcome'}
            </span>
            <span className="font-body text-[10px] text-[#064E3B]/70 font-semibold uppercase tracking-wider">
              Darouna S.G.I.R.
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNotifs((v) => !v)}
            className="relative p-2 bg-surface-container rounded-full text-[#064E3B] hover:opacity-80 transition-opacity active:scale-90 transition-transform"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined">notifications</span>
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-error text-white text-[10px] font-bold flex items-center justify-center">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </button>
          <button
            onClick={handleLogout}
            className="p-2 bg-surface-container rounded-full text-[#064E3B] hover:opacity-80 transition-opacity active:scale-90 transition-transform"
            aria-label="Sign out"
            title="Sign out"
          >
            <span className="material-symbols-outlined">logout</span>
          </button>
        </div>
      </header>

      {/* Notifications panel — slide down from top bar */}
      {showNotifs && (
        <div
          ref={panelRef}
          className="fixed top-20 right-4 z-40 w-[min(360px,calc(100vw-2rem))] bg-surface-container-lowest rounded-2xl shadow-2xl ambient-depth overflow-hidden"
        >
          {/* Panel header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-surface-container">
            <div className="flex items-center gap-2">
              <h3 className="font-headline font-black text-on-surface text-base">Notifications</h3>
              {unread > 0 && (
                <span className="text-[10px] font-bold bg-error text-white px-2 py-0.5 rounded-full">{unread} new</span>
              )}
            </div>
            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="text-[11px] font-semibold text-primary hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notification list */}
          <div className="max-h-[60vh] overflow-y-auto divide-y divide-surface-container">
            {notifications.length === 0 ? (
              <div className="px-5 py-8 text-center text-on-surface-variant text-sm">
                No notifications yet.
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={`w-full text-left px-5 py-4 flex items-start gap-3 transition-colors ${
                    n.read ? 'bg-surface-container-lowest' : 'bg-primary/5'
                  } hover:bg-surface-container-low`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    n.read ? 'bg-surface-container-low' : 'bg-primary/10'
                  }`}>
                    <span className={`material-symbols-outlined text-[18px] ${n.read ? 'text-on-surface-variant' : 'text-primary'}`}>
                      {NOTIF_ICON[n.type] ?? 'notifications'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className={`text-sm font-semibold truncate ${n.read ? 'text-on-surface' : 'text-primary'}`}>
                        {n.title}
                      </p>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-on-surface-variant line-clamp-2">{n.message}</p>
                    <p className="text-[10px] text-on-surface-variant/60 mt-1 font-semibold">{timeAgo(n.createdAt)}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </>
  )
}
