import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { CarrinhoData, CheckoutPayload, FinalizarPedidoResposta } from '@/types/carrinho'

export function useCarrinho() {
  return useQuery({
    queryKey: ['carrinho'],
    queryFn: async () => {
      const { data } = await api.get<{ dados: CarrinhoData }>('/carrinho')
      return data.dados
    },
  })
}

interface AdicionarPayload {
  produto_id: number
  quantidade: number
  tamanho?: string | null
  cor?: string | null
}

/** Equivalente ao INSERT em `carrinho` feito ao clicar "Adicionar" na Loja. */
export function useAdicionarAoCarrinho() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: AdicionarPayload) => {
      const { data } = await api.post('/carrinho', payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carrinho'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

/** Equivalente a api/atualizar_quantidade.php. */
export function useAtualizarQuantidade() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, quantidade }: { id: number; quantidade: number }) => {
      const { data } = await api.patch(`/carrinho/${id}`, { quantidade })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carrinho'] })
    },
  })
}

/** Equivalente a api/remover_item.php. */
export function useRemoverItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete(`/carrinho/${id}`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carrinho'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

/** Equivalente a api/finalizar_pedido.php. */
export function useFinalizarPedido() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: CheckoutPayload) => {
      const form = new FormData()
      form.append('metodo_pagamento', payload.metodo_pagamento)
      form.append('referencia_pagamento', payload.referencia_pagamento)
      form.append('comprovativo', payload.comprovativo)
      form.append('tipo_entrega', payload.tipo_entrega)
      if (payload.zona_entrega) form.append('zona_entrega', payload.zona_entrega)
      if (payload.municipio) form.append('municipio', payload.municipio)
      if (payload.bairro) form.append('bairro', payload.bairro)
      if (payload.referencia_morada) form.append('referencia_morada', payload.referencia_morada)
      if (payload.telefone) form.append('telefone', payload.telefone)

      const { data } = await api.post<FinalizarPedidoResposta>('/carrinho/checkout', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carrinho'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['perfil'] })
    },
  })
}
