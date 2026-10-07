import { useState } from 'react'
import { IdCard, Download, CircleCheck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { api, getApiErrorMessage } from '@/lib/api'
import { notificar } from '@/lib/notificar'
import { baixarFicheiroProtegido } from '@/lib/download'
import { useQueryClient } from '@tanstack/react-query'
import { CartaoDigital } from './CartaoDigital'
import type { Cartao } from '@/types/dashboard'
import type { Utilizador } from '@/types/auth'

const BENEFICIOS = ['Identificação oficial', 'Actividades', 'Formações', 'QR verificável', 'Descarregar PDF']

interface Props {
  cartao: Cartao | null
  user: Utilizador
}

export function HeroSection({ cartao, user }: Props) {
  return (
    <section id="home" className="relative pt-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex animate-slide-up flex-col items-center justify-between gap-8 rounded-2xl border border-mist-200 bg-portal-nav/5 px-8 py-8 lg:flex-row">
          {cartao ? <CartaoPronto cartao={cartao} user={user} /> : <SemCartao />}
        </div>
      </div>
    </section>
  )
}

function SemCartao() {
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient()

  async function gerarCartao() {
    setLoading(true)
    try {
      await api.post('/cartao/gerar')
      await queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      notificar.sucesso('Cartão gerado com sucesso.')
    } catch (err) {
      notificar.erro(getApiErrorMessage(err, 'Não foi possível gerar o cartão.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex-1">
        <div className="mb-4 flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-accent-500/20 text-xl">
            <IdCard className="size-5 text-accent-500" />
          </div>
          <h3 className="font-syne text-2xl font-bold text-ink">Gera o teu cartão escutista</h3>
        </div>
        <p className="mb-5 max-w-2xl text-base text-mist-600">
          O teu cartão oficial da AECA permite validação de identidade, acesso a actividades,
          formações, compras e verificação digital com QR Code.
        </p>
        <ul className="mb-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-mist-600">
          {BENEFICIOS.map((b) => (
            <li key={b} className="flex items-center gap-2">
              <CircleCheck className="size-3.5 text-accent-500" />
              {b}
            </li>
          ))}
        </ul>
        <Button onClick={gerarCartao} loading={loading} className="rounded-full bg-portal-nav hover:bg-black">
          <IdCard className="size-4" /> Gerar cartão
        </Button>
      </div>

      {/* Preview fantasma */}
      <div className="pointer-events-none hidden shrink-0 scale-75 select-none opacity-25 lg:block">
        <div className="h-[210px] w-[340px] rounded-2xl bg-brand-700" />
      </div>
    </>
  )
}

function CartaoPronto({ cartao, user }: { cartao: Cartao; user: Utilizador }) {
  const [baixando, setBaixando] = useState(false)

  async function baixar() {
    setBaixando(true)
    try {
      await baixarFicheiroProtegido(`/cartao/pdf?id=${user.id}`, 'cartao-sigeca.pdf')
    } catch (err) {
      notificar.erro(getApiErrorMessage(err, 'Não foi possível descarregar o cartão.'))
    } finally {
      setBaixando(false)
    }
  }

  return (
    <>
      <CartaoDigital cartao={cartao} user={user} />

      <div className="flex-1">
        <span className="mb-3 hidden items-center gap-1.5 rounded-full bg-success-bg px-3 py-1 text-xs font-semibold text-success-text md:inline-flex">
          <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
          Cartão activo
        </span>
        <h3 className="mb-2 hidden font-syne text-2xl font-bold text-ink md:block">O teu cartão está pronto</h3>
        <p className="mb-2 hidden text-sm text-mist-400 md:block">
          Arrasta o cartão para o rodares. Clica em <strong>Ver verso</strong> para ver o código QR.
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <Button
            onClick={baixar}
            loading={baixando}
            className="rounded-full bg-brand-600 hover:bg-brand-700"
          >
            <Download className="size-4" /> Descarregar PDF
          </Button>
        </div>
      </div>
    </>
  )
}
