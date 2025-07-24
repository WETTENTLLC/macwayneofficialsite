// === DEBUG PANEL ===
function showDebugPanel(message, type = 'info') {
    let panel = document.getElementById('audio-debug-panel');
    if (!panel) {
        panel = document.createElement('div');
        panel.id = 'audio-debug-panel';
        panel.setAttribute('role', 'status');
        panel.setAttribute('aria-live', 'polite');
        panel.style.position = 'fixed';
        panel.style.bottom = '10px';
        panel.style.right = '10px';
        panel.style.background = 'rgba(0,0,0,0.85)';
        panel.style.color = '#fff';
        panel.style.padding = '12px 18px';
        panel.style.borderRadius = '8px';
        panel.style.zIndex = '99999';
        panel.style.fontSize = '1rem';
        panel.style.maxWidth = '350px';
        panel.style.boxShadow = '0 2px 12px #000';
        panel.style.pointerEvents = 'none';
        // Add forced-colors support for accessibility
        panel.style.setProperty('border', '2px solid transparent');
        panel.style.setProperty('outline', 'none');
        panel.style.setProperty('background-clip', 'padding-box');
        // Add a class for forced-colors styling
        panel.classList.add('audio-debug-panel');
        document.body.appendChild(panel);
    }
    panel.innerHTML = `<strong>Audio Player Debug:</strong><br>${message}`;
    panel.style.display = 'block';
    if (type === 'error') panel.style.background = '#b71c1c';
    else if (type === 'warn') panel.style.background = '#fbc02d';
    else panel.style.background = 'rgba(0,0,0,0.85)';
    setTimeout(() => { panel.style.display = 'none'; }, 8000);
    // Forced-colors accessibility: ensure panel is visible and readable
    if (window.matchMedia('(forced-colors: active)').matches) {
        panel.style.background = 'WindowText';
        panel.style.color = 'Window';
        panel.style.borderColor = 'Highlight';
        panel.style.outline = '2px solid Highlight';
        panel.style.boxShadow = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("[PLAYER] DOMContentLoaded event fired.");

    // Element checks
    const albumArt = document.getElementById('album-art');
    const trackTitle = document.getElementById('track-title');
    const audioElement = document.getElementById('audio-element');
    const playPauseButton = document.getElementById('play-pause-button');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeDisplay = document.getElementById('current-time');
    const durationDisplay = document.getElementById('duration');
    const volumeControl = document.getElementById('volume-control');
    const playlistElement = document.getElementById('playlist');
    const buyAlbumButton = document.getElementById('buy-album-paypal');

    const requiredElements = [
        { el: albumArt, id: 'album-art' },
        { el: trackTitle, id: 'track-title' },
        { el: audioElement, id: 'audio-element' },
        { el: playPauseButton, id: 'play-pause-button' },
        { el: prevButton, id: 'prev-button' },
        { el: nextButton, id: 'next-button' },
        { el: progressBar, id: 'progress-bar' },
        { el: currentTimeDisplay, id: 'current-time' },
        { el: durationDisplay, id: 'duration' },
        { el: volumeControl, id: 'volume-control' },
        { el: playlistElement, id: 'playlist' },
        { el: buyAlbumButton, id: 'buy-album-paypal' }
    ];
    const missing = requiredElements.filter(function(e) { return !e.el; }).map(function(e) { return e.id; });
    if (missing.length > 0) {
        var msg = 'Missing required audio player elements: ' + missing.join(', ') + '. Please check spelling and IDs in your HTML.';
        showDebugPanel(msg, 'error');
        console.error('[PLAYER] ' + msg);
    }

    let currentTrackIndex = 0;
    let tracks = [];
    let isPlaying = false;
    let userId = null; // Will be fetched or generated

    const ALBUM_NAME = "Blind and Battered [Explicit]";
    const ALBUM_PRICE = "25.00";
    const TRACK_PRICE = "2.00";
    const CURRENCY = "USD";
    // Live PayPal Client ID for production payments

    // === SERVER BASE URL (dynamic for local/live) ===
    const isLocal = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';
    const SERVER_BASE_URL = isLocal ? 'http://localhost:3000' : 'https://macwayneofficial.com';

    // Function to get or generate a unique user ID
    async function initUser() {
        console.log("[PLAYER] initUser: Started");
        userId = localStorage.getItem('macWayneUserId');
        if (!userId) {
            // In a real app, this might involve a server call for better user tracking
            // For now, generate a UUID on the client.
            // A call to a backend endpoint like /get-user-id would be more robust
            // For simplicity, we'll use a client-side generated UUID.
            // This should ideally be fetched from a backend that manages user sessions.
            userId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            localStorage.setItem('macWayneUserId', userId);
        }
        console.log("[PLAYER] initUser: User ID:", userId);
        await loadUserPurchases();
        console.log("[PLAYER] initUser: Finished");
    }


    // Function to fetch track list from the server (or use a predefined list)
    async function fetchTracks() {
        console.log("[PLAYER] fetchTracks: Started");
        const audioFiles = [
            '01 - Gotta Split [Explicit].mp3',
            '02 - I Think [Explicit].mp3',
            '03 - Keep Your Mouth Shut (Skit) [Explicit].mp3',
            '04 - Just a Player [Explicit].mp3',
            '05 - Ziplocks [Explicit].mp3',
            '06 - Where You Been (Skit) [Explicit].mp3',
            '07 - Cant Tell Me [Explicit].mp3',
            '08 - Just a Gimmick [Explicit].mp3',
            '09 - Wish I Knew Then [Explicit].mp3',
            '10 - Blind and Battered [Explicit].mp3',
            '11 - Smoother Than Woodgrain [Explicit].mp3',
            '12 - Touch You [Explicit].mp3',
            '13 - Life of Magic [Explicit].mp3',
            '14 - Its Going Down [Explicit].mp3',
            '15 - One Way In [Explicit].mp3',
            '16 - Crispy Game [Explicit].mp3',
            '17 - The End of the World [Explicit].mp3',
            '18 - Smell of Victory [Explicit].mp3',
            '19 - Do the I\'m the Shit [Explicit].mp3', // Fixed apostrophe to match actual file
            '20 - Hatin On a Blind Man [Explicit].mp3'
        ];
        const albumFolder = "Blind and Battered [Explicit]";
        tracks = audioFiles.map((file, index) => {
            const trackName = file.replace(/\.mp3$/, '').replace(/^\d+\s*-\s*/, '');
            const trackNumber = String(index + 1).padStart(2, '0'); // Convert to 01, 02, etc.
            return {
                name: trackName,
                id: file, // Use filename as a unique ID for the track
                srcFull: `${SERVER_BASE_URL}/public/audio/${encodeURIComponent(albumFolder)}/${encodeURIComponent(file)}`,
                // Use sample files from the samples folder with correct naming
                srcSample: `${SERVER_BASE_URL}/public/audio/${encodeURIComponent(albumFolder)}/samples/${encodeURIComponent(trackNumber + '-sample.mp3')}`,
                purchased: false // Default to not purchased
            };
        });

        console.log("[PLAYER] fetchTracks: Tracks mapped:", tracks.length, "tracks");
        await loadUserPurchases(); // Load purchase status after fetching tracks
        renderPlaylist();
        if (tracks.length > 0) {
            loadTrack(currentTrackIndex);
        }
        console.log("[PLAYER] fetchTracks: Finished");

        if (!tracks || tracks.length === 0) {
            showDebugPanel('No tracks found. Please check your audio files in public/audio/Blind and Battered [Explicit]/', 'error');
        }
    }

    // Create PayPal payment using PayPal SDK
    function initiatePayPalPayment(itemId, itemType, itemName, amount, currency) {
        console.log(`Initiating PayPal payment for ${itemType}: ${itemName} ($${amount} ${currency})`);
        
        // Check if PayPal SDK is loaded
        if (typeof paypal === 'undefined') {
            alert('PayPal payment system is not available. Please refresh the page and try again.');
            return;
        }
        
        console.log('PayPal SDK loaded. Available methods:', Object.keys(paypal));
        
        // Get user email for download delivery
        const userEmail = prompt("Enter your email address for download delivery:") || "";
        
        if (!userEmail || !userEmail.includes('@')) {
            alert("Please enter a valid email address to receive your download links.");
            return;
        }

        // Create a modal for PayPal payment with bulletproof styling
        const paypalModal = document.createElement('div');
        paypalModal.id = 'paypal-payment-modal-' + Date.now(); // Unique ID
        
        // Apply ALL styles inline to override any CSS conflicts
        Object.assign(paypalModal.style, {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'fixed',
            zIndex: '1000000', // High but not maximum - allow PayPal popups above
            left: '0',
            top: '0',
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.8)', // Less opaque to be less intrusive
            overflow: 'auto',
            fontFamily: 'Arial, sans-serif',
            transform: 'none', // Prevent any transforms
            margin: '0',
            padding: '20px',
            boxSizing: 'border-box'
        });
        
        // Force position after creation
        paypalModal.style.setProperty('position', 'fixed', 'important');
        paypalModal.style.setProperty('top', '0px', 'important');
        paypalModal.style.setProperty('left', '0px', 'important');
        paypalModal.style.setProperty('display', 'flex', 'important');
        paypalModal.style.setProperty('align-items', 'center', 'important');
        paypalModal.style.setProperty('justify-content', 'center', 'important');
        
        // Create a unique ID for the PayPal button container
        const buttonContainerId = 'paypal-button-container-modal-' + Date.now();
        paypalModal.innerHTML = `
            <div style="
                background-color: #ffffff;
                padding: 30px;
                border: 3px solid #007bff;
                border-radius: 10px;
                width: 90%;
                max-width: 500px;
                box-shadow: 0 10px 50px rgba(0, 0, 0, 0.9);
                text-align: center;
                color: #333;
                position: relative;
                margin: 0;
            ">
                <h2 style="color: #333; margin-bottom: 20px;">Complete Your Payment</h2>
                <button onclick="this.closest('div[id^=paypal-payment-modal]').remove(); document.body.style.overflow = 'auto';" style="
                    position: absolute;
                    right: 15px;
                    top: 15px;
                    background: #ff4444;
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 30px;
                    height: 30px;
                    cursor: pointer;
                    font-size: 18px;
                ">&times;</button>
                <div style="margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 5px;">
                    <h3 style="color: #333; margin: 10px 0;">
                    <p style="color: #666; margin: 5px 0; font-size: 18px; font-weight: bold;">Price: $${amount} ${currency}</p>
                    <p style="color: #666; margin: 5px 0;">Email: ${userEmail}</p>
                </div>
                <div style="margin: 15px 0; padding: 12px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; color: #856404; font-size: 14px;">
                    <strong>💡 Note:</strong> PayPal may open a login window in a popup. Please allow popups for this site and complete your payment in the PayPal window that opens.
                </div>
                <div id="${buttonContainerId}" style="
                    min-height: 120px;
                    background: #f0f0f0;
                    border: 2px dashed #ccc;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 20px 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">
                    <p style="color: #666; font-size: 16px;">Loading PayPal payment options...</p>
                </div>
            </div>
        `;
        
        // Add modal to page (don't block body scroll as aggressively to allow popup interaction)
        document.body.appendChild(paypalModal);
        
        // FORCE the modal position and centering after DOM insertion
        setTimeout(() => {
            paypalModal.style.setProperty('position', 'fixed', 'important');
            paypalModal.style.setProperty('top', '0px', 'important');
            paypalModal.style.setProperty('left', '0px', 'important');
            paypalModal.style.setProperty('display', 'flex', 'important');
            paypalModal.style.setProperty('align-items', 'center', 'important');
            paypalModal.style.setProperty('justify-content', 'center', 'important');
            paypalModal.style.setProperty('transform', 'none', 'important');
            paypalModal.style.setProperty('margin', '0px', 'important');
            console.log('FORCED modal position and centering');
        }, 10);
        
        console.log('PayPal modal created with bulletproof styling');
        console.log('Modal element in DOM:', document.getElementById(paypalModal.id));
        
        // Debug: Check if modal is actually visible
        setTimeout(() => {
            const modalRect = paypalModal.getBoundingClientRect();
            const computedStyle = window.getComputedStyle(paypalModal);
            
            console.log('=== MODAL DEBUG INFO ===');
            console.log('Modal position:', modalRect);
            console.log('Modal computed display:', computedStyle.display);
            console.log('Modal computed visibility:', computedStyle.visibility);
            console.log('Modal computed opacity:', computedStyle.opacity);
            console.log('Modal computed z-index:', computedStyle.zIndex);
            console.log('Modal offset dimensions:', {
                width: paypalModal.offsetWidth,
                height: paypalModal.offsetHeight,
                left: paypalModal.offsetLeft,
                top: paypalModal.offsetTop
            });
            
            // Check if any parent elements are hiding it
            let element = paypalModal;
            while (element.parentElement) {
                element = element.parentElement;
                const parentStyle = window.getComputedStyle(element);
                if (parentStyle.display === 'none' || parentStyle.visibility === 'hidden' || parentStyle.opacity === '0') {
                    console.log('FOUND HIDING PARENT:', element, {
                        display: parentStyle.display,
                        visibility: parentStyle.visibility,
                        opacity: parentStyle.opacity
                    });
                }
            }
            
            // Try to make modal even more visible
            paypalModal.style.backgroundColor = 'rgba(255, 0, 0, 0.9)'; // Red background for debugging
            paypalModal.style.border = '10px solid yellow'; // Yellow border for visibility
            
            alert(`Modal created! Check console for debug info. Modal dimensions: ${modalRect.width}x${modalRect.height}`);
        }, 1000);
        
        // Use PayPal SDK to create payment
        try {
            console.log('About to call paypal.Buttons()...');
            const paypalButtons = paypal.Buttons({
                style: {
                    layout: 'vertical',
                    color: 'blue',
                    shape: 'rect',
                    label: 'paypal',
                    height: 40
                },
                createOrder: function(data, actions) {
                    console.log('Creating PayPal order...');
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: amount,
                                currency_code: currency
                            },
                            description: `${itemType === 'track' ? 'Music Track' : 'Album'}: ${itemName}`,
                            custom_id: `${itemType}_${itemId}_${userEmail}`,
                            soft_descriptor: "Mac Wayne Music"
                        }]
                    });
                },
                onApprove: function(data, actions) {
                    return actions.order.capture().then(function(details) {
                        console.log('Payment successful!', details);
                        
                        // Store purchase info locally
                        const purchases = JSON.parse(localStorage.getItem('macwayne_purchases') || '[]');
                        purchases.push({
                            itemId,
                            itemType,
                            itemName,
                            purchaseDate: new Date().toISOString(),
                            orderId: details.id,
                            email: userEmail
                        });
                        localStorage.setItem('macwayne_purchases', JSON.stringify(purchases));
                        
                        // Call backend to process purchase and send email
                        processPurchaseOnServer(itemType, itemId, itemName, amount, currency, userEmail, details.id)
                            .then(() => {
                                console.log('Purchase processed on server, email sent');
                            })
                            .catch(error => {
                                console.error('Error processing purchase on server:', error);
                                // Still continue with local processing even if server fails
                            });
                        
                        // Close modal and restore body scroll
                        document.body.style.overflow = '';
                        paypalModal.remove();
                        
                        alert(`Payment successful! Thank you for purchasing ${itemName}. Download instructions will be sent to ${userEmail} shortly.`);
                        
                        // Refresh purchase status
                        loadUserPurchases();
                        
                        // If it's a track purchase, enable the track
                        if (itemType === 'track') {
                            const track = tracks.find(t => t.id === itemId);
                            if (track) {
                                track.purchased = true;
                                updatePlaylistDisplay();
                            }
                        }
                    });
                },
                onError: function(err) {
                    console.error('PayPal payment error:', err);
                    alert('Payment failed. Please try again or contact support.');
                    document.body.style.overflow = '';
                    paypalModal.remove();
                },
                onCancel: function(data) {
                    console.log('Payment cancelled:', data);
                    alert('Payment was cancelled.');
                    document.body.style.overflow = '';
                    paypalModal.remove();
                }
            });
            
            console.log('PayPal buttons object created, attempting to render...');
            paypalButtons.render('#' + buttonContainerId).then(function() {
                console.log('PayPal buttons rendered successfully!');
            }).catch(function(err) {
                console.error('PayPal render error:', err);
                alert('Error loading PayPal payment. Please try again.');
                document.body.style.overflow = '';
                paypalModal.remove();
            });
        } catch (error) {
            console.error('PayPal initialization error:', error);
            alert('Error initializing PayPal payment. Please try again.');
            document.body.style.overflow = '';
            paypalModal.remove();
        }
    }

    // Process purchase on server and send email
    async function processPurchaseOnServer(itemType, itemId, itemName, amount, currency, userEmail, orderId) {
        try {
            // Use ngrok endpoint first
            const serverEndpoints = [
                `${SERVER_BASE_URL}/webhook/paypal`,
                'https://macwayneofficial.com/webhook/paypal'
            ];
            
            const purchaseData = {
                itemType,
                itemId,
                itemName,
                amount,
                currency,
                userId: userId,
                userEmail,
                orderId,
                timestamp: new Date().toISOString()
            };
            
            console.log('Attempting to process purchase on server:', purchaseData);
            
            // Try each endpoint
            for (const endpoint of serverEndpoints) {
                try {
                    const response = await fetch(endpoint, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(purchaseData)
                    });
                    
                    if (response.ok) {
                        console.log('Purchase processed successfully on:', endpoint);
                        return true;
                    }
                } catch (error) {
                    console.log('Failed to reach:', endpoint, error.message);
                    continue;
                }
            }
            
            // If no server endpoint worked, create a mock email notification
            console.log('No server available, creating mock email notification');
            setTimeout(() => {
                if (userEmail) {
                    alert(`📧 Email Notification:\n\nHi there!\n\nYour purchase of "${itemName}" has been processed. Download links would normally be sent to ${userEmail}.\n\nSince the backend server is not running, please contact support for your download links.\n\nThank you for supporting Mac Wayne!`);
                }
            }, 2000);
            
        } catch (error) {
            console.error('Error processing purchase on server:', error);
            throw error;
        }
    }

    // Add download functionality for purchased items
    async function downloadPurchasedItem(itemType, itemId, purchaseId) {
        try {
            const downloadUrl = `${SERVER_BASE_URL}/download/${userId}/${purchaseId}`;
            
            // Create a temporary link to trigger download
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = itemId;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
        } catch (error) {
            console.error('Download error:', error);
            alert('Download failed. Please try again or contact support.');
        }
    }

    // Add download buttons to purchased tracks
    function addDownloadButton(trackElement, track, purchaseRecord) {
        const downloadBtn = document.createElement('button');
        downloadBtn.classList.add('download-btn');
        downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download';
        downloadBtn.onclick = (e) => {
            e.stopPropagation();
            downloadPurchasedItem('track', track.id, purchaseRecord.id);
        };
        trackElement.appendChild(downloadBtn);
    }

    // Function to load a track
    function loadTrack(index, autoplay = false) {
        console.log(`[PLAYER] loadTrack: Loading track index ${index}, autoplay: ${autoplay}`);
        if (index < 0 || index >= tracks.length) {
            console.warn(`[PLAYER] loadTrack: Invalid index ${index}`);
            return;
        }
        currentTrackIndex = index;
        const track = tracks[currentTrackIndex];
        
        albumArt.src = 'public/Images/macwayne-background.png'; // Update if dynamic art is needed
        trackTitle.textContent = track.name;
        console.log(`[PLAYER] Set audio source to: ${track.purchased ? track.srcFull : track.srcSample}`);
        const newSrc = track.purchased ? track.srcFull : track.srcSample;
        
        // Only update src and call load() if the source is different to prevent unnecessary reloads.
        if (audioElement.src !== newSrc) {
            audioElement.src = newSrc;
            audioElement.load(); // Force the browser to load the new audio source
        }
        
        audioElement.onloadedmetadata = () => {
            console.log(`[PLAYER] loadTrack: Metadata loaded for ${track.name}. Duration: ${audioElement.duration}`);
            progressBar.value = 0;
            progressBar.max = audioElement.duration;
            currentTimeDisplay.textContent = formatTime(0);
            durationDisplay.textContent = formatTime(audioElement.duration);
            updatePlayPauseButton();
            // If track is not purchased, limit playback to 30 seconds
            if (!track.purchased) {
                audioElement.ontimeupdate = () => {
                    // This check ensures the preview stops precisely at 30s
                    if (audioElement.currentTime >= 30) {
                        audioElement.pause();
                        audioElement.currentTime = 30;
                        // Optionally, display a message or prompt to purchase
                        console.log("Preview ended. Purchase to listen to the full track.");
                    }
                    updateProgressBar();
                };
            } else {
                // For purchased tracks, clear any previous preview limitation
                audioElement.ontimeupdate = updateProgressBar;
            }
            if (autoplay) {
                audioElement.play().catch(e => console.error("[PLAYER] Autoplay failed:", e)); // Corrected call
            }
        };
        renderPlaylist(); // Update playlist highlighting
        console.log(`[PLAYER] loadTrack: Finished loading ${track.name}`);

        audioElement.onerror = function(e) {
            showDebugPanel(`Audio failed to load: ${audioElement.src}. Check if the file exists and is accessible.`, 'error');
            console.error('[PLAYER] Audio load error:', audioElement.src, e);
        };
    }

    // Play or pause the audio
    function togglePlayPause() {
        console.log(`[PLAYER] togglePlayPause called. isPlaying: ${isPlaying}, src: '${audioElement.src || 'none'}'`);
        // If src is not set or points to the page itself, load the first track.
        if (!audioElement.src || audioElement.src === window.location.href) {
            console.warn("[PLAYER] No audio source loaded. Attempting to load initial track.");
            if (tracks.length > 0) {
                 loadTrack(currentTrackIndex, true); // Try to load the first track and play
            } else {
                showDebugPanel('No tracks available to play.', 'error');
            }
            return;
        }
        if (isPlaying) {
            audioElement.pause();
        } else {
            audioElement.play().catch(e => {
                showDebugPanel('Playback error: ' + e.message, 'error');
                console.error('[PLAYER] Playback error:', e);
            }); // Add error handling
        }
        // isPlaying state and button updates are now handled by the 'play' and 'pause' event listeners on the audio element.
    }

    // Function to update the Play/Pause button icon
    function updatePlayPauseButton() {
        if (!playPauseButton) return; // Guard clause
        const icon = playPauseButton.querySelector('i');
        if (isPlaying) {
            icon.classList.remove('fa-play');
            icon.classList.add('fa-pause');
            playPauseButton.setAttribute('aria-label', 'Pause Track');
        } else {
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-play');
            playPauseButton.setAttribute('aria-label', 'Play Track');
        }
    }

    // Play the previous track
    function prevTrack() {
        currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
        loadTrack(currentTrackIndex, isPlaying);
    }

    // Play the next track
    function nextTrack() {
        currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
        loadTrack(currentTrackIndex, isPlaying);
    }

    // Update the progress bar and current time display
    function updateProgressBar() {
        if (audioElement.duration) {
            progressBar.value = audioElement.currentTime;
            currentTimeDisplay.textContent = formatTime(audioElement.currentTime);
        }
    }

    // Format time in seconds to MM:SS
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Render playlist
    function renderPlaylist() {
        console.log("[PLAYER] renderPlaylist: Started. Number of tracks:", tracks.length);
        if (!playlistElement) {
            console.error("[PLAYER] renderPlaylist: Playlist element not found!");
            return;
        }
        playlistElement.innerHTML = ''; // Clear existing items
        if (!tracks || tracks.length === 0) {
            const msg = document.createElement('li');
            msg.textContent = 'No tracks found. Please check that your audio files are present in public/audio/Blind and Battered [Explicit]/';
            msg.style.color = '#ff4444';
            msg.style.fontWeight = 'bold';
            playlistElement.appendChild(msg);
            return;
        }
        const purchases = JSON.parse(localStorage.getItem(`purchases_${userId}`)) || { purchaseHistory: [] };
        
        tracks.forEach((track, index) => {
            const li = document.createElement('li');
            li.classList.add('playlist-item');
            if (index === currentTrackIndex) {
                li.classList.add('active');
            }

            // Create a span for the track name
            const nameSpan = document.createElement('span');
            nameSpan.classList.add('track-name');
            nameSpan.textContent = track.name;
            li.appendChild(nameSpan);

            li.addEventListener('click', () => {
                loadTrack(index, isPlaying);
            });

            if (track.purchased) {
                // Add download button for purchased tracks
                const purchaseRecord = purchases.purchaseHistory.find(p => 
                    p.itemType === 'track' && p.itemId === track.id
                );
                
                if (purchaseRecord) {
                    addDownloadButton(li, track, purchaseRecord);
                }
                
                const statusSpan = document.createElement('span');
                statusSpan.classList.add('purchased-status');
                statusSpan.textContent = 'Owned';
                statusSpan.style.color = '#4CAF50';
                statusSpan.style.fontWeight = 'bold';
                li.appendChild(statusSpan);
                li.classList.add('purchased');
            } else {
                const purchaseButton = document.createElement('button');
                purchaseButton.classList.add('buy-track-paypal');
                purchaseButton.textContent = `Buy Track ($${TRACK_PRICE})`;
                purchaseButton.onclick = (e) => {
                    e.stopPropagation(); // Prevent li click event
                    initiatePayPalPayment(track.id, 'track', track.name, TRACK_PRICE, CURRENCY);
                };
                li.appendChild(purchaseButton);
            }
            
            playlistElement.appendChild(li);
        });
        
        console.log("[PLAYER] renderPlaylist: Finished");

        if (!tracks || tracks.length === 0) {
            showDebugPanel('No tracks found. Please check your audio files in public/audio/Blind and Battered [Explicit]/', 'error');
        }
    }


    // Enhanced loadUserPurchases with local storage caching
    async function loadUserPurchases() {
        console.log("[PLAYER] loadUserPurchases: Started for user:", userId);
        if (!userId) {
            console.error("[PLAYER] loadUserPurchases: User ID not initialized.");
            return;
        }
        
        try {
            // Try to fetch from server first, but don't fail if server is not available
            let data = null;
            try {
                const response = await fetch(`${SERVER_BASE_URL}/user-purchases/${userId}`);
                if (response.ok) {
                    data = await response.json();
                    console.log("[PLAYER] loadUserPurchases: Data received from server:", data);
                    // Cache purchases in localStorage for quick access
                    localStorage.setItem(`purchases_${userId}`, JSON.stringify(data));
                } else {
                    console.log("[PLAYER] loadUserPurchases: Server endpoint not available, using local storage");
                }
            } catch (fetchError) {
                console.log("[PLAYER] loadUserPurchases: Server not available, using local storage:", fetchError.message);
            }
            
            // If server data not available, try local storage
            if (!data) {
                const localData = localStorage.getItem(`purchases_${userId}`);
                if (localData) {
                    data = JSON.parse(localData);
                    console.log("[PLAYER] loadUserPurchases: Using cached data from localStorage");
                } else {
                    // Initialize empty purchase data
                    data = { purchasedTracks: [], purchasedAlbums: [], purchaseHistory: [] };
                    console.log("[PLAYER] loadUserPurchases: No purchase data found, initializing empty");
                }
            }

            const albumPurchased = data.purchasedAlbums && data.purchasedAlbums.includes(ALBUM_NAME);

            tracks.forEach(track => {
                if (albumPurchased || (data.purchasedTracks && data.purchasedTracks.includes(track.id))) {
                    track.purchased = true;
                } else {
                    track.purchased = false; 
                }
            });
            
            console.log("[PLAYER] loadUserPurchases: Tracks updated with purchase info.");
            renderPlaylist(); 
            updateAlbumDownloadSection(); // Add this line
            if (tracks.length > 0) {
                loadTrack(currentTrackIndex, false); 
            }
            console.log("[PLAYER] loadUserPurchases: Finished");
        } catch (error) {
            console.error('Error loading user purchases:', error);
        }
    }


    // Initialization
    async function initializeApp() {
        console.log("[PLAYER] initializeApp: Started.");
        await initUser(); 
        await fetchTracks(); 
        updateAlbumDownloadSection(); // Add this line
        console.log("[PLAYER] initializeApp: Player setup potentially complete.");
        // Dark mode and other initializations
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', () => {
                document.body.classList.toggle('dark-mode');
                localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
            });
        }
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
            if (darkModeToggle) darkModeToggle.checked = true;
        }
        console.log("[PLAYER] initializeApp: Finished.");
    }

    // Buy album button functionality
    buyAlbumButton.addEventListener('click', () => {
        initiatePayPalPayment(ALBUM_NAME, 'album', `Album: ${ALBUM_NAME}`, ALBUM_PRICE, CURRENCY);
    });

    // Add album download section if album is purchased
    function updateAlbumDownloadSection() {
        const purchases = JSON.parse(localStorage.getItem(`purchases_${userId}`)) || { purchaseHistory: [], purchasedAlbums: [] };
        const albumPurchased = purchases.purchasedAlbums.includes(ALBUM_NAME);
        
        // Remove existing album download section
        const existingSection = document.querySelector('.album-download-section');
        if (existingSection) {
            existingSection.remove();
        }
        
        if (albumPurchased) {
            const albumPurchaseRecord = purchases.purchaseHistory.find(p => 
                p.itemType === 'album' && p.itemId === ALBUM_NAME
            );
            
            if (albumPurchaseRecord) {
                const downloadSection = document.createElement('div');
                downloadSection.classList.add('album-download-section');
                downloadSection.innerHTML = `
                    <h4><i class="fas fa-download"></i> Download Full Album</h4>
                    <p>You own the complete "${ALBUM_NAME}" album. Download all tracks as a ZIP file.</p>
                    <button class="album-download-btn" onclick="downloadPurchasedItem('album', '${ALBUM_NAME}', '${albumPurchaseRecord.id}')">
                        <i class="fas fa-download"></i> Download Album (ZIP)
                    </button>
                `;
                
                // Insert after the purchase options
                const purchaseOptions = document.querySelector('.purchase-options-player');
                if (purchaseOptions) {
                    purchaseOptions.parentNode.insertBefore(downloadSection, purchaseOptions.nextSibling);
                }
            }
            
            // Update album purchase button
            buyAlbumButton.innerHTML = '<i class="fas fa-check"></i> Album Owned';
            buyAlbumButton.disabled =
            buyAlbumButton.style.background = '#4CAF50';
        }
    }

    // Make downloadPurchasedItem globally available
    window.downloadPurchasedItem = downloadPurchasedItem;

    // Event Listeners
    playPauseButton.addEventListener('click', togglePlayPause);
    prevButton.addEventListener('click', prevTrack);
    nextButton.addEventListener('click', nextTrack);

    audioElement.addEventListener('play', () => {
        isPlaying = true;
        updatePlayPauseButton();
    });

    audioElement.addEventListener('pause', () => {
        isPlaying = false;
        updatePlayPauseButton();
    });

    audioElement.addEventListener('ended', nextTrack);
    audioElement.addEventListener('timeupdate', updateProgressBar);
    progressBar.addEventListener('input', () => {
        audioElement.currentTime = progressBar.value;
    });
    volumeControl.addEventListener('input', (e) => {
        audioElement.volume = e.target.value / 100; // Convert percentage to decimal
    });

    console.log("[PLAYER] Script execution finished.");

    // Show Notifications Form Handler
    const showNotificationsForm = document.getElementById('show-notifications-form');
    if (showNotificationsForm) {
        showNotificationsForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(showNotificationsForm);
            const notificationData = {
                name: formData.get('name'),
                email: formData.get('email'),
                showType: formData.get('showType'),
                city: formData.get('city'),
                earlyAccess: formData.get('earlyAccess') === 'yes',
                backstageUpdates: formData.get('backstageUpdates') === 'yes',
                streamingAlerts: formData.get('streamingAlerts') === 'yes',
                timestamp: new Date().toISOString(),
                source: 'show-notifications'
            };
            
            console.log('Show notification signup:', notificationData);
            
            try {
                // In a real implementation, this would send to your backend
                // For now, we'll store locally and show success message
                const existingSignups = JSON.parse(localStorage.getItem('showNotificationSignups') || '[]');
                existingSignups.push(notificationData);
                localStorage.setItem('showNotificationSignups', JSON.stringify(existingSignups));
                
                // Show success message
                const successMessage = document.getElementById('show-signup-success');
                if (successMessage) {
                    showNotificationsForm.style.display = 'none';
                    successMessage.style.display = 'block';
                    
                    // Optional: Send to server
                    try {
                        await fetch(`${SERVER_BASE_URL}/signup-show-notifications`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(notificationData)
                        });
                        console.log('Show notification signup sent to server');
                    } catch (error) {
                        console.log('Server signup failed, but data saved locally:', error);
                    }
                }
                
            } catch (error) {
                console.error('Error processing show notification signup:', error);
                alert('Error processing show notification signup.');
            }
        });
    }

    initializeApp();
});
// Merged payment improvements and mobile enhancements from commit 3846ab0
