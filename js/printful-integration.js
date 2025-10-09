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

        // Show Printful store embed immediately
        productGrid.innerHTML = `
            <div class="printful-store-embed">
                <iframe 
                    src="https://macwayne.printful.me" 
                    width="100%" 
                    height="1000" 
                    frameborder="0" 
                    title="Mac Wayne Official Store"
                    style="border: none; border-radius: 8px; background: #fff;"
                ></iframe>
            </div>
        `;
        return;

        // API integration disabled due to CORS - using iframe embed instead
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

// Initialize when DOM is ready - Force store display
document.addEventListener('DOMContentLoaded', () => {
    // Immediately show Printful store embed
    const productGrid = document.querySelector('.product-grid');
    if (productGrid) {
        productGrid.innerHTML = `
            <div class="printful-store-embed">
                <iframe 
                    src="https://macwayne.printful.me" 
                    width="100%" 
                    height="1000" 
                    frameborder="0" 
                    title="Mac Wayne Official Store"
                    style="border: none; border-radius: 8px; background: #fff;"
                ></iframe>
            </div>
        `;
    }
});