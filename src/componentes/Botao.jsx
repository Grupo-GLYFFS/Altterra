import { Link } from 'react-router-dom';
import { Icone } from './Icone.jsx';
import estilos from './Botao.module.css';

// Botão padronizado do design system (B3 tonal, formato pill, alturas 64/56/44).
// Aceita variantes: principal, secundario, terciario, perigo, icone; tamanhos: lg, md, sm.
export function Botao({
  children,
  variante = 'principal',
  tamanho = 'md',
  larguraTotal = false,
  sobreFoto = false,
  carregando = false,
  textoCarregando = 'Enviando…',
  desabilitado = false,
  iconeEsquerda = '',
  iconeDireita = '',
  iconePreenchido = false,
  para = '',
  tipo = 'button',
  className = '',
  onClick,
  ...props
}) {
  const somenteIcone = variante === 'icone';
  const tamanhoIcone = tamanho === 'sm' ? 20 : 24;
  const inativo = desabilitado || carregando;

  const classes = [
    estilos.botao,
    estilos[variante] || estilos.principal,
    estilos[tamanho] || estilos.md,
    larguraTotal ? estilos.larguraTotal : '',
    sobreFoto ? estilos.sobreFoto : '',
    carregando ? estilos.carregando : '',
    iconeEsquerda && !somenteIcone ? estilos.comIconeEsquerda : '',
    iconeDireita && !somenteIcone ? estilos.comIconeDireita : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const conteudo = carregando ? (
    <>
      <span className={estilos.spinner} aria-hidden="true" />
      {!somenteIcone && <span>{textoCarregando}</span>}
    </>
  ) : (
    <>
      {iconeEsquerda && (
        <Icone
          nome={iconeEsquerda}
          tamanho={tamanhoIcone}
          preenchido={iconePreenchido}
          className={iconePreenchido ? estilos.iconeAtivo : ''}
        />
      )}
      {!somenteIcone && children}
      {iconeDireita && !somenteIcone && (
        <Icone nome={iconeDireita} tamanho={tamanhoIcone} preenchido={iconePreenchido} />
      )}
    </>
  );

  if (para && !inativo) {
    return (
      <Link to={para} className={classes} onClick={onClick} {...props}>
        {conteudo}
      </Link>
    );
  }

  return (
    <button
      type={tipo}
      className={classes}
      disabled={inativo}
      aria-disabled={inativo || undefined}
      aria-busy={carregando || undefined}
      onClick={inativo ? undefined : onClick}
      {...props}
    >
      {conteudo}
    </button>
  );
}
