import { useId } from 'react';
import { Icone } from './Icone.jsx';
import estilos from './ControleSegmentado.module.css';

// Controle segmentado em pill com trilho cinza 1 e item ativo cheio em verde 7 (T2).
// Recebe opcoes ({ valor, rotulo, icone }), valor atual, aoAlterar, tamanho ("md" | "sm") e larguraTotal.
export function ControleSegmentado({
  opcoes,
  valor,
  aoAlterar,
  tamanho = 'md',
  larguraTotal = false,
  desabilitado = false,
  rotulo = 'Opções',
  className = '',
}) {
  const nomeGrupo = useId();
  const tamanhoIcone = tamanho === 'sm' ? 20 : 24;

  const classes = [
    estilos.trilho,
    tamanho === 'sm' ? estilos.sm : estilos.md,
    larguraTotal ? estilos.larguraTotal : '',
    desabilitado ? estilos.desabilitado : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} role="radiogroup" aria-label={rotulo}>
      {opcoes.map((opcao) => {
        const ativo = opcao.valor === valor;
        const idOpcao = `${nomeGrupo}-${opcao.valor}`;

        return (
          <label
            key={opcao.valor}
            htmlFor={idOpcao}
            className={`${estilos.opcao} ${ativo ? estilos.ativa : ''}`}
          >
            <input
              id={idOpcao}
              type="radio"
              name={nomeGrupo}
              value={opcao.valor}
              checked={ativo}
              disabled={desabilitado}
              onChange={() => aoAlterar?.(opcao.valor)}
              className="somenteLeitor"
            />
            {opcao.icone && <Icone nome={opcao.icone} tamanho={tamanhoIcone} />}
            <span>{opcao.rotulo}</span>
          </label>
        );
      })}
    </div>
  );
}
