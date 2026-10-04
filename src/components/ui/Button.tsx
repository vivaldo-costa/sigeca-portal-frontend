import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const variants = {
  primary:
    'bg-ink text-paper hover:bg-brand-600 focus-visible:ring-ink/30',
  secondary:
    'bg-paper text-ink border border-mist-200 hover:border-mist-400 focus-visible:ring-ink/15',
  ghost:
    'bg-transparent text-mist-600 transition-colors hover:bg-mist-100 hover:text-ink focus-visible:ring-ink/15',
  danger:
    'bg-error-text text-paper hover:opacity-90 focus-visible:ring-error-text/30',
}

const sizes = {
  sm: 'h-9 px-3 text-[13px] rounded-[var(--radius-sig-sm)]',
  md: 'h-12 px-5 text-[15px] rounded-[var(--radius-sig-md)]',
  lg: 'h-14 px-6 text-[16px] rounded-[var(--radius-sig-md)]',
}

/**
 * Botão base do design system SIGECA. Mantém a mesma sensação do
 * botão .btn-primary do ecrã de login actual (preto sólido, cantos
 * arredondados, feedback claro), agora reutilizável em toda a app.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, disabled, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium font-display',
          'transition-all duration-200 outline-none focus-visible:ring-4',
          'disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="size-4 animate-spin" />}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
