import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

interface InscreverPayload {
  tipo: 'evento' | 'formacao'
  id: number
}

/**
 * Inscrição unificada — equivalente a inscricao_unificada.php: valida
 * diocese/idade no backend e cria o registo com estado 'pendente'.
 */
export function useInscrever() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ tipo, id }: InscreverPayload) => {
      const { data } = await api.post('/inscricoes', tipo === 'evento' ? { evento_id: id } : { formacao_id: id })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['perfil'] })
    },
  })
}

export interface PagamentoPayload {
  inscricao_id: number
  evento_id: number
  metodo_pagamento: string
  tipo_pagamento: 'completo' | 'prestacao'
  transacao: string
  numero_prestacao?: number
  comprovativo?: File | null
}

/** Regista um pagamento (completo ou por prestação) com upload do comprovativo. */
export function useRegistarPagamento() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: PagamentoPayload) => {
      const form = new FormData()
      form.append('inscricao_id', String(payload.inscricao_id))
      form.append('evento_id', String(payload.evento_id))
      form.append('metodo_pagamento', payload.metodo_pagamento)
      form.append('tipo_pagamento', payload.tipo_pagamento)
      form.append('transacao', payload.transacao)
      if (payload.numero_prestacao) form.append('numero_prestacao', String(payload.numero_prestacao))
      if (payload.comprovativo) form.append('comprovativo', payload.comprovativo)

      const { data } = await api.post('/pagamentos/evento', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['perfil'] })
    },
  })
}
