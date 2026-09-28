/* =========================================================
   HAPPY BIRTHDAY HONNEY
   Cinematic Birthday Website
   ========================================================= */

const scenes = document.querySelectorAll(".scene");
const buttons = document.querySelectorAll("[data-next]");
const birthdayMusic = new Audio("birthday.mp3");

birthdayMusic.loop = true;
birthdayMusic.volume = 0.55;

let currentScene = "intro";
let soundEnabled = true;

/* =========================================================
   SOUND EFFECTS
   Uses Web Audio API, so you don't need separate SFX files.
   ========================================================= */

let audioContext;

function initAudio() {
  if (!audioContext) {
    audioContext = new (
      window.AudioContext ||
      window.webkitAudioContext
    )();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
}

function tone(frequency, duration, type = "sine", volume = 0.08) {
  if (!soundEnabled) return;

  initAudio();

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = type;
  oscillator.frequency.value = frequency;

  gain.gain.setValueAtTime(volume, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(
    0.001,
    audioContext.currentTime + duration
  );

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);
}

function clickSound() {
  tone(520, 0.08, "sine", 0.06);
  setTimeout(() => tone(720, 0.08, "sine", 0.04), 45);
}

function successSound() {
  tone(523, .12, "sine", .06);
  setTimeout(() => tone(659, .12, "sine", .06), 100);
  setTimeout(() => tone(784, .18, "sine", .07), 200);
}

function errorSound() {
  tone(170, .18, "sawtooth", .04);
  setTimeout(() => tone(120, .22, "sawtooth", .035), 120);
}

function revealSound() {
  tone(392, .12, "sine", .05);
  setTimeout(() => tone(523, .12, "sine", .06), 100);
  setTimeout(() => tone(659, .16, "sine", .07), 200);
  setTimeout(() => tone(784, .25, "sine", .08), 300);
}

/* =========================================================
   SCENE SYSTEM
   ========================================================= */

function showScene(id) {
  scenes.forEach(scene => {
    scene.classList.remove("active");
  });

  const nextScene = document.getElementById(id);

  if (!nextScene) return;

  setTimeout(() => {
    nextScene.classList.add("active");
  }, 80);

  currentScene = id;

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

/* =========================================================
   START
   ========================================================= */

document.getElementById("openBtn").addEventListener("click", () => {
  initAudio();
  clickSound();

  birthdayMusic.play().catch(() => {
    console.log("Music waiting for browser permission.");
  });

  successSound();

  createConfetti(45);

  showScene("birthday");
});

/* =========================================================
   NORMAL NEXT BUTTONS
   ========================================================= */

buttons.forEach(button => {
  button.addEventListener("click", () => {
    const target = button.dataset.next;

    clickSound();

    if (target === "serious") {
      revealSound();
    }

    if (target === "finalLetter") {
      revealSound();
    }

    showScene(target);
  });
});

/* =========================================================
   JOKE LOADING SCREEN
   ========================================================= */

let jokeStarted = false;

function startJokeLoading() {
  if (jokeStarted) return;

  jokeStarted = true;

  const bar = document.getElementById("progressBar");
  const percent = document.getElementById("loadingPercent");
  const loadingText = document.getElementById("loadingText");
  const errorMessage = document.getElementById("errorMessage");

  let value = 0;

  const interval = setInterval(() => {
    value += Math.floor(Math.random() * 8) + 3;

    if (value >= 100) {
      value = 100;
      clearInterval(interval);

      bar.style.width = "100%";
      percent.textContent = "100%";

      setTimeout(() => {
        loadingText.classList.add("hidden");
        document.querySelector(".progress").classList.add("hidden");
        percent.classList.add("hidden");

        document.querySelector(".loading-icon").classList.add("hidden");

        errorMessage.classList.remove("hidden");

        errorSound();
      }, 600);

      return;
    }

    bar.style.width = value + "%";
    percent.textContent = value + "%";

    if (value > 70) {
      loadingText.textContent = "HALOS NA... AYAW SA PAGKULBA 😂";
    }
  }, 180);
}

/* Watch joke scene */

const jokeObserver = new MutationObserver(() => {
  const jokeScene = document.getElementById("joke");

  if (jokeScene.classList.contains("active")) {
    startJokeLoading();
  }
});

jokeObserver.observe(document.body, {
  attributes: true,
  subtree: true,
  attributeFilter: ["class"]
});

/* =========================================================
   RETRY BUTTON
   ========================================================= */

document.getElementById("retryBtn").addEventListener("click", () => {
  clickSound();

  setTimeout(() => {
    successSound();

    document.getElementById("errorMessage").classList.add("hidden");

    const jokeCard = document.querySelector(".joke-card");

    jokeCard.innerHTML = `
      <div style="font-size:65px;margin-bottom:20px;">😂</div>
      <h2 style="color:#d8b4fe;">OKAY, SERYOSO NA GYUD.</h2>
      <p>
        Wala na koy error-error.<br>
        Promise... murag. HAHAHA. 😭
      </p>
      <button class="main-btn" id="continueLetter">
        PADAYON SA LETTER 💌
      </button>
    `;

    document
      .getElementById("continueLetter")
      .addEventListener("click", () => {
        clickSound();
        showScene("letter");
        startLetter();
      });
  }, 300);
});

/* =========================================================
   LETTER TYPEWRITER
   ========================================================= */

const letterContent =
`Happy Birthday, Honney! 🎂💜

Karon imong adlaw, mao nga gusto nako nga bisan gamay, makahatag ko nimo og smile.

Dili ko maayo kaayo og paghimo og super fancy nga gifts, mao nga naghimo nalang ko og website. HAHAHA. 😂

Pero bisan naay mga jokes diri, seryoso ko sa akong gusto ipasabot.

Unta ma-enjoy nimo imong birthday. Unta makapahulay ka, makatawa ka, ug makalimot sa mga stress bisan kadali.

Ug kung naa kay wish karong birthday nimo...

AYAW KALIMOT PAG-WISH NAKO. 😂

Bitaw, Honney.

Enjoy your special day. ❤️`;

let letterStarted = false;

function startLetter() {
  if (letterStarted) return;

  letterStarted = true;

  const target = document.getElementById("letterText");
  const next = document.getElementById("letterNext");

  target.textContent = "";

  let index = 0;

  function type() {
    if (index < letterContent.length) {
      target.textContent += letterContent.charAt(index);
      index++;

      const delay =
        letterContent.charAt(index - 1) === "\n"
          ? 250
          : 28;

      setTimeout(type, delay);
    } else {
      next.classList.remove("hidden");
      successSound();
    }
  }

  type();
}

/* Start letter when scene becomes active */

const letterObserver = new MutationObserver(() => {
  const letter = document.getElementById("letter");

  if (letter.classList.contains("active")) {
    startLetter();
  }
});

letterObserver.observe(
  document.getElementById("letter"),
  {
    attributes: true,
    attributeFilter: ["class"]
  }
);

/* =========================================================
   QUIZ
   ========================================================= */

const answers = document.querySelectorAll(".answer");
const quizResult = document.getElementById("quizResult");
const quizNext = document.getElementById("quizNext");

answers.forEach(answer => {
  answer.addEventListener("click", () => {
    answers.forEach(item => {
      item.classList.remove("correct");
    });

    answer.classList.add("correct");

    clickSound();
    successSound();

    quizResult.innerHTML = `
      <strong>✅ SAKTO!</strong><br>
      Bisan unsa imong pili-on, ikaw ra gihapon. 😂💜
      <br><br>
      <span style="color:#aaa;">
      Grabe, bright lagi ka. HAHAHA.
      </span>
    `;

    quizNext.classList.remove("hidden");

    createConfetti(25);
  });
});

quizNext.addEventListener("click", () => {
  clickSound();
  showScene("serious");
});

/* =========================================================
   GIFT
   ========================================================= */

document.getElementById("giftBtn").addEventListener("click", () => {
  clickSound();
  revealSound();

  const gift = document.querySelector(".gift-box");
  const message = document.getElementById("giftMessage");

  gift.classList.add("hidden");
  message.classList.remove("hidden");

  createConfetti(100);
});

/* =========================================================
   RESTART
   ========================================================= */

document.getElementById("restartBtn").addEventListener("click", () => {
  clickSound();

  location.reload();
});

/* =========================================================
   CONFETTI
   ========================================================= */

function createConfetti(amount = 50) {
  const container = document.getElementById("confetti");

  for (let i = 0; i < amount; i++) {
    const piece = document.createElement("div");

    piece.className = "confetti-piece";

    piece.style.left = Math.random() * 100 + "%";
    piece.style.animationDelay = Math.random() * 1.5 + "s";
    piece.style.animationDuration =
      2 + Math.random() * 2 + "s";

    const size = 5 + Math.random() * 8;

    piece.style.width = size + "px";
    piece.style.height = size * 1.5 + "px";

    const colors = [
      "#d8b4fe",
      "#9d4edd",
      "#ffffff",
      "#c77dff",
      "#e0aaff"
    ];

    piece.style.background =
      colors[Math.floor(Math.random() * colors.length)];

    container.appendChild(piece);

    setTimeout(() => {
      piece.remove();
    }, 5000);
  }
}

/* =========================================================
   RANDOM LITTLE FLOATING HEARTS
   ========================================================= */

function createHeart() {
  const heart = document.createElement("div");

  heart.textContent = "💜";

  heart.style.position = "fixed";
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.bottom = "-30px";
  heart.style.fontSize = 12 + Math.random() * 15 + "px";
  heart.style.opacity = ".45";
  heart.style.pointerEvents = "none";
  heart.style.zIndex = "0";

  document.body.appendChild(heart);

  const duration = 5 + Math.random() * 5;

  heart.animate(
    [
      {
        transform: "translateY(0) scale(.8)",
        opacity: 0
      },
      {
        transform: "translateY(-45vh) scale(1)",
        opacity: .5
      },
      {
        transform: "translateY(-105vh) scale(.6)",
        opacity: 0
      }
    ],
    {
      duration: duration * 1000,
      easing: "ease-out"
    }
  );

  setTimeout(() => {
    heart.remove();
  }, duration * 1000);
}

setInterval(createHeart, 1800);

/* =========================================================
   KEYBOARD / ACCESSIBILITY
   ========================================================= */

document.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    const visibleButton = document.querySelector(
      ".scene.active .main-btn:not(.hidden)"
    );

    if (visibleButton) {
      visibleButton.click();
    }
  }
});

/* =========================================================
   PRELOAD IMAGE
   ========================================================= */

const photo = new Image();
photo.src = "honney.jpg";

/* =========================================================
   STARTUP
   ========================================================= */

console.log(
  "%cHappy Birthday, Honney! 💜",
  "font-size:24px;font-weight:bold;color:#d8b4fe;"
);

console.log(
  "Gihimo ni nga digital surprise para sa usa ka special nga tawo. 😂"
);
