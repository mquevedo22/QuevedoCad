# Mi cancionero

Prototipo funcional de la app de canciones con acordes.

## Qué incluye ya
- Lista de canciones con buscador
- Vista de canción con transposición (subir/bajar semitonos)
- Cambio de notación de acordes: anglosajona (A B C…) ↔ europea (Do Re Mi…)
- Repertorios: crear listas, añadir/quitar canciones con buscador por palabras
- 3 canciones de ejemplo con letra original (para que no haya problemas de derechos
  de autor al probar la app — sustitúyelas por las tuyas)

## Cómo publicarlo en GitHub Pages

1. Copia todos estos archivos (`index.html`, la carpeta `css/`, la carpeta `js/`)
   a la raíz de tu repositorio de GitHub.
2. En GitHub, entra en tu repositorio → **Settings** → **Pages** (en el menú lateral).
3. En "Build and deployment" → "Source", elige **Deploy from a branch**.
4. Selecciona la rama `main` y la carpeta `/ (root)` → **Save**.
5. Espera 1–2 minutos. GitHub te dará una URL del tipo
   `https://tu-usuario.github.io/tu-repositorio/`. Ábrela desde el móvil, la
   tablet y el ordenador para comprobar que se ve bien en todos.

## Cómo añadir tus propias canciones (por ahora)

Abre `js/data.js` y añade objetos al array `SAMPLE_SONGS` siguiendo el mismo
formato: los acordes van entre corchetes justo antes de la sílaba donde caen,
por ejemplo:

```js
'[Am]Camino sin [G]rumbo fijo'
```

Esto es temporal — en el siguiente paso conectaremos una base de datos
(Firebase) para que puedas añadir canciones desde la propia app, sin tocar
código, y para que tus repertorios se sincronicen entre dispositivos.

## Limitación actual

Los repertorios se guardan con `localStorage`, es decir, **solo en el
dispositivo/navegador donde los creaste**. Para que se sincronicen entre tu
móvil y tu ordenador (como pediste), el siguiente paso es conectar Firebase —
avísame cuando hayas probado este prototipo y seguimos con eso.
