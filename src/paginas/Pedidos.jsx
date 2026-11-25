import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Abas } from '../componentes/Abas.jsx';
import { DetalhePedido } from '../componentes/compra/DetalhePedido.jsx';
import { CardPedido } from '../componentes/comprador/CardPedido.jsx';
import { EstadoVazio } from '../componentes/Estados.jsx';
import { Pagina } from '../componentes/layout/Pagina.jsx';
import { RotaProtegida } from '../componentes/layout/RotaProtegida.jsx';
import { useAnuncios } from '../contexto/useAnuncios.js';
import { useCarrinho } from '../contexto/useCarrinho.js';
import { usePedidos } from '../contexto/usePedidos.js';
import { useSessao } from '../contexto/useSessao.js';
import { STATUS_PEDIDO } from '../logica/pedidos.js';
import estilos from './Pedidos.module.css';

// Conteúdo de Meus pedidos (lista em coluna de 880 px + detalhe em 2 colunas).
// Suporta tanto /pedidos (estado interno) quanto /pedidos/:id (parâmetro da URL).
function ConteudoPedidos() {
  const { id: idUrl } = useParams();
  const navegar = useNavigate();
  const { usuario } = useSessao();
  const { pedidos, confirmarPagamento, cancelarPedido, avaliarPedido } = usePedidos();
  const { buscarFornecedor, buscarProduto } = useAnuncios();
  const { adicionar } = useCarrinho();

  const [aba, setAba] = useState('todos');
  const [selecionadoId, setSelecionadoId] = useState(null);

  const meusPedidos = useMemo(
    () => pedidos.filter((p) => p.compradorEmail === usuario.email),
    [pedidos, usuario.email]
  );

  const idAtivo = idUrl || selecionadoId;
  const selecionado = idAtivo ? meusPedidos.find((p) => p.id === idAtivo) || null : null;

  // Volta para a lista de pedidos limpando o estado ou a rota /pedidos/:id.
  function voltarParaLista() {
    setSelecionadoId(null);
    if (idUrl) navegar('/pedidos');
  }

  // Adiciona os itens de um pedido antigo ao carrinho e abre o carrinho.
  function comprarDeNovo(pedido) {
    pedido.itens.forEach((item) => {
      const produto = buscarProduto(item.produtoId);
      if (produto && produto.estoque > 0) adicionar(produto, item.quantidade);
    });
    navegar('/carrinho');
  }

  if (idUrl && !selecionado) {
    return (
      <Pagina titulo="Pedido não encontrado">
        <EstadoVazio
          icone="receipt_long"
          titulo="Não achamos este pedido"
          descricao="Confira o número ou volte para a lista dos seus pedidos."
          textoAcao="Voltar para meus pedidos"
          aoClicarAcao={voltarParaLista}
        />
      </Pagina>
    );
  }

  if (selecionado) {
    return (
      <Pagina>
        <DetalhePedido
          pedido={selecionado}
          fornecedor={buscarFornecedor(selecionado.fornecedorId)}
          aoVoltar={voltarParaLista}
          aoComprarDeNovo={comprarDeNovo}
          aoConfirmarPagamento={confirmarPagamento}
          aoCancelar={cancelarPedido}
          aoAvaliar={avaliarPedido}
        />
      </Pagina>
    );
  }

  const porAba = {
    andamento: meusPedidos.filter((p) => STATUS_PEDIDO[p.status]?.aba === 'andamento'),
    entregues: meusPedidos.filter((p) => STATUS_PEDIDO[p.status]?.aba === 'entregues'),
    cancelados: meusPedidos.filter((p) => STATUS_PEDIDO[p.status]?.aba === 'cancelados'),
  };

  const visiveis = aba === 'todos' ? meusPedidos : porAba[aba] || [];

  const itensAbas = [
    { valor: 'todos', rotulo: 'Todos', contagem: meusPedidos.length },
    { valor: 'andamento', rotulo: 'Em andamento', contagem: porAba.andamento.length },
    { valor: 'entregues', rotulo: 'Entregues', contagem: porAba.entregues.length },
    { valor: 'cancelados', rotulo: 'Cancelados', contagem: porAba.cancelados.length },
  ];

  return (
    <Pagina titulo="Meus pedidos">
      <div className={estilos.coluna}>
        <Abas itens={itensAbas} ativa={aba} aoAlterar={setAba} rotulo="Filtrar pedidos" />

        {visiveis.length === 0 ? (
          <EstadoVazio
            icone="receipt_long"
            titulo={
              meusPedidos.length === 0
                ? 'Você ainda não fez pedidos'
                : 'Nenhum pedido nesta aba'
            }
            descricao="Quando fizer um pedido, você acompanha aqui o status e a entrega."
            textoAcao="Ver produtos"
            paraAcao="/busca"
          />
        ) : (
          <div className={estilos.lista}>
            {visiveis.map((pedido) => (
              <CardPedido
                key={pedido.id}
                pedido={pedido}
                fornecedor={buscarFornecedor(pedido.fornecedorId)}
                aoAbrir={setSelecionadoId}
                aoComprarDeNovo={comprarDeNovo}
              />
            ))}
          </div>
        )}
      </div>
    </Pagina>
  );
}

// Página Meus pedidos (V01) protegida por login.
export function Pedidos() {
  return (
    <RotaProtegida titulo="Meus pedidos">
      <ConteudoPedidos />
    </RotaProtegida>
  );
}
