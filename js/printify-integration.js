// Printify API Integration
class PrintifyStore {
    constructor(token) {
        this.token = token;
        this.baseUrl = 'https://api.printify.com/v1';
        this.shopId = null;
    }

    async fetchShops() {
        try {
            const response = await fetch(`${this.baseUrl}/shops.json`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) throw new Error('Failed to fetch shops');
            
            const data = await response.json();
            return data.data || [];
        } catch (error) {
            console.error('Error fetching Printify shops:', error);
            return [];
        }
    }

    async fetchProducts() {
        if (!this.shopId) return [];
        
        try {
            const response = await fetch(`${this.baseUrl}/shops/${this.shopId}/products.json`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) throw new Error('Failed to fetch products');
            
            const data = await response.json();
            return data.data || [];
        } catch (error) {
            console.error('Error fetching Printify products:', error);
            return [];
        }
    }

    renderProducts(products) {
        const productGrid = document.querySelector('.product-grid');
        if (!productGrid) return;

        if (products.length === 0) {
            productGrid.innerHTML = '<div class="no-products"><h3>Loading Products...</h3><p>Connecting to Printify store...</p></div>';
            return;
        }

        productGrid.innerHTML = products.map(product => {
            const image = product.images && product.images[0] ? product.images[0].src : 'images/macwayne-logo.png';
            const price = product.variants && product.variants[0] ? (product.variants[0].price / 100).toFixed(2) : '0.00';
            
            return `
                <div class="product-card printify-product" data-product-id="${product.id}">
                    <div class="product-image">
                        <img src="${image}" alt="${product.title}" onerror="this.src='images/macwayne-logo.png'">
                        <div class="product-badge">Official</div>
                    </div>
                    <div class="product-info">
                        <h3 class="product-name">${product.title}</h3>
                        <p class="product-description">${product.description ? product.description.substring(0, 100) + '...' : 'Official Mac Wayne merchandise'}</p>
                        <p class="product-price">$${price}</p>
                        <button class="add-to-cart" onclick="window.open('https://macwayneofficial.printify.me/product/${product.id}', '_blank')">
                            Buy Now
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    async init() {
        // First get shops to find shop ID
        const shops = await this.fetchShops();
        
        if (shops.length > 0) {
            this.shopId = shops[0].id; // Use first shop
            console.log('Found shop ID:', this.shopId);
            
            // Now fetch products
            const products = await this.fetchProducts();
            this.renderProducts(products);
            

        } else {
            console.log('No shops found');
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const PRINTIFY_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzN2Q0YmQzMDM1ZmUxMWU5YTgwM2FiN2VlYjNjY2M5NyIsImp0aSI6IjdlMDg1M2I3N2MyMzM3ZTQ1MmFhOWQwZDYwYTZhOWJiMWY1NTc1NTQ5M2MwOTk1MDJiYjYyOTExN2JkNzk4MTRlNGI1MTQyOTI4OGJkMWY4IiwiaWF0IjoxNzU3MzU5ODE1LjU1OTUwOCwibmJmIjoxNzU3MzU5ODE1LjU1OTUxLCJleHAiOjE3ODg4OTU4MTUuNTM1OTM0LCJzdWIiOiI5MDc5ODg3Iiwic2NvcGVzIjpbInNob3BzLm1hbmFnZSIsInNob3BzLnJlYWQiLCJjYXRhbG9nLnJlYWQiLCJvcmRlcnMucmVhZCIsIm9yZGVycy53cml0ZSIsInByb2R1Y3RzLnJlYWQiLCJwcm9kdWN0cy53cml0ZSIsIndlYmhvb2tzLnJlYWQiLCJ3ZWJob29rcy53cml0ZSIsInVwbG9hZHMucmVhZCIsInVwbG9hZHMud3JpdGUiLCJwcmludF9wcm92aWRlcnMucmVhZCIsInVzZXIuaW5mbyJdfQ.SkPvCbi30JbSARjoLRjaCX1ZbYCijTp_CT0NQMR6ft1vraHXgwWyj8dVeXINT1P8UmVPT20AgQ75T3ygPdnC8YUPGSw8rHGITUcv_SJvwTi0Ch5Hj1pvoPtFi38Z6y9wHySEe2Q8Ka_JG5STL0UemDiLN2lwN9RGGxMvhjQ731mOaBbFAL1mYmRIH8ka_imFqH9faOBneqCPRJlSi8GmX41GtRPoNpFUO4TH4fGWjXmbvy48UI3VBwWfAzZJGqNCIBd4XpLwRqMIJ02xVD-3l7K1EIPjJKWkIsP1t9WYQBYwJM8u-SDpkKSdvYOaPd9OV2_m41w5J6w9X0t8S4jdwqCcfM-axJf70VeeCTWclMaEtgqT0mXMpBBXvp_lB1QM8IMjUQ6Q65ClS1YU_Bze2kQw77QHFrP7gqKPaIqGwlj-5_s1vCgW0xWnP9A7HTFbQ00DvTZoL_OrV65FObxwBXKuCCZoWVUkJKJ66YmdRMXeeaUvPTu8RcFTgozwwx3-oMppgozkB3xQQNLhz6uP-3foK7R4PKGVVeH-TuCM9vkrCKH_cmdH2qVO7LvTbOnaDA2_MlcLYtMDcxRtH_0BSeLQi9X3j6owjr8jGd_kcMD6auzXg4ULKHuTNzuKDTOOZcqMFvXvMglmez140rjokhBoGbh4f6OmDewUmITyhMg';
    
    const store = new PrintifyStore(PRINTIFY_TOKEN);
    store.init();
});