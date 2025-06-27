document.addEventListener('DOMContentLoaded', () => {
    console.log("[PLAYER] DOMContentLoaded event fired.");

    // Element checks
    const albumArt = document.getElementById('album-art');
    console.log("[PLAYER] albumArt element:", albumArt ? "Found" : "NOT FOUND");
    const trackTitle = document.getElementById('track-title');
    console.log("[PLAYER] trackTitle element:", trackTitle ? "Found" : "NOT FOUND");
    const audioElement = document.getElementById('audio-element');
    console.log("[PLAYER] audioElement:", audioElement ? "Found" : "NOT FOUND");
    const playPauseButton = document.getElementById('play-pause-button');
    console.log("[PLAYER] playPauseButton:", playPauseButton ? "Found" : "NOT FOUND");
    const prevButton = document.getElementById('prev-button');
    console.log("[PLAYER] prevButton:", prevButton ? "Found" : "NOT FOUND");
    const nextButton = document.getElementById('next-button');
    console.log("[PLAYER] nextButton:", nextButton ? "Found" : "NOT FOUND");
    const progressBar = document.getElementById('progress-bar');
    console.log("[PLAYER] progressBar:", progressBar ? "Found" : "NOT FOUND");
    const currentTimeDisplay = document.getElementById('current-time');
    console.log("[PLAYER] currentTimeDisplay:", currentTimeDisplay ? "Found" : "NOT FOUND");
    const durationDisplay = document.getElementById('duration');
    console.log("[PLAYER] durationDisplay:", durationDisplay ? "Found" : "NOT FOUND");
    const volumeControl = document.getElementById('volume-control');
    console.log("[PLAYER] volumeControl:", volumeControl ? "Found" : "NOT FOUND");
    const playlistElement = document.getElementById('playlist');
    console.log("[PLAYER] playlistElement:", playlistElement ? "Found" : "NOT FOUND");
    const buyAlbumButton = document.getElementById('buy-album-paypal');
    console.log("[PLAYER] buyAlbumButton:", buyAlbumButton ? "Found" : "NOT FOUND");

    if (!audioElement || !playPauseButton || !playlistElement) {
        console.error("[PLAYER] CRITICAL ERROR: One or more essential player HTML elements are missing. Player cannot initialize.");
        return; // Stop execution if essential elements are missing
    }

    let currentTrackIndex = 0;
    let tracks = [];
    let isPlaying = false;
    let userId = null; // Will be fetched or generated

    const ALBUM_NAME = "Blind and Battered [Explicit]";
    const ALBUM_PRICE = "25.00";
    const TRACK_PRICE = "2.00";
    const CURRENCY = "USD";
    // IMPORTANT: Replace with your actual PayPal Merchant ID for live payments
    const PAYPAL_MERCHANT_ID = "YOUR_PAYPAL_MERCHANT_ID"; 
    // IMPORTANT: Set to false for live environment
    const PAYPAL_SANDBOX_MODE = true; 
    const PAYPAL_IPN_URL = '/paypal-ipn'; // Our backend IPN listener

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
            '19 - Do the I\'m the Shit [Explicit].mp3', // Correctly escaped apostrophe
            '20 - Hatin On a Blind Man [Explicit].mp3'
        ];
        tracks = audioFiles.map(file => {
            const trackName = file.replace(/\.mp3$/, '').replace(/^\d+\s*-\s*/, '');
            const trackNumber = file.substring(0, 2); // Extract the two-digit track number
            return {
                name: trackName,
                id: file, // Use filename as a unique ID for the track
                srcFull: `public/audio/Blind and Battered [Explicit]/${file}`,
                srcSample: `public/audio/Blind and Battered [Explicit]/${file}`, // Use the full track for samples, which will be limited to 30 seconds by JavaScript
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
    }

    // Create PayPal payment
    async function initiatePayPalPayment(itemId, itemType, itemName, amount, currency) {
        if (!userId) {
            alert("User information not available. Please refresh the page.");
            return;
        }

        console.log(`Initiating PayPal payment for ${itemType}: ${itemName} ($${amount} ${currency})`);
        
        try {
            // Get user email for download delivery
            const userEmail = prompt("Enter your email address for download delivery (optional):");
            
            const response = await fetch('/create-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    itemType,
                    itemId,
                    itemName,
                    amount,
                    currency,
                    userId,
                    userEmail
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to create payment');
            }
            
            const data = await response.json();
            
            // Open PayPal payment window
            const paymentWindow = window.open(
                data.approvalUrl, 
                'PayPalPayment', 
                'width=600,height=700,scrollbars=yes,resizable=yes'
            );
            
            // Listen for payment completion
            const handlePaymentMessage = (event) => {
                if (event.data.type === 'PAYMENT_SUCCESS') {
                    console.log('Payment successful!');
                    paymentWindow.close();
                    window.removeEventListener('message', handlePaymentMessage);
                    
                    // Refresh purchase status
                    setTimeout(async () => {
                        await loadUserPurchases();
                        alert(`Purchase successful for ${itemName}! Your music has been unlocked and download links have been sent to your email.`);
                        
                        // Reload current track if it was just purchased
                        if (itemType === 'track' && tracks[currentTrackIndex]?.id === itemId) {
                            loadTrack(currentTrackIndex, isPlaying);
                        } else if (itemType === 'album') {
                            loadTrack(currentTrackIndex, isPlaying);
                        }
                    }, 1000);
                    
                } else if (event.data.type === 'PAYMENT_CANCELLED') {
                    console.log('Payment cancelled');
                    paymentWindow.close();
                    window.removeEventListener('message', handlePaymentMessage);
                    alert('Payment was cancelled. No charges were made.');
                }
            };
            
            window.addEventListener('message', handlePaymentMessage);
            
            // Check if window was closed without payment
            const checkClosed = setInterval(() => {
                if (paymentWindow.closed) {
                    clearInterval(checkClosed);
                    window.removeEventListener('message', handlePaymentMessage);
                    console.log('Payment window closed');
                }
            }, 1000);
            
        } catch (error) {
            console.error('Payment error:', error);
            alert('Failed to initiate payment. Please try again.');
        }
    }

    // Add download functionality for purchased items
    async function downloadPurchasedItem(itemType, itemId, purchaseId) {
        try {
            const downloadUrl = `/download/${userId}/${purchaseId}`;
            
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
        audioElement.src = track.purchased ? track.srcFull : track.srcSample; // Use sample or full path
        
        audioElement.onloadedmetadata = () => {
            console.log(`[PLAYER] loadTrack: Metadata loaded for ${track.name}. Duration: ${audioElement.duration}`);
            progressBar.value = 0;
            currentTimeDisplay.textContent = formatTime(0);
            durationDisplay.textContent = formatTime(audioElement.duration);
            updatePlayPauseButton();
            // If track is not purchased, limit playback to 30 seconds
            if (!track.purchased) {
                audioElement.ontimeupdate = () => {
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
    }

    // Play or pause the audio
    function togglePlayPause() {
        console.log("[PLAYER] togglePlayPause: Called. isPlaying:", isPlaying);
        if (!audioElement.src) {
            console.warn("[PLAYER] togglePlayPause: No audio source loaded.");
            if (tracks.length > 0) {
                 console.log("[PLAYER] togglePlayPause: Attempting to load initial track.");
                 loadTrack(currentTrackIndex, true); // Try to load the first track and play
            }
            return;
        }
        if (isPlaying) {
            audioElement.pause();
        } else {
            audioElement.play().catch(e => console.error("[PLAYER] Playback error:", e)); // Add error handling
        }
        isPlaying = !isPlaying;
        updatePlayPauseButton();
        console.log("[PLAYER] togglePlayPause: New isPlaying state:", isPlaying);
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
        
        console.log("[PLAYER] renderPlaylist: Finished.");
    }


    // Enhanced loadUserPurchases with local storage caching
    async function loadUserPurchases() {
        console.log("[PLAYER] loadUserPurchases: Started for user:", userId);
        if (!userId) {
            console.error("[PLAYER] loadUserPurchases: User ID not initialized.");
            return;
        }
        try {
            const response = await fetch(`/user-purchases/${userId}`);
            if (!response.ok) {
                console.error('Failed to fetch user purchases:', response.status);
                return;
            }
            const data = await response.json();
            console.log("[PLAYER] loadUserPurchases: Data received:", data);

            // Cache purchases in localStorage for quick access
            localStorage.setItem(`purchases_${userId}`, JSON.stringify(data));

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
            buyAlbumButton.disabled = true;
            buyAlbumButton.style.background = '#4CAF50';
        }
    }

    // Make downloadPurchasedItem globally available
    window.downloadPurchasedItem = downloadPurchasedItem;

    // Event Listeners - CRITICAL: These were missing!
    playPauseButton.addEventListener('click', togglePlayPause);
    prevButton.addEventListener('click', prevTrack);
    nextButton.addEventListener('click', nextTrack);
    audioElement.addEventListener('ended', nextTrack);
    audioElement.addEventListener('timeupdate', updateProgressBar);
    progressBar.addEventListener('input', () => {
        audioElement.currentTime = progressBar.value;
    });
    volumeControl.addEventListener('input', (e) => {
        audioElement.volume = e.target.value / 100; // Convert percentage to decimal
    });

    // Enhanced initialization
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

    initializeApp();
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
                        await fetch('/signup-show-notifications', {
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
                alert('There was an error processing your signup. Please try again.');
            }
        });
    }
});
