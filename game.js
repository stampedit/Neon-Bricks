class StacksGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.score = 0;
        this.combo = 0;
        this.bestScore = parseInt(localStorage.getItem('stacksBestScore') || '0');
        this.coins = parseInt(localStorage.getItem('stacksCoins') || '0');
        this.currentScreen = 'start';
        this.isPlaying = false;
        this.isPaused = false;
        
        // Game mechanics
        this.blocks = [];
        this.currentBlock = null;
        this.blockSpeed = 2;
        this.blockDirection = 1;
        this.lastBlockWidth = 100;
        this.gameHeight = 0;
        this.maxHeight = this.canvas.height - 100;
        
        // Skins
        this.currentSkin = localStorage.getItem('stacksCurrentSkin') || 'default';
        this.unlockedSkins = JSON.parse(localStorage.getItem('stacksUnlockedSkins') || '["default"]');
        
        // Leaderboard
        this.leaderboardData = this.loadLeaderboard();
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateUI();
        this.showScreen('start');
        
        // Initialize skins
        this.initializeSkins();
    }
    
    setupEventListeners() {
        // Navigation
        document.getElementById('playBtn').addEventListener('click', () => this.startGame());
        document.getElementById('restartBtn').addEventListener('click', () => this.startGame());
        document.getElementById('leaderboardBtn').addEventListener('click', () => this.showScreen('leaderboard'));
        document.getElementById('skinsBtn').addEventListener('click', () => this.showScreen('skins'));
        document.getElementById('backFromLeaderboard').addEventListener('click', () => this.showScreen('start'));
        document.getElementById('backFromSkins').addEventListener('click', () => this.showScreen('start'));
        
        // Game controls
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        this.canvas.addEventListener('click', () => this.dropBlock());
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.dropBlock();
        });
        
        // Share functionality
        document.getElementById('shareBtn').addEventListener('click', () => this.showShareModal());
        document.getElementById('closeShare').addEventListener('click', () => this.hideShareModal());
        
        // Share buttons
        document.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.shareScore(e.target.dataset.platform));
        });
        
        // Leaderboard tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchLeaderboardTab(e.target.dataset.tab));
        });
    }
    
    showScreen(screenName) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenName + 'Screen').classList.add('active');
        this.currentScreen = screenName;
        
        if (screenName === 'leaderboard') {
            this.displayLeaderboard('daily');
        } else if (screenName === 'skins') {
            this.displaySkins();
        }
    }
    
    startGame() {
        this.score = 0;
        this.combo = 0;
        this.blocks = [];
        this.gameHeight = 0;
        this.blockSpeed = 2;
        this.lastBlockWidth = 100;
        this.isPlaying = true;
        this.isPaused = false;
        
        // Create base block
        this.blocks.push({
            x: this.canvas.width / 2 - 50,
            y: this.canvas.height - 50,
            width: 100,
            height: 20,
            color: this.getSkinColor(),
            isMoving: false
        });
        
        // Create first moving block
        this.createNewBlock();
        
        this.showScreen('game');
        this.gameLoop();
    }
    
    createNewBlock() {
        const width = this.lastBlockWidth;
        this.currentBlock = {
            x: 0,
            y: this.canvas.height - 50 - (this.blocks.length * 20),
            width: width,
            height: 20,
            color: this.getSkinColor(),
            isMoving: true,
            direction: 1
        };
        
        // Increase speed gradually
        this.blockSpeed = Math.min(2 + (this.blocks.length * 0.2), 8);
    }
    
    dropBlock() {
        if (!this.isPlaying || this.isPaused || !this.currentBlock || !this.currentBlock.isMoving) return;
        
        this.currentBlock.isMoving = false;
        
        // Calculate overlap with previous block
        const previousBlock = this.blocks[this.blocks.length - 1];
        const overlap = this.calculateOverlap(this.currentBlock, previousBlock);
        
        if (overlap <= 0) {
            // Game over - no overlap
            this.gameOver();
            return;
        }
        
        // Calculate new block width and position
        const newWidth = overlap;
        const newX = Math.max(this.currentBlock.x, previousBlock.x);
        
        // Create the cut piece (the part that doesn't overlap)
        const cutPiece = this.createCutPiece(this.currentBlock, previousBlock, newX, newWidth);
        
        // Update current block
        this.currentBlock.width = newWidth;
        this.currentBlock.x = newX;
        this.blocks.push(this.currentBlock);
        
        // Animate cut piece falling
        if (cutPiece) {
            this.animateCutPiece(cutPiece);
        }
        
        // Update score and combo
        const accuracy = overlap / this.lastBlockWidth;
        if (accuracy > 0.9) {
            this.combo++;
            this.score += 10 * this.combo;
        } else {
            this.combo = 0;
            this.score += 5;
        }
        
        // Award coins for perfect stacks
        if (accuracy === 1) {
            this.coins += 2;
            localStorage.setItem('stacksCoins', this.coins.toString());
        }
        
        this.lastBlockWidth = newWidth;
        this.gameHeight += 20;
        
        // Create next block
        this.createNewBlock();
        this.updateUI();
        
        // Check win condition
        if (this.blocks.length >= 50) {
            this.win();
        }
    }
    
    calculateOverlap(block1, block2) {
        const left = Math.max(block1.x, block2.x);
        const right = Math.min(block1.x + block1.width, block2.x + block2.width);
        return Math.max(0, right - left);
    }
    
    createCutPiece(currentBlock, previousBlock, newX, newWidth) {
        const cutPiece = {
            y: currentBlock.y,
            width: 0,
            height: 20,
            color: currentBlock.color,
            velocity: 0
        };
        
        if (currentBlock.x < previousBlock.x) {
            // Cut piece on the left
            cutPiece.x = currentBlock.x;
            cutPiece.width = previousBlock.x - currentBlock.x;
        } else if (currentBlock.x + currentBlock.width > previousBlock.x + previousBlock.width) {
            // Cut piece on the right
            cutPiece.x = previousBlock.x + previousBlock.width;
            cutPiece.width = (currentBlock.x + currentBlock.width) - (previousBlock.x + previousBlock.width);
        }
        
        return cutPiece.width > 0 ? cutPiece : null;
    }
    
    animateCutPiece(cutPiece) {
        const animate = () => {
            cutPiece.y += cutPiece.velocity;
            cutPiece.velocity += 0.5; // gravity
            
            if (cutPiece.y < this.canvas.height) {
                this.ctx.fillStyle = cutPiece.color;
                this.ctx.fillRect(cutPiece.x, cutPiece.y, cutPiece.width, cutPiece.height);
                requestAnimationFrame(animate);
            }
        };
        animate();
    }
    
    gameLoop() {
        if (!this.isPlaying) return;
        
        if (!this.isPaused) {
            this.update();
            this.render();
        }
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        if (this.currentBlock && this.currentBlock.isMoving) {
            this.currentBlock.x += this.blockSpeed * this.currentBlock.direction;
            
            // Bounce off walls
            if (this.currentBlock.x <= 0 || this.currentBlock.x + this.currentBlock.width >= this.canvas.width) {
                this.currentBlock.direction *= -1;
            }
        }
    }
    
    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#f0f0f0');
        gradient.addColorStop(1, '#e0e0e0');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw blocks
        this.blocks.forEach(block => {
            this.drawBlock(block);
        });
        
        // Draw current block
        if (this.currentBlock) {
            this.drawBlock(this.currentBlock);
        }
        
        // Draw combo indicator
        if (this.combo > 2) {
            this.drawComboIndicator();
        }
    }
    
    drawBlock(block) {
        // Add shadow
        this.ctx.shadowColor = 'rgba(0,0,0,0.2)';
        this.ctx.shadowBlur = 10;
        this.ctx.shadowOffsetY = 5;
        
        this.ctx.fillStyle = block.color;
        this.ctx.fillRect(block.x, block.y, block.width, block.height);
        
        // Add highlight
        this.ctx.shadowBlur = 0;
        this.ctx.shadowOffsetY = 0;
        this.ctx.fillStyle = 'rgba(255,255,255,0.3)';
        this.ctx.fillRect(block.x, block.y, block.width, 2);
    }
    
    drawComboIndicator() {
        this.ctx.save();
        this.ctx.font = 'bold 24px Inter';
        this.ctx.fillStyle = '#ff6b6b';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`${this.combo}x COMBO!`, this.canvas.width / 2, 100);
        this.ctx.restore();
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
        document.getElementById('pauseBtn').textContent = this.isPaused ? '▶️' : '⏸️';
    }
    
    gameOver() {
        this.isPlaying = false;
        
        // Update best score
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('stacksBestScore', this.bestScore.toString());
            document.getElementById('newRecord').style.display = 'block';
        } else {
            document.getElementById('newRecord').style.display = 'none';
        }
        
        // Save to leaderboard
        this.saveToLeaderboard();
        
        // Update game over screen
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('finalBest').textContent = this.bestScore;
        document.getElementById('shareScore').textContent = this.score;
        
        this.showScreen('gameOver');
    }
    
    win() {
        this.score += 1000;
        this.coins += 50;
        localStorage.setItem('stacksCoins', this.coins.toString());
        this.gameOver();
    }
    
    showShareModal() {
        document.getElementById('shareModal').classList.add('active');
    }
    
    hideShareModal() {
        document.getElementById('shareModal').classList.remove('active');
    }
    
    shareScore(platform) {
        const shareText = `Can you beat my score of ${this.score} in STACKS? 🏆`;
        const shareUrl = window.location.href;
        
        switch(platform) {
            case 'tiktok':
                // Copy to clipboard for TikTok
                navigator.clipboard.writeText(`${shareText} Play now: ${shareUrl}`);
                alert('Text copied to clipboard! Paste it in your TikTok video.');
                break;
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`);
                break;
            case 'copy':
                navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
                alert('Link copied to clipboard!');
                break;
        }
        
        this.hideShareModal();
    }
    
    loadLeaderboard() {
        const saved = localStorage.getItem('stacksLeaderboard');
        return saved ? JSON.parse(saved) : {
            daily: [],
            friends: [],
            global: []
        };
    }
    
    saveToLeaderboard() {
        const entry = {
            name: 'You',
            score: this.score,
            date: new Date().toISOString()
        };
        
        // Add to daily leaderboard
        this.leaderboardData.daily.push(entry);
        this.leaderboardData.daily.sort((a, b) => b.score - a.score);
        this.leaderboardData.daily = this.leaderboardData.daily.slice(0, 10);
        
        // Add to global leaderboard
        this.leaderboardData.global.push(entry);
        this.leaderboardData.global.sort((a, b) => b.score - a.score);
        this.leaderboardData.global = this.leaderboardData.global.slice(0, 100);
        
        localStorage.setItem('stacksLeaderboard', JSON.stringify(this.leaderboardData));
    }
    
    switchLeaderboardTab(tab) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        this.displayLeaderboard(tab);
    }
    
    displayLeaderboard(type) {
        const list = document.getElementById('leaderboardList');
        const data = this.leaderboardData[type] || [];
        
        // Generate some fake data for demonstration
        if (data.length === 0) {
            const fakeNames = ['Alex', 'Sam', 'Jordan', 'Casey', 'Morgan', 'Taylor', 'Riley', 'Avery'];
            for (let i = 0; i < 8; i++) {
                data.push({
                    name: fakeNames[i],
                    score: Math.floor(Math.random() * 500) + 100
                });
            }
            data.sort((a, b) => b.score - a.score);
        }
        
        list.innerHTML = data.map((entry, index) => `
            <div class="leaderboard-item">
                <span class="rank">#${index + 1}</span>
                <span class="player-name">${entry.name}</span>
                <span class="player-score">${entry.score}</span>
            </div>
        `).join('');
    }
    
    initializeSkins() {
        this.skins = [
            { id: 'default', name: 'Classic', color: '#667eea', price: 0, unlocked: true },
            { id: 'fire', name: 'Fire', color: '#ff6b6b', price: 100, unlocked: false },
            { id: 'ocean', name: 'Ocean', color: '#4ecdc4', price: 150, unlocked: false },
            { id: 'forest', name: 'Forest', color: '#95e77e', price: 200, unlocked: false },
            { id: 'sunset', name: 'Sunset', color: '#ff9f43', price: 250, unlocked: false },
            { id: 'galaxy', name: 'Galaxy', color: '#9b59b6', price: 500, unlocked: false }
        ];
        
        // Update unlocked status
        this.skins.forEach(skin => {
            if (this.unlockedSkins.includes(skin.id)) {
                skin.unlocked = true;
            }
        });
    }
    
    displaySkins() {
        document.getElementById('coinCount').textContent = this.coins;
        
        const list = document.getElementById('skinsList');
        list.innerHTML = this.skins.map(skin => `
            <div class="skin-item ${skin.id === this.currentSkin ? 'selected' : ''}" data-skin="${skin.id}">
                <div class="skin-preview" style="background: ${skin.color}"></div>
                <div>${skin.name}</div>
                ${skin.unlocked ? 
                    (skin.id === this.currentSkin ? '<div>✓ Selected</div>' : '<div>Owned</div>') :
                    `<div class="skin-price">🪙 ${skin.price}</div>`
                }
            </div>
        `).join('');
        
        // Add click handlers
        document.querySelectorAll('.skin-item').forEach(item => {
            item.addEventListener('click', () => this.selectSkin(item.dataset.skin));
        });
    }
    
    selectSkin(skinId) {
        const skin = this.skins.find(s => s.id === skinId);
        
        if (skin.unlocked) {
            this.currentSkin = skinId;
            localStorage.setItem('stacksCurrentSkin', skinId);
            this.displaySkins();
        } else if (this.coins >= skin.price) {
            // Purchase skin
            this.coins -= skin.price;
            localStorage.setItem('stacksCoins', this.coins.toString());
            skin.unlocked = true;
            this.unlockedSkins.push(skinId);
            localStorage.setItem('stacksUnlockedSkins', JSON.stringify(this.unlockedSkins));
            this.currentSkin = skinId;
            localStorage.setItem('stacksCurrentSkin', skinId);
            this.displaySkins();
        } else {
            alert('Not enough coins!');
        }
    }
    
    getSkinColor() {
        const skin = this.skins.find(s => s.id === this.currentSkin);
        return skin ? skin.color : '#667eea';
    }
    
    updateUI() {
        document.getElementById('currentScore').textContent = this.score;
        document.getElementById('comboCount').textContent = this.combo;
        document.getElementById('bestScore').textContent = this.bestScore;
        document.getElementById('coinCount').textContent = this.coins;
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    const game = new StacksGame();
});
