import { useState } from 'react';
import { formatarFaixaPreco, formatarReais } from '../../logica/formatos.js';
import { rotuloFaixa } from '../../logica/preco.js';
import { CardProduto } from '../CardProduto.jsx';
import { ControleSegmentado } from '../ControleSegmentado.jsx';
import { Icone } from '../Icone.jsx';
import { Selo } from '../Selo.jsx';
import estilos from './PreviaAnuncio.module.css';

const MODOS_PREVIA = [
  { valor: 'card', rotulo: 'Card' },
  { valor: 'pagina', rotulo: 'Na página' },
];

// Prévia ao vivo do anúncio no modo Card (K4) ou Na página.
// Usada na coluna lateral do computador e dentro da gaveta no celular.
export function PreviaAnuncio({ produto, modoEdicao = false, semMoldura = false }) {
  const [modo, setModo] = useState('card');

  const precoTexto = formatarFaixaPreco(produto.precoMin, produto.precoMax);

  return (
    <aside
      className={`${estilos.caixa} ${semMoldura ? estilos.semMoldura : ''}`}
      aria-label="Prévia do anúncio"
    >
      <div className={estilos.cabecalho}>
        {!semMoldura && <span className={estilos.titulo}>Prévia</span>}
        <ControleSegmentado
          opcoes={MODOS_PREVIA}
          valor={modo}
          aoAlterar={setModo}
          tamanho="sm"
          rotulo="Modo da prévia"
          className={estilos.segmentado}
        />
      </div>

      {modo === 'card' ? (
        <div className={estilos.areaCard}>
          <CardProduto produto={produto} aoAlternarFavorito={() => {}} />
        </div>
      ) : (
        <div className={estilos.miniPagina}>
          <div className={estilos.miniFoto}>
            {produto.imagem ? (
              <img src={produto.imagem} alt={produto.nome} className={estilos.miniImagem} />
            ) : (
              <div className={estilos.miniSemFoto}>
                <Icone nome="image" tamanho={28} />
                <span>Foto em breve</span>
              </div>
            )}
          </div>

          <div className={estilos.miniCorpo}>
            <div className={estilos.miniSelos}>
              <Selo variante="neutro" tamanho="sm" icone="">
                {produto.categoria}
              </Selo>
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

            <h3 className={estilos.miniNome}>{produto.nome}</h3>
            {produto.variedade && <p className={estilos.miniMeta}>{produto.variedade}</p>}

            <p className={estilos.miniPreco}>
              {precoTexto} <span className={estilos.miniUnidade}>/{produto.unidade}</span>
            </p>

            {produto.faixas.length > 0 && (
              <ul className={estilos.miniFaixas}>
                {produto.faixas.map((faixa, indice) => (
                  <li key={`${faixa.minimo}-${indice}`} className={estilos.miniFaixaLinha}>
                    <span>{rotuloFaixa(produto, indice)}</span>
                    <strong>
                      {formatarReais(faixa.preco)} /{produto.unidade}
                    </strong>
                  </li>
                ))}
              </ul>
            )}

            <p className={estilos.miniMeta}>
              mín. {produto.pedidoMinimo.toLocaleString('pt-BR')} {produto.unidade} ·{' '}
              {produto.estoque.toLocaleString('pt-BR')} {produto.unidade} disponíveis
            </p>
          </div>
        </div>
      )}

      <p className={estilos.nota}>
        {modoEdicao
          ? 'Atualiza enquanto você edita o anúncio.'
          : 'Atualiza enquanto você preenche. Produto novo começa sem avaliações.'}
      </p>
    </aside>
  );
}
