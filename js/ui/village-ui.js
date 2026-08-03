// js/ui/village-ui.js

import { gameData } from '../core/game-state.js';

// ==================== VILLAGE UI ====================
class VillageUI {
    constructor() {
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        this.initialized = true;
        console.log('✅ Village UI initialized');
    }

    loadVillage() {
        const assistantCount = document.getElementById('assistant-count');
        const hutLevel = document.getElementById('hut-level');

        if (assistantCount) assistantCount.textContent = gameData.village.assistants;
        if (hutLevel) hutLevel.textContent = gameData.village.hutLevel;
    }

    // Get village upgrades (used by shop)
    getVillageUpgrades() {
        return [
            { 
                type: 'hut', 
                name: 'Fishing Hut Upgrade', 
                desc: `Level ${gameData.village.hutLevel + 1} (+10% Luck)`, 
                price: gameData.village.hutLevel * 1000 + 1000, 
                owned: false, 
                emoji: '🏠' 
            },
            { 
                type: 'assistant', 
                name: 'Hire Assistant', 
                desc: 'Auto-fish every 30 seconds', 
                price: 2000, 
                owned: gameData.village.assistants >= 3, 
                emoji: '👥' 
            }
        ];
    }
}

// Singleton instance
export const villageUI = new VillageUI();