// Forms Component - Contact forms and validation

export function initForms() {
    initContactForm();
    initNewsletterForm();
    initFormValidation();
}

function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams.get('sent') === '1') {
            showFormMessage('Správa bola úspešne odoslaná. Ďakujeme za kontakt!', 'success');
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const privacyCheckbox = document.getElementById('privacy-checkbox');
            
            if (privacyCheckbox && !privacyCheckbox.checked) {
                showFormMessage('Musíte súhlasiť s podmienkami ochrany osobných údajov pred odoslaním formulára.', 'error');
                return false;
            }
            
            // Validate form before submission
            if (!validateContactForm()) {
                return false;
            }
            
            // Show loading state
            const submitBtn = contactForm.querySelector('.form-submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Odosiela sa...';
            submitBtn.disabled = true;
            
            // Prepare form data
            const formData = new FormData(contactForm);
            const formName = contactForm.getAttribute('name');
            formData.set('form-name', formName);
            
            // Submit form to Netlify Forms while keeping the current page UX.
            fetch('/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams(formData).toString()
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Netlify Forms request failed with status ${response.status}`);
                }

                showFormMessage('Správa bola úspešne odoslaná. Ďakujeme za kontakt!', 'success');
                contactForm.reset();
            })
            .catch(error => {
                console.error('Form submission error:', error);
                showFormMessage('Nepodarilo sa odoslať správu. Skúste to prosím neskôr.', 'error');
            })
            .finally(() => {
                // Reset button state
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
        });
    }
}

function initNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (validateEmail(email)) {
                showFormMessage('Ďakujeme za prihlásenie k odberu!', 'success');
                this.reset();
            } else {
                showFormMessage('Prosím, zadajte platný email.', 'error');
            }
        });
    }
}

function initFormValidation() {
    // Real-time validation for form inputs
    const formInputs = document.querySelectorAll('.form-input, .form-textarea');
    
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

function validateContactForm() {
    const requiredFields = document.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type || field.tagName.toLowerCase();
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.required && !value) {
        isValid = false;
        errorMessage = 'Toto pole je povinné.';
    }
    
    // Email validation
    if (fieldType === 'email' && value && !validateEmail(value)) {
        isValid = false;
        errorMessage = 'Prosím, zadajte platný email.';
    }
    
    // Phone validation
    if (field.name === 'phone' && value && !validatePhone(value)) {
        isValid = false;
        errorMessage = 'Prosím, zadajte platné telefónne číslo.';
    }
    
    // Name validation
    if (field.name === 'name' && value && value.length < 2) {
        isValid = false;
        errorMessage = 'Meno musí mať aspoň 2 znaky.';
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{9,}$/;
    return phoneRegex.test(phone);
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function showFormMessage(message, type = 'info') {
    // Find the form message container
    const messageContainer = document.getElementById('form-message');
    if (messageContainer) {
        messageContainer.className = `form-message form-message-${type}`;
        messageContainer.textContent = message;
        messageContainer.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            messageContainer.style.display = 'none';
        }, 5000);
    } else {
        // Fallback: create message element
        const existingMessages = document.querySelectorAll('.form-message');
        existingMessages.forEach(msg => msg.remove());
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message form-message-${type}`;
        messageDiv.textContent = message;
        
        const form = document.querySelector('#contact-form');
        if (form) {
            form.appendChild(messageDiv);
            
            setTimeout(() => {
                messageDiv.remove();
            }, 5000);
        }
    }
}

// Export validation functions for external use
export { validateEmail, validatePhone, validateField };
