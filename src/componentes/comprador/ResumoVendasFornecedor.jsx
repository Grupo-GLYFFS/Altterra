import { LinkTexto } from '../LinkTexto.jsx';
import { formatarReais } from '../../logica/formatos.js';
import estilos from './ResumoVendasFornecedor.module.css';

// Resumo de vendas do fornecedor exibido no topo do perfil (Perfil-final).
export function ResumoVendasFornecedor({ pedidos = [] }) {
  const validos = pedidos.filter((p) => p.status !== 'cancelado');
  const totalVendido = validos.reduce((soma, p) => soma + p.subtotal, 0);
  const qtdPedidos = validos.length;
  const volumeTotal = validos.reduce(
    (soma, p) => soma + p.itens.reduce((acc, item) => acc + item.quantidade, 0),
    0
  );
  const ticketMedio = qtdPedidos > 0 ? totalVendido / qtdPedidos : 0;

  return (
    <section className={estilos.card} aria-labelledby="titulo-resumo-vendas">
      <div className={estilos.topo}>
        <div>
          <h2 id="titulo-resumo-vendas" className={estilos.titulo}>
            Resumo das vendas
          </h2>
          <p className={estilos.meta}>Pedidos ativos e entregues, sem o frete.</p>
        </div>
        <LinkTexto para="/pedidos-recebidos">Ver pedidos recebidos</LinkTexto>
      </div>

      <dl className={estilos.grade}>
        <div className={estilos.metrica}>
          <dt>Vendido</dt>
          <dd>{formatarReais(totalVendido)}</dd>
        </div>
        <div className={estilos.metrica}>
          <dt>Pedidos</dt>
          <dd>{qtdPedidos}</dd>
        </div>
        <div className={estilos.metrica}>
          <dt>Volume</dt>
          <dd>{volumeTotal.toLocaleString('pt-BR')} kg</dd>
        </div>
        <div className={estilos.metrica}>
          <dt>Ticket médio</dt>
          <dd>{formatarReais(ticketMedio)}</dd>
        </div>
      </dl>
    </section>
  );
}
