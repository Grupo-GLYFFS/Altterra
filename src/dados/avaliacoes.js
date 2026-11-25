import { caminhoImagem } from '../logica/imagens.js';

// Avaliações de exemplo exibidas na página do produto.
export const AVALIACOES_EXEMPLO = [
  {
    id: 'av-1',
    autor: 'Mercearia Bom Preço',
    foto: caminhoImagem('perfil-helena-braga.webp'),
    local: 'São Roque - SP',
    nota: 5,
    data: '2026-11-19T12:00:00',
    comprou: '200 kg',
    comentario: 'Chegou firme, sem tomate amassado na caixa. O calibre bateu com o anunciado e a nota fiscal veio junto.',
    util: 12,
  },
  {
    id: 'av-2',
    autor: 'Restaurante Sabor da Serra',
    foto: caminhoImagem('perfil-paulo-nogueira.webp'),
    local: 'Cotia - SP',
    nota: 5,
    data: '2026-11-12T12:00:00',
    comprou: '80 kg',
    comentario: 'Segundo pedido com a cooperativa. Serve para molho e para salada, maturação bem uniforme. Entregaram antes das 7h, como combinado.',
    util: 9,
  },
  {
    id: 'av-3',
    autor: 'Hortifruti Avenida',
    foto: caminhoImagem('perfil-hortifruti-avenida.webp'),
    local: 'Sorocaba - SP',
    nota: 4,
    data: '2026-11-04T12:00:00',
    comprou: '300 kg',
    comentario: 'Qualidade muito boa, mas duas caixas vieram mais maduras que o resto. Avisei pelo chat e descontaram no pedido seguinte.',
    util: 4,
    resposta:
      'Obrigado pelo aviso. Passamos a separar por ponto de maturação nas cargas para Sorocaba.',
  },
];
