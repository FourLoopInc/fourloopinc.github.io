/**
 * FourLoop Inc - Interactive JavaScript
 * Handles navigation, animations, and form functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initMobileMenu();
    initSmoothScrolling();
    initActiveNavigation();
    initContactForm();
    initScrollAnimations();
});

/**
 * Mobile Menu Toggle Functionality
 */
function initMobileMenu() {
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (!mobileMenuButton || !mobileMenu) return;
    
    // Toggle mobile menu
    mobileMenuButton.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
        
        // Update button icon
        const icon = mobileMenuButton.querySelector('i');
        if (mobileMenu.classList.contains('hidden')) {
            icon.className = 'fas fa-bars';
        } else {
            icon.className = 'fas fa-times';
        }
    });

    // Close mobile menu when clicking on a link
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.add('hidden');
            const icon = mobileMenuButton.querySelector('i');
            icon.className = 'fas fa-bars';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!mobileMenuButton.contains(event.target) && !mobileMenu.contains(event.target)) {
            mobileMenu.classList.add('hidden');
            const icon = mobileMenuButton.querySelector('i');
            icon.className = 'fas fa-bars';
        }
    });
}

/**
 * Smooth Scrolling for Navigation Links
 */
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            // Handle empty hash or just '#'
            if (targetId === '#' || targetId === '') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navbarHeight = document.querySelector('nav').offsetHeight;
                const offsetTop = targetElement.offsetTop - navbarHeight - 20;
                
                // Ensure all elements in the target section are visible
                const sectionElements = targetElement.querySelectorAll('.animate-on-scroll');
                sectionElements.forEach(el => {
                    if (!el.classList.contains('animated')) {
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                        el.classList.add('animated');
                    }
                });
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Active Navigation Highlighting
 */
function initActiveNavigation() {
    window.addEventListener('scroll', throttle(updateActiveNavigation, 100));
}

function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 150;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            // Remove active class from all nav links
            document.querySelectorAll('nav a[href^="#"]').forEach(link => {
                link.classList.remove('text-fourloop-blue', 'nav-link-active');
                link.classList.add('text-fourloop-dark');
            });
            
            // Add active class to current nav link
            const activeLinks = document.querySelectorAll(`nav a[href="#${sectionId}"]`);
            activeLinks.forEach(activeLink => {
                activeLink.classList.remove('text-fourloop-dark');
                activeLink.classList.add('text-fourloop-blue', 'nav-link-active');
            });
        }
    });
}

/**
 * Contact Form Functionality
 */
function initContactForm() {
    const contactForm = document.querySelector('form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', handleFormSubmission);
    
    // Add real-time validation
    const requiredFields = ['firstName', 'lastName', 'email', 'message'];
    requiredFields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            field.addEventListener('blur', () => validateField(field));
            field.addEventListener('input', () => clearFieldError(field));
        }
    });
}

function handleFormSubmission(e) {
    e.preventDefault();
    
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    
    // Show loading state
    submitButton.innerHTML = '<span class="loading-spinner"></span> Sending...';
    submitButton.disabled = true;
    
    // Validate form
    const requiredFields = ['firstName', 'lastName', 'email', 'message'];
    let isValid = true;
    let firstInvalidField = null;
    
    requiredFields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (!validateField(field) && !firstInvalidField) {
            firstInvalidField = field;
        }
        if (!field.value.trim()) {
            isValid = false;
        }
    });
    
    // Validate email format
    const emailField = document.getElementById('email');
    if (emailField && !isValidEmail(emailField.value)) {
        showFieldError(emailField, 'Please enter a valid email address');
        isValid = false;
        if (!firstInvalidField) firstInvalidField = emailField;
    }
    
    setTimeout(() => {
        if (isValid) {
            showSuccessMessage();
            e.target.reset();
            clearAllFieldErrors();
        } else {
            showErrorMessage('Please fill in all required fields correctly.');
            if (firstInvalidField) {
                firstInvalidField.focus();
            }
        }
        
        // Reset button state
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
    }, 1000); // Simulate processing time
}

function validateField(field) {
    if (!field) return true;
    
    const value = field.value.trim();
    
    if (field.hasAttribute('required') || ['firstName', 'lastName', 'email', 'message'].includes(field.id)) {
        if (!value) {
            showFieldError(field, 'This field is required');
            return false;
        }
    }
    
    if (field.type === 'email' && value && !isValidEmail(value)) {
        showFieldError(field, 'Please enter a valid email address');
        return false;
    }
    
    showFieldSuccess(field);
    return true;
}

function showFieldError(field, message) {
    field.classList.remove('border-green-500');
    field.classList.add('border-red-500');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message text-red-500 text-sm mt-1';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

function showFieldSuccess(field) {
    field.classList.remove('border-red-500');
    field.classList.add('border-green-500');
    clearFieldError(field);
}

function clearFieldError(field) {
    field.classList.remove('border-red-500');
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function clearAllFieldErrors() {
    const fields = ['firstName', 'lastName', 'email', 'message', 'company', 'service'];
    fields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            field.classList.remove('border-green-500', 'border-red-500');
            clearFieldError(field);
        }
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showSuccessMessage() {
    showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
}

function showErrorMessage(message) {
    showNotification(message, 'error');
}

function showNotification(message, type) {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
        type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`;
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2"></i>
            <span>${message}</span>
            <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

/**
 * Scroll Animations
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Only animate if not already animated
                if (!entry.target.classList.contains('animated')) {
                    entry.target.classList.add('animate-fade-in-up', 'animated');
                    entry.target.style.opacity = '1';
                    
                    // Add staggered animation for multiple elements
                    const siblings = Array.from(entry.target.parentNode.children);
                    const index = siblings.indexOf(entry.target);
                    entry.target.style.animationDelay = `${index * 0.1}s`;
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation, but don't hide them initially
    const animateElements = document.querySelectorAll(
        '.service-card, .team-card, .bg-white.rounded-xl'
    );
    
    animateElements.forEach((el, index) => {
        // Add classes for animation preparation
        el.classList.add('animate-on-scroll');
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        // Delay initial animation slightly
        setTimeout(() => {
            observer.observe(el);
        }, 100);
    });

    // For elements that should be visible immediately (like hero content)
    const immediateElements = document.querySelectorAll('#home .animate-fade-in, #home .animate-fade-in-delay');
    immediateElements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
    });
}

/**
 * Utility Functions
 */
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Additional Interactive Features
 */

// Navbar background change on scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('nav');
    if (window.scrollY > 50) {
        navbar.classList.add('bg-white', 'shadow-lg');
        navbar.classList.remove('bg-transparent');
    } else {
        navbar.classList.remove('bg-white', 'shadow-lg');
        navbar.classList.add('bg-transparent');
    }
});

// Back to top button
function createBackToTopButton() {
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTop.className = 'fixed bottom-8 right-8 w-12 h-12 bg-fourloop-blue text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 z-50 opacity-0 pointer-events-none';
    backToTop.setAttribute('aria-label', 'Back to top');
    
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    document.body.appendChild(backToTop);
    
    // Show/hide based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTop.classList.remove('opacity-0', 'pointer-events-none');
        } else {
            backToTop.classList.add('opacity-0', 'pointer-events-none');
        }
    });
}

// Initialize back to top button
createBackToTopButton();