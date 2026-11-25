import '@mantine/core/styles.css';
import './estilos/global.css';

import { MantineProvider } from '@mantine/core';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.jsx';
import { AnunciosProvider } from './contexto/AnunciosProvider.jsx';
import { CarrinhoProvider } from './contexto/CarrinhoProvider.jsx';
import { DoacoesProvider } from './contexto/DoacoesProvider.jsx';
import { FavoritosProvider } from './contexto/FavoritosProvider.jsx';
import { PedidosProvider } from './contexto/PedidosProvider.jsx';
import { SessaoProvider } from './contexto/SessaoProvider.jsx';
import { temaAltterra } from './tema.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineProvider theme={temaAltterra} forceColorScheme="light">
      <HashRouter>
        <SessaoProvider>
          <AnunciosProvider>
            <CarrinhoProvider>
              <FavoritosProvider>
                <PedidosProvider>
                  <DoacoesProvider>
                    <App />
                  </DoacoesProvider>
                </PedidosProvider>
              </FavoritosProvider>
            </CarrinhoProvider>
          </AnunciosProvider>
        </SessaoProvider>
      </HashRouter>
    </MantineProvider>
  </StrictMode>
);
