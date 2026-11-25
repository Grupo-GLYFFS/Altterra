import { precoPorQuantidade, subtotalLinha } from '../logica/preco.js';
import { PRODUTOS } from './produtos.js';

// Monta um pedido de exemplo a partir de um produto e uma quantidade.
function pedidoExemplo({ id, data, status, comprador, produtoId, quantidade, frete, modo = 'entrega', avaliacao = null }) {
  const produto = PRODUTOS.find((p) => p.id === produtoId);
  const subtotal = subtotalLinha(produto, quantidade);
  const previsao = new Date(data);
  previsao.setDate(previsao.getDate() + (produto.fornecedor.prazoDias || 2));
  return {
    id,
    criadoEm: data,
    previsaoEntrega: previsao.toISOString(),
    status,
    compradorEmail: comprador.email,
    compradorNome: comprador.nome,
    compradorEmpresa: comprador.empresa,
    fornecedorId: produto.fornecedor.id,
    itens: [
      {
        produtoId,
        nome: produto.nome,
        imagem: produto.imagem,
        quantidade,
        unidade: produto.unidade,
        precoUnit: precoPorQuantidade(produto, quantidade),
        subtotal,
      },
    ],
    subtotal,
    frete: modo === 'retirada' ? 0 : frete,
    total: subtotal + (modo === 'retirada' ? 0 : frete),
    modoEntrega: modo,
    endereco: {
      apelido: 'Loja Pinheiros',
      rua: 'Rua dos Pinheiros',
      numero: '870',
      bairro: 'Pinheiros',
      cidade: 'São Paulo',
      uf: 'SP',
      cep: '05422-010',
    },
    pagamento: 'pix',
    avaliacao,
  };
}

const MARIANA = {
  email: 'compras@mercadosaojorge.com.br',
  nome: 'Mariana Albuquerque',
  empresa: 'Mercado São Jorge',
};

// Pedidos de exemplo: três da compradora Mariana e três recebidos pela Cooperativa Vale Verde.
export const PEDIDOS_EXEMPLO = [
  pedidoExemplo({ id: 'ALT-2611-0510', data: '2026-11-18T10:20:00', status: 'a_caminho', comprador: MARIANA, produtoId: 'tomate-carmem', quantidade: 200, frete: 48 }),
  pedidoExemplo({ id: 'ALT-2611-0505', data: '2026-11-22T16:05:00', status: 'aguardando_pagamento', comprador: MARIANA, produtoId: 'tomate-italiano', quantidade: 100, frete: 48 }),
  pedidoExemplo({ id: 'ALT-2611-0498', data: '2026-11-08T09:40:00', status: 'entregue', comprador: MARIANA, produtoId: 'alface-crespa', quantidade: 100, frete: 35 }),
  pedidoExemplo({
    id: 'ALT-2610-0471',
    data: '2026-10-25T14:10:00',
    status: 'entregue',
    comprador: MARIANA,
    produtoId: 'tomate-cereja',
    quantidade: 50,
    frete: 45,
    avaliacao: { nota: 5, comentario: 'Tomate firme e bem classificado. Chegou no horário.', data: '2026-10-29T10:00:00' },
  }),
  pedidoExemplo({ id: 'ALT-2610-0460', data: '2026-10-14T11:30:00', status: 'cancelado', comprador: MARIANA, produtoId: 'tomate-pera', quantidade: 150, frete: 50 }),
  pedidoExemplo({
    id: 'ALT-2611-0512',
    data: '2026-11-23T08:15:00',
    status: 'em_separacao',
    comprador: { email: 'compras@saborserra.com.br', nome: 'Paulo Nogueira', empresa: 'Restaurante Sabor da Serra' },
    produtoId: 'tomate-carmem',
    quantidade: 300,
    frete: 48,
  }),
  pedidoExemplo({
    id: 'ALT-2611-0507',
    data: '2026-11-22T13:50:00',
    status: 'aguardando_pagamento',
    comprador: { email: 'pedidos@cantinanona.com.br', nome: 'Rafael Moreira', empresa: 'Cantina da Nona Ltda' },
    produtoId: 'tomate-italiano',
    quantidade: 150,
    frete: 48,
  }),
  pedidoExemplo({
    id: 'ALT-2611-0489',
    data: '2026-11-05T09:00:00',
    status: 'entregue',
    comprador: { email: 'compras@mercearia.com.br', nome: 'Helena Braga', empresa: 'Mercearia Bom Preço' },
    produtoId: 'tomate-carmem',
    quantidade: 100,
    frete: 48,
  }),
];
