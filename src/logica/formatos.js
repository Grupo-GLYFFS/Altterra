// Funções de formatação de moeda, quantidade, datas e máscaras de campos.

const OPCOES_DECIMAIS = { minimumFractionDigits: 2, maximumFractionDigits: 2 };

// Formata um valor em reais (ex.: "R$ 3,10").
export function formatarReais(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Formata uma faixa de preço (ex.: "R$ 3,10 – 3,60"); sem máximo, mostra só o mínimo.
export function formatarFaixaPreco(min, max) {
  const textoMin = Number(min).toLocaleString('pt-BR', OPCOES_DECIMAIS);
  if (!max || max === min) return `R$ ${textoMin}`;
  return `R$ ${textoMin} – ${Number(max).toLocaleString('pt-BR', OPCOES_DECIMAIS)}`;
}

// Formata uma quantidade com a unidade (ex.: "1.200 kg").
export function formatarQuantidade(valor, unidade = 'kg') {
  return `${Number(valor || 0).toLocaleString('pt-BR')} ${unidade}`;
}

// Formata uma data ISO como "24 nov. 2026".
export function formatarData(iso) {
  if (!iso) return '';
  const texto = new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  return texto.replace(/\sde\s/g, ' ').replace('.', '');
}

// Formata uma data ISO como "24/11".
export function formatarDataCurta(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

// Soma dias a uma data ISO e devolve outra data ISO.
export function somarDias(iso, dias) {
  const data = new Date(iso);
  data.setDate(data.getDate() + dias);
  return data.toISOString();
}

// Remove tudo que não for número.
export function apenasDigitos(texto = '') {
  return String(texto).replace(/\D/g, '');
}

// Aplica a máscara de CEP (00000-000).
export function mascararCep(texto = '') {
  const d = apenasDigitos(texto).slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}

// Aplica a máscara de CNPJ (00.000.000/0000-00).
export function mascararCnpj(texto = '') {
  const d = apenasDigitos(texto).slice(0, 14);
  return d
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

// Aplica a máscara de celular com DDD ((11) 91234-5678).
export function mascararCelular(texto = '') {
  const d = apenasDigitos(texto).slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

// Converte um texto digitado em número ("3,40" vira 3.4).
export function lerNumero(texto) {
  if (typeof texto === 'number') return texto;
  const limpo = String(texto || '')
    .replace(/\./g, '')
    .replace(',', '.');
  const numero = Number(limpo);
  return Number.isNaN(numero) ? 0 : numero;
}

// Gera um texto simples sem acento, em minúsculas, para comparar buscas.
export function normalizarTexto(texto = '') {
  return String(texto)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}
