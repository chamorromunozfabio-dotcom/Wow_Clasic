# World of Warcraft — Cronicas de Azeroth

Sitio web homenaje a **World of Warcraft (2004-2024)** — 20 anos de historia, expansiones, facciones y leyenda. De Vanilla a **The War Within**.

> Proyecto estatico con HTML semantico, CSS Grid y JavaScript vanilla. Forjado con la estetica de Azeroth: obsidiana, pergamino, oro WoW, azul Alianza y rojo Horda.

## Secciones

- **Hero** con brasas arcanas y runas flotantes (`<canvas id="embers">`)
- **Historia** — Azeroth, Titanes, Pozo de la Eternidad, Alianza vs Horda
- **Linea de tiempo** — Cronologia de las 11 expansiones (2004 Vanilla → 2024 The War Within)
- **Expansiones legendarias** — 6 cartas destacadas con enlaces a Wowpedia
- **Cita epica** — “You are not prepared!” — Illidan
- **Cinematica** — Battle for Azeroth: Batalla por Lordaeron (video YouTube)
- **Juego "Memoria de Azeroth"** — empareja cada expansion con su ano y lema (6 parejas / 12 cartas)
- **Facciones de Azeroth** — Alianza (Ventormenta) y Horda (Orgrimmar), clases y continentes
- **Oraculo de Azeroth** — chatbot basado en reglas sobre lore y expansiones

## Paleta WoW

```css
--noche:    #0a0e14  /* obsidiana */
--papel:    #f4ecd8  /* pergamino */
--mariposa: #f8b700  /* oro WoW */
--caribe:   #0070dd  /* azul Alianza */
--guacamaya:#c41e3a  /* rojo Horda */
--epico:    #a335ee
--legenda:  #ff8000
```

Tipografia: **Cinzel** (titulos epicos) + **EB Garamond** (cuerpo) + **Archivo** (UI)

## Estructura

```
.
├── index.html
├── css/
│   └── responsive.css   # sistema pergamino + obsidiana, responsive
├── js/
│   ├── main.js          # brasas arcanas, reveal, contadores, nav
│   ├── chatbot.js       # Oraculo de Azeroth (KB WoW)
│   └── game.js          # Memoria de Azeroth
└── README.md
```

## Tecnologias

- HTML5 semantico + accesibilidad (ARIA)
- CSS moderno: custom properties, Grid, Flex, clamp(), backdrop-filter
- JavaScript vanilla: Canvas API, IntersectionObserver, juego 3D flip

## Uso local

```bash
# Python
python -m http.server 8000
# Node
npx serve .
```

Abrir http://localhost:8000

## Expansiones cubiertas

Vanilla (2004) · TBC (2007) · WotLK (2008) · Cataclysm (2010) · MoP (2012) · WoD (2014) · Legion (2016) · BfA (2018) · Shadowlands (2020) · Dragonflight (2022) · The War Within (2024)

## Creditos

Fan project sin animo de lucro. World of Warcraft y todos los nombres son propiedad de Blizzard Entertainment.
