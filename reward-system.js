/**
 * STACKS - Reward System Enhancement
 * Adds coin system, upgrades, shop, and loadout system without changing existing UI
 */

class RewardSystem {
    constructor(game) {
        this.game = game;
        
        // Coin system
        this.coins = parseInt(localStorage.getItem('stacksCoins') || '0');
        this.totalCoinsEarned = 0;
        
        // Upgrade system
        this.upgrades = this.loadUpgrades();
        
        // Shop system
        this.shopItems = this.initializeShopItems();
        
        // Loadout system
        this.loadout = this.loadLoadout();
        
        // Cosmetic system
        this.cosmetics = this.loadCosmetics();
        this.selectedCosmetics = this.loadSelectedCosmetics();
        
        // Special abilities
        this.clutchSaves = parseInt(localStorage.getItem('stacksClutchSaves') || '0');
        this.clutchSaveActive = false;
        
        // Initialize UI elements
        this.initializeCoinDisplay();
        this.initializeShopButton();
        this.initializeLoadoutUI();
        
        console.log('🪙 Reward system initialized');
    }
    
    // Coin System
    earnCoins(amount, reason = 'stack') {
        this.coins += amount;
        this.totalCoinsEarned += amount;
        localStorage.setItem('stacksCoins', this.coins.toString());
        this.updateCoinDisplay();
        
        // Show coin notification
        this.showCoinNotification(amount, reason);
        
        console.log(`🪙 Earned ${amount} coins (${reason})`);
    }
    
    spendCoins(amount) {
        if (this.coins >= amount) {
            this.coins -= amount;
            localStorage.setItem('stacksCoins', this.coins.toString());
            this.updateCoinDisplay();
            return true;
        }
        return false;
    }
    
    initializeCoinDisplay() {
        // Create coin display in top corner
        const coinDisplay = document.createElement('div');
        coinDisplay.id = 'coinDisplay';
        coinDisplay.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: linear-gradient(135deg, #ffd700, #ffed4e);
            color: #333;
            padding: 8px 15px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 14px;
            z-index: 1001;
            box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
            display: flex;
            align-items: center;
            gap: 5px;
        `;
        coinDisplay.innerHTML = `🪙 <span id="coinCount">${this.coins}</span>`;
        document.body.appendChild(coinDisplay);
        this.updateCoinDisplay();
    }
    
    updateCoinDisplay() {
        const coinCount = document.getElementById('coinCount');
        if (coinCount) {
            coinCount.textContent = this.coins;
        }
    }
    
    showCoinNotification(amount, reason) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 60px;
            right: 10px;
            background: rgba(255, 215, 0, 0.9);
            color: #333;
            padding: 8px 12px;
            border-radius: 15px;
            font-weight: bold;
            font-size: 12px;
            z-index: 1002;
            animation: slideInRight 0.3s ease-out;
        `;
        notification.textContent = `+${amount} 🪙`;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 2000);
    }
    
    // Upgrade System
    loadUpgrades() {
        const saved = localStorage.getItem('stacksUpgrades');
        if (saved) {
            return JSON.parse(saved);
        }
        
        return {
            shield: { level: 0, maxLevel: 3, cost: 50, effect: 1 },
            freeze: { level: 0, maxLevel: 3, cost: 40, effect: 500 },
            expand: { level: 0, maxLevel: 3, cost: 60, effect: 5 },
            shrink: { level: 0, maxLevel: 3, cost: 45, effect: 2 }
        };
    }
    
    upgradePowerUp(type) {
        const upgrade = this.upgrades[type];
        if (upgrade.level < upgrade.maxLevel && this.spendCoins(upgrade.cost * (upgrade.level + 1))) {
            upgrade.level++;
            localStorage.setItem('stacksUpgrades', JSON.stringify(this.upgrades));
            this.applyUpgradeEffects();
            return true;
        }
        return false;
    }
    
    applyUpgradeEffects() {
        // Apply upgrade effects to existing power-ups
        Object.keys(this.upgrades).forEach(type => {
            const upgrade = this.upgrades[type];
            if (upgrade.level > 0 && this.game.powerUpTypes[type]) {
                // Modify power-up properties based on upgrades
                switch(type) {
                    case 'shield':
                        this.game.powerUpTypes[type].duration = upgrade.effect * upgrade.level;
                        break;
                    case 'freeze':
                        this.game.powerUpTypes[type].duration = 2000 + (upgrade.effect * upgrade.level);
                        break;
                    case 'expand':
                        this.game.powerUpTypes[type].bonus = 10 + (upgrade.effect * upgrade.level);
                        break;
                    case 'shrink':
                        this.game.powerUpTypes[type].precision = 0.9 + (upgrade.effect * upgrade.level * 0.03);
                        break;
                }
            }
        });
    }
    
    // Shop System
    initializeShopButton() {
        // Find existing button container or create one
        let buttonContainer = document.querySelector('.mobile-nav-controls');
        if (!buttonContainer) {
            buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                gap: 10px;
                z-index: 1000;
            `;
            document.body.appendChild(buttonContainer);
        }
        
        // Create shop button matching existing style
        const shopButton = document.createElement('button');
        shopButton.id = 'shopButton';
        shopButton.className = 'nav-button';
        shopButton.style.cssText = `
            background: linear-gradient(135deg, #ffd700, #ffed4e);
            color: #333;
            border: none;
            padding: 10px 15px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 6px;
            min-width: 80px;
            justify-content: center;
        `;
        shopButton.innerHTML = `<span class="nav-icon">🛍️</span><span class="nav-text">SHOP</span>`;
        shopButton.addEventListener('click', () => this.openShop());
        
        buttonContainer.appendChild(shopButton);
    }
    
    openShop() {
        this.createShopModal();
    }
    
    createShopModal() {
        // Create modal overlay
        const modal = document.createElement('div');
        modal.id = 'shopModal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 2000;
            display: flex;
            justify-content: center;
            align-items: center;
        `;
        
        // Create shop content
        const shopContent = document.createElement('div');
        shopContent.style.cssText = `
            background: linear-gradient(135deg, #0a0a0a, #1a1a2e);
            border: 2px solid rgba(0, 255, 255, 0.3);
            border-radius: 20px;
            padding: 30px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
        `;
        
        shopContent.innerHTML = `
            <h2 style="color: #00ffff; margin-bottom: 20px; text-align: center;">🛍️ SHOP</h2>
            <div style="color: #ffd700; margin-bottom: 20px; text-align: center; font-weight: bold;">
                🪙 Coins: <span id="shopCoinCount">${this.coins}</span>
            </div>
            <div id="shopItems"></div>
            <button id="closeShop" style="
                position: absolute;
                top: 10px;
                right: 10px;
                background: rgba(255, 0, 0, 0.8);
                color: white;
                border: none;
                padding: 5px 10px;
                border-radius: 10px;
                cursor: pointer;
            ">✕</button>
        `;
        
        modal.appendChild(shopContent);
        document.body.appendChild(modal);
        
        // Populate shop items
        this.populateShopItems();
        
        // Close button
        document.getElementById('closeShop').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
    
    populateShopItems() {
        const shopItemsContainer = document.getElementById('shopItems');
        shopItemsContainer.innerHTML = '';
        
        // Add upgrade items
        Object.keys(this.upgrades).forEach(type => {
            const upgrade = this.upgrades[type];
            const item = document.createElement('div');
            item.style.cssText = `
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 10px;
                padding: 15px;
                margin-bottom: 10px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            `;
            
            const cost = upgrade.cost * (upgrade.level + 1);
            const maxed = upgrade.level >= upgrade.maxLevel;
            
            item.innerHTML = `
                <div>
                    <div style="color: #00ffff; font-weight: bold;">${type.toUpperCase()} UPGRADE</div>
                    <div style="color: #ccc; font-size: 12px;">Level ${upgrade.level}/${upgrade.maxLevel}</div>
                </div>
                <button ${maxed ? 'disabled' : ''} style="
                    background: ${maxed ? 'rgba(128, 128, 128, 0.5)' : 'linear-gradient(135deg, #ffd700, #ffed4e)'};
                    color: ${maxed ? '#666' : '#333'};
                    border: none;
                    padding: 8px 15px;
                    border-radius: 15px;
                    font-weight: bold;
                    cursor: ${maxed ? 'not-allowed' : 'pointer'};
                ">
                    ${maxed ? 'MAXED' : `${cost} 🪙`}
                </button>
            `;
            
            if (!maxed) {
                item.querySelector('button').addEventListener('click', () => {
                    if (this.upgradePowerUp(type)) {
                        this.populateShopItems(); // Refresh shop
                        this.updateCoinDisplay();
                    }
                });
            }
            
            shopItemsContainer.appendChild(item);
        });
        
        // Add cosmetic items
        this.addCosmeticItems(shopItemsContainer);
        
        // Add clutch save
        this.addClutchSaveItem(shopItemsContainer);
    }
    
    addCosmeticItems(container) {
        const cosmetics = [
            { id: 'neon', name: 'Neon Blocks', price: 100, description: 'Vibrant neon colors' },
            { id: 'gold', name: 'Gold Blocks', price: 150, description: 'Shiny golden blocks' },
            { id: 'galaxy', name: 'Galaxy Theme', price: 200, description: 'Cosmic colors' }
        ];
        
        cosmetics.forEach(cosmetic => {
            const owned = this.cosmetics.blockSkins && this.cosmetics.blockSkins.includes(cosmetic.id);
            const equipped = this.selectedCosmetics.blockSkin === cosmetic.id;
            
            const item = document.createElement('div');
            item.style.cssText = `
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 10px;
                padding: 15px;
                margin-bottom: 10px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            `;
            
            item.innerHTML = `
                <div>
                    <div style="color: #00ffff; font-weight: bold;">${cosmetic.name}</div>
                    <div style="color: #ccc; font-size: 12px;">${cosmetic.description}</div>
                </div>
                <button ${owned && !equipped ? '' : owned ? 'disabled' : ''} style="
                    background: ${owned ? (equipped ? 'rgba(0, 255, 0, 0.5)' : 'linear-gradient(135deg, #00ff00, #00cc00)') : 'linear-gradient(135deg, #ffd700, #ffed4e)'};
                    color: ${owned ? '#fff' : '#333'};
                    border: none;
                    padding: 8px 15px;
                    border-radius: 15px;
                    font-weight: bold;
                    cursor: ${owned && !equipped ? 'pointer' : (owned ? 'not-allowed' : 'pointer')};
                ">
                    ${owned ? (equipped ? 'EQUIPPED' : 'USE') : `${cosmetic.price} 🪙`}
                </button>
            `;
            
            const button = item.querySelector('button');
            if (!owned) {
                button.addEventListener('click', () => {
                    if (this.spendCoins(cosmetic.price)) {
                        if (!this.cosmetics.blockSkins) this.cosmetics.blockSkins = [];
                        this.cosmetics.blockSkins.push(cosmetic.id);
                        localStorage.setItem('stacksCosmetics', JSON.stringify(this.cosmetics));
                        this.populateShopItems();
                        this.updateCoinDisplay();
                    }
                });
            } else if (!equipped) {
                button.addEventListener('click', () => {
                    this.selectedCosmetics.blockSkin = cosmetic.id;
                    localStorage.setItem('stacksSelectedCosmetics', JSON.stringify(this.selectedCosmetics));
                    this.populateShopItems();
                });
            }
            
            container.appendChild(item);
        });
    }
    
    addClutchSaveItem(container) {
        const item = document.createElement('div');
        item.style.cssText = `
            background: rgba(255, 0, 110, 0.2);
            border: 1px solid rgba(255, 0, 110, 0.5);
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        
        item.innerHTML = `
            <div>
                <div style="color: #ff006e; font-weight: bold;">🆘 CLUTCH SAVE</div>
                <div style="color: #ccc; font-size: 12px;">Recover from one mistake (Owned: ${this.clutchSaves})</div>
            </div>
            <button style="
                background: linear-gradient(135deg, #ff006e, #8338ec);
                color: white;
                border: none;
                padding: 8px 15px;
                border-radius: 15px;
                font-weight: bold;
                cursor: pointer;
            ">
                500 🪙
            </button>
        `;
        
        item.querySelector('button').addEventListener('click', () => {
            if (this.spendCoins(500)) {
                this.clutchSaves++;
                localStorage.setItem('stacksClutchSaves', this.clutchSaves.toString());
                this.populateShopItems();
                this.updateCoinDisplay();
            }
        });
        
        container.appendChild(item);
    }
    
    // Loadout System
    loadLoadout() {
        const saved = localStorage.getItem('stacksLoadout');
        return saved ? JSON.parse(saved) : { slot1: null, slot2: null };
    }
    
    initializeLoadoutUI() {
        // This would integrate with existing power-up selection UI
        // For now, we'll just ensure the loadout is applied when game starts
        this.applyLoadout();
    }
    
    applyLoadout() {
        // Apply selected loadout to game
        if (this.game && this.game.collectedPowerUps) {
            // Filter collected power-ups to only include loadout items
            this.game.collectedPowerUps = this.game.collectedPowerUps.filter(powerUp => 
                this.loadout.slot1 === powerUp.type || this.loadout.slot2 === powerUp.type
            );
        }
    }
    
    // Special Abilities
    activateClutchSave() {
        if (this.clutchSaves > 0 && !this.clutchSaveActive) {
            this.clutchSaves--;
            this.clutchSaveActive = true;
            localStorage.setItem('stacksClutchSaves', this.clutchSaves.toString());
            
            // Show clutch save notification
            this.showClutchSaveNotification();
            
            // Set up clutch save effect
            this.setupClutchSaveEffect();
            
            return true;
        }
        return false;
    }
    
    showClutchSaveNotification() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #ff006e, #8338ec);
            color: white;
            padding: 20px 30px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 18px;
            z-index: 3000;
            animation: pulse 0.5s ease-in-out;
        `;
        notification.textContent = '🆘 CLUTCH SAVE ACTIVATED!';
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 2000);
    }
    
    setupClutchSaveEffect() {
        // Override next game over to allow recovery
        const originalGameOver = this.game.gameOver.bind(this.game);
        this.game.gameOver = () => {
            if (this.clutchSaveActive) {
                this.clutchSaveActive = false;
                // Give player a chance to recover
                this.game.currentBlock.width = Math.max(this.game.currentBlock.width * 0.7, 30);
                this.showRecoveryChance();
            } else {
                originalGameOver();
            }
        };
    }
    
    showRecoveryChance() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 40%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 255, 0, 0.9);
            color: white;
            padding: 15px 25px;
            border-radius: 15px;
            font-weight: bold;
            z-index: 3000;
        `;
        notification.textContent = '💪 SECOND CHANCE! Stack carefully!';
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }
    
    // Integration with existing game
    integrateWithGame() {
        // Hook into game events
        const originalDropBlock = this.game.dropBlock.bind(this.game);
        this.game.dropBlock = () => {
            const result = originalDropBlock();
            
            // Award coins for successful stack
            if (result && result.success) {
                const coins = result.perfect ? 3 : 1;
                this.earnCoins(coins, 'stack');
                
                // Bonus for perfect stacks
                if (result.perfect) {
                    this.earnCoins(2, 'perfect');
                }
            }
            
            return result;
        };
        
        // Hook into game over for end bonus
        const originalGameOver = this.game.gameOver.bind(this.game);
        this.game.gameOver = () => {
            // Calculate end bonus based on height
            const heightBonus = Math.floor(this.game.gameHeight / 100);
            if (heightBonus > 0) {
                this.earnCoins(heightBonus, 'height');
            }
            
            originalGameOver();
        };
        
        // Apply upgrade effects
        this.applyUpgradeEffects();
    }
    
    // Persistence
    loadCosmetics() {
        const saved = localStorage.getItem('stacksCosmetics');
        return saved ? JSON.parse(saved) : { blockSkins: [], backgrounds: [], effects: [] };
    }
    
    loadSelectedCosmetics() {
        const saved = localStorage.getItem('stacksSelectedCosmetics');
        return saved ? JSON.parse(saved) : { blockSkin: 'default', background: 'default', effect: 'none' };
    }
    
    // Add CSS animations
    addAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes pulse {
                0%, 100% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.1);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize reward system when game loads
document.addEventListener('DOMContentLoaded', () => {
    // Wait for game to initialize
    setTimeout(() => {
        if (window.game) {
            window.rewardSystem = new RewardSystem(window.game);
            window.rewardSystem.integrateWithGame();
            window.rewardSystem.addAnimations();
        }
    }, 1000);
});
