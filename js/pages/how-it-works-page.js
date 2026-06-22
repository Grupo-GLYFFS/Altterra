// Tab switch da Como Funciona: um clique troca o bento E a FAQ ao mesmo tempo

document.addEventListener('DOMContentLoaded', () => {
  const tabBtns = document.querySelectorAll('.tab-button');
  // [data-panel] cobre tanto os bentos quanto as listas de FAQ
  const panels = document.querySelectorAll('[data-panel]');

  function switchTab(tabId) {
    tabBtns.forEach(btn => {
      if (btn.getAttribute('data-tab') === tabId) {
        btn.classList.add('tab-button-active');
      } else {
        btn.classList.remove('tab-button-active');
      }
    });

    panels.forEach(panel => {
      if (panel.getAttribute('data-panel') === tabId) {
        panel.hidden = false;
      } else {
        panel.hidden = true;
      }
    });
  }

  // Estado inicial da página
  switchTab('compradores');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      if (tabId) {
        switchTab(tabId);
      }
    });
  });
});
