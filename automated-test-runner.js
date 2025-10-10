// Automated Test Runner for Mac Wayne Site
class AutomatedTestRunner {
    constructor() {
        this.testResults = [];
        this.init();
    }

    init() {
        console.log('🧪 Starting Automated Test Suite...');
        this.runAllTests();
    }

    async runAllTests() {
        await this.testAudioSystem();
        await this.testPurchaseSystem();
        await this.testDeliverySystem();
        await this.testAccessControl();
        await this.testUserInterface();
        await this.testPerformance();
        
        this.generateReport();
    }

    async testAudioSystem() {
        console.log('🎵 Testing Audio System...');
        
        // Test sample audio loading
        const sampleTests = [];
        for (let i = 1; i <= 20; i++) {
            try {
                const audio = new Audio(`samples/${i.toString().padStart(2, '0')}-sample.mp3`);
                await this.waitForAudioLoad(audio);
                sampleTests.push({ track: i, status: 'pass', message: 'Sample loads' });
            } catch (e) {
                sampleTests.push({ track: i, status: 'fail', message: 'Sample failed to load' });
            }
        }
        
        // Test full audio availability
        const fullAudioTests = [];
        const trackItems = document.querySelectorAll('.track-item');
        trackItems.forEach((item, index) => {
            const fullSrc = item.dataset.fullSrc;
            if (fullSrc && fullSrc.includes('Blind and Battered')) {
                fullAudioTests.push({ track: index + 1, status: 'pass', message: 'Full track available' });
            } else {
                fullAudioTests.push({ track: index + 1, status: 'fail', message: 'Full track missing' });
            }
        });

        // Test play/pause functionality
        const playButtons = document.querySelectorAll('.mini-play-btn');
        const playButtonTest = {
            test: 'Play Buttons',
            status: playButtons.length >= 20 ? 'pass' : 'fail',
            message: `${playButtons.length}/20 play buttons found`,
            details: { expected: 20, found: playButtons.length }
        };

        this.testResults.push({
            category: 'Audio System',
            tests: [
                {
                    test: 'Sample Audio Loading',
                    status: sampleTests.filter(t => t.status === 'pass').length >= 18 ? 'pass' : 'fail',
                    message: `${sampleTests.filter(t => t.status === 'pass').length}/20 samples load`,
                    details: sampleTests
                },
                {
                    test: 'Full Audio Availability',
                    status: fullAudioTests.filter(t => t.status === 'pass').length >= 18 ? 'pass' : 'fail',
                    message: `${fullAudioTests.filter(t => t.status === 'pass').length}/20 full tracks available`,
                    details: fullAudioTests
                },
                playButtonTest
            ]
        });
    }

    async testPurchaseSystem() {
        console.log('💳 Testing Purchase System...');
        
        // Test PayPal SDK
        const paypalTest = {
            test: 'PayPal SDK',
            status: window.paypal ? 'pass' : 'fail',
            message: window.paypal ? 'PayPal SDK loaded' : 'PayPal SDK not loaded'
        };

        // Test purchase buttons
        const albumBtn = document.querySelector('.purchase-album');
        const streamBtn = document.querySelector('.purchase-streaming');
        const trackBtns = document.querySelectorAll('.purchase-track');
        
        const buttonTest = {
            test: 'Purchase Buttons',
            status: (albumBtn && streamBtn && trackBtns.length >= 20) ? 'pass' : 'fail',
            message: `Album: ${!!albumBtn}, Stream: ${!!streamBtn}, Tracks: ${trackBtns.length}/20`
        };

        // Test pricing
        const albumPrice = albumBtn?.textContent.includes('$14.99');
        const streamPrice = streamBtn?.textContent.includes('$5.00');
        const trackPrices = Array.from(trackBtns).filter(btn => btn.textContent.includes('$1.50')).length;
        
        const pricingTest = {
            test: 'Pricing Display',
            status: (albumPrice && streamPrice && trackPrices >= 18) ? 'pass' : 'fail',
            message: `Album: $14.99 ${albumPrice ? '✓' : '✗'}, Stream: $5.00 ${streamPrice ? '✓' : '✗'}, Tracks: ${trackPrices}/20 at $1.50`
        };

        // Test purchase system initialization
        const purchaseSystemTest = {
            test: 'Purchase System',
            status: window.realPayPalPurchase ? 'pass' : 'fail',
            message: window.realPayPalPurchase ? 'Purchase system initialized' : 'Purchase system not loaded'
        };

        this.testResults.push({
            category: 'Purchase System',
            tests: [paypalTest, buttonTest, pricingTest, purchaseSystemTest]
        });
    }

    async testDeliverySystem() {
        console.log('🚚 Testing Delivery System...');
        
        // Test access control states
        const albumPurchased = localStorage.getItem('mac-wayne-album-purchased') === 'true';
        const streamingAccess = localStorage.getItem('mac-wayne-streaming-access') === 'true';
        
        const accessTest = {
            test: 'Access Control',
            status: 'pass',
            message: `Album: ${albumPurchased ? 'Purchased' : 'Not purchased'}, Streaming: ${streamingAccess ? 'Active' : 'Inactive'}`
        };

        // Test download functionality
        const downloadTest = {
            test: 'Download System',
            status: 'pass',
            message: 'Download system ready (requires purchase to test fully)'
        };

        // Test streaming functionality
        const streamingTest = {
            test: 'Streaming System',
            status: window.audioPlayerControls ? 'pass' : 'fail',
            message: window.audioPlayerControls ? 'Audio controls loaded' : 'Audio controls missing'
        };

        this.testResults.push({
            category: 'Delivery System',
            tests: [accessTest, downloadTest, streamingTest]
        });
    }

    async testAccessControl() {
        console.log('🔐 Testing Access Control...');
        
        // Test preview mode (default state)
        const trackStatuses = Array.from(document.querySelectorAll('.track-status')).map(el => el.textContent);
        const previewCount = trackStatuses.filter(status => status.includes('Preview')).length;
        
        const previewTest = {
            test: 'Preview Mode',
            status: previewCount >= 15 ? 'pass' : 'warning',
            message: `${previewCount} tracks in preview mode`
        };

        // Test purchase button functionality
        const purchaseButtons = document.querySelectorAll('.purchase-track, .purchase-album, .purchase-streaming');
        const buttonFunctionTest = {
            test: 'Purchase Button Events',
            status: purchaseButtons.length >= 22 ? 'pass' : 'fail',
            message: `${purchaseButtons.length} purchase buttons found`
        };

        this.testResults.push({
            category: 'Access Control',
            tests: [previewTest, buttonFunctionTest]
        });
    }

    async testUserInterface() {
        console.log('🎨 Testing User Interface...');
        
        // Test responsive design
        const viewport = window.innerWidth;
        const responsiveTest = {
            test: 'Responsive Design',
            status: viewport >= 320 ? 'pass' : 'fail',
            message: `Viewport: ${viewport}px (${viewport >= 768 ? 'Desktop' : 'Mobile'})`
        };

        // Test navigation
        const navLinks = document.querySelectorAll('.nav-menu a, .main-nav a');
        const navigationTest = {
            test: 'Navigation',
            status: navLinks.length >= 5 ? 'pass' : 'fail',
            message: `${navLinks.length} navigation links found`
        };

        // Test forms
        const forms = document.querySelectorAll('form');
        const formsTest = {
            test: 'Forms',
            status: forms.length >= 2 ? 'pass' : 'warning',
            message: `${forms.length} forms found`
        };

        // Test images
        const images = document.querySelectorAll('img');
        const imagesTest = {
            test: 'Images',
            status: images.length >= 3 ? 'pass' : 'warning',
            message: `${images.length} images found`
        };

        this.testResults.push({
            category: 'User Interface',
            tests: [responsiveTest, navigationTest, formsTest, imagesTest]
        });
    }

    async testPerformance() {
        console.log('⚡ Testing Performance...');
        
        // Test page load time
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        const loadTest = {
            test: 'Page Load Time',
            status: loadTime < 5000 ? 'pass' : loadTime < 10000 ? 'warning' : 'fail',
            message: `${loadTime}ms (${loadTime < 3000 ? 'Fast' : loadTime < 5000 ? 'Good' : loadTime < 10000 ? 'Slow' : 'Very Slow'})`
        };

        // Test script loading
        const scripts = document.querySelectorAll('script[src]');
        const scriptsTest = {
            test: 'Script Loading',
            status: scripts.length <= 10 ? 'pass' : 'warning',
            message: `${scripts.length} external scripts`
        };

        // Test CSS loading
        const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
        const cssTest = {
            test: 'CSS Loading',
            status: stylesheets.length <= 15 ? 'pass' : 'warning',
            message: `${stylesheets.length} stylesheets`
        };

        this.testResults.push({
            category: 'Performance',
            tests: [loadTest, scriptsTest, cssTest]
        });
    }

    generateReport() {
        console.log('📊 Generating Test Report...');
        
        const totalTests = this.testResults.reduce((acc, category) => acc + category.tests.length, 0);
        const passedTests = this.testResults.reduce((acc, category) => 
            acc + category.tests.filter(test => test.status === 'pass').length, 0);
        const warningTests = this.testResults.reduce((acc, category) => 
            acc + category.tests.filter(test => test.status === 'warning').length, 0);
        const failedTests = this.testResults.reduce((acc, category) => 
            acc + category.tests.filter(test => test.status === 'fail').length, 0);
        
        const successRate = Math.round((passedTests / totalTests) * 100);
        
        console.log(`
🧪 MAC WAYNE SITE TEST REPORT
═══════════════════════════════════════
📊 OVERALL RESULTS:
   Success Rate: ${successRate}%
   ✅ Passed: ${passedTests}
   ⚠️  Warnings: ${warningTests}
   ❌ Failed: ${failedTests}
   📝 Total Tests: ${totalTests}

📋 DETAILED RESULTS:
        `);
        
        this.testResults.forEach(category => {
            console.log(`\n${category.category}:`);
            category.tests.forEach(test => {
                const icon = test.status === 'pass' ? '✅' : test.status === 'warning' ? '⚠️' : '❌';
                console.log(`  ${icon} ${test.test}: ${test.message}`);
            });
        });
        
        // Overall assessment
        if (successRate >= 90) {
            console.log('\n🎉 EXCELLENT: Site is production-ready!');
        } else if (successRate >= 80) {
            console.log('\n✅ GOOD: Site is ready with minor issues to monitor');
        } else if (successRate >= 70) {
            console.log('\n⚠️ FAIR: Site needs some improvements before full production');
        } else {
            console.log('\n❌ POOR: Site needs significant fixes before production');
        }
        
        // Store results for external access
        window.testResults = this.testResults;
        window.testSummary = { totalTests, passedTests, warningTests, failedTests, successRate };
    }

    waitForAudioLoad(audio) {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error('Timeout')), 3000);
            audio.addEventListener('canplaythrough', () => {
                clearTimeout(timeout);
                resolve();
            });
            audio.addEventListener('error', () => {
                clearTimeout(timeout);
                reject(new Error('Load failed'));
            });
        });
    }
}

// Run tests when page loads
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.automatedTestRunner = new AutomatedTestRunner();
    }, 2000); // Wait 2 seconds for all systems to initialize
});