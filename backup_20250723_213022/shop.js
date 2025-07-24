// Shop functionality - cart management, filters, product interactions
class ShopManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('macWayneCart') || '[]');
        this.filters = {
            category: 'all',
            priceRange: 'all',
            sortBy: 'featured'
        };
        this.init();
    }

    init() {
        this.updateCartCount();
        this.bindEventListeners();
        this.renderProducts();
    }

    bindEventListeners() {
        // Add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('.add-to-cart')) {
                e.preventDefault();
                const productCard = e.target.closest('.product-card');
                const product = this.extractProductData(productCard);
                this.addToCart(product);
            }
        });

        // Cart toggle
        const cartToggle = document.querySelector('.cart-toggle');
        if (cartToggle) {
            cartToggle.addEventListener('click', () => this.toggleCart());
        }

        // Filter controls
        const filterSelects = document.querySelectorAll('.filter-select');
        filterSelects.forEach(select => {
            select.addEventListener('change', (e) => {
                this.filters[e.target.dataset.filter] = e.target.value;
                this.applyFilters();
            });
        });

        // Remove from cart
        document.addEventListener('click', (e) => {
            if (e.target.matches('.remove-from-cart')) {
                const productId = e.target.dataset.productId;
                this.removeFromCart(productId);
            }
        });

        // Quantity updates
        document.addEventListener('change', (e) => {
            if (e.target.matches('.cart-quantity')) {
                const productId = e.target.dataset.productId;
                const quantity = parseInt(e.target.value);
                this.updateQuantity(productId, quantity);
            }
        });

        // Checkout
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.initiateCheckout());
        }
    }

    extractProductData(productCard) {
        return {
            id: productCard.dataset.productId,
            name: productCard.querySelector('.product-name').textContent,
            price: parseFloat(productCard.querySelector('.product-price').textContent.replace('$', '')),
            image: productCard.querySelector('.product-image img').src,
            category: productCard.dataset.category
        };
    }

    addToCart(product) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({ ...product, quantity: 1 });
        }

        this.saveCart();
        this.updateCartCount();
        this.showNotification(`${product.name} added to cart!`);
        this.renderCartItems();
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
        this.renderCartItems();
    }

    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
                this.updateCartCount();
                this.renderCartItems();
            }
        }
    }

    saveCart() {
        localStorage.setItem('macWayneCart', JSON.stringify(this.cart));
    }

    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCount) {
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'block' : 'none';
        }
    }

    toggleCart() {
        const cartSidebar = document.querySelector('.cart-sidebar');
        if (cartSidebar) {
            cartSidebar.classList.toggle('open');
            this.renderCartItems();
        }
    }

    renderCartItems() {
        const cartItems = document.querySelector('.cart-items');
        if (!cartItems) return;

        if (this.cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            return;
        }

        cartItems.innerHTML = this.cart.map(item => `
            <div class="cart-item" data-product-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                    <div class="quantity-controls">
                        <input type="number" 
                               min="1" 
                               value="${item.quantity}" 
                               class="cart-quantity" 
                               data-product-id="${item.id}">
                        <button class="remove-from-cart" data-product-id="${item.id}">Remove</button>
                    </div>
                </div>
                <div class="cart-item-total">
                    $${(item.price * item.quantity).toFixed(2)}
                </div>
            </div>
        `).join('');

        this.updateCartTotal();
    }

    updateCartTotal() {
        const cartTotal = document.querySelector('.cart-total');
        if (cartTotal) {
            const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartTotal.textContent = `$${total.toFixed(2)}`;
        }
    }

    applyFilters() {
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            let show = true;

            // Category filter
            if (this.filters.category !== 'all') {
                if (card.dataset.category !== this.filters.category) {
                    show = false;
                }
            }

            // Price filter
            if (this.filters.priceRange !== 'all') {
                const price = parseFloat(card.querySelector('.product-price').textContent.replace('$', ''));
                const [min, max] = this.filters.priceRange.split('-').map(Number);
                if (price < min || (max && price > max)) {
                    show = false;
                }
            }

            card.style.display = show ? 'block' : 'none';
        });

        this.applySorting();
    }

    applySorting() {
        const productGrid = document.querySelector('.product-grid');
        const productCards = Array.from(document.querySelectorAll('.product-card:not([style*="display: none"])'));

        productCards.sort((a, b) => {
            switch (this.filters.sortBy) {
                case 'price-low':
                    return this.getPrice(a) - this.getPrice(b);
                case 'price-high':
                    return this.getPrice(b) - this.getPrice(a);
                case 'name':
                    return this.getName(a).localeCompare(this.getName(b));
                case 'featured':
                default:
                    return 0;
            }
        });

        productCards.forEach(card => productGrid.appendChild(card));
    }

    getPrice(card) {
        return parseFloat(card.querySelector('.product-price').textContent.replace('$', ''));
    }

    getName(card) {
        return card.querySelector('.product-name').textContent;
    }

    renderProducts() {
        // This would typically fetch from an API or database
        // For now, products are already in HTML
        this.applyFilters();
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'shop-notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    initiateCheckout() {
        if (this.cart.length === 0) {
            this.showNotification('Your cart is empty!');
            return;
        }

        // For demo purposes, show a simple alert
        // In production, this would integrate with a payment processor
        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        alert(`Checkout functionality coming soon!\nTotal: $${total.toFixed(2)}\n\nItems: ${this.cart.length}`);
    }
}

// Initialize shop manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.body.classList.contains('shop-page')) {
        new ShopManager();
    }
});

// Export for use in other modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ShopManager;
}
