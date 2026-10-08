import { API_BASE_URL } from './apiUrl'

/**
 * A API serve em /uploads/<subpasta>/<ficheiro> SÓ as pastas PÚBLICAS
 * (imagens sem dados sensíveis, mostradas em <img> a qualquer pessoa) —
 * ver sigeca-api/src/utils/pastasUploads.js. Nomes alinhados com a
 * estrutura real de /uploads: 'avatar' (fotos de utilizador — não 'perfis').
 *
 * Ficheiros PRIVADOS (comprovativos, recibos, certificados, declarações…)
 * NÃO passam por aqui — a API responde 404 em /uploads. Descarregam-se
 * pela API com o token (lib/download.ts → baixarFicheiroProtegido).
 */
export type PastaPublica = 'avatar' | 'aparencia' | 'eventos' | 'formacoes' | 'produtos' | 'votacoes' | 'cartao' | 'eventos-galeria'

const PASTAS_PUBLICAS: ReadonlySet<string> = new Set<PastaPublica>(['avatar', 'aparencia', 'eventos', 'formacoes', 'produtos', 'votacoes', 'cartao', 'eventos-galeria'])

export function uploadUrl(subpasta: PastaPublica, ficheiro: string | null | undefined): string | null {
  if (!ficheiro || !PASTAS_PUBLICAS.has(subpasta)) return null
  return `${API_BASE_URL}/uploads/${subpasta}/${encodeURIComponent(ficheiro)}`
}
