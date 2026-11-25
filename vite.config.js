import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Configura o Vite para deploy estático com caminhos relativos.
export default defineConfig({
  base: './',
  plugins: [react()],
});
