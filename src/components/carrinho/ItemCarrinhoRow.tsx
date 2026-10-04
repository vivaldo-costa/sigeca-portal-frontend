import { Minus, Plus, Trash2, TriangleAlert } from 'lucide-react'
import { useAtualizarQuantidade, useRemoverItem } from '@/hooks/useCarrinho'
import { uploadUrl } from '@/lib/uploads'
import type { ItemCarrinho } from '@/types/carrinho'

const fmtKz = (v: number) => v.toLocaleString('pt-PT', { maximumFractionDigits: 0 })

export function ItemCarrinhoRow({ item }: { item: ItemCarrinho }) {
  const atualizar = useAtualizarQuantidade()
  const remover = useRemoverItem()

  const semStock = item.stock_variacao === 0
  const excessivo = item.quantidade > item.stock_variacao

  function alterar(delta: number) {
    const nova = Math.min(item.stock_variacao, Math.max(1, item.quantidade + delta))
    if (nova !== item.quantidade) atualizar.mutate({ id: item.id, quantidade: nova })
  }

  return (
    <div className="flex gap-4 rounded-2xl border border-mist-100 bg-white p-4 shadow-sm">
      <div className="size-20 shrink-0 overflow-hidden rounded-xl border border-mist-100 bg-mist-50">
        <img
          src={uploadUrl('produtos', item.imagem) ?? '/placeholder.png'}
          className="size-full object-cover"
          alt={item.nome}
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-slate-800">{item.nome}</p>
        <div className="mt-1 flex flex-wrap gap-2">
          {item.tamanho && (
            <span className="rounded-full bg-brand-600/8 px-2 py-0.5 text-xs font-semibold text-brand-600">{item.tamanho}</span>
          )}
          {item.cor && <span className="rounded-full bg-mist-100 px-2 py-0.5 text-xs font-semibold text-mist-600">{item.cor}</span>}
        </div>

        {excessivo ? (
          <p className="mt-1 flex items-center gap-1 text-xs text-error-text">
            <TriangleAlert className="size-3" /> Apenas {item.stock_variacao} disponíveis em stock
          </p>
        ) : semStock ? (
          <p className="mt-1 flex items-center gap-1 text-xs text-error-text">
            <TriangleAlert className="size-3" /> Produto esgotado
          </p>
        ) : null}

        <p className="mt-1 text-xs text-mist-300">{fmtKz(item.preco_unitario)} Kz × unid.</p>
      </div>

      <div className="flex shrink-0 flex-col items-end justify-between gap-2">
        <div className="flex items-center gap-1 rounded-xl border border-mist-200 bg-mist-50 p-1">
          <button
            onClick={() => alterar(-1)}
            disabled={item.quantidade <= 1 || atualizar.isPending}
            className="grid size-7 place-items-center rounded-lg border border-mist-200 bg-white text-slate-700 transition hover:bg-brand-600 hover:text-white disabled:opacity-30"
          >
            <Minus className="size-3" />
          </button>
          <span className="w-8 text-center text-sm font-bold">{item.quantidade}</span>
          <button
            onClick={() => alterar(1)}
            disabled={item.quantidade >= item.stock_variacao || atualizar.isPending}
            className="grid size-7 place-items-center rounded-lg border border-mist-200 bg-white text-slate-700 transition hover:bg-brand-600 hover:text-white disabled:opacity-30"
          >
            <Plus className="size-3" />
          </button>
        </div>

        <p className="text-base font-bold text-slate-800">{fmtKz(item.subtotal)} Kz</p>

        <button
          onClick={() => remover.mutate(item.id)}
          disabled={remover.isPending}
          className="flex items-center gap-1 text-xs text-red-400 transition hover:text-red-600 disabled:opacity-50"
        >
          <Trash2 className="size-3" /> Remover
        </button>
      </div>
    </div>
  )
}
