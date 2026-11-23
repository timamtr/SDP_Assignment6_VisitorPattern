'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Md from './Md'

type Opt = { id: number; body: string; is_correct: boolean }
export type Q = {
  id: number
  type: 'single' | 'open'
  body: string
  explanation: string | null
  answer_text: string | null
  options: Opt[]
}

const norm = (s: string) => s.toLowerCase().replace(',', '.').replace(/\s+/g, '').trim()

function isCorrect(q: Q, a: string | undefined) {
  if (!a) return false
  if (q.type === 'single') return q.options.find((o) => o.id === Number(a))?.is_correct === true
  return norm(a) === norm(q.answer_text ?? '')
}

export default function Quiz({
  questions,
  mode,
  topicId,
  variantId,
  durationMin,
}: {
  questions: Q[]
  mode: 'learn' | 'exam'
  topicId?: number
  variantId?: number
  durationMin?: number
}) {
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [checked, setChecked] = useState<Record<number, boolean>>({})
  const [finished, setFinished] = useState(false)
  const [left, setLeft] = useState((durationMin ?? 0) * 60)

  const score = questions.filter((q) => isCorrect(q, answers[q.id])).length

  async function finish() {
    if (finished) return
    setFinished(true)
    const supabase = createClient()
    await supabase.from('attempts').insert({
      topic_id: topicId ?? null,
      variant_id: variantId ?? null,
      score,
      total: questions.length,
    })
  }

  useEffect(() => {
    if (!durationMin || finished) return
    const id = setInterval(() => setLeft((s) => s - 1), 1000)
    return () => clearInterval(id)
  }, [durationMin, finished])

  useEffect(() => {
    if (durationMin && left <= 0) finish()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left])

  const showFeedback = (q: Q) => finished || (mode === 'learn' && checked[q.id])

  if (finished && mode === 'exam') {
    // нәтиже экраны + қателер талдауы төменде бірге көрсетіледі
  }

  return (
    <div className="flex flex-col gap-4">
      {durationMin && !finished && (
        <p className="sticky top-0 bg-slate-50 py-2 font-mono text-lg">
          {Math.floor(left / 60)}:{String(left % 60).padStart(2, '0')}
        </p>
      )}

      {finished && (
        <div className="rounded-lg border bg-white p-4">
          <p className="text-3xl font-bold">{score} / {questions.length}</p>
          <p className="text-slate-600">{Math.round((score / questions.length) * 100)}%</p>
        </div>
      )}

      {questions.map((q, i) => {
        const fb = showFeedback(q)
        const ok = isCorrect(q, answers[q.id])
        return (
          <div key={q.id} className="rounded-lg border bg-white p-4">
            <div className="mb-2 font-semibold">
              {i + 1}. <Md>{q.body}</Md>
            </div>

            {q.type === 'single' ? (
              <div className="flex flex-col gap-2">
                {q.options.map((o) => {
                  const picked = answers[q.id] === String(o.id)
                  let cls = 'border'
                  if (fb && o.is_correct) cls = 'border-green-600 bg-green-50'
                  else if (fb && picked) cls = 'border-red-600 bg-red-50'
                  else if (picked) cls = 'border-blue-600 bg-blue-50'
                  return (
                    <button
                      key={o.id}
                      disabled={fb}
                      onClick={() => setAnswers({ ...answers, [q.id]: String(o.id) })}
                      className={`rounded p-2 text-left ${cls}`}
                    >
                      <Md>{o.body}</Md>
                    </button>
                  )
                })}
              </div>
            ) : (
              <input
                disabled={fb}
                value={answers[q.id] ?? ''}
                onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                placeholder="Жауабыңды жаз"
                className="w-full rounded border p-2"
              />
            )}

            {mode === 'learn' && !fb && (
              <button
                onClick={() => setChecked({ ...checked, [q.id]: true })}
                className="mt-3 rounded bg-blue-600 px-3 py-1 text-white"
              >
                Тексеру
              </button>
            )}

            {fb && (
              <div className="mt-3 border-l-4 border-yellow-400 bg-slate-50 p-2">
                <p className={ok ? 'text-green-700' : 'text-red-700'}>
                  {ok ? 'Дұрыс' : 'Қате'}
                  {!ok && q.type === 'open' && <> · дұрыс жауап: <b>{q.answer_text}</b></>}
                </p>
                {q.explanation && <Md>{q.explanation}</Md>}
              </div>
            )}
          </div>
        )
      })}

      {!finished && (
        <button onClick={finish} className="rounded bg-slate-900 p-3 font-semibold text-white">
          Аяқтау
        </button>
      )}
    </div>
  )
}