/**
 * STACKS - Enhanced Version V2 with Better Power-ups
 * Improved power-up collection and activation system
 */

class StacksGameEnhancedV2 {
    constructor() {
        // Canvas setup
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.setupCanvas();
        
        // Game systems
        this.stateManager = new StateManager();
        this.particleSystem = new ParticleSystem(this.canvas, this.ctx);
        this.soundSystem = new SoundSystem();
        
        // Game state
        this.score = 0;
        this.combo = 0;
        this.maxCombo = 0;
        this.level = 1;
        this.blocks = [];
        this.currentBlock = null;
        this.lastBlock = null;
        this.gameHeight = 0;
        this.maxHeight = this.canvas.height - 100;
        
        // Enhanced mechanics
        this.streak = 0;
        this.maxStreak = 0;
        this.powerUps = [];
        this.activePowerUp = null;
        this.collectedPowerUps = []; // Inventory system
        this.specialBlocks = [];
        this.timeBonus = 1.0;
        this.speedBonus = 1.0;
        this.perfectStreak = 0;
        this.totalPerfects = 0;
        this.milestoneLevel = 0;
        
        // Visual effects
        this.screenFlash = 0;
        this.screenZoom = 1.0;
        this.backgroundPulse = 0;
        this.celebrationMode = false;
        this.rainbowMode = false;
        this.slowMotion = false;
        
        // Block physics
        this.blockSpeed = 3;
        this.blockDirection = 1;
        this.lastBlockWidth = 100;
        this.perfectStacks = 0;
        this.totalStacks = 0;
        
        // Visual effects
        this.screenShake = 0;
        this.screenShakeDecay = 0.9;
        this.backgroundOffset = 0;
        this.particlesEnabled = true;
        
        // Enhanced power-ups system
        this.powerUpTypes = {
            slowmo: {
                name: 'Slow Motion',
                color: '#00CED1',
                duration: 5000,
                icon: '⏱️',
                description: 'Slows down blocks'
            },
            magnet: {
                name: 'Magnet',
                color: '#FFD700',
                duration: 3000,
                icon: '🧲',
                description: 'Auto-aligns blocks'
            },
            shield: {
                name: 'Shield',
                color: '#FF69B4',
                duration: 0,
                icon: '🛡️',
                description: 'Protects from one mistake'
            },
            double: {
                name: 'Double Points',
                color: '#32CD32',
                duration: 10000,
                icon: 'x2',
                description: 'Doubles your score'
            },
            freeze: {
                name: 'Freeze',
                color: '#87CEEB',
                duration: 2000,
                icon: '❄️',
                description: 'Stops block movement'
            },
            expand: {
                name: 'Expand',
                color: '#FF6347',
                duration: 0,
                icon: '↔️',
                description: 'Makes next block wider'
            },
            shrink: {
                name: 'Shrink',
                color: '#9370DB',
                duration: 0,
                icon: '↔️',
                description: 'Makes next block narrower'
            }
        };
        
        // Controls
        this.controls = {
            space: false,
            mouse: false,
            touch: false,
            touchStartX: 0,
            touchStartY: 0
        };
        
        // Enhanced themes
        this.themes = {
            marvel: [
                '#FF0000', '#FFD700', '#0000FF', '#FFFFFF', '#FF0000',
                '#8B0000', '#9B59B6', '#FF6B35', '#3498DB', '#2ECC71'
            ],
            sonic: [
                '#0066CC', '#FF0000', '#FFFFFF', '#FFD700', '#FF6B6B',
                '#000000', '#FFA500', '#800080', '#00CED1', '#FF1493'
            ],
            neon: [
                '#FF006E', '#FB5607', '#FFBE0B', '#8338EC', '#3A86FF',
                '#06FFB4', '#FF4365', '#00D9FF', '#FFD23F', '#FF1B8D'
            ]
        };
        
        this.currentTheme = 'neon';
        this.blockColors = this.themes.neon;
        
        // Performance
        this.lastTime = 0;
        this.fps = 60;
        this.targetFPS = 60;
        this.frameSkip = 0;
        
        // High scores
        this.highScores = this.loadHighScores();
        this.isNewHighScore = false;
        
        // Achievements
        this.achievements = this.loadAchievements();
        this.unlockedAchievements = [];
        
        this.init();
    }
    
    /**
     * Initialize the game
     */
    init() {
        this.setupEventListeners();
        this.setupStateManager();
        this.loadSettings();
        this.stateManager.setState('menu');
        
        // Start game loop
        this.gameLoop();
    }
    
    /**
     * Setup canvas dimensions
     */
    setupCanvas() {
        const resize = () => {
            const maxWidth = Math.min(window.innerWidth, 800);
            const maxHeight = Math.min(window.innerHeight, 600);
            
            this.canvas.width = maxWidth;
            this.canvas.height = maxHeight;
            
            // Update game dimensions
            this.maxHeight = this.canvas.height - 100;
        };
        
        resize();
        window.addEventListener('resize', resize);
    }
    
    /**
     * Setup event listeners for controls
     */
    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.controls.space = true;
                this.handleSpacePress();
            }
            if (e.code === 'Escape') {
                this.handleEscapePress();
            }
            if (e.code === 'Enter') {
                this.handleEnterPress();
            }
            if (e.code === 'KeyP') {
                e.preventDefault();
                this.activateNextPowerUp();
            }
            // Number keys to select specific power-ups
            if (e.code >= 'Digit1' && e.code <= 'Digit7') {
                e.preventDefault();
                const index = parseInt(e.code.replace('Digit', '')) - 1;
                this.activatePowerUpByIndex(index);
            }
        });
        
        document.addEventListener('keyup', (e) => {
            if (e.code === 'Space') {
                this.controls.space = false;
            }
        });
        
        // Mouse controls
        this.canvas.addEventListener('click', () => {
            this.controls.mouse = true;
            this.handleClick();
        });
        
        // Touch controls
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.controls.touch = true;
            const touch = e.touches[0];
            this.controls.touchStartX = touch.clientX;
            this.controls.touchStartY = touch.clientY;
            this.handleTouch();
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.controls.touch = false;
        });
        
        // Prevent context menu on right click
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
    
    /**
     * Setup state manager event listeners
     */
    setupStateManager() {
        this.stateManager.addListener('stateChanged', (data) => {
            this.handleStateChange(data);
        });
    }
    
    /**
     * Handle state changes
     */
    handleStateChange(data) {
        const { from, to } = data;
        
        // Initialize audio on first interaction
        if (!this.soundSystem.initialized) {
            this.soundSystem.initialize();
            this.soundSystem.loadSettings();
            this.soundSystem.startBackgroundMusic('main');
        }
        
        switch (to) {
            case 'menu':
                this.resetGame();
                break;
            case 'playing':
                this.startGame();
                break;
            case 'paused':
                this.pauseGame();
                break;
            case 'game_over':
                this.endGame();
                break;
        }
    }
    
    /**
     * Handle space bar press
     */
    handleSpacePress() {
        if (this.stateManager.isState('playing')) {
            this.dropBlock();
        } else if (this.stateManager.isState('menu')) {
            this.stateManager.setState('playing');
        } else if (this.stateManager.isState('game_over')) {
            this.stateManager.setState('playing');
        }
    }
    
    /**
     * Handle escape press
     */
    handleEscapePress() {
        if (this.stateManager.isState('playing')) {
            this.stateManager.setState('paused');
        } else if (this.stateManager.isState('paused')) {
            this.stateManager.setState('playing');
        } else if (this.stateManager.isState('settings')) {
            this.stateManager.setState('menu');
        }
    }
    
    /**
     * Handle enter press
     */
    handleEnterPress() {
        if (this.stateManager.isState('menu')) {
            this.stateManager.setState('playing');
        }
    }
    
    /**
     * Handle mouse click
     */
    handleClick() {
        if (this.stateManager.isState('playing')) {
            this.dropBlock();
        }
    }
    
    /**
     * Handle touch input
     */
    handleTouch() {
        if (this.stateManager.isState('playing')) {
            this.dropBlock();
        }
    }
    
    /**
     * Start a new game
     */
    startGame() {
        this.resetGame();
        this.createInitialBlock();
        this.soundSystem.startBackgroundMusic('main');
    }
    
    /**
     * Reset game state
     */
    resetGame() {
        this.score = 0;
        this.combo = 0;
        this.level = 1;
        this.blocks = [];
        this.currentBlock = null;
        this.lastBlock = null;
        this.gameHeight = 0;
        this.blockSpeed = 3;
        this.perfectStacks = 0;
        this.totalStacks = 0;
        this.screenShake = 0;
        this.isNewHighScore = false;
        this.particleSystem.clear();
        this.powerUps = [];
        this.activePowerUp = null;
        this.collectedPowerUps = [];
        this.celebrationMode = false;
        this.rainbowMode = false;
        this.slowMotion = false;
    }
    
    /**
     * Create initial block
     */
    createInitialBlock() {
        this.currentBlock = {
            x: this.canvas.width / 2 - 50,
            y: 50,
            width: 100,
            height: 20,
            color: this.getRandomColor(),
            direction: 1,
            speed: this.blockSpeed,
            isPowerUp: false
        };
    }
    
    /**
     * Get random color from current theme
     */
    getRandomColor() {
        return this.blockColors[Math.floor(Math.random() * this.blockColors.length)];
    }
    
    /**
     * Drop the current block - FIXED VERSION
     */
    dropBlock() {
        if (!this.currentBlock || !this.stateManager.isState('playing')) return;
        
        this.soundSystem.playSound('blockLand');
        
        // Create particle effect
        this.particleSystem.createExplosion(
            this.currentBlock.x + this.currentBlock.width / 2,
            this.currentBlock.y + this.currentBlock.height / 2,
            this.currentBlock.color
        );
        
        // Check if block is placed correctly
        if (this.checkBlockPlacement()) {
            this.placeBlock();
        } else {
            // Check if shield is active
            if (this.hasShield()) {
                this.useShield();
                this.placeBlock(); // Allow the placement
            } else {
                this.gameOver();
            }
        }
    }
    
    /**
     * Check if block is placed correctly - FIXED VERSION
     */
    checkBlockPlacement() {
        // First block always succeeds
        if (!this.lastBlock) return true;
        
        const blockLeft = this.currentBlock.x;
        const blockRight = this.currentBlock.x + this.currentBlock.width;
        const lastBlockLeft = this.lastBlock.x;
        const lastBlockRight = this.lastBlock.x + this.lastBlock.width;
        
        // Check if blocks overlap
        const overlap = blockRight > lastBlockLeft && blockLeft < lastBlockRight;
        
        // Add some tolerance for easier gameplay
        const tolerance = 5;
        return overlap || (Math.abs(blockLeft - lastBlockLeft) < tolerance) || (Math.abs(blockRight - lastBlockRight) < tolerance);
    }
    
    /**
     * Place the current block
     */
    placeBlock() {
        this.totalStacks++;
        
        // Check if this was a power-up block and collect it
        if (this.currentBlock.isPowerUp && this.currentBlock.powerUpType) {
            this.collectPowerUp(this.currentBlock.powerUpType);
        }
        
        // Calculate perfect placement bonus
        let isPerfect = false;
        if (this.lastBlock) {
            const centerDiff = Math.abs(
                (this.currentBlock.x + this.currentBlock.width / 2) -
                (this.lastBlock.x + this.lastBlock.width / 2)
            );
            
            isPerfect = centerDiff < 8; // Increased tolerance
            
            if (isPerfect) {
                this.perfectStacks++;
                this.combo++;
                let points = 100 * this.level * (1 + this.combo * 0.5);
                
                // Apply double points if active
                if (this.activePowerUp && this.activePowerUp.type === 'double') {
                    points *= 2;
                }
                
                this.score += points;
                this.soundSystem.playSound('perfectPlacement');
                this.particleSystem.createPerfectEffect(
                    this.currentBlock.x + this.currentBlock.width / 2,
                    this.currentBlock.y + this.currentBlock.height / 2
                );
                this.triggerScreenShake(5);
                
                // Check for achievements
                this.checkAchievements();
            } else {
                this.combo = 0;
                let points = 50 * this.level;
                
                // Apply double points if active
                if (this.activePowerUp && this.activePowerUp.type === 'double') {
                    points *= 2;
                }
                
                this.score += points;
            }
        } else {
            let points = 50 * this.level;
            
            // Apply double points if active
            if (this.activePowerUp && this.activePowerUp.type === 'double') {
                points *= 2;
            }
            
            this.score += points;
        }
        
        // Create combo effect
        if (this.combo > 0) {
            this.soundSystem.playComboSound(this.combo);
            this.particleSystem.createComboEffect(
                this.currentBlock.x + this.currentBlock.width / 2,
                this.currentBlock.y + this.currentBlock.height / 2,
                this.combo
            );
        }
        
        // Calculate new block width based on placement
        if (this.lastBlock) {
            const blockLeft = this.currentBlock.x;
            const blockRight = this.currentBlock.x + this.currentBlock.width;
            const lastBlockLeft = this.lastBlock.x;
            const lastBlockRight = this.lastBlock.x + this.lastBlock.width;
            
            const overlapLeft = Math.max(blockLeft, lastBlockLeft);
            const overlapRight = Math.min(blockRight, lastBlockRight);
            const overlapWidth = overlapRight - overlapLeft;
            
            // Cut the block to the overlap
            if (overlapWidth > 0) {
                this.currentBlock.x = overlapLeft;
                this.currentBlock.width = overlapWidth;
                
                // Create falling piece if there's an overhang
                if (blockLeft < lastBlockLeft || blockRight > lastBlockRight) {
                    this.createFallingPiece(blockLeft, blockRight, lastBlockLeft, lastBlockRight);
                }
            }
        }
        
        // Add block to stack
        this.blocks.push(this.currentBlock);
        this.lastBlock = this.currentBlock;
        this.lastBlockWidth = this.currentBlock.width;
        
        // Update game height
        this.gameHeight += this.currentBlock.height;
        
        // Check level progression
        if (this.totalStacks % 10 === 0) {
            this.levelUp();
        }
        
        // Create new block
        this.createNewBlock();
        
        // Check for high score
        this.checkHighScore();
    }
    
    /**
     * Create falling piece from overhang
     */
    createFallingPiece(blockLeft, blockRight, lastBlockLeft, lastBlockRight) {
        let fallingX, fallingWidth;
        
        if (blockLeft < lastBlockLeft) {
            fallingX = blockLeft;
            fallingWidth = lastBlockLeft - blockLeft;
        } else {
            fallingX = lastBlockRight;
            fallingWidth = blockRight - lastBlockRight;
        }
        
        if (fallingWidth > 5) {
            this.particleSystem.createExplosion(
                fallingX + fallingWidth / 2,
                this.currentBlock.y,
                this.currentBlock.color,
                10
            );
        }
    }
    
    /**
     * Create new moving block with power-ups
     */
    createNewBlock() {
        // Check if we should apply expand/shrink power-up
        let widthModifier = 1;
        if (this.activePowerUp) {
            if (this.activePowerUp.type === 'expand') {
                widthModifier = 1.3;
                this.activePowerUp = null; // One-time use
            } else if (this.activePowerUp.type === 'shrink') {
                widthModifier = 0.7;
                this.activePowerUp = null; // One-time use
            }
        }
        
        // Occasionally create power-up blocks (more frequent now)
        const isPowerUpBlock = Math.random() < 0.25;
        
        this.currentBlock = {
            x: 0,
            y: this.gameHeight + 50,
            width: this.lastBlockWidth * widthModifier,
            height: 20,
            color: isPowerUpBlock ? this.getRandomPowerUpColor() : this.getRandomColor(),
            direction: 1,
            speed: this.blockSpeed + (this.level - 1) * 0.5,
            isPowerUp: isPowerUpBlock,
            powerUpType: isPowerUpBlock ? this.getRandomPowerUpType() : null
        };
    }
    
    /**
     * Get random power-up color
     */
    getRandomPowerUpColor() {
        const types = Object.keys(this.powerUpTypes);
        const type = types[Math.floor(Math.random() * types.length)];
        return this.powerUpTypes[type].color;
    }
    
    /**
     * Get random power-up type
     */
    getRandomPowerUpType() {
        const types = Object.keys(this.powerUpTypes);
        return types[Math.floor(Math.random() * types.length)];
    }
    
    /**
     * Collect power-up when placing a power-up block
     */
    collectPowerUp(type) {
        const powerUp = this.powerUpTypes[type];
        if (powerUp) {
            this.collectedPowerUps.push({
                type: type,
                ...powerUp
            });
            
            this.soundSystem.playSound('powerUp');
            this.particleSystem.createSparkleEffect(
                this.currentBlock.x + this.currentBlock.width / 2,
                this.currentBlock.y + this.currentBlock.height / 2,
                20
            );
            
            console.log(`🎁 Collected ${powerUp.name}! Press P or 1-7 to use.`);
        }
    }
    
    /**
     * Activate next power-up in inventory
     */
    activateNextPowerUp() {
        if (this.collectedPowerUps.length > 0) {
            const powerUp = this.collectedPowerUps.shift(); // Take first one
            this.activatePowerUp(powerUp);
        } else {
            console.log('No power-ups collected! Stack power-up blocks to collect them.');
        }
    }
    
    /**
     * Activate power-up by index (for number keys 1-7)
     */
    activatePowerUpByIndex(index) {
        if (index >= 0 && index < this.collectedPowerUps.length) {
            const powerUp = this.collectedPowerUps.splice(index, 1)[0];
            this.activatePowerUp(powerUp);
        }
    }
    
    /**
     * Activate power-up
     */
    activatePowerUp(powerUp) {
        this.activePowerUp = powerUp;
        this.soundSystem.playSound('powerUp');
        this.particleSystem.createSparkleEffect(
            this.canvas.width / 2,
            this.canvas.height / 2,
            30
        );
        
        console.log(`⚡ Activated ${powerUp.name}!`);
        
        // Apply power-up effects
        switch (powerUp.type) {
            case 'slowmo':
                this.blockSpeed *= 0.5;
                this.slowMotion = true;
                break;
            case 'magnet':
                // Magnet effect - easier stacking
                break;
            case 'shield':
                // Shield - allows one mistake
                break;
            case 'double':
                // Double points - handled in scoring
                break;
            case 'freeze':
                // Freeze block movement
                break;
            case 'expand':
            case 'shrink':
                // Handled in createNewBlock
                break;
        }
        
        // Set timer for duration-based power-ups
        if (powerUp.duration > 0) {
            setTimeout(() => {
                this.deactivatePowerUp(powerUp);
            }, powerUp.duration);
        }
    }
    
    /**
     * Deactivate power-up
     */
    deactivatePowerUp(powerUp) {
        if (this.activePowerUp && this.activePowerUp.type === powerUp.type) {
            this.activePowerUp = null;
            
            // Remove power-up effects
            switch (powerUp.type) {
                case 'slowmo':
                    this.blockSpeed *= 2;
                    this.slowMotion = false;
                    break;
            }
            
            console.log(`⏰ ${powerUp.name} deactivated`);
        }
    }
    
    /**
     * Check if shield is active
     */
    hasShield() {
        return this.activePowerUp && this.activePowerUp.type === 'shield';
    }
    
    /**
     * Use shield
     */
    useShield() {
        if (this.hasShield()) {
            this.activePowerUp = null;
            this.particleSystem.createShieldEffect(
                this.currentBlock.x + this.currentBlock.width / 2,
                this.currentBlock.y + this.currentBlock.height / 2
            );
            console.log('🛡️ Shield used - mistake prevented!');
        }
    }
    
    /**
     * Level up
     */
    levelUp() {
        this.level++;
        this.soundSystem.playSound('levelUp');
        this.particleSystem.createSparkleEffect(
            this.canvas.width / 2,
            this.canvas.height / 2,
            30
        );
        this.triggerScreenShake(10);
        
        // Increase difficulty
        this.blockSpeed = Math.min(this.blockSpeed + 0.3, 8);
        
        // Change music to more intense
        if (this.level > 5) {
            this.soundSystem.startBackgroundMusic('intense');
        }
        
        // Unlock achievements
        this.checkMilestoneAchievements();
    }
    
    /**
     * Check achievements
     */
    checkAchievements() {
        // Perfect streak achievement
        if (this.perfectStreak >= 5 && !this.unlockedAchievements.includes('perfect_5')) {
            this.unlockAchievement('perfect_5', 'Perfect Streak 5');
        }
        
        // Combo achievement
        if (this.combo >= 10 && !this.unlockedAchievements.includes('combo_10')) {
            this.unlockAchievement('combo_10', 'Combo Master');
        }
        
        // Score achievements
        if (this.score >= 1000 && !this.unlockedAchievements.includes('score_1000')) {
            this.unlockAchievement('score_1000', 'Score 1000');
        }
    }
    
    /**
     * Check milestone achievements
     */
    checkMilestoneAchievements() {
        if (this.level >= 5 && !this.unlockedAchievements.includes('level_5')) {
            this.unlockAchievement('level_5', 'Level 5');
        }
        
        if (this.level >= 10 && !this.unlockedAchievements.includes('level_10')) {
            this.unlockAchievement('level_10', 'Level 10');
        }
    }
    
    /**
     * Unlock achievement
     */
    unlockAchievement(id, name) {
        this.unlockedAchievements.push(id);
        this.soundSystem.playSound('milestone');
        this.particleSystem.createRainbowEffect(
            this.canvas.width / 2,
            this.canvas.height / 2
        );
        
        console.log(`🏆 Achievement Unlocked: ${name}`);
    }
    
    /**
     * Trigger screen shake effect
     */
    triggerScreenShake(intensity) {
        this.screenShake = intensity;
    }
    
    /**
     * Update screen shake
     */
    updateScreenShake() {
        if (this.screenShake > 0) {
            this.screenShake *= this.screenShakeDecay;
            if (this.screenShake < 0.1) {
                this.screenShake = 0;
            }
        }
    }
    
    /**
     * Update current block movement
     */
    updateCurrentBlock() {
        if (!this.currentBlock || !this.stateManager.isState('playing')) return;
        
        // Apply slow motion if active
        const speedMultiplier = this.slowMotion ? 0.5 : 1;
        
        // Apply freeze if active
        if (this.activePowerUp && this.activePowerUp.type === 'freeze') {
            return; // Don't move the block
        }
        
        // Apply magnet effect if active
        if (this.activePowerUp && this.activePowerUp.type === 'magnet' && this.lastBlock) {
            const targetCenter = this.lastBlock.x + this.lastBlock.width / 2;
            const currentCenter = this.currentBlock.x + this.currentBlock.width / 2;
            const diff = targetCenter - currentCenter;
            
            // Gradually align with last block
            this.currentBlock.x += diff * 0.05;
        }
        
        // Move block horizontally
        this.currentBlock.x += this.currentBlock.speed * this.currentBlock.direction * speedMultiplier;
        
        // Bounce off walls
        if (this.currentBlock.x <= 0 || 
            this.currentBlock.x + this.currentBlock.width >= this.canvas.width) {
            this.currentBlock.direction *= -1;
            this.currentBlock.x = Math.max(0, 
                Math.min(this.currentBlock.x, this.canvas.width - this.currentBlock.width));
        }
        
        // Create trail effect
        if (Math.random() < 0.3) {
            this.particleSystem.createTrailEffect(
                this.currentBlock.x,
                this.currentBlock.y,
                this.currentBlock.width,
                this.currentBlock.height
            );
        }
    }
    
    /**
     * Check for game over
     */
    gameOver() {
        this.stateManager.setState('game_over', {
            finalScore: this.score,
            isNewRecord: this.isNewHighScore
        });
        
        this.soundSystem.playSound('gameOver');
        this.soundSystem.stopBackgroundMusic();
        this.particleSystem.createSmokeEffect(
            this.currentBlock.x + this.currentBlock.width / 2,
            this.currentBlock.y + this.currentBlock.height / 2
        );
        this.triggerScreenShake(20);
    }
    
    /**
     * End game
     */
    endGame() {
        this.saveHighScore();
        this.saveAchievements();
    }
    
    /**
     * Pause game
     */
    pauseGame() {
        this.soundSystem.stopBackgroundMusic();
    }
    
    /**
     * Resume game
     */
    resumeGame() {
        this.soundSystem.startBackgroundMusic(this.level > 5 ? 'intense' : 'main');
    }
    
    /**
     * Check for high score
     */
    checkHighScore() {
        const minHighScore = this.highScores[this.highScores.length - 1]?.score || 0;
        if (this.score > minHighScore) {
            this.isNewHighScore = true;
            if (this.combo > this.maxCombo) {
                this.maxCombo = this.combo;
            }
        }
    }
    
    /**
     * Load high scores from localStorage
     */
    loadHighScores() {
        const saved = localStorage.getItem('stacksHighScores');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (error) {
                console.error('Failed to load high scores:', error);
            }
        }
        
        // Default high scores
        return [
            { name: 'ACE', score: 1000 },
            { name: 'PRO', score: 800 },
            { name: 'HERO', score: 600 },
            { name: 'STAR', score: 400 },
            { name: 'NOVA', score: 200 }
        ];
    }
    
    /**
     * Save high score
     */
    saveHighScore() {
        if (this.isNewHighScore) {
            this.highScores.push({
                name: 'PLAYER',
                score: this.score,
                date: new Date().toISOString()
            });
            
            // Sort and keep top 5
            this.highScores.sort((a, b) => b.score - a.score);
            this.highScores = this.highScores.slice(0, 5);
            
            localStorage.setItem('stacksHighScores', JSON.stringify(this.highScores));
            
            if (this.score > 1000) {
                this.soundSystem.playSound('highScore');
            }
        }
    }
    
    /**
     * Load achievements
     */
    loadAchievements() {
        const saved = localStorage.getItem('stacksAchievements');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (error) {
                console.error('Failed to load achievements:', error);
            }
        }
        
        return {};
    }
    
    /**
     * Save achievements
     */
    saveAchievements() {
        const achievementData = {};
        this.unlockedAchievements.forEach(id => {
            achievementData[id] = true;
        });
        
        localStorage.setItem('stacksAchievements', JSON.stringify(achievementData));
    }
    
    /**
     * Load settings
     */
    loadSettings() {
        const settings = localStorage.getItem('stacksGameSettings');
        if (settings) {
            try {
                const parsed = JSON.parse(settings);
                this.currentTheme = parsed.theme || 'neon';
                this.blockColors = this.themes[this.currentTheme];
                this.particlesEnabled = parsed.particlesEnabled !== false;
            } catch (error) {
                console.error('Failed to load game settings:', error);
            }
        }
    }
    
    /**
     * Save settings
     */
    saveSettings() {
        const settings = {
            theme: this.currentTheme,
            particlesEnabled: this.particlesEnabled
        };
        localStorage.setItem('stacksGameSettings', JSON.stringify(settings));
    }
    
    /**
     * Switch theme
     */
    switchTheme(theme) {
        if (this.themes[theme]) {
            this.currentTheme = theme;
            this.blockColors = this.themes[theme];
            this.saveSettings();
        }
    }
    
    /**
     * Update game state
     */
    update(deltaTime) {
        if (!this.stateManager.isState('playing')) return;
        
        // Update current block
        this.updateCurrentBlock();
        
        // Update particles
        if (this.particlesEnabled) {
            this.particleSystem.update();
        }
        
        // Update screen shake
        this.updateScreenShake();
        
        // Update background
        this.backgroundOffset += deltaTime * 10;
        
        // Check if block is too high
        if (this.currentBlock && this.currentBlock.y > this.maxHeight) {
            this.gameOver();
        }
    }
    
    /**
     * Render game
     */
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#0a0a0a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Apply screen shake
        if (this.screenShake > 0) {
            const shakeX = (Math.random() - 0.5) * this.screenShake;
            const shakeY = (Math.random() - 0.5) * this.screenShake;
            this.ctx.save();
            this.ctx.translate(shakeX, shakeY);
        }
        
        // Draw background
        this.drawBackground();
        
        // Draw blocks
        this.drawBlocks();
        
        // Draw current block
        if (this.currentBlock) {
            this.drawBlock(this.currentBlock);
        }
        
        // Draw particles
        if (this.particlesEnabled) {
            this.particleSystem.render();
        }
        
        // Restore transform if screen shake was applied
        if (this.screenShake > 0) {
            this.ctx.restore();
        }
        
        // Draw UI
        this.drawUI();
        
        // Draw menus
        this.drawMenus();
    }
    
    /**
     * Draw animated background
     */
    drawBackground() {
        // Create gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(1, '#0a0a0a');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw animated grid
        this.ctx.strokeStyle = 'rgba(102, 126, 234, 0.1)';
        this.ctx.lineWidth = 1;
        
        const gridSize = 50;
        const offsetX = this.backgroundOffset % gridSize;
        const offsetY = (this.backgroundOffset * 0.5) % gridSize;
        
        for (let x = -gridSize + offsetX; x < this.canvas.width + gridSize; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        for (let y = -gridSize + offsetY; y < this.canvas.height + gridSize; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }
    
    /**
     * Draw all placed blocks
     */
    drawBlocks() {
        for (const block of this.blocks) {
            this.drawBlock(block);
        }
    }
    
    /**
     * Draw a single block with enhanced styling
     */
    drawBlock(block) {
        // Main block
        this.ctx.fillStyle = block.color;
        this.ctx.fillRect(block.x, block.y, block.width, block.height);
        
        // Highlight
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.fillRect(block.x, block.y, block.width, 4);
        
        // Shadow
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.fillRect(block.x, block.y + block.height - 4, block.width, 4);
        
        // Border
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(block.x, block.y, block.width, block.height);
        
        // Power-up indicator
        if (block.isPowerUp && block.powerUpType) {
            const powerUp = this.powerUpTypes[block.powerUpType];
            if (powerUp) {
                // Draw icon
                this.ctx.fillStyle = '#ffffff';
                this.ctx.font = 'bold 14px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(powerUp.icon, block.x + block.width / 2, block.y + block.height / 2);
                
                // Glow effect for power-up blocks
                this.ctx.shadowColor = powerUp.color;
                this.ctx.shadowBlur = 10;
                this.ctx.strokeStyle = powerUp.color;
                this.ctx.lineWidth = 3;
                this.ctx.strokeRect(block.x - 1, block.y - 1, block.width + 2, block.height + 2);
                this.ctx.shadowBlur = 0;
            }
        }
    }
    
    /**
     * Draw UI elements
     */
    drawUI() {
        if (!this.stateManager.isState('playing')) return;
        
        // Score
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Score: ${this.score}`, 20, 40);
        
        // Combo
        if (this.combo > 0) {
            this.ctx.fillStyle = '#ffd700';
            this.ctx.font = 'bold 20px Arial';
            this.ctx.fillText(`Combo x${this.combo}`, 20, 70);
        }
        
        // Level
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 18px Arial';
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`Level ${this.level}`, this.canvas.width - 20, 40);
        
        // Active power-up
        if (this.activePowerUp) {
            this.ctx.fillStyle = this.activePowerUp.color;
            this.ctx.font = 'bold 16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`${this.activePowerUp.icon} ${this.activePowerUp.name}`, this.canvas.width / 2, 40);
        }
        
        // Power-up inventory
        if (this.collectedPowerUps.length > 0) {
            this.ctx.fillStyle = '#888888';
            this.ctx.font = '14px Arial';
            this.ctx.textAlign = 'left';
            this.ctx.fillText('Power-ups:', 20, 100);
            
            this.collectedPowerUps.forEach((powerUp, index) => {
                const x = 20 + (index * 35);
                const y = 115;
                
                // Draw power-up icon
                this.ctx.fillStyle = powerUp.color;
                this.ctx.fillRect(x, y, 30, 20);
                
                this.ctx.fillStyle = '#ffffff';
                this.ctx.font = '12px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(powerUp.icon, x + 15, y + 10);
                
                // Draw number key hint
                this.ctx.fillStyle = '#666666';
                this.ctx.font = '10px Arial';
                this.ctx.fillText((index + 1).toString(), x + 15, y - 5);
            });
            
            this.ctx.fillStyle = '#888888';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'left';
            this.ctx.fillText('Press P or 1-7 to use', 20, 145);
        }
        
        // High score indicator
        if (this.isNewHighScore) {
            this.ctx.fillStyle = '#00ff00';
            this.ctx.font = 'bold 16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('NEW HIGH SCORE!', this.canvas.width / 2, 80);
        }
        
        // Instructions
        this.ctx.fillStyle = '#888888';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('SPACE: Drop | P: Power-up | 1-7: Select | ESC: Pause', this.canvas.width / 2, this.canvas.height - 20);
    }
    
    /**
     * Draw menus based on current state
     */
    drawMenus() {
        switch (this.stateManager.getCurrentState()) {
            case 'menu':
                this.drawMenu();
                break;
            case 'paused':
                this.drawPauseMenu();
                break;
            case 'game_over':
                this.drawGameOverMenu();
                break;
            case 'settings':
                this.drawSettingsMenu();
                break;
        }
    }
    
    /**
     * Draw main menu
     */
    drawMenu() {
        // Semi-transparent overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Title
        this.ctx.fillStyle = '#667eea';
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('STACKS', this.canvas.width / 2, 120);
        
        // Subtitle
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '18px Arial';
        this.ctx.fillText('Enhanced Edition V2', this.canvas.width / 2, 150);
        
        // Power-up info
        this.ctx.fillStyle = '#888888';
        this.ctx.font = '14px Arial';
        this.ctx.fillText('Stack power-up blocks to collect abilities!', this.canvas.width / 2, 180);
        
        // Play button
        this.drawButton(
            this.canvas.width / 2 - 100, 220, 200, 60,
            'PLAY', '#ff6b6b', '#ffffff'
        );
        
        // Settings button
        this.drawButton(
            this.canvas.width / 2 - 100, 300, 200, 50,
            'SETTINGS', '#667eea', '#ffffff'
        );
        
        // High scores button
        this.drawButton(
            this.canvas.width / 2 - 100, 370, 200, 50,
            'HIGH SCORES', '#ffd700', '#000000'
        );
        
        // Instructions
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Press SPACE or Click to play', this.canvas.width / 2, this.canvas.height - 60);
        this.ctx.fillText('Collect power-ups and build combos!', this.canvas.width / 2, this.canvas.height - 40);
        this.ctx.fillText('P to use power-ups • 1-7 to select specific ones', this.canvas.width / 2, this.canvas.height - 20);
    }
    
    /**
     * Draw pause menu
     */
    drawPauseMenu() {
        this.drawMenuOverlay('PAUSED', [
            { text: 'Resume', action: 'resume' },
            { text: 'Restart', action: 'restart' },
            { text: 'Main Menu', action: 'menu' }
        ]);
    }
    
    /**
     * Draw game over menu
     */
    drawGameOverMenu() {
        const stateData = this.stateManager.getCurrentStateData();
        
        this.drawMenuOverlay('GAME OVER', [
            { text: 'Play Again', action: 'restart' },
            { text: 'Main Menu', action: 'menu' }
        ]);
        
        // Show score
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`Final Score: ${stateData.finalScore}`, this.canvas.width / 2, 350);
        
        if (stateData.isNewRecord) {
            this.ctx.fillStyle = '#00ff00';
            this.ctx.fillText('NEW HIGH SCORE!', this.canvas.width / 2, 380);
        }
    }
    
    /**
     * Draw settings menu
     */
    drawSettingsMenu() {
        this.drawMenuOverlay('SETTINGS', [
            { text: `Theme: ${this.currentTheme.toUpperCase()}`, action: 'toggleTheme' },
            { text: 'Particles: ON', action: 'toggleParticles' },
            { text: 'Back', action: 'menu' }
        ]);
    }
    
    /**
     * Draw menu overlay
     */
    drawMenuOverlay(title, options) {
        // Semi-transparent overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Title
        this.ctx.fillStyle = '#667eea';
        this.ctx.font = 'bold 36px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(title, this.canvas.width / 2, 150);
        
        // Options
        options.forEach((option, index) => {
            const y = 250 + index * 60;
            this.drawButton(
                this.canvas.width / 2 - 100, y, 200, 50,
                option.text, '#667eea', '#ffffff'
            );
        });
    }
    
    /**
     * Draw a button
     */
    drawButton(x, y, width, height, text, bgColor, textColor) {
        // Button background
        this.ctx.fillStyle = bgColor;
        this.ctx.fillRect(x, y, width, height);
        
        // Button border
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, width, height);
        
        // Button text
        this.ctx.fillStyle = textColor;
        this.ctx.font = 'bold 18px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(text, x + width / 2, y + height / 2);
    }
    
    /**
     * Main game loop
     */
    gameLoop(currentTime = 0) {
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        // Update
        this.update(deltaTime);
        
        // Render
        this.render();
        
        // Continue loop
        requestAnimationFrame((time) => this.gameLoop(time));
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new StacksGameEnhancedV2();
});
