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

        // Display sample products since API has CORS restrictions
        const sampleProducts = [
            {
                id: 'mac-wayne-classic-tee',
                name: 'Mac Wayne Classic Tee',
                price: '24.99',
                image: 'https://via.placeholder.com/300x300/cc0000/ffffff?text=Mac+Wayne+Classic+Tee',
                description: 'Official Mac Wayne Classic T-Shirt. Premium quality cotton.',
                buyUrl: 'https://macwayne.printful.me/product/mac-wayne-classic-tee'
            },
            {
                id: 'mac-wayne-1000-crew-neck-gaiter',
                name: 'Mac Wayne 1000 Crew Neck Gaiter',
                price: '19.64',
                image: 'https://via.placeholder.com/300x300/990000/ffffff?text=Mac+Wayne+1000+Crew+Gaiter',
                description: 'All-Over Print Neck Gaiter featuring Mac Wayne 1000 Crew design.',
                buyUrl: 'https://macwayne.printful.me/product/mac-wayne-1000-crew-neck-gaiter'
            },
            {
                id: 'mac-wayne-hoodie',
                name: 'Mac Wayne Hoodie',
                price: '49.99',
                image: 'https://via.placeholder.com/300x300/cc0000/ffffff?text=Mac+Wayne+Hoodie',
                description: 'Comfortable hoodie with Mac Wayne logo. Perfect for any weather.',
                buyUrl: 'https://macwayne.printful.me/product/mac-wayne-hoodie'
            },
            {
                id: 'blind-battered-album',
                name: 'Blind & Battered Album',
                price: '15.99',
                image: 'images/macwayne-background.png',
                description: 'Physical CD of the complete Blind & Battered album.',
                buyUrl: 'https://macwayne.printful.me/product/blind-battered-album'
            }
        ];
        
        productGrid.innerHTML = sampleProducts.map(product => `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='images/macwayne-logo.png'">
                    <div class="product-badge">Official</div>
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <p class="product-price">$${product.price}</p>
                    <button class="add-to-cart" onclick="window.open('${product.buyUrl}', '_blank')">
                        <i class="fas fa-shopping-cart"></i> Buy Now
                    </button>
                </div>
            </div>
        `).join('');
        return;

        // Future API integration code (currently disabled due to CORS)
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