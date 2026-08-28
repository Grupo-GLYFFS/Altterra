import { Link } from 'react-router-dom'

import alterraLogoFooter from '../../../assets/images/alterra-logo-footer.svg'

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <div className="page-bottom">

      {/* Pre-footer */}
      <div className="pre-footer">
        <h2 className="title-2xl">
          Não encontrou o que procura?
        </h2>

        <div className="search-bar min-width">
          <input
            type="search"
            aria-label="Buscar produtos"
            placeholder="Buscar frutas, vegetais, sementes e muito mais..."
          />

          <button className="button-search">
            <span className="icon icon-20">
              <svg viewBox="0 0 16 16">
                <path d="M14.7857 16L9.09524 10.3095C8.61905 10.6587 8.0969 10.9325 7.52881 11.131C6.96071 11.3294 6.35611 11.4286 5.715 11.4286C4.12722 11.4286 2.77778 10.873 1.66667 9.7619C0.555556 8.65079 0 7.30159 0 5.71429C0 4.12698 0.555556 2.77778 1.66667 1.66667C2.77778 0.555556 4.12698 0 5.71429 0C7.30159 0 8.65079 0.555556 9.7619 1.66667C10.873 2.77778 11.4286 4.12722 11.4286 5.715C11.4286 6.35611 11.3294 6.96071 11.131 7.52881C10.9325 8.0969 10.6587 8.61905 10.3095 9.09524L16 14.7857L14.7857 16ZM5.71429 9.71429C6.8254 9.71429 7.76984 9.3254 8.54762 8.54762C9.3254 7.76984 9.71429 6.8254 9.71429 5.71429C9.71429 4.60317 9.3254 3.65873 8.54762 2.88095C7.76984 2.10317 6.8254 1.71429 5.71429 1.71429C4.60317 1.71429 3.65873 2.10317 2.88095 2.88095C2.10317 3.65873 1.71429 4.60317 1.71429 5.71429C1.71429 6.8254 2.10317 7.76984 2.88095 8.54762C3.65873 9.3254 4.60317 9.71429 5.71429 9.71429Z" />
              </svg>
            </span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">

        <div className="footer-left">

          {/* Pages */}
          <nav className="footer-nav">
            <p className="text-semibold">Páginas</p>

            <ul>
              <li>
                <Link className="button-footer-link" to="/">
                  Início
                </Link>
              </li>

              <li>
                <Link className="button-footer-link" to="/login">
                  Entrar
                </Link>
              </li>

              <li>
                <Link className="button-footer-link" to="/how-it-works">
                  Como funciona
                </Link>
              </li>

              <li>
                <Link className="button-footer-link" to="/register">
                  Anunciar produto
                </Link>
              </li>
            </ul>
          </nav>

          {/* Social */}
          <div className="footer-social">
            <p className="text-semibold">Social</p>

            <ul className="social-buttons">

              <li>
                <button className="button-social">
                  <span className="icon icon-16">
                    <svg viewBox="0 0 16 16">
                      {/* Instagram */}
                      <path d="M12.251 2.94561C11.7155 2.94561 11.3138 3.34728 11.3138 3.88285C11.3138 4.41841 11.7155 4.82008 12.251 4.82008C12.7866 4.82008 13.1883 4.41841 13.1883 3.88285C13.1883 3.34728 12.7866 2.94561 12.251 2.94561Z" />
                      <path d="M8.03347 4.15063C5.82427 4.15063 4.08368 5.95816 4.08368 8.10042C4.08368 10.2427 5.89121 12.0502 8.03347 12.0502C10.1757 12.0502 11.9833 10.2427 11.9833 8.10042C11.9833 5.95816 10.2427 4.15063 8.03347 4.15063ZM8.03347 10.6444C6.62762 10.6444 5.48954 9.50628 5.48954 8.10042C5.48954 6.69456 6.62762 5.55649 8.03347 5.55649C9.43933 5.55649 10.5774 6.69456 10.5774 8.10042C10.5774 9.50628 9.43933 10.6444 8.03347 10.6444Z" />
                      <path d="M11.2469 0H4.88703C2.14226 0 0 2.14226 0 4.82008V11.1799C0 13.8577 2.14226 16 4.82008 16H11.1799C13.8577 16 16 13.8577 16 11.1799V4.82008C16.0669 2.14226 13.9247 0 11.2469 0ZM14.5272 11.2469C14.5272 13.0544 13.0544 14.5941 11.1799 14.5941H4.82008C3.01255 14.5941 1.4728 13.1213 1.4728 11.2469V4.88703C1.4728 3.0795 2.94561 1.53975 4.82008 1.53975H11.1799C12.9874 1.53975 14.5272 3.01255 14.5272 4.88703V11.2469Z" />
                    </svg>
                  </span>
                </button>
              </li>

              <li>
                <button className="button-social">
                  <span className="icon icon-16">
                    <svg viewBox="0 0 16 15">
                      {/* X */}
                      <path d="M9.74857 6.39975L14.9943 0H12.653L8.64914 4.88775L5.09714 0H0L5.94743 8.1825L0.358095 15H2.70019L7.04686 9.6975L10.9029 15H16L9.74857 6.39975ZM7.93524 8.61225L6.83429 7.098L2.56 1.22025H4.32L7.7699 5.958L8.86933 7.473L13.4545 13.7797H11.6945L7.93524 8.61225Z" />
                    </svg>
                  </span>
                </button>
              </li>

              <li>
                <button className="button-social">
                  <span className="icon icon-16">
                    <svg viewBox="0 0 16 16">
                      {/* Facebook */}
                      <path d="M8 0C3.58182 0 0 3.60023 0 8.04112C0 12.0726 2.95455 15.4013 6.80436 15.9828V10.1724H4.82509V8.05866H6.80436V6.6522C6.80436 4.32356 7.93309 3.30124 9.85855 3.30124C10.7807 3.30124 11.2684 3.36996 11.4993 3.40139V5.24646H10.1858C9.36836 5.24646 9.08291 6.02536 9.08291 6.9033V8.05866H11.4785L11.1535 10.1724H9.08291V16C12.9876 15.4675 16 12.1118 16 8.04112C16 3.60023 12.4182 0 8 0Z" />
                    </svg>
                  </span>
                </button>
              </li>

            </ul>
          </div>

          {/* Footnotes */}
          <div className="footnotes text-muted">
            <span>© 2026 Altterra</span>

            <span>•</span>

            <a className="button-footnote" href="">
              Privacidade
            </a>

            <span>•</span>

            <a className="button-footnote" href="">
              Termos
            </a>
          </div>

        </div>

        <div className="footer-right">

          <button
            className="button-scroll-top"
            onClick={scrollToTop}
          >
            Subir ao topo

            <span className="icon icon-16">
              <svg viewBox="0 0 16 16">
                <path d="M7 16V3.83333L1.41667 9.41667L0 8L8 0L16 8L14.5833 9.41667L9 3.83333V16H7Z" />
              </svg>
            </span>
          </button>

          <span className="footer-logo">
            <Link to="/">
              <img
                src={alterraLogoFooter}
                alt="Altterra"
              />
            </Link>
          </span>

        </div>

      </footer>
    </div>
  )
}

export default Footer