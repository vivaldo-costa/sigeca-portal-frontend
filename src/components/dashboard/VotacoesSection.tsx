import type { Votacao } from '@/types/dashboard'
import { uploadUrl } from '@/lib/uploads'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

export function VotacoesSection({ votacoes }: { votacoes: Votacao[] }) {
  if (votacoes.length === 0) return null

  return (
    <section id="votacoes" className="bg-portal-bg py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-accent-500">Democracia Escutista</span>
          <h2 className="mt-1 font-syne text-3xl font-black text-slate-900">Votações</h2>
          <p className="mt-1 text-sm text-mist-400">Participa nas decisões da associação.</p>
        </div>

        <div className="space-y-5">
          {votacoes.map((v, i) => {
            const encerrada = !v.ativo || new Date(v.data_fim) < new Date()
            return (
              <ScrollReveal key={v.id} atraso={Math.min(i, 6) * 70}>
                <div className="rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md">
                <div className="flex flex-col gap-4 sm:flex-row">
                  {v.imagem && (
                    <div className="h-24 w-full shrink-0 overflow-hidden rounded-xl bg-mist-100 sm:w-32">
                      <img src={uploadUrl('votacoes', v.imagem)!} className="size-full object-cover" alt="" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <h3 className="font-syne font-bold text-slate-900">{v.titulo}</h3>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          encerrada ? 'bg-mist-100 text-mist-600' : 'bg-success-bg text-success-text'
                        }`}
                      >
                        {encerrada ? 'Encerrada' : 'Aberta'}
                      </span>
                    </div>
                    {v.descricao && <p className="mt-1 line-clamp-2 text-sm text-mist-400">{v.descricao}</p>}
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex gap-4 text-xs text-mist-300">
                        <span>📅 {new Date(v.data_inicio).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                        <span>⏳ {new Date(v.data_fim).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                        <span>🗳 {v.totalVotos} votos</span>
                      </div>
                      <div className="flex -space-x-2">
                        {v.votantes.map((u, i) => (
                          <div key={i} title={u.nome} className="size-7 overflow-hidden rounded-full border-2 border-white bg-mist-200">
                            {u.foto ? (
                              <img src={uploadUrl('avatar', u.foto)!} className="size-full object-cover" alt="" />
                            ) : (
                              <div className="grid size-full place-items-center text-[10px] font-bold text-mist-600">
                                {u.nome[0]?.toUpperCase()}
                              </div>
                            )}
                          </div>
                        ))}
                        {v.totalVotos > v.votantes.length && (
                          <div className="grid size-7 place-items-center rounded-full border-2 border-white bg-mist-100 text-[10px] font-bold text-mist-400">
                            +{v.totalVotos - v.votantes.length}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
