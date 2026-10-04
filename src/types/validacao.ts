export interface ValidacaoEvento {
  titulo: string
  data_evento: string
  data_fim: string | null
  local: string | null
  estado: string
  inscrito_em: string
}

export interface ValidacaoFormacao {
  titulo: string
  data_inicio: string
  data_fim: string | null
  local: string | null
  estado: string
  inscrito_em: string
}

export interface ValidacaoPedido {
  produto: string
  quantidade: number
  subtotal: number | null
  status: string
  pedido_em: string
}

export interface ValidacaoCartao {
  encontrado: boolean
  expirado: boolean
  codigo_associado: string
  nome: string
  seccao: string | null
  agrupamento: string | null
  diocese: string | null
  validade: string
  eventos: ValidacaoEvento[]
  formacoes: ValidacaoFormacao[]
  pedidos: ValidacaoPedido[]
}
