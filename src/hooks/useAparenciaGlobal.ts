import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { uploadUrl } from '@/lib/uploads'
import type { ConfiguracoesAparencia } from '@/types/configuracoesAparencia'

/**
 * Aplica ao Portal a Aparência configurada no Painel (secção 3.2 do
 * roteiro) — cores, logótipos e favicon. O Painel existe para gerir o
 * Portal, por isso a configuração tem de se propagar aos dois, não só
 * ao próprio Painel. Endpoint público — funciona mesmo antes de login.
 */
export function useAparenciaGlobal() {
  const { data } = useQuery({
    queryKey: ['aparencia-global'],
    queryFn: async () => {
      const { data } = await api.get<{ dados: ConfiguracoesAparencia }>('/configuracoes-aparencia')
      return data.dados
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  })

  useEffect(() => {
    if (!data) return

    const raiz = document.documentElement
    raiz.style.setProperty('--cor-primaria', data.cor_primaria)
    raiz.style.setProperty('--cor-secundaria', data.cor_secundaria)
    raiz.style.setProperty('--cor-destaque', data.cor_destaque)
    raiz.style.setProperty('--cor-estado-sucesso', data.cor_estado_sucesso)
    raiz.style.setProperty('--cor-estado-erro', data.cor_estado_erro)
    raiz.style.setProperty('--cor-estado-aviso', data.cor_estado_aviso)
    raiz.style.setProperty('--cor-estado-info', data.cor_estado_info)

    // O Portal já usa --color-brand-600 como "cor institucional principal"
    // em todo o tema (botões, cabeçalho, etc.) — sobrepor esta variável
    // propaga a cor primária configurada a tudo o que já a usa, sem
    // precisar de tocar em cada componente.
    raiz.style.setProperty('--color-brand-600', data.cor_primaria)

    const urlFavicon = uploadUrl('aparencia', data.favicon_path)
    if (urlFavicon) {
      const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
      if (link) link.href = urlFavicon
    }
  }, [data])

  return data
}
