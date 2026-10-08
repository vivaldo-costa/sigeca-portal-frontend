import { useState } from 'react'
import { ShoppingBag, Receipt, Clock, ChevronDown, FileDown, Loader2, Ban, Coins } from 'lucide-react'
import type { Pedido, StatusPedido } from '@/types/perfil'
import { useGerarRecibo } from '@/hooks/usePerfil'
import { getApiErrorMessage } from '@/lib/api'
import { notificar } from '@/lib/notificar'
import { baixarFicheiroProtegido } from '@/lib/download'
import { uploadUrl } from '@/lib/uploads'
import { Contador, EmptyState } from './ActividadesTab'

const STATUS_META: Record<StatusPedido, { cls: string; label: string }> = {
  pendente: { cls: 'bg-yellow-100 text-yellow-800', label: 'Pendente' },
  aguardando_pagamento: { cls: 'bg-orange-100 text-orange-800', label: 'Pagamento em validação' },
  pago: { cls: 'bg-green-100 text-green-800', label: 'Pago' },
  enviado: { cls: 'bg-blue-100 text-blue-800', label: 'Enviado' },
  entregue: { cls: 'bg-teal-100 text-teal-800', label: 'Entregue' },
  cancelado: { cls: 'bg-red-100 text-red-800', label: 'Cancelado' },
}

const fmtKz = (v: number) => v.toLocaleString('pt-PT', { maximumFractionDigits: 0 })

export function ComprasTab({ pedidos }: { pedidos: Pedido[] }) {
  if (pedidos.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        titulo="Nenhuma compra realizada"
        texto="Os teus pedidos aparecerão aqui após a compra."
      />
    )
  }

  return (
    <div className="px-6 py-8">
      <Contador icon={ShoppingBag} n={pedidos.length} label="pedido" labelPlural="pedidos" />
      <div className="space-y-4">
        {pedidos.map((p) => (
          <PedidoCard key={p.id} pedido={p} />
        ))}
      </div>
    </div>
  )
}

function PedidoCard({ pedido }: { pedido: Pedido }) {
  const [aberto, setAberto] = useState(false)
  const meta = STATUS_META[pedido.status] ?? { cls: 'bg-slate-100 text-slate-600', label: pedido.status }
  const cancelado = pedido.status === 'cancelado'

  return (
    <div className="overflow-hidden rounded-xl border border-mist-200 transition-shadow hover:shadow-sm">
      <button
        onClick={() => setAberto((a) => !a)}
        className="flex w-full flex-wrap items-center justify-between gap-3 bg-mist-50 px-5 py-4 text-left transition hover:bg-mist-100/80"
        aria-expanded={aberto}
      >
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-600/8">
            <Receipt className="size-4 text-brand-600" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900">Pedido #{pedido.id}</p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-mist-300">
              <Clock className="size-2.5" />
              {new Date(pedido.pedido_em).toLocaleString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${meta.cls}`}>{meta.label}</span>
          <span className="hidden text-xs text-mist-300 sm:inline">
            {pedido.itens.length} {pedido.itens.length === 1 ? 'item' : 'itens'} &middot;{' '}
            <strong className="text-mist-600">{fmtKz(pedido.total)} Kz</strong>
          </span>
        </div>
        <div className="ml-3 flex shrink-0 items-center gap-2">
          {!cancelado && <RecibButton pedidoId={pedido.id} pdfExistente={pedido.pdf_recibo} compacto />}
          <ChevronDown className={`size-4 text-mist-400 transition-transform duration-300 ${aberto ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {aberto && (
        <div>
          <div className="divide-y divide-mist-100">
            {pedido.itens.map((item, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3.5">
                <div className="size-12 shrink-0 overflow-hidden rounded-xl border border-mist-200 bg-mist-100">
                  {item.imagem && <img src={uploadUrl('produtos', item.imagem)!} className="size-full object-cover" alt={item.nome} />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">{item.nome}</p>
                  <p className="mt-0.5 text-xs text-mist-300">
                    {item.quantidade} unid. <span className="mx-1 text-mist-200">·</span> {fmtKz(item.preco_unitario)} Kz cada
                  </p>
                </div>
                <span className="shrink-0 text-sm font-semibold text-slate-800">{fmtKz(item.subtotal)} Kz</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-mist-100 bg-mist-50 px-5 py-4">
            <span className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Coins className="size-3.5 text-amber-500" /> Total: {fmtKz(pedido.total)} Kz
            </span>
            {cancelado ? (
              <span className="flex items-center gap-1.5 text-xs italic text-mist-400">
                <Ban className="size-3.5 text-red-300" /> Pedido cancelado — recibo indisponível
              </span>
            ) : (
              <RecibButton pedidoId={pedido.id} pdfExistente={pedido.pdf_recibo} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function RecibButton({ pedidoId, pdfExistente, compacto }: { pedidoId: number; pdfExistente: string | null; compacto?: boolean }) {
  const gerar = useGerarRecibo()
  // O recibo é privado (já não é servido em /uploads): descarrega-se pela
  // API com o token, em GET /pedidos/:id/recibo (só o próprio ou o ADMIN).
  const [pronto, setPronto] = useState(!!pdfExistente)
  const [aDescarregar, setADescarregar] = useState(false)

  async function handleClick(e: React.MouseEvent) {
    e.stopPropagation()
    if (pronto) return
    try {
      await gerar.mutateAsync(pedidoId)
      setPronto(true)
    } catch (err) {
      notificar.erro(getApiErrorMessage(err, 'Não foi possível gerar o recibo.'))
    }
  }

  async function descarregar(e: React.MouseEvent) {
    e.stopPropagation()
    if (aDescarregar) return
    setADescarregar(true)
    try {
      await baixarFicheiroProtegido(`/pedidos/${pedidoId}/recibo`, `recibo-pedido-${pedidoId}.pdf`)
    } catch (err) {
      notificar.erro(getApiErrorMessage(err, 'Não foi possível transferir o recibo.'))
    } finally {
      setADescarregar(false)
    }
  }

  if (pronto) {
    return (
      <button
        type="button"
        onClick={descarregar}
        disabled={aDescarregar}
        className={
          compacto
            ? 'inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100'
            : 'inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700'
        }
      >
        {aDescarregar ? <Loader2 className="size-3.5 animate-spin" /> : <FileDown className="size-3.5" />} {compacto ? 'Recibo' : 'Transferir Recibo'}
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      disabled={gerar.isPending}
      className={
        compacto
          ? 'inline-flex items-center gap-1.5 rounded-lg border border-mist-200 bg-white px-3 py-1.5 text-xs font-semibold text-mist-600 transition hover:border-brand-600 hover:bg-brand-600/5 hover:text-brand-600 disabled:opacity-70'
          : 'inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-70'
      }
    >
      {gerar.isPending ? <Loader2 className="size-3.5 animate-spin" /> : <FileDown className="size-3.5" />}
      {compacto ? 'Recibo' : 'Gerar Recibo'}
    </button>
  )
}
