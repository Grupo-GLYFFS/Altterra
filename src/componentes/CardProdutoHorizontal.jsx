import { Link } from 'react-router-dom';
import { formatarFaixaPreco, formatarReais } from '../logica/formatos.js';
import { precoPorQuantidade } from '../logica/preco.js';
import { Avatar } from './Avatar.jsx';
import { NotaCompacta } from './Avaliacao.jsx';
import { Botao } from './Botao.jsx';
import { Icone } from './Icone.jsx';
import { ImagemSegura } from './ImagemSegura.jsx';
import { SeletorQuantidade } from './SeletorQuantidade.jsx';
import { Selo } from './Selo.jsx';
import estilos from './CardProdutoHorizontal.module.css';

// Card horizontal de produto (K5 "Fornecedor primeiro") para listas, 404 e carrinho.
// Só exibe o seletor de quantidade quando mostrarSeletor=true (exceção exclusiva da linha do carrinho).
export function CardProdutoHorizontal({
  produto,
  favoritado = false,
  aoAlternarFavorito,
  mostrarSeletor = false,
  ocultarFornecedor = false,
  quantidade,
  aoAlterarQuantidade,
  aoRemover,
  carregando = false,
  className = '',
}) {
  if (carregando || !produto) {
    return (
      <article className={`${estilos.card} ${className}`} aria-busy="true">
        <span className="somenteLeitor">Carregando produto</span>
        <div className={`${estilos.foto} ${estilos.esqueleto}`} />
        <div className={estilos.meio}>
          <span className={`${estilos.esqueletoLinha} ${estilos.l60}`} />
          <span className={`${estilos.esqueletoLinha} ${estilos.l80}`} />
          <span className={`${estilos.esqueletoLinha} ${estilos.l40}`} />
        </div>
      </article>
    );
  }

  const esgotado = produto.estoque <= 0;
  const quantidadeEfetiva = quantidade ?? produto.pedidoMinimo;
  const precoFaixa = precoPorQuantidade(produto, quantidadeEfetiva);
  const precoTexto = mostrarSeletor
    ? formatarReais(precoFaixa)
    : formatarFaixaPreco(produto.precoMin, produto.precoMax);
  let precoAntigoTexto = '';
  if (produto.outlet && produto.precoAntigoMin) {
    if (mostrarSeletor && produto.descontoPercentual) {
      const fator = 1 - produto.descontoPercentual / 100;
      precoAntigoTexto = formatarReais(Math.round((precoFaixa / fator) * 100) / 100);
    } else if (mostrarSeletor) {
      precoAntigoTexto = formatarReais(produto.precoAntigoMin);
    } else {
      precoAntigoTexto = formatarFaixaPreco(produto.precoAntigoMin, produto.precoAntigoMax);
    }
  }

  const blocoSelos = (produto.outlet || produto.organico) && (
    <div className={estilos.selos}>
      {produto.outlet && (
        <Selo variante="outlet" tamanho="sm" icone="">
          {produto.descontoPercentual ? `Outlet −${produto.descontoPercentual}%` : 'Outlet'}
        </Selo>
      )}
      {produto.organico && (
        <Selo variante="organico" tamanho="sm">
          Orgânico
        </Selo>
      )}
    </div>
  );

  return (
    <article className={`${estilos.card} ${esgotado ? estilos.esgotado : ''} ${className}`}>
      <div className={estilos.foto}>
        <ImagemSegura
          src={produto.imagem}
          alt={produto.nome}
          className={estilos.imagem}
          decoding="async"
          fallback={
            <div className={estilos.semFoto}>
              <Icone nome="image" tamanho={24} />
              <span>Foto em breve</span>
            </div>
          }
        />
      </div>

      <div className={estilos.meio}>
        {!ocultarFornecedor && produto.fornecedor && (
          <div className={estilos.fornecedor}>
            <Avatar src={produto.fornecedor.logo} nome={produto.fornecedor.nome} tamanho={32} />
            <span className={estilos.fornecedorNome}>{produto.fornecedor.nome}</span>
            {produto.fornecedor.verificado && (
              <Icone nome="verified" tamanho={16} preenchido className={estilos.verificado} />
            )}
            <span className={estilos.fornecedorCidade}>· {produto.fornecedor.cidade}</span>
          </div>
        )}

        {!ocultarFornecedor && blocoSelos}

        <div className={estilos.linhaNome}>
          <h3 className={estilos.nome}>
            <Link
              to={`/produto/${produto.id}`}
              className={estilos.linkNome}
              aria-label={`Ver ${produto.nome}`}
            >
              {produto.nome}
            </Link>
          </h3>
          <NotaCompacta nota={produto.nota} totalAvaliacoes={produto.totalAvaliacoes} />
        </div>

        {ocultarFornecedor && blocoSelos}

        {esgotado ? (
          <p className={estilos.semEstoque}>
            <Icone nome="block" tamanho={16} />
            <span>Sem estoque</span>
          </p>
        ) : (
          <p className={estilos.meta}>
            mín. {produto.pedidoMinimo.toLocaleString('pt-BR')} {produto.unidade} ·{' '}
            {produto.estoque.toLocaleString('pt-BR')} {produto.unidade} disponíveis
          </p>
        )}
      </div>

      <div className={estilos.direita}>
        <div className={estilos.acoesTopo}>
          {aoAlternarFavorito && (
            <Botao
              variante="icone"
              tamanho="sm"
              iconeEsquerda="favorite"
              iconePreenchido={favoritado}
              aria-label={
                favoritado
                  ? `Remover ${produto.nome} dos favoritos`
                  : `Adicionar ${produto.nome} aos favoritos`
              }
              aria-pressed={favoritado}
              onClick={() => aoAlternarFavorito(produto.id)}
            />
          )}
          {mostrarSeletor && aoRemover && (
            <Botao
              variante="icone"
              tamanho="sm"
              iconeEsquerda="delete"
              aria-label={`Remover ${produto.nome} do carrinho`}
              onClick={() => aoRemover(produto.id)}
            />
          )}
        </div>

        <div className={estilos.blocoPreco}>
          <p className={estilos.preco}>
            {precoTexto} <span className={estilos.unidade}>/{produto.unidade}</span>
          </p>
          {precoAntigoTexto && (
            <span className={estilos.precoAntigo}>
              <span className="somenteLeitor">Preço anterior: </span>
              <s>{precoAntigoTexto}</s>
            </span>
          )}
        </div>

        {mostrarSeletor && (
          <div className={estilos.controleQtd}>
            <SeletorQuantidade
              tamanho="sm"
              valor={quantidade ?? produto.pedidoMinimo}
              minimo={produto.pedidoMinimo}
              maximo={produto.estoque || produto.pedidoMinimo}
              passo={10}
              unidade={produto.unidade}
              permitirRemover={Boolean(aoRemover)}
              aoRemover={() => aoRemover?.(produto.id)}
              aoAlterar={aoAlterarQuantidade}
              desabilitado={esgotado}
            />
          </div>
        )}
      </div>
    </article>
  );
}
