/**
 * JUAN AMADEO — Fotografía de Bodas & Eventos
 * main.js — Core: Three.js · GSAP · Lenis · Cursor · Preloader · FAQ · Theme
 */

import * as THREE    from 'three';
import { gsap }      from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis         from 'lenis';

gsap.registerPlugin(ScrollTrigger);

/* ── Lenis smooth scroll ──────────────────────────────────── */
let lenis;

function initLenis() {
  lenis = new Lenis({
    duration: 1.3,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    smoothTouch: false
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ── Custom Cursor ────────────────────────────────────────── */
function initCursor() {
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    gsap.set(dot, { x: mx, y: my });
  });

  gsap.ticker.add(() => {
    rx += (mx - rx) * 0.1;
    ry += (my - ry) * 0.1;
    gsap.set(ring, { x: rx, y: ry });
  });

  const hoverEls = document.querySelectorAll(
    'a, button, .service-row, .pf-item, .m-item, .testimonial-card, .insta-item'
  );
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('expanded'));
    el.addEventListener('mouseleave', () => ring.classList.remove('expanded'));
  });
}

/* ── Theme Toggle (Dark / Light) ──────────────────────────── */
function initTheme() {
  const btn  = document.getElementById('theme-toggle');
  const root = document.documentElement;
  const ICON_DARK  = '☾';
  const ICON_LIGHT = '○';

  // Persist preference
  const saved = localStorage.getItem('ja-theme') || 'dark';
  root.setAttribute('data-theme', saved);
  if (btn) btn.textContent = saved === 'dark' ? ICON_DARK : ICON_LIGHT;

  btn?.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('ja-theme', next);
    btn.textContent = next === 'dark' ? ICON_DARK : ICON_LIGHT;

    // Update Three.js particle color
    if (window.__threeUpdateColor) window.__threeUpdateColor(next);
  });
}

/* ── Preloader ────────────────────────────────────────────── */
function initPreloader(onDone) {
  const el    = document.getElementById('preloader');
  if (!el) { onDone?.(); return; }

  const fill  = el.querySelector('.preloader__fill');
  const pct   = el.querySelector('.preloader__pct');
  let   p     = 0;

  const iv = setInterval(() => {
    p = Math.min(p + Math.random() * 4.5 + 0.5, 100);
    if (fill) fill.style.width = p + '%';
    if (pct)  pct.textContent  = Math.floor(p).toString().padStart(3, '0') + ' %';

    if (p >= 100) {
      clearInterval(iv);
      setTimeout(() => {
        gsap.to(el, {
          opacity: 0,
          duration: 0.7,
          ease: 'power2.inOut',
          onComplete: () => { el.style.display = 'none'; onDone?.(); }
        });
      }, 350);
    }
  }, 35);
}

/* ── Hero Entrance ────────────────────────────────────────── */
function animateHero() {
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

  tl.to('.hero__kicker',   { opacity: 1, y: 0, duration: 1 }, 0.1)
    .to('.hero__title .line', { y: '0%', stagger: 0.1, duration: 1.3 }, 0.3)
    .to('.hero__desc',     { opacity: 1, duration: 1 }, 0.7)
    .to('.hero__actions',  { opacity: 1, y: 0, duration: 0.9 }, 0.9)
    .to('.hero__scroll',   { opacity: 1, duration: 0.7 }, 1.2);
}

/* ── Scroll Reveal ────────────────────────────────────────── */
function initScrollReveal() {
  // Generic reveal
  document.querySelectorAll('.reveal').forEach((el, i) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: el.dataset.delay ? parseFloat(el.dataset.delay) : 0,
          ease: 'expo.out'
        });
        el.classList.add('visible');
      }
    });
  });

  // Stats counter
  document.querySelectorAll('.stat-number').forEach(el => {
    const target = parseInt(el.dataset.target || el.textContent, 10);
    const suffix = el.dataset.suffix || '';
    el.textContent = '0' + suffix;

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: target,
          duration: 2.2,
          ease: 'power2.out',
          onUpdate() { el.textContent = Math.floor(this.targets()[0].val) + suffix; }
        });
      }
    });
  });

  // Service rows stagger
  const rows = document.querySelectorAll('.service-row');
  if (rows.length) {
    gsap.from(rows, {
      opacity: 0, x: -24,
      stagger: 0.08,
      duration: 0.8,
      ease: 'expo.out',
      scrollTrigger: { trigger: '.services-list', start: 'top 80%' }
    });
  }

  // Portfolio items
  const pfItems = document.querySelectorAll('.pf-item');
  if (pfItems.length) {
    gsap.from(pfItems, {
      opacity: 0, scale: 0.96,
      stagger: 0.07,
      duration: 0.9,
      ease: 'expo.out',
      scrollTrigger: { trigger: '.portfolio-grid', start: 'top 80%' }
    });
  }

  // Process steps
  const steps = document.querySelectorAll('.process-step');
  if (steps.length) {
    gsap.from(steps, {
      opacity: 0, y: 30,
      stagger: 0.12,
      duration: 1,
      ease: 'expo.out',
      scrollTrigger: { trigger: '.process-steps', start: 'top 80%' }
    });
  }

  // Testimonial cards
  gsap.from('.testimonial-card', {
    opacity: 0, y: 40,
    stagger: 0.1,
    duration: 0.9,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.testimonials-grid', start: 'top 82%' }
  });

  // Pricing cards
  gsap.from('.pricing-card', {
    opacity: 0, y: 36,
    stagger: 0.12,
    duration: 0.9,
    ease: 'expo.out',
    scrollTrigger: { trigger: '.pricing-grid', start: 'top 82%' }
  });
}

/* ── Topbar scroll behavior ───────────────────────────────── */
function initTopbar() {
  const bar = document.getElementById('topbar');
  if (!bar) return;

  ScrollTrigger.create({
    start: 80,
    onEnter:      () => bar.classList.add('scrolled'),
    onLeaveBack:  () => bar.classList.remove('scrolled')
  });
}

/* ── Mobile Nav ───────────────────────────────────────────── */
function initMobileNav() {
  const hamburger  = document.querySelector('.hamburger');
  const mobileNav  = document.querySelector('.mobile-nav');
  if (!hamburger || !mobileNav) return;

  let open = false;
  hamburger.addEventListener('click', () => {
    open = !open;
    hamburger.classList.toggle('active', open);
    mobileNav.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    open = false;
    hamburger.classList.remove('active');
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  }));
}

/* ── FAQ Accordion ────────────────────────────────────────── */
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* ── Video overlay ────────────────────────────────────────── */
function initVideo() {
  const cover   = document.querySelector('.video-cover');
  const iframe  = document.querySelector('.video-wrap iframe');
  if (!cover || !iframe) return;

  cover.addEventListener('click', () => {
    const src = iframe.src;
    iframe.src = src.includes('autoplay=1') ? src : src + (src.includes('?') ? '&' : '?') + 'autoplay=1';
    gsap.to(cover, { opacity: 0, duration: 0.4, pointerEvents: 'none' });
  });
}

/* ── THREE.JS — Floating grain/particle field ─────────────── */
function initThree() {
  const canvas = document.getElementById('three-canvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 6;

  // Particle geometry
  const COUNT = 3200;
  const pos   = new Float32Array(COUNT * 3);
  const sizes = new Float32Array(COUNT);

  for (let i = 0; i < COUNT; i++) {
    pos[i * 3]     = (Math.random() - 0.5) * 18;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    sizes[i]        = Math.random();
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('aSize',    new THREE.BufferAttribute(sizes, 1));

  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime:  { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uColor: { value: new THREE.Color(0xffffff) },
      uPR:    { value: renderer.getPixelRatio() }
    },
    vertexShader: `
      attribute float aSize;
      uniform float uTime;
      uniform vec2  uMouse;
      uniform float uPR;
      void main() {
        vec3 p = position;
        p.y += sin(uTime * 0.35 + position.x * 0.6) * 0.12;
        p.x += cos(uTime * 0.28 + position.y * 0.5) * 0.09;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position  = projectionMatrix * mv;
        gl_PointSize = uPR * (0.8 + aSize * 2.0) * (4.0 / -mv.z);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        float a = 1.0 - smoothstep(0.25, 0.5, d);
        gl_FragColor = vec4(uColor, a * 0.55);
      }
    `
  });

  scene.add(new THREE.Points(geo, mat));

  // Expose color updater for theme toggle
  window.__threeUpdateColor = (theme) => {
    mat.uniforms.uColor.value.set(theme === 'dark' ? 0xffffff : 0x000000);
  };
  // Init color based on current theme
  const theme = document.documentElement.getAttribute('data-theme') || 'dark';
  mat.uniforms.uColor.value.set(theme === 'dark' ? 0xffffff : 0x000000);

  // Mouse
  let tx = 0.5, ty = 0.5, cx = 0.5, cy = 0.5;
  window.addEventListener('mousemove', e => {
    tx = e.clientX / window.innerWidth;
    ty = 1 - e.clientY / window.innerHeight;
  });

  // Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mat.uniforms.uPR.value = renderer.getPixelRatio();
  });

  const clock = new THREE.Clock();
  (function loop() {
    requestAnimationFrame(loop);
    mat.uniforms.uTime.value = clock.getElapsedTime();
    cx += (tx - cx) * 0.04;
    cy += (ty - cy) * 0.04;
    mat.uniforms.uMouse.value.set(cx, cy);
    camera.position.x = (cx - 0.5) * 0.4;
    camera.position.y = (cy - 0.5) * 0.25;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  })();
}

/* ── INIT ─────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileNav();
  initTopbar();
  initFAQ();
  initVideo();

  initPreloader(() => {
    initLenis();
    initCursor();
    animateHero();
    initScrollReveal();
    if (document.getElementById('three-canvas')) initThree();
  });
});
