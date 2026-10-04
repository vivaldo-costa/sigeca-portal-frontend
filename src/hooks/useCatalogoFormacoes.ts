import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { CatalogoFormacaoItem } from '@/types/dashboard'

/**
 * Catálogo de formações (percursos/cursos que a associação oferece —
 * formação inicial, específica, contínua, etc.), na vista pública do
 * sócio. Só itens activos; o filtro/gestão completa fica no Painel.
 */
export function useCatalogoFormacoes() {
  return useQuery({
    queryKey: ['portal-catalogo-formacoes'],
    queryFn: async () => {
      const { data } = await api.get<{ dados: CatalogoFormacaoItem[] }>('/catalogo-formacoes/publico')
      return data.dados
    },
    staleTime: 5 * 60 * 1000,
  })
}
