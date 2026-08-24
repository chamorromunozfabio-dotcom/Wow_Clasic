# La vida de Gabo — Gabriel García Márquez

Sitio web homenaje a **Gabriel García Márquez (1927–2014)**, Premio Nobel de Literatura 1982. Biografía, línea de tiempo, obras, discurso Nobel, juego interactivo y chatbot.

> Proyecto estático con HTML semántico, CSS Grid y JavaScript vanilla. Inspirado en Macondo, las mariposas amarillas y el Caribe.

## Secciones

- **Hero** con animación de mariposas amarillas (`<canvas>`)
- **Biografía** — Gabo, el irreverente
- **Línea de tiempo** — Cronología 1927–2014
- **Obras** — 6 tarjetas con enlaces a Wikipedia
- **Discurso Nobel** — "La soledad de América Latina" (vídeo 1982)
- **Juego "Memoria de Macondo"** — juego de parejas (6 obras × 2 cartas)
- **Centro Gabo** — legado y formación virtual (centrogabo.org)
- **Chatbot "Pregúntale a Gabo"** — bot basado en reglas

## Tecnologías

- HTML5 semántico
- CSS moderno (`css/responsive.css`) — variables, Grid, Flex, animaciones
- JavaScript vanilla:
  - `js/main.js` — mariposas, IntersectionObserver, contadores, nav móvil, volver arriba
  - `js/chatbot.js` — chatbot sin servidor con base de conocimiento
  - `js/game.js` — juego de memoria con volteo 3D y temporizador

## Estructura

```
la-vida-de-gabo/
├── index.html
├── css/
│   └── responsive.css
├── js/
│   ├── main.js
│   ├── chatbot.js
│   └── game.js
└── README.md
```

## Uso local

Abrir `index.html` directamente en el navegador o servir con un servidor estático:

```bash
# Python
python -m http.server 8000
# Node
npx serve .
```

Abrir http://localhost:8000

## Autor

Proyecto de ejemplo — homenaje educativo sin ánimo de lucro.
