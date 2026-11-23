import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data: subjects } = await supabase.from('subjects').select('*').order('id')

  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Пәнді таңда</h1>
      <div className="grid gap-3 sm:grid-cols-2">
        {subjects?.map((s) => (
          <Link key={s.id} href={`/subjects/${s.id}`}
            className="rounded-lg border bg-white p-4 font-semibold shadow-sm hover:border-blue-500">
            {s.name}
          </Link>
        ))}
      </div>
      {!subjects?.length && (
        <p className="text-slate-500">Пәндер әлі жоқ. 12-қадамдағы сидинг скриптін іске қос.</p>
      )}
    </>
  )
}