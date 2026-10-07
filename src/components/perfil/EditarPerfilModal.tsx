import { useState, type FormEvent } from 'react'
import { X, Camera, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { notificar } from '@/lib/notificar'
import { useAtualizarPerfil } from '@/hooks/usePerfil'
import { getApiErrorMessage } from '@/lib/api'
import { uploadUrl } from '@/lib/uploads'
import type { PerfilDados } from '@/types/perfil'

const SACRAMENTOS_DISPONIVEIS = ['Baptismo', 'Comunhão', 'Crisma', 'Matrimónio', 'Ordem', 'Consagrada']
const GRUPOS_SANGUINEOS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

interface Props {
  dados: PerfilDados
  onClose: () => void
}

export function EditarPerfilModal({ dados, onClose }: Props) {
  const mutation = useAtualizarPerfil()
  const [preview, setPreview] = useState<string | null>(null)
  const [foto, setFoto] = useState<File | null>(null)

  const [form, setForm] = useState({
    nome: dados.nome ?? '',
    email: dados.email ?? '',
    telefone: dados.telefone ?? '',
    endereco: dados.endereco ?? '',
    bilhete_identidade: dados.bilhete_identidade ?? '',
    data_nascimento: dados.data_nascimento ?? '',
    grupo_sanguineo: dados.grupo_sanguineo ?? '',
    sacramentos: dados.sacramento ? dados.sacramento.split(',').map((s) => s.trim()) : ([] as string[]),
  })

  const [senhas, setSenhas] = useState({ senha_atual: '', nova_senha: '', confirmar_senha: '' })
  const querAlterarSenha = senhas.senha_atual || senhas.nova_senha || senhas.confirmar_senha

  function onFotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setFoto(file)
    setPreview(URL.createObjectURL(file))
  }

  function toggleSacramento(s: string) {
    setForm((f) => ({
      ...f,
      sacramentos: f.sacramentos.includes(s) ? f.sacramentos.filter((x) => x !== s) : [...f.sacramentos, s],
    }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (querAlterarSenha && senhas.nova_senha !== senhas.confirmar_senha) {
      notificar.erro('A nova palavra-passe e a confirmação não coincidem.')
      return
    }

    try {
      await mutation.mutateAsync({
        ...form,
        foto,
        ...(querAlterarSenha ? senhas : {}),
      })
      notificar.sucesso('Perfil actualizado com sucesso.')
      onClose()
    } catch (err) {
      notificar.erro(getApiErrorMessage(err, 'Não foi possível guardar as alterações.'))
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-fade-in" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-mist-100 bg-white px-6 py-4">
          <h2 className="text-lg font-bold text-ink">Editar Perfil</h2>
          <button onClick={onClose} aria-label="Fechar" className="text-mist-400 transition hover:text-error-text">
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6">

          {/* Foto */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={
                  preview ??
                  (dados.foto
                    ? uploadUrl('avatar', dados.foto)!
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(dados.nome)}&background=003366&color=fff`)
                }
                className="size-20 rounded-full border-2 border-mist-200 object-cover"
                alt=""
              />
              <label className="absolute -bottom-1 -right-1 grid size-7 cursor-pointer place-items-center rounded-full bg-brand-600 text-white shadow-md transition hover:bg-brand-700">
                <Camera className="size-3.5" />
                <input type="file" accept="image/*" className="hidden" onChange={onFotoChange} />
              </label>
            </div>
            <p className="text-xs text-mist-400">PNG ou JPG, até 4MB. Recomendado formato quadrado.</p>
          </div>

          {/* Dados pessoais */}
          <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
            <Input label="Nome completo" required value={form.nome} onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))} />
            <Input label="E-mail" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
            <Input label="Telefone" value={form.telefone} onChange={(e) => setForm((f) => ({ ...f, telefone: e.target.value }))} />
            <Input label="Bilhete de Identidade" value={form.bilhete_identidade} onChange={(e) => setForm((f) => ({ ...f, bilhete_identidade: e.target.value }))} />
            <Input label="Data de Nascimento" type="date" value={form.data_nascimento ?? ''} onChange={(e) => setForm((f) => ({ ...f, data_nascimento: e.target.value }))} />
            <div className="mb-4">
              <label className="mb-1.5 block text-[13px] font-medium tracking-wide text-mist-600">Grupo Sanguíneo</label>
              <select
                value={form.grupo_sanguineo}
                onChange={(e) => setForm((f) => ({ ...f, grupo_sanguineo: e.target.value }))}
                className="h-12 w-full rounded-[var(--radius-sig-md)] border-[1.5px] border-mist-200 bg-mist-50 px-3.5 text-[15px] outline-none transition-colors hover:border-mist-400 hover:bg-white focus:border-ink focus:bg-white"
              >
                <option value="">Seleccionar…</option>
                {GRUPOS_SANGUINEOS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>
          <Input label="Morada" value={form.endereco} onChange={(e) => setForm((f) => ({ ...f, endereco: e.target.value }))} />

          {/* Sacramentos */}
          <div>
            <label className="mb-2 block text-[13px] font-medium tracking-wide text-mist-600">Sacramentos recebidos</label>
            <div className="flex flex-wrap gap-2">
              {SACRAMENTOS_DISPONIVEIS.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => toggleSacramento(s)}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                    form.sacramentos.includes(s)
                      ? 'border-brand-600 bg-brand-600 text-white'
                      : 'border-mist-200 text-mist-600 hover:border-brand-600'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Palavra-passe */}
          <div className="border-t border-mist-100 pt-5">
            <p className="mb-3 text-[13px] font-medium tracking-wide text-mist-600">
              Alterar palavra-passe <span className="text-mist-300">(opcional)</span>
            </p>
            <Input
              type="password"
              placeholder="Palavra-passe actual"
              value={senhas.senha_atual}
              onChange={(e) => setSenhas((s) => ({ ...s, senha_atual: e.target.value }))}
            />
            <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
              <Input
                type="password"
                placeholder="Nova palavra-passe"
                value={senhas.nova_senha}
                onChange={(e) => setSenhas((s) => ({ ...s, nova_senha: e.target.value }))}
              />
              <Input
                type="password"
                placeholder="Confirmar nova palavra-passe"
                value={senhas.confirmar_senha}
                onChange={(e) => setSenhas((s) => ({ ...s, confirmar_senha: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-mist-100 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
            <Button type="submit" loading={mutation.isPending}>
              {mutation.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
              Guardar Alterações
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
