import { useContext } from 'react';
import { ContextoDoacoes } from './ContextoDoacoes.js';

// Acessa as doações (doacoes, registrar, kgDoadosPor, totais).
export function useDoacoes() {
  const contexto = useContext(ContextoDoacoes);
  if (!contexto) throw new Error('useDoacoes precisa estar dentro de DoacoesProvider');
  return contexto;
}
