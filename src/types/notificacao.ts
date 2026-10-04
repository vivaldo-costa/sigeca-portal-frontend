export type LocalExibicao = 'abertura' | 'dashboard' | 'perfil' | 'loja' | 'documentos' | 'actividades'

export interface NotificacaoVisivel {
  id: number
  titulo: string | null
  mensagem: string
  local_exibicao: LocalExibicao
  global: number
  lida: number
  created_at: string
}
