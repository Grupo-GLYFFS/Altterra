import { forwardRef, useId } from 'react';
import { Icone } from './Icone.jsx';
import estilos from './Campo.module.css';

// Bloco branco de seção para formulários longos (padrão C5).
// Recebe titulo, descricao opcional e children.
export function BlocoFormulario({ titulo, descricao = '', children, className = '' }) {
  return (
    <fieldset className={`${estilos.bloco} ${className}`}>
      <div className={estilos.blocoCabecalho}>
        <legend className={estilos.blocoTitulo}>{titulo}</legend>
        {descricao && <p className={estilos.blocoDescricao}>{descricao}</p>}
      </div>
      <div className={estilos.blocoCorpo}>{children}</div>
    </fieldset>
  );
}

// Campo de texto C5: rótulo acima, "(opcional)" apenas nos opcionais, borda cinza 5, raio 8 e altura 56.
// Suporta prefixo/sufixo em segmento cinza 1, carregando, sucesso, erro e somente leitura.
export const CampoTexto = forwardRef(function CampoTexto(
  {
    rotulo,
    opcional = false,
    erro = '',
    dica = '',
    prefixo = '',
    sufixo = '',
    carregando = false,
    sucesso = false,
    somenteLeitura = false,
    desabilitado = false,
    id: idExterno,
    className = '',
    ...props
  },
  ref
) {
  const idGerado = useId();
  const id = idExterno || idGerado;
  const idMensagem = erro || dica ? `${id}-msg` : undefined;

  const classesGrupo = [
    estilos.grupo,
    erro ? estilos.comErro : '',
    somenteLeitura ? estilos.somenteLeitura : '',
    desabilitado ? estilos.desabilitado : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classesGrupo}>
      {rotulo && (
        <label htmlFor={id} className={estilos.rotulo}>
          {rotulo}
          {opcional && <span className={estilos.opcional}> (opcional)</span>}
        </label>
      )}

      <div className={estilos.caixa}>
        {prefixo && <span className={estilos.segmentoEsquerda}>{prefixo}</span>}

        <input
          ref={ref}
          id={id}
          className={estilos.entrada}
          readOnly={somenteLeitura}
          disabled={desabilitado}
          aria-invalid={Boolean(erro) || undefined}
          aria-describedby={idMensagem}
          {...props}
        />

        {carregando && (
          <span className={estilos.secaoDireita} aria-label="Buscando">
            <span className={estilos.spinner} aria-hidden="true" />
          </span>
        )}
        {!carregando && erro && (
          <span className={`${estilos.secaoDireita} ${estilos.iconeErro}`}>
            <Icone nome="error" tamanho={20} />
          </span>
        )}
        {!carregando && !erro && sucesso && (
          <span className={`${estilos.secaoDireita} ${estilos.iconeSucesso}`}>
            <Icone nome="check_circle" tamanho={20} />
          </span>
        )}

        {sufixo && <span className={estilos.segmentoDireita}>{sufixo}</span>}
      </div>

      {erro && (
        <p id={idMensagem} className={estilos.mensagemErro} role="alert">
          <Icone nome="error" tamanho={16} />
          <span>{erro}</span>
        </p>
      )}
      {!erro && dica && (
        <p id={idMensagem} className={estilos.dica}>
          {dica}
        </p>
      )}
    </div>
  );
});

// Campo select no padrão C5 (altura 56, raio 8, borda cinza 5, ícone expand_more).
export const CampoSelect = forwardRef(function CampoSelect(
  {
    rotulo,
    opcoes = [],
    opcional = false,
    erro = '',
    dica = '',
    placeholder = '',
    desabilitado = false,
    id: idExterno,
    className = '',
    ...props
  },
  ref
) {
  const idGerado = useId();
  const id = idExterno || idGerado;
  const idMensagem = erro || dica ? `${id}-msg` : undefined;

  const classesGrupo = [
    estilos.grupo,
    erro ? estilos.comErro : '',
    desabilitado ? estilos.desabilitado : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classesGrupo}>
      {rotulo && (
        <label htmlFor={id} className={estilos.rotulo}>
          {rotulo}
          {opcional && <span className={estilos.opcional}> (opcional)</span>}
        </label>
      )}

      <div className={estilos.caixaSelect}>
        <select
          ref={ref}
          id={id}
          className={estilos.select}
          disabled={desabilitado}
          aria-invalid={Boolean(erro) || undefined}
          aria-describedby={idMensagem}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {opcoes.map((opcao) => {
            const valor = typeof opcao === 'string' ? opcao : opcao.valor;
            const texto = typeof opcao === 'string' ? opcao : opcao.rotulo;
            return (
              <option key={valor} value={valor}>
                {texto}
              </option>
            );
          })}
        </select>
        <span className={estilos.setaSelect}>
          <Icone nome="expand_more" tamanho={20} />
        </span>
      </div>

      {erro && (
        <p id={idMensagem} className={estilos.mensagemErro} role="alert">
          <Icone nome="error" tamanho={16} />
          <span>{erro}</span>
        </p>
      )}
      {!erro && dica && (
        <p id={idMensagem} className={estilos.dica}>
          {dica}
        </p>
      )}
    </div>
  );
});

// Área de texto multilinha no padrão C5 (raio 8, borda cinza 5).
export const CampoArea = forwardRef(function CampoArea(
  {
    rotulo,
    opcional = false,
    erro = '',
    dica = '',
    linhas = 4,
    desabilitado = false,
    id: idExterno,
    className = '',
    ...props
  },
  ref
) {
  const idGerado = useId();
  const id = idExterno || idGerado;
  const idMensagem = erro || dica ? `${id}-msg` : undefined;

  const classesGrupo = [
    estilos.grupo,
    erro ? estilos.comErro : '',
    desabilitado ? estilos.desabilitado : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classesGrupo}>
      {rotulo && (
        <label htmlFor={id} className={estilos.rotulo}>
          {rotulo}
          {opcional && <span className={estilos.opcional}> (opcional)</span>}
        </label>
      )}

      <textarea
        ref={ref}
        id={id}
        rows={linhas}
        className={estilos.area}
        disabled={desabilitado}
        aria-invalid={Boolean(erro) || undefined}
        aria-describedby={idMensagem}
        {...props}
      />

      {erro && (
        <p id={idMensagem} className={estilos.mensagemErro} role="alert">
          <Icone nome="error" tamanho={16} />
          <span>{erro}</span>
        </p>
      )}
      {!erro && dica && (
        <p id={idMensagem} className={estilos.dica}>
          {dica}
        </p>
      )}
    </div>
  );
});

// Grupo de opções de rádio em lista simples ou cartões (Radio.Card do C5).
export function GrupoRadio({
  rotulo,
  opcoes = [],
  valor,
  aoAlterar,
  cartao = false,
  erro = '',
  className = '',
}) {
  const nomeGrupo = useId();

  return (
    <fieldset className={`${estilos.grupoRadio} ${className}`}>
      {rotulo && <legend className={estilos.rotulo}>{rotulo}</legend>}
      <div className={estilos.listaRadio}>
        {opcoes.map((opcao) => {
          const ativo = opcao.valor === valor;
          const idOpcao = `${nomeGrupo}-${opcao.valor}`;

          return (
            <label
              key={opcao.valor}
              htmlFor={idOpcao}
              className={[
                estilos.radioItem,
                cartao ? estilos.radioCartao : '',
                ativo ? estilos.radioAtivo : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <input
                id={idOpcao}
                type="radio"
                name={nomeGrupo}
                value={opcao.valor}
                checked={ativo}
                onChange={() => aoAlterar?.(opcao.valor)}
                className="somenteLeitor"
              />
              <span className={estilos.radioCirculo} aria-hidden="true" />
              <span className={estilos.radioTexto}>
                <span className={estilos.radioTitulo}>{opcao.rotulo}</span>
                {opcao.descricao && (
                  <span className={estilos.radioDescricao}>{opcao.descricao}</span>
                )}
              </span>
            </label>
          );
        })}
      </div>
      {erro && (
        <p className={estilos.mensagemErro} role="alert">
          <Icone nome="error" tamanho={16} />
          <span>{erro}</span>
        </p>
      )}
    </fieldset>
  );
}

// Caixa de seleção de 24 px com área de toque mínima de 44 px (C5).
export function Checkbox({ rotulo, descricao = '', marcado = false, aoAlterar, desabilitado = false }) {
  const id = useId();

  return (
    <label htmlFor={id} className={`${estilos.checkLabel} ${desabilitado ? estilos.desabilitado : ''}`}>
      <input
        id={id}
        type="checkbox"
        checked={marcado}
        disabled={desabilitado}
        onChange={(e) => aoAlterar?.(e.target.checked)}
        className="somenteLeitor"
      />
      <span className={`${estilos.checkCaixa} ${marcado ? estilos.checkMarcado : ''}`} aria-hidden="true">
        {marcado && <Icone nome="check" tamanho={16} />}
      </span>
      <span className={estilos.radioTexto}>
        <span className={estilos.radioTitulo}>{rotulo}</span>
        {descricao && <span className={estilos.radioDescricao}>{descricao}</span>}
      </span>
    </label>
  );
}

// Interruptor grande (52x32) no padrão C5 com área de toque mínima de 44 px.
export function Interruptor({ rotulo, descricao = '', ligado = false, aoAlterar, desabilitado = false }) {
  const id = useId();

  return (
    <label htmlFor={id} className={`${estilos.switchLabel} ${desabilitado ? estilos.desabilitado : ''}`}>
      <span className={estilos.radioTexto}>
        <span className={estilos.radioTitulo}>{rotulo}</span>
        {descricao && <span className={estilos.radioDescricao}>{descricao}</span>}
      </span>
      <input
        id={id}
        type="checkbox"
        role="switch"
        checked={ligado}
        disabled={desabilitado}
        onChange={(e) => aoAlterar?.(e.target.checked)}
        className="somenteLeitor"
      />
      <span className={`${estilos.switchTrilho} ${ligado ? estilos.switchLigado : ''}`} aria-hidden="true">
        <span className={estilos.switchBola} />
      </span>
    </label>
  );
}
