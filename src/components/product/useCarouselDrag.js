import { useEffect, useRef, useState } from 'react';

// Port fiel de js/carousel.js para React.
//
// O original varria TODAS as .product-section da página com querySelectorAll
// e montava um carrossel por seção encontrada. Em React, cada <SimilarProducts>
// já é uma instância isolada, então o hook cuida apenas do seu próprio track
// (recebido via ref) — o "for each section" vira, na prática, "1 chamada do
// hook por componente montado".
//
// Todo o restante da lógica (passo por card, drag só com mouse, pointer
// capture, snap ao card mais próximo ao soltar, estados is-draggable/
// is-dragging, disabled dos botões prev/next) foi mantido exatamente igual.
export function useCarouselDrag() {
  const trackRef = useRef(null);

  // No original esses dois eram classList.toggle / btn.disabled direto no DOM.
  // Em React viram estado, para que o JSX (className/disabled) reflita o mesmo
  // valor sem manipular o DOM manualmente.
  const [isDraggable, setIsDraggable] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [prevDisabled, setPrevDisabled] = useState(true);
  const [nextDisabled, setNextDisabled] = useState(true);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    function cardStep() {
      const firstCard = track.querySelector('.product-card');
      if (!firstCard) return track.clientWidth;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return firstCard.getBoundingClientRect().width + gap;
    }

    function updateState() {
      const hasOverflow = track.scrollWidth > track.clientWidth + 1;
      setIsDraggable(hasOverflow);

      const atStart = track.scrollLeft <= 0;
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
      setPrevDisabled(!hasOverflow || atStart);
      setNextDisabled(!hasOverflow || atEnd);
    }

    updateState();
    track.addEventListener('scroll', updateState);
    window.addEventListener('resize', updateState);

    // Arrastar com o mouse. Toque continua usando o scroll nativo (mesma
    // regra do original: pointerType !== 'mouse' sai cedo).
    let isDown = false;
    let dragging = false;
    let startX = 0;
    let startScroll = 0;
    let moved = false;
    let pointerId = null;

    function onPointerDown(event) {
      if (event.pointerType !== 'mouse') return;
      isDown = true;
      dragging = false;
      moved = false;
      startX = event.pageX;
      startScroll = track.scrollLeft;
      pointerId = event.pointerId;
    }

    function onPointerMove(event) {
      if (!isDown) return;
      const delta = event.pageX - startX;
      if (!dragging) {
        // Só captura o ponteiro quando o arrasto começa de fato. Capturar no
        // pointerdown faria o click ir para a grid em vez do <a>, quebrando a
        // navegação no clique simples.
        if (Math.abs(delta) <= 3) return;
        dragging = true;
        moved = true;
        setIsDragging(true);
        track.setPointerCapture(pointerId);
      }
      track.scrollLeft = startScroll - delta;
    }

    function endDrag(event) {
      if (!isDown) return;
      isDown = false;
      if (!dragging) return; // clique simples: deixa o link navegar
      dragging = false;
      setIsDragging(false);
      if (track.hasPointerCapture(event.pointerId)) {
        track.releasePointerCapture(event.pointerId);
      }
      // Encaixa no card mais próximo para não deixar o scroll "entre cards"
      // (mantém o alinhamento com os botões de navegação)
      const step = cardStep();
      const targetIndex = Math.round(track.scrollLeft / step);
      track.scrollTo({ left: targetIndex * step, behavior: 'smooth' });
    }

    function onClickCapture(event) {
      // Se houve arrasto, engole o clique para não navegar para o produto
      if (moved) {
        event.preventDefault();
        event.stopPropagation();
        moved = false;
      }
    }

    track.addEventListener('pointerdown', onPointerDown);
    track.addEventListener('pointermove', onPointerMove);
    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);
    track.addEventListener('click', onClickCapture, true);

    return () => {
      track.removeEventListener('scroll', updateState);
      window.removeEventListener('resize', updateState);
      track.removeEventListener('pointerdown', onPointerDown);
      track.removeEventListener('pointermove', onPointerMove);
      track.removeEventListener('pointerup', endDrag);
      track.removeEventListener('pointercancel', endDrag);
      track.removeEventListener('click', onClickCapture, true);
    };
  }, []);

  function page(direction) {
    const track = trackRef.current;
    if (!track) return;
    const firstCard = track.querySelector('.product-card');
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const step = firstCard ? firstCard.getBoundingClientRect().width + gap : track.clientWidth;
    track.scrollBy({ left: direction * step, behavior: 'smooth' });
  }

  return {
    trackRef,
    isDraggable,
    isDragging,
    prevDisabled,
    nextDisabled,
    scrollPrev: () => page(-1),
    scrollNext: () => page(1),
  };
}
