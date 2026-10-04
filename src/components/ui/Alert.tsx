import { type ReactNode, useState } from 'react'
import { CircleAlert, CircleCheck, TriangleAlert, X } from 'lucide-react'
import { cn } from '@/lib/cn'

interface AlertProps {
  variant: 'error' | 'success' | 'warning'
  title?: string
  children: ReactNode
  dismissible?: boolean
}

const config = {
  error: {
    icon: CircleAlert,
    classes: 'bg-error-bg border-error-bd text-error-text',
    defaultTitle: 'Erro',
  },
  success: {
    icon: CircleCheck,
    classes: 'bg-success-bg border-success-bd text-success-text',
    defaultTitle: 'Sucesso',
  },
  warning: {
    icon: TriangleAlert,
    classes: 'bg-warning-bg border-warning-bd text-warning-text',
    defaultTitle: 'Atenção',
  },
}

export function Alert({ variant, title, children, dismissible = true }: AlertProps) {
  const [visible, setVisible] = useState(true)
  if (!visible) return null
  const { icon: Icon, classes, defaultTitle } = config[variant]

  return (
    <div className={cn('mb-5 flex items-start gap-2.5 rounded-[var(--radius-sig-sm)] border px-4 py-3 text-sm animate-in fade-in slide-in-from-top-1', classes)}>
      <Icon className="mt-0.5 size-4 shrink-0" />
      <div className="flex-1 leading-relaxed">
        <strong>{title ?? defaultTitle}:</strong> {children}
      </div>
      {dismissible && (
        <button onClick={() => setVisible(false)} aria-label="Fechar" className="opacity-50 transition-opacity hover:opacity-100">
          <X className="size-4" />
        </button>
      )}
    </div>
  )
}
