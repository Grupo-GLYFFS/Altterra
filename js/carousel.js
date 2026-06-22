// Carrossel de produtos (home e product page): navegação por botões + arrastar com o mouse.
// Cada .product-section tem seu próprio track (.products-grid) e botões de paginação.

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.product-section').forEach(section => {
    const track = section.querySelector('.products-grid');
    if (!track) return;

    const navButtons = section.querySelectorAll('.product-section-nav .button-pagination');
    const prevBtn = navButtons[0];
    const nextBtn = navButtons[1];

    // Navegação por botões: rola exatamente 1 card (largura do card + gap) por clique
    function cardStep() {
      const firstCard = track.querySelector('.product-card');
      if (!firstCard) return track.clientWidth;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return firstCard.getBoundingClientRect().width + gap;
    }
    function page(direction) {
      track.scrollBy({ left: direction * cardStep(), behavior: 'smooth' });
    }
    if (prevBtn) prevBtn.addEventListener('click', () => page(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => page(1));

    // Atualiza cursor e botões conforme há (ou não) o que rolar
    function updateState() {
      const hasOverflow = track.scrollWidth > track.clientWidth + 1;
      track.classList.toggle('is-draggable', hasOverflow);

      const atStart = track.scrollLeft <= 0;
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
      if (prevBtn) prevBtn.disabled = !hasOverflow || atStart;
      if (nextBtn) nextBtn.disabled = !hasOverflow || atEnd;
    }
    updateState();
    track.addEventListener('scroll', updateState);
    window.addEventListener('resize', updateState);

    // Arrastar com o mouse. Toque continua usando o scroll nativo.
    let isDown = false;
    let startX = 0;
    let startScroll = 0;
    let moved = false;

    track.addEventListener('pointerdown', (event) => {
      if (event.pointerType !== 'mouse') return;
      isDown = true;
      moved = false;
      startX = event.pageX;
      startScroll = track.scrollLeft;
      track.classList.add('is-dragging');
      track.setPointerCapture(event.pointerId);
    });

    track.addEventListener('pointermove', (event) => {
      if (!isDown) return;
      const delta = event.pageX - startX;
      if (Math.abs(delta) > 3) moved = true;
      track.scrollLeft = startScroll - delta;
    });

    function endDrag(event) {
      if (!isDown) return;
      isDown = false;
      track.classList.remove('is-dragging');
      if (track.hasPointerCapture(event.pointerId)) {
        track.releasePointerCapture(event.pointerId);
      }
      // Encaixa no card mais próximo para não deixar o scroll "entre cards"
      // (mantém o alinhamento com os botões de navegação)
      const step = cardStep();
      const targetIndex = Math.round(track.scrollLeft / step);
      track.scrollTo({ left: targetIndex * step, behavior: 'smooth' });
    }
    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);

    // Se houve arrasto, engole o clique para não navegar para o produto
    track.addEventListener('click', (event) => {
      if (moved) {
        event.preventDefault();
        event.stopPropagation();
        moved = false;
      }
    }, true);
  });
});
