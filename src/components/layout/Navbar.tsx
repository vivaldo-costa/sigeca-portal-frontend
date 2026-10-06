import { useState, useRef, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ChevronDown, ShoppingCart, User, LogOut, Menu, X, Flag, ExternalLink } from 'lucide-react'
import { LINKS_EXTERNOS } from '@/lib/linksExternos'
import { useAuthStore } from '@/store/auth'
import { cn } from '@/lib/cn'
import { uploadUrl } from '@/lib/uploads'
import { useAparenciaGlobal } from '@/hooks/useAparenciaGlobal'
import { useConfirmar } from '@/components/ui/ConfirmProvider'
import { NotificationBell } from './NotificationBell'
import logoEstatico from '@/assets/sigeca-logo.svg'

const navLinks = [
  { to: '/dashboard', label: 'Início' },
  { to: '/dashboard/loja', label: 'Loja Escutista' },
  { to: '/dashboard/comunidade', label: 'Comunidade' },
  { to: '/dashboard/atividades', label: 'Actividades & Formações' },
  { to: '/dashboard/documentos', label: 'Documentos' },
  { to: '/dashboard/aprender', label: 'Ajuda' },
]

/**
 * Navbar fixa e escura (#0B0F1A), fiel ao cabeçalho do portal actual
 * (portal/index.php). Substitui a sidebar de admin usada inicialmente —
 * o Portal do Escuteiro é navegado por âncoras + páginas leves (perfil,
 * carrinho, cartão), não por um layout de painel de administração.
 */
export function Navbar() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const confirmar = useConfirmar()
  const totalCarrinho = useAuthStore(() => 0) // TODO: ligar ao módulo Carrinho
  const aparencia = useAparenciaGlobal()
  const [logoFalhou, setLogoFalhou] = useState(false)
  const logoCabecalho = !logoFalhou ? uploadUrl('aparencia', aparencia?.logo_cabecalho_path) : null
  const [open, setOpen] = useState(false)
  const [menuMobileAberto, setMenuMobileAberto] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-portal-nav/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5 text-white">
        <Link to="/dashboard" className="flex items-center">
          <img
            src={logoCabecalho ?? logoEstatico}
            alt="SIGECA"
            className={logoCabecalho ? 'h-8 w-auto' : 'h-8 w-auto brightness-0 invert'}
            onError={() => setLogoFalhou(true)}
          />
        </Link>

        <nav className="hidden gap-7 text-sm font-medium md:flex">
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/dashboard'}
              className={({ isActive }) => cn('transition-colors hover:text-accent-500', isActive ? 'text-accent-500' : 'text-white/85')}
            >
              {l.label}
            </NavLink>
          ))}
          {LINKS_EXTERNOS.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-full bg-accent-500/15 px-2.5 text-accent-500 transition-colors hover:bg-accent-500/25">
              {l.label} <ExternalLink className="size-3" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMenuMobileAberto((o) => !o)}
            className="rounded-lg p-1.5 text-white/85 transition hover:bg-white/10 md:hidden"
            aria-label="Abrir menu"
          >
            {menuMobileAberto ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>

          <NotificationBell />

        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2.5 rounded-full bg-white/10 px-3 py-1.5 transition hover:bg-white/20"
          >
            <div className="grid size-8 place-items-center overflow-hidden rounded-full border-2 border-accent-500 bg-brand-600 text-[13px] font-semibold">
              {user?.foto ? (
                <img src={uploadUrl('avatar', user.foto)!} alt={user.nome} className="size-full object-cover" />
              ) : (
                (user?.nome?.[0] ?? 'A').toUpperCase()
              )}
            </div>
            <span className="hidden text-sm font-semibold sm:block">{user?.nome ?? '—'}</span>
            <ChevronDown className="size-3 text-white/60" />
          </button>

          {open && (
            <div className="absolute right-0 mt-2.5 w-52 overflow-hidden rounded-2xl bg-white text-ink shadow-2xl">
              <div className="border-b border-mist-100 bg-mist-50 px-4 py-3">
                <p className="truncate text-sm font-semibold">{user?.nome}</p>
                <p className="text-xs text-mist-400">{user?.perfil_nome}</p>
              </div>
              <NavLink to="/perfil" className="flex items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-mist-50">
                <User className="size-4 text-mist-400" /> Perfil
              </NavLink>
              <NavLink to="/carrinho" className="flex items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-mist-50">
                <ShoppingCart className="size-4 text-mist-400" /> Carrinho
                {totalCarrinho > 0 && (
                  <sup className={cn('ml-auto rounded-full bg-accent-500 px-2 py-0.5 text-[10px] font-semibold text-white')}>
                    {totalCarrinho}
                  </sup>
                )}
              </NavLink>
              <NavLink to="/denunciar" className="flex items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-mist-50">
                <Flag className="size-4 text-mist-400" /> Denunciar
              </NavLink>
              <button
                onClick={async () => {
                  const ok = await confirmar({ titulo: 'Terminar sessão', mensagem: 'Tens a certeza que queres sair da tua conta?', textoConfirmar: 'Terminar sessão' })
                  if (ok) logout()
                }}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-error-text hover:bg-error-bg"
              >
                <LogOut className="size-4" /> Terminar sessão
              </button>
            </div>
          )}
        </div>
        </div>
      </div>

      {/* Menu mobile — os mesmos links de âncora que desaparecem abaixo de md.
          Painel absoluto (não empurra o conteúdo, a navbar é fixed). */}
      {menuMobileAberto && (
        <>
          <div className="fixed inset-0 top-16 z-40 bg-black/40 animate-fade-in md:hidden" onClick={() => setMenuMobileAberto(false)} />
          <nav className="absolute inset-x-0 top-full z-50 animate-slide-down border-t border-white/10 bg-portal-nav px-6 py-3 text-white shadow-2xl md:hidden">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/dashboard'}
                onClick={() => setMenuMobileAberto(false)}
                className={({ isActive }) => cn('block rounded-lg px-2 py-2.5 text-sm font-medium transition-colors hover:bg-white/10 hover:text-accent-500', isActive ? 'text-accent-500' : 'text-white/85')}
              >
                {l.label}
              </NavLink>
            ))}
            {LINKS_EXTERNOS.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg px-2 py-2.5 text-sm font-semibold text-accent-500 hover:bg-white/10">
                {l.label} <ExternalLink className="size-3.5" />
              </a>
            ))}
          </nav>
        </>
      )}
    </header>
  )
}
