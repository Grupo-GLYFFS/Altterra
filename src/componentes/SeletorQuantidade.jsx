import { useId, useState } from 'react';
import { Icone } from './Icone.jsx';
import estilos from './SeletorQuantidade.module.css';

// Seletor numérico em pill com botões menos/mais e unidade colada ao valor.
// Usado em tamanho "md" (56 px) na página do produto e "sm" (44 px) no carrinho.
export function SeletorQuantidade({
  valor,
  aoAlterar,
  minimo = 1,
  maximo = 9999,
  passo = 1,
  unidade = 'kg',
  tamanho = 'md',
  permitirRemover = false,
  aoRemover,
  comErro = false,
  desabilitado = false,
  rotulo = 'Quantidade',
  className = '',
}) {
  const idCampo = useId();
  const [rascunho, setRascunho] = useState(null);
  const noMinimo = valor <= minimo;
  const noMaximo = valor >= maximo;
  const tamanhoIcone = tamanho === 'sm' ? 20 : 24;

  // Diminui o valor pelo passo ou aciona remoção quando está no mínimo no carrinho.
  function diminuir() {
    if (desabilitado) return;
    setRascunho(null);
    if (noMinimo && permitirRemover && aoRemover) {
      aoRemover();
      return;
    }
    const proximo = Math.max(minimo, valor - passo);
    aoAlterar?.(proximo);
  }

  // Aumenta o valor respeitando o limite máximo disponível.
  function aumentar() {
    if (desabilitado || noMaximo) return;
    setRascunho(null);
    const proximo = Math.min(maximo, valor + passo);
    aoAlterar?.(proximo);
  }

  // Seleciona o número inteiro ao focar para que a digitação substitua o valor atual.
  function focarCampo(evento) {
    setRascunho(String(valor));
    evento.target.select();
  }

  // Garante a seleção do número inteiro também ao clicar com o mouse.
  function clicarCampo(evento) {
    evento.target.select();
  }

  // Aceita digitação manual de números inteiros positivos sem voltar ao mínimo no meio da digitação.
  function alterarTexto(evento) {
    const digitos = evento.target.value.replace(/\D/g, '');
    if (!digitos) {
      setRascunho('');
      return;
    }
    const numero = Number(digitos);
    if (numero > maximo) {
      setRascunho(String(maximo));
      aoAlterar?.(maximo);
      return;
    }
    setRascunho(digitos);
    if (numero >= minimo) {
      aoAlterar?.(numero);
    }
  }

  // Aplica o valor digitado respeitando o mínimo e o máximo ao sair do campo.
  function validarSaida() {
    const texto = rascunho;
    setRascunho(null);
    if (texto === null) {
      if (valor < minimo) aoAlterar?.(minimo);
      return;
    }
    const numero = Number(texto);
    if (!texto || Number.isNaN(numero) || numero < minimo) {
      aoAlterar?.(minimo);
      return;
    }
    aoAlterar?.(Math.min(maximo, numero));
  }

  const classes = [
    estilos.seletor,
    tamanho === 'sm' ? estilos.sm : estilos.md,
    comErro ? estilos.erro : '',
    desabilitado ? estilos.desabilitado : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const mostrarLixeira = noMinimo && permitirRemover;

  return (
    <div className={classes} role="group" aria-label={rotulo}>
      <button
        type="button"
        className={estilos.botao}
        onClick={diminuir}
        disabled={desabilitado || (noMinimo && !permitirRemover)}
        aria-label={mostrarLixeira ? 'Remover do carrinho' : 'Diminuir quantidade'}
      >
        <Icone nome={mostrarLixeira ? 'delete' : 'remove'} tamanho={tamanhoIcone} />
      </button>

      <label htmlFor={idCampo} className={estilos.valorGrupo}>
        <input
          id={idCampo}
          type="text"
          inputMode="numeric"
          className={estilos.entrada}
          value={rascunho !== null ? rascunho : valor}
          onFocus={focarCampo}
          onClick={clicarCampo}
          onChange={alterarTexto}
          onBlur={validarSaida}
          disabled={desabilitado}
          aria-label={`${rotulo} em ${unidade}`}
        />
        <span className={estilos.unidade}>{unidade}</span>
      </label>

      <button
        type="button"
        className={estilos.botao}
        onClick={aumentar}
        disabled={desabilitado || noMaximo}
        aria-label="Aumentar quantidade"
      >
        <Icone nome="add" tamanho={tamanhoIcone} />
      </button>
    </div>
  );
}
