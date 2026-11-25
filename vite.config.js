import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// Configura o Vite para deploy estático com caminhos relativos.
// O JS e o CSS vão dentro do index.html, para o site abrir com dois cliques (file://).
export default defineConfig({
  base: './',
  plugins: [react(), viteSingleFile({ removeViteModuleLoader: true })],
});
