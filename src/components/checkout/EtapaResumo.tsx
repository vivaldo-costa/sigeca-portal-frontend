import { TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { uploadUrl } from '@/lib/uploads'
import type { ItemCarrinho } from '@/types/carrinho'

const fmtKz = (v: number) => v.toLocaleString('pt-PT', { maximumFractionDigits: 0 })

export function EtapaResumo({ itens, onContinuar }: { itens: ItemCarrinho[]; onContinuar: () => void }) {
  const temExcesso = itens.some((i) => i.quantidade > i.stock_variacao)

  return (
    <div className="overflow-hidden rounded-2xl border border-mist-100 bg-white shadow-sm">
      <CabecalhoEtapa numero={1} titulo="Resumo da Compra" />
      <div className="space-y-3 p-5">
        {itens.map((item) => (
          <div key={item.id} className="flex items-start gap-3 rounded-xl border border-mist-100 bg-mist-50 p-3">
            <div className="size-14 shrink-0 overflow-hidden rounded-xl border border-mist-100 bg-white">
              <img
                src={uploadUrl('produtos', item.imagem) ?? '/placeholder.png'}
                className="size-full object-cover"
                alt={item.nome}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">{item.nome}</p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {item.tamanho && (
                  <span className="rounded-full bg-brand-600/8 px-2 py-0.5 text-xs font-semibold text-brand-600">{item.tamanho}</span>
                )}
                {item.cor && <span className="rounded-full bg-mist-200 px-2 py-0.5 text-xs font-semibold text-mist-600">{item.cor}</span>}
                <span className="rounded-full bg-mist-100 px-2 py-0.5 text-xs text-mist-500">Qtd: {item.quantidade}</span>
              </div>
              {item.quantidade > item.stock_variacao && (
                <p className="mt-1 flex items-center gap-1 text-xs text-error-text">
                  <TriangleAlert className="size-3" /> Stock insuficiente ({item.stock_variacao} disponíveis)
                </p>
              )}
            </div>
            <div className="shrink-0 text-right">
              <p className="text-sm font-bold text-slate-800">{fmtKz(item.subtotal)} Kz</p>
              <p className="text-xs text-mist-300">{fmtKz(item.preco_unitario)} Kz/un</p>
            </div>
          </div>
        ))}
      </div>
      <div className="px-5 pb-5">
        <Button onClick={onContinuar} disabled={temExcesso} className="w-full">
          Continuar para Pagamento
        </Button>
        {temExcesso && (
          <p className="mt-2 text-center text-xs text-error-text">
            Ajusta as quantidades no carrinho antes de continuar.
          </p>
        )}
      </div>
    </div>
  )
}

export function CabecalhoEtapa({ numero, titulo }: { numero: number; titulo: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-mist-100 px-6 py-4">
      <div className="grid size-8 shrink-0 place-items-center rounded-xl bg-brand-600 text-sm font-bold text-white">{numero}</div>
      <h2 className="font-bold text-slate-800">{titulo}</h2>
    </div>
  )
}
