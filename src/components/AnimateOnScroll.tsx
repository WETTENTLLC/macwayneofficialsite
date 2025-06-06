'use client';

import { useEffect } from 'react';

export function useAnimateOnScroll() {
  useEffect(() => {
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    const checkIfInView = () => {
      animateElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150; // How far from the top before the element becomes visible
        
        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add('visible');
        } else {
          element.classList.remove('visible');
        }
      });
    };
    
    // Check on load
    checkIfInView();
    
    // Check on scroll
    window.addEventListener('scroll', checkIfInView);
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', checkIfInView);
    };
  }, []);
}

export default useAnimateOnScroll;
