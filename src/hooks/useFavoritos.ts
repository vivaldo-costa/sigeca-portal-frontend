import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

/** Ids dos produtos favoritos do sócio — leve, usado para marcar o coração nos cartões. */
export function useFavoritosIds() {
  return useQuery({
    queryKey: ['portal-favoritos-ids'],
    queryFn: async () => {
      const { data } = await api.get<{ dados: number[] }>('/favoritos/ids')
      return data.dados
    },
  })
}

export function useToggleFavorito() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ produtoId, favorito }: { produtoId: number; favorito: boolean }) => {
      if (favorito) {
        await api.delete(`/favoritos/${produtoId}`)
      } else {
        await api.post('/favoritos', { produto_id: produtoId })
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portal-favoritos-ids'] })
    },
  })
}
