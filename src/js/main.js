/**
 * Main Game Controller - The River Game
 * Handles initialization, screen management, and core game loop
 */

class RiverGame {
    constructor() {
        this.currentScreen = 'loading';
        this.gameState = null;
        this.settings = null;
        this.isInitialized = false;

        // Bind methods to preserve context
        this.init = this.init.bind(this);
        this.showScreen = this.showScreen.bind(this);
        this.handleCharacterSelection = this.handleCharacterSelection.bind(this);
        this.startNewGame = this.startNewGame.bind(this);
        this.continueGame = this.continueGame.bind(this);

        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', this.init);
        } else {
            this.init();
        }
    }

    /**
     * Initialize the game
     */
    async init() {
        try {
            console.log('Initializing The River Game...');

            // Load settings first
            this.settings = gameStorage.loadSettings();
            this.applySettings();

            // Check for existing save
            const hasSave = gameStorage.hasSaveGame();

            // Set up event listeners
            this.setupEventListeners();

            // Initialize game systems
            this.initializeSystems();

            // Show loading screen briefly, then transition to main menu
            setTimeout(() => {
                this.showScreen('main-menu');

                // Enable continue button if save exists
                const continueBtn = DOM.get('continue-btn');
                if (continueBtn) {
                    continueBtn.disabled = !hasSave;
                }
            }, 2000);

            this.isInitialized = true;
            console.log('Game initialized successfully');

        } catch (error) {
            console.error('Failed to initialize game:', error);
            this.showError('Failed to initialize game. Please refresh the page.');
        }
    }

    /**
     * Apply loaded settings to the game
     */
    applySettings() {
        // Apply reduced motion preference
        if (this.settings.reducedMotion) {
            document.body.classList.add('reduced-motion');
        }

        // Apply high contrast mode
        if (this.settings.highContrast) {
            document.body.classList.add('high-contrast');
        }

        // Apply text size
        document.body.classList.add(`text-size-${this.settings.textSize}`);

        // Set volume levels (will be used when audio system is implemented)
        document.documentElement.style.setProperty('--master-volume', this.settings.masterVolume);
        document.documentElement.style.setProperty('--music-volume', this.settings.musicVolume);
        document.documentElement.style.setProperty('--sfx-volume', this.settings.sfxVolume);
    }

    /**
     * Set up all event listeners
     */
    setupEventListeners() {
        // Main menu buttons
        const newGameBtn = DOM.get('new-game-btn');
        const continueBtn = DOM.get('continue-btn');
        const settingsBtn = DOM.get('settings-btn');
        const creditsBtn = DOM.get('credits-btn');

        if (newGameBtn) {
            Events.on(newGameBtn, 'click', () => this.showScreen('character-creation'));
        }

        if (continueBtn) {
            Events.on(continueBtn, 'click', this.continueGame);
        }

        if (settingsBtn) {
            Events.on(settingsBtn, 'click', () => this.showSettingsModal());
        }

        if (creditsBtn) {
            Events.on(creditsBtn, 'click', () => this.showCreditsModal());
        }

        // Character creation
        const backToMenuBtn = DOM.get('back-to-menu-btn');
        const startJourneyBtn = DOM.get('start-journey-btn');

        if (backToMenuBtn) {
            Events.on(backToMenuBtn, 'click', () => this.showScreen('main-menu'));
        }

        if (startJourneyBtn) {
            Events.on(startJourneyBtn, 'click', this.startNewGame);
        }

        // Character class selection
        const classOptions = DOM.getByClass('class-option');
        classOptions.forEach(option => {
            Events.on(option, 'click', this.handleCharacterSelection);
        });

        // Game interface buttons
        const inventoryBtn = DOM.get('inventory-btn');
        const companionsBtn = DOM.get('companions-btn');
        const recipesBtn = DOM.get('recipes-btn');
        const settingsGameBtn = DOM.get('settings-game-btn');

        if (inventoryBtn) {
            Events.on(inventoryBtn, 'click', () => this.showInventoryModal());
        }

        if (companionsBtn) {
            Events.on(companionsBtn, 'click', () => this.showCompanionsModal());
        }

        if (recipesBtn) {
            Events.on(recipesBtn, 'click', () => this.showRecipesModal());
        }

        if (settingsGameBtn) {
            Events.on(settingsGameBtn, 'click', () => this.showSettingsModal());
        }

        // Action buttons
        const cookBtn = DOM.get('cook-btn');
        const cleanBtn = DOM.get('clean-btn');
        const travelBtn = DOM.get('travel-btn');

        if (cookBtn) {
            Events.on(cookBtn, 'click', () => this.showCookingModal());
        }

        if (cleanBtn) {
            Events.on(cleanBtn, 'click', () => this.startCleaningActivity());
        }

        if (travelBtn) {
            Events.on(travelBtn, 'click', () => this.showTravelOptions());
        }

        // Modal overlay close
        const modalOverlay = DOM.get('modal-overlay');
        if (modalOverlay) {
            Events.on(modalOverlay, 'click', (e) => {
                if (e.target === modalOverlay) {
                    this.hideModal();
                }
            });
        }

        // Keyboard shortcuts
        Events.on(document, 'keydown', this.handleKeyboard.bind(this));

        // Auto-save on page unload
        Events.on(window, 'beforeunload', () => {
            if (this.gameState) {
                gameStorage.autoSave(this.gameState, true);
            }
        });
    }

    /**
     * Initialize game systems
     */
    initializeSystems() {
        // Initialize inventory system
        if (window.InventorySystem) {
            this.inventory = new InventorySystem();
        }

        // Initialize companion system
        if (window.CompanionSystem) {
            this.companions = new CompanionSystem();
        }

        // Initialize cooking system
        if (window.CookingSystem) {
            this.cooking = new CookingSystem();
        }

        // Initialize dialogue system
        if (window.DialogueSystem) {
            this.dialogue = new DialogueSystem();
        }

        // Initialize scene manager
        if (window.SceneManager) {
            this.sceneManager = new SceneManager();
        }
    }

    /**
     * Show a specific screen
     * @param {string} screenId - ID of screen to show
     */
    showScreen(screenId) {
        // Hide current screen
        const currentScreenElement = DOM.get(this.currentScreen);
        if (currentScreenElement) {
            currentScreenElement.classList.remove('active');
        }

        // Show new screen
        const newScreenElement = DOM.get(screenId);
        if (newScreenElement) {
            newScreenElement.classList.add('active');
            this.currentScreen = screenId;

            // Screen-specific initialization
            this.onScreenShow(screenId);
        } else {
            console.error(`Screen '${screenId}' not found`);
        }
    }

    /**
     * Handle screen-specific initialization
     * @param {string} screenId - ID of screen being shown
     */
    onScreenShow(screenId) {
        switch (screenId) {
            case 'character-creation':
                this.initCharacterCreation();
                break;
            case 'game-interface':
                this.initGameInterface();
                break;
        }
    }

    /**
     * Initialize character creation screen
     */
    initCharacterCreation() {
        // Reset selection
        const classOptions = DOM.getByClass('class-option');
        classOptions.forEach(option => {
            option.classList.remove('selected');
        });

        const startJourneyBtn = DOM.get('start-journey-btn');
        if (startJourneyBtn) {
            startJourneyBtn.disabled = true;
        }
    }

    /**
     * Initialize game interface
     */
    initGameInterface() {
        if (this.gameState) {
            this.updateUI();
            this.sceneManager?.loadScene(this.gameState.currentScene || 'riverside-village');
        }
    }

    /**
     * Handle character class selection
     * @param {Event} event - Click event
     */
    handleCharacterSelection(event) {
        const option = event.currentTarget;
        const characterClass = option.dataset.class;

        // Remove previous selection
        const classOptions = DOM.getByClass('class-option');
        classOptions.forEach(opt => opt.classList.remove('selected'));

        // Select current option
        option.classList.add('selected');
        Animation.addTemporaryClass(option, 'success-bounce', 600);

        // Enable start button
        const startJourneyBtn = DOM.get('start-journey-btn');
        if (startJourneyBtn) {
            startJourneyBtn.disabled = false;
        }

        // Store selection
        this.selectedClass = characterClass;
    }

    /**
     * Start a new game
     */
    startNewGame() {
        if (!this.selectedClass) {
            this.showError('Please select a character class first.');
            return;
        }

        // Create new game state
        this.gameState = {
            version: '1.0.0',
            playerClass: this.selectedClass,
            playerName: 'Retired Adventurer', // Could be customizable later
            currentScene: 'riverside-village',
            season: 'spring',
            day: 1,
            inventory: {
                items: [],
                capacity: 20,
                weight: 0
            },
            companions: [],
            recipes: [],
            relationships: {},
            skills: {
                cooking: 1,
                cleaning: 1,
                social: 1
            },
            boat: {
                capacity: 4,
                occupants: 1, // Just the player initially
                upgrades: []
            },
            progress: {
                act: 1,
                completedEvents: [],
                discoveredLocations: ['riverside-village']
            },
            stats: {
                playTime: 0,
                recipesLearned: 0,
                companionsRecruited: 0,
                mealsCooked: 0
            }
        };

        // Save initial game state
        gameStorage.saveGame(this.gameState);

        // Transition to game
        this.showScreen('game-interface');

        console.log('New game started with class:', this.selectedClass);
    }

    /**
     * Continue existing game
     */
    continueGame() {
        const savedState = gameStorage.loadGame();

        if (savedState) {
            this.gameState = savedState;
            this.showScreen('game-interface');
            console.log('Game continued from save');
        } else {
            this.showError('No saved game found.');
        }
    }

    /**
     * Update UI elements with current game state
     */
    updateUI() {
        if (!this.gameState) return;

        // Update location and season
        const locationElement = DOM.get('current-location');
        const seasonElement = DOM.get('season-indicator');

        if (locationElement) {
            locationElement.textContent = Format.camelToTitle(this.gameState.currentScene);
        }

        if (seasonElement) {
            seasonElement.textContent = Format.capitalize(this.gameState.season);
        }

        // Update boat capacity
        const capacityFill = document.querySelector('.capacity-fill');
        const capacityText = document.querySelector('.capacity-text');

        if (capacityFill && capacityText) {
            const percentage = (this.gameState.boat.occupants / this.gameState.boat.capacity) * 100;
            capacityFill.style.width = `${percentage}%`;
            capacityText.textContent = `${this.gameState.boat.occupants}/${this.gameState.boat.capacity}`;
        }
    }

    /**
     * Show modal with content
     * @param {string} content - HTML content for modal
     */
    showModal(content) {
        const modalOverlay = DOM.get('modal-overlay');
        const modalContent = DOM.get('modal-content');

        if (modalOverlay && modalContent) {
            modalContent.innerHTML = content;
            modalOverlay.classList.add('active');
        }
    }

    /**
     * Hide modal
     */
    hideModal() {
        const modalOverlay = DOM.get('modal-overlay');
        if (modalOverlay) {
            modalOverlay.classList.remove('active');
        }
    }

    /**
     * Show inventory modal
     */
    showInventoryModal() {
        const content = `
            <div class="inventory-modal">
                <div class="inventory-header">
                    <h2>Inventory</h2>
                    <button class="close-btn" onclick="game.hideModal()">×</button>
                </div>
                <div class="inventory-grid">
                    ${this.generateInventorySlots()}
                </div>
                <div class="inventory-info">
                    <p>Capacity: ${this.gameState?.inventory.items.length || 0}/${this.gameState?.inventory.capacity || 20}</p>
                    <p>Weight: ${this.gameState?.inventory.weight || 0} kg</p>
                </div>
            </div>
        `;
        this.showModal(content);
    }

    /**
     * Generate inventory slots HTML
     * @returns {string} - HTML for inventory slots
     */
    generateInventorySlots() {
        const capacity = this.gameState?.inventory.capacity || 20;
        const items = this.gameState?.inventory.items || [];
        let html = '';

        for (let i = 0; i < capacity; i++) {
            const item = items[i];
            if (item) {
                html += `
                    <div class="inventory-slot" data-slot="${i}">
                        <div class="item-icon">${item.icon || '📦'}</div>
                        <div class="item-name">${item.name}</div>
                        ${item.quantity > 1 ? `<div class="item-quantity">${item.quantity}</div>` : ''}
                        <div class="item-quality ${item.quality || 'good'}"></div>
                    </div>
                `;
            } else {
                html += `<div class="inventory-slot empty" data-slot="${i}"></div>`;
            }
        }

        return html;
    }

    /**
     * Show companions modal
     */
    showCompanionsModal() {
        const companions = this.gameState?.companions || [];
        const companionsList = companions.map(companion => `
            <div class="companion-card">
                <img src="assets/images/characters/${companion.id}-portrait.png" alt="${companion.name}" class="companion-avatar">
                <div class="companion-info">
                    <div class="companion-name">${companion.name}</div>
                    <div class="companion-class">${companion.class}</div>
                    <div class="companion-skills">
                        ${companion.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                </div>
                <div class="companion-relationship">
                    <div class="relationship-level">${companion.relationshipLevel || 'Acquaintance'}</div>
                    <div class="relationship-hearts">
                        ${this.generateHearts(companion.relationship || 1)}
                    </div>
                </div>
            </div>
        `).join('');

        const content = `
            <div class="companions-modal">
                <div class="inventory-header">
                    <h2>Companions</h2>
                    <button class="close-btn" onclick="game.hideModal()">×</button>
                </div>
                <div class="companions-list">
                    ${companions.length > 0 ? companionsList : '<p>No companions yet. Recruit some friends along your journey!</p>'}
                </div>
            </div>
        `;
        this.showModal(content);
    }

    /**
     * Generate heart icons for relationship level
     * @param {number} level - Relationship level (1-5)
     * @returns {string} - HTML for hearts
     */
    generateHearts(level) {
        let html = '';
        for (let i = 1; i <= 5; i++) {
            const filled = i <= level ? 'filled' : '';
            html += `<span class="heart ${filled}">♥</span>`;
        }
        return html;
    }

    /**
     * Show recipes modal
     */
    showRecipesModal() {
        const content = `
            <div class="recipe-modal">
                <div class="inventory-header">
                    <h2>Recipe Book</h2>
                    <button class="close-btn" onclick="game.hideModal()">×</button>
                </div>
                <div class="recipe-book">
                    <div class="recipe-categories">
                        <button class="recipe-category active">All</button>
                        <button class="recipe-category">Breakfast</button>
                        <button class="recipe-category">Lunch</button>
                        <button class="recipe-category">Dinner</button>
                        <button class="recipe-category">Desserts</button>
                        <button class="recipe-category">Beverages</button>
                    </div>
                    <div class="recipe-list">
                        <p>Discover recipes by cooking with different ingredients and learning from your companions!</p>
                    </div>
                </div>
            </div>
        `;
        this.showModal(content);
    }

    /**
     * Show cooking modal
     */
    showCookingModal() {
        const content = `
            <div class="cooking-modal">
                <div class="inventory-header">
                    <h2>Cooking</h2>
                    <button class="close-btn" onclick="game.hideModal()">×</button>
                </div>
                <div class="cooking-interface">
                    <div class="ingredients-panel">
                        <h3>Available Ingredients</h3>
                        <div class="ingredient-list">
                            <p>Add ingredients to your inventory to start cooking!</p>
                        </div>
                    </div>
                    <div class="cooking-area">
                        <div class="recipe-display">
                            <h3>Cooking Pot</h3>
                            <p>Drag ingredients here to create meals</p>
                        </div>
                        <div class="cooking-pot">
                            <div class="pot-contents"></div>
                            <button class="cook-button" disabled>Cook Meal</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        this.showModal(content);
    }

    /**
     * Show settings modal
     */
    showSettingsModal() {
        const content = `
            <div class="settings-modal">
                <div class="inventory-header">
                    <h2>Settings</h2>
                    <button class="close-btn" onclick="game.hideModal()">×</button>
                </div>
                <div class="settings-section">
                    <h3>Audio</h3>
                    <div class="setting-item">
                        <div>
                            <div class="setting-label">Master Volume</div>
                        </div>
                        <div class="setting-control">
                            <input type="range" class="range-slider" min="0" max="1" step="0.1" value="${this.settings.masterVolume}">
                        </div>
                    </div>
                    <div class="setting-item">
                        <div>
                            <div class="setting-label">Music Volume</div>
                        </div>
                        <div class="setting-control">
                            <input type="range" class="range-slider" min="0" max="1" step="0.1" value="${this.settings.musicVolume}">
                        </div>
                    </div>
                </div>
                <div class="settings-section">
                    <h3>Accessibility</h3>
                    <div class="setting-item">
                        <div>
                            <div class="setting-label">Reduced Motion</div>
                            <div class="setting-description">Reduces animations and transitions</div>
                        </div>
                        <div class="setting-control">
                            <div class="toggle-switch ${this.settings.reducedMotion ? 'active' : ''}" data-setting="reducedMotion"></div>
                        </div>
                    </div>
                    <div class="setting-item">
                        <div>
                            <div class="setting-label">High Contrast</div>
                            <div class="setting-description">Increases contrast for better visibility</div>
                        </div>
                        <div class="setting-control">
                            <div class="toggle-switch ${this.settings.highContrast ? 'active' : ''}" data-setting="highContrast"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        this.showModal(content);

        // Add event listeners for settings
        this.setupSettingsListeners();
    }

    /**
     * Set up settings modal event listeners
     */
    setupSettingsListeners() {
        const toggles = document.querySelectorAll('.toggle-switch');
        toggles.forEach(toggle => {
            Events.on(toggle, 'click', () => {
                const setting = toggle.dataset.setting;
                const isActive = toggle.classList.contains('active');

                toggle.classList.toggle('active');
                this.settings[setting] = !isActive;

                gameStorage.saveSettings(this.settings);
                this.applySettings();
            });
        });

        const sliders = document.querySelectorAll('.range-slider');
        sliders.forEach(slider => {
            Events.on(slider, 'input', (e) => {
                const value = parseFloat(e.target.value);
                // Update settings based on slider (would need to identify which setting)
                // This is a simplified version
                gameStorage.saveSettings(this.settings);
            });
        });
    }

    /**
     * Show credits modal
     */
    showCreditsModal() {
        const content = `
            <div class="settings-modal">
                <div class="inventory-header">
                    <h2>Credits</h2>
                    <button class="close-btn" onclick="game.hideModal()">×</button>
                </div>
                <div style="text-align: center; padding: 2rem;">
                    <h3>The River</h3>
                    <p>A Cozy Adventure</p>
                    <br>
                    <p><strong>Game Design & Development</strong><br>Andrew Wooldridge</p>
                    <br>
                    <p><strong>Concept</strong><br>A retirement adventure celebrating wisdom, friendship, and the joy of cooking together.</p>
                    <br>
                    <p><strong>Special Thanks</strong><br>To all the cozy game developers who inspire us to create warm, welcoming experiences.</p>
                    <br>
                    <p style="font-style: italic;">Version 1.0.0</p>
                </div>
            </div>
        `;
        this.showModal(content);
    }

    /**
     * Handle keyboard shortcuts
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleKeyboard(event) {
        // ESC to close modals
        if (event.key === 'Escape') {
            this.hideModal();
        }

        // Game-specific shortcuts (when in game interface)
        if (this.currentScreen === 'game-interface') {
            switch (event.key.toLowerCase()) {
                case 'i':
                    this.showInventoryModal();
                    break;
                case 'c':
                    this.showCompanionsModal();
                    break;
                case 'r':
                    this.showRecipesModal();
                    break;
            }
        }
    }

    /**
     * Show error message
     * @param {string} message - Error message
     */
    showError(message) {
        // Simple error display - could be enhanced with a proper modal
        alert(message);
        console.error(message);
    }

    /**
     * Start cleaning activity
     */
    startCleaningActivity() {
        console.log('Starting cleaning activity...');
        // Placeholder for cleaning mini-game
    }

    /**
     * Show travel options
     */
    showTravelOptions() {
        console.log('Showing travel options...');
        // Placeholder for travel system
    }

    /**
     * Game loop update (called periodically)
     */
    update() {
        if (this.gameState && this.currentScreen === 'game-interface') {
            // Update play time
            this.gameState.stats.playTime += 1;

            // Auto-save periodically
            if (this.gameState.stats.playTime % 300 === 0) { // Every 5 minutes
                gameStorage.autoSave(this.gameState);
            }
        }
    }
}

// Initialize game when script loads
const game = new RiverGame();

// Make game instance globally available
window.game = game;

// Start game loop
setInterval(() => {
    if (game.isInitialized) {
        game.update();
    }
}, 1000); // Update every second

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RiverGame;
}
