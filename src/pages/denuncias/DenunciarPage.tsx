import { useState, type FormEvent } from 'react'
import { Flag, Loader2, ShieldCheck } from 'lucide-react'
import { useMinhasDenuncias, useSubmeterDenuncia } from '@/hooks/useDenuncias'
import { getApiErrorMessage } from '@/lib/api'
import { notificar } from '@/lib/notificar'
import { Button } from '@/components/ui/Button'
import type { EstadoDenuncia } from '@/types/denuncia'

const TIPOS = ['Comportamento inadequado', 'Segurança', 'Assédio', 'Uso indevido de fundos', 'Outro']

const LABEL_ESTADO: Record<EstadoDenuncia, string> = {
  nova: 'Nova', em_analise: 'Em análise', resolvida: 'Resolvida', encerrada: 'Encerrada',
}
const CORES_ESTADO: Record<EstadoDenuncia, string> = {
  nova: 'bg-orange-50 text-orange-700',
  em_analise: 'bg-blue-50 text-blue-700',
  resolvida: 'bg-emerald-50 text-emerald-700',
  encerrada: 'bg-mist-100 text-mist-500',
}

export function DenunciarPage() {
  const { data: minhas, isLoading } = useMinhasDenuncias()
  const submeter = useSubmeterDenuncia()

  const [tipo, setTipo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [anonimo, setAnonimo] = useState(false)
  const [anexo, setAnexo] = useState<File | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    try {
      await submeter.mutateAsync({ tipo, descricao, anonimo, anexo })
      notificar.sucesso('Denúncia submetida com sucesso. Vais poder acompanhar o estado abaixo.')
      setTipo('')
      setDescricao('')
      setAnonimo(false)
      setAnexo(null)
    } catch (err) {
      notificar.erro(getApiErrorMessage(err, 'Não foi possível submeter a denúncia.'))
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="mb-1 flex items-center gap-2.5 text-2xl font-bold text-ink">
        <Flag className="size-6 text-brand-600" /> Denunciar
      </h1>
      <p className="mb-6 text-sm text-mist-400">
        Usa este formulário para reportar uma situação irregular. Podes optar por não te identificares.
      </p>
      <div className="mb-6 flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] text-emerald-900">
        <ShieldCheck className="mt-0.5 size-4 shrink-0" />
        <p>
          <span className="font-semibold">Os teus dados estão protegidos.</span> A tua identidade nunca é revelada à pessoa,
          agrupamento ou estrutura denunciada — a denúncia é tratada com total confidencialidade pela coordenação.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mb-10 space-y-4 rounded-2xl border border-mist-100 bg-white p-6 shadow-sm">

        <div>
          <label className="mb-1.5 block text-sm font-medium text-mist-500">Tipo de denúncia</label>
          <select
            required
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="h-11 w-full rounded-xl border border-mist-200 px-3.5 text-[14px] outline-none focus:border-brand-600"
          >
            <option value="">-- Seleccionar --</option>
            {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-mist-500">Descrição</label>
          <textarea
            required
            rows={5}
            minLength={10}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descreve o que aconteceu com o máximo de detalhe possível — data, local, pessoas envolvidas..."
            className="w-full resize-none rounded-xl border border-mist-200 px-3.5 py-2.5 text-[14px] outline-none focus:border-brand-600"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-mist-500">Anexo / evidência (opcional)</label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setAnexo(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-mist-400 file:mr-3 file:rounded-lg file:border-0 file:bg-mist-50 file:px-3 file:py-2 file:text-[13px] file:font-medium file:text-mist-600"
          />
        </div>

        <label className="flex items-center gap-2.5 rounded-xl bg-mist-50 px-3.5 py-3">
          <input type="checkbox" checked={anonimo} onChange={(e) => setAnonimo(e.target.checked)} className="size-4 accent-brand-600" />
          <span className="text-[13.5px] text-mist-600">Submeter de forma anónima — a tua identidade não fica associada a esta denúncia.</span>
        </label>

        <Button type="submit" loading={submeter.isPending} className="w-full">
          {submeter.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
          Submeter Denúncia
        </Button>
      </form>

      <h2 className="mb-3 text-lg font-bold text-ink">As minhas denúncias</h2>
      {isLoading && <Loader2 className="size-5 animate-spin text-mist-300" />}
      {!isLoading && minhas?.length === 0 && (
        <p className="text-sm text-mist-400">Ainda não submeteste nenhuma denúncia.</p>
      )}
      <div className="space-y-3">
        {minhas?.map((d) => (
          <div key={d.id} className="rounded-2xl border border-mist-100 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-ink">{d.tipo}</p>
              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${CORES_ESTADO[d.estado]}`}>{LABEL_ESTADO[d.estado]}</span>
            </div>
            <p className="mt-1 line-clamp-2 text-[13px] text-mist-400">{d.descricao}</p>
            <p className="mt-1.5 text-[11px] text-mist-300">{new Date(d.created_at).toLocaleDateString('pt-PT')}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
