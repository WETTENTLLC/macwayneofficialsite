// Service Worker for Mac Wayne Battered Coin System
// Provides offline functionality and performance caching for cryptocurrency features

const CACHE_NAME = 'mac-wayne-crypto-v1.0.0';
const STATIC_CACHE = 'mac-wayne-static-v1.0.0';
const DYNAMIC_CACHE = 'mac-wayne-dynamic-v1.0.0';

// Critical files to cache for offline functionality
const STATIC_FILES = [
    '/',
    '/battered-coin.html',
    '/styles/main.css',
    '/styles/components.css',
    '/js/main.js',
    '/js/wallet-integration.js',
    '/js/smart-contracts.js',
    '/js/market-data.js',
    '/js/crypto-optimizer.js',
    '/js/crypto-testing.js',
    '/assets/images/mwb-logo.png',
    '/assets/images/mac-wayne-battered-coin.jpg',
    '/manifest.json'
];

// API endpoints to cache with different strategies
const API_CACHE_PATTERNS = [
    /^https:\/\/api\.coingecko\.com/,
    /^https:\/\/api\.coinbase\.com/,
    /^https:\/\/api\.binance\.com/
];

// Install event - cache static files
self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('📦 Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('❌ Failed to cache static files:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('✅ Service Worker activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE && 
                            cacheName !== DYNAMIC_CACHE && 
                            cacheName !== CACHE_NAME) {
                            console.log('🗑️ Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                return self.clients.claim();
            })
    );
});

// Fetch event - handle network requests with different caching strategies
self.addEventListener('fetch', (event) => {
    const request = event.request;
    
    // Handle different types of requests
    if (request.method !== 'GET') {
        // Don't cache non-GET requests
        return;
    }
    
    // Static files - Cache First strategy
    if (STATIC_FILES.some(file => request.url.includes(file))) {
        event.respondWith(cacheFirstStrategy(request));
        return;
    }
    
    // API requests - Network First with fallback strategy
    if (API_CACHE_PATTERNS.some(pattern => pattern.test(request.url))) {
        event.respondWith(networkFirstWithFallback(request));
        return;
    }
    
    // Cryptocurrency market data - Stale While Revalidate strategy
    if (request.url.includes('price') || request.url.includes('market')) {
        event.respondWith(staleWhileRevalidate(request));
        return;
    }
    
    // Images and other assets - Cache First strategy
    if (request.destination === 'image' || 
        request.destination === 'font' || 
        request.destination === 'style') {
        event.respondWith(cacheFirstStrategy(request));
        return;
    }
    
    // Default - Network First strategy
    event.respondWith(networkFirstStrategy(request));
});

// Cache First Strategy - good for static files
async function cacheFirstStrategy(request) {
    try {
        const cacheResponse = await caches.match(request);
        if (cacheResponse) {
            return cacheResponse;
        }
        
        const networkResponse = await fetch(request);
        const cache = await caches.open(STATIC_CACHE);
        cache.put(request, networkResponse.clone());
        
        return networkResponse;
    } catch {
        return new Response('Offline content not available', { status: 503 });
    }
}

// Network First Strategy - good for dynamic content
async function networkFirstStrategy(request) {
    try {
        const networkResponse = await fetch(request);
        
        // Cache successful responses
        if (networkResponse.status === 200) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.log('Network failed, trying cache for:', request.url, error);
        
        const cacheResponse = await caches.match(request);
        if (cacheResponse) {
            return cacheResponse;
        }
        
        return new Response(
            JSON.stringify({ 
                error: 'Network unavailable', 
                offline: true,
                message: 'Please check your internet connection and try again.'
            }), 
            { 
                status: 503,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}

// Network First with Fallback - good for API requests
async function networkFirstWithFallback(request) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.status === 200) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
            return networkResponse;
        } else {
            throw new Error(`Network response ${networkResponse.status}`);
        }
    } catch (error) {
        console.log('API request failed, trying cache:', request.url, error);
        
        const cacheResponse = await caches.match(request);
        if (cacheResponse) {
            // Add offline indicator to cached response
            const data = await cacheResponse.json();
            data._offline = true;
            data._cachedAt = new Date().toISOString();
            
            return new Response(JSON.stringify(data), {
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        // Return offline fallback data for cryptocurrency APIs
        return createOfflineFallback(request);
    }
}

// Stale While Revalidate - good for market data that can be slightly stale
async function staleWhileRevalidate(request) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cacheResponse = await cache.match(request);
    
    // Fetch fresh data in background
    const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    }).catch(() => {
        // Network failed, return cached version if available
        return cacheResponse;
    });
    
    // Return cached version immediately if available, otherwise wait for network
    return cacheResponse || fetchPromise;
}

// Create offline fallback data for cryptocurrency APIs
function createOfflineFallback(request) {
    const url = new URL(request.url);
    
    // Mock data for different API endpoints
    if (url.pathname.includes('price')) {
        return new Response(JSON.stringify({
            mwb: {
                usd: 0.125,
                usd_24h_change: 5.2,
                last_updated_at: Date.now() / 1000
            },
            _offline: true,
            _message: 'Offline data - prices may not be current'
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    if (url.pathname.includes('market')) {
        return new Response(JSON.stringify({
            market_data: {
                current_price: { usd: 0.125 },
                market_cap: { usd: 125000000 },
                total_volume: { usd: 5000000 },
                price_change_percentage_24h: 5.2
            },
            _offline: true,
            _message: 'Offline data - market data may not be current'
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    // Generic offline response
    return new Response(JSON.stringify({
        error: 'Service unavailable offline',
        _offline: true,
        message: 'This feature requires an internet connection.'
    }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
    });
}

// Background Sync for when connection is restored
self.addEventListener('sync', (event) => {
    console.log('🔄 Background sync triggered:', event.tag);
    
    if (event.tag === 'crypto-data-sync') {
        event.waitUntil(syncCryptoData());
    }
    
    if (event.tag === 'wallet-operations-sync') {
        event.waitUntil(syncWalletOperations());
    }
});

// Sync cryptocurrency data when connection is restored
async function syncCryptoData() {
    try {
        console.log('📊 Syncing cryptocurrency data...');
        
        // Fetch latest market data
        const marketDataResponse = await fetch('/api/market-data');
        if (marketDataResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put('/api/market-data', marketDataResponse.clone());
        }
        
        // Fetch latest price data
        const priceDataResponse = await fetch('/api/price-data');
        if (priceDataResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put('/api/price-data', priceDataResponse.clone());
        }
        
        // Notify clients that data has been synced
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'DATA_SYNCED',
                data: 'Cryptocurrency data updated'
            });
        });
        
        console.log('✅ Cryptocurrency data synced successfully');
    } catch (error) {
        console.error('❌ Failed to sync cryptocurrency data:', error);
    }
}

// Sync pending wallet operations when connection is restored
async function syncWalletOperations() {
    try {
        console.log('💰 Syncing pending wallet operations...');
        
        // Get pending operations from IndexedDB or localStorage
        const pendingOperations = await getPendingOperations();
        
        for (const operation of pendingOperations) {
            try {
                await processWalletOperation(operation);
                await removePendingOperation(operation.id);
            } catch (error) {
                console.error('Failed to process operation:', operation.id, error);
            }
        }
        
        // Notify clients that operations have been synced
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'OPERATIONS_SYNCED',
                data: `${pendingOperations.length} operations processed`
            });
        });
        
        console.log('✅ Wallet operations synced successfully');
    } catch (error) {
        console.error('❌ Failed to sync wallet operations:', error);
    }
}

// Get pending operations (placeholder - would use IndexedDB in production)
async function getPendingOperations() {
    // This would typically read from IndexedDB
    // For now, return empty array
    return [];
}

// Process a wallet operation
async function processWalletOperation(operation) {
    // This would process the actual wallet operation
    console.log('Processing operation:', operation);
}

// Remove a pending operation
async function removePendingOperation(operationId) {
    // This would remove the operation from IndexedDB
    console.log('Removing operation:', operationId);
}

// Push notification handler
self.addEventListener('push', (event) => {
    console.log('📬 Push notification received:', event);
    
    let data = {};
    if (event.data) {
        data = event.data.json();
    }
    
    const options = {
        title: data.title || 'Mac Wayne Battered Coin',
        body: data.body || 'New cryptocurrency update available',
        icon: '/assets/images/mwb-logo.png',
        badge: '/assets/images/mwb-badge.png',
        data: data.url || '/battered-coin.html',
        actions: [
            {
                action: 'view',
                title: 'View Details',
                icon: '/assets/images/view-icon.png'
            },
            {
                action: 'dismiss',
                title: 'Dismiss',
                icon: '/assets/images/dismiss-icon.png'
            }
        ],
        tag: 'crypto-update',
        requireInteraction: true,
        silent: false
    };
    
    event.waitUntil(
        self.registration.showNotification(options.title, options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    console.log('🔔 Notification clicked:', event);
    
    event.notification.close();
    
    if (event.action === 'view') {
        event.waitUntil(
            clients.openWindow(event.notification.data || '/battered-coin.html')
        );
    } else if (event.action === 'dismiss') {
        // Just close the notification
        return;
    } else {
        // Default action - open the app
        event.waitUntil(
            clients.openWindow('/battered-coin.html')
        );
    }
});

// Message handler for communication with main thread
self.addEventListener('message', (event) => {
    console.log('💬 Message received:', event.data);
    
    const { type, data } = event.data;
    
    switch (type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
            
        case 'CLAIM_CLIENTS':
            self.clients.claim();
            break;
            
        case 'CACHE_CRYPTO_DATA':
            cacheCryptoData(data);
            break;
            
        case 'CLEAR_CACHE':
            clearSpecificCache(data.cacheName);
            break;
            
        case 'GET_CACHE_STATUS':
            getCacheStatus().then(status => {
                event.ports[0].postMessage(status);
            });
            break;
    }
});

// Cache specific cryptocurrency data
async function cacheCryptoData(data) {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        const response = new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' }
        });
        await cache.put(data.url, response);
        console.log('✅ Cached crypto data for:', data.url);
    } catch (error) {
        console.error('❌ Failed to cache crypto data:', error);
    }
}

// Clear specific cache
async function clearSpecificCache(cacheName) {
    try {
        const deleted = await caches.delete(cacheName);
        console.log(`🗑️ Cache ${cacheName} deleted:`, deleted);
    } catch (error) {
        console.error('❌ Failed to clear cache:', error);
    }
}

// Get cache status
async function getCacheStatus() {
    try {
        const cacheNames = await caches.keys();
        const cacheStatus = {};
        
        for (const cacheName of cacheNames) {
            const cache = await caches.open(cacheName);
            const keys = await cache.keys();
            cacheStatus[cacheName] = {
                entries: keys.length,
                urls: keys.map(key => key.url)
            };
        }
        
        return cacheStatus;
    } catch (error) {
        console.error('❌ Failed to get cache status:', error);
        return {};
    }
}

// Periodic cleanup of old cache entries
setInterval(async () => {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        const keys = await cache.keys();
        
        for (const request of keys) {
            const response = await cache.match(request);
            const cachedDate = new Date(response.headers.get('date'));
            const now = new Date();
            const hoursDiff = (now - cachedDate) / (1000 * 60 * 60);
            
            // Remove entries older than 24 hours
            if (hoursDiff > 24) {
                await cache.delete(request);
                console.log('🗑️ Removed old cache entry:', request.url);
            }
        }
    } catch (error) {
        console.error('❌ Cache cleanup failed:', error);
    }
}, 1000 * 60 * 60); // Run every hour

console.log('🚀 Mac Wayne Crypto Service Worker loaded successfully');
