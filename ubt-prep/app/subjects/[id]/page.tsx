import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function SubjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: subject } = await supabase.from('subjects').select('name').eq('id', id).single()
  const { data: topics } = await supabase.from('topics').select('*').eq('subject_id', id).order('id')

  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">{subject?.name}</h1>
      <ul className="flex flex-col gap-2">
        {topics?.map((t) => (
          <li key={t.id} className="flex items-center justify-between rounded-lg border bg-white p-3">
            <span>{t.name}</span>
            <span className="flex gap-3 text-sm">
              <Link className="text-blue-600 underline" href={`/test/${t.id}?mode=learn`}>Жаттығу</Link>
            </span>
          </li>
        ))}
      </ul>
    </>
  )
}