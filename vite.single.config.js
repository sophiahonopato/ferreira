// Build de pré-visualização em arquivo único (para compartilhar um link de demo).
// O build de produção é o `npm run build` normal.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: { outDir: 'dist-single', target: 'es2020' },
});
