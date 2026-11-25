import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Botao } from '../Botao.jsx';
import { AvaliacaoPedido } from '../comprador/AvaliacaoPedido.jsx';
import { AcoesPedido, ResumoLateralPedido } from '../comprador/ResumoLateralPedido.jsx';
import { Divisor } from '../Divisor.jsx';
import { LinhaDoTempo } from '../LinhaDoTempo.jsx';
import { Selo } from '../Selo.jsx';
import { ModalBase } from '../Sobreposicoes.jsx';
import { formatarData, formatarReais } from '../../logica/formatos.js';
import { STATUS_PEDIDO, montarEtapasPedido } from '../../logica/pedidos.js';
import estilos from './DetalhePedido.module.css';

// Detalhe de um pedido em 2 colunas: andamento, itens e avaliação (se entregue) à esquerda;
// ações, fornecedor, entrega e pagamento à direita. No celular, as ações vêm logo após o título.
export function DetalhePedido({
  pedido,
  fornecedor,
  aoVoltar,
  aoComprarDeNovo,
  aoConfirmarPagamento,
  aoCancelar,
  aoAvaliar,
}) {
  const [modalCancelar, setModalCancelar] = useState(false);
  const [gavetaAvaliar, setGavetaAvaliar] = useState(false);

  const infoStatus = STATUS_PEDIDO[pedido.status] || STATUS_PEDIDO.aguardando_pagamento;
  const podeCancelar = pedido.status === 'aguardando_pagamento' || pedido.status === 'em_separacao';
  const primeiro = pedido.itens[0];
  const pesoTotal = pedido.itens.reduce((soma, item) => soma + item.quantidade, 0);

  return (
    <div className={estilos.pagina}>
      <div>
        <Botao variante="terciario" tamanho="sm" iconeEsquerda="arrow_back" onClick={aoVoltar}>
          Meus pedidos
        </Botao>
      </div>

      <header className={estilos.cabecalho}>
        <div className={estilos.tituloLinha}>
          <h1 className={estilos.titulo}>Pedido {pedido.id}</h1>
          <Selo variante={infoStatus.variante}>{infoStatus.rotulo}</Selo>
        </div>
        <p className={estilos.meta}>
          Feito em {formatarData(pedido.criadoEm)}
          {fornecedor ? ` · ${fornecedor.nome}` : ''} · {pedido.itens.length}{' '}
          {pedido.itens.length === 1 ? 'item' : 'itens'} · {pesoTotal.toLocaleString('pt-BR')}{' '}
          {primeiro?.unidade || 'kg'}
        </p>
      </header>

      {/* Ações no topo da tela no celular, conforme Pedidos-final-celular */}
      <div className={estilos.acoesCelular}>
        <AcoesPedido
          pedido={pedido}
          podeCancelar={podeCancelar}
          mostrarAvaliar
          aoConfirmarPagamento={aoConfirmarPagamento}
          aoComprarDeNovo={aoComprarDeNovo}
          aoAbrirAvaliar={() => setGavetaAvaliar(true)}
          aoAbrirCancelar={() => setModalCancelar(true)}
        />
      </div>

      <div className={estilos.grade}>
        <div className={estilos.esquerda}>
          <section className={estilos.card} aria-label="Andamento do pedido">
            <div className={estilos.cardTopo}>
              <h2 className={estilos.cardTitulo}>Andamento</h2>
              {pedido.status !== 'cancelado' && (
                <span className={estilos.meta}>
                  Previsão: {formatarData(pedido.previsaoEntrega)}
                </span>
              )}
            </div>
            <LinhaDoTempo etapas={montarEtapasPedido(pedido)} />
          </section>

          <section className={estilos.card} aria-label="Itens do pedido">
            <div className={estilos.cardTopo}>
              <h2 className={estilos.cardTitulo}>Itens</h2>
              <span className={estilos.meta}>
                {pedido.itens.length} {pedido.itens.length === 1 ? 'item' : 'itens'} ·{' '}
                {pesoTotal.toLocaleString('pt-BR')} {primeiro?.unidade || 'kg'}
              </span>
            </div>

            <ul className={estilos.listaItens}>
              {pedido.itens.map((item) => (
                <li key={item.produtoId} className={estilos.itemLinha}>
                  {item.imagem ? (
                    <img src={item.imagem} alt="" className={estilos.miniatura} />
                  ) : (
                    <span className={estilos.miniatura} aria-hidden="true" />
                  )}
                  <div className={estilos.itemTextos}>
                    <Link to={`/produto/${item.produtoId}`} className={estilos.itemNome}>
                      {item.nome}
                    </Link>
                    <p className={estilos.meta}>
                      {item.quantidade.toLocaleString('pt-BR')} {item.unidade} ×{' '}
                      {formatarReais(item.precoUnit)}/{item.unidade}
                    </p>
                  </div>
                  <strong className={estilos.itemValor}>{formatarReais(item.subtotal)}</strong>
                </li>
              ))}
            </ul>

            <Divisor />

            <dl className={estilos.totais}>
              <div>
                <dt>Produtos</dt>
                <dd>{formatarReais(pedido.subtotal)}</dd>
              </div>
              <div>
                <dt>Frete</dt>
                <dd>{pedido.frete === 0 ? 'Grátis' : formatarReais(pedido.frete)}</dd>
              </div>
              <div className={estilos.totalFinal}>
                <dt>Total</dt>
                <dd>{formatarReais(pedido.total)}</dd>
              </div>
            </dl>
          </section>

          {pedido.status === 'entregue' && (
            <AvaliacaoPedido
              pedido={pedido}
              fornecedor={fornecedor}
              gavetaAberta={gavetaAvaliar}
              aoFecharGaveta={() => setGavetaAvaliar(false)}
              aoAvaliar={aoAvaliar}
            />
          )}
        </div>

        <ResumoLateralPedido
          pedido={pedido}
          fornecedor={fornecedor}
          podeCancelar={podeCancelar}
          aoConfirmarPagamento={aoConfirmarPagamento}
          aoComprarDeNovo={aoComprarDeNovo}
          aoAbrirCancelar={() => setModalCancelar(true)}
        />
      </div>

      {/* Modal de cancelamento (Sobreposições V05 com faixas; gaveta clara no celular) */}
      <ModalBase
        aberto={modalCancelar}
        aoFechar={() => setModalCancelar(false)}
        titulo={`Cancelar o pedido ${pedido.id}?`}
        comFaixas
        rodape={
          <div className={estilos.rodapeModal}>
            <Botao variante="secundario" tamanho="sm" onClick={() => setModalCancelar(false)}>
              Voltar
            </Botao>
            <Botao
              variante="perigo"
              tamanho="sm"
              onClick={() => {
                aoCancelar(pedido.id);
                setModalCancelar(false);
              }}
            >
              Cancelar pedido
            </Botao>
          </div>
        }
      >
        <div className={estilos.corpoCancelar}>
          <p className={estilos.meta}>
            O fornecedor ainda não enviou o pedido. Ao cancelar, a cobrança de{' '}
            <strong>{formatarReais(pedido.total)}</strong> deixa de valer e nada é cobrado.
          </p>
          {primeiro && (
            <div className={estilos.resumoCancelar}>
              {primeiro.imagem ? (
                <img src={primeiro.imagem} alt="" className={estilos.miniatura} />
              ) : (
                <span className={estilos.miniatura} aria-hidden="true" />
              )}
              <div className={estilos.itemTextos}>
                <strong className={estilos.itemNome}>{primeiro.nome}</strong>
                <p className={estilos.meta}>
                  {fornecedor?.nome ? `${fornecedor.nome} · ` : ''}
                  {pesoTotal.toLocaleString('pt-BR')} {primeiro.unidade}
                </p>
              </div>
              <strong className={estilos.itemValor}>{formatarReais(pedido.total)}</strong>
            </div>
          )}
        </div>
      </ModalBase>
    </div>
  );
}
