export type BlockType =
  | 'hero'
  | 'heading'
  | 'text'
  | 'image'
  | 'announcement'
  | 'stats'
  | 'cards'
  | 'cta'
  | 'verse'
  | 'services'
  | 'video'
  | 'columns'
  | 'spacer'
  | 'detalle'
  | 'agenda'
  | 'galeria'
  | 'ponentes'
  | 'faq'
  | 'separador'

export interface Block {
  id: string
  type: BlockType
  props: Record<string, any>
}

export interface BlockMeta {
  label: string
  group: 'Estructura' | 'Texto' | 'Contenido' | 'Multimedia' | 'Especial' | 'Evento'
  description: string
}

export const BLOCK_META: Record<BlockType, BlockMeta> = {
  hero:         { label: 'Hero',            group: 'Estructura', description: 'Sección principal con título y CTA' },
  heading:      { label: 'Título',          group: 'Texto',      description: 'H1–H4 con estilos tipográficos' },
  text:         { label: 'Párrafo',         group: 'Texto',      description: 'Bloque de texto libre' },
  columns:      { label: 'Columnas',        group: 'Estructura', description: 'Dos columnas de contenido' },
  spacer:       { label: 'Espaciado',       group: 'Estructura', description: 'Espacio vertical' },
  image:        { label: 'Imagen',          group: 'Multimedia', description: 'Imagen con caption opcional' },
  video:        { label: 'Video',           group: 'Multimedia', description: 'Embed de YouTube o Vimeo' },
  announcement: { label: 'Anuncio',         group: 'Contenido',  description: 'Banner de aviso o notificación' },
  stats:        { label: 'Estadísticas',    group: 'Contenido',  description: 'Fila de números destacados' },
  cards:        { label: 'Tarjetas',        group: 'Contenido',  description: 'Grid de tarjetas 2 o 3 columnas' },
  cta:          { label: 'Llamada a acción',group: 'Contenido',  description: 'Sección CTA con botones' },
  verse:        { label: 'Versículo',       group: 'Especial',   description: 'Cita bíblica destacada' },
  services:     { label: 'Horarios',        group: 'Especial',   description: 'Tabla de horarios de servicios' },
  detalle:      { label: 'Detalle',         group: 'Evento',     description: 'Fecha, lugar, precio y detalles clave' },
  agenda:       { label: 'Agenda',          group: 'Evento',     description: 'Programa / cronograma del evento' },
  galeria:      { label: 'Galería',         group: 'Evento',     description: 'Grid de imágenes fotográficas' },
  ponentes:     { label: 'Ponentes',        group: 'Evento',     description: 'Perfiles de oradores o facilitadores' },
  faq:          { label: 'Preguntas',       group: 'Evento',     description: 'Preguntas frecuentes con respuestas' },
  separador:    { label: 'Separador',       group: 'Evento',     description: 'Línea divisoria con etiqueta opcional' },
}

export const BLOCK_DEFAULTS: Record<BlockType, Record<string, any>> = {
  hero: {
    tagline: 'Iglesia El Manantial · Comunidad de fe',
    headline1: 'Donde',
    headline2: 'fluye',
    headline3: 'la vida.',
    subtitle: 'Una comunidad de fe viva donde encontrarás amor, propósito y una familia que te recibe como eres.',
    cta1Label: 'Conócenos',
    cta1Href: '/nosotros',
    cta2Label: 'Ver prédica',
    cta2Href: '/predicas',
    style: 'light',
    bgImage: '',
    bgVideo: '',
  },
  heading: {
    eyebrow: '',
    text: 'Nuevo título',
    level: 'h2',
    align: 'left',
    style: 'display',
  },
  text: {
    content: 'Escribe aquí el contenido del párrafo.',
    size: 'base',
    align: 'left',
    columns: 1,
  },
  image: {
    url: '',
    alt: '',
    caption: '',
    aspect: 'video',
    fullWidth: true,
    rounded: true,
  },
  announcement: {
    type: 'info',
    eyebrow: 'Anuncio',
    title: 'Título del anuncio',
    body: 'Descripción del anuncio aquí.',
    ctaLabel: '',
    ctaHref: '',
    style: 'light',
  },
  stats: {
    heading: '',
    items: [
      { value: '2008', label: 'Fundación' },
      { value: '500+', label: 'Familias' },
      { value: '3',    label: 'Generaciones' },
      { value: '12+',  label: 'Ministerios' },
    ],
  },
  cards: {
    eyebrow: '',
    heading: '',
    columns: 3,
    items: [
      { image: '', title: 'Tarjeta 1', body: 'Descripción de la tarjeta.', link: '' },
      { image: '', title: 'Tarjeta 2', body: 'Descripción de la tarjeta.', link: '' },
      { image: '', title: 'Tarjeta 3', body: 'Descripción de la tarjeta.', link: '' },
    ],
  },
  cta: {
    eyebrow: '— Eres bienvenido',
    heading: 'Tu historia comienza aquí.',
    body: 'No importa dónde estés ni qué hayas vivido. Hay un lugar para ti.',
    btn1Label: 'Visítanos este domingo',
    btn1Href: '/contacto',
    btn2Label: 'Unirse a la comunidad',
    btn2Href: '/registro',
    style: 'dark',
  },
  verse: {
    text: 'Vengan a mí todos los que están cansados y agobiados, y yo les daré descanso.',
    reference: 'Mateo 11:28',
    size: 'lg',
  },
  services: {
    heading: 'Horarios de servicio',
    items: [
      { day: 'Domingo',   time: '10:00', unit: 'AM', label: 'Servicio principal' },
      { day: 'Miércoles', time: '7:00',  unit: 'PM', label: 'Estudio bíblico'   },
      { day: 'Viernes',   time: '7:00',  unit: 'PM', label: 'Noche de oración'  },
    ],
  },
  video: {
    url: '',
    title: '',
    caption: '',
  },
  columns: {
    left: 'Contenido de la columna izquierda.',
    right: 'Contenido de la columna derecha.',
    split: '1/2',
  },
  spacer: {
    size: 'md',
  },
  detalle: {
    heading: 'Detalles',
    items: [
      { icon: '📅', label: 'Fecha', value: 'Sábado, 15 de junio 2026' },
      { icon: '🕐', label: 'Hora',  value: '7:00 PM' },
      { icon: '📍', label: 'Lugar', value: 'Iglesia El Manantial' },
      { icon: '💰', label: 'Entrada', value: 'Libre' },
    ],
  },
  agenda: {
    heading: 'Programa',
    items: [
      { time: '6:30 PM', title: 'Recibimiento y registro', speaker: '' },
      { time: '7:00 PM', title: 'Alabanza y adoración',   speaker: '' },
      { time: '7:30 PM', title: 'Mensaje principal',       speaker: 'Pastor' },
      { time: '8:30 PM', title: 'Ministerio y oración',   speaker: '' },
    ],
  },
  galeria: {
    images: [] as string[],
    columns: 3,
  },
  ponentes: {
    heading: 'Ponentes',
    items: [
      { photo: '', name: 'Nombre del ponente', title: 'Pastor / Conferencista', bio: 'Descripción breve del ponente.' },
    ],
  },
  faq: {
    heading: 'Preguntas frecuentes',
    items: [
      { question: '¿Necesito registrarme?',  answer: 'No, la entrada es libre y abierta a todos.' },
      { question: '¿Hay estacionamiento?', answer: 'Sí, contamos con estacionamiento disponible.' },
    ],
  },
  separador: {
    label: '',
  },
}

export function createBlock(type: BlockType): Block {
  return {
    id: Math.random().toString(36).slice(2, 9),
    type,
    props: JSON.parse(JSON.stringify(BLOCK_DEFAULTS[type])),
  }
}

export const BLOCK_GROUPS: { name: BlockMeta['group']; types: BlockType[] }[] = [
  { name: 'Evento',     types: ['detalle', 'agenda', 'galeria', 'ponentes', 'faq', 'separador'] },
  { name: 'Estructura', types: ['hero', 'columns', 'spacer'] },
  { name: 'Texto',      types: ['heading', 'text'] },
  { name: 'Multimedia', types: ['image', 'video'] },
  { name: 'Contenido',  types: ['announcement', 'stats', 'cards', 'cta'] },
  { name: 'Especial',   types: ['verse', 'services'] },
]
