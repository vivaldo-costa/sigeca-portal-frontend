import { useState } from 'react'
import { Award, FileDown, Loader2, ShieldCheck, Ban } from 'lucide-react'
import { useMeusCertificados, baixarCertificadoProprio } from '@/hooks/useCertificados'
import { getApiErrorMessage } from '@/lib/api'
import { notificar } from '@/lib/notificar'
import type { Certificado, TipoCertificado } from '@/types/perfil'
import { Contador, EmptyState } from './ActividadesTab'

const LABEL_TIPO: Record<TipoCertificado, string> = {
  certificado: 'Certificado',
  declaracao: 'Declaração',
  diploma: 'Diploma',
}

/**
 * "Os Meus Certificados" — o módulo de certificados (emissão, PDF, QR de
 * verificação) já existia por completo no backend para a gestão, mas o
 * Portal só tinha a verificação pública de um QR de terceiros
 * (`VerificarCertificado.tsx`). Esta aba é a parte que faltava: o próprio
 * sócio a ver e descarregar os seus.
 */
export function CertificadosTab() {
  const { data: certificados, isLoading } = useMeusCertificados()

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="size-5 animate-spin text-mist-300" /></div>
  }

  if (!certificados || certificados.length === 0) {
    return (
      <EmptyState
        icon={Award}
        titulo="Ainda não tens certificados"
        texto="Certificados, declarações e diplomas emitidos pela associação aparecerão aqui."
      />
    )
  }

  return (
    <div className="px-6 py-8">
      <Contador icon={Award} n={certificados.length} label="certificado" labelPlural="certificados" />
      <div className="space-y-3">
        {certificados.map((c) => (
          <CertificadoCard key={c.id} certificado={c} />
        ))}
      </div>
    </div>
  )
}

function CertificadoCard({ certificado: c }: { certificado: Certificado }) {
  const [aBaixar, setABaixar] = useState(false)

  async function baixar() {
    setABaixar(true)
    try {
      await baixarCertificadoProprio(c)
    } catch (err) {
      notificar.erro(getApiErrorMessage(err, 'Não foi possível descarregar o certificado.'))
    } finally {
      setABaixar(false)
    }
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-mist-100 bg-white p-4 shadow-sm">
      <div className="flex min-w-0 items-center gap-3">
        <div className={`grid size-10 shrink-0 place-items-center rounded-xl ${c.ativo ? 'bg-brand-600/8' : 'bg-mist-100'}`}>
          <Award className={`size-5 ${c.ativo ? 'text-brand-600' : 'text-mist-300'}`} />
        </div>
        <div className="min-w-0">
          <p className="truncate font-medium text-slate-800">{c.titulo}</p>
          <p className="text-xs text-mist-400">
            {LABEL_TIPO[c.tipo]} · Nº {c.numero_unico} · {new Date(c.created_at).toLocaleDateString('pt-PT')}
            {c.validade && ` · Válido até ${new Date(c.validade).toLocaleDateString('pt-PT')}`}
          </p>
          {!c.ativo && (
            <p className="mt-1 flex items-center gap-1 text-xs font-medium text-red-500">
              <Ban className="size-3" /> Revogado{c.motivo_revogacao ? `: ${c.motivo_revogacao}` : ''}
            </p>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {c.ativo && (
          <span className="hidden items-center gap-1 text-xs text-emerald-600 sm:flex">
            <ShieldCheck className="size-3.5" /> Verificável
          </span>
        )}
        <button
          onClick={baixar}
          disabled={aBaixar || !c.pdf_path}
          title={c.pdf_path ? 'Descarregar PDF' : 'PDF indisponível'}
          className="flex items-center gap-1.5 rounded-full bg-brand-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {aBaixar ? <Loader2 className="size-3.5 animate-spin" /> : <FileDown className="size-3.5" />}
          PDF
        </button>
      </div>
    </div>
  )
}
