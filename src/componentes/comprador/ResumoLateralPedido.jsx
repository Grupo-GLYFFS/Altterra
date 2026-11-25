import { Link } from 'react-router-dom';
import { NotaCompacta } from '../Avaliacao.jsx';
import { IdentidadeFornecedor } from '../Avatar.jsx';
import { Botao } from '../Botao.jsx';
import { Divisor } from '../Divisor.jsx';
import { Icone } from '../Icone.jsx';
import { formatarData, formatarDataCurta, formatarReais } from '../../logica/formatos.js';
import estilos from './ResumoLateralPedido.module.css';

// Bloco de botões de ação do pedido (reutilizado no topo do celular e na lateral do computador).
export function AcoesPedido({
  pedido,
  podeCancelar,
  mostrarAvaliar = false,
  aoConfirmarPagamento,
  aoComprarDeNovo,
  aoAbrirAvaliar,
  aoAbrirCancelar,
}) {
  return (
    <div className={estilos.acoes}>
      {pedido.status === 'aguardando_pagamento' && (
        <Botao
          variante="principal"
          tamanho="md"
          larguraTotal
          iconeEsquerda="check_circle"
          onClick={() => aoConfirmarPagamento(pedido.id)}
        >
          Simular pagamento
        </Botao>
      )}
      <Botao
        variante={pedido.status === 'aguardando_pagamento' ? 'secundario' : 'principal'}
        tamanho="md"
        larguraTotal
        iconeEsquerda="refresh"
        onClick={() => aoComprarDeNovo(pedido)}
      >
        Comprar de novo
      </Botao>
      {/* Botão sem função de propósito (regra §9) */}
      <Botao
        variante="secundario"
        tamanho="md"
        larguraTotal
        iconeEsquerda="chat"
        onClick={() => {}}
      >
        Falar com o fornecedor
      </Botao>
      {mostrarAvaliar && pedido.status === 'entregue' && !pedido.avaliacao && (
        <Botao
          variante="secundario"
          tamanho="md"
          larguraTotal
          iconeEsquerda="star"
          onClick={aoAbrirAvaliar}
        >
          Avaliar
        </Botao>
      )}
      {podeCancelar && (
        <Botao
          variante="terciario"
          tamanho="sm"
          larguraTotal
          onClick={aoAbrirCancelar}
        >
          Cancelar pedido
        </Botao>
      )}
    </div>
  );
}

// Card lateral do detalhe do pedido: ações (no computador), fornecedor, entrega e pagamento.
export function ResumoLateralPedido({
  pedido,
  fornecedor,
  podeCancelar,
  aoConfirmarPagamento,
  aoComprarDeNovo,
  aoAbrirCancelar,
}) {
  const temPrevisao = pedido.status !== 'cancelado' && pedido.previsaoEntrega;

  return (
    <aside className={estilos.card} aria-label="Resumo do pedido">
      <div className={estilos.acoesComputador}>
        <AcoesPedido
          pedido={pedido}
          podeCancelar={podeCancelar}
          aoConfirmarPagamento={aoConfirmarPagamento}
          aoComprarDeNovo={aoComprarDeNovo}
          aoAbrirCancelar={aoAbrirCancelar}
        />
        <Divisor />
      </div>

      {fornecedor && (
        <>
          <div className={estilos.blocoInfo}>
            <p className={estilos.rotuloInfo}>Fornecedor</p>
            <Link to={`/fornecedor/${fornecedor.id}`} className={estilos.linkFornecedor}>
              <IdentidadeFornecedor
                nome={fornecedor.nome}
                subtitulo={`${fornecedor.tipo} · ${fornecedor.cidade}`}
                logo={fornecedor.logo}
                verificado={fornecedor.verificado}
                tamanhoAvatar={32}
              />
            </Link>
            <NotaCompacta nota={fornecedor.nota} totalAvaliacoes={fornecedor.totalAvaliacoes} />
          </div>
          <Divisor />
        </>
      )}

      <div className={estilos.blocoInfo}>
        <p className={estilos.rotuloInfo}>Entrega</p>
        <p className={estilos.linhaIcone}>
          <Icone nome="location_on" tamanho={20} />
          <span>
            {pedido.modoEntrega === 'retirada'
              ? `Retirada no local (${fornecedor?.cidade || 'origem'})`
              : `${pedido.endereco.apelido} — ${pedido.endereco.rua}, ${pedido.endereco.numero}${pedido.endereco.bairro ? `, ${pedido.endereco.bairro}` : ''}, ${pedido.endereco.cidade} - ${pedido.endereco.uf}`}
          </span>
        </p>
        {temPrevisao && (
          <p className={estilos.linhaIcone}>
            <Icone nome="local_shipping" tamanho={20} />
            <span>
              {pedido.status === 'entregue'
                ? `Entregue em ${formatarDataCurta(pedido.previsaoEntrega)}`
                : `Previsão: ${formatarData(pedido.previsaoEntrega)}`}
            </span>
          </p>
        )}
      </div>

      <Divisor />

      <div className={estilos.blocoInfo}>
        <p className={estilos.rotuloInfo}>Pagamento</p>
        <p className={estilos.linhaIcone}>
          <Icone nome="qr_code_2" tamanho={20} />
          <span>
            {pedido.pagamento === 'boleto' ? 'Boleto bancário' : 'Pix'} ·{' '}
            {formatarReais(pedido.total)}
          </span>
        </p>
      </div>
    </aside>
  );
}
