/**
 * Sheriff Thizz Rewards System - JavaScript Implementation
 * Integrates with Mac Wayne Battered Coin cryptocurrency
 */

class SheriffThizzRewards {
    constructor() {
        this.membershipTiers = {
            DEPUTY: { name: 'Deputy', threshold: 0, color: '#C0C0C0', icon: '🌟' },
            SHERIFF: { name: 'Sheriff', threshold: 500, color: '#FFD700', icon: '⭐' },
            LEGEND: { name: 'Legend', threshold: 1500, color: '#9370DB', icon: '👑' }
        };
        
        this.pointActivities = {
            PURCHASE: { name: 'Purchase', points: 25 },
            SHARE: { name: 'Share', points: 10 },
            REVIEW: { name: 'Review', points: 15 },
            VOLUNTEER: { name: 'Volunteer', points: 50 },
            SIGNUP: { name: 'Signup', points: 100 },
            REFERRAL: { name: 'Referral', points: 75 },
            SOCIAL_FOLLOW: { name: 'Social Follow', points: 20 },
            STREAM: { name: 'Stream', points: 5 },
            CONCERT_ATTEND: { name: 'Concert Attendance', points: 100 }
        };
        
        this.currentUserId = localStorage.getItem('mwb_user_id') || this.generateUserId();
        this.loyaltyProfile = this.getLoyaltyProfile(this.currentUserId);
        
        this.init();
    }
    
    init() {
        this.renderRewardsUI();
        this.setupEventListeners();
        this.updateRewardsDisplay();
    }
    
    generateUserId() {
        const userId = 'user_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
        localStorage.setItem('mwb_user_id', userId);
        return userId;
    }
    
    getLoyaltyProfile(userId) {
        const storedProfiles = this.getStoredProfiles();
        let profile = storedProfiles[userId];
        
        if (!profile) {
            profile = this.createDefaultProfile(userId);
            storedProfiles[userId] = profile;
            this.saveProfiles(storedProfiles);
        }
        
        return profile;
    }
    
    createDefaultProfile(userId) {
        return {
            userId,
            totalPoints: 0,
            availablePoints: 0,
            tier: 'DEPUTY',
            joinDate: Date.now(),
            lastActivity: Date.now(),
            pointsSpent: 0,
            pointsEarned: 0,
            achievements: [],
            activitiesCompleted: Object.keys(this.pointActivities).reduce((acc, key) => {
                acc[key] = 0;
                return acc;
            }, {}),
            streakCount: 0,
            lastLoginDate: Date.now()
        };
    }
    
    getStoredProfiles() {
        try {
            const profilesJson = localStorage.getItem('mac_wayne_loyalty_profile');
            return profilesJson ? JSON.parse(profilesJson) : {};
        } catch (error) {
            console.error('Failed to load loyalty profiles:', error);
            return {};
        }
    }
    
    saveProfiles(profiles) {
        localStorage.setItem('mac_wayne_loyalty_profile', JSON.stringify(profiles));
    }
    
    awardPoints(activity, description, bonusMultiplier = 1) {
        const basePoints = this.pointActivities[activity]?.points || 0;
        const points = Math.floor(basePoints * bonusMultiplier);
        
        const transaction = {
            id: this.generateTransactionId(),
            userId: this.currentUserId,
            activity,
            points,
            timestamp: Date.now(),
            description: description || `Earned ${points} points for ${this.pointActivities[activity]?.name}`
        };
        
        const transactions = this.getPointTransactions();
        transactions.push(transaction);
        this.savePointTransactions(transactions);
        
        // Update user profile
        this.loyaltyProfile.totalPoints += points;
        this.loyaltyProfile.availablePoints += points;
        this.loyaltyProfile.pointsEarned += points;
        this.loyaltyProfile.lastActivity = Date.now();
        this.loyaltyProfile.tier = this.calculateTier(this.loyaltyProfile.totalPoints);
        
        // Increment activity counter
        this.loyaltyProfile.activitiesCompleted[activity] = 
            (this.loyaltyProfile.activitiesCompleted[activity] || 0) + 1;
        
        // Check for achievements
        this.checkAchievements(transaction);
        
        const profiles = this.getStoredProfiles();
        profiles[this.currentUserId] = this.loyaltyProfile;
        this.saveProfiles(profiles);
        
        this.updateRewardsDisplay();
        
        return transaction;
    }
    
    getPointTransactions() {
        try {
            const transactionsJson = localStorage.getItem('mac_wayne_point_transactions');
            return transactionsJson ? JSON.parse(transactionsJson) : [];
        } catch (error) {
            console.error('Failed to load point transactions:', error);
            return [];
        }
    }
    
    savePointTransactions(transactions) {
        localStorage.setItem('mac_wayne_point_transactions', JSON.stringify(transactions));
    }
    
    calculateTier(totalPoints) {
        if (totalPoints >= this.membershipTiers.LEGEND.threshold) {
            return 'LEGEND';
        }
        if (totalPoints >= this.membershipTiers.SHERIFF.threshold) {
            return 'SHERIFF';
        }
        return 'DEPUTY';
    }
    
    checkAchievements(transaction) {
        const newAchievements = [];
        
        // First purchase achievement
        if (transaction.activity === 'PURCHASE' && 
            !this.loyaltyProfile.achievements.includes('first_purchase')) {
            newAchievements.push('first_purchase');
        }
        
        // Point milestones
        const pointMilestones = [100, 500, 1000, 2000, 5000];
        pointMilestones.forEach(milestone => {
            const achievementId = `points_${milestone}`;
            if (this.loyaltyProfile.totalPoints >= milestone && 
                !this.loyaltyProfile.achievements.includes(achievementId)) {
                newAchievements.push(achievementId);
            }
        });
        
        // Add new achievements
        this.loyaltyProfile.achievements.push(...newAchievements);
        
        // Display achievements
        if (newAchievements.length > 0) {
            this.displayAchievementNotifications(newAchievements);
        }
    }
    
    displayAchievementNotifications(achievements) {
        const achievementDefinitions = this.getAchievementDefinitions();
        
        achievements.forEach(achievementId => {
            const achievement = achievementDefinitions[achievementId];
            if (achievement) {
                const notification = document.createElement('div');
                notification.classList.add('achievement-notification');
                notification.innerHTML = `
                    <span class="achievement-icon">${achievement.icon}</span>
                    <div class="achievement-content">
                        <h4>${achievement.name}</h4>
                        <p>${achievement.description}</p>
                    </div>
                `;
                
                document.body.appendChild(notification);
                
                setTimeout(() => {
                    notification.classList.add('show');
                }, 100);
                
                setTimeout(() => {
                    notification.classList.remove('show');
                    setTimeout(() => notification.remove(), 500);
                }, 5000);
            }
        });
    }
    
    getAchievementDefinitions() {
        return {
            first_purchase: {
                name: 'First Purchase',
                description: 'Made your first purchase',
                icon: '🛒',
                points: 0
            },
            points_100: {
                name: 'Getting Started',
                description: 'Earned 100 total points',
                icon: '🌟',
                points: 0
            },
            points_500: {
                name: 'Deputy Rising',
                description: 'Earned 500 total points',
                icon: '🚀',
                points: 0
            },
            points_1000: {
                name: 'Sheriff Material',
                description: 'Earned 1,000 total points',
                icon: '⭐',
                points: 0
            },
            points_2000: {
                name: 'Legend in Making',
                description: 'Earned 2,000 total points',
                icon: '👑',
                points: 0
            },
            points_5000: {
                name: 'Thizz Legend',
                description: 'Earned 5,000 total points',
                icon: '💎',
                points: 0
            }
        };
    }
    
    generateTransactionId() {
        return `txn_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }
    
    renderRewardsUI() {
        const rewardsSection = document.createElement('section');
        rewardsSection.id = 'sheriff-thizz-rewards';
        rewardsSection.classList.add('rewards-section');
        
        rewardsSection.innerHTML = `
            <div class="container">
                <h2 class="section-title">Sheriff Thizz Rewards</h2>
                <p class="rewards-description">Earn points and climb the ranks in our loyalty program by interacting with the Mac Wayne Battered Coin ecosystem.</p>
                
                <div class="rewards-dashboard">
                    <div class="tier-info">
                        <div class="tier-badge" id="tier-badge">
                            <span class="tier-icon"></span>
                        </div>
                        <div class="tier-details">
                            <h3 id="tier-name">Deputy</h3>
                            <div class="points-progress">
                                <div class="progress-bar">
                                    <div class="progress-fill" id="tier-progress"></div>
                                </div>
                                <span class="progress-text" id="points-status"></span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="rewards-stats">
                        <div class="stat-item">
                            <span class="stat-value" id="total-points">0</span>
                            <span class="stat-label">Total Points</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value" id="available-points">0</span>
                            <span class="stat-label">Available Points</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value" id="achievements-count">0</span>
                            <span class="stat-label">Achievements</span>
                        </div>
                    </div>
                </div>
                
                <div class="rewards-actions">
                    <div class="action-cards">
                        <div class="action-card" data-activity="PURCHASE">
                            <div class="card-icon">🛒</div>
                            <h4>Purchase</h4>
                            <p>Buy MWB tokens</p>
                            <span class="points-badge">+${this.pointActivities.PURCHASE.points} pts</span>
                        </div>
                        <div class="action-card" data-activity="SHARE">
                            <div class="card-icon">📤</div>
                            <h4>Share</h4>
                            <p>Share on social media</p>
                            <span class="points-badge">+${this.pointActivities.SHARE.points} pts</span>
                        </div>
                        <div class="action-card" data-activity="SIGNUP">
                            <div class="card-icon">🔔</div>
                            <h4>Daily Bonus</h4>
                            <p>Claim your daily reward</p>
                            <span class="points-badge">+5-15 pts</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Find where to insert the rewards section (before the footer)
        const footer = document.querySelector('footer');
        if (footer) {
            document.body.insertBefore(rewardsSection, footer);
        } else {
            document.body.appendChild(rewardsSection);
        }
        
        // Add CSS for the rewards section
        const style = document.createElement('style');
        style.textContent = `
            .rewards-section {
                background-color: #121212;
                padding: 60px 0;
                color: #fff;
                margin-top: 40px;
            }
            
            .rewards-description {
                max-width: 800px;
                margin: 0 auto 40px;
                text-align: center;
                color: #ccc;
            }
            
            .rewards-dashboard {
                background-color: #1c1c1c;
                border-radius: 10px;
                padding: 30px;
                display: flex;
                flex-wrap: wrap;
                gap: 30px;
                justify-content: space-between;
                margin-bottom: 40px;
            }
            
            .tier-info {
                display: flex;
                align-items: center;
                gap: 20px;
                flex: 1;
                min-width: 250px;
            }
            
            .tier-badge {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 36px;
                background-color: #333;
            }
            
            .tier-details {
                flex: 1;
            }
            
            .points-progress {
                margin-top: 10px;
            }
            
            .progress-bar {
                height: 10px;
                background-color: #333;
                border-radius: 5px;
                overflow: hidden;
                margin-bottom: 5px;
            }
            
            .progress-fill {
                height: 100%;
                background-color: #6a5acd;
                transition: width 0.3s ease;
            }
            
            .progress-text {
                font-size: 14px;
                color: #ccc;
            }
            
            .rewards-stats {
                display: flex;
                gap: 20px;
                flex-wrap: wrap;
                flex: 1;
                min-width: 250px;
                justify-content: space-around;
            }
            
            .stat-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                min-width: 100px;
            }
            
            .stat-value {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 5px;
            }
            
            .stat-label {
                font-size: 14px;
                color: #ccc;
            }
            
            .rewards-actions {
                margin-top: 40px;
            }
            
            .action-cards {
                display: flex;
                gap: 20px;
                flex-wrap: wrap;
                justify-content: center;
            }
            
            .action-card {
                background-color: #1c1c1c;
                border-radius: 10px;
                padding: 20px;
                min-width: 180px;
                text-align: center;
                cursor: pointer;
                transition: transform 0.2s, box-shadow 0.2s;
                position: relative;
                overflow: hidden;
            }
            
            .action-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
            }
            
            .card-icon {
                font-size: 36px;
                margin-bottom: 10px;
            }
            
            .action-card h4 {
                margin: 0 0 10px;
            }
            
            .action-card p {
                color: #ccc;
                margin: 0 0 15px;
                font-size: 14px;
            }
            
            .points-badge {
                background-color: #6a5acd;
                color: white;
                padding: 5px 10px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: bold;
            }
            
            .achievement-notification {
                position: fixed;
                bottom: 30px;
                right: 30px;
                background-color: #1c1c1c;
                border-left: 5px solid #6a5acd;
                padding: 15px;
                border-radius: 5px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                display: flex;
                align-items: center;
                gap: 15px;
                transform: translateX(120%);
                transition: transform 0.3s ease;
                z-index: 1000;
                max-width: 350px;
            }
            
            .achievement-notification.show {
                transform: translateX(0);
            }
            
            .achievement-icon {
                font-size: 32px;
            }
            
            .achievement-content h4 {
                margin: 0 0 5px;
                color: white;
            }
            
            .achievement-content p {
                margin: 0;
                color: #ccc;
                font-size: 14px;
            }
            
            @media (max-width: 768px) {
                .rewards-dashboard {
                    flex-direction: column;
                }
                
                .rewards-stats {
                    justify-content: space-between;
                }
                
                .action-cards {
                    flex-direction: column;
                    align-items: center;
                }
                
                .action-card {
                    width: 100%;
                    max-width: 300px;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    updateRewardsDisplay() {
        // Update tier and progress
        const tierBadge = document.getElementById('tier-badge');
        const tierName = document.getElementById('tier-name');
        const tierProgress = document.getElementById('tier-progress');
        const pointsStatus = document.getElementById('points-status');
        const totalPoints = document.getElementById('total-points');
        const availablePoints = document.getElementById('available-points');
        const achievementsCount = document.getElementById('achievements-count');
        
        if (!tierBadge || !tierName || !tierProgress || !pointsStatus || 
            !totalPoints || !availablePoints || !achievementsCount) {
            return;
        }
        
        const currentTier = this.membershipTiers[this.loyaltyProfile.tier];
        const nextTierKey = this.loyaltyProfile.tier === 'DEPUTY' ? 'SHERIFF' : 
                          this.loyaltyProfile.tier === 'SHERIFF' ? 'LEGEND' : null;
        const nextTier = nextTierKey ? this.membershipTiers[nextTierKey] : null;
        
        // Update tier display
        tierBadge.style.backgroundColor = currentTier.color;
        tierBadge.querySelector('.tier-icon').textContent = currentTier.icon;
        tierName.textContent = currentTier.name;
        
        // Update progress bar
        if (nextTier) {
            const currentPoints = this.loyaltyProfile.totalPoints;
            const nextThreshold = nextTier.threshold;
            const previousThreshold = currentTier.threshold;
            const progress = ((currentPoints - previousThreshold) / (nextThreshold - previousThreshold)) * 100;
            
            tierProgress.style.width = `${Math.min(progress, 100)}%`;
            pointsStatus.textContent = `${currentPoints} / ${nextThreshold} points to ${nextTier.name}`;
        } else {
            tierProgress.style.width = '100%';
            pointsStatus.textContent = `${this.loyaltyProfile.totalPoints} points - Max tier reached!`;
        }
        
        // Update stats
        totalPoints.textContent = this.loyaltyProfile.totalPoints;
        availablePoints.textContent = this.loyaltyProfile.availablePoints;
        achievementsCount.textContent = this.loyaltyProfile.achievements.length;
    }
    
    setupEventListeners() {
        // Add event listeners to action cards
        document.querySelectorAll('.action-card').forEach(card => {
            card.addEventListener('click', () => {
                const activity = card.getAttribute('data-activity');
                if (activity) {
                    this.handleActivityAction(activity);
                }
            });
        });
    }
    
    handleActivityAction(activity) {
        switch (activity) {
            case 'PURCHASE':
                // Show purchase modal or redirect to purchase section
                this.simulatePurchase();
                break;
                
            case 'SHARE':
                // Open share dialog
                this.openShareDialog();
                break;
                
            case 'SIGNUP':
                // Claim daily bonus
                this.claimDailyBonus();
                break;
        }
    }
    
    simulatePurchase() {
        // This is a simulation - in real implementation, integrate with actual purchase flow
        this.awardPoints('PURCHASE', 'Simulated purchase of MWB tokens');
        alert('🎉 You earned ' + this.pointActivities.PURCHASE.points + ' points for your purchase!');
    }
    
    openShareDialog() {
        // Simple implementation - in real app, integrate with Web Share API or social platforms
        const shareUrl = encodeURIComponent(window.location.href);
        const shareText = encodeURIComponent('Check out Mac Wayne Battered Coin - The accessibility-first cryptocurrency! #MWB #AccessibilityFirst');
        
        window.open(`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`, '_blank');
        
        this.awardPoints('SHARE', 'Shared Mac Wayne Battered Coin on social media');
    }
    
    claimDailyBonus() {
        const today = new Date().toDateString();
        const lastLoginDateStr = new Date(this.loyaltyProfile.lastLoginDate).toDateString();
        
        if (lastLoginDateStr === today) {
            alert('You already claimed your daily bonus today. Come back tomorrow!');
            return;
        }
        
        // Update streak count
        if (!this.loyaltyProfile.streakCount) this.loyaltyProfile.streakCount = 0;
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();
        
        if (lastLoginDateStr === yesterdayStr) {
            // Consecutive day - increment streak
            this.loyaltyProfile.streakCount += 1;
        } else {
            // Non-consecutive - reset streak
            this.loyaltyProfile.streakCount = 1;
        }
        
        this.loyaltyProfile.lastLoginDate = Date.now();
        
        // Award points based on tier
        const bonusPoints = this.loyaltyProfile.tier === 'LEGEND' ? 15 : 
                           this.loyaltyProfile.tier === 'SHERIFF' ? 10 : 5;
        
        // Save updated profile
        const profiles = this.getStoredProfiles();
        profiles[this.currentUserId] = this.loyaltyProfile;
        this.saveProfiles(profiles);
        
        this.awardPoints('SIGNUP', `Daily login bonus (${this.membershipTiers[this.loyaltyProfile.tier].name}) - Day ${this.loyaltyProfile.streakCount}`);
        
        alert(`🎉 Daily bonus claimed! You earned ${bonusPoints} points. Current streak: ${this.loyaltyProfile.streakCount} day(s)`);
    }
}

// Initialize the rewards system when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    window.sheriffThizzRewards = new SheriffThizzRewards();
});
