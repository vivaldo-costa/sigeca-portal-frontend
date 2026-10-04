import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

interface MinhaPosicao {
  inscrito: boolean
  posicao: number | null
  total: number
}

/** Posição do sócio na lista de espera de uma actividade esgotada (quando `ativo`, isto é, a actividade está cheia). */
export function useMinhaPosicaoEspera(atividadeId: number, ativo: boolean) {
  return useQuery({
    queryKey: ['lista-espera', atividadeId, 'minha'],
    queryFn: async () => {
      const { data } = await api.get<{ dados: MinhaPosicao }>(`/lista-espera/${atividadeId}/minha`)
      return data.dados
    },
    enabled: ativo,
  })
}

export function useEntrarListaEspera(atividadeId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post(`/lista-espera/${atividadeId}`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lista-espera', atividadeId] })
    },
  })
}

export function useSairListaEspera(atividadeId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      await api.delete(`/lista-espera/${atividadeId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lista-espera', atividadeId] })
    },
  })
}
