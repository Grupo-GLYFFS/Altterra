document.addEventListener('DOMContentLoaded', () => {
  const tabBtns = document.querySelectorAll('.cf-tab-btn');
  const panels = document.querySelectorAll('[data-panel]');

  function switchTab(tabId) {
    // Atualiza estado dos botões de navegação
    tabBtns.forEach(btn => {
      if (btn.getAttribute('data-tab') === tabId) {
        btn.classList.add('cf-tab-btn-active');
      } else {
        btn.classList.remove('cf-tab-btn-active');
      }
    });

    // Mostra/oculta painéis correspondentes (Bentos e FAQs sincronizados)
    panels.forEach(panel => {
      if (panel.getAttribute('data-panel') === tabId) {
        panel.hidden = false;
      } else {
        panel.hidden = true;
      }
    });
  }

  // Define o estado inicial da página no carregamento
  switchTab('compradores');

  // Atribui os ouvintes de evento de clique aos botões
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      if (tabId) {
        switchTab(tabId);
      }
    });
  });
});
