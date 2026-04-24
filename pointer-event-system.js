/**
 * STACKS - Clean Pointer Event System
 * Replaces all input and button event systems with reliable pointer events
 */

class PointerEventSystem {
    constructor() {
        console.log('👆 Initializing clean pointer event system...');
        this.buttonActions = new Map();
        this.initialized = false;
        this.setupPointerSystem();
    }
    
    setupPointerSystem() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            this.initialize();
        }
    }
    
    initialize() {
        if (this.initialized) return;
        
        console.log('👆 Setting up pointer event system...');
        
        // Define all button actions
        this.defineButtonActions();
        
        // Fix canvas and overlay blocking issues
        this.fixInputBlocking();
        
        // Setup pointer events for all buttons
        this.setupButtonPointerEvents();
        
        // Setup continuous monitoring
        this.setupMonitoring();
        
        this.initialized = true;
        console.log('✅ Pointer event system initialized');
    }
    
    defineButtonActions() {
        // Define all button actions in a clean map
        this.buttonActions.set('playBtn', () => this.startGame());
        this.buttonActions.set('restartBtn', () => this.restartGame());
        this.buttonActions.set('mainMenuBtn', () => this.goToMainMenu());
        this.buttonActions.set('homeButton', () => this.goToMainMenu());
        this.buttonActions.set('settingsBtn', () => this.openSettings());
        this.buttonActions.set('shopBtn', () => this.openShop());
        this.buttonActions.set('pauseBtn', () => this.togglePause());
        this.buttonActions.set('dropButton', () => this.dropBlock());
        this.buttonActions.set('powerUpButton', () => this.usePowerUp());
        this.buttonActions.set('backFromShop', () => this.closeShop());
        this.buttonActions.set('backFromSettings', () => this.closeSettings());
        this.buttonActions.set('backFromSkins', () => this.closeSkins());
        
        // Class-based actions for dynamic buttons
        this.buttonActions.set('btn-primary', (button) => this.handlePrimaryButton(button));
        this.buttonActions.set('btn-secondary', (button) => this.handleSecondaryButton(button));
        this.buttonActions.set('nav-button', (button) => this.handleNavButton(button));
    }
    
    fixInputBlocking() {
        console.log('🔧 Fixing input blocking issues...');
        
        // Fix canvas blocking
        const canvas = document.getElementById('gameCanvas');
        if (canvas) {
            canvas.style.pointerEvents = 'none';
            canvas.style.touchAction = 'none';
            console.log('✅ Canvas pointer events disabled');
        }
        
        // Fix any overlays that might block input
        const overlays = document.querySelectorAll('[style*="position: fixed"], [style*="position: absolute"]');
        overlays.forEach(overlay => {
            // Don't disable pointer events for actual UI elements
            if (!overlay.classList.contains('screen') && 
                !overlay.classList.contains('modal') && 
                overlay.id !== 'shopModal') {
                overlay.style.pointerEvents = 'none';
            }
        });
        
        // Ensure body allows pointer events
        document.body.style.pointerEvents = 'auto';
        
        console.log('✅ Input blocking issues fixed');
    }
    
    setupButtonPointerEvents() {
        console.log('👆 Setting up pointer events for buttons...');
        
        // Get all buttons
        const buttons = document.querySelectorAll('button');
        console.log(`Found ${buttons.length} buttons to setup`);
        
        buttons.forEach(button => {
            this.setupButtonPointerEvents(button);
        });
        
        // Also setup for elements that should be clickable
        const clickableElements = document.querySelectorAll('.powerup-slot, .shop-item, .cosmetic-item');
        clickableElements.forEach(element => {
            this.setupElementPointerEvents(element);
        });
        
        console.log('✅ Button pointer events setup complete');
    }
    
    setupButtonPointerEvents(button) {
        const buttonId = button.id || button.className || 'unknown';
        
        // Remove all existing event listeners by cloning
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        button = newButton;
        
        // Ensure button is clickable
        this.ensureButtonClickable(button);
        
        // Add pointer events
        button.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.handlePointerEvent(e, button);
        }, { passive: false });
        
        // Add click as fallback
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.handlePointerEvent(e, button);
        });
        
        // Add touch as fallback
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.handlePointerEvent(e, button);
        }, { passive: false });
        
        console.log(`👆 Pointer events setup for: ${buttonId}`);
    }
    
    setupElementPointerEvents(element) {
        // Remove existing listeners
        const newElement = element.cloneNode(true);
        element.parentNode.replaceChild(newElement, element);
        element = newElement;
        
        // Ensure clickable
        element.style.pointerEvents = 'auto';
        element.style.cursor = 'pointer';
        element.style.userSelect = 'none';
        element.style.webkitUserSelect = 'none';
        
        // Add pointer events
        element.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.handleElementPointerEvent(e, element);
        }, { passive: false });
    }
    
    ensureButtonClickable(button) {
        button.style.pointerEvents = 'auto';
        button.style.cursor = 'pointer';
        button.style.userSelect = 'none';
        button.style.webkitUserSelect = 'none';
        button.style.touchAction = 'manipulation';
        button.style.position = button.style.position || 'relative';
        button.style.zIndex = button.style.zIndex || '9999';
    }
    
    handlePointerEvent(e, button) {
        const buttonId = button.id;
        const buttonClasses = Array.from(button.classList);
        
        console.log(`👆 Pointer event on: ${buttonId || buttonClasses.join(', ')}`);
        
        // Try ID-based action first
        if (buttonId && this.buttonActions.has(buttonId)) {
            const action = this.buttonActions.get(buttonId);
            action();
            return;
        }
        
        // Try class-based actions
        for (const className of buttonClasses) {
            if (this.buttonActions.has(className)) {
                const action = this.buttonActions.get(className);
                action(button);
                return;
            }
        }
        
        // Try text-based action
        const text = button.textContent.toLowerCase();
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
        } else if (text.includes('back')) {
            this.goBack();
        } else {
            console.log(`⚠️ No action found for button: ${buttonId || text}`);
        }
    }
    
    handleElementPointerEvent(e, element) {
        const elementClass = element.className;
        console.log(`👆 Pointer event on element: ${elementClass}`);
        
        if (elementClass.includes('powerup-slot')) {
            this.handlePowerUpSlot(element);
        } else if (elementClass.includes('shop-item')) {
            this.handleShopItem(element);
        } else if (elementClass.includes('cosmetic-item')) {
            this.handleCosmeticItem(element);
        }
    }
    
    handlePowerUpSlot(slot) {
        const index = Array.from(slot.parentNode.children).indexOf(slot);
        console.log(`⚡ Power-up slot ${index} clicked`);
        
        if (window.game && window.game.activatePowerUpByIndex) {
            window.game.activatePowerUpByIndex(index);
        }
    }
    
    handleShopItem(item) {
        console.log('🛍️ Shop item clicked');
        // Shop item handling would go here
    }
    
    handleCosmeticItem(item) {
        console.log('🎨 Cosmetic item clicked');
        // Cosmetic item handling would go here
    }
    
    handlePrimaryButton(button) {
        const text = button.textContent.toLowerCase();
        if (text.includes('play')) {
            this.startGame();
        } else if (text.includes('restart')) {
            this.restartGame();
        }
    }
    
    handleSecondaryButton(button) {
        const text = button.textContent.toLowerCase();
        if (text.includes('menu') || text.includes('home')) {
            this.goToMainMenu();
        } else if (text.includes('shop')) {
            this.openShop();
        } else if (text.includes('settings')) {
            this.openSettings();
        }
    }
    
    handleNavButton(button) {
        const text = button.textContent.toLowerCase();
        if (text.includes('home')) {
            this.goToMainMenu();
        } else if (text.includes('restart')) {
            this.restartGame();
        }
    }
    
    // Button actions
    startGame() {
        console.log('🎮 Starting game...');
        
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
        
        if (window.game) {
            // Full reset
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
        // Settings implementation would go here
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
        // Settings close implementation would go here
    }
    
    closeSkins() {
        console.log('❌ Closing skins...');
        // Skins close implementation would go here
    }
    
    goBack() {
        console.log('⬅️ Going back...');
        // Generic back action
        this.goToMainMenu();
    }
    
    setupMonitoring() {
        console.log('👁️ Setting up pointer event monitoring...');
        
        // Monitor for dynamically created buttons
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        // Check if it's a button
                        if (node.tagName === 'BUTTON') {
                            this.setupButtonPointerEvents(node);
                        }
                        
                        // Check for buttons inside the added node
                        const buttons = node.querySelectorAll('button');
                        buttons.forEach(button => {
                            this.setupButtonPointerEvents(button);
                        });
                        
                        // Check for clickable elements
                        const clickableElements = node.querySelectorAll('.powerup-slot, .shop-item, .cosmetic-item');
                        clickableElements.forEach(element => {
                            this.setupElementPointerEvents(element);
                        });
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('✅ Pointer event monitoring started');
    }
    
    // Public method to manually setup a button
    setupButton(buttonElement) {
        if (buttonElement.tagName === 'BUTTON') {
            this.setupButtonPointerEvents(buttonElement);
        } else {
            this.setupElementPointerEvents(buttonElement);
        }
    }
    
    // Public method to add a custom button action
    addButtonAction(identifier, action) {
        this.buttonActions.set(identifier, action);
    }
    
    // Public method to remove a button action
    removeButtonAction(identifier) {
        this.buttonActions.delete(identifier);
    }
}

// Initialize the pointer event system immediately
document.addEventListener('DOMContentLoaded', () => {
    console.log('👆 DOM ready, initializing pointer event system...');
    window.pointerEventSystem = new PointerEventSystem();
});

// Also initialize immediately if DOM is already loaded
if (document.readyState !== 'loading') {
    console.log('👆 DOM already loaded, initializing pointer event system...');
    window.pointerEventSystem = new PointerEventSystem();
}
