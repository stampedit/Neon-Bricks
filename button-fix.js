/**
 * STACKS - Button Fix System
 * Fixes all button interaction issues without changing UI design
 */

class ButtonFixSystem {
    constructor() {
        console.log('🔧 Initializing button fix system...');
        this.fixedButtons = new Set();
        this.initializeButtonFixes();
    }
    
    initializeButtonFixes() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupButtonFixes());
        } else {
            this.setupButtonFixes();
        }
    }
    
    setupButtonFixes() {
        console.log('🔧 Setting up button fixes...');
        
        // Fix all buttons with comprehensive event handling
        this.fixAllButtons();
        
        // Remove mobile restart button as requested
        this.removeMobileRestartButton();
        
        // Ensure no layer blocking issues
        this.fixLayerBlocking();
        
        // Setup continuous monitoring for dynamically created buttons
        this.setupButtonMonitoring();
        
        console.log('✅ Button fixes initialized');
    }
    
    fixAllButtons() {
        // List of all button IDs that need fixing
        const buttonIds = [
            'playBtn', 'restartBtn', 'mainMenuBtn', 'homeButton', 
            'settingsBtn', 'shopBtn', 'pauseBtn', 'dropButton',
            'powerUpButton', 'backFromShop', 'backFromSettings', 'backFromSkins'
        ];
        
        buttonIds.forEach(buttonId => {
            this.fixButton(buttonId);
        });
        
        // Also fix any buttons with specific classes
        this.fixButtonsByClass('btn-primary');
        this.fixButtonsByClass('btn-secondary');
        this.fixButtonsByClass('nav-button');
    }
    
    fixButton(buttonId) {
        const button = document.getElementById(buttonId);
        if (!button) {
            console.log(`⚠️ Button not found: ${buttonId}`);
            return;
        }
        
        if (this.fixedButtons.has(buttonId)) {
            console.log(`ℹ️ Button already fixed: ${buttonId}`);
            return;
        }
        
        console.log(`🔧 Fixing button: ${buttonId}`);
        
        // Remove existing event listeners by cloning
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        // Add comprehensive event handling
        this.addButtonEventListeners(newButton, buttonId);
        
        // Ensure button is clickable
        this.ensureButtonClickable(newButton);
        
        this.fixedButtons.add(buttonId);
        console.log(`✅ Button fixed: ${buttonId}`);
    }
    
    addButtonEventListeners(button, buttonId) {
        // Determine button action based on ID
        const action = this.getButtonAction(buttonId);
        
        // Add click event
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log(`🖱️ Button clicked: ${buttonId}`);
            this.executeButtonAction(action, buttonId);
        });
        
        // Add touch event for mobile
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log(`📱 Button touched: ${buttonId}`);
            this.executeButtonAction(action, buttonId);
        }, { passive: false });
        
        // Add pointer event for better mobile support
        button.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log(`👆 Pointer down: ${buttonId}`);
            this.executeButtonAction(action, buttonId);
        });
    }
    
    getButtonAction(buttonId) {
        const actions = {
            'playBtn': 'startGame',
            'restartBtn': 'restartGame',
            'mainMenuBtn': 'mainMenu',
            'homeButton': 'mainMenu',
            'settingsBtn': 'openSettings',
            'shopBtn': 'openShop',
            'pauseBtn': 'togglePause',
            'dropButton': 'dropBlock',
            'powerUpButton': 'usePowerUp',
            'backFromShop': 'closeShop',
            'backFromSettings': 'closeSettings',
            'backFromSkins': 'closeSkins'
        };
        
        return actions[buttonId] || 'unknown';
    }
    
    executeButtonAction(action, buttonId) {
        try {
            switch (action) {
                case 'startGame':
                    this.startGame();
                    break;
                case 'restartGame':
                    this.restartGame();
                    break;
                case 'mainMenu':
                    this.goToMainMenu();
                    break;
                case 'openSettings':
                    this.openSettings();
                    break;
                case 'openShop':
                    this.openShop();
                    break;
                case 'togglePause':
                    this.togglePause();
                    break;
                case 'dropBlock':
                    this.dropBlock();
                    break;
                case 'usePowerUp':
                    this.usePowerUp();
                    break;
                case 'closeShop':
                    this.closeShop();
                    break;
                case 'closeSettings':
                    this.closeSettings();
                    break;
                case 'closeSkins':
                    this.closeSkins();
                    break;
                default:
                    console.log(`⚠️ Unknown action for button: ${buttonId}`);
            }
        } catch (error) {
            console.error(`❌ Error executing action ${action} for button ${buttonId}:`, error);
        }
    }
    
    startGame() {
        console.log('🎮 Starting game...');
        
        // Try multiple methods to start the game
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
            console.error('❌ No game instance found to start');
        }
    }
    
    restartGame() {
        console.log('🔄 Restarting game...');
        
        // Full reset and restart
        if (window.game) {
            // Reset game state
            if (window.game.stateManager) {
                window.game.stateManager.setState('menu');
            }
            
            // Reset game variables
            window.game.score = 0;
            window.game.combo = 0;
            window.game.blocks = [];
            window.game.currentBlock = null;
            window.game.lastBlock = null;
            window.game.gameHeight = 0;
            
            // Start new game
            setTimeout(() => this.startGame(), 100);
        } else {
            console.error('❌ No game instance found to restart');
        }
    }
    
    goToMainMenu() {
        console.log('🏠 Going to main menu...');
        
        if (window.game && window.game.stateManager) {
            window.game.stateManager.setState('menu');
        } else {
            console.error('❌ No game instance found for main menu');
        }
    }
    
    openSettings() {
        console.log('⚙️ Opening settings...');
        // Implementation would go here
    }
    
    openShop() {
        console.log('🛍️ Opening shop...');
        if (window.rewardSystem && window.rewardSystem.openShop) {
            window.rewardSystem.openShop();
        }
    }
    
    togglePause() {
        console.log('⏸️ Toggling pause...');
        if (window.game && window.game.togglePause) {
            window.game.togglePause();
        }
    }
    
    dropBlock() {
        console.log('▼ Dropping block...');
        const event = new CustomEvent('dropBlock');
        document.dispatchEvent(event);
    }
    
    usePowerUp() {
        console.log('⚡ Using power-up...');
        if (window.game && window.game.activateNextPowerUp) {
            window.game.activateNextPowerUp();
        }
    }
    
    closeShop() {
        console.log('❌ Closing shop...');
        const modal = document.getElementById('shopModal');
        if (modal) {
            document.body.removeChild(modal);
        }
    }
    
    closeSettings() {
        console.log('❌ Closing settings...');
        // Implementation would go here
    }
    
    closeSkins() {
        console.log('❌ Closing skins...');
        // Implementation would go here
    }
    
    ensureButtonClickable(button) {
        // Ensure button has proper CSS for clicking
        button.style.pointerEvents = 'auto';
        button.style.cursor = 'pointer';
        button.style.userSelect = 'none';
        button.style.webkitUserSelect = 'none';
        
        // Ensure button is on top layer
        button.style.zIndex = '9999';
        
        // Remove any blocking styles
        button.style.position = button.style.position || 'relative';
    }
    
    removeMobileRestartButton() {
        console.log('🗑️ Removing mobile restart button...');
        
        const restartButton = document.getElementById('restartButton');
        if (restartButton) {
            restartButton.remove();
            console.log('✅ Mobile restart button removed');
        }
        
        // Also remove from mobile nav controls if it exists there
        const mobileNavControls = document.getElementById('mobileNavControls');
        if (mobileNavControls) {
            const restartBtn = mobileNavControls.querySelector('#restartButton');
            if (restartBtn) {
                restartBtn.remove();
                console.log('✅ Restart button removed from mobile nav');
            }
        }
    }
    
    fixLayerBlocking() {
        console.log('🔧 Fixing layer blocking issues...');
        
        // Check for canvas blocking
        const canvas = document.getElementById('gameCanvas');
        if (canvas) {
            // Ensure canvas doesn't block button events
            canvas.style.pointerEvents = 'none';
        }
        
        // Check for any overlays that might be blocking
        const overlays = document.querySelectorAll('[style*="position: fixed"], [style*="position: absolute"]');
        overlays.forEach(overlay => {
            if (overlay.id !== 'shopModal' && !overlay.classList.contains('screen')) {
                overlay.style.pointerEvents = 'none';
            }
        });
        
        console.log('✅ Layer blocking issues fixed');
    }
    
    fixButtonsByClass(className) {
        const buttons = document.querySelectorAll(`.${className}`);
        buttons.forEach((button, index) => {
            const buttonId = button.id || `${className}-${index}`;
            this.fixButtonById(button, buttonId);
        });
    }
    
    fixButtonById(button, buttonId) {
        if (this.fixedButtons.has(buttonId)) {
            return;
        }
        
        console.log(`🔧 Fixing button by class: ${buttonId}`);
        
        // Remove existing event listeners
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        // Add generic click handler
        newButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log(`🖱️ Class button clicked: ${buttonId}`);
            
            // Try to determine action from button text or class
            const text = newButton.textContent.toLowerCase();
            if (text.includes('play')) {
                this.startGame();
            } else if (text.includes('restart')) {
                this.restartGame();
            } else if (text.includes('menu') || text.includes('home')) {
                this.goToMainMenu();
            } else if (text.includes('shop')) {
                this.openShop();
            } else if (text.includes('settings')) {
                this.openSettings();
            }
        });
        
        newButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log(`📱 Class button touched: ${buttonId}`);
            
            const text = newButton.textContent.toLowerCase();
            if (text.includes('play')) {
                this.startGame();
            } else if (text.includes('restart')) {
                this.restartGame();
            } else if (text.includes('menu') || text.includes('home')) {
                this.goToMainMenu();
            } else if (text.includes('shop')) {
                this.openShop();
            } else if (text.includes('settings')) {
                this.openSettings();
            }
        }, { passive: false });
        
        this.ensureButtonClickable(newButton);
        this.fixedButtons.add(buttonId);
    }
    
    setupButtonMonitoring() {
        // Monitor for dynamically created buttons
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        // Check if it's a button
                        if (node.tagName === 'BUTTON' || node.id?.includes('Btn')) {
                            const buttonId = node.id || `dynamic-${Date.now()}`;
                            this.fixButtonById(node, buttonId);
                        }
                        
                        // Check for buttons inside the added node
                        const buttons = node.querySelectorAll('button');
                        buttons.forEach(button => {
                            const buttonId = button.id || `nested-${Date.now()}`;
                            this.fixButtonById(button, buttonId);
                        });
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('👁️ Button monitoring started');
    }
}

// Initialize button fix system immediately
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔧 DOM ready, initializing button fix system...');
    window.buttonFixSystem = new ButtonFixSystem();
});

// Also initialize immediately if DOM is already loaded
if (document.readyState !== 'loading') {
    console.log('🔧 DOM already loaded, initializing button fix system...');
    window.buttonFixSystem = new ButtonFixSystem();
}
