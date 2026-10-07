import { useRef, useState } from 'react'
import { Play, X } from 'lucide-react'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import logo from '@/assets/sigeca-logo.svg'

interface Tutorial {
  titulo: string
  duracao: string
  ficheiro: string
}

const VIDEOS: Tutorial[] = [
  { titulo: 'Como iniciar sessão?', duracao: '3:24', ficheiro: 'SIGECA_Iniciar_Sessao.mp4' },
  { titulo: 'Como validar numa actividade?', duracao: '2:58', ficheiro: 'confirmar_actividade.mp4' },
  { titulo: 'Como gerar e descarregar documentos?', duracao: '2:10', ficheiro: 'SIGECA_documentos.mp4' },
  { titulo: 'Como usar a loja e fazer compras?', duracao: '2:10', ficheiro: 'SIGECA_compras.mp4' },
]

export function AprenderSection() {
  const [aberto, setAberto] = useState<Tutorial | null>(null)
  const carrosselRef = useRef<HTMLDivElement>(null)

  function scroll(dir: 1 | -1) {
    const el = carrosselRef.current
    if (!el) return
    const card = el.querySelector('div')
    el.scrollBy({ left: dir * ((card?.clientWidth ?? 300) + 24), behavior: 'smooth' })
  }

  return (
    <section id="aprender" className="bg-portal-bg py-20">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-accent-500">Tutoriais</span>
            <h2 className="mt-1 font-syne text-3xl font-black text-slate-900">Aprender a usar o SIGECA</h2>
            <p className="text-sm text-mist-400">Guias em vídeo para tirar o máximo partido da plataforma.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => scroll(-1)} aria-label="Anterior" className="grid size-9 place-items-center rounded-lg border border-mist-200 text-mist-600 transition hover:bg-mist-100">←</button>
            <button onClick={() => scroll(1)} aria-label="Seguinte" className="grid size-9 place-items-center rounded-lg border border-mist-200 text-mist-600 transition hover:bg-mist-100">→</button>
          </div>
        </div>

        <div className="overflow-hidden">
          <div ref={carrosselRef} className="no-scrollbar flex gap-6 overflow-x-auto scroll-smooth pb-2">
            {VIDEOS.map((v, i) => (
              <div key={v.ficheiro} className="w-[300px] shrink-0 animate-slide-up overflow-hidden rounded-2xl border border-mist-100 bg-white shadow-sm transition hover:shadow-md" style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}>
                <button
                  onClick={() => setAberto(v)}
                  className="group relative block h-44 w-full"
                  aria-label={`Reproduzir: ${v.titulo}`}
                >
                  <img src={logo} className="size-full bg-mist-100 object-contain p-8" alt="" loading="lazy" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition group-hover:bg-black/50">
                    <div className="grid size-14 place-items-center rounded-full bg-white/90 shadow-lg transition group-hover:scale-110">
                      <Play className="ml-0.5 size-5 text-brand-600" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-0.5 font-mono text-[10px] text-white">
                    {v.duracao}
                  </span>
                </button>
                <div className="p-4">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-accent-500">Tutorial {i + 1}</span>
                  <h3 className="mt-1 font-syne text-sm font-bold text-slate-800">{v.titulo}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
        </ScrollReveal>
      </div>

      {aberto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 animate-fade-in"
          onClick={() => setAberto(null)}
        >
          <div className="w-full max-w-4xl overflow-hidden rounded-3xl bg-white animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-mist-100 px-6 py-4">
              <h3 className="text-lg font-bold text-ink">{aberto.titulo}</h3>
              <button onClick={() => setAberto(null)} aria-label="Fechar" className="text-mist-400 transition hover:text-error-text">
                <X className="size-6" />
              </button>
            </div>
            <div className="bg-black p-2">
              <video controls autoPlay className="w-full rounded-2xl">
                <source src={`/src/videos/${aberto.ficheiro}`} type="video/mp4" />
                O teu navegador não suporta a reprodução de vídeo.
              </video>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
