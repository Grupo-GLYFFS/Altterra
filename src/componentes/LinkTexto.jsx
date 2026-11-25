import { Link } from 'react-router-dom';
import { Icone } from './Icone.jsx';
import estilos from './LinkTexto.module.css';

// Link de texto em verde 7 que sublinha no hover (Miúdos V02).
// Suporta variante "acao" (área de toque 44 px + seta) e link externo (open_in_new).
export function LinkTexto({
  children,
  para = '',
  href = '',
  externo = false,
  variante = 'texto',
  iconeDireita = '',
  onClick,
  className = '',
  ...props
}) {
  const classes = [
    variante === 'acao' ? estilos.acao : estilos.texto,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const conteudo = (
    <>
      <span>{children}</span>
      {iconeDireita && <Icone nome={iconeDireita} tamanho={16} />}
      {externo && !iconeDireita && <Icone nome="open_in_new" tamanho={16} />}
    </>
  );

  if (para) {
    return (
      <Link to={para} className={classes} onClick={onClick} {...props}>
        {conteudo}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        target={externo ? '_blank' : undefined}
        rel={externo ? 'noopener noreferrer' : undefined}
        onClick={onClick}
        {...props}
      >
        {conteudo}
      </a>
    );
  }

  return (
    <button type="button" className={classes} onClick={onClick} {...props}>
      {conteudo}
    </button>
  );
}
