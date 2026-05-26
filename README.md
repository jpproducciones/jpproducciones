# JP Producciones — Fotografía de Bodas & Eventos

Sitio web profesional completo. Blanco y negro. Modo oscuro + claro.

## Stack

| Tecnología | Uso |
|---|---|
| **Vite 5** | Bundler con hot reload, tree-shaking y compresión Gzip/Brotli |
| **Three.js** | Campo de partículas animado en el hero (reacciona al mouse) |
| **GSAP 3 + ScrollTrigger** | Animaciones de entrada, scroll reveal, contadores |
| **Lenis** | Smooth scroll inercial de alta calidad |
| **Swiper 11** | Carrusel con efecto Coverflow en galería |

## Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Servidor de desarrollo (abre en http://localhost:3000)
npm run dev

# 3. Build de producción
npm run build

# 4. Previsualizar build
npm run preview
```

## Páginas

- `index.html` → Inicio completo (Hero, Stats, Sobre mí, Servicios, Portfolio, Video, Proceso, Testimonios, Premios, Precios, Instagram, FAQ, CTA, Footer)
- `gallery.html` → Galería (Carrusel Swiper, Masonry con filtros, Lightbox)

## Personalización rápida

### Nombre / datos
Reemplazá "JP Producciones" y el email/teléfono en los HTML.

### Modo oscuro / claro
El toggle está en el topbar (botón ☾/○). La preferencia se guarda en `localStorage`.

### Imágenes
Reemplazá las URLs de Pexels con tus fotos reales. Todas tienen `filter: grayscale(100%)` por CSS.

### Showreel
En `index.html`, cambiá el `src` del `<iframe>`:
```html
src="https://www.youtube.com/embed/TU_VIDEO_ID?..."
```

### Colores
Editá las variables en `style.css`:
```css
:root          { /* dark mode */ }
[data-theme="light"] { /* light mode */ }
```

### Precios
Editá los valores directamente en el HTML (`index.html`, sección `#precios`).
