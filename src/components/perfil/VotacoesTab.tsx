import { useState, type FormEvent } from 'react'
import { Vote, CircleCheck, Lock, Circle, ListChecks, History, Loader2 } from 'lucide-react'
import type { VotacaoPerfil } from '@/types/perfil'
import { useVotar } from '@/hooks/usePerfil'
import { uploadUrl } from '@/lib/uploads'
import { Contador, EmptyState } from './ActividadesTab'

export function VotacoesTab({ votacoes }: { votacoes: VotacaoPerfil[] }) {
  if (votacoes.length === 0) {
    return <EmptyState icon={Vote} titulo="Sem votações disponíveis" texto="" />
  }

  return (
    <div className="px-6 py-8">
      <Contador icon={Vote} n={votacoes.length} label="votação" labelPlural="votações" />
      <div className="space-y-6">
        {votacoes.map((v) => (
          <VotacaoCard key={v.id} votacao={v} />
        ))}
      </div>
    </div>
  )
}

function VotacaoCard({ votacao: v }: { votacao: VotacaoPerfil }) {
  const jaVotou = !!v.meu_voto
  const encerrada = new Date(v.data_fim) < new Date() || !v.ativo
  const aberta = !jaVotou && !encerrada

  return (
    <div className={`overflow-hidden rounded-2xl border border-mist-200 ${aberta ? 'ring-2 ring-brand-600/15' : ''}`}>
      <div className={`flex items-start justify-between gap-4 border-b border-mist-100 px-6 py-4 ${aberta ? 'bg-brand-600/5' : 'bg-mist-50'}`}>
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className={`mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl ${aberta ? 'bg-brand-600' : 'bg-mist-200'}`}>
            <Vote className={`size-4 ${aberta ? 'text-white' : 'text-mist-500'}`} />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold leading-snug text-slate-900">{v.titulo}</h3>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-mist-400">
              {new Date(v.data_inicio).toLocaleDateString('pt-PT')}
              <span className="text-mist-300">→</span>
              {new Date(v.data_fim).toLocaleDateString('pt-PT')}
            </p>
          </div>
        </div>

        {jaVotou ? (
          <Badge cls="bg-green-100 text-green-800" icon={CircleCheck} label="Votou" />
        ) : encerrada ? (
          <Badge cls="bg-mist-200 text-mist-600" icon={Lock} label="Encerrada" />
        ) : (
          <Badge cls="animate-pulse bg-amber-100 text-amber-800" icon={Circle} label="Em curso" />
        )}
      </div>

      <div className="space-y-4 px-6 py-5">
        {v.imagem && <img src={uploadUrl('votacoes', v.imagem)!} alt="" className="max-h-44 w-full rounded-xl object-cover" />}
        {v.descricao && <p className="text-sm leading-relaxed text-slate-600">{v.descricao}</p>}

        {aberta && <FormularioVoto votacao={v} />}
        {!aberta && jaVotou && (
          <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
            <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-green-100">
              <CircleCheck className="size-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-green-600">O seu voto</p>
              <p className="mt-0.5 text-sm font-semibold text-green-900">{v.opcao_votada ?? '—'}</p>
            </div>
          </div>
        )}
        {!aberta && !jaVotou && (
          <div className="flex items-center gap-2 text-sm italic text-mist-400">
            <History className="size-3.5" /> A votação encerrou sem registo do seu voto.
          </div>
        )}
      </div>
    </div>
  )
}

function Badge({ cls, icon: Icon, label }: { cls: string; icon: typeof Circle; label: string }) {
  return (
    <span className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${cls}`}>
      <Icon className="size-2.5" /> {label}
    </span>
  )
}

function FormularioVoto({ votacao }: { votacao: VotacaoPerfil }) {
  const [escolha, setEscolha] = useState<number | null>(null)
  const votar = useVotar()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!escolha) return
    votar.mutate({ votacaoId: votacao.id, opcaoId: escolha })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-mist-400">
        <ListChecks className="size-3.5" /> Escolha uma opção
      </p>
      {votacao.opcoes.map((o) => (
        <label
          key={o.id}
          className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${
            escolha === o.id ? 'border-brand-600 bg-brand-600/8' : 'border-mist-200 hover:border-brand-600 hover:bg-brand-600/5'
          }`}
        >
          <input
            type="radio"
            name={`opcao-${votacao.id}`}
            value={o.id}
            checked={escolha === o.id}
            onChange={() => setEscolha(o.id)}
            required
            className="size-4 shrink-0 accent-brand-600"
          />
          <span className="flex-1 text-sm font-medium text-slate-800">{o.opcao}</span>
        </label>
      ))}
      {votar.isError && <p className="text-xs text-error-text">Não foi possível registar o teu voto. Tenta novamente.</p>}
      <button
        type="submit"
        disabled={!escolha || votar.isPending}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
      >
        {votar.isPending ? <Loader2 className="size-4 animate-spin" /> : <Vote className="size-4" />}
        Confirmar Voto
      </button>
    </form>
  )
}
