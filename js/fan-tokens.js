// Fan Tokens JS - Mac Wayne Official

document.addEventListener('DOMContentLoaded', function() {
  // Placeholder for future interactive features
  // Example: Animate tier cards on scroll
  const cards = document.querySelectorAll('.tier-card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  cards.forEach(card => {
    card.classList.add('animate-element');
    observer.observe(card);
  });
});