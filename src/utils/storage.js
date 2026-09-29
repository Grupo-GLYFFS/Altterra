// Acesso ao localStorage isolado num só lugar, com try/catch.
//
// O try/catch não é decorativo: localStorage lança exceção em modo
// privado de alguns navegadores, quando a cota estoura, ou quando o
// usuário bloqueia armazenamento de terceiros. Sem o tratamento, um
// erro aqui derrubaria a aplicação inteira no carregamento.
//
// Em caso de falha, a aplicação simplesmente funciona sem persistência
// (volta ao comportamento em memória), em vez de quebrar.

export function loadFromStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function saveToStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Persistência indisponível — segue em memória, sem interromper o fluxo.
  }
}