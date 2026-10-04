import { useEffect } from 'react'
import { Toaster } from 'sonner'
import { ConfirmProvider } from '@/components/ui/ConfirmProvider'
import { Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from '@/pages/auth/Login'
import { RecuperarPage } from '@/pages/auth/RecuperarPage'
import { RedefinirPasswordPage } from '@/pages/auth/RedefinirPasswordPage'
import { DashboardPage } from '@/pages/dashboard/Dashboard'
import { PerfilPage } from '@/pages/perfil/Perfil'
import { ValidarCartaoPage } from '@/pages/publico/ValidarCartao'
import { VerificarCertificadoPage } from '@/pages/publico/VerificarCertificado'
import { CarrinhoPage } from '@/pages/carrinho/Carrinho'
import { CheckoutPage } from '@/pages/carrinho/Checkout'
import { DenunciarPage } from '@/pages/denuncias/DenunciarPage'
import { AppShell } from '@/components/layout/AppShell'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { Preloader } from '@/components/ui/Preloader'
import { useAuthStore } from '@/store/auth'
import { useAparenciaGlobal } from '@/hooks/useAparenciaGlobal'

export default function App() {
  const hydrate = useAuthStore((s) => s.hydrate)
  useAparenciaGlobal()

  useEffect(() => {
    hydrate()
  }, [hydrate])

  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <Preloader />
      <ConfirmProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/recuperar" element={<RecuperarPage />} />
        <Route path="/redefinir-password" element={<RedefinirPasswordPage />} />
        <Route path="/validar-cartao" element={<ValidarCartaoPage />} />
        <Route path="/verificar" element={<VerificarCertificadoPage />} />

        <Route
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard/:secao?" element={<DashboardPage />} />
          <Route path="/perfil" element={<PerfilPage />} />
          <Route path="/carrinho" element={<CarrinhoPage />} />
          <Route path="/denunciar" element={<DenunciarPage />} />
          <Route path="/carrinho/checkout" element={<CheckoutPage />} />
          {/* Próximo módulo: /cartao (fluxo interno, ex-cartao/dados.php) */}
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      </ConfirmProvider>
    </>
  )
}
