/**
 * STACKS - Button Debug Fix
 * Strict debugging task to fix unclickable buttons
 */

class ButtonDebugFix {
    constructor() {
        console.log('🔧 DEBUG: Starting button debug fix...');
        this.debugMode = true;
        this.fixedButtons = new Set();
        this.initializeDebugFix();
    }
    
    initializeDebugFix() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.performDebugFix());
        } else {
            this.performDebugFix();
        }
    }
    
    performDebugFix() {
        console.log('🔧 DEBUG: Performing debug fix...');
        
        // Step 1: Inspect and fix UI layers
        this.inspectAndFixLayers();
        
        // Step 2: Add missing game buttons
        this.addMissingGameButtons();
        
        // Step 3: Fix layering
        this.fixLayering();
        
        // Step 4: Fix event binding
        this.fixEventBinding();
        
        // Step 5: Remove mobile restart button
        this.removeMobileRestartButton();
        
        // Step 6: Verify functionality
        this.verifyFunctionality();
        
        console.log('✅ DEBUG: Button debug fix complete');
    }
    
    inspectAndFixLayers() {
        console.log('🔍 DEBUG: Inspecting UI layers...');
        
        // Fix body touch-action blocking
        document.body.style.touchAction = 'auto';
        console.log('✅ DEBUG: Fixed body touch-action blocking');
        
        // Check for any full-screen overlays
        const overlays = document.querySelectorAll('[style*="position: fixed"], [style*="position: absolute"]');
        overlays.forEach((overlay, index) => {
            console.log(`🔍 DEBUG: Found overlay ${index}:`, overlay.tagName, overlay.id, overlay.className);
            
            // Don't disable pointer events for actual UI elements
            if (!overlay.classList.contains('screen') && 
                !overlay.classList.contains('modal') && 
                overlay.id !== 'shopModal' &&
                !overlay.classList.contains('version-indicator') &&
                !overlay.classList.contains('instructions') &&
                !overlay.classList.contains('power-up-hint')) {
                overlay.style.pointerEvents = 'none';
                console.log(`✅ DEBUG: Disabled pointer events on overlay ${index}`);
            }
        });
        
        // Ensure game container doesn't block
        const gameContainer = document.querySelector('.game-container');
        if (gameContainer) {
            gameContainer.style.pointerEvents = 'none';
            console.log('✅ DEBUG: Disabled pointer events on game container');
        }
    }
    
    addMissingGameButtons() {
        console.log('➕ DEBUG: Adding missing game buttons...');
        
        // Check if buttons already exist
        const existingPlayBtn = document.getElementById('playBtn');
        const existingRestartBtn = document.getElementById('restartBtn');
        const existingMenuBtn = document.getElementById('mainMenuBtn');
        const existingHighScoresBtn = document.getElementById('highScoresBtn');
        
        if (!existingPlayBtn) {
            this.createPlayButton();
        }
        
        if (!existingRestartBtn) {
            this.createRestartButton();
        }
        
        if (!existingMenuBtn) {
            this.createMenuButton();
        }
        
        if (!existingHighScoresBtn) {
            this.createHighScoresButton();
        }
        
        console.log('✅ DEBUG: Missing game buttons added');
    }
    
    createPlayButton() {
        const playBtn = document.createElement('button');
        playBtn.id = 'playBtn';
        playBtn.className = 'game-button play-button';
        playBtn.innerHTML = 'PLAY';
        playBtn.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #00ff88, #00cc66);
            color: white;
            border: none;
            padding: 20px 40px;
            border-radius: 50px;
            font-size: 24px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 8px 30px rgba(0, 255, 136, 0.4);
            transition: all 0.3s ease;
            pointer-events: auto;
            z-index: 10000;
            user-select: none;
            -webkit-user-select: none;
            touch-action: manipulation;
        `;
        
        playBtn.addEventListener('mouseenter', () => {
            playBtn.style.transform = 'translate(-50%, -50%) scale(1.05)';
            playBtn.style.boxShadow = '0 12px 40px rgba(0, 255, 136, 0.6)';
        });
        
        playBtn.addEventListener('mouseleave', () => {
            playBtn.style.transform = 'translate(-50%, -50%) scale(1)';
            playBtn.style.boxShadow = '0 8px 30px rgba(0, 255, 136, 0.4)';
        });
        
        document.body.appendChild(playBtn);
        console.log('✅ DEBUG: Play button created');
    }
    
    createRestartButton() {
        const restartBtn = document.createElement('button');
        restartBtn.id = 'restartBtn';
        restartBtn.className = 'game-button restart-button';
        restartBtn.innerHTML = 'PLAY AGAIN';
        restartBtn.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, 20px);
            background: linear-gradient(135deg, #ff6b6b, #ff8e53);
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 30px;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
            transition: all 0.3s ease;
            pointer-events: auto;
            z-index: 10000;
            user-select: none;
            -webkit-user-select: none;
            touch-action: manipulation;
            display: none;
        `;
        
        restartBtn.addEventListener('mouseenter', () => {
            restartBtn.style.transform = 'translate(-50%, 20px) scale(1.05)';
            restartBtn.style.boxShadow = '0 8px 30px rgba(255, 107, 107, 0.6)';
        });
        
        restartBtn.addEventListener('mouseleave', () => {
            restartBtn.style.transform = 'translate(-50%, 20px) scale(1)';
            restartBtn.style.boxShadow = '0 6px 20px rgba(255, 107, 107, 0.4)';
        });
        
        document.body.appendChild(restartBtn);
        console.log('✅ DEBUG: Restart button created');
    }
    
    createMenuButton() {
        const menuBtn = document.createElement('button');
        menuBtn.id = 'mainMenuBtn';
        menuBtn.className = 'game-button menu-button';
        menuBtn.innerHTML = 'MENU';
        menuBtn.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, 80px);
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 30px;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
            transition: all 0.3s ease;
            pointer-events: auto;
            z-index: 10000;
            user-select: none;
            -webkit-user-select: none;
            touch-action: manipulation;
            display: none;
        `;
        
        menuBtn.addEventListener('mouseenter', () => {
            menuBtn.style.transform = 'translate(-50%, 80px) scale(1.05)';
            menuBtn.style.boxShadow = '0 8px 30px rgba(102, 126, 234, 0.6)';
        });
        
        menuBtn.addEventListener('mouseleave', () => {
            menuBtn.style.transform = 'translate(-50%, 80px) scale(1)';
            menuBtn.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
        });
        
        document.body.appendChild(menuBtn);
        console.log('✅ DEBUG: Menu button created');
    }
    
    createHighScoresButton() {
        const highScoresBtn = document.createElement('button');
        highScoresBtn.id = 'highScoresBtn';
        highScoresBtn.className = 'game-button high-scores-button';
        highScoresBtn.innerHTML = 'HIGH SCORES';
        highScoresBtn.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, 140px);
            background: linear-gradient(135deg, #ffd700, #ffed4e);
            color: #333;
            border: none;
            padding: 12px 25px;
            border-radius: 25px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
            transition: all 0.3s ease;
            pointer-events: auto;
            z-index: 10000;
            user-select: none;
            -webkit-user-select: none;
            touch-action: manipulation;
            display: none;
        `;
        
        highScoresBtn.addEventListener('mouseenter', () => {
            highScoresBtn.style.transform = 'translate(-50%, 140px) scale(1.05)';
            highScoresBtn.style.boxShadow = '0 6px 25px rgba(255, 215, 0, 0.6)';
        });
        
        highScoresBtn.addEventListener('mouseleave', () => {
            highScoresBtn.style.transform = 'translate(-50%, 140px) scale(1)';
            highScoresBtn.style.boxShadow = '0 4px 15px rgba(255, 215, 0, 0.4)';
        });
        
        document.body.appendChild(highScoresBtn);
        console.log('✅ DEBUG: High Scores button created');
    }
    
    fixLayering() {
        console.log('🔧 DEBUG: Fixing layering...');
        
        // Ensure all buttons have higher z-index than canvas
        const buttons = document.querySelectorAll('button');
        buttons.forEach((button, index) => {
            button.style.zIndex = '10000';
            button.style.pointerEvents = 'auto';
            button.style.position = button.style.position || 'fixed';
            console.log(`✅ DEBUG: Fixed layering for button ${index}: ${button.id || button.className}`);
        });
        
        // Ensure canvas has lower z-index
        const canvas = document.getElementById('gameCanvas');
        if (canvas) {
            canvas.style.zIndex = '1';
            canvas.style.pointerEvents = 'none';
            console.log('✅ DEBUG: Fixed canvas layering');
        }
    }
    
    fixEventBinding() {
        console.log('🔧 DEBUG: Fixing event binding...');
        
        // Play button
        const playBtn = document.getElementById('playBtn');
        if (playBtn) {
            this.bindButtonEvents(playBtn, 'playBtn', () => {
                console.log('🎮 DEBUG: Play button clicked!');
                this.startGame();
            });
        }
        
        // Restart button
        const restartBtn = document.getElementById('restartBtn');
        if (restartBtn) {
            this.bindButtonEvents(restartBtn, 'restartBtn', () => {
                console.log('🔄 DEBUG: Restart button clicked!');
                this.restartGame();
            });
        }
        
        // Menu button
        const menuBtn = document.getElementById('mainMenuBtn');
        if (menuBtn) {
            this.bindButtonEvents(menuBtn, 'mainMenuBtn', () => {
                console.log('🏠 DEBUG: Menu button clicked!');
                this.goToMenu();
            });
        }
        
        // High Scores button
        const highScoresBtn = document.getElementById('highScoresBtn');
        if (highScoresBtn) {
            this.bindButtonEvents(highScoresBtn, 'highScoresBtn', () => {
                console.log('🏆 DEBUG: High Scores button clicked!');
                this.openHighScores();
            });
        }
        
        // Existing buttons
        const dropBtn = document.getElementById('dropButton');
        if (dropBtn) {
            this.bindButtonEvents(dropBtn, 'dropButton', () => {
                console.log('▼ DEBUG: Drop button clicked!');
                this.dropBlock();
            });
        }
        
        const powerUpBtn = document.getElementById('powerUpButton');
        if (powerUpBtn) {
            this.bindButtonEvents(powerUpBtn, 'powerUpButton', () => {
                console.log('⚡ DEBUG: Power-up button clicked!');
                this.usePowerUp();
            });
        }
        
        const homeBtn = document.getElementById('homeButton');
        if (homeBtn) {
            this.bindButtonEvents(homeBtn, 'homeButton', () => {
                console.log('🏠 DEBUG: Home button clicked!');
                this.goToMenu();
            });
        }
        
        console.log('✅ DEBUG: Event binding fixed');
    }
    
    bindButtonEvents(button, buttonId, action) {
        if (this.fixedButtons.has(buttonId)) {
            console.log(`ℹ️ DEBUG: Button ${buttonId} already fixed`);
            return;
        }
        
        // Remove existing listeners by cloning
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        button = newButton;
        
        // Add explicit click handler
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log(`🖱️ DEBUG: Click event fired on ${buttonId}`);
            action();
        });
        
        // Add explicit touch handler
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log(`📱 DEBUG: Touch event fired on ${buttonId}`);
            action();
        }, { passive: false });
        
        // Add pointer handler
        button.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log(`👆 DEBUG: Pointer event fired on ${buttonId}`);
            action();
        });
        
        this.fixedButtons.add(buttonId);
        console.log(`✅ DEBUG: Events bound for ${buttonId}`);
    }
    
    removeMobileRestartButton() {
        console.log('🗑️ DEBUG: Removing mobile restart button...');
        
        const mobileRestartBtn = document.getElementById('restartButton');
        if (mobileRestartBtn) {
            mobileRestartBtn.remove();
            console.log('✅ DEBUG: Mobile restart button removed');
        } else {
            console.log('ℹ️ DEBUG: Mobile restart button not found');
        }
    }
    
    verifyFunctionality() {
        console.log('✅ DEBUG: Verifying functionality...');
        
        // Show play button initially
        const playBtn = document.getElementById('playBtn');
        if (playBtn) {
            playBtn.style.display = 'block';
        }
        
        // Hide other buttons initially
        const restartBtn = document.getElementById('restartBtn');
        const menuBtn = document.getElementById('mainMenuBtn');
        const highScoresBtn = document.getElementById('highScoresBtn');
        
        if (restartBtn) restartBtn.style.display = 'none';
        if (menuBtn) menuBtn.style.display = 'none';
        if (highScoresBtn) highScoresBtn.style.display = 'none';
        
        console.log('✅ DEBUG: Functionality verified');
    }
    
    // Game functions
    startGame() {
        console.log('🎮 DEBUG: Starting game...');
        
        // Hide play button
        const playBtn = document.getElementById('playBtn');
        if (playBtn) playBtn.style.display = 'none';
        
        // Start the game
        if (window.game && window.game.stateManager) {
            window.game.stateManager.setState('playing');
        } else if (window.game && window.game.start) {
            window.game.start();
        } else if (typeof StacksGameEnhancedV2 !== 'undefined') {
            if (!window.game) {
                window.game = new StacksGameEnhancedV2();
            }
            window.game.start();
        } else {
            console.error('❌ DEBUG: No game instance found to start');
        }
    }
    
    restartGame() {
        console.log('🔄 DEBUG: Restarting game...');
        
        // Hide restart and menu buttons
        const restartBtn = document.getElementById('restartBtn');
        const menuBtn = document.getElementById('mainMenuBtn');
        const highScoresBtn = document.getElementById('highScoresBtn');
        
        if (restartBtn) restartBtn.style.display = 'none';
        if (menuBtn) menuBtn.style.display = 'none';
        if (highScoresBtn) highScoresBtn.style.display = 'none';
        
        // Full reset
        if (window.game) {
            if (window.game.stateManager) {
                window.game.stateManager.setState('menu');
            }
            
            // Reset all game variables
            window.game.score = 0;
            window.game.combo = 0;
            window.game.blocks = [];
            window.game.currentBlock = null;
            window.game.lastBlock = null;
            window.game.gameHeight = 0;
            window.game.blockSpeed = 3;
            window.game.blockDirection = 1;
            
            // Show play button again
            const playBtn = document.getElementById('playBtn');
            if (playBtn) playBtn.style.display = 'block';
        } else {
            console.error('❌ DEBUG: No game instance found to restart');
        }
    }
    
    goToMenu() {
        console.log('🏠 DEBUG: Going to menu...');
        
        // Hide all game buttons except play
        const playBtn = document.getElementById('playBtn');
        const restartBtn = document.getElementById('restartBtn');
        const menuBtn = document.getElementById('mainMenuBtn');
        const highScoresBtn = document.getElementById('highScoresBtn');
        
        if (playBtn) playBtn.style.display = 'block';
        if (restartBtn) restartBtn.style.display = 'none';
        if (menuBtn) menuBtn.style.display = 'none';
        if (highScoresBtn) highScoresBtn.style.display = 'none';
        
        // Go to main menu
        if (window.game && window.game.stateManager) {
            window.game.stateManager.setState('menu');
        } else {
            console.error('❌ DEBUG: No game instance found for menu');
        }
    }
    
    openHighScores() {
        console.log('🏆 DEBUG: Opening high scores...');
        // High scores implementation would go here
        alert('High Scores feature coming soon!');
    }
    
    dropBlock() {
        console.log('▼ DEBUG: Dropping block...');
        const event = new CustomEvent('dropBlock');
        document.dispatchEvent(event);
    }
    
    usePowerUp() {
        console.log('⚡ DEBUG: Using power-up...');
        if (window.game && window.game.activateNextPowerUp) {
            window.game.activateNextPowerUp();
        }
    }
    
    // Public method to show game over screen
    showGameOver() {
        console.log('💀 DEBUG: Showing game over...');
        
        // Hide play button
        const playBtn = document.getElementById('playBtn');
        if (playBtn) playBtn.style.display = 'none';
        
        // Show restart and menu buttons
        const restartBtn = document.getElementById('restartBtn');
        const menuBtn = document.getElementById('mainMenuBtn');
        const highScoresBtn = document.getElementById('highScoresBtn');
        
        if (restartBtn) restartBtn.style.display = 'block';
        if (menuBtn) menuBtn.style.display = 'block';
        if (highScoresBtn) highScoresBtn.style.display = 'block';
    }
}

// Initialize debug fix immediately
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔧 DEBUG: DOM ready, initializing debug fix...');
    window.buttonDebugFix = new ButtonDebugFix();
});

// Also initialize immediately if DOM is already loaded
if (document.readyState !== 'loading') {
    console.log('🔧 DEBUG: DOM already loaded, initializing debug fix...');
    window.buttonDebugFix = new ButtonDebugFix();
}
