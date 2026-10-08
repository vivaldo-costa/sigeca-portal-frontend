import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { MinhaCandidatura } from '@/types/percursoFormativo'

/** As candidaturas a dirigente do próprio sócio autenticado (vazio se não tiver nenhuma). */
export function useMeuPercurso() {
  return useQuery({
    queryKey: ['portal-meu-percurso'],
    queryFn: async () => {
      const { data } = await api.get<{ dados: MinhaCandidatura[] }>('/candidatos-dirigente/meu-percurso')
      return data.dados
    },
    staleTime: 60 * 1000,
  })
}
