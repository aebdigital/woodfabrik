// Portfolio Filter Component
export function initPortfolio() {
    loadPortfolioFilter();
    initPortfolioFunctionality();
}

function loadPortfolioFilter() {
    // Portfolio filter is already in the HTML, no need to inject
}

function initPortfolioFunctionality() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    if (!filterButtons.length || !portfolioItems.length) {
        return; // Elements not found, probably not on portfolio page
    }
    
    // Show only Brány initially
    portfolioItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (category === 'brany') {
            item.classList.remove('hidden');
            item.style.display = 'block';
        } else {
            item.classList.add('hidden');
            item.style.display = 'none';
        }
    });
    
    // Add click event listeners to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter portfolio items
            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (category === filter) {
                    item.classList.remove('hidden');
                    item.style.display = 'block';
                } else {
                    item.classList.add('hidden');
                    item.style.display = 'none';
                }
            });
            
            // Update visible images for lightbox
            updateVisibleImages();
        });
    });
    
    // Initialize lightbox functionality
    initLightbox();
}

function initLightbox() {
    window.currentImageIndex = 0;
    window.visibleImages = [];
    
    updateVisibleImages();
    
    // Close lightbox on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            nextImage();
        } else if (e.key === 'ArrowLeft') {
            previousImage();
        }
    });
    
    // Close lightbox when clicking outside the image
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === this) {
                closeLightbox();
            }
        });
    }
}

function updateVisibleImages() {
    if (typeof window !== 'undefined') {
        window.visibleImages = Array.from(document.querySelectorAll('.portfolio-item')).filter(item => 
            !item.classList.contains('hidden')
        ).map(item => item.querySelector('img'));
    }
}

// Lightbox functions - make them globally available
function openLightbox(img) {
    updateVisibleImages();
    if (typeof window !== 'undefined') {
        window.currentImageIndex = window.visibleImages.indexOf(img);
        
        const lightbox = document.getElementById('lightbox');
        const lightboxImage = document.getElementById('lightbox-image');
        
        if (lightbox && lightboxImage) {
            lightboxImage.src = img.src;
            lightboxImage.alt = img.alt;
            lightbox.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function nextImage() {
    if (typeof window !== 'undefined' && window.visibleImages && window.visibleImages.length > 0) {
        window.currentImageIndex = (window.currentImageIndex + 1) % window.visibleImages.length;
        const lightboxImage = document.getElementById('lightbox-image');
        if (lightboxImage && window.visibleImages[window.currentImageIndex]) {
            lightboxImage.src = window.visibleImages[window.currentImageIndex].src;
            lightboxImage.alt = window.visibleImages[window.currentImageIndex].alt;
        }
    }
}

function previousImage() {
    if (typeof window !== 'undefined' && window.visibleImages && window.visibleImages.length > 0) {
        window.currentImageIndex = (window.currentImageIndex - 1 + window.visibleImages.length) % window.visibleImages.length;
        const lightboxImage = document.getElementById('lightbox-image');
        if (lightboxImage && window.visibleImages[window.currentImageIndex]) {
            lightboxImage.src = window.visibleImages[window.currentImageIndex].src;
            lightboxImage.alt = window.visibleImages[window.currentImageIndex].alt;
        }
    }
}

// Make functions globally available for fallback and onclick handlers
if (typeof window !== 'undefined') {
    window.loadPortfolioFilter = loadPortfolioFilter;
    window.initPortfolioFunctionality = initPortfolioFunctionality;
    window.openLightbox = openLightbox;
    window.closeLightbox = closeLightbox;
    window.nextImage = nextImage;
    window.previousImage = previousImage;
    window.updateVisibleImages = updateVisibleImages;
}