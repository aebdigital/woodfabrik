// Header Component - Navigation functionality

export function initHeader() {
    console.log('initHeader called');
    try {
        loadNavigation();
        initMobileNavigation();
        initScrollProgress();
        initNavigationListeners();
        console.log('All header functions completed');
    } catch (error) {
        console.error('Error in initHeader:', error);
        throw error;
    }
}

// Make functions globally available for fallback - after function declarations

function loadNavigation() {
    console.log('loadNavigation called');
    
    // Use absolute paths for clean URLs to prevent relative path issues
    const basePath = '/';
    const imagePath = '/sources/logo.png';
    
    console.log('Resolved paths:', {
        basePath,
        homeLink: `${basePath}`,
        produktyLink: `${basePath}produkty-sluzby`,
        imagePath
    });
    
    const navigationHTML = `
        <!-- Scroll Progress Indicator -->
        <div class="scroll-progress">
            <div class="scroll-progress-bar"></div>
        </div>

        <!-- Transparent Navigation -->
        <nav class="navbar navbar-transparent">
            <div class="nav-container">
                <div class="nav-logo">
                    <a href="${basePath}" class="logo-link">
                        <img src="${imagePath}" alt="Woodfabrik" class="logo-image">
                    </a>
                </div>
                <ul class="nav-menu">
                    <li><a href="${basePath}" class="nav-link">Domov</a></li>
                    <li><a href="${basePath}produkty-sluzby" class="nav-link">Produkty a služby</a></li>
                    <li><a href="${basePath}referencie" class="nav-link">Referencie</a></li>
                    <li><a href="${basePath}kontakt" class="nav-link">Kontakt</a></li>
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

        <!-- Mobile Sidebar -->
        <div class="mobile-overlay"></div>
        <div class="mobile-sidebar">
            <div class="mobile-sidebar-header">
                <div class="mobile-logo">
                    <a href="${basePath}" class="mobile-logo-link">
                        <img src="${imagePath}" alt="Woodfabrik" class="mobile-logo-image">
                    </a>
                </div>
                <button class="mobile-close-btn" aria-label="Zavrieť menu">✕</button>
            </div>
            <ul class="mobile-nav-menu">
                <li><a href="${basePath}" class="mobile-nav-link">Domov</a></li>
                <li><a href="${basePath}produkty-sluzby" class="mobile-nav-link">Produkty a služby</a></li>
                <li><a href="${basePath}referencie" class="mobile-nav-link">Referencie</a></li>
                <li><a href="${basePath}kontakt" class="mobile-nav-link">Kontakt</a></li>
            </ul>
            <div class="mobile-cta">
                <a href="tel:+421904163666" class="mobile-cta-btn">+421 904 163 666</a>
            </div>
        </div>
    `;
    
    const navigationContainer = document.getElementById('navigation-container');
    if (navigationContainer) {
        navigationContainer.innerHTML = navigationHTML;
    }
}


function initMobileNavigation() {
    console.log('initMobileNavigation called - setting up event listeners');
    document.addEventListener('click', function(e) {
        // Toggle mobile sidebar
        if (e.target.closest('.hamburger')) {
            console.log('Hamburger clicked!');
            const hamburger = e.target.closest('.hamburger');
            const mobileSidebar = document.querySelector('.mobile-sidebar');
            const mobileOverlay = document.querySelector('.mobile-overlay');
            const navbar = document.querySelector('.navbar-transparent');
            
            console.log('Elements found:', {
                hamburger: !!hamburger,
                mobileSidebar: !!mobileSidebar,
                mobileOverlay: !!mobileOverlay,
                navbar: !!navbar
            });
            
            if (hamburger) hamburger.classList.toggle('active');
            if (mobileSidebar) mobileSidebar.classList.toggle('active');
            if (mobileOverlay) mobileOverlay.classList.toggle('active');
            
            console.log('After toggle - Classes:', {
                hamburgerActive: hamburger?.classList.contains('active'),
                sidebarActive: mobileSidebar?.classList.contains('active'),
                overlayActive: mobileOverlay?.classList.contains('active')
            });
            
            if (hamburger && hamburger.classList.contains('active')) {
                navbar.classList.add('mobile-menu-open');
                document.body.style.overflow = 'hidden';
            } else {
                navbar.classList.remove('mobile-menu-open');
                document.body.style.overflow = '';
            }
        }
        
        // Close mobile sidebar when clicking overlay, mobile link, or close button
        if (e.target.classList.contains('mobile-overlay') || e.target.classList.contains('mobile-nav-link') || e.target.classList.contains('mobile-close-btn')) {
            const mobileSidebar = document.querySelector('.mobile-sidebar');
            const mobileOverlay = document.querySelector('.mobile-overlay');
            const hamburger = document.querySelector('.hamburger');
            const navbar = document.querySelector('.navbar-transparent');
            
            mobileSidebar.classList.remove('active');
            mobileOverlay.classList.remove('active');
            hamburger.classList.remove('active');
            navbar.classList.remove('mobile-menu-open');
            document.body.style.overflow = '';
        }
    });
    
    // Close sidebar on window resize if screen becomes larger
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            const mobileSidebar = document.querySelector('.mobile-sidebar');
            const mobileOverlay = document.querySelector('.mobile-overlay');
            const hamburger = document.querySelector('.hamburger');
            const navbar = document.querySelector('.navbar-transparent');
            
            if (mobileSidebar && mobileSidebar.classList.contains('active')) {
                mobileSidebar.classList.remove('active');
                mobileOverlay.classList.remove('active');
                hamburger.classList.remove('active');
                navbar.classList.remove('mobile-menu-open');
                document.body.style.overflow = '';
            }
        }
    });
}

function initScrollProgress() {
    const scrollProgress = document.querySelector('.scroll-progress-bar');

    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;

        // Update scroll progress
        if (scrollProgress) {
            const scrollPercentage = (scrollPosition / documentHeight) * 100;
            scrollProgress.style.height = `${scrollPercentage}%`;
        }
    });
}

function initNavigationListeners() {
    // Smooth scrolling for anchor links
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a[href^="#"]');
        if (link) {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
}

// Make functions globally available for fallback
if (typeof window !== 'undefined') {
    window.loadNavigation = loadNavigation;
    window.initMobileNavigation = initMobileNavigation;
    window.initScrollProgress = initScrollProgress;
    window.initNavigationListeners = initNavigationListeners;
}
