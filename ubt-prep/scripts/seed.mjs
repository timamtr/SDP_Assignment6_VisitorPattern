import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)
const data = JSON.parse(fs.readFileSync('data/questions.json', 'utf8'))

async function getOrCreate(table, match) {
  const { data: found } = await sb.from(table).select('id').match(match).maybeSingle()
  if (found) return found.id
  const { data: row, error } = await sb.from(table).insert(match).select('id').single()
  if (error) throw error
  return row.id
}

for (const s of data) {
  const subjectId = await getOrCreate('subjects', { name: s.name })
  for (const t of s.topics) {
    const topicId = await getOrCreate('topics', { subject_id: subjectId, name: t.name })
    for (const q of t.questions) {
      const { data: row, error } = await sb
        .from('questions')
        .insert({
          topic_id: topicId,
          type: q.type,
          body: q.body,
          explanation: q.explanation ?? null,
          answer_text: q.answer_text ?? null,
        })
        .select('id')
        .single()
      if (error) throw error
      if (q.options?.length) {
        const { error: e2 } = await sb
          .from('options')
          .insert(q.options.map((o) => ({ question_id: row.id, ...o })))
        if (e2) throw e2
      }
    }
  }
}
console.log('Дайын')