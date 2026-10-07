import { useState } from 'react'
import { usePerfil } from '@/hooks/usePerfil'
import { Alert } from '@/components/ui/Alert'
import { NotificacoesLocais } from '@/components/notificacoes/NotificacoesLocais'
import { PerfilHeader } from '@/components/perfil/PerfilHeader'
import { PerfilTabsNav, type PerfilTab } from '@/components/perfil/PerfilTabsNav'
import { SobreTab } from '@/components/perfil/SobreTab'
import { ActividadesTab } from '@/components/perfil/ActividadesTab'
import { FormacoesTab } from '@/components/perfil/FormacoesTab'
import { CertificadosTab } from '@/components/perfil/CertificadosTab'
import { ComprasTab } from '@/components/perfil/ComprasTab'
import { VotacoesTab } from '@/components/perfil/VotacoesTab'
import { EditarPerfilModal } from '@/components/perfil/EditarPerfilModal'

/**
 * Pagina de Perfil — equivalente a portal/perfil/index.php: cabecalho com
 * foto/nome/badges, 5 tabs (Sobre, Actividades, Formacoes, As Minhas Compras,
 * Votacoes — esta ultima so quando pode_ver_votacoes) e modal de edicao.
 */
export function PerfilPage() {
  const { data, isLoading, isError, error } = usePerfil()
  const [tab, setTab] = useState<PerfilTab>('sobre')
  const [editando, setEditando] = useState(false)

  if (isLoading) {
    return <div className="grid min-h-[60vh] place-items-center text-mist-400">A carregar o teu perfil…</div>
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16">
        <Alert variant="error">
          {(error as Error)?.message ?? 'Não foi possível carregar o perfil. Tenta novamente.'}
        </Alert>
      </div>
    )
  }

  const { dados } = data
  const podeVerVotacoes = dados.pode_ver_votacoes
  const tabActual = tab === 'eleicoes' && !podeVerVotacoes ? 'sobre' : tab

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <NotificacoesLocais local="perfil" />
      <PerfilHeader dados={dados} onEditar={() => setEditando(true)} />
      <PerfilTabsNav activo={tabActual} onChange={setTab} mostrarVotacoes={podeVerVotacoes} />

      <div className="rounded-b-2xl bg-white shadow-sm">
        {tabActual === 'sobre' && <SobreTab dados={dados} activo={tabActual === 'sobre'} />}
        {tabActual === 'actividades' && (
          <>
            <div className="px-6 pt-6"><NotificacoesLocais local="actividades" /></div>
            <ActividadesTab atividades={data.atividades} />
          </>
        )}
        {tabActual === 'formacoes' && <FormacoesTab formacoes={data.formacoes} />}
        {tabActual === 'certificados' && <CertificadosTab />}
        {tabActual === 'produtos' && <ComprasTab pedidos={data.pedidos} />}
        {tabActual === 'eleicoes' && podeVerVotacoes && <VotacoesTab votacoes={data.votacoes} />}
      </div>

      {editando && <EditarPerfilModal dados={dados} onClose={() => setEditando(false)} />}
    </div>
  )
}
