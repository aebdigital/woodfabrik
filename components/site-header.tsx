const headerHtml = `
  <div class="scroll-progress">
    <div class="scroll-progress-bar"></div>
  </div>

  <nav class="navbar navbar-transparent">
    <div class="nav-container">
      <div class="nav-logo">
        <a href="/" class="logo-link">
          <img src="/sources/logo.png" alt="Woodfabrik" class="logo-image">
        </a>
      </div>
      <ul class="nav-menu">
        <li><a href="/" class="nav-link">Domov</a></li>
        <li><a href="/produkty-sluzby" class="nav-link">Produkty a služby</a></li>
        <li><a href="/referencie" class="nav-link">Referencie</a></li>
        <li><a href="/kontakt" class="nav-link">Kontakt</a></li>
      </ul>
      <div class="nav-cta">
        <a href="tel:+421904163666" class="nav-cta-btn">+421 904 163 666</a>
      </div>
      <div class="hamburger">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </nav>

  <div class="mobile-overlay"></div>
  <div class="mobile-sidebar">
    <div class="mobile-sidebar-header">
      <div class="mobile-logo">
        <a href="/" class="mobile-logo-link">
          <img src="/sources/logo.png" alt="Woodfabrik" class="mobile-logo-image">
        </a>
      </div>
      <button class="mobile-close-btn" aria-label="Zavrieť menu">✕</button>
    </div>
    <ul class="mobile-nav-menu">
      <li><a href="/" class="mobile-nav-link">Domov</a></li>
      <li><a href="/produkty-sluzby" class="mobile-nav-link">Produkty a služby</a></li>
      <li><a href="/referencie" class="mobile-nav-link">Referencie</a></li>
      <li><a href="/kontakt" class="mobile-nav-link">Kontakt</a></li>
    </ul>
    <div class="mobile-cta">
      <a href="tel:+421904163666" class="mobile-cta-btn">+421 904 163 666</a>
    </div>
  </div>
`;

export function SiteHeader() {
  return (
    <div
      id="navigation-container"
      dangerouslySetInnerHTML={{ __html: headerHtml }}
    />
  );
}
