// Fixed Audio Player with Track Display
document.addEventListener('DOMContentLoaded', function() {
    let currentAudio = null;
    let currentTrackElement = null;
    
    // Create track display
    const trackDisplay = document.createElement('div');
    trackDisplay.id = 'current-track-display';
    trackDisplay.innerHTML = `
        <div class="track-info">
            <div class="track-title">Select a track to play</div>
            <div class="track-artist">Mac Wayne</div>
        </div>
        <div class="track-controls">
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
            <div class="time-display">
                <span class="current-time">0:00</span> / <span class="duration">0:00</span>
            </div>
        </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        #current-track-display {
            background: #333;
            padding: 15px;
            margin: 10px 0;
            border-radius: 8px;
            color: white;
        }
        .track-info .track-title { font-weight: bold; font-size: 1.1em; }
        .track-info .track-artist { color: #ccc; font-size: 0.9em; }
        .progress-bar {
            background: #555;
            height: 4px;
            border-radius: 2px;
            margin: 10px 0 5px 0;
            position: relative;
        }
        .progress-fill {
            background: #cc0000;
            height: 100%;
            border-radius: 2px;
            width: 0%;
            transition: width 0.1s;
        }
        .time-display {
            font-size: 0.8em;
            color: #ccc;
        }
        .paypal-container {
            display: none;
            background: #444;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
            text-align: center;
        }
        .paypal-container h3 {
            color: #fff;
            margin-bottom: 10px;
        }
        .paypal-container p {
            color: #ccc;
            margin-bottom: 15px;
        }
    `;
    document.head.appendChild(style);
    
    // Insert display after album description
    const albumDesc = document.querySelector('.album-description');
    if (albumDesc) {
        albumDesc.parentNode.insertBefore(trackDisplay, albumDesc.nextSibling);
    }
    
    // Load PayPal SDK (sandbox for testing)
    const paypalScript = document.createElement('script');
    paypalScript.src = 'https://www.paypal.com/sdk/js?client-id=AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8aqX3PiV8e1GWU6liB2CUXlkA59kJXE7M6R&currency=USD';
    paypalScript.onload = setupPayPalButtons;
    document.head.appendChild(paypalScript);
    
    // Setup purchase buttons
    document.querySelectorAll('.purchase-track').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const trackItem = btn.closest('.track-item');
            const trackId = trackItem.dataset.id;
            const trackName = trackItem.querySelector('.track-name').textContent;
            
            // Create inline PayPal modal
            showPayPalModal('track', trackName, trackId, '1.50');
        });
    });
    
    // Setup album purchase button
    document.querySelector('.purchase-album').addEventListener('click', function(e) {
        e.preventDefault();
        showPayPalModal('album', 'Blind and Battered Album (20 tracks)', 'album', '14.99');
    });
    
    // Setup play buttons
    document.querySelectorAll('.mini-play-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const trackItem = btn.closest('.track-item');
            const trackName = trackItem.querySelector('.track-name').textContent;
            const sampleSrc = trackItem.dataset.src;
            
            // Stop current audio
            if (currentAudio) {
                currentAudio.pause();
                currentAudio = null;
            }
            
            // Reset all buttons
            document.querySelectorAll('.mini-play-btn').forEach(b => b.innerHTML = '▶ Play');
            document.querySelectorAll('.track-item').forEach(t => t.classList.remove('playing'));
            
            // Update display
            trackDisplay.querySelector('.track-title').textContent = trackName;
            btn.innerHTML = '⏳ Loading...';
            trackItem.classList.add('playing');
            currentTrackElement = trackItem;
            
            // Use actual sample files
            currentAudio = new Audio(sampleSrc);
            
            currentAudio.addEventListener('canplay', () => {
                btn.innerHTML = '⏸️ Playing';
                currentAudio.play().then(() => {
                    // Update progress every 100ms
                    const progressInterval = setInterval(() => {
                        if (!currentAudio || currentAudio.paused) {
                            clearInterval(progressInterval);
                            return;
                        }
                        
                        const current = currentAudio.currentTime;
                        const progressFill = trackDisplay.querySelector('.progress-fill');
                        const currentTimeEl = trackDisplay.querySelector('.current-time');
                        
                        if (progressFill) progressFill.style.width = (current / 30 * 100) + '%';
                        if (currentTimeEl) currentTimeEl.textContent = formatTime(current);
                        
                        // Stop at 30 seconds
                        if (current >= 30) {
                            currentAudio.pause();
                            clearInterval(progressInterval);
                            btn.innerHTML = '▶ Play';
                            trackItem.classList.remove('playing');
                            alert(`Preview ended for "${trackName}". Purchase full track ($1.50) or album ($14.99).`);
                        }
                    }, 100);
                }).catch(error => {
                    console.error('Play failed:', error);
                    btn.innerHTML = '❌ Error';
                    setTimeout(() => {
                        btn.innerHTML = '▶ Play';
                        trackItem.classList.remove('playing');
                    }, 2000);
                });
            });
            
            currentAudio.addEventListener('error', (e) => {
                console.error('Audio error:', e);
                btn.innerHTML = '❌ Error';
                setTimeout(() => {
                    btn.innerHTML = '▶ Play';
                    trackItem.classList.remove('playing');
                }, 2000);
            });
            
            currentAudio.addEventListener('ended', () => {
                btn.innerHTML = '▶ Play';
                trackItem.classList.remove('playing');
            });
            
            currentAudio.load();
        });
    });
    
    function updateProgress() {
        const durationEl = trackDisplay.querySelector('.duration');
        if (durationEl) {
            durationEl.textContent = '0:30';
        }
    }
    
    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return mins + ':' + (secs < 10 ? '0' : '') + secs;
    }
    
    function showPayPalModal(type, itemName, itemId, price) {
        // Remove existing modal
        const existingModal = document.getElementById('paypal-modal');
        if (existingModal) existingModal.remove();
        
        // Create modal
        const modal = document.createElement('div');
        modal.id = 'paypal-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="closePayPalModal()">
                <div class="modal-content" onclick="event.stopPropagation()">
                    <div class="modal-header">
                        <h3>Purchase ${itemName}</h3>
                        <span class="close-btn" onclick="closePayPalModal()">&times;</span>
                    </div>
                    <div class="modal-body">
                        <p>Price: $${price}</p>
                        <div id="paypal-button-container-${type}"></div>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal styles
        const modalStyle = document.createElement('style');
        modalStyle.textContent = `
            #paypal-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                z-index: 10000;
                overflow: hidden;
            }
            .modal-overlay {
                background: rgba(0,0,0,0.8);
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                position: fixed;
                top: 0;
                left: 0;
            }
            .modal-content {
                background: #333;
                padding: 20px;
                border-radius: 10px;
                max-width: 400px;
                width: 90%;
                color: white;
            }
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }
            .close-btn {
                font-size: 24px;
                cursor: pointer;
                color: #ccc;
            }
            .modal-body p {
                font-size: 18px;
                margin-bottom: 20px;
                text-align: center;
            }
        `;
        
        document.head.appendChild(modalStyle);
        document.body.appendChild(modal);
        
        // Prevent body scrolling
        document.body.style.overflow = 'hidden';
        
        // Setup PayPal button in modal
        if (window.paypal) {
            window.paypal.Buttons({
                createOrder: (data, actions) => {
                    return actions.order.create({
                        purchase_units: [{
                            amount: { 
                                value: price,
                                currency_code: 'USD'
                            },
                            description: `Mac Wayne - ${itemName}`
                        }]
                    });
                },
                onApprove: (data, actions) => {
                    return actions.order.capture().then(details => {
                        console.log('Payment successful:', details);
                        if (type === 'album') {
                            localStorage.setItem('albumPurchased', 'true');
                            alert('Album purchased successfully! All tracks unlocked.');
                        } else {
                            const purchased = JSON.parse(localStorage.getItem('purchasedTracks') || '[]');
                            if (!purchased.includes(itemId)) {
                                purchased.push(itemId);
                                localStorage.setItem('purchasedTracks', JSON.stringify(purchased));
                            }
                            alert('Track purchased successfully!');
                        }
                        closePayPalModal();
                        location.reload();
                    });
                },
                onError: (err) => {
                    console.error('PayPal error:', err);
                    alert('Payment failed. Please try again.');
                }
            }).render(`#paypal-button-container-${type}`);
        }
    }
    
    window.closePayPalModal = function() {
        const modal = document.getElementById('paypal-modal');
        if (modal) {
            modal.remove();
            // Restore body scrolling
            document.body.style.overflow = '';
        }
    }
    
    function setupPayPalButtons() {
        // PayPal buttons are now handled in the modal
    }
    
    console.log('Fixed audio player loaded');
});