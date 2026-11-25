import { useMediaQuery } from '@mantine/hooks';
import { Botao } from '../componentes/Botao.jsx';
import { CardProduto } from '../componentes/CardProduto.jsx';
import { CardProdutoHorizontal } from '../componentes/CardProdutoHorizontal.jsx';
import { Carrossel } from '../componentes/Carrossel.jsx';
import { CabecalhoSecao } from '../componentes/Divisor.jsx';
import { Icone } from '../componentes/Icone.jsx';
import { Pagina } from '../componentes/layout/Pagina.jsx';
import { useAnuncios } from '../contexto/useAnuncios.js';
import { useFavoritos } from '../contexto/useFavoritos.js';
import estilos from './NaoEncontrada.module.css';

// Página 404 (Feedback V05): aviso centralizado com "Voltar ao início" e "Mais procurados esta semana".
// Mostra cards K5 em lista no computador e carrossel K4 no celular.
export function NaoEncontrada() {
  const ehCelular = useMediaQuery('(max-width: 63.99em)', false, {
    getInitialValueInEffect: false,
  });
  const { produtosAtivos } = useAnuncios();
  const { ehFavorito, alternar } = useFavoritos();

  const maisProcurados = produtosAtivos.slice(0, 4);

  return (
    <Pagina>
      <div className={estilos.pagina}>
        <section className={estilos.blocoErro} aria-labelledby="titulo-404">
          <span className={estilos.circulo} aria-hidden="true">
            <Icone nome="wrong_location" tamanho={32} />
          </span>

          <h1 id="titulo-404" className={estilos.titulo}>
            Página não encontrada
          </h1>

          <p className={estilos.descricao}>
            O endereço pode ter mudado ou o produto saiu do catálogo. Erro 404.
          </p>

          <div className={estilos.acao}>
            <Botao variante="principal" tamanho="md" para="/">
              Voltar ao início
            </Botao>
          </div>
        </section>

        {maisProcurados.length > 0 &&
          (ehCelular ? (
            <Carrossel
              titulo="Mais procurados esta semana"
              textoAcao="Ver todos"
              paraAcao="/busca"
            >
              {maisProcurados.map((produto) => (
                <CardProduto
                  key={produto.id}
                  produto={produto}
                  favoritado={ehFavorito(produto.id)}
                  aoAlternarFavorito={() => alternar(produto)}
                />
              ))}
            </Carrossel>
          ) : (
            <section className={estilos.sugestoes} aria-label="Mais procurados esta semana">
              <CabecalhoSecao
                titulo="Mais procurados esta semana"
                nivel="h3"
                textoAcao="Ver todos"
                paraAcao="/busca"
              />
              <div className={estilos.listaHorizontal}>
                {maisProcurados.slice(0, 3).map((produto) => (
                  <CardProdutoHorizontal
                    key={produto.id}
                    produto={produto}
                    favoritado={ehFavorito(produto.id)}
                    aoAlternarFavorito={() => alternar(produto)}
                  />
                ))}
              </div>
            </section>
          ))}
      </div>
    </Pagina>
  );
}
