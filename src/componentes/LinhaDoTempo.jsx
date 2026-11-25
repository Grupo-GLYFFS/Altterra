import { Icone } from './Icone.jsx';
import estilos from './LinhaDoTempo.module.css';

// Linha do tempo do pedido: horizontal no computador e vertical no celular.
// Recebe etapas ({ id, rotulo, estado: "feita" | "atual" | "pendente" | "cancelada", data }).
export function LinhaDoTempo({ etapas = [], className = '' }) {
  return (
    <ol className={`${estilos.lista} ${className}`} aria-label="Andamento do pedido">
      {etapas.map((etapa) => (
        <li
          key={etapa.id}
          className={`${estilos.etapa} ${estilos[etapa.estado] || estilos.pendente}`}
          aria-current={etapa.estado === 'atual' ? 'step' : undefined}
        >
          <span className={estilos.marca} aria-hidden="true">
            {etapa.estado === 'feita' && <Icone nome="check" tamanho={16} />}
            {etapa.estado === 'cancelada' && <Icone nome="close" tamanho={16} />}
          </span>
          <span className={estilos.textos}>
            <span className={estilos.rotulo}>{etapa.rotulo}</span>
            {etapa.data && <span className={estilos.data}>{etapa.data}</span>}
            <span className="somenteLeitor">
              {etapa.estado === 'feita' && ', concluída'}
              {etapa.estado === 'atual' && ', etapa atual'}
              {etapa.estado === 'pendente' && ', pendente'}
              {etapa.estado === 'cancelada' && ', cancelada'}
            </span>
          </span>
        </li>
      ))}
    </ol>
  );
}
