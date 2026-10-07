import { Store, Truck, TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { CabecalhoEtapa } from './EtapaResumo'
import type { TipoEntrega, ZonaEntrega } from '@/types/carrinho'

export const ZONAS: ZonaEntrega[] = [
  { key: 'cidade', nome: 'Luanda Cidade', preco: 2000 },
  { key: 'talatona', nome: 'Talatona', preco: 4000 },
  { key: 'viana', nome: 'Viana', preco: 5000 },
  { key: 'kilamba', nome: 'Kilamba', preco: 6000 },
  { key: 'cacuaco', nome: 'Cacuaco', preco: 10000 },
]

interface Props {
  tipoEntrega: TipoEntrega
  setTipoEntrega: (t: TipoEntrega) => void
  zona: string | null
  setZona: (z: string) => void
  bairro: string
  setBairro: (v: string) => void
  referenciaMorada: string
  setReferenciaMorada: (v: string) => void
  telefone: string
  setTelefone: (v: string) => void
  erro: string | null
  submetendo: boolean
  onVoltar: () => void
  onSubmeter: () => void
}

export function EtapaEntrega({
  tipoEntrega, setTipoEntrega, zona, setZona, bairro, setBairro,
  referenciaMorada, setReferenciaMorada, telefone, setTelefone,
  erro, submetendo, onVoltar, onSubmeter,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-mist-100 bg-white shadow-sm">
      <CabecalhoEtapa numero={3} titulo="Forma de Entrega" />
      <div className="space-y-4 p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setTipoEntrega('levantamento')}
            className={`flex items-start gap-3 rounded-xl border p-4 text-left transition ${
              tipoEntrega === 'levantamento' ? 'border-brand-600 bg-brand-600/5' : 'border-mist-200 hover:border-brand-600'
            }`}
          >
            <Store className="mt-0.5 size-4 shrink-0 text-brand-600" />
            <div>
              <p className="text-sm font-semibold text-slate-800">Levantamento na sede</p>
              <span className="mt-1 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">Gratuito</span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setTipoEntrega('domicilio')}
            className={`flex items-start gap-3 rounded-xl border p-4 text-left transition ${
              tipoEntrega === 'domicilio' ? 'border-brand-600 bg-brand-600/5' : 'border-mist-200 hover:border-brand-600'
            }`}
          >
            <Truck className="mt-0.5 size-4 shrink-0 text-brand-600" />
            <div>
              <p className="text-sm font-semibold text-slate-800">Entrega ao domicílio</p>
              <span className="mt-1 inline-block rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">Custo por zona</span>
            </div>
          </button>
        </div>

        {tipoEntrega === 'domicilio' && (
          <>
            <div>
              <label className="mb-2 block text-xs font-semibold text-mist-600">Zona de Entrega *</label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {ZONAS.map((z) => (
                  <button
                    key={z.key}
                    type="button"
                    onClick={() => setZona(z.key)}
                    className={`flex items-center gap-2.5 rounded-xl border p-3 text-left transition ${
                      zona === z.key ? 'border-brand-600 bg-brand-600/5' : 'border-mist-200 hover:border-brand-600'
                    }`}
                  >
                    <span className="flex-1 text-sm font-medium text-slate-700">{z.nome}</span>
                    <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700">
                      {z.preco.toLocaleString('pt-PT')} Kz
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-mist-600">Bairro *</label>
                <input
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                  placeholder="Ex.: Patriota"
                  className="w-full rounded-xl border border-mist-200 px-3 py-2.5 text-sm outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-600/15"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-mist-600">Referência da Morada</label>
                <input
                  value={referenciaMorada}
                  onChange={(e) => setReferenciaMorada(e.target.value)}
                  placeholder="Ex.: Perto da Igreja…"
                  className="w-full rounded-xl border border-mist-200 px-3 py-2.5 text-sm outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-600/15"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-mist-600">Telefone de Contacto</label>
              <input
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="9xx xxx xxx"
                className="w-full rounded-xl border border-mist-200 px-3 py-2.5 text-sm outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-600/15"
              />
            </div>
          </>
        )}

        {erro && (
          <p className="flex items-center gap-1.5 text-xs text-error-text">
            <TriangleAlert className="size-3.5" /> {erro}
          </p>
        )}
      </div>
      <div className="flex gap-3 px-5 pb-5">
        <Button variant="secondary" onClick={onVoltar} className="flex-1">Voltar</Button>
        <Button
          onClick={onSubmeter}
          loading={submetendo}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700"
        >
          Confirmar Compra
        </Button>
      </div>
    </div>
  )
}
