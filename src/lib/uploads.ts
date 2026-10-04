import { API_BASE_URL } from './apiUrl'

/**
 * A API serve ficheiros enviados em /uploads/<subpasta>/<ficheiro>
 * (ver app.js: express.static + upload.middleware.js: criarUpload(subpasta)).
 * Nomes alinhados com a estrutura real de /uploads: 'avatar' (fotos de
 * utilizador — não 'perfis') e 'comprovativos_pedidos' (pagamentos/
 * checkout — não 'comprovativos').
 */
export function uploadUrl(subpasta: 'avatar' | 'comprovativos_pedidos' | 'aparencia' | 'eventos' | 'formacoes' | 'produtos' | 'votacoes' | 'documentos' | 'cartao' | 'eventos-galeria', ficheiro: string | null | undefined): string | null {
  if (!ficheiro) return null
  return `${API_BASE_URL}/uploads/${subpasta}/${ficheiro}`
}
