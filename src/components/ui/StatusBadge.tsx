import { cn } from '../../lib/cn'

type Status = 'pending' | 'in-progress' | 'submitted' | 'approved' | 'rejected' | 'info' | 'event' | 'urgent'

const STATUS_STYLES: Record<Status, string> = {
  pending:     'bg-surface-container-high text-on-surface-variant',
  'in-progress': 'bg-primary-container/20 text-on-primary-container',
  submitted:   'bg-tertiary-container/20 text-on-tertiary-container',
  approved:    'bg-primary-fixed/30 text-on-primary-fixed-variant',
  rejected:    'bg-error-container/30 text-on-error-container',
  info:        'bg-secondary-container/20 text-secondary',
  event:       'bg-tertiary-container/10 text-tertiary',
  urgent:      'bg-error-container/10 text-error',
}

export default function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={cn('px-3 py-1 rounded-full text-[10px] font-bold font-label uppercase', STATUS_STYLES[status])}>
      {status.replace('-', ' ')}
    </span>
  )
}
