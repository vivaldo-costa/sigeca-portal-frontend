import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDashboard } from '@/hooks/useDashboard'
import { useAuthStore } from '@/store/auth'
import { HeroSection } from '@/components/dashboard/HeroSection'
import { LojaSection } from '@/components/dashboard/LojaSection'
import { ComunidadeSection } from '@/components/dashboard/ComunidadeSection'
import { AtividadesSection } from '@/components/dashboard/AtividadesSection'
import { CatalogoFormacoesSection } from '@/components/dashboard/CatalogoFormacoesSection'
import { VotacoesSection } from '@/components/dashboard/VotacoesSection'
import { DocumentosSection } from '@/components/dashboard/DocumentosSection'
import { AprenderSection } from '@/components/dashboard/AprenderSection'
import { FaqSection } from '@/components/dashboard/FaqSection'
import { InscreverModal } from '@/components/dashboard/InscreverModal'
import { PagamentoModal } from '@/components/dashboard/PagamentoModal'
import { AdicionarCarrinhoModal } from '@/components/dashboard/AdicionarCarrinhoModal'
import { Alert } from '@/components/ui/Alert'
import { NotificacoesLocais } from '@/components/notificacoes/NotificacoesLocais'
import type { Produto, Atividade } from '@/types/dashboard'

/**
 * Pagina inicial do Portal do Escuteiro — equivalente completo a
 * portal/index.php, incluindo os fluxos de inscricao_unificada.php e
 * pagamento_evento.php via modais.
 *
 * "Início" (`/dashboard`, sem `secao`) mostra TODAS as secções, como
 * uma página única com scroll — é o comportamento pedido para o item
 * "Início" do menu. Cada item específico do menu (`/dashboard/loja`,
 * `/dashboard/comunidade`, etc.) continua a mostrar só o conteúdo
 * dessa secção. Os dados vêm sempre de uma única chamada a
 * `useDashboard()`, partilhada por todas as secções (navegar entre
 * elas, ou para "Início", não repete o pedido).
 */
export function DashboardPage() {
  const { secao } = useParams<{ secao?: string }>()
  const mostrarTudo = !secao || secao === 'home'
  const { data, isLoading, isError, error } = useDashboard()
  const user = useAuthStore((s) => s.user)
  const [inscrevendo, setInscrevendo] = useState<Atividade | null>(null)
  const [pagando, setPagando] = useState<Atividade | null>(null)
  const [adicionandoProduto, setAdicionandoProduto] = useState<Produto | null>(null)

  if (isLoading) {
    return (
      <div className="grid min-h-[60vh] place-items-center text-mist-400">
        A carregar o teu portal…
      </div>
    )
  }

  if (isError || !data || !user) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16">
        <Alert variant="error">
          {(error as Error)?.message ?? 'Não foi possível carregar o dashboard. Tenta novamente.'}
        </Alert>
      </div>
    )
  }

  return (
    <div>
      <div className="mx-auto max-w-6xl px-4 pt-4 sm:px-6">
        <NotificacoesLocais local="dashboard" />
      </div>

      {mostrarTudo && <HeroSection cartao={data.cartao} user={user} />}

      {(mostrarTudo || secao === 'loja') && (
        <LojaSection produtos={data.produtos} onAdicionar={setAdicionandoProduto} />
      )}

      {(mostrarTudo || secao === 'comunidade') && (
        <>
          <ComunidadeSection totalUtilizadores={data.totalUtilizadores} avatares={data.utilizadoresAvatares} stats={data.stats} />
          <VotacoesSection votacoes={data.votacoes} />
        </>
      )}

      {(mostrarTudo || secao === 'atividades') && (
        <>
          <AtividadesSection atividades={data.atividades} onInscrever={setInscrevendo} onPagar={setPagando} />
          <CatalogoFormacoesSection />
        </>
      )}

      {(mostrarTudo || secao === 'documentos') && <DocumentosSection cartao={data.cartao} utilizadorId={user.id} />}

      {(mostrarTudo || secao === 'aprender') && (
        <>
          <AprenderSection />
          <FaqSection faqs={data.faqs} />
        </>
      )}

      {inscrevendo && <InscreverModal atividade={inscrevendo} onClose={() => setInscrevendo(null)} />}
      {pagando && <PagamentoModal atividade={pagando} onClose={() => setPagando(null)} />}
      {adicionandoProduto && (
        <AdicionarCarrinhoModal produto={adicionandoProduto} onClose={() => setAdicionandoProduto(null)} />
      )}
    </div>
  )
}
