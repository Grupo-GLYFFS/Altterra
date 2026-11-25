import { Botao } from './Botao.jsx';
import { Icone } from './Icone.jsx';
import estilos from './Aviso.module.css';

const ICONES_AVISO = {
  sucesso: 'check_circle',
  aviso: 'warning',
  erro: 'error',
  info: 'info',
};

// Aviso em linha no padrão Feedback V01: card branco com borda e cor apenas no ícone.
// Sucesso e info usam role="status"; erro e aviso usam role="alert".
export function Aviso({
  tipo = 'info',
  titulo,
  descricao = '',
  textoAcao = '',
  aoClicarAcao,
  aoFechar,
  className = '',
}) {
  const papel = tipo === 'erro' || tipo === 'aviso' ? 'alert' : 'status';
  const icone = ICONES_AVISO[tipo] || ICONES_AVISO.info;

  return (
    <div className={`${estilos.aviso} ${className}`} role={papel}>
      <span className={`${estilos.icone} ${estilos[tipo] || estilos.info}`}>
        <Icone nome={icone} tamanho={24} />
      </span>

      <div className={estilos.corpo}>
        {titulo && <p className={estilos.titulo}>{titulo}</p>}
        {descricao && <p className={estilos.descricao}>{descricao}</p>}
        {textoAcao && aoClicarAcao && (
          <div className={estilos.acoes}>
            <Botao variante="terciario" tamanho="sm" onClick={aoClicarAcao}>
              {textoAcao}
            </Botao>
          </div>
        )}
      </div>

      {aoFechar && (
        <button
          type="button"
          className={estilos.fechar}
          onClick={aoFechar}
          aria-label="Fechar aviso"
        >
          <Icone nome="close" tamanho={20} />
        </button>
      )}
    </div>
  );
}
