import { defineConfig } from 'vite'
import compression from 'vite-plugin-compression'

export default defineConfig({
  root: '.',
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
    rollupOptions: {
      input: {
        main: './index.html',
        gallery: './gallery.html'
      },
      output: {
        manualChunks: {
          three:  ['three'],
          gsap:   ['gsap'],
          swiper: ['swiper']
        }
      }
    }
  },
  plugins: [
    compression({ algorithm: 'gzip' }),
    compression({ algorithm: 'brotliCompress', ext: '.br' })
  ],
  server: {
    port: 3000,
    open: true,
    host: true
  },
  preview: {
    port: 4000,
    open: true
  }
})
