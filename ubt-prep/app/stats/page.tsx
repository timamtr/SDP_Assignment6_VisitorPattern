import { createClient } from '@/lib/supabase/server'

export default async function StatsPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('attempts')
    .select('score, total, created_at, topics(name), variants(title)')
    .order('created_at', { ascending: false })

  const rows = (data ?? []) as any[]

  // Тақырып бойынша орташа пайыз
  const byTopic: Record<string, { s: number; t: number }> = {}
  rows.forEach((r) => {
    const name = r.topics?.name ?? r.variants?.title ?? 'Басқа'
    byTopic[name] ??= { s: 0, t: 0 }
    byTopic[name].s += r.score
    byTopic[name].t += r.total
  })
  const list = Object.entries(byTopic)
    .map(([name, v]) => ({ name, pct: Math.round((v.s / v.t) * 100) }))
    .sort((a, b) => a.pct - b.pct)

  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Статистика</h1>

      <h2 className="mb-2 font-semibold">Әлсіз жерлерің (төменнен жоғарыға)</h2>
      <div className="mb-6 flex flex-col gap-2">
        {list.map((x) => (
          <div key={x.name}>
            <div className="flex justify-between text-sm"><span>{x.name}</span><span>{x.pct}%</span></div>
            <div className="h-2 rounded bg-slate-200">
              <div className="h-2 rounded bg-yellow-500" style={{ width: `${x.pct}%` }} />
            </div>
          </div>
        ))}
        {!list.length && <p className="text-slate-500">Әзірге нәтиже жоқ. Алғашқы тестті өт.</p>}
      </div>

      <h2 className="mb-2 font-semibold">Соңғы өтулер</h2>
      <ul className="flex flex-col gap-1 text-sm">
        {rows.slice(0, 15).map((r, i) => (
          <li key={i} className="flex justify-between rounded border bg-white p-2">
            <span>{r.topics?.name ?? r.variants?.title}</span>
            <span>{r.score} / {r.total} · {new Date(r.created_at).toLocaleDateString('kk-KZ')}</span>
          </li>
        ))}
      </ul>
    </>
  )
}