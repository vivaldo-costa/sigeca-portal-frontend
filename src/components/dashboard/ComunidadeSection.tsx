import { useEffect, useState } from 'react'
import {
  CalendarCheck, GraduationCap, IdCard, FileText, Vote, ShoppingBag,
  ChevronLeft, ChevronRight, Calendar, ShoppingBasket,
} from 'lucide-react'
import type { UtilizadorAvatar } from '@/types/dashboard'
import { uploadUrl } from '@/lib/uploads'
import { useCountUp } from '@/hooks/useCountUp'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

const FUNCIONALIDADES = [
  { icon: CalendarCheck, titulo: 'Actividades & Eventos', desc: 'Inscreve-te em acampamentos, retiros e actividades da tua secção.' },
  { icon: GraduationCap, titulo: 'Formações', desc: 'Acede a cursos e formações escutistas certificados pela AECA.' },
  { icon: IdCard, titulo: 'Cartão Digital', desc: 'O teu documento de identificação oficial, sempre à mão.' },
  { icon: FileText, titulo: 'Documentos', desc: 'Baixa declarações, certificados e formulários oficiais.' },
  { icon: Vote, titulo: 'Votações', desc: 'Participa nas decisões da associação de forma democrática.' },
  { icon: ShoppingBag, titulo: 'Loja Escutista', desc: 'Equipamento e merchandising oficial com entrega ao domicílio.' },
]

interface Props {
  totalUtilizadores: number
  avatares: UtilizadorAvatar[]
  stats: { eventos: number; formacoes: number; produtos: number }
}

export function ComunidadeSection({ totalUtilizadores, avatares, stats }: Props) {
  const [indice, setIndice] = useState(0)
  const itensPorSlide = 2
  const maxIndice = Math.max(0, FUNCIONALIDADES.length - itensPorSlide)

  useEffect(() => {
    const t = setInterval(() => setIndice((i) => (i >= maxIndice ? 0 : i + 1)), 4000)
    return () => clearInterval(t)
  }, [maxIndice])

  return (
    <section id="comunidade" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          {/* Texto + carrossel de funcionalidades */}
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-accent-500">Comunidade SIGECA</span>
            <h2 className="text-4xl font-bold leading-tight text-slate-900">
              Conecta-te com mais de <span className="text-accent-500">{totalUtilizadores.toLocaleString('pt-PT')}+</span> escuteiros
            </h2>
            <p className="text-base leading-relaxed text-slate-600">
              O SIGECA é a plataforma digital oficial dos Escuteiros Católicos de Angola. Aqui
              encontras tudo o que precisas para viver o escutismo no século XXI:
            </p>

            <div className="relative overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${indice * 50}%)` }}
              >
                {FUNCIONALIDADES.map(({ icon: Icon, titulo, desc }) => (
                  <div key={titulo} className="w-full shrink-0 px-2 md:w-1/2">
                    <div className="flex h-full items-start gap-3 rounded-2xl bg-mist-50 p-4">
                      <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-500/10">
                        <Icon className="size-4 text-accent-500" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{titulo}</p>
                        <p className="mt-1 text-xs text-slate-500">{desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setIndice((i) => (i <= 0 ? maxIndice : i - 1))}
                aria-label="Anterior"
                className="absolute left-0 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white shadow"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                onClick={() => setIndice((i) => (i >= maxIndice ? 0 : i + 1))}
                aria-label="Seguinte"
                className="absolute right-0 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white shadow"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>

          {/* Avatares + stats */}
          <div className="space-y-6">
            <div className="space-y-4 rounded-3xl border border-accent-500/10 bg-gradient-to-br from-accent-500/5 to-indigo-50 p-8 text-center">
              <div className="flex -space-x-4 justify-center">
                {avatares.map((u, i) => (
                  <img
                    key={i}
                    className="size-10 animate-scale-in rounded-full border-4 border-white object-cover shadow-md"
                    style={{ animationDelay: `${i * 80}ms` }}
                    src={u.foto ? uploadUrl('avatar', u.foto)! : `https://ui-avatars.com/api/?name=${encodeURIComponent(u.nome)}&background=6C5CE7&color=fff`}
                    alt={u.nome}
                  />
                ))}
                <div className="grid size-10 place-items-center rounded-full border-4 border-white bg-accent-500 text-xs font-bold text-white shadow-md">
                  +{Math.max(0, totalUtilizadores - avatares.length)}
                </div>
              </div>
              <p className="text-sm text-slate-600">
                Junta-te a <strong>{totalUtilizadores.toLocaleString('pt-PT')}</strong> escuteiros activos em todo Angola
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <StatCard icon={Calendar} valor={stats.eventos} label="Actividades" />
              <StatCard icon={GraduationCap} valor={stats.formacoes} label="Formações" />
              <StatCard icon={ShoppingBasket} valor={stats.produtos} label="Produtos na loja" />
            </div>
          </div>
        </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

function StatCard({ icon: Icon, valor, label }: { icon: typeof Calendar; valor: number; label: string }) {
  const { valor: contado, ref } = useCountUp(valor)
  return (
    <div className="rounded-2xl border border-mist-100 bg-white p-4 text-center shadow-sm">
      <Icon className="mx-auto mb-2 size-5 text-accent-500" />
      <p ref={ref as React.RefObject<HTMLParagraphElement>} className="text-2xl font-bold text-slate-900">{contado}+</p>
      <p className="mt-0.5 text-xs text-slate-500">{label}</p>
    </div>
  )
}
