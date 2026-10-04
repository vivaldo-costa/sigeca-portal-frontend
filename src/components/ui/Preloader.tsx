import { useEffect, useState } from 'react'
import logo from '@/assets/sigeca-logo.svg'
import { useAparenciaGlobal } from '@/hooks/useAparenciaGlobal'
import { uploadUrl } from '@/lib/uploads'

/**
 * Réplica do preloader do login actual (mín. 3s + carregamento da página),
 * agora como componente React reutilizável.
 */
export function Preloader({ minMs = 1200 }: { minMs?: number }) {
  const [visible, setVisible] = useState(true)
  const [fading, setFading] = useState(false)
  const aparencia = useAparenciaGlobal()
  const [logoFalhou, setLogoFalhou] = useState(false)
  const logoPrincipal = !logoFalhou ? (uploadUrl('aparencia', aparencia?.logo_principal_path) ?? logo) : logo

  useEffect(() => {
    const timer = setTimeout(() => {
      setFading(true)
      setTimeout(() => setVisible(false), 600)
    }, minMs)
    return () => clearTimeout(timer)
  }, [minMs])

  if (!visible) return null

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-paper transition-opacity duration-600 ${
        fading ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <img src={logoPrincipal} alt="A carregar SIGECA" className="w-[clamp(120px,20vw,220px)] animate-pulse" onError={() => setLogoFalhou(true)} />
    </div>
  )
}
