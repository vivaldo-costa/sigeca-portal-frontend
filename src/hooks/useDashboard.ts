import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { DashboardData } from '@/types/dashboard'

/**
 * Carrega tudo o que a página inicial precisa (produtos, actividades,
 * formações, faqs, cartão) num único pedido — equivalente às queries
 * agregadas em portal/index.php, agora atrás de GET /api/v1/dashboard.
 */
export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const { data } = await api.get<{ dados: DashboardData }>('/dashboard')
      return data.dados
    },
  })
}
