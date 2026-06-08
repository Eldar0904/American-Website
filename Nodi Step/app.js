/* ioT board landing — interactions */
(function () {
  'use strict';

  /* ---- Nav ---- */
  var nav = document.querySelector('.nav');
  var onScroll = function () {
    if (window.scrollY > 24) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var burger = document.querySelector('.nav__burger');
  if (burger) burger.addEventListener('click', function () { nav.classList.toggle('open'); });
  document.querySelectorAll('.nav__links a').forEach(function (a) {
    a.addEventListener('click', function () { nav.classList.remove('open'); });
  });

  /* ---- Reveal on scroll ---- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach(function (el, i) {
    el.style.transitionDelay = (Math.min(i % 4, 3) * 70) + 'ms';
    io.observe(el);
  });

  /* ---- Stat counters ---- */
  var counted = false;
  var statWrap = document.querySelector('.stats');
  function runCounters() {
    if (counted || !statWrap) return;
    counted = true;
    document.querySelectorAll('.stat b[data-count]').forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var suffix = el.getAttribute('data-suffix') || '';
      var dur = 1300, start = performance.now();
      function tick(now) {
        var p = Math.min((now - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        var val = Math.round(target * eased);
        el.textContent = val + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }
  if (statWrap) {
    var sio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) runCounters(); });
    }, { threshold: 0.4 });
    sio.observe(statWrap);
  }

  /* ---- Hotspots (tap toggle on touch) ---- */
  document.querySelectorAll('.hot button').forEach(function (b) {
    b.addEventListener('click', function (e) {
      e.preventDefault();
      var hot = b.closest('.hot');
      var open = hot.classList.contains('on');
      document.querySelectorAll('.hot.on').forEach(function (h) { h.classList.remove('on'); });
      if (!open) hot.classList.add('on');
    });
  });

  /* ---- Carousel ---- */
  var track = document.querySelector('.car__track');
  if (track) {
    var prev = document.querySelector('.car__btn--prev');
    var next = document.querySelector('.car__btn--next');
    var dotsWrap = document.querySelector('.car__dots');
    var items = Array.prototype.slice.call(track.children);
    var dots = items.map(function (_, i) {
      var d = document.createElement('button');
      d.className = 'car__dot' + (i === 0 ? ' on' : '');
      d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      d.addEventListener('click', function () { scrollToItem(i); });
      dotsWrap.appendChild(d);
      return d;
    });
    function current() {
      var c = track.scrollLeft + track.clientWidth / 2;
      var best = 0, bestD = Infinity;
      items.forEach(function (it, i) {
        var center = it.offsetLeft + it.clientWidth / 2;
        var dd = Math.abs(center - c);
        if (dd < bestD) { bestD = dd; best = i; }
      });
      return best;
    }
    function scrollToItem(i) {
      i = Math.max(0, Math.min(items.length - 1, i));
      var it = items[i];
      track.scrollTo({ left: it.offsetLeft - (track.clientWidth - it.clientWidth) / 2, behavior: 'smooth' });
    }
    function syncDots() {
      var c = current();
      dots.forEach(function (d, i) { d.classList.toggle('on', i === c); });
    }
    track.addEventListener('scroll', function () { window.requestAnimationFrame(syncDots); }, { passive: true });
    if (prev) prev.addEventListener('click', function () { scrollToItem(current() - 1); });
    if (next) next.addEventListener('click', function () { scrollToItem(current() + 1); });
  }

  /* ---- Tutorial cards open the lesson on YouTube (no on-page embeds) ---- */
  document.querySelectorAll('[data-video]').forEach(function (el) {
    el.addEventListener('click', function () {
      window.open('https://www.youtube.com/watch?v=' + el.getAttribute('data-video'), '_blank', 'noopener');
    });
  });

  /* ---- Tutorial thumbnails: maxres -> hq fallback ---- */
  document.querySelectorAll('img[data-yt]').forEach(function (img) {
    var id = img.getAttribute('data-yt');
    img.src = 'https://img.youtube.com/vi/' + id + '/maxresdefault.jpg';
    img.addEventListener('error', function () {
      if (img.src.indexOf('maxres') > -1) img.src = 'https://img.youtube.com/vi/' + id + '/hqdefault.jpg';
    });
  });

  /* ---- Tweaks application (called by the React panel; also sets defaults) ---- */
  window.applyTweaks = function (t) {
    var root = document.documentElement;
    if (!t) return;
    if (t.hero) root.setAttribute('data-hero', t.hero);
    if (t.accent) root.setAttribute('data-accent', t.accent);
    root.setAttribute('data-sparkles', t.sparkles ? 'on' : 'off');
    if (t.displayFont) root.style.setProperty('--font-display', t.displayFont);
  };
})();
