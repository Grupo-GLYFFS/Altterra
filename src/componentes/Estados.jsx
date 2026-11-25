import { Botao } from './Botao.jsx';
import { Chip } from './Chip.jsx';
import { Icone } from './Icone.jsx';
import estilos from './Estados.module.css';

// Estado vazio no padrão Feedback V02: card branco com ícone 32 em círculo verde 0 de 64 px.
// Suporta chips removíveis (ex.: filtros ativos na busca sem resultado) e ação principal.
export function EstadoVazio({
  icone = 'search_off',
  titulo,
  descricao = '',
  filtrosAtivos = [],
  aoRemoverFiltro,
  textoAcao = '',
  paraAcao = '',
  aoClicarAcao,
  varianteAcao = 'principal',
  className = '',
}) {
  return (
    <section className={`${estilos.cartao} ${className}`}>
      <span className={estilos.circulo} aria-hidden="true">
        <Icone nome={icone} tamanho={32} />
      </span>

      <div className={estilos.textos}>
        <h3 className={estilos.titulo}>{titulo}</h3>
        {descricao && <p className={estilos.descricao}>{descricao}</p>}
      </div>

      {filtrosAtivos.length > 0 && (
        <div className={estilos.chips}>
          {filtrosAtivos.map((filtro) => (
            <Chip
              key={filtro.id}
              ativo
              comBorda
              aoRemover={() => aoRemoverFiltro?.(filtro.id)}
              aria-label={`Remover filtro ${filtro.rotulo}`}
            >
              {filtro.rotulo}
            </Chip>
          ))}
        </div>
      )}

      {textoAcao && (paraAcao || aoClicarAcao) && (
        <div className={estilos.acoes}>
          <Botao variante={varianteAcao} para={paraAcao} onClick={aoClicarAcao}>
            {textoAcao}
          </Botao>
        </div>
      )}
    </section>
  );
}

// Estado de erro em bloco com ícone em círculo de erro e botão para tentar novamente.
export function EstadoErro({
  titulo = 'Não foi possível carregar',
  descricao = 'Verifique a conexão e tente de novo.',
  textoAcao = 'Tentar de novo',
  aoTentarNovamente,
  className = '',
}) {
  return (
    <section className={`${estilos.cartao} ${className}`} role="alert">
      <span className={`${estilos.circulo} ${estilos.circuloErro}`} aria-hidden="true">
        <Icone nome="error" tamanho={32} />
      </span>

      <div className={estilos.textos}>
        <h3 className={estilos.titulo}>{titulo}</h3>
        {descricao && <p className={estilos.descricao}>{descricao}</p>}
      </div>

      {aoTentarNovamente && (
        <div className={estilos.acoes}>
          <Botao variante="secundario" iconeEsquerda="refresh" onClick={aoTentarNovamente}>
            {textoAcao}
          </Botao>
        </div>
      )}
    </section>
  );
}

// Indicador de carregamento em bloco ou em linha (Feedback V02).
export function Carregando({
  mensagem = 'Carregando…',
  emLinha = false,
  className = '',
}) {
  if (emLinha) {
    return (
      <div className={`${estilos.emLinha} ${className}`} role="status" aria-live="polite">
        <span className={estilos.spinnerPequeno} aria-hidden="true" />
        <span>{mensagem}</span>
      </div>
    );
  }

  return (
    <div className={`${estilos.blocoCarregando} ${className}`} role="status" aria-live="polite">
      <span className={estilos.spinnerGrande} aria-hidden="true" />
      <p className={estilos.descricao}>{mensagem}</p>
    </div>
  );
}
