import { useId, useState } from 'react';
import { Icone } from './Icone.jsx';
import estilos from './Acordeao.module.css';

// Acordeão com divisórias horizontais (padrão T3) para FAQ e detalhes do produto.
// Recebe itens ({ id, titulo, conteudo }), abertoInicial e multiplo opcional.
export function Acordeao({ itens = [], abertoInicial = '', multiplo = false, className = '' }) {
  const prefixo = useId();
  const [abertos, setAbertos] = useState(() => (abertoInicial ? [abertoInicial] : []));

  // Alterna a abertura de um item respeitando o modo único ou múltiplo.
  function alternar(id) {
    setAbertos((atual) => {
      const jaAberto = atual.includes(id);
      if (jaAberto) {
        return atual.filter((item) => item !== id);
      }
      return multiplo ? [...atual, id] : [id];
    });
  }

  return (
    <div className={`${estilos.lista} ${className}`}>
      {itens.map((item) => {
        const aberto = abertos.includes(item.id);
        const idBotao = `${prefixo}-btn-${item.id}`;
        const idPainel = `${prefixo}-painel-${item.id}`;

        return (
          <div key={item.id} className={estilos.item}>
            <button
              id={idBotao}
              type="button"
              className={estilos.gatilho}
              aria-expanded={aberto}
              aria-controls={idPainel}
              onClick={() => alternar(item.id)}
            >
              <span>{item.titulo}</span>
              <Icone
                nome="expand_more"
                tamanho={24}
                className={`${estilos.seta} ${aberto ? estilos.setaAberta : ''}`}
              />
            </button>

            {aberto && (
              <div id={idPainel} role="region" aria-labelledby={idBotao} className={estilos.painel}>
                {typeof item.conteudo === 'string' ? <p>{item.conteudo}</p> : item.conteudo}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
