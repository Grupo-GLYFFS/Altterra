import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Estrelas, ResumoAvaliacoes } from '../componentes/Avaliacao.jsx';
import { Avatar } from '../componentes/Avatar.jsx';
import { Botao } from '../componentes/Botao.jsx';
import { CardProduto } from '../componentes/CardProduto.jsx';
import { Carrossel } from '../componentes/Carrossel.jsx';
import { EstadoVazio } from '../componentes/Estados.jsx';
import { Icone } from '../componentes/Icone.jsx';
import { ImagemSegura } from '../componentes/ImagemSegura.jsx';
import { IndiceProduto } from '../componentes/IndiceProduto.jsx';
import { Pagina } from '../componentes/layout/Pagina.jsx';
import { BlocoCompra } from '../componentes/produto/BlocoCompra.jsx';
import { Selo } from '../componentes/Selo.jsx';
import { useToast } from '../componentes/useToast.js';
import { useAnuncios } from '../contexto/useAnuncios.js';
import { useCarrinho } from '../contexto/useCarrinho.js';
import { useDoacoes } from '../contexto/useDoacoes.js';
import { useFavoritos } from '../contexto/useFavoritos.js';
import { formatarReais } from '../logica/formatos.js';
import { caminhoImagem } from '../logica/imagens.js';
import { precoPorQuantidade } from '../logica/preco.js';
import estilos from './Produto.module.css';

const SECOES_INDICE = [
  { id: 'sobre', rotulo: 'Sobre' },
  { id: 'localizacao', rotulo: 'Localização' },
  { id: 'avaliacoes', rotulo: 'Avaliações' },
  { id: 'fornecedor', rotulo: 'Fornecedor' },
];

const AVALIACOES_EXEMPLO = [
  {
    id: 'av-1',
    autor: 'Mercearia Bom Preço',
    meta: 'São Roque - SP · comprou 200 kg',
    data: '18/11/2026',
    nota: 5,
    texto: 'Chegou firme, sem amassados na caixa. O calibre bateu com o anunciado e a nota fiscal veio junto.',
  },
  {
    id: 'av-2',
    autor: 'Restaurante Sabor da Serra',
    meta: 'Cotia - SP · comprou 80 kg',
    data: '12/11/2026',
    nota: 5,
    texto: 'Segundo pedido com o fornecedor. Maturação uniforme e entrega antes das 7h, como combinado.',
  },
];

// Página do produto (V01 no layout da Fase 4): 50% informações à esquerda e compra sticky à direita.
export function Produto() {
  const { id } = useParams();
  const navegar = useNavigate();
  const { buscarProduto, produtosAtivos } = useAnuncios();
  const { adicionar } = useCarrinho();
  const { ehFavorito, alternar } = useFavoritos();
  const { kgDoadosPor } = useDoacoes();
  const { mostrarToast } = useToast();

  const produto = buscarProduto(id);
  const [quantidade, setQuantidade] = useState(() => produto?.pedidoMinimo || 50);
  const [fotoAtiva, setFotoAtiva] = useState(0);
  const [secaoAtiva, setSecaoAtiva] = useState('sobre');

  if (!produto) {
    return (
      <Pagina>
        <EstadoVazio
          icone="inventory_2"
          titulo="Produto não encontrado"
          descricao="Esse anúncio pode ter sido pausado ou removido pelo fornecedor."
          textoAcao="Voltar para a busca"
          paraAcao="/busca"
        />
      </Pagina>
    );
  }

  const fotos = produto.imagens?.length ? produto.imagens : produto.imagem ? [produto.imagem] : [];
  const quantidadeSegura = Math.max(
    produto.pedidoMinimo,
    Math.min(produto.estoque || produto.pedidoMinimo, quantidade)
  );
  const precoAtual = precoPorQuantidade(produto, quantidadeSegura);
  const fornecedor = produto.fornecedor;
  const kgDoados = fornecedor ? kgDoadosPor(fornecedor.id) || fornecedor.kgDoados || 0 : 0;
  const similares = produtosAtivos
    .filter((p) => p.id !== produto.id && p.categoriaId === produto.categoriaId)
    .slice(0, 6);

  // Rola até a seção escolhida no índice fixo do produto.
  function irParaSecao(secaoId) {
    setSecaoAtiva(secaoId);
    const el = document.getElementById(`secao-${secaoId}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Adiciona ao carrinho e dispara o toast com miniatura.
  function adicionarAoCarrinho() {
    adicionar(produto, quantidadeSegura);
    mostrarToast({
      titulo: 'Adicionado ao carrinho',
      subtitulo: `${produto.nome} · ${quantidadeSegura.toLocaleString('pt-BR')} ${produto.unidade}`,
      imagem: produto.imagem,
    });
  }

  // Adiciona ao carrinho e segue direto para a finalização.
  function comprarAgora() {
    adicionar(produto, quantidadeSegura);
    navegar('/finalizar');
  }

  const especificacoes = [
    { rotulo: 'Categoria', valor: produto.categoria },
    { rotulo: 'Variedade', valor: produto.variedade || 'Padrão comercial' },
    { rotulo: 'Calibre', valor: produto.calibre || 'Selecionado na colheita' },
    { rotulo: 'Embalagem', valor: produto.embalagem || 'Caixa de transporte agrícola' },
    { rotulo: 'Cultivo', valor: produto.cultivo || 'Produção regional acompanhada' },
  ];

  return (
    <Pagina>
      <div className={estilos.pagina}>
        <div className={estilos.gradePrincipal}>
          {/* Coluna esquerda: galeria, índice e seções informativas */}
          <div className={estilos.colunaEsquerda}>
            <section className={estilos.galeria} aria-label="Fotos do produto">
              <div className={estilos.fotoPrincipal}>
                <ImagemSegura
                  src={fotos[fotoAtiva] || ''}
                  alt={produto.nome}
                  className={estilos.imagem}
                  fallback={
                    <div className={estilos.semFoto}>
                      <Icone nome="image" tamanho={32} />
                      <span>Foto em breve</span>
                    </div>
                  }
                />
                <Botao
                  variante="icone"
                  tamanho="sm"
                  sobreFoto
                  iconeEsquerda="favorite"
                  iconePreenchido={ehFavorito(produto.id)}
                  aria-label={
                    ehFavorito(produto.id)
                      ? `Remover ${produto.nome} dos favoritos`
                      : `Adicionar ${produto.nome} aos favoritos`
                  }
                  aria-pressed={ehFavorito(produto.id)}
                  className={estilos.favorito}
                  onClick={() => alternar(produto)}
                />
              </div>

              {fotos.length > 1 && (
                <div className={estilos.miniaturas}>
                  {fotos.map((src, indice) => (
                    <button
                      key={src}
                      type="button"
                      className={`${estilos.miniatura} ${indice === fotoAtiva ? estilos.miniaturaAtiva : ''}`}
                      onClick={() => setFotoAtiva(indice)}
                      aria-label={`Ver foto ${indice + 1} de ${produto.nome}`}
                    >
                      <ImagemSegura
                        src={src}
                        alt=""
                        className={estilos.imagem}
                        fallback={
                          <div className={estilos.semFoto}>
                            <Icone nome="image" tamanho={20} />
                          </div>
                        }
                      />
                    </button>
                  ))}
                </div>
              )}
            </section>

            <IndiceProduto
              secoes={SECOES_INDICE}
              ativa={secaoAtiva}
              aoSelecionar={irParaSecao}
              preco={formatarReais(precoAtual)}
              unidade={produto.unidade}
              aoAdicionar={produto.estoque > 0 ? adicionarAoCarrinho : undefined}
              className={estilos.indiceSticky}
            />

            {/* Sobre o produto (sem tabela de preço) */}
            <section id="secao-sobre" className={estilos.secao} aria-labelledby="h-sobre">
              <h2 id="h-sobre" className={estilos.tituloSecao}>
                Sobre o produto
              </h2>
              <p className={estilos.texto}>
                {produto.descricao ||
                  `${produto.nome} colhido sob demanda e separado em lotes padronizados para mercados, restaurantes e cozinhas industriais.`}
              </p>

              <h3 className={estilos.subtituloSecao}>Especificações e cultivo</h3>
              <dl className={estilos.tabelaEspec}>
                {especificacoes.map((item) => (
                  <div key={item.rotulo} className={estilos.linhaEspec}>
                    <dt>{item.rotulo}</dt>
                    <dd>{item.valor}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {/* Localização */}
            <section id="secao-localizacao" className={estilos.secao} aria-labelledby="h-loc">
              <h2 id="h-loc" className={estilos.tituloSecao}>
                Onde fica e até onde entrega
              </h2>
              <div className={estilos.mapaBox}>
                <ImagemSegura
                  src={caminhoImagem('tomate-carmem-4.webp')}
                  alt=""
                  className={estilos.mapaFoto}
                  aria-hidden="true"
                />
                <div className={estilos.mapaSelo}>
                  <Icone nome="location_on" tamanho={20} />
                  <span>{fornecedor?.cidade || 'São Paulo - SP'}</span>
                </div>
              </div>
              <p className={estilos.texto}>
                Entrega na região de {fornecedor?.cidade || 'São Paulo - SP'} e cidades vizinhas em
                até {fornecedor?.prazoDias || 2} dias úteis. Retirada direta na origem sem frete.
              </p>
            </section>

            {/* Avaliações */}
            <section id="secao-avaliacoes" className={estilos.secao} aria-labelledby="h-aval">
              <h2 id="h-aval" className={estilos.tituloSecao}>
                Avaliações
              </h2>
              {produto.nota ? (
                <>
                  <ResumoAvaliacoes
                    nota={produto.nota}
                    totalAvaliacoes={produto.totalAvaliacoes}
                    distribuicao={{ 5: Math.max(1, produto.totalAvaliacoes - 2), 4: 2, 3: 0, 2: 0, 1: 0 }}
                  />
                  <div className={estilos.listaAvaliacoes}>
                    {AVALIACOES_EXEMPLO.map((av) => (
                      <article key={av.id} className={estilos.itemAvaliacao}>
                        <div className={estilos.avalTopo}>
                          <Avatar nome={av.autor} tamanho={32} />
                          <div>
                            <p className={estilos.avalAutor}>{av.autor}</p>
                            <p className={estilos.avalMeta}>{av.meta}</p>
                          </div>
                          <span className={estilos.avalData}>{av.data}</span>
                        </div>
                        <Estrelas nota={av.nota} tamanho={16} mostrarNumero={false} />
                        <p className={estilos.texto}>{av.texto}</p>
                      </article>
                    ))}
                  </div>
                  {/* Botão sem função de propósito (regra §9) */}
                  <div>
                    <Botao variante="secundario" tamanho="sm" onClick={() => {}}>
                      Ver as {produto.totalAvaliacoes} avaliações
                    </Botao>
                  </div>
                </>
              ) : (
                <EstadoVazio
                  icone="star"
                  titulo="Sem avaliações ainda"
                  descricao="As avaliações aparecem depois das primeiras entregas deste produto."
                />
              )}
            </section>

            {/* Fornecedor */}
            {fornecedor && (
              <section id="secao-fornecedor" className={estilos.secao} aria-labelledby="h-forn">
                <h2 id="h-forn" className={estilos.tituloSecao}>
                  Quem vende
                </h2>
                <div className={estilos.cardFornecedor}>
                  <Avatar src={fornecedor.logo} nome={fornecedor.nome} tamanho={56} />
                  <h3 className={estilos.nomeFornecedor}>
                    <span>{fornecedor.nome}</span>
                    {fornecedor.verificado && (
                      <Icone nome="verified" tamanho={20} preenchido className={estilos.verificado} />
                    )}
                  </h3>
                  <p className={estilos.avalMeta}>
                    {fornecedor.tipo} · {fornecedor.cidade}
                  </p>
                  <div className={estilos.metricasFornecedor}>
                    <div>
                      <span className={estilos.avalMeta}>Nota</span>
                      <strong>{fornecedor.nota ? fornecedor.nota.toFixed(1).replace('.', ',') : '—'}</strong>
                    </div>
                    <div>
                      <span className={estilos.avalMeta}>Resposta</span>
                      <strong>{fornecedor.respostaHoras || 4} h</strong>
                    </div>
                    <div>
                      <span className={estilos.avalMeta}>Pedidos</span>
                      <strong>{(fornecedor.pedidosEntregues || 0).toLocaleString('pt-BR')}</strong>
                    </div>
                  </div>
                  {kgDoados > 0 && (
                    <Selo variante="doador">
                      Doou {kgDoados.toLocaleString('pt-BR')} kg pelo Safra que Alimenta
                    </Selo>
                  )}
                  <Botao
                    variante="secundario"
                    tamanho="md"
                    larguraTotal
                    iconeEsquerda="storefront"
                    para={`/fornecedor/${fornecedor.id}`}
                  >
                    Ver loja
                  </Botao>
                </div>
              </section>
            )}
          </div>

          {/* Coluna direita sticky: compra */}
          <div className={estilos.colunaDireita}>
            <BlocoCompra
              produto={produto}
              quantidade={quantidadeSegura}
              aoAlterarQuantidade={setQuantidade}
              aoAdicionar={adicionarAoCarrinho}
              aoComprarAgora={comprarAgora}
            />
          </div>
        </div>

        {similares.length > 0 && (
          <Carrossel titulo="Produtos similares" textoAcao="Ver todos" paraAcao="/busca">
            {similares.map((item) => (
              <CardProduto
                key={item.id}
                produto={item}
                favoritado={ehFavorito(item.id)}
                aoAlternarFavorito={() => alternar(item)}
              />
            ))}
          </Carrossel>
        )}
      </div>
    </Pagina>
  );
}
