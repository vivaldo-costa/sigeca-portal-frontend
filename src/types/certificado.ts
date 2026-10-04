export interface ValidacaoCertificado {
  numero_unico: string
  tipo: 'certificado' | 'declaracao' | 'diploma'
  titulo: string
  validade: string | null
  ativo: number
  motivo_revogacao: string | null
  created_at: string
  utilizador_nome: string
}
