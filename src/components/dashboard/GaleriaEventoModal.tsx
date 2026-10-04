import { useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Loader2, ChevronLeft, ChevronRight, Images } from 'lucide-react'
import { uploadUrl } from '@/lib/uploads'
import { useGaleriaEvento } from '@/hooks/useGaleriaEvento'
import type { Atividade } from '@/types/dashboard'

interface Props {
  atividade: Atividade
  onClose: () => void
}

/**
 * Galeria de fotos pós-evento — grelha de miniaturas com vista ampliada.
 * Renderizado via portal (mesma razão que ProgramaEventoModal: o
 * AtividadeCard vive dentro de um carrossel com `overflow-hidden`).
 */
export function GaleriaEventoModal({ atividade, onClose }: Props) {
  const { data: fotos, isLoading } = useGaleriaEvento(atividade.id, true)
  const [indiceAmpliado, setIndiceAmpliado] = useState<number | null>(null)

  function anterior() {
    if (!fotos?.length) return
    setIndiceAmpliado((i) => (i === null ? 0 : (i - 1 + fotos.length) % fotos.length))
  }
  function seguinte() {
    if (!fotos?.length) return
    setIndiceAmpliado((i) => (i === null ? 0 : (i + 1) % fotos.length))
  }

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 animate-fade-in" onClick={onClose}>
      <div
        className="relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-mist-100 bg-white px-6 py-4">
          <div>
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-accent-500">
              <Images className="size-3.5" /> Galeria
            </p>
            <h2 className="font-syne text-lg font-bold leading-tight text-slate-900">{atividade.titulo}</h2>
          </div>
          <button onClick={onClose} aria-label="Fechar" className="grid size-8 place-items-center rounded-full text-mist-400 transition hover:bg-mist-100 hover:text-slate-700">
            <X className="size-4" />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-4">
          {isLoading && (
            <div className="flex justify-center py-10"><Loader2 className="size-5 animate-spin text-mist-300" /></div>
          )}
          {!isLoading && (!fotos || fotos.length === 0) && (
            <p className="py-10 text-center text-sm text-mist-400">Ainda não há fotos desta actividade.</p>
          )}
          {fotos && fotos.length > 0 && (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {fotos.map((foto, i) => (
                <button
                  key={foto.id}
                  onClick={() => setIndiceAmpliado(i)}
                  aria-label={`Ver foto ${i + 1}`}
                  className="aspect-square overflow-hidden rounded-lg bg-mist-50 transition hover:opacity-80"
                >
                  <img src={uploadUrl('eventos-galeria', foto.imagem)!} className="size-full object-cover" alt={foto.legenda || ''} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Vista ampliada */}
      {indiceAmpliado !== null && fotos && fotos[indiceAmpliado] && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4"
          onClick={(e) => { e.stopPropagation(); setIndiceAmpliado(null) }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setIndiceAmpliado(null) }}
            aria-label="Fechar"
            className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <X className="size-5" />
          </button>
          {fotos.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); anterior() }}
                aria-label="Foto anterior"
                className="absolute left-4 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); seguinte() }}
                aria-label="Foto seguinte"
                className="absolute right-4 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              >
                <ChevronRight className="size-5" />
              </button>
            </>
          )}
          <div className="flex max-h-full max-w-full flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={uploadUrl('eventos-galeria', fotos[indiceAmpliado].imagem)!}
              className="max-h-[75vh] max-w-full rounded-lg object-contain"
              alt={fotos[indiceAmpliado].legenda || ''}
            />
            {fotos[indiceAmpliado].legenda && (
              <p className="mt-3 text-center text-sm text-white/80">{fotos[indiceAmpliado].legenda}</p>
            )}
          </div>
        </div>
      )}
    </div>,
    document.body,
  )
}
