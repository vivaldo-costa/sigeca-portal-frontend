import { useRef, useState, type PointerEvent as PE } from 'react'
import { ChevronLeft, ChevronRight, Maximize2, X, ZoomIn, ZoomOut, Rotate3d } from 'lucide-react'
import { uploadUrl } from '@/lib/uploads'

/**
 * Apresentação "de estúdio" das fotos do produto (inspirada nas lojas de
 * desporto): fundo neutro com sombra no chão, inclinação 3D a seguir o rato,
 * zoom ao clicar (a lupa segue o cursor), arrastar para rodar entre as fotos
 * (vista 360° quando há várias) e ecrã inteiro.
 */
export function VisualizadorProduto({ fotos, nome }: { fotos: string[]; nome: string }) {
  const [indice, setIndice] = useState(0)
  const [zoom, setZoom] = useState(false)
  const [origem, setOrigem] = useState('50% 50%')
  const [inclinacao, setInclinacao] = useState({ x: 0, y: 0 })
  const [ecraInteiro, setEcraInteiro] = useState(false)
  const arrasto = useRef<{ x: number; indice: number; moveu: boolean } | null>(null)
  const palco = useRef<HTMLDivElement>(null)

  const total = fotos.length
  const ir = (i: number) => setIndice(((i % total) + total) % total)

  function aoMover(e: PE<HTMLDivElement>) {
    const r = palco.current?.getBoundingClientRect()
    if (!r) return
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    setOrigem(`${(px * 100).toFixed(1)}% ${(py * 100).toFixed(1)}%`)
    if (!zoom) setInclinacao({ x: (0.5 - py) * 10, y: (px - 0.5) * 14 })
    // Arrastar na horizontal roda entre as fotos (cada ~60px = uma foto)
    if (arrasto.current && total > 1 && !zoom) {
      const passos = Math.trunc((e.clientX - arrasto.current.x) / 60)
      if (passos !== 0) { arrasto.current.moveu = true; ir(arrasto.current.indice - passos) }
    }
  }

  if (total === 0) {
    return <div className="grid aspect-square w-full place-items-center rounded-2xl bg-mist-50 text-sm text-mist-300">Sem imagem</div>
  }

  const conteudo = (
    <div className={ecraInteiro ? 'flex h-full w-full flex-col items-center justify-center gap-4' : 'w-full'}>
      <div
        ref={palco}
        onPointerMove={aoMover}
        onPointerDown={(e) => { arrasto.current = { x: e.clientX, indice, moveu: false } }}
        onPointerUp={() => {
          const moveu = arrasto.current?.moveu
          arrasto.current = null
          if (!moveu) setZoom((z) => !z)
        }}
        onPointerLeave={() => { arrasto.current = null; setInclinacao({ x: 0, y: 0 }); setZoom(false) }}
        className={`relative mx-auto aspect-square w-full select-none overflow-hidden rounded-2xl ${zoom ? 'cursor-zoom-out' : total > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'} ${ecraInteiro ? 'max-h-[80vh] max-w-[80vh]' : ''}`}
        style={{ background: 'radial-gradient(circle at 50% 35%, #ffffff 0%, #f3f5f8 55%, #e6e9ef 100%)', perspective: '900px', touchAction: 'pan-y' }}
      >
        {/* sombra no "chão" do estúdio */}
        <div className="pointer-events-none absolute bottom-[9%] left-1/2 h-[7%] w-[58%] -translate-x-1/2 rounded-[50%] bg-black/15 blur-md" />
        <img
          src={uploadUrl('produtos', fotos[indice])!}
          alt={`${nome} — foto ${indice + 1} de ${total}`}
          draggable={false}
          className="absolute inset-0 m-auto h-[82%] w-[82%] object-contain drop-shadow-[0_18px_22px_rgba(15,23,42,0.18)] transition-transform duration-200 ease-out"
          style={{
            transformOrigin: origem,
            transform: zoom ? 'scale(2.3)' : `rotateX(${inclinacao.x}deg) rotateY(${inclinacao.y}deg) scale(1.02)`,
          }}
        />
        {total > 1 && (
          <>
            <button type="button" onPointerDown={(e) => e.stopPropagation()} onPointerUp={(e) => e.stopPropagation()} onClick={() => ir(indice - 1)}
              aria-label="Foto anterior" className="absolute left-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-slate-600 shadow hover:bg-white">
              <ChevronLeft className="size-4" />
            </button>
            <button type="button" onPointerDown={(e) => e.stopPropagation()} onPointerUp={(e) => e.stopPropagation()} onClick={() => ir(indice + 1)}
              aria-label="Foto seguinte" className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-slate-600 shadow hover:bg-white">
              <ChevronRight className="size-4" />
            </button>
          </>
        )}
        <div className="pointer-events-none absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-white/85 px-2 py-1 text-[10.5px] font-medium text-slate-600 shadow">
          {zoom ? <><ZoomOut className="size-3" /> Clica para afastar</> : total > 1 ? <><Rotate3d className="size-3" /> Arrasta para rodar · clica para ampliar</> : <><ZoomIn className="size-3" /> Clica para ampliar</>}
        </div>
        <button type="button" onPointerDown={(e) => e.stopPropagation()} onPointerUp={(e) => e.stopPropagation()} onClick={() => setEcraInteiro((v) => !v)}
          aria-label={ecraInteiro ? 'Sair do ecrã inteiro' : 'Ecrã inteiro'} className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-white/90 text-slate-600 shadow hover:bg-white">
          {ecraInteiro ? <X className="size-4" /> : <Maximize2 className="size-4" />}
        </button>
      </div>

      {total > 1 && (
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {fotos.map((foto, i) => (
            <button key={`${foto}-${i}`} type="button" onClick={() => ir(i)} aria-label={`Ver foto ${i + 1}`}
              className={`size-12 shrink-0 overflow-hidden rounded-lg border-2 bg-white transition ${i === indice ? 'border-brand-600' : 'border-transparent opacity-70 hover:opacity-100'}`}>
              <img src={uploadUrl('produtos', foto)!} className="size-full object-contain p-1" alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  )

  return ecraInteiro ? (
    <div className="fixed inset-0 z-[70] bg-white p-4" onClick={(e) => e.stopPropagation()}>{conteudo}</div>
  ) : conteudo
}
