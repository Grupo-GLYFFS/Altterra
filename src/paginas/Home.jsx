import { Link } from 'react-router-dom';
import { Botao } from '../componentes/Botao.jsx';
import { CardProduto } from '../componentes/CardProduto.jsx';
import { Carrossel } from '../componentes/Carrossel.jsx';
import { Icone } from '../componentes/Icone.jsx';
import { Pagina } from '../componentes/layout/Pagina.jsx';
import { useAnuncios } from '../contexto/useAnuncios.js';
import { useDoacoes } from '../contexto/useDoacoes.js';
import { useFavoritos } from '../contexto/useFavoritos.js';
import { LINK_VIDEO } from '../dados/video.js';
import { ordenarProdutos } from '../logica/busca.js';
import { caminhoImagem } from '../logica/imagens.js';
import estilos from './Home.module.css';

// Página inicial do Altterra: banner do vídeo de 3 min, quatro carrosséis K4 e faixa Safra que Alimenta.
export function Home() {
  const { produtosAtivos } = useAnuncios();
  const { ehFavorito, alternar } = useFavoritos();
  const { totais } = useDoacoes();

  const pertoDeVoce = ordenarProdutos(produtosAtivos, 'mais-perto', 'São Paulo - SP').slice(0, 8);
  const ofertasOutlet = produtosAtivos.filter((p) => p.outlet);
  const legumes = produtosAtivos.filter((p) => p.categoriaId === 'legumes');
  const certificados = produtosAtivos.filter((p) => p.organico || p.fornecedor?.verificado);

  // Monta os cards K4 ligados ao estado de favoritos.
  function renderizarCards(lista) {
    return lista.map((produto) => (
      <CardProduto
        key={produto.id}
        produto={produto}
        favoritado={ehFavorito(produto.id)}
        aoAlternarFavorito={() => alternar(produto)}
      />
    ));
  }

  return (
    <Pagina>
      <div className={estilos.pilha}>
        {/* Banner do vídeo de apresentação */}
        <section className={estilos.banner} aria-labelledby="titulo-video">
          <img
            src={caminhoImagem('tomate-carmem-5.webp')}
            alt=""
            className={estilos.bannerFoto}
            aria-hidden="true"
          />
          <div className={estilos.bannerVeu} aria-hidden="true" />
          <div className={estilos.bannerConteudo}>
            <div className={estilos.bannerTexto}>
              <h1 id="titulo-video" className={estilos.bannerTitulo}>
                O Altterra em 3 minutos
              </h1>
              <p className={estilos.bannerDescricao}>
                Do pedido na cooperativa à doação para uma instituição: o vídeo do projeto mostra a
                plataforma funcionando.
              </p>
              <a
                href={LINK_VIDEO}
                target="_blank"
                rel="noopener noreferrer"
                className={estilos.botaoClaro}
              >
                <Icone nome="play_arrow" tamanho={20} preenchido />
                <span>Assistir ao vídeo</span>
              </a>
            </div>
            <a
              href={LINK_VIDEO}
              target="_blank"
              rel="noopener noreferrer"
              className={estilos.circuloPlay}
              aria-label="Assistir ao vídeo O Altterra em 3 minutos"
            >
              <Icone nome="play_arrow" tamanho={32} preenchido />
            </a>
          </div>
        </section>

        <Carrossel titulo="Perto de você" textoAcao="Ver todos" paraAcao="/busca?ordem=mais-perto">
          {renderizarCards(pertoDeVoce)}
        </Carrossel>

        {ofertasOutlet.length > 0 && (
          <Carrossel titulo="Ofertas do Outlet" textoAcao="Ver todos" paraAcao="/busca?outlet=1">
            {renderizarCards(ofertasOutlet)}
          </Carrossel>
        )}

        {legumes.length > 0 && (
          <Carrossel titulo="Legumes" textoAcao="Ver todos" paraAcao="/busca?categoria=legumes">
            {renderizarCards(legumes)}
          </Carrossel>
        )}

        {certificados.length > 0 && (
          <Carrossel
            titulo="Produtores certificados"
            textoAcao="Ver todos"
            paraAcao="/busca?organico=1"
          >
            {renderizarCards(certificados)}
          </Carrossel>
        )}

        {/* Faixa escura do programa Safra que Alimenta */}
        <section className={estilos.banner} aria-labelledby="titulo-safra-home">
          <img
            src={caminhoImagem('tomate-carmem-2.webp')}
            alt=""
            className={estilos.bannerFoto}
            aria-hidden="true"
          />
          <div className={estilos.bannerVeu} aria-hidden="true" />
          <div className={estilos.bannerConteudo}>
            <div className={estilos.bannerTexto}>
              <h2 id="titulo-safra-home" className={estilos.bannerTitulo}>
                Safra que Alimenta
              </h2>
              <p className={estilos.bannerDescricao}>
                Fornecedores do Altterra doam o excedente da colheita a instituições cadastradas e
                acompanham no perfil quanto já doaram.
              </p>
              <p className={estilos.bannerNota}>
                {totais.instituicoes} instituições recebem doações e{' '}
                {totais.kg.toLocaleString('pt-BR')} kg já foram doados.
              </p>
              <div className={estilos.bannerAcoes}>
                <Botao
                  variante="secundario"
                  tamanho="md"
                  iconeDireita="arrow_forward"
                  para="/safra-que-alimenta"
                  className={estilos.botaoPrograma}
                >
                  Conhecer o programa
                </Botao>
                <Link to="/como-funciona#fale-conosco" className={estilos.botaoEscuro}>
                  Sou uma instituição
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Pagina>
  );
}
