import { useMemo, useRef, useState } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/cn'
import { AtividadeCard } from './AtividadeCard'
import type { Atividade } from '@/types/dashboard'

type Filtro = 'todos' | 'evento' | 'formacao'

interface Props {
  atividades: Atividade[]
  onInscrever: (a: Atividade) => void
  onPagar: (a: Atividade) => void
}

export function AtividadesSection({ atividades, onInscrever, onPagar }: Props) {
  const [filtro, setFiltro] = useState<Filtro>('todos')
  const [busca, setBusca] = useState('')
  const carrosselRef = useRef<HTMLDivElement>(null)

  const filtradas = useMemo(
    () =>
      atividades.filter(
        (a) => (filtro === 'todos' || a.tipo === filtro) && a.titulo.toLowerCase().includes(busca.toLowerCase().trim())
      ),
    [atividades, filtro, busca]
  )

  function scroll(dir: 1 | -1) {
    const el = carrosselRef.current
    if (!el) return
    const card = el.querySelector('div')
    const largura = card ? card.clientWidth + 24 : 324
    el.scrollBy({ left: dir * largura, behavior: 'smooth' })
  }

  return (
    <section id="atividades" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-accent-500">Participa</span>
            <h2 className="mt-1 font-syne text-3xl font-black text-slate-900">Actividades & Formações</h2>
            <p className="text-sm text-mist-400">Inscreve-te nas próximas actividades e formações.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex gap-1 rounded-full bg-mist-100 p-1">
              {(['todos', 'evento', 'formacao'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFiltro(f)}
                  className={cn(
                    'rounded-full px-4 py-1.5 text-xs font-semibold transition',
                    filtro === f ? 'bg-brand-600 text-white' : 'text-mist-600 transition-colors hover:bg-mist-200'
                  )}
                >
                  {f === 'todos' ? 'Todos' : f === 'evento' ? 'Actividades' : 'Formações'}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-mist-400" />
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Pesquisar..."
                className="w-44 rounded-full border border-mist-200 bg-mist-50 py-2 pl-8 pr-4 text-xs focus:border-accent-500 focus:outline-none"
              />
            </div>
            <button onClick={() => scroll(-1)} aria-label="Anterior" className="grid size-9 place-items-center rounded-lg border border-mist-200 text-mist-600 transition hover:bg-mist-100">←</button>
            <button onClick={() => scroll(1)} aria-label="Seguinte" className="grid size-9 place-items-center rounded-lg border border-mist-200 text-mist-600 transition hover:bg-mist-100">→</button>
          </div>
        </div>

        {filtradas.length === 0 ? (
          <p className="py-10 text-center text-sm text-mist-400">Nenhuma actividade ou formação encontrada.</p>
        ) : (
          <div className="overflow-hidden">
            <div ref={carrosselRef} className="no-scrollbar flex gap-6 overflow-x-auto scroll-smooth pb-2">
              {filtradas.map((a, i) => (
                <div key={`${a.tipo}-${a.id}`} className="shrink-0 animate-slide-up" style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}>
                  <AtividadeCard atividade={a} onInscrever={onInscrever} onPagar={onPagar} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
