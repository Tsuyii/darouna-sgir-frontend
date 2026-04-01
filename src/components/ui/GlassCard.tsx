import { cn } from '../../lib/cn'

export default function GlassCard({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('glass-card rounded-xl p-6', className)}>
      {children}
    </div>
  )
}
