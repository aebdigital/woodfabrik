// Cookie Management Component

export function initCookies() {
    loadCookieBanner();
    loadCookieModal();
    initCookieEventListeners();
    checkCookieConsent();
}

function loadCookieBanner() {
    const cookieBannerHTML = `
        <!-- Cookie Banner -->
        <div id="cookie-banner" class="cookie-banner">
            <div class="cookie-banner-content">
                <div class="cookie-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                </div>
                <div class="cookie-text">
                    Používame cookies na zlepšenie vašej používateľskej skúsenosti a na analýzu návštevnosti. Kliknutím na "Súhlasím" súhlasíte s používaním všetkých cookies.
                </div>
            </div>
            <div class="cookie-buttons">
                <button class="cookie-btn cookie-btn-settings" onclick="openCookieSettings()">Nastavenia</button>
                <button class="cookie-btn cookie-btn-accept" onclick="acceptAllCookies()">Súhlasím</button>
            </div>
        </div>
    `;

    // Insert banner into body
    document.body.insertAdjacentHTML('beforeend', cookieBannerHTML);
}

function loadCookieModal() {
    const cookieModalHTML = `
        <!-- Cookie Settings Modal -->
        <div id="cookie-modal-overlay" class="cookie-modal-overlay">
            <div class="cookie-modal">
                <div class="cookie-modal-header">
                    <h2 class="cookie-modal-title">Nastavenia cookies</h2>
                    <button class="cookie-modal-close" onclick="closeCookieSettings()">×</button>
                </div>

                <div class="cookie-category">
                    <div class="cookie-category-header">
                        <h3 class="cookie-category-title">Nevyhnutné cookies</h3>
                        <label class="cookie-toggle">
                            <input type="checkbox" id="necessary-cookies" checked disabled>
                            <span class="cookie-toggle-slider"></span>
                        </label>
                    </div>
                    <p class="cookie-category-description">
                        Tieto cookies sú potrebné pre základnú funkčnosť stránky a nemožno ich vypnúť.
                    </p>
                </div>

                <div class="cookie-category">
                    <div class="cookie-category-header">
                        <h3 class="cookie-category-title">Analytické cookies</h3>
                        <label class="cookie-toggle">
                            <input type="checkbox" id="analytics-cookies">
                            <span class="cookie-toggle-slider"></span>
                        </label>
                    </div>
                    <p class="cookie-category-description">
                        Pomáhajú nám pochopiť, ako návštevníci používajú našu stránku, aby sme ju mohli zlepšiť.
                    </p>
                </div>

                <div class="cookie-category">
                    <div class="cookie-category-header">
                        <h3 class="cookie-category-title">Marketingové cookies</h3>
                        <label class="cookie-toggle">
                            <input type="checkbox" id="marketing-cookies">
                            <span class="cookie-toggle-slider"></span>
                        </label>
                    </div>
                    <p class="cookie-category-description">
                        Používajú sa na personalizáciu reklám a meranie ich účinnosti.
                    </p>
                </div>

                <div class="cookie-modal-footer">
                    <button class="cookie-modal-btn cookie-btn-save" onclick="saveCookieSettings()">Uložiť nastavenia</button>
                    <button class="cookie-modal-btn cookie-btn-accept-all" onclick="acceptAllCookiesFromModal()">Súhlasím so všetkými</button>
                </div>
            </div>
        </div>
    `;

    // Insert modal into body
    document.body.insertAdjacentHTML('beforeend', cookieModalHTML);
}

function initCookieEventListeners() {
    // Close modal when clicking outside
    document.addEventListener('click', function(e) {
        const modal = document.getElementById('cookie-modal-overlay');
        if (e.target === modal) {
            closeCookieSettings();
        }
    });

    // ESC key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeCookieSettings();
        }
    });
}

function checkCookieConsent() {
    const consent = getCookieConsent();
    
    if (!consent) {
        // Show banner after a short delay
        setTimeout(() => {
            showCookieBanner();
        }, 1000);
    } else {
        // Load cookies based on consent
        loadConsentedCookies(consent);
    }
}

function showCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    if (banner) {
        banner.classList.add('show');
    }
}

function hideCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    if (banner) {
        banner.classList.remove('show');
        setTimeout(() => {
            banner.style.display = 'none';
        }, 300);
    }
}

function openCookieSettings() {
    const modal = document.getElementById('cookie-modal-overlay');
    const consent = getCookieConsent();
    
    // Load current settings
    if (consent) {
        document.getElementById('analytics-cookies').checked = consent.analytics || false;
        document.getElementById('marketing-cookies').checked = consent.marketing || false;
    }
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeCookieSettings() {
    const modal = document.getElementById('cookie-modal-overlay');
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

function acceptAllCookies() {
    const consent = {
        necessary: true,
        analytics: true,
        marketing: true,
        timestamp: new Date().toISOString()
    };
    
    saveCookieConsent(consent);
    loadConsentedCookies(consent);
    hideCookieBanner();
}

function acceptAllCookiesFromModal() {
    acceptAllCookies();
    closeCookieSettings();
}

function saveCookieSettings() {
    const consent = {
        necessary: true, // Always true
        analytics: document.getElementById('analytics-cookies').checked,
        marketing: document.getElementById('marketing-cookies').checked,
        timestamp: new Date().toISOString()
    };
    
    saveCookieConsent(consent);
    loadConsentedCookies(consent);
    hideCookieBanner();
    closeCookieSettings();
}

function saveCookieConsent(consent) {
    localStorage.setItem('woodfabrik_cookie_consent', JSON.stringify(consent));
    
    // Also set a simple cookie for backend checking
    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 1);
    document.cookie = `woodfabrik_cookies_accepted=true; expires=${expiry.toUTCString()}; path=/; SameSite=Lax`;
}

function getCookieConsent() {
    try {
        const consent = localStorage.getItem('woodfabrik_cookie_consent');
        return consent ? JSON.parse(consent) : null;
    } catch (e) {
        return null;
    }
}

function loadConsentedCookies(consent) {
    console.log('Loading cookies based on consent:', consent);
    
    // Load analytics cookies if consented
    if (consent.analytics) {
        loadAnalyticsCookies();
    }
    
    // Load marketing cookies if consented
    if (consent.marketing) {
        loadMarketingCookies();
    }
}

function loadAnalyticsCookies() {
    // Example: Google Analytics
    console.log('Loading analytics cookies...');
    
    // Uncomment and configure when ready to use analytics
    /*
    window.gtag = window.gtag || function(){
        (window.gtag.q = window.gtag.q || []).push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', 'GA_MEASUREMENT_ID');
    
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
    document.head.appendChild(script);
    */
}

function loadMarketingCookies() {
    // Example: Facebook Pixel, marketing pixels
    console.log('Loading marketing cookies...');
    
    // Uncomment and configure when ready to use marketing tools
    /*
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', 'FACEBOOK_PIXEL_ID');
    fbq('track', 'PageView');
    */
}

// Reset cookie consent (for testing/admin purposes)
function resetCookieConsent() {
    localStorage.removeItem('woodfabrik_cookie_consent');
    document.cookie = 'woodfabrik_cookies_accepted=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    location.reload();
}

// Make functions globally available
if (typeof window !== 'undefined') {
    window.openCookieSettings = openCookieSettings;
    window.closeCookieSettings = closeCookieSettings;
    window.acceptAllCookies = acceptAllCookies;
    window.acceptAllCookiesFromModal = acceptAllCookiesFromModal;
    window.saveCookieSettings = saveCookieSettings;
    window.resetCookieConsent = resetCookieConsent;
}

// Export for ES6 modules
export { 
    openCookieSettings, 
    closeCookieSettings, 
    acceptAllCookies, 
    saveCookieSettings,
    resetCookieConsent
};