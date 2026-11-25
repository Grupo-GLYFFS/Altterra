import { useEffect, useState } from 'react';
import { lerArmazenamento, salvarArmazenamento } from '../armazenamento.js';

// Estado do React que se grava sozinho no armazenamento local.
// Recebe a chave, o valor inicial e um normalizador opcional; devolve [valor, setValor].
export function usePersistente(chave, inicial, normalizar) {
  const [valor, setValor] = useState(() => {
    const salvo = lerArmazenamento(chave, inicial);
    return normalizar ? normalizar(salvo) : salvo;
  });

  useEffect(() => {
    salvarArmazenamento(chave, valor);
  }, [chave, valor]);

  return [valor, setValor];
}
