import { useState } from 'react'
import { Megaphone, Globe, X } from 'lucide-react'
import { useNotificacoesVisiveis, useMarcarNotificacaoLida } from '@/hooks/useNotificacoes'
import type { LocalExibicao } from '@/types/notificacao'

/**
 * O formulário de criação de notificações (Painel) sempre ofereceu 6
 * locais de exibição, mas só "abertura" tinha um sítio a mostrá-las (o
 * sino) — uma notificação criada para qualquer um dos outros 5 nunca
 * aparecia em lado nenhum. Este componente resolve isso: cada página
 * relevante mostra as suas próprias notificações, sem precisar de
 * repetir a lógica de busca/marcação como lida em cada uma.
 */
export function NotificacoesLocais({ local }: { local: LocalExibicao }) {
  const { data } = useNotificacoesVisiveis(local)
  const marcarLida = useMarcarNotificacaoLida()
  const [ocultas, setOcultas] = useState<Set<number>>(new Set())

  const visiveis = data?.filter((n) => !ocultas.has(n.id)) ?? []
  if (visiveis.length === 0) return null

  function dispensar(id: number, global: boolean, lida: boolean) {
    setOcultas((s) => new Set(s).add(id))
    if (!global && !lida) marcarLida.mutate(id)
  }

  return (
    <div className="mb-5 space-y-2">
      {visiveis.map((n) => (
        <div key={n.id} className="flex items-start gap-2.5 rounded-xl border border-brand-600/15 bg-brand-600/5 px-4 py-3">
          <Megaphone className="mt-0.5 size-4 shrink-0 text-brand-600" />
          <div className="flex-1">
            {n.titulo && <p className="text-[13px] font-semibold text-ink">{n.titulo}</p>}
            <p className="mt-0.5 text-[12.5px] text-mist-600">{n.mensagem}</p>
          </div>
          {n.global === 1 && <Globe className="mt-0.5 size-3.5 shrink-0 text-mist-300" />}
          <button onClick={() => dispensar(n.id, !!n.global, !!n.lida)} className="mt-0.5 shrink-0 text-mist-300 hover:text-ink" aria-label="Dispensar">
            <X className="size-3.5" />
          </button>
        </div>
      ))}
    </div>
  )
}
