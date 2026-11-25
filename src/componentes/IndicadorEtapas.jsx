import { Icone } from './Icone.jsx';
import estilos from './IndicadorEtapas.module.css';

// Trilho de etapas em pílulas no computador e círculos com linha no celular (Cadastro-final).
// Recebe etapas ({ id, titulo, subtitulo, status: "pendente" | "atual" | "concluida" | "erro" }).
export function IndicadorEtapas({ etapas = [], aoSelecionar, className = '' }) {
  return (
    <nav aria-label="Etapas do cadastro" className={`${estilos.container} ${className}`}>
      <ol className={estilos.trilho}>
        {etapas.map((etapa, indice) => {
          const numero = indice + 1;
          const status = etapa.status || 'pendente';
          const clicavel = Boolean(aoSelecionar) && (status === 'concluida' || status === 'erro');

          return (
            <li
              key={etapa.id}
              className={`${estilos.item} ${estilos[status] || estilos.pendente}`}
              aria-current={status === 'atual' ? 'step' : undefined}
            >
              <button
                type="button"
                className={estilos.botao}
                disabled={!clicavel}
                onClick={() => clicavel && aoSelecionar(etapa.id)}
              >
                <span className={estilos.circulo} aria-hidden="true">
                  {status === 'concluida' && <Icone nome="check" tamanho={16} />}
                  {status === 'erro' && <Icone nome="priority_high" tamanho={16} />}
                  {(status === 'atual' || status === 'pendente') && numero}
                </span>

                <span className={estilos.textos}>
                  <span className={estilos.titulo}>{etapa.titulo}</span>
                  {etapa.subtitulo && <span className={estilos.subtitulo}>{etapa.subtitulo}</span>}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
