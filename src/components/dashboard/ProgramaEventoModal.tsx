import { createPortal } from 'react-dom'
import { X, Loader2, MapPin, Clock, Users } from 'lucide-react'
import { useProgramaEvento } from '@/hooks/useProgramaEvento'
import type { Atividade } from '@/types/dashboard'

interface Props {
  atividade: Atividade
  onClose: () => void
}

/**
 * Agenda do acampamento/evento (dias, horários, locais) para o próprio
 * participante consultar — dado que já existia no backend (`evento_programa`,
 * usado na gestão) mas não chegava ao Portal. Renderizado via portal em
 * document.body: AtividadeCard vive dentro do carrossel da secção de
 * Actividades, que tem `overflow-hidden` em vários níveis, e isso recortaria
 * um modal `position: fixed` que ficasse dentro dessa árvore do DOM.
 */
export function ProgramaEventoModal({ atividade, onClose }: Props) {
  const { data, isLoading } = useProgramaEvento(atividade.id)

  const porDia = new Map<string, typeof data>()
  for (const item of data ?? []) {
    const lista = porDia.get(item.data) ?? []
    lista.push(item)
    porDia.set(item.data, lista)
  }
  const dias = Array.from(porDia.keys()).sort()

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 animate-fade-in" onClick={onClose}>
      <div
        className="relative flex max-h-[85vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-mist-100 bg-white px-6 py-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-accent-500">Programa</p>
            <h2 className="font-syne text-lg font-bold leading-tight text-slate-900">{atividade.titulo}</h2>
          </div>
          <button onClick={onClose} aria-label="Fechar" className="grid size-8 place-items-center rounded-full text-mist-400 transition hover:bg-mist-100 hover:text-slate-700">
            <X className="size-4" />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-4">
          {isLoading && (
            <div className="flex justify-center py-10"><Loader2 className="size-5 animate-spin text-mist-300" /></div>
          )}
          {!isLoading && dias.length === 0 && (
            <p className="py-10 text-center text-sm text-mist-400">O programa ainda não foi publicado.</p>
          )}
          {dias.map((dia) => (
            <div key={dia} className="mb-6 last:mb-0">
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-mist-500">
                {new Date(dia).toLocaleDateString('pt-PT', { weekday: 'long', day: '2-digit', month: 'long' })}
              </h3>
              <ul className="space-y-3 border-l-2 border-mist-100 pl-4">
                {porDia.get(dia)!.map((item) => (
                  <li key={item.id} className="relative">
                    <span className="absolute -left-[21px] top-1 size-2.5 rounded-full bg-accent-500" />
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-accent-600">
                      <Clock className="size-3.5" />
                      {item.hora_inicio.slice(0, 5)}{item.hora_fim ? ` – ${item.hora_fim.slice(0, 5)}` : ''}
                    </p>
                    <p className="font-medium text-slate-800">{item.titulo}</p>
                    <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-mist-500">
                      {item.local && (
                        <span className="flex items-center gap-1"><MapPin className="size-3" /> {item.local}</span>
                      )}
                      {item.ramo && <span>Ramo: {item.ramo}</span>}
                      {item.capacidade !== null && (
                        <span className="flex items-center gap-1"><Users className="size-3" /> Até {item.capacidade}</span>
                      )}
                    </div>
                    {item.materiais && <p className="mt-1 text-xs italic text-mist-400">Levar: {item.materiais}</p>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  )
}
