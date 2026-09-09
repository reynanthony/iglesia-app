'use client'

import { useState, useTransition, useRef } from 'react'
import { savePageFields } from '@/app/actions/admin'
import { createClient } from '@/lib/supabase/client'
import { Check, Loader2, AlertCircle, Upload, ImageIcon, Video, X } from 'lucide-react'
import { BG, CARD, BORDER, MUTED, GOLD, INK } from '@/lib/gold-theme'

type FieldType = 'text' | 'textarea' | 'url' | 'json' | 'upload-image' | 'upload-video'

interface FieldDef {
  key: string
  label: string
  type: FieldType
  placeholder?: string
  hint?: string
  rows?: number
}

interface SectionDef {
  title: string
  fields: FieldDef[]
}

const SCHEMAS: Record<string, SectionDef[]> = {
  home: [
    {
      title: 'Hero — sección principal',
      fields: [
        { key: 'hero_eyebrow', label: 'Texto pequeño encima del título', type: 'text', placeholder: 'Iglesia El Manantial · Comunidad de fe' },
        { key: 'hero_title_main', label: 'Título — líneas principales (↵ para nueva línea)', type: 'textarea', rows: 2, placeholder: 'Donde\nfluye' },
        { key: 'hero_title_accent', label: 'Título — palabra en teal (acento)', type: 'text', placeholder: 'la vida.' },
        { key: 'hero_subtitle', label: 'Subtítulo / frase debajo del título', type: 'textarea', rows: 3, placeholder: 'Una comunidad de fe viva donde encontrarás amor, propósito y una familia que te recibe como eres.' },
        { key: 'hero_cta1_label', label: 'Botón principal — texto', type: 'text', placeholder: 'Conócenos' },
        { key: 'hero_cta1_url', label: 'Botón principal — URL', type: 'url', placeholder: '/nosotros' },
        { key: 'hero_cta2_label', label: 'Botón secundario — texto', type: 'text', placeholder: 'Ver prédica' },
        { key: 'hero_cta2_url', label: 'Botón secundario — URL', type: 'url', placeholder: '/predicas' },
        { key: 'hero_image_url', label: 'Imagen de fondo del hero', type: 'upload-image', hint: 'Sube una foto JPG/PNG/WebP o pega una URL directa. El video tiene prioridad si ambos están definidos.' },
        { key: 'hero_video_url', label: 'Video de fondo del hero (.mp4)', type: 'upload-video', hint: 'Sube un video MP4 o pega una URL directa al archivo .mp4. Tiene prioridad sobre la imagen.' },
      ],
    },
    {
      title: 'Horarios — servicios regulares',
      fields: [
        {
          key: 'services',
          label: 'Servicios',
          type: 'json',
          rows: 10,
          placeholder: '[\n  {"day":"Domingo","time":"10:00","label":"AM","type":"Servicio principal"},\n  {"day":"Miércoles","time":"7:00","label":"PM","type":"Estudio bíblico"},\n  {"day":"Viernes","time":"7:00","label":"PM","type":"Noche de oración"}\n]',
          hint: 'Formato JSON — día, hora, etiqueta AM/PM, tipo de servicio',
        },
      ],
    },
    {
      title: 'Evento destacado — "Retiro Anual" y similares',
      fields: [
        { key: 'event_eyebrow', label: 'Etiqueta encima del evento', type: 'text', placeholder: 'Próximo evento' },
        { key: 'featured_event_title', label: 'Nombre del evento', type: 'text', placeholder: 'Retiro Anual 2026' },
        { key: 'featured_event_desc', label: 'Descripción breve', type: 'textarea', rows: 2, placeholder: 'Junio 2026 · Un fin de semana de encuentro y renovación espiritual.' },
        { key: 'event_cta_label', label: 'Botón — texto', type: 'text', placeholder: 'Más información' },
        { key: 'event_cta_url', label: 'Botón — URL', type: 'url', placeholder: '/eventos' },
        { key: 'event_image_url', label: 'Foto del evento (aparece al lado derecho)', type: 'upload-image' },
      ],
    },
    {
      title: 'Ministerios destacados — tarjeta "Próxima generación" (01)',
      fields: [
        { key: 'ministry1_label', label: 'Etiqueta del ministerio', type: 'text', placeholder: 'Ministerio de Jóvenes' },
        { key: 'ministry1_title', label: 'Título en grande', type: 'text', placeholder: 'La próxima generación.' },
        { key: 'ministry1_desc', label: 'Descripción', type: 'textarea', rows: 2, placeholder: 'Fe y comunidad auténtica para jóvenes que quieren vivir algo real.' },
        { key: 'ministry1_cta', label: 'Texto del enlace', type: 'text', placeholder: 'Explorar ministerio' },
        { key: 'ministry1_url', label: 'URL de destino', type: 'url', placeholder: '/ministerios/jovenes' },
        { key: 'ministry1_image', label: 'Imagen de fondo de la tarjeta 01', type: 'upload-image', hint: 'Sube una foto JPG/PNG/WebP. Recomendado 1200×800px.' },
      ],
    },
    {
      title: 'Ministerios destacados — tarjeta "Hogares sólidos" (02)',
      fields: [
        { key: 'ministry2_label', label: 'Etiqueta del ministerio', type: 'text', placeholder: 'Matrimonios' },
        { key: 'ministry2_title', label: 'Título en grande', type: 'text', placeholder: 'Hogares sólidos.' },
        { key: 'ministry2_desc', label: 'Descripción', type: 'textarea', rows: 2, placeholder: 'Principios bíblicos para la familia.' },
        { key: 'ministry2_url', label: 'URL de destino', type: 'url', placeholder: '/ministerios/matrimonios' },
        { key: 'ministry2_image', label: 'Imagen de fondo de la tarjeta 02', type: 'upload-image', hint: 'Sube una foto JPG/PNG/WebP. Recomendado 1200×800px.' },
      ],
    },
    {
      title: 'Versículo — cita bíblica destacada',
      fields: [
        { key: 'verse', label: 'Texto del versículo', type: 'textarea', rows: 3, placeholder: 'Vengan a mí todos los que están cansados y yo les daré descanso.' },
        { key: 'verse_ref', label: 'Referencia bíblica', type: 'text', placeholder: 'Mateo 11:28' },
      ],
    },
    {
      title: 'Mensajes — sección que enlaza a prédicas',
      fields: [
        { key: 'sermons_eyebrow', label: 'Etiqueta de sección', type: 'text', placeholder: '— Mensajes' },
        { key: 'sermons_title', label: 'Título (↵ para nueva línea)', type: 'textarea', rows: 2, placeholder: 'Crece en\nla Palabra.' },
        { key: 'sermons_cta_label', label: 'Botón "Ver todos" — texto', type: 'text', placeholder: 'Todos' },
        { key: 'sermons_cta_url', label: 'Botón "Ver todos" — URL', type: 'url', placeholder: '/predicas' },
        { key: 'sermons_badge', label: 'Badge del mensaje destacado', type: 'text', placeholder: 'Esta semana' },
      ],
    },
    {
      title: 'Ministerios — encabezado del grid',
      fields: [
        { key: 'ministries_eyebrow', label: 'Etiqueta de sección', type: 'text', placeholder: '— Todos los ministerios' },
        { key: 'ministries_title', label: 'Título (↵ para nueva línea)', type: 'textarea', rows: 2, placeholder: 'Un lugar\npara todos.' },
        { key: 'ministries_cta', label: 'Botón "Ver todos" — texto', type: 'text', placeholder: 'Ver todos' },
        { key: 'ministries_url', label: 'Botón "Ver todos" — URL', type: 'url', placeholder: '/ministerios' },
      ],
    },
    {
      title: 'Ministerios — 4 tarjetas del grid (Jóvenes, Niños, Matrimonios, Adoración)',
      fields: [
        { key: 'mini1_name', label: 'Tarjeta 1 — nombre', type: 'text', placeholder: 'Jóvenes' },
        { key: 'mini1_desc', label: 'Tarjeta 1 — descripción corta', type: 'text', placeholder: 'Próxima generación' },
        { key: 'mini1_url', label: 'Tarjeta 1 — URL', type: 'url', placeholder: '/ministerios/jovenes' },
        { key: 'mini1_image', label: 'Tarjeta 1 — imagen de fondo', type: 'upload-image', hint: 'JPG/PNG/WebP · Recomendado 600×400px' },
        { key: 'mini2_name', label: 'Tarjeta 2 — nombre', type: 'text', placeholder: 'Niños' },
        { key: 'mini2_desc', label: 'Tarjeta 2 — descripción corta', type: 'text', placeholder: 'Fe desde pequeños' },
        { key: 'mini2_url', label: 'Tarjeta 2 — URL', type: 'url', placeholder: '/ministerios/ninos' },
        { key: 'mini2_image', label: 'Tarjeta 2 — imagen de fondo', type: 'upload-image', hint: 'JPG/PNG/WebP · Recomendado 600×400px' },
        { key: 'mini3_name', label: 'Tarjeta 3 — nombre', type: 'text', placeholder: 'Matrimonios' },
        { key: 'mini3_desc', label: 'Tarjeta 3 — descripción corta', type: 'text', placeholder: 'Hogares fuertes' },
        { key: 'mini3_url', label: 'Tarjeta 3 — URL', type: 'url', placeholder: '/ministerios/matrimonios' },
        { key: 'mini3_image', label: 'Tarjeta 3 — imagen de fondo', type: 'upload-image', hint: 'JPG/PNG/WebP · Recomendado 600×400px' },
        { key: 'mini4_name', label: 'Tarjeta 4 — nombre', type: 'text', placeholder: 'Adoración' },
        { key: 'mini4_desc', label: 'Tarjeta 4 — descripción corta', type: 'text', placeholder: 'Excelencia al Señor' },
        { key: 'mini4_url', label: 'Tarjeta 4 — URL', type: 'url', placeholder: '/ministerios/adoracion' },
        { key: 'mini4_image', label: 'Tarjeta 4 — imagen de fondo', type: 'upload-image', hint: 'JPG/PNG/WebP · Recomendado 600×400px' },
      ],
    },
    {
      title: 'CTA final — "Tu historia comienza aquí"',
      fields: [
        { key: 'cta_eyebrow', label: 'Etiqueta de sección', type: 'text', placeholder: '— Eres bienvenido' },
        { key: 'cta_title_main', label: 'Título — líneas principales (↵ para nueva línea)', type: 'textarea', rows: 2, placeholder: 'Tu historia\ncomienza' },
        { key: 'cta_title_accent', label: 'Título — palabra acento en teal', type: 'text', placeholder: 'aquí.' },
        { key: 'cta_body', label: 'Párrafo de cuerpo', type: 'textarea', rows: 2, placeholder: 'No importa dónde estés ni qué hayas vivido. Hay un lugar para ti.' },
        { key: 'cta1_label', label: 'Botón principal — texto', type: 'text', placeholder: 'Visítanos este domingo' },
        { key: 'cta1_url', label: 'Botón principal — URL', type: 'url', placeholder: '/contacto' },
        { key: 'cta2_label', label: 'Botón secundario — texto', type: 'text', placeholder: 'Unirse a la comunidad en línea' },
        { key: 'cta2_url', label: 'Botón secundario — URL', type: 'url', placeholder: '/login' },
      ],
    },
  ],

  nosotros: [
    {
      title: 'Hero — sección principal',
      fields: [
        { key: 'hero_eyebrow', label: 'Texto pequeño encima del título', type: 'text', placeholder: 'Quiénes somos · Desde 2008' },
        { key: 'hero_title_main', label: 'Título — líneas principales (↵ para nueva línea)', type: 'textarea', rows: 2, placeholder: 'Somos\nEl Manan-' },
        { key: 'hero_title_accent', label: 'Título — palabra en teal', type: 'text', placeholder: 'tial.' },
        { key: 'hero_body', label: 'Párrafo introductorio', type: 'textarea', rows: 3, placeholder: 'Nacimos de un sueño: ver una comunidad donde el amor de Dios fluyera libremente, como agua viva que transforma vidas.' },
        { key: 'hero_image_url', label: 'Imagen de fondo del hero', type: 'upload-image', hint: 'Sube una foto JPG/PNG/WebP o pega una URL directa. El video tiene prioridad si ambos están definidos.' },
        { key: 'hero_video_url', label: 'Video de fondo del hero (.mp4)', type: 'upload-video', hint: 'Sube un video MP4 o pega una URL directa al archivo .mp4. Tiene prioridad sobre la imagen.' },
      ],
    },
    {
      title: 'Estadísticas — números en el hero',
      fields: [
        { key: 'stat_year', label: 'Año de fundación', type: 'text', placeholder: '2008' },
        { key: 'stat_families', label: 'Familias', type: 'text', placeholder: '500+' },
        { key: 'stat_generations', label: 'Generaciones', type: 'text', placeholder: '3' },
        { key: 'stat_ministries', label: 'Ministerios', type: 'text', placeholder: '12+' },
      ],
    },
    {
      title: 'Pullquote — cita editorial destacada',
      fields: [
        { key: 'pullquote', label: 'Cita', type: 'textarea', rows: 3, placeholder: 'No somos un edificio. Somos una familia que se reúne, crece y sirve juntos.' },
        { key: 'pullquote_author', label: 'Autor', type: 'text', placeholder: '— Fundadores de El Manantial' },
      ],
    },
    {
      title: 'Historia — 4 párrafos de texto',
      fields: [
        { key: 'historia_p1', label: 'Párrafo 1', type: 'textarea', rows: 3, placeholder: 'Iglesia El Manantial nació en 2008 de un grupo de creyentes que soñaban con una comunidad donde el amor de Dios se viviera de manera auténtica y transformadora.' },
        { key: 'historia_p2', label: 'Párrafo 2', type: 'textarea', rows: 3, placeholder: 'A lo largo de los años hemos crecido como familia, viendo milagros, restauraciones y cientos de vidas transformadas por el poder del evangelio.' },
        { key: 'historia_p3', label: 'Párrafo 3', type: 'textarea', rows: 3, placeholder: 'Hoy somos una iglesia vibrante, con ministerios para todas las edades y un corazón apasionado por servir a nuestra comunidad.' },
        { key: 'historia_p4', label: 'Párrafo 4', type: 'textarea', rows: 3, placeholder: 'Creemos que cada persona que entra a El Manantial encuentra más que una congregación: encuentra un hogar espiritual.' },
      ],
    },
    {
      title: 'Visión y misión',
      fields: [
        { key: 'vision_text', label: 'Visión', type: 'textarea', rows: 2, placeholder: 'Ser una iglesia que impacte nuestra ciudad y nación.' },
        { key: 'mision_text', label: 'Misión', type: 'textarea', rows: 2, placeholder: 'Hacer discípulos que lleven el amor de Cristo a toda la tierra.' },
        { key: 'valores_list', label: 'Valores', type: 'text', placeholder: 'Fe,Amor,Integridad,Servicio,Comunidad', hint: 'Separados por coma — cada palabra aparece como una tarjeta' },
      ],
    },
    {
      title: 'Fundamentos de fe — lista de creencias',
      fields: [
        {
          key: 'beliefs_json',
          label: 'Creencias',
          type: 'json',
          rows: 12,
          placeholder: '[\n  {"n":"01","title":"La Biblia","desc":"La Palabra inspirada de Dios, autoridad final para la fe y la práctica cristiana."},\n  {"n":"02","title":"La salvación","desc":"Por gracia mediante la fe en Jesucristo, no por obras humanas."},\n  {"n":"03","title":"La iglesia","desc":"El cuerpo de Cristo, llamada a servir, adorar y hacer discípulos en toda la tierra."},\n  {"n":"04","title":"La misión","desc":"Cada creyente llamado a llevar el mensaje de salvación a su comunidad y al mundo."}\n]',
          hint: 'Formato JSON — cada objeto tiene: n (número), title (título), desc (descripción)',
        },
      ],
    },
    {
      title: 'CTA final — "Eres parte de esta historia"',
      fields: [
        { key: 'nos_cta_eyebrow', label: 'Etiqueta de sección', type: 'text', placeholder: '— Únete a nosotros' },
        { key: 'nos_cta_title', label: 'Título (↵ para nueva línea)', type: 'textarea', rows: 3, placeholder: 'Eres parte\nde esta\nhistoria.' },
        { key: 'nos_cta1_label', label: 'Botón principal — texto', type: 'text', placeholder: 'Visítanos este domingo' },
        { key: 'nos_cta1_url', label: 'Botón principal — URL', type: 'url', placeholder: '/contacto' },
        { key: 'nos_cta2_label', label: 'Botón secundario — texto', type: 'text', placeholder: 'Comunidad en línea' },
        { key: 'nos_cta2_url', label: 'Botón secundario — URL', type: 'url', placeholder: '/login' },
      ],
    },
  ],

  eventos: [
    {
      title: 'Hero — sección principal',
      fields: [
        { key: 'hero_eyebrow', label: 'Texto pequeño encima del título', type: 'text', placeholder: 'Eventos · Agenda 2026' },
        { key: 'hero_title_main', label: 'Título (↵ para nueva línea)', type: 'textarea', rows: 2, placeholder: 'Lo que\nse viene.' },
        { key: 'hero_subtitle', label: 'Subtítulo', type: 'textarea', rows: 2, placeholder: 'Mantente al día con nuestras actividades, servicios y eventos especiales.' },
        { key: 'hero_image_url', label: 'Imagen de fondo del hero', type: 'upload-image', hint: 'Sube una foto JPG/PNG/WebP o pega una URL directa. El video tiene prioridad si ambos están definidos.' },
        { key: 'hero_video_url', label: 'Video de fondo del hero (.mp4)', type: 'upload-video', hint: 'Sube un video MP4 o pega una URL directa al archivo .mp4. Tiene prioridad sobre la imagen.' },
      ],
    },
    {
      title: 'Servicios regulares — horario semanal',
      fields: [
        {
          key: 'regular_services',
          label: 'Servicios',
          type: 'json',
          rows: 12,
          placeholder: '[\n  {"day":"Dom","fullDay":"Domingo","time":"10:00","label":"AM","type":"Servicio Principal","desc":"Adoración, Palabra y comunidad para toda la familia."},\n  {"day":"Mié","fullDay":"Miércoles","time":"7:00","label":"PM","type":"Estudio Bíblico","desc":"Profundizando en la Palabra de Dios juntos."},\n  {"day":"Vie","fullDay":"Viernes","time":"7:00","label":"PM","type":"Noche de Oración","desc":"Intercesión y búsqueda de la presencia de Dios."}\n]',
          hint: 'Formato JSON — day (abreviado), fullDay (completo), time, label (AM/PM), type, desc',
        },
      ],
    },
    {
      title: 'Eventos especiales — eyebrow de sección',
      fields: [
        { key: 'events_eyebrow', label: 'Etiqueta de sección', type: 'text', placeholder: '— Próximamente' },
      ],
    },
    {
      title: 'Cómo llegar — dirección y horarios',
      fields: [
        { key: 'location_eyebrow', label: 'Etiqueta de sección', type: 'text', placeholder: '— Cómo llegar' },
        { key: 'location_title', label: 'Título (↵ para nueva línea)', type: 'textarea', rows: 2, placeholder: 'Encuéntranos\naquí.' },
        { key: 'location_address', label: 'Dirección', type: 'text', placeholder: 'Tu dirección aquí, Ciudad, País' },
        { key: 'location_schedule', label: 'Horarios en una línea', type: 'text', placeholder: 'Dom 10AM · Mié 7PM · Vie 7PM' },
        { key: 'location_next_event', label: 'Próximo evento (texto de avance)', type: 'text', placeholder: 'Retiro de Jóvenes · Jun 2026' },
      ],
    },
    {
      title: 'CTA final — invitación a visitar',
      fields: [
        { key: 'ev_cta_eyebrow', label: 'Etiqueta de sección', type: 'text', placeholder: '— ¿Primera vez?' },
        { key: 'ev_cta_title', label: 'Título (↵ para nueva línea)', type: 'textarea', rows: 2, placeholder: 'Ven y\nsé parte.' },
        { key: 'ev_cta1_label', label: 'Botón principal — texto', type: 'text', placeholder: 'Escríbenos' },
        { key: 'ev_cta1_url', label: 'Botón principal — URL', type: 'url', placeholder: '/contacto' },
        { key: 'ev_cta2_label', label: 'Botón secundario — texto', type: 'text', placeholder: 'Comunidad en línea' },
        { key: 'ev_cta2_url', label: 'Botón secundario — URL', type: 'url', placeholder: '/login' },
      ],
    },
  ],

  predicas: [
    {
      title: 'Hero — sección principal',
      fields: [
        { key: 'hero_eyebrow', label: 'Texto pequeño encima del título', type: 'text', placeholder: 'Mensajes · Palabra de vida' },
        { key: 'hero_title_main', label: 'Título — líneas principales (↵ para nueva línea)', type: 'textarea', rows: 2, placeholder: 'Crece\nen la' },
        { key: 'hero_title_accent', label: 'Título — palabra en teal', type: 'text', placeholder: 'Palabra.' },
        { key: 'hero_subtitle', label: 'Subtítulo', type: 'textarea', rows: 2, placeholder: 'Escucha los mensajes de nuestra iglesia y déjate transformar por la Palabra de Dios cada semana.' },
        { key: 'hero_image_url', label: 'Imagen de fondo del hero', type: 'upload-image', hint: 'Sube una foto JPG/PNG/WebP o pega una URL directa. El video tiene prioridad si ambos están definidos.' },
        { key: 'hero_video_url', label: 'Video de fondo del hero (.mp4)', type: 'upload-video', hint: 'Sube un video MP4 o pega una URL directa al archivo .mp4. Tiene prioridad sobre la imagen.' },
      ],
    },
    {
      title: 'Mensaje destacado — el más reciente',
      fields: [
        { key: 'featured_eyebrow', label: 'Etiqueta del mensaje destacado', type: 'text', placeholder: 'Mensaje reciente' },
        { key: 'featured_badge', label: 'Badge encima de la imagen', type: 'text', placeholder: 'Esta semana' },
        { key: 'featured_listen_label', label: 'Botón escuchar — texto', type: 'text', placeholder: 'Escuchar ahora' },
        { key: 'older_eyebrow', label: 'Etiqueta de mensajes anteriores', type: 'text', placeholder: '— Mensajes anteriores' },
      ],
    },
    {
      title: 'CTA final — invitación a la comunidad',
      fields: [
        { key: 'pred_cta_eyebrow', label: 'Etiqueta de sección', type: 'text', placeholder: '— Comunidad' },
        { key: 'pred_cta_title', label: 'Título (↵ para nueva línea)', type: 'textarea', rows: 2, placeholder: '¿Listo\npara más?' },
        { key: 'pred_cta_label', label: 'Botón — texto', type: 'text', placeholder: 'Unirte a la comunidad' },
        { key: 'pred_cta_url', label: 'Botón — URL', type: 'url', placeholder: '/login' },
      ],
    },
  ],

  ministerios: [
    {
      title: 'Hero — sección principal',
      fields: [
        { key: 'hero_eyebrow', label: 'Texto pequeño encima del título (↵ para nueva línea)', type: 'textarea', rows: 2, placeholder: 'Ministerios\nUn lugar para todos' },
        { key: 'hero_title_main', label: 'Título — líneas principales (↵ para nueva línea)', type: 'textarea', rows: 2, placeholder: 'Un lugar\npara' },
        { key: 'hero_title_accent', label: 'Título — palabra en teal', type: 'text', placeholder: 'todos.' },
        { key: 'hero_subtitle', label: 'Subtítulo', type: 'textarea', rows: 2, placeholder: 'Cada ministerio es una comunidad viva donde crecer en fe, servir y conectar con otros creyentes.' },
        { key: 'hero_image_url', label: 'Imagen de fondo del hero', type: 'upload-image', hint: 'Sube una foto JPG/PNG/WebP o pega una URL directa. El video tiene prioridad si ambos están definidos.' },
        { key: 'hero_video_url', label: 'Video de fondo del hero (.mp4)', type: 'upload-video', hint: 'Sube un video MP4 o pega una URL directa al archivo .mp4. Tiene prioridad sobre la imagen.' },
      ],
    },
    {
      title: 'CTA final — "¿Dónde encajas tú?"',
      fields: [
        { key: 'min_cta_eyebrow', label: 'Etiqueta de sección', type: 'text', placeholder: '— Sírvenos' },
        { key: 'min_cta_title', label: 'Título (↵ para nueva línea)', type: 'textarea', rows: 2, placeholder: '¿Dónde\nencajas tú?' },
        { key: 'min_cta_label', label: 'Botón — texto', type: 'text', placeholder: 'Contáctanos' },
        { key: 'min_cta_url', label: 'Botón — URL', type: 'url', placeholder: '/contacto' },
      ],
    },
  ],

  contacto: [
    {
      title: 'Hero — sección principal',
      fields: [
        { key: 'hero_eyebrow', label: 'Texto pequeño encima del título', type: 'text', placeholder: 'Contacto · Estamos aquí para ti' },
        { key: 'hero_title', label: 'Título principal', type: 'text', placeholder: 'Visítanos.' },
        { key: 'hero_subtitle', label: 'Subtítulo', type: 'textarea', rows: 2, placeholder: 'No importa quién eres ni qué estás viviendo. Eres bienvenido en El Manantial.' },
        { key: 'hero_image_url', label: 'Imagen de fondo del hero', type: 'upload-image', hint: 'Sube una foto JPG/PNG/WebP o pega una URL directa. El video tiene prioridad si ambos están definidos.' },
        { key: 'hero_video_url', label: 'Video de fondo del hero (.mp4)', type: 'upload-video', hint: 'Sube un video MP4 o pega una URL directa al archivo .mp4. Tiene prioridad sobre la imagen.' },
      ],
    },
    {
      title: 'Información de contacto — dirección, teléfono, horarios',
      fields: [
        { key: 'info_eyebrow', label: 'Etiqueta del bloque de información', type: 'text', placeholder: '— Información' },
        { key: 'form_eyebrow', label: 'Etiqueta del formulario', type: 'text', placeholder: '— Escríbenos' },
        { key: 'address', label: 'Dirección física', type: 'text', placeholder: 'Tu dirección aquí, Ciudad, País' },
        { key: 'phone', label: 'Teléfono', type: 'text', placeholder: '+1 (809) 000-0000' },
        { key: 'email', label: 'Correo electrónico', type: 'text', placeholder: 'info@elmanantial.org' },
        { key: 'schedule_sun', label: 'Horario domingo', type: 'text', placeholder: 'Dom 10AM' },
        { key: 'schedule_wed', label: 'Horario miércoles', type: 'text', placeholder: 'Mié 7PM' },
        { key: 'schedule_fri', label: 'Horario viernes', type: 'text', placeholder: 'Vie 7PM' },
      ],
    },
    {
      title: 'Primera visita — bloque informativo',
      fields: [
        { key: 'first_visit_title', label: 'Título', type: 'text', placeholder: '¿Primera visita?' },
        { key: 'first_visit_subtitle', label: 'Subtítulo', type: 'text', placeholder: 'No necesitas saber nada.' },
        { key: 'first_visit_body', label: 'Texto de bienvenida', type: 'textarea', rows: 2, placeholder: 'Solo ven como eres. Nuestro equipo te recibirá con los brazos abiertos.' },
      ],
    },
  ],

  donaciones: [
    {
      title: 'Hero — sección principal',
      fields: [
        { key: 'hero_eyebrow', label: 'Texto pequeño encima del título', type: 'text', placeholder: 'Donaciones · Apoyo a la misión' },
        { key: 'hero_title', label: 'Título (usa * antes de la palabra en acento)', type: 'text', placeholder: 'Da con *alegría.' },
        { key: 'hero_verse', label: 'Versículo / párrafo introductorio', type: 'textarea', rows: 3, placeholder: '"Dios ama al dador alegre."...' },
        { key: 'hero_verse_ref', label: 'Referencia bíblica', type: 'text', placeholder: '— 2 Corintios 9:7' },
        { key: 'hero_image_url', label: 'Imagen de fondo del hero', type: 'upload-image' },
        { key: 'hero_video_url', label: 'Video de fondo del hero (.mp4)', type: 'upload-video' },
      ],
    },
    {
      title: 'Transferencia bancaria',
      fields: [
        { key: 'bank_name', label: 'Banco', type: 'text', placeholder: 'Banco Popular Dominicano' },
        { key: 'bank_account', label: 'Número de cuenta', type: 'text', placeholder: '123-456789-0' },
        { key: 'bank_titular', label: 'Titular', type: 'text', placeholder: 'Iglesia El Manantial Inc.' },
        { key: 'bank_rnc', label: 'RNC', type: 'text', placeholder: '1-23-45678-9' },
        { key: 'bank_note', label: 'Nota', type: 'textarea', rows: 2, placeholder: 'Envíanos el comprobante de transferencia...' },
      ],
    },
    {
      title: 'Zelle',
      fields: [
        { key: 'zelle_email', label: 'Email Zelle', type: 'text', placeholder: 'elmanantial@iglesia.com' },
        { key: 'zelle_name', label: 'Nombre', type: 'text', placeholder: 'Iglesia El Manantial' },
        { key: 'zelle_note', label: 'Nota', type: 'textarea', rows: 2, placeholder: 'Disponible desde cualquier banco...' },
      ],
    },
    {
      title: 'En persona — horarios',
      fields: [
        { key: 'schedule_1_day', label: 'Servicio 1 — día', type: 'text', placeholder: 'Domingo' },
        { key: 'schedule_1_time', label: 'Servicio 1 — hora', type: 'text', placeholder: '10:00 AM' },
        { key: 'schedule_1_type', label: 'Servicio 1 — tipo', type: 'text', placeholder: 'Servicio principal' },
        { key: 'schedule_2_day', label: 'Servicio 2 — día', type: 'text', placeholder: 'Miércoles' },
        { key: 'schedule_2_time', label: 'Servicio 2 — hora', type: 'text', placeholder: '7:00 PM' },
        { key: 'schedule_2_type', label: 'Servicio 2 — tipo', type: 'text', placeholder: 'Estudio bíblico' },
      ],
    },
    {
      title: 'Estadísticas de impacto — 4 tarjetas',
      fields: [
        { key: 'stat1_value', label: 'Tarjeta 1 — valor', type: 'text', placeholder: '200+' },
        { key: 'stat1_label', label: 'Tarjeta 1 — etiqueta', type: 'text', placeholder: 'Familias alcanzadas' },
        { key: 'stat1_desc', label: 'Tarjeta 1 — descripción', type: 'text', placeholder: 'Familias que participan activamente...' },
        { key: 'stat2_value', label: 'Tarjeta 2 — valor', type: 'text', placeholder: '8' },
        { key: 'stat2_label', label: 'Tarjeta 2 — etiqueta', type: 'text', placeholder: 'Ministerios activos' },
        { key: 'stat2_desc', label: 'Tarjeta 2 — descripción', type: 'text', placeholder: 'Áreas de servicio...' },
        { key: 'stat3_value', label: 'Tarjeta 3 — valor', type: 'text', placeholder: '15+' },
        { key: 'stat3_label', label: 'Tarjeta 3 — etiqueta', type: 'text', placeholder: 'Años de ministerio' },
        { key: 'stat3_desc', label: 'Tarjeta 3 — descripción', type: 'text', placeholder: 'Años sembrando...' },
        { key: 'stat4_value', label: 'Tarjeta 4 — valor', type: 'text', placeholder: '150+' },
        { key: 'stat4_label', label: 'Tarjeta 4 — etiqueta', type: 'text', placeholder: 'Servicios al año' },
        { key: 'stat4_desc', label: 'Tarjeta 4 — descripción', type: 'text', placeholder: 'Reuniones de adoración...' },
      ],
    },
    {
      title: 'Versículo final + CTA',
      fields: [
        { key: 'cta_verse', label: 'Versículo', type: 'textarea', rows: 3, placeholder: '"El que siembra generosamente..."' },
        { key: 'cta_verse_ref', label: 'Referencia', type: 'text', placeholder: '— 2 Corintios 9:6' },
        { key: 'cta_body', label: 'Párrafo de invitación', type: 'textarea', rows: 2, placeholder: '¿Tienes preguntas sobre cómo realizar tu ofrenda?' },
      ],
    },
  ],

  oracion: [
    {
      title: 'Hero — sección principal',
      fields: [
        { key: 'hero_eyebrow', label: 'Texto pequeño encima del título', type: 'text', placeholder: 'Comunidad · Intercesión' },
        { key: 'hero_title', label: 'Título (usa * antes de la palabra en acento)', type: 'text', placeholder: 'Muro de *Oración.' },
        { key: 'hero_subtitle', label: 'Subtítulo', type: 'textarea', rows: 2, placeholder: 'Comparte tu petición y deja que la comunidad ore contigo.' },
        { key: 'hero_image_url', label: 'Imagen de fondo del hero', type: 'upload-image' },
        { key: 'hero_video_url', label: 'Video de fondo del hero (.mp4)', type: 'upload-video' },
      ],
    },
    {
      title: 'CTA final',
      fields: [
        { key: 'cta_eyebrow', label: 'Etiqueta de sección', type: 'text', placeholder: '— Únete a la comunidad' },
        { key: 'cta_title', label: 'Título (usa * antes de la palabra en acento)', type: 'text', placeholder: 'Más que *oraciones.' },
        { key: 'cta_body', label: 'Párrafo', type: 'textarea', rows: 2, placeholder: 'El stream es el primer paso...' },
      ],
    },
  ],

  'en-vivo': [
    {
      title: 'Sin transmisión — mensaje cuando no hay culto en vivo',
      fields: [
        { key: 'offline_title', label: 'Título (usa * antes de la palabra en acento)', type: 'text', placeholder: 'Estamos en *camino.' },
        { key: 'offline_subtitle', label: 'Subtítulo', type: 'textarea', rows: 2, placeholder: 'Todos los domingos transmitimos nuestro servicio...' },
        { key: 'offline_next_text', label: 'Texto de próxima transmisión', type: 'text', placeholder: 'Próxima transmisión: Domingo 10:00 AM' },
        { key: 'hero_image_url', label: 'Imagen de fondo', type: 'upload-image' },
        { key: 'hero_video_url', label: 'Video de fondo (.mp4)', type: 'upload-video' },
      ],
    },
    {
      title: 'Horarios de transmisión',
      fields: [
        { key: 'schedule_eyebrow', label: 'Etiqueta de sección', type: 'text', placeholder: '— Horario' },
        { key: 'schedule_title', label: 'Título de sección', type: 'text', placeholder: 'Nos reunimos cada semana.' },
        { key: 'schedule_1_day', label: 'Servicio 1 — día', type: 'text', placeholder: 'Domingo' },
        { key: 'schedule_1_time', label: 'Servicio 1 — hora', type: 'text', placeholder: '10:00 AM' },
        { key: 'schedule_1_type', label: 'Servicio 1 — tipo', type: 'text', placeholder: 'Servicio principal' },
        { key: 'schedule_1_live', label: 'Servicio 1 — ¿se transmite? (true/false)', type: 'text', placeholder: 'true' },
        { key: 'schedule_2_day', label: 'Servicio 2 — día', type: 'text', placeholder: 'Miércoles' },
        { key: 'schedule_2_time', label: 'Servicio 2 — hora', type: 'text', placeholder: '7:00 PM' },
        { key: 'schedule_2_type', label: 'Servicio 2 — tipo', type: 'text', placeholder: 'Estudio bíblico' },
        { key: 'schedule_2_live', label: 'Servicio 2 — ¿se transmite? (true/false)', type: 'text', placeholder: 'false' },
        { key: 'schedule_3_day', label: 'Servicio 3 — día', type: 'text', placeholder: 'Viernes' },
        { key: 'schedule_3_time', label: 'Servicio 3 — hora', type: 'text', placeholder: '7:00 PM' },
        { key: 'schedule_3_type', label: 'Servicio 3 — tipo', type: 'text', placeholder: 'Noche de oración' },
        { key: 'schedule_3_live', label: 'Servicio 3 — ¿se transmite? (true/false)', type: 'text', placeholder: 'false' },
      ],
    },
    {
      title: 'CTA final',
      fields: [
        { key: 'cta_eyebrow', label: 'Etiqueta de sección', type: 'text', placeholder: '— La iglesia es más que una pantalla' },
        { key: 'cta_title', label: 'Título (usa * antes de la palabra en acento)', type: 'text', placeholder: 'Conéctate con la *comunidad.' },
        { key: 'cta_body', label: 'Párrafo', type: 'textarea', rows: 2, placeholder: 'El stream es el primer paso...' },
      ],
    },
  ],

  educacion: [
    {
      title: 'Hero — sección principal',
      fields: [
        { key: 'hero_eyebrow', label: 'Texto pequeño encima del título', type: 'text', placeholder: 'Educación · Formación espiritual' },
        { key: 'hero_title', label: 'Título (usa * antes de la palabra en acento)', type: 'text', placeholder: 'Antes de servir, *aprender.' },
        { key: 'hero_subtitle', label: 'Subtítulo', type: 'textarea', rows: 3, placeholder: 'La fe sin conocimiento se apaga...' },
        { key: 'hero_image_url', label: 'Imagen de fondo del hero', type: 'upload-image' },
        { key: 'hero_video_url', label: 'Video de fondo del hero (.mp4)', type: 'upload-video' },
      ],
    },
    {
      title: 'Camino 1 — Discipulado',
      fields: [
        { key: 'path1_label', label: 'Etiqueta', type: 'text', placeholder: 'Discipulado' },
        { key: 'path1_headline', label: 'Título (↵ para nueva línea)', type: 'textarea', rows: 2, placeholder: 'Crecer en\nCristo.' },
        { key: 'path1_desc', label: 'Descripción', type: 'textarea', rows: 3, placeholder: 'Un camino estructurado de siete etapas...' },
        { key: 'path1_tag1', label: 'Etiqueta 1', type: 'text', placeholder: '7 etapas' },
        { key: 'path1_tag2', label: 'Etiqueta 2', type: 'text', placeholder: 'Mentoría personal' },
        { key: 'path1_tag3', label: 'Etiqueta 3', type: 'text', placeholder: 'Crecimiento espiritual' },
      ],
    },
    {
      title: 'Camino 2 — Estudio Bíblico',
      fields: [
        { key: 'path2_label', label: 'Etiqueta', type: 'text', placeholder: 'Estudio Bíblico' },
        { key: 'path2_headline', label: 'Título (↵ para nueva línea)', type: 'textarea', rows: 2, placeholder: 'La Palabra\nviva.' },
        { key: 'path2_desc', label: 'Descripción', type: 'textarea', rows: 3, placeholder: 'Estudios semanales profundos...' },
        { key: 'path2_tag1', label: 'Etiqueta 1', type: 'text', placeholder: 'Miércoles 7PM' },
        { key: 'path2_tag2', label: 'Etiqueta 2', type: 'text', placeholder: 'Todas las edades' },
        { key: 'path2_tag3', label: 'Etiqueta 3', type: 'text', placeholder: 'Recursos descargables' },
      ],
    },
    {
      title: 'Por qué formamos',
      fields: [
        { key: 'why_eyebrow', label: 'Etiqueta de sección', type: 'text', placeholder: '— Por qué formamos' },
        { key: 'why_title', label: 'Título', type: 'textarea', rows: 2, placeholder: 'La educación espiritual es el camino, no el destino.' },
        { key: 'why_body1', label: 'Párrafo 1', type: 'textarea', rows: 2, placeholder: 'Antes de que alguien pueda servir con excelencia...' },
        { key: 'why_body2', label: 'Párrafo 2', type: 'textarea', rows: 2, placeholder: 'Por eso nuestros programas de educación son el punto de entrada...' },
        { key: 'verse', label: 'Versículo', type: 'textarea', rows: 2, placeholder: '"Procura con diligencia presentarte a Dios aprobado..."' },
        { key: 'verse_ref', label: 'Referencia bíblica', type: 'text', placeholder: '— 2 Timoteo 2:15' },
        { key: 'cta_label', label: 'Botón — texto', type: 'text', placeholder: 'Comenzar mi camino' },
      ],
    },
    {
      title: 'Puente a la app',
      fields: [
        { key: 'app_title', label: 'Título', type: 'text', placeholder: 'Continúa tu formación en la comunidad en línea' },
        { key: 'app_body', label: 'Descripción', type: 'textarea', rows: 2, placeholder: 'En la app puedes ver tu progreso de discipulado...' },
      ],
    },
  ],

  publicaciones: [
    {
      title: 'Hero — sección principal',
      fields: [
        { key: 'hero_eyebrow', label: 'Texto pequeño encima del título', type: 'text', placeholder: 'El Manantial · Publicaciones' },
        { key: 'hero_title', label: 'Título (usa * antes de la palabra en acento)', type: 'text', placeholder: 'Campañas *y series.' },
        { key: 'hero_subtitle', label: 'Subtítulo', type: 'textarea', rows: 2, placeholder: 'Campañas, series y eventos especiales de la iglesia.' },
        { key: 'hero_image_url', label: 'Imagen de fondo del hero', type: 'upload-image' },
        { key: 'hero_video_url', label: 'Video de fondo del hero (.mp4)', type: 'upload-video' },
      ],
    },
  ],

  devocionales: [
    {
      title: 'Hero — sección principal',
      fields: [
        { key: 'hero_eyebrow', label: 'Texto pequeño encima del título', type: 'text', placeholder: 'Reflexiones · Devocionales' },
        { key: 'hero_title', label: 'Título (↵ para nueva línea, usa * antes de la palabra en acento)', type: 'textarea', rows: 2, placeholder: 'Palabra\npara hoy.' },
        { key: 'hero_subtitle', label: 'Subtítulo', type: 'textarea', rows: 2, placeholder: 'Reflexiones escritas por nuestros líderes...' },
        { key: 'hero_image_url', label: 'Imagen de fondo del hero', type: 'upload-image' },
        { key: 'hero_video_url', label: 'Video de fondo del hero (.mp4)', type: 'upload-video' },
      ],
    },
  ],
}

interface Props {
  page: string
  initialValues: Record<string, unknown>
  hasBlocks?: boolean
}

function fieldDisplayValue(type: FieldType, value: unknown): string {
  if (value === undefined || value === null) return ''
  if (type === 'json') return JSON.stringify(value, null, 2)
  return String(value)
}

export default function PageFieldsEditor({ page, initialValues, hasBlocks }: Props) {
  const schema = SCHEMAS[page]
  if (!schema) return (
    <div className="p-6 rounded-xl text-sm" style={{ background: BORDER, color: MUTED }}>
      No hay campos configurados para esta página.
    </div>
  )

  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {}
    schema.forEach(section =>
      section.fields.forEach(f => {
        init[f.key] = fieldDisplayValue(f.type, initialValues[f.key])
      })
    )
    return init
  })

  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [isPending, startTransition] = useTransition()
  const [uploading, setUploading] = useState<Record<string, boolean>>({})
  const [uploadError, setUploadError] = useState<Record<string, string>>({})
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({})

  function handleChange(key: string, val: string) {
    setValues(prev => ({ ...prev, [key]: val }))
    if (status === 'saved') setStatus('idle')
  }

  async function handleUpload(key: string, file: File) {
    setUploading(prev => ({ ...prev, [key]: true }))
    setUploadError(prev => ({ ...prev, [key]: '' }))
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No autenticado')
      const ext = file.name.split('.').pop() ?? 'bin'
      const path = `${user.id}/pages/${key}_${Date.now()}.${ext}`
      const { error } = await supabase.storage.from('posts').upload(path, file, { upsert: true })
      if (error) throw error
      const { data } = supabase.storage.from('posts').getPublicUrl(path)
      const url = data.publicUrl
      handleChange(key, url)
      // Auto-save only this field — don't touch other fields
      setStatus('saving')
      startTransition(async () => {
        try {
          const result = await savePageFields(page, { [key]: url })
          setStatus(result?.error ? 'error' : 'saved')
          if (result?.error) setErrorMsg(result.error)
        } catch (e) {
          setStatus('error')
          setErrorMsg(e instanceof Error ? e.message : 'No se pudo conectar con el servidor')
        }
      })
    } catch {
      setUploadError(prev => ({ ...prev, [key]: 'Error al subir. Intenta de nuevo.' }))
    } finally {
      setUploading(prev => ({ ...prev, [key]: false }))
    }
  }

  function handleUrlBlur(key: string, val: string) {
    if (!val || !val.startsWith('http')) return
    // Auto-save only this field when user pastes/types a URL and leaves
    setStatus('saving')
    startTransition(async () => {
      try {
        const result = await savePageFields(page, { [key]: val })
        setStatus(result?.error ? 'error' : 'saved')
        if (result?.error) setErrorMsg(result.error)
      } catch (e) {
        setStatus('error')
        setErrorMsg(e instanceof Error ? e.message : 'No se pudo conectar con el servidor')
      }
    })
  }

  function handleSave() {
    setStatus('saving')
    startTransition(async () => {
      const fields: Record<string, unknown> = {}
      schema.forEach(section =>
        section.fields.forEach(f => {
          const raw = values[f.key] ?? ''
          if (f.type === 'json') {
            if (!raw) { fields[f.key] = null; return }
            try { fields[f.key] = JSON.parse(raw) } catch { /* skip invalid JSON */ }
          } else {
            // empty string → null → tells server to delete this field from DB
            fields[f.key] = raw || null
          }
        })
      )
      try {
        const result = await savePageFields(page, fields)
        if (result?.error) {
          setStatus('error')
          setErrorMsg(result.error)
        } else {
          setStatus('saved')
        }
      } catch (e) {
        setStatus('error')
        setErrorMsg(e instanceof Error ? e.message : 'No se pudo conectar con el servidor')
      }
    })
  }

  const isBusy = isPending || status === 'saving'

  return (
    <div className="space-y-6">
      {/* Save bar — sticky at top */}
      <div className="sticky top-0 z-10 flex items-center gap-4 px-6 py-3 rounded-xl -mx-0"
        style={{ background: BG, borderBottom: `1px solid ${BORDER}` }}>
        <button
          onClick={handleSave}
          disabled={isBusy}
          className="inline-flex items-center gap-2.5 px-7 py-3 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] transition disabled:opacity-60"
          style={{ background: GOLD, color: BG }}
        >
          {isBusy ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
          {isBusy ? 'Guardando…' : 'Guardar cambios'}
        </button>

        {status === 'saved' && (
          <span className="flex items-center gap-2 text-[12px] font-bold" style={{ color: GOLD }}>
            <Check size={13} />
            Guardado — recarga la página para ver los cambios
          </span>
        )}
        {status === 'error' && (
          <span className="flex items-center gap-2 text-[12px] font-bold" style={{ color: '#F87171' }}>
            <AlertCircle size={13} />
            {errorMsg || 'Error al guardar'}
          </span>
        )}
      </div>

      {hasBlocks && (
        <div className="rounded-xl px-5 py-4 flex items-start gap-3" style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)' }}>
          <AlertCircle size={15} style={{ color: '#F87171', flexShrink: 0, marginTop: 1 }} />
          <div>
            <p className="text-[12px] font-bold" style={{ color: '#F87171' }}>El Editor avanzado tiene contenido activo</p>
            <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: 'rgba(248,113,113,0.70)' }}>
              Los bloques del "Editor avanzado" tienen prioridad sobre estos campos. La imagen de fondo y otros cambios aquí no se verán hasta que elimines o publiques sin bloques desde el Editor avanzado.
            </p>
          </div>
        </div>
      )}

      {schema.map(section => (
        <div key={section.title} className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
          <div className="px-6 py-4" style={{ background: CARD, borderBottom: `1px solid ${BORDER}` }}>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color: GOLD }}>
              {section.title}
            </p>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5" style={{ background: BG }}>
            {section.fields.map(field => {
              const isUpload = field.type === 'upload-image' || field.type === 'upload-video'
              const isTextArea = field.type === 'textarea' || field.type === 'json'
              const isFullWidth = isTextArea || isUpload
              return (
                <div key={field.key} className={isFullWidth ? 'md:col-span-2' : ''}>
                  <label className="block text-[11px] font-bold uppercase tracking-[0.18em] mb-2" style={{ color: MUTED }}>
                    {field.label}
                  </label>

                  {isTextArea ? (
                    <textarea
                      rows={field.rows ?? 3}
                      value={values[field.key] ?? ''}
                      onChange={e => handleChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full rounded-xl px-4 py-3 text-sm font-mono resize-y transition outline-none focus:ring-1"
                      style={{ background: CARD, border: `1px solid ${BORDER}`, color: INK }}
                    />
                  ) : isUpload ? (
                    <div className="space-y-2">
                      {/* Preview if URL is set and looks like a direct file */}
                      {values[field.key] && values[field.key].startsWith('http') && !values[field.key].includes(field.placeholder ?? '____') && (
                        <div className="rounded-xl overflow-hidden border" style={{ borderColor: BORDER }}>
                          {field.type === 'upload-image' ? (
                            <img
                              src={values[field.key]}
                              alt=""
                              className="w-full max-h-40 object-cover"
                              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                            />
                          ) : (
                            <video
                              src={values[field.key]}
                              className="w-full max-h-40 object-cover"
                              muted
                              onError={e => { (e.target as HTMLVideoElement).style.display = 'none' }}
                            />
                          )}
                        </div>
                      )}
                      {/* URL input + upload button */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={values[field.key] ?? ''}
                          onChange={e => handleChange(field.key, e.target.value)}
                          onBlur={e => handleUrlBlur(field.key, e.target.value)}
                          placeholder={field.type === 'upload-image' ? 'Pega una URL de imagen o usa el botón Subir' : 'Pega una URL de video .mp4 o usa el botón Subir'}
                          className="flex-1 rounded-xl px-4 py-3 text-sm transition outline-none focus:ring-1"
                          style={{ background: CARD, border: `1px solid ${BORDER}`, color: INK }}
                        />
                        {values[field.key] && values[field.key].startsWith('http') && (
                          <button
                            type="button"
                            title="Quitar imagen"
                            onClick={() => {
                              handleChange(field.key, '')
                              setStatus('saving')
                              startTransition(async () => {
                                try {
                                  const result = await savePageFields(page, { [field.key]: null })
                                  setStatus(result?.error ? 'error' : 'saved')
                                  if (result?.error) setErrorMsg(result.error)
                                } catch (e) {
                                  setStatus('error')
                                  setErrorMsg(e instanceof Error ? e.message : 'No se pudo conectar con el servidor')
                                }
                              })
                            }}
                            className="flex items-center justify-center w-10 rounded-xl flex-shrink-0 transition"
                            style={{ background: CARD, border: '1px solid rgba(248,113,113,0.30)', color: '#F87171' }}
                          >
                            <X size={14} />
                          </button>
                        )}
                        <input
                          type="file"
                          accept={field.type === 'upload-image' ? 'image/jpeg,image/png,image/webp,image/gif' : 'video/mp4,video/webm,video/quicktime'}
                          className="hidden"
                          ref={el => { fileRefs.current[field.key] = el }}
                          onChange={e => {
                            const file = e.target.files?.[0]
                            if (file) handleUpload(field.key, file)
                            e.target.value = ''
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => fileRefs.current[field.key]?.click()}
                          disabled={uploading[field.key]}
                          title={field.type === 'upload-image' ? 'Subir foto desde tu equipo' : 'Subir video desde tu equipo'}
                          className="flex items-center gap-2 px-4 py-3 rounded-xl text-[11px] font-bold uppercase tracking-[0.1em] transition flex-shrink-0 disabled:opacity-50"
                          style={{ background: CARD, border: `1px solid ${BORDER}`, color: GOLD }}
                        >
                          {uploading[field.key] ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : field.type === 'upload-image' ? (
                            <ImageIcon size={14} />
                          ) : (
                            <Video size={14} />
                          )}
                          {uploading[field.key] ? 'Subiendo…' : 'Subir'}
                        </button>
                      </div>
                      {uploadError[field.key] && (
                        <p className="text-[11px]" style={{ color: '#F87171' }}>{uploadError[field.key]}</p>
                      )}
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={values[field.key] ?? ''}
                      onChange={e => handleChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full rounded-xl px-4 py-3 text-sm transition outline-none focus:ring-1"
                      style={{ background: CARD, border: `1px solid ${BORDER}`, color: INK }}
                    />
                  )}

                  {field.hint && (
                    <p className="mt-1.5 text-[11px] leading-relaxed" style={{ color: MUTED }}>
                      {field.hint}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
