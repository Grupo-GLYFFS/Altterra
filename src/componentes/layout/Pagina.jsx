import { Navbar } from './Navbar.jsx';
import { Rodape } from './Rodape.jsx';
import estilos from './Pagina.module.css';

// Estrutura padrão de página com Navbar, container único de 1200 px e Rodapé.
// Permite ocultar navbar/rodapé em telas específicas (ex.: login).
export function Pagina({
  children,
  titulo = '',
  mostrarNavbar = true,
  mostrarRodape = true,
  itensCarrinho,
  usuario,
}) {
  return (
    <div className={estilos.pagina}>
      {mostrarNavbar && <Navbar itensCarrinho={itensCarrinho} usuario={usuario} />}

      <main className={estilos.conteudo}>
        <div className={estilos.container}>
          {titulo && <h1 className={estilos.titulo}>{titulo}</h1>}
          {children}
        </div>
      </main>

      {mostrarRodape && <Rodape />}
    </div>
  );
}
