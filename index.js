(function () {
  "use strict";

  /* ============================================
     AMBIENT PARTICLES
     ============================================ */
  var ambientCanvas = document.getElementById("ambient-canvas");
  var ambientCtx = ambientCanvas.getContext("2d");
  var particles = [];

  function resizeAmbient() {
    ambientCanvas.width = window.innerWidth;
    ambientCanvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    var count = Math.floor((window.innerWidth * window.innerHeight) / 15000);
    for (var i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * ambientCanvas.width,
        y: Math.random() * ambientCanvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.2 - 0.1,
        opacity: Math.random() * 0.3 + 0.05,
        pulse: Math.random() * Math.PI * 2,
      });
    }
  }

  function animateAmbient() {
    ambientCtx.clearRect(0, 0, ambientCanvas.width, ambientCanvas.height);
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.speedX;
      p.y += p.speedY;
      p.pulse += 0.01;
      var op = p.opacity * (0.5 + 0.5 * Math.sin(p.pulse));
      if (p.x < -10) p.x = ambientCanvas.width + 10;
      if (p.x > ambientCanvas.width + 10) p.x = -10;
      if (p.y < -10) p.y = ambientCanvas.height + 10;
      if (p.y > ambientCanvas.height + 10) p.y = -10;
      ambientCtx.beginPath();
      ambientCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ambientCtx.fillStyle = "rgba(201, 168, 108, " + op + ")";
      ambientCtx.fill();
    }
    requestAnimationFrame(animateAmbient);
  }

  resizeAmbient();
  createParticles();
  animateAmbient();
  window.addEventListener("resize", function () {
    resizeAmbient();
    createParticles();
  });

  /* ============================================
     HEARTS PARTICLE SYSTEM
     ============================================ */
  var heartsCanvas = document.getElementById("hearts-canvas");
  var heartsCtx = heartsCanvas.getContext("2d");
  var hearts = [];
  var heartsActive = false;
  var heartColors = ["#c47a6c", "#e8c4b8", "#c9a86c", "#dfc9a0", "#a85751"];

  function resizeHearts() {
    heartsCanvas.width = window.innerWidth;
    heartsCanvas.height = window.innerHeight;
  }
  resizeHearts();
  window.addEventListener("resize", resizeHearts);

  function drawHeart(ctx, x, y, size, rotation, opacity, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.scale(size, size);
    ctx.globalAlpha = opacity;
    ctx.beginPath();
    ctx.moveTo(0, -3);
    ctx.bezierCurveTo(-5, -10, -12, -5, -8, 2);
    ctx.bezierCurveTo(-5, 7, 0, 11, 0, 14);
    ctx.bezierCurveTo(0, 11, 5, 7, 8, 2);
    ctx.bezierCurveTo(12, -5, 5, -10, 0, -3);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  }

  function spawnHearts(count) {
    for (var i = 0; i < count; i++) {
      hearts.push({
        x: Math.random() * heartsCanvas.width,
        y: heartsCanvas.height + Math.random() * 100,
        size: Math.random() * 1.5 + 0.5,
        speedY: -(Math.random() * 2 + 0.5),
        speedX: (Math.random() - 0.5) * 1,
        rotation: (Math.random() - 0.5) * 0.5,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        opacity: Math.random() * 0.6 + 0.2,
        color: heartColors[Math.floor(Math.random() * heartColors.length)],
      });
    }
  }

  function animateHearts() {
    heartsCtx.clearRect(0, 0, heartsCanvas.width, heartsCanvas.height);
    var alive = [];
    for (var i = 0; i < hearts.length; i++) {
      var h = hearts[i];
      h.x += h.speedX;
      h.y += h.speedY;
      h.rotation += h.rotSpeed;
      h.opacity -= 0.002;
      if (h.opacity > 0 && h.y > -50) {
        drawHeart(heartsCtx, h.x, h.y, h.size, h.rotation, h.opacity, h.color);
        alive.push(h);
      }
    }
    hearts = alive;
    if (heartsActive && Math.random() < 0.3) spawnHearts(1);
    requestAnimationFrame(animateHearts);
  }
  animateHearts();

  function burstHearts(x, y, count) {
    for (var i = 0; i < count; i++) {
      var angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      var speed = Math.random() * 3 + 1;
      hearts.push({
        x: x,
        y: y,
        size: Math.random() * 1.5 + 0.5,
        speedY: Math.sin(angle) * speed - 1,
        speedX: Math.cos(angle) * speed,
        rotation: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.05,
        opacity: 0.8,
        color: heartColors[Math.floor(Math.random() * heartColors.length)],
      });
    }
  }

  /* ============================================
     SCENE MANAGEMENT
     ============================================ */
  function showScene(sceneId, callback) {
    var allScenes = document.querySelectorAll(".scene");
    for (var i = 0; i < allScenes.length; i++) {
      if (allScenes[i].classList.contains("active")) {
        allScenes[i].classList.add("fade-out");
        allScenes[i].classList.remove("active");
      }
    }
    setTimeout(function () {
      for (var j = 0; j < allScenes.length; j++) {
        allScenes[j].classList.remove("fade-out");
      }
      document.getElementById(sceneId).classList.add("active");
      if (callback) callback();
    }, 800);
  }

  /* ============================================
     SCENE 1: ENVELOPE
     ============================================ */
  var envelope = document.getElementById("envelope");
  var envelopeOpened = false;
  var envelopeHint = document.querySelector(".envelope-hint");

  document
    .getElementById("scene-envelope")
    .addEventListener("click", function () {
      if (envelopeOpened) {
        showScene("scene-question", animateQuestionIn);
        return;
      }
      envelopeOpened = true;
      envelope.classList.add("opened");
      envelopeHint.style.opacity = "0";
      setTimeout(function () {
        envelopeHint.textContent = "tap to continue";
        envelopeHint.style.opacity = "1";
      }, 1500);
    });

  /* ============================================
     SCENE 2: QUESTION ENTRANCE
     ============================================ */
  var btnYes = document.getElementById("btn-yes");
  var btnNo = document.getElementById("btn-no");
  var noMessage = document.getElementById("no-message");
  var buttonsArea = document.getElementById("buttons-area");
  var fadeTimer = null;

  function animateQuestionIn() {
    var main = document.getElementById("q-main");

    setTimeout(function () {
      main.style.transition = "opacity 0.8s ease, transform 0.8s ease";
      main.style.opacity = "1";
      main.style.transform = "translateY(0)";
    }, 300);

    setTimeout(function () {
      buttonsArea.style.transition = "opacity 0.8s ease, transform 0.8s ease";
      buttonsArea.style.opacity = "1";
      buttonsArea.style.transform = "translateY(0)";
    }, 900);
  }

  var mobileNoMessages = [
    "No",
    "Are you sure?",
    "Really sure?",
    "Think about it...",
    "Okay, one last thought?",
    "That answer feels suspicious",
    "Maybe try Yes?",
    "My heart says reconsider",
    "You pressed No again?",
    "I respect the confidence",
    "Interesting choice...",
    "The Yes button is right there",
    "I will keep asking",
    "Still no?",
    "This is becoming a tradition",
    "Nope, still no",
    "Not this time, huh?",
    "You are committed to this",
    "That is a very dramatic no",
    "I am detecting a pattern",
    "The suspense is unbearable",
    "That was a bold no",
    "The heart is still hopeful",
    "This is adorable but not effective",
    "No, no, no, no?",
    "Try the other button just once?",
    "No is a strong word",
    "Your finger keeps choosing No",
    "We are not done here",
    "I am taking notes",
    "That is not the answer I wanted",
    "This is a very cute refusal",
    "No really, are you sure?",
    "The Yes button is glowing",
    "I am still waiting",
    "Still not convinced?",
    "You can stop testing me",
    "The heart has feelings too",
    "This is turning into a game",
    "No button, meet persistence",
    "Nope. Again.",
    "A little more confidence, please",
    "I promise the Yes button is nicer",
    "The cheeky No is strong today",
    "This is not a final answer",
    "I can hear the suspense",
    "No is adorable, but hmm",
    "I am not offended, just curious",
    "You are making this too funny",
    "One more chance?",
    "That answer still counts as no",
    "The heart is doing a slow blink",
    "No, but with extra drama",
    "I believe in a second chance",
    "The button is still warm",
    "No is not the end of the story",
    "I will keep the door open",
    "The yes button is calling your name",
  ];

  var noResponses = [
    "I had a feeling you'd say that...",
    "I am not giving up that easily.",
    "You are making this very difficult.",
    "That is a bold choice.",
    "I will ask again in a moment.",
    "The button has opinions too.",
  ];

  function mobileNoResponse() {
    var messageIndex = Math.floor(Math.random() * noResponses.length);

    // Keep the No button stable
    btnNo.textContent = "No";

    // Show the response underneath
    noMessage.textContent = noResponses[messageIndex];
    noMessage.classList.add("visible");

    // Small animation on No
    btnNo.classList.remove("mobile-tapped");
    void btnNo.offsetWidth;
    btnNo.classList.add("mobile-tapped");

    if (fadeTimer) clearTimeout(fadeTimer);

    fadeTimer = setTimeout(function () {
      noMessage.classList.remove("visible");
    }, 1800);
  }

  btnNo.addEventListener("click", mobileNoResponse);

  /* ============================================
     YES → FORGIVENESS
     ============================================ */
  var forgivenessTriggered = false;

  function triggerForgiveness() {
    if (forgivenessTriggered) return;
    forgivenessTriggered = true;

    btnNo.style.opacity = "0";
    btnNo.style.pointerEvents = "none";
    noMessage.classList.remove("visible");

    heartsCanvas.classList.add("active");
    burstHearts(window.innerWidth / 2, window.innerHeight / 2, 30);
    startMusic();

    setTimeout(function () {
      showScene("scene-transition", animateTransition);
    }, 800);
  }

  btnYes.addEventListener("click", function (e) {
    e.stopPropagation();
    triggerForgiveness();
  });

  /* ============================================
     SCENE 3: TRANSITION
     ============================================ */
  function animateTransition() {
    var lines = document.querySelectorAll("#transition-text .line");
    var container = document.getElementById("transition-text");
    container.style.opacity = "1";

    for (var i = 0; i < lines.length; i++) {
      (function (line, delay) {
        setTimeout(function () {
          line.style.transition = "opacity 0.8s ease, transform 0.8s ease";
          line.style.opacity = "1";
          line.style.transform = "translateY(0)";
        }, delay);
      })(lines[i], 500 + i * 900);
    }

    heartsActive = true;
    spawnHearts(15);

    setTimeout(
      function () {
        heartsActive = false;
        showScene("scene-memories", animateMemories);
      },
      500 + lines.length * 900 + 1500,
    );
  }

  /* ============================================
     SCENE 4: MEMORIES
     ============================================ */
  function animateMemories() {
    var header = document.getElementById("memories-header");
    var scrollHint = document.getElementById("scroll-hint");
    var musicToggleEl = document.getElementById("music-toggle");

    musicToggleEl.classList.add("visible");

    setTimeout(function () {
      header.style.transition = "opacity 0.8s ease, transform 0.8s ease";
      header.style.opacity = "1";
      header.style.transform = "translateY(0)";
    }, 400);

    setTimeout(function () {
      scrollHint.classList.add("visible");
    }, 1500);

    var cards = document.querySelectorAll(".memory-card");
    var finale = document.getElementById("finale-section");
    var memoriesScene = document.getElementById("scene-memories");

    var observer = new IntersectionObserver(
      function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting) {
            entries[i].target.style.transition =
              "opacity 0.8s ease, transform 0.8s ease";
            entries[i].target.style.opacity = "1";
            entries[i].target.style.transform = "translateY(0)";
            observer.unobserve(entries[i].target);
          }
        }
      },
      { threshold: 0.15, root: memoriesScene },
    );

    for (var i = 0; i < cards.length; i++) {
      observer.observe(cards[i]);
    }
    observer.observe(finale);

    memoriesScene.addEventListener(
      "scroll",
      function () {
        if (memoriesScene.scrollTop > 50) {
          scrollHint.classList.remove("visible");
        }
      },
      { passive: true },
    );
  }

  /* ============================================
     MUSIC
     ============================================ */
  var audio = document.getElementById("bg-music");
  var musicToggle = document.getElementById("music-toggle");
  var musicPlaying = false;

  function startMusic() {
    audio.volume = 0;
    var playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(function () {
          musicPlaying = true;
          musicToggle.classList.add("playing");
          var vol = 0;
          var fadeIn = setInterval(function () {
            vol += 0.02;
            if (vol >= 0.7) {
              vol = 0.7;
              clearInterval(fadeIn);
            }
            audio.volume = vol;
          }, 50);
        })
        .catch(function () {
          musicToggle.classList.add("visible");
        });
    }
  }

  musicToggle.addEventListener("click", function (e) {
    e.stopPropagation();
    if (musicPlaying) {
      audio.pause();
      musicPlaying = false;
      musicToggle.classList.remove("playing");
    } else {
      audio.play().then(function () {
        audio.volume = 0.7;
        musicPlaying = true;
        musicToggle.classList.add("playing");
      });
    }
  });

  audio.addEventListener("ended", function () {
    musicPlaying = false;
    musicToggle.classList.remove("playing");
  });

  /* ============================================
     MISC
     ============================================ */
  document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
  });
})();
