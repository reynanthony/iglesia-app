'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, X, ArrowRight, RotateCcw } from 'lucide-react'
import { saveQuizResult, type SavedQuizResult } from '@/app/actions/bible-quiz'
import type { QuizQuestion } from '@/lib/groq'
import { CARD, BORDER, MUTED, GOLD, GOLD_INK, INK } from '@/lib/gold-theme'

interface ChapterQuizProps {
  bookId: string
  chapter: number
  questions: QuizQuestion[]
  savedResult: SavedQuizResult | null
  nextChapterHref: string | null
}

export default function ChapterQuiz({ bookId, chapter, questions, savedResult, nextChapterHref }: ChapterQuizProps) {
  const [answers, setAnswers]     = useState<Record<number, number>>(savedResult?.answers ?? {})
  const [submitted, setSubmitted] = useState(!!savedResult)

  const allAnswered = questions.every((_, i) => answers[i] !== undefined)
  const correctCount = questions.filter((q, i) => answers[i] === q.correct_index).length

  function handleSubmit() {
    setSubmitted(true)
    saveQuizResult(bookId, chapter, correctCount, questions.length, answers)
  }

  function retry() {
    setAnswers({})
    setSubmitted(false)
  }

  if (submitted) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl p-6 text-center" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2" style={{ color: `${GOLD}99` }}>
            Resultado
          </p>
          <p className="font-black" style={{ fontSize: 'clamp(2.5rem, 8vw, 3.5rem)', color: INK }}>
            {correctCount}/{questions.length}
          </p>
        </div>

        {questions.map((q, i) => {
          const userAnswer = answers[i]
          const isCorrect = userAnswer === q.correct_index
          return (
            <div key={i} className="rounded-2xl p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <p className="text-sm font-bold mb-3" style={{ color: INK }}>{q.question}</p>
              <div className="space-y-2">
                {q.options.map((opt, oi) => {
                  const isUserChoice = oi === userAnswer
                  const isRightAnswer = oi === q.correct_index
                  return (
                    <div key={oi}
                      className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm"
                      style={{
                        background: isRightAnswer ? 'rgba(74,222,128,0.10)' : isUserChoice ? 'rgba(248,113,113,0.10)' : 'transparent',
                        border: `1px solid ${isRightAnswer ? 'rgba(74,222,128,0.35)' : isUserChoice ? 'rgba(248,113,113,0.35)' : BORDER}`,
                        color: isRightAnswer || isUserChoice ? INK : MUTED,
                      }}>
                      {isRightAnswer && <Check size={14} style={{ color: '#4ADE80', flexShrink: 0 }} />}
                      {isUserChoice && !isRightAnswer && <X size={14} style={{ color: '#F87171', flexShrink: 0 }} />}
                      <span>{opt}</span>
                    </div>
                  )
                })}
              </div>
              {!isCorrect && (
                <p className="text-[11px] mt-2" style={{ color: MUTED }}>
                  Tu respuesta no fue la correcta — vuelve a leer el capítulo si quieres repasarlo.
                </p>
              )}
            </div>
          )
        })}

        <div className="flex gap-3">
          <button onClick={retry}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition"
            style={{ background: CARD, border: `1px solid ${BORDER}`, color: MUTED }}>
            <RotateCcw size={14} /> Reintentar
          </button>
          {nextChapterHref && (
            <Link href={nextChapterHref}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-black transition"
              style={{ background: GOLD, color: GOLD_INK }}>
              Siguiente capítulo <ArrowRight size={14} />
            </Link>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {questions.map((q, i) => (
        <div key={i} className="rounded-2xl p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] mb-2" style={{ color: `${GOLD}99` }}>
            Pregunta {i + 1} de {questions.length}
          </p>
          <p className="text-sm font-bold mb-4" style={{ color: INK }}>{q.question}</p>
          <div className="space-y-2">
            {q.options.map((opt, oi) => {
              const selected = answers[i] === oi
              return (
                <button key={oi}
                  onClick={() => setAnswers(prev => ({ ...prev, [i]: oi }))}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-left transition"
                  style={{
                    background: selected ? `${GOLD}18` : 'transparent',
                    border: `1px solid ${selected ? `${GOLD}60` : BORDER}`,
                    color: selected ? GOLD : INK,
                  }}>
                  <span className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center"
                    style={{ border: `1.5px solid ${selected ? GOLD : BORDER}` }}>
                    {selected && <span className="w-2.5 h-2.5 rounded-full" style={{ background: GOLD }} />}
                  </span>
                  {opt}
                </button>
              )
            })}
          </div>
        </div>
      ))}

      <button
        onClick={handleSubmit}
        disabled={!allAnswered}
        className="w-full py-3.5 rounded-xl text-sm font-black transition disabled:opacity-40"
        style={{ background: GOLD, color: GOLD_INK }}>
        Ver resultados
      </button>
    </div>
  )
}
