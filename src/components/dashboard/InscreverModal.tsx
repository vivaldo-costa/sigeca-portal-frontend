import { X, Tent, GraduationCap, MapPin, Calendar, Users, Loader2, CircleCheck } from 'lucide-react'
import { useState } from 'react'
import { useInscrever } from '@/hooks/useInscricoes'
import { getApiErrorMessage } from '@/lib/api'
import { notificar } from '@/lib/notificar'
import { Button } from '@/components/ui/Button'
import type { Atividade } from '@/types/dashboard'

interface Props {
  atividade: Atividade
  onClose: () => void
}

/** Modal de confirmação — equivalente ao POST para inscricao_unificada.php. */
export function InscreverModal({ atividade: a, onClose }: Props) {
  const inscrever = useInscrever()
  const [sucesso, setSucesso] = useState(false)
  const isEvento = a.tipo === 'evento'
  const Icon = isEvento ? Tent : GraduationCap

  async function confirmar() {
    try {
      await inscrever.mutateAsync({ tipo: a.tipo, id: a.id })
      setSucesso(true)
    } catch (err) {
      notificar.erro(getApiErrorMessage(err, 'Não foi possível concluir a inscrição.'))
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in" onClick={onClose}>
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-mist-100 px-6 py-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
            <Icon className="size-5 text-accent-500" /> {isEvento ? 'Inscrever-me na actividade' : 'Inscrever-me na formação'}
          </h2>
          <button onClick={onClose} aria-label="Fechar" className="text-mist-400 transition hover:text-error-text">
            <X className="size-5" />
          </button>
        </div>

        <div className="px-6 py-6">
          {sucesso ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <div className="grid size-14 place-items-center rounded-full bg-success-bg">
                <CircleCheck className="size-7 text-success-text" />
              </div>
              <p className="text-sm font-medium text-slate-800">Inscrição enviada com sucesso!</p>
              <p className="text-xs text-mist-400">
                Fica <strong>pendente de aprovação</strong>. Vais poder acompanhar o estado na tab
                {isEvento ? ' Actividades' : ' Formações'} do teu perfil.
              </p>
              <Button onClick={onClose} className="mt-2 w-full">Fechar</Button>
            </div>
          ) : (
            <>
              <h3 className="mb-3 text-base font-bold text-slate-900">{a.titulo}</h3>
              <div className="mb-4 space-y-2 text-sm text-mist-600">
                <p className="flex items-center gap-2">
                  <Calendar className="size-3.5 text-mist-300" />
                  {new Date(a.data_inicio).toLocaleDateString('pt-PT')}
                </p>
                {a.dioceses && (
                  <p className="flex items-center gap-2">
                    <MapPin className="size-3.5 text-mist-300" /> {a.dioceses}
                  </p>
                )}
                <p className="flex items-center gap-2">
                  <Users className="size-3.5 text-mist-300" /> {a.num_inscritos} / {a.vagas} vagas ocupadas
                </p>
                <p>
                  <span className="text-mist-400">Custo:</span>{' '}
                  {a.tipo_acesso === 'Grátis' ? (
                    <span className="font-semibold text-success-text">Gratuito</span>
                  ) : (
                    <span className="font-semibold text-slate-800">
                      {a.valor.toLocaleString('pt-PT', { minimumFractionDigits: 2 })} Kz
                    </span>
                  )}
                </p>
              </div>

              <p className="mb-5 text-xs text-mist-400">
                Ao confirmar, o pedido de inscrição fica pendente de aprovação. Se a actividade for paga,
                poderás efectuar o pagamento depois de aprovada.
              </p>

              <div className="flex justify-end gap-3">
                <Button variant="secondary" onClick={onClose}>Cancelar</Button>
                <Button onClick={confirmar} loading={inscrever.isPending}>
                  {inscrever.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
                  Confirmar Inscrição
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
