import { useCallback, useMemo } from 'react';
import { PEDIDOS_EXEMPLO } from '../dados/pedidosExemplo.js';
import { PRODUTOS } from '../dados/produtos.js';
import { somarDias } from '../logica/formatos.js';
import { caminhoImagem } from '../logica/imagens.js';
import { gerarNumeroPedido } from '../logica/pedidos.js';
import { ContextoPedidos } from './ContextoPedidos.js';
import { usePersistente } from './usePersistente.js';

const PROXIMO_STATUS = { em_separacao: 'a_caminho', a_caminho: 'entregue' };

// Normaliza caminhos de imagem salvos nos itens dos pedidos e sincroniza fotos do catálogo atual.
function normalizarPedidos(lista) {
  if (!Array.isArray(lista)) return PEDIDOS_EXEMPLO;
  return lista.map((pedido) => ({
    ...pedido,
    itens: (pedido.itens || []).map((item) => {
      const produtoAtual = PRODUTOS.find((p) => p.id === item.produtoId);
      return {
        ...item,
        imagem: produtoAtual ? produtoAtual.imagem : caminhoImagem(item.imagem),
      };
    }),
  }));
}

// Guarda os pedidos de exemplo e os novos, e as mudanças de status.
export function PedidosProvider({ children }) {
  const [pedidos, setPedidos] = usePersistente('pedidos', PEDIDOS_EXEMPLO, normalizarPedidos);

  // Cria um pedido por fornecedor a partir dos grupos do carrinho; devolve a lista criada.
  const criarPedidos = useCallback(
    (grupos, { endereco, pagamento, comprador }) => {
      const agora = new Date().toISOString();
      let acumulado = [...pedidos];
      const novos = grupos.map((grupo) => {
        const pedido = {
          id: gerarNumeroPedido(acumulado, agora),
          criadoEm: agora,
          previsaoEntrega: somarDias(agora, (grupo.fornecedor.prazoDias || 2) + 1),
          status: 'aguardando_pagamento',
          compradorEmail: comprador.email,
          compradorNome: comprador.nome,
          compradorEmpresa: comprador.empresa,
          fornecedorId: grupo.fornecedor.id,
          itens: grupo.linhas.map((linha) => ({
            produtoId: linha.produto.id,
            nome: linha.produto.nome,
            imagem: linha.produto.imagem,
            quantidade: linha.quantidade,
            unidade: linha.produto.unidade,
            precoUnit: linha.precoUnit,
            subtotal: linha.subtotal,
          })),
          subtotal: grupo.subtotal,
          frete: grupo.frete,
          total: grupo.total,
          modoEntrega: grupo.modo,
          endereco,
          pagamento,
          avaliacao: null,
        };
        acumulado = [pedido, ...acumulado];
        return pedido;
      });
      setPedidos(acumulado);
      return novos;
    },
    [pedidos, setPedidos]
  );

  // Atualiza um pedido pelo número.
  const atualizar = useCallback(
    (id, mudancas) => setPedidos((lista) => lista.map((p) => (p.id === id ? { ...p, ...mudancas } : p))),
    [setPedidos]
  );

  // Marca o pagamento como recebido e libera a separação.
  const confirmarPagamento = useCallback(
    (id) => atualizar(id, { status: 'em_separacao' }),
    [atualizar]
  );

  // Cancela um pedido que ainda não saiu para entrega.
  const cancelarPedido = useCallback((id) => atualizar(id, { status: 'cancelado' }), [atualizar]);

  // Avança o pedido para a próxima etapa (ação do fornecedor).
  const avancarStatus = useCallback(
    (id) => {
      const pedido = pedidos.find((p) => p.id === id);
      const proximo = pedido && PROXIMO_STATUS[pedido.status];
      if (proximo) atualizar(id, { status: proximo });
    },
    [pedidos, atualizar]
  );

  // Guarda a avaliação de um pedido entregue.
  const avaliarPedido = useCallback(
    (id, nota, comentario) =>
      atualizar(id, { avaliacao: { nota, comentario, data: new Date().toISOString() } }),
    [atualizar]
  );

  const valor = useMemo(
    () => ({ pedidos, criarPedidos, confirmarPagamento, cancelarPedido, avancarStatus, avaliarPedido }),
    [pedidos, criarPedidos, confirmarPagamento, cancelarPedido, avancarStatus, avaliarPedido]
  );

  return <ContextoPedidos.Provider value={valor}>{children}</ContextoPedidos.Provider>;
}
