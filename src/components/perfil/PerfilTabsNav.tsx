import { User, Tent, GraduationCap, ShoppingBag, Vote as VoteIcon, Award } from 'lucide-react'
import { cn } from '@/lib/cn'

export type PerfilTab = 'sobre' | 'actividades' | 'formacoes' | 'certificados' | 'produtos' | 'eleicoes'

const TABS: { id: PerfilTab; label: string; icon: typeof User }[] = [
  { id: 'sobre', label: 'Sobre', icon: User },
  { id: 'actividades', label: 'Actividades', icon: Tent },
  { id: 'formacoes', label: 'Formações', icon: GraduationCap },
  { id: 'certificados', label: 'Certificados', icon: Award },
  { id: 'produtos', label: 'As Minhas Compras', icon: ShoppingBag },
  { id: 'eleicoes', label: 'Votações', icon: VoteIcon },
]

export function PerfilTabsNav({
  activo,
  onChange,
  mostrarVotacoes,
}: {
  activo: PerfilTab
  onChange: (tab: PerfilTab) => void
  mostrarVotacoes: boolean
}) {
  const tabs = TABS.filter((t) => t.id !== 'eleicoes' || mostrarVotacoes)

  return (
    <div className="border-b border-mist-200 bg-white shadow-sm">
      <nav className="flex gap-1 overflow-x-auto px-6" aria-label="Secções do perfil">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={cn(
              'whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors',
              activo === id
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-mist-600 hover:border-mist-300 hover:text-slate-700'
            )}
          >
            <Icon className="mr-1.5 inline size-3.5" />
            {label}
          </button>
        ))}
      </nav>
    </div>
  )
}
