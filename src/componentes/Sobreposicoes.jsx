import { Drawer, Modal, Popover, Tooltip } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useState } from 'react';
import { Botao } from './Botao.jsx';
import { Icone } from './Icone.jsx';
import estilos from './Sobreposicoes.module.css';

// Modal padronizado (Sobreposições V04/V05): cabeçalho com título e X tonal de 44 px,
// corpo e faixa de rodapé opcional. No celular, abre automaticamente como gaveta branca de baixo.
export function ModalBase({
  aberto,
  aoFechar,
  titulo,
  subtitulo = '',
  rodape = null,
  comFaixas = false,
  tamanho = 480,
  travarFechamento = false,
  children,
}) {
  const ehCelular = useMediaQuery('(max-width: 47.99em)');

  if (ehCelular) {
    return (
      <Gaveta
        aberto={aberto}
        aoFechar={travarFechamento ? () => {} : aoFechar}
        titulo={titulo}
        subtitulo={subtitulo}
        rodape={rodape}
        comFaixas={comFaixas}
        travarFechamento={travarFechamento}
      >
        {children}
      </Gaveta>
    );
  }

  return (
    <Modal
      opened={aberto}
      onClose={travarFechamento ? () => {} : aoFechar}
      withCloseButton={false}
      closeOnEscape={!travarFechamento}
      closeOnClickOutside={!travarFechamento}
      size={tamanho}
      padding={0}
      radius="lg"
      centered
      classNames={{ content: estilos.modalConteudo }}
    >
      <div className={`${estilos.modalCabecalho} ${comFaixas ? estilos.comFaixaCabecalho : ''}`}>
        <div className={estilos.cabecalhoTextos}>
          <h3 className={estilos.titulo}>{titulo}</h3>
          {subtitulo && <p className={estilos.subtitulo}>{subtitulo}</p>}
        </div>
        <Botao
          variante="icone"
          tamanho="sm"
          iconeEsquerda="close"
          aria-label="Fechar"
          desabilitado={travarFechamento}
          onClick={aoFechar}
        />
      </div>

      <div className={estilos.modalCorpo}>{children}</div>

      {rodape && (
        <div className={`${estilos.modalRodape} ${comFaixas ? estilos.comFaixaRodape : ''}`}>
          {rodape}
        </div>
      )}
    </Modal>
  );
}

// Gaveta que vem de baixo (bottom sheet) com alça.
// Padrão claro (branca, alça cinza 5); variante escura reservada ao menu "Mais" e navbar celular.
export function Gaveta({
  aberto,
  aoFechar,
  titulo = '',
  subtitulo = '',
  rodape = null,
  escura = false,
  comFaixas = false,
  travarFechamento = false,
  children,
}) {
  return (
    <Drawer
      opened={aberto}
      onClose={travarFechamento ? () => {} : aoFechar}
      position="bottom"
      size="auto"
      withCloseButton={false}
      closeOnEscape={!travarFechamento}
      closeOnClickOutside={!travarFechamento}
      padding={0}
      classNames={{
        content: `${estilos.gavetaConteudo} ${escura ? estilos.gavetaEscura : ''}`,
        body: estilos.gavetaBody,
      }}
    >
      <span className={`${estilos.alca} ${escura ? estilos.alcaEscura : ''}`} aria-hidden="true" />

      {titulo && (
        <div className={`${estilos.gavetaCabecalho} ${comFaixas ? estilos.comFaixaCabecalho : ''}`}>
          <div className={estilos.cabecalhoTextos}>
            <h3 className={`${estilos.titulo} ${escura ? estilos.tituloEscuro : ''}`}>{titulo}</h3>
            {subtitulo && (
              <p className={`${estilos.subtitulo} ${escura ? estilos.subtituloEscuro : ''}`}>
                {subtitulo}
              </p>
            )}
          </div>
          {escura ? (
            <button
              type="button"
              className={estilos.fecharEscuro}
              onClick={aoFechar}
              disabled={travarFechamento}
              aria-label="Fechar"
            >
              <Icone nome="close" tamanho={20} />
            </button>
          ) : (
            <Botao
              variante="icone"
              tamanho="sm"
              iconeEsquerda="close"
              aria-label="Fechar"
              desabilitado={travarFechamento}
              onClick={aoFechar}
            />
          )}
        </div>
      )}

      <div className={estilos.gavetaCorpo}>{children}</div>

      {rodape && (
        <div
          className={[
            estilos.gavetaRodape,
            comFaixas ? estilos.comFaixaRodape : '',
            escura ? estilos.rodapeEscuro : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {rodape}
        </div>
      )}
    </Drawer>
  );
}

// Tooltip claro sem seta (Sobreposições V03), acionado em hover, foco e toque.
export function TooltipBase({ texto, children, largura = 240 }) {
  return (
    <Tooltip
      label={texto}
      multiline
      w={largura}
      withArrow={false}
      events={{ hover: true, focus: true, touch: true }}
      classNames={{ tooltip: estilos.tooltip }}
    >
      {children}
    </Tooltip>
  );
}

// Popover claro sem seta (Sobreposições V03), com botão fechar de 44 px.
export function PopoverBase({ aberto, aoAlterar, gatilho, titulo = '', children, largura = 300 }) {
  return (
    <Popover
      opened={aberto}
      onChange={aoAlterar}
      width={largura}
      withArrow={false}
      radius="lg"
      shadow="md"
      trapFocus
      returnFocus
    >
      <Popover.Target>{gatilho}</Popover.Target>
      <Popover.Dropdown className={estilos.popover}>
        {titulo && (
          <div className={estilos.popoverCabecalho}>
            <h4 className={estilos.popoverTitulo}>{titulo}</h4>
            <Botao
              variante="icone"
              tamanho="sm"
              iconeEsquerda="close"
              aria-label="Fechar"
              onClick={() => aoAlterar?.(false)}
            />
          </div>
        )}
        {children}
      </Popover.Dropdown>
    </Popover>
  );
}

// Menu "Ordenar" em pill (regra §9) com lista de rádio (Sobreposições V02).
// No celular, abre em gaveta branca de baixo.
export function MenuOrdenar({
  opcoes = [],
  valor,
  aoAlterar,
  rotuloPrefixo = 'Ordenar:',
  className = '',
}) {
  const [aberto, setAberto] = useState(false);
  const ehCelular = useMediaQuery('(max-width: 47.99em)');
  const selecionada = opcoes.find((o) => o.valor === valor) || opcoes[0];

  // Aplica a opção escolhida e fecha o menu ou gaveta.
  function escolher(novoValor) {
    aoAlterar?.(novoValor);
    setAberto(false);
  }

  const listaOpcoes = (
    <ul className={estilos.listaOrdenar} role="listbox" aria-label="Ordenar por">
      {opcoes.map((opcao) => {
        const ativa = opcao.valor === valor;
        return (
          <li key={opcao.valor} role="option" aria-selected={ativa}>
            <button
              type="button"
              className={`${estilos.opcaoOrdenar} ${ativa ? estilos.opcaoAtiva : ''}`}
              onClick={() => escolher(opcao.valor)}
            >
              <span className={`${estilos.radio} ${ativa ? estilos.radioMarcado : ''}`} aria-hidden="true" />
              <span>{opcao.rotulo}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );

  const gatilho = (
    <button
      type="button"
      className={`${estilos.gatilhoOrdenar} ${aberto ? estilos.gatilhoAberto : ''} ${className}`}
      aria-haspopup="listbox"
      aria-expanded={aberto}
      onClick={() => setAberto((atual) => !atual)}
    >
      <Icone nome="swap_vert" tamanho={20} />
      <span>
        {rotuloPrefixo} <strong>{selecionada?.rotuloCurto || selecionada?.rotulo}</strong>
      </span>
      <Icone nome={aberto ? 'expand_less' : 'expand_more'} tamanho={20} />
    </button>
  );

  if (ehCelular) {
    return (
      <>
        {gatilho}
        <Gaveta aberto={aberto} aoFechar={() => setAberto(false)} titulo="Ordenar por">
          {listaOpcoes}
        </Gaveta>
      </>
    );
  }

  return (
    <Popover
      opened={aberto}
      onChange={setAberto}
      position="bottom-end"
      width={280}
      withArrow={false}
      radius="lg"
      shadow="md"
    >
      <Popover.Target>{gatilho}</Popover.Target>
      <Popover.Dropdown className={estilos.dropdownOrdenar}>{listaOpcoes}</Popover.Dropdown>
    </Popover>
  );
}
