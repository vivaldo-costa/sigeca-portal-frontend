import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { ProgramaEventoItem } from '@/types/dashboard'

/**
 * Programa (agenda por dia/hora) de um acampamento/evento, na vista
 * "pública" do próprio sócio — não exige papel de organização, ao
 * contrário da vista de gestão usada no Painel.
 */
export function useProgramaEvento(atividadeId: number | null) {
  return useQuery({
    queryKey: ['portal-programa-evento', atividadeId],
    queryFn: async () => {
      const { data } = await api.get<{ dados: ProgramaEventoItem[] }>(`/acampamentos/${atividadeId}/programa-publico`)
      return data.dados
    },
    enabled: atividadeId !== null,
  })
}
