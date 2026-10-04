import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { MinhaDenuncia, SubmeterDenunciaPayload } from '@/types/denuncia'

export function useMinhasDenuncias() {
  return useQuery({
    queryKey: ['portal-minhas-denuncias'],
    queryFn: async () => {
      const { data } = await api.get<{ dados: MinhaDenuncia[] }>('/denuncias/minhas')
      return data.dados
    },
  })
}

export function useSubmeterDenuncia() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: SubmeterDenunciaPayload) => {
      const form = new FormData()
      form.append('tipo', payload.tipo)
      form.append('descricao', payload.descricao)
      form.append('anonimo', payload.anonimo ? '1' : '0')
      if (payload.anexo) form.append('anexo', payload.anexo)

      const { data } = await api.post('/denuncias', form, { headers: { 'Content-Type': 'multipart/form-data' } })
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['portal-minhas-denuncias'] }),
  })
}
