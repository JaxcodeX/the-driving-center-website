'use client'

import React from 'react'

type StatusVariant = 'active' | 'pending' | 'completed' | 'cancelled' | 'instructor' | 'student'

interface StatusPillProps {
  children: React.ReactNode
  variant?: StatusVariant
  className?: string
}

const variantStyles: Record<StatusVariant, React.CSSProperties> = {
  active: {
    background: 'rgba(74,222,128,0.15)',
    color: '#4ADE80',
  },
  pending: {
    background: 'rgba(249,115,22,0.15)',
    color: '#F97316',
  },
  completed: {
    background: 'rgba(37,99,235,0.15)',
    color: '#60A5FA',
  },
  cancelled: {
    background: 'rgba(239,68,68,0.15)',
    color: '#EF4444',
  },
  instructor: {
    background: 'rgba(168,85,247,0.15)',
    color: '#A855F7',
  },
  student: {
    background: 'rgba(6,182,212,0.15)',
    color: '#22D3EE',
  },
}

export function StatusPill({ children, variant = 'active', className = '' }: StatusPillProps) {
  return (
    <span
      className={`status-pill ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 12px',
        borderRadius: '999px',
        fontSize: '12px',
        fontWeight: '600',
        ...variantStyles[variant],
      }}
    >
      {children}
    </span>
  )
}