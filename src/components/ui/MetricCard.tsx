import { cn } from '../../lib/cn'

interface MetricCardProps {
  icon: string
  label: string
  value: string
  iconBg?: string
  iconColor?: string
  className?: string
}

export default function MetricCard({ icon, label, value, iconBg = 'bg-primary-fixed/30', iconColor = 'text-primary', className }: MetricCardProps) {
  return (
    <div className={cn('bg-surface-container-lowest p-5 rounded-xl ambient-depth space-y-3', className)}>
      <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', iconBg, iconColor)}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div>
        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{label}</p>
        <p className="font-headline text-xl font-extrabold">{value}</p>
      </div>
    </div>
  )
}
