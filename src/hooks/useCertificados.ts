import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { baixarFicheiroProtegido } from '@/lib/download'
import type { Certificado } from '@/types/perfil'

/** "Meus Certificados" — auto-serviço, independente do payload combinado de usePerfil(). */
export function useMeusCertificados() {
  return useQuery({
    queryKey: ['portal-meus-certificados'],
    queryFn: async () => {
      const { data } = await api.get<{ dados: Certificado[] }>('/certificados/meus')
      return data.dados
    },
  })
}

export async function baixarCertificadoProprio(certificado: Certificado) {
  await baixarFicheiroProtegido(`/certificados/meus/${certificado.id}/pdf`, `${certificado.numero_unico}.pdf`)
}
