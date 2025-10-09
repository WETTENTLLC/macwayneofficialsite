// Printful API v2 Integration
class PrintfulStore {
    constructor(token) {
        this.token = token;
        this.baseUrl = 'https://api.printful.com/v2';
    }

    async fetchProducts() {
        try {
            const response = await fetch(`${this.baseUrl}/catalog/products`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) throw new Error('Failed to fetch products');
            
            const data = await response.json();
            return data.data || [];
        } catch (error) {
            console.error('Error fetching Printful products:', error);
            return [];
        }
    }

    renderProducts(products) {
        const productGrid = document.querySelector('.product-grid');
        if (!productGrid) {
            console.error('Product grid not found');
            return;
        }

        console.log('Rendering', products.length, 'Printful products');

        if (products.length === 0) {
            productGrid.innerHTML = '<div class="no-products"><h3>Loading Printful Products...</h3><p>Connecting to your store...</p></div>';
            return;
        }

        productGrid.innerHTML = products.map(product => {
            const image = product.image || 'images/macwayne-logo.png';
            const price = product.price || '0.00';
            
            return `
                <div class="product-card printful-product" data-product-id="${product.id}">
                    <div class="product-image">
                        <img src="${image}" alt="${product.name}" onerror="this.src='images/macwayne-logo.png'">
                        <div class="product-badge">Printful</div>
                    </div>
                    <div class="product-info">
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-description">${product.description ? product.description.substring(0, 100) + '...' : 'Official Mac Wayne merchandise'}</p>
                        <p class="product-price">$${price}</p>
                        <button class="add-to-cart" onclick="window.open('https://macwayne.printful.me/product/${product.id}', '_blank')">
                            Buy Now
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    async init() {
        console.log('Starting Printful integration...');
        
        const products = await this.fetchProducts();
        console.log('Printful products response:', products);
        this.renderProducts(products);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // You'll need to provide your Printful API token
    const PRINTFUL_TOKEN = 'NjxCYiout11p0cbvyMOA7RaZxZJwUG6fLFofq8HC';
    
    if (PRINTFUL_TOKEN !== 'YOUR_PRINTFUL_TOKEN_HERE') {
        const store = new PrintfulStore(PRINTFUL_TOKEN);
        store.init();
    } else {
        console.log('Printful token not configured');
    }
});