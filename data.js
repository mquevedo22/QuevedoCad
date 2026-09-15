// data.js
// Canciones de ejemplo, con contenido original propio (para que puedas probar la app
// sin problemas de derechos de autor). Sustitúyelas por las tuyas cuando conectemos Firebase.
//
// Formato de "letra": cada línea puede llevar acordes entre corchetes justo antes
// de la sílaba donde caen, ej: "[Am]Camino sin [G]rumbo fijo"

const SAMPLE_SONGS = [
  {
    id: 'camino-de-vuelta',
    title: 'Camino de vuelta',
    artist: 'Canción de ejemplo',
    originalKey: 'Am',
    lyrics: [
      '[Am]Camino de vuelta [G]a casa otra vez',
      '[F]Con la guitarra [C]colgada a los pies',
      '[Am]El sol se despide [G]detrás del portal',
      '[F]Y suena una nota [E]que sabe a final',
      '',
      '[C]Vuelvo, vuelvo, [G]vuelvo a empezar',
      '[Am]Con cuatro acordes [F]y ganas de andar',
      '[C]Vuelvo, vuelvo, [G]nada que perder',
      '[F]Solo una canción [E]para amanecer'
    ]
  },
  {
    id: 'luz-de-invierno',
    title: 'Luz de invierno',
    artist: 'Canción de ejemplo',
    originalKey: 'G',
    lyrics: [
      '[G]Se enciende despacio [D]la tarde de enero',
      '[Em]Mientras yo afino [C]este viejo madero',
      '[G]Una luz pequeña [D]detrás del cristal',
      '[Em]Me enseña el camino [C]para no fallar',
      '',
      '[Em]Y aunque haga frío [C]aquí adentro no',
      '[G]Porque hay una [D]cuerda que nunca calló'
    ]
  },
  {
    id: 'papel-y-tinta',
    title: 'Papel y tinta',
    artist: 'Canción de ejemplo',
    originalKey: 'D',
    lyrics: [
      '[D]Escribo tu nombre [A]sobre el papel',
      '[Bm]Con tinta que dice [G]lo que no sé',
      '[D]Que a veces las cosas [A]no tienen porqué',
      '[Bm]Y basta un acorde [G]para entender',
      '',
      '[G]Y así, poco a poco, [A]la canción se hizo',
      '[D]Con lo que tenía [Bm]y lo que perdí',
      '[G]Papel y tinta [A]y un buen [D]compás'
    ]
  }
];
