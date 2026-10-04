import { useState } from 'react'
import { Star, Loader2, Trash2 } from 'lucide-react'
import { useAvaliacoesDoProduto, useGuardarAvaliacao, useMinhaAvaliacao, useRemoverAvaliacao } from '@/hooks/useAvaliacoes'

interface Props {
  produtoId: number
  ativo: boolean
}

function Estrelas({ nota, tamanho = 'size-4' }: { nota: number; tamanho?: string }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={`${tamanho} ${n <= Math.round(nota) ? 'fill-amber-400 text-amber-400' : 'text-mist-200'}`} />
      ))}
    </div>
  )
}

function SeletorEstrelas({ valor, onChange }: { valor: number; onChange: (n: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-label={`${n} estrela${n > 1 ? 's' : ''}`}
          className="transition hover:scale-110"
        >
          <Star className={`size-6 ${n <= valor ? 'fill-amber-400 text-amber-400' : 'text-mist-200'}`} />
        </button>
      ))}
    </div>
  )
}

/**
 * Avaliações do produto — lista pública + formulário de "a minha avaliação"
 * (uma por sócio por produto, ver UNIQUE na migração). `ativo` controla se as
 * queries disparam: só quando o modal de detalhe está mesmo aberto.
 */
export function ProdutoAvaliacoes({ produtoId, ativo }: Props) {
  const { data: avaliacoes, isLoading } = useAvaliacoesDoProduto(produtoId, ativo)
  const { data: minha } = useMinhaAvaliacao(produtoId, ativo)
  const guardar = useGuardarAvaliacao(produtoId)
  const remover = useRemoverAvaliacao(produtoId)

  const [aEditar, setAEditar] = useState(false)
  const [nota, setNota] = useState(0)
  const [comentario, setComentario] = useState('')

  function iniciarEdicao() {
    setNota(minha?.nota ?? 0)
    setComentario(minha?.comentario ?? '')
    setAEditar(true)
  }

  function submeter() {
    if (nota < 1) return
    guardar.mutate({ nota, comentario }, { onSuccess: () => setAEditar(false) })
  }

  const media = avaliacoes && avaliacoes.length > 0
    ? avaliacoes.reduce((s, a) => s + a.nota, 0) / avaliacoes.length
    : 0

  return (
    <div className="mt-6 border-t border-mist-100 pt-5">
      <div className="flex items-center justify-between">
        <h3 className="font-syne text-sm font-bold text-slate-800">Avaliações</h3>
        {avaliacoes && avaliacoes.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-mist-500">
            <Estrelas nota={media} />
            <span className="font-semibold text-slate-700">{media.toFixed(1)}</span>
            <span>({avaliacoes.length})</span>
          </div>
        )}
      </div>

      {isLoading ? (
        <p className="mt-3 text-xs text-mist-400">A carregar avaliações…</p>
      ) : avaliacoes && avaliacoes.length > 0 ? (
        <ul className="mt-3 max-h-40 space-y-3 overflow-y-auto pr-1">
          {avaliacoes.map((a) => (
            <li key={a.id} className="text-xs">
              <div className="flex items-center gap-2">
                <Estrelas nota={a.nota} tamanho="size-3" />
                <span className="font-semibold text-slate-700">{a.utilizador_nome}</span>
                {!!a.compra_verificada && (
                  <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600">Compra verificada</span>
                )}
              </div>
              {a.comentario && <p className="mt-1 leading-relaxed text-mist-500">{a.comentario}</p>}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-xs text-mist-400">Ainda sem avaliações — sê o primeiro a avaliar.</p>
      )}

      {/* A minha avaliação */}
      <div className="mt-4 rounded-xl bg-mist-50 p-3">
        {!aEditar ? (
          minha ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-mist-400">A tua avaliação</p>
                <Estrelas nota={minha.nota} tamanho="size-3.5" />
              </div>
              <div className="flex gap-2">
                <button onClick={iniciarEdicao} className="text-xs font-semibold text-brand-600 hover:underline">Editar</button>
                <button
                  onClick={() => remover.mutate()}
                  disabled={remover.isPending}
                  aria-label="Remover avaliação"
                  className="text-mist-400 hover:text-red-500"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <button onClick={iniciarEdicao} className="text-xs font-semibold text-brand-600 hover:underline">
              Avaliar este produto
            </button>
          )
        ) : (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-mist-400">A tua avaliação</p>
            <div className="mt-1.5">
              <SeletorEstrelas valor={nota} onChange={setNota} />
            </div>
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Comentário (opcional)"
              rows={2}
              className="mt-2 w-full rounded-lg border border-mist-200 p-2 text-xs focus:border-accent-500 focus:outline-none"
            />
            <div className="mt-2 flex gap-2">
              <button
                onClick={submeter}
                disabled={nota < 1 || guardar.isPending}
                className="flex items-center gap-1.5 rounded-full bg-brand-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-brand-700 disabled:opacity-50"
              >
                {guardar.isPending && <Loader2 className="size-3 animate-spin" />} Guardar
              </button>
              <button onClick={() => setAEditar(false)} className="rounded-full px-3 py-1.5 text-xs font-semibold text-mist-500 hover:bg-mist-100">
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
