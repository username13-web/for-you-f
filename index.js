(function () {
  "use strict";

  /* ============================================
     INJECT SVG HEART INTO YES BUTTON
     ============================================ */
  var btnYes = document.getElementById("btn-yes");
  btnYes.innerHTML =
    "Yes, I forgive you " +
    '<svg class="btn-yes-heart" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 ' +
    "2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 " +
    '19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';

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
      var currentOpacity = p.opacity * (0.5 + 0.5 * Math.sin(p.pulse));
      if (p.x < -10) p.x = ambientCanvas.width + 10;
      if (p.x > ambientCanvas.width + 10) p.x = -10;
      if (p.y < -10) p.y = ambientCanvas.height + 10;
      if (p.y > ambientCanvas.height + 10) p.y = -10;
      ambientCtx.beginPath();
      ambientCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ambientCtx.fillStyle = "rgba(201, 168, 108, " + currentOpacity + ")";
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

  var heartColors = ["#c47a6c", "#e8c4b8", "#c9a86c", "#dfc9a0", "#a85751"];

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
    if (heartsActive && Math.random() < 0.3) {
      spawnHearts(1);
    }
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
      var target = document.getElementById(sceneId);
      target.classList.add("active");
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
     SCENE 2: QUESTION ANIMATION
     ============================================ */
  function animateQuestionIn() {
    var items = [
      document.getElementById("q-pretext"),
      document.getElementById("q-main"),
      document.getElementById("q-sub"),
      document.getElementById("buttons-container"),
    ];
    for (var i = 0; i < items.length; i++) {
      (function (el, delay) {
        setTimeout(function () {
          el.style.transition = "opacity 0.8s ease, transform 0.8s ease";
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        }, delay);
      })(items[i], 300 + i * 400);
    }
  }

  /* ============================================
     NO BUTTON MECHANIC
     ============================================ */
  var noCount = 0;
  var btnNo = document.getElementById("btn-no");
  var noCounter = document.getElementById("no-counter");
  var buttonsContainer = document.getElementById("buttons-container");

  var noTexts = [
    "No",
    "Are you sure?",
    "Really?!",
    "Think again...",
    "Pretty please?",
    "I'll be sad...",
    "Don't do this",
    "My heart is breaking",
    "PLEASE",
    "I'm begging you",
    "okay fine...",
  ];

  var counterTexts = [
    "",
    "...really?",
    "you're being mean",
    "I'm literally pouting right now",
    "my heart just cracked a little",
    "okay that one hurt",
    "you know you want to forgive me",
    "resistance is futile",
    "the yes button is growing...",
    "last chance before takeover",
    "",
  ];

  function handleNo() {
    noCount++;

    if (noCount >= 10) {
      showScene("scene-takeover", animateTakeover);
      return;
    }

    btnNo.textContent = noTexts[Math.min(noCount, noTexts.length - 1)];

    var ct = counterTexts[Math.min(noCount, counterTexts.length - 1)];
    noCounter.textContent = ct;
    noCounter.style.opacity = ct ? "1" : "0";

    // YES grows
    var scale = 1 + noCount * 0.12;
    var padV = 18 + noCount * 3;
    var padH = 52 + noCount * 8;
    var fontSize = 1.15 + noCount * 0.06;
    btnYes.style.transform = "scale(" + scale + ")";
    btnYes.style.padding = padV + "px " + padH + "px";
    btnYes.style.fontSize = fontSize + "rem";
    btnYes.style.borderColor = "var(--gold)";
    btnYes.style.boxShadow =
      "0 0 " +
      noCount * 8 +
      "px rgba(201, 168, 108, " +
      (0.1 + noCount * 0.04) +
      ")";

    // NO shrinks
    btnNo.style.fontSize = Math.max(0.65, 1.05 - noCount * 0.05) + "rem";
    btnNo.style.opacity = "" + Math.max(0.25, 1 - noCount * 0.08);
    btnNo.style.padding =
      Math.max(8, 18 - noCount * 1.5) +
      "px " +
      Math.max(16, 52 - noCount * 5) +
      "px";

    // After 4 clicks dodge
    if (noCount >= 4) {
      btnNo.style.position = "absolute";
      var containerRect = buttonsContainer.getBoundingClientRect();
      var maxX = containerRect.width - 110;
      var maxY = 200;
      btnNo.style.left = Math.random() * maxX + "px";
      btnNo.style.top = Math.random() * maxY - 100 + "px";
      btnNo.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
    }

    // Shake
    btnNo.style.animation = "none";
    void btnNo.offsetHeight;
    btnNo.style.animation = "shake 0.4s ease";
  }

  btnNo.addEventListener("click", function (e) {
    e.stopPropagation();
    handleNo();
  });

  btnNo.addEventListener("mouseenter", function () {
    if (noCount >= 5) {
      var rect = buttonsContainer.getBoundingClientRect();
      var maxX = rect.width - 100;
      var maxY = 180;
      btnNo.style.left = Math.random() * maxX + "px";
      btnNo.style.top = Math.random() * maxY - 90 + "px";
    }
  });

  btnNo.addEventListener(
    "touchstart",
    function (e) {
      if (noCount >= 5) {
        e.preventDefault();
        var rect = buttonsContainer.getBoundingClientRect();
        var maxX = rect.width - 100;
        var maxY = 180;
        btnNo.style.left = Math.random() * maxX + "px";
        btnNo.style.top = Math.random() * maxY - 90 + "px";
        handleNo();
      }
    },
    { passive: false },
  );

  /* ============================================
     FORGIVENESS
     ============================================ */
  var forgivenessTriggered = false;

  function triggerForgiveness() {
    if (forgivenessTriggered) return;
    forgivenessTriggered = true;

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

  document
    .getElementById("takeover-btn")
    .addEventListener("click", function (e) {
      e.stopPropagation();
      triggerForgiveness();
    });

  document
    .getElementById("scene-takeover")
    .addEventListener("click", function (e) {
      if (e.target === this || e.target.closest(".takeover-content")) {
        triggerForgiveness();
      }
    });

  /* ============================================
     SCENE 3: TAKEOVER
     ============================================ */
  function animateTakeover() {
    var content = document.getElementById("takeover-content");
    setTimeout(function () {
      content.style.transition =
        "opacity 1s ease, transform 1s cubic-bezier(0.4, 0, 0.2, 1)";
      content.style.opacity = "1";
      content.style.transform = "scale(1)";
    }, 300);
  }

  /* ============================================
     SCENE 4: TRANSITION
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
     SCENE 5: MEMORIES
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
