"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    acceptAllCookies?: () => void;
    acceptAllCookiesFromModal?: () => void;
    closeCookieSettings?: () => void;
    closeLightbox?: () => void;
    closePrivacyPopup?: () => void;
    nextImage?: () => void;
    openCookieSettings?: () => void;
    openLightbox?: (image: HTMLImageElement) => void;
    openPrivacyPopup?: () => void;
    previousImage?: () => void;
    resetCookieConsent?: () => void;
    saveCookieSettings?: () => void;
  }
}

type Cleanup = () => void;

const COOKIE_BANNER_HTML = `
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

const COOKIE_MODAL_HTML = `
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

type CookieConsent = {
  analytics: boolean;
  marketing: boolean;
  necessary: boolean;
  timestamp: string;
};

function getCookieConsent() {
  try {
    const consent = window.localStorage.getItem("woodfabrik_cookie_consent");
    return consent ? (JSON.parse(consent) as CookieConsent) : null;
  } catch {
    return null;
  }
}

function saveCookieConsent(consent: CookieConsent) {
  window.localStorage.setItem("woodfabrik_cookie_consent", JSON.stringify(consent));

  const expiry = new Date();
  expiry.setFullYear(expiry.getFullYear() + 1);
  document.cookie = `woodfabrik_cookies_accepted=true; expires=${expiry.toUTCString()}; path=/; SameSite=Lax`;
}

function hideCookieBanner() {
  const banner = document.getElementById("cookie-banner");
  if (!banner) {
    return;
  }

  banner.classList.remove("show");
  window.setTimeout(() => {
    (banner as HTMLElement).style.display = "none";
  }, 300);
}

function showCookieBanner() {
  const banner = document.getElementById("cookie-banner");
  if (!banner) {
    return;
  }

  (banner as HTMLElement).style.display = "";
  banner.classList.add("show");
}

function closeCookieSettings() {
  const modal = document.getElementById("cookie-modal-overlay");
  if (!modal) {
    return;
  }

  modal.classList.remove("show");
  document.body.style.overflow = "";
}

function loadConsentedCookies(consent: CookieConsent) {
  if (consent.analytics) {
    console.log("Loading analytics cookies...");
  }

  if (consent.marketing) {
    console.log("Loading marketing cookies...");
  }
}

function initCookieUi(): Cleanup {
  if (!document.getElementById("cookie-banner")) {
    document.body.insertAdjacentHTML("beforeend", COOKIE_BANNER_HTML);
  }

  if (!document.getElementById("cookie-modal-overlay")) {
    document.body.insertAdjacentHTML("beforeend", COOKIE_MODAL_HTML);
  }

  const openSettings = () => {
    const modal = document.getElementById("cookie-modal-overlay");
    if (!modal) {
      return;
    }

    const consent = getCookieConsent();
    const analyticsCheckbox = document.getElementById(
      "analytics-cookies",
    ) as HTMLInputElement | null;
    const marketingCheckbox = document.getElementById(
      "marketing-cookies",
    ) as HTMLInputElement | null;

    if (analyticsCheckbox) {
      analyticsCheckbox.checked = consent?.analytics ?? false;
    }

    if (marketingCheckbox) {
      marketingCheckbox.checked = consent?.marketing ?? false;
    }

    modal.classList.add("show");
    document.body.style.overflow = "hidden";
  };

  const acceptAll = () => {
    const consent: CookieConsent = {
      analytics: true,
      marketing: true,
      necessary: true,
      timestamp: new Date().toISOString(),
    };

    saveCookieConsent(consent);
    loadConsentedCookies(consent);
    hideCookieBanner();
  };

  const saveSettings = () => {
    const analyticsCheckbox = document.getElementById(
      "analytics-cookies",
    ) as HTMLInputElement | null;
    const marketingCheckbox = document.getElementById(
      "marketing-cookies",
    ) as HTMLInputElement | null;

    const consent: CookieConsent = {
      analytics: analyticsCheckbox?.checked ?? false,
      marketing: marketingCheckbox?.checked ?? false,
      necessary: true,
      timestamp: new Date().toISOString(),
    };

    saveCookieConsent(consent);
    loadConsentedCookies(consent);
    hideCookieBanner();
    closeCookieSettings();
  };

  window.openCookieSettings = openSettings;
  window.closeCookieSettings = closeCookieSettings;
  window.acceptAllCookies = acceptAll;
  window.acceptAllCookiesFromModal = () => {
    acceptAll();
    closeCookieSettings();
  };
  window.saveCookieSettings = saveSettings;
  window.resetCookieConsent = () => {
    window.localStorage.removeItem("woodfabrik_cookie_consent");
    document.cookie =
      "woodfabrik_cookies_accepted=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.reload();
  };

  const handleOutsideClick = (event: MouseEvent) => {
    const modal = document.getElementById("cookie-modal-overlay");
    if (event.target === modal) {
      closeCookieSettings();
    }
  };

  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      closeCookieSettings();
    }
  };

  document.addEventListener("click", handleOutsideClick);
  document.addEventListener("keydown", handleEscape);

  const consent = getCookieConsent();
  const bannerTimeout =
    consent === null
      ? window.setTimeout(() => {
          showCookieBanner();
        }, 1000)
      : undefined;

  if (consent) {
    loadConsentedCookies(consent);
  }

  return () => {
    document.removeEventListener("click", handleOutsideClick);
    document.removeEventListener("keydown", handleEscape);
    if (bannerTimeout) {
      window.clearTimeout(bannerTimeout);
    }
  };
}

function initPrivacyUi(): Cleanup {
  const openPrivacyPopup = () => {
    const popup = document.getElementById("privacy-popup");
    if (!popup) {
      return;
    }

    popup.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const closePrivacyPopup = () => {
    const popup = document.getElementById("privacy-popup");
    if (!popup) {
      return;
    }

    popup.classList.remove("active");
    document.body.style.overflow = "";
  };

  window.openPrivacyPopup = openPrivacyPopup;
  window.closePrivacyPopup = closePrivacyPopup;

  const handlePopupOutsideClick = (event: MouseEvent) => {
    const popup = document.getElementById("privacy-popup");
    if (popup && event.target === popup) {
      closePrivacyPopup();
    }
  };

  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      closePrivacyPopup();
    }
  };

  document.addEventListener("click", handlePopupOutsideClick);
  document.addEventListener("keydown", handleEscape);

  return () => {
    document.removeEventListener("click", handlePopupOutsideClick);
    document.removeEventListener("keydown", handleEscape);
  };
}

function initHeaderInteractions(): Cleanup {
  const closeMobileMenu = () => {
    const mobileSidebar = document.querySelector(".mobile-sidebar");
    const mobileOverlay = document.querySelector(".mobile-overlay");
    const hamburger = document.querySelector(".hamburger");
    const navbar = document.querySelector(".navbar-transparent");

    mobileSidebar?.classList.remove("active");
    mobileOverlay?.classList.remove("active");
    hamburger?.classList.remove("active");
    navbar?.classList.remove("mobile-menu-open");
    document.body.style.overflow = "";
  };

  const handleDocumentClick = (event: MouseEvent) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) {
      return;
    }

    const hamburger = target.closest(".hamburger");
    if (hamburger) {
      const mobileSidebar = document.querySelector(".mobile-sidebar");
      const mobileOverlay = document.querySelector(".mobile-overlay");
      const navbar = document.querySelector(".navbar-transparent");

      hamburger.classList.toggle("active");
      mobileSidebar?.classList.toggle("active");
      mobileOverlay?.classList.toggle("active");

      if (hamburger.classList.contains("active")) {
        navbar?.classList.add("mobile-menu-open");
        document.body.style.overflow = "hidden";
      } else {
        navbar?.classList.remove("mobile-menu-open");
        document.body.style.overflow = "";
      }
    }

    if (
      target.classList.contains("mobile-overlay") ||
      target.classList.contains("mobile-nav-link") ||
      target.classList.contains("mobile-close-btn")
    ) {
      closeMobileMenu();
    }

    const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement | null;
    if (!anchor) {
      return;
    }

    const href = anchor.getAttribute("href");
    if (!href || href === "#") {
      event.preventDefault();
      return;
    }

    const destination = document.querySelector(href);
    if (destination) {
      event.preventDefault();
      destination.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleResize = () => {
    if (window.innerWidth > 768) {
      closeMobileMenu();
    }
  };

  const handleScroll = () => {
    const scrollProgress = document.querySelector(
      ".scroll-progress-bar",
    ) as HTMLElement | null;
    const navbar = document.querySelector(".navbar-transparent");
    const documentHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    if (scrollProgress) {
      const scrollPercentage =
        documentHeight > 0 ? (window.scrollY / documentHeight) * 100 : 0;
      scrollProgress.style.height = `${scrollPercentage}%`;
    }

    if (window.scrollY > 24) {
      navbar?.classList.add("scrolled");
    } else {
      navbar?.classList.remove("scrolled");
    }
  };

  document.addEventListener("click", handleDocumentClick);
  window.addEventListener("resize", handleResize);
  window.addEventListener("scroll", handleScroll);
  handleScroll();

  return () => {
    document.removeEventListener("click", handleDocumentClick);
    window.removeEventListener("resize", handleResize);
    window.removeEventListener("scroll", handleScroll);
  };
}

function initScrollAnimations(): Cleanup {
  const animatedElements = document.querySelectorAll(
    ".service-item, .portfolio-item, .gallery-item, .stat-item, .testimonial-card, .value-card",
  );

  if (!animatedElements.length || typeof IntersectionObserver === "undefined") {
    return () => {};
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          element.style.opacity = "1";
          element.style.transform = "translateY(0)";
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    },
  );

  animatedElements.forEach((element) => {
    const htmlElement = element as HTMLElement;
    htmlElement.style.opacity = "0";
    htmlElement.style.transform = "translateY(20px)";
    htmlElement.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(htmlElement);
  });

  return () => observer.disconnect();
}

function initCounterAnimations(): Cleanup {
  if (typeof IntersectionObserver === "undefined") {
    return () => {};
  }

  const animateCounter = (element: Node | null, target: number, duration = 2000) => {
    if (!(element instanceof Text) && !(element instanceof HTMLElement)) {
      return;
    }

    let start = 0;
    const increment = target / (duration / 16);

    const updateCounter = () => {
      start += increment;
      const nextValue = start < target ? Math.floor(start) : target;

      if (element instanceof Text) {
        element.textContent = `${nextValue}`;
      } else {
        element.textContent = `${nextValue}`;
      }

      if (start < target) {
        window.requestAnimationFrame(updateCounter);
      }
    };

    updateCounter();
  };

  const heroStatsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const statNumbers = entry.target.querySelectorAll(".stat-number");
        statNumbers.forEach((stat) => {
          const numberNode = stat.childNodes[0] ?? stat;
          const target = Number.parseInt(stat.textContent ?? "", 10);
          if (!Number.isNaN(target)) {
            animateCounter(numberNode, target);
          }
        });

        heroStatsObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.5 },
  );

  const genericStatsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const statNumbers = entry.target.querySelectorAll(".stat-number");
        statNumbers.forEach((stat) => {
          const target = Number.parseInt(
            (stat.textContent ?? "").replace(/\+/g, ""),
            10,
          );

          if (!Number.isNaN(target)) {
            animateCounter(stat, target);
            window.setTimeout(() => {
              if (!stat.textContent?.includes("+")) {
                stat.textContent = `${stat.textContent ?? ""}+`;
              }
            }, 2000);
          }
        });

        genericStatsObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.5 },
  );

  const heroStats = document.querySelector(".hero-stats");
  const aboutStats = document.querySelector(".about-stats");
  const experienceStats = document.querySelector(".experience-stats");
  const statsSection = document.querySelector(".stats-section");

  if (heroStats) {
    heroStatsObserver.observe(heroStats);
  }

  [aboutStats, experienceStats, statsSection].forEach((element) => {
    if (element) {
      genericStatsObserver.observe(element);
    }
  });

  return () => {
    heroStatsObserver.disconnect();
    genericStatsObserver.disconnect();
  };
}

function initSectionTitleAnimations(): Cleanup {
  if (typeof IntersectionObserver === "undefined") {
    return () => {};
  }

  const titles = document.querySelectorAll(".section-title, .services-title, .about-title");
  if (!titles.length) {
    return () => {};
  }

  const animationObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
        }
      });
    },
    {
      threshold: 0.3,
      rootMargin: "0px 0px -100px 0px",
    },
  );

  const fillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fill-animate");
        }
      });
    },
    {
      threshold: 0.5,
    },
  );

  titles.forEach((title) => {
    animationObserver.observe(title);
    fillObserver.observe(title);
  });

  return () => {
    animationObserver.disconnect();
    fillObserver.disconnect();
  };
}

function initHeroSlider(): Cleanup {
  const heroImages = Array.from(document.querySelectorAll(".hero-bg-image"));
  if (!heroImages.length) {
    return () => {};
  }

  let currentImageIndex = 0;
  const intervalId = window.setInterval(() => {
    heroImages[currentImageIndex]?.classList.remove("active");
    currentImageIndex = (currentImageIndex + 1) % heroImages.length;
    heroImages[currentImageIndex]?.classList.add("active");
  }, 5000);

  return () => window.clearInterval(intervalId);
}

function initPortfolio(): Cleanup {
  const filterButtons = Array.from(document.querySelectorAll(".filter-btn"));
  const portfolioItems = Array.from(document.querySelectorAll(".portfolio-item"));

  if (!filterButtons.length || !portfolioItems.length) {
    return () => {};
  }

  const getVisibleImages = () =>
    portfolioItems
      .filter((item) => (item as HTMLElement).style.display !== "none")
      .map((item) => item.querySelector("img"))
      .filter((image): image is HTMLImageElement => image instanceof HTMLImageElement);

  let currentImageIndex = 0;

  const setActiveFilter = (filterValue: string) => {
    filterButtons.forEach((button) => {
      button.classList.toggle(
        "active",
        button.getAttribute("data-filter") === filterValue,
      );
    });

    portfolioItems.forEach((item) => {
      const htmlItem = item as HTMLElement;
      const category = item.getAttribute("data-category");
      const shouldShow = category === filterValue;
      htmlItem.style.display = shouldShow ? "block" : "none";
      item.classList.toggle("hidden", !shouldShow);
    });
  };

  const openLightbox = (image: HTMLImageElement) => {
    const visibleImages = getVisibleImages();
    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById(
      "lightbox-image",
    ) as HTMLImageElement | null;

    if (!lightbox || !lightboxImage) {
      return;
    }

    currentImageIndex = visibleImages.indexOf(image);
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    (lightbox as HTMLElement).style.display = "flex";
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    const lightbox = document.getElementById("lightbox");
    if (!lightbox) {
      return;
    }

    (lightbox as HTMLElement).style.display = "none";
    document.body.style.overflow = "";
  };

  const showRelativeImage = (direction: 1 | -1) => {
    const visibleImages = getVisibleImages();
    if (!visibleImages.length) {
      return;
    }

    currentImageIndex =
      (currentImageIndex + direction + visibleImages.length) % visibleImages.length;

    const lightboxImage = document.getElementById(
      "lightbox-image",
    ) as HTMLImageElement | null;
    const nextImage = visibleImages[currentImageIndex];

    if (lightboxImage && nextImage) {
      lightboxImage.src = nextImage.src;
      lightboxImage.alt = nextImage.alt;
    }
  };

  window.openLightbox = openLightbox;
  window.closeLightbox = closeLightbox;
  window.nextImage = () => showRelativeImage(1);
  window.previousImage = () => showRelativeImage(-1);

  const buttonListeners = filterButtons.map((button) => {
    const onClick = () => {
      const filterValue = button.getAttribute("data-filter");
      if (filterValue) {
        setActiveFilter(filterValue);
      }
    };

    button.addEventListener("click", onClick);
    return { button, onClick };
  });

  const initialFilter =
    filterButtons.find((button) => button.classList.contains("active"))?.getAttribute(
      "data-filter",
    ) ?? "kuchyne";
  setActiveFilter(initialFilter);

  const handleKeydown = (event: KeyboardEvent) => {
    const lightbox = document.getElementById("lightbox") as HTMLElement | null;
    const isLightboxOpen = lightbox?.style.display === "flex";

    if (event.key === "Escape" && isLightboxOpen) {
      closeLightbox();
    } else if (event.key === "ArrowRight" && isLightboxOpen) {
      showRelativeImage(1);
    } else if (event.key === "ArrowLeft" && isLightboxOpen) {
      showRelativeImage(-1);
    }
  };

  const handleLightboxClick = (event: MouseEvent) => {
    const lightbox = document.getElementById("lightbox");
    if (lightbox && event.target === lightbox) {
      closeLightbox();
    }
  };

  document.addEventListener("keydown", handleKeydown);
  document.getElementById("lightbox")?.addEventListener("click", handleLightboxClick);

  return () => {
    buttonListeners.forEach(({ button, onClick }) => {
      button.removeEventListener("click", onClick);
    });
    document.removeEventListener("keydown", handleKeydown);
    document
      .getElementById("lightbox")
      ?.removeEventListener("click", handleLightboxClick);
  };
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone: string) {
  return /^[+]?[0-9\s\-()]{9,}$/.test(phone);
}

function clearFieldError(field: HTMLInputElement | HTMLTextAreaElement) {
  field.classList.remove("error");
  const existingError = field.parentElement?.querySelector(".field-error");
  existingError?.remove();
}

function showFieldError(field: HTMLInputElement | HTMLTextAreaElement, message: string) {
  clearFieldError(field);
  field.classList.add("error");

  const error = document.createElement("div");
  error.className = "field-error";
  error.textContent = message;
  field.parentElement?.appendChild(error);
}

function showFormMessage(message: string, type: "success" | "error" | "info") {
  const messageContainer = document.getElementById("form-message");
  if (!messageContainer) {
    return;
  }

  messageContainer.className = `form-message form-message-${type}`;
  messageContainer.textContent = message;
  (messageContainer as HTMLElement).style.display = "block";

  window.setTimeout(() => {
    (messageContainer as HTMLElement).style.display = "none";
  }, 5000);
}

function validateContactForm(form: HTMLFormElement) {
  const requiredFields = Array.from(
    form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
      "input[name][required], textarea[name][required]",
    ),
  );

  let isValid = true;

  requiredFields.forEach((field) => {
    const value = field.value.trim();
    let errorMessage = "";

    if (!value) {
      errorMessage = "Toto pole je povinné.";
    } else if (field.name === "email" && !validateEmail(value)) {
      errorMessage = "Prosím, zadajte platný email.";
    } else if (field.name === "phone" && !validatePhone(value)) {
      errorMessage = "Prosím, zadajte platné telefónne číslo.";
    } else if (field.name === "name" && value.length < 2) {
      errorMessage = "Meno musí mať aspoň 2 znaky.";
    }

    if (errorMessage) {
      showFieldError(field, errorMessage);
      isValid = false;
    } else {
      clearFieldError(field);
    }
  });

  return isValid;
}

function initContactForm(): Cleanup {
  const contactForm = document.getElementById("contact-form") as HTMLFormElement | null;
  if (!contactForm) {
    return () => {};
  }

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();

    const privacyCheckbox = document.getElementById(
      "privacy-checkbox",
    ) as HTMLInputElement | null;

    if (privacyCheckbox && !privacyCheckbox.checked) {
      showFormMessage(
        "Musíte súhlasiť s podmienkami ochrany osobných údajov pred odoslaním formulára.",
        "error",
      );
      return;
    }

    if (!validateContactForm(contactForm)) {
      return;
    }

    const submitButton = contactForm.querySelector(
      ".form-submit-btn",
    ) as HTMLButtonElement | null;
    const originalText = submitButton?.textContent ?? "";

    if (submitButton) {
      submitButton.textContent = "Odosiela sa...";
      submitButton.disabled = true;
    }

    const formData = new FormData(contactForm);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message || `Contact function failed with status ${response.status}`,
        );
      }

      showFormMessage(
        data?.message || "Správa bola úspešne odoslaná. Ďakujeme za kontakt!",
        "success",
      );
      contactForm.reset();
    } catch (error) {
      console.error("Form submission error:", error);
      showFormMessage(
        error instanceof Error
          ? error.message
          : "Nepodarilo sa odoslať správu. Skúste to prosím neskôr.",
        "error",
      );
    } finally {
      if (submitButton) {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      }
    }
  };

  contactForm.addEventListener("submit", handleSubmit);

  return () => {
    contactForm.removeEventListener("submit", handleSubmit);
  };
}

export function LegacyRuntime() {
  const pathname = usePathname();

  useEffect(() => {
    const cleanups = [initHeaderInteractions(), initCookieUi(), initPrivacyUi()];
    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  useEffect(() => {
    const cleanups = [
      initScrollAnimations(),
      initCounterAnimations(),
      initSectionTitleAnimations(),
      initHeroSlider(),
      initPortfolio(),
      initContactForm(),
    ];

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [pathname]);

  return null;
}
