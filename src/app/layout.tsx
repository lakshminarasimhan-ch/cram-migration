import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import CommentsSystem from '@/components/CommentsSystem'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DB Migration: Mongo/MySQL ↔ Postgres Mapping',
  description: 'Database migration documentation with inline commenting',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Navigation />
        <CommentsSystem />
        {children}
      </body>
    </html>
  )
}
