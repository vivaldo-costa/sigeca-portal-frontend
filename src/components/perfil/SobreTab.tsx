import type { ReactNode } from 'react'
import {
  User, VenusAndMars, IdCard, Cake, Droplet, Mail, Phone, MapPin,
  IdCardLanyard, Church, LandPlot, Cross, Users, ShieldHalf, GitCommitVertical,
} from 'lucide-react'
import type { PerfilDados } from '@/types/perfil'
import { useTimeline } from '@/hooks/usePerfil'
import { PercursoTimeline } from './PercursoTimeline'

const CATEGORIAS = ['Dirigente', 'Candidato']

interface Campo {
  label: string
  valor: string | null
  icon: typeof User
  cor: string
  bg: string
}

export function SobreTab({ dados, activo }: { dados: PerfilDados; activo: boolean }) {
  const timeline = useTimeline(dados.codigo_associado, activo)

  const camposPessoais: Campo[] = [
    { label: 'Nome completo', valor: dados.nome, icon: User, cor: 'text-slate-500', bg: 'bg-slate-100' },
    { label: 'Género', valor: dados.genero, icon: VenusAndMars, cor: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Bilhete de Identidade', valor: dados.bilhete_identidade, icon: IdCard, cor: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Data de Nascimento', valor: dados.data_nascimento, icon: Cake, cor: 'text-pink-600', bg: 'bg-pink-50' },
    { label: 'Grupo Sanguíneo', valor: dados.grupo_sanguineo, icon: Droplet, cor: 'text-red-600', bg: 'bg-red-50' },
    { label: 'E-mail', valor: dados.email, icon: Mail, cor: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Telefone', valor: dados.telefone, icon: Phone, cor: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Morada', valor: dados.endereco, icon: MapPin, cor: 'text-orange-600', bg: 'bg-orange-50' },
  ]

  const rotuloSeccao = dados.seccao && CATEGORIAS.includes(dados.seccao) ? 'Categoria' : 'Secção'
  const camposEscutistas: Campo[] = [
    { label: 'N° SIGECA', valor: dados.codigo_associado, icon: IdCardLanyard, cor: 'text-brand-600', bg: 'bg-brand-600/8' },
    { label: 'Diocese', valor: dados.diocese, icon: Church, cor: 'text-amber-700', bg: 'bg-amber-50' },
    { label: 'Vigararia', valor: dados.vigararia, icon: LandPlot, cor: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Paróquia', valor: dados.paroquia, icon: Cross, cor: 'text-yellow-700', bg: 'bg-yellow-50' },
    { label: 'Agrupamento', valor: dados.agrupamento, icon: Users, cor: 'text-teal-600', bg: 'bg-teal-50' },
    { label: rotuloSeccao, valor: dados.seccao, icon: ShieldHalf, cor: 'text-blue-600', bg: 'bg-blue-50' },
  ]

  return (
    <div className="space-y-10 px-6 py-8">
      <Bloco titulo="Dados Pessoais" icon={User}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {camposPessoais.map((c) => (
            <CampoCard key={c.label} {...c} />
          ))}
        </div>
      </Bloco>

      <Bloco titulo="Percurso Escutista" icon={ShieldHalf}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {camposEscutistas.map((c) => (
            <CampoCard key={c.label} {...c} />
          ))}
        </div>
      </Bloco>

      <Bloco titulo="Linha do Tempo" icon={GitCommitVertical}>
        <PercursoTimeline isLoading={timeline.isLoading} isError={timeline.isError} eventos={timeline.data} />
      </Bloco>
    </div>
  )
}

function Bloco({ titulo, icon: Icon, children }: { titulo: string; icon: typeof User; children: ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="grid size-7 shrink-0 place-items-center rounded-lg bg-brand-600/8">
          <Icon className="size-3.5 text-brand-600" />
        </div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-mist-400">{titulo}</h3>
        <div className="h-px flex-1 bg-mist-200" />
      </div>
      {children}
    </div>
  )
}

function CampoCard({ label, valor, icon: Icon, cor, bg }: Campo) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-mist-100 bg-mist-50 p-3">
      <div className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg ${bg}`}>
        <Icon className={`size-3.5 ${cor}`} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-mist-400">{label}</p>
        <p className="mt-0.5 truncate text-sm font-medium text-slate-800">
          {valor || <span className="text-mist-300">—</span>}
        </p>
      </div>
    </div>
  )
}
