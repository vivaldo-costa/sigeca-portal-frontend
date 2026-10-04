import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'

const PASSOS = ['Resumo', 'Pagamento', 'Entrega', 'Confirmação']

export function CheckoutStepper({ passoActual }: { passoActual: number }) {
  return (
    <div className="mb-8 flex items-center gap-2 rounded-2xl border border-mist-100 bg-white px-6 py-4 shadow-sm">
      {PASSOS.map((label, i) => {
        const n = i + 1
        const estado = n < passoActual ? 'done' : n === passoActual ? 'active' : 'idle'
        return (
          <div key={label} className="flex flex-1 items-center gap-2">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'grid size-8 shrink-0 place-items-center rounded-full text-xs font-bold',
                  estado === 'active' && 'bg-brand-600 text-white',
                  estado === 'done' && 'bg-emerald-500 text-white',
                  estado === 'idle' && 'bg-mist-200 text-mist-400'
                )}
              >
                {estado === 'done' ? <Check className="size-3.5" /> : n}
              </div>
              <span className={cn('hidden text-xs font-semibold sm:block', estado === 'idle' ? 'text-mist-300' : 'text-slate-700')}>
                {label}
              </span>
            </div>
            {n < PASSOS.length && (
              <div className={cn('h-0.5 flex-1', estado === 'done' ? 'bg-emerald-500' : 'bg-mist-200')} />
            )}
          </div>
        )
      })}
    </div>
  )
}
