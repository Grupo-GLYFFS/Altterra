// Único ponto de acesso ao localStorage da aplicação.
// Todas as chaves recebem automaticamente o prefixo "altterra:".
const PREFIXO = 'altterra:';

// Monta a chave completa com prefixo padronizado.
function montarChave(chave) {
  return `${PREFIXO}${chave}`;
}

// Lê um valor salvo no localStorage e faz o parse de JSON.
// Recebe a chave (sem prefixo) e um valor padrão opcional; devolve o dado salvo ou o padrão.
export function lerArmazenamento(chave, valorPadrao = null) {
  try {
    const bruto = window.localStorage.getItem(montarChave(chave));
    if (bruto === null) return valorPadrao;
    return JSON.parse(bruto);
  } catch {
    return valorPadrao;
  }
}

// Salva um valor serializado em JSON no localStorage.
// Recebe a chave (sem prefixo) e o valor; devolve true se gravou com sucesso.
export function salvarArmazenamento(chave, valor) {
  try {
    window.localStorage.setItem(montarChave(chave), JSON.stringify(valor));
    return true;
  } catch {
    return false;
  }
}

// Remove uma chave específica do localStorage.
// Recebe a chave (sem prefixo) e não devolve valor.
export function removerArmazenamento(chave) {
  try {
    window.localStorage.removeItem(montarChave(chave));
  } catch {
    // Ignora falhas de acesso em ambientes restritos
  }
}

// Apaga todas as chaves da aplicação salvas com o prefixo "altterra:".
export function limparArmazenamento() {
  try {
    const chavesParaRemover = [];
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const chave = window.localStorage.key(i);
      if (chave && chave.startsWith(PREFIXO)) {
        chavesParaRemover.push(chave);
      }
    }
    chavesParaRemover.forEach((chave) => window.localStorage.removeItem(chave));
  } catch {
    // Ignora falhas de acesso em ambientes restritos
  }
}
