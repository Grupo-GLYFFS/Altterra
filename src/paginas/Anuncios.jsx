import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Aviso } from '../componentes/Aviso.jsx';
import { Botao } from '../componentes/Botao.jsx';
import { CampoTexto } from '../componentes/Campo.jsx';
import { Chip } from '../componentes/Chip.jsx';
import { EstadoVazio } from '../componentes/Estados.jsx';
import { MenuAcoesAnuncio } from '../componentes/fornecedor/MenuAcoesAnuncio.jsx';
import { ModalExcluirAnuncio } from '../componentes/fornecedor/ModalExcluirAnuncio.jsx';
import { Icone } from '../componentes/Icone.jsx';
import { ImagemSegura } from '../componentes/ImagemSegura.jsx';
import { Pagina } from '../componentes/layout/Pagina.jsx';
import { RotaProtegida } from '../componentes/layout/RotaProtegida.jsx';
import { Selo } from '../componentes/Selo.jsx';
import { Tabela } from '../componentes/Tabela.jsx';
import { useAnuncios } from '../contexto/useAnuncios.js';
import { usePedidos } from '../contexto/usePedidos.js';
import { useSessao } from '../contexto/useSessao.js';
import { formatarFaixaPreco, normalizarTexto } from '../logica/formatos.js';
import estilos from './Anuncios.module.css';

// Devolve os dados visuais de status de um anúncio (Ativo, Pausado ou Sem estoque).
function obterStatusAnuncio(produto) {
  if (produto.estoque <= 0) return { rotulo: 'Sem estoque', variante: 'erro', chave: 'sem_estoque' };
  if (produto.status === 'pausado') return { rotulo: 'Pausado', variante: 'neutro', chave: 'pausados' };
  return { rotulo: 'Ativo', variante: 'sucesso', chave: 'ativos' };
}

// Conteúdo de Meus anúncios para o fornecedor logado: busca, chips de status e tabela de ações.
function ConteudoAnuncios() {
  const { usuario } = useSessao();
  const { produtos, alternarPausa, duplicar, atualizar, excluir } = useAnuncios();
  const { pedidos } = usePedidos();

  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('todos');
  const [paraExcluir, setParaExcluir] = useState(null);
  const [mensagem, setMensagem] = useState('');

  const fornecedorId = usuario.fornecedorId || usuario.fornecedor?.id;

  const meusAnuncios = useMemo(
    () => produtos.filter((p) => p.fornecedor?.id === fornecedorId || p.fornecedorId === fornecedorId),
    [produtos, fornecedorId]
  );

  // Conta quantos pedidos cada produto recebeu deste fornecedor.
  const pedidosPorProduto = useMemo(() => {
    const mapa = {};
    pedidos
      .filter((p) => p.fornecedorId === fornecedorId)
      .forEach((pedido) => {
        pedido.itens.forEach((item) => {
          mapa[item.produtoId] = (mapa[item.produtoId] || 0) + 1;
        });
      });
    return mapa;
  }, [pedidos, fornecedorId]);

  const contagens = useMemo(() => {
    let ativos = 0;
    let pausados = 0;
    let semEstoque = 0;
    meusAnuncios.forEach((p) => {
      const chave = obterStatusAnuncio(p).chave;
      if (chave === 'ativos') ativos += 1;
      else if (chave === 'pausados') pausados += 1;
      else semEstoque += 1;
    });
    return { todos: meusAnuncios.length, ativos, pausados, semEstoque };
  }, [meusAnuncios]);

  const filtrados = useMemo(() => {
    const termo = normalizarTexto(busca);
    return meusAnuncios.filter((p) => {
      if (filtro !== 'todos' && obterStatusAnuncio(p).chave !== filtro) return false;
      if (!termo) return true;
      return normalizarTexto(`${p.nome} ${p.categoria || ''} ${p.variedade || ''}`).includes(termo);
    });
  }, [meusAnuncios, busca, filtro]);

  // Pausa ou reativa o anúncio e mostra retorno na tela.
  function lidarAlternarPausa(produto) {
    alternarPausa(produto.id);
    setMensagem(
      produto.status === 'pausado'
        ? `${produto.nome} voltou a aparecer na busca.`
        : `${produto.nome} foi pausado e saiu da busca.`
    );
  }

  // Cria uma cópia pausada do anúncio.
  function lidarDuplicar(produto) {
    duplicar(produto.id);
    setMensagem(`Cópia pausada de ${produto.nome} criada.`);
  }

  // Marca ou remove o anúncio do filtro Outlet.
  function lidarAlternarOutlet(produto) {
    const ativar = !produto.outlet;
    atualizar(produto.id, { outlet: ativar, descontoPercentual: ativar ? 20 : 0 });
    setMensagem(
      ativar ? `${produto.nome} marcado como Outlet.` : `${produto.nome} removido do Outlet.`
    );
  }

  // Confirma a exclusão do anúncio selecionado.
  function confirmarExclusao(produto) {
    excluir(produto.id);
    setParaExcluir(null);
    setMensagem(`${produto.nome} foi excluído.`);
  }

  const colunas = [
    {
      id: 'produto',
      titulo: 'Produto',
      ocultarRotulo: true,
      render: (produto) => (
        <div className={estilos.celulaProduto}>
          <div className={estilos.miniatura}>
            <ImagemSegura
              src={produto.imagem}
              alt=""
              className={estilos.imagem}
              fallback={<Icone nome="image" tamanho={20} />}
            />
          </div>
          <div className={estilos.infoProduto}>
            <Link to={`/produto/${produto.id}`} className={estilos.nomeProduto}>
              {produto.nome}
            </Link>
            <div className={estilos.metaProduto}>
              {produto.outlet && (
                <Selo variante="outlet" tamanho="sm" icone="">
                  {produto.descontoPercentual ? `−${produto.descontoPercentual}%` : 'Outlet'}
                </Selo>
              )}
              {produto.organico && <span>Orgânico ·</span>}
              <span>
                mín. {produto.pedidoMinimo.toLocaleString('pt-BR')} {produto.unidade}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'status',
      titulo: 'Status',
      render: (produto) => {
        const info = obterStatusAnuncio(produto);
        return (
          <Selo variante={info.variante} tamanho="sm">
            {info.rotulo}
          </Selo>
        );
      },
    },
    {
      id: 'preco',
      titulo: 'Preço',
      render: (produto) => {
        const antigo =
          produto.outlet && produto.precoAntigoMin
            ? formatarFaixaPreco(produto.precoAntigoMin, produto.precoAntigoMax)
            : '';
        return (
          <div className={estilos.celulaPreco}>
            {antigo && <s className={estilos.precoAntigo}>{antigo}</s>}
            <span className={estilos.precoAtual}>
              {formatarFaixaPreco(produto.precoMin, produto.precoMax)}{' '}
              <span className={estilos.unidade}>/{produto.unidade}</span>
            </span>
          </div>
        );
      },
    },
    {
      id: 'estoque',
      titulo: 'Estoque',
      render: (produto) => (
        <span className={produto.estoque <= 0 ? estilos.estoqueZero : estilos.numero}>
          {produto.estoque.toLocaleString('pt-BR')} {produto.unidade}
        </span>
      ),
    },
    {
      id: 'pedidos',
      titulo: 'Pedidos',
      alinhar: 'direita',
      render: (produto) => (
        <span className={estilos.numero}>{pedidosPorProduto[produto.id] || 0}</span>
      ),
    },
    {
      id: 'acoes',
      titulo: 'Ações',
      alinhar: 'direita',
      ocultarRotulo: true,
      render: (produto) => {
        const esgotado = produto.estoque <= 0;
        const pausado = produto.status === 'pausado';
        return (
          <div className={estilos.acoesLinha}>
            <Botao
              variante="secundario"
              tamanho="sm"
              iconeEsquerda="edit"
              para={`/anunciar/${produto.id}`}
            >
              Editar
            </Botao>
            {esgotado ? (
              <Botao
                variante="icone"
                tamanho="sm"
                iconeEsquerda="add_box"
                para={`/anunciar/${produto.id}`}
                aria-label={`Repor estoque de ${produto.nome}`}
              />
            ) : (
              <Botao
                variante="icone"
                tamanho="sm"
                iconeEsquerda={pausado ? 'play_arrow' : 'pause'}
                aria-label={pausado ? `Reativar ${produto.nome}` : `Pausar ${produto.nome}`}
                onClick={() => lidarAlternarPausa(produto)}
              />
            )}
            <MenuAcoesAnuncio
              produto={produto}
              aoAlternarPausa={lidarAlternarPausa}
              aoDuplicar={lidarDuplicar}
              aoAlternarOutlet={lidarAlternarOutlet}
              aoPedirExclusao={setParaExcluir}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className={estilos.pagina}>
      <header className={estilos.cabecalho}>
        <div className={estilos.cabecalhoTextos}>
          <h1 className={estilos.titulo}>Meus anúncios</h1>
          <p className={estilos.subtitulo}>
            {contagens.todos} {contagens.todos === 1 ? 'anúncio' : 'anúncios'} · {contagens.ativos}{' '}
            {contagens.ativos === 1 ? 'ativo' : 'ativos'}
          </p>
        </div>
        <Botao variante="principal" tamanho="sm" iconeEsquerda="add" para="/anunciar">
          Anunciar produto
        </Botao>
      </header>

      {mensagem && <Aviso tipo="sucesso" titulo={mensagem} aoFechar={() => setMensagem('')} />}

      {meusAnuncios.length === 0 ? (
        <EstadoVazio
          icone="sell"
          titulo="Você ainda não tem anúncios"
          descricao="Anuncie um produto com fotos, faixas de preço por volume, estoque e prazo de entrega."
          textoAcao="Anunciar produto"
          paraAcao="/anunciar"
        />
      ) : (
        <>
          <div className={estilos.barra}>
            <div className={estilos.campoBusca}>
              <CampoTexto
                placeholder="Buscar nos meus anúncios"
                aria-label="Buscar nos meus anúncios"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>

            <div className={estilos.chips} role="group" aria-label="Filtrar por status">
              <Chip
                comBorda
                ativo={filtro === 'todos'}
                contagem={contagens.todos}
                aoClicar={() => setFiltro('todos')}
              >
                Todos
              </Chip>
              <Chip
                comBorda
                ativo={filtro === 'ativos'}
                contagem={contagens.ativos}
                aoClicar={() => setFiltro('ativos')}
              >
                Ativos
              </Chip>
              <Chip
                comBorda
                ativo={filtro === 'pausados'}
                contagem={contagens.pausados}
                aoClicar={() => setFiltro('pausados')}
              >
                Pausados
              </Chip>
              <Chip
                comBorda
                ativo={filtro === 'sem_estoque'}
                contagem={contagens.semEstoque}
                aoClicar={() => setFiltro('sem_estoque')}
              >
                Sem estoque
              </Chip>
            </div>
          </div>

          {filtrados.length === 0 ? (
            <EstadoVazio
              icone="search_off"
              titulo="Nenhum anúncio encontrado"
              descricao="Tente outro termo de busca ou volte para todos os anúncios."
              textoAcao="Limpar filtros"
              aoClicarAcao={() => {
                setBusca('');
                setFiltro('todos');
              }}
            />
          ) : (
            <Tabela
              colunas={colunas}
              linhas={filtrados}
              chave={(p) => p.id}
              legenda="Lista dos seus anúncios"
            />
          )}
        </>
      )}

      <ModalExcluirAnuncio
        produto={paraExcluir}
        aoFechar={() => setParaExcluir(null)}
        aoConfirmar={confirmarExclusao}
      />
    </div>
  );
}

// Página Meus anúncios (rota /anuncios), restrita a contas de fornecedor.
export function Anuncios() {
  return (
    <RotaProtegida perfil="fornecedor" titulo="Meus anúncios">
      <Pagina>
        <ConteudoAnuncios />
      </Pagina>
    </RotaProtegida>
  );
}
