/**
 * watermark-protection.js — JP Producciones
 * Protección de imágenes: bloqueo de descarga directa + marca de agua en canvas
 *
 * Uso:
 *   JP_Protection.applyWatermark(imgElement, callback)
 *   → callback recibe un <canvas> con la marca de agua dibujada
 */

(function () {
  'use strict';

  const WM_TEXT   = '© JP Producciones';
  const WM_DOMAIN = 'jpproducciones.com.ar';

  /* ── 1. Bloquear menú contextual sobre imágenes ─────────── */
  document.addEventListener('contextmenu', function (e) {
    const target = e.target;
    if (
      target.tagName === 'IMG' ||
      target.tagName === 'VIDEO' ||
      target.tagName === 'CANVAS' ||
      target.closest(
        '.m-item, .pf-item, .insta-item, .swiper-slide,' +
        '.drone-item__player, .about-img-wrap, .lightbox,' +
        '#lightbox, .video-wrap'
      )
    ) {
      e.preventDefault();
      return false;
    }
  });

  /* ── 2. Bloquear arrastre de imágenes ───────────────────── */
  document.addEventListener('dragstart', function (e) {
    if (e.target.tagName === 'IMG' || e.target.tagName === 'CANVAS') {
      e.preventDefault();
      return false;
    }
  });

  /* ── 3. Deshabilitar selección de texto sobre imágenes ───── */
  document.addEventListener('selectstart', function (e) {
    if (e.target.tagName === 'IMG') {
      e.preventDefault();
    }
  });

  /* ── 4. Agregar escudos invisibles sobre items de galería ── */
  function addImageShields() {
    const wraps = document.querySelectorAll(
      '.pf-item, .insta-item, .about-img-wrap'
    );
    wraps.forEach(function (wrap) {
      if (wrap.querySelector('.img-shield')) return;
      const shield = document.createElement('div');
      shield.className = 'img-shield';
      shield.setAttribute('aria-hidden', 'true');
      wrap.appendChild(shield);
    });
  }

  /* ── 5. Función principal: dibuja imagen + marca de agua ── */
  function applyWatermark(imgSourceOrElement, callback) {
    const src =
      typeof imgSourceOrElement === 'string'
        ? imgSourceOrElement
        : imgSourceOrElement.src || imgSourceOrElement.currentSrc || '';

    if (!src) { callback(null); return; }

    const image = new Image();
    image.crossOrigin = 'anonymous';

    image.onload = function () {
      const canvas = document.createElement('canvas');
      const ctx    = canvas.getContext('2d');

      /* Resolución máx 1600 para no agotar memoria */
      const MAX = 1600;
      const ratio = Math.min(1, MAX / Math.max(image.naturalWidth || image.width, image.naturalHeight || image.height));
      canvas.width  = (image.naturalWidth  || image.width)  * ratio;
      canvas.height = (image.naturalHeight || image.height) * ratio;

      /* Dibujar imagen base */
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      /* ── Marcas de agua en mosaico diagonal ── */
      const fsTile = Math.max(canvas.width * 0.038, 16);
      ctx.save();
      ctx.font        = `italic ${fsTile}px 'Playfair Display', Georgia, serif`;
      ctx.fillStyle   = 'rgba(255,255,255,0.28)';
      ctx.textAlign   = 'center';
      ctx.textBaseline = 'middle';
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(-Math.PI / 5.5);

      const gapY = Math.max(canvas.height * 0.2, 75);
      const gapX = Math.max(canvas.width  * 0.45, 190);

      for (let y = -canvas.height * 1.6; y < canvas.height * 1.6; y += gapY) {
        for (let x = -canvas.width * 1.6; x < canvas.width * 1.6; x += gapX) {
          ctx.fillText(WM_TEXT, x, y);
        }
      }
      ctx.restore();

      /* ── Copyright en esquina inferior derecha ── */
      const fsFooter = Math.max(canvas.width * 0.02, 12);
      ctx.font          = `500 ${fsFooter}px 'Outfit', system-ui, sans-serif`;
      ctx.fillStyle     = 'rgba(255,255,255,0.75)';
      ctx.shadowColor   = 'rgba(0,0,0,0.7)';
      ctx.shadowBlur    = 5;
      ctx.textAlign     = 'right';
      ctx.textBaseline  = 'bottom';
      ctx.fillText(
        WM_TEXT + ' \u00B7 ' + WM_DOMAIN,
        canvas.width - 14,
        canvas.height - 10
      );
      ctx.shadowBlur = 0;

      callback(canvas);
    };

    image.onerror = function () {
      /* Si no puede cargar (ej: CORS), devuelve null */
      callback(null);
    };

    /* Pequeño trick para ayudar con caché / CORS */
    const sep = src.includes('?') ? '&' : '?';
    image.src = src + sep + '_wm=' + Date.now();
  }

  /* ── INIT ───────────────────────────────────────────────── */
  function init() {
    addImageShields();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* Exponer API pública */
  window.JP_Protection = { applyWatermark: applyWatermark };

})();
