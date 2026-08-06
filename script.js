/* ============================================================
   FANS DEL MATE — Landing · interacciones
   ============================================================ */
(function () {
  "use strict";
  var root = document.documentElement;
  root.classList.add("js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Modo estático (para capturas/preview): ?static muestra todo sin animar la entrada
  var STATIC = /[?&]static/.test(location.search);
  if (STATIC) {
    root.style.scrollBehavior = "auto";
    // Evita que 70vh se infle en capturas de página completa (headless de alto grande)
    var hi = document.querySelector(".hero__inner");
    if (hi) hi.style.minHeight = "0";
    var ym = location.search.match(/[?&]y=(\d+)/);
    if (ym) {
      var jump = function () { window.scrollTo(0, parseInt(ym[1], 10)); };
      jump();
      window.addEventListener("load", jump);
      requestAnimationFrame(jump);
    }
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll("[data-rev]");
  if (STATIC) {
    revealEls.forEach(function (el) {
      el.classList.add("reveal", "is-in");
    });
  } else if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            var el = e.target;
            var d = parseInt(el.getAttribute("data-rev-d") || "0", 10);
            setTimeout(function () {
              el.classList.add("is-in");
            }, d);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) {
      el.classList.add("reveal");
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("reveal", "is-in");
    });
  }

  /* ---------- Sticky nav state ---------- */
  var nav = document.getElementById("nav");
  var onScroll = function () {
    if (window.scrollY > 24) nav.classList.add("is-scrolled");
    else nav.classList.remove("is-scrolled");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  var setMenu = function (open) {
    links.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.querySelector("use").setAttribute("href", open ? "#i-x" : "#i-menu");
  };
  toggle.addEventListener("click", function () {
    setMenu(!links.classList.contains("open"));
  });
  links.addEventListener("click", function (e) {
    if (e.target.closest("a")) setMenu(false);
  });

  /* ---------- Animated counters ---------- */
  var counters = document.querySelectorAll(".count");
  var runCount = function (el) {
    var to = parseFloat(el.getAttribute("data-to"));
    var suf = el.getAttribute("data-suf") || "";
    if (reduceMotion) {
      el.textContent = to + suf;
      return;
    }
    var dur = 1400,
      start = null;
    var step = function (ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(to * eased) + suf;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = to + suf;
    };
    requestAnimationFrame(step);
  };
  if (STATIC) {
    counters.forEach(function (el) {
      el.textContent = el.getAttribute("data-to") + (el.getAttribute("data-suf") || "");
    });
  } else if ("IntersectionObserver" in window) {
    var cio = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            runCount(e.target);
            cio.unobserve(e.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach(function (el) {
      cio.observe(el);
    });
  } else {
    counters.forEach(runCount);
  }

  /* ---------- Sticky CTA (mobile) ---------- */
  var body = document.body;
  var hero = document.querySelector(".hero");
  var avisos = document.getElementById("avisos");
  var footer = document.querySelector(".footer");
  var inView = function (el) {
    if (!el) return false;
    var r = el.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    // "a la vista" cuando entra en el 85% inferior de la pantalla
    return r.top < vh * 0.85 && r.bottom > 0;
  };
  var updateSticky = function () {
    var pastHero = hero ? window.scrollY > hero.offsetHeight - 140 : window.scrollY > 500;
    var hideZone = inView(avisos) || inView(footer);
    body.classList.toggle("show-sticky", pastHero && !hideZone);
  };
  window.addEventListener("scroll", updateSticky, { passive: true });
  window.addEventListener("resize", updateSticky, { passive: true });
  updateSticky();

  /* ---------- Forms ---------- */
  var isEmail = function (v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  };

  /* Waitlist */
  var waitForm = document.getElementById("waitForm");
  if (waitForm) {
    waitForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = document.getElementById("waitEmail");
      var hint = document.getElementById("waitHint");
      if (!isEmail(input.value.trim())) {
        input.classList.add("err");
        hint.textContent = "Ingresá un correo válido para avisarte 🙂";
        input.focus();
        return;
      }
      input.classList.remove("err");
      // Guarda local (reemplazar por POST al backend / Formspree / Mailchimp)
      try {
        var list = JSON.parse(localStorage.getItem("fdm_waitlist") || "[]");
        list.push({ email: input.value.trim(), ts: Date.now() });
        localStorage.setItem("fdm_waitlist", JSON.stringify(list));
      } catch (err) {}
      waitForm.classList.add("ok");
      waitForm.querySelector(".signup__row").innerHTML =
        '<p class="signup-done">🧉 ¡Listo! Te avisamos apenas abramos la beta. Gracias por sumarte.</p>';
      hint.textContent = "Ya estás en la lista de espera.";
    });
    var we = document.getElementById("waitEmail");
    we.addEventListener("input", function () {
      we.classList.remove("err");
    });
  }

  /* Colaboradores */
  var colabForm = document.getElementById("colabForm");
  if (colabForm) {
    colabForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var nombre = colabForm.querySelector('[name="nombre"]');
      var email = colabForm.querySelector('[name="email"]');
      var hint = document.getElementById("colabHint");
      var ok = true;
      if (!nombre.value.trim()) {
        nombre.classList.add("err");
        ok = false;
      } else nombre.classList.remove("err");
      if (!isEmail(email.value.trim())) {
        email.classList.add("err");
        ok = false;
      } else email.classList.remove("err");
      if (!ok) {
        hint.textContent = "Completá tu nombre y un correo válido para contactarte.";
        return;
      }
      // Reemplazar por envío real al backend / correo
      colabForm.classList.add("ok");
      colabForm.innerHTML =
        '<div class="colab-done"><h3>¡Gracias! 🧉</h3><p>Recibimos tu mensaje. Te escribimos a la brevedad para sumar tu proyecto a la comunidad matera.</p></div>';
    });
    colabForm.addEventListener("input", function (e) {
      if (e.target.classList) e.target.classList.remove("err");
    });
  }

  /* ---------- Year (por si se quiere dinámico) ---------- */
})();
