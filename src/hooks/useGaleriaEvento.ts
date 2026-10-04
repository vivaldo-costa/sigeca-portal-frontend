import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { FotoGaleria } from '@/types/dashboard'

/** Galeria de fotos pós-evento — leitura, qualquer sócio autenticado (gestão fica no Painel). */
export function useGaleriaEvento(atividadeId: number, ativo: boolean) {
  return useQuery({
    queryKey: ['galeria-atividade', atividadeId],
    queryFn: async () => {
      const { data } = await api.get<{ dados: FotoGaleria[] }>(`/galeria-atividades/${atividadeId}`)
      return data.dados
    },
    enabled: ativo,
  })
}
