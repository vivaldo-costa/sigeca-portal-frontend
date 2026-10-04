import { useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * "Fade In Up" accionado pelo scroll — o conteúdo começa invisível e só
 * anima (sobe ligeiramente + aparece) quando entra no ecrã, uma vez.
 * Diferente de `animate-slide-up` sozinho, que dispara logo ao montar o
 * componente (útil para o que já está visível ao carregar a página) —
 * este serve para conteúdo mais abaixo, que o utilizador só vê ao rolar.
 */
export function ScrollReveal({ children, atraso = 0, className = '' }: { children: ReactNode; atraso?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visivel, setVisivel] = useState(false)

  useEffect(() => {
    const elemento = ref.current
    if (!elemento) return

    const observer = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisivel(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    )

    observer.observe(elemento)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={visivel ? `animate-slide-up ${className}` : `opacity-0 ${className}`}
      style={visivel ? { animationDelay: `${atraso}ms` } : undefined}
    >
      {children}
    </div>
  )
}
