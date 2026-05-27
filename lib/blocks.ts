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

export interface Block {
  id: string
  type: BlockType
  props: Record<string, any>
}

export interface BlockMeta {
  label: string
  group: 'Estructura' | 'Texto' | 'Contenido' | 'Multimedia' | 'Especial'
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
}

export function createBlock(type: BlockType): Block {
  return {
    id: Math.random().toString(36).slice(2, 9),
    type,
    props: JSON.parse(JSON.stringify(BLOCK_DEFAULTS[type])),
  }
}

export const BLOCK_GROUPS: { name: BlockMeta['group']; types: BlockType[] }[] = [
  { name: 'Estructura', types: ['hero', 'columns', 'spacer'] },
  { name: 'Texto',      types: ['heading', 'text'] },
  { name: 'Multimedia', types: ['image', 'video'] },
  { name: 'Contenido',  types: ['announcement', 'stats', 'cards', 'cta'] },
  { name: 'Especial',   types: ['verse', 'services'] },
]
