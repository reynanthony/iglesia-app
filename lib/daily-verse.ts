export type DailyVerse = { text: string; reference: string }

const VERSES: DailyVerse[] = [
  { text: 'Vengan a mí todos los que están cansados y agobiados, y yo les daré descanso.', reference: 'Mateo 11:28' },
  { text: 'Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.', reference: 'Juan 3:16' },
  { text: 'Todo lo puedo en Cristo que me fortalece.', reference: 'Filipenses 4:13' },
  { text: 'El Señor es mi pastor; nada me faltará.', reference: 'Salmos 23:1' },
  { text: 'Confía en el Señor con todo tu corazón, y no te apoyes en tu propia prudencia.', reference: 'Proverbios 3:5' },
  { text: 'No temas, porque yo estoy contigo; no te desmayes, porque yo soy tu Dios que te esfuerzo; siempre te ayudaré, siempre te sustentaré con la diestra de mi justicia.', reference: 'Isaías 41:10' },
  { text: 'En el principio era el Verbo, y el Verbo era con Dios, y el Verbo era Dios.', reference: 'Juan 1:1' },
  { text: 'Mas buscad primeramente el reino de Dios y su justicia, y todas estas cosas os serán añadidas.', reference: 'Mateo 6:33' },
  { text: 'Lámpara es a mis pies tu palabra, y lumbrera a mi camino.', reference: 'Salmos 119:105' },
  { text: 'Porque yo sé los pensamientos que tengo acerca de vosotros, dice el Señor, pensamientos de paz, y no de mal, para daros el fin que esperáis.', reference: 'Jeremías 29:11' },
  { text: 'Estad siempre gozosos. Orad sin cesar. Dad gracias en todo, porque esta es la voluntad de Dios para con vosotros en Cristo Jesús.', reference: '1 Tesalonicenses 5:16-18' },
  { text: 'El Señor te bendiga y te guarde; el Señor haga resplandecer su rostro sobre ti, y tenga de ti misericordia.', reference: 'Números 6:24-25' },
  { text: 'El amor es sufrido, es benigno; el amor no tiene envidia, el amor no es jactancioso, no se envanece.', reference: '1 Corintios 13:4' },
  { text: 'Porque donde estén dos o tres congregados en mi nombre, allí estoy yo en medio de ellos.', reference: 'Mateo 18:20' },
  { text: 'Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias.', reference: 'Filipenses 4:6' },
  { text: 'Y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones y vuestros pensamientos en Cristo Jesús.', reference: 'Filipenses 4:7' },
  { text: 'Pero los que esperan a el Señor tendrán nuevas fuerzas; levantarán alas como las águilas; correrán, y no se cansarán; caminarán, y no se fatigarán.', reference: 'Isaías 40:31' },
  { text: 'Jehová es mi luz y mi salvación; ¿a quién temeré? Jehová es la fortaleza de mi vida; ¿de quién me he de atemorizarme?', reference: 'Salmos 27:1' },
  { text: 'Ninguna arma forjada contra ti prosperará, y condenarás toda lengua que se levante contra ti en juicio.', reference: 'Isaías 54:17' },
  { text: 'Yo soy la vid, vosotros los pámpanos; el que permanece en mí, y yo en él, éste lleva mucho fruto; porque separados de mí nada podéis hacer.', reference: 'Juan 15:5' },
  { text: 'Bendice, alma mía, a el Señor, y no olvides ninguno de sus beneficios.', reference: 'Salmos 103:2' },
  { text: 'El Señor es mi fortaleza y mi escudo; en él confió mi corazón, y fui ayudado, por lo que se gozó mi corazón.', reference: 'Salmos 28:7' },
  { text: 'Encomendad a el Señor vuestros caminos, y confiad en él; y él lo hará.', reference: 'Salmos 37:5' },
  { text: 'Hijitos míos, no amemos de palabra ni de lengua, sino de hecho y en verdad.', reference: '1 Juan 3:18' },
  { text: 'Porque el Señor da la sabiduría, y de su boca viene el conocimiento y la inteligencia.', reference: 'Proverbios 2:6' },
  { text: 'Deleitarte has asimismo en el Señor, y él te concederá las peticiones de tu corazón.', reference: 'Salmos 37:4' },
  { text: 'Yo soy el camino, y la verdad, y la vida; nadie viene al Padre, sino por mí.', reference: 'Juan 14:6' },
  { text: 'Mas el fruto del Espíritu es amor, gozo, paz, paciencia, benignidad, bondad, fe, mansedumbre, templanza.', reference: 'Gálatas 5:22-23' },
  { text: 'Jehová peleará por vosotros, y vosotros estaréis tranquilos.', reference: 'Éxodo 14:14' },
  { text: 'Llevad mi yugo sobre vosotros, y aprended de mí, que soy manso y humilde de corazón; y hallaréis descanso para vuestras almas.', reference: 'Mateo 11:29' },
  { text: 'Así que, no os afanéis por el día de mañana, porque el día de mañana traerá su afán. Basta a cada día su propio mal.', reference: 'Mateo 6:34' },
  { text: 'El Señor está cerca de todos los que le invocan, de todos los que le invocan de veras.', reference: 'Salmos 145:18' },
  { text: 'Esforzaos y cobrad ánimo; no temáis, ni tengáis miedo de ellos, porque el Señor tu Dios es el que va contigo; no te dejará, ni te desamparará.', reference: 'Deuteronomio 31:6' },
  { text: 'Ciertamente el bien y la misericordia me seguirán todos los días de mi vida, y en la casa del Señor moraré por largos días.', reference: 'Salmos 23:6' },
  { text: 'Glorificad, pues, a Dios en vuestro cuerpo y en vuestro espíritu, los cuales son de Dios.', reference: '1 Corintios 6:20' },
  { text: 'El corazón alegre constituye buen remedio; mas el espíritu triste seca los huesos.', reference: 'Proverbios 17:22' },
  { text: 'Jesús le dijo: Yo soy la resurrección y la vida; el que cree en mí, aunque esté muerto, vivirá.', reference: 'Juan 11:25' },
  { text: 'Mas a Dios gracias, el cual nos lleva siempre en triunfo en Cristo Jesús.', reference: '2 Corintios 2:14' },
  { text: 'Estad quietos, y conoced que yo soy Dios; seré exaltado entre las naciones; enaltecido seré en la tierra.', reference: 'Salmos 46:10' },
  { text: 'Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien.', reference: 'Romanos 8:28' },
  { text: 'Si se humillare mi pueblo, sobre el cual mi nombre es invocado, y oraren, y buscaren mi rostro, y se convirtieren de sus malos caminos; entonces yo oiré desde los cielos, y perdonaré sus pecados, y sanaré su tierra.', reference: '2 Crónicas 7:14' },
  { text: 'Porque el Señor es bueno; para siempre es su misericordia, y su verdad por todas las generaciones.', reference: 'Salmos 100:5' },
  { text: 'Amarás al Señor tu Dios con todo tu corazón, y con toda tu alma, y con toda tu mente.', reference: 'Mateo 22:37' },
  { text: 'En Dios solamente está acallada mi alma; de él viene mi salvación.', reference: 'Salmos 62:1' },
  { text: 'Grande es el Señor, y digno de suprema alabanza; y su grandeza es inescrutable.', reference: 'Salmos 145:3' },
  { text: 'Porque no me avergüenzo del evangelio, porque es poder de Dios para salvación a todo aquel que cree.', reference: 'Romanos 1:16' },
  { text: 'Y si a alguno de vosotros le falta sabiduría, pídala a Dios, el cual da a todos abundantemente y sin reproche, y le será dada.', reference: 'Santiago 1:5' },
  { text: 'Puestos los ojos en Jesús, el autor y consumador de la fe.', reference: 'Hebreos 12:2' },
  { text: 'El que habita al abrigo del Altísimo morará bajo la sombra del Omnipotente.', reference: 'Salmos 91:1' },
  { text: 'Dios es nuestro amparo y fortaleza, nuestro pronto auxilio en las tribulaciones.', reference: 'Salmos 46:1' },
  { text: 'Cercano está el Señor a los quebrantados de corazón; y salva a los contritos de espíritu.', reference: 'Salmos 34:18' },
  { text: 'Sea la gracia del Señor Jesucristo con vosotros.', reference: '1 Corintios 16:23' },
]

const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

export function getDailyVerse(): DailyVerse {
  const dayIndex = Math.floor(Date.now() / 86_400_000)
  return VERSES[dayIndex % VERSES.length]
}

export function getDailyVerseDate(): string {
  const d = new Date()
  return `${DAYS[d.getDay()]}, ${d.getDate()} de ${MONTHS[d.getMonth()]} de ${d.getFullYear()}`
}
