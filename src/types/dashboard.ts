export interface ProdutoVariacao {
  produto_id: number
  tamanho: string | null
  cor: string | null
  stock: number
}

export interface Produto {
  id: number
  nome: string
  descricao: string | null
  preco: number
  preco_antigo: number | null
  etiqueta: string | null
  stock: number
  imagem: string | null
  imagens: string[]
  variacoes?: ProdutoVariacao[]
  categoria_id: number | null
  categoria_nome: string | null
  avaliacao_media: number | null
  avaliacao_total: number
}

export interface ProdutoAvaliacao {
  id: number
  nota: number
  comentario: string | null
  created_at: string
  updated_at: string
  utilizador_id: number
  utilizador_nome: string
  compra_verificada: boolean | number
}

export interface MinhaAvaliacao {
  id: number
  nota: number
  comentario: string | null
  created_at: string
  updated_at: string
}

export type EstadoInscricao = null | 'pendente' | 'confirmada' | 'pago' | 'cancelada' | 'cancelado'

export interface Atividade {
  id: number
  titulo: string
  descricao: string | null
  data_evento: string
  data_fim: string | null
  data_inicio: string
  imagem: string | null
  tipo: 'evento' | 'formacao'
  tipo_acesso: 'Grátis' | 'Pago'
  valor: number
  secao: string | null
  vagas: number
  num_inscritos: number
  dioceses: string | null
  inscrito: boolean
  estado: EstadoInscricao
  // Preenchidos quando ha inscricao (necessarios para o fluxo de pagamento)
  inscricao_id?: number
  valor_pago?: number
  prestacoes?: number
  galeria_total: number
}

export interface FotoGaleria {
  id: number
  atividade_id: number
  imagem: string
  legenda: string | null
  ordem: number
  created_at: string
  criado_por_nome: string | null
}

export type CategoriaFormacao = 'formacao_inicial' | 'formacao_especifica' | 'formacao_continua' | 'seminario' | 'formacao_complementar'

export interface CatalogoFormacaoItem {
  id: number
  categoria: CategoriaFormacao
  nome: string
  descricao: string | null
  carga_horaria: number | null
  publico_alvo: string | null
  ativo: boolean
  minimo_participantes: number | null
  maximo_participantes: number | null
  total_cursos: number
  pre_requisito_id: number | null
  pre_requisito_nome: string | null
}

export interface ProgramaEventoItem {
  id: number
  atividade_id: number
  data: string
  hora_inicio: string
  hora_fim: string | null
  titulo: string
  local: string | null
  responsavel_id: number | null
  responsavel_nome: string | null
  ramo: string | null
  capacidade: number | null
  materiais: string | null
}

export interface Faq {
  pergunta: string
  resposta: string
}

export interface Cartao {
  id: number
  codigo_associado: string
  data_emissao: string | null
  validade: string | null
  data_inicio: string | null
  status: string
  diocese_nome: string | null
  vigararia_nome: string | null
  agrupamento_display: string
  seccao_nome: string | null
  grupo_sanguineo: string | null
}

export interface UtilizadorAvatar {
  nome: string
  foto: string | null
}

export interface Votante {
  nome: string
  foto: string | null
}

export interface Votacao {
  id: number
  titulo: string
  descricao: string | null
  imagem: string | null
  data_inicio: string
  data_fim: string
  ativo: boolean
  totalVotos: number
  votantes: Votante[]
}

export interface DashboardData {
  produtos: Produto[]
  atividades: Atividade[]
  faqs: Faq[]
  cartao: Cartao | null
  totalItensCarrinho: number
  totalUtilizadores: number
  utilizadoresAvatares: UtilizadorAvatar[]
  stats: { eventos: number; formacoes: number; produtos: number }
  votacoes: Votacao[]
}
