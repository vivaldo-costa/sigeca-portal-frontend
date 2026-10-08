import { useState, type FormEvent } from 'react'
import { X, Coins, Upload, Loader2, CircleCheck, FileText, Landmark, Copy, Check } from 'lucide-react'
import { useRegistarPagamento } from '@/hooks/useInscricoes'
import { getApiErrorMessage } from '@/lib/api'
import { notificar } from '@/lib/notificar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { Atividade } from '@/types/dashboard'

const METODOS = ['Transferência Bancária', 'Multicaixa Express', 'Depósito', 'Numerário na sede']

interface Props {
  atividade: Atividade
  onClose: () => void
}

/** Coordenadas bancárias definidas pela organização do evento, com botão para copiar o IBAN. */
function CoordenadasBancarias({ atividade: a }: { atividade: Atividade }) {
  const [copiado, setCopiado] = useState(false)
  if (!a.iban) return null

  async function copiar() {
    try {
      await navigator.clipboard.writeText(a.iban!.replace(/\s+/g, ''))
      setCopiado(true)
      notificar.sucesso('IBAN copiado.')
      setTimeout(() => setCopiado(false), 2000)
    } catch {
      notificar.erro('Não foi possível copiar — selecciona o IBAN e copia manualmente.')
    }
  }

  return (
    <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
      <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-700">
        <Landmark className="size-3.5" /> Dados para transferência
      </p>
      <div className="space-y-1 text-sm text-blue-900">
        {a.titular_conta && <p><span className="font-medium text-blue-600">Titular:</span> {a.titular_conta}</p>}
        {a.banco && <p><span className="font-medium text-blue-600">Banco:</span> {a.banco}</p>}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-blue-600">IBAN:</span>
          <strong className="select-all break-all font-mono">{a.iban}</strong>
          <button
            type="button"
            onClick={copiar}
            className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-white px-2 py-0.5 text-xs font-medium text-blue-700 transition hover:bg-blue-100"
          >
            {copiado ? <Check className="size-3" /> : <Copy className="size-3" />}
            {copiado ? 'Copiado' : 'Copiar'}
          </button>
        </div>
      </div>
    </div>
  )
}

/** Modal de pagamento — equivalente ao formulário de pagamento_evento.php. */
export function PagamentoModal({ atividade: a, onClose }: Props) {
  const registar = useRegistarPagamento()
  const [sucesso, setSucesso] = useState(false)

  const totalPrestacoes = a.prestacoes ?? 1
  const valorPago = a.valor_pago ?? 0
  const valorRestante = Math.max(0, a.valor - valorPago)
  const valorPrestacao = totalPrestacoes > 0 ? a.valor / totalPrestacoes : a.valor

  const [tipoPagamento, setTipoPagamento] = useState<'completo' | 'prestacao'>(
    totalPrestacoes > 1 ? 'prestacao' : 'completo'
  )
  const [numeroPrestacao, setNumeroPrestacao] = useState(1)
  const [metodo, setMetodo] = useState(METODOS[0])
  const [transacao, setTransacao] = useState('')
  const [comprovativo, setComprovativo] = useState<File | null>(null)

  const valorAPagar = tipoPagamento === 'completo' ? valorRestante : valorPrestacao

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (!a.inscricao_id) {
      notificar.erro('Esta inscrição ainda não tem um registo válido para pagamento.')
      return
    }
    if (!comprovativo) {
      notificar.erro('Anexa o comprovativo de pagamento.')
      return
    }

    try {
      await registar.mutateAsync({
        inscricao_id: a.inscricao_id,
        evento_id: a.id,
        metodo_pagamento: metodo,
        tipo_pagamento: tipoPagamento,
        transacao,
        numero_prestacao: tipoPagamento === 'prestacao' ? numeroPrestacao : undefined,
        comprovativo,
      })
      setSucesso(true)
    } catch (err) {
      notificar.erro(getApiErrorMessage(err, 'Não foi possível registar o pagamento.'))
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in" onClick={onClose}>
      <div
        className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-mist-100 bg-white px-6 py-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
            <Coins className="size-5 text-amber-500" /> Efectuar pagamento
          </h2>
          <button onClick={onClose} aria-label="Fechar" className="text-mist-400 transition hover:text-error-text">
            <X className="size-5" />
          </button>
        </div>

        {sucesso ? (
          <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
            <div className="grid size-14 place-items-center rounded-full bg-success-bg">
              <CircleCheck className="size-7 text-success-text" />
            </div>
            <p className="text-sm font-medium text-slate-800">Pagamento registado com sucesso!</p>
            <p className="text-xs text-mist-400">
              A confirmação fica sujeita à validação do comprovativo pela equipa da AECA.
            </p>
            <Button onClick={onClose} className="mt-2 w-full">Fechar</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
            <div className="rounded-xl bg-mist-50 p-4">
              <p className="text-sm font-semibold text-slate-900">{a.titulo}</p>
              <div className="mt-2 flex justify-between text-xs text-mist-400">
                <span>Valor total</span>
                <span className="font-semibold text-slate-700">{a.valor.toLocaleString('pt-PT', { minimumFractionDigits: 2 })} Kz</span>
              </div>
              {valorPago > 0 && (
                <div className="mt-1 flex justify-between text-xs text-mist-400">
                  <span>Já pago</span>
                  <span className="font-semibold text-success-text">{valorPago.toLocaleString('pt-PT', { minimumFractionDigits: 2 })} Kz</span>
                </div>
              )}
            </div>

            <CoordenadasBancarias atividade={a} />

            {totalPrestacoes > 1 && (
              <div>
                <label className="mb-2 block text-[13px] font-medium tracking-wide text-mist-600">Forma de pagamento</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setTipoPagamento('completo')}
                    className={`flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                      tipoPagamento === 'completo' ? 'border-brand-600 bg-brand-600/8 text-brand-600' : 'border-mist-200 text-mist-600'
                    }`}
                  >
                    Valor total restante
                  </button>
                  <button
                    type="button"
                    onClick={() => setTipoPagamento('prestacao')}
                    className={`flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                      tipoPagamento === 'prestacao' ? 'border-brand-600 bg-brand-600/8 text-brand-600' : 'border-mist-200 text-mist-600'
                    }`}
                  >
                    Por prestação
                  </button>
                </div>
              </div>
            )}

            {tipoPagamento === 'prestacao' && totalPrestacoes > 1 && (
              <div>
                <label className="mb-1.5 block text-[13px] font-medium tracking-wide text-mist-600">Número da prestação</label>
                <select
                  value={numeroPrestacao}
                  onChange={(e) => setNumeroPrestacao(Number(e.target.value))}
                  className="h-12 w-full rounded-[var(--radius-sig-md)] border-[1.5px] border-mist-200 bg-mist-50 px-3.5 text-[15px] outline-none transition-colors hover:border-mist-400 hover:bg-white focus:border-ink focus:bg-white"
                >
                  {Array.from({ length: totalPrestacoes }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>Prestação {n} de {totalPrestacoes}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="rounded-xl border border-brand-600/15 bg-brand-600/5 px-4 py-3">
              <p className="text-xs text-mist-400">Valor a pagar agora</p>
              <p className="text-xl font-bold text-brand-600">{valorAPagar.toLocaleString('pt-PT', { minimumFractionDigits: 2 })} Kz</p>
            </div>

            <div>
              <label className="mb-1.5 block text-[13px] font-medium tracking-wide text-mist-600">Método de pagamento</label>
              <select
                value={metodo}
                onChange={(e) => setMetodo(e.target.value)}
                className="h-12 w-full rounded-[var(--radius-sig-md)] border-[1.5px] border-mist-200 bg-mist-50 px-3.5 text-[15px] outline-none transition-colors hover:border-mist-400 hover:bg-white focus:border-ink focus:bg-white"
              >
                {METODOS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <Input
              label="Referência da transacção"
              placeholder="Ex.: TRX20260728001"
              required
              value={transacao}
              onChange={(e) => setTransacao(e.target.value)}
            />

            <div>
              <label className="mb-1.5 block text-[13px] font-medium tracking-wide text-mist-600">Comprovativo de pagamento</label>
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-mist-200 bg-mist-50 px-4 py-6 text-center transition hover:border-brand-600 hover:bg-brand-600/5">
                {comprovativo ? (
                  <>
                    <FileText className="size-6 text-brand-600" />
                    <span className="max-w-[240px] truncate text-xs font-medium text-slate-700">{comprovativo.name}</span>
                  </>
                ) : (
                  <>
                    <Upload className="size-6 text-mist-300" />
                    <span className="text-xs text-mist-400">JPG, PNG ou PDF — clica para anexar</span>
                  </>
                )}
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  className="hidden"
                  onChange={(e) => setComprovativo(e.target.files?.[0] ?? null)}
                />
              </label>
            </div>

            <div className="flex justify-end gap-3 border-t border-mist-100 pt-4">
              <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
              <Button type="submit" loading={registar.isPending}>
                {registar.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
                Registar Pagamento
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
