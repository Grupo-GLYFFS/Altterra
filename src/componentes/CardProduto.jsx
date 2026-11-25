import { Link } from 'react-router-dom';
import { formatarFaixaPreco } from '../logica/formatos.js';
import { Avatar, IdentidadeFornecedor } from './Avatar.jsx';
import { NotaCompacta } from './Avaliacao.jsx';
import { Botao } from './Botao.jsx';
import { Icone } from './Icone.jsx';
import { ImagemSegura } from './ImagemSegura.jsx';
import { Selo } from './Selo.jsx';
import estilos from './CardProduto.module.css';

// Card vertical de produto (K4 "Fornecedor primeiro").
// Sem botão "+ Adicionar" e sem seletor: a compra ocorre apenas na página do produto.
export function CardProduto({
  produto,
  favoritado = false,
  aoAlternarFavorito,
  ocultarFornecedor = false,
  carregando = false,
  className = '',
}) {
  if (carregando || !produto) {
    return (
      <article className={`${estilos.card} ${className}`} aria-busy="true">
        <span className="somenteLeitor">Carregando produto</span>
        {!ocultarFornecedor && (
          <div className={estilos.cabecalho}>
            <Avatar carregando tamanho={32} />
            <div className={estilos.esqueletoGrupo}>
              <span className={`${estilos.esqueletoLinha} ${estilos.l60}`} />
              <span className={`${estilos.esqueletoLinha} ${estilos.l40}`} />
            </div>
          </div>
        )}
        <div className={`${estilos.foto} ${estilos.esqueletoFoto}`} />
        <div className={estilos.corpo}>
          <span className={`${estilos.esqueletoLinha} ${estilos.l80}`} />
          <span className={`${estilos.esqueletoLinha} ${estilos.l50} ${estilos.esqueletoAlto}`} />
          <span className={`${estilos.esqueletoLinha} ${estilos.l60}`} />
        </div>
      </article>
    );
  }

  const esgotado = produto.estoque <= 0;
  const precoTexto = formatarFaixaPreco(produto.precoMin, produto.precoMax);
  const precoAntigoTexto =
    produto.outlet && produto.precoAntigoMin
      ? formatarFaixaPreco(produto.precoAntigoMin, produto.precoAntigoMax)
      : '';

  return (
    <article className={`${estilos.card} ${esgotado ? estilos.esgotado : ''} ${className}`}>
      {!ocultarFornecedor && produto.fornecedor && (
        <div className={estilos.cabecalho}>
          <IdentidadeFornecedor
            nome={produto.fornecedor.nome}
            subtitulo={`${produto.fornecedor.tipo} · ${produto.fornecedor.cidade}`}
            logo={produto.fornecedor.logo}
            verificado={produto.fornecedor.verificado}
            tamanhoAvatar={32}
          />
        </div>
      )}

      <div className={estilos.foto}>
        <ImagemSegura
          src={produto.imagem}
          alt={produto.nome}
          className={estilos.imagem}
          decoding="async"
          fallback={
            <div className={estilos.semFoto}>
              <Icone nome="image" tamanho={32} />
              <span>Foto em breve</span>
            </div>
          }
        />

        {(produto.outlet || produto.organico) && (
          <div className={estilos.selos}>
            {produto.outlet && (
              <Selo variante="outlet" icone="">
                {produto.descontoPercentual ? `Outlet −${produto.descontoPercentual}%` : 'Outlet'}
              </Selo>
            )}
            {produto.organico && <Selo variante="organico">Orgânico</Selo>}
          </div>
        )}

        <Botao
          variante="icone"
          tamanho="sm"
          sobreFoto
          iconeEsquerda="favorite"
          iconePreenchido={favoritado}
          aria-label={
            favoritado
              ? `Remover ${produto.nome} dos favoritos`
              : `Adicionar ${produto.nome} aos favoritos`
          }
          aria-pressed={favoritado}
          className={estilos.favorito}
          onClick={() => aoAlternarFavorito?.(produto.id)}
        />
      </div>

      <div className={estilos.corpo}>
        <div className={estilos.linhaNome}>
          <h3 className={estilos.nome}>
            <Link to={`/produto/${produto.id}`} className={estilos.linkNome}>
              {produto.nome}
            </Link>
          </h3>
          <NotaCompacta nota={produto.nota} totalAvaliacoes={produto.totalAvaliacoes} />
        </div>

        <p className={estilos.preco}>
          {precoTexto} <span className={estilos.unidade}>/{produto.unidade}</span>
        </p>

        {precoAntigoTexto && (
          <span className={estilos.precoAntigo}>
            <span className="somenteLeitor">Preço anterior: </span>
            <s>{precoAntigoTexto}</s>
          </span>
        )}

        {esgotado ? (
          <>
            <p className={estilos.meta}>
              mín. {produto.pedidoMinimo.toLocaleString('pt-BR')} {produto.unidade}
            </p>
            <p className={estilos.semEstoque}>
              <Icone nome="block" tamanho={16} />
              <span>Sem estoque</span>
            </p>
          </>
        ) : (
          <p className={estilos.meta}>
            mín. {produto.pedidoMinimo.toLocaleString('pt-BR')} {produto.unidade} ·{' '}
            {produto.estoque.toLocaleString('pt-BR')} {produto.unidade} disponíveis
          </p>
        )}
      </div>
    </article>
  );
}
