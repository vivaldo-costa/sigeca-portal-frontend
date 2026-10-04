import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import type { Faq } from '@/types/dashboard'

export function FaqSection({ faqs }: { faqs: Faq[] }) {
  const [aberto, setAberto] = useState<number | null>(null)

  return (
    <section id="faq" className="bg-white py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-12 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-accent-500">Dúvidas</span>
          <h2 className="mt-1 font-syne text-3xl font-black text-slate-900">Perguntas Frequentes</h2>
        </div>

        {faqs.length === 0 ? (
          <p className="text-center text-mist-300">Nenhuma pergunta disponível.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {faqs.map((f, i) => {
              const open = aberto === i
              return (
                <ScrollReveal key={i} atraso={Math.min(i, 8) * 40}>
                  <div
                    onClick={() => setAberto(open ? null : i)}
                    className="cursor-pointer rounded-xl border border-mist-100 p-5 transition hover:shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-syne text-sm font-semibold text-slate-800">{f.pergunta}</h3>
                      <ChevronDown className={`size-3.5 shrink-0 text-mist-400 transition-transform ${open ? 'rotate-180' : ''}`} />
                    </div>
                    {open && (
                      <p className="mt-3 animate-slide-down whitespace-pre-line text-sm leading-relaxed text-mist-600">{f.resposta}</p>
                    )}
                  </div>
                </ScrollReveal>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
