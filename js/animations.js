// Animations Component - Scroll animations and counter effects

export function initAnimations() {
    initScrollAnimations();
    initCounterAnimations();
    initSectionTitleAnimations();
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.service-item, .portfolio-item, .gallery-item, .stat-item, .testimonial-card, .value-card'
    );
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

function initCounterAnimations() {
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }
        
        updateCounter();
    }

    // Hero stats observer
    const heroStatsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const numberElement = stat.childNodes[0] || stat;
                    const target = parseInt(numberElement.textContent);
                    if (!isNaN(target)) {
                        animateCounter(numberElement, target);
                    }
                });
                heroStatsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    // About stats observer
    const aboutStatsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.textContent.replace('+', ''));
                    if (!isNaN(target)) {
                        animateCounter(stat, target);
                        // Add back the + sign after animation
                        setTimeout(() => {
                            if (!stat.textContent.includes('+')) {
                                stat.textContent = stat.textContent + '+';
                            }
                        }, 2000);
                    }
                });
                aboutStatsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    // Observe stats sections
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        heroStatsObserver.observe(heroStats);
    }

    const aboutStats = document.querySelector('.about-stats');
    if (aboutStats) {
        aboutStatsObserver.observe(aboutStats);
    }

    const experienceStats = document.querySelector('.experience-stats');
    if (experienceStats) {
        aboutStatsObserver.observe(experienceStats);
    }

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        aboutStatsObserver.observe(statsSection);
    }
}

function initSectionTitleAnimations() {
    const sectionTitleObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { 
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    });

    const sectionTitleFillObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fill-animate');
            }
        });
    }, { 
        threshold: 0.5,
        rootMargin: '0px 0px 0px 0px'
    });

    // Observe section titles
    const titles = document.querySelectorAll('.section-title, .services-title, .about-title');
    titles.forEach(title => {
        sectionTitleObserver.observe(title);
        sectionTitleFillObserver.observe(title);
    });
}

// Utility function for manual counter animation
export function animateCounterManual(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }
    
    updateCounter();
}