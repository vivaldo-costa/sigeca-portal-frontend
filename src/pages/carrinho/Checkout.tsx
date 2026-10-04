import { useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { ChevronLeft, Loader2 } from 'lucide-react'
import { useCarrinho, useFinalizarPedido } from '@/hooks/useCarrinho'
import { Alert } from '@/components/ui/Alert'
import { CheckoutStepper } from '@/components/checkout/CheckoutStepper'
import { EtapaResumo } from '@/components/checkout/EtapaResumo'
import { EtapaPagamento } from '@/components/checkout/EtapaPagamento'
import { EtapaEntrega, ZONAS } from '@/components/checkout/EtapaEntrega'
import { ResumoCheckout } from '@/components/checkout/ResumoCheckout'
import { ConfirmacaoPedido } from '@/components/checkout/ConfirmacaoPedido'
import { getApiErrorMessage } from '@/lib/api'
import type { MetodoPagamento, TipoEntrega } from '@/types/carrinho'

/**
 * Pagina Checkout — equivalente a portal/carrinho/checkout.php: wizard de
 * 3 passos (Resumo -> Pagamento -> Entrega) seguido de confirmacao, com
 * submissao final para POST /api/v1/carrinho/checkout (equivalente a
 * api/finalizar_pedido.php).
 */
export function CheckoutPage() {
  const { data, isLoading } = useCarrinho()
  const finalizar = useFinalizarPedido()

  const [passo, setPasso] = useState(1)
  const [metodo, setMetodo] = useState<MetodoPagamento | null>(null)
  const [referencia, setReferencia] = useState('')
  const [comprovativo, setComprovativo] = useState<File | null>(null)
  const [erroPagamento, setErroPagamento] = useState<string | null>(null)

  const [tipoEntrega, setTipoEntrega] = useState<TipoEntrega>('levantamento')
  const [zona, setZona] = useState<string | null>(null)
  const [bairro, setBairro] = useState('')
  const [referenciaMorada, setReferenciaMorada] = useState('')
  const [telefone, setTelefone] = useState('')
  const [erroEntrega, setErroEntrega] = useState<string | null>(null)

  const [pedidoId, setPedidoId] = useState<number | null>(null)

  const zonaSelecionada = useMemo(() => ZONAS.find((z) => z.key === zona) ?? null, [zona])
  const custoEntrega = tipoEntrega === 'domicilio' ? (zonaSelecionada?.preco ?? 0) : 0

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-mist-400">
        <Loader2 className="size-6 animate-spin" />
      </div>
    )
  }

  // Sem itens (e ainda sem pedido concluido) -> volta ao carrinho, tal como o original
  if (!pedidoId && (!data || data.itens.length === 0)) {
    return <Navigate to="/carrinho" replace />
  }

  function validarEtapa2() {
    setErroPagamento(null)
    if (!metodo) return setErroPagamento('Selecciona um método de pagamento.')
    if (!referencia.trim()) return setErroPagamento('Indica a referência da transacção.')
    if (!comprovativo) return setErroPagamento('O comprovativo de pagamento é obrigatório.')
    setPasso(3)
  }

  async function submeterPedido() {
    setErroEntrega(null)
    if (tipoEntrega === 'domicilio' && (!zona || !bairro.trim())) {
      setErroEntrega('Selecciona a zona e indica o bairro de entrega.')
      return
    }
    if (!metodo || !comprovativo) return

    try {
      const resposta = await finalizar.mutateAsync({
        metodo_pagamento: metodo,
        referencia_pagamento: referencia,
        comprovativo,
        tipo_entrega: tipoEntrega,
        zona_entrega: tipoEntrega === 'domicilio' ? (zona ?? undefined) : undefined,
        municipio: tipoEntrega === 'domicilio' ? zonaSelecionada?.nome : undefined,
        bairro: tipoEntrega === 'domicilio' ? bairro : undefined,
        referencia_morada: tipoEntrega === 'domicilio' ? referenciaMorada : undefined,
        telefone: tipoEntrega === 'domicilio' ? telefone : undefined,
      })
      if (resposta.success && resposta.pedido_id) {
        setPedidoId(resposta.pedido_id)
      } else {
        setErroEntrega(resposta.message || 'Não foi possível concluir o pedido.')
      }
    } catch (err) {
      setErroEntrega(getApiErrorMessage(err, 'Não foi possível concluir o pedido.'))
    }
  }

  if (pedidoId) {
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <ConfirmacaoPedido pedidoId={pedidoId} />
      </div>
    )
  }

  const itens = data!.itens
  const total = data!.total

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex items-center gap-4">
        <Link to="/carrinho" className="grid size-9 place-items-center rounded-xl border border-mist-200 bg-white text-mist-600 transition hover:bg-mist-50">
          <ChevronLeft className="size-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Finalizar Compra</h1>
          <p className="text-sm text-mist-400">
            {itens.length} produto{itens.length > 1 ? 's' : ''} · {itens.reduce((s, i) => s + i.quantidade, 0)} unidade(s)
          </p>
        </div>
      </div>

      <CheckoutStepper passoActual={passo} />

      {erroEntrega && passo === 3 && <Alert variant="error">{erroEntrega}</Alert>}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-3">
          {passo === 1 && <EtapaResumo itens={itens} onContinuar={() => setPasso(2)} />}
          {passo === 2 && (
            <EtapaPagamento
              total={total}
              metodo={metodo}
              setMetodo={setMetodo}
              referencia={referencia}
              setReferencia={setReferencia}
              comprovativo={comprovativo}
              setComprovativo={setComprovativo}
              erro={erroPagamento}
              onVoltar={() => setPasso(1)}
              onContinuar={validarEtapa2}
            />
          )}
          {passo === 3 && (
            <EtapaEntrega
              tipoEntrega={tipoEntrega}
              setTipoEntrega={setTipoEntrega}
              zona={zona}
              setZona={setZona}
              bairro={bairro}
              setBairro={setBairro}
              referenciaMorada={referenciaMorada}
              setReferenciaMorada={setReferenciaMorada}
              telefone={telefone}
              setTelefone={setTelefone}
              erro={null}
              submetendo={finalizar.isPending}
              onVoltar={() => setPasso(2)}
              onSubmeter={submeterPedido}
            />
          )}
        </div>

        <div className="lg:col-span-2">
          <ResumoCheckout
            itens={itens}
            subtotal={total}
            custoEntrega={custoEntrega}
            zonaSelecionada={tipoEntrega === 'domicilio' ? zonaSelecionada : null}
          />
        </div>
      </div>
    </div>
  )
}
