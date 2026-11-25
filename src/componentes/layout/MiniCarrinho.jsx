import { Link } from 'react-router-dom';
import { ImagemSegura } from '../ImagemSegura.jsx';
import { useCarrinho } from '../../contexto/useCarrinho.js';
import { useAnuncios } from '../../contexto/useAnuncios.js';
import { formatarReais } from '../../logica/formatos.js';
import { agruparPorFornecedor, calcularTotais, montarLinhas } from '../../logica/carrinho.js';
import estilos from './MiniCarrinho.module.css';

// Lista resumida dos itens do carrinho dentro do painel da navbar (computador).
export function MiniCarrinho({ aoSelecionar }) {
  const { itens, modosEntrega } = useCarrinho();
  const { produtos } = useAnuncios();

  if (itens.length === 0) return null;

  const linhas = montarLinhas(itens, produtos);
  const grupos = agruparPorFornecedor(linhas, modosEntrega);
  const totais = calcularTotais(grupos);

  return (
    <div className={estilos.corpo}>
      <ul className={estilos.lista}>
        {linhas.slice(0, 3).map((linha) => (
          <li key={linha.produto.id} className={estilos.item}>
            <ImagemSegura
              src={linha.produto.imagem}
              alt=""
              className={estilos.miniatura}
              fallback={<span className={estilos.miniatura} aria-hidden="true" />}
            />
            <span className={estilos.texto}>
              <Link
                to={`/produto/${linha.produto.id}`}
                className={estilos.nome}
                onClick={aoSelecionar}
              >
                {linha.produto.nome}
              </Link>
              <span className={estilos.detalhe}>
                {linha.quantidade.toLocaleString('pt-BR')} {linha.produto.unidade}
              </span>
            </span>
            <span className={estilos.valor}>{formatarReais(linha.subtotal)}</span>
          </li>
        ))}
      </ul>
      {linhas.length > 3 && <p className={estilos.mais}>e mais {linhas.length - 3} itens</p>}
      <p className={estilos.total}>
        <span>Subtotal dos produtos</span>
        <strong>{formatarReais(totais.subtotal)}</strong>
      </p>
    </div>
  );
}
