import { caminhoImagem } from '../logica/imagens.js';
import estilos from './LogoAltterra.module.css';

// Exibe o logotipo oficial da Altterra (espiga em pé à esquerda do nome, proporção 370 x 110).
// variante="claro" usa texto branco (para fundos escuros); variante="escuro" usa texto verde 8 (fundos claros).
export function LogoAltterra({ variante = 'claro', tamanho = 'md', className = '' }) {
  const arquivo = variante === 'escuro' ? 'logo-fundo-claro.svg' : 'logo-fundo-escuro.svg';
  const classes = [estilos.logo, estilos[tamanho] || estilos.md, className]
    .filter(Boolean)
    .join(' ');

  return (
    <img
      src={caminhoImagem(arquivo)}
      alt=""
      width="370"
      height="110"
      className={classes}
      aria-hidden="true"
    />
  );
}
