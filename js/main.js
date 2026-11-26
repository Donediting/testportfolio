(function () {
  'use strict';
  var S = window.SITE;
  var $ = function (q, r) { return (r || document).querySelector(q); };
  var $$ = function (q, r) { return Array.prototype.slice.call((r || document).querySelectorAll(q)); };
  var esc = function (v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var PLAY = '<span class="play"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg></span>';
  var STAR = '<path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>';
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  /* ---------- Liens de contact ---------- */
  var c = S.contact;
  $$('.js-whatsapp').forEach(function (a) { a.href = 'https://wa.me/' + c.whatsappNumero; });
  $$('.js-whatsapp-text').forEach(function (e) { e.textContent = c.whatsappAffiche; });
  $$('.js-mailto').forEach(function (a) { a.href = 'mailto:' + c.email; });
  $$('.js-email-text').forEach(function (e) { e.textContent = c.email; });
  $$('.js-comeup').forEach(function (a) { a.href = c.comeupService; });
  $$('.js-comeup-profil').forEach(function (a) { a.href = c.comeupProfil; });
  $$('.js-instagram').forEach(function (a) { a.href = c.instagram; });
  $$('.js-linkedin').forEach(function (a) { a.href = c.linkedin; });
  $$('.js-year').forEach(function (e) { e.textContent = new Date().getFullYear(); });

  var copy = $('.js-copy');
  copy.addEventListener('click', function () {
    var ok = function () { copy.textContent = 'Copié !'; setTimeout(function () { copy.textContent = 'Copier'; }, 1800); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(c.email).then(ok, function () { copy.textContent = 'Sélectionnez l’adresse'; });
    }
  });

  /* ---------- Vidéo de l'accueil ----------
     - démarre seule, AVEC le son si le navigateur l'autorise ;
     - sinon (la plupart des navigateurs bloquent le son sans action du visiteur),
       elle démarre sans le son et le son s'active au premier clic / toucher ;
     - commandes natives : plein écran, volume, pause… ;
     - pause quand la vidéo sort de l'écran, reprise quand on revient. */
  var video = $('.js-showreel');
  var soundBtn = $('.js-sound');
  video.src = S.showreel.fichier;
  if (S.showreel.affiche) video.poster = S.showreel.affiche;
  var userPaused = false;
  var syncBtn = function () {
    soundBtn.hidden = !video.muted;
    soundBtn.setAttribute('aria-pressed', String(!video.muted));
  };
  var play = function () { var p = video.play(); return p && p.then ? p : Promise.resolve(); };
  // Le visiteur active le son : la vidéo repart du début, AVEC le son, pour qu'il ne rate rien.
  var unmute = function () {
    video.currentTime = 0;
    video.muted = false; video.volume = video.volume || 1;
    play().catch(function () {}); syncBtn();
  };
  if (!reduceMotion) {
    video.muted = false;
    play().then(syncBtn).catch(function () {
      // son bloqué par le navigateur : aperçu sans le son + grand bouton pour écouter depuis le début
      video.muted = true; syncBtn();
      play().catch(function () {});
    });
  } else { video.muted = true; syncBtn(); }
  soundBtn.addEventListener('click', function (e) { e.stopPropagation(); unmute(); });
  video.addEventListener('volumechange', syncBtn);
  video.addEventListener('pause', function () { if (video.dataset.auto !== '1') userPaused = true; video.dataset.auto = ''; });
  video.addEventListener('play', function () { userPaused = false; });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var inFullscreen = document.fullscreenElement || document.webkitFullscreenElement;
        if (inFullscreen) return;
        if (e.intersectionRatio >= 0.5) { if (!userPaused && !reduceMotion) play().catch(function () {}); }
        else if (!video.paused) { video.dataset.auto = '1'; video.pause(); }
      });
    }, { threshold: [0, 0.5, 1] }).observe(video);
  }

  /* ---------- Avis ---------- */
  var avisBox = $('.js-avis');
  var leave = '<a class="btn" href="' + esc(c.formulaireAvis) + '" target="_blank" rel="noopener">Laissez votre avis</a>';
  if (!S.avis.length) {
    avisBox.innerHTML = '<div class="card empty reveal"><div><strong>Les premiers avis arrivent bientôt.</strong><p class="muted">Vous avez travaillé avec moi ? Votre retour m’aide beaucoup.</p></div>' + leave + '</div>';
  } else {
    avisBox.innerHTML = '<div class="reviews">' + S.avis.map(function (a) {
      var stars = '';
      for (var i = 1; i <= 5; i++) stars += '<svg viewBox="0 0 24 24"' + (i > (a.note || 5) ? ' class="off"' : '') + '>' + STAR + '</svg>';
      var ini = (a.nom || '').replace(/[^A-Za-zÀ-ÿ]/g, '').charAt(0).toUpperCase() || '?';
      return '<article class="card review reveal"><div><span class="stars" role="img" aria-label="Note : ' + (a.note || 5) + ' sur 5">' + stars + '</span>' +
        '<p style="margin-top:14px">' + esc(a.texte) + '</p></div>' +
        '<div class="who"><span class="avatar" aria-hidden="true">' + esc(ini) + '</span><div><strong>' + esc(a.nom) + '</strong><small>' + esc(a.role) + '</small></div></div></article>';
    }).join('') + '</div><div class="reviews-cta reveal">' + leave + '</div>';
  }

  /* ---------- Portfolio ---------- */
  var card = function (v, tall) {
    var thumb = 'https://i.ytimg.com/vi/' + encodeURIComponent(v.id) + (tall ? '/oar2.jpg' : '/hqdefault.jpg');
    var fb = 'https://i.ytimg.com/vi/' + encodeURIComponent(v.id) + '/hqdefault.jpg';
    return '<article class="video reveal"><div class="video__frame">' +
      '<button type="button" class="video__play" data-id="' + esc(v.id) + '" aria-label="Lire : ' + esc(v.titre) + '">' +
      '<img src="' + thumb + '" data-fb="' + fb + '" alt="" loading="lazy">' + PLAY + '</button>' +
      (v.badge ? '<span class="badge">' + esc(v.badge) + '</span>' : '') + '</div>' +
      (v.client ? '<span class="video__client">' + esc(v.client) + '</span>' : '') +
      '<span class="video__title">' + esc(v.titre) + '</span></article>';
  };
  var pf = $('.js-portfolio');
  pf.innerHTML = S.portfolio.map(function (g, gi) {
    var tall = g.format === 'vertical';
    return '<div class="group"><h3 class="reveal">' + esc(g.titre) + '</h3>' +
      '<div class="grid ' + (tall ? 'grid--tall' : 'grid--wide') + '" data-g="' + gi + '">' +
      g.videos.map(function (v, i) { var h = card(v, tall); return i >= g.visibles ? h.replace('<article class="video reveal">', '<article class="video reveal is-in" hidden>') : h; }).join('') +
      '</div>' + (g.videos.length > g.visibles ? '<div class="more"><button type="button" class="btn btn--ghost js-more" data-g="' + gi + '">Voir plus de vidéos</button></div>' : '') + '</div>';
  }).join('');

  $$('.video__play img').forEach(function (img) {
    img.addEventListener('error', function () {
      if (img.dataset.fb && img.src !== img.dataset.fb) img.src = img.dataset.fb; else img.style.display = 'none';
    });
  });

  /* Lecteur personnalisé (Plyr) chargé seulement au premier clic sur une vidéo */
  var players = [];
  var plyrState = 0, plyrQueue = [];
  var loadPlyr = function (cb) {
    if (plyrState === 2) return cb();
    plyrQueue.push(cb);
    if (plyrState === 1) return;
    plyrState = 1;
    var css = document.createElement('link'); css.rel = 'stylesheet'; css.href = 'vendor/plyr/plyr.css';
    document.head.appendChild(css);
    var js = document.createElement('script'); js.src = 'vendor/plyr/plyr.min.js';
    js.onload = function () { plyrState = 2; plyrQueue.splice(0).forEach(function (f) { f(); }); };
    js.onerror = function () { plyrState = 0; plyrQueue.splice(0); window.__plyrFailed = true; $$('.is-player .js-yt').forEach(function (el) { var vid = el.getAttribute('data-plyr-embed-id'); el.outerHTML = '<iframe src="https://www.youtube.com/embed/' + vid + '?autoplay=1&rel=0&playsinline=1&origin=' + encodeURIComponent(location.origin) + '" title="Vidéo YouTube" referrerpolicy="strict-origin-when-cross-origin" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>'; }); };
    document.head.appendChild(js);
  };

  document.addEventListener('click', function (e) {
    var play = e.target.closest('.video__play');
    if (play) {
      var id = encodeURIComponent(play.dataset.id);
      // YouTube refuse la lecture intégrée (erreur 153) quand la page n'a pas d'adresse web réelle
      // (fichier ouvert en local, aperçu protégé). Dans ce cas, on propose d'ouvrir la vidéo sur YouTube.
      var framed = false; try { framed = window.self !== window.top; } catch (err) { framed = true; }
      var canEmbed = !framed && /^https?:$/.test(location.protocol) && location.origin && location.origin !== 'null';
      if (canEmbed) {
        var frame = play.parentNode;
        var tall = !!frame.closest('.grid--tall');
        frame.classList.add('is-player');
        frame.innerHTML = '<div class="js-yt" data-plyr-provider="youtube" data-plyr-embed-id="' + id + '"></div>';
        loadPlyr(function () {
          var p = new window.Plyr(frame.querySelector('.js-yt'), {
            autoplay: true,
            ratio: tall ? '9:16' : '16:9',
            iconUrl: 'vendor/plyr/plyr.svg',
            controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
            settings: [],
            fullscreen: { enabled: true, fallback: true, iosNative: false },
            tooltips: { controls: false, seek: false },
            i18n: { play: 'Lire', pause: 'Pause', mute: 'Couper le son', unmute: 'Activer le son', enterFullscreen: 'Plein écran', exitFullscreen: 'Quitter le plein écran' },
            youtube: { rel: 0, showinfo: 0, iv_load_policy: 3, modestbranding: 1, playsinline: 1, noCookie: false }
          });
          // Une seule vidéo à la fois
          p.on('play', function () { players.forEach(function (o) { if (o !== p) o.pause(); }); video.dataset.auto = '1'; video.pause(); });
          // Plein écran : la vidéo s'agrandit sur la page, sans quitter le portfolio
          p.on('enterfullscreen', function () { document.body.classList.add('is-fs'); });
          p.on('exitfullscreen', function () { document.body.classList.remove('is-fs'); });
          players.push(p);
        });
      } else {
        play.parentNode.insertAdjacentHTML('beforeend', '<a class="yt-out" href="https://www.youtube.com/watch?v=' + id + '" target="_blank" rel="noopener">Regarder sur YouTube ↗</a>');
        play.remove();
      }
      video.dataset.auto = '1'; video.pause();
      return;
    }
    var more = e.target.closest('.js-more');
    if (more) {
      var g = S.portfolio[+more.dataset.g];
      var grid = $('.grid[data-g="' + more.dataset.g + '"]');
      var open = more.getAttribute('aria-expanded') === 'true';
      $$('.video', grid).forEach(function (v, i) { v.hidden = open && i >= g.visibles; });
      more.setAttribute('aria-expanded', String(!open));
      more.textContent = open ? 'Voir plus de vidéos' : 'Voir moins';
    }
  });

  /* ---------- Motion design ---------- */
  var mo = $('.js-motion');
  mo.innerHTML = S.motion.length
    ? S.motion.map(function (v) { return card(v, false); }).join('')
    : [1, 2, 3].map(function (n) { return '<div class="placeholder reveal">' + PLAY + '<span>[Extrait motion design ' + n + ']</span></div>'; }).join('');

  /* ---------- À propos ---------- */
  $('.js-apropos-titre').textContent = S.aPropos.titre;
  $('.js-apropos-texte').textContent = S.aPropos.texte;
  $('.js-chiffre').textContent = S.aPropos.chiffre;
  $('.js-chiffre-label').textContent = S.aPropos.chiffreLabel;

  /* ---------- FAQ ---------- */
  var FAQ_VIS = 3;
  var faq = $('.js-faq');
  faq.innerHTML = S.faq.map(function (f, i) {
    return '<details class="reveal' + (i >= FAQ_VIS ? ' faq__hidden' : '') + '"><summary>' + esc(f.q) + '</summary><p>' + esc(f.r) + '</p></details>';
  }).join('');
  $$('details', faq).forEach(function (d) {
    d.addEventListener('toggle', function () { if (d.open) $$('details', faq).forEach(function (o) { if (o !== d) o.open = false; }); });
  });
  var ft = $('.js-faq-toggle');
  if (S.faq.length <= FAQ_VIS) ft.remove();
  else ft.addEventListener('click', function () {
    var open = ft.getAttribute('aria-expanded') === 'true';
    $$('details', faq).forEach(function (d, i) { if (i >= FAQ_VIS) { d.classList.toggle('faq__hidden', open); d.classList.add('is-in'); } });
    ft.setAttribute('aria-expanded', String(!open));
    ft.textContent = open ? 'Voir toutes les questions' : 'Voir moins';
  });

  /* ---------- Formulaire de devis → WhatsApp ---------- */
  var types = $('.js-types');
  S.typesVideo.forEach(function (t) { var o = document.createElement('option'); o.textContent = t; types.appendChild(o); });
  var form = $('.js-form');
  var status = $('.js-status');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var bad = [];
    ['nom', 'contact', 'type'].forEach(function (n) {
      var el = form.elements[n];
      var field = el.closest('.field');
      var empty = !String(el.value).trim();
      field.classList.toggle('is-invalid', empty);
      if (empty) bad.push(el);
    });
    if (bad.length) { bad[0].focus(); status.textContent = ''; return; }
    var v = function (n) { return String(form.elements[n].value).trim(); };
    var msg = 'Bonjour Dieudonné, je souhaite un devis.\n\n' +
      'Nom / entreprise : ' + v('nom') + '\n' +
      'Contact : ' + v('contact') + '\n' +
      'Type de vidéo : ' + v('type') + '\n' +
      (v('delai') ? 'Délai souhaité : ' + v('delai') + '\n' : '') +
      (v('budget') ? 'Budget : ' + v('budget') + '\n' : '') +
      (v('projet') ? '\nProjet :\n' + v('projet') : '');
    window.open('https://wa.me/' + c.whatsappNumero + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    status.textContent = 'Votre demande s’ouvre dans WhatsApp : il ne vous reste qu’à l’envoyer.';
  });
  $$('input, select', form).forEach(function (el) {
    el.addEventListener('input', function () { if (String(el.value).trim()) el.closest('.field') && el.closest('.field').classList.remove('is-invalid'); });
    el.addEventListener('change', function () { if (String(el.value).trim()) el.closest('.field') && el.closest('.field').classList.remove('is-invalid'); });
  });

  /* ---------- Apparitions au défilement (rapides et légères) ---------- */
  var reveals = $$('.reveal');
  // petit décalage entre éléments voisins
  reveals.forEach(function (el) {
    var sib = el.parentNode ? $$(':scope > .reveal', el.parentNode) : [];
    var i = sib.indexOf(el);
    if (i > 0) el.style.setProperty('--d', Math.min(i, 5) * 0.08 + 's');
  });
  var chart = $('.chart');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { if (!el.classList.contains('is-in')) io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
    chart.classList.add('is-in');
  }

  /* ---------- Menu mobile ---------- */
  var nav = $('.nav'), tg = $('.nav__toggle');
  tg.addEventListener('click', function () { var o = nav.classList.toggle('is-open'); tg.setAttribute('aria-expanded', String(o)); });
  $$('.nav__links a').forEach(function (a) { a.addEventListener('click', function () { nav.classList.remove('is-open'); tg.setAttribute('aria-expanded', 'false'); }); });
})();
