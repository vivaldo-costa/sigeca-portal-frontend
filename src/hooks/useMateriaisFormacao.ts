import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export interface MaterialFormacao {
  id: number
  catalogo_formacao_id: number
  titulo: string
  ficheiro: string
  ordem: number
  created_at: string
  criado_por_nome: string | null
}

/** Materiais/downloads de uma formação do catálogo — leitura, qualquer sócio autenticado. */
export function useMateriaisFormacao(catalogoFormacaoId: number, ativo: boolean) {
  return useQuery({
    queryKey: ['materiais-formacao', catalogoFormacaoId],
    queryFn: async () => {
      const { data } = await api.get<{ dados: MaterialFormacao[] }>(`/catalogo-formacoes/${catalogoFormacaoId}/materiais`)
      return data.dados
    },
    enabled: ativo,
  })
}
