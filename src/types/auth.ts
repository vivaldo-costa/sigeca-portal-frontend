/**
 * Campos garantidos em qualquer resposta autenticada (GET /auth/me devolve
 * so estes 5, vindos do payload do JWT). Os restantes campos so vem
 * preenchidos na resposta de POST /auth/login (linha completa de
 * `utilizadores`, sem senha) — por isso ficam opcionais aqui.
 */
export interface Utilizador {
  id: number
  codigo_associado: string
  nome: string
  perfil_id: number
  perfil_nome: string
  // Só vêm em POST /auth/login, não em GET /auth/me:
  genero?: string
  email?: string | null
  telefone?: string | null
  foto?: string | null
  estado?: string
  diocese_id?: number | null
  vigararia_id?: number | null
  paroquia_id?: number | null
  agrupamento_id?: number | null
  seccao_id?: number | null
  data_nascimento?: string | null
}

export interface LoginPayload {
  /** Nº SIGECA (codigo_associado) OU email — a API aceita os dois no mesmo campo. */
  identificador: string
  senha: string
  captchaToken?: string
  captchaResposta?: string
}
