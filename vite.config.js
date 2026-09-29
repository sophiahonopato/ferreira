import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 800, // three-core é carregado sob demanda
    // Sem manualChunks: o import dinâmico de ./three/Experience já isola o Three.js
    // e evita que ele seja pré-carregado na primeira tela.
  },
});
