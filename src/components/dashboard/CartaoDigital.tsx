import { useRef, useState, useCallback, useEffect } from 'react'
import QRCode from 'qrcode'
import { RotateCw } from 'lucide-react'
import type { Cartao } from '@/types/dashboard'
import type { Utilizador } from '@/types/auth'
import { uploadUrl } from '@/lib/uploads'
import logo from '@/assets/sigeca-logo.svg'

interface Props {
  cartao: Cartao
  user: Utilizador
}

const MAX_TILT = 30

/**
 * Réplica em React da interacção .card-3d do dashboard actual: arrastar
 * (rato ou toque) inclina o cartão em 3D, largar faz "snap" para a frente
 * ou verso mais próximo, e o botão "Ver verso" faz flip a 180°.
 */
export function CartaoDigital({ cartao, user }: Props) {
  const [flipped, setFlipped] = useState(false)
  const [transform, setTransform] = useState({ rx: 0, ry: 0 })
  const [dragging, setDragging] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const start = useRef({ x: 0, y: 0 })
  const current = useRef({ rx: 0, ry: 0 })

  // QR real do código SIGECA — é este código que o check-in de eventos lê
  // (ver eventoCredencial.service.js: identificarPorCartao/credenciarPorCartao),
  // por isso o verso do cartão precisa de um QR legível, não só decorativo.
  useEffect(() => {
    let cancelado = false
    QRCode.toDataURL(cartao.codigo_associado, { margin: 0, width: 160 })
      .then((url) => { if (!cancelado) setQrDataUrl(url) })
      .catch(() => { if (!cancelado) setQrDataUrl(null) })
    return () => { cancelado = true }
  }, [cartao.codigo_associado])

  const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))

  const onMove = useCallback(
    (clientX: number, clientY: number) => {
      const ryMin = flipped ? 150 : -MAX_TILT
      const ryMax = flipped ? 210 : MAX_TILT
      const nextRy = clamp(current.current.ry + (clientX - start.current.x) * 0.45, ryMin, ryMax)
      const nextRx = clamp(current.current.rx - (clientY - start.current.y) * 0.45, -MAX_TILT, MAX_TILT)
      start.current = { x: clientX, y: clientY }
      current.current = { rx: nextRx, ry: nextRy }
      setTransform({ rx: nextRx, ry: nextRy })
    },
    [flipped]
  )

  useEffect(() => {
    if (!dragging) return
    const onMouseMove = (e: MouseEvent) => onMove(e.clientX, e.clientY)
    const onTouchMove = (e: TouchEvent) => onMove(e.touches[0].clientX, e.touches[0].clientY)
    const onEnd = () => {
      setDragging(false)
      const target = { rx: 0, ry: flipped ? 180 : 0 }
      current.current = target
      setTransform(target)
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('mouseup', onEnd)
    window.addEventListener('touchend', onEnd)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('mouseup', onEnd)
      window.removeEventListener('touchend', onEnd)
    }
  }, [dragging, flipped, onMove])

  function startDrag(x: number, y: number) {
    start.current = { x, y }
    setDragging(true)
  }

  function toggleVerso() {
    const next = !flipped
    setFlipped(next)
    const target = { rx: 0, ry: next ? 180 : 0 }
    current.current = target
    setTransform(target)
  }

  const validade = cartao.validade
    ? new Date(cartao.validade).toLocaleDateString('pt-PT')
    : `31/12/${new Date().getFullYear()}`

  return (
    <div className="flex flex-shrink-0 flex-col items-center gap-4">
      <div style={{ perspective: 1000 }}>
        <div
          onMouseDown={(e) => startDrag(e.clientX, e.clientY)}
          onTouchStart={(e) => startDrag(e.touches[0].clientX, e.touches[0].clientY)}
          className="relative h-[210px] w-[340px] cursor-grab select-none active:cursor-grabbing"
          style={{
            transformStyle: 'preserve-3d',
            transition: dragging ? 'none' : 'transform .5s cubic-bezier(.23,1,.32,1)',
            transform: `rotateX(${transform.rx}deg) rotateY(${transform.ry}deg)`,
          }}
        >
          {/* Frente */}
          <div
            className="absolute inset-0 overflow-hidden rounded-2xl shadow-[0_28px_64px_rgba(0,0,0,.45),0_4px_12px_rgba(0,0,0,.2)]"
            style={{
              backfaceVisibility: 'hidden',
              background: 'linear-gradient(135deg, #001f4d 0%, #003580 45%, #0a4fa3 100%)',
            }}
          >
            <div className="absolute -right-8 -top-8 size-[220px] rounded-full border-[28px] border-white/5" />
            <div className="absolute right-2.5 top-2.5 size-[140px] rounded-full border-[18px] border-white/[0.04]" />

            <div className="absolute left-[18px] right-3 top-3 flex items-center gap-2">
              <div className="flex size-[26px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/15">
                <img src={logo} alt="" className="size-full object-cover" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[7.5px] font-extrabold uppercase tracking-widest text-white">Cartão de Associado</span>
                <span className="text-[6.5px] tracking-wide text-white/60">Associação de Escuteiros Católicos de Angola</span>
              </div>
            </div>

            <div className="absolute left-3 top-[52px] max-w-[190px] truncate text-[11px] font-extrabold tracking-wide text-white">
              {user.nome}
            </div>

            <div className="absolute left-3 top-[70px] flex flex-col gap-[3.5px]">
              <Campo label="Nº SIGECA" valor={cartao.codigo_associado} />
              <Campo label="Diocese" valor={cartao.diocese_nome ?? '—'} />
              <Campo label="Vigararia/Zona" valor={cartao.vigararia_nome ?? '—'} />
              <Campo label="Secção" valor={cartao.seccao_nome ?? '—'} />
              <Campo label="Agrupamento" valor={cartao.agrupamento_display} />
              <Campo label="Grupo Sanguíneo" valor={cartao.grupo_sanguineo ?? '—'} />
            </div>

            <div className="absolute right-3.5 top-10 h-[82px] w-[66px] overflow-hidden rounded-md border-2 border-white/30 bg-white/10">
              {user.foto ? (
                <img src={uploadUrl('avatar', user.foto)!} alt={user.nome} className="size-full object-cover" />
              ) : (
                <div className="grid size-full place-items-center text-[22px] text-white/30">
                  {user.nome[0]}
                </div>
              )}
            </div>

            <div className="absolute inset-x-3 bottom-2 flex items-end justify-between">
              <span className="font-mono text-[7px] tracking-[0.12em] text-white/45">{user.codigo_associado}</span>
              <span className="text-[6.5px] text-white/40">Válido até: {validade}</span>
            </div>
          </div>

          {/* Verso */}
          <div
            className="absolute inset-0 overflow-hidden rounded-2xl"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              background: 'linear-gradient(135deg, #001a3d 0%, #002d6b 60%, #003580 100%)',
            }}
          >
            <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#c8a84b] via-[#f0d060] to-[#c8a84b]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <img src={logo} alt="" className="w-[100px] opacity-[0.07]" />
            </div>
            <p className="absolute inset-x-0 top-7 px-[18px] text-center text-[6.5px] leading-[1.7] text-white/55">
              Este cartão é pessoal e intransmissível.
              <br />
              Em caso de perda, devolver a qualquer Paróquia
              <br />
              ou à Associação de Escuteiros Católicos de Angola.
            </p>
            <div className="absolute bottom-[22px] left-3.5 grid size-11 place-items-center overflow-hidden rounded bg-white p-0.5">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt={`Código QR — ${cartao.codigo_associado}`} className="size-full" />
              ) : (
                <div className="size-full animate-pulse bg-mist-200" />
              )}
            </div>
            <div className="absolute bottom-[18px] left-[68px] right-2.5">
              <p className="text-[5.5px] leading-[1.8] text-white/50">
                geral@aeca.ao
                <br />
                www.aeca.ao
                <br />
                Endereço: R. Comandante Bula 118, CP-3578 – CEAST
              </p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={toggleVerso}
        className="inline-flex items-center gap-2 rounded-full bg-mist-100 px-5 py-2 text-sm font-medium text-mist-600 transition hover:bg-mist-200"
      >
        <RotateCw className="size-3.5" />
        {flipped ? 'Ver frente' : 'Ver verso'}
      </button>
    </div>
  )
}

function Campo({ label, valor }: { label: string; valor: string }) {
  return (
    <div className="text-[6.5px] leading-[1.3] text-white/75">
      <b className="font-bold text-white">{label}:</b> {valor}
    </div>
  )
}
