import estilos from './Contador.module.css';

// Badge de contador circular (24 px desktop, 28 px flutuante) que vira pill em "99+".
// Variantes: "claro" (verde 7 com texto branco) e "barra" (branco com texto verde 8).
export function Contador({
  valor = 0,
  variante = 'claro',
  tamanho = 'md',
  emLinha = false,
  className = '',
}) {
  if (!valor || valor <= 0) return null;

  const texto = valor > 99 ? '99+' : String(valor);
  const doisDigitos = valor >= 10 && valor <= 99;
  const maisDe99 = valor > 99;

  const classes = [
    emLinha ? estilos.emLinha : estilos.flutuante,
    estilos[variante] || estilos.claro,
    tamanho === 'lg' ? estilos.lg : '',
    doisDigitos ? estilos.doisDigitos : '',
    maisDe99 ? estilos.maisDe99 : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes} aria-hidden="true">
      {texto}
    </span>
  );
}

// Indicador de ponto simples (10 px) para avisar novidade sem número.
export function PontoIndicador({ className = '' }) {
  return <span className={`${estilos.ponto} ${className}`} aria-hidden="true" />;
}
