import { useState } from 'react';
import { Botao } from '../Botao.jsx';
import { GrupoRadio } from '../Campo.jsx';
import { ModalBase } from '../Sobreposicoes.jsx';
import { formatarReais } from '../../logica/formatos.js';
import estilos from './ModalRecusarPedido.module.css';

const MOTIVOS_RECUSA = [
  { valor: 'estoque', rotulo: 'Não tenho estoque suficiente' },
  { valor: 'endereco', rotulo: 'Não entrego nesse endereço' },
  { valor: 'prazo', rotulo: 'O prazo de entrega não atende' },
  { valor: 'outro', rotulo: 'Outro motivo' },
];

// Modal para o fornecedor recusar um pedido recebido escolhendo o motivo (padrão C5).
// No celular, abre automaticamente como gaveta clara pelo ModalBase.
export function ModalRecusarPedido({ pedido, aoFechar, aoConfirmar }) {
  const [motivo, setMotivo] = useState('estoque');

  // Confirma a recusa e volta o motivo padrão para o próximo uso.
  function confirmar() {
    if (!pedido) return;
    aoConfirmar(pedido, motivo);
    setMotivo('estoque');
  }

  return (
    <ModalBase
      aberto={Boolean(pedido)}
      aoFechar={aoFechar}
      titulo={pedido ? `Recusar o pedido ${pedido.id}?` : 'Recusar pedido'}
      comFaixas
      rodape={
        <div className={estilos.rodape}>
          <Botao variante="secundario" tamanho="sm" onClick={aoFechar}>
            Voltar
          </Botao>
          <Botao variante="perigo" tamanho="sm" onClick={confirmar}>
            Recusar pedido
          </Botao>
        </div>
      }
    >
      {pedido && (
        <div className={estilos.corpo}>
          <p className={estilos.aviso}>
            {pedido.compradorEmpresa} recebe o aviso do cancelamento e o estorno de{' '}
            {formatarReais(pedido.total)}. O motivo escolhido aparece para o comprador.
          </p>

          <GrupoRadio
            rotulo="Motivo da recusa"
            opcoes={MOTIVOS_RECUSA}
            valor={motivo}
            aoAlterar={setMotivo}
            cartao
          />
        </div>
      )}
    </ModalBase>
  );
}
