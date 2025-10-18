'use client'

import { ThemeProvider } from '@/components/theme-provider'
import { ReactQueryProvider } from './react-query-provider'

import React from 'react'
import { SolanaProvider } from './solana/solana-providers'

export function AppProviders({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ReactQueryProvider>
     <SolanaProvider>
     <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
      </ThemeProvider>
     </SolanaProvider>
    </ReactQueryProvider>
  )
}
