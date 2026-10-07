import { useEffect, useRef, useState } from 'react'
import { Search, ChevronLeft, ChevronRight, Heart } from 'lucide-react'
import { ProdutoCard } from './ProdutoCard'
import { useFavoritosIds } from '@/hooks/useFavoritos'
import type { Produto } from '@/types/dashboard'

const BANNERS = [
  {
    from: 'from-accent-500', to: 'to-indigo-700',
    tag: 'DISTINTIVOS OFICIAIS', titulo: 'Honra tua Promessa Escutista',
    texto: 'Insígnias, pins e emblemas oficiais.', chips: ['Insígnias', 'Pins'],
  },
  {
    from: 'from-green-600', to: 'to-emerald-700',
    tag: 'UNIFORME OFICIAL', titulo: 'Usa o teu uniforme com orgulho',
    texto: 'Polos, bonés e acessórios oficiais.', chips: ['Polo', 'Boné'],
  },
  {
    from: 'from-orange-500', to: 'to-red-600',
    tag: 'MAIS PROCURADOS', titulo: 'Completa o teu uniforme',
    texto: 'Lenços, cintos e acessórios.', chips: ['Lenço', 'Cinto'],
  },
]

interface Props {
  produtos: Produto[]
  onAdicionar: (produto: Produto) => void
}

export function LojaSection({ produtos, onAdicionar }: Props) {
  const [slide, setSlide] = useState(0)
  const [busca, setBusca] = useState('')
  const [categoriaId, setCategoriaId] = useState<number | null>(null)
  const [sóFavoritos, setSóFavoritos] = useState(false)
  const carrosselRef = useRef<HTMLDivElement>(null)
  const { data: favoritosIds } = useFavoritosIds()

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % BANNERS.length), 5000)
    return () => clearInterval(t)
  }, [])

  function scrollLoja(dir: 1 | -1) {
    const el = carrosselRef.current
    if (!el) return
    const card = el.querySelector('div')
    const largura = card ? card.clientWidth + 24 : 244
    el.scrollBy({ left: dir * largura, behavior: 'smooth' })
  }

  // Categorias derivadas dos produtos activos (não há necessidade de outro
  // pedido ao servidor — a lista já vem com `categoria_id`/`categoria_nome`
  // em cada produto).
  const categorias = Array.from(
    new Map(
      produtos
        .filter((p): p is Produto & { categoria_id: number; categoria_nome: string } => p.categoria_id !== null && p.categoria_nome !== null)
        .map((p) => [p.categoria_id, p.categoria_nome]),
    ),
  )
    .map(([id, nome]) => ({ id, nome }))
    .sort((a, b) => a.nome.localeCompare(b.nome))

  const filtrados = produtos
    .filter((p) => p.nome.toLowerCase().includes(busca.toLowerCase().trim()))
    .filter((p) => categoriaId === null || p.categoria_id === categoriaId)
    .filter((p) => !sóFavoritos || (favoritosIds?.includes(p.id) ?? false))

  return (
    <section id="loja" className="bg-portal-bg py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Slider promocional */}
        <div className="relative mb-6 overflow-hidden rounded-2xl md:mb-8">
          <div className="flex transition-transform duration-700" style={{ transform: `translateX(-${slide * 100}%)` }}>
            {BANNERS.map((b) => (
              <div
                key={b.tag}
                className={`flex min-h-[160px] w-full min-w-full flex-col justify-center bg-gradient-to-r ${b.from} ${b.to} px-4 py-5 text-white md:min-h-[180px] md:px-8 md:py-6`}
              >
                <span className="mb-2 w-fit rounded-full bg-white/20 px-3 py-1 text-[10px] md:text-xs">{b.tag}</span>
                <h2 className="mb-2 text-lg font-bold leading-tight sm:text-xl md:text-2xl">{b.titulo}</h2>
                <p className="mb-3 max-w-xl text-xs text-white/90 sm:text-sm">{b.texto}</p>
                <div className="flex flex-wrap gap-2">
                  {b.chips.map((c) => (
                    <span key={c} className="rounded-full bg-white/10 px-2 py-1 text-[10px] md:text-xs">{c}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => setSlide((s) => (s - 1 + BANNERS.length) % BANNERS.length)} aria-label="Anterior" className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-1.5 text-white backdrop-blur md:p-2">
            <ChevronLeft className="size-4" />
          </button>
          <button onClick={() => setSlide((s) => (s + 1) % BANNERS.length)} aria-label="Seguinte" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-1.5 text-white backdrop-blur md:p-2">
            <ChevronRight className="size-4" />
          </button>
        </div>

        {/* Cabeçalho */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-accent-500">Loja Escutista</span>
            <h2 className="mt-1 font-syne text-3xl font-black text-slate-900">Produtos</h2>
            <p className="text-sm text-mist-400">Equipamento e merchandising oficial dos Escuteiros Católicos de Angola</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-mist-400" />
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Pesquisar produto..."
                className="w-52 rounded-full border border-mist-200 bg-white py-2 pl-9 pr-4 text-sm focus:border-accent-500 focus:outline-none"
              />
            </div>
            <button onClick={() => scrollLoja(-1)} aria-label="Anterior" className="grid size-9 place-items-center rounded-lg border border-mist-200 text-mist-600 transition hover:bg-mist-100">←</button>
            <button onClick={() => scrollLoja(1)} aria-label="Seguinte" className="grid size-9 place-items-center rounded-lg border border-mist-200 text-mist-600 transition hover:bg-mist-100">→</button>
          </div>
        </div>

        {/* Filtro por categoria e favoritos */}
        {(categorias.length > 0 || (favoritosIds && favoritosIds.length > 0)) && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setCategoriaId(null)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                categoriaId === null
                  ? 'bg-brand-600 text-white'
                  : 'border border-mist-200 bg-white text-mist-600 hover:bg-mist-100'
              }`}
            >
              Todos
            </button>
            {categorias.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategoriaId(c.id)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  categoriaId === c.id
                    ? 'bg-brand-600 text-white'
                    : 'border border-mist-200 bg-white text-mist-600 hover:bg-mist-100'
                }`}
              >
                {c.nome}
              </button>
            ))}
            {favoritosIds && favoritosIds.length > 0 && (
              <button
                onClick={() => setSóFavoritos((v) => !v)}
                className={`ml-1 flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  sóFavoritos
                    ? 'bg-red-500 text-white'
                    : 'border border-mist-200 bg-white text-mist-600 hover:bg-mist-100'
                }`}
              >
                <Heart className={`size-3.5 ${sóFavoritos ? 'fill-white' : ''}`} />
                Favoritos
              </button>
            )}
          </div>
        )}

        {filtrados.length === 0 ? (
          <p className="py-10 text-center text-sm text-mist-400">
            {produtos.length === 0 ? 'Nenhum produto disponível de momento.' : 'Nenhum produto encontrado.'}
          </p>
        ) : (
          <div className="overflow-hidden">
            <div ref={carrosselRef} className="no-scrollbar flex gap-6 overflow-x-auto scroll-smooth pb-2">
              {filtrados.map((p, i) => (
                <div key={p.id} className="shrink-0 animate-slide-up" style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}>
                  <ProdutoCard produto={p} onAdicionar={onAdicionar} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
