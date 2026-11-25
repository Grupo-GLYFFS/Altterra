// Comprime uma imagem escolhida pelo usuário no navegador e devolve uma data URL.
// Redimensiona mantendo a proporção para caber em até 960 px e grava em WebP (ou JPEG).

const LADO_MAXIMO_PX = 960;
const QUALIDADE_IMAGEM = 0.78;
const LIMITE_ARQUIVO_MB = 12;

// Lê um objeto File como data URL usando FileReader.
function lerComoDataUrl(arquivo) {
  return new Promise((resolver, rejeitar) => {
    const leitor = new FileReader();
    leitor.onload = () => resolver(String(leitor.result || ''));
    leitor.onerror = () => rejeitar(new Error('Não foi possível ler o arquivo selecionado.'));
    leitor.readAsDataURL(arquivo);
  });
}

// Carrega uma data URL em um elemento Image para medir dimensões e desenhar no canvas.
function carregarImagem(src) {
  return new Promise((resolver, rejeitar) => {
    const imagem = new Image();
    imagem.onload = () => resolver(imagem);
    imagem.onerror = () => rejeitar(new Error('O arquivo não é uma imagem válida.'));
    imagem.src = src;
  });
}

// Comprime um arquivo de imagem e devolve uma data URL pronta para salvar no localStorage.
// Recebe um File; lança erro amigável se o formato ou tamanho for inválido.
export async function comprimirImagem(arquivo) {
  if (!arquivo || !arquivo.type.startsWith('image/')) {
    throw new Error('Escolha apenas arquivos de imagem (JPG, PNG ou WebP).');
  }

  if (arquivo.size > LIMITE_ARQUIVO_MB * 1024 * 1024) {
    throw new Error(`A imagem passou de ${LIMITE_ARQUIVO_MB} MB. Tente uma foto menor.`);
  }

  const dataUrlBruta = await lerComoDataUrl(arquivo);
  const imagem = await carregarImagem(dataUrlBruta);

  const maiorLado = Math.max(imagem.width, imagem.height);
  const escala = maiorLado > LADO_MAXIMO_PX ? LADO_MAXIMO_PX / maiorLado : 1;
  const largura = Math.max(1, Math.round(imagem.width * escala));
  const altura = Math.max(1, Math.round(imagem.height * escala));

  const canvas = document.createElement('canvas');
  canvas.width = largura;
  canvas.height = altura;

  const contexto = canvas.getContext('2d');
  if (!contexto) return dataUrlBruta;

  contexto.drawImage(imagem, 0, 0, largura, altura);

  // Tenta WebP primeiro por ser mais leve; cai para JPEG se o navegador não exportar WebP.
  const webp = canvas.toDataURL('image/webp', QUALIDADE_IMAGEM);
  if (webp.startsWith('data:image/webp')) return webp;

  return canvas.toDataURL('image/jpeg', QUALIDADE_IMAGEM);
}
