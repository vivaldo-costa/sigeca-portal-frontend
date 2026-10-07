import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CircleCheck, FileDown, ShoppingBag, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { baixarFicheiroProtegido } from '@/lib/download'
import { getApiErrorMessage } from '@/lib/api'
import { notificar } from '@/lib/notificar'

export function ConfirmacaoPedido({ pedidoId }: { pedidoId: number }) {
  const [baixando, setBaixando] = useState(false)

  async function verRecibo() {
    setBaixando(true)
    try {
      await baixarFicheiroProtegido(`/pedidos/${pedidoId}/recibo`, `recibo-pedido-${pedidoId}.pdf`)
    } catch (err) {
      notificar.erro(getApiErrorMessage(err, 'Não foi possível descarregar o recibo.'))
    } finally {
      setBaixando(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <div className="mx-auto mb-5 grid size-20 place-items-center rounded-full bg-success-bg">
        <CircleCheck className="size-9 text-success-text" />
      </div>
      <h1 className="mb-2 text-2xl font-bold text-slate-900">Pedido registado com sucesso!</h1>
      <p className="mx-auto mb-1 max-w-sm text-sm text-mist-400">
        O teu pedido <strong className="text-slate-700">#{pedidoId}</strong> foi criado e fica a aguardar
        confirmação do pagamento pela equipa da AECA.
      </p>
      <p className="mx-auto mb-8 max-w-sm text-xs text-mist-300">
        Vais poder acompanhar o estado do pedido e transferir o recibo no separador
        <strong> As Minhas Compras</strong> do teu perfil.
      </p>

      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <button
          onClick={verRecibo}
          disabled={baixando}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-mist-200 px-6 py-2.5 text-sm font-semibold text-mist-600 transition hover:bg-mist-50 disabled:opacity-60"
        >
          {baixando ? <Loader2 className="size-4 animate-spin" /> : <FileDown className="size-4" />}
          Ver Recibo
        </button>
        <Link to="/dashboard#loja">
          <Button className="w-full sm:w-auto">
            <ShoppingBag className="size-4" /> Continuar a comprar
          </Button>
        </Link>
      </div>
    </div>
  )
}
