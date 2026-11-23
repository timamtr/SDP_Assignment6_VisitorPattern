import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function VariantsPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('variants').select('*').order('id')

  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Нұсқалар</h1>
      <ul className="flex flex-col gap-2">
        {data?.map((v) => (
          <li key={v.id}>
            <Link href={`/variants/${v.id}`}
              className="flex justify-between rounded-lg border bg-white p-3 hover:border-blue-500">
              <span>{v.title}</span>
              <span className="text-slate-500">{v.duration_min} мин</span>
            </Link>
          </li>
        ))}
      </ul>
      {!data?.length && <p className="text-slate-500">Нұсқалар әлі жоқ (12-қадамның соңын қара).</p>}
    </>
  )
}