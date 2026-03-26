/**
 * State Manager for STACKS Game
 * Handles all game states and transitions
 */
class StateManager {
    constructor() {
        this.states = {
            MENU: 'menu',
            PLAYING: 'playing',
            PAUSED: 'paused',
            GAME_OVER: 'game_over',
            SETTINGS: 'settings',
            LEADERBOARD: 'leaderboard'
        };
        
        this.currentState = this.states.MENU;
        this.previousState = null;
        
        // State-specific data
        this.stateData = {
            menu: { selectedOption: 0 },
            playing: { score: 0, combo: 0, level: 1 },
            paused: { resumeRequested: false },
            gameOver: { finalScore: 0, isNewRecord: false },
            settings: { musicEnabled: true, soundEnabled: true },
            leaderboard: { scores: [] }
        };
        
        this.listeners = new Map();
    }
    
    /**
     * Change to a new state
     * @param {string} newState - The state to transition to
     * @param {Object} data - Optional data to pass to the new state
     */
    setState(newState, data = {}) {
        if (!this.isValidState(newState)) {
            console.error(`Invalid state: ${newState}`);
            return;
        }
        
        this.previousState = this.currentState;
        this.currentState = newState;
        
        // Merge provided data with state data
        if (Object.keys(data).length > 0) {
            this.stateData[newState] = { ...this.stateData[newState], ...data };
        }
        
        // Notify listeners
        this.notifyListeners('stateChanged', {
            from: this.previousState,
            to: this.currentState,
            data: this.stateData[this.currentState]
        });
        
        console.log(`State changed: ${this.previousState} -> ${this.currentState}`);
    }
    
    /**
     * Check if a state is valid
     * @param {string} state - State to validate
     * @returns {boolean}
     */
    isValidState(state) {
        return Object.values(this.states).includes(state);
    }
    
    /**
     * Get current state
     * @returns {string}
     */
    getCurrentState() {
        return this.currentState;
    }
    
    /**
     * Get data for current state
     * @returns {Object}
     */
    getCurrentStateData() {
        return this.stateData[this.currentState];
    }
    
    /**
     * Update data for current state
     * @param {Object} data - Data to update
     */
    updateCurrentStateData(data) {
        this.stateData[this.currentState] = { ...this.stateData[this.currentState], ...data };
        this.notifyListeners('stateDataUpdated', {
            state: this.currentState,
            data: this.stateData[this.currentState]
        });
    }
    
    /**
     * Add event listener
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     */
    addListener(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }
    
    /**
     * Remove event listener
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     */
    removeListener(event, callback) {
        if (this.listeners.has(event)) {
            const callbacks = this.listeners.get(event);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }
    
    /**
     * Notify all listeners of an event
     * @param {string} event - Event name
     * @param {Object} data - Event data
     */
    notifyListeners(event, data) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in state manager listener: ${error}`);
                }
            });
        }
    }
    
    /**
     * Reset all state data to defaults
     */
    reset() {
        this.currentState = this.states.MENU;
        this.previousState = null;
        
        // Reset state data to defaults
        this.stateData = {
            menu: { selectedOption: 0 },
            playing: { score: 0, combo: 0, level: 1 },
            paused: { resumeRequested: false },
            gameOver: { finalScore: 0, isNewRecord: false },
            settings: { 
                musicEnabled: this.stateData.settings?.musicEnabled ?? true, 
                soundEnabled: this.stateData.settings?.soundEnabled ?? true 
            },
            leaderboard: { scores: [] }
        };
    }
    
    /**
     * Check if currently in a specific state
     * @param {string} state - State to check
     * @returns {boolean}
     */
    isState(state) {
        return this.currentState === state;
    }
    
    /**
     * Check if currently in any of the provided states
     * @param {Array} states - Array of states to check
     * @returns {boolean}
     */
    isAnyState(states) {
        return states.includes(this.currentState);
    }
    
    /**
     * Get state-specific helper methods
     */
    get helpers() {
        return {
            isPlaying: () => this.isState(this.states.PLAYING),
            isPaused: () => this.isState(this.states.PAUSED),
            isMenu: () => this.isState(this.states.MENU),
            isGameOver: () => this.isState(this.states.GAME_OVER),
            isSettings: () => this.isState(this.states.SETTINGS),
            isLeaderboard: () => this.isState(this.states.LEADERBOARD),
            
            canPause: () => this.isState(this.states.PLAYING),
            canResume: () => this.isState(this.states.PAUSED),
            canRestart: () => this.isAnyState([this.states.GAME_OVER, this.states.PLAYING])
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StateManager;
}
