import { useState } from "react";
import { Link } from "react-router-dom";
import CategoriesPanel from "./CategoriesPanel";
import LocationTab from "./LocationTab";
import LocationPopup from "./LocationPopup";
import MarketTypeTabs from "./MarketTypeTabs";
import logo from "../../../assets/images/alterra-logo.svg";
import { useCart } from "../../../context/useCart";

// Reescrito com base em renderNavbar() de js/components.js. A versão
// anterior usava emojis (☰ ◉ 🌱 ♻️ 🔍 🛒) em vez dos SVGs originais e não
// tinha nenhuma das interações do original: o hambúrguer não abria menu
// nenhum (nem existia menu mobile no arquivo), o botão de localização não
// abria popup nenhum (nem existia popup), e as abas de mercado não
// alternavam estado. Tudo isso foi reconstruído a partir do HTML/JS original.
function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [locationPopupOpen, setLocationPopupOpen] = useState(false)
  const [selectedCity, setSelectedCity] = useState('São Paulo - SP')
  const { totalItems, toggleCart } = useCart()

  const openLocationPopup = () => setLocationPopupOpen(true)
  const closeLocationPopup = () => setLocationPopupOpen(false)

  const handleSelectCity = (city) => {
    setSelectedCity(city)
    closeLocationPopup()
  }

  return (
    <>
      <header className="navbar">

        {/* Announcement */}
        <div className="navbar-main">
          <div className="navbar-announcement">
            <a
              href=" https://vimeo.com/1223136427"
              target="_blank"
              rel="noopener noreferrer"
            >
              Clique aqui para assistir ao vídeo do Altterra!
            </a>
          </div>

          {/* Header */}
          <div className="navbar-header">

            <Link to="/" className="navbar-logo">
              <img
                src={logo}
                alt="Altterra"
                className="navbar-logo-img"
              />
            </Link>

            <button
              className="button-hamburger"
              aria-label="Abrir menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="navbar-mobile-overlay"
              type="button"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="icon icon-24">
                <svg viewBox="0 0 24 24">
                  <path d="M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z" />
                </svg>
              </span>
            </button>

            <div className="navbar-actions">

              <nav className="navbar-links">
                <ul>
                  <li>
                    <Link className="button-nav" to="/how-it-works">
                      Como funciona
                    </Link>
                  </li>

                  <li>
                    <Link className="button-nav" to="/register">
                      Anunciar produto
                    </Link>
                  </li>
                </ul>
              </nav>

              <Link className="button-nav active" to="/login">
                Entre
                <span className="icon icon-16">
                  <svg viewBox="0 0 16 16">
                    <path d="M8 16V14.2857H14.2857V1.71429H8V0H14.2857C14.7571 0 15.1607 0.167858 15.4964 0.503572C15.8321 0.839286 16 1.24286 16 1.71429V14.2857C16 14.7571 15.8321 15.1607 15.4964 15.4964C15.1607 15.8321 14.7571 16 14.2857 16H8ZM6.28571 12L5.07143 10.7857L7 8.85714H0V7.14286H7L5.07143 5.21429L6.28571 4L10.2857 8L6.28571 12Z" />
                  </svg>
                </span>
              </Link>

            </div>
          </div>

          {/* Search */}
          <div className="navbar-search">

            <LocationTab selectedCity={selectedCity} onOpenPopup={openLocationPopup} />

            <MarketTypeTabs />

            <div className="search-bar">
              <input
                type="search"
                aria-label="Buscar produtos"
                placeholder="Buscar frutas, vegetais, sementes e muito mais..."
              />

              <button className="button-search" type="button">
                <span className="icon icon-20">
                  <svg viewBox="0 0 16 16">
                    <path d="M14.7857 16L9.09524 10.3095C8.61905 10.6587 8.0969 10.9325 7.52881 11.131C6.96071 11.3294 6.35611 11.4286 5.715 11.4286C4.12722 11.4286 2.77778 10.873 1.66667 9.7619C0.555556 8.65079 0 7.30159 0 5.71429C0 4.12698 0.555556 2.77778 1.66667 1.66667C2.77778 0.555556 4.12698 0 5.71429 0C7.30159 0 8.65079 0.555556 9.7619 1.66667C10.873 2.77778 11.4286 4.12722 11.4286 5.715C11.4286 6.35611 11.3294 6.96071 11.131 7.52881C10.9325 8.0969 10.6587 8.61905 10.3095 9.09524L16 14.7857L14.7857 16ZM5.71429 9.71429C6.8254 9.71429 7.76984 9.3254 8.54762 8.54762C9.3254 7.76984 9.71429 6.8254 9.71429 5.71429C9.71429 4.60317 9.3254 3.65873 8.54762 2.88095C7.76984 2.10317 6.8254 1.71429 5.71429 1.71429C4.60317 1.71429 3.65873 2.10317 2.88095 2.88095C2.10317 3.65873 1.71429 4.60317 1.71429 5.71429C1.71429 6.8254 2.10317 7.76984 2.88095 8.54762C3.65873 9.3254 4.60317 9.71429 5.71429 9.71429Z" />
                  </svg>
                </span>
              </button>
            </div>

            <button
              className="button-cart"
              type="button"
              aria-label={`Abrir carrinho${totalItems > 0 ? ` (${totalItems} itens)` : ''}`}
              onClick={toggleCart}
            >
              <span className="icon icon-24">
                <svg viewBox="0 0 16 16">
                  <path d="M3.4375 15.5581C3.14583 15.2635 3 14.9094 3 14.4956C3 14.0819 3.14729 13.7292 3.44188 13.4375C3.73646 13.1458 4.09063 13 4.50438 13C4.91813 13 5.27083 13.1473 5.5625 13.4419C5.85417 13.7365 6 14.0906 6 14.5044C6 14.9181 5.85271 15.2708 5.55813 15.5625C5.26354 15.8542 4.90938 16 4.49563 16C4.08188 16 3.72917 15.8527 3.4375 15.5581ZM12.4375 15.5581C12.1458 15.2635 12 14.9094 12 14.4956C12 14.0819 12.1473 13.7292 12.4419 13.4375C12.7365 13.1458 13.0906 13 13.5044 13C13.9181 13 14.2708 13.1473 14.5625 13.4419C14.8542 13.7365 15 14.0906 15 14.5044C15 14.9181 14.8527 15.2708 14.5581 15.5625C14.2635 15.8542 13.9094 16 13.4956 16C13.0819 16 12.7292 15.8527 12.4375 15.5581ZM4.27083 3.5L6 7.5H12.2708L13.9792 3.5H4.27083ZM3.625 2H15.5C15.6944 2 15.8368 2.07639 15.9271 2.22917C16.0174 2.38194 16.0278 2.54167 15.9583 2.70833L13.6381 8.08042C13.5183 8.36014 13.3368 8.58333 13.0938 8.75C12.8507 8.91667 12.5764 9 12.2708 9H5.60417L4.72917 10.5H15V12H4.75C4.15278 12 3.71181 11.749 3.42708 11.2469C3.14236 10.7447 3.14583 10.2457 3.4375 9.75L4.52083 7.875L1.79167 1.5H0V0H2.77083L3.625 2Z" />
                </svg>
              </span>

              {totalItems > 0 && (
                <span className="cart-count-badge">{totalItems}</span>
              )}
            </button>
          </div>
        </div>

        {/* Categories */}
        <CategoriesPanel />

      </header>

      <div
        className={`navbar-mobile-overlay${mobileMenuOpen ? ' open' : ''}`}
        id="navbar-mobile-overlay"
        onClick={(event) => {
          // Clique no fundo escurecido (fora de .navbar-mobile-menu) fecha — igual ao original.
          if (event.target === event.currentTarget) setMobileMenuOpen(false)
        }}
      >
        <div className="navbar-mobile-menu">
          <div className="navbar-mobile-menu-header">
            <button
              className="button-close"
              id="button-close-menu"
              aria-label="Fechar menu"
              type="button"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="icon icon-24">
                <svg viewBox="0 0 24 24">
                  <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" />
                </svg>
              </span>
            </button>
          </div>

          <Link className="button-nav active" to="/login">
            Entre
            <span className="icon icon-16">
              <svg viewBox="0 0 16 16">
                <path d="M8 16V14.2857H14.2857V1.71429H8V0H14.2857C14.7571 0 15.1607 0.167858 15.4964 0.503572C15.8321 0.839286 16 1.24286 16 1.71429V14.2857C16 14.7571 15.8321 15.1607 15.4964 15.4964C15.1607 15.8321 14.7571 16 14.2857 16H8ZM6.28571 12L5.07143 10.7857L7 8.85714H0V7.14286H7L5.07143 5.21429L6.28571 4L10.2857 8L6.28571 12Z" />
              </svg>
            </span>
          </Link>

          <div className="navbar-mobile-section">
            <p className="navbar-mobile-section-label">Páginas</p>
            <Link className="button-nav" to="/how-it-works">Como funciona</Link>
            <Link className="button-nav" to="/register">Anunciar produto</Link>
          </div>

          <div className="navbar-mobile-section">
            <p className="navbar-mobile-section-label">Localização</p>
            <LocationTab selectedCity={selectedCity} onOpenPopup={openLocationPopup} />
          </div>

          <div className="navbar-mobile-section">
            <p className="navbar-mobile-section-label">Tipo de mercado</p>
            <MarketTypeTabs />
          </div>
        </div>
      </div>

      <LocationPopup
        open={locationPopupOpen}
        selectedCity={selectedCity}
        onSelectCity={handleSelectCity}
        onClose={closeLocationPopup}
      />
    </>
  );
}

export default Navbar;
