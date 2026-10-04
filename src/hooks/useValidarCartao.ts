import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { ValidacaoCartao } from '@/types/validacao'

/**
 * Página pública (sem sessão) acedida ao ler o QR Code do cartão físico/
 * digital — equivalente a portal/cartao/validar-cartao.php?codigo=.
 * Backend: GET /cartao/validar?codigo= (secção 5.3 do roteiro).
 */
export function useValidarCartao(codigo: string | null) {
  return useQuery({
    queryKey: ['validar-cartao', codigo],
    queryFn: async () => {
      const { data } = await api.get<{ dados: ValidacaoCartao }>('/cartao/validar', {
        params: { codigo },
      })
      return data.dados
    },
    enabled: !!codigo,
    retry: false,
  })
}
