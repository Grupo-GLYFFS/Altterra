import { useContext } from 'react';
import { ContextoSessao } from './ContextoSessao.js';

// Acessa a sessão (usuario, entrar, cadastrar, sair e ações de endereço e dados).
export function useSessao() {
  const contexto = useContext(ContextoSessao);
  if (!contexto) throw new Error('useSessao precisa estar dentro de SessaoProvider');
  return contexto;
}
