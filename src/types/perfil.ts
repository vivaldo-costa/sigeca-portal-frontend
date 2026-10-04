export interface PerfilDados {
  codigo_associado: string
  nome: string
  foto: string | null
  grupo_sanguineo: string | null
  email: string | null
  telefone: string | null
  sacramento: string | null // CSV: "Baptismo,Crisma,..."
  endereco: string | null
  bilhete_identidade: string | null
  genero: string | null
  data_nascimento: string | null
  paroquia: string | null
  diocese: string | null
  vigararia: string | null
  agrupamento: string | null
  seccao: string | null
  perfil: string | null
  pode_ver_votacoes: boolean
}

export type EstadoInscricaoPerfil = 'pendente' | 'confirmada' | 'pago' | 'cancelada' | string

export interface InscricaoEvento {
  titulo: string
  descricao: string | null
  imagem: string | null
  local: string | null
  data_evento: string
  inscrito_em: string
  estado: EstadoInscricaoPerfil
}

export interface InscricaoFormacao {
  titulo: string
  descricao: string | null
  imagem: string | null
  local: string | null
  data_inicio: string
  data_fim: string | null
  inscrito_em: string
  vagas_totais: number
  vagas_ocupadas: number
  vagas_disponiveis: number
}

export interface PedidoItem {
  nome: string
  imagem: string | null
  quantidade: number
  preco_unitario: number
  subtotal: number
}

export type StatusPedido = 'pendente' | 'aguardando_pagamento' | 'pago' | 'enviado' | 'entregue' | 'cancelado'

export interface Pedido {
  id: number
  status: StatusPedido
  total: number
  pedido_em: string
  observacoes: string | null
  pdf_recibo: string | null
  itens: PedidoItem[]
}

export type TipoCertificado = 'certificado' | 'declaracao' | 'diploma'

export interface Certificado {
  id: number
  numero_unico: string
  tipo: TipoCertificado
  titulo: string
  utilizador_id: number
  referencia_tipo: string | null
  referencia_id: number | null
  pdf_path: string | null
  codigo_verificacao: string
  emitido_por: number | null
  emitido_por_nome: string | null
  validade: string | null
  ativo: boolean
  motivo_revogacao: string | null
  created_at: string
}

export interface OpcaoVotacao {
  id: number
  opcao: string
}

export interface VotacaoPerfil {
  id: number
  titulo: string
  descricao: string | null
  imagem: string | null
  data_inicio: string
  data_fim: string
  ativo: boolean
  meu_voto: number | null
  opcao_votada: string | null
  opcoes: OpcaoVotacao[]
}

export interface TimelineEvento {
  tipo: 'transferencia' | 'categoria'
  estado_ou_origem: string | null
  de_nome: string | null
  para_nome: string | null
  cargo_anterior: string | null
  cargo_novo: string | null
  motivo: string | null
  data_evento: string
  responsavel_nome: string | null
}

export interface PerfilData {
  dados: PerfilDados
  atividades: InscricaoEvento[]
  formacoes: InscricaoFormacao[]
  pedidos: Pedido[]
  votacoes: VotacaoPerfil[]
}

export interface AtualizarPerfilPayload {
  nome: string
  email: string
  telefone: string
  endereco: string
  bilhete_identidade: string
  data_nascimento: string
  grupo_sanguineo: string
  sacramentos: string[]
  foto?: File | null
  senha_atual?: string
  nova_senha?: string
  confirmar_senha?: string
}
