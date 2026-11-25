import { Popover } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useState } from 'react';
import { Chip } from './Chip.jsx';
import { Gaveta } from './Sobreposicoes.jsx';
import estilos from './ChipLista.module.css';

// Chip de filtro com lista de escolha única: popover no computador e gaveta de baixo no celular.
// Recebe rotulo (nome do filtro), opcoes ({ valor, rotulo }), valor ("" = sem filtro) e aoAlterar.
export function ChipLista({ rotulo, opcoes = [], valor = '', aoAlterar, tituloGaveta = '' }) {
  const [aberto, setAberto] = useState(false);
  const ehCelular = useMediaQuery('(max-width: 47.99em)');
  const selecionada = opcoes.find((opcao) => opcao.valor === valor);

  // Aplica a escolha e fecha a lista.
  function escolher(novoValor) {
    aoAlterar?.(novoValor);
    setAberto(false);
  }

  const lista = (
    <ul className={estilos.lista} aria-label={rotulo}>
      <li>
        <button
          type="button"
          className={`${estilos.opcao} ${valor === '' ? estilos.ativa : ''}`}
          aria-pressed={valor === ''}
          onClick={() => escolher('')}
        >
          <span className={`${estilos.radio} ${valor === '' ? estilos.marcado : ''}`} aria-hidden="true" />
          <span>Todas</span>
        </button>
      </li>
      {opcoes.map((opcao) => (
        <li key={opcao.valor}>
          <button
            type="button"
            className={`${estilos.opcao} ${opcao.valor === valor ? estilos.ativa : ''}`}
            aria-pressed={opcao.valor === valor}
            onClick={() => escolher(opcao.valor)}
          >
            <span
              className={`${estilos.radio} ${opcao.valor === valor ? estilos.marcado : ''}`}
              aria-hidden="true"
            />
            <span>{opcao.rotulo}</span>
          </button>
        </li>
      ))}
    </ul>
  );

  const gatilho = (
    <Chip
      comBorda
      ativo={Boolean(selecionada)}
      iconeDireita={aberto ? 'expand_less' : 'expand_more'}
      aria-haspopup="listbox"
      aria-expanded={aberto}
      aoClicar={() => setAberto((atual) => !atual)}
    >
      {selecionada ? selecionada.rotulo : rotulo}
    </Chip>
  );

  if (ehCelular) {
    return (
      <>
        {gatilho}
        <Gaveta aberto={aberto} aoFechar={() => setAberto(false)} titulo={tituloGaveta || rotulo}>
          {lista}
        </Gaveta>
      </>
    );
  }

  return (
    <Popover opened={aberto} onChange={setAberto} position="bottom-start" width={260} withArrow={false} radius="lg" shadow="md">
      <Popover.Target>{gatilho}</Popover.Target>
      <Popover.Dropdown className={estilos.dropdown}>{lista}</Popover.Dropdown>
    </Popover>
  );
}
