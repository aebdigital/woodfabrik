// Footer Component - Footer content and privacy functionality

export function initFooter() {
    console.log('initFooter called');
    try {
        loadFooter();
        initPrivacyModal();
        console.log('Footer initialization completed');
    } catch (error) {
        console.error('Error in initFooter:', error);
        throw error;
    }
}

function ensureFooterCSSLoaded() {
    // Check if footer CSS is already loaded
    const existingLink = document.querySelector('link[href*="footer.css"]');
    if (existingLink) return;
    
    // Create and inject CSS link
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/css/footer.css';
    document.head.appendChild(link);
}

function loadFooter() {
    // CSS is now loaded directly in HTML, no need to inject it
    // ensureFooterCSSLoaded();
    
    // Use absolute paths for clean URLs to prevent relative path issues
    const basePath = '/';
    const imagePath = '/sources/logo.png';
    
    const footerHTML = `
        <footer id="footer" class="footer">
            <!-- CTA Section -->
            <div class="footer-cta-section">
                <div class="footer-cta-content">
                    <div class="footer-cta-left">
                        <h2>Potrebujete nábytok na mieru?</h2>
                        <p>Od návrhu až po montáž - všetko pod jednou strechou.</p>
                    </div>
                    <div class="footer-cta-right">
                        <a href="tel:+421904163666" class="phone-cta-btn">+421 904 163 666</a>
                    </div>
                </div>
            </div>
            
            
            <div class="footer-divider"></div>
            
            <!-- Footer Bottom -->
            <div class="footer-bottom">
                <div class="footer-main">
                    <div class="footer-logo">
                        <img src="${imagePath}" alt="Woodfabrik" class="footer-logo-image">
                    </div>
                    <div class="footer-nav-col">
                        <a href="${basePath}">Domov</a>
                        <a href="${basePath}produkty-sluzby">Služby</a>
                        <a href="${basePath}kontakt">Kontakt</a>
                        <a href="${basePath}referencie">Portfólio</a>
                    </div>
                    <div class="footer-nav-col">
                        <a href="${basePath}produkty-sluzby#kuchyne">Kuchyne na mieru</a>
                        <a href="${basePath}produkty-sluzby#detske-izby">Detské izby</a>
                        <a href="${basePath}produkty-sluzby#obyvacie-steny">Obývacie steny</a>
                        <a href="${basePath}produkty-sluzby#skrine">Skrine na mieru</a>
                        <a href="${basePath}produkty-sluzby#sedenia">Sedenia</a>
                    </div>
                    <div class="footer-nav-col">
                        <a href="${basePath}produkty-sluzby#terasy">Terasy</a>
                        <a href="${basePath}produkty-sluzby#altanky-pristresky">Altánky a prístrešky</a>
                        <a href="${basePath}produkty-sluzby#chaty-chatky">Chaty a chatky</a>
                        <a href="${basePath}produkty-sluzby#satiniky">Šatníky</a>
                    </div>
                    <div class="footer-contact">
                        <p>Družobná 4368/6<br>Veľký Kolačín, 01851</p>
                        <p>Prevádzka: Slobody 63/42, Veľký Kolačín</p>
                        <p><a href="tel:+421904163666">+421 904 163 666</a><br>
                        <a href="mailto:woodfabrik@azet.sk">woodfabrik@azet.sk</a></p>
                        <div class="footer-social">
                            <a href="https://www.facebook.com/vyrobanabytkuchorvatkolacin/" target="_blank">f</a>
                        </div>
                    </div>
                </div>
                
                <div class="footer-copyright">
                    <p>&copy; Woodfabrik 2025 &nbsp;&nbsp; <a href="#" onclick="openPrivacyPopup(); return false;">Ochrana osobných údajov</a> / <a href="#" onclick="openCookieSettings(); return false;">Cookies</a> / <a href="https://aebdigital.com" target="_blank">Tvorba stránky - AEB Digital</a></p>
                </div>
            </div>
        </footer>
        
        <!-- Privacy Policy Popup -->
        <div id="privacy-popup" class="privacy-popup">
            <div class="privacy-popup-content">
                <div class="privacy-popup-header">
                    <h2>Ochrana osobných údajov</h2>
                    <button class="privacy-popup-close" onclick="closePrivacyPopup()">&times;</button>
                </div>
                <div class="privacy-popup-body">
                    <div class="company-info">
                        <strong>Woodfabrik s.r.o.</strong><br>
                        <a href="https://maps.google.com/?q=Družobná+4368/6+Veľký+Kolačín,+018+51" target="_blank" rel="noopener" style="text-decoration: underline; color: #F5821E;">Družobná 4368/6, 018 51 Veľký Kolačín</a><br>
                        Slovenská republika<br>
                        IČO: 50151576<br>
                        DIČ: 2120196463<br>
                        Prevádzka: Slobody 63/42, Veľký Kolačín, 018 51<br>
                        E-mail: woodfabrik@azet.sk<br>
                        Tel.: +421 904 163 666
                    </div>
                    
                    <p>Tieto Zásady ochrany osobných údajov (ďalej len „Zásady") popisujú, aké osobné údaje spracúvame v súvislosti s používaním našej webovej stránky a kontaktných formulárov.</p>
                    
                    <h3>I. Kontaktný formulár</h3>
                    <p>Na stránke www.woodfabrik.sk prevádzkujeme kontaktný formulár ktorého účelom je umožniť vám:</p>
                    <p>Položiť otázku k našim produktom a službám<br>
                    Požiadať o cenovú ponuku</p>
                    
                    <p><strong>Rozsah spracúvaných údajov:</strong></p>
                    <p>Meno a priezvisko<br>
                    E-mailová adresa<br>
                    Telefónne číslo<br>
                    Správu</p>
                    
                    <p><strong>Účel spracovania:</strong><br>
                    Spracúvame uvedené údaje, aby sme vás mohli kontaktovať a reagovať na váš dopyt.</p>
                    
                    <p><strong>Právny základ:</strong><br>
                    Článok 6 ods. 1 písm. b) GDPR – plnenie opatrení pred uzavretím zmluvy na žiadosť dotknutej osoby.</p>
                    
                    <p><strong>Doba uchovávania:</strong><br>
                    Osobné údaje budeme uchovávať maximálne 10 rokov od odozvy na váš dopyt, pokiaľ nevznikne ďalší zmluvný vzťah.</p>
                    
                    <h3>II. Súbory cookies</h3>
                    <p>Na našej webovej stránke používame cookies výlučne na nasledujúce účely:</p>
                    <p>Nevyhnutné cookies – zabezpečujú základnú funkčnosť stránky (napr. ukladanie relácie, nastavení prehliadača).<br>
                    Štatistické (analytické) cookies – pomáhajú nám pochopiť, ako návštevníci stránku používajú (nasadzujeme ich len so súhlasom používateľa).</p>
                    
                    <p><strong>Správa súhlasov:</strong><br>
                    Používateľ môže kedykoľvek odvolať súhlas s využívaním štatistických cookies prostredníctvom nastavení cookie lišty alebo priamo v prehliadači.</p>
                    
                    <h3>III. Práva dotknutej osoby</h3>
                    <p>Podľa nariadenia GDPR máte nasledujúce práva:</p>
                    <p>Prístup k osobným údajom, ktoré spracúvame<br>
                    Oprava nepresných alebo neúplných údajov<br>
                    Vymazanie („právo zabudnutia"), ak na spracovanie už nie je právny základ<br>
                    Obmedzenie spracovania<br>
                    Prenosnosť údajov<br>
                    Odvolanie súhlasu – stane sa účinným dňom odvolania<br>
                    Podanie sťažnosti u Úradu na ochranu osobných údajov SR (Hraničná 12, 820 07 Bratislava, www.dataprotection.gov.sk)</p>
                    
                    <p>V prípade otázok alebo uplatnenia Vašich práv nás môžete kontaktovať na woodfabrik@azet.sk alebo telefónnom čísle +421 904 163 666.</p>
                    
                    <p><strong>Tieto Zásady nadobúdajú účinnosť dňom 25. 7. 2025.</strong></p>
                </div>
            </div>
        </div>
    `;
    
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
        footerContainer.innerHTML = footerHTML;
    }
}

function initPrivacyModal() {
    // Make privacy functions globally available
    window.openPrivacyPopup = function() {
        const popup = document.getElementById('privacy-popup');
        if (popup) {
            popup.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    window.closePrivacyPopup = function() {
        const popup = document.getElementById('privacy-popup');
        if (popup) {
            popup.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    };

    // Close popup when clicking outside
    document.addEventListener('click', function(e) {
        const popup = document.getElementById('privacy-popup');
        if (popup && e.target === popup) {
            window.closePrivacyPopup();
        }
    });

    // Close popup with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            window.closePrivacyPopup();
        }
    });
}

// Make functions globally available for fallback
if (typeof window !== 'undefined') {
    window.loadFooter = loadFooter;
    window.initPrivacyModal = initPrivacyModal;
    window.ensureFooterCSSLoaded = ensureFooterCSSLoaded;
}
