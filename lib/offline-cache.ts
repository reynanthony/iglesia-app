'use client'

import { Capacitor } from '@capacitor/core'

type CachedLesson = {
  id: string
  title: string
  body: string | null
  video_url: string | null
  cached_at: number
}

const LESSON_PREFIX = 'lesson:'
const CACHE_TTL_MS  = 7 * 24 * 60 * 60 * 1000  // 7 days

async function getPreferences() {
  const { Preferences } = await import('@capacitor/preferences')
  return Preferences
}

export async function cacheLesson(lesson: Omit<CachedLesson, 'cached_at'>): Promise<void> {
  if (!Capacitor.isNativePlatform()) return
  const Preferences = await getPreferences()
  await Preferences.set({
    key:   `${LESSON_PREFIX}${lesson.id}`,
    value: JSON.stringify({ ...lesson, cached_at: Date.now() }),
  })
}

export async function getCachedLesson(lessonId: string): Promise<CachedLesson | null> {
  if (!Capacitor.isNativePlatform()) return null
  const Preferences = await getPreferences()
  const { value } = await Preferences.get({ key: `${LESSON_PREFIX}${lessonId}` })
  if (!value) return null
  try {
    const parsed = JSON.parse(value) as CachedLesson
    if (Date.now() - parsed.cached_at > CACHE_TTL_MS) return null
    return parsed
  } catch {
    return null
  }
}

export async function removeCachedLesson(lessonId: string): Promise<void> {
  if (!Capacitor.isNativePlatform()) return
  const Preferences = await getPreferences()
  await Preferences.remove({ key: `${LESSON_PREFIX}${lessonId}` })
}
