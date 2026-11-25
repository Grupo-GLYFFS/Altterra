import { Botao } from '../Botao.jsx';
import { Icone } from '../Icone.jsx';
import estilos from './ResumoPedido.module.css';

// Resumo do pedido em card com três estados: normal, bloqueado e recalculando.
// Recebe linhas ({ rotulo, valor, destaque }), total, estado, aviso, textoBotao, para ou aoClicar e children (garantias).
export function ResumoPedido({
  titulo = 'Resumo do pedido',
  linhas = [],
  total = '',
  estado = 'normal',
  aviso = '',
  textoBotao = 'Finalizar pedido',
  motivoBloqueio = '',
  para = '',
  aoClicar,
  desabilitado = false,
  tipoBotao = 'button',
  children,
  className = '',
}) {
  const recalculando = estado === 'recalculando';
  const bloqueado = estado === 'bloqueado' || desabilitado;

  return (
    <aside className={`${estilos.cartao} ${className}`} aria-label={titulo} aria-busy={recalculando || undefined}>
      <h2 className={estilos.titulo}>{titulo}</h2>

      <dl className={estilos.linhas}>
        {linhas.map((linha) => (
          <div key={linha.rotulo} className={estilos.linha}>
            <dt>{linha.rotulo}</dt>
            <dd className={linha.destaque ? estilos.desconto : ''}>
              {recalculando ? <span className={estilos.esqueleto} aria-hidden="true" /> : linha.valor}
            </dd>
          </div>
        ))}
      </dl>

      <div className={estilos.total}>
        <span>Total</span>
        {recalculando ? (
          <span className={`${estilos.esqueleto} ${estilos.esqueletoTotal}`} aria-hidden="true" />
        ) : (
          <strong>{total}</strong>
        )}
      </div>

      {aviso && (
        <p className={estilos.aviso} role="status">
          <Icone nome="warning" tamanho={20} />
          <span>{aviso}</span>
        </p>
      )}

      <Botao
        tamanho="lg"
        larguraTotal
        tipo={tipoBotao}
        para={bloqueado || recalculando ? '' : para}
        onClick={aoClicar}
        desabilitado={bloqueado || recalculando}
        carregando={recalculando}
        textoCarregando="Recalculando…"
        aria-label={bloqueado && motivoBloqueio ? `${textoBotao}. ${motivoBloqueio}` : undefined}
      >
        {textoBotao}
      </Botao>

      {children && <div className={estilos.extra}>{children}</div>}
    </aside>
  );
}
