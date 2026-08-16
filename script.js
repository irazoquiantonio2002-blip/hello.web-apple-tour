/* ============================================================
   APPLE TOURS — script.js
   ============================================================ */
(function(){
  "use strict";

  /* ---------------- LOADER ---------------- */
  var loader = document.getElementById('loader');
  var ldFill = document.querySelector('.ld-fill');
  var ldParticles = document.getElementById('ldParticles');

  function spawnParticles(container, count, color){
    if(!container) return;
    for(var i=0;i<count;i++){
      var s = document.createElement('span');
      var left = Math.random()*100;
      var size = 3 + Math.random()*5;
      var dur = 4 + Math.random()*5;
      var delay = Math.random()*5;
      var dx = (Math.random()*80-40) + 'px';
      s.style.left = left+'%';
      s.style.width = size+'px';
      s.style.height = size+'px';
      s.style.setProperty('--dx', dx);
      s.style.animationDuration = dur+'s';
      s.style.animationDelay = delay+'s';
      if(color) s.style.background = color;
      container.appendChild(s);
    }
  }
  spawnParticles(ldParticles, 26);

  document.body.classList.add('lock');

  var progress = 0;
  var minTimeDone = false;
  var pageLoaded = false;

  var progressTimer = setInterval(function(){
    progress += (Math.random()*9)+3;
    if(progress > 96) progress = 96;
    if(ldFill) ldFill.style.width = progress + '%';
  }, 180);

  function tryFinish(){
    if(minTimeDone && pageLoaded){
      clearInterval(progressTimer);
      if(ldFill) ldFill.style.width = '100%';
      setTimeout(function(){
        loader.classList.add('hide');
        document.body.classList.remove('lock');
        document.body.classList.add('loaded');
      }, 380);
    }
  }

  // Transición de carga deliberadamente notoria: nunca instantánea.
  setTimeout(function(){ minTimeDone = true; tryFinish(); }, 2200);
  window.addEventListener('load', function(){ pageLoaded = true; tryFinish(); });
  setTimeout(function(){ pageLoaded = true; minTimeDone = true; tryFinish(); }, 6000);

  /* ---------------- NAV ---------------- */
  var nav = document.getElementById('nav');
  function onScrollNav(){
    if(window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScrollNav, {passive:true});
  onScrollNav();

  /* ---------------- MOBILE MENU ---------------- */
  var ham = document.getElementById('ham');
  var mob = document.getElementById('mob');
  var overlay = document.createElement('div');
  overlay.id = 'overlay';
  document.body.appendChild(overlay);

  function toggleMenu(open){
    var isOpen = typeof open === 'boolean' ? open : !mob.classList.contains('open');
    mob.classList.toggle('open', isOpen);
    overlay.classList.toggle('show', isOpen);
    ham.classList.toggle('open', isOpen);
    ham.setAttribute('aria-expanded', isOpen ? 'true':'false');
  }
  ham.addEventListener('click', function(){ toggleMenu(); });
  overlay.addEventListener('click', function(){ toggleMenu(false); });
  mob.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){ toggleMenu(false); });
  });

  /* ---------------- SCROLL REVEAL ---------------- */
  var revEls = document.querySelectorAll('.rev');
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revEls.forEach(function(el){ io.observe(el); });

  /* ---------------- HERO TYPEWRITER + COLOR CYCLE ---------------- */
  var accentWords = ['Cancún','Europa','el Caribe','Egipto','tu Destino Soñado'];
  var accentEl = document.getElementById('accentCycle');

  function typeCycle(){
    if(!accentEl) return;
    var wordIndex = 0;

    function typeWord(word, cb){
      var i = 0;
      accentEl.textContent = '';
      (function step(){
        if(i <= word.length){
          accentEl.textContent = word.slice(0, i);
          i++;
          setTimeout(step, 55);
        } else {
          setTimeout(cb, 1500);
        }
      })();
    }
    function eraseWord(cb){
      var text = accentEl.textContent;
      (function step(){
        if(text.length > 0){
          text = text.slice(0, -1);
          accentEl.textContent = text;
          setTimeout(step, 32);
        } else {
          setTimeout(cb, 220);
        }
      })();
    }
    function loop(){
      typeWord(accentWords[wordIndex], function(){
        eraseWord(function(){
          wordIndex = (wordIndex + 1) % accentWords.length;
          loop();
        });
      });
    }
    loop();
  }
  setTimeout(typeCycle, 1400);

  /* ---------------- PARTICLES CANVAS (HERO) ---------------- */
  var canvas = document.getElementById('pcanvas');
  if(canvas){
    var ctx = canvas.getContext('2d');
    var hero = document.getElementById('hero');
    var particles = [];
    var PCOUNT = window.innerWidth < 720 ? 34 : 64;

    function resizeCanvas(){
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    }
    function makeParticle(){
      return {
        x: Math.random()*canvas.width,
        y: Math.random()*canvas.height,
        r: 1 + Math.random()*2.2,
        vx: (Math.random()-0.5)*0.28,
        vy: -0.15 - Math.random()*0.35,
        o: 0.15 + Math.random()*0.45,
        c: Math.random() > 0.55 ? '255,145,66' : '255,255,255'
      };
    }
    function initParticles(){
      particles = [];
      for(var i=0;i<PCOUNT;i++) particles.push(makeParticle());
    }
    function tick(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      particles.forEach(function(p){
        p.x += p.vx; p.y += p.vy;
        if(p.y < -10){ p.y = canvas.height+10; p.x = Math.random()*canvas.width; }
        if(p.x < -10) p.x = canvas.width+10;
        if(p.x > canvas.width+10) p.x = -10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fillStyle = 'rgba('+p.c+','+p.o+')';
        ctx.fill();
      });
      requestAnimationFrame(tick);
    }
    resizeCanvas();
    initParticles();
    tick();
    window.addEventListener('resize', function(){
      resizeCanvas();
      PCOUNT = window.innerWidth < 720 ? 34 : 64;
      initParticles();
    });
  }

  /* ---------------- PARTICLES (WHY SECTION, CSS-based) ---------------- */
  spawnParticles(document.getElementById('whyParticles'), 22, 'rgba(0,145,234,.55)');

  /* ---------------- PARALLAX (translate on scroll) ---------------- */
  var parallaxTargets = [
    { el: document.getElementById('heroParallax'), factor: 0.18 },
    { el: document.getElementById('whyParallax'), factor: 0.14 }
  ].filter(function(t){ return !!t.el; });

  var ticking = false;
  function updateParallax(){
    parallaxTargets.forEach(function(t){
      var rect = t.el.parentElement.getBoundingClientRect();
      var offset = rect.top * t.factor;
      t.el.style.transform = 'translateY(' + offset.toFixed(1) + 'px) scale(1.15)';
    });
    ticking = false;
  }
  window.addEventListener('scroll', function(){
    if(!ticking){
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, {passive:true});
  updateParallax();

  /* ---------------- ANIMATED COUNTERS ---------------- */
  function animateCount(el){
    var target = parseFloat(el.getAttribute('data-count') || el.getAttribute('data-hero-count'));
    if(isNaN(target)) return;
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var dur = 1600;
    var start = null;

    function step(ts){
      if(start === null) start = ts;
      var p = Math.min((ts - start)/dur, 1);
      var eased = 1 - Math.pow(1-p, 3);
      var val = Math.round(target * eased);
      el.textContent = prefix + val + suffix;
      if(p < 1) requestAnimationFrame(step);
      else el.textContent = prefix + target + suffix;
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll('[data-count], [data-hero-count]');
  var cio = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        animateCount(entry.target);
        cio.unobserve(entry.target);
      }
    });
  }, { threshold:0.5 });
  counters.forEach(function(el){ cio.observe(el); });

  /* ---------------- CONTACT FORM -> WHATSAPP ---------------- */
  var form = document.getElementById('cForm');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      if(!form.checkValidity()){
        form.reportValidity();
        return;
      }
      var data = new FormData(form);
      var nombre = (data.get('nombre')||'').toString().trim();
      var telefono = (data.get('telefono')||'').toString().trim();
      var destino = (data.get('destino')||'').toString().trim();
      var personas = (data.get('personas')||'').toString().trim();
      var fecha = (data.get('fecha')||'').toString().trim();
      var tipo = (data.get('tipo')||'').toString().trim();
      var mensaje = (data.get('mensaje')||'').toString().trim();

      var lines = [
        'Hola Apple Tours Las Tijeras, quiero cotizar un viaje:',
        'Nombre: ' + nombre,
        'Teléfono: ' + telefono,
        'Destino deseado: ' + destino,
        'Número de personas: ' + personas,
        fecha ? ('Fecha aproximada: ' + fecha) : null,
        'Tipo de viaje: ' + tipo,
        mensaje ? ('Comentarios: ' + mensaje) : null
      ].filter(Boolean);

      var text = encodeURIComponent(lines.join('\n'));
      var url = 'https://wa.me/524431299779?text=' + text;
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  }

})();
