import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CircleCheck, CircleX, ShieldAlert, Loader2, BadgeCheck } from 'lucide-react'
import { useValidarCertificado } from '@/hooks/useValidarCertificado'
import { useAparenciaGlobal } from '@/hooks/useAparenciaGlobal'
import { uploadUrl } from '@/lib/uploads'
import logo from '@/assets/sigeca-logo.svg'

const LABEL_TIPO = { certificado: 'Certificado', declaracao: 'Declaração', diploma: 'Diploma' }

/**
 * Página pública, sem sessão, acedida ao ler o QR Code de um certificado/
 * declaração/diploma emitido pelo SIGECA — fora do AppShell/ProtectedRoute
 * de propósito, mesmo padrão de /validar-cartao.
 */
export function VerificarCertificadoPage() {
  const [params] = useSearchParams()
  const numero = params.get('numero')
  const codigo = params.get('codigo')
  const { data, isLoading, isError } = useValidarCertificado(numero, codigo)
  const aparencia = useAparenciaGlobal()
  const [logoFalhou, setLogoFalhou] = useState(false)
  const logoPrincipal = !logoFalhou ? (uploadUrl('aparencia', aparencia?.logo_principal_path) ?? logo) : logo

  return (
    <div className="min-h-screen bg-mist-50 px-4 py-8">
      <div className="mx-auto max-w-lg space-y-5">
        <div className="mb-2 flex justify-center">
          <img src={logoPrincipal} alt="SIGECA" className="h-9" onError={() => setLogoFalhou(true)} />
        </div>

        {(!numero || !codigo) && <Aviso texto="Este link de verificação está incompleto. Confirma que abriste o QR Code correcto." />}

        {numero && codigo && isLoading && (
          <div className="flex items-center justify-center gap-2 rounded-2xl bg-white p-10 text-mist-400 shadow-sm">
            <Loader2 className="size-4 animate-spin" /> A verificar documento…
          </div>
        )}

        {numero && codigo && !isLoading && (isError || !data) && (
          <Aviso texto="Documento não encontrado. Verifica o número e o código de verificação, ou contacta a AECA." />
        )}

        {data && (
          <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
            {data.ativo ? (
              <>
                <CircleCheck className="mx-auto mb-3 size-12 text-emerald-500" />
                <p className="text-lg font-bold text-ink">Documento válido</p>
              </>
            ) : (
              <>
                <CircleX className="mx-auto mb-3 size-12 text-red-500" />
                <p className="text-lg font-bold text-ink">Documento revogado</p>
                {data.motivo_revogacao && <p className="mt-1 text-[13px] text-mist-400">{data.motivo_revogacao}</p>}
              </>
            )}

            <div className="mt-5 space-y-2 rounded-xl bg-mist-50 p-4 text-left text-[13.5px]">
              <div className="flex items-center gap-2 text-mist-500">
                <BadgeCheck className="size-3.5 shrink-0" />
                <span>{LABEL_TIPO[data.tipo]}</span>
              </div>
              <p className="font-semibold text-ink">{data.titulo}</p>
              <p className="text-mist-500">Emitido a: <span className="text-ink">{data.utilizador_nome}</span></p>
              <p className="text-mist-400">Nº {data.numero_unico}</p>
              <p className="text-mist-400">Emitido em {new Date(data.created_at).toLocaleDateString('pt-PT')}</p>
              {data.validade && <p className="text-mist-400">Válido até {new Date(data.validade).toLocaleDateString('pt-PT')}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Aviso({ texto }: { texto: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white p-6 text-mist-500 shadow-sm">
      <ShieldAlert className="size-5 shrink-0 text-amber-500" />
      <p className="text-[13.5px]">{texto}</p>
    </div>
  )
}
