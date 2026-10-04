import { useState, useRef, useEffect } from 'react'
import { Bell, Globe, X } from 'lucide-react'
import { useNotificacoesVisiveis, useMarcarNotificacaoLida } from '@/hooks/useNotificacoes'

export function NotificationBell() {
  const [aberto, setAberto] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { data } = useNotificacoesVisiveis('abertura')
  const marcarLida = useMarcarNotificacaoLida()

  const naoLidas = data?.filter((n) => !n.global && !n.lida).length ?? 0

  useEffect(() => {
    function aoClicarFora(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setAberto(false)
    }
    document.addEventListener('mousedown', aoClicarFora)
    return () => document.removeEventListener('mousedown', aoClicarFora)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setAberto((a) => !a)} className="relative rounded-lg p-1.5 text-white/85 transition hover:bg-white/10">
        <Bell className="size-[18px]" />
        {naoLidas > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-red-500 text-[9px] font-bold text-white">
            {naoLidas > 9 ? '9+' : naoLidas}
          </span>
        )}
      </button>

      {aberto && (
        <div className="animate-scale-in absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-mist-100 bg-white text-ink shadow-2xl">
          <div className="flex items-center justify-between border-b border-mist-100 px-4 py-2.5">
            <span className="text-[13px] font-semibold">Notificações</span>
            <button onClick={() => setAberto(false)} className="text-mist-300 hover:text-ink"><X className="size-4" /></button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {(!data || data.length === 0) && <p className="px-4 py-6 text-center text-[12.5px] text-mist-400">Sem notificações.</p>}
            {data?.map((n) => (
              <div key={n.id} className="border-b border-mist-100 px-4 py-3 last:border-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    {n.titulo && <p className="text-[12.5px] font-semibold text-ink">{n.titulo}</p>}
                    <p className="mt-0.5 text-[12px] text-mist-500">{n.mensagem}</p>
                  </div>
                  {n.global === 1 && <Globe className="mt-0.5 size-3 shrink-0 text-mist-300" />}
                </div>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-[10.5px] text-mist-300">{new Date(n.created_at).toLocaleDateString('pt-PT')}</span>
                  {!n.global && !n.lida && (
                    <button onClick={() => marcarLida.mutate(n.id)} className="text-[10.5px] font-medium text-brand-600 hover:underline">
                      Marcar como lida
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
