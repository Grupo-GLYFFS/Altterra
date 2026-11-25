import { Botao } from './Botao.jsx';
import estilos from './IndiceProduto.module.css';

// Índice fixo da página do produto (T4): no computador mostra só as abas na coluna esquerda
// (o bloco de compra fica preso à direita); no celular inclui preço e botão compacto.
export function IndiceProduto({
  secoes = [],
  ativa,
  aoSelecionar,
  preco = '',
  unidade = 'kg',
  aoAdicionar,
  rotuloAcao = 'Adicionar ao carrinho',
  className = '',
}) {
  return (
    <div className={`${estilos.barra} ${className}`}>
      <div className={estilos.rolagem}>
        <div className={estilos.abas} role="tablist" aria-label="Seções do produto">
          {secoes.map((secao) => {
            const selecionada = secao.id === ativa;
            return (
              <button
                key={secao.id}
                type="button"
                role="tab"
                aria-selected={selecionada}
                className={`${estilos.aba} ${selecionada ? estilos.ativa : ''}`}
                onClick={() => aoSelecionar?.(secao.id)}
              >
                {secao.rotulo}
              </button>
            );
          })}
        </div>
      </div>

      {preco && (
        <div className={estilos.compra}>
          <p className={estilos.preco}>
            {preco} <span className={estilos.unidade}>/{unidade}</span>
          </p>
          {aoAdicionar && (
            <Botao tamanho="sm" iconeEsquerda="shopping_cart" onClick={aoAdicionar}>
              {rotuloAcao}
            </Botao>
          )}
        </div>
      )}
    </div>
  );
}
