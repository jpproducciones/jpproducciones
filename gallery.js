/**
 * OBSCURA — Photography Portfolio
 * gallery.js — Swiper Carousel, Masonry Lightbox
 */

import Swiper from 'swiper';
import { Navigation, EffectCoverflow, Autoplay } from 'swiper/modules';
import 'swiper/css';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   SWIPER CAROUSEL
   ============================================================ */
function initCarousel() {
  const swiperEl = document.querySelector('.swiper');
  if (!swiperEl) return;

  const totalSlides = swiperEl.querySelectorAll('.swiper-slide').length;
  const progressEl  = document.querySelector('.carousel-progress');

  const swiper = new Swiper('.swiper', {
    modules: [Navigation, EffectCoverflow, Autoplay],
    effect: 'coverflow',
    grabCursor: false,
    centeredSlides: true,
    slidesPerView: 'auto',
    loop: true,
    speed: 900,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true
    },
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 160,
      modifier: 2.5,
      slideShadows: false
    },
    navigation: {
      nextEl: '#carousel-next',
      prevEl: '#carousel-prev'
    },
    on: {
      slideChange() {
        if (progressEl) {
          const real = (this.realIndex + 1).toString().padStart(2, '0');
          const tot  = totalSlides.toString().padStart(2, '0');
          progressEl.textContent = `${real} / ${tot}`;
        }
      }
    }
  });

  // Init counter text
  if (progressEl) progressEl.textContent = `01 / ${totalSlides.toString().padStart(2, '0')}`;
}

/* ============================================================
   LIGHTBOX
   ============================================================ */
function initLightbox() {
  const lightbox   = document.getElementById('lightbox');
  const lightboxImg= document.getElementById('lightbox-img');
  const closeBtn   = document.getElementById('lightbox-close');
  if (!lightbox || !lightboxImg) return;

  document.querySelectorAll('.masonry-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (!img) return;
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeBtn?.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });
}

/* ============================================================
   MASONRY REVEAL
   ============================================================ */
function initMasonryReveal() {
  gsap.utils.toArray('.masonry-item').forEach((item, i) => {
    gsap.fromTo(item,
      { opacity: 0, y: 50, scale: 0.97 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 1,
        ease: 'expo.out',
        delay: (i % 3) * 0.08,
        scrollTrigger: {
          trigger: item,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      }
    );
  });
}

/* ============================================================
   GALLERY HERO ENTRANCE
   ============================================================ */
function initGalleryHeroEntrance() {
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.fromTo('.gallery-hero__title',
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 1.4 },
    0.5
  )
  .fromTo('.gallery-hero__meta',
    { opacity: 0, x: -20 },
    { opacity: 1, x: 0, duration: 0.8 },
    0.9
  );
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Shared modules (cursor, sidebar, preloader) come from main.js
  // Gallery-specific init
  setTimeout(() => {
    initCarousel();
    initLightbox();
    initMasonryReveal();
    initGalleryHeroEntrance();
  }, 100);
});
