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

// Devolve true se gravou, false se falhou (cota estourada, modo privado,
// armazenamento bloqueado). A maioria dos chamadores ignora o retorno e
// segue em memória; quem precisa ter certeza de que o dado foi guardado
// (ex.: publicar um produto com fotos) usa o retorno para avisar o usuário.
export function saveToStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    // Persistência indisponível — segue em memória, sem interromper o fluxo.
    return false
  }
}


// Cota típica do localStorage: ~5 milhões de caracteres por origem (varia
// por navegador). Estimativa APROXIMADA, só para avisar o usuário antes de
// estourar — não é um valor exato.
const STORAGE_LIMIT_CHARS = 5_000_000

export function getStorageUsageRatio() {
  try {
    let total = 0
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const key = window.localStorage.key(i)
      total += key.length + (window.localStorage.getItem(key) || '').length
    }
    return total / STORAGE_LIMIT_CHARS
  } catch {
    return 0
  }
}