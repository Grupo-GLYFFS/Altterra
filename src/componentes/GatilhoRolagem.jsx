import { useEffect, useRef } from 'react';

// Marcador invisível no fim de uma lista: chama aoVisivel quando chega perto da tela (rolagem infinita).
export function GatilhoRolagem({ aoVisivel, ativo = true }) {
  const marcador = useRef(null);
  const ultimoAoVisivel = useRef(aoVisivel);

  useEffect(() => {
    ultimoAoVisivel.current = aoVisivel;
  }, [aoVisivel]);

  useEffect(() => {
    const el = marcador.current;
    if (!ativo || !el) return undefined;
    const observador = new IntersectionObserver(
      (entradas) => {
        if (entradas[0].isIntersecting) ultimoAoVisivel.current?.();
      },
      { rootMargin: '240px' }
    );
    observador.observe(el);
    return () => observador.disconnect();
  }, [ativo]);

  return <div ref={marcador} aria-hidden="true" />;
}
