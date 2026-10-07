import { Link } from 'react-router-dom'
import { ChevronLeft, ShoppingCart, Lock, Loader2, ShoppingBag } from 'lucide-react'
import { useCarrinho } from '@/hooks/useCarrinho'
import { Alert } from '@/components/ui/Alert'
import { NotificacoesLocais } from '@/components/notificacoes/NotificacoesLocais'
import { ItemCarrinhoRow } from '@/components/carrinho/ItemCarrinhoRow'

const fmtKz = (v: number) => v.toLocaleString('pt-PT', { maximumFractionDigits: 0 })

export function CarrinhoPage() {
  const { data, isLoading, isError, error } = useCarrinho()

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <NotificacoesLocais local="loja" />
      <div className="mb-8 flex items-center gap-4">
        <Link
          to="/dashboard"
          className="grid size-9 place-items-center rounded-xl border border-mist-200 bg-white text-mist-600 transition hover:bg-mist-50"
        >
          <ChevronLeft className="size-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">O Meu Carrinho</h1>
          <p className="text-sm text-mist-400">
            {data ? `${data.itens.length} ${data.itens.length === 1 ? 'item' : 'itens'}` : ' '}
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center py-16 text-mist-400">
          <Loader2 className="size-6 animate-spin" />
        </div>
      )}

      {isError && (
        <Alert variant="error">{(error as Error)?.message ?? 'Não foi possível carregar o carrinho.'}</Alert>
      )}

      {data && data.itens.length === 0 && <CarrinhoVazio />}

      {data && data.itens.length > 0 && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-3 lg:col-span-2">
            {data.itens.map((item) => (
              <ItemCarrinhoRow key={item.id} item={item} />
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-6 rounded-2xl border border-mist-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold text-slate-800">Resumo</h2>

              <div className="space-y-2 text-sm text-mist-600">
                {data.itens.map((item) => (
                  <div key={item.id} className="flex items-start justify-between gap-2">
                    <span className="max-w-[60%] truncate text-mist-400">
                      {item.nome}
                      {item.tamanho && <span className="ml-1 text-xs text-mist-300">({item.tamanho})</span>}
                    </span>
                    <span className="whitespace-nowrap font-medium">{fmtKz(item.subtotal)} Kz</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-mist-100 pt-4">
                <span className="font-bold text-slate-800">Total</span>
                <span className="text-xl font-black text-brand-600">{fmtKz(data.total)} Kz</span>
              </div>

              <Link
                to="/carrinho/checkout"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 text-sm font-bold text-white transition hover:bg-brand-700"
              >
                <Lock className="size-3.5" /> Finalizar Compra
              </Link>
              <Link
                to="/dashboard"
                className="mt-3 block w-full rounded-xl border border-mist-200 py-2.5 text-center text-sm font-medium text-mist-600 transition hover:bg-mist-50"
              >
                Continuar a comprar
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function CarrinhoVazio() {
  return (
    <div className="py-24 text-center">
      <div className="mx-auto mb-5 grid size-20 place-items-center rounded-3xl bg-mist-100">
        <ShoppingCart className="size-8 text-mist-300" />
      </div>
      <h2 className="mb-2 text-xl font-bold text-slate-700">O carrinho está vazio</h2>
      <p className="mb-6 text-sm text-mist-400">Adiciona produtos da loja para começar</p>
      <Link
        to="/dashboard#loja"
        className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
      >
        <ShoppingBag className="size-3.5" /> Ver produtos
      </Link>
    </div>
  )
}
