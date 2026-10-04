import { useState } from 'react'
import { Loader2, Clock, Users, GraduationCap, Lock, FileDown, ChevronDown, ChevronUp } from 'lucide-react'
import { useCatalogoFormacoes } from '@/hooks/useCatalogoFormacoes'
import { useMateriaisFormacao } from '@/hooks/useMateriaisFormacao'
import { baixarFicheiroProtegido } from '@/lib/download'
import type { CategoriaFormacao, CatalogoFormacaoItem } from '@/types/dashboard'

const LABEL_CATEGORIA: Record<CategoriaFormacao, string> = {
  formacao_inicial: 'Formação Inicial',
  formacao_especifica: 'Formação Específica',
  formacao_continua: 'Formação Contínua',
  seminario: 'Seminários',
  formacao_complementar: 'Formação Complementar',
}

const ORDEM_CATEGORIAS: CategoriaFormacao[] = [
  'formacao_inicial', 'formacao_especifica', 'formacao_continua', 'seminario', 'formacao_complementar',
]

/**
 * Catálogo das formações que a associação oferece (percursos, não datas
 * concretas) — o dado já existia no backend para o Painel (gestão), mas
 * não chegava ao sócio. As edições já agendadas continuam a aparecer na
 * secção "Actividades & Formações" acima, para inscrição.
 */
export function CatalogoFormacoesSection() {
  const { data, isLoading } = useCatalogoFormacoes()

  const porCategoria = new Map<CategoriaFormacao, typeof data>()
  for (const item of data ?? []) {
    const lista = porCategoria.get(item.categoria) ?? []
    lista.push(item)
    porCategoria.set(item.categoria, lista)
  }
  const categorias = ORDEM_CATEGORIAS.filter((c) => (porCategoria.get(c)?.length ?? 0) > 0)

  if (!isLoading && categorias.length === 0) return null

  return (
    <section className="bg-mist-50 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-accent-500">Percurso Formativo</span>
          <h2 className="mt-1 font-syne text-3xl font-black text-slate-900">Catálogo de Formações</h2>
          <p className="text-sm text-mist-400">As formações que a associação oferece — consulta quando há uma edição agendada em "Actividades & Formações".</p>
        </div>

        {isLoading && (
          <div className="flex justify-center py-10"><Loader2 className="size-5 animate-spin text-mist-300" /></div>
        )}

        {categorias.map((cat) => (
          <div key={cat} className="mb-10 last:mb-0">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-700">
              <GraduationCap className="size-4 text-accent-500" />
              {LABEL_CATEGORIA[cat]}
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {porCategoria.get(cat)!.map((item) => (
                <CatalogoFormacaoCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function CatalogoFormacaoCard({ item }: { item: CatalogoFormacaoItem }) {
  const [materiaisAbertos, setMateriaisAbertos] = useState(false)
  const { data: materiais, isLoading: aCarregarMateriais } = useMateriaisFormacao(item.id, materiaisAbertos)
  const [aDescarregar, setADescarregar] = useState<number | null>(null)

  async function descarregar(materialId: number, titulo: string, ficheiro: string) {
    setADescarregar(materialId)
    try {
      const ext = ficheiro.includes('.') ? ficheiro.slice(ficheiro.lastIndexOf('.')) : ''
      await baixarFicheiroProtegido(`/catalogo-formacoes/${item.id}/materiais/${materialId}/download`, `${titulo}${ext}`)
    } finally {
      setADescarregar(null)
    }
  }

  return (
    <div className="rounded-2xl border border-mist-100 bg-white p-5 shadow-sm transition hover:shadow-md">
      <h4 className="font-syne text-base font-bold leading-tight text-slate-900">{item.nome}</h4>
      {item.descricao && <p className="mt-1.5 line-clamp-3 text-sm text-mist-500">{item.descricao}</p>}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-mist-500">
        {item.carga_horaria !== null && (
          <span className="flex items-center gap-1"><Clock className="size-3.5" /> {item.carga_horaria}h</span>
        )}
        {(item.minimo_participantes !== null || item.maximo_participantes !== null) && (
          <span className="flex items-center gap-1">
            <Users className="size-3.5" />
            {item.minimo_participantes ?? '—'}–{item.maximo_participantes ?? '—'} participantes
          </span>
        )}
      </div>
      {item.publico_alvo && (
        <p className="mt-2 text-xs text-mist-400"><span className="font-semibold text-mist-500">Público-alvo:</span> {item.publico_alvo}</p>
      )}
      {item.pre_requisito_nome && (
        <p className="mt-2 flex items-center gap-1 text-xs text-amber-600">
          <Lock className="size-3" /> Pré-requisito: {item.pre_requisito_nome}
        </p>
      )}
      <p className="mt-3 text-xs font-semibold text-accent-600">
        {item.total_cursos > 0
          ? `${item.total_cursos} edição${item.total_cursos === 1 ? '' : 'ões'} já realizada${item.total_cursos === 1 ? '' : 's'}`
          : 'Ainda sem edições agendadas'}
      </p>

      <button
        onClick={() => setMateriaisAbertos((v) => !v)}
        className="mt-3 flex items-center gap-1 text-xs font-semibold text-slate-500 transition hover:text-slate-700"
      >
        <FileDown className="size-3.5" /> Materiais de apoio
        {materiaisAbertos ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
      </button>

      {materiaisAbertos && (
        <div className="mt-2 border-t border-mist-100 pt-2">
          {aCarregarMateriais && <p className="text-xs text-mist-400">A carregar…</p>}
          {!aCarregarMateriais && (!materiais || materiais.length === 0) && (
            <p className="text-xs text-mist-400">Ainda sem materiais disponíveis.</p>
          )}
          {materiais && materiais.length > 0 && (
            <ul className="space-y-1.5">
              {materiais.map((m) => (
                <li key={m.id}>
                  <button
                    onClick={() => descarregar(m.id, m.titulo, m.ficheiro)}
                    disabled={aDescarregar === m.id}
                    className="flex w-full items-center gap-1.5 rounded-lg px-2 py-1.5 text-left text-xs font-medium text-brand-600 transition hover:bg-mist-50 disabled:opacity-50"
                  >
                    {aDescarregar === m.id ? <Loader2 className="size-3.5 animate-spin" /> : <FileDown className="size-3.5" />}
                    {m.titulo}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
