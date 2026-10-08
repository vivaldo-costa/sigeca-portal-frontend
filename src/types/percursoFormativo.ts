import type { CategoriaFormacao } from './dashboard'

export const LABEL_CATEGORIA: Record<CategoriaFormacao, string> = {
  formacao_inicial: 'Formação Inicial',
  formacao_especifica: 'Formação Específica',
  formacao_continua: 'Formação Contínua',
  seminario: 'Seminários',
  formacao_complementar: 'Formação Complementar',
}

/** Candidatura a dirigente do próprio sócio — "O meu percurso" (GET /candidatos-dirigente/meu-percurso). */
export interface MinhaCandidatura {
  id: number
  formacao_pretendida_id: number
  formacao_nome: string
  formacao_categoria: string
  estado: string
  created_at: string
  updated_at: string
  agrupamento_nome: string
  ab_agrupamento: string | null
  turma_codigo: string | null
  turma_data_inicio: string | null
  turma_data_fim: string | null
  turma_local: string | null
}

export const LABEL_ESTADO_CANDIDATURA: Record<string, string> = {
  registo_iniciado: 'Registo iniciado',
  em_validacao_chefe_agrupamento: 'Em validação — Chefe de Agrupamento',
  em_validacao_paroco: 'Em validação — Assistente',
  em_aprovacao_vicarial: 'Em aprovação — Coordenação Vicarial',
  em_validacao_diocesana: 'Em validação — Equipa de Formação Diocesana',
  devolvido_correcao: 'Devolvido para correcção',
  rejeitado: 'Não aprovado',
  validado: 'Validado',
  na_lista_candidatos: 'Na Lista de Candidatos — a aguardar turma',
  selecionado_turma: 'Seleccionado para turma',
  em_formacao: 'Em formação',
  formacao_concluida_aguardar_tutoria: 'Formação concluída — a aguardar tutoria',
  em_tutoria: 'Em tutoria',
  tutoria_concluida_relatorio_pendente: 'Tutoria concluída — relatório pendente',
  relatorio_em_validacao: 'Relatório de tutoria em validação',
  tutoria_validada: 'Tutoria validada — a aguardar certificado',
  certificado_emitido_aguardar_promessa: 'Certificado emitido — a aguardar Promessa',
  promessa_realizada: 'Promessa realizada',
  processo_formativo_concluido: 'Processo formativo concluído',
}

/** As grandes etapas do percurso, para a barra de progresso — cada estado cai numa delas. */
export const ETAPAS_PERCURSO: { label: string; estados: string[] }[] = [
  { label: 'Validação', estados: ['registo_iniciado', 'em_validacao_chefe_agrupamento', 'em_validacao_paroco', 'em_aprovacao_vicarial', 'em_validacao_diocesana', 'devolvido_correcao', 'validado'] },
  { label: 'Lista de Candidatos', estados: ['na_lista_candidatos', 'selecionado_turma'] },
  { label: 'Formação', estados: ['em_formacao', 'formacao_concluida_aguardar_tutoria'] },
  { label: 'Tutoria', estados: ['em_tutoria', 'tutoria_concluida_relatorio_pendente', 'relatorio_em_validacao', 'tutoria_validada'] },
  { label: 'Certificado e Promessa', estados: ['certificado_emitido_aguardar_promessa', 'promessa_realizada', 'processo_formativo_concluido'] },
]
