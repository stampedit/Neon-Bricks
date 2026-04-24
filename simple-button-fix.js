/**
 * SIMPLE BUTTON FIX - Ultra basic approach
 * No complex systems, just direct DOM manipulation
 */

console.log('🔧 SIMPLE FIX: Starting ultra-simple button fix...');

// Wait for DOM and then fix buttons immediately
function fixButtonsNow() {
    console.log('🔧 SIMPLE FIX: Fixing buttons now...');
    
    // Remove ALL blocking elements
    document.body.style.touchAction = 'auto';
    document.body.style.pointerEvents = 'auto';
    
    const canvas = document.getElementById('gameCanvas');
    if (canvas) {
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '1';
    }
    
    const gameContainer = document.querySelector('.game-container');
    if (gameContainer) {
        gameContainer.style.pointerEvents = 'none';
    }
    
    // Remove all existing buttons first
    const existingButtons = document.querySelectorAll('button');
    existingButtons.forEach(btn => btn.remove());
    
    // Create SIMPLE play button
    const playBtn = document.createElement('button');
    playBtn.id = 'playBtn';
    playBtn.innerHTML = 'PLAY';
    playBtn.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #00ff88;
        color: white;
        border: none;
        padding: 20px 40px;
        border-radius: 10px;
        font-size: 24px;
        font-weight: bold;
        cursor: pointer;
        z-index: 99999;
        pointer-events: auto;
    `;
    
    // ULTRA SIMPLE event handler
    playBtn.onclick = function() {
        console.log('🎮 SIMPLE FIX: PLAY BUTTON CLICKED!');
        alert('PLAY BUTTON WORKS!');
        this.style.display = 'none';
    };
    
    // Also add touch event
    playBtn.ontouchstart = function(e) {
        e.preventDefault();
        console.log('📱 SIMPLE FIX: PLAY BUTTON TOUCHED!');
        alert('PLAY BUTTON TOUCH WORKS!');
        this.style.display = 'none';
    };
    
    // Add to body
    document.body.appendChild(playBtn);
    
    console.log('✅ SIMPLE FIX: Play button added with direct events');
    
    // Create SIMPLE restart button
    const restartBtn = document.createElement('button');
    restartBtn.id = 'restartBtn';
    restartBtn.innerHTML = 'RESTART';
    restartBtn.style.cssText = `
        position: fixed;
        top: 60%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #ff6b6b;
        color: white;
        border: none;
        padding: 15px 30px;
        border-radius: 10px;
        font-size: 18px;
        font-weight: bold;
        cursor: pointer;
        z-index: 99999;
        pointer-events: auto;
        display: none;
    `;
    
    restartBtn.onclick = function() {
        console.log('🔄 SIMPLE FIX: RESTART BUTTON CLICKED!');
        alert('RESTART BUTTON WORKS!');
        this.style.display = 'none';
        playBtn.style.display = 'block';
    };
    
    restartBtn.ontouchstart = function(e) {
        e.preventDefault();
        console.log('📱 SIMPLE FIX: RESTART BUTTON TOUCHED!');
        alert('RESTART BUTTON TOUCH WORKS!');
        this.style.display = 'none';
        playBtn.style.display = 'block';
    };
    
    document.body.appendChild(restartBtn);
    
    console.log('✅ SIMPLE FIX: Restart button added with direct events');
    
    // Create SIMPLE menu button
    const menuBtn = document.createElement('button');
    menuBtn.id = 'menuBtn';
    menuBtn.innerHTML = 'MENU';
    menuBtn.style.cssText = `
        position: fixed;
        top: 70%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #667eea;
        color: white;
        border: none;
        padding: 15px 30px;
        border-radius: 10px;
        font-size: 18px;
        font-weight: bold;
        cursor: pointer;
        z-index: 99999;
        pointer-events: auto;
        display: none;
    `;
    
    menuBtn.onclick = function() {
        console.log('🏠 SIMPLE FIX: MENU BUTTON CLICKED!');
        alert('MENU BUTTON WORKS!');
        this.style.display = 'none';
        playBtn.style.display = 'block';
        restartBtn.style.display = 'none';
    };
    
    menuBtn.ontouchstart = function(e) {
        e.preventDefault();
        console.log('📱 SIMPLE FIX: MENU BUTTON TOUCHED!');
        alert('MENU BUTTON TOUCH WORKS!');
        this.style.display = 'none';
        playBtn.style.display = 'block';
        restartBtn.style.display = 'none';
    };
    
    document.body.appendChild(menuBtn);
    
    console.log('✅ SIMPLE FIX: Menu button added with direct events');
    
    // Add test button to verify clicking works
    const testBtn = document.createElement('button');
    testBtn.id = 'testBtn';
    testBtn.innerHTML = 'TEST CLICK';
    testBtn.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: #ffd700;
        color: #333;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        z-index: 999999;
        pointer-events: auto;
    `;
    
    testBtn.onclick = function() {
        console.log('🧪 SIMPLE FIX: TEST BUTTON CLICKED!');
        alert('TEST BUTTON WORKS! Clicking is functional.');
    };
    
    testBtn.ontouchstart = function(e) {
        e.preventDefault();
        console.log('🧪 SIMPLE FIX: TEST BUTTON TOUCHED!');
        alert('TEST BUTTON TOUCH WORKS! Touch is functional.');
    };
    
    document.body.appendChild(testBtn);
    
    console.log('✅ SIMPLE FIX: Test button added');
    console.log('🎯 SIMPLE FIX: All buttons ready for testing');
}

// Run immediately
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixButtonsNow);
} else {
    fixButtonsNow();
}

// Also run after a short delay to ensure it works
setTimeout(fixButtonsNow, 1000);

console.log('🔧 SIMPLE FIX: Script loaded');
