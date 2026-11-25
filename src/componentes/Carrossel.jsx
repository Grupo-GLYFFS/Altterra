import { useRef } from 'react';
import { Botao } from './Botao.jsx';
import { CabecalhoSecao } from './Divisor.jsx';
import estilos from './Carrossel.module.css';

// Carrossel horizontal com rolagem por encaixe e setas no computador.
// Cada filho vira um slide: 86% da largura no celular e 25% no computador.
export function Carrossel({ titulo, textoAcao = '', paraAcao = '', children, className = '' }) {
  const trilho = useRef(null);

  // Rola o trilho pela largura visível, para a esquerda (-1) ou para a direita (1).
  function rolar(direcao) {
    const el = trilho.current;
    if (!el) return;
    el.scrollBy({ left: direcao * el.clientWidth * 0.9, behavior: 'smooth' });
  }

  return (
    <section className={`${estilos.secao} ${className}`} aria-label={titulo}>
      <div className={estilos.topo}>
        <CabecalhoSecao titulo={titulo} textoAcao={textoAcao} paraAcao={paraAcao} className={estilos.cabecalho} />
        <div className={estilos.setas}>
          <Botao
            variante="icone"
            tamanho="sm"
            iconeEsquerda="chevron_left"
            aria-label={`Anterior em ${titulo}`}
            onClick={() => rolar(-1)}
          />
          <Botao
            variante="icone"
            tamanho="sm"
            iconeEsquerda="chevron_right"
            aria-label={`Próximo em ${titulo}`}
            onClick={() => rolar(1)}
          />
        </div>
      </div>
      <ul className={estilos.trilho} ref={trilho}>
        {(Array.isArray(children) ? children : [children]).map((filho, indice) => (
          <li key={filho?.key ?? indice} className={estilos.slide}>
            {filho}
          </li>
        ))}
      </ul>
    </section>
  );
}
