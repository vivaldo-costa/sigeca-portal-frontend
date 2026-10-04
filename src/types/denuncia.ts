export type EstadoDenuncia = 'nova' | 'em_analise' | 'resolvida' | 'encerrada'

export interface MinhaDenuncia {
  id: number
  tipo: string
  descricao: string
  estado: EstadoDenuncia
  created_at: string
  updated_at: string
}

export interface SubmeterDenunciaPayload {
  tipo: string
  descricao: string
  anonimo: boolean
  associado_codigo?: string
  anexo?: File | null
}
