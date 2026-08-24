/* ============================================================
   JUEGO: MEMORIA DE AZEROTH
   Juego de parejas sobre las expansiones de WoW.
   Cada expansion tiene dos cartas: el TITULO y su ANO + LEMA.
   Animaciones: volteo 3D, sacudida al fallar,
   pulso al acertar y lluvia de dragones al ganar.
   ============================================================ */

(function memoryGame() {
  const board = document.getElementById("gameBoard");
  if (!board) return;

  const movesEl = document.getElementById("gameMoves");
  const pairsEl = document.getElementById("gamePairs");
  const timeEl = document.getElementById("gameTime");
  const winBox = document.getElementById("gameWin");
  const winText = document.getElementById("gameWinText");

  /* ---------- Datos: 6 expansiones = 12 cartas ---------- */
  const EXPANSIONES = [
    { id: "vanilla",  titulo: "World of Warcraft",       pista: "2004 · El Despertar" },
    { id: "tbc",      titulo: "The Burning Crusade",     pista: "2007 · You are not prepared!" },
    { id: "wotlk",    titulo: "Wrath of the Lich King",  pista: "2008 · El Rey Exanime" },
    { id: "cata",     titulo: "Cataclysm",               pista: "2010 · La Furia de Alamuerte" },
    { id: "legion",   titulo: "Legion",                  pista: "2016 · La Tumba de Sargeras" },
    { id: "dragon",   titulo: "Dragonflight",            pista: "2022 · El Vuelo de los Dragones" }
  ];

  let deck = [];
  let flipped = [];
  let matched = 0;
  let moves = 0;
  let lock = false;
  let timer = null, seconds = 0, started = false;

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function formatTime(s) {
    const m = Math.floor(s / 60);
    return m + ":" + String(s % 60).padStart(2, "0");
  }

  function startTimer() {
    if (started) return;
    started = true;
    timer = setInterval(() => {
      seconds++;
      timeEl.textContent = formatTime(seconds);
    }, 1000);
  }

  function buildDeck() {
    deck = [];
    EXPANSIONES.forEach((e) => {
      deck.push({ pair: e.id, face: e.titulo, kind: "titulo" });
      deck.push({ pair: e.id, face: e.pista,  kind: "pista"  });
    });
    shuffle(deck);
  }

  function render() {
    board.innerHTML = "";
    deck.forEach((card, i) => {
      const btn = document.createElement("button");
      btn.className = "mcard";
      btn.type = "button";
      btn.dataset.pair = card.pair;
      btn.dataset.index = i;
      btn.setAttribute("aria-label", "Carta oculta " + (i + 1));
      btn.style.animationDelay = (i * 45) + "ms";
      // Iconos tematicos por expansion para el reverso
      const icons = {
        vanilla: "🏰", tbc: "🔥", wotlk: "❄️", cata: "🌋", legion: "😈", dragon: "🐉"
      };
      const icon = "⚔️";
      btn.innerHTML =
        '<span class="mcard-inner">' +
        '  <span class="mcard-front" aria-hidden="true">' + icon + '</span>' +
        '  <span class="mcard-back ' + card.kind + '">' + card.face + "</span>" +
        "</span>";
      btn.addEventListener("click", () => flip(btn));
      board.appendChild(btn);
    });
  }

  function flip(cardEl) {
    if (lock || cardEl.classList.contains("is-flipped") || cardEl.classList.contains("is-matched")) return;

    startTimer();
    cardEl.classList.add("is-flipped");
    flipped.push(cardEl);

    if (flipped.length < 2) return;

    moves++;
    movesEl.textContent = moves;
    const [a, b] = flipped;

    if (a.dataset.pair === b.dataset.pair) {
      matched++;
      pairsEl.textContent = matched;
      a.classList.add("is-matched");
      b.classList.add("is-matched");
      flipped = [];
      if (matched === EXPANSIONES.length) setTimeout(win, 650);
    } else {
      lock = true;
      a.classList.add("shake");
      b.classList.add("shake");
      setTimeout(() => {
        a.classList.remove("is-flipped", "shake");
        b.classList.remove("is-flipped", "shake");
        flipped = [];
        lock = false;
      }, 900);
    }
  }

  function win() {
    clearInterval(timer);
    winText.textContent =
      "¡Forjaste la historia! Encontraste las 6 parejas en " + moves + " movimientos y " + formatTime(seconds) + ". ¡Por Azeroth!";
    winBox.hidden = false;
    requestAnimationFrame(() => winBox.classList.add("show"));
  }

  function reset() {
    clearInterval(timer);
    timer = null; seconds = 0; started = false;
    moves = 0; matched = 0; flipped = []; lock = false;
    movesEl.textContent = "0";
    pairsEl.textContent = "0";
    timeEl.textContent = "0:00";
    winBox.classList.remove("show");
    winBox.hidden = true;
    buildDeck();
    render();
  }

  document.getElementById("gameRestart").addEventListener("click", reset);
  document.getElementById("gamePlayAgain").addEventListener("click", reset);

  reset();
})();
