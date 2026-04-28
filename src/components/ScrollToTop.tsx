'use client'
import { useState, useEffect } from 'react'
export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll to top"
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        background: 'var(--accent, #3b82f6)',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.8)',
        transition: 'opacity 0.3s, transform 0.3s',
        pointerEvents: visible ? 'auto' : 'none',
        zIndex: 50,
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  )
}