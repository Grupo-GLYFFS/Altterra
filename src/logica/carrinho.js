import { PEDIDO_MINIMO_FORNECEDOR, calcularFrete } from './frete.js';
import { precoPorQuantidade, subtotalLinha } from './preco.js';

// Transforma os itens guardados do carrinho em linhas completas.
// Recebe os itens ({ produtoId, quantidade }) e o catálogo; ignora produtos que não existem mais.
export function montarLinhas(itens, produtos) {
  return itens
    .map((item) => {
      const produto = produtos.find((p) => p.id === item.produtoId);
      if (!produto) return null;
      const precoUnit = precoPorQuantidade(produto, item.quantidade);
      const subtotal = subtotalLinha(produto, item.quantidade);
      const fator = produto.outlet && produto.descontoPercentual ? 1 - produto.descontoPercentual / 100 : 1;
      const cheio = Math.round((subtotal / fator) * 100) / 100;
      return { produto, quantidade: item.quantidade, precoUnit, subtotal, cheio };
    })
    .filter(Boolean);
}

// Agrupa as linhas por fornecedor e calcula subtotal, frete e pedido mínimo de cada grupo.
// Recebe as linhas e um objeto de modos de entrega por fornecedor ({ [id]: "entrega" | "retirada" }).
export function agruparPorFornecedor(linhas, modos = {}) {
  const mapa = new Map();
  linhas.forEach((linha) => {
    const fornecedor = linha.produto.fornecedor;
    if (!mapa.has(fornecedor.id)) mapa.set(fornecedor.id, { fornecedor, linhas: [] });
    mapa.get(fornecedor.id).linhas.push(linha);
  });

  return [...mapa.values()].map((grupo) => {
    const subtotal = grupo.linhas.reduce((soma, l) => soma + l.subtotal, 0);
    const cheio = grupo.linhas.reduce((soma, l) => soma + l.cheio, 0);
    const peso = grupo.linhas.reduce((soma, l) => soma + l.quantidade, 0);
    const modo = modos[grupo.fornecedor.id] || 'entrega';
    const frete = calcularFrete(grupo.fornecedor, peso, modo);
    return {
      ...grupo,
      modo,
      peso,
      subtotal,
      cheio,
      frete,
      total: subtotal + frete,
      minimo: PEDIDO_MINIMO_FORNECEDOR,
      falta: Math.max(0, PEDIDO_MINIMO_FORNECEDOR - subtotal),
      abaixoDoMinimo: subtotal < PEDIDO_MINIMO_FORNECEDOR,
    };
  });
}

// Soma os grupos e devolve os totais do resumo do pedido.
export function calcularTotais(grupos) {
  const cheio = grupos.reduce((soma, g) => soma + g.cheio, 0);
  const subtotal = grupos.reduce((soma, g) => soma + g.subtotal, 0);
  const frete = grupos.reduce((soma, g) => soma + g.frete, 0);
  return {
    itens: grupos.reduce((soma, g) => soma + g.linhas.length, 0),
    fornecedores: grupos.length,
    cheio,
    desconto: Math.round((cheio - subtotal) * 100) / 100,
    subtotal,
    frete,
    total: subtotal + frete,
    bloqueado: grupos.some((g) => g.abaixoDoMinimo),
  };
}
