import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Rola a janela para o topo a cada mudança de rota (pathname), ou até a âncora quando há hash.
// Alterações que trocam apenas busca ou filtros (?q=) na mesma página não rolam.
export function RolarParaTopo() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const alvo = document.getElementById(hash.slice(1));
      if (alvo) {
        alvo.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash]);

  return null;
}
