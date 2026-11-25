import { LinkTexto } from './LinkTexto.jsx';
import estilos from './Divisor.module.css';

// Linha divisória de 1 px na cor --cor-borda, com rótulo central opcional (Miúdos V06).
export function Divisor({ rotulo = '', className = '' }) {
  if (!rotulo) {
    return <hr className={`${estilos.linha} ${className}`} />;
  }

  return (
    <div className={`${estilos.comRotulo} ${className}`} role="separator">
      <span>{rotulo}</span>
    </div>
  );
}

// Cabeçalho de seção com título à esquerda e link de ação opcional ("Ver todos →") à direita.
export function CabecalhoSecao({
  titulo,
  nivel = 'h2',
  textoAcao = '',
  paraAcao = '',
  aoClicarAcao,
  comLinha = false,
  className = '',
}) {
  const Tag = nivel === 'h3' ? 'h3' : 'h2';

  return (
    <div className={`${estilos.cabecalho} ${comLinha ? estilos.cabecalhoLinha : ''} ${className}`}>
      <Tag className={nivel === 'h3' ? estilos.tituloH3 : estilos.tituloH2}>{titulo}</Tag>
      {textoAcao && (
        <LinkTexto
          variante="acao"
          para={paraAcao}
          onClick={aoClicarAcao}
          iconeDireita="arrow_forward"
        >
          {textoAcao}
        </LinkTexto>
      )}
    </div>
  );
}
