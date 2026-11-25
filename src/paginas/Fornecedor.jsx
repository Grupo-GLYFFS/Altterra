import { SimpleGrid } from '@mantine/core';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { NotaCompacta, ResumoAvaliacoes } from '../componentes/Avaliacao.jsx';
import { Avatar } from '../componentes/Avatar.jsx';
import { Botao } from '../componentes/Botao.jsx';
import { CampoTexto } from '../componentes/Campo.jsx';
import { CardProduto } from '../componentes/CardProduto.jsx';
import { Chip } from '../componentes/Chip.jsx';
import { EstadoVazio } from '../componentes/Estados.jsx';
import { Icone } from '../componentes/Icone.jsx';
import { Pagina } from '../componentes/layout/Pagina.jsx';
import { Selo } from '../componentes/Selo.jsx';
import { MenuOrdenar } from '../componentes/Sobreposicoes.jsx';
import { useAnuncios } from '../contexto/useAnuncios.js';
import { useDoacoes } from '../contexto/useDoacoes.js';
import { useFavoritos } from '../contexto/useFavoritos.js';
import { OPCOES_ORDENACAO, filtrarProdutos, ordenarProdutos } from '../logica/busca.js';
import { caminhoImagem } from '../logica/imagens.js';
import estilos from './Fornecedor.module.css';

// Loja do fornecedor (V03): capa, logo centralizado, selo de doação só quando > 0 e K4 sem cabeçalho do fornecedor.
export function Fornecedor() {
  const { id } = useParams();
  const { buscarFornecedor, produtosAtivos } = useAnuncios();
  const { ehFavorito, alternar } = useFavoritos();
  const { kgDoadosPor } = useDoacoes();

  const fornecedor = buscarFornecedor(id);
  const [buscaLoja, setBuscaLoja] = useState('');
  const [soOutlet, setSoOutlet] = useState(false);
  const [soOrganico, setSoOrganico] = useState(false);
  const [ordem, setOrdem] = useState('relevantes');
  const [lojaFavorita, setLojaFavorita] = useState(false);

  const produtosLoja = useMemo(
    () => (fornecedor ? produtosAtivos.filter((p) => p.fornecedor?.id === fornecedor.id) : []),
    [fornecedor, produtosAtivos]
  );

  const filtrados = useMemo(() => {
    const lista = filtrarProdutos(produtosLoja, {
      q: buscaLoja,
      soOutlet,
      organico: soOrganico,
    });
    return ordenarProdutos(lista, ordem);
  }, [produtosLoja, buscaLoja, soOutlet, soOrganico, ordem]);

  if (!fornecedor) {
    return (
      <Pagina>
        <EstadoVazio
          icone="storefront"
          titulo="Fornecedor não encontrado"
          descricao="Esse produtor pode não estar mais ativo na plataforma."
          textoAcao="Voltar para a busca"
          paraAcao="/busca"
        />
      </Pagina>
    );
  }

  const produtosOutlet = produtosLoja.filter((p) => p.outlet);
  const kgDoados = kgDoadosPor(fornecedor.id) || fornecedor.kgDoados || 0;

  return (
    <Pagina>
      <div className={estilos.pagina}>
        {/* Cabeçalho com capa e identidade centralizada */}
        <section className={estilos.cabecalho} aria-label="Dados do fornecedor">
          <div className={estilos.capa}>
            <img
              src={caminhoImagem('tomate-carmem-4.webp')}
              alt=""
              className={estilos.capaFoto}
              aria-hidden="true"
            />
          </div>

          <div className={estilos.identidade}>
            <div className={estilos.avatarWrap}>
              <Avatar src={fornecedor.logo} nome={fornecedor.nome} tamanho={96} />
            </div>

            <h1 className={estilos.nome}>
              <span>{fornecedor.nome}</span>
              {fornecedor.verificado && (
                <Icone nome="verified" tamanho={24} preenchido className={estilos.verificado} />
              )}
            </h1>

            <p className={estilos.meta}>
              {fornecedor.tipo} · {fornecedor.cidade} · Desde {fornecedor.desde || 2020}
            </p>

            <div className={estilos.metricasLinha}>
              <NotaCompacta nota={fornecedor.nota} totalAvaliacoes={fornecedor.totalAvaliacoes} />
              <span>· Responde em cerca de {fornecedor.respostaHoras || 4} h</span>
              <span>· {(fornecedor.pedidosEntregues || 0).toLocaleString('pt-BR')} pedidos entregues</span>
            </div>

            {kgDoados > 0 && (
              <Selo variante="doador">
                Doou {kgDoados.toLocaleString('pt-BR')} kg pelo Safra que Alimenta
              </Selo>
            )}

            <div className={estilos.acoes}>
              {/* Botão sem função de propósito (regra §9) */}
              <Botao variante="principal" tamanho="sm" iconeEsquerda="chat" onClick={() => {}}>
                Falar com o fornecedor
              </Botao>
              <Botao
                variante="secundario"
                tamanho="sm"
                iconeEsquerda="favorite"
                iconePreenchido={lojaFavorita}
                aria-pressed={lojaFavorita}
                onClick={() => setLojaFavorita((atual) => !atual)}
              >
                {lojaFavorita ? 'Favoritado' : 'Favoritar'}
              </Botao>
            </div>
          </div>
        </section>

        {/* Catálogo da loja (K4 sem cabeçalho do fornecedor) */}
        <section className={estilos.secao} aria-labelledby="titulo-produtos-loja">
          <div className={estilos.topoProdutos}>
            <div>
              <h2 id="titulo-produtos-loja" className={estilos.tituloSecao}>
                Produtos
              </h2>
              <p className={estilos.meta}>{produtosLoja.length} produtos à venda</p>
            </div>
            <div className={estilos.buscaLoja}>
              <CampoTexto
                placeholder={`Buscar nos ${produtosLoja.length} produtos da loja`}
                aria-label="Buscar produtos da loja"
                value={buscaLoja}
                onChange={(e) => setBuscaLoja(e.target.value)}
              />
            </div>
          </div>

          <div className={estilos.barraFiltros}>
            <div className={estilos.chips}>
              <Chip
                comBorda
                ativo={!soOutlet && !soOrganico}
                aoClicar={() => {
                  setSoOutlet(false);
                  setSoOrganico(false);
                }}
              >
                Todos
              </Chip>
              <Chip comBorda ativo={soOrganico} aoClicar={() => setSoOrganico((v) => !v)}>
                Orgânicos
              </Chip>
              {produtosOutlet.length > 0 && (
                <Chip comBorda ativo={soOutlet} aoClicar={() => setSoOutlet((v) => !v)}>
                  Só Outlet
                </Chip>
              )}
            </div>
            <MenuOrdenar opcoes={OPCOES_ORDENACAO} valor={ordem} aoAlterar={setOrdem} />
          </div>

          {filtrados.length === 0 ? (
            <EstadoVazio
              icone="search_off"
              titulo="Nenhum produto encontrado nesta loja"
              textoAcao="Limpar busca"
              aoClicarAcao={() => {
                setBuscaLoja('');
                setSoOutlet(false);
                setSoOrganico(false);
              }}
            />
          ) : (
            <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
              {filtrados.map((produto) => (
                <CardProduto
                  key={produto.id}
                  produto={produto}
                  ocultarFornecedor
                  favoritado={ehFavorito(produto.id)}
                  aoAlternarFavorito={() => alternar(produto)}
                />
              ))}
            </SimpleGrid>
          )}
        </section>

        {/* Seção No Outlet (só quando houver itens) */}
        {produtosOutlet.length > 0 && (
          <section className={estilos.secao} aria-labelledby="titulo-outlet-loja">
            <h2 id="titulo-outlet-loja" className={estilos.tituloSecao}>
              No Outlet
            </h2>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
              {produtosOutlet.map((produto) => (
                <CardProduto
                  key={produto.id}
                  produto={produto}
                  ocultarFornecedor
                  favoritado={ehFavorito(produto.id)}
                  aoAlternarFavorito={() => alternar(produto)}
                />
              ))}
            </SimpleGrid>
          </section>
        )}

        {/* Avaliações */}
        <section className={estilos.secao} aria-labelledby="titulo-aval-loja">
          <h2 id="titulo-aval-loja" className={estilos.tituloSecao}>
            Avaliações
          </h2>
          {fornecedor.nota && fornecedor.totalAvaliacoes > 0 ? (
            <div className={estilos.blocoAvaliacoes}>
              <ResumoAvaliacoes
                nota={fornecedor.nota}
                totalAvaliacoes={fornecedor.totalAvaliacoes}
                distribuicao={{
                  5: Math.max(1, fornecedor.totalAvaliacoes - 2),
                  4: 2,
                  3: 0,
                  2: 0,
                  1: 0,
                }}
              />
              <div>
                <Botao variante="secundario" tamanho="sm" onClick={() => {}}>
                  Ver as {fornecedor.totalAvaliacoes} avaliações
                </Botao>
              </div>
            </div>
          ) : (
            <EstadoVazio
              icone="star"
              titulo={`${fornecedor.nome} ainda não tem avaliações`}
              descricao="As avaliações aparecem depois das primeiras entregas."
            />
          )}
        </section>

        {/* Sobre a empresa */}
        <section className={estilos.secao} aria-labelledby="titulo-sobre-loja">
          <h2 id="titulo-sobre-loja" className={estilos.tituloSecao}>
            Sobre a empresa
          </h2>
          <div className={estilos.cardSobre}>
            <p className={estilos.descricao}>
              {fornecedor.descricao ||
                `${fornecedor.nome} atua em ${fornecedor.cidade} com fornecimento direto para empresas.`}
            </p>
            <dl className={estilos.dadosEmpresa}>
              <div>
                <dt>Tipo</dt>
                <dd>{fornecedor.tipo}</dd>
              </div>
              <div>
                <dt>Cidade</dt>
                <dd>{fornecedor.cidade}</dd>
              </div>
              <div>
                <dt>Prazo médio</dt>
                <dd>{fornecedor.prazoDias || 2} dias úteis</dd>
              </div>
              <div>
                <dt>Pagamento</dt>
                <dd>Pix ou boleto bancário</dd>
              </div>
            </dl>
          </div>
        </section>
      </div>
    </Pagina>
  );
}
