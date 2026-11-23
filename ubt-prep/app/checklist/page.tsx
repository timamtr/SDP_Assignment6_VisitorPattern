import { createClient } from '@/lib/supabase/server'
import ChecklistClient from '@/components/ChecklistClient'

export default async function ChecklistPage() {
  const supabase = await createClient()
  const { data: items } = await supabase.from('checklist_items').select('*').order('position')
  const { data: done } = await supabase.from('user_checklist').select('item_id')

  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Дайындық чеклисті</h1>
      <ChecklistClient items={items ?? []} initialDone={(done ?? []).map((d) => d.item_id)} />
    </>
  )
}