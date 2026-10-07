import { GraduationCap, MapPin, CalendarPlus, Users, CircleCheck, CircleX, Presentation } from 'lucide-react'
import { uploadUrl } from '@/lib/uploads'
import type { InscricaoFormacao } from '@/types/perfil'
import { Contador, EmptyState } from './ActividadesTab'

export function FormacoesTab({ formacoes }: { formacoes: InscricaoFormacao[] }) {
  if (formacoes.length === 0) {
    return (
      <EmptyState
        icon={GraduationCap}
        titulo="Nenhuma formação encontrada"
        texto="Ainda não estás inscrito em nenhuma formação."
      />
    )
  }

  return (
    <div className="px-6 py-8">
      <Contador icon={GraduationCap} n={formacoes.length} label="formação inscrito" labelPlural="formações inscrito" />

      <ul className="space-y-4">
        {formacoes.map((f, i) => (
          <li key={i} className="overflow-hidden rounded-2xl border border-mist-200 transition-shadow hover:shadow-md">
            <div className="grid grid-cols-1 lg:grid-cols-3">
              <div className="relative flex h-48 items-center justify-center overflow-hidden bg-mist-100 lg:h-auto lg:min-h-[200px]">
                {f.imagem ? (
                  <img src={uploadUrl('formacoes', f.imagem)!} className="size-full object-cover" alt={f.titulo} />
                ) : (
                  <Presentation className="size-10 text-mist-300" />
                )}
                <div className="absolute left-3 top-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/80 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                    📅 {new Date(f.data_inicio).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' })}
                    {f.data_fim && <> <span className="opacity-60">→</span> {new Date(f.data_fim).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' })}</>}
                  </span>
                </div>
              </div>

              <div className="flex flex-col justify-between gap-3 p-5 lg:col-span-2">
                <div className="space-y-2">
                  <h2 className="text-base font-bold leading-snug text-slate-900">{f.titulo}</h2>
                  {f.descricao && <p className="line-clamp-2 text-sm leading-relaxed text-mist-400">{f.descricao}</p>}
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                    <Users className="size-3" /> {f.vagas_ocupadas} / {f.vagas_totais} vagas
                  </span>
                  {f.vagas_disponiveis > 0 ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                      <CircleCheck className="size-3" /> {f.vagas_disponiveis} disponíveis
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                      <CircleX className="size-3" /> Esgotado
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-mist-100 pt-2">
                  <span className="flex items-center gap-1.5 text-xs text-mist-400">
                    <MapPin className="size-3 text-brand-600" /> {f.local ?? 'Local não indicado'}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-mist-100 px-2.5 py-1 text-xs font-semibold text-mist-600">
                    <CalendarPlus className="size-3" /> Inscrito em {new Date(f.inscrito_em).toLocaleDateString('pt-PT')}
                  </span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
