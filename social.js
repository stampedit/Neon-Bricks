class SocialMediaIntegration {
    constructor() {
        this.streakCount = parseInt(localStorage.getItem('stacksStreak') || '0');
        this.lastPlayDate = localStorage.getItem('stacksLastPlayDate') || null;
        this.achievements = JSON.parse(localStorage.getItem('stacksAchievements') || '[]');
        this.shareData = {
            screenshots: [],
            videos: [],
            captions: []
        };
        
        this.init();
    }
    
    init() {
        this.checkStreak();
        this.setupSocialButtons();
        this.generateShareContent();
    }
    
    checkStreak() {
        const today = new Date().toDateString();
        const lastPlay = this.lastPlayDate;
        
        if (lastPlay) {
            const lastDate = new Date(lastPlay);
            const todayDate = new Date(today);
            const diffTime = Math.abs(todayDate - lastDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
                this.streakCount++;
            } else if (diffDays > 1) {
                this.streakCount = 1;
            }
        } else {
            this.streakCount = 1;
        }
        
        this.lastPlayDate = today;
        localStorage.setItem('stacksStreak', this.streakCount.toString());
        localStorage.setItem('stacksLastPlayDate', today);
        
        return this.streakCount;
    }
    
    setupSocialButtons() {
        // Add enhanced social share buttons to game over screen
        const gameOverButtons = document.querySelector('.game-over-buttons');
        if (gameOverButtons && !document.getElementById('enhancedSocial')) {
            const socialDiv = document.createElement('div');
            socialDiv.id = 'enhancedSocial';
            socialDiv.innerHTML = `
                <div class="streak-display">
                    🔥 ${this.streakCount} Day Streak!
                </div>
                <div class="social-share-grid">
                    <button class="social-btn tiktok-btn" onclick="social.shareToTikTok()">
                        🎵 Share to TikTok
                    </button>
                    <button class="social-btn instagram-btn" onclick="social.shareToInstagram()">
                        📸 Share to Instagram
                    </button>
                    <button class="social-btn story-btn" onclick="social.shareToStory()">
                        📱 Share to Story
                    </button>
                </div>
            `;
            gameOverButtons.insertBefore(socialDiv, gameOverButtons.firstChild);
        }
    }
    
    generateShareContent() {
        const score = parseInt(document.getElementById('finalScore')?.textContent || '0');
        const combo = parseInt(document.getElementById('comboCount')?.textContent || '0');
        const bestScore = parseInt(document.getElementById('bestScore')?.textContent || '0');
        
        // Generate viral captions
        this.shareData.captions = {
            tiktok: [
                `🔥 ${this.streakCount} day streak! Can you beat my score of ${score}? #StacksGame #ViralGames`,
                `NEW HIGH SCORE: ${score}! 🏆 ${this.streakCount} day streak! #StacksChallenge #MobileGame`,
                `Perfect combo x${combo}! 🎯 Think you can do better? #StacksGame #Gaming`
            ],
            instagram: [
                `🔥 ${this.streakCount} DAY STREAK in STACKS! 🏆\n\nScore: ${score}\nBest: ${bestScore}\n\nThink you can beat me? 🔗 in bio!\n\n#StacksGame #MobileGaming #HighScore #GameChallenge`,
                `Just hit ${score} points in STACKS! 🎮\n\n${this.streakCount} day streak going strong! 💪\n\nDownload link in bio to challenge me! ⬆️\n\n#ViralGame #StacksChallenge #GamingCommunity`,
                `Perfect combo x${combo}! 🎯\n\nCurrent streak: ${this.streakCount} days 🔥\n\nScore: ${score}\n\nCan you beat this? 📲 Link in bio!\n\n#StacksGame #MobileGames #Challenge`
            ],
            story: [
                `🔥 ${this.streakCount} Day Streak!`,
                `Score: ${score} 🏆`,
                `Challenge me! 🎮`
            ]
        };
    }
    
    async captureGameScreenshot() {
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        
        // Create a temporary canvas for the screenshot
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = 1080; // Instagram optimal size
        tempCanvas.height = 1920; // Instagram story size
        const tempCtx = tempCanvas.getContext('2d');
        
        // Add gradient background
        const gradient = tempCtx.createLinearGradient(0, 0, 0, tempCanvas.height);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        tempCtx.fillStyle = gradient;
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        
        // Add game canvas in center
        const scale = Math.min(tempCanvas.width / canvas.width, tempCanvas.height / canvas.height) * 0.6;
        const scaledWidth = canvas.width * scale;
        const scaledHeight = canvas.height * scale;
        const x = (tempCanvas.width - scaledWidth) / 2;
        const y = (tempCanvas.height - scaledHeight) / 2 - 100;
        
        tempCtx.drawImage(canvas, x, y, scaledWidth, scaledHeight);
        
        // Add score overlay
        tempCtx.fillStyle = 'white';
        tempCtx.font = 'bold 80px Inter';
        tempCtx.textAlign = 'center';
        tempCtx.fillText(`SCORE: ${document.getElementById('finalScore')?.textContent || '0'}`, tempCanvas.width / 2, y - 50);
        
        // Add streak
        tempCtx.font = 'bold 60px Inter';
        tempCtx.fillText(`🔥 ${this.streakCount} Day Streak`, tempCanvas.width / 2, y + scaledHeight + 100);
        
        // Add call to action
        tempCtx.font = '40px Inter';
        tempCtx.fillText('Challenge me! 🎮', tempCanvas.width / 2, tempCanvas.height - 100);
        
        // Convert to blob
        return new Promise(resolve => {
            tempCanvas.toBlob(resolve, 'image/jpeg', 0.9);
        });
    }
    
    async shareToTikTok() {
        try {
            const screenshot = await this.captureGameScreenshot();
            const caption = this.shareData.captions.tiktok[Math.floor(Math.random() * this.shareData.captions.tiktok.length)];
            
            // Create download link for TikTok
            const url = URL.createObjectURL(screenshot);
            const a = document.createElement('a');
            a.href = url;
            a.download = `stacks-score-${Date.now()}.jpg`;
            a.click();
            
            // Copy caption to clipboard
            navigator.clipboard.writeText(caption).then(() => {
                this.showShareModal('tiktok', caption);
            });
            
        } catch (error) {
            console.error('Error sharing to TikTok:', error);
            this.fallbackShare('tiktok');
        }
    }
    
    async shareToInstagram() {
        try {
            const screenshot = await this.captureGameScreenshot();
            const caption = this.shareData.captions.instagram[Math.floor(Math.random() * this.shareData.captions.instagram.length)];
            
            // Create download link for Instagram
            const url = URL.createObjectURL(screenshot);
            const a = document.createElement('a');
            a.href = url;
            a.download = `stacks-score-${Date.now()}.jpg`;
            a.click();
            
            // Copy caption to clipboard
            navigator.clipboard.writeText(caption).then(() => {
                this.showShareModal('instagram', caption);
            });
            
        } catch (error) {
            console.error('Error sharing to Instagram:', error);
            this.fallbackShare('instagram');
        }
    }
    
    async shareToStory() {
        try {
            const screenshot = await this.captureGameScreenshot();
            
            // Create download link for Story
            const url = URL.createObjectURL(screenshot);
            const a = document.createElement('a');
            a.href = url;
            a.download = `stacks-story-${Date.now()}.jpg`;
            a.click();
            
            this.showShareModal('story', 'Image saved! Add to your Instagram/Facebook story!');
            
        } catch (error) {
            console.error('Error sharing to Story:', error);
            this.fallbackShare('story');
        }
    }
    
    fallbackShare(platform) {
        const shareText = `🔥 ${this.streakCount} day streak! Score: ${document.getElementById('finalScore')?.textContent || '0'} in STACKS! Can you beat me?`;
        
        if (navigator.share) {
            navigator.share({
                title: 'STACKS Game',
                text: shareText,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(shareText + ' ' + window.location.href);
            alert('Text copied to clipboard! Share it on ' + platform);
        }
    }
    
    showShareModal(platform, caption) {
        const modal = document.createElement('div');
        modal.className = 'social-modal active';
        modal.innerHTML = `
            <div class="social-modal-content">
                <h3>🎉 Share to ${platform.charAt(0).toUpperCase() + platform.slice(1)}!</h3>
                <div class="share-instructions">
                    <p><strong>Image downloaded to your device!</strong></p>
                    <p>Caption copied to clipboard:</p>
                    <div class="caption-box">${caption}</div>
                </div>
                <div class="social-steps">
                    <h4>Quick Steps:</h4>
                    ${this.getPlatformSteps(platform)}
                </div>
                <button onclick="this.parentElement.parentElement.remove()" class="btn-primary">Got it!</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (modal.parentElement) {
                modal.remove();
            }
        }, 10000);
    }
    
    getPlatformSteps(platform) {
        const steps = {
            tiktok: `
                <ol>
                    <li>Open TikTok and create a new video</li>
                    <li>Upload the downloaded image</li>
                    <li>Paste the caption from your clipboard</li>
                    <li>Add trending music and effects</li>
                    <li>Post with #StacksGame #ViralGames</li>
                </ol>
            `,
            instagram: `
                <ol>
                    <li>Open Instagram and create a new post</li>
                    <li>Upload the downloaded image</li>
                    <li>Paste the caption from your clipboard</li>
                    <li>Add relevant hashtags</li>
                    <li>Tag friends to challenge them!</li>
                </ol>
            `,
            story: `
                <ol>
                    <li>Open Instagram/Facebook and go to Stories</li>
                    <li>Upload the downloaded image</li>
                    <li>Add stickers, music, or effects</li>
                    <li>Use the "Challenge" sticker</li>
                    <li>Share to your story!</li>
                </ol>
            `
        };
        
        return steps[platform] || steps.tiktok;
    }
    
    trackAchievement(type, value) {
        const achievement = {
            type: type,
            value: value,
            date: new Date().toISOString(),
            shareable: true
        };
        
        this.achievements.push(achievement);
        localStorage.setItem('stacksAchievements', JSON.stringify(this.achievements));
        
        // Check for milestone achievements
        this.checkMilestones();
    }
    
    checkMilestones() {
        const milestones = [
            { type: 'streak', value: 7, message: '🔥 1 Week Streak!' },
            { type: 'streak', value: 30, message: '🔥 1 Month Streak!' },
            { type: 'score', value: 100, message: '💯 Century Club!' },
            { type: 'score', value: 500, message: '🏆 High Scorer!' },
            { type: 'combo', value: 10, message: '🎯 Perfect Combo!' },
            { type: 'combo', value: 25, message: '⚡ Combo Master!' }
        ];
        
        milestones.forEach(milestone => {
            if (this.achievements.some(a => a.type === milestone.type && a.value >= milestone.value)) {
                this.showAchievement(milestone.message);
            }
        });
    }
    
    showAchievement(message) {
        const achievement = document.createElement('div');
        achievement.className = 'achievement-popup';
        achievement.innerHTML = `
            <div class="achievement-content">
                <h3>🎉 Achievement Unlocked!</h3>
                <p>${message}</p>
                <button onclick="this.parentElement.parentElement.remove()">Awesome!</button>
            </div>
        `;
        
        document.body.appendChild(achievement);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (achievement.parentElement) {
                achievement.remove();
            }
        }, 5000);
    }
}

// Initialize social integration
let social;
document.addEventListener('DOMContentLoaded', () => {
    social = new SocialMediaIntegration();
});
