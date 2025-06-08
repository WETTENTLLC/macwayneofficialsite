// Animation utilities and effects for Mac Wayne Official website

class AnimationController {
    constructor() {
        this.observers = new Map();
        this.init();
    }
    
    init() {
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupParallaxEffects();
        this.setupTextAnimations();
    }
    
    setupScrollAnimations() {
        // Enhanced intersection observer for scroll animations
        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerScrollAnimation(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Observe elements with animation classes
        const animatedElements = document.querySelectorAll(`
            .scroll-fade,
            .scroll-slide-left,
            .scroll-slide-right,
            .animate-on-scroll
        `);
        
        animatedElements.forEach(el => {
            scrollObserver.observe(el);
        });
        
        this.observers.set('scroll', scrollObserver);
    }
    
    triggerScrollAnimation(element) {
        // Add visible class
        element.classList.add('visible');
        
        // Handle staggered animations
        const children = element.querySelectorAll('.stagger-child');
        if (children.length > 0) {
            children.forEach((child, index) => {
                setTimeout(() => {
                    child.classList.add('animate-fade-in');
                }, index * 100);
            });
        }
        
        // Trigger custom animation events
        element.dispatchEvent(new CustomEvent('animationTriggered'));
    }
    
    setupHoverEffects() {
        // Enhanced hover effects for interactive elements
        const hoverElements = document.querySelectorAll(`
            .hover-glow,
            .hover-scale,
            .hover-lift,
            .track-item,
            .btn
        `);
        
        hoverElements.forEach(element => {
            this.addHoverListeners(element);
        });
    }
    
    addHoverListeners(element) {
        element.addEventListener('mouseenter', (e) => {
            this.onHoverEnter(e.target);
        });
        
        element.addEventListener('mouseleave', (e) => {
            this.onHoverLeave(e.target);
        });
    }
    
    onHoverEnter(element) {
        // Add hover state
        element.classList.add('hovered');
        
        // Create ripple effect for buttons
        if (element.classList.contains('btn') || element.classList.contains('track-item')) {
            this.createRippleEffect(element);
        }
        
        // Glow effect for logo
        if (element.classList.contains('logo')) {
            element.classList.add('animate-glow');
        }
    }
    
    onHoverLeave(element) {
        element.classList.remove('hovered');
        
        // Remove temporary animation classes
        setTimeout(() => {
            element.classList.remove('animate-glow');
        }, 300);
    }
    
    createRippleEffect(element) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        
        // Position ripple
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        
        // Style ripple
        Object.assign(ripple.style, {
            position: 'absolute',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.3)',
            transform: 'scale(0)',
            animation: 'ripple 0.6s linear',
            pointerEvents: 'none',
            left: '50%',
            top: '50%',
            marginLeft: -(size / 2) + 'px',
            marginTop: -(size / 2) + 'px'
        });
        
        // Ensure element has relative positioning
        if (getComputedStyle(element).position === 'static') {
            element.style.position = 'relative';
        }
        
        element.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }
    
    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.parallax');
        
        if (parallaxElements.length === 0) return;
        
        const handleScroll = this.debounce(() => {
            const scrollTop = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrollTop * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        }, 10);
        
        window.addEventListener('scroll', handleScroll);
    }
    
    setupTextAnimations() {
        // Typewriter effect
        const typewriterElements = document.querySelectorAll('.typewriter');
        typewriterElements.forEach(element => {
            this.createTypewriterEffect(element);
        });
        
        // Text reveal animation
        const textRevealElements = document.querySelectorAll('.text-reveal');
        textRevealElements.forEach(element => {
            this.createTextRevealEffect(element);
        });
    }
    
    createTypewriterEffect(element) {
        const text = element.textContent;
        const speed = parseInt(element.dataset.speed) || 50;
        
        element.textContent = '';
        element.style.borderRight = '2px solid var(--primary-color)';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            } else {
                // Blinking cursor effect
                setInterval(() => {
                    element.style.borderRight = element.style.borderRight === 'none' 
                        ? '2px solid var(--primary-color)' 
                        : 'none';
                }, 500);
            }
        };
        
        // Start animation when element is visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typeWriter();
                    observer.unobserve(element);
                }
            });
        });
        
        observer.observe(element);
    }
    
    createTextRevealEffect(element) {
        const text = element.textContent;
        const words = text.split(' ');
        
        element.innerHTML = words.map(word => 
            `<span class="word-reveal" style="opacity: 0; transform: translateY(20px);">${word}</span>`
        ).join(' ');
        
        const wordElements = element.querySelectorAll('.word-reveal');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateWords(wordElements);
                    observer.unobserve(element);
                }
            });
        });
        
        observer.observe(element);
    }
    
    animateWords(wordElements) {
        wordElements.forEach((word, index) => {
            setTimeout(() => {
                word.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                word.style.opacity = '1';
                word.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    // Audio visualization effects
    createAudioVisualization(audioElement, container) {
        if (!window.AudioContext) {
            console.warn('Web Audio API not supported');
            return;
        }
        
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaElementSource(audioElement);
        
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        const canvas = document.createElement('canvas');
        canvas.className = 'audio-visualizer';
        canvas.width = container.offsetWidth;
        canvas.height = 100;
        
        const ctx = canvas.getContext('2d');
        container.appendChild(canvas);
        
        const draw = () => {
            requestAnimationFrame(draw);
            
            analyser.getByteFrequencyData(dataArray);
            
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            const barWidth = (canvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;
            
            for (let i = 0; i < bufferLength; i++) {
                barHeight = (dataArray[i] / 255) * canvas.height;
                
                const r = 255;
                const g = Math.floor(69 + (dataArray[i] / 255) * 186);
                const b = 0;
                
                ctx.fillStyle = `rgb(${r},${g},${b})`;
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                
                x += barWidth + 1;
            }
        };
        
        draw();
        
        return { audioContext, analyser, canvas };
    }
    
    // Utility methods
    debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }
    
    // Loading animations
    showLoadingAnimation(container) {
        const loader = document.createElement('div');
        loader.className = 'loading-animation';
        loader.innerHTML = `
            <div class="loading-spinner"></div>
            <div class="loading-text">Loading...</div>
        `;
        
        Object.assign(loader.style, {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: 'var(--primary-color)',
            zIndex: '1000'
        });
        
        container.style.position = 'relative';
        container.appendChild(loader);
        
        return loader;
    }
    
    hideLoadingAnimation(loader) {
        if (loader && loader.parentNode) {
            loader.style.opacity = '0';
            loader.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                if (loader.parentNode) {
                    loader.parentNode.removeChild(loader);
                }
            }, 300);
        }
    }
    
    // Cleanup method
    destroy() {
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        this.observers.clear();
    }
}

// Add required CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .ripple-effect {
        pointer-events: none !important;
    }
`;
document.head.appendChild(style);

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.animationController = new AnimationController();
});

// Export for external use
window.AnimationController = AnimationController;
