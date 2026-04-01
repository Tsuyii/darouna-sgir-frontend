export default function GardienFinance() {
  return (
    <div className="px-6 space-y-8">
      <div className="space-y-1">
        <h2 className="font-headline text-2xl font-black text-primary tracking-tight">Finance</h2>
        <p className="text-on-surface-variant text-sm font-medium">Your compensation and work summary</p>
      </div>

      <div className="relative bg-gradient-to-br from-[#064E3B] to-[#10B981] rounded-2xl p-8 text-white shadow-xl overflow-hidden">
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              account_balance_wallet
            </span>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold opacity-80 mb-1">Coming in Phase 2</p>
            <h3 className="font-headline text-xl font-black">Finance Overview</h3>
            <p className="text-white/70 text-sm mt-2">
              View your compensation history and monthly work summary.
            </p>
          </div>
        </div>
      </div>

      {[
        { icon: 'payments',        label: 'Compensation',    desc: 'Monthly salary and bonuses' },
        { icon: 'history',         label: 'Work History',    desc: 'Completed tasks and hours logged' },
        { icon: 'summarize',       label: 'Monthly Report',  desc: 'Summary of your activity' },
      ].map((f) => (
        <div key={f.label} className="bg-surface-container-lowest rounded-2xl p-5 ambient-depth flex items-center gap-4 opacity-60">
          <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary">{f.icon}</span>
          </div>
          <div>
            <p className="font-semibold text-sm text-on-surface">{f.label}</p>
            <p className="text-xs text-on-surface-variant mt-0.5">{f.desc}</p>
          </div>
          <span className="ml-auto shrink-0 text-[9px] uppercase tracking-widest font-bold text-on-surface-variant/50 bg-surface-container px-2 py-1 rounded-full">
            Phase 2
          </span>
        </div>
      ))}
    </div>
  )
}
