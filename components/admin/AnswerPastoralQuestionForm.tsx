'use client'

import { answerPastoralQuestion } from '@/app/actions/pastoral-admin'

export default function AnswerPastoralQuestionForm({ id }: { id: string }) {
  const field = "w-full px-3 py-2.5 rounded-xl text-sm border focus:outline-none transition"
  const fieldStyle = { background: '#0B2D47', borderColor: '#0D3352', color: '#F6F3EB' }

  return (
    <form action={answerPastoralQuestion} encType="multipart/form-data" className="space-y-3">
      <input type="hidden" name="id" value={id} />

      <div>
        <label className="text-[10px] font-black uppercase tracking-[0.2em] block mb-1.5"
          style={{ color: 'rgba(246,243,235,0.35)' }}>
          Respuesta (texto)
        </label>
        <textarea name="answer_body" rows={3} placeholder="Escribe la respuesta pastoral..."
          className={`${field} resize-none`} style={fieldStyle} />
      </div>

      <div>
        <label className="text-[10px] font-black uppercase tracking-[0.2em] block mb-1.5"
          style={{ color: 'rgba(246,243,235,0.35)' }}>
          Tipo de respuesta
        </label>
        <select name="answer_media_type" className={field} style={fieldStyle}>
          <option value="text">Texto</option>
          <option value="audio">Audio</option>
          <option value="video">Video</option>
        </select>
      </div>

      <div>
        <label className="text-[10px] font-black uppercase tracking-[0.2em] block mb-1.5"
          style={{ color: 'rgba(246,243,235,0.35)' }}>
          URL de video / audio (YouTube, etc.)
        </label>
        <input type="url" name="media" placeholder="https://youtube.com/watch?v=..."
          className={field} style={fieldStyle} />
      </div>

      <div>
        <label className="text-[10px] font-black uppercase tracking-[0.2em] block mb-1.5"
          style={{ color: 'rgba(246,243,235,0.35)' }}>
          O sube un archivo (tiene prioridad)
        </label>
        <input type="file" name="media_file" accept="audio/*,video/*"
          className="w-full text-[12px] cursor-pointer pt-2" style={{ color: 'rgba(246,243,235,0.40)' }} />
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="is_public" className="w-4 h-4 rounded accent-[#869B7E]" />
          <span className="text-[12px]" style={{ color: 'rgba(246,243,235,0.50)' }}>
            Hacer pública (visible para toda la comunidad)
          </span>
        </label>
        <button type="submit"
          className="px-4 py-2 rounded-xl text-[12px] font-bold"
          style={{ background: '#76ABAE', color: '#061E30' }}>
          Responder
        </button>
      </div>
    </form>
  )
}
