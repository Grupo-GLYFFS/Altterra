import { useMemo, useState } from 'react';
import { Abas } from '../componentes/Abas.jsx';
import { Avatar } from '../componentes/Avatar.jsx';
import { Aviso } from '../componentes/Aviso.jsx';
import { Botao } from '../componentes/Botao.jsx';
import { CampoTexto } from '../componentes/Campo.jsx';
import { EstadoVazio } from '../componentes/Estados.jsx';
import { DetalhePedidoRecebido } from '../componentes/fornecedor/DetalhePedidoRecebido.jsx';
import { ModalRecusarPedido } from '../componentes/fornecedor/ModalRecusarPedido.jsx';
import { Pagina } from '../componentes/layout/Pagina.jsx';
import { RotaProtegida } from '../componentes/layout/RotaProtegida.jsx';
import { Selo } from '../componentes/Selo.jsx';
import { MenuOrdenar } from '../componentes/Sobreposicoes.jsx';
import { Tabela } from '../componentes/Tabela.jsx';
import { usePedidos } from '../contexto/usePedidos.js';
import { useSessao } from '../contexto/useSessao.js';
import { formatarData, formatarReais, normalizarTexto } from '../logica/formatos.js';
import { STATUS_PEDIDO } from '../logica/pedidos.js';
import estilos from './PedidosRecebidos.module.css';

const OPCOES_ORDEM = [
  { valor: 'recentes', rotulo: 'Mais recentes', rotuloCurto: 'Mais recentes' },
  { valor: 'antigos', rotulo: 'Mais antigos', rotuloCurto: 'Mais antigos' },
  { valor: 'maior_valor', rotulo: 'Maior valor', rotuloCurto: 'Maior valor' },
  { valor: 'menor_valor', rotulo: 'Menor valor', rotuloCurto: 'Menor valor' },
];

const STATUS_ANDAMENTO = new Set(['aguardando_pagamento', 'em_separacao', 'a_caminho']);

// Conteúdo de Pedidos recebidos: abas de status, tabela de pedidos e detalhe em 2 colunas.
function ConteudoPedidosRecebidos() {
  const { usuario } = useSessao();
  const { pedidos, confirmarPagamento, avancarStatus, cancelarPedido } = usePedidos();

  const [aba, setAba] = useState('andamento');
  const [busca, setBusca] = useState('');
  const [ordem, setOrdem] = useState('recentes');
  const [selecionadoId, setSelecionadoId] = useState(null);
  const [paraRecusar, setParaRecusar] = useState(null);
  const [mensagem, setMensagem] = useState('');

  const fornecedorId = usuario.fornecedorId || usuario.fornecedor?.id;

  const recebidos = useMemo(
    () => pedidos.filter((p) => p.fornecedorId === fornecedorId),
    [pedidos, fornecedorId]
  );

  const selecionado = recebidos.find((p) => p.id === selecionadoId) || null;

  const contagens = useMemo(() => {
    const c = { andamento: 0, aguardando: 0, separacao: 0, caminho: 0, concluidos: 0 };
    recebidos.forEach((p) => {
      if (STATUS_ANDAMENTO.has(p.status)) c.andamento += 1;
      if (p.status === 'aguardando_pagamento') c.aguardando += 1;
      else if (p.status === 'em_separacao') c.separacao += 1;
      else if (p.status === 'a_caminho') c.caminho += 1;
      else c.concluidos += 1;
    });
    return c;
  }, [recebidos]);

  const filtrados = useMemo(() => {
    const termo = normalizarTexto(busca);
    const lista = recebidos.filter((p) => {
      if (aba === 'andamento' && !STATUS_ANDAMENTO.has(p.status)) return false;
      if (aba === 'aguardando' && p.status !== 'aguardando_pagamento') return false;
      if (aba === 'separacao' && p.status !== 'em_separacao') return false;
      if (aba === 'caminho' && p.status !== 'a_caminho') return false;
      if (aba === 'concluidos' && STATUS_ANDAMENTO.has(p.status)) return false;
      if (!termo) return true;
      const texto = `${p.id} ${p.compradorEmpresa} ${p.compradorNome} ${p.itens.map((i) => i.nome).join(' ')}`;
      return normalizarTexto(texto).includes(termo);
    });

    return [...lista].sort((a, b) => {
      if (ordem === 'antigos') return new Date(a.criadoEm) - new Date(b.criadoEm);
      if (ordem === 'maior_valor') return b.total - a.total;
      if (ordem === 'menor_valor') return a.total - b.total;
      return new Date(b.criadoEm) - new Date(a.criadoEm);
    });
  }, [recebidos, aba, busca, ordem]);

  // Confirma o pagamento de um pedido recebido e libera para separação.
  function lidarConfirmar(pedido) {
    confirmarPagamento(pedido.id);
    setMensagem(`Pedido ${pedido.id} confirmado e movido para separação.`);
  }

  // Avança o pedido para a próxima etapa (em separação -> a caminho -> entregue).
  function lidarAvancar(pedido) {
    avancarStatus(pedido.id);
    setMensagem(
      pedido.status === 'em_separacao'
        ? `Pedido ${pedido.id} marcado como enviado.`
        : `Pedido ${pedido.id} marcado como entregue.`
    );
  }

  // Cancela o pedido após a escolha do motivo no modal.
  function lidarRecusar(pedido) {
    cancelarPedido(pedido.id);
    setParaRecusar(null);
    setMensagem(`Pedido ${pedido.id} recusado.`);
  }

  if (selecionado) {
    return (
      <>
        {mensagem && <Aviso tipo="sucesso" titulo={mensagem} aoFechar={() => setMensagem('')} />}
        <DetalhePedidoRecebido
          pedido={selecionado}
          aoVoltar={() => setSelecionadoId(null)}
          aoConfirmarPagamento={lidarConfirmar}
          aoAvancarStatus={lidarAvancar}
          aoPedirRecusa={setParaRecusar}
        />
        <ModalRecusarPedido
          pedido={paraRecusar}
          aoFechar={() => setParaRecusar(null)}
          aoConfirmar={lidarRecusar}
        />
      </>
    );
  }

  const colunas = [
    {
      id: 'pedido',
      titulo: 'Pedido',
      render: (pedido) => (
        <div className={estilos.celulaPedido}>
          <button
            type="button"
            className={estilos.linkPedido}
            onClick={() => setSelecionadoId(pedido.id)}
          >
            {pedido.id}
          </button>
          <span className={estilos.meta}>{formatarData(pedido.criadoEm)}</span>
        </div>
      ),
    },
    {
      id: 'comprador',
      titulo: 'Comprador',
      render: (pedido) => (
        <div className={estilos.celulaComprador}>
          <Avatar nome={pedido.compradorEmpresa} tamanho={32} />
          <div className={estilos.compradorTextos}>
            <span className={estilos.negrito}>{pedido.compradorEmpresa}</span>
            <span className={estilos.meta}>
              {pedido.endereco?.cidade} - {pedido.endereco?.uf}
            </span>
          </div>
        </div>
      ),
    },
    {
      id: 'itens',
      titulo: 'Itens',
      render: (pedido) => (
        <div className={estilos.celulaItens}>
          {pedido.itens.map((item) => (
            <span key={item.produtoId}>
              {item.nome} · {item.quantidade.toLocaleString('pt-BR')} {item.unidade}
            </span>
          ))}
        </div>
      ),
    },
    {
      id: 'status',
      titulo: 'Status',
      render: (pedido) => {
        const info = STATUS_PEDIDO[pedido.status] || STATUS_PEDIDO.aguardando_pagamento;
        return (
          <Selo variante={info.variante} tamanho="sm">
            {info.rotulo}
          </Selo>
        );
      },
    },
    {
      id: 'total',
      titulo: 'Total',
      alinhar: 'direita',
      render: (pedido) => <strong className={estilos.valor}>{formatarReais(pedido.total)}</strong>,
    },
    {
      id: 'acoes',
      titulo: 'Ações',
      alinhar: 'direita',
      ocultarRotulo: true,
      render: (pedido) => (
        <div className={estilos.acoesLinha}>
          {pedido.status === 'aguardando_pagamento' && (
            <>
              <Botao variante="terciario" tamanho="sm" onClick={() => setParaRecusar(pedido)}>
                Recusar
              </Botao>
              <Botao
                variante="principal"
                tamanho="sm"
                iconeEsquerda="check"
                onClick={() => lidarConfirmar(pedido)}
              >
                Confirmar
              </Botao>
            </>
          )}
          {pedido.status === 'em_separacao' && (
            <Botao variante="secundario" tamanho="sm" onClick={() => lidarAvancar(pedido)}>
              Marcar enviado
            </Botao>
          )}
          {pedido.status === 'a_caminho' && (
            <Botao variante="secundario" tamanho="sm" onClick={() => lidarAvancar(pedido)}>
              Marcar entregue
            </Botao>
          )}
          {(pedido.status === 'entregue' || pedido.status === 'cancelado') && (
            <Botao
              variante="terciario"
              tamanho="sm"
              onClick={() => setSelecionadoId(pedido.id)}
            >
              Ver detalhe
            </Botao>
          )}
        </div>
      ),
    },
  ];

  const itensAbas = [
    { valor: 'andamento', rotulo: 'Em andamento', contagem: contagens.andamento },
    { valor: 'aguardando', rotulo: 'Aguardando', contagem: contagens.aguardando },
    { valor: 'separacao', rotulo: 'Em separação', contagem: contagens.separacao },
    { valor: 'caminho', rotulo: 'A caminho', contagem: contagens.caminho },
    { valor: 'concluidos', rotulo: 'Concluídos', contagem: contagens.concluidos },
  ];

  return (
    <div className={estilos.pagina}>
      <header className={estilos.cabecalho}>
        <h1 className={estilos.titulo}>Pedidos recebidos</h1>
        <p className={estilos.subtitulo}>
          {contagens.aguardando} aguardando · {contagens.separacao} em separação ·{' '}
          {contagens.caminho} a caminho
        </p>
      </header>

      {mensagem && <Aviso tipo="sucesso" titulo={mensagem} aoFechar={() => setMensagem('')} />}

      {recebidos.length === 0 ? (
        <EstadoVazio
          icone="inbox"
          titulo="Nenhum pedido recebido ainda"
          descricao="Quando um comprador fizer um pedido dos seus produtos, ele aparece aqui."
          textoAcao="Ver meus anúncios"
          paraAcao="/anuncios"
        />
      ) : (
        <>
          <div className={estilos.barra}>
            <div className={estilos.campoBusca}>
              <CampoTexto
                placeholder="Buscar por pedido ou comprador"
                aria-label="Buscar por pedido ou comprador"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
            <MenuOrdenar opcoes={OPCOES_ORDEM} valor={ordem} aoAlterar={setOrdem} />
          </div>

          <Abas itens={itensAbas} ativa={aba} aoAlterar={setAba} rotulo="Filtrar pedidos recebidos" />

          {filtrados.length === 0 ? (
            <EstadoVazio
              icone="inbox"
              titulo="Nenhum pedido nesta aba"
              descricao="Os pedidos com esse status aparecem aqui assim que chegarem."
              textoAcao={busca ? 'Limpar busca' : 'Ver em andamento'}
              aoClicarAcao={() => {
                setBusca('');
                setAba('andamento');
              }}
            />
          ) : (
            <Tabela
              colunas={colunas}
              linhas={filtrados}
              chave={(p) => p.id}
              legenda="Lista de pedidos recebidos"
            />
          )}
        </>
      )}

      <ModalRecusarPedido
        pedido={paraRecusar}
        aoFechar={() => setParaRecusar(null)}
        aoConfirmar={lidarRecusar}
      />
    </div>
  );
}

// Página Pedidos recebidos (rota /pedidos-recebidos), restrita a contas de fornecedor.
export function PedidosRecebidos() {
  return (
    <RotaProtegida perfil="fornecedor" titulo="Pedidos recebidos">
      <Pagina>
        <ConteudoPedidosRecebidos />
      </Pagina>
    </RotaProtegida>
  );
}
