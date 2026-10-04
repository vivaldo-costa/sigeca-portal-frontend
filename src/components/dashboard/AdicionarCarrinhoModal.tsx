import { useMemo, useState } from 'react'
import { X, Minus, Plus, ShoppingCart, Loader2, CircleCheck } from 'lucide-react'
import { useAdicionarAoCarrinho } from '@/hooks/useCarrinho'
import { getApiErrorMessage } from '@/lib/api'
import { notificar } from '@/lib/notificar'
import { Button } from '@/components/ui/Button'
import { uploadUrl } from '@/lib/uploads'
import type { Produto } from '@/types/dashboard'

interface Props {
  produto: Produto
  onClose: () => void
}

export function AdicionarCarrinhoModal({ produto, onClose }: Props) {
  const adicionar = useAdicionarAoCarrinho()
  const [sucesso, setSucesso] = useState(false)
  const [quantidade, setQuantidade] = useState(1)

  const tamanhos = useMemo(
    () => [...new Set((produto.variacoes ?? []).map((v) => v.tamanho).filter(Boolean))] as string[],
    [produto.variacoes]
  )
  const cores = useMemo(
    () => [...new Set((produto.variacoes ?? []).map((v) => v.cor).filter(Boolean))] as string[],
    [produto.variacoes]
  )
  const [tamanho, setTamanho] = useState<string | null>(tamanhos[0] ?? null)
  const [cor, setCor] = useState<string | null>(cores[0] ?? null)

  const variacaoActual = produto.variacoes?.find((v) => v.tamanho === tamanho && (cor ? v.cor === cor : true))
  const stockDisponivel = variacaoActual ? variacaoActual.stock : produto.stock

  async function confirmar() {
    if (tamanhos.length > 0 && !tamanho) {
      notificar.erro('Selecciona um tamanho.')
      return
    }
    try {
      await adicionar.mutateAsync({ produto_id: produto.id, quantidade, tamanho, cor })
      setSucesso(true)
    } catch (err) {
      notificar.erro(getApiErrorMessage(err, 'Não foi possível adicionar ao carrinho.'))
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in" onClick={onClose}>
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-mist-100 px-6 py-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
            <ShoppingCart className="size-5 text-brand-600" /> Adicionar ao carrinho
          </h2>
          <button onClick={onClose} aria-label="Fechar" className="text-mist-400 transition hover:text-error-text">
            <X className="size-5" />
          </button>
        </div>

        {sucesso ? (
          <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
            <div className="grid size-14 place-items-center rounded-full bg-success-bg">
              <CircleCheck className="size-7 text-success-text" />
            </div>
            <p className="text-sm font-medium text-slate-800">Adicionado ao carrinho!</p>
            <div className="mt-2 flex w-full gap-3">
              <Button variant="secondary" onClick={onClose} className="flex-1">Continuar a comprar</Button>
              <Button onClick={() => (window.location.href = '/carrinho')} className="flex-1">Ver carrinho</Button>
            </div>
          </div>
        ) : (
          <div className="px-6 py-6">
            <div className="mb-5 flex gap-4">
              <img
                src={uploadUrl('produtos', produto.imagem) ?? '/placeholder.png'}
                className="size-20 shrink-0 rounded-xl border border-mist-100 bg-mist-50 object-contain p-2"
                alt={produto.nome}
              />
              <div>
                <p className="text-sm font-semibold text-slate-900">{produto.nome}</p>
                <p className="mt-1 text-base font-bold text-brand-600">
                  {produto.preco.toLocaleString('pt-PT', { minimumFractionDigits: 2 })} Kz
                </p>
              </div>
            </div>

            {tamanhos.length > 0 && (
              <div className="mb-4">
                <label className="mb-2 block text-[13px] font-medium tracking-wide text-mist-600">Tamanho</label>
                <div className="flex flex-wrap gap-2">
                  {tamanhos.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTamanho(t)}
                      className={`rounded-lg border px-3.5 py-1.5 text-sm font-medium transition ${
                        tamanho === t ? 'border-brand-600 bg-brand-600 text-white' : 'border-mist-200 text-mist-600 hover:border-brand-600'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {cores.length > 0 && (
              <div className="mb-4">
                <label className="mb-2 block text-[13px] font-medium tracking-wide text-mist-600">Cor</label>
                <div className="flex flex-wrap gap-2">
                  {cores.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCor(c)}
                      className={`rounded-lg border px-3.5 py-1.5 text-sm font-medium transition ${
                        cor === c ? 'border-brand-600 bg-brand-600 text-white' : 'border-mist-200 text-mist-600 hover:border-brand-600'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-5">
              <label className="mb-2 block text-[13px] font-medium tracking-wide text-mist-600">Quantidade</label>
              <div className="flex w-fit items-center gap-1 rounded-xl border border-mist-200 bg-mist-50 p-1">
                <button
                  onClick={() => setQuantidade((q) => Math.max(1, q - 1))}
                  disabled={quantidade <= 1}
                  className="grid size-8 place-items-center rounded-lg border border-mist-200 bg-white text-slate-700 transition hover:bg-mist-100 disabled:opacity-30"
                >
                  <Minus className="size-3.5" />
                </button>
                <span className="w-10 text-center text-sm font-bold">{quantidade}</span>
                <button
                  onClick={() => setQuantidade((q) => Math.min(stockDisponivel, q + 1))}
                  disabled={quantidade >= stockDisponivel}
                  className="grid size-8 place-items-center rounded-lg border border-mist-200 bg-white text-slate-700 transition hover:bg-mist-100 disabled:opacity-30"
                >
                  <Plus className="size-3.5" />
                </button>
              </div>
              {stockDisponivel > 0 && <p className="mt-1.5 text-xs text-mist-300">{stockDisponivel} disponíveis</p>}
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={onClose}>Cancelar</Button>
              <Button onClick={confirmar} loading={adicionar.isPending} disabled={stockDisponivel <= 0}>
                {adicionar.isPending ? <Loader2 className="size-4 animate-spin" /> : <ShoppingCart className="size-4" />}
                Adicionar
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
