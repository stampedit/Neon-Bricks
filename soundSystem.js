/**
 * Sound System for STACKS Game
 * Handles background music and sound effects
 */
class SoundSystem {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.backgroundMusic = null;
        this.musicGainNode = null;
        this.soundGainNode = null;
        
        // Settings
        this.musicEnabled = true;
        this.soundEnabled = true;
        this.musicVolume = 0.3;
        this.soundVolume = 0.5;
        
        // Initialize audio context on first user interaction
        this.initialized = false;
        
        // Sound effect definitions
        this.soundDefinitions = {
            // Block sounds
            blockLand: { frequency: 440, duration: 0.1, type: 'sine', envelope: 'attack' },
            perfectPlacement: { frequency: 880, duration: 0.2, type: 'sine', envelope: 'attack' },
            blockMiss: { frequency: 220, duration: 0.3, type: 'sawtooth', envelope: 'decay' },
            
            // Combo sounds with escalating tones
            combo1: { frequency: 523, duration: 0.15, type: 'square', envelope: 'attack' },
            combo2: { frequency: 659, duration: 0.15, type: 'square', envelope: 'attack' },
            combo3: { frequency: 784, duration: 0.15, type: 'square', envelope: 'attack' },
            combo4: { frequency: 1047, duration: 0.2, type: 'square', envelope: 'attack' },
            combo5: { frequency: 1319, duration: 0.25, type: 'square', envelope: 'attack' },
            
            // UI sounds
            buttonClick: { frequency: 600, duration: 0.05, type: 'sine', envelope: 'attack' },
            menuNavigate: { frequency: 400, duration: 0.05, type: 'sine', envelope: 'attack' },
            gameOver: { frequency: 200, duration: 0.5, type: 'sawtooth', envelope: 'decay' },
            highScore: { frequency: 1320, duration: 0.3, type: 'sine', envelope: 'attack' },
            
            // Game sounds
            levelUp: { frequency: 660, duration: 0.2, type: 'triangle', envelope: 'attack' },
            powerUp: { frequency: 880, duration: 0.25, type: 'sine', envelope: 'attack' },
            streakBonus: { frequency: 1320, duration: 0.4, type: 'sine', envelope: 'attack' },
            milestone: { frequency: 1760, duration: 0.5, type: 'sine', envelope: 'attack' },
            megaEffect: { frequency: 220, duration: 0.6, type: 'sawtooth', envelope: 'attack' },
            rainbowMode: { frequency: 440, duration: 0.3, type: 'triangle', envelope: 'attack' },
            slowMotion: { frequency: 220, duration: 0.2, type: 'sine', envelope: 'attack' },
            timeFreeze: { frequency: 110, duration: 0.3, type: 'triangle', envelope: 'attack' },
            speedBoost: { frequency: 932, duration: 0.15, type: 'square', envelope: 'attack' },
            shrink: { frequency: 165, duration: 0.2, type: 'sawtooth', envelope: 'decay' },
            expand: { frequency: 330, duration: 0.2, type: 'sawtooth', envelope: 'attack' },
            mystery: { frequency: 554, duration: 0.3, type: 'triangle', envelope: 'attack' }
        };
        
        // Background music patterns (simple arcade-style loops)
        this.musicPatterns = {
            main: [
                { note: 'C4', duration: 0.25, time: 0 },
                { note: 'E4', duration: 0.25, time: 0.25 },
                { note: 'G4', duration: 0.25, time: 0.5 },
                { note: 'C5', duration: 0.5, time: 0.75 },
                { note: 'G4', duration: 0.25, time: 1.25 },
                { note: 'E4', duration: 0.25, time: 1.5 },
                { note: 'C4', duration: 0.5, time: 1.75 }
            ],
            intense: [
                { note: 'A3', duration: 0.125, time: 0 },
                { note: 'C4', duration: 0.125, time: 0.125 },
                { note: 'E4', duration: 0.125, time: 0.25 },
                { note: 'A4', duration: 0.25, time: 0.375 },
                { note: 'E4', duration: 0.125, time: 0.625 },
                { note: 'C4', duration: 0.125, time: 0.75 },
                { note: 'A3', duration: 0.25, time: 0.875 }
            ]
        };
        
        this.currentMusicPattern = 'main';
        this.musicLoop = null;
    }
    
    /**
     * Initialize audio context (must be called on first user interaction)
     */
    initialize() {
        if (this.initialized) return;
        
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create gain nodes for volume control
            this.musicGainNode = this.audioContext.createGain();
            this.soundGainNode = this.audioContext.createGain();
            
            this.musicGainNode.connect(this.audioContext.destination);
            this.soundGainNode.connect(this.audioContext.destination);
            
            this.musicGainNode.gain.value = this.musicVolume;
            this.soundGainNode.gain.value = this.soundVolume;
            
            this.initialized = true;
            console.log('Audio system initialized');
        } catch (error) {
            console.error('Failed to initialize audio system:', error);
        }
    }
    
    /**
     * Play a sound effect
     * @param {string} soundName - Name of the sound to play
     */
    playSound(soundName) {
        if (!this.initialized || !this.soundEnabled) return;
        
        const sound = this.soundDefinitions[soundName];
        if (!sound) {
            console.warn(`Sound not found: ${soundName}`);
            return;
        }
        
        this.createTone(sound.frequency, sound.duration, sound.type, sound.envelope);
    }
    
    /**
     * Create a tone with specified parameters
     * @param {number} frequency - Frequency in Hz
     * @param {number} duration - Duration in seconds
     * @param {string} type - Wave type ('sine', 'square', 'sawtooth', 'triangle')
     * @param {string} envelope - Envelope type ('attack', 'decay')
     */
    createTone(frequency, duration, type = 'sine', envelope = 'attack') {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = type;
        oscillator.frequency.value = frequency;
        
        oscillator.connect(gainNode);
        gainNode.connect(this.soundGainNode);
        
        const now = this.audioContext.currentTime;
        
        if (envelope === 'attack') {
            // Quick attack, quick decay
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);
        } else {
            // Slow attack, slow decay
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(0.2, now + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);
        }
        
        oscillator.start(now);
        oscillator.stop(now + duration);
    }
    
    /**
     * Play combo sound based on combo level
     * @param {number} comboLevel - Current combo level
     */
    playComboSound(comboLevel) {
        const comboSound = `combo${Math.min(comboLevel, 4)}`;
        this.playSound(comboSound);
    }
    
    /**
     * Start background music
     * @param {string} pattern - Music pattern to play
     */
    startBackgroundMusic(pattern = 'main') {
        if (!this.initialized || !this.musicEnabled) return;
        
        this.stopBackgroundMusic();
        this.currentMusicPattern = pattern;
        this.musicLoop = this.createMusicLoop(pattern);
        this.musicLoop.start(0);
    }
    
    /**
     * Stop background music
     */
    stopBackgroundMusic() {
        if (this.musicLoop) {
            this.musicLoop.stop();
            this.musicLoop = null;
        }
    }
    
    /**
     * Create a music loop from pattern
     * @param {string} patternName - Pattern name
     * @returns {AudioBufferSourceNode}
     */
    createMusicLoop(patternName) {
        const pattern = this.musicPatterns[patternName];
        if (!pattern) return null;
        
        const totalDuration = Math.max(...pattern.map(n => n.time + n.duration));
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, totalDuration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        // Generate music pattern
        pattern.forEach(note => {
            const frequency = this.noteToFrequency(note.note);
            const startTime = note.time * sampleRate;
            const duration = note.duration * sampleRate;
            
            for (let i = 0; i < duration; i++) {
                const sample = i / sampleRate;
                const value = Math.sin(2 * Math.PI * frequency * sample);
                const envelope = Math.exp(-sample * 2); // Simple envelope
                
                data[startTime + i] += value * envelope * 0.1;
            }
        });
        
        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        source.connect(this.musicGainNode);
        
        return source;
    }
    
    /**
     * Convert note name to frequency
     * @param {string} note - Note name (e.g., 'C4', 'A#3')
     * @returns {number} Frequency in Hz
     */
    noteToFrequency(note) {
        const notes = {
            'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5,
            'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11
        };
        
        const octave = parseInt(note.slice(-1));
        const noteName = note.slice(0, -1);
        const semitone = notes[noteName];
        
        return 440 * Math.pow(2, (octave - 4) + semitone / 12);
    }
    
    /**
     * Toggle music on/off
     */
    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        this.updateMusicVolume();
        
        if (this.musicEnabled) {
            this.startBackgroundMusic(this.currentMusicPattern);
        } else {
            this.stopBackgroundMusic();
        }
        
        return this.musicEnabled;
    }
    
    /**
     * Toggle sound effects on/off
     */
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        this.updateSoundVolume();
        return this.soundEnabled;
    }
    
    /**
     * Set music volume
     * @param {number} volume - Volume level (0-1)
     */
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        this.updateMusicVolume();
    }
    
    /**
     * Set sound volume
     * @param {number} volume - Volume level (0-1)
     */
    setSoundVolume(volume) {
        this.soundVolume = Math.max(0, Math.min(1, volume));
        this.updateSoundVolume();
    }
    
    /**
     * Update music gain node
     */
    updateMusicVolume() {
        if (this.musicGainNode) {
            this.musicGainNode.gain.value = this.musicEnabled ? this.musicVolume : 0;
        }
    }
    
    /**
     * Update sound gain node
     */
    updateSoundVolume() {
        if (this.soundGainNode) {
            this.soundGainNode.gain.value = this.soundEnabled ? this.soundVolume : 0;
        }
    }
    
    /**
     * Get current settings
     * @returns {Object} Current audio settings
     */
    getSettings() {
        return {
            musicEnabled: this.musicEnabled,
            soundEnabled: this.soundEnabled,
            musicVolume: this.musicVolume,
            soundVolume: this.soundVolume
        };
    }
    
    /**
     * Load settings from localStorage
     */
    loadSettings() {
        const settings = localStorage.getItem('stacksAudioSettings');
        if (settings) {
            try {
                const parsed = JSON.parse(settings);
                this.musicEnabled = parsed.musicEnabled ?? true;
                this.soundEnabled = parsed.soundEnabled ?? true;
                this.musicVolume = parsed.musicVolume ?? 0.3;
                this.soundVolume = parsed.soundVolume ?? 0.5;
                
                this.updateMusicVolume();
                this.updateSoundVolume();
            } catch (error) {
                console.error('Failed to load audio settings:', error);
            }
        }
    }
    
    /**
     * Save settings to localStorage
     */
    saveSettings() {
        const settings = {
            musicEnabled: this.musicEnabled,
            soundEnabled: this.soundEnabled,
            musicVolume: this.musicVolume,
            soundVolume: this.soundVolume
        };
        
        localStorage.setItem('stacksAudioSettings', JSON.stringify(settings));
    }
    
    /**
     * Resume audio context if suspended
     */
    resumeAudioContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SoundSystem;
}
