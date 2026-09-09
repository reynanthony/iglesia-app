// Integración con Groq (API compatible con OpenAI) — solo server-side, la
// API key nunca debe llegar al cliente. Patrón portado de
// C:\logos-studio-ai\electron\mentor.cjs (función callIA), adaptado a un
// único propósito: generar cuestionarios de capítulo bíblico.

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL = 'openai/gpt-oss-120b'

export interface QuizQuestion {
  question: string
  options: [string, string, string, string]
  correct_index: number
}

const QUIZ_SCHEMA = {
  type: 'object',
  properties: {
    questions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          question: { type: 'string' },
          options: { type: 'array', items: { type: 'string' } },
          correct_index: { type: 'integer' },
        },
        required: ['question', 'options', 'correct_index'],
        additionalProperties: false,
      },
    },
  },
  required: ['questions'],
  additionalProperties: false,
}

function buildPrompt(bookName: string, chapterNum: number, plainText: string): string {
  return [
    `Genera exactamente 5 preguntas de opción múltiple (4 opciones cada una, 1 sola correcta) sobre el`,
    `siguiente capítulo de la Biblia (Reina Valera 1960), para que un lector refresque lo que acaba de leer.`,
    ``,
    `Reglas estrictas:`,
    `- Basa cada pregunta SOLO en el texto dado abajo. No inventes datos, nombres ni eventos que no estén en el texto.`,
    `- No repitas la misma idea en dos preguntas distintas.`,
    `- Evita preguntas triviales de "¿en qué capítulo estamos?" — deben probar comprensión real del contenido.`,
    `- Las 4 opciones de cada pregunta deben ser plausibles (nada de opciones absurdas obvias).`,
    `- correct_index es el índice (0 a 3) de la opción correcta dentro de "options".`,
    `- Responde en español.`,
    ``,
    `${bookName} ${chapterNum} (RVR1960):`,
    plainText,
  ].join('\n')
}

async function parseErrorResponse(res: Response, intento: number, totalIntentos: number): Promise<'reintentar'> {
  const errText = await res.text().catch(() => '')
  let codigo = ''
  try { codigo = JSON.parse(errText)?.error?.code || '' } catch { /* sin detalle parseable */ }

  if (codigo === 'json_validate_failed' && intento < totalIntentos) return 'reintentar'

  if (res.status === 429) throw new Error('Groq alcanzó el límite de tasa. Intenta de nuevo en un momento.')
  if (res.status === 401 || res.status === 403) throw new Error('GROQ_API_KEY no es válida o no está configurada.')
  if (res.status >= 500) throw new Error('Groq no está respondiendo en este momento. Intenta de nuevo.')
  throw new Error(`Groq API ${res.status}: ${errText.slice(0, 200)}`)
}

export async function generateChapterQuiz(
  bookName: string,
  chapterNum: number,
  plainText: string,
): Promise<QuizQuestion[]> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) throw new Error('GROQ_API_KEY no está configurada')

  const body = JSON.stringify({
    model: GROQ_MODEL,
    messages: [
      { role: 'system', content: 'Eres un asistente que genera cuestionarios bíblicos precisos, basados únicamente en el texto que se te da. Respondes siempre en español.' },
      { role: 'user', content: buildPrompt(bookName, chapterNum, plainText) },
    ],
    response_format: {
      type: 'json_schema',
      json_schema: { name: 'bible_chapter_quiz', strict: true, schema: QUIZ_SCHEMA },
    },
    temperature: 0.6,
  })

  const INTENTOS = 3
  for (let intento = 1; intento <= INTENTOS; intento++) {
    const res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` },
      body,
    })

    if (!res.ok) {
      const resultado = await parseErrorResponse(res, intento, INTENTOS)
      if (resultado === 'reintentar') continue
    }

    const data = await res.json()
    const text = data.choices?.[0]?.message?.content
    if (!text) throw new Error('La respuesta de Groq no incluyó contenido.')
    const parsed = JSON.parse(text)
    const questions = Array.isArray(parsed) ? parsed[0]?.questions : parsed.questions
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('Groq no devolvió preguntas con el formato esperado.')
    }
    return questions
  }

  throw new Error('No se pudo generar el cuestionario después de varios intentos.')
}
