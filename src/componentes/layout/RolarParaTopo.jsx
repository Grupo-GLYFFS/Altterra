import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Rola a janela para o topo a cada mudança de rota (pathname).
// Alterações que trocam apenas busca ou filtros (?q=) na mesma página não rolam.
export function RolarParaTopo() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}
