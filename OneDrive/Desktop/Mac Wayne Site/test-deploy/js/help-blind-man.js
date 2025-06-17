// Help The Blind Man Interactive Features
class HelpBlindManFeatures {
    constructor() {
        this.currentScene = 0;
        this.score = 0;
        this.totalScenarios = 3;
        this.scenes = ['studio', 'stage', 'home'];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateScoreDisplay();
    }

    setupEventListeners() {
        // Story audio player
        const storyBtn = document.querySelector('.story-play-btn');
        const storyAudio = document.getElementById('going-blind-audio');
        
        if (storyBtn && storyAudio) {
            storyBtn.addEventListener('click', () => {
                if (storyAudio.paused) {
                    storyAudio.play();
                    storyBtn.innerHTML = '<i class="fas fa-pause"></i> PAUSE STORY';
                } else {
                    storyAudio.pause();
                    storyBtn.innerHTML = '<i class="fas fa-play"></i> HEAR HIS STORY';
                }
            });

            storyAudio.addEventListener('ended', () => {
                storyBtn.innerHTML = '<i class="fas fa-play"></i> HEAR HIS STORY';
            });
        }

        // Direction buttons for guidance game
        const directionBtns = document.querySelectorAll('.direction-btn');
        directionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleDirectionChoice(e.target);
            });
        });

        // Reset game button
        const resetBtn = document.getElementById('reset-game');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetGame();
            });
        }

        // Support action buttons
        const shareBtn = document.getElementById('share-story');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                this.shareStory();
            });
        }

        const encouragementBtn = document.getElementById('send-encouragement');
        if (encouragementBtn) {
            encouragementBtn.addEventListener('click', () => {
                this.openEncouragementModal();
            });
        }
    }

    handleDirectionChoice(button) {
        const isCorrect = button.dataset.correct === 'true';
        const feedback = document.getElementById('scene-feedback');
        const allBtns = button.parentElement.querySelectorAll('.direction-btn');

        // Disable all buttons temporarily
        allBtns.forEach(btn => btn.disabled = true);

        // Apply visual feedback
        button.classList.add(isCorrect ? 'correct' : 'incorrect');

        // Show feedback message
        if (isCorrect) {
            feedback.className = 'feedback success';
            feedback.textContent = '✓ Great guidance! Mac Wayne made it safely.';
            this.score++;
            
            // Move to next scene after delay
            setTimeout(() => {
                this.nextScene();
            }, 2000);
        } else {
            feedback.className = 'feedback error';
            feedback.textContent = '✗ Not quite right. Mac Wayne needs clearer guidance.';
            
            // Re-enable buttons after showing error
            setTimeout(() => {
                button.classList.remove('incorrect');
                allBtns.forEach(btn => btn.disabled = false);
                feedback.textContent = '';
                feedback.className = 'feedback';
            }, 2000);
        }

        this.updateScoreDisplay();
    }

    nextScene() {
        const currentSceneElement = document.querySelector('.scene.active');
        currentSceneElement.classList.remove('active');

        this.currentScene = (this.currentScene + 1) % this.totalScenarios;
        
        if (this.currentScene === 0 && this.score === this.totalScenarios) {
            // Completed all scenarios successfully
            this.showCompletionMessage();
            return;
        }

        const nextSceneElement = document.querySelector(`[data-scene="${this.scenes[this.currentScene]}"]`);
        nextSceneElement.classList.add('active');

        // Reset buttons for next scene
        const allBtns = nextSceneElement.querySelectorAll('.direction-btn');
        allBtns.forEach(btn => {
            btn.disabled = false;
            btn.classList.remove('correct', 'incorrect');
        });

        // Clear feedback
        const feedback = nextSceneElement.querySelector('.feedback');
        feedback.textContent = '';
        feedback.className = 'feedback';
    }

    showCompletionMessage() {
        const gameScreen = document.getElementById('guidance-game');
        gameScreen.innerHTML = `
            <div class="completion-message" style="text-align: center; padding: 2rem;">
                <div style="font-size: 4rem; color: #4CAF50; margin-bottom: 1rem;">🎉</div>
                <h3 style="color: #ff6b35; margin-bottom: 1rem;">AMAZING GUIDANCE!</h3>
                <p style="color: #ccc; margin-bottom: 2rem;">
                    You successfully helped Mac Wayne navigate all scenarios! Your understanding and 
                    empathy make a real difference in the lives of visually impaired individuals.
                </p>
                <div style="background: rgba(76, 175, 80, 0.2); border: 1px solid #4CAF50; border-radius: 10px; padding: 1rem; margin-bottom: 2rem;">
                    <strong style="color: #4CAF50;">Perfect Score: ${this.score}/${this.totalScenarios}</strong>
                </div>
                <button class="support-btn" onclick="helpBlindMan.resetGame()" style="margin-right: 1rem;">
                    GUIDE AGAIN
                </button>
                <button class="support-btn" onclick="document.getElementById('support-section').scrollIntoView()">
                    SUPPORT MAC WAYNE
                </button>
            </div>
        `;
    }

    resetGame() {
        this.currentScene = 0;
        this.score = 0;
        this.updateScoreDisplay();

        // Reset game screen
        const gameScreen = document.getElementById('guidance-game');
        gameScreen.innerHTML = `
            <div class="scene active" data-scene="studio">
                <h4>STUDIO SESSION</h4>
                <p>Mac Wayne needs to find his way to the recording booth. Help guide him:</p>
                <div class="direction-buttons">
                    <button class="direction-btn" data-direction="left" data-correct="false">
                        <i class="fas fa-arrow-left"></i> LEFT
                    </button>
                    <button class="direction-btn" data-direction="forward" data-correct="true">
                        <i class="fas fa-arrow-up"></i> STRAIGHT
                    </button>
                    <button class="direction-btn" data-direction="right" data-correct="false">
                        <i class="fas fa-arrow-right"></i> RIGHT
                    </button>
                </div>
                <div class="feedback" id="scene-feedback"></div>
            </div>
            
            <div class="scene" data-scene="stage">
                <h4>ON STAGE</h4>
                <p>Mac Wayne is performing. Help him locate the microphone:</p>
                <div class="direction-buttons">
                    <button class="direction-btn" data-direction="left" data-correct="true">
                        <i class="fas fa-arrow-left"></i> LEFT
                    </button>
                    <button class="direction-btn" data-direction="forward" data-correct="false">
                        <i class="fas fa-arrow-up"></i> STRAIGHT
                    </button>
                    <button class="direction-btn" data-direction="right" data-correct="false">
                        <i class="fas fa-arrow-right"></i> RIGHT
                    </button>
                </div>
                <div class="feedback" id="scene-feedback"></div>
            </div>
            
            <div class="scene" data-scene="home">
                <h4>DAILY LIFE</h4>
                <p>Help Mac Wayne navigate to his music equipment at home:</p>
                <div class="direction-buttons">
                    <button class="direction-btn" data-direction="left" data-correct="false">
                        <i class="fas fa-arrow-left"></i> LEFT
                    </button>
                    <button class="direction-btn" data-direction="forward" data-correct="false">
                        <i class="fas fa-arrow-up"></i> STRAIGHT
                    </button>
                    <button class="direction-btn" data-direction="right" data-correct="true">
                        <i class="fas fa-arrow-right"></i> RIGHT
                    </button>
                </div>
                <div class="feedback" id="scene-feedback"></div>
            </div>
        `;

        // Re-setup event listeners for new buttons
        const directionBtns = document.querySelectorAll('.direction-btn');
        directionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleDirectionChoice(e.target);
            });
        });
    }

    updateScoreDisplay() {
        const scoreCounter = document.getElementById('score-counter');
        const totalScenarios = document.getElementById('total-scenarios');
        
        if (scoreCounter) scoreCounter.textContent = this.score;
        if (totalScenarios) totalScenarios.textContent = this.totalScenarios;
    }

    shareStory() {
        if (navigator.share) {
            navigator.share({
                title: 'Mac Wayne - Help The Blind Man',
                text: 'Experience Mac Wayne\'s incredible journey as a blind hip-hop artist. His story will inspire you!',
                url: window.location.href
            }).catch(console.error);
        } else {
            // Fallback for browsers that don't support Web Share API
            const shareText = `Experience Mac Wayne's incredible journey as a blind hip-hop artist. His story will inspire you! ${window.location.href}`;
            
            if (navigator.clipboard) {
                navigator.clipboard.writeText(shareText).then(() => {
                    this.showNotification('Story link copied to clipboard!', 'success');
                });
            } else {
                // Further fallback
                const textArea = document.createElement('textarea');
                textArea.value = shareText;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                this.showNotification('Story link copied to clipboard!', 'success');
            }
        }
    }

    openEncouragementModal() {
        document.getElementById('encouragement-modal').style.display = 'block';
    }

    closeEncouragementModal() {
        document.getElementById('encouragement-modal').style.display = 'none';
    }

    sendEncouragement() {
        const messages = [
            "Your music inspires us all, Mac Wayne! 🎵",
            "Keep pushing boundaries and breaking barriers! 💪",
            "Your blindness is your superpower! ✨",
            "Thank you for showing us what true vision looks like! 👁️",
            "Your story gives hope to millions! ❤️",
            "Mac Wayne, you're a true inspiration! 🌟"
        ];

        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        // Simulate sending encouragement
        this.showNotification(`Message sent: "${randomMessage}"`, 'success');
        
        // Could integrate with real messaging system here
        console.log('Encouragement sent:', randomMessage);
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : '#ff6b35'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;

        // Add slide-in animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize Help The Blind Man features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.helpBlindMan = new HelpBlindManFeatures();
});

// Voice accessibility features
function enableVoiceCommands() {
    if ('speechSynthesis' in window) {
        const speak = (text) => {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.8;
            utterance.pitch = 1;
            speechSynthesis.speak(utterance);
        };

        // Add voice announcements for important interactions
        document.addEventListener('click', (e) => {
            if (e.target.matches('.direction-btn')) {
                speak(`Selected ${e.target.textContent.trim()}`);
            } else if (e.target.matches('.support-btn')) {
                speak(`Activated ${e.target.textContent.trim()}`);
            }
        });

        // Announce section entries
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.target.id === 'help-blind-man') {
                    speak('Help The Blind Man section. Interactive features available.');
                }
            });
        });

        const helpSection = document.getElementById('help-blind-man');
        if (helpSection) {
            observer.observe(helpSection);
        }
    }
}

// Enable voice commands for accessibility
enableVoiceCommands();

// Modal functionality
function closeEncouragementModal() {
    document.getElementById('encouragement-modal').style.display = 'none';
}

// Handle encouragement form submission
document.addEventListener('DOMContentLoaded', () => {
    const encouragementForm = document.getElementById('encouragement-form');
    if (encouragementForm) {
        encouragementForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('encourager-name').value || 'Anonymous';
            const message = document.getElementById('encouragement-message').value;
            const sharePublicly = document.getElementById('share-publicly').checked;
            
            if (message.trim()) {
                // Simulate sending the message
                const encouragementData = {
                    name: name,
                    message: message,
                    sharePublicly: sharePublicly,
                    timestamp: new Date().toISOString()
                };
                  // Store in localStorage for demo purposes
                const storedMessages = JSON.parse(localStorage.getItem('macWayneEncouragement') || '[]');
                storedMessages.push(encouragementData);
                localStorage.setItem('macWayneEncouragement', JSON.stringify(storedMessages));
                
                // Show success message
                window.helpBlindMan.showNotification('Your encouraging message has been sent to Mac Wayne! 💙', 'success');
                
                // Reset form and close modal
                encouragementForm.reset();
                closeEncouragementModal();
                
                console.log('Encouragement sent:', encouragementData);
            }
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('encouragement-modal');
        if (e.target === modal) {
            closeEncouragementModal();
        }
    });
});
