import { useState } from 'react'
import { CalendarDays, Loader2, Images } from 'lucide-react'
import type { Atividade } from '@/types/dashboard'
import { uploadUrl } from '@/lib/uploads'
import logoEstatico from '@/assets/sigeca-logo.svg'
import { ProgramaEventoModal } from './ProgramaEventoModal'
import { GaleriaEventoModal } from './GaleriaEventoModal'
import { useEntrarListaEspera, useMinhaPosicaoEspera, useSairListaEspera } from '@/hooks/useListaEspera'

interface Props {
  atividade: Atividade
  onInscrever: (a: Atividade) => void
  onPagar: (a: Atividade) => void
}

export function AtividadeCard({ atividade: a, onInscrever, onPagar }: Props) {
  const [programaAberto, setProgramaAberto] = useState(false)
  const [galeriaAberta, setGaleriaAberta] = useState(false)
  const isEvento = a.tipo === 'evento'
  const tagCor = isEvento ? 'bg-accent-500' : 'bg-emerald-500'
  const tagLabel = isEvento ? 'Actividade' : 'Formação'
  const imagemUrl = uploadUrl(isEvento ? 'eventos' : 'formacoes', a.imagem) ?? logoEstatico
  const vagasRestantes = a.vagas > 0 ? Math.max(a.vagas - a.num_inscritos, 0) : null

  return (
    <div
      className="group relative h-[400px] w-[300px] shrink-0 overflow-hidden rounded-2xl shadow-md"
    >
      <img
        src={imagemUrl}
        className="absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-110"
        alt={a.titulo}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      <div className="absolute inset-x-4 top-4 flex items-start justify-between">
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold text-white ${tagCor}`}>{tagLabel}</span>
        {a.inscrito && (
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-black">Inscrito</span>
        )}
      </div>

      <div className="absolute bottom-0 w-full p-5">
        <p className="mb-1 text-xs text-white/60">📅 {new Date(a.data_inicio).toLocaleDateString('pt-PT')}</p>
        <h3 className="mb-1 font-syne text-base font-bold leading-tight text-white">{a.titulo}</h3>
        {a.dioceses && <p className="my-2 text-sm text-white/80 line-clamp-2">{a.dioceses}</p>}
        {vagasRestantes !== null && (
          <p className="mb-3 text-xs text-white/60">
            {vagasRestantes} vaga{vagasRestantes === 1 ? '' : 's'} restante{vagasRestantes === 1 ? '' : 's'}
            {isEvento ? '' : ` · ${a.tipo_acesso === 'Grátis' ? 'Gratuito' : `${a.valor.toLocaleString('pt-PT', { minimumFractionDigits: 2 })} Kz`}`}
          </p>
        )}

        <div className="flex gap-2">
          <div className="flex-1">
            <EstadoBotao atividade={a} onInscrever={onInscrever} onPagar={onPagar} />
          </div>
          {isEvento && (
            <button
              onClick={() => setProgramaAberto(true)}
              aria-label="Ver programa"
              title="Ver programa"
              className="grid size-9 shrink-0 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25"
            >
              <CalendarDays className="size-4" />
            </button>
          )}
          {a.galeria_total > 0 && (
            <button
              onClick={() => setGaleriaAberta(true)}
              aria-label="Ver galeria de fotos"
              title="Ver galeria de fotos"
              className="relative grid size-9 shrink-0 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25"
            >
              <Images className="size-4" />
            </button>
          )}
        </div>
      </div>

      {programaAberto && <ProgramaEventoModal atividade={a} onClose={() => setProgramaAberto(false)} />}
      {galeriaAberta && <GaleriaEventoModal atividade={a} onClose={() => setGaleriaAberta(false)} />}
    </div>
  )
}

function EstadoBotao({ atividade: a, onInscrever, onPagar }: Props) {
  const base = 'w-full rounded-full py-2 text-xs font-bold transition'
  const isEvento = a.tipo === 'evento'
  const hoverCor = isEvento ? 'hover:bg-accent-500' : 'hover:bg-emerald-500'
  const esgotado = a.vagas > 0 && a.num_inscritos >= a.vagas

  switch (a.estado) {
    case null:
      if (esgotado) return <ListaEsperaBotao atividade={a} />
      return (
        <button onClick={() => onInscrever(a)} className={`${base} bg-white text-black ${hoverCor} hover:text-white`}>
          Inscrever-se
        </button>
      )
    case 'pendente':
      return <button disabled className={`${base} bg-yellow-500 text-white`}>Aguardar aprovação</button>
    case 'confirmada':
      return (
        <button onClick={() => onPagar(a)} className={`${base} bg-blue-600 text-white hover:bg-blue-700`}>
          Efectuar pagamento
        </button>
      )
    case 'pago':
      return <button disabled className={`${base} bg-green-600 text-white`}>Inscrição activa</button>
    case 'cancelada':
    case 'cancelado':
      return <button disabled className={`${base} bg-red-500 text-white`}>Cancelada</button>
    default:
      return <button disabled className={`${base} bg-slate-400 text-white`}>Estado indefinido</button>
  }
}

/** Actividade esgotada (vagas preenchidas) — permite entrar/sair da lista de espera e mostra a posição na fila. */
function ListaEsperaBotao({ atividade: a }: { atividade: Atividade }) {
  const base = 'w-full rounded-full py-2 text-xs font-bold transition'
  const { data: posicao, isLoading } = useMinhaPosicaoEspera(a.id, true)
  const entrar = useEntrarListaEspera(a.id)
  const sair = useSairListaEspera(a.id)

  if (isLoading) {
    return (
      <button disabled className={`${base} flex items-center justify-center gap-1.5 bg-slate-500 text-white`}>
        <Loader2 className="size-3 animate-spin" />
      </button>
    )
  }

  if (posicao?.inscrito) {
    return (
      <button
        onClick={() => sair.mutate()}
        disabled={sair.isPending}
        className={`${base} bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-60`}
      >
        Em espera (posição {posicao.posicao}) · Sair
      </button>
    )
  }

  return (
    <button
      onClick={() => entrar.mutate()}
      disabled={entrar.isPending}
      className={`${base} bg-slate-700 text-white hover:bg-slate-800 disabled:opacity-60`}
    >
      Esgotado · Entrar na lista de espera
    </button>
  )
}
