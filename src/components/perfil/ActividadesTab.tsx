import { Tent, MapPin, CalendarCheck, Image as ImageIcon } from 'lucide-react'
import { uploadUrl } from '@/lib/uploads'
import type { InscricaoEvento } from '@/types/perfil'

const ESTADO_META: Record<string, { cls: string; icon: string }> = {
  pendente: { cls: 'bg-yellow-100 text-yellow-800', icon: '⏱' },
  confirmada: { cls: 'bg-blue-100 text-blue-800', icon: '✓' },
  pago: { cls: 'bg-green-100 text-green-800', icon: '💰' },
  cancelada: { cls: 'bg-red-100 text-red-800', icon: '⛔' },
}

export function ActividadesTab({ atividades }: { atividades: InscricaoEvento[] }) {
  if (atividades.length === 0) {
    return (
      <EmptyState
        icon={Tent}
        titulo="Nenhuma actividade encontrada"
        texto="Quando te inscreveres num evento, ele aparecerá aqui."
      />
    )
  }

  return (
    <div className="px-6 py-8">
      <Contador icon={Tent} n={atividades.length} label="actividade" labelPlural="actividades" />

      <ul className="space-y-4">
        {atividades.map((e, i) => {
          const chave = (e.estado ?? '').toLowerCase()
          const meta = ESTADO_META[chave] ?? { cls: 'bg-slate-100 text-slate-600', icon: '?' }
          return (
            <li key={i} className="overflow-hidden rounded-2xl border border-mist-200 transition-shadow hover:shadow-md">
              <div className="grid grid-cols-1 lg:grid-cols-3">
                <div className="relative flex h-48 items-center justify-center overflow-hidden bg-mist-100 lg:h-auto lg:min-h-[180px]">
                  {e.imagem ? (
                    <img src={uploadUrl('eventos', e.imagem)!} className="size-full object-cover" alt={e.titulo} />
                  ) : (
                    <ImageIcon className="size-10 text-mist-300" />
                  )}
                  <div className="absolute left-3 top-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/80 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                      📅 {new Date(e.data_evento).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col justify-between gap-3 p-5 lg:col-span-2">
                  <div className="space-y-2">
                    <h2 className="text-base font-bold leading-snug text-slate-900">{e.titulo}</h2>
                    {e.descricao && <p className="line-clamp-2 text-sm leading-relaxed text-mist-400">{e.descricao}</p>}
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-mist-100 pt-2">
                    <div className="flex flex-wrap items-center gap-3 text-xs text-mist-400">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="size-3 text-brand-600" /> {e.local ?? 'Local não informado'}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <CalendarCheck className="size-3 text-mist-300" /> Inscrito em {new Date(e.inscrito_em).toLocaleDateString('pt-PT')}
                      </span>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${meta.cls}`}>
                      {meta.icon} {chave ? chave[0].toUpperCase() + chave.slice(1) : '—'}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function Contador({ icon: Icon, n, label, labelPlural }: { icon: typeof Tent; n: number; label: string; labelPlural: string }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <div className="grid size-7 shrink-0 place-items-center rounded-lg bg-brand-600/8">
        <Icon className="size-3.5 text-brand-600" />
      </div>
      <h3 className="text-xs font-semibold uppercase tracking-widest text-mist-400">
        {n} {n === 1 ? label : labelPlural} {n === 1 ? 'encontrada' : 'encontradas'}
      </h3>
      <div className="h-px flex-1 bg-mist-200" />
    </div>
  )
}

export function EmptyState({ icon: Icon, titulo, texto }: { icon: typeof Tent; titulo: string; texto: string }) {
  return (
    <div className="px-6 py-20 text-center">
      <div className="mx-auto mb-4 grid size-16 place-items-center rounded-2xl bg-mist-100">
        <Icon className="size-7 text-mist-300" />
      </div>
      <h3 className="text-base font-semibold text-slate-700">{titulo}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-mist-400">{texto}</p>
    </div>
  )
}
