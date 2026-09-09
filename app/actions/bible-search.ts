'use server'

import { searchBible, type BibleSearchHit } from '@/lib/bible-content'

export async function searchBibleText(query: string): Promise<BibleSearchHit[]> {
  const q = query.trim()
  if (q.length < 3) return []
  return searchBible(q, 50)
}
