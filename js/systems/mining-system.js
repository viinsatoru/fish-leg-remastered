// js/systems/mining-system.js

import { gameState, gameData } from '../core/game-state.js';
import { eventBus, EVENTS } from '../core/event-bus.js';
import { saveManager } from '../core/save-manager.js';
import { MINING_TOOLS, MINING_SKILL_TREE } from '../config/constants.js';

// ==================== MINING SYSTEM ====================
class MiningSystem {
    constructor() {
        this.isMining = false;
        this.currentPullHandler = null;
    }

    // ==================== CHECK UNLOCK (FIXED) ====================
    isUnlocked() {
        console.log('🔍 MiningSystem.isUnlocked() called');
        const hasHelm = gameData.depthGear.minerHelm === true;
        const hasFlashlight = gameData.specialItems.flashlight === true;
        
        console.log('Has Helm:', hasHelm);
        console.log('Has Flashlight:', hasFlashlight);
        
        gameData.mining.unlocked = hasHelm && hasFlashlight;
        console.log('Mining unlocked:', gameData.mining.unlocked);
        
        return gameData.mining.unlocked;
    }

    // Get current tool
    getCurrentTool() {
        return MINING_TOOLS.find(t => t.id === gameData.mining.currentTool) || MINING_TOOLS[0];
    }

    // Calculate mining luck
    calculateLuck() {
        const currentTool = this.getCurrentTool();
        const luckyLevel = gameData.mining.skill.lucky.level || 0;
        return currentTool.luck * (1 + luckyLevel);
    }

    // Start mining
    startMining() {
        console.log('⛏️ MiningSystem.startMining() called');
        
        if (this.isMining) {
            console.log('⏳ Already mining...');
            return;
        }
        
        if (!this.isUnlocked()) {
            console.log('❌ Mining not unlocked!');
            eventBus.emit(EVENTS.NOTIFICATION, { message: '🔒 Mining belum dibuka!', type: 'error' });
            return;
        }

        this.isMining = true;
        eventBus.emit(EVENTS.MINING_STARTED);
        console.log('✅ Mining started');

        const hasPerfectCut = gameData.mining.skill.perfectCut.unlocked;

        // Simulate mining
        setTimeout(() => {
            if (!this.isMining) return;
            const perfectCatch = hasPerfectCut ? true : false;
            const result = this.finishMining(perfectCatch);
            this.isMining = false;
            eventBus.emit(EVENTS.MINING_FINISHED, result);
            console.log('⛏️ Mining finished:', result);
        }, 1500);

        return true;
    }

    // Finish mining
    finishMining(perfectCatch = false) {
        const currentTool = this.getCurrentTool();
        const luckMultiplier = this.calculateLuck();

        const random = Math.random() * 100;
        let itemType = '';
        let amount = 0;

        if (random < 50) {
            itemType = 'coin';
            amount = Math.floor((Math.random() * 400 + 100) * luckMultiplier);
            if (perfectCatch) amount *= 2;
        } else if (random < 85) {
            itemType = 'rock';
            amount = Math.floor((Math.random() * 9 + 1) * luckMultiplier);
            if (perfectCatch) amount *= 2;
        } else {
            itemType = 'diamond';
            amount = Math.floor((Math.random() * 4 + 1) * luckMultiplier);
            if (perfectCatch) amount *= 2;
        }

        // Update stats
        gameData.mining.stats.totalMines = Number(gameData.mining.stats.totalMines) + 1;
        if (perfectCatch) {
            gameData.mining.stats.perfectCount = Number(gameData.mining.stats.perfectCount) + 1;
            eventBus.emit(EVENTS.MINING_PERFECT, { amount, itemType });
        }

        // Add resources
        if (itemType === 'coin') {
            gameData.coins = Number(gameData.coins) + amount;
            gameData.mining.stats.totalCoins = Number(gameData.mining.stats.totalCoins) + amount;
        } else if (itemType === 'rock') {
            gameData.mining.rocks = Number(gameData.mining.rocks) + amount;
            gameData.mining.stats.totalRocks = Number(gameData.mining.stats.totalRocks) + amount;
        } else if (itemType === 'diamond') {
            gameData.diamonds = Number(gameData.diamonds) + amount;
            gameData.mining.stats.totalDiamonds = Number(gameData.mining.stats.totalDiamonds) + amount;
        }

        saveManager.forceSave();
        return { itemType, amount, perfectCatch };
    }

    // Buy mining tool
    buyTool(toolId) {
        const tool = MINING_TOOLS.find(t => t.id === toolId);
        if (!tool) return false;

        if (tool.owned) {
            eventBus.emit(EVENTS.NOTIFICATION, { message: 'Sudah memiliki tool ini', type: 'warning' });
            return false;
        }

        if (Number(gameData.coins) < Number(tool.price)) {
            eventBus.emit(EVENTS.NOTIFICATION, { message: '❌ Koin tidak cukup!', type: 'error' });
            return false;
        }

        gameData.coins = Number(gameData.coins) - Number(tool.price);
        tool.owned = true;
        saveManager.forceSave();
        eventBus.emit(EVENTS.ITEM_BOUGHT, { type: 'miningTool', tool });
        return true;
    }

    // Equip mining tool
    equipTool(toolId) {
        const tool = MINING_TOOLS.find(t => t.id === toolId);
        if (!tool || !tool.owned) return false;

        gameData.mining.currentTool = toolId;
        saveManager.forceSave();
        eventBus.emit(EVENTS.ITEM_EQUIPPED, { type: 'miningTool', tool });
        return true;
    }

    // Upgrade mining skill
    upgradeSkill(skillKey) {
        if (skillKey === 'perfectCut') {
            if (gameData.mining.skill.perfectCut.unlocked) {
                eventBus.emit(EVENTS.NOTIFICATION, { message: 'Sudah unlocked!', type: 'warning' });
                return false;
            }
            gameData.mining.skill.perfectCut.unlocked = true;
            saveManager.forceSave();
            eventBus.emit(EVENTS.NOTIFICATION, { message: '✅ Perfect Cut unlocked!', type: 'success' });
            return true;
        }

        if (skillKey === 'lucky') {
            const currentLevel = gameData.mining.skill.lucky.level || 0;
            if (currentLevel >= MINING_SKILL_TREE.lucky.maxLevel) {
                eventBus.emit(EVENTS.NOTIFICATION, { message: 'Max level!', type: 'warning' });
                return false;
            }

            const nextPrice = Math.floor(MINING_SKILL_TREE.lucky.basePrice *
                Math.pow(MINING_SKILL_TREE.lucky.priceMultiplier || 2, currentLevel));

            if (Number(gameData.coins) < nextPrice) {
                eventBus.emit(EVENTS.NOTIFICATION, { message: '❌ Koin tidak cukup!', type: 'error' });
                return false;
            }

            gameData.coins = Number(gameData.coins) - nextPrice;
            gameData.mining.skill.lucky.level = currentLevel + 1;
            saveManager.forceSave();
            eventBus.emit(EVENTS.NOTIFICATION, { 
                message: `✅ Lucky Mining Skill naik ke level ${gameData.mining.skill.lucky.level}!`, 
                type: 'success' 
            });
            return true;
        }

        return false;
    }

    // Exchange mining resources
    exchangeResources(recipe) {
        const input = recipe.input;
        
        if (input.type === 'coin') {
            if (Number(gameData.coins) < input.quantity) {
                eventBus.emit(EVENTS.NOTIFICATION, { message: '❌ Coin tidak cukup!', type: 'error' });
                return false;
            }
            gameData.coins = Number(gameData.coins) - input.quantity;
        } else if (input.type === 'rock') {
            if ((gameData.mining.rocks || 0) < input.quantity) {
                eventBus.emit(EVENTS.NOTIFICATION, { message: '❌ Rock tidak cukup!', type: 'error' });
                return false;
            }
            gameData.mining.rocks = Number(gameData.mining.rocks) - input.quantity;
        } else {
            return false;
        }

        gameData.diamonds = Number(gameData.diamonds) + recipe.output.quantity;
        saveManager.forceSave();
        
        eventBus.emit(EVENTS.NOTIFICATION, { 
            message: `✅ Berhasil menukar! Mendapatkan ${recipe.output.quantity} Diamond!`, 
            type: 'success' 
        });
        return true;
    }

    // Get mining stats
    getStats() {
        return {
            totalMines: gameData.mining.stats.totalMines || 0,
            totalCoins: gameData.mining.stats.totalCoins || 0,
            totalRocks: gameData.mining.stats.totalRocks || 0,
            totalDiamonds: gameData.mining.stats.totalDiamonds || 0,
            perfectCount: gameData.mining.stats.perfectCount || 0,
            rocks: gameData.mining.rocks || 0
        };
    }

    reset() {
        gameData.mining = {
            unlocked: false,
            currentTool: 0,
            rocks: 0,
            isMining: false,
            currentPullHandler: null,
            skill: {
                perfectCut: { unlocked: false },
                lucky: { level: 0, bonus: 0 }
            },
            stats: {
                totalMines: 0,
                totalCoins: 0,
                totalRocks: 0,
                totalDiamonds: 0,
                perfectCount: 0
            }
        };
        saveManager.forceSave();
    }
}

export const miningSystem = new MiningSystem();

export const startMining = () => miningSystem.startMining();
export const checkMiningUnlock = () => miningSystem.isUnlocked();
export const buyMiningTool = (id) => miningSystem.buyTool(id);
export const equipMiningTool = (id) => miningSystem.equipTool(id);
export const upgradeMiningSkill = (key) => miningSystem.upgradeSkill(key);