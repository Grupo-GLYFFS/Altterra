import { Collapse, Menu, Popover } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAnuncios } from '../../contexto/useAnuncios.js';
import { useCarrinho } from '../../contexto/useCarrinho.js';
import { useSessao } from '../../contexto/useSessao.js';
import { CATEGORIAS } from '../../dados/categorias.js';
import { REGIAO_PADRAO, REGIOES_POR_ESTADO } from '../../dados/regioes.js';
import { Avatar } from '../Avatar.jsx';
import { Botao } from '../Botao.jsx';
import { Chip } from '../Chip.jsx';
import { Contador } from '../Contador.jsx';
import { Icone } from '../Icone.jsx';
import { LogoAltterra } from '../LogoAltterra.jsx';
import { Gaveta } from '../Sobreposicoes.jsx';
import { MiniCarrinho } from './MiniCarrinho.jsx';
import estilos from './Navbar.module.css';

// Navbar principal da Altterra com versão completa no computador e barra inferior + gavetas no celular.
// Mantém as camadas exatas da Fase 4 e condensa ao rolar ocultando apenas a linha de cima.
// Usuário e itens do carrinho vêm da sessão; as props só existem para a vitrine de componentes.
export function Navbar({
  usuario: usuarioProp,
  itensCarrinho: itensProp,
  regiaoInicial = REGIAO_PADRAO,
}) {
  const localizacao = useLocation();
  const navegar = useNavigate();
  const { usuario: usuarioSessao, sair } = useSessao();
  const { totalItens } = useCarrinho();
  const { produtosAtivos } = useAnuncios();
  const usuario = usuarioProp === undefined ? usuarioSessao : usuarioProp;
  const itensCarrinho = itensProp ?? totalItens;
  const ehCelular = useMediaQuery('(max-width: 63.99em)', false, {
    getInitialValueInEffect: false,
  });
  const [rolou, setRolou] = useState(false);
  const campoBuscaDesktop = useRef(null);
  const campoBuscaCelular = useRef(null);

  const [categoriasAbertas, setCategoriasAbertas] = useState(false);
  const [categoriaAtiva, setCategoriaAtiva] = useState(CATEGORIAS[2].id);
  const [regiaoAberta, setRegiaoAberta] = useState(false);
  const [regiao, setRegiao] = useState(regiaoInicial);
  const [buscaRegiao, setBuscaRegiao] = useState('');
  const [termoBusca, setTermoBusca] = useState('');
  const [soOutlet, setSoOutlet] = useState(false);
  const [sugestoesAbertas, setSugestoesAbertas] = useState(false);
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [maisAberto, setMaisAberto] = useState(false);

  // Atualiza sombra da navbar com histerese na rolagem, sem alterar altura.
  useEffect(() => {
    function aoRolar() {
      const y = window.scrollY;
      setRolou((atual) => {
        if (!atual && y > 40) return true;
        if (atual && y < 10) return false;
        return atual;
      });
    }

    aoRolar();
    window.addEventListener('scroll', aoRolar, { passive: true });
    return () => window.removeEventListener('scroll', aoRolar);
  }, []);

  const categoriaSelecionada =
    CATEGORIAS.find((cat) => cat.id === categoriaAtiva) || CATEGORIAS[0];

  // Envia a busca para a página /busca com os parâmetros de texto e escopo Outlet.
  function enviarBusca(evento) {
    evento?.preventDefault();
    setSugestoesAbertas(false);
    const parametros = new URLSearchParams();
    if (termoBusca.trim()) parametros.set('q', termoBusca.trim());
    if (soOutlet) parametros.set('outlet', '1');
    const query = parametros.toString();
    navegar(query ? `/busca?${query}` : '/busca');
  }

  // Filtra as sugestões locais conforme o texto digitado e o filtro "Só Outlet".
  const sugestoes = produtosAtivos.filter((produto) => {
    if (soOutlet && !produto.outlet) return false;
    if (!termoBusca.trim()) return true;
    return produto.nome.toLowerCase().includes(termoBusca.trim().toLowerCase());
  }).slice(0, 4);

  // Filtra estados e cidades pelo texto digitado no popup/gaveta de região.
  const regioesFiltradas = REGIOES_POR_ESTADO.map((grupo) => ({
    ...grupo,
    cidades: grupo.cidades.filter((cidade) =>
      `${cidade} ${grupo.estado} ${grupo.uf}`
        .toLowerCase()
        .includes(buscaRegiao.trim().toLowerCase())
    ),
  })).filter((grupo) => grupo.cidades.length > 0);

  // Seleciona uma cidade e fecha o seletor de região.
  function escolherRegiao(cidade, uf) {
    setRegiao(`${cidade} - ${uf}`);
    setRegiaoAberta(false);
  }

  // Foca o campo de busca no celular ao tocar no botão "Busca" da barra inferior.
  function focarBuscaCelular() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    campoBuscaCelular.current?.focus();
    setSugestoesAbertas(true);
  }

  const conteudoRegiao = (
    <div className={estilos.regiaoCorpo}>
      <div className={estilos.regiaoBuscaLinha}>
        <div className={estilos.campoEscuro}>
          <Icone nome="search" tamanho={20} />
          <input
            type="search"
            value={buscaRegiao}
            onChange={(e) => setBuscaRegiao(e.target.value)}
            placeholder="Buscar cidade ou CEP"
            aria-label="Buscar cidade ou CEP"
            className={estilos.campoEscuroInput}
          />
        </div>
        <button
          type="button"
          className={estilos.botaoIconeEscuro}
          aria-label="Usar minha localização"
          onClick={() => escolherRegiao('São Paulo', 'SP')}
        >
          <Icone nome="my_location" tamanho={24} />
        </button>
      </div>

      <div className={estilos.listaEstados}>
        {regioesFiltradas.map((grupo) => (
          <div key={grupo.uf} className={estilos.grupoEstado}>
            <p className={estilos.tituloEstado}>{grupo.estado}</p>
            <div className={estilos.listaCidades}>
              {grupo.cidades.map((cidade) => {
                const rotuloCompleto = `${cidade} - ${grupo.uf}`;
                const selecionada = regiao === rotuloCompleto;
                return (
                  <button
                    key={rotuloCompleto}
                    type="button"
                    className={`${estilos.chipCidade} ${selecionada ? estilos.chipCidadeAtiva : ''}`}
                    aria-pressed={selecionada}
                    onClick={() => escolherRegiao(cidade, grupo.uf)}
                  >
                    {selecionada && <Icone nome="check" tamanho={16} />}
                    <span>{cidade}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const listaSugestoes = sugestoesAbertas && (
    <div className={estilos.sugestoes} role="listbox" aria-label="Sugestões de busca">
      <div className={estilos.sugestoesEscopo} role="group" aria-label="Onde buscar">
        <span className={estilos.sugestoesRotulo}>Buscar em</span>
        <Chip ativo={!soOutlet} aoClicar={() => setSoOutlet(false)}>
          Tudo
        </Chip>
        <Chip ativo={soOutlet} icone="sell" aoClicar={() => setSoOutlet(true)}>
          Só Outlet
        </Chip>
      </div>

      <p className={estilos.sugestoesSubtitulo}>Produtos</p>
      {sugestoes.map((produto) => (
        <Link
          key={produto.id}
          to={`/produto/${produto.id}`}
          className={estilos.sugestaoItem}
          onClick={() => setSugestoesAbertas(false)}
        >
          <Icone nome="search" tamanho={20} className={estilos.sugestaoIcone} />
          <span>{produto.nome}</span>
          <span className={produto.outlet ? estilos.sugestaoOutlet : estilos.sugestaoCat}>
            {produto.outlet ? `Outlet −${produto.descontoPercentual}%` : produto.categoria}
          </span>
        </Link>
      ))}

      {!soOutlet && (
        <button
          type="button"
          className={`${estilos.sugestaoItem} ${estilos.sugestaoLinkOutlet}`}
          onClick={() => {
            setSoOutlet(true);
            enviarBusca();
          }}
        >
          <Icone nome="sell" tamanho={20} />
          <span>Ver {termoBusca ? `"${termoBusca}"` : 'ofertas'} só no Outlet</span>
          <Icone nome="chevron_right" tamanho={20} className={estilos.empurraDireita} />
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Navbar do computador */}
      <header className={`${estilos.navDesktop} ${rolou ? estilos.rolou : ''}`}>
        <div className={estilos.navPrincipal}>
          <div className={estilos.container}>
            <div className={estilos.linhaTopo}>
                <Link to="/" className={estilos.logoLink} aria-label="Altterra, página inicial">
                  <LogoAltterra variante="claro" tamanho="md" />
                </Link>

                <div className={estilos.acoesTopo}>
                  <nav className={estilos.linksTopo} aria-label="Principal">
                    <Link to="/como-funciona" className={estilos.linkNav}>
                      Como funciona
                    </Link>
                    <Link to="/anunciar" className={estilos.linkNav}>
                      Anunciar produto
                    </Link>
                    <Link to="/safra-que-alimenta" className={estilos.linkNav}>
                      Safra que Alimenta
                    </Link>
                  </nav>

                  {usuario ? (
                    <Menu position="bottom-end" width={300} radius="lg" shadow="md">
                      <Menu.Target>
                        <button type="button" className={`${estilos.linkNav} ${estilos.contaBotao}`}>
                          <Avatar nome={usuario.nome} tamanho={44} />
                          <span>Minha conta</span>
                          <Icone nome="expand_more" tamanho={20} />
                        </button>
                      </Menu.Target>
                      <Menu.Dropdown className={estilos.menuConta}>
                        <Link to="/perfil" className={estilos.perfilLink}>
                          <Avatar nome={usuario.nome} tamanho={44} />
                          <span className={estilos.perfilTexto}>
                            <strong>{usuario.nome}</strong>
                            <span className={estilos.verPerfil}>
                              Ver perfil <Icone nome="chevron_right" tamanho={16} />
                            </span>
                          </span>
                        </Link>
                        <span className={estilos.menuDivisor} />
                        <Link to="/pedidos" className={estilos.menuOpcao}>
                          <Icone nome="receipt_long" tamanho={20} />
                          <span>Meus pedidos</span>
                        </Link>
                        <Link to="/favoritos" className={estilos.menuOpcao}>
                          <Icone nome="favorite" tamanho={20} />
                          <span>Favoritos</span>
                        </Link>
                        {usuario.perfil === 'fornecedor' && (
                          <>
                            <Link to="/anuncios" className={estilos.menuOpcao}>
                              <Icone nome="inventory_2" tamanho={20} />
                              <span>Meus anúncios</span>
                            </Link>
                            <Link to="/pedidos-recebidos" className={estilos.menuOpcao}>
                              <Icone nome="local_shipping" tamanho={20} />
                              <span>Pedidos recebidos</span>
                            </Link>
                          </>
                        )}
                        <span className={estilos.menuDivisor} />
                        <button type="button" className={estilos.menuOpcao} onClick={sair}>
                          <Icone nome="logout" tamanho={20} />
                          <span>Sair</span>
                        </button>
                      </Menu.Dropdown>
                    </Menu>
                  ) : (
                    <Link to="/entrar" className={estilos.botaoEntrar}>
                      <span>Entrar</span>
                      <Icone nome="login" tamanho={20} />
                    </Link>
                  )}
                </div>
              </div>

            <div className={estilos.faixa}>
              <div className={estilos.grupoAninhado}>
                <button
                  type="button"
                  className={`${estilos.pillBarra} ${categoriasAbertas ? estilos.pillAtiva : ''}`}
                  aria-expanded={categoriasAbertas}
                  onClick={() => setCategoriasAbertas((atual) => !atual)}
                >
                  <Icone nome="nutrition" tamanho={20} />
                  <span>Categorias</span>
                  <Icone nome={categoriasAbertas ? 'expand_less' : 'expand_more'} tamanho={20} />
                </button>
              </div>

              <div className={estilos.grupoAninhado}>
                <Popover
                  opened={!ehCelular && regiaoAberta}
                  onChange={setRegiaoAberta}
                  position="bottom-start"
                  width={560}
                  radius="lg"
                  shadow="lg"
                >
                  <Popover.Target>
                    <button
                      type="button"
                      className={`${estilos.pillBarra} ${estilos.pillAtiva}`}
                      aria-expanded={regiaoAberta}
                      aria-label={`Região: ${regiao}. Trocar`}
                      onClick={() => setRegiaoAberta((atual) => !atual)}
                    >
                      <Icone nome="location_on" tamanho={20} />
                      <span>{regiao}</span>
                      <Icone nome={regiaoAberta ? 'expand_less' : 'expand_more'} tamanho={20} />
                    </button>
                  </Popover.Target>
                  <Popover.Dropdown className={estilos.popupEscuro}>
                    <div className={estilos.popupCabecalho}>
                      <div>
                        <h3 className={estilos.popupTitulo}>Onde você recebe?</h3>
                        <p className={estilos.popupNota}>
                          Mostramos fornecedores e frete para essa região.
                        </p>
                      </div>
                      <button
                        type="button"
                        className={estilos.fecharPopup}
                        aria-label="Fechar"
                        onClick={() => setRegiaoAberta(false)}
                      >
                        <Icone nome="close" tamanho={20} />
                      </button>
                    </div>
                    {conteudoRegiao}
                  </Popover.Dropdown>
                </Popover>
              </div>

              <div className={estilos.buscaWrapper}>
                <form className={estilos.busca} onSubmit={enviarBusca} role="search">
                  {soOutlet && (
                    <span className={estilos.escopo}>
                      <Icone nome="sell" tamanho={16} />
                      <span>Outlet</span>
                      <button
                        type="button"
                        className={estilos.escopoFechar}
                        aria-label="Remover filtro Outlet"
                        onClick={() => setSoOutlet(false)}
                      >
                        <Icone nome="close" tamanho={16} />
                      </button>
                    </span>
                  )}
                  <input
                    ref={campoBuscaDesktop}
                    type="search"
                    value={termoBusca}
                    onChange={(e) => setTermoBusca(e.target.value)}
                    onFocus={() => setSugestoesAbertas(true)}
                    onBlur={() => window.setTimeout(() => setSugestoesAbertas(false), 180)}
                    placeholder="Buscar frutas, legumes, grãos e muito mais"
                    aria-label="Buscar produtos"
                    className={estilos.buscaInput}
                  />
                  {termoBusca && (
                    <button
                      type="button"
                      className={estilos.buscaLimpar}
                      aria-label="Limpar busca"
                      onClick={() => setTermoBusca('')}
                    >
                      <Icone nome="close" tamanho={20} />
                    </button>
                  )}
                  <button type="submit" className={estilos.buscaEnviar} aria-label="Buscar">
                    <Icone nome="search" tamanho={24} />
                  </button>
                </form>
                {listaSugestoes}
              </div>

              <Popover
                opened={!ehCelular && carrinhoAberto}
                onChange={setCarrinhoAberto}
                position="bottom-end"
                width={380}
                radius="lg"
                shadow="md"
              >
                <Popover.Target>
                  <button
                    type="button"
                    className={`${estilos.carrinhoBotao} ${carrinhoAberto ? estilos.carrinhoAberto : ''}`}
                    aria-label={
                      itensCarrinho > 0 ? `Carrinho, ${itensCarrinho} itens` : 'Carrinho vazio'
                    }
                    aria-expanded={carrinhoAberto}
                    onClick={() => setCarrinhoAberto((atual) => !atual)}
                  >
                    <Icone nome="shopping_cart" tamanho={24} />
                    <Contador valor={itensCarrinho} variante="barra" />
                  </button>
                </Popover.Target>
                <Popover.Dropdown className={estilos.painelCarrinho}>
                  <div className={estilos.painelCabecalho}>
                    <h3 className={estilos.painelTitulo}>
                      Carrinho{itensCarrinho > 0 ? ` · ${itensCarrinho} itens` : ''}
                    </h3>
                    <Botao
                      variante="icone"
                      tamanho="sm"
                      iconeEsquerda="close"
                      aria-label="Fechar carrinho"
                      onClick={() => setCarrinhoAberto(false)}
                    />
                  </div>
                  <MiniCarrinho />
                  {itensCarrinho === 0 && <p className={estilos.painelTexto}>Seu carrinho está vazio.</p>}
                  <Botao
                    variante="principal"
                    tamanho="md"
                    larguraTotal
                    para="/carrinho"
                    onClick={() => setCarrinhoAberto(false)}
                  >
                    Ver carrinho
                  </Botao>
                </Popover.Dropdown>
              </Popover>
            </div>
          </div>
        </div>

        <Collapse expanded={!ehCelular && categoriasAbertas}>
          <div className={estilos.painelCategorias}>
            <div className={`${estilos.container} ${estilos.categoriasGrade}`}>
              <div className={estilos.categoriasLado} role="tablist" aria-label="Categorias">
                {CATEGORIAS.map((cat) => {
                  const ativa = cat.id === categoriaSelecionada.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      role="tab"
                      aria-selected={ativa}
                      className={`${estilos.categoriaItem} ${ativa ? estilos.categoriaAtiva : ''}`}
                      onClick={() => setCategoriaAtiva(cat.id)}
                    >
                      {cat.nome}
                    </button>
                  );
                })}
              </div>

              <div className={estilos.categoriasCorpo}>
                {categoriaSelecionada.grupos.map((grupo) => (
                  <div key={grupo.titulo} className={estilos.categoriaGrupo}>
                    <div className={estilos.categoriaGrupoTopo}>
                      <h3 className={estilos.categoriaGrupoTitulo}>{grupo.titulo}</h3>
                      <Link
                        to={`/busca?categoria=${categoriaSelecionada.id}`}
                        className={estilos.linkClaro}
                        onClick={() => setCategoriasAbertas(false)}
                      >
                        Ver todos <Icone nome="chevron_right" tamanho={16} />
                      </Link>
                    </div>
                    <div className={estilos.subcategorias}>
                      {grupo.itens.map((sub) => (
                        <Link
                          key={sub}
                          to={`/busca?q=${encodeURIComponent(sub)}`}
                          className={estilos.subcategoriaTile}
                          onClick={() => setCategoriasAbertas(false)}
                        >
                          {sub}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Collapse>
      </header>

      {/* Navbar do celular (topo + barra inferior + carrinho flutuante) */}
      <header className={`${estilos.navCelular} ${rolou ? estilos.rolou : ''}`}>
        <div className={estilos.faixaCelular}>
          <button
            type="button"
            className={`${estilos.botaoCategoriasCelular} ${categoriasAbertas ? estilos.pillAtiva : ''}`}
            aria-label="Categorias"
            aria-expanded={categoriasAbertas}
            onClick={() => setCategoriasAbertas(true)}
          >
            <Icone nome="nutrition" tamanho={24} />
          </button>

          <form className={estilos.buscaCelular} onSubmit={enviarBusca} role="search">
            <input
              ref={campoBuscaCelular}
              type="search"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              placeholder="Buscar produtos"
              aria-label="Buscar produtos"
              className={estilos.buscaInput}
            />
            {termoBusca && (
              <button
                type="button"
                className={estilos.buscaLimpar}
                aria-label="Limpar busca"
                onClick={() => setTermoBusca('')}
              >
                <Icone nome="close" tamanho={20} />
              </button>
            )}
            <button type="submit" className={estilos.buscaEnviarCelular} aria-label="Buscar">
              <Icone nome="search" tamanho={20} />
            </button>
          </form>
        </div>
      </header>

      {/* Carrinho flutuante no celular (só aparece quando há itens) */}
      {itensCarrinho > 0 && (
        <Link
          to="/carrinho"
          className={estilos.fabCarrinho}
          aria-label={`Carrinho, ${itensCarrinho} itens`}
        >
          <Icone nome="shopping_cart" tamanho={24} />
          <Contador valor={itensCarrinho} variante="barra" tamanho="lg" />
        </Link>
      )}

      {/* Barra inferior fixa no celular */}
      <nav className={estilos.barraInferior} aria-label="Navegação principal">
        <Link
          to="/"
          className={`${estilos.itemInferior} ${localizacao.pathname === '/' ? estilos.itemInferiorAtivo : ''}`}
          aria-current={localizacao.pathname === '/' ? 'page' : undefined}
        >
          <Icone nome="home" tamanho={24} preenchido={localizacao.pathname === '/'} />
          <span>Início</span>
        </Link>

        <button
          type="button"
          className={`${estilos.itemInferior} ${localizacao.pathname === '/busca' ? estilos.itemInferiorAtivo : ''}`}
          onClick={focarBuscaCelular}
        >
          <Icone nome="search" tamanho={24} preenchido={localizacao.pathname === '/busca'} />
          <span>Busca</span>
        </button>

        <button
          type="button"
          className={`${estilos.itemInferior} ${maisAberto ? estilos.itemInferiorAtivo : ''}`}
          aria-expanded={maisAberto}
          onClick={() => setMaisAberto(true)}
        >
          <Icone nome="menu" tamanho={24} preenchido={maisAberto} />
          <span>Mais</span>
        </button>
      </nav>

      {/* Gaveta "Mais" (escura, exclusiva da navbar celular) */}
      {ehCelular && (
        <Gaveta aberto={maisAberto} aoFechar={() => setMaisAberto(false)} titulo="Mais" escura>
        {usuario ? (
          <Link to="/perfil" className={estilos.perfilLink} onClick={() => setMaisAberto(false)}>
            <Avatar nome={usuario.nome} tamanho={44} />
            <span className={estilos.perfilTexto}>
              <strong>{usuario.nome}</strong>
              <span className={estilos.verPerfil}>
                Ver perfil <Icone nome="chevron_right" tamanho={16} />
              </span>
            </span>
          </Link>
        ) : (
          <Link
            to="/entrar"
            className={`${estilos.botaoEntrar} ${estilos.entrarFull}`}
            onClick={() => setMaisAberto(false)}
          >
            <span>Entrar</span>
            <Icone nome="login" tamanho={20} />
          </Link>
        )}

        <button
          type="button"
          className={estilos.menuOpcao}
          onClick={() => {
            setMaisAberto(false);
            setRegiaoAberta(true);
          }}
        >
          <Icone nome="location_on" tamanho={20} className={estilos.iconeDestaque} />
          <span>
            Entregar em <strong>{regiao}</strong>
          </span>
          <Icone nome="chevron_right" tamanho={20} className={estilos.empurraDireita} />
        </button>

        <Link to="/como-funciona" className={estilos.menuOpcao} onClick={() => setMaisAberto(false)}>
          <Icone nome="info" tamanho={20} />
          <span>Como funciona</span>
          <Icone nome="chevron_right" tamanho={20} className={estilos.empurraDireita} />
        </Link>

        <Link to="/anunciar" className={estilos.menuOpcao} onClick={() => setMaisAberto(false)}>
          <Icone nome="sell" tamanho={20} />
          <span>Anunciar produto</span>
          <Icone nome="chevron_right" tamanho={20} className={estilos.empurraDireita} />
        </Link>

        <Link to="/pedidos" className={estilos.menuOpcao} onClick={() => setMaisAberto(false)}>
          <Icone nome="receipt_long" tamanho={20} />
          <span>Meus pedidos</span>
          <Icone nome="chevron_right" tamanho={20} className={estilos.empurraDireita} />
        </Link>

        <Link to="/favoritos" className={estilos.menuOpcao} onClick={() => setMaisAberto(false)}>
          <Icone nome="favorite" tamanho={20} />
          <span>Favoritos</span>
          <Icone nome="chevron_right" tamanho={20} className={estilos.empurraDireita} />
        </Link>

        {(!usuario || usuario.perfil === 'fornecedor') && (
          <Link
            to="/safra-que-alimenta"
            className={estilos.menuOpcao}
            onClick={() => setMaisAberto(false)}
          >
            <Icone nome="volunteer_activism" tamanho={20} />
            <span>Safra que Alimenta</span>
            <Icone nome="chevron_right" tamanho={20} className={estilos.empurraDireita} />
          </Link>
        )}

        {usuario?.perfil === 'fornecedor' && (
          <>
            <Link to="/anuncios" className={estilos.menuOpcao} onClick={() => setMaisAberto(false)}>
              <Icone nome="inventory_2" tamanho={20} />
              <span>Meus anúncios</span>
              <Icone nome="chevron_right" tamanho={20} className={estilos.empurraDireita} />
            </Link>
            <Link
              to="/pedidos-recebidos"
              className={estilos.menuOpcao}
              onClick={() => setMaisAberto(false)}
            >
              <Icone nome="local_shipping" tamanho={20} />
              <span>Pedidos recebidos</span>
              <Icone nome="chevron_right" tamanho={20} className={estilos.empurraDireita} />
            </Link>
          </>
        )}

        {usuario && (
          <button
            type="button"
            className={estilos.menuOpcao}
            onClick={() => {
              setMaisAberto(false);
              sair();
            }}
          >
            <Icone nome="logout" tamanho={20} />
            <span>Sair</span>
          </button>
        )}
      </Gaveta>
      )}

      {/* Gavetas de Categorias e Região no celular (montadas só abaixo do breakpoint md) */}
      {ehCelular && (
        <>
          <Gaveta
            aberto={categoriasAbertas}
            aoFechar={() => setCategoriasAbertas(false)}
            titulo="Categorias"
            escura
            rodape={
              <Link
                to={`/busca?categoria=${categoriaSelecionada.id}`}
                className={`${estilos.botaoEntrar} ${estilos.entrarFull}`}
                onClick={() => setCategoriasAbertas(false)}
              >
                Ver todos em {categoriaSelecionada.nome.toLowerCase()}
              </Link>
            }
          >
            <div className={estilos.listaCidades}>
              {CATEGORIAS.map((cat) => {
                const ativa = cat.id === categoriaSelecionada.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    className={`${estilos.chipCidade} ${ativa ? estilos.chipCidadeAtiva : ''}`}
                    aria-pressed={ativa}
                    onClick={() => setCategoriaAtiva(cat.id)}
                  >
                    {cat.nome}
                  </button>
                );
              })}
            </div>
            <div className={estilos.subcategoriasCelular}>
              {categoriaSelecionada.grupos[0]?.itens.map((sub) => (
                <Link
                  key={sub}
                  to={`/busca?q=${encodeURIComponent(sub)}`}
                  className={estilos.subcategoriaTile}
                  onClick={() => setCategoriasAbertas(false)}
                >
                  {sub}
                </Link>
              ))}
            </div>
          </Gaveta>

          <Gaveta
            aberto={regiaoAberta}
            aoFechar={() => setRegiaoAberta(false)}
            titulo="Onde você recebe?"
            subtitulo="Mostramos fornecedores e frete para essa região."
            escura
            rodape={
              <button
                type="button"
                className={`${estilos.botaoEntrar} ${estilos.entrarFull}`}
                onClick={() => setRegiaoAberta(false)}
              >
                Confirmar {regiao}
              </button>
            }
          >
            {conteudoRegiao}
          </Gaveta>
        </>
      )}
    </>
  );
}
