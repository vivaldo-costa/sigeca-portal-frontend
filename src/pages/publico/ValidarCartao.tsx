import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  CircleCheck, CircleX, ShieldAlert, Tent, GraduationCap, ShoppingBag,
  Calendar, MapPin, Loader2,
} from 'lucide-react'
import { useValidarCartao } from '@/hooks/useValidarCartao'
import { useAparenciaGlobal } from '@/hooks/useAparenciaGlobal'
import { uploadUrl } from '@/lib/uploads'
import logo from '@/assets/sigeca-logo.svg'
import type { ValidacaoEvento, ValidacaoFormacao, ValidacaoPedido } from '@/types/validacao'

const CATEGORIAS = ['Dirigente', 'Candidato']

const ESTADO_CLS: Record<string, string> = {
  pendente: 'bg-yellow-100 text-yellow-700',
  confirmada: 'bg-green-100 text-green-700',
  confirmado: 'bg-green-100 text-green-700',
  cancelada: 'bg-red-100 text-red-700',
  entregue: 'bg-blue-100 text-blue-700',
  pago: 'bg-green-100 text-green-700',
}

const fmtData = (d: string | null) =>
  !d || d === '0000-00-00' ? '—' : new Date(d).toLocaleDateString('pt-PT')

const fmtKz = (v: number | null) => (v === null ? '—' : `${v.toLocaleString('pt-PT', { minimumFractionDigits: 2 })} Kz`)

/**
 * Página pública, sem sessão, acedida ao ler o QR Code do cartão SIGECA —
 * réplica de portal/cartao/validar-cartao.php. Fora do AppShell/ProtectedRoute
 * de propósito: quem verifica um cartão (ex. segurança, staff de um evento)
 * não tem necessariamente conta no portal.
 */
export function ValidarCartaoPage() {
  const [params] = useSearchParams()
  const codigo = params.get('codigo')
  const { data, isLoading, isError } = useValidarCartao(codigo)
  const aparencia = useAparenciaGlobal()
  const [logoFalhou, setLogoFalhou] = useState(false)
  const logoPrincipal = !logoFalhou ? (uploadUrl('aparencia', aparencia?.logo_principal_path) ?? logo) : logo

  return (
    <div className="min-h-screen bg-mist-50 px-4 py-8">
      <div className="mx-auto max-w-2xl space-y-5">
        <div className="mb-2 flex justify-center">
          <img src={logoPrincipal} alt="SIGECA" className="h-9" onError={() => setLogoFalhou(true)} />
        </div>

        {!codigo && <Aviso texto="Nenhum código de cartão foi fornecido." />}

        {codigo && isLoading && (
          <div className="flex items-center justify-center gap-2 rounded-2xl bg-white p-10 text-mist-400 shadow-sm">
            <Loader2 className="size-4 animate-spin" /> A validar cartão…
          </div>
        )}

        {codigo && !isLoading && (isError || !data?.encontrado) && (
          <Aviso texto="Cartão não encontrado. Verifica o código ou contacta a AECA." />
        )}

        {data?.encontrado && (
          <>
            <CartaoCard dados={data} />
            {data.eventos && data.formacoes && data.pedidos ? (
              <>
                <ListaCard titulo="Eventos inscritos" icon={Tent} corIcon="text-indigo-500" vazio="Sem inscrições em eventos.">
                  {data.eventos.map((ev, i) => (
                    <ItemInscricao key={i} item={ev} datas={[ev.data_evento, ev.data_fim]} />
                  ))}
                </ListaCard>
                <ListaCard titulo="Formações inscritas" icon={GraduationCap} corIcon="text-amber-500" vazio="Sem inscrições em formações.">
                  {data.formacoes.map((fm, i) => (
                    <ItemInscricao key={i} item={fm} datas={[fm.data_inicio, fm.data_fim]} />
                  ))}
                </ListaCard>
                <PedidosCard pedidos={data.pedidos} />
              </>
            ) : (
              <p className="rounded-2xl bg-white p-4 text-center text-xs text-mist-400 shadow-sm">
                O histórico de participação só é mostrado ao próprio sócio ou à equipa com sessão iniciada no SIGECA.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function Aviso({ texto }: { texto: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl bg-white p-10 text-center shadow-sm">
      <ShieldAlert className="size-8 text-amber-400" />
      <p className="text-sm text-mist-600">{texto}</p>
    </div>
  )
}

function CartaoCard({ dados }: { dados: NonNullable<ReturnType<typeof useValidarCartao>['data']> }) {
  const rotulo = dados.seccao && CATEGORIAS.includes(dados.seccao) ? 'Categoria' : 'Secção'

  return (
    <div className="rounded-2xl bg-white p-6 shadow-md">
      <div className="mb-4">
        {dados.expirado ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
            <CircleX className="size-4" /> Cartão expirado
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
            <CircleCheck className="size-4" /> Cartão válido
          </span>
        )}
      </div>

      <h2 className="mb-3 text-base font-bold text-slate-700">Dados do associado</h2>
      <dl className="space-y-2 text-sm text-slate-700">
        <Linha label="Nº SIGECA" valor={dados.codigo_associado} forte />
        <Linha label="Nome" valor={dados.nome} />
        <Linha label={rotulo} valor={dados.seccao ?? '—'} />
        <Linha label="Agrupamento" valor={dados.agrupamento ?? '—'} />
        <Linha label="Diocese" valor={dados.diocese ?? '—'} />
        <Linha
          label="Validade"
          valor={fmtData(dados.validade)}
          forte
          cor={dados.expirado ? 'text-red-600' : 'text-green-600'}
          semBorda
        />
      </dl>
    </div>
  )
}

function Linha({ label, valor, forte, cor, semBorda }: { label: string; valor: string; forte?: boolean; cor?: string; semBorda?: boolean }) {
  return (
    <div className={`flex justify-between ${semBorda ? '' : 'border-b border-mist-100 pb-1.5'}`}>
      <span className="font-medium text-mist-400">{label}</span>
      <span className={`${forte ? 'font-semibold' : ''} ${cor ?? ''}`}>{valor}</span>
    </div>
  )
}

function ListaCard({
  titulo, icon: Icon, corIcon, vazio, children,
}: { titulo: string; icon: typeof Tent; corIcon: string; vazio: string; children: React.ReactNode }) {
  const temFilhos = Array.isArray(children) ? (children as unknown[]).length > 0 : !!children
  return (
    <div className="rounded-2xl bg-white p-6 shadow-md">
      <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-slate-700">
        <Icon className={`size-5 ${corIcon}`} /> {titulo}
      </h2>
      {temFilhos ? <div className="space-y-3">{children}</div> : <p className="text-sm italic text-mist-300">{vazio}</p>}
    </div>
  )
}

function ItemInscricao({ item, datas }: { item: ValidacaoEvento | ValidacaoFormacao; datas: [string, string | null] }) {
  const cls = ESTADO_CLS[item.estado.toLowerCase()] ?? 'bg-slate-100 text-slate-600'
  return (
    <div className="space-y-1 rounded-xl border border-mist-100 p-3 text-sm text-slate-700">
      <div className="flex items-start justify-between gap-2">
        <span className="font-semibold">{item.titulo}</span>
        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${cls}`}>
          {item.estado.charAt(0).toUpperCase() + item.estado.slice(1).toLowerCase()}
        </span>
      </div>
      <div className="flex flex-wrap gap-x-4 text-xs text-mist-400">
        <span className="flex items-center gap-1">
          <Calendar className="size-3" /> {fmtData(datas[0])}
          {datas[1] && datas[1] !== '0000-00-00' && <> → {fmtData(datas[1])}</>}
        </span>
        {item.local && (
          <span className="flex items-center gap-1">
            <MapPin className="size-3" /> {item.local}
          </span>
        )}
        <span>Inscrito em {fmtData(item.inscrito_em)}</span>
      </div>
    </div>
  )
}

function PedidosCard({ pedidos }: { pedidos: ValidacaoPedido[] }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-md">
      <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-slate-700">
        <ShoppingBag className="size-5 text-emerald-500" /> Pedidos de compras
      </h2>
      {pedidos.length === 0 ? (
        <p className="text-sm italic text-mist-300">Sem pedidos de compras.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm text-slate-700">
            <thead>
              <tr className="border-b border-mist-100 text-xs text-mist-400">
                <th className="py-2 pr-3 text-left font-medium">Produto</th>
                <th className="px-2 py-2 text-center font-medium">Qtd.</th>
                <th className="px-2 py-2 text-right font-medium">Subtotal</th>
                <th className="px-2 py-2 text-center font-medium">Estado</th>
                <th className="py-2 pl-2 text-right font-medium">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mist-50">
              {pedidos.map((p, i) => (
                <tr key={i}>
                  <td className="py-2 pr-3">{p.produto}</td>
                  <td className="px-2 py-2 text-center">{p.quantidade}</td>
                  <td className="px-2 py-2 text-right">{fmtKz(p.subtotal)}</td>
                  <td className="px-2 py-2 text-center">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${ESTADO_CLS[p.status.toLowerCase()] ?? 'bg-slate-100 text-slate-600'}`}>
                      {p.status.charAt(0).toUpperCase() + p.status.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td className="py-2 pl-2 text-right text-xs text-mist-400">{fmtData(p.pedido_em)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
