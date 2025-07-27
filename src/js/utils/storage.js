/**
 * Storage Utility - The River Game
 * Handles save/load functionality using LocalStorage
 */

class GameStorage {
    constructor() {
        this.storageKey = 'the-river-game-save';
        this.settingsKey = 'the-river-game-settings';
        this.defaultSettings = {
            masterVolume: 0.8,
            musicVolume: 0.7,
            sfxVolume: 0.8,
            autoSave: true,
            reducedMotion: false,
            highContrast: false,
            textSize: 'normal',
            language: 'en'
        };
    }

    /**
     * Save game state to localStorage
     * @param {Object} gameState - Current game state
     * @returns {boolean} - Success status
     */
    saveGame(gameState) {
        try {
            const saveData = {
                version: '1.0.0',
                timestamp: Date.now(),
                gameState: gameState
            };

            localStorage.setItem(this.storageKey, JSON.stringify(saveData));
            console.log('Game saved successfully');
            return true;
        } catch (error) {
            console.error('Failed to save game:', error);
            return false;
        }
    }

    /**
     * Load game state from localStorage
     * @returns {Object|null} - Loaded game state or null if no save exists
     */
    loadGame() {
        try {
            const saveData = localStorage.getItem(this.storageKey);
            if (!saveData) {
                console.log('No save data found');
                return null;
            }

            const parsed = JSON.parse(saveData);

            // Version compatibility check
            if (parsed.version !== '1.0.0') {
                console.warn('Save data version mismatch, attempting migration');
                // Future: Add migration logic here
            }

            console.log('Game loaded successfully');
            return parsed.gameState;
        } catch (error) {
            console.error('Failed to load game:', error);
            return null;
        }
    }

    /**
     * Check if a save game exists
     * @returns {boolean} - True if save exists
     */
    hasSaveGame() {
        return localStorage.getItem(this.storageKey) !== null;
    }

    /**
     * Delete save game
     * @returns {boolean} - Success status
     */
    deleteSave() {
        try {
            localStorage.removeItem(this.storageKey);
            console.log('Save game deleted');
            return true;
        } catch (error) {
            console.error('Failed to delete save:', error);
            return false;
        }
    }

    /**
     * Save settings to localStorage
     * @param {Object} settings - Settings object
     * @returns {boolean} - Success status
     */
    saveSettings(settings) {
        try {
            const settingsData = {
                ...this.defaultSettings,
                ...settings,
                timestamp: Date.now()
            };

            localStorage.setItem(this.settingsKey, JSON.stringify(settingsData));
            console.log('Settings saved successfully');
            return true;
        } catch (error) {
            console.error('Failed to save settings:', error);
            return false;
        }
    }

    /**
     * Load settings from localStorage
     * @returns {Object} - Settings object (defaults if no saved settings)
     */
    loadSettings() {
        try {
            const settingsData = localStorage.getItem(this.settingsKey);
            if (!settingsData) {
                console.log('No settings found, using defaults');
                return { ...this.defaultSettings };
            }

            const parsed = JSON.parse(settingsData);
            const settings = {
                ...this.defaultSettings,
                ...parsed
            };

            console.log('Settings loaded successfully');
            return settings;
        } catch (error) {
            console.error('Failed to load settings:', error);
            return { ...this.defaultSettings };
        }
    }

    /**
     * Export save data as JSON string
     * @returns {string|null} - JSON string or null if no save exists
     */
    exportSave() {
        try {
            const saveData = localStorage.getItem(this.storageKey);
            if (!saveData) {
                return null;
            }

            return saveData;
        } catch (error) {
            console.error('Failed to export save:', error);
            return null;
        }
    }

    /**
     * Import save data from JSON string
     * @param {string} saveDataString - JSON string containing save data
     * @returns {boolean} - Success status
     */
    importSave(saveDataString) {
        try {
            // Validate JSON
            const parsed = JSON.parse(saveDataString);

            // Basic validation
            if (!parsed.gameState || !parsed.version) {
                throw new Error('Invalid save data format');
            }

            localStorage.setItem(this.storageKey, saveDataString);
            console.log('Save data imported successfully');
            return true;
        } catch (error) {
            console.error('Failed to import save:', error);
            return false;
        }
    }

    /**
     * Get storage usage information
     * @returns {Object} - Storage usage stats
     */
    getStorageInfo() {
        try {
            const saveSize = localStorage.getItem(this.storageKey)?.length || 0;
            const settingsSize = localStorage.getItem(this.settingsKey)?.length || 0;
            const totalSize = saveSize + settingsSize;

            return {
                saveSize: saveSize,
                settingsSize: settingsSize,
                totalSize: totalSize,
                saveSizeKB: Math.round(saveSize / 1024 * 100) / 100,
                totalSizeKB: Math.round(totalSize / 1024 * 100) / 100
            };
        } catch (error) {
            console.error('Failed to get storage info:', error);
            return {
                saveSize: 0,
                settingsSize: 0,
                totalSize: 0,
                saveSizeKB: 0,
                totalSizeKB: 0
            };
        }
    }

    /**
     * Clear all game data (save and settings)
     * @returns {boolean} - Success status
     */
    clearAllData() {
        try {
            localStorage.removeItem(this.storageKey);
            localStorage.removeItem(this.settingsKey);
            console.log('All game data cleared');
            return true;
        } catch (error) {
            console.error('Failed to clear all data:', error);
            return false;
        }
    }

    /**
     * Auto-save functionality
     * @param {Object} gameState - Current game state
     * @param {boolean} force - Force save even if auto-save is disabled
     */
    autoSave(gameState, force = false) {
        const settings = this.loadSettings();

        if (settings.autoSave || force) {
            this.saveGame(gameState);
        }
    }

    /**
     * Create a backup of current save
     * @returns {boolean} - Success status
     */
    createBackup() {
        try {
            const saveData = localStorage.getItem(this.storageKey);
            if (!saveData) {
                return false;
            }

            const backupKey = `${this.storageKey}-backup-${Date.now()}`;
            localStorage.setItem(backupKey, saveData);

            // Keep only the 3 most recent backups
            this.cleanupBackups();

            console.log('Backup created successfully');
            return true;
        } catch (error) {
            console.error('Failed to create backup:', error);
            return false;
        }
    }

    /**
     * Clean up old backups, keeping only the 3 most recent
     */
    cleanupBackups() {
        try {
            const backupKeys = [];

            // Find all backup keys
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(`${this.storageKey}-backup-`)) {
                    const timestamp = parseInt(key.split('-').pop());
                    backupKeys.push({ key, timestamp });
                }
            }

            // Sort by timestamp (newest first) and remove old ones
            backupKeys.sort((a, b) => b.timestamp - a.timestamp);

            for (let i = 3; i < backupKeys.length; i++) {
                localStorage.removeItem(backupKeys[i].key);
            }
        } catch (error) {
            console.error('Failed to cleanup backups:', error);
        }
    }

    /**
     * Get list of available backups
     * @returns {Array} - Array of backup info objects
     */
    getBackups() {
        try {
            const backups = [];

            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(`${this.storageKey}-backup-`)) {
                    const timestamp = parseInt(key.split('-').pop());
                    const date = new Date(timestamp);

                    backups.push({
                        key: key,
                        timestamp: timestamp,
                        date: date.toLocaleString(),
                        size: localStorage.getItem(key).length
                    });
                }
            }

            return backups.sort((a, b) => b.timestamp - a.timestamp);
        } catch (error) {
            console.error('Failed to get backups:', error);
            return [];
        }
    }

    /**
     * Restore from backup
     * @param {string} backupKey - Key of the backup to restore
     * @returns {boolean} - Success status
     */
    restoreBackup(backupKey) {
        try {
            const backupData = localStorage.getItem(backupKey);
            if (!backupData) {
                return false;
            }

            localStorage.setItem(this.storageKey, backupData);
            console.log('Backup restored successfully');
            return true;
        } catch (error) {
            console.error('Failed to restore backup:', error);
            return false;
        }
    }
}

// Create global instance
window.gameStorage = new GameStorage();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameStorage;
}
