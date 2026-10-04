import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from './Navbar'

/**
 * Estrutura comum as paginas autenticadas: navbar fixa escura +
 * conteudo. Cada modulo (dashboard, perfil, carrinho...) e apenas
 * o conteudo, renderizado via <Outlet />.
 */
export function AppShell() {
  const location = useLocation()
  return (
    <div className="min-h-screen bg-portal-bg">
      <Navbar />
      <main className="pt-16">
        <div key={location.pathname} className="animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
