// storage.js
// Capa de almacenamiento de repertorios.
// HOY: usa localStorage (guardado solo en este dispositivo/navegador).
// MAÑANA (paso 3 del plan): sustituiremos las funciones de dentro de este archivo
// por llamadas a Firebase, y el resto de la app (app.js) no tendrá que cambiar nada,
// porque siempre habla con "Storage.getRepertoires()", "Storage.saveRepertoires()", etc.

const STORAGE_KEY = 'cancionero_repertorios_v1';

const Storage = {
  getRepertoires() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  },

  saveRepertoires(repertoires) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(repertoires));
  },

  createRepertoire(name) {
    const repertoires = this.getRepertoires();
    const newRepertoire = { id: 'r_' + Date.now(), name, songIds: [] };
    repertoires.push(newRepertoire);
    this.saveRepertoires(repertoires);
    return newRepertoire;
  },

  addSongToRepertoire(repertoireId, songId) {
    const repertoires = this.getRepertoires();
    const rep = repertoires.find(r => r.id === repertoireId);
    if (rep && !rep.songIds.includes(songId)) {
      rep.songIds.push(songId);
      this.saveRepertoires(repertoires);
    }
  },

  removeSongFromRepertoire(repertoireId, songId) {
    const repertoires = this.getRepertoires();
    const rep = repertoires.find(r => r.id === repertoireId);
    if (rep) {
      rep.songIds = rep.songIds.filter(id => id !== songId);
      this.saveRepertoires(repertoires);
    }
  },

  deleteRepertoire(repertoireId) {
    const repertoires = this.getRepertoires().filter(r => r.id !== repertoireId);
    this.saveRepertoires(repertoires);
  }
};
