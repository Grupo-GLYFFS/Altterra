import estilos from './CabecalhoPagina.module.css';

// Cabeçalho de página: título h1, detalhe curto opcional (ex.: contagem) e ações à direita.
export function CabecalhoPagina({ titulo, detalhe = '', children, className = '' }) {
  return (
    <header className={`${estilos.cabecalho} ${className}`}>
      <div className={estilos.textos}>
        <h1 className={estilos.titulo}>{titulo}</h1>
        {detalhe && <p className={estilos.detalhe}>{detalhe}</p>}
      </div>
      {children && <div className={estilos.acoes}>{children}</div>}
    </header>
  );
}
