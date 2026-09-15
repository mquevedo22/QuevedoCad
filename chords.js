// chords.js
// Transposición de acordes y conversión entre notación anglosajona (CAGED: A B C D E F G)
// y notación europea (Do Re Mi Fa Sol La Si).

const CHROMATIC_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const CHROMATIC_FLAT  = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

const NOTE_TO_INDEX = {
  'C': 0, 'B#': 0,
  'C#': 1, 'Db': 1,
  'D': 2,
  'D#': 3, 'Eb': 3,
  'E': 4, 'Fb': 4,
  'F': 5, 'E#': 5,
  'F#': 6, 'Gb': 6,
  'G': 7,
  'G#': 8, 'Ab': 8,
  'A': 9,
  'A#': 10, 'Bb': 10,
  'B': 11, 'Cb': 11
};

const CAGED_TO_EUROPEA = {
  'C': 'Do', 'D': 'Re', 'E': 'Mi', 'F': 'Fa', 'G': 'Sol', 'A': 'La', 'B': 'Si'
};
const EUROPEA_TO_CAGED = {
  'Do': 'C', 'Re': 'D', 'Mi': 'E', 'Fa': 'F', 'Sol': 'G', 'La': 'A', 'Si': 'B'
};

// Reconoce un acorde tipo: A, A#, Bb, Am7, C#dim, G/B, Sol7M, Rem, Fa#dim, La/Do#...
// Captura: nota raíz (grupo 1), resto del acorde (grupo 2), nota de bajo tras "/" si existe (grupo 3)
function parseChordCAGED(chord) {
  const m = chord.match(/^([A-G])(#|b)?(.*?)(?:\/([A-G])(#|b)?)?$/);
  if (!m) return null;
  const root = m[1] + (m[2] || '');
  const suffix = m[3] || '';
  const bass = m[4] ? m[4] + (m[5] || '') : null;
  return { root, suffix, bass };
}

function parseChordEuropea(chord) {
  const notes = Object.keys(EUROPEA_TO_CAGED).sort((a, b) => b.length - a.length);
  for (const note of notes) {
    const altPattern = note + '(#|b)?';
    const re = new RegExp('^(' + altPattern + ')(.*?)(?:/(' + altPattern + '))?$');
    const m = chord.match(re);
    if (m) {
      const root = m[1];
      const suffix = m[3] || '';
      const bass = m[4] || null;
      return { root, suffix, bass };
    }
  }
  return null;
}

function transposeNoteName(note, semitones, preferFlats) {
  const idx = NOTE_TO_INDEX[note];
  if (idx === undefined) return note;
  const newIdx = ((idx + semitones) % 12 + 12) % 12;
  return preferFlats ? CHROMATIC_FLAT[newIdx] : CHROMATIC_SHARP[newIdx];
}

// Transpone un acorde en notación CAGED por un número de semitonos (+ sube, - baja)
function transposeChord(chord, semitones, preferFlats = false) {
  if (semitones === 0) return chord;
  const parsed = parseChordCAGED(chord);
  if (!parsed) return chord;
  const newRoot = transposeNoteName(parsed.root, semitones, preferFlats);
  const newBass = parsed.bass ? transposeNoteName(parsed.bass, semitones, preferFlats) : null;
  return newRoot + parsed.suffix + (newBass ? '/' + newBass : '');
}

// Convierte un acorde entre notación 'caged' y 'europea'
function convertNotation(chord, toNotation) {
  if (toNotation === 'europea') {
    const parsed = parseChordCAGED(chord);
    if (!parsed) return chord;
    const rootLetter = parsed.root[0];
    const rootAccidental = parsed.root.slice(1);
    const newRoot = (CAGED_TO_EUROPEA[rootLetter] || rootLetter) + rootAccidental;
    let newBass = null;
    if (parsed.bass) {
      const bassLetter = parsed.bass[0];
      const bassAccidental = parsed.bass.slice(1);
      newBass = (CAGED_TO_EUROPEA[bassLetter] || bassLetter) + bassAccidental;
    }
    return newRoot + parsed.suffix + (newBass ? '/' + newBass : '');
  } else {
    const parsed = parseChordEuropea(chord);
    if (!parsed) return chord;
    const rootName = Object.keys(EUROPEA_TO_CAGED).find(n => parsed.root.startsWith(n));
    const rootAccidental = parsed.root.slice(rootName.length);
    const newRoot = EUROPEA_TO_CAGED[rootName] + rootAccidental;
    let newBass = null;
    if (parsed.bass) {
      const bassName = Object.keys(EUROPEA_TO_CAGED).find(n => parsed.bass.startsWith(n));
      const bassAccidental = parsed.bass.slice(bassName.length);
      newBass = EUROPEA_TO_CAGED[bassName] + bassAccidental;
    }
    return newRoot + parsed.suffix + (newBass ? '/' + newBass : '');
  }
}

// Procesa una línea en formato "[Acorde]letra" y devuelve el acorde transformado
function processChordToken(rawChord, semitones, notation, preferFlats) {
  let chord = rawChord;
  // Primero transponer siempre en notación CAGED internamente
  const isEuropea = /^(Do|Re|Mi|Fa|Sol|La|Si)/.test(chord);
  let cagedChord = isEuropea ? convertNotation(chord, 'caged') : chord;
  cagedChord = transposeChord(cagedChord, semitones, preferFlats);
  return notation === 'europea' ? convertNotation(cagedChord, 'europea') : cagedChord;
}
