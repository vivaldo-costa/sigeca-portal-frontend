import type { ReactNode } from 'react'
import { AlertTriangle, ArrowRight, Calendar } from 'lucide-react'
import type { TimelineEvento } from '@/types/perfil'

const ESTADO_TRANSFERENCIA: Record<string, { cor: string; label: string }> = {
  PENDENTE: { cor: 'bg-amber-50 text-amber-700', label: 'Pendente' },
  APROVADA: { cor: 'bg-teal-50 text-teal-700', label: 'Aprovada' },
  REJEITADA: { cor: 'bg-red-50 text-red-700', label: 'Rejeitada' },
  CANCELADA: { cor: 'bg-slate-100 text-slate-500', label: 'Cancelada' },
}

function fmtData(d: string) {
  const dt = new Date(d.replace(' ', 'T'))
  return isNaN(dt.getTime()) ? d : dt.toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' })
}

interface Props {
  isLoading: boolean
  isError: boolean
  eventos: TimelineEvento[] | undefined
}

export function PercursoTimeline({ isLoading, isError, eventos }: Props) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="size-8 animate-spin rounded-full border-4 border-mist-200 border-t-brand-600" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="py-12 text-center">
        <AlertTriangle className="mx-auto mb-2 size-6 text-amber-400" />
        <p className="text-sm text-mist-400">Não foi possível carregar a linha do tempo.</p>
      </div>
    )
  }

  if (!eventos || eventos.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="mx-auto mb-3 grid size-14 place-items-center rounded-2xl bg-mist-100">
          <Calendar className="size-6 text-mist-300" />
        </div>
        <h4 className="text-sm font-semibold text-slate-700">Ainda sem registos no percurso</h4>
        <p className="mt-1.5 text-xs text-mist-400">Mudanças de secção e transferências aparecerão aqui à medida que forem acontecendo.</p>
      </div>
    )
  }

  const ordenados = [...eventos].sort((a, b) => new Date(b.data_evento).getTime() - new Date(a.data_evento).getTime())

  return (
    <div className="relative space-y-5 pl-7 before:absolute before:bottom-1 before:left-[9px] before:top-1 before:w-0.5 before:bg-gradient-to-b before:from-brand-600 before:to-mist-200">
      {ordenados.map((ev, i) => (
        <TimelineItem key={i} ev={ev} />
      ))}
    </div>
  )
}

function TimelineItem({ ev }: { ev: TimelineEvento }) {
  if (ev.tipo === 'transferencia') {
    const meta = ESTADO_TRANSFERENCIA[(ev.estado_ou_origem ?? '').toUpperCase()] ?? {
      cor: 'bg-slate-100 text-slate-500',
      label: ev.estado_ou_origem ?? '—',
    }
    return (
      <TimelineCard eyebrow="Transferência de Agrupamento" badge={meta.label} badgeCor={meta.cor}>
        <p className="flex items-center gap-1.5 text-sm font-medium text-slate-800">
          {ev.de_nome ?? '—'} <ArrowRight className="size-3 text-mist-300" /> {ev.para_nome ?? '—'}
        </p>
        {ev.motivo && <p className="mt-1.5 text-xs text-mist-400">{ev.motivo}</p>}
        <Rodape ev={ev} />
      </TimelineCard>
    )
  }

  const isRetro = ev.estado_ou_origem === 'historico_retroactivo'
  const seccaoMudou = (ev.de_nome ?? '') !== (ev.para_nome ?? '')
  const isFuncaoOnly = !seccaoMudou && ev.cargo_novo && ev.cargo_novo !== ev.cargo_anterior

  if (isFuncaoOnly) {
    return (
      <TimelineCard
        eyebrow="Nova Função / Cargo"
        badge={isRetro ? 'Registo histórico' : undefined}
        badgeCor="bg-amber-50 text-amber-700"
      >
        <p className="flex items-center gap-1.5 text-sm font-medium text-slate-800">
          {ev.cargo_anterior ?? '—'} <ArrowRight className="size-3 text-mist-300" /> {ev.cargo_novo ?? '—'}
        </p>
        {ev.motivo && <p className="mt-1.5 text-xs text-mist-400">{ev.motivo}</p>}
        <Rodape ev={ev} />
      </TimelineCard>
    )
  }

  return (
    <TimelineCard
      eyebrow="Mudança de Secção"
      badge={isRetro ? 'Registo histórico' : undefined}
      badgeCor="bg-amber-50 text-amber-700"
    >
      <p className="flex items-center gap-1.5 text-sm font-medium text-slate-800">
        {ev.de_nome ?? '—'} <ArrowRight className="size-3 text-mist-300" /> {ev.para_nome ?? '—'}
      </p>
      {ev.cargo_novo && ev.cargo_novo !== ev.cargo_anterior && (
        <p className="mt-1 text-xs text-mist-400">Cargo: {ev.cargo_novo}</p>
      )}
      {ev.motivo && <p className="mt-1.5 text-xs text-mist-400">{ev.motivo}</p>}
      <Rodape ev={ev} />
    </TimelineCard>
  )
}

function TimelineCard({
  eyebrow, badge, badgeCor, children,
}: { eyebrow: string; badge?: string; badgeCor?: string; children: ReactNode }) {
  return (
    <div className="relative">
      <div className="absolute -left-7 top-0.5 size-[19px] rounded-full border-[3px] border-brand-600 bg-white" />
      <div className="rounded-[14px] border border-mist-200 bg-mist-50 px-4 py-3.5">
        <div className="mb-1.5 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-mist-400">{eyebrow}</span>
          {badge && <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${badgeCor ?? 'bg-mist-100 text-mist-600'}`}>{badge}</span>}
        </div>
        {children}
      </div>
    </div>
  )
}

function Rodape({ ev }: { ev: TimelineEvento }) {
  return (
    <p className="mt-2 flex items-center gap-1.5 text-[11px] text-mist-400">
      <Calendar className="size-2.5" /> {fmtData(ev.data_evento)}
      {ev.responsavel_nome && <> &middot; Registado por {ev.responsavel_nome}</>}
    </p>
  )
}
