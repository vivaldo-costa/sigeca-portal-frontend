import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { MinhaAvaliacao, ProdutoAvaliacao } from '@/types/dashboard'

export function useAvaliacoesDoProduto(produtoId: number, ativo: boolean) {
  return useQuery({
    queryKey: ['portal-avaliacoes', produtoId],
    queryFn: async () => {
      const { data } = await api.get<{ dados: ProdutoAvaliacao[] }>(`/avaliacoes/produto/${produtoId}`)
      return data.dados
    },
    enabled: ativo,
  })
}

export function useMinhaAvaliacao(produtoId: number, ativo: boolean) {
  return useQuery({
    queryKey: ['portal-avaliacoes', produtoId, 'minha'],
    queryFn: async () => {
      const { data } = await api.get<{ dados: MinhaAvaliacao | null }>(`/avaliacoes/produto/${produtoId}/minha`)
      return data.dados
    },
    enabled: ativo,
  })
}

export function useGuardarAvaliacao(produtoId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ nota, comentario }: { nota: number; comentario: string }) => {
      await api.post(`/avaliacoes/produto/${produtoId}`, { nota, comentario })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portal-avaliacoes', produtoId] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useRemoverAvaliacao(produtoId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      await api.delete(`/avaliacoes/produto/${produtoId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portal-avaliacoes', produtoId] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
