class PresentationController {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 12;
        this.isAnimating = false;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updateProgress();
        this.updateSlideCounter();
        this.preloadImages();
        
        // Set initial state
        this.showSlide(1);
        
        // Add keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        
        // Prevent default touch behaviors for smooth mobile experience
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });
        
        // Add touch/swipe support
        this.addTouchSupport();
        
        console.log('Presentation initialized');
    }
    
    bindEvents() {
        // Navigation buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousSlide());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        // Dot navigation
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index + 1));
        });
        
        // Prevent context menu on right click for better UX
        document.addEventListener('contextmenu', (e) => e.preventDefault());
    }
    
    addTouchSupport() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        
        const presentationContainer = document.querySelector('.presentation-container');
        
        presentationContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });
        
        presentationContainer.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            
            // Only process horizontal swipes that are longer than vertical ones
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    this.previousSlide();
                } else {
                    this.nextSlide();
                }
            }
        }, { passive: true });
    }
    
    handleKeyDown(e) {
        if (this.isAnimating) return;
        
        switch(e.key) {
            case 'ArrowLeft':
            case 'ArrowUp':
            case 'PageUp':
                e.preventDefault();
                this.previousSlide();
                break;
            case 'ArrowRight':
            case 'ArrowDown':
            case 'PageDown':
            case ' ':
                e.preventDefault();
                this.nextSlide();
                break;
            case 'Home':
                e.preventDefault();
                this.goToSlide(1);
                break;
            case 'End':
                e.preventDefault();
                this.goToSlide(this.totalSlides);
                break;
            case 'Escape':
                e.preventDefault();
                this.exitFullscreen();
                break;
            case 'f':
            case 'F':
                e.preventDefault();
                this.toggleFullscreen();
                break;
        }
    }
    
    nextSlide() {
        if (this.currentSlide < this.totalSlides && !this.isAnimating) {
            this.goToSlide(this.currentSlide + 1);
        }
    }
    
    previousSlide() {
        if (this.currentSlide > 1 && !this.isAnimating) {
            this.goToSlide(this.currentSlide - 1);
        }
    }
    
    goToSlide(slideNumber) {
        if (slideNumber === this.currentSlide || this.isAnimating) return;
        if (slideNumber < 1 || slideNumber > this.totalSlides) return;
        
        this.isAnimating = true;
        
        // Hide current slide
        const currentSlideElement = document.querySelector('.slide.active');
        if (currentSlideElement) {
            currentSlideElement.classList.remove('active');
        }
        
        // Update current slide number
        this.currentSlide = slideNumber;
        
        // Show new slide with delay for smooth transition
        setTimeout(() => {
            this.showSlide(slideNumber);
            this.updateProgress();
            this.updateSlideCounter();
            this.updateDots();
            
            // Re-enable navigation after animation
            setTimeout(() => {
                this.isAnimating = false;
            }, 300);
        }, 100);
    }
    
    showSlide(slideNumber) {
        const slide = document.querySelector(`[data-slide="${slideNumber}"]`);
        if (slide) {
            slide.classList.add('active');
            
            // Trigger animations for slide content
            this.animateSlideContent(slide);
        }
    }
    
    animateSlideContent(slide) {
        const elements = slide.querySelectorAll('.slide-content > *');
        
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    updateProgress() {
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            const progress = (this.currentSlide / this.totalSlides) * 100;
            progressBar.style.width = `${progress}%`;
        }
    }
    
    updateSlideCounter() {
        const currentSlideElement = document.getElementById('currentSlide');
        const totalSlidesElement = document.getElementById('totalSlides');
        
        if (currentSlideElement) {
            currentSlideElement.textContent = this.currentSlide;
        }
        
        if (totalSlidesElement) {
            totalSlidesElement.textContent = this.totalSlides;
        }
    }
    
    updateDots() {
        const dots = document.querySelectorAll('.dot');
        
        dots.forEach((dot, index) => {
            dot.classList.remove('active');
            if (index + 1 === this.currentSlide) {
                dot.classList.add('active');
            }
        });
    }
    
    preloadImages() {
        const images = [
            'https://pplx-res.cloudinary.com/image/upload/v1748651263/pplx_project_search_images/7beb7b4b9d7a563d1e4641fbe7bafc927fbea591.jpg',
            'https://pplx-res.cloudinary.com/image/upload/v1748724275/pplx_code_interpreter/c786309b_aug1g9.jpg',
            'https://pplx-res.cloudinary.com/image/upload/v1748720560/pplx_project_search_images/8391fa42949899abda143138dd4352b3e80791b4.jpg',
            'https://pplx-res.cloudinary.com/image/upload/v1748651264/pplx_project_search_images/7855fb76bb3a627217113bbf117653de35daf7f3.jpg'
        ];
        
        images.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Error attempting to enable fullscreen:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }
    
    exitFullscreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    }
}

// Additional utility functions for enhanced interactivity
class PresentationEffects {
    static addHoverEffects() {
        // Add dynamic hover effects to cards
        const cards = document.querySelectorAll('.problem-card, .feature-card, .revenue-item, .achievement');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.02)';
                this.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
    
    static addParallaxEffect() {
        // Subtle parallax effect for background elements
        document.addEventListener('mousemove', (e) => {
            const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
            const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
            
            const techIcons = document.querySelector('.tech-icons');
            if (techIcons) {
                techIcons.style.transform = `translate(${moveX}px, ${moveY}px)`;
            }
        });
    }
    
    static addScrollAnimations() {
        // Add animations for elements that come into view
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Observe all animated elements
        const animatedElements = document.querySelectorAll('.problem-card, .feature-card, .stat-card');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            observer.observe(el);
        });
    }
    
    static addInteractiveElements() {
        // Add click effects for interactive elements
        const interactiveElements = document.querySelectorAll('.nav-btn, .dot, .tech-item');
        
        interactiveElements.forEach(element => {
            element.addEventListener('click', function() {
                // Create ripple effect
                const ripple = document.createElement('span');
                ripple.style.position = 'absolute';
                ripple.style.borderRadius = '50%';
                ripple.style.background = 'rgba(0, 245, 255, 0.6)';
                ripple.style.transform = 'scale(0)';
                ripple.style.animation = 'ripple 0.6s linear';
                ripple.style.pointerEvents = 'none';
                
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = (rect.width / 2 - size / 2) + 'px';
                ripple.style.top = (rect.height / 2 - size / 2) + 'px';
                
                this.style.position = 'relative';
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }
    
    static addProgressiveLoading() {
        // Progressive loading for better performance
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.5s ease';
            
            img.onload = function() {
                this.style.opacity = '1';
            };
            
            // Add loading placeholder
            if (!img.complete) {
                img.style.background = 'linear-gradient(90deg, #1a1f2e 25%, #2a2f3e 50%, #1a1f2e 75%)';
                img.style.backgroundSize = '200% 100%';
                img.style.animation = 'loading 1.5s infinite';
            }
        });
    }
}

// CSS animations for dynamic effects
const dynamicStyles = `
@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

@keyframes loading {
    0% {
        background-position: 200% 0;
    }
    100% {
        background-position: -200% 0;
    }
}

.glow-on-hover {
    transition: all 0.3s ease;
}

.glow-on-hover:hover {
    box-shadow: 0 0 30px rgba(0, 245, 255, 0.4);
}
`;

// Add dynamic styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = dynamicStyles;
document.head.appendChild(styleSheet);

// Performance optimization
class PerformanceOptimizer {
    static init() {
        // Debounce resize events
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
        
        // Optimize animations based on device capabilities
        if (this.isLowPerformanceDevice()) {
            document.body.classList.add('reduced-motion');
        }
    }
    
    static handleResize() {
        // Recalculate layouts if needed
        const slides = document.querySelectorAll('.slide');
        slides.forEach(slide => {
            // Force reflow for proper responsive behavior
            slide.style.display = 'none';
            slide.offsetHeight; // Trigger reflow
            slide.style.display = '';
        });
    }
    
    static isLowPerformanceDevice() {
        // Simple heuristic for low performance devices
        return navigator.hardwareConcurrency < 4 || 
               /Android.*Chrome\/[.0-9]*/.test(navigator.userAgent);
    }
}

// Error handling and logging
class ErrorHandler {
    static init() {
        window.addEventListener('error', (e) => {
            console.error('Presentation error:', e.error);
            this.showErrorMessage('Произошла ошибка. Попробуйте обновить страницу.');
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
        });
    }
    
    static showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(255, 84, 89, 0.9);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 10000;
            font-size: 14px;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        `;
        errorDiv.textContent = message;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Initialize main presentation controller
        const presentation = new PresentationController();
        
        // Initialize additional effects
        PresentationEffects.addHoverEffects();
        PresentationEffects.addParallaxEffect();
        PresentationEffects.addInteractiveElements();
        PresentationEffects.addProgressiveLoading();
        
        // Initialize performance optimizations
        PerformanceOptimizer.init();
        
        // Initialize error handling
        ErrorHandler.init();
        
        // Add global class for enhanced styling
        document.body.classList.add('presentation-ready');
        
        console.log('All presentation systems initialized successfully');
        
    } catch (error) {
        console.error('Failed to initialize presentation:', error);
        ErrorHandler.showErrorMessage('Не удалось загрузить презентацию');
    }
});

// Export for potential external use
window.PresentationController = PresentationController;