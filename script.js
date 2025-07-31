// ================================
// CLEAN FEME JAVASCRIPT - NO 404 ERRORS
// ================================

(function() {
    'use strict';
    
    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🚀 Initializing Feme website...');
        
        // Clean up any problematic content first
        cleanupContent();
        
        // Initialize core features
        initializeNavigation();
        initializeMobileMenu();
        initializeContactForm();
        initializeAnimations();
        initializeCounters();
        hideLoadingScreen();
        initializeBackToTop();
        
        // Initialize AOS if available
        setTimeout(initializeAOS, 100);
        
        console.log('✅ Feme website ready!');
    });
    
    // ================================
    // CLEANUP PROBLEMATIC CONTENT
    // ================================
    
    function cleanupContent() {
        // Remove any text nodes that contain CSS-like content
        const textNodes = [];
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        let node;
        while (node = walker.nextNode()) {
            if (node.textContent.includes('style=') || 
                node.textContent.includes('opacity:1;transform:') ||
                node.textContent.includes('transition:0.6s')) {
                textNodes.push(node);
            }
        }
        
        // Remove problematic text nodes
        textNodes.forEach(node => {
            if (node.parentNode) {
                node.parentNode.removeChild(node);
            }
        });
        
        // Remove any elements with problematic inline styles
        document.querySelectorAll('[style*="opacity:1;transform:translateY"]').forEach(el => {
            el.removeAttribute('style');
        });
        
        console.log('🧹 Content cleanup complete');
    }
    
    // ================================
    // AOS INITIALIZATION
    // ================================
    
    function initializeAOS() {
        if (typeof AOS !== 'undefined') {
            try {
                AOS.init({
                    duration: 800,
                    delay: 100,
                    once: true,
                    offset: 50,
                    disable: function() {
                        return window.innerWidth < 768;
                    }
                });
                
                // Refresh AOS
                AOS.refresh();
                console.log('✨ AOS animations initialized');
            } catch (error) {
                console.warn('⚠️ AOS failed, using fallback animations');
                initializeFallbackAnimations();
            }
        } else {
            console.warn('⚠️ AOS not found, using fallback animations');
            initializeFallbackAnimations();
        }
    }
    
    function initializeFallbackAnimations() {
        const elements = document.querySelectorAll('[data-aos]');
        
        if (elements.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.style.transition = 'all 0.6s ease';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'all 0.6s ease';
            observer.observe(element);
        });
    }
    // Add this JavaScript to ensure page starts from top after loading
document.addEventListener('DOMContentLoaded', function() {
    // Scroll to top immediately
    window.scrollTo(0, 0);
    
    // Ensure we start from top when page loads
    if (history.scrollRestoration) {
        history.scrollRestoration = 'manual';
    }
});

// Enhanced loading screen control
window.addEventListener('load', function() {
    // Scroll to top again after everything loads
    window.scrollTo(0, 0);
    
    // Hide loading screen after a short delay
    setTimeout(function() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.classList.add('hidden');
            // Remove loading screen from DOM after animation
            setTimeout(function() {
                loading.style.display = 'none';
            }, 800);
        }
    }, 1000); // Adjust delay as needed
});

// Prevent scroll restoration
window.addEventListener('beforeunload', function() {
    window.scrollTo(0, 0);
});
    // ================================
    // NAVIGATION
    // ================================
    
    function initializeNavigation() {
        const navbar = document.getElementById('navbar');
        const navLinks = document.querySelectorAll('.nav-menu a');
        const logo = document.querySelector('.logo-container');
        
        if (!navbar) return;
        
        // Throttle function for scroll events
        let scrollTimeout;
        
        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            
            scrollTimeout = setTimeout(() => {
                const scrolled = window.scrollY > 50;
                navbar.classList.toggle('scrolled', scrolled);
            }, 10);
        });
        
        // Active link highlighting
        let activeTimeout;
        window.addEventListener('scroll', () => {
            if (activeTimeout) {
                clearTimeout(activeTimeout);
            }
            
            activeTimeout = setTimeout(() => {
                updateActiveLink();
            }, 50);
        });
        
        function updateActiveLink() {
            let current = '';
            const sections = document.querySelectorAll('section[id]');
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 200;
                if (window.scrollY >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }
        
        // Smooth scroll navigation
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Logo click
        if (logo) {
            logo.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
        
        console.log('🧭 Navigation initialized');
    }
    
    // ================================
    // MOBILE MENU
    // ================================
    
    function initializeMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu');
        const navContainer = document.querySelector('.nav-container');
        
        if (!mobileMenuBtn || !navContainer) return;
        
        let mobileMenu = null;
        let isOpen = false;
        
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        
        function toggleMobileMenu() {
            isOpen = !isOpen;
            
            if (isOpen) {
                createMobileMenu();
                showMobileMenu();
            } else {
                hideMobileMenu();
            }
            
            animateHamburger(isOpen);
        }
        
        function createMobileMenu() {
            if (mobileMenu) return;
            
            mobileMenu = document.createElement('div');
            mobileMenu.className = 'mobile-nav-menu';
            mobileMenu.style.cssText = `
                position: absolute;
                top: 100%;
                left: 0;
                width: 100%;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(20px);
                padding: 2rem;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                border-radius: 0 0 20px 20px;
                z-index: 1000;
                display: none;
                flex-direction: column;
                animation: slideDown 0.3s ease;
            `;
            
            const navLinks = document.querySelectorAll('.nav-menu a');
            navLinks.forEach((link, index) => {
                const mobileLink = document.createElement('a');
                mobileLink.href = link.getAttribute('href');
                mobileLink.textContent = link.textContent;
                mobileLink.style.cssText = `
                    padding: 1rem 0;
                    text-decoration: none;
                    color: #1F2937;
                    border-bottom: 1px solid #E5E7EB;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    opacity: 0;
                    animation: fadeInUp 0.3s ease ${index * 0.1}s forwards;
                `;
                
                mobileLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    toggleMobileMenu();
                    
                    setTimeout(() => {
                        const targetElement = document.querySelector(link.getAttribute('href'));
                        if (targetElement) {
                            const offsetTop = targetElement.offsetTop - 80;
                            window.scrollTo({
                                top: offsetTop,
                                behavior: 'smooth'
                            });
                        }
                    }, 300);
                });
                
                mobileMenu.appendChild(mobileLink);
            });
            
            navContainer.appendChild(mobileMenu);
            
            // Add CSS animations
            if (!document.getElementById('mobile-menu-styles')) {
                const style = document.createElement('style');
                style.id = 'mobile-menu-styles';
                style.textContent = `
                    @keyframes slideDown {
                        from { opacity: 0; transform: translateY(-10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes fadeInUp {
                        from { opacity: 0; transform: translateY(10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `;
                document.head.appendChild(style);
            }
        }
        
        function showMobileMenu() {
            if (mobileMenu) {
                mobileMenu.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        }
        
        function hideMobileMenu() {
            if (mobileMenu) {
                mobileMenu.style.display = 'none';
                document.body.style.overflow = '';
            }
        }
        
        function animateHamburger(isActive) {
            const lines = mobileMenuBtn.querySelectorAll('.hamburger');
            if (lines.length < 3) return;
            
            if (isActive) {
                lines[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                lines[1].style.opacity = '0';
                lines[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                lines[0].style.transform = 'none';
                lines[1].style.opacity = '1';
                lines[2].style.transform = 'none';
            }
        }
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (isOpen && !navContainer.contains(e.target)) {
                toggleMobileMenu();
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOpen) {
                toggleMobileMenu();
            }
        });
        
        console.log('📱 Mobile menu initialized');
    }
    
    // ================================
    // CONTACT FORM
    // ================================
    
    function initializeContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;
        
        form.addEventListener('submit', handleFormSubmit);
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearFieldError(input));
        });
        
        function handleFormSubmit(e) {
            e.preventDefault();
            
            const submitBtn = form.querySelector('.submit-btn');
            
            // Validate form
            if (!validateForm()) {
                showMessage('Please fill in all required fields correctly.', 'error');
                return;
            }
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            
            // Simulate form submission
            setTimeout(() => {
                showMessage('Thank you! Your message has been sent successfully.', 'success');
                form.reset();
                
                // Reset button
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            }, 2000);
        }
        
        function validateForm() {
            const requiredFields = form.querySelectorAll('[required]');
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
            const fieldType = field.type;
            let isValid = true;
            let errorMessage = '';
            
            if (field.hasAttribute('required') && !value) {
                isValid = false;
                errorMessage = 'This field is required.';
            } else if (fieldType === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address.';
                }
            }
            
            if (!isValid) {
                showFieldError(field, errorMessage);
            } else {
                clearFieldError(field);
            }
            
            return isValid;
        }
        
        function showFieldError(field, message) {
            clearFieldError(field);
            
            field.style.borderColor = '#ef4444';
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.textContent = message;
            errorDiv.style.cssText = `
                color: #ef4444;
                font-size: 0.875rem;
                margin-top: 0.25rem;
            `;
            
            field.parentNode.appendChild(errorDiv);
        }
        
        function clearFieldError(field) {
            field.style.borderColor = '';
            
            const errorDiv = field.parentNode.querySelector('.field-error');
            if (errorDiv) {
                errorDiv.remove();
            }
        }
        
        function showMessage(text, type) {
            const existingMessage = form.querySelector('.form-message');
            if (existingMessage) {
                existingMessage.remove();
            }
            
            const messageDiv = document.createElement('div');
            messageDiv.className = 'form-message';
            messageDiv.textContent = text;
            messageDiv.style.cssText = `
                padding: 1rem;
                margin-top: 1rem;
                border-radius: 8px;
                text-align: center;
                font-weight: 500;
                ${type === 'success' ? 
                    'background: #dcfce7; color: #16a34a; border: 1px solid #bbf7d0;' : 
                    'background: #fef2f2; color: #dc2626; border: 1px solid #fecaca;'
                }
            `;
            
            form.appendChild(messageDiv);
            
            setTimeout(() => {
                messageDiv.remove();
            }, 5000);
        }
        
        console.log('📝 Contact form initialized');
    }
    
    // ================================
    // ANIMATIONS
    // ================================
    
    function initializeAnimations() {
        // Simple fade-in animation for elements
        const animatedElements = document.querySelectorAll('.service-card, .mission-item, .contact-item, .stat-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'all 0.6s ease';
            observer.observe(element);
        });
        
        console.log('✨ Basic animations initialized');
    }
    
    // ================================
    // COUNTERS
    // ================================
    
    function initializeCounters() {
        const counters = document.querySelectorAll('.stat-content h4');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => {
            if (counter.textContent.match(/\d/)) {
                counterObserver.observe(counter);
            }
        });
        
        function animateCounter(element) {
            const text = element.textContent;
            const hasK = text.includes('K');
            const hasPlus = text.includes('+');
            const isDecimal = text.includes('.');
            
            let target;
            if (isDecimal) {
                target = parseFloat(text);
            } else {
                target = parseInt(text.replace(/[^\d]/g, ''));
            }
            
            if (hasK) target *= 1000;
            
            const duration = 2000;
            const steps = 60;
            const stepValue = target / steps;
            let current = 0;
            let step = 0;
            
            const timer = setInterval(() => {
                step++;
                current = Math.min(stepValue * step, target);
                
                let displayValue;
                if (isDecimal) {
                    displayValue = current.toFixed(1);
                } else if (hasK) {
                    displayValue = Math.floor(current / 1000) + 'K';
                } else {
                    displayValue = Math.floor(current);
                }
                
                if (hasPlus && current >= target) {
                    displayValue += '+';
                }
                
                element.textContent = displayValue;
                
                if (current >= target) {
                    clearInterval(timer);
                }
            }, duration / steps);
        }
        
        console.log('🔢 Counter animations initialized');
    }
    
    // ================================
    // LOADING SCREEN
    // ================================
    
    function hideLoadingScreen() {
        const loading = document.getElementById('loading');
        if (!loading) return;
        
        setTimeout(() => {
            loading.style.opacity = '0';
            loading.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                loading.style.display = 'none';
                
                // Trigger AOS refresh if available
                if (typeof AOS !== 'undefined') {
                    AOS.refresh();
                }
            }, 500);
        }, 1500);
        
        console.log('🎬 Loading screen hidden');
    }
    
    // ================================
    // BACK TO TOP BUTTON
    // ================================
    
    function initializeBackToTop() {
        const backToTop = document.createElement('button');
        backToTop.innerHTML = '↑';
        backToTop.setAttribute('aria-label', 'Back to top');
        backToTop.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #6B46C1 0%, #EC4899 100%);
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 1.5rem;
            font-weight: bold;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(107, 70, 193, 0.3);
        `;
        
        document.body.appendChild(backToTop);
        
        // Show/hide based on scroll
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            
            scrollTimeout = setTimeout(() => {
                const show = window.scrollY > 500;
                backToTop.style.opacity = show ? '1' : '0';
                backToTop.style.visibility = show ? 'visible' : 'hidden';
            }, 10);
        });
        
        // Click handler
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Hover effect
        backToTop.addEventListener('mouseenter', () => {
            backToTop.style.transform = 'scale(1.1)';
        });
        
        backToTop.addEventListener('mouseleave', () => {
            backToTop.style.transform = 'scale(1)';
        });
        
        console.log('⬆️ Back to top button initialized');
    }
    
    // ================================
    // ERROR HANDLING
    // ================================
    
    window.addEventListener('error', (e) => {
        console.warn('⚠️ Error handled:', e.message);
    });
    
    window.addEventListener('unhandledrejection', (e) => {
        console.warn('⚠️ Promise rejection handled:', e.reason);
        e.preventDefault();
    });
    
})();