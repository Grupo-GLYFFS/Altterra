import { Icone } from './Icone.jsx';
import estilos from './Avaliacao.module.css';

const LEGENDAS_NOTA = ['', 'Muito ruim', 'Ruim', 'Regular', 'Bom', 'Muito bom'];

// Formata nota numérica com uma casa decimal em português (ex.: "4,3").
function formatarNota(nota) {
  return Number(nota).toLocaleString('pt-BR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

// Exibe uma estrela preenchida em dourado 8 seguida da nota numérica e contagem opcional.
export function NotaCompacta({ nota, totalAvaliacoes, className = '' }) {
  if (nota === null || nota === undefined) {
    return <span className={`${estilos.vazia} ${className}`}>Sem avaliações ainda</span>;
  }

  return (
    <span
      className={`${estilos.compacta} ${className}`}
      aria-label={`Nota ${formatarNota(nota)} de 5${totalAvaliacoes ? `, ${totalAvaliacoes} avaliações` : ''}`}
    >
      <Icone nome="star" tamanho={16} preenchido className={estilos.estrelaCheia} />
      <span className={estilos.numero}>{formatarNota(nota)}</span>
      {typeof totalAvaliacoes === 'number' && (
        <span className={estilos.contagem}>({totalAvaliacoes})</span>
      )}
    </span>
  );
}

// Exibe 5 estrelas (cheia, meia ou vazia) em dourado 8 e cinza 5, sempre acompanhadas da nota.
export function Estrelas({ nota = 0, tamanho = 20, mostrarNumero = true, className = '' }) {
  return (
    <span
      className={`${estilos.estrelas} ${className}`}
      aria-label={`Nota ${formatarNota(nota)} de 5`}
    >
      <span className={estilos.filaEstrelas} aria-hidden="true">
        {[1, 2, 3, 4, 5].map((indice) => {
          const diferenca = nota - (indice - 1);
          if (diferenca >= 0.75) {
            return (
              <Icone
                key={indice}
                nome="star"
                tamanho={tamanho}
                preenchido
                className={estilos.estrelaCheia}
              />
            );
          }
          if (diferenca >= 0.25) {
            return (
              <Icone
                key={indice}
                nome="star_half"
                tamanho={tamanho}
                preenchido
                className={estilos.estrelaCheia}
              />
            );
          }
          return (
            <Icone key={indice} nome="star" tamanho={tamanho} className={estilos.estrelaVazia} />
          );
        })}
      </span>
      {mostrarNumero && <span className={estilos.numero}>{formatarNota(nota)}</span>}
    </span>
  );
}

// Resumo de avaliações com nota em destaque e barras proporcionais de 5 a 1 estrela.
export function ResumoAvaliacoes({ nota, totalAvaliacoes = 0, distribuicao = {}, className = '' }) {
  const total = totalAvaliacoes || Object.values(distribuicao).reduce((acc, n) => acc + n, 0);

  return (
    <div className={`${estilos.resumo} ${className}`}>
      <div className={estilos.resumoEsquerda}>
        <p className={estilos.notaGrande}>{formatarNota(nota)}</p>
        <Estrelas nota={nota} tamanho={20} mostrarNumero={false} />
        <p className={estilos.totalTexto}>{total} avaliações</p>
      </div>

      <div className={estilos.barras}>
        {[5, 4, 3, 2, 1].map((estrela) => {
          const qtd = distribuicao[estrela] || 0;
          const porcentagem = total > 0 ? Math.round((qtd / total) * 100) : 0;
          return (
            <div key={estrela} className={estilos.barraLinha}>
              <span className={estilos.barraRotulo}>
                {estrela}
                <Icone nome="star" tamanho={16} preenchido className={estilos.estrelaCheia} />
              </span>
              <progress
                className={estilos.progresso}
                value={porcentagem}
                max={100}
                aria-label={`${estrela} estrelas: ${qtd} avaliações`}
              />
              <span className={estilos.barraQtd}>{qtd}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Seletor interativo de nota de 1 a 5 estrelas com alvos de 44 px (para avaliar pedido entregue).
export function SeletorNota({
  valor = 0,
  aoAlterar,
  rotulo = 'Sua nota',
  erro = '',
  className = '',
}) {
  return (
    <div className={`${estilos.seletor} ${className}`}>
      <span className={estilos.seletorRotulo}>{rotulo}</span>
      <div className={estilos.seletorBotoes} role="radiogroup" aria-label={rotulo}>
        {[1, 2, 3, 4, 5].map((estrela) => {
          const marcada = estrela <= valor;
          return (
            <button
              key={estrela}
              type="button"
              role="radio"
              aria-checked={valor === estrela}
              aria-label={`${estrela} ${estrela === 1 ? 'estrela' : 'estrelas'}`}
              className={`${estilos.botaoEstrela} ${marcada ? estilos.estrelaCheia : estilos.estrelaVazia}`}
              onClick={() => aoAlterar?.(estrela)}
            >
              <Icone nome="star" tamanho={28} preenchido={marcada} />
            </button>
          );
        })}
        {valor > 0 && <span className={estilos.legenda}>{LEGENDAS_NOTA[valor]}</span>}
      </div>
      {erro && (
        <p className={estilos.erro} role="alert">
          <Icone nome="error" tamanho={16} />
          <span>{erro}</span>
        </p>
      )}
    </div>
  );
}
