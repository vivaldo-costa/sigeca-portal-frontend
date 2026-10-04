import { useState } from 'react'
import { createPortal } from 'react-dom'
import { X, ShoppingCart, Ban, ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { uploadUrl } from '@/lib/uploads'
import { ProdutoAvaliacoes } from './ProdutoAvaliacoes'
import type { Produto } from '@/types/dashboard'

interface Props {
  produto: Produto
  onClose: () => void
  onAdicionar: (produto: Produto) => void
}

/**
 * Modal de "vista rápida" do produto — não existe página de detalhe dedicada
 * no Portal, por isso este modal cobre esse papel: imagem grande com zoom,
 * tira de miniaturas (quando há galeria) e a mesma acção de adicionar ao
 * carrinho já usada no ProdutoCard.
 */
export function ProdutoModalDetalhe({ produto, onClose, onAdicionar }: Props) {
  const fotos = produto.imagens.length > 0 ? produto.imagens : produto.imagem ? [produto.imagem] : []
  const [indice, setIndice] = useState(0)
  const disponivel = produto.stock > 0
  const fotoAtual = fotos[indice]

  function anterior() {
    setIndice((i) => (i - 1 + fotos.length) % fotos.length)
  }
  function seguinte() {
    setIndice((i) => (i + 1) % fotos.length)
  }

  // Renderizado via portal directamente em document.body: o card do produto
  // (ProdutoCard) e o carrossel da Loja têm `overflow-hidden` em vários
  // níveis (para os cantos arredondados e o scroll horizontal), o que
  // recorta este modal — mesmo sendo `position: fixed` — se ele ficar
  // dentro dessa árvore do DOM. Fora dela, cobre o ecrã inteiro como deve.
  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 animate-fade-in" onClick={onClose}>
      <div
        className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-y-auto rounded-2xl bg-white shadow-2xl sm:flex-row sm:overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-3 top-3 z-10 grid size-8 place-items-center rounded-full bg-white/90 text-slate-600 shadow transition hover:bg-white"
        >
          <X className="size-4" />
        </button>

        {/* Imagem principal + miniaturas */}
        <div className="flex w-full shrink-0 flex-col bg-mist-50 p-6 sm:w-1/2">
          <div className="relative flex flex-1 items-center justify-center overflow-hidden">
            {fotoAtual ? (
              <img
                src={uploadUrl('produtos', fotoAtual)!}
                alt={produto.nome}
                className="mx-auto h-64 w-full cursor-zoom-in object-contain transition-transform duration-300 hover:scale-110 sm:h-80"
              />
            ) : (
              <div className="grid h-64 w-full place-items-center text-sm text-mist-300 sm:h-80">Sem imagem</div>
            )}
            {fotos.length > 1 && (
              <>
                <button
                  onClick={anterior}
                  aria-label="Foto anterior"
                  className="absolute left-0 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-slate-600 shadow transition hover:bg-white"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  onClick={seguinte}
                  aria-label="Foto seguinte"
                  className="absolute right-0 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-slate-600 shadow transition hover:bg-white"
                >
                  <ChevronRight className="size-4" />
                </button>
              </>
            )}
          </div>

          {fotos.length > 1 && (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {fotos.map((foto, i) => (
                <button
                  key={`${foto}-${i}`}
                  onClick={() => setIndice(i)}
                  aria-label={`Ver foto ${i + 1}`}
                  className={`size-12 shrink-0 overflow-hidden rounded-lg border-2 bg-white transition ${
                    i === indice ? 'border-brand-600' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={uploadUrl('produtos', foto)!} className="size-full object-contain p-1" alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detalhes e acção */}
        <div className="flex w-full flex-col p-6 sm:w-1/2 sm:overflow-y-auto">
          {produto.etiqueta && (
            <span className="mb-2 w-fit rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-bold text-white">
              {produto.etiqueta}
            </span>
          )}
          <h2 className="font-syne text-xl font-bold leading-tight text-slate-900">{produto.nome}</h2>
          {produto.avaliacao_total > 0 && (
            <div className="mt-1.5 flex items-center gap-1.5">
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-semibold text-slate-700">{produto.avaliacao_media?.toFixed(1)}</span>
              <span className="text-xs text-mist-400">({produto.avaliacao_total} avaliações)</span>
            </div>
          )}
          {produto.descricao && <p className="mt-2 text-sm leading-relaxed text-mist-500">{produto.descricao}</p>}

          <div className="mt-4 flex items-baseline gap-2">
            {produto.preco_antigo && (
              <span className="text-sm text-mist-400 line-through">
                {produto.preco_antigo.toLocaleString('pt-PT', { minimumFractionDigits: 2 })} Kz
              </span>
            )}
            <span className="text-2xl font-black text-slate-900">
              {produto.preco.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-sm text-mist-500">Kz</span>
          </div>

          <p className={`mt-2 text-xs font-semibold ${disponivel ? 'text-emerald-600' : 'text-red-500'}`}>
            {disponivel ? `Stock: ${produto.stock}` : 'Esgotado'}
          </p>

          <div className="mt-6 sm:mt-auto">
            {disponivel ? (
              <button
                onClick={() => {
                  onAdicionar(produto)
                  onClose()
                }}
                className="flex w-full items-center justify-center gap-1.5 rounded-full bg-brand-600 py-3 text-sm font-bold text-white transition hover:bg-brand-700 active:scale-95"
              >
                <ShoppingCart className="size-4" /> Adicionar ao carrinho
              </button>
            ) : (
              <button
                disabled
                className="flex w-full cursor-not-allowed items-center justify-center gap-1.5 rounded-full bg-mist-200 py-3 text-sm font-bold text-mist-400"
              >
                <Ban className="size-4" /> Esgotado
              </button>
            )}
          </div>

          <ProdutoAvaliacoes produtoId={produto.id} ativo={true} />
        </div>
      </div>
    </div>,
    document.body,
  )
}
