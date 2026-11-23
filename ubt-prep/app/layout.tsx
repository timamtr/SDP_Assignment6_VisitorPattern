import './globals.css'
import 'katex/dist/katex.min.css'
import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = { title: 'ҰБТ дайындық' }

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang="kk">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        {user && (
          <nav className="flex flex-wrap gap-4 border-b bg-white p-4 text-sm font-medium">
            <Link href="/">Пәндер</Link>
            <Link href="/variants">Нұсқалар</Link>
            <Link href="/stats">Статистика</Link>
            <Link href="/checklist">Чеклист</Link>
          </nav>
        )}
        <div className="mx-auto max-w-3xl p-4">{children}</div>
      </body>
    </html>
  )
}