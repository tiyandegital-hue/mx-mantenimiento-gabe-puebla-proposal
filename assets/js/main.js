/* Mantenimiento Gabe — interactions (demo site, no backend).
   Forms: client-side validation + honest success states.
   Slider: pointer + range input, keyboard accessible. */
(function () {
  "use strict";

  /* ---- mobile nav ---- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? "Cerrar ×" : "Menú ☰";
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.textContent = "Menú ☰";
      }
    });
  }

  /* ---- entrance reveals (restrained; rest state fully visible without JS) ---- */
  var rises = document.querySelectorAll(".rise");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("in"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    rises.forEach(function (el) { io.observe(el); });
  } else {
    rises.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- before / after slider ---- */
  document.querySelectorAll(".ba-slider").forEach(function (slider) {
    var range = slider.querySelector(".ba-range");
    var setPos = function (v) { slider.style.setProperty("--pos", v + "%"); };
    if (!range) return;
    range.addEventListener("input", function () { setPos(range.value); });
    setPos(range.value || 50);
  });

  /* ---- demo forms: validate, then show honest success state ---- */
  document.querySelectorAll("form[data-demo-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;
      form.querySelectorAll("[required]").forEach(function (field) {
        var wrap = field.closest(".field");
        var bad = false;
        if (field.type === "checkbox") { bad = !field.checked; }
        else if (field.tagName === "SELECT") { bad = !field.value; }
        else if (field.type === "email") { bad = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim()); }
        else if (field.type === "tel") { bad = field.value.replace(/\D/g, "").length < 10; }
        else { bad = !field.value.trim(); }
        if (wrap) wrap.classList.toggle("invalid", bad);
        if (bad) valid = false;
      });
      if (!valid) {
        var firstBad = form.querySelector(".field.invalid input, .field.invalid select, .field.invalid textarea");
        if (firstBad) firstBad.focus();
        return;
      }
      var success = document.getElementById(form.getAttribute("data-success"));
      form.style.display = "none";
      if (success) {
        success.classList.add("show");
        success.setAttribute("tabindex", "-1");
        success.focus();
      }
    });
    /* clear the error flag as the visitor fixes a field */
    form.addEventListener("input", function (e) {
      var wrap = e.target.closest(".field");
      if (wrap) wrap.classList.remove("invalid");
    });
  });

  /* ---- WhatsApp mock: typing indicator cycles once, then rests ---- */
  var typing = document.querySelector(".wa-typing");
  if (typing) {
    setTimeout(function () { typing.style.visibility = "hidden"; }, 9000);
  }

  /* ---- current year in footer (2026) ---- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = "2026";
  });
})();
