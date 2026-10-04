import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { AtualizarPerfilPayload, PerfilData, TimelineEvento } from '@/types/perfil'

export function usePerfil() {
  return useQuery({
    queryKey: ['perfil'],
    queryFn: async () => {
      const { data } = await api.get<{ dados: PerfilData }>('/perfil')
      return data.dados
    },
  })
}

export function useAtualizarPerfil() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: AtualizarPerfilPayload) => {
      const form = new FormData()
      form.append('nome', payload.nome)
      form.append('email', payload.email)
      form.append('telefone', payload.telefone)
      form.append('endereco', payload.endereco)
      form.append('bilhete_identidade', payload.bilhete_identidade)
      form.append('data_nascimento', payload.data_nascimento)
      form.append('grupo_sanguineo', payload.grupo_sanguineo)
      // Sem colchetes: o backend (multer/express) recebe varias entradas
      // com o mesmo nome "sacramentos" e junta-as num array — "sacramentos[]"
      // ficaria como uma chave literal diferente e nao seria reconhecido.
      payload.sacramentos.forEach((s) => form.append('sacramentos', s))
      if (payload.foto) form.append('foto', payload.foto)
      if (payload.senha_atual) form.append('senha_atual', payload.senha_atual)
      if (payload.nova_senha) form.append('nova_senha', payload.nova_senha)
      if (payload.confirmar_senha) form.append('confirmar_senha', payload.confirmar_senha)

      const { data } = await api.put('/perfil', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perfil'] })
    },
  })
}

/**
 * Linha do tempo do percurso escutista — carregada sob-demanda (só quando a
 * tab "Sobre" é aberta), tal como no comportamento original.
 */
export function useTimeline(codigoAssociado: string | undefined, enabled: boolean) {
  return useQuery({
    queryKey: ['perfil', 'timeline', codigoAssociado],
    queryFn: async () => {
      const { data } = await api.get<{ dados: { eventos: TimelineEvento[] } }>('/perfil/timeline', {
        params: { escuteiro_id: codigoAssociado },
      })
      return data.dados.eventos
    },
    enabled: enabled && !!codigoAssociado,
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * ⚠️ Backend ainda não implementado: não há rota /votacoes registada em
 * src/routes/index.js nem tabela de opções/votos no schema actual (ver
 * README da API, secção 3). O botão de votar continua funcional na UI mas
 * vai devolver 404 até esse módulo ser construído.
 */
export function useVotar() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ votacaoId, opcaoId }: { votacaoId: number; opcaoId: number }) => {
      const { data } = await api.post('/votacoes/votar', { votacao_id: votacaoId, opcao_id: opcaoId })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['perfil'] })
    },
  })
}

/**
 * ⚠️ Backend ainda não implementado: não há rota /pedidos registada (só
 * /perfil devolve os pedidos, em leitura). O `pdf_recibo` de cada pedido já
 * vem no payload de /perfil quando existir; este endpoint de geração fica
 * pendente até a Fase 6 (Loja/Carrinho) da API estar completa.
 */
export function useGerarRecibo() {
  return useMutation({
    mutationFn: async (pedidoId: number) => {
      const { data } = await api.post<{ dados: { url: string } }>(`/pedidos/${pedidoId}/recibo`)
      return data.dados.url
    },
  })
}
