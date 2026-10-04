import { api } from './api'

/**
 * Downloads directos (`<a href>`, `window.location.href`) NÃO funcionam para
 * ficheiros protegidos nesta API: a autenticação é só JWT via header
 * `Authorization`, não há cookie de sessão para o browser enviar sozinho
 * numa navegação simples. Por isso qualquer PDF/recibo que exija sessão tem
 * de passar pelo cliente `api` (que já anexa o Bearer token) e ser
 * despoletado como blob.
 */
export async function baixarFicheiroProtegido(url: string, nomeFicheiro: string) {
  const resposta = await api.get(url, { responseType: 'blob' })
  const blobUrl = window.URL.createObjectURL(resposta.data)
  const link = document.createElement('a')
  link.href = blobUrl
  link.download = nomeFicheiro
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(blobUrl)
}
