import { type FormEvent, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Lock, ArrowLeft } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Alert } from '@/components/ui/Alert'
import { api, getApiErrorMessage } from '@/lib/api'

export function RedefinirPasswordPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const token = params.get('token') ?? ''

  const [novaSenha, setNovaSenha] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErro(null)
    if (novaSenha !== confirmar) {
      setErro('As duas palavras-passe têm de ser iguais.')
      return
    }
    setEnviando(true)
    try {
      await api.post('/auth/redefinir-password', { token, novaSenha })
      navigate('/login?redefinida=1', { replace: true })
    } catch (err) {
      setErro(getApiErrorMessage(err, 'Não foi possível redefinir a palavra-passe.'))
    } finally {
      setEnviando(false)
    }
  }

  if (!token) {
    return (
      <div className="grid min-h-screen place-items-center bg-paper px-4">
        <div className="w-full max-w-[400px]">
          <Alert variant="error">Este link não é válido. Pede uma nova recuperação de acesso.</Alert>
          <Link to="/recuperar" className="mt-6 flex items-center gap-1.5 text-[13.5px] font-medium text-ink underline underline-offset-2">
            <ArrowLeft className="size-3.5" /> Pedir novo link
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="grid min-h-screen place-items-center bg-paper px-4">
      <div className="w-full max-w-[400px]">
        <h1 className="mb-1.5 font-display text-[1.8rem] font-bold text-ink">Definir nova palavra-passe</h1>
        <p className="mb-6 text-[14.5px] text-mist-400">Escolhe uma nova palavra-passe para a tua conta SIGECA.</p>

        <form onSubmit={handleSubmit}>
          {erro && <div className="mb-4"><Alert variant="error">{erro}</Alert></div>}
          <Input
            id="novaSenha"
            type="password"
            label="Nova palavra-passe"
            icon={<Lock className="size-4" />}
            placeholder="••••••••"
            autoComplete="new-password"
            required
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
          />
          <Input
            id="confirmar"
            type="password"
            label="Confirmar palavra-passe"
            icon={<Lock className="size-4" />}
            placeholder="••••••••"
            autoComplete="new-password"
            required
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
          />
          <Button type="submit" size="lg" className="mt-2 w-full" loading={enviando}>
            Redefinir palavra-passe
          </Button>
        </form>
      </div>
    </div>
  )
}
