/* Fans del Mate — landing minimalista · solo lo necesario */
(function () {
  "use strict";

  /* nav: fondo sutil al scrollear */
  var nav = document.getElementById("nav");
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("is-scrolled", window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  var isEmail = function (v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  };

  /* lista de espera */
  var waitForm = document.getElementById("waitForm");
  if (waitForm) {
    waitForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = document.getElementById("waitEmail");
      var hint = document.getElementById("waitHint");
      if (!isEmail(input.value.trim())) {
        input.classList.add("err");
        if (hint) hint.textContent = "Ingresá un correo válido para avisarte.";
        input.focus();
        return;
      }
      input.classList.remove("err");
      // ⚠️ Conectar a backend / Formspree / Mailchimp. Hoy guarda local.
      try {
        var list = JSON.parse(localStorage.getItem("fdm_waitlist") || "[]");
        list.push({ email: input.value.trim(), ts: Date.now() });
        localStorage.setItem("fdm_waitlist", JSON.stringify(list));
      } catch (err) {}
      waitForm.innerHTML = '<p class="form-ok">Listo. Te avisamos apenas abramos. Gracias por sumarte.</p>';
    });
    document.getElementById("waitEmail").addEventListener("input", function (e) {
      e.target.classList.remove("err");
    });
  }

  /* colaboradores */
  var colabForm = document.getElementById("colabForm");
  if (colabForm) {
    colabForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var nombre = colabForm.querySelector('[name="nombre"]');
      var email = colabForm.querySelector('[name="email"]');
      var hint = document.getElementById("colabHint");
      var ok = true;
      if (!nombre.value.trim()) { nombre.classList.add("err"); ok = false; } else nombre.classList.remove("err");
      if (!isEmail(email.value.trim())) { email.classList.add("err"); ok = false; } else email.classList.remove("err");
      if (!ok) { if (hint) hint.textContent = "Completá tu nombre y un correo válido."; return; }
      // ⚠️ Conectar a backend / correo.
      colabForm.innerHTML = '<p class="form-ok">¡Gracias! Recibimos tu mensaje y te escribimos a la brevedad.</p>';
    });
    colabForm.addEventListener("input", function (e) {
      if (e.target.classList) e.target.classList.remove("err");
    });
  }
})();
