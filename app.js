// app.js
// Orquesta las tres vistas de la app (lista de canciones, vista de canción, repertorios)
// y conecta chords.js (transposición/notación) con storage.js (repertorios).

const state = {
  currentSongId: null,
  semitones: 0,
  notation: 'caged', // 'caged' | 'europea'
  currentRepertoireId: null
};

const CHORD_TOKEN_RE = /\[([^\]]+)\]/g;

function renderChordLyricLine(line) {
  if (line.trim() === '') return '<div class="line line--empty">&nbsp;</div>';
  const html = line.replace(CHORD_TOKEN_RE, (_, rawChord) => {
    const shown = processChordToken(rawChord, state.semitones, state.notation, false);
    return `<span class="chord">${shown}</span>`;
  });
  return `<div class="line">${html}</div>`;
}

// ---------- Vista: lista de canciones ----------

function renderSongList(filter = '') {
  const container = document.getElementById('song-list');
  const term = filter.trim().toLowerCase();
  const songs = SAMPLE_SONGS.filter(s =>
    s.title.toLowerCase().includes(term) || s.artist.toLowerCase().includes(term)
  );
  container.innerHTML = songs.map(s => `
    <button class="song-item" data-id="${s.id}">
      <span class="song-item__title">${s.title}</span>
      <span class="song-item__meta">${s.artist} · Tono original: ${s.originalKey}</span>
    </button>
  `).join('') || '<p class="empty-msg">No se ha encontrado ninguna canción.</p>';

  container.querySelectorAll('.song-item').forEach(btn => {
    btn.addEventListener('click', () => openSong(btn.dataset.id));
  });
}

// ---------- Vista: canción ----------

function openSong(songId) {
  state.currentSongId = songId;
  state.semitones = 0;
  showView('view-song');
  renderSong();
}

function renderSong() {
  const song = SAMPLE_SONGS.find(s => s.id === state.currentSongId);
  if (!song) return;
  document.getElementById('song-title').textContent = song.title;
  document.getElementById('song-artist').textContent = song.artist;
  document.getElementById('song-semitone-label').textContent =
    state.semitones === 0 ? 'Tono original' : (state.semitones > 0 ? `+${state.semitones}` : `${state.semitones}`);
  document.getElementById('song-lyrics').innerHTML =
    song.lyrics.map(renderChordLyricLine).join('');

  document.querySelectorAll('.notation-toggle button').forEach(btn => {
    btn.classList.toggle('is-active', btn.dataset.notation === state.notation);
  });
}

function initSongControls() {
  document.getElementById('transpose-up').addEventListener('click', () => {
    state.semitones += 1;
    renderSong();
  });
  document.getElementById('transpose-down').addEventListener('click', () => {
    state.semitones -= 1;
    renderSong();
  });
  document.getElementById('transpose-reset').addEventListener('click', () => {
    state.semitones = 0;
    renderSong();
  });
  document.querySelectorAll('.notation-toggle button').forEach(btn => {
    btn.addEventListener('click', () => {
      state.notation = btn.dataset.notation;
      renderSong();
    });
  });
  document.getElementById('back-to-list').addEventListener('click', () => showView('view-list'));
  document.getElementById('add-to-repertoire-btn').addEventListener('click', openAddToRepertoireDropdown);
}

// ---------- Vista: repertorios ----------

function renderRepertoireList() {
  const container = document.getElementById('repertoire-list');
  const repertoires = Storage.getRepertoires();
  container.innerHTML = repertoires.map(r => `
    <button class="repertoire-item" data-id="${r.id}">
      <span class="repertoire-item__name">${r.name}</span>
      <span class="repertoire-item__meta">${r.songIds.length} canción${r.songIds.length === 1 ? '' : 'es'}</span>
    </button>
  `).join('') || '<p class="empty-msg">Todavía no tienes repertorios. Crea el primero.</p>';

  container.querySelectorAll('.repertoire-item').forEach(btn => {
    btn.addEventListener('click', () => openRepertoire(btn.dataset.id));
  });
}

function openRepertoire(repertoireId) {
  state.currentRepertoireId = repertoireId;
  renderRepertoireDetail();
  document.getElementById('repertoire-detail').classList.remove('is-hidden');
}

function renderRepertoireDetail() {
  const repertoires = Storage.getRepertoires();
  const rep = repertoires.find(r => r.id === state.currentRepertoireId);
  if (!rep) return;
  document.getElementById('repertoire-name').textContent = rep.name;
  const list = document.getElementById('repertoire-songs');
  list.innerHTML = rep.songIds.map(id => {
    const song = SAMPLE_SONGS.find(s => s.id === id);
    if (!song) return '';
    return `
      <li class="repertoire-song">
        <span>${song.title} <em>— ${song.artist}</em></span>
        <div>
          <button class="link-btn" data-open="${song.id}">Ver</button>
          <button class="link-btn link-btn--danger" data-remove="${song.id}">Quitar</button>
        </div>
      </li>`;
  }).join('') || '<p class="empty-msg">Este repertorio aún no tiene canciones. Usa "Añadir canción".</p>';

  list.querySelectorAll('[data-open]').forEach(btn => {
    btn.addEventListener('click', () => openSong(btn.dataset.open));
  });
  list.querySelectorAll('[data-remove]').forEach(btn => {
    btn.addEventListener('click', () => {
      Storage.removeSongFromRepertoire(state.currentRepertoireId, btn.dataset.remove);
      renderRepertoireDetail();
      renderRepertoireList();
    });
  });
}

function initRepertoireControls() {
  document.getElementById('new-repertoire-btn').addEventListener('click', () => {
    const name = prompt('Nombre del nuevo repertorio:');
    if (name && name.trim()) {
      const rep = Storage.createRepertoire(name.trim());
      renderRepertoireList();
      openRepertoire(rep.id);
    }
  });

  document.getElementById('add-song-to-repertoire-btn').addEventListener('click', () => {
    openSongPicker(state.currentRepertoireId);
  });
}

// Desplegable con buscador por palabras para añadir canciones a un repertorio
function openSongPicker(repertoireId) {
  const picker = document.getElementById('song-picker');
  const input = document.getElementById('song-picker-search');
  const results = document.getElementById('song-picker-results');
  picker.dataset.repertoireId = repertoireId;
  picker.classList.remove('is-hidden');
  input.value = '';
  input.focus();
  renderSongPickerResults('');

  input.oninput = () => renderSongPickerResults(input.value);
}

function renderSongPickerResults(term) {
  const results = document.getElementById('song-picker-results');
  const q = term.trim().toLowerCase();
  const matches = SAMPLE_SONGS.filter(s =>
    s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q)
  );
  results.innerHTML = matches.map(s => `
    <button class="picker-item" data-id="${s.id}">${s.title} <em>— ${s.artist}</em></button>
  `).join('') || '<p class="empty-msg">Sin resultados.</p>';

  results.querySelectorAll('.picker-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const repertoireId = document.getElementById('song-picker').dataset.repertoireId;
      Storage.addSongToRepertoire(repertoireId, btn.dataset.id);
      document.getElementById('song-picker').classList.add('is-hidden');
      renderRepertoireDetail();
      renderRepertoireList();
    });
  });
}

function openAddToRepertoireDropdown() {
  const repertoires = Storage.getRepertoires();
  if (repertoires.length === 0) {
    alert('Primero crea un repertorio en la pestaña "Repertorios".');
    return;
  }
  const menu = document.getElementById('add-to-repertoire-menu');
  menu.innerHTML = repertoires.map(r =>
    `<button data-id="${r.id}">${r.name}</button>`
  ).join('');
  menu.classList.toggle('is-hidden');
  menu.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      Storage.addSongToRepertoire(btn.dataset.id, state.currentSongId);
      menu.classList.add('is-hidden');
    });
  });
}

// ---------- Navegación ----------

function showView(viewId) {
  document.querySelectorAll('.view').forEach(v => v.classList.add('is-hidden'));
  document.getElementById(viewId).classList.remove('is-hidden');
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('is-active', t.dataset.view === viewId));
  if (viewId === 'view-repertoires') renderRepertoireList();
}

function initNav() {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => showView(tab.dataset.view));
  });
}

// ---------- Arranque ----------

document.addEventListener('DOMContentLoaded', () => {
  renderSongList();
  initNav();
  initSongControls();
  initRepertoireControls();

  document.getElementById('song-search').addEventListener('input', (e) => {
    renderSongList(e.target.value);
  });

  document.getElementById('song-picker-close').addEventListener('click', () => {
    document.getElementById('song-picker').classList.add('is-hidden');
  });
});
