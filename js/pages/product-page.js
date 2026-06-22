// Funcionalidades da página de produto: galeria de imagens e ações de localização.

document.addEventListener('DOMContentLoaded', () => {

  // Galeria de imagens.
  // Os thumbnails são fixos e cobrem todas as imagens. Clicar num thumbnail troca
  // a imagem em exibição (a antiga NÃO volta para o thumbnail). As setas percorrem
  // a mesma lista. O thumbnail ativo fica destacado.
  const mainImage = document.querySelector('.main-image');
  const thumbnails = Array.from(document.querySelectorAll('.thumbnail-image'));
  const prevBtn = document.querySelector('.image-gallery-button-prev');
  const nextBtn = document.querySelector('.image-gallery-button-next');

  if (mainImage && thumbnails.length) {
    const images = thumbnails.map(thumb => ({ src: thumb.getAttribute('src'), alt: thumb.getAttribute('alt') }));
    let currentIndex = 0;

    function render() {
      const current = images[currentIndex];
      mainImage.src = current.src;
      mainImage.alt = current.alt;
      thumbnails.forEach((thumb, position) => {
        thumb.classList.toggle('is-active', position === currentIndex);
      });
    }

    thumbnails.forEach((thumb, position) => {
      thumb.addEventListener('click', () => {
        currentIndex = position;
        render();
      });
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        render();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % images.length;
        render();
      });
    }

    render();
  }

  // Ações de localização: copiar endereço e abrir no Google Maps.
  const address = document.querySelector('.location-info address');
  const copyBtn = document.querySelector('[data-action="copy-address"]');
  const mapsBtn = document.querySelector('[data-action="open-maps"]');

  if (address && copyBtn) {
    const originalCopyHTML = copyBtn.innerHTML;
    let copyTimeout;

    copyBtn.addEventListener('click', async () => {
      const text = address.textContent.trim();

      try {
        await navigator.clipboard.writeText(text);
      } catch {
        // Fallback para contextos sem Clipboard API (ex.: abrir via file://)
        const temp = document.createElement('textarea');
        temp.value = text;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        temp.remove();
      }

      // Feedback: troca o ícone por um check por 1,5s
      copyBtn.innerHTML = `
        <span class="icon icon-20">
          <svg viewBox="0 0 24 24">
            <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.42z" />
          </svg>
        </span>`;
      clearTimeout(copyTimeout);
      copyTimeout = setTimeout(() => { copyBtn.innerHTML = originalCopyHTML; }, 1500);
    });
  }

  if (address && mapsBtn) {
    mapsBtn.addEventListener('click', () => {
      const query = encodeURIComponent(address.textContent.trim());
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank', 'noopener');
    });
  }

  // Toggle de descrição sincronizado com as seções (scroll-spy).
  // Clicar num botão rola suavemente até a seção; rolar a página destaca
  // o botão da seção visível. A barra é sticky (top:0) via CSS.
  const toggleWrapper = document.querySelector('.description-toggle-wrapper');
  const toggleButtons = Array.from(document.querySelectorAll('.button-description-toggle'));
  const sections = [
    document.querySelector('.product-content-block'),
    document.querySelector('.location-section'),
    document.querySelector('.reviews-container'),
    document.querySelector('.supplier-full-profile'),
  ];

  if (toggleWrapper && toggleButtons.length === sections.length && sections.every(Boolean)) {

    function setActiveButton(index) {
      toggleButtons.forEach((btn, position) => {
        btn.classList.toggle('active', position === index);
      });
    }

    // Clique: rola até a seção, descontando a altura da barra fixada.
    toggleButtons.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        const offset = toggleWrapper.getBoundingClientRect().height + 8;
        const top = sections[index].getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
        setActiveButton(index);
      });
    });

    // Scroll-spy: a última seção cujo topo passou da base da barra fica ativa.
    let ticking = false;
    function syncActiveOnScroll() {
      // A tolerância cobre o respiro de 8px usado no scroll do clique, senão a
      // seção-alvo para logo abaixo da linha e o botão anterior fica marcado.
      const line = toggleWrapper.getBoundingClientRect().bottom + 12;
      let activeIndex = 0;
      sections.forEach((section, index) => {
        if (section.getBoundingClientRect().top <= line) activeIndex = index;
      });
      setActiveButton(activeIndex);
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(syncActiveOnScroll);
      }
    }, { passive: true });

    syncActiveOnScroll();
  }
});
