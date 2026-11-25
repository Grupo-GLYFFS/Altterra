import { Navigate, useLocation } from 'react-router-dom';
import { useSessao } from '../../contexto/useSessao.js';
import { EstadoVazio } from '../Estados.jsx';
import { Pagina } from './Pagina.jsx';

// Protege uma página: manda para a tela de entrar quem não está logado
// e avisa quem não tem o perfil exigido (ex.: só fornecedor anuncia).
export function RotaProtegida({ perfil = '', titulo = '', children }) {
  const { usuario } = useSessao();
  const localizacao = useLocation();

  if (!usuario) {
    return <Navigate to="/entrar" state={{ de: localizacao.pathname }} replace />;
  }

  if (perfil && usuario.perfil !== perfil) {
    return (
      <Pagina titulo={titulo}>
        <EstadoVazio
          icone="lock"
          titulo="Esta área é para contas de fornecedor"
          descricao="Você entrou como comprador. Crie uma conta de fornecedor para anunciar e receber pedidos."
          textoAcao="Criar conta de fornecedor"
          paraAcao="/entrar?cadastro=fornecedor"
        />
      </Pagina>
    );
  }

  return children;
}
