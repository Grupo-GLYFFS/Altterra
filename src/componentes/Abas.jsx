import estilos from './Abas.module.css';

// Abas da página sublinhadas em verde 7 com contador em pill (padrão T3).
// No celular, rolam horizontalmente sem quebrar linha.
export function Abas({
  itens = [],
  ativa,
  aoAlterar,
  rotulo = 'Seções',
  className = '',
}) {
  return (
    <div className={`${estilos.envoltorio} ${className}`}>
      <div className={estilos.lista} role="tablist" aria-label={rotulo}>
        {itens.map((item) => {
          const selecionada = item.valor === ativa;

          return (
            <button
              key={item.valor}
              type="button"
              role="tab"
              aria-selected={selecionada}
              disabled={item.desabilitado}
              className={`${estilos.aba} ${selecionada ? estilos.ativa : ''}`}
              onClick={() => aoAlterar?.(item.valor)}
            >
              <span>{item.rotulo}</span>
              {typeof item.contagem === 'number' && (
                <span className={estilos.contador}>{item.contagem}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
