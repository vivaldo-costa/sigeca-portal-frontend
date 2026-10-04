import { useState } from 'react'
import { ShoppingCart, Ban, ZoomIn, Heart, Star } from 'lucide-react'
import { uploadUrl } from '@/lib/uploads'
import { ProdutoModalDetalhe } from './ProdutoModalDetalhe'
import { useFavoritosIds, useToggleFavorito } from '@/hooks/useFavoritos'
import type { Produto } from '@/types/dashboard'

interface Props {
  produto: Produto
  onAdicionar: (produto: Produto) => void
}

export function ProdutoCard({ produto, onAdicionar }: Props) {
  const [detalheAberto, setDetalheAberto] = useState(false)
  const disponivel = produto.stock > 0
  const { data: favoritosIds } = useFavoritosIds()
  const toggleFavorito = useToggleFavorito()
  const favorito = favoritosIds?.includes(produto.id) ?? false

  return (
    <div className="group w-[220px] shrink-0 overflow-hidden rounded-2xl border border-mist-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl">
      <div className="relative aspect-square bg-mist-50">
        {produto.etiqueta && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-bold text-white">
            {produto.etiqueta}
          </span>
        )}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); toggleFavorito.mutate({ produtoId: produto.id, favorito }) }}
          disabled={toggleFavorito.isPending}
          aria-label={favorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          aria-pressed={favorito}
          className="absolute right-3 top-3 z-10 grid size-8 place-items-center rounded-full bg-white/90 text-slate-500 shadow transition hover:scale-110 hover:text-red-500"
        >
          <Heart className={`size-4 ${favorito ? 'fill-red-500 text-red-500' : ''}`} />
        </button>
        <button
          type="button"
          onClick={() => setDetalheAberto(true)}
          aria-label={`Ver fotos de ${produto.nome}`}
          className="grid size-full cursor-zoom-in place-items-center p-4"
        >
          <img
            src={uploadUrl('produtos', produto.imagem) ?? '/placeholder.png'}
            className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110"
            alt={produto.nome}
          />
        </button>
        <span className="pointer-events-none absolute bottom-2 right-2 grid size-7 place-items-center rounded-full bg-white/90 text-slate-500 opacity-0 shadow transition group-hover:opacity-100">
          <ZoomIn className="size-3.5" />
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-semibold text-emerald-600">Stock: {produto.stock}</p>
          {produto.avaliacao_total > 0 && (
            <div className="flex items-center gap-0.5">
              <Star className="size-3 fill-amber-400 text-amber-400" />
              <span className="text-[10px] font-semibold text-mist-500">{produto.avaliacao_media?.toFixed(1)}</span>
            </div>
          )}
        </div>
        <h3 className="mt-1 min-h-[2.5rem] font-syne text-sm font-bold leading-tight text-slate-800 line-clamp-2">
          {produto.nome}
        </h3>
        <div className="mt-2 flex items-baseline gap-1.5">
          {produto.preco_antigo && (
            <span className="text-xs text-mist-400 line-through">
              {produto.preco_antigo.toLocaleString('pt-PT', { minimumFractionDigits: 2 })} Kz
            </span>
          )}
          <span className="text-base font-black text-slate-900">
            {produto.preco.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-xs text-mist-500">Kz</span>
        </div>

        {disponivel ? (
          <button
            onClick={() => onAdicionar(produto)}
            className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-full bg-brand-600 py-2.5 text-xs font-bold text-white transition hover:bg-brand-700 active:scale-95"
          >
            <ShoppingCart className="size-3.5" /> Adicionar
          </button>
        ) : (
          <button disabled className="mt-4 flex w-full cursor-not-allowed items-center justify-center gap-1.5 rounded-full bg-mist-200 py-2.5 text-xs font-bold text-mist-400">
            <Ban className="size-3.5" /> Esgotado
          </button>
        )}
      </div>

      {detalheAberto && (
        <ProdutoModalDetalhe produto={produto} onClose={() => setDetalheAberto(false)} onAdicionar={onAdicionar} />
      )}
    </div>
  )
}
