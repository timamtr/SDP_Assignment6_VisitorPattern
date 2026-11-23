import Quiz, { type Q } from '@/components/Quiz'
import { createClient } from '@/lib/supabase/server'

export default async function VariantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: variant } = await supabase.from('variants').select('*').eq('id', id).single()
  const { data } = await supabase
    .from('variant_questions')
    .select('position, questions(id, type, body, explanation, answer_text, options(id, body, is_correct))')
    .eq('variant_id', id)
    .order('position')

  const questions = (data ?? []).map((r: any) => r.questions) as Q[]

  return (
    <>
      <h1 className="mb-1 text-2xl font-bold">{variant?.title}</h1>
      <p className="mb-4 text-slate-500">{questions.length} сұрақ · {variant?.duration_min} минут</p>
      <Quiz questions={questions} mode="exam" variantId={Number(id)} durationMin={variant?.duration_min} />
    </>
  )
}