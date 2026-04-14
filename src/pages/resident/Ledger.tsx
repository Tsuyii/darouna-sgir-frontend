import { useEffect, useState } from 'react'
import api from '../../lib/api'
import { MOCK, mockResidentCharges, mockPaymentHistory } from '../../lib/mockData'

interface Charge {
  id: string
  title: string
  type?: string
  amount: number
  status: 'pending' | 'paid' | 'overdue'
  dueDate: string
}

interface Payment {
  id: string
  amount: number
  method: string
  status: string
  createdAt: string
  charge?: { title: string }
}

const CHARGE_STATUS: Record<string, { label: string; bg: string; text: string }> = {
  paid:    { label: 'Paid',    bg: 'bg-tertiary-container/10', text: 'text-tertiary' },
  pending: { label: 'Pending', bg: 'bg-surface-container-highest', text: 'text-on-surface-variant' },
  overdue: { label: 'Overdue', bg: 'bg-error-container/20',    text: 'text-error' },
}

const METHOD_ICON: Record<string, string> = {
  bank_transfer: 'account_balance',
  cash:          'payments',
  card:          'credit_card',
}

const PAYMENT_STATUS: Record<string, { label: string; bg: string; text: string }> = {
  completed: { label: 'Paid',    bg: 'bg-tertiary-container/10', text: 'text-tertiary' },
  pending:   { label: 'Pending', bg: 'bg-surface-container-highest', text: 'text-on-surface-variant' },
  failed:    { label: 'Failed',  bg: 'bg-error-container/20',    text: 'text-error' },
}

const TABS = ['Charges', 'Payments'] as const
type Tab = typeof TABS[number]

export default function ResidentLedger() {
  const [charges, setCharges] = useState<Charge[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>('Charges')

  useEffect(() => {
    if (MOCK) {
      setCharges(mockResidentCharges)
      setPayments(mockPaymentHistory)
      setLoading(false)
      return
    }
    async function load() {
      try {
        const [cRes, pRes] = await Promise.all([
          api.get('/api/v1/charges'),
          api.get('/api/v1/payments/resident/history'),
        ])
        setCharges(cRes.data.data ?? [])
        setPayments(pRes.data.data ?? [])
      } catch {
        // graceful degradation
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const outstanding = charges
    .filter((c) => c.status !== 'paid')
    .reduce((s, c) => s + c.amount, 0)

  const nextDue = charges
    .filter((c) => c.status === 'pending' || c.status === 'overdue')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0]

  return (
    <div className="px-6 pb-8 space-y-8">
      {/* Hero */}
      <div className="grid grid-cols-1 gap-4">
        <div className="relative bg-gradient-to-br from-[#064E3B] to-[#10B981] rounded-xl p-6 text-white shadow-xl overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-24 -mt-24" />
          <p className="font-label text-[10px] uppercase tracking-widest opacity-80 mb-1">Total Outstanding Balance</p>
          {loading ? (
            <div className="animate-pulse h-12 w-2/3 bg-white/20 rounded-xl mt-2" />
          ) : (
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-headline text-4xl font-black tracking-tight">{outstanding.toLocaleString()}</span>
              <span className="font-headline text-lg font-bold opacity-90">MAD</span>
            </div>
          )}
          {nextDue && (
            <p className="text-[10px] opacity-70 mt-2">
              Next due: {new Date(nextDue.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          )}
          <div className="flex gap-3 mt-5">
            <button className="bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-lg active:scale-95 transition-all">
              Statement
            </button>
            <button className="bg-surface-container-lowest text-primary text-xs font-bold px-5 py-2.5 rounded-lg shadow-xl active:scale-95 transition-all">
              Pay Now
            </button>
          </div>
        </div>

        {/* Account status card */}
        <div className="bg-surface-container-lowest rounded-xl p-5 ambient-depth flex justify-between items-center">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-outline">Account Status</p>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-tertiary-container/10 text-tertiary mt-2">
              <span className="material-symbols-outlined" style={{ fontSize: 13 }}>check_circle</span>
              Active
            </span>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-outline">Charges</p>
            <p className="text-xl font-headline font-bold text-on-surface mt-1">{charges.length}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-outline">Payments</p>
            <p className="text-xl font-headline font-bold text-on-surface mt-1">{payments.length}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              tab === t
                ? 'bg-gradient-to-br from-[#064E3B] to-[#10B981] text-white shadow-lg shadow-emerald-900/20'
                : 'bg-surface-container text-on-surface-variant'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-surface-container-lowest rounded-xl" />)}
        </div>
      ) : tab === 'Charges' ? (
        <div className="space-y-3">
          {charges.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-2xl p-8 text-center text-on-surface-variant text-sm font-medium ambient-depth">
              No charges yet.
            </div>
          ) : charges.map((c) => {
            const sm = CHARGE_STATUS[c.status] ?? CHARGE_STATUS.pending
            return (
              <div key={c.id} className="bg-surface-container-lowest rounded-xl p-4 flex items-center justify-between ambient-depth group hover:bg-surface-container-low transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-white transition-colors">
                    <span className="material-symbols-outlined">home</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-on-surface">{c.title}</p>
                    <p className="text-[10px] text-outline font-medium">
                      Due: {new Date(c.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <p className="font-bold text-sm text-on-surface">{c.amount.toLocaleString()} MAD</p>
                  <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${sm.bg} ${sm.text}`}>
                    {sm.label}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {payments.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-2xl p-8 text-center text-on-surface-variant text-sm font-medium ambient-depth">
              No payments yet.
            </div>
          ) : payments.map((p) => {
            const sm = PAYMENT_STATUS[p.status] ?? PAYMENT_STATUS.pending
            const icon = METHOD_ICON[p.method] ?? 'payments'
            return (
              <div key={p.id} className="bg-surface-container-lowest rounded-xl p-4 flex items-center justify-between ambient-depth group hover:bg-surface-container-low transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-surface-container-low flex items-center justify-center text-primary group-hover:bg-white transition-colors">
                    <span className="material-symbols-outlined">{icon}</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-on-surface">{p.charge?.title ?? 'Payment'}</p>
                    <p className="text-[10px] text-outline font-medium capitalize">
                      {p.method.replace('_', ' ')} • {new Date(p.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <p className="font-bold text-sm text-on-surface">{p.amount.toLocaleString()} MAD</p>
                  <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${sm.bg} ${sm.text}`}>
                    {sm.label}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
