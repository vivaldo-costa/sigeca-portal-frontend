import { Lock, FileText } from 'lucide-react'
import { uploadUrl } from '@/lib/uploads'
import type { ItemCarrinho, ZonaEntrega } from '@/types/carrinho'

const fmtKz = (v: number) => v.toLocaleString('pt-PT', { maximumFractionDigits: 0 })

interface Props {
  itens: ItemCarrinho[]
  subtotal: number
  custoEntrega: number
  zonaSelecionada: ZonaEntrega | null
}

export function ResumoCheckout({ itens, subtotal, custoEntrega, zonaSelecionada }: Props) {
  return (
    <div className="sticky top-6 rounded-2xl border border-mist-100 bg-white p-5 shadow-sm">
      <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-800">Resumo</h3>

      <div className="mb-4 space-y-2">
        {itens.map((item) => (
          <div key={item.id} className="flex items-center gap-2.5">
            <div className="size-10 shrink-0 overflow-hidden rounded-lg border border-mist-100 bg-mist-50">
              <img
                src={uploadUrl('produtos', item.imagem) ?? '/placeholder.png'}
                className="size-full object-cover"
                alt={item.nome}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-slate-700">{item.nome}</p>
              <p className="text-[10px] text-mist-400">
                {item.quantidade}× {item.tamanho && `· ${item.tamanho}`} {item.cor && `· ${item.cor}`}
              </p>
            </div>
            <p className="whitespace-nowrap text-xs font-bold text-slate-700">{fmtKz(item.subtotal)} Kz</p>
          </div>
        ))}
      </div>

      <div className="space-y-2 border-t border-mist-100 pt-3">
        <div className="flex justify-between text-sm text-mist-400">
          <span>Subtotal</span>
          <span>{fmtKz(subtotal)} Kz</span>
        </div>
        <div className="flex justify-between text-sm text-mist-400">
          <span>Entrega</span>
          {custoEntrega > 0 ? (
            <span className="font-medium text-slate-600">{fmtKz(custoEntrega)} Kz</span>
          ) : (
            <span className="font-medium text-emerald-600">Gratuita</span>
          )}
        </div>
        {zonaSelecionada && (
          <div className="flex justify-between text-xs italic text-mist-300">
            <span>{zonaSelecionada.nome}</span>
          </div>
        )}
        <div className="flex justify-between border-t border-mist-100 pt-2 text-base font-black text-slate-900">
          <span>Total</span>
          <span className="text-brand-600">{fmtKz(subtotal + custoEntrega)} Kz</span>
        </div>
      </div>

      <div className="mt-4 space-y-1.5 border-t border-mist-100 pt-4">
        <div className="flex items-center gap-2 text-xs text-mist-300">
          <Lock className="size-3" /> Compra segura e protegida
        </div>
        <div className="flex items-center gap-2 text-xs text-mist-300">
          <FileText className="size-3" /> Recibo PDF gerado automaticamente
        </div>
      </div>
    </div>
  )
}
