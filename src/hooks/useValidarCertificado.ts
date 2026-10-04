import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { ValidacaoCertificado } from '@/types/certificado'

/**
 * Página pública (sem sessão), acedida ao ler o QR Code do certificado/
 * declaração/diploma em PDF — GET /api/v1/certificados/validar?numero=&codigo=
 * (rota sem autenticação no backend, tal como /cartao/validar).
 */
export function useValidarCertificado(numero: string | null, codigo: string | null) {
  return useQuery({
    queryKey: ['validar-certificado', numero, codigo],
    queryFn: async () => {
      const { data } = await api.get<{ dados: ValidacaoCertificado }>('/certificados/validar', {
        params: { numero, codigo },
      })
      return data.dados
    },
    enabled: !!numero && !!codigo,
    retry: false,
  })
}
