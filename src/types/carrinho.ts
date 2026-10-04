export interface ItemCarrinho {
  id: number
  produto_id: number
  nome: string
  imagem: string | null
  quantidade: number
  preco_unitario: number
  tamanho: string | null
  cor: string | null
  stock_variacao: number
  subtotal: number
}

export interface CarrinhoData {
  itens: ItemCarrinho[]
  total: number
}

export type TipoEntrega = 'levantamento' | 'domicilio'
export type MetodoPagamento = 'transferencia' | 'multicaixa'

export interface ZonaEntrega {
  key: string
  nome: string
  preco: number
}

export interface CheckoutPayload {
  metodo_pagamento: MetodoPagamento
  referencia_pagamento: string
  comprovativo: File
  tipo_entrega: TipoEntrega
  zona_entrega?: string
  municipio?: string
  bairro?: string
  referencia_morada?: string
  telefone?: string
}

export interface FinalizarPedidoResposta {
  success: boolean
  message: string
  pedido_id?: number
}
