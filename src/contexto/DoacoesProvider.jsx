import { useCallback, useMemo } from 'react';
import { DOACOES_EXEMPLO } from '../dados/doacoesExemplo.js';
import { INSTITUICOES } from '../dados/instituicoes.js';
import { ContextoDoacoes } from './ContextoDoacoes.js';
import { usePersistente } from './usePersistente.js';

// Guarda as doações e calcula os números do programa.
export function DoacoesProvider({ children }) {
  const [doacoes, setDoacoes] = usePersistente('doacoes', DOACOES_EXEMPLO);

  // Registra uma doação nova; ela aguarda a retirada pela instituição.
  const registrar = useCallback(
    (dados) => {
      setDoacoes((lista) => [
        { ...dados, id: `doacao-${Date.now()}`, data: new Date().toISOString(), status: 'aguardando_retirada' },
        ...lista,
      ]);
    },
    [setDoacoes]
  );

  // Soma o que um fornecedor já doou, em quilos.
  const kgDoadosPor = useCallback(
    (fornecedorId) =>
      doacoes.filter((d) => d.fornecedorId === fornecedorId).reduce((soma, d) => soma + d.quantidade, 0),
    [doacoes]
  );

  // Números do painel: quilos doados, quantidade de doações e instituições atendidas.
  const totais = useMemo(
    () => ({
      kg: doacoes.reduce((soma, d) => soma + d.quantidade, 0),
      doacoes: doacoes.length,
      instituicoes: INSTITUICOES.length,
    }),
    [doacoes]
  );

  const valor = useMemo(
    () => ({ doacoes, registrar, kgDoadosPor, totais }),
    [doacoes, registrar, kgDoadosPor, totais]
  );

  return <ContextoDoacoes.Provider value={valor}>{children}</ContextoDoacoes.Provider>;
}
