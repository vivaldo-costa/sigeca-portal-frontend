import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronLeft, Clock, Users, Lock, Loader2, FileDown, BookOpen, Route } from 'lucide-react'
import { useCatalogoFormacoes } from '@/hooks/useCatalogoFormacoes'
import { useMateriaisFormacao } from '@/hooks/useMateriaisFormacao'
import { useMeuPercurso } from '@/hooks/useMeuPercurso'
import { baixarFicheiroProtegido } from '@/lib/download'
import { notificar } from '@/lib/notificar'
import { LABEL_ESTADO_CANDIDATURA, LABEL_CATEGORIA } from '@/types/percursoFormativo'

/** Detalhe de uma formação do catálogo — conteúdo programático e materiais de apoio para descarregar. */
export function FormacaoDetalhePage() {
  const { id } = useParams()
  const formacaoId = Number(id)
  const { data: catalogo, isLoading } = useCatalogoFormacoes()
  const { data: materiais, isLoading: aCarregarMateriais } = useMateriaisFormacao(formacaoId, !!formacaoId)
  const { data: candidaturas } = useMeuPercurso()
  const [aDescarregar, setADescarregar] = useState<number | null>(null)

  const item = catalogo?.find((f) => f.id === formacaoId)
  const minhaCandidatura = candidaturas?.find((c) => c.formacao_pretendida_id === formacaoId)

  async function descarregar(materialId: number, titulo: string, ficheiro: string) {
    setADescarregar(materialId)
    try {
      const ext = ficheiro.includes('.') ? ficheiro.slice(ficheiro.lastIndexOf('.')) : ''
      await baixarFicheiroProtegido(`/catalogo-formacoes/${formacaoId}/materiais/${materialId}/download`, `${titulo}${ext}`)
    } catch {
      notificar.erro('Não foi possível descarregar o material.')
    } finally {
      setADescarregar(null)
    }
  }

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="size-6 animate-spin text-mist-300" /></div>

  if (!item) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <p className="text-sm text-mist-400">Esta formação não existe ou já não está disponível.</p>
        <Link to="/formacoes" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-600"><ChevronLeft className="size-4" /> Voltar às formações</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link to="/formacoes" className="mb-5 inline-flex items-center gap-1 text-sm font-medium text-mist-400 hover:text-slate-700">
        <ChevronLeft className="size-4" /> Voltar às formações
      </Link>

      <span className="block w-fit rounded-full bg-brand-600/10 px-2.5 py-0.5 text-[11px] font-semibold text-brand-600">
        {LABEL_CATEGORIA[item.categoria] ?? item.categoria}
      </span>
      <h1 className="mt-2 font-syne text-3xl font-black text-slate-900">{item.nome}</h1>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <InfoCaixa icon={<Clock className="size-4" />} titulo="Carga horária" valor={item.carga_horaria !== null ? `${item.carga_horaria} horas` : '—'} />
        <InfoCaixa icon={<Users className="size-4" />} titulo="Público-alvo" valor={item.publico_alvo || '—'} />
        <InfoCaixa icon={<Lock className="size-4" />} titulo="Pré-requisito" valor={item.pre_requisito_nome || 'Nenhum'} />
      </div>

      {minhaCandidatura && (
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-900">
          <Route className="mt-0.5 size-4 shrink-0" />
          <p>
            <span className="font-semibold">A tua candidatura:</span> {LABEL_ESTADO_CANDIDATURA[minhaCandidatura.estado] ?? minhaCandidatura.estado}.{' '}
            <Link to="/formacoes" className="font-semibold underline">Ver o meu percurso</Link>
          </p>
        </div>
      )}

      <section className="mt-6 rounded-2xl border border-mist-100 bg-white p-6 shadow-sm">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-700">
          <BookOpen className="size-4 text-accent-500" /> Conteúdo programático
        </h2>
        {item.descricao
          ? <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">{item.descricao}</p>
          : <p className="text-sm text-mist-400">O conteúdo programático desta formação ainda não foi publicado.</p>}
      </section>

      <section className="mt-4 rounded-2xl border border-mist-100 bg-white p-6 shadow-sm">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-700">
          <FileDown className="size-4 text-accent-500" /> Materiais de apoio
        </h2>
        {aCarregarMateriais && <p className="text-sm text-mist-400">A carregar…</p>}
        {!aCarregarMateriais && (!materiais || materiais.length === 0) && (
          <p className="text-sm text-mist-400">Ainda sem materiais disponíveis.</p>
        )}
        {materiais && materiais.length > 0 && (
          <ul className="divide-y divide-mist-100">
            {materiais.map((m) => (
              <li key={m.id}>
                <button
                  onClick={() => descarregar(m.id, m.titulo, m.ficheiro)}
                  disabled={aDescarregar === m.id}
                  className="flex w-full items-center gap-2 py-2.5 text-left text-sm font-medium text-brand-600 transition hover:text-brand-700 disabled:opacity-50"
                >
                  {aDescarregar === m.id ? <Loader2 className="size-4 animate-spin" /> : <FileDown className="size-4" />}
                  <span className="flex-1">{m.titulo}</span>
                  <span className="text-xs font-normal text-mist-400">Descarregar</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

function InfoCaixa({ icon, titulo, valor }: { icon: React.ReactNode; titulo: string; valor: string }) {
  return (
    <div className="rounded-2xl border border-mist-100 bg-white px-4 py-3 shadow-sm">
      <p className="flex items-center gap-1.5 text-xs text-mist-400">{icon} {titulo}</p>
      <p className="mt-0.5 text-sm font-semibold text-slate-800">{valor}</p>
    </div>
  )
}
