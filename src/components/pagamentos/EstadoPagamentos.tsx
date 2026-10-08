import { Link } from 'react-router-dom'
import { Clock, CircleCheck, CircleX, Upload } from 'lucide-react'
import type { EstadoPagamentoInscricao, PagamentoInscricao } from '@/types/dashboard'

export const ESTADO_PAGAMENTO: Record<EstadoPagamentoInscricao, { rotulo: string; cls: string; icon: typeof Clock }> = {
  pendente: { rotulo: 'Pendente de validação', cls: 'bg-warning-bg text-warning-text', icon: Clock },
  confirmado: { rotulo: 'Validado', cls: 'bg-success-bg text-success-text', icon: CircleCheck },
  rejeitado: { rotulo: 'Rejeitado', cls: 'bg-error-bg text-error-text', icon: CircleX },
}

function referencia(p: PagamentoInscricao) {
  return p.tipo_pagamento === 'prestacao' && p.numero_prestacao ? `Prestação ${p.numero_prestacao}` : 'Pagamento completo'
}

function mesmaParcela(a: PagamentoInscricao, b: PagamentoInscricao) {
  if (a.tipo_pagamento !== b.tipo_pagamento) return false
  return a.tipo_pagamento === 'completo' || Number(a.numero_prestacao) === Number(b.numero_prestacao)
}

/**
 * Comprovativos rejeitados que ainda não foram substituídos por um novo
 * envio (pendente ou validado) da mesma prestação / do pagamento completo —
 * são estes que pedem ao membro para enviar um novo comprovativo.
 */
export function rejeitadosPorReenviar(pagamentos: PagamentoInscricao[] = []) {
  const ordenados = [...pagamentos].sort((a, b) => new Date(b.data_submissao).getTime() - new Date(a.data_submissao).getTime() || b.id - a.id)
  return ordenados.filter((p, i) => {
    if (p.estado !== 'rejeitado') return false
    const posteriores = ordenados.slice(0, i)
    const substituido = posteriores.some((q) => q.estado !== 'rejeitado' && mesmaParcela(p, q))
    // Uma validação do pagamento completo cobre qualquer prestação rejeitada.
    const cobertoPorCompleto = ordenados.some((q) => q.estado === 'confirmado' && q.tipo_pagamento === 'completo')
    const repetido = posteriores.some((q) => q.estado === 'rejeitado' && mesmaParcela(p, q))
    return !substituido && !cobertoPorCompleto && !repetido
  })
}

const dataCurta = (d: string | null) => (d ? new Date(d).toLocaleDateString('pt-PT') : '—')

interface ListaProps {
  pagamentos: PagamentoInscricao[]
  /** Link para enviar novo comprovativo quando há um rejeitado por substituir (ex.: no Perfil). */
  linkReenvio?: string
}

/** Lista dos comprovativos do próprio membro: estado, datas e, se rejeitado, o motivo. */
export function ListaPagamentos({ pagamentos, linkReenvio }: ListaProps) {
  if (!pagamentos.length) return null
  const porReenviar = rejeitadosPorReenviar(pagamentos)

  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-mist-400">Os teus comprovativos</p>
      <ul className="space-y-1.5">
        {pagamentos.map((p) => {
          const meta = ESTADO_PAGAMENTO[p.estado] ?? ESTADO_PAGAMENTO.pendente
          const Icone = meta.icon
          return (
            <li key={p.id} className="rounded-lg border border-mist-200 bg-mist-50 px-3 py-2 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium text-slate-700">
                  {referencia(p)} <span className="font-normal text-mist-400">· enviado a {dataCurta(p.data_submissao)}</span>
                </span>
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${meta.cls}`}>
                  <Icone className="size-3" /> {meta.rotulo}
                  {p.estado !== 'pendente' && p.data_decisao && <span className="font-normal opacity-80">· {dataCurta(p.data_decisao)}</span>}
                </span>
              </div>
              {p.estado === 'rejeitado' && p.motivo_rejeicao && (
                <p className="mt-1 text-error-text"><span className="font-semibold">Motivo:</span> {p.motivo_rejeicao}</p>
              )}
            </li>
          )
        })}
      </ul>
      {porReenviar.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-error-bd bg-error-bg px-3 py-2 text-xs text-error-text">
          <span>Corrige o indicado no motivo e envia um novo comprovativo.</span>
          {linkReenvio && (
            <Link to={linkReenvio} className="inline-flex items-center gap-1 rounded-full bg-error-text px-3 py-1 font-semibold text-white transition hover:opacity-90">
              <Upload className="size-3" /> Enviar novo comprovativo
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
