// Consulting Page JavaScript - Mac Wayne Official

document.addEventListener('DOMContentLoaded', function() {
  initializeQuoteModal();
  initializeAccordion();
  initializeConsultationForm();
  initializeScrollAnimations();
});

// Quote Modal functionality
function initializeQuoteModal() {
  const modal = document.getElementById('quote-modal');
  const quoteButtons = document.querySelectorAll('[data-service]');
  const closeModal = document.querySelector('.close-modal');
  const quoteForm = document.getElementById('quote-form');
  const serviceInput = document.getElementById('quote-service');

  // Open modal when a service quote button is clicked
  quoteButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const service = this.getAttribute('data-service');
      serviceInput.value = service;
      document.getElementById('quote-modal-title').textContent = `Request a Quote: ${service}`;
      openModal();
    });
  });

  // Close modal with close button
  if (closeModal) {
    closeModal.addEventListener('click', closeModalFunc);
  }

  // Close modal when clicking outside
  window.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeModalFunc();
    }
  });

  // Close modal with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModalFunc();
    }
  });

  // Handle quote form submission
  if (quoteForm) {
    quoteForm.addEventListener('submit', function(e) {
      e.preventDefault();
      if (validateForm(quoteForm)) {
        // Simulate form submission
        showNotification('Quote request submitted successfully! We\'ll contact you soon.', 'success');
        quoteForm.reset();
        closeModalFunc();
      }
    });
  }

  function openModal() {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    // Focus trap for accessibility
    const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusableElements.length) focusableElements[0].focus();
    document.body.style.overflow = 'hidden';
  }

  function closeModalFunc() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}

// FAQ Accordion functionality
function initializeAccordion() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', function() {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !expanded);
      // Close other accordions
      if (!expanded) {
        accordionHeaders.forEach(otherHeader => {
          if (otherHeader !== this) {
            otherHeader.setAttribute('aria-expanded', 'false');
          }
        });
      }
    });
  });
}

// Consultation form handling
function initializeConsultationForm() {
  const consultationForm = document.getElementById('consultation-form');
  if (consultationForm) {
    consultationForm.addEventListener('submit', function(e) {
      e.preventDefault();
      if (validateForm(consultationForm)) {
        showNotification('Your consultation request has been submitted! We\'ll be in touch shortly.', 'success');
        consultationForm.reset();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
    // Real-time validation for better UX
    const formInputs = consultationForm.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
      input.addEventListener('blur', function() { validateInput(this); });
      if (input.type === 'text' || input.type === 'email' || input.tagName === 'TEXTAREA') {
        input.addEventListener('input', function() {
          if (this.classList.contains('error')) validateInput(this);
        });
      }
    });
  }
}

// Form validation utility
function validateForm(form) {
  const inputs = form.querySelectorAll('input, select, textarea');
  let isValid = true;
  inputs.forEach(input => {
    if (!validateInput(input)) isValid = false;
  });
  return isValid;
}

function validateInput(input) {
  if (!input.required && !input.value.trim()) return true;
  let isValid = true;
  const errorMessage = input.parentElement.querySelector('.error-message') ||
    document.createElement('span');
  errorMessage.className = 'error-message';

  if (input.required && !input.value.trim()) {
    errorMessage.textContent = 'This field is required';
    isValid = false;
  } else if (input.type === 'email' && input.value.trim()) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(input.value)) {
      errorMessage.textContent = 'Please enter a valid email address';
      isValid = false;
    }
  } else if (input.type === 'tel' && input.value.trim()) {
    const phonePattern = /^[\d\s\+\-\(\)]{10,20}$/;
    if (!phonePattern.test(input.value)) {
      errorMessage.textContent = 'Please enter a valid phone number';
      isValid = false;
    }
  } else if (input.type === 'checkbox' && input.required && !input.checked) {
    errorMessage.textContent = 'This checkbox is required';
    isValid = false;
  }

  if (!isValid) {
    input.classList.add('error');
    if (!input.parentElement.querySelector('.error-message')) {
      input.parentElement.appendChild(errorMessage);
    }
  } else {
    input.classList.remove('error');
    if (input.parentElement.querySelector('.error-message')) {
      input.parentElement.querySelector('.error-message').remove();
    }
  }
  return isValid;
}

// Notification system
function showNotification(message, type = 'success') {
  const notification = document.querySelector('.notification');
  const messageElement = notification.querySelector('.notification-message');
  const iconElement = notification.querySelector('.notification-icon');
  messageElement.textContent = message;
  if (type === 'success') {
    iconElement.className = 'notification-icon fas fa-check-circle';
    notification.className = 'notification success active';
  } else if (type === 'error') {
    iconElement.className = 'notification-icon fas fa-exclamation-circle';
    notification.className = 'notification error active';
  } else {
    iconElement.className = 'notification-icon fas fa-info-circle';
    notification.className = 'notification info active';
  }
  notification.classList.add('active');
  setTimeout(() => {
    notification.classList.remove('active');
  }, 5000);
}

// Simple scroll animation (optional)
function initializeScrollAnimations() {
  const elements = document.querySelectorAll('.service-card, .testimonial-card, .process-step, .case-study, .intro-content, .intro-image, .section-header');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  elements.forEach(element => {
    element.classList.add('animate-element');
    observer.observe(element);
  });
}