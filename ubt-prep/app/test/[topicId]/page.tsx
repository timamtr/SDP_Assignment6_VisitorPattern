import Quiz, { type Q } from '@/components/Quiz'
import { createClient } from '@/lib/supabase/server'

export default async function TestPage({
  params,
  searchParams,
}: {
  params: Promise<{ topicId: string }>
  searchParams: Promise<{ mode?: string }>
}) {
  const { topicId } = await params
  const { mode } = await searchParams
  const supabase = await createClient()

  const { data: topic } = await supabase.from('topics').select('name').eq('id', topicId).single()
  const { data } = await supabase
    .from('questions')
    .select('id, type, body, explanation, answer_text, options(id, body, is_correct)')
    .eq('topic_id', topicId)
    .order('id')

  const questions = (data ?? []) as unknown as Q[]

  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">{topic?.name}</h1>
      {questions.length ? (
        <Quiz questions={questions} mode={mode === 'exam' ? 'exam' : 'learn'} topicId={Number(topicId)} />
      ) : (
        <p>Бұл тақырыпта сұрақ әлі жоқ.</p>
      )}
    </>
  )
}