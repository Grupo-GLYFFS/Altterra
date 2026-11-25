import { useContext } from 'react';
import { ContextoToast } from './ContextoToast.js';

// Hook para disparar notificações toast a partir de qualquer tela.
export function useToast() {
  const contexto = useContext(ContextoToast);
  if (!contexto) {
    return {
      mostrarToast: () => {},
      fecharToast: () => {},
    };
  }
  return contexto;
}
