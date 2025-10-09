// Printful API v2 Integration
class PrintfulStore {
    constructor(token) {
        this.token = token;
        this.baseUrl = 'https://api.printful.com/v2';
    }

    async fetchProducts() {
        try {
            // Try v1 endpoint first since v2 might have CORS issues
            const response = await fetch('https://api.printful.com/store/products', {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('API Response status:', response.status);
            
            if (!response.ok) {
                console.error('API Error:', response.status, response.statusText);
                throw new Error(`API Error: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('API Response data:', data);
            return data.result || data.data || [];
        } catch (error) {
            console.error('Error fetching Printful products:', error);
            // Show error message to user
            const productGrid = document.querySelector('.product-grid');
            if (productGrid) {
                productGrid.innerHTML = `
                    <div class="no-products">
                        <h3>Store Connection Issue</h3>
                        <p>Unable to load products. Please check console for details.</p>
                        <p>Error: ${error.message}</p>
                    </div>
                `;
            }
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

        // Show store link since API has CORS restrictions
        productGrid.innerHTML = `
            <div class="store-redirect">
                <div class="store-message">
                    <h3>🛍️ Mac Wayne Official Store</h3>
                    <p>Browse and purchase official Mac Wayne merchandise directly from our secure Printful store.</p>
                    <a href="https://macwayne.printful.me" target="_blank" class="store-link-btn">
                        <i class="fas fa-external-link-alt"></i>
                        Visit Official Store
                    </a>
                </div>
                <div class="coming-soon-products">
                    <h4>Coming Soon:</h4>
                    <div class="preview-grid">
                        <div class="preview-item">
                            <i class="fas fa-tshirt"></i>
                            <span>Mac Wayne T-Shirts</span>
                        </div>
                        <div class="preview-item">
                            <i class="fas fa-hat-cowboy"></i>
                            <span>Official Caps</span>
                        </div>
                        <div class="preview-item">
                            <i class="fas fa-shopping-bag"></i>
                            <span>Hoodies & Merch</span>
                        </div>
                        <div class="preview-item">
                            <i class="fas fa-compact-disc"></i>
                            <span>Music & Albums</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        return;

        // This won't run due to CORS, but keeping for future backend integration
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