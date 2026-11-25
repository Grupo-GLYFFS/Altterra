import { useState } from 'react';

// Renderiza uma imagem com fallback automático quando não há endereço ou ocorre erro de carga.
export function ImagemSegura({ src = '', alt = '', className = '', fallback = null, ...resto }) {
  const [srcFalhou, setSrcFalhou] = useState('');
  const mostrar = Boolean(src) && srcFalhou !== src;

  if (!mostrar) return fallback;

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setSrcFalhou(src)}
      {...resto}
    />
  );
}
