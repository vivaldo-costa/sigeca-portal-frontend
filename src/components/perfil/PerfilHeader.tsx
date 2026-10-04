import { Pencil, ShieldHalf, IdCard, Users } from 'lucide-react'
import type { PerfilDados } from '@/types/perfil'
import { uploadUrl } from '@/lib/uploads'

const CATEGORIAS = ['Dirigente', 'Candidato']

export function PerfilHeader({ dados, onEditar }: { dados: PerfilDados; onEditar: () => void }) {
  const rotulo = dados.seccao && CATEGORIAS.includes(dados.seccao) ? 'Categoria' : 'Secção'

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-t-2xl bg-white px-6 py-5 shadow-sm">
      <div className="flex items-center gap-5">
        <img
          src={
            dados.foto
              ? uploadUrl('avatar', dados.foto)!
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(dados.nome)}&background=003366&color=fff`
          }
          className="size-20 shrink-0 rounded-full border-2 border-mist-200 object-cover"
          alt={`Foto de ${dados.nome}`}
        />
        <div>
          <h2 className="text-lg font-bold text-slate-900">{dados.nome}</h2>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-mist-400">
            <ShieldHalf className="size-3.5 text-brand-600" />
            <span className="font-medium text-slate-700">{rotulo}:</span>
            {dados.seccao ?? '—'}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-600/8 px-2.5 py-1 text-xs font-semibold text-brand-600">
              <IdCard className="size-3" />
              {dados.codigo_associado}
            </span>
            {dados.sacramento && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                ✝ {dados.sacramento.split(',')[0]}
              </span>
            )}
            {dados.agrupamento && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-mist-100 px-2.5 py-1 text-xs font-medium text-mist-600">
                <Users className="size-3" />
                {dados.agrupamento}
              </span>
            )}
          </div>
        </div>
      </div>
      <button
        onClick={onEditar}
        className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
      >
        <Pencil className="mr-1.5 inline size-3.5" /> Editar
      </button>
    </div>
  )
}
