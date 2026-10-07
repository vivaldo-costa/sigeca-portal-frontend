import { useRef, useState } from 'react'
import { FileText, IdCard, Lock, Loader2 } from 'lucide-react'
import { cn } from '@/lib/cn'
import { getApiErrorMessage } from '@/lib/api'
import { notificar } from '@/lib/notificar'
import { baixarFicheiroProtegido } from '@/lib/download'
import { NotificacoesLocais } from '@/components/notificacoes/NotificacoesLocais'
import type { Cartao } from '@/types/dashboard'

interface DocDef {
  titulo: string
  desc: string
  icon: typeof FileText
  cor: string
  url: string | null
  nomeFicheiro: string
  label: string
  ativo: boolean
}

/**
 * ⚠️ Backend ainda não implementado: não há módulos `documentos` nem
 * `cartao` nas rotas da API Node (só existem em rascunho de planeamento).
 * Os caminhos abaixo são relativos — passam pelo cliente `api` (que já
 * anexa o Bearer token) via `baixarFicheiroProtegido`, ao contrário de
 * downloads directos por `<a href>`, que não enviariam o token.
 */
function useDocumentos(cartao: Cartao | null, utilizadorId: number): DocDef[] {
  return [
    {
      titulo: 'Declaração de Membro',
      desc: 'Declara a tua filiação activa nos Escuteiros Católicos de Angola.',
      icon: FileText,
      cor: 'bg-blue-50 text-blue-700',
      url: `/documentos/declaracao?id=${utilizadorId}`,
      nomeFicheiro: 'declaracao-membro.pdf',
      label: 'Gerar PDF',
      ativo: true,
    },
    {
      titulo: 'Cartão de Identificação',
      desc: 'O teu cartão escutista oficial em formato PDF para impressão.',
      icon: IdCard,
      cor: 'bg-purple-50 text-purple-700',
      url: cartao ? `/cartao/pdf?id=${utilizadorId}` : null,
      nomeFicheiro: 'cartao-sigeca.pdf',
      label: cartao ? 'Descarregar PDF' : 'Gerar cartão primeiro',
      ativo: !!cartao,
    },
    {
      titulo: 'Ficha de Dados Pessoais',
      desc: 'Resumo completo dos teus dados escutistas registados no SIGECA.',
      icon: FileText,
      cor: 'bg-orange-50 text-orange-700',
      url: `/documentos/ficha?id=${utilizadorId}`,
      nomeFicheiro: 'ficha-dados-pessoais.pdf',
      label: 'Gerar PDF',
      ativo: true,
    },
  ]
}

export function DocumentosSection({ cartao, utilizadorId }: { cartao: Cartao | null; utilizadorId: number }) {
  const documentos = useDocumentos(cartao, utilizadorId)
  const carrosselRef = useRef<HTMLDivElement>(null)

  function scroll(dir: 1 | -1) {
    const el = carrosselRef.current
    if (!el) return
    const card = el.querySelector('div')
    el.scrollBy({ left: dir * ((card?.clientWidth ?? 240) + 20), behavior: 'smooth' })
  }

  return (
    <section id="documentos" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <NotificacoesLocais local="documentos" />
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-accent-500">Documentos</span>
            <h2 className="mt-1 font-syne text-3xl font-black text-slate-900">Os teus documentos</h2>
            <p className="text-sm text-mist-400">Gera e descarrega documentos oficiais da AECA.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => scroll(-1)} aria-label="Anterior" className="grid size-9 place-items-center rounded-lg border border-mist-200 text-mist-600 transition hover:bg-mist-100">←</button>
            <button onClick={() => scroll(1)} aria-label="Seguinte" className="grid size-9 place-items-center rounded-lg border border-mist-200 text-mist-600 transition hover:bg-mist-100">→</button>
          </div>
        </div>

        <div className="overflow-hidden">
          <div ref={carrosselRef} className="no-scrollbar flex gap-5 overflow-x-auto scroll-smooth pb-2">
            {documentos.map((doc, i) => (
              <div key={doc.titulo} className="shrink-0 animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
                <DocumentoCard doc={doc} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function DocumentoCard({ doc }: { doc: DocDef }) {
  const [baixando, setBaixando] = useState(false)
  const Icon = doc.icon

  async function baixar() {
    if (!doc.ativo || !doc.url) return
    setBaixando(true)
    try {
      await baixarFicheiroProtegido(doc.url, doc.nomeFicheiro)
    } catch (err) {
      notificar.erro(getApiErrorMessage(err, 'Não foi possível descarregar o documento.'))
    } finally {
      setBaixando(false)
    }
  }

  return (
    <div className="flex w-[240px] shrink-0 flex-col rounded-2xl border border-mist-100 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className={cn('mb-4 grid size-12 place-items-center rounded-2xl text-xl', doc.cor)}>
        <Icon className="size-5" />
      </div>
      <h3 className="mb-2 font-syne text-sm font-bold text-slate-900">{doc.titulo}</h3>
      <p className="flex-1 text-xs leading-relaxed text-mist-400">{doc.desc}</p>

      {doc.ativo ? (
        <button
          onClick={baixar}
          disabled={baixando}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 py-2.5 text-xs font-bold text-white transition hover:bg-brand-700 disabled:opacity-70"
        >
          {baixando ? <Loader2 className="size-3.5 animate-spin" /> : <FileText className="size-3.5" />}
          {baixando ? 'A preparar…' : doc.label}
        </button>
      ) : (
        <button disabled className="mt-5 inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-mist-100 py-2.5 text-xs font-bold text-mist-400">
          <Lock className="size-3.5" /> {doc.label}
        </button>
      )}
    </div>
  )
}
