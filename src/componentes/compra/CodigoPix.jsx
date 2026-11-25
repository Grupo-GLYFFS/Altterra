import { useState } from 'react';
import { Botao } from '../Botao.jsx';
import estilos from './CodigoPix.module.css';

// Gera uma matriz 25x25 de quadrados a partir do texto, só para ilustrar o QR Code do Pix.
function gerarMatriz(texto) {
  let semente = 0;
  for (let i = 0; i < texto.length; i += 1) semente = (semente * 31 + texto.charCodeAt(i)) % 2147483647;
  const lado = 25;
  const celulas = [];
  const dentroDoCanto = (x, y) => (x < 8 && y < 8) || (x > lado - 9 && y < 8) || (x < 8 && y > lado - 9);
  for (let y = 0; y < lado; y += 1) {
    for (let x = 0; x < lado; x += 1) {
      semente = (semente * 48271) % 2147483647;
      if (!dentroDoCanto(x, y) && semente % 2 === 0) celulas.push({ x, y });
    }
  }
  return { lado, celulas };
}

// Mostra o QR Code ilustrativo e o código "copia e cola" do Pix, com botão de copiar.
export function CodigoPix({ codigo, className = '' }) {
  const [copiado, setCopiado] = useState(false);
  const { lado, celulas } = gerarMatriz(codigo);
  const cantos = [
    [0, 0],
    [lado - 7, 0],
    [0, lado - 7],
  ];

  // Copia o código para a área de transferência e avisa por alguns segundos.
  async function copiar() {
    try {
      await navigator.clipboard.writeText(codigo);
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 3000);
    } catch {
      setCopiado(false);
    }
  }

  return (
    <div className={`${estilos.caixa} ${className}`}>
      <svg
        className={estilos.qr}
        viewBox={`0 0 ${lado} ${lado}`}
        role="img"
        aria-label="QR Code de exemplo do Pix"
      >
        {celulas.map(({ x, y }) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />
        ))}
        {cantos.map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <rect x={x} y={y} width="7" height="7" />
            <rect x={x + 1} y={y + 1} width="5" height="5" className={estilos.vazado} />
            <rect x={x + 2} y={y + 2} width="3" height="3" />
          </g>
        ))}
      </svg>
      <div className={estilos.copia}>
        <p className={estilos.rotulo}>Pix copia e cola</p>
        <p className={estilos.codigo}>{codigo}</p>
        <Botao
          variante="secundario"
          tamanho="sm"
          iconeEsquerda={copiado ? 'check' : 'content_copy'}
          onClick={copiar}
        >
          {copiado ? 'Código copiado' : 'Copiar código'}
        </Botao>
      </div>
    </div>
  );
}
