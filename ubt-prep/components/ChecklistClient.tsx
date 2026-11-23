'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ChecklistClient({
  items,
  initialDone,
}: {
  items: { id: number; text: string }[]
  initialDone: number[]
}) {
  const [done, setDone] = useState<number[]>(initialDone)

  async function toggle(id: number) {
    const supabase = createClient()
    if (done.includes(id)) {
      setDone(done.filter((x) => x !== id))
      await supabase.from('user_checklist').delete().eq('item_id', id)
    } else {
      setDone([...done, id])
      await supabase.from('user_checklist').insert({ item_id: id })
    }
  }

  const pct = items.length ? Math.round((done.length / items.length) * 100) : 0

  return (
    <>
      <p className="mb-1 text-sm text-slate-600">{done.length} / {items.length}</p>
      <div className="mb-4 h-2 rounded bg-slate-200">
        <div className="h-2 rounded bg-yellow-500" style={{ width: `${pct}%` }} />
      </div>
      {items.map((it) => (
        <label key={it.id} className="flex items-start gap-3 border-b py-2">
          <input type="checkbox" className="mt-1 h-5 w-5"
            checked={done.includes(it.id)} onChange={() => toggle(it.id)} />
          <span>{it.text}</span>
        </label>
      ))}
    </>
  )
}