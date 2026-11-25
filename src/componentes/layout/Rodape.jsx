import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icone } from '../Icone.jsx';
import { LogoAltterra } from '../LogoAltterra.jsx';
import estilos from './Rodape.module.css';

// Rodapé oficial da Altterra (Fase 4 ajustado aos tokens do design system).
// Inclui pré-rodapé com busca, links de páginas, redes sociais, notas e "Subir ao topo".
export function Rodape() {
  const [termo, setTermo] = useState('');
  const navegar = useNavigate();

  // Redireciona para a tela de busca com o termo digitado no pré-rodapé.
  function buscar(evento) {
    evento.preventDefault();
    const q = termo.trim();
    navegar(q ? `/busca?q=${encodeURIComponent(q)}` : '/busca');
  }

  // Rola suavemente até o topo da página.
  function subirAoTopo() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className={estilos.wrapper}>
      <section className={estilos.preRodape} aria-label="Busca rápida">
        <h2 className={estilos.preTitulo}>Não encontrou o que procura?</h2>
        <form className={estilos.busca} onSubmit={buscar} role="search">
          <input
            type="search"
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
            placeholder="Buscar frutas, legumes, grãos e muito mais"
            aria-label="Buscar produtos"
            className={estilos.buscaInput}
          />
          <button type="submit" className={estilos.buscaEnviar} aria-label="Buscar">
            <Icone nome="search" tamanho={24} />
          </button>
        </form>
      </section>

      <footer className={estilos.rodape}>
        <div className={estilos.container}>
          <div className={estilos.esquerda}>
            <nav className={estilos.blocoNav} aria-label="Páginas">
              <p className={estilos.tituloBloco}>Páginas</p>
              <ul className={estilos.listaLinks}>
                <li>
                  <Link to="/">Início</Link>
                </li>
                <li>
                  <Link to="/entrar">Entrar</Link>
                </li>
                <li>
                  <Link to="/como-funciona">Como funciona</Link>
                </li>
                <li>
                  <Link to="/anunciar">Anunciar produto</Link>
                </li>
              </ul>
            </nav>

            <div className={estilos.blocoSocial}>
              <p className={estilos.tituloBloco}>Social</p>
              <ul className={estilos.listaSocial}>
                <li>
                  <a
                    href="#instagram"
                    className={estilos.botaoSocial}
                    aria-label="Instagram"
                    onClick={(e) => e.preventDefault()}
                  >
                    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                      <path d="M12.251 2.94561C11.7155 2.94561 11.3138 3.34728 11.3138 3.88285C11.3138 4.41841 11.7155 4.82008 12.251 4.82008C12.7866 4.82008 13.1883 4.41841 13.1883 3.88285C13.1883 3.34728 12.7866 2.94561 12.251 2.94561Z" />
                      <path d="M8.03347 4.15063C5.82427 4.15063 4.08368 5.95816 4.08368 8.10042C4.08368 10.2427 5.89121 12.0502 8.03347 12.0502C10.1757 12.0502 11.9833 10.2427 11.9833 8.10042C11.9833 5.95816 10.2427 4.15063 8.03347 4.15063ZM8.03347 10.6444C6.62762 10.6444 5.48954 9.50628 5.48954 8.10042C5.48954 6.69456 6.62762 5.55649 8.03347 5.55649C9.43933 5.55649 10.5774 6.69456 10.5774 8.10042C10.5774 9.50628 9.43933 10.6444 8.03347 10.6444Z" />
                      <path d="M11.2469 0H4.88703C2.14226 0 0 2.14226 0 4.82008V11.1799C0 13.8577 2.14226 16 4.82008 16H11.1799C13.8577 16 16 13.8577 16 11.1799V4.82008C16.0669 2.14226 13.9247 0 11.2469 0ZM14.5272 11.2469C14.5272 13.0544 13.0544 14.5941 11.1799 14.5941H4.82008C3.01255 14.5941 1.4728 13.1213 1.4728 11.2469V4.88703C1.4728 3.0795 2.94561 1.53975 4.82008 1.53975H11.1799C12.9874 1.53975 14.5272 3.01255 14.5272 4.88703V11.2469Z" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a
                    href="#x"
                    className={estilos.botaoSocial}
                    aria-label="X"
                    onClick={(e) => e.preventDefault()}
                  >
                    <svg viewBox="0 0 16 15" aria-hidden="true" focusable="false">
                      <path d="M9.74857 6.39975L14.9943 0H12.653L8.64914 4.88775L5.09714 0H0L5.94743 8.1825L0.358095 15H2.70019L7.04686 9.6975L10.9029 15H16L9.74857 6.39975ZM7.93524 8.61225L6.83429 7.098L2.56 1.22025H4.32L7.7699 5.958L8.86933 7.473L13.4545 13.7797H11.6945L7.93524 8.61225Z" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a
                    href="#facebook"
                    className={estilos.botaoSocial}
                    aria-label="Facebook"
                    onClick={(e) => e.preventDefault()}
                  >
                    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                      <path d="M8 0C3.58182 0 0 3.60023 0 8.04112C0 12.0726 2.95455 15.4013 6.80436 15.9828V10.1724H4.82509V8.05866H6.80436V6.6522C6.80436 4.32356 7.93309 3.30124 9.85855 3.30124C10.7807 3.30124 11.2684 3.36996 11.4993 3.40139V5.24646H10.1858C9.36836 5.24646 9.08291 6.02536 9.08291 6.9033V8.05866H11.4785L11.1535 10.1724H9.08291V16C12.9876 15.4675 16 12.1118 16 8.04112C16 3.60023 12.4182 0 8 0Z" />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>

            <p className={estilos.notas}>
              <span>© 2026 Altterra</span>
              <span aria-hidden="true">•</span>
              <span className={estilos.notaItem}>Privacidade</span>
              <span aria-hidden="true">•</span>
              <span className={estilos.notaItem}>Termos</span>
            </p>
          </div>

          <div className={estilos.direita}>
            <button type="button" className={estilos.botaoTopo} onClick={subirAoTopo}>
              <span>Subir ao topo</span>
              <Icone nome="arrow_upward" tamanho={20} />
            </button>

            <Link to="/" className={estilos.logoRodape} aria-label="Altterra, página inicial">
              <LogoAltterra variante="claro" tamanho="lg" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
