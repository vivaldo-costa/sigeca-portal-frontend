import { useState } from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, Clock, Users, Lock, Loader2, Search, ChevronRight, Route, CalendarDays, MapPin } from 'lucide-react'
import { useCatalogoFormacoes } from '@/hooks/useCatalogoFormacoes'
import { useMeuPercurso } from '@/hooks/useMeuPercurso'
import { cn } from '@/lib/cn'
import { LABEL_ESTADO_CANDIDATURA, ETAPAS_PERCURSO, LABEL_CATEGORIA, type MinhaCandidatura } from '@/types/percursoFormativo'
import type { CategoriaFormacao } from '@/types/dashboard'

const ORDEM_CATEGORIAS: CategoriaFormacao[] = [
  'formacao_inicial', 'formacao_especifica', 'formacao_continua', 'seminario', 'formacao_complementar',
]

/**
 * Catálogo de Formações no Portal — onde o candidato/escuteiro consulta as
 * formações que a associação oferece e o respectivo conteúdo programático
 * (detalhe em /formacoes/:id, com os materiais de apoio). Se tiver uma
 * candidatura a dirigente, vê no topo o estado actual ("O meu percurso").
 */
export function FormacoesPage() {
  const { data, isLoading } = useCatalogoFormacoes()
  const { data: candidaturas } = useMeuPercurso()
  const [pesquisa, setPesquisa] = useState('')
  const [categoria, setCategoria] = useState<CategoriaFormacao | ''>('')

  const termo = pesquisa.trim().toLowerCase()
  const filtrados = (data ?? []).filter((item) =>
    (!categoria || item.categoria === categoria)
    && (!termo || item.nome.toLowerCase().includes(termo) || (item.descricao ?? '').toLowerCase().includes(termo)),
  )
  const categoriasPresentes = ORDEM_CATEGORIAS.filter((c) => (data ?? []).some((i) => i.categoria === c))

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <span className="text-xs font-bold uppercase tracking-widest text-accent-500">Percurso Formativo</span>
      <h1 className="mt-1 flex items-center gap-2.5 font-syne text-3xl font-black text-slate-900">
        <GraduationCap className="size-7 text-brand-600" /> Formações
      </h1>
      <p className="mt-1 text-sm text-mist-400">
        O catálogo de formações da associação — abre uma formação para veres o conteúdo programático e os materiais de apoio.
      </p>

      {candidaturas && candidaturas.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-700">
            <Route className="size-4 text-accent-500" /> O meu percurso
          </h2>
          <div className="space-y-3">
            {candidaturas.map((c) => <CartaoCandidatura key={c.id} candidatura={c} />)}
          </div>
        </section>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-mist-300" />
          <input
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            placeholder="Pesquisar formação..."
            className="w-full rounded-xl border border-mist-100 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-brand-600"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <BotaoCategoria activo={categoria === ''} onClick={() => setCategoria('')}>Todas</BotaoCategoria>
          {categoriasPresentes.map((c) => (
            <BotaoCategoria key={c} activo={categoria === c} onClick={() => setCategoria(c)}>{LABEL_CATEGORIA[c]}</BotaoCategoria>
          ))}
        </div>
      </div>

      {isLoading && <div className="flex justify-center py-16"><Loader2 className="size-6 animate-spin text-mist-300" /></div>}
      {!isLoading && filtrados.length === 0 && (
        <p className="py-16 text-center text-sm text-mist-400">Nenhuma formação encontrada.</p>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtrados.map((item) => (
          <Link
            key={item.id}
            to={`/formacoes/${item.id}`}
            className="group flex flex-col rounded-2xl border border-mist-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="w-fit rounded-full bg-brand-600/10 px-2.5 py-0.5 text-[11px] font-semibold text-brand-600">
              {LABEL_CATEGORIA[item.categoria] ?? item.categoria}
            </span>
            <h3 className="mt-2 font-syne text-base font-bold leading-tight text-slate-900">{item.nome}</h3>
            {item.descricao && <p className="mt-1.5 line-clamp-3 text-sm text-mist-500">{item.descricao}</p>}
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-mist-500">
              {item.carga_horaria !== null && <span className="flex items-center gap-1"><Clock className="size-3.5" /> {item.carga_horaria}h</span>}
              {item.publico_alvo && <span className="flex items-center gap-1"><Users className="size-3.5" /> {item.publico_alvo}</span>}
            </div>
            {item.pre_requisito_nome && (
              <p className="mt-2 flex items-center gap-1 text-xs text-amber-600"><Lock className="size-3" /> Pré-requisito: {item.pre_requisito_nome}</p>
            )}
            <span className="mt-auto flex items-center gap-1 pt-4 text-xs font-semibold text-accent-600 group-hover:text-accent-500">
              Ver conteúdo programático <ChevronRight className="size-3.5" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

function BotaoCategoria({ activo, onClick, children }: { activo: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-full px-3 py-1.5 text-xs font-semibold transition',
        activo ? 'bg-brand-600 text-white' : 'border border-mist-100 bg-white text-mist-500 hover:bg-mist-50',
      )}
    >
      {children}
    </button>
  )
}

function CartaoCandidatura({ candidatura: c }: { candidatura: MinhaCandidatura }) {
  const indiceEtapa = ETAPAS_PERCURSO.findIndex((e) => e.estados.includes(c.estado))
  const negativo = c.estado === 'rejeitado'
  const devolvido = c.estado === 'devolvido_correcao'

  return (
    <div className="rounded-2xl border border-mist-100 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs text-mist-400">Candidatura a dirigente</p>
          <h3 className="font-syne text-base font-bold text-slate-900">{c.formacao_nome}</h3>
          <p className="text-xs text-mist-400">Agrupamento {c.agrupamento_nome} · desde {new Date(c.created_at).toLocaleDateString('pt-PT')}</p>
        </div>
        <span className={cn(
          'rounded-full px-3 py-1 text-xs font-semibold',
          negativo ? 'bg-red-50 text-red-700' : devolvido ? 'bg-orange-50 text-orange-700' : 'bg-blue-50 text-blue-700',
        )}
        >
          {LABEL_ESTADO_CANDIDATURA[c.estado] ?? c.estado}
        </span>
      </div>

      {!negativo && (
        <ol className="mt-4 grid grid-cols-5 gap-1.5">
          {ETAPAS_PERCURSO.map((etapa, i) => (
            <li key={etapa.label}>
              <div className={cn('h-1.5 rounded-full', i < indiceEtapa ? 'bg-emerald-500' : i === indiceEtapa ? 'bg-accent-500' : 'bg-mist-100')} />
              <p className={cn('mt-1.5 hidden text-[11px] sm:block', i === indiceEtapa ? 'font-semibold text-slate-700' : 'text-mist-400')}>{etapa.label}</p>
            </li>
          ))}
        </ol>
      )}

      {devolvido && (
        <p className="mt-3 text-xs text-orange-700">A tua candidatura foi devolvida para correcção — fala com o Chefe do teu Agrupamento.</p>
      )}

      {c.turma_codigo && (
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 rounded-xl bg-mist-50 px-3 py-2 text-xs text-mist-500">
          <span className="font-semibold text-slate-700">Turma {c.turma_codigo}</span>
          {c.turma_data_inicio && (
            <span className="flex items-center gap-1">
              <CalendarDays className="size-3.5" /> {new Date(c.turma_data_inicio).toLocaleDateString('pt-PT')}
              {c.turma_data_fim ? ` a ${new Date(c.turma_data_fim).toLocaleDateString('pt-PT')}` : ''}
            </span>
          )}
          {c.turma_local && <span className="flex items-center gap-1"><MapPin className="size-3.5" /> {c.turma_local}</span>}
        </div>
      )}

      <Link to={`/formacoes/${c.formacao_pretendida_id}`} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-accent-600 hover:text-accent-500">
        Ver o conteúdo desta formação <ChevronRight className="size-3.5" />
      </Link>
    </div>
  )
}
