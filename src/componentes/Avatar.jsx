import { useState } from 'react';
import { Icone } from './Icone.jsx';
import estilos from './Avatar.module.css';

const CLASSES_TAMANHO = {
  32: estilos.s32,
  44: estilos.s44,
  56: estilos.s56,
  96: estilos.s96,
};

// Extrai até duas iniciais (primeira letra do nome e do último sobrenome).
function gerarIniciais(nome = '') {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return 'AT';
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return `${partes[0][0]}${partes[partes.length - 1][0]}`.toUpperCase();
}

// Avatar redondo sem borda (Miúdos V05). Usa iniciais neutras se não houver foto ou em erro de carga.
export function Avatar({
  src = '',
  nome = '',
  tamanho = 44,
  carregando = false,
  className = '',
}) {
  const [srcFalhou, setSrcFalhou] = useState('');
  const classeTamanho = CLASSES_TAMANHO[tamanho] || estilos.s44;

  if (carregando) {
    return <span className={`${estilos.avatar} ${classeTamanho} ${estilos.esqueleto} ${className}`} aria-hidden="true" />;
  }

  const mostrarImagem = Boolean(src) && srcFalhou !== src;

  return (
    <span className={`${estilos.avatar} ${classeTamanho} ${className}`} aria-label={nome || undefined}>
      {mostrarImagem ? (
        <img
          src={src}
          alt={nome}
          className={estilos.imagem}
          onError={() => setSrcFalhou(src)}
        />
      ) : (
        <span aria-hidden="true">{gerarIniciais(nome)}</span>
      )}
    </span>
  );
}

// Bloco de identificação do fornecedor com avatar, nome, ícone verificado preenchido e metadado.
export function IdentidadeFornecedor({
  nome,
  subtitulo = '',
  logo = '',
  verificado = false,
  tamanhoAvatar = 32,
  className = '',
}) {
  return (
    <div className={`${estilos.identidade} ${className}`}>
      <Avatar src={logo} nome={nome} tamanho={tamanhoAvatar} />
      <div className={estilos.textos}>
        <span className={estilos.nomeLinha}>
          <span className={estilos.nome}>{nome}</span>
          {verificado && (
            <Icone
              nome="verified"
              tamanho={16}
              preenchido
              className={estilos.verificado}
              title="Fornecedor verificado"
            />
          )}
        </span>
        {subtitulo && <span className={estilos.subtitulo}>{subtitulo}</span>}
      </div>
    </div>
  );
}
