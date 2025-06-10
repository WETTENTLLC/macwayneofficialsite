// Premium Access - Mac Wayne Official
// Subscription and premium content management

class PremiumAccess {
  constructor() {
    this.user = null;
    this.subscription = null;
    this.premiumContent = [];
    this.init();
  }

  init() {
    this.loadUserData();
    this.bindEvents();
    this.checkAccess();
  }

  loadUserData() {
    // Load user data from localStorage or API
    const userData = localStorage.getItem('macwayne_user');
    if (userData) {
      this.user = JSON.parse(userData);
    }
    
    const subData = localStorage.getItem('macwayne_subscription');
    if (subData) {
      this.subscription = JSON.parse(subData);
    }
  }

  bindEvents() {
    // Subscribe buttons
    document.querySelectorAll('.subscribe-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const plan = e.target.dataset.plan;
        this.showSubscriptionModal(plan);
      });
    });

    // Premium content access
    document.querySelectorAll('.premium-content').forEach(content => {
      content.addEventListener('click', (e) => {
        if (!this.hasAccess()) {
          e.preventDefault();
          this.showUpgradePrompt();
        }
      });
    });

    // Login/logout
    const loginBtn = document.querySelector('.login-btn');
    const logoutBtn = document.querySelector('.logout-btn');
    
    if (loginBtn) {
      loginBtn.addEventListener('click', () => this.showLoginModal());
    }
    
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.logout());
    }
  }

  checkAccess() {
    this.updateUI();
    this.loadPremiumContent();
  }

  hasAccess() {
    if (!this.subscription) return false;
    
    const now = new Date();
    const expiryDate = new Date(this.subscription.expiryDate);
    
    return now < expiryDate && this.subscription.status === 'active';
  }

  updateUI() {
    const premiumElements = document.querySelectorAll('.premium-only');
    const freeElements = document.querySelectorAll('.free-only');
    const userElements = document.querySelectorAll('.user-only');
    const guestElements = document.querySelectorAll('.guest-only');

    if (this.hasAccess()) {
      premiumElements.forEach(el => el.style.display = 'block');
      freeElements.forEach(el => el.style.display = 'none');
    } else {
      premiumElements.forEach(el => el.style.display = 'none');
      freeElements.forEach(el => el.style.display = 'block');
    }

    if (this.user) {
      userElements.forEach(el => el.style.display = 'block');
      guestElements.forEach(el => el.style.display = 'none');
      
      // Update user info
      const userNameElements = document.querySelectorAll('.user-name');
      userNameElements.forEach(el => el.textContent = this.user.name);
    } else {
      userElements.forEach(el => el.style.display = 'none');
      guestElements.forEach(el => el.style.display = 'block');
    }
  }

  loadPremiumContent() {
    if (!this.hasAccess()) return;

    // Load premium tracks, videos, etc.
    this.premiumContent = [
      {
        type: 'audio',
        title: 'Exclusive Studio Session',
        url: 'audio/premium/studio-session-1.mp3',
        description: 'Behind-the-scenes recording'
      },
      {
        type: 'video',
        title: 'Making of Documentary',
        url: 'videos/premium/making-of.mp4',
        description: 'Exclusive documentary content'
      },
      {
        type: 'text',
        title: 'Personal Stories',
        content: 'Exclusive written content from Mac Wayne',
        description: 'Personal insights and stories'
      }
    ];

    this.renderPremiumContent();
  }

  renderPremiumContent() {
    const container = document.querySelector('.premium-content-container');
    if (!container) return;

    const contentHTML = this.premiumContent.map(item => `
      <div class="premium-item" data-type="${item.type}">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        ${item.type === 'audio' ? `<audio controls src="${item.url}"></audio>` : ''}
        ${item.type === 'video' ? `<video controls src="${item.url}"></video>` : ''}
        ${item.type === 'text' ? `<div class="text-content">${item.content}</div>` : ''}
      </div>
    `).join('');

    container.innerHTML = contentHTML;
  }

  showSubscriptionModal(plan = 'basic') {
    const modalHTML = `
      <div class="modal subscription-modal">
        <div class="modal-content">
          <span class="close">&times;</span>
          <h2>Choose Your Plan</h2>
          <div class="subscription-plans">
            <div class="plan ${plan === 'basic' ? 'selected' : ''}" data-plan="basic">
              <h3>Basic</h3>
              <div class="price">$9.99/month</div>
              <ul>
                <li>Exclusive tracks</li>
                <li>Early access</li>
                <li>Member Discord</li>
              </ul>
              <button class="btn btn-primary">Select Basic</button>
            </div>
            <div class="plan ${plan === 'premium' ? 'selected' : ''}" data-plan="premium">
              <h3>Premium</h3>
              <div class="price">$19.99/month</div>
              <ul>
                <li>All Basic features</li>
                <li>Video content</li>
                <li>Live sessions</li>
                <li>Merchandise discounts</li>
              </ul>
              <button class="btn btn-primary">Select Premium</button>
            </div>
            <div class="plan ${plan === 'vip' ? 'selected' : ''}" data-plan="vip">
              <h3>VIP</h3>
              <div class="price">$39.99/month</div>
              <ul>
                <li>All Premium features</li>
                <li>1-on-1 sessions</li>
                <li>Exclusive events</li>
                <li>Personal consultations</li>
              </ul>
              <button class="btn btn-primary">Select VIP</button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    const modal = document.querySelector('.subscription-modal');
    const closeBtn = modal.querySelector('.close');
    
    closeBtn.addEventListener('click', () => modal.remove());
    
    modal.querySelectorAll('.plan button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const selectedPlan = e.target.closest('.plan').dataset.plan;
        this.processSubscription(selectedPlan);
        modal.remove();
      });
    });
  }

  showLoginModal() {
    const modalHTML = `
      <div class="modal login-modal">
        <div class="modal-content">
          <span class="close">&times;</span>
          <h2>Login to Your Account</h2>
          <form class="login-form">
            <input type="email" placeholder="Email" required>
            <input type="password" placeholder="Password" required>
            <button type="submit" class="btn btn-primary">Login</button>
          </form>
          <p>Don't have an account? <a href="#" class="signup-link">Sign up here</a></p>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    const modal = document.querySelector('.login-modal');
    const closeBtn = modal.querySelector('.close');
    const form = modal.querySelector('.login-form');
    
    closeBtn.addEventListener('click', () => modal.remove());
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // Simulate login
      this.simulateLogin();
      modal.remove();
    });
  }

  showUpgradePrompt() {
    const promptHTML = `
      <div class="upgrade-prompt">
        <div class="prompt-content">
          <h3>Premium Content</h3>
          <p>This content is available to premium subscribers only.</p>
          <button class="btn btn-primary upgrade-btn">Upgrade Now</button>
          <button class="btn btn-secondary close-prompt">Maybe Later</button>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', promptHTML);
    
    const prompt = document.querySelector('.upgrade-prompt');
    const upgradeBtn = prompt.querySelector('.upgrade-btn');
    const closeBtn = prompt.querySelector('.close-prompt');
    
    upgradeBtn.addEventListener('click', () => {
      this.showSubscriptionModal();
      prompt.remove();
    });
    
    closeBtn.addEventListener('click', () => prompt.remove());
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (prompt.parentNode) prompt.remove();
    }, 5000);
  }

  processSubscription(plan) {
    // Simulate subscription process
    console.log('Processing subscription for plan:', plan);
    
    // In a real implementation, this would integrate with Stripe or similar
    this.simulateSubscription(plan);
  }

  simulateLogin() {
    // Simulate successful login
    this.user = {
      id: 'user123',
      name: 'Fan User',
      email: 'fan@example.com'
    };
    
    localStorage.setItem('macwayne_user', JSON.stringify(this.user));
    this.updateUI();
    
    this.showNotification('Successfully logged in!', 'success');
  }

  simulateSubscription(plan) {
    // Simulate successful subscription
    const now = new Date();
    const expiryDate = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days
    
    this.subscription = {
      plan: plan,
      status: 'active',
      startDate: now.toISOString(),
      expiryDate: expiryDate.toISOString()
    };
    
    localStorage.setItem('macwayne_subscription', JSON.stringify(this.subscription));
    this.updateUI();
    this.loadPremiumContent();
    
    this.showNotification(`Successfully subscribed to ${plan} plan!`, 'success');
  }

  logout() {
    this.user = null;
    this.subscription = null;
    
    localStorage.removeItem('macwayne_user');
    localStorage.removeItem('macwayne_subscription');
    
    this.updateUI();
    this.showNotification('Successfully logged out!', 'info');
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new PremiumAccess();
});