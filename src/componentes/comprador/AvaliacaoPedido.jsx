import { useState } from 'react';
import { Estrelas, SeletorNota } from '../Avaliacao.jsx';
import { Aviso } from '../Aviso.jsx';
import { Botao } from '../Botao.jsx';
import { CampoArea } from '../Campo.jsx';
import { Gaveta } from '../Sobreposicoes.jsx';
import { formatarData } from '../../logica/formatos.js';
import estilos from './AvaliacaoPedido.module.css';

const LIMITE_COMENTARIO = 400;

// Avaliação do pedido entregue: card na coluna esquerda no computador e gaveta clara no celular.
export function AvaliacaoPedido({
  pedido,
  fornecedor,
  gavetaAberta,
  aoFecharGaveta,
  aoAvaliar,
}) {
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState('');
  const [erroNota, setErroNota] = useState('');

  // Valida a nota de 1 a 5 estrelas e salva a avaliação do pedido entregue.
  function enviarAvaliacao(evento) {
    evento.preventDefault();
    if (nota < 1) {
      setErroNota('Escolha de 1 a 5 estrelas.');
      return;
    }
    setErroNota('');
    aoAvaliar(pedido.id, nota, comentario.trim());
    aoFecharGaveta?.();
  }

  // Atualiza o comentário respeitando o limite de 400 caracteres.
  function alterarComentario(evento) {
    setComentario(evento.target.value.slice(0, LIMITE_COMENTARIO));
  }

  const camposFormulario = (
    <>
      <SeletorNota
        valor={nota}
        aoAlterar={(n) => {
          setNota(n);
          setErroNota('');
        }}
        erro={erroNota}
      />
      <div className={estilos.campoComContador}>
        <CampoArea
          rotulo="Comentário"
          opcional
          placeholder="Como chegaram os produtos? A entrega foi no horário?"
          value={comentario}
          onChange={alterarComentario}
        />
        <span className={estilos.contador} aria-live="polite">
          {comentario.length}/{LIMITE_COMENTARIO}
        </span>
      </div>
      <p className={estilos.meta}>
        Sua nota aparece na página do fornecedor e ajuda outros compradores.
      </p>
    </>
  );

  return (
    <>
      <section
        className={`${estilos.card} ${!pedido.avaliacao ? estilos.somenteComputador : ''}`}
        aria-label="Avaliação do pedido"
      >
        <h2 className={estilos.titulo}>
          Como foi comprar de {fornecedor?.nome || 'este fornecedor'}?
        </h2>

        {pedido.avaliacao ? (
          <div className={estilos.avaliacaoFeita}>
            <Aviso tipo="sucesso" titulo="Avaliação enviada" />
            <Estrelas nota={pedido.avaliacao.nota} tamanho={24} />
            {pedido.avaliacao.comentario && (
              <p className={estilos.comentario}>{pedido.avaliacao.comentario}</p>
            )}
            <p className={estilos.meta}>Enviada em {formatarData(pedido.avaliacao.data)}</p>
          </div>
        ) : (
          <form onSubmit={enviarAvaliacao} className={estilos.formulario} noValidate>
            {camposFormulario}
            <div>
              <Botao tipo="submit" tamanho="md">
                Enviar avaliação
              </Botao>
            </div>
          </form>
        )}
      </section>

      {!pedido.avaliacao && (
        <Gaveta
          aberto={gavetaAberta}
          aoFechar={aoFecharGaveta}
          titulo="Avaliar o pedido"
          subtitulo={`${fornecedor?.nome || 'Fornecedor'} · ${pedido.id}`}
          comFaixas
          rodape={
            <Botao tipo="submit" form="form-avaliar-gaveta" tamanho="md" larguraTotal>
              Enviar avaliação
            </Botao>
          }
        >
          <form
            id="form-avaliar-gaveta"
            onSubmit={enviarAvaliacao}
            className={estilos.formulario}
            noValidate
          >
            {camposFormulario}
          </form>
        </Gaveta>
      )}
    </>
  );
}
