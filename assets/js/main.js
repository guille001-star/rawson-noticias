/* ════════════════════════════════════════════
   EL FARO DE RAWSON — interacciones y datos en vivo
   ════════════════════════════════════════════ */
(function () {
  'use strict';
  const $  = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);

  /* ── Fecha y hora en vivo (es-AR) ── */
  function actualizarFechaHora() {
    const ahora = new Date();
    const f = $('#fecha'), r = $('#reloj');
    if (f) f.textContent = ahora.toLocaleDateString('es-AR', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
    if (r) r.textContent = ahora.toLocaleTimeString('es-AR', { hour:'2-digit', minute:'2-digit' });
  }
  actualizarFechaHora();
  setInterval(actualizarFechaHora, 15000);
  const anio = $('#anio'); if (anio) anio.textContent = new Date().getFullYear();

  /* ── Clima real de Rawson (Open-Meteo, gratuita, sin clave) ── */
  const CODIGOS = {0:['Despejado','☀️'],1:['Mayormente despejado','🌤️'],2:['Parcialmente nublado','⛅'],3:['Nublado','☁️'],
    45:['Niebla','🌫️'],48:['Niebla','🌫️'],51:['Llovizna','🌦️'],53:['Llovizna','🌦️'],55:['Llovizna','🌧️'],
    61:['Lluvia','🌧️'],63:['Lluvia','🌧️'],65:['Lluvia intensa','🌧️'],71:['Nieve','🌨️'],73:['Nieve','🌨️'],75:['Nieve','🌨️'],
    80:['Chubascos','🌦️'],81:['Chubascos','🌧️'],82:['Chubascos','⛈️'],95:['Tormenta','⛈️'],96:['Tormenta','⛈️'],99:['Tormenta','⛈️']};
  async function cargarClima() {
    try {
      const r = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-43.30&longitude=-65.10&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto');
      if (!r.ok) throw new Error('clima no disponible');
      const d = await r.json(), c = d.current;
      const [txt, ico] = CODIGOS[c.weather_code] || ['—', '🌡️'];
      $('#clima-temp').textContent  = Math.round(c.temperature_2m) + '°C';
      $('#clima-desc').textContent  = txt + ' · Rawson';
      $('#clima-viento').textContent = 'Viento: ' + Math.round(c.wind_speed_10m) + ' km/h';
      $('#clima-icono').textContent = ico;
    } catch (e) { /* sin conexión: queda el estado base, no rompe nada */ }
  }
  cargarClima();

  /* ── Cotización del dólar en vivo (dolarapi, sin clave) ── */
  async function cargarDolar() {
    try {
      const [ofi, blue] = await Promise.all([
        fetch('https://dolarapi.com/v1/dolares/oficial').then(r => r.json()),
        fetch('https://dolarapi.com/v1/dolares/blue').then(r => r.json())
      ]);
      $('#dolar-oficial').textContent = '$' + Math.round(ofi.venta).toLocaleString('es-AR');
      $('#dolar-blue').textContent    = '$' + Math.round(blue.venta).toLocaleString('es-AR');
      $('#dolar').hidden = false;
    } catch (e) { /* si falla, la franja queda oculta */ }
  }
  cargarDolar();

  /* ── Cinta de último momento: duplicar contenido para loop infinito ── */
  const pista = $('#ticker-pista');
  if (pista) pista.innerHTML += pista.innerHTML;

  /* ── Aparición al hacer scroll ── */
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entradas => {
      entradas.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.12 });
    $$('.reveal').forEach(el => obs.observe(el));
  } else { $$('.reveal').forEach(el => el.classList.add('visible')); }

  /* ── Menú móvil ── */
  const btnMenu = $('#menu-btn'), links = $('#nav-links');
  if (btnMenu && links) {
    btnMenu.addEventListener('click', () => {
      const abierto = links.classList.toggle('abierto');
      btnMenu.setAttribute('aria-expanded', abierto);
    });
    links.addEventListener('click', e => { if (e.target.matches('a')) links.classList.remove('abierto'); });
  }

  /* ── Buscador (se expande; busca en Google dentro del dominio) ── */
  const btnBuscar = $('#btn-buscar'), formBuscar = $('#form-buscar');
  if (btnBuscar && formBuscar) {
    btnBuscar.addEventListener('click', () => {
      formBuscar.classList.toggle('abierto');
      if (formBuscar.classList.contains('abierto')) $('#input-buscar').focus();
    });
    formBuscar.addEventListener('submit', e => {
      e.preventDefault();
      const q = $('#input-buscar').value.trim();
      // ✏️ Reemplazá el dominio por el tuyo cuando publiques
      if (q) window.open('https://www.google.com/search?q=' + encodeURIComponent('site:elfaroderawson.com.ar ' + q), '_blank');
    });
  }

  /* ── Modo claro / oscuro ── */
  const btnTema = $('#btn-tema');
  function pintarIconoTema() {
    if (btnTema) btnTema.textContent = document.documentElement.dataset.tema === 'oscuro' ? '☀️' : '☾';
  }
  if (btnTema) {
    pintarIconoTema();
    btnTema.addEventListener('click', () => {
      const oscuro = document.documentElement.dataset.tema === 'oscuro';
      document.documentElement.dataset.tema = oscuro ? 'claro' : 'oscuro';
      localStorage.setItem('tema', oscuro ? 'claro' : 'oscuro');
      pintarIconoTema();
    });
  }

  /* ── Sombra en la barra de navegación + botón volver arriba ── */
  const nav = $('#nav'), volver = $('#volver-arriba');
  window.addEventListener('scroll', () => {
    if (nav) nav.classList.toggle('compacta', window.scrollY > 10);
    if (volver) volver.classList.toggle('visible', window.scrollY > 600);
  }, { passive: true });
  if (volver) volver.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ── Barra de progreso de lectura (página de artículo) ── */
  const progreso = $('#progreso');
  if (progreso) {
    window.addEventListener('scroll', () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      progreso.style.width = (total > 0 ? (window.scrollY / total) * 100 : 0) + '%';
    }, { passive: true });
  }

  /* ── Compartir: copiar enlace con confirmación ── */
  const btnCopiar = $('#btn-copiar');
  if (btnCopiar) {
    btnCopiar.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(location.href);
        btnCopiar.textContent = '✓ Copiado';
        setTimeout(() => btnCopiar.textContent = '🔗 Copiar enlace', 2000);
      } catch (e) { btnCopiar.textContent = 'No se pudo copiar'; }
    });
  }

  /* ── Newsletter (demo: conectar a Mailchimp/Brevo cuando exista) ── */
  const formBoletin = $('#form-boletin');
  if (formBoletin) {
    formBoletin.addEventListener('submit', e => {
      e.preventDefault();
      $('#boletin-msg').textContent = '¡Gracias! Tu suscripción quedó registrada (modo demo).';
      formBoletin.reset();
    });
  }

  /* ── Primera plana: dateline en vivo + parallax sutil ── */
  (function(){
    function pintarHero(){
      var a=new Date(), f=document.getElementById('hero-fecha'), r=document.getElementById('hero-reloj');
      if(f) f.textContent=a.toLocaleDateString('es-AR',{weekday:'long',day:'numeric',month:'long'});
      if(r) r.textContent=a.toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'});
    }
    pintarHero(); setInterval(pintarHero,15000);

    var fondo=document.getElementById('hero-fondo');
    var ok=fondo && window.matchMedia('(min-width:761px)').matches
          && !window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    if(ok){
      var ticking=false;
      window.addEventListener('scroll',function(){
        if(!ticking){ window.requestAnimationFrame(function(){
          var y=window.scrollY; if(y<window.innerHeight) fondo.style.transform='scale(1.06) translateY('+(y*0.12)+'px)';
          ticking=false;
        }); ticking=true; }
      },{passive:true});
    }
  })();
})();