// Componentes compartilhados: injeta navbar e footer nos placeholders
// #navbar-root e #footer-root presentes em todas as páginas.

function renderNavbar() {
  const navbarRoot = document.getElementById('navbar-root');
  if (!navbarRoot) return;

  // Marca o link da página atual como ativo (aria-current)
  const currentPath = window.location.pathname;
  const isHowItWorksPage = currentPath.includes('/pages/how-it-works-page.html');
  const isRegisterPage = currentPath.includes('/pages/register-page.html');

  navbarRoot.innerHTML = `
  <header class="navbar">
    
    <div class="navbar-main">
      <div class="navbar-header">
        <a href="/index.html" class="navbar-logo">
          <img src="/images/alterra-logo.svg" alt="Altterra" class="navbar-logo-img" />
        </a>

        <button class="button-hamburger" aria-label="Abrir menu" aria-expanded="false" aria-controls="navbar-mobile-overlay">
          <span class="icon icon-24">
            <svg viewBox="0 0 24 24">
              <path d="M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z" />
            </svg>
          </span>
        </button>

        <div class="navbar-actions">
          <nav class="navbar-links">
            <ul>
              <li>
                <a class="button-nav" href="/pages/how-it-works-page.html" ${isHowItWorksPage ? 'aria-current="page"' : ''}>Como funciona</a>
              </li>
              <li>
                <a class="button-nav" href="/pages/register-page.html" ${isRegisterPage ? 'aria-current="page"' : ''}>Anunciar produto</a>
              </li>
            </ul>
          </nav>

          <a class="button-nav active" href="/pages/login-page.html">
            Entre
            <span class="icon icon-16">
              <svg viewBox="0 0 16 16">
                <path d="M8 16V14.2857H14.2857V1.71429H8V0H14.2857C14.7571 0 15.1607 0.167858 15.4964 0.503572C15.8321 0.839286 16 1.24286 16 1.71429V14.2857C16 14.7571 15.8321 15.1607 15.4964 15.4964C15.1607 15.8321 14.7571 16 14.2857 16H8ZM6.28571 12L5.07143 10.7857L7 8.85714H0V7.14286H7L5.07143 5.21429L6.28571 4L10.2857 8L6.28571 12Z" />
              </svg>
            </span>
          </a>

        </div>
      </div>

      <div class="navbar-search">
        <div class="tab-group" data-location>
          <button class="button-tab active">
            <span class="icon icon-20">
              <svg viewBox="0 0 16 16">
                <path d="M7.33333 16V14.1852C5.83951 14.0123 4.58951 13.4198 3.58333 12.4074C2.57716 11.3951 1.98765 10.1481 1.81481 8.66667H0V7.33333H1.81481C1.98765 5.85185 2.57716 4.60494 3.58333 3.59259C4.58951 2.58025 5.83951 1.98765 7.33333 1.81481V0H8.66667V1.81481C10.1605 1.98765 11.4105 2.58025 12.4167 3.59259C13.4228 4.60494 14.0123 5.85185 14.1852 7.33333H16V8.66667H14.1852C14.0123 10.1481 13.4228 11.3951 12.4167 12.4074C11.4105 13.4198 10.1605 14.0123 8.66667 14.1852V16H7.33333ZM11.463 11.463C12.4136 10.5123 12.8889 9.35802 12.8889 8C12.8889 6.64198 12.4136 5.48765 11.463 4.53704C10.5123 3.58642 9.35802 3.11111 8 3.11111C6.64198 3.11111 5.48765 3.58642 4.53704 4.53704C3.58642 5.48765 3.11111 6.64198 3.11111 8C3.11111 9.35802 3.58642 10.5123 4.53704 11.463C5.48765 12.4136 6.64198 12.8889 8 12.8889C9.35802 12.8889 10.5123 12.4136 11.463 11.463ZM6.11111 9.88889C5.59259 9.37037 5.33333 8.74074 5.33333 8C5.33333 7.25926 5.59259 6.62963 6.11111 6.11111C6.62963 5.59259 7.25926 5.33333 8 5.33333C8.74074 5.33333 9.37037 5.59259 9.88889 6.11111C10.4074 6.62963 10.6667 7.25926 10.6667 8C10.6667 8.74074 10.4074 9.37037 9.88889 9.88889C9.37037 10.4074 8.74074 10.6667 8 10.6667C7.25926 10.6667 6.62963 10.4074 6.11111 9.88889ZM9.03704 9.03704C9.32099 8.75309 9.46296 8.40741 9.46296 8C9.46296 7.59259 9.32099 7.24691 9.03704 6.96296C8.75309 6.67901 8.40741 6.53704 8 6.53704C7.59259 6.53704 7.24691 6.67901 6.96296 6.96296C6.67901 7.24691 6.53704 7.59259 6.53704 8C6.53704 8.40741 6.67901 8.75309 6.96296 9.03704C7.24691 9.32099 7.59259 9.46296 8 9.46296C8.40741 9.46296 8.75309 9.32099 9.03704 9.03704Z" />
              </svg>
            </span>
            <span class="location-label">São Paulo - SP</span>
          </button>
        </div>

        <div class="tab-group">
          <button class="button-tab active">
            <span class="icon icon-20">
              <svg viewBox="0 0 16 16">
                <path d="M1.09484 16L0 14.9052L1.86315 13.042C1.4918 12.6707 1.21329 12.2481 1.02761 11.7743C0.841937 11.3005 0.7491 10.8075 0.7491 10.2953C0.7491 9.77031 0.845138 9.27731 1.03721 8.81633C1.22929 8.35534 1.5046 7.94558 1.86315 7.58703L2.95798 6.5114L3.4958 7.04922C3.55982 6.63946 3.68147 6.2489 3.86074 5.87755C4.04002 5.5062 4.27691 5.17327 4.57143 4.87875L5.66627 3.80312L6.20408 4.34094C6.26811 3.93117 6.39296 3.54062 6.57863 3.16927C6.76431 2.79792 7.0044 2.46499 7.29892 2.17047L9.4886 0L10.5642 1.07563L9.4886 2.17047C9.78311 2.46499 10.02 2.79792 10.1993 3.16927C10.3786 3.54062 10.5002 3.93117 10.5642 4.34094L14.2713 0.633854L15.3469 1.72869L11.6591 5.43577C12.0688 5.4998 12.4594 5.62145 12.8307 5.80072C13.2021 5.97999 13.535 6.21689 13.8295 6.5114L14.9052 5.41657L16 6.5114L13.8487 8.68187C13.5542 8.9892 13.2149 9.23569 12.8307 9.42137C12.4466 9.60704 12.0496 9.73189 11.6399 9.79592L12.1777 10.3145L11.102 11.3902C10.8075 11.6847 10.4714 11.9248 10.0936 12.1104C9.71589 12.2961 9.32213 12.421 8.91236 12.485L9.46939 13.0228L8.37455 14.1176C8.0032 14.489 7.58383 14.7675 7.11645 14.9532C6.64906 15.1389 6.15926 15.2317 5.64706 15.2317C5.21168 15.2317 4.77311 15.1389 4.33133 14.9532C3.88956 14.7675 3.43818 14.4826 2.97719 14.0984L1.09484 16ZM2.95798 11.928C3.17567 11.7103 3.34214 11.4638 3.45738 11.1885C3.57263 10.9132 3.63025 10.6218 3.63025 10.3145C3.63025 10.02 3.57263 9.72869 3.45738 9.44058C3.34214 9.15246 3.17567 8.89956 2.95798 8.68187C2.7403 8.89956 2.57063 9.15246 2.44898 9.44058C2.32733 9.72869 2.26651 10.02 2.26651 10.3145C2.26651 10.6218 2.32733 10.9132 2.44898 11.1885C2.57063 11.4638 2.7403 11.7103 2.95798 11.928ZM5.66627 13.7143C5.97359 13.7015 6.26811 13.6375 6.54982 13.5222C6.83153 13.407 7.08123 13.2405 7.29892 13.0228C7.08123 12.8051 6.82833 12.6387 6.54022 12.5234C6.2521 12.4082 5.96078 12.3505 5.66627 12.3505C5.37175 12.3505 5.08043 12.4114 4.79232 12.533C4.5042 12.6547 4.2513 12.8243 4.03361 13.042C4.2513 13.2597 4.501 13.4262 4.78271 13.5414C5.06443 13.6567 5.35894 13.7143 5.66627 13.7143ZM5.66627 9.21969C5.88395 9.002 6.05042 8.7523 6.16567 8.47059C6.28091 8.18888 6.33854 7.90076 6.33854 7.60624C6.33854 7.29892 6.28091 7.0044 6.16567 6.72269C6.05042 6.44098 5.88395 6.19128 5.66627 5.97359C5.44858 6.19128 5.27891 6.44098 5.15726 6.72269C5.03561 7.0044 4.97479 7.29892 4.97479 7.60624C4.97479 7.90076 5.03561 8.18888 5.15726 8.47059C5.27891 8.7523 5.44858 9.002 5.66627 9.21969ZM8.39376 11.006C8.70108 11.006 8.9924 10.9452 9.26771 10.8235C9.54302 10.7019 9.78952 10.5322 10.0072 10.3145C9.78952 10.0968 9.54302 9.93037 9.26771 9.81513C8.9924 9.69988 8.70108 9.64226 8.39376 9.64226C8.08643 9.64226 7.79192 9.70308 7.5102 9.82473C7.22849 9.94638 6.97879 10.116 6.7611 10.3337C6.97879 10.5514 7.22849 10.7179 7.5102 10.8331C7.79192 10.9484 8.08643 11.006 8.39376 11.006ZM8.39376 6.5114C8.61144 6.29372 8.77471 6.04402 8.88355 5.7623C8.9924 5.48059 9.04682 5.18607 9.04682 4.87875C9.04682 4.58423 8.9924 4.29292 8.88355 4.0048C8.77471 3.71669 8.61144 3.46379 8.39376 3.2461C8.17607 3.46379 8.0064 3.71669 7.88475 4.0048C7.7631 4.29292 7.70228 4.58423 7.70228 4.87875C7.70228 5.18607 7.7631 5.48059 7.88475 5.7623C8.0064 6.04402 8.17607 6.29372 8.39376 6.5114ZM11.102 8.27851C11.3966 8.27851 11.6879 8.21769 11.976 8.09604C12.2641 7.97439 12.517 7.80472 12.7347 7.58703C12.5042 7.36935 12.2449 7.20288 11.9568 7.08763C11.6687 6.97239 11.3774 6.91477 11.0828 6.91477C10.7883 6.92757 10.5002 6.9916 10.2185 7.10684C9.93677 7.22209 9.68707 7.38856 9.46939 7.60624C9.68707 7.82393 9.93998 7.9936 10.2281 8.11525C10.5162 8.23689 10.8075 8.29132 11.102 8.27851Z" />
              </svg>
            </span>
            Mercado padrão
          </button>

          <button class="button-tab">
            <span class="icon icon-20">
              <svg viewBox="0 0 16 17">
                <path d="M6.00875 13C6.83625 13 7.54167 12.7085 8.125 12.1256C8.70833 11.5426 9 10.8311 9 9.99125C9 9.16375 8.70667 8.45833 8.12 7.875C7.53333 7.29167 6.82813 7 6.00438 7C5.16812 7 4.45833 7.29333 3.875 7.88C3.29167 8.46667 3 9.17188 3 9.99563C3 10.8319 3.29146 11.5417 3.87438 12.125C4.45743 12.7083 5.16889 13 6.00875 13ZM5.98958 11.5C5.58 11.5 5.22931 11.3542 4.9375 11.0625C4.64583 10.7707 4.5 10.42 4.5 10.0104C4.5 9.60069 4.64583 9.24653 4.9375 8.94792C5.22931 8.64931 5.58 8.5 5.98958 8.5C6.39931 8.5 6.75347 8.64931 7.05208 8.94792C7.35069 9.24653 7.5 9.60069 7.5 10.0104C7.5 10.42 7.35069 10.7707 7.05208 11.0625C6.75347 11.3542 6.39931 11.5 5.98958 11.5ZM10.3958 15.5C11.5903 15.5 12.5729 15.1189 13.3438 14.3567C14.1146 13.5944 14.5 12.6144 14.5 11.4167C14.5 11.1667 14.4097 10.9514 14.2292 10.7708C14.0486 10.5903 13.832 10.5 13.5794 10.5C13.3266 10.5 13.1148 10.5903 12.944 10.7708C12.773 10.9514 12.6875 11.1667 12.6875 11.4167C12.6875 12.0139 12.4551 12.5451 11.9904 13.0104C11.5257 13.4757 10.9942 13.7083 10.3958 13.7083C10.1419 13.7083 9.92917 13.7938 9.7575 13.9648C9.58583 14.1356 9.5 14.3474 9.5 14.6002C9.5 14.8528 9.58583 15.066 9.7575 15.2396C9.92917 15.4132 10.1419 15.5 10.3958 15.5ZM10.4027 17C9.73146 17 9.16319 16.7674 8.69792 16.3021C8.23264 15.8368 8 15.2675 8 14.5942C8 13.9342 8.23264 13.3715 8.69792 12.9063C9.16319 12.441 9.72917 12.2083 10.3958 12.2083C10.5903 12.2083 10.7708 12.125 10.9375 11.9583C11.1042 11.7917 11.1875 11.614 11.1875 11.4254C11.1875 10.7517 11.4201 10.179 11.8854 9.7075C12.3507 9.23583 12.92 9 13.5933 9C14.2533 9 14.8194 9.23493 15.2917 9.70479C15.7639 10.1748 16 10.7454 16 11.4167C16 13.0139 15.4653 14.3438 14.3958 15.4063C13.3264 16.4688 11.9953 17 10.4027 17ZM6 16C3.86111 16 2.32639 15.3337 1.39583 14.001C0.465278 12.6684 0 11.2025 0 9.60333C0 8.60389 0.152778 7.54167 0.458333 6.41667C0.763889 5.29167 1.18465 4.25493 1.72062 3.30646C2.2566 2.35799 2.88854 1.56979 3.61646 0.941875C4.34438 0.313959 5.13646 0 5.99271 0C6.74201 0 7.44444 0.236111 8.1 0.708333C8.75556 1.18056 9.33826 1.79431 9.84813 2.54958C10.358 3.30486 10.7851 4.15208 11.1294 5.09125C11.4737 6.03042 11.7083 6.97222 11.8333 7.91667H10.3542C10.2153 7.05556 9.98611 6.23611 9.66667 5.45833C9.34722 4.68056 8.98611 4 8.58333 3.41667C8.18056 2.83333 7.75347 2.36806 7.30208 2.02083C6.85069 1.67361 6.41868 1.5 6.00604 1.5C5.5159 1.5 5.00694 1.72917 4.47917 2.1875C3.95139 2.64583 3.46528 3.25347 3.02083 4.01042C2.57639 4.76736 2.21181 5.63194 1.92708 6.60417C1.64236 7.57639 1.5 8.57639 1.5 9.60417C1.5 9.89583 1.53819 10.3125 1.61458 10.8542C1.69097 11.3958 1.87847 11.9375 2.17708 12.4792C2.47569 13.0208 2.92708 13.4931 3.53125 13.8958C4.13542 14.2986 4.95833 14.5 6 14.5H6.23958C6.31597 14.5 6.40278 14.4931 6.5 14.4792C6.48611 14.7338 6.5 14.9884 6.54167 15.2431C6.58333 15.4977 6.64583 15.7431 6.72917 15.9792C6.61806 15.9931 6.5 16 6.375 16H6Z" />
              </svg>
            </span>
            Outlet sustentável
          </button>
        </div>

        <div class="search-bar">
          <input type="search" aria-label="Buscar produtos" placeholder="Buscar frutas, vegetais, sementes e muito mais..." />

          <button class="button-search">
            <span class="icon icon-20">
              <svg viewBox="0 0 16 16">
                <path d="M14.7857 16L9.09524 10.3095C8.61905 10.6587 8.0969 10.9325 7.52881 11.131C6.96071 11.3294 6.35611 11.4286 5.715 11.4286C4.12722 11.4286 2.77778 10.873 1.66667 9.7619C0.555556 8.65079 0 7.30159 0 5.71429C0 4.12698 0.555556 2.77778 1.66667 1.66667C2.77778 0.555556 4.12698 0 5.71429 0C7.30159 0 8.65079 0.555556 9.7619 1.66667C10.873 2.77778 11.4286 4.12722 11.4286 5.715C11.4286 6.35611 11.3294 6.96071 11.131 7.52881C10.9325 8.0969 10.6587 8.61905 10.3095 9.09524L16 14.7857L14.7857 16ZM5.71429 9.71429C6.8254 9.71429 7.76984 9.3254 8.54762 8.54762C9.3254 7.76984 9.71429 6.8254 9.71429 5.71429C9.71429 4.60317 9.3254 3.65873 8.54762 2.88095C7.76984 2.10317 6.8254 1.71429 5.71429 1.71429C4.60317 1.71429 3.65873 2.10317 2.88095 2.88095C2.10317 3.65873 1.71429 4.60317 1.71429 5.71429C1.71429 6.8254 2.10317 7.76984 2.88095 8.54762C3.65873 9.3254 4.60317 9.71429 5.71429 9.71429Z" />
              </svg>
            </span>
          </button>
        </div>

        <button class="button-cart">
          <span class="icon icon-24">
            <svg viewBox="0 0 16 16">
              <path d="M3.4375 15.5581C3.14583 15.2635 3 14.9094 3 14.4956C3 14.0819 3.14729 13.7292 3.44188 13.4375C3.73646 13.1458 4.09063 13 4.50438 13C4.91813 13 5.27083 13.1473 5.5625 13.4419C5.85417 13.7365 6 14.0906 6 14.5044C6 14.9181 5.85271 15.2708 5.55813 15.5625C5.26354 15.8542 4.90938 16 4.49563 16C4.08188 16 3.72917 15.8527 3.4375 15.5581ZM12.4375 15.5581C12.1458 15.2635 12 14.9094 12 14.4956C12 14.0819 12.1473 13.7292 12.4419 13.4375C12.7365 13.1458 13.0906 13 13.5044 13C13.9181 13 14.2708 13.1473 14.5625 13.4419C14.8542 13.7365 15 14.0906 15 14.5044C15 14.9181 14.8527 15.2708 14.5581 15.5625C14.2635 15.8542 13.9094 16 13.4956 16C13.0819 16 12.7292 15.8527 12.4375 15.5581ZM4.27083 3.5L6 7.5H12.2708L13.9792 3.5H4.27083ZM3.625 2H15.5C15.6944 2 15.8368 2.07639 15.9271 2.22917C16.0174 2.38194 16.0278 2.54167 15.9583 2.70833L13.6381 8.08042C13.5183 8.36014 13.3368 8.58333 13.0938 8.75C12.8507 8.91667 12.5764 9 12.2708 9H5.60417L4.72917 10.5H15V12H4.75C4.15278 12 3.71181 11.749 3.42708 11.2469C3.14236 10.7447 3.14583 10.2457 3.4375 9.75L4.52083 7.875L1.79167 1.5H0V0H2.77083L3.625 2Z" />
            </svg>
          </span>
        </button>
      </div>
    </div>

    <details class="categories-bar">
      <summary class="categories-toggle">
        <span class="icon icon-20">
          <svg viewBox="0 0 16 16">
            <path d="M1.71429 16C1.25397 16 0.853175 15.8294 0.511905 15.4881C0.170635 15.1468 0 14.746 0 14.2857V1.71429C0 1.24286 0.170635 0.839286 0.511905 0.503572C0.853175 0.167858 1.25397 0 1.71429 0H14.2857C14.7571 0 15.1607 0.167858 15.4964 0.503572C15.8321 0.839286 16 1.24286 16 1.71429V14.2857C16 14.746 15.8321 15.1468 15.4964 15.4881C15.1607 15.8294 14.7571 16 14.2857 16H1.71429ZM1.71429 14.2857H14.2857V10.8571H11.619C11.254 11.5397 10.75 12.0913 10.1071 12.5119C9.46429 12.9325 8.7619 13.1429 8 13.1429C7.22222 13.1429 6.5119 12.9365 5.86905 12.5238C5.22619 12.1111 4.73016 11.5556 4.38095 10.8571H1.71429V14.2857ZM9.61905 10.7619C10.0635 10.3175 10.2857 9.77778 10.2857 9.14286H14.2857V1.71429H1.71429V9.14286H5.71429C5.71429 9.77778 5.93651 10.3175 6.38095 10.7619C6.8254 11.2063 7.36508 11.4286 8 11.4286C8.63492 11.4286 9.1746 11.2063 9.61905 10.7619ZM3.42857 7.71429H12.5714V6H3.42857V7.71429ZM3.42857 4.85714H12.5714V3.14286H3.42857V4.85714Z" />
          </svg>
        </span>

        <span class="categories-label">Categorias</span>

        <span class="icon icon-12">
          <svg viewBox="0 0 16 10">
            <path d="M8 10L0 1.75258L1.7 0L8 6.49485L14.3 0L16 1.75258L8 10Z" />
          </svg>
        </span>
      </summary>

      <div class="categories-panel">
        <nav class="categories-sidebar">
          <button class="categories-nav-item active">Frutas</button>
          <button class="categories-nav-item">Verduras e folhas</button>
          <button class="categories-nav-item">Legumes</button>
          <button class="categories-nav-item">Ervas</button>
          <button class="categories-nav-item">Tubérculos e raízes</button>
          <button class="categories-nav-item">Bulbos</button>
          <button class="categories-nav-item">Grãos e cereais</button>
          <button class="categories-nav-item">Leguminosas</button>
          <button class="categories-nav-item">Sementes e mudas</button>
        </nav>

        <div class="categories-content">
          <section class="category-group">
            <h3 class="title-xl">Frutas</h3>
            <div class="category-items">
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Maçã</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Mamão</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Laranja</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Uva</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Manga</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Pera</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Abacaxi</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Cereja</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Melancia</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Kiwi</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Pêssego</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Ameixa</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Framboesa</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Morango</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Coco</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Banana</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Limão</figcaption></figure></a>
              <a href="#" class="category-item category-item-more"><figure><div class="category-item-img"></div><figcaption>Ver mais <span class="icon icon-12"><svg viewBox="0 0 16 10"><path d="M8 10L0 1.75258L1.7 0L8 6.49485L14.3 0L16 1.75258L8 10Z" /></svg></span></figcaption></figure></a>
            </div>
          </section>

          <section class="category-group">
            <h3 class="title-xl">Verduras e folhas</h3>
            <div class="category-items">
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Alface</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Espinafre</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Rúcula</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Couve</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Brócolis</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Repolho</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Acelga</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Agrião</figcaption></figure></a>
              <a href="#" class="category-item category-item-more"><figure><div class="category-item-img"></div><figcaption>Ver mais <span class="icon icon-12"><svg viewBox="0 0 16 10"><path d="M8 10L0 1.75258L1.7 0L8 6.49485L14.3 0L16 1.75258L8 10Z" /></svg></span></figcaption></figure></a>
            </div>
          </section>

          <section class="category-group">
            <h3 class="title-xl">Legumes</h3>
            <div class="category-items">
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Abóbora</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Abobrinha</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Berinjela</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Chuchu</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Pepino</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Pimentão</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Quiabo</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Tomate</figcaption></figure></a>
              <a href="#" class="category-item category-item-more"><figure><div class="category-item-img"></div><figcaption>Ver mais <span class="icon icon-12"><svg viewBox="0 0 16 10"><path d="M8 10L0 1.75258L1.7 0L8 6.49485L14.3 0L16 1.75258L8 10Z" /></svg></span></figcaption></figure></a>
            </div>
          </section>

          <section class="category-group">
            <h3 class="title-xl">Ervas</h3>
            <div class="category-items">
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Alecrim</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Cebolinha</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Coentro</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Hortelã</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Manjericão</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Orégano</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Salsa</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Sálvia</figcaption></figure></a>
              <a href="#" class="category-item category-item-more"><figure><div class="category-item-img"></div><figcaption>Ver mais <span class="icon icon-12"><svg viewBox="0 0 16 10"><path d="M8 10L0 1.75258L1.7 0L8 6.49485L14.3 0L16 1.75258L8 10Z" /></svg></span></figcaption></figure></a>
            </div>
          </section>

          <section class="category-group">
            <h3 class="title-xl">Tubérculos e raízes</h3>
            <div class="category-items">
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Batata</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Batata-doce</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Beterraba</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Cenoura</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Inhame</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Mandioca</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Nabo</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Rabanete</figcaption></figure></a>
              <a href="#" class="category-item category-item-more"><figure><div class="category-item-img"></div><figcaption>Ver mais <span class="icon icon-12"><svg viewBox="0 0 16 10"><path d="M8 10L0 1.75258L1.7 0L8 6.49485L14.3 0L16 1.75258L8 10Z" /></svg></span></figcaption></figure></a>
            </div>
          </section>

          <section class="category-group">
            <h3 class="title-xl">Bulbos</h3>
            <div class="category-items">
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Alho</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Alho-poró</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Cebola</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Cebola roxa</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Chalota</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Funcho</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Cebola pérola</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Alho-nirá</figcaption></figure></a>
              <a href="#" class="category-item category-item-more"><figure><div class="category-item-img"></div><figcaption>Ver mais <span class="icon icon-12"><svg viewBox="0 0 16 10"><path d="M8 10L0 1.75258L1.7 0L8 6.49485L14.3 0L16 1.75258L8 10Z" /></svg></span></figcaption></figure></a>
            </div>
          </section>

          <section class="category-group">
            <h3 class="title-xl">Grãos e cereais</h3>
            <div class="category-items">
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Arroz</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Aveia</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Centeio</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Cevada</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Milho</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Quinoa</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Sorgo</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Trigo</figcaption></figure></a>
              <a href="#" class="category-item category-item-more"><figure><div class="category-item-img"></div><figcaption>Ver mais <span class="icon icon-12"><svg viewBox="0 0 16 10"><path d="M8 10L0 1.75258L1.7 0L8 6.49485L14.3 0L16 1.75258L8 10Z" /></svg></span></figcaption></figure></a>
            </div>
          </section>

          <section class="category-group">
            <h3 class="title-xl">Leguminosas</h3>
            <div class="category-items">
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Amendoim</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Ervilha</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Fava</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Feijão</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Grão-de-bico</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Lentilha</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Soja</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Tremoço</figcaption></figure></a>
              <a href="#" class="category-item category-item-more"><figure><div class="category-item-img"></div><figcaption>Ver mais <span class="icon icon-12"><svg viewBox="0 0 16 10"><path d="M8 10L0 1.75258L1.7 0L8 6.49485L14.3 0L16 1.75258L8 10Z" /></svg></span></figcaption></figure></a>
            </div>
          </section>

          <section class="category-group">
            <h3 class="title-xl">Sementes e mudas</h3>
            <div class="category-items">
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>S. Linhaça</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>S. Chia</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>S. Girassol</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>S. Abóbora</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>S. Gergelim</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Muda Tomate</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Muda Alface</figcaption></figure></a>
              <a href="#" class="category-item"><figure><div class="category-item-img"></div><figcaption>Muda Pimenta</figcaption></figure></a>
              <a href="#" class="category-item category-item-more"><figure><div class="category-item-img"></div><figcaption>Ver mais <span class="icon icon-12"><svg viewBox="0 0 16 10"><path d="M8 10L0 1.75258L1.7 0L8 6.49485L14.3 0L16 1.75258L8 10Z" /></svg></span></figcaption></figure></a>
            </div>
          </section>
        </div>
      </div>
    </details>
  </header>

  <div class="navbar-mobile-overlay" id="navbar-mobile-overlay">
    <div class="navbar-mobile-menu">
      <div class="navbar-mobile-menu-header">
        <button class="button-close" id="button-close-menu" aria-label="Fechar menu">
          <span class="icon icon-24">
            <svg viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" />
            </svg>
          </span>
        </button>
      </div>

      <a class="button-nav active" href="/pages/login-page.html">
        Entre
        <span class="icon icon-16">
          <svg viewBox="0 0 16 16">
            <path d="M8 16V14.2857H14.2857V1.71429H8V0H14.2857C14.7571 0 15.1607 0.167858 15.4964 0.503572C15.8321 0.839286 16 1.24286 16 1.71429V14.2857C16 14.7571 15.8321 15.1607 15.4964 15.4964C15.1607 15.8321 14.7571 16 14.2857 16H8ZM6.28571 12L5.07143 10.7857L7 8.85714H0V7.14286H7L5.07143 5.21429L6.28571 4L10.2857 8L6.28571 12Z" />
          </svg>
        </span>
      </a>

      <div class="navbar-mobile-section">
        <p class="navbar-mobile-section-label">Páginas</p>
        <a class="button-nav" href="/pages/how-it-works-page.html" ${isHowItWorksPage ? 'aria-current="page"' : ''}>Como funciona</a>
        <a class="button-nav" href="/pages/register-page.html" ${isRegisterPage ? 'aria-current="page"' : ''}>Anunciar produto</a>
      </div>

      <div class="navbar-mobile-section">
        <p class="navbar-mobile-section-label">Localização</p>
        <div class="tab-group" data-location>
          <button class="button-tab active">
            <span class="icon icon-20">
              <svg viewBox="0 0 16 16">
                <path d="M7.33333 16V14.1852C5.83951 14.0123 4.58951 13.4198 3.58333 12.4074C2.57716 11.3951 1.98765 10.1481 1.81481 8.66667H0V7.33333H1.81481C1.98765 5.85185 2.57716 4.60494 3.58333 3.59259C4.58951 2.58025 5.83951 1.98765 7.33333 1.81481V0H8.66667V1.81481C10.1605 1.98765 11.4105 2.58025 12.4167 3.59259C13.4228 4.60494 14.0123 5.85185 14.1852 7.33333H16V8.66667H14.1852C14.0123 10.1481 13.4228 11.3951 12.4167 12.4074C11.4105 13.4198 10.1605 14.0123 8.66667 14.1852V16H7.33333ZM11.463 11.463C12.4136 10.5123 12.8889 9.35802 12.8889 8C12.8889 6.64198 12.4136 5.48765 11.463 4.53704C10.5123 3.58642 9.35802 3.11111 8 3.11111C6.64198 3.11111 5.48765 3.58642 4.53704 4.53704C3.58642 5.48765 3.11111 6.64198 3.11111 8C3.11111 9.35802 3.58642 10.5123 4.53704 11.463C5.48765 12.4136 6.64198 12.8889 8 12.8889C9.35802 12.8889 10.5123 12.4136 11.463 11.463ZM6.11111 9.88889C5.59259 9.37037 5.33333 8.74074 5.33333 8C5.33333 7.25926 5.59259 6.62963 6.11111 6.11111C6.62963 5.59259 7.25926 5.33333 8 5.33333C8.74074 5.33333 9.37037 5.59259 9.88889 6.11111C10.4074 6.62963 10.6667 7.25926 10.6667 8C10.6667 8.74074 10.4074 9.37037 9.88889 9.88889C9.37037 10.4074 8.74074 10.6667 8 10.6667C7.25926 10.6667 6.62963 10.4074 6.11111 9.88889ZM9.03704 9.03704C9.32099 8.75309 9.46296 8.40741 9.46296 8C9.46296 7.59259 9.32099 7.24691 9.03704 6.96296C8.75309 6.67901 8.40741 6.53704 8 6.53704C7.59259 6.53704 7.24691 6.67901 6.96296 6.96296C6.67901 7.24691 6.53704 7.59259 6.53704 8C6.53704 8.40741 6.67901 8.75309 6.96296 9.03704C7.24691 9.32099 7.59259 9.46296 8 9.46296C8.40741 9.46296 8.75309 9.32099 9.03704 9.03704Z" />
              </svg>
            </span>
            <span class="location-label">São Paulo - SP</span>
          </button>
        </div>
      </div>

      <div class="navbar-mobile-section">
        <p class="navbar-mobile-section-label">Tipo de mercado</p>
        <div class="tab-group">
          <button class="button-tab active">
            <span class="icon icon-20">
              <svg viewBox="0 0 16 16">
                <path d="M1.09484 16L0 14.9052L1.86315 13.042C1.4918 12.6707 1.21329 12.2481 1.02761 11.7743C0.841937 11.3005 0.7491 10.8075 0.7491 10.2953C0.7491 9.77031 0.845138 9.27731 1.03721 8.81633C1.22929 8.35534 1.5046 7.94558 1.86315 7.58703L2.95798 6.5114L3.4958 7.04922C3.55982 6.63946 3.68147 6.2489 3.86074 5.87755C4.04002 5.5062 4.27691 5.17327 4.57143 4.87875L5.66627 3.80312L6.20408 4.34094C6.26811 3.93117 6.39296 3.54062 6.57863 3.16927C6.76431 2.79792 7.0044 2.46499 7.29892 2.17047L9.4886 0L10.5642 1.07563L9.4886 2.17047C9.78311 2.46499 10.02 2.79792 10.1993 3.16927C10.3786 3.54062 10.5002 3.93117 10.5642 4.34094L14.2713 0.633854L15.3469 1.72869L11.6591 5.43577C12.0688 5.4998 12.4594 5.62145 12.8307 5.80072C13.2021 5.97999 13.535 6.21689 13.8295 6.5114L14.9052 5.41657L16 6.5114L13.8487 8.68187C13.5542 8.9892 13.2149 9.23569 12.8307 9.42137C12.4466 9.60704 12.0496 9.73189 11.6399 9.79592L12.1777 10.3145L11.102 11.3902C10.8075 11.6847 10.4714 11.9248 10.0936 12.1104C9.71589 12.2961 9.32213 12.421 8.91236 12.485L9.46939 13.0228L8.37455 14.1176C8.0032 14.489 7.58383 14.7675 7.11645 14.9532C6.64906 15.1389 6.15926 15.2317 5.64706 15.2317C5.21168 15.2317 4.77311 15.1389 4.33133 14.9532C3.88956 14.7675 3.43818 14.4826 2.97719 14.0984L1.09484 16ZM2.95798 11.928C3.17567 11.7103 3.34214 11.4638 3.45738 11.1885C3.57263 10.9132 3.63025 10.6218 3.63025 10.3145C3.63025 10.02 3.57263 9.72869 3.45738 9.44058C3.34214 9.15246 3.17567 8.89956 2.95798 8.68187C2.7403 8.89956 2.57063 9.15246 2.44898 9.44058C2.32733 9.72869 2.26651 10.02 2.26651 10.3145C2.26651 10.6218 2.32733 10.9132 2.44898 11.1885C2.57063 11.4638 2.7403 11.7103 2.95798 11.928ZM5.66627 13.7143C5.97359 13.7015 6.26811 13.6375 6.54982 13.5222C6.83153 13.407 7.08123 13.2405 7.29892 13.0228C7.08123 12.8051 6.82833 12.6387 6.54022 12.5234C6.2521 12.4082 5.96078 12.3505 5.66627 12.3505C5.37175 12.3505 5.08043 12.4114 4.79232 12.533C4.5042 12.6547 4.2513 12.8243 4.03361 13.042C4.2513 13.2597 4.501 13.4262 4.78271 13.5414C5.06443 13.6567 5.35894 13.7143 5.66627 13.7143ZM5.66627 9.21969C5.88395 9.002 6.05042 8.7523 6.16567 8.47059C6.28091 8.18888 6.33854 7.90076 6.33854 7.60624C6.33854 7.29892 6.28091 7.0044 6.16567 6.72269C6.05042 6.44098 5.88395 6.19128 5.66627 5.97359C5.44858 6.19128 5.27891 6.44098 5.15726 6.72269C5.03561 7.0044 4.97479 7.29892 4.97479 7.60624C4.97479 7.90076 5.03561 8.18888 5.15726 8.47059C5.27891 8.7523 5.44858 9.002 5.66627 9.21969ZM8.39376 11.006C8.70108 11.006 8.9924 10.9452 9.26771 10.8235C9.54302 10.7019 9.78952 10.5322 10.0072 10.3145C9.78952 10.0968 9.54302 9.93037 9.26771 9.81513C8.9924 9.69988 8.70108 9.64226 8.39376 9.64226C8.08643 9.64226 7.79192 9.70308 7.5102 9.82473C7.22849 9.94638 6.97879 10.116 6.7611 10.3337C6.97879 10.5514 7.22849 10.7179 7.5102 10.8331C7.79192 10.9484 8.08643 11.006 8.39376 11.006ZM8.39376 6.5114C8.61144 6.29372 8.77471 6.04402 8.88355 5.7623C8.9924 5.48059 9.04682 5.18607 9.04682 4.87875C9.04682 4.58423 8.9924 4.29292 8.88355 4.0048C8.77471 3.71669 8.61144 3.46379 8.39376 3.2461C8.17607 3.46379 8.0064 3.71669 7.88475 4.0048C7.7631 4.29292 7.70228 4.58423 7.70228 4.87875C7.70228 5.18607 7.7631 5.48059 7.88475 5.7623C8.0064 6.04402 8.17607 6.29372 8.39376 6.5114ZM11.102 8.27851C11.3966 8.27851 11.6879 8.21769 11.976 8.09604C12.2641 7.97439 12.517 7.80472 12.7347 7.58703C12.5042 7.36935 12.2449 7.20288 11.9568 7.08763C11.6687 6.97239 11.3774 6.91477 11.0828 6.91477C10.7883 6.92757 10.5002 6.9916 10.2185 7.10684C9.93677 7.22209 9.68707 7.38856 9.46939 7.60624C9.68707 7.82393 9.93998 7.9936 10.2281 8.11525C10.5162 8.23689 10.8075 8.29132 11.102 8.27851Z" />
              </svg>
            </span>
            Mercado padrão
          </button>

          <button class="button-tab">
            <span class="icon icon-20">
              <svg viewBox="0 0 16 17">
                <path d="M6.00875 13C6.83625 13 7.54167 12.7085 8.125 12.1256C8.70833 11.5426 9 10.8311 9 9.99125C9 9.16375 8.70667 8.45833 8.12 7.875C7.53333 7.29167 6.82813 7 6.00438 7C5.16812 7 4.45833 7.29333 3.875 7.88C3.29167 8.46667 3 9.17188 3 9.99563C3 10.8319 3.29146 11.5417 3.87438 12.125C4.45743 12.7083 5.16889 13 6.00875 13ZM5.98958 11.5C5.58 11.5 5.22931 11.3542 4.9375 11.0625C4.64583 10.7707 4.5 10.42 4.5 10.0104C4.5 9.60069 4.64583 9.24653 4.9375 8.94792C5.22931 8.64931 5.58 8.5 5.98958 8.5C6.39931 8.5 6.75347 8.64931 7.05208 8.94792C7.35069 9.24653 7.5 9.60069 7.5 10.0104C7.5 10.42 7.35069 10.7707 7.05208 11.0625C6.75347 11.3542 6.39931 11.5 5.98958 11.5ZM10.3958 15.5C11.5903 15.5 12.5729 15.1189 13.3438 14.3567C14.1146 13.5944 14.5 12.6144 14.5 11.4167C14.5 11.1667 14.4097 10.9514 14.2292 10.7708C14.0486 10.5903 13.832 10.5 13.5794 10.5C13.3266 10.5 13.1148 10.5903 12.944 10.7708C12.773 10.9514 12.6875 11.1667 12.6875 11.4167C12.6875 12.0139 12.4551 12.5451 11.9904 13.0104C11.5257 13.4757 10.9942 13.7083 10.3958 13.7083C10.1419 13.7083 9.92917 13.7938 9.7575 13.9648C9.58583 14.1356 9.5 14.3474 9.5 14.6002C9.5 14.8528 9.58583 15.066 9.7575 15.2396C9.92917 15.4132 10.1419 15.5 10.3958 15.5ZM10.4027 17C9.73146 17 9.16319 16.7674 8.69792 16.3021C8.23264 15.8368 8 15.2675 8 14.5942C8 13.9342 8.23264 13.3715 8.69792 12.9063C9.16319 12.441 9.72917 12.2083 10.3958 12.2083C10.5903 12.2083 10.7708 12.125 10.9375 11.9583C11.1042 11.7917 11.1875 11.614 11.1875 11.4254C11.1875 10.7517 11.4201 10.179 11.8854 9.7075C12.3507 9.23583 12.92 9 13.5933 9C14.2533 9 14.8194 9.23493 15.2917 9.70479C15.7639 10.1748 16 10.7454 16 11.4167C16 13.0139 15.4653 14.3438 14.3958 15.4063C13.3264 16.4688 11.9953 17 10.4027 17ZM6 16C3.86111 16 2.32639 15.3337 1.39583 14.001C0.465278 12.6684 0 11.2025 0 9.60333C0 8.60389 0.152778 7.54167 0.458333 6.41667C0.763889 5.29167 1.18465 4.25493 1.72062 3.30646C2.2566 2.35799 2.88854 1.56979 3.61646 0.941875C4.34438 0.313959 5.13646 0 5.99271 0C6.74201 0 7.44444 0.236111 8.1 0.708333C8.75556 1.18056 9.33826 1.79431 9.84813 2.54958C10.358 3.30486 10.7851 4.15208 11.1294 5.09125C11.4737 6.03042 11.7083 6.97222 11.8333 7.91667H10.3542C10.2153 7.05556 9.98611 6.23611 9.66667 5.45833C9.34722 4.68056 8.98611 4 8.58333 3.41667C8.18056 2.83333 7.75347 2.36806 7.30208 2.02083C6.85069 1.67361 6.41868 1.5 6.00604 1.5C5.5159 1.5 5.00694 1.72917 4.47917 2.1875C3.95139 2.64583 3.46528 3.25347 3.02083 4.01042C2.57639 4.76736 2.21181 5.63194 1.92708 6.60417C1.64236 7.57639 1.5 8.57639 1.5 9.60417C1.5 9.89583 1.53819 10.3125 1.61458 10.8542C1.69097 11.3958 1.87847 11.9375 2.17708 12.4792C2.47569 13.0208 2.92708 13.4931 3.53125 13.8958C4.13542 14.2986 4.95833 14.5 6 14.5H6.23958C6.31597 14.5 6.40278 14.4931 6.5 14.4792C6.48611 14.7338 6.5 14.9884 6.54167 15.2431C6.58333 15.4977 6.64583 15.7431 6.72917 15.9792C6.61806 15.9931 6.5 16 6.375 16H6Z" />
              </svg>
            </span>
            Outlet sustentável
          </button>
        </div>
      </div>

    </div>
  </div>

  <div class="location-popup-overlay" id="location-popup">
    <div class="location-popup">
      <div class="location-popup-header">
        <button class="button-close" id="button-close-location" aria-label="Fechar">
          <span class="icon icon-24">
            <svg viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" />
            </svg>
          </span>
        </button>
      </div>

      <h2 class="title-xl location-popup-title">Escolha sua localização</h2>

      <ul class="location-list">
        <li><button class="location-option active" data-city="São Paulo - SP">São Paulo - SP</button></li>
        <li><button class="location-option" data-city="Rio de Janeiro - RJ">Rio de Janeiro - RJ</button></li>
        <li><button class="location-option" data-city="Belo Horizonte - MG">Belo Horizonte - MG</button></li>
        <li><button class="location-option" data-city="Curitiba - PR">Curitiba - PR</button></li>
        <li><button class="location-option" data-city="Porto Alegre - RS">Porto Alegre - RS</button></li>
        <li><button class="location-option" data-city="Florianópolis - SC">Florianópolis - SC</button></li>
        <li><button class="location-option" data-city="Salvador - BA">Salvador - BA</button></li>
        <li><button class="location-option" data-city="Recife - PE">Recife - PE</button></li>
        <li><button class="location-option" data-city="Fortaleza - CE">Fortaleza - CE</button></li>
        <li><button class="location-option" data-city="Goiânia - GO">Goiânia - GO</button></li>
        <li><button class="location-option" data-city="Brasília - DF">Brasília - DF</button></li>
      </ul>
    </div>
  </div>

`;

  // Menu mobile: abre no hambúrguer, fecha no X ou clicando fora do card
  const hamburgerBtn = navbarRoot.querySelector('.button-hamburger');
  const closeBtn = navbarRoot.querySelector('#button-close-menu');
  const overlay = navbarRoot.querySelector('#navbar-mobile-overlay');
  const menu = navbarRoot.querySelector('.navbar-mobile-menu');

  if (hamburgerBtn && closeBtn && overlay && menu) {
    hamburgerBtn.addEventListener('click', () => {
      overlay.classList.add('open');
      hamburgerBtn.setAttribute('aria-expanded', 'true');
    });

    const closeMenu = () => {
      overlay.classList.remove('open');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
    };

    closeBtn.addEventListener('click', closeMenu);

    // Clique no fundo escurecido (fora do .navbar-mobile-menu) também fecha
    overlay.addEventListener('click', (e) => {
      if (!menu.contains(e.target)) {
        closeMenu();
      }
    });
  }

  // Toggle de mercado: em cada grupo com 2+ opções, a clicada vira a ativa.
  // Grupos de 1 botão (localização) são ignorados — eles abrem o popup.
  navbarRoot.querySelectorAll('.tab-group').forEach(group => {
    const tabs = group.querySelectorAll('.button-tab');
    if (tabs.length < 2) return;
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
      });
    });
  });

  // Popup de localização: escolher uma cidade atualiza o texto de todos os
  // botões de localização (desktop + mobile) ao mesmo tempo.
  const locationPopup = navbarRoot.querySelector('#location-popup');
  if (locationPopup) {
    const triggers = navbarRoot.querySelectorAll('[data-location] .button-tab');
    const labels = navbarRoot.querySelectorAll('.location-label');
    const options = navbarRoot.querySelectorAll('.location-option');
    const closeLocationBtn = navbarRoot.querySelector('#button-close-location');

    // Trava o scroll do body enquanto o popup está aberto
    const openPopup = () => {
      locationPopup.classList.add('open');
      document.body.style.overflow = 'hidden';
    };
    const closePopup = () => {
      locationPopup.classList.remove('open');
      document.body.style.overflow = '';
    };

    triggers.forEach(btn => btn.addEventListener('click', openPopup));
    if (closeLocationBtn) closeLocationBtn.addEventListener('click', closePopup);

    // Clique no fundo escurecido (fora do card) fecha
    locationPopup.addEventListener('click', (e) => {
      if (e.target === locationPopup) closePopup();
    });

    options.forEach(option => {
      option.addEventListener('click', () => {
        const city = option.getAttribute('data-city');
        labels.forEach(label => { label.textContent = city; });
        options.forEach(o => o.classList.remove('active'));
        option.classList.add('active');
        closePopup();
      });
    });
  }
}

// Footer — pre-footer (CTA de busca) + footer principal (navegação, social, logo)
function renderFooter() {
  const footerRoot = document.getElementById('footer-root');
  if (!footerRoot) return;

  footerRoot.innerHTML = `
  <div class="page-bottom">
    <div class="pre-footer">
      <h2 class="title-2xl">Não encontrou o que procura?</h2>

      <div class="search-bar min-width">
        <input type="search" aria-label="Buscar produtos" placeholder="Buscar frutas, vegetais, sementes e muito mais..." />

        <button class="button-search">
          <span class="icon icon-20">
            <svg viewBox="0 0 16 16">
              <path d="M14.7857 16L9.09524 10.3095C8.61905 10.6587 8.0969 10.9325 7.52881 11.131C6.96071 11.3294 6.35611 11.4286 5.715 11.4286C4.12722 11.4286 2.77778 10.873 1.66667 9.7619C0.555556 8.65079 0 7.30159 0 5.71429C0 4.12698 0.555556 2.77778 1.66667 1.66667C2.77778 0.555556 4.12698 0 5.71429 0C7.30159 0 8.65079 0.555556 9.7619 1.66667C10.873 2.77778 11.4286 4.12722 11.4286 5.715C11.4286 6.35611 11.3294 6.96071 11.131 7.52881C10.9325 8.0969 10.6587 8.61905 10.3095 9.09524L16 14.7857L14.7857 16ZM5.71429 9.71429C6.8254 9.71429 7.76984 9.3254 8.54762 8.54762C9.3254 7.76984 9.71429 6.8254 9.71429 5.71429C9.71429 4.60317 9.3254 3.65873 8.54762 2.88095C7.76984 2.10317 6.8254 1.71429 5.71429 1.71429C4.60317 1.71429 3.65873 2.10317 2.88095 2.88095C2.10317 3.65873 1.71429 4.60317 1.71429 5.71429C1.71429 6.8254 2.10317 7.76984 2.88095 8.54762C3.65873 9.3254 4.60317 9.71429 5.71429 9.71429Z" />
            </svg>
          </span>
        </button>
      </div>
    </div>

    <footer class="footer">
      <div class="footer-left">
        <nav class="footer-nav">
          <p class="text-semibold">Páginas</p>

          <ul>
            <li>
              <a class="button-footer-link" href="/index.html">Início</a>
            </li>
            <li>
              <a class="button-footer-link" href="/pages/login-page.html">Entrar</a>
            </li>
            <li>
              <a class="button-footer-link" href="/pages/how-it-works-page.html">Como funciona</a>
            </li>
            <li>
              <a class="button-footer-link" href="/pages/register-page.html">Anunciar produto</a>
            </li>
          </ul>
        </nav>

        <div class="footer-social">
          <p class="text-semibold">Social</p>

          <ul class="social-buttons">
            <li>
              <button class="button-social">
                <span class="icon icon-16">
                  <svg viewBox="0 0 16 16">
                    <path d="M12.251 2.94561C11.7155 2.94561 11.3138 3.34728 11.3138 3.88285C11.3138 4.41841 11.7155 4.82008 12.251 4.82008C12.7866 4.82008 13.1883 4.41841 13.1883 3.88285C13.1883 3.34728 12.7866 2.94561 12.251 2.94561Z" />
                    <path d="M8.03347 4.15063C5.82427 4.15063 4.08368 5.95816 4.08368 8.10042C4.08368 10.2427 5.89121 12.0502 8.03347 12.0502C10.1757 12.0502 11.9833 10.2427 11.9833 8.10042C11.9833 5.95816 10.2427 4.15063 8.03347 4.15063ZM8.03347 10.6444C6.62762 10.6444 5.48954 9.50628 5.48954 8.10042C5.48954 6.69456 6.62762 5.55649 8.03347 5.55649C9.43933 5.55649 10.5774 6.69456 10.5774 8.10042C10.5774 9.50628 9.43933 10.6444 8.03347 10.6444Z" />
                    <path d="M11.2469 0H4.88703C2.14226 0 0 2.14226 0 4.82008V11.1799C0 13.8577 2.14226 16 4.82008 16H11.1799C13.8577 16 16 13.8577 16 11.1799V4.82008C16.0669 2.14226 13.9247 0 11.2469 0ZM14.5272 11.2469C14.5272 13.0544 13.0544 14.5941 11.1799 14.5941H4.82008C3.01255 14.5941 1.4728 13.1213 1.4728 11.2469V4.88703C1.4728 3.0795 2.94561 1.53975 4.82008 1.53975H11.1799C12.9874 1.53975 14.5272 3.01255 14.5272 4.88703V11.2469Z" />
                  </svg>
                </span>
              </button>
            </li>

            <li>
              <button class="button-social">
                <span class="icon icon-16">
                  <svg viewBox="0 0 16 15">
                    <path d="M9.74857 6.39975L14.9943 0H12.653L8.64914 4.88775L5.09714 0H0L5.94743 8.1825L0.358095 15H2.70019L7.04686 9.6975L10.9029 15H16L9.74857 6.39975ZM7.93524 8.61225L6.83429 7.098L2.56 1.22025H4.32L7.7699 5.958L8.86933 7.473L13.4545 13.7797H11.6945L7.93524 8.61225Z" />
                  </svg>
                </span>
              </button>
            </li>

            <li>
              <button class="button-social">
                <span class="icon icon-16">
                  <svg viewBox="0 0 16 16">
                    <path d="M8 0C3.58182 0 0 3.60023 0 8.04112C0 12.0726 2.95455 15.4013 6.80436 15.9828V10.1724H4.82509V8.05866H6.80436V6.6522C6.80436 4.32356 7.93309 3.30124 9.85855 3.30124C10.7807 3.30124 11.2684 3.36996 11.4993 3.40139V5.24646H10.1858C9.36836 5.24646 9.08291 6.02536 9.08291 6.9033V8.05866H11.4785L11.1535 10.1724H9.08291V16C12.9876 15.4675 16 12.1118 16 8.04112C16 3.60023 12.4182 0 8 0Z" />
                  </svg>
                </span>
              </button>
            </li>
          </ul>
        </div>

        <div class="footnotes text-muted">
          <span>© 2026 Altterra</span>

          <span>•</span>

          <a class="button-footnote" href="">Privacidade</a>

          <span>•</span>

          <a class="button-footnote" href="">Termos</a>
        </div>
      </div>

      <div class="footer-right">
        <button class="button-scroll-top">
          Subir ao topo
          <span class="icon icon-16">
            <svg viewBox="0 0 16 16">
              <path d="M7 16V3.83333L1.41667 9.41667L0 8L8 0L16 8L14.5833 9.41667L9 3.83333V16H7Z" />
            </svg>
          </span>
        </button>

        <span class="footer-logo">
          <a href="/index.html">
            <img src="/images/alterra-logo-footer.svg" alt="Altterra" />
          </a>
        </span>
      </div>
    </footer>
  </div>

`;

  // Scroll suave até o topo da página
  const scrollTopBtn = footerRoot.querySelector('.button-scroll-top');
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}
