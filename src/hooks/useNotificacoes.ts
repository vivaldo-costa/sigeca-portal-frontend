import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { NotificacaoVisivel, LocalExibicao } from '@/types/notificacao'

export function useNotificacoesVisiveis(local: LocalExibicao) {
  return useQuery({
    queryKey: ['notificacoes-visiveis', 'portal', local],
    queryFn: async () => {
      const { data } = await api.get<{ dados: NotificacaoVisivel[] }>('/notificacoes/visiveis', { params: { destino: 'portal', local } })
      return data.dados
    },
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
  })
}

export function useMarcarNotificacaoLida() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.patch(`/notificacoes/${id}/lida`)
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notificacoes-visiveis'] }),
  })
}
