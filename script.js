// ------- Word bank (anime titles) -------
const WORDS = [
  "naruto",
  "one piece",
  "attack on titan",
  "death note",
  "demon slayer",
  "jujutsu kaisen",
  "fullmetal alchemist",
  "my hero academia",
  "bleach",
  "dragon ball",
  "spy x family",
  "chainsaw man"
];

// ------- ASCII hangman stages -------
const STAGES = [
  `
   +---+
   |   |
       |
       |
       |
       |
  =========`,
  `
   +---+
   |   |
   O   |
       |
       |
       |
  =========`,
  `
   +---+
   |   |
   O   |
   |   |
       |
       |
  =========`,
  `
   +---+
   |   |
   O   |
  /|   |
       |
       |
  =========`,
  `
   +---+
   |   |
   O   |
  /|\\  |
       |
       |
  =========`,
  `
   +---+
   |   |
   O   |
  /|\\  |
  /    |
       |
  =========`,
  `
   +---+
   |   |
   O   |
  /|\\  |
  / \\  |
       |
  =========`
];

const wordEl = document.getElementById("word");
const stageEl = document.getElementById("hangman-stage");
const msgEl = document.getElementById("message");
const kbEl = document.getElementById("keyboard");
const resetBtn = document.getElementById("reset-btn");
const attemptsEl = document.getElementById("attempts");
const wrongLettersEl = document.getElementById("wrong-letters");

let selectedWord = "";
let display = [];
let wrongGuesses = 0;
let guessed = new Set();

function chooseWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function initDisplay(word) {
  // Underscore for letters, keep spaces/punctuation visible
  return [...word].map(ch => (/[a-z]/i.test(ch) ? "_" : ch));
}

function renderWord() {
  wordEl.innerHTML = "";
  display.forEach(ch => {
    const span = document.createElement("span");
    span.className = "letter" + (ch === " " ? " space" : "");
    span.textContent = ch;
    wordEl.appendChild(span);
  });
}

function renderStage() {
  stageEl.textContent = STAGES[wrongGuesses];
  attemptsEl.textContent = `Attempts: ${STAGES.length - 1 - wrongGuesses}`;
}

function renderWrongLetters() {
  const wrong = [...guessed].filter(l => !selectedWord.toLowerCase().includes(l));
  wrongLettersEl.textContent = wrong.length ? `Wrong: ${wrong.join(", ")}` : "";
}

function newGame() {
  selectedWord = chooseWord();
  display = initDisplay(selectedWord);
  wrongGuesses = 0;
  guessed = new Set();
  msgEl.textContent = "Guess the anime title!";
  buildKeyboard();
  renderWord();
  renderStage();
  renderWrongLetters();
}

function buildKeyboard() {
  kbEl.innerHTML = "";
  for (let i = 65; i <= 90; i++) {
    const letter = String.fromCharCode(i).toLowerCase();
    const btn = document.createElement("button");
    btn.className = "key";
    btn.dataset.letter = letter;
    btn.textContent = letter;
    btn.addEventListener("click", () => handleGuess(letter));
    kbEl.appendChild(btn);
  }
}

function disableLetter(letter) {
  const btn = kbEl.querySelector(`button[data-letter="${letter}"]`);
  if (btn) btn.disabled = true;
}

function disableAll() {
  kbEl.querySelectorAll("button").forEach(b => (b.disabled = true));
}

function handleGuess(letter) {
  if (guessed.has(letter)) return; // ignore repeats
  guessed.add(letter);
  disableLetter(letter);

  const lw = selectedWord.toLowerCase();
  if (lw.includes(letter)) {
    [...lw].forEach((ch, i) => {
      if (ch === letter) display[i] = selectedWord[i]; // keep original spacing/case
    });
    renderWord();

    if (!display.includes("_")) {
      msgEl.textContent = `🎉 You win! The word was: ${selectedWord}`;
      disableAll();
    }
  } else {
    wrongGuesses++;
    renderStage();
    renderWrongLetters();
    if (wrongGuesses >= STAGES.length - 1) {
      // Game over
      // Reveal the rest of the letters
      display = [...selectedWord];
      renderWord();
      msgEl.textContent = `💀 You lost! The word was: ${selectedWord}`;
      disableAll();
    }
  }
}

// Physical keyboard support
window.addEventListener("keydown", (e) => {
  const letter = e.key.toLowerCase();
  if (/^[a-z]$/.test(letter)) {
    handleGuess(letter);
  }
});

resetBtn.addEventListener("click", newGame);

// Start
newGame();
