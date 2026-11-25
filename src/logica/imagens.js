// Monta ou normaliza o caminho de uma imagem da pasta public/img para funcionar em qualquer subendereço.
// Aceita nome do arquivo ("alface-crespa.webp"), caminho relativo/absoluto ("/img/...") ou data URL.
export function caminhoImagem(valor) {
  if (!valor) return '';
  if (/^(data:|blob:|https?:\/\/)/i.test(valor)) return valor;
  const limpo = valor.replace(/^\.?\/?img\//, '');
  return `./img/${limpo}`;
}
