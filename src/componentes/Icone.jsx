import estilos from './Icone.module.css';

const CLASSES_TAMANHO = {
  16: estilos.t16,
  20: estilos.t20,
  24: estilos.t24,
  28: estilos.t28,
  32: estilos.t32,
};

// Renderiza um ícone do Material Symbols Rounded com tamanho e preenchimento controlados.
// Recebe nome do glifo, tamanho (16, 20, 24, 28 ou 32), preenchido e className opcional.
export function Icone({ nome, tamanho = 24, preenchido = false, className = '', ...props }) {
  const classeTamanho = CLASSES_TAMANHO[tamanho] || estilos.t24;
  const classes = [
    'material-symbols-rounded',
    estilos.icone,
    classeTamanho,
    preenchido ? estilos.preenchido : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes} aria-hidden="true" {...props}>
      {nome}
    </span>
  );
}
