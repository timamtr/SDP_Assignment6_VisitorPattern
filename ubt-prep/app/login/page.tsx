'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const supabase = createClient()
    const { error } =
      mode === 'login'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password })
    if (error) return setError(error.message)
    router.push('/')
    router.refresh()
  }

  return (
    <main className="mx-auto max-w-sm p-6">
      <h1 className="mb-4 text-2xl font-bold">
        {mode === 'login' ? 'Кіру' : 'Тіркелу'}
      </h1>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <input
          className="rounded border p-2"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="rounded border p-2"
          type="password"
          placeholder="Құпиясөз (кемінде 6 таңба)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />
        {error && <p className="text-red-600">{error}</p>}
        <button className="rounded bg-blue-600 p-2 font-semibold text-white">
          {mode === 'login' ? 'Кіру' : 'Тіркелу'}
        </button>
      </form>
      <button
        className="mt-4 text-sm text-blue-600 underline"
        onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
      >
        {mode === 'login' ? 'Аккаунт жоқ па? Тіркел' : 'Аккаунт бар ма? Кір'}
      </button>
    </main>
  )
}