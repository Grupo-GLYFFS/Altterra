import { createRef, useEffect, useRef, useState } from 'react';

// Port do bloco "Toggle de descrição sincronizado com as seções (scroll-spy)"
// de js/pages/product-page.js. sectionCount é fixo (4: Sobre o produto,
// Localização, Avaliações, Fornecedor) — igual ao original, que também
// assumia exatamente esses 4 elementos.
//
// sectionRefs precisa ser devolvido diretamente (não via .current de um
// useRef externo) porque o React 19 não permite mais ler ref.current durante
// a renderização — só dentro de efeitos/handlers. Por isso os refs em si
// (não um array guardado dentro de OUTRO ref) vêm de useState com
// inicializador preguiçoso: criados uma única vez, e a partir daí o valor
// devolvido é o próprio estado, não uma leitura de `.current`.
export function useScrollSpyTabs(sectionCount) {
  const toggleWrapperRef = useRef(null);
  const [sectionRefs] = useState(() => Array.from({ length: sectionCount }, () => createRef()));
  const [activeIndex, setActiveIndex] = useState(0);

  const goToSection = (index) => {
    const wrapper = toggleWrapperRef.current;
    const section = sectionRefs[index].current;
    if (!wrapper || !section) return;
    const offset = wrapper.getBoundingClientRect().height + 8;
    const top = section.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
    setActiveIndex(index);
  };

  useEffect(() => {
    const wrapper = toggleWrapperRef.current;
    if (!wrapper) return undefined;

    let ticking = false;

    function syncActiveOnScroll() {
      // A tolerância cobre o respiro de 8px usado no scroll do clique, senão a
      // seção-alvo para logo abaixo da linha e o botão anterior fica marcado.
      const line = wrapper.getBoundingClientRect().bottom + 12;
      let nextActiveIndex = 0;
      sectionRefs.forEach((ref, index) => {
        if (ref.current && ref.current.getBoundingClientRect().top <= line) {
          nextActiveIndex = index;
        }
      });
      setActiveIndex(nextActiveIndex);
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(syncActiveOnScroll);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    syncActiveOnScroll();

    return () => window.removeEventListener('scroll', onScroll);
    // sectionRefs vem de useState(() => ...) com inicializador preguiçoso,
    // então sua identidade nunca muda entre renders — incluí-lo aqui é
    // seguro e silencia o aviso sem recriar o listener à toa.
  }, [sectionRefs]);

  return { toggleWrapperRef, sectionRefs, activeIndex, goToSection };
}
