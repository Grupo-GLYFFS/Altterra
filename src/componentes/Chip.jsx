import { Icone } from './Icone.jsx';
import estilos from './Chip.module.css';

// Chip de filtro em pill de 44 px (variante tonal ou com borda cinza 5).
// Mostra check quando ativo, contagem opcional e botão X quando removível.
export function Chip({
  children,
  ativo = false,
  comBorda = false,
  contagem,
  icone = '',
  iconeDireita = '',
  aoClicar,
  aoRemover,
  desabilitado = false,
  className = '',
  ...props
}) {
  const removivel = Boolean(aoRemover);
  const mostrarCheck = ativo && !removivel && !icone;

  const classes = [
    estilos.chip,
    comBorda ? estilos.comBorda : estilos.tonal,
    ativo ? estilos.ativo : '',
    mostrarCheck || icone ? estilos.comIconeEsquerda : '',
    removivel ? estilos.removivel : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classes}
      aria-pressed={!removivel ? ativo : undefined}
      disabled={desabilitado}
      aria-disabled={desabilitado || undefined}
      onClick={removivel ? aoRemover : aoClicar}
      {...props}
    >
      {mostrarCheck && <Icone nome="check" tamanho={20} />}
      {!mostrarCheck && icone && <Icone nome={icone} tamanho={20} />}
      <span>{children}</span>
      {typeof contagem === 'number' && <span className={estilos.contagem}>{contagem}</span>}
      {iconeDireita && !removivel && <Icone nome={iconeDireita} tamanho={20} />}
      {removivel && (
        <span className={estilos.iconeRemover}>
          <Icone nome="close" tamanho={20} />
        </span>
      )}
    </button>
  );
}
