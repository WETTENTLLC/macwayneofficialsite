// Affiliate Program JS - Mac Wayne Official

document.addEventListener('DOMContentLoaded', function() {
  // Example: Commission calculator logic
  const calcVisitors = document.getElementById('calc-visitors');
  const calcConversion = document.getElementById('calc-conversion');
  const calcAverage = document.getElementById('calc-average');
  const calcCommission = document.getElementById('calc-commission');
  const calcEarnings = document.getElementById('calc-earnings');

  function updateEarnings() {
    const visitors = parseInt(calcVisitors?.value || 0, 10);
    const conversion = parseFloat(calcConversion?.value || 0) / 100;
    const average = parseFloat(calcAverage?.value || 0);
    const commission = parseFloat(calcCommission?.value || 0) / 100;
    const earnings = Math.round(visitors * conversion * average * commission);
    if (calcEarnings) calcEarnings.textContent = `$${earnings}`;
  }

  [calcVisitors, calcConversion, calcAverage, calcCommission].forEach(input => {
    if (input) input.addEventListener('input', updateEarnings);
  });

  updateEarnings();

  // Simple FAQ accordion
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', function() {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !expanded);
      if (!expanded) {
        document.querySelectorAll('.accordion-header').forEach(other => {
          if (other !== this) other.setAttribute('aria-expanded', 'false');
        });
      }
    });
  });

  // Affiliate signup form validation (basic)
  const affiliateForm = document.getElementById('affiliate-form');
  if (affiliateForm) {
    affiliateForm.addEventListener('submit', function(e) {
      e.preventDefault();
      // Add your validation and submission logic here
      alert('Application submitted! We will review and contact you soon.');
      affiliateForm.reset();
    });
  }
});