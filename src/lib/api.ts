import axios from 'axios'
import { tokenStore } from './tokenStore'
import { API_BASE_URL } from './apiUrl'

/**
 * Cliente HTTP para a SIGECA API (Node.js + Express + JWT).
 *
 * Diferenças importantes face à hipotese inicial (sessao PHP por cookie):
 * - Autenticacao por Bearer token (Authorization header), nao cookie.
 * - Envelope de resposta em portugues: { sucesso, dados, mensagem } e nao
 *   { success, data, message }.
 * - Em caso de token expirado, tentamos um refresh automatico (uma vez) via
 *   POST /auth/refresh antes de desistir e mandar para o login.
 */
export const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
})

export interface ApiEnvelope<T> {
  sucesso: boolean
  dados?: T
  mensagem?: string
  detalhes?: unknown
}

api.interceptors.request.use((config) => {
  const token = tokenStore.getAccess()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let refreshEmCurso: Promise<string | null> | null = null

async function tentarRefresh(): Promise<string | null> {
  const refreshToken = tokenStore.getRefresh()
  if (!refreshToken) return null

  if (!refreshEmCurso) {
    refreshEmCurso = axios
      .post(`${API_BASE_URL}/api/v1/auth/refresh`, { refreshToken })
      .then((res) => {
        const novoAccess = res.data.accessToken as string
        tokenStore.set(novoAccess)
        return novoAccess
      })
      .catch(() => {
        tokenStore.clear()
        return null
      })
      .finally(() => {
        refreshEmCurso = null
      })
  }
  return refreshEmCurso
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      const novoToken = await tentarRefresh()
      if (novoToken) {
        original.headers.Authorization = `Bearer ${novoToken}`
        return api(original)
      }
      const current = window.location.pathname
      if (current !== '/login') {
        window.location.href = `/login?redirect=${encodeURIComponent(current)}`
      }
    }
    return Promise.reject(error)
  }
)

/** Extrai uma mensagem de erro legivel de uma resposta Axios/API (campo `mensagem`, nao `message`). */
export function getApiErrorMessage(error: unknown, fallback = 'Ocorreu um erro. Tenta novamente.'): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiEnvelope<unknown> | undefined
    if (data?.mensagem) return data.mensagem
  }
  return fallback
}
