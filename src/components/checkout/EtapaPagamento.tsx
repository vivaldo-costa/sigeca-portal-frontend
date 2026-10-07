import { Landmark, Smartphone, CloudUpload, FileText } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { CabecalhoEtapa } from './EtapaResumo'
import type { MetodoPagamento } from '@/types/carrinho'

const fmtKz = (v: number) => v.toLocaleString('pt-PT', { maximumFractionDigits: 0 })

interface Props {
  total: number
  metodo: MetodoPagamento | null
  setMetodo: (m: MetodoPagamento) => void
  referencia: string
  setReferencia: (v: string) => void
  comprovativo: File | null
  setComprovativo: (f: File | null) => void
  erro: string | null
  onVoltar: () => void
  onContinuar: () => void
}

export function EtapaPagamento({
  total, metodo, setMetodo, referencia, setReferencia, comprovativo, setComprovativo, erro, onVoltar, onContinuar,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-mist-100 bg-white shadow-sm">
      <CabecalhoEtapa numero={2} titulo="Pagamento" />
      <div className="space-y-4 p-5">
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
          <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-700">
            <Landmark className="size-3.5" /> Dados para Transferência
          </p>
          <div className="space-y-1 text-sm text-blue-900">
            <p><span className="font-medium text-blue-600">Entidade:</span> Coordenação Nacional – Escuteiros Católicos de Angola</p>
            <p><span className="font-medium text-blue-600">IBAN:</span> <strong className="font-mono">AO06 0047 0000 2205 4740 1035 7</strong></p>
            <p><span className="font-medium text-blue-600">Montante:</span> <strong>{fmtKz(total)} Kz</strong></p>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold text-mist-600">Método de Pagamento *</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setMetodo('transferencia')}
              className={`flex items-center gap-3 rounded-xl border p-3 transition ${
                metodo === 'transferencia' ? 'border-brand-600 bg-brand-600/5' : 'border-mist-200 hover:border-brand-600'
              }`}
            >
              <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-blue-50">
                <Landmark className="size-4 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-slate-700">Transferência</p>
                <p className="text-[10px] text-mist-400">Bancária</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setMetodo('multicaixa')}
              className={`flex items-center gap-3 rounded-xl border p-3 transition ${
                metodo === 'multicaixa' ? 'border-brand-600 bg-brand-600/5' : 'border-mist-200 hover:border-brand-600'
              }`}
            >
              <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-orange-50">
                <Smartphone className="size-4 text-orange-500" />
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-slate-700">Multicaixa</p>
                <p className="text-[10px] text-mist-400">Express</p>
              </div>
            </button>
          </div>
        </div>

        <Input
          label="Referência da transacção *"
          placeholder="Ex.: TRF123456789"
          value={referencia}
          onChange={(e) => setReferencia(e.target.value)}
        />

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-mist-600">Comprovativo de Pagamento *</label>
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-mist-200 bg-mist-50 px-4 py-6 text-center transition hover:border-brand-600 hover:bg-brand-600/5">
            {comprovativo ? (
              <>
                <FileText className="size-6 text-brand-600" />
                <span className="max-w-[240px] truncate text-xs font-medium text-slate-700">{comprovativo.name}</span>
              </>
            ) : (
              <>
                <CloudUpload className="size-6 text-mist-300" />
                <span className="text-sm text-mist-400">Clica ou arrasta o comprovativo aqui</span>
                <span className="text-xs text-mist-300">JPG, PNG, PDF · Máx. 5MB</span>
              </>
            )}
            <input
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => setComprovativo(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>

        {erro && <p className="text-xs text-error-text">{erro}</p>}
      </div>
      <div className="flex gap-3 px-5 pb-5">
        <Button variant="secondary" onClick={onVoltar} className="flex-1">Voltar</Button>
        <Button onClick={onContinuar} className="flex-1">Continuar</Button>
      </div>
    </div>
  )
}
