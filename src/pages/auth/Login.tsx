import { type FormEvent, useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { IdCard, Lock, ShieldCheck } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { useAuthStore } from '@/store/auth'
import { CampoCaptcha } from '@/components/auth/CampoCaptcha'
import { useAparenciaGlobal } from '@/hooks/useAparenciaGlobal'
import { uploadUrl } from '@/lib/uploads'
import logoEstatico from '@/assets/sigeca-logo.svg'

/**
 * Réplica em React do ecrã de login actual (index.php):
 * mesmo layout de dois painéis, mesma identidade visual (preto/branco,
 * imagem de fundo à esquerda com estatísticas), agora ligado ao store
 * de autenticação em vez de submeter directamente para auth/login.php.
 */
export function LoginPage() {
  const [identificador, setIdentificador] = useState('')
  const [senha, setSenha] = useState('')
  const [captchaToken, setCaptchaToken] = useState('')
  const [captchaResposta, setCaptchaResposta] = useState('')
  const [codigo2fa, setCodigo2fa] = useState('')
  const { login, verificarSegundoFactor, status, error, captchaExigido } = useAuthStore()
  const estaCarregando = status === 'loading'
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const aparencia = useAparenciaGlobal()
  const [logoFalhou, setLogoFalhou] = useState(false)
  const logoLogin = !logoFalhou ? uploadUrl('aparencia', aparencia?.logo_login_path) : null

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const ok = await login({ identificador, senha, ...(captchaExigido ? { captchaToken, captchaResposta } : {}) })
    if (ok) {
      navigate(params.get('redirect') ?? '/dashboard', { replace: true })
    }
  }

  async function handleSubmit2fa(e: FormEvent) {
    e.preventDefault()
    const ok = await verificarSegundoFactor(codigo2fa)
    if (ok) navigate(params.get('redirect') ?? '/dashboard', { replace: true })
  }

  return (
    <div className="fixed inset-0 grid grid-cols-1 lg:grid-cols-2">
      {/* Painel esquerdo — identidade / prova social */}
      <div className="relative hidden overflow-hidden bg-ink lg:block">
        <img
          src="https://aeca.ao/SIGECA/src/img/login.jpeg"
          alt=""
          className="absolute inset-0 h-full w-full scale-105 object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/25 to-black/70" />

        <div className="absolute left-10 top-10 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[13px] font-medium text-white backdrop-blur-lg">
          <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
          Sistema activo
        </div>

        <div className="absolute inset-x-10 bottom-12 text-white">
          <h1 className="mb-3 font-display text-[clamp(1.5rem,2.4vw,2.3rem)] font-bold leading-tight">
            Gestão simplificada.<br />Resultados reais.
          </h1>
          <p className="max-w-[340px] text-[15px] font-light leading-relaxed text-white/65">
            Acede ao teu espaço pessoal e acompanha todos os serviços da AECA em tempo real.
          </p>
          <div className="mt-8 flex gap-8 border-t border-white/15 pt-6">
            <Stat num="+10.000" label="Associados" />
            <Stat num="99.9%" label="Disponibilidade" />
            <Stat num="24/7" label="Suporte" />
          </div>
        </div>
      </div>

      {/* Painel direito — formulário */}
      <div className="flex flex-col overflow-y-auto bg-paper">
        <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center px-8 py-12">
          <div className="mb-8">
            <img src={logoLogin ?? logoEstatico} alt="SIGECA" className="h-10" onError={() => setLogoFalhou(true)} />
          </div>

          {error && <Alert variant="error">{error}</Alert>}

          <div className="mb-7">
            <h2 className="mb-1.5 font-display text-[1.8rem] font-bold text-ink">
              {status === 'aguarda2fa' ? 'Confirmação em duas etapas' : 'Iniciar sessão'}
            </h2>
            <p className="text-[14.5px] text-mist-400">
              {status === 'aguarda2fa'
                ? 'Introduz o código de 6 dígitos da tua app de autenticação, ou um código de recuperação.'
                : 'Acede à tua conta e acompanha os teus serviços.'}
            </p>
          </div>

          {status === 'aguarda2fa' ? (
            <form onSubmit={handleSubmit2fa}>
              <Input
                id="codigo2fa"
                label="Código"
                icon={<ShieldCheck className="size-4" />}
                placeholder="000000"
                autoComplete="one-time-code"
                autoFocus
                required
                value={codigo2fa}
                onChange={(e) => setCodigo2fa(e.target.value)}
              />
              <Button type="submit" size="lg" className="mt-2 w-full" loading={estaCarregando}>
                Confirmar
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSubmit}>
              <Input
                id="identificador"
                label="Nº SIGECA ou e-mail"
                icon={<IdCard className="size-4" />}
                placeholder="LA1006001"
                autoComplete="username"
                required
                value={identificador}
                onChange={(e) => setIdentificador(e.target.value)}
              />
              <Input
                id="senha"
                type="password"
                label="Palavra-passe"
                icon={<Lock className="size-4" />}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              {captchaExigido && (
                <CampoCaptcha onToken={setCaptchaToken} resposta={captchaResposta} onRespostaChange={setCaptchaResposta} />
              )}
              <Button type="submit" size="lg" className="mt-2 w-full" loading={estaCarregando}>
                Entrar
              </Button>
            </form>
          )}

          <p className="mt-6 text-center text-[13.5px] text-mist-400">
            Esqueceste a palavra-passe?{' '}
            <Link to="/recuperar" className="font-medium text-ink underline underline-offset-2">
              Recuperar acesso
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function Stat({ num, label }: { num: string; label: string }) {
  return (
    <div>
      <div className="font-display text-2xl font-bold text-white">{num}</div>
      <div className="mt-0.5 text-xs text-white/45">{label}</div>
    </div>
  )
}
