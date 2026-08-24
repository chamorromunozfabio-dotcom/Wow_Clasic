/* ============================================================
   ORACULO DE AZEROTH — Chatbot WoW
   Bot basado en reglas (sin servidor): detecta palabras clave
   y responde sobre lore, expansiones, facciones, razas, clases
   y cinematicas. Chips + efecto "escribiendo…".
   ============================================================ */

(function chatbot() {
  const fab = document.getElementById("chatFab");
  const win = document.getElementById("chatWindow");
  const closeBtn = document.getElementById("chatClose");
  const messages = document.getElementById("chatMessages");
  const chipsBox = document.getElementById("chatChips");
  const form = document.getElementById("chatForm");
  const input = document.getElementById("chatInput");
  if (!fab || !win) return;

  /* ---------- Base de conocimiento Azeroth ---------- */
  const KB = [
    {
      keys: ["vanilla", "classic", "2004", "mundo original", "molten core", "ragnaros", "onyxia"],
      reply:
        "🏰 <strong>World of Warcraft (2004) — Vanilla:</strong> Dos continentes (Reinos del Este y Kalimdor), nivel 60, bandas de 40 como Núcleo de Magma y Guarida de Onyxia. El nacimiento de la leyenda. " +
        'Explora más en <a href="#expansiones">Expansiones</a>.'
    },
    {
      keys: ["burning crusade", "tbc", "terrallende", "outland", "illidan", "portal oscuro", "kael"],
      reply:
        "🔥 <strong>The Burning Crusade (2007):</strong> El Portal Oscuro se reabre. Terrallende, Tempest Keep y el Templo Oscuro de Illidan — <em>“You are not prepared!”</em>. Llegan elfos de sangre (Horda) y draenei (Alianza), vuelo y nivel 70."
    },
    {
      keys: ["wrath", "wotlk", "lich king", "arthas", "rasganorte", "northrend", "ciudadela", "corona de hielo", "invencible"],
      reply:
        "❄️ <strong>Wrath of the Lich King (2008):</strong> La expansión más amada. Rasganorte, la Ciudadela de la Corona de Hielo y Arthas Menethil como Rey Exánime. Caballeros de la Muerte como clase heroica. <em>“Frostmourne hungers…”</em> Nivel 80."
    },
    {
      keys: ["cataclysm", "cata", "alamuerte", "deathwing", "cataclismo", "thrall", "aspecto"],
      reply:
        "🌋 <strong>Cataclysm (2010):</strong> Alamuerte surge del Maelstrom y parte Azeroth en dos. Mil misiones rediseñadas, vuelo en los continentes originales, goblins y huargen. Nivel 85."
    },
    {
      keys: ["pandaria", "mop", "pandaren", "monje", "mo p", "garrosh", "asedio orgrimmar"],
      reply:
        "🍃 <strong>Mists of Pandaria (2012):</strong> La niebla revela Pandaria. Pandaren y monjes, el Valle de los Cuatro Vientos y el orgullo de Garrosh que culmina en el Asedio a Orgrimmar. Nivel 90."
    },
    {
      keys: ["draenor", "wod", "warlords", "grommash", "horda de hierro", "garrison", "fortaleza"],
      reply:
        "⚒️ <strong>Warlords of Draenor (2014):</strong> Draenor alternativo 35 años atrás. Grommash rechaza la sangre de Mannoroth y forja la Horda de Hierro. Sistema de Ciudadelas (Garrison). Nivel 100."
    },
    {
      keys: ["legion", "sargeras", "guldan", "islas abruptas", "broken isles", "demon hunter", "cazador demonio", "arma artefacto", "illidan regresa"],
      reply:
        "😈 <strong>Legion (2016):</strong> La Legión Ardiente invade. Islas Abruptas, armas artefacto legendarias y cazadores de demonios jugables. Illidan regresa y Sargeras hunde su espada en Silithus. Nivel 110."
    },
    {
      keys: ["battle for azeroth", "bfa", "bfa", "sylvanas", "teldrassil", "kultiras", "zandalar", "corazon azeroth", "azshara"],
      reply:
        "⚔️ <strong>Battle for Azeroth (2018):</strong> La guerra total Horda vs Alianza. Sylvanas quema Teldrassil, Kul Tiras y Zandalar, Corazón de Azeroth y la reina Azshara en Nazjatar. Nivel 120."
    },
    {
      keys: ["shadowlands", "tierras sombrias", "carcelero", "jailer", "maw", "fauce", "sylvanas juicio", "curias", "bastion", "maldraxxus"],
      reply:
        "💀 <strong>Shadowlands (2020):</strong> Más allá del velo. Las Tierras Sombrías, el Carcelero (Zovaal) y el destino de Anduin y Sylvanas. Pactos de Curias, Torghast y nivel reducido a 60 (squish)."
    },
    {
      keys: ["dragonflight", "dragon", "islas dragon", "dragon isles", "alexstrasza", "aspectos", "dracthyr", "evocador", "vuelo"],
      reply:
        "🐉 <strong>Dragonflight (2022):</strong> Las Islas Dragón despiertan. Alexstrasza y los Aspectos recuperan su poder, dracthyr evocadores y el revolucionario sistema de Vuelo de Dragones — surca los cielos como nunca. Nivel 70."
    },
    {
      keys: ["war within", "tww", "khaz algar", "xalatath", "nerubian", "azj kahet", "saga alma mundo", "worldsoul"],
      reply:
        "🌑 <strong>The War Within (2024):</strong> Inicia la Saga del Alma-Mundo. Bajo Khaz Algar, Xal'atath manipula a los nerubianos de Azj-Kahet mientras el corazón de Azeroth — su Alma-Mundo — susurra. Primer capítulo de tres (Midnight y The Last Titan le siguen). Nivel 80."
    },
    {
      keys: ["expansiones", "expansion", "cuantas", "lista", "saga", "cronologia", "linea tiempo"],
      reply:
        "📜 <strong>11 capítulos épicos (2004-2024):</strong><br>" +
        "• 2004 Vanilla — 2007 TBC — 2008 WotLK<br>" +
        "• 2010 Cataclysm — 2012 MoP — 2014 WoD<br>" +
        "• 2016 Legion — 2018 BfA — 2020 Shadowlands<br>" +
        "• 2022 Dragonflight — 2024 The War Within<br>" +
        'Descúbrelas en <a href="#linea-tiempo">Línea de tiempo</a> y <a href="#expansiones">Expansiones legendarias</a>.'
    },
    {
      keys: ["alianza", "alliance", "ventormenta", "stormwind", "anduin", "jaina", "humano", "enano", "elfo noche"],
      reply:
        "🛡️ <strong>La Alianza:</strong> Humanos, enanos, elfos de la noche, gnomos, draenei, huargen, elfos del Vacío y dracthyr. Capital <strong>Ventormenta</strong>. Liderada por Anduin Wrynn y Jaina Valiente. Lema: <em>¡Por la Alianza!</em> " +
        'Más en <a href="#azeroth">Facciones</a>.'
    },
    {
      keys: ["horda", "horde", "orgrimmar", "thrall", "sylvanas", "orco", "troll", "tauren", "elfo sangre", "no muerto"],
      reply:
        "🔥 <strong>La Horda:</strong> Orcos, no-muertos, tauren, trolls, elfos de sangre, goblins, elfos Nocheterna, vulpera y zandalari. Capital <strong>Orgrimmar</strong>. Forjada por Thrall. Grito: <em>¡Por la Horda!</em> — honor y supervivencia."
    },
    {
      keys: ["razas", "raza", "clases", "clase", "paladin", "cazador", "mago", "brujo", "druida", "chaman", "picaro", "sacerdote", "guerrero", "monje", "cazador demonio", "caballero muerte", "evocador", "dracthyr"],
      reply:
        "⚔️ <strong>Razas y Clases:</strong> 13 clases (guerrero a evocador) y 26 razas jugables. ¿Quieres <em>tankear</em> como paladín, invocar demonios como brujo, o surcar cielos como evocador dracthyr? Todas combinan raza+facción+clase para forjar tu héroe. " +
        'Ver <a href="https://worldofwarcraft.blizzard.com/es-es/game/classes" target="_blank" rel="noopener">clases oficiales</a>.'
    },
    {
      keys: ["arthas", "rey exanime", "lich king", "frostmourne", "invencible", "bolvar"],
      reply:
        "👑 <strong>Arthas Menethil:</strong> Príncipe de Lordaeron que tomó Frostmourne para salvar a su pueblo y se convirtió en el Rey Exánime. Su historia — de paladín a tirano helado — es el corazón de Wrath. Tras su caída, Bolvar Fordragón tomó la corona: <em>“Debe haber siempre un Rey Exánime”.</em>"
    },
    {
      keys: ["illidan", "you are not prepared", "tempestira", "cazador demonio", "skull of guldan"],
      reply:
        "😈 <strong>Illidan Tempestira:</strong> El Traidor que sacrificó todo contra la Legión. Ciego, con alas demoníacas y las espadas de Azzinoth. Su frase en el Templo Oscuro — <em>¡No estáis preparados!</em> — es meme y mito. Protagonista de The Burning Crusade y redimido en Legion."
    },
    {
      keys: ["sylvanas", "brisa veloz", "windrunner", "reina alma en pena", "banshee"],
      reply:
        "🏹 <strong>Sylvanas Brisaveloz:</strong> Guardabosques de Quel’Thalas asesinada por Arthas y resucitada como Reina Alma en Pena. Líder de los Renegados, Jefa de Guerra de la Horda y figura central de BfA y Shadowlands. ¿Heroína trágica o villana?"
    },
    {
      keys: ["azeroth", "mundo", "kalimdor", "reinos del este", "eastern kingdoms", "titanes", "dioses antiguos", "old gods", "sargeras", "pozo eternidad", "maelstrom"],
      reply:
        "🌍 <strong>Azeroth:</strong> Mundo-alma de los Titanes. Dos grandes continentes (Reinos del Este y Kalimdor), corazones heridos por la Espada de Sargeras en Silithus y ahora latiendo bajo Khaz Algar. Custodiada por Aspectos dragón y amenazada por Dioses Antiguos y el Vacío."
    },
    {
      keys: ["cinematica", "trailer", "video", "cine", "battle for azeroth cinematic", "wrath cinematic"],
      reply:
        '🎬 ¡No te la pierdas! En <a href="#video">Cinemática</a> está el tráiler de <strong>Battle for Azeroth — “La Guerra nos ha cambiado”</strong> (Anduin vs Sylvanas en Lordaeron), una de las mejores CGI de Blizzard. También busca en YouTube “Wrath Gate” o “Legion cinematic” — puro escalofrío.'
    },
    {
      keys: ["juego", "jugar", "memoria", "azeroth memoria", "cartas"],
      reply:
        '🎮 ¡A jugar! Ve a <a href="#juego">Memoria de Azeroth</a> y empareja cada expansión con su año y lema. ¿Puedes en menos de 12 movimientos? ¡Por el botín!'
    },
    {
      keys: ["hola", "buenas", "hey", "saludos", "hi", "hello", "wenas"],
      reply:
        "¡Lok'tar ogar / ¡Por la Alianza! 🐉 Soy el <strong>Oráculo de Azeroth</strong>. Pregúntame por <strong>expansiones</strong>, <strong>facciones</strong>, <strong>razas y clases</strong>, <strong>Arthas, Illidan o Sylvanas</strong> o la <strong>cinemática</strong>. ¿Qué aventura buscas?"
    },
    {
      keys: ["gracias", "genial", "perfecto", "epico", "loco", "brutal"],
      reply: "¡Que la Luz te guíe y el honor te acompañe! ⚔️✨ Aquí estaré para otra incursión al lore."
    },
    {
      keys: ["thrall", "durotan", "jaina", "anduin", "bolvar", "alexstrasza", "xalatath"],
      reply:
        "🌟 Grandes héroes viven en Azeroth: <strong>Thrall</strong> (chamán que fundó la Nueva Horda), <strong>Jaina Valiente</strong> (archimaga de Kul Tiras), <strong>Anduin</strong> (rey de Ventormenta) y <strong>Alexstrasza</strong> (Reina Dragón). Cada uno marca una expansión. ¿Sobre quién quieres saber más?"
    }
  ];

  const FALLBACK =
    "Mmm, ese pergamino está en blanco 🤔. Prueba con: " +
    "<em>expansiones</em>, <em>Wrath of the Lich King</em>, <em>Legion</em>, <em>The War Within</em>, <em>Alianza vs Horda</em>, <em>razas y clases</em>, <em>Arthas</em>, <em>cinemática</em> o <em>juego memoria</em>.";

  const CHIPS = [
    "Expansiones",
    "Wrath of the Lich King",
    "Legion",
    "The War Within",
    "Alianza vs Horda",
    "Razas y clases",
    "Ver cinemática"
  ];

  /* ---------- Utilidades ---------- */
  const normalize = (s) =>
    s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  function answerFor(text) {
    const q = normalize(text);
    for (const rule of KB) {
      if (rule.keys.some((k) => q.includes(k))) return rule.reply;
    }
    return FALLBACK;
  }

  function addMessage(html, who) {
    const div = document.createElement("div");
    div.className = "chat-msg " + who;
    div.innerHTML = html;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }

  function botReply(text) {
    const typing = addMessage('<span class="typing"><i></i><i></i><i></i></span>', "bot");
    setTimeout(() => {
      typing.innerHTML = answerFor(text);
      messages.scrollTop = messages.scrollHeight;
    }, 560 + Math.random() * 460);
  }

  function send(text) {
    if (!text.trim()) return;
    addMessage(text.replace(/</g, "&lt;"), "user");
    botReply(text);
  }

  /* ---------- Chips ---------- */
  CHIPS.forEach((label) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    b.textContent = label;
    b.addEventListener("click", () => send(label));
    chipsBox.appendChild(b);
  });

  /* ---------- Abrir / cerrar ---------- */
  let greeted = false;
  function openChat() {
    win.hidden = false;
    fab.setAttribute("aria-expanded", "true");
    requestAnimationFrame(() => win.classList.add("open"));
    if (!greeted) {
      greeted = true;
      setTimeout(() => {
        addMessage(
          "¡Bienvenido, campeón! 🐉 Soy el <strong>Oráculo de Azeroth</strong>.<br>" +
          "Pregúntame por <strong>expansiones</strong>, <strong>Arthas/Illidan</strong>, <strong>facciones</strong> o la <strong>cinemática</strong>. " +
          "Toca una sugerencia aquí abajo.",
          "bot"
        );
      }, 360);
    }
    input.focus();
  }
  function closeChat() {
    win.classList.remove("open");
    fab.setAttribute("aria-expanded", "false");
    setTimeout(() => { win.hidden = true; }, 300);
  }

  fab.addEventListener("click", () => (win.hidden ? openChat() : closeChat()));
  closeBtn.addEventListener("click", closeChat);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    send(input.value);
    input.value = "";
  });
})();
