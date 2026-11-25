import { Popover, SimpleGrid } from '@mantine/core';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Botao } from '../componentes/Botao.jsx';
import { CardProduto } from '../componentes/CardProduto.jsx';
import { Chip } from '../componentes/Chip.jsx';
import { ControleSegmentado } from '../componentes/ControleSegmentado.jsx';
import { Carregando, EstadoVazio } from '../componentes/Estados.jsx';
import { Icone } from '../componentes/Icone.jsx';
import { Pagina } from '../componentes/layout/Pagina.jsx';
import { MenuOrdenar } from '../componentes/Sobreposicoes.jsx';
import { useAnuncios } from '../contexto/useAnuncios.js';
import { useFavoritos } from '../contexto/useFavoritos.js';
import { CATEGORIAS } from '../dados/categorias.js';
import {
  OPCOES_ORDENACAO,
  filtrarProdutos,
  listarEstados,
  ordenarProdutos,
} from '../logica/busca.js';
import estilos from './Busca.module.css';

const ESCOPO_OPCOES = [
  { valor: 'tudo', rotulo: 'Tudo' },
  { valor: 'outlet', rotulo: 'Só Outlet', icone: 'sell' },
];

const LOTE_INICIAL = 8;
const LOTE_EXTRA = 4;

// Tela de resultados da busca (V06): faixa de filtros sticky, chips com borda cinza 5,
// Ordenar em pill e rolagem infinita com skeleton (sem paginação).
export function Busca() {
  const [parametros, setParametros] = useSearchParams();
  const { produtosAtivos } = useAnuncios();
  const { ehFavorito, alternar } = useFavoritos();

  const q = parametros.get('q') || '';
  const soOutlet = parametros.get('outlet') === '1';
  const categoriaId = parametros.get('categoria') || '';
  const uf = parametros.get('uf') || '';
  const organico = parametros.get('organico') === '1';
  const ordem = parametros.get('ordem') || 'relevantes';

  const [catAberto, setCatAberto] = useState(false);
  const [ufAberto, setUfAberto] = useState(false);
  const [visiveis, setVisiveis] = useState(LOTE_INICIAL);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const sentinelaRef = useRef(null);

  const estados = useMemo(() => listarEstados(produtosAtivos), [produtosAtivos]);

  const filtrados = useMemo(
    () => filtrarProdutos(produtosAtivos, { q, soOutlet, categoriaId, uf, organico }),
    [produtosAtivos, q, soOutlet, categoriaId, uf, organico]
  );

  const ordenados = useMemo(
    () => ordenarProdutos(filtrados, ordem, 'São Paulo - SP'),
    [filtrados, ordem]
  );

  const temMais = visiveis < ordenados.length;

  // Atualiza um parâmetro na URL e reinicia a contagem da rolagem infinita.
  function alterarParametro(chave, valor) {
    const proximo = new URLSearchParams(parametros);
    if (valor) proximo.set(chave, valor);
    else proximo.delete(chave);
    setParametros(proximo, { replace: true });
    setVisiveis(LOTE_INICIAL);
  }

  // Remove todos os filtros ativos de uma vez.
  function limparFiltros() {
    setParametros({}, { replace: true });
    setVisiveis(LOTE_INICIAL);
  }

  // Carrega mais cards conforme o sentinela entra na tela.
  useEffect(() => {
    const alvo = sentinelaRef.current;
    if (!alvo || !temMais) return undefined;

    const observador = new IntersectionObserver(
      (entradas) => {
        if (!entradas[0]?.isIntersecting) return;
        setCarregandoMais(true);
        window.setTimeout(() => {
          setVisiveis((atual) => atual + LOTE_EXTRA);
          setCarregandoMais(false);
        }, 350);
      },
      { rootMargin: '120px' }
    );

    observador.observe(alvo);
    return () => observador.disconnect();
  }, [temMais, ordenados.length]);

  const categoriaAtual = CATEGORIAS.find((c) => c.id === categoriaId);
  const filtrosAtivos = [];
  if (soOutlet) filtrosAtivos.push({ id: 'outlet', rotulo: 'Só Outlet' });
  if (categoriaAtual) filtrosAtivos.push({ id: 'categoria', rotulo: categoriaAtual.nome });
  if (uf) filtrosAtivos.push({ id: 'uf', rotulo: `Estado: ${uf}` });
  if (organico) filtrosAtivos.push({ id: 'organico', rotulo: 'Orgânico' });

  const titulo = q
    ? `Resultados para "${q}"`
    : soOutlet
      ? 'Ofertas do Outlet'
      : categoriaAtual
        ? categoriaAtual.nome
        : 'Todos os produtos';

  return (
    <Pagina>
      <div className={estilos.pagina}>
        {/* Faixa de filtros sticky abaixo da navbar */}
        <section className={estilos.faixaFiltros} aria-label="Filtros da busca">
          <div className={estilos.trilhoEsquerda}>
            <ControleSegmentado
              opcoes={ESCOPO_OPCOES}
              valor={soOutlet ? 'outlet' : 'tudo'}
              tamanho="sm"
              rotulo="Buscar em tudo ou só Outlet"
              aoAlterar={(valor) => alterarParametro('outlet', valor === 'outlet' ? '1' : '')}
            />

            <Popover
              opened={catAberto}
              onChange={setCatAberto}
              position="bottom-start"
              width={240}
              radius="lg"
              shadow="md"
            >
              <Popover.Target>
                <Chip
                  comBorda
                  ativo={Boolean(categoriaId)}
                  iconeDireita={catAberto ? 'expand_less' : 'expand_more'}
                  aoClicar={() => setCatAberto((a) => !a)}
                >
                  {categoriaAtual ? categoriaAtual.nome : 'Categoria'}
                </Chip>
              </Popover.Target>
              <Popover.Dropdown className={estilos.popoverLista}>
                <button
                  type="button"
                  className={`${estilos.opcaoMenu} ${!categoriaId ? estilos.opcaoAtiva : ''}`}
                  onClick={() => {
                    alterarParametro('categoria', '');
                    setCatAberto(false);
                  }}
                >
                  Todas as categorias
                </button>
                {CATEGORIAS.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`${estilos.opcaoMenu} ${categoriaId === cat.id ? estilos.opcaoAtiva : ''}`}
                    onClick={() => {
                      alterarParametro('categoria', cat.id);
                      setCatAberto(false);
                    }}
                  >
                    {cat.nome}
                  </button>
                ))}
              </Popover.Dropdown>
            </Popover>

            <Popover
              opened={ufAberto}
              onChange={setUfAberto}
              position="bottom-start"
              width={200}
              radius="lg"
              shadow="md"
            >
              <Popover.Target>
                <Chip
                  comBorda
                  ativo={Boolean(uf)}
                  iconeDireita={ufAberto ? 'expand_less' : 'expand_more'}
                  aoClicar={() => setUfAberto((a) => !a)}
                >
                  {uf ? `Região: ${uf}` : 'Região'}
                </Chip>
              </Popover.Target>
              <Popover.Dropdown className={estilos.popoverLista}>
                <button
                  type="button"
                  className={`${estilos.opcaoMenu} ${!uf ? estilos.opcaoAtiva : ''}`}
                  onClick={() => {
                    alterarParametro('uf', '');
                    setUfAberto(false);
                  }}
                >
                  Todos os estados
                </button>
                {estados.map((sigla) => (
                  <button
                    key={sigla}
                    type="button"
                    className={`${estilos.opcaoMenu} ${uf === sigla ? estilos.opcaoAtiva : ''}`}
                    onClick={() => {
                      alterarParametro('uf', sigla);
                      setUfAberto(false);
                    }}
                  >
                    {sigla}
                  </button>
                ))}
              </Popover.Dropdown>
            </Popover>

            <Chip
              comBorda
              ativo={organico}
              aoClicar={() => alterarParametro('organico', organico ? '' : '1')}
            >
              Orgânico
            </Chip>
          </div>

          <MenuOrdenar
            opcoes={OPCOES_ORDENACAO}
            valor={ordem}
            aoAlterar={(valor) => alterarParametro('ordem', valor)}
          />
        </section>

        {/* Cabeçalho com contagem e chips ativos */}
        <header className={estilos.cabecalho}>
          <div>
            <h1 className={estilos.titulo}>{titulo}</h1>
            <p className={estilos.contagem}>
              {ordenados.length === 1
                ? '1 produto encontrado'
                : `${ordenados.length} produtos encontrados`}
            </p>
          </div>

          {filtrosAtivos.length > 0 && (
            <div className={estilos.ativos}>
              {filtrosAtivos.map((filtro) => (
                <Chip
                  key={filtro.id}
                  ativo
                  comBorda
                  aoRemover={() => alterarParametro(filtro.id, '')}
                  aria-label={`Remover filtro ${filtro.rotulo}`}
                >
                  {filtro.rotulo}
                </Chip>
              ))}
              <Botao variante="terciario" tamanho="sm" onClick={limparFiltros}>
                Limpar filtros
              </Botao>
            </div>
          )}
        </header>

        {/* Grade de resultados ou estado vazio */}
        {ordenados.length === 0 ? (
          <EstadoVazio
            icone="search_off"
            titulo={q ? `Nenhum resultado para "${q}"` : 'Nenhum produto encontrado'}
            descricao="Tire um filtro ou confira a grafia para ver mais ofertas."
            filtrosAtivos={filtrosAtivos}
            aoRemoverFiltro={(id) => alterarParametro(id, '')}
            textoAcao="Limpar filtros"
            aoClicarAcao={limparFiltros}
          />
        ) : (
          <>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
              {ordenados.slice(0, visiveis).map((produto) => (
                <CardProduto
                  key={produto.id}
                  produto={produto}
                  favoritado={ehFavorito(produto.id)}
                  aoAlternarFavorito={() => alternar(produto)}
                />
              ))}
              {carregandoMais &&
                [1, 2, 3, 4].map((n) => <CardProduto key={`skeleton-${n}`} carregando />)}
            </SimpleGrid>

            {temMais ? (
              <div ref={sentinelaRef} className={estilos.sentinela}>
                <Carregando emLinha mensagem="Carregando mais produtos" />
              </div>
            ) : (
              <div className={estilos.fimLista}>
                <div className={estilos.fimTexto}>
                  <Icone nome="check_circle" tamanho={20} className={estilos.iconeFim} />
                  <div>
                    <p className={estilos.fimTitulo}>
                      Você viu os {ordenados.length} {ordenados.length === 1 ? 'produto' : 'produtos'}
                    </p>
                    <p className={estilos.fimSub}>Não achou o que queria? Tire um filtro ou mude a região.</p>
                  </div>
                </div>
                <Botao
                  variante="secundario"
                  tamanho="sm"
                  iconeEsquerda="arrow_upward"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  Voltar ao topo
                </Botao>
              </div>
            )}
          </>
        )}
      </div>
    </Pagina>
  );
}
