import { type InputHTMLAttributes, forwardRef, useState, type ReactNode } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  icon?: ReactNode
  error?: string
}

/**
 * Campo de formulário no estilo do login actual: fundo mist-50, ícone à
 * esquerda, focus com anel subtil. Suporta toggle de visibilidade quando
 * type="password".
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, error, type, className, id, ...props }, ref) => {
    const [show, setShow] = useState(false)
    const isPassword = type === 'password'
    const inputType = isPassword ? (show ? 'text' : 'password') : type

    return (
      <div className="mb-4">
        {label && (
          <label htmlFor={id} className="mb-1.5 block text-[13px] font-medium tracking-wide text-mist-600">
            {label}
          </label>
        )}
        <div className="group relative">
          {icon && (
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-mist-400 transition-colors group-focus-within:text-ink">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            type={inputType}
            className={cn(
              'h-12 w-full rounded-[var(--radius-sig-md)] border-[1.5px] border-mist-200 bg-mist-50',
              'px-3.5 text-[15px] text-ink outline-none placeholder:text-mist-300',
              'transition-colors duration-200 hover:border-mist-400 hover:bg-paper',
              'focus:border-ink focus:bg-paper focus:shadow-[0_0_0_3px_rgba(10,10,10,0.07)]',
              icon && 'pl-10',
              isPassword && 'pr-11',
              error && 'border-error-bd bg-error-bg',
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? 'Ocultar palavra-passe' : 'Mostrar palavra-passe'}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-mist-400 transition-colors hover:text-ink"
            >
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          )}
        </div>
        {error && <p className="mt-1.5 text-[13px] text-error-text">{error}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'
