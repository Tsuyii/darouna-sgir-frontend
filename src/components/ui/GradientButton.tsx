import { cn } from '../../lib/cn'

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
}

export default function GradientButton({ children, className, ...props }: GradientButtonProps) {
  return (
    <button
      className={cn(
        'gloss-button text-white font-body font-bold rounded-xl py-4 px-6 flex items-center justify-center gap-3 hover:brightness-110 transition-all duration-300 active:scale-95',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
