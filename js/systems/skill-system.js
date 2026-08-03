// js/systems/skill-system.js

import { gameState, gameData } from '../core/game-state.js';
import { eventBus, EVENTS } from '../core/event-bus.js';
import { saveManager } from '../core/save-manager.js';
import { SKILL_TREE } from '../config/constants.js';
import { petSystem } from './pet-system.js';

// ==================== SKILL SYSTEM ====================
class SkillSystem {
    constructor() {
        this.skillTree = SKILL_TREE;
    }

    // Get all skills
    getAllSkills() {
        return this.skillTree;
    }

    // Get skill level
    getSkillLevel(skillKey) {
        if (skillKey === 'animalLovers') {
            return gameData.skills.animalLovers?.unlocked ? 1 : 0;
        }
        return gameData.skills[skillKey]?.level || 0;
    }

    // Get skill max level
    getSkillMaxLevel(skillKey) {
        return this.skillTree[skillKey]?.maxLevel || 0;
    }

    // Get skill next price
    getSkillNextPrice(skillKey) {
        const skill = this.skillTree[skillKey];
        if (!skill) return Infinity;

        const currentLevel = this.getSkillLevel(skillKey);
        if (currentLevel >= skill.maxLevel) return Infinity;

        if (skill.currency === 'diamonds') {
            return skill.basePrice;
        }

        return Math.floor(Number(skill.basePrice) * Math.pow(Number(skill.priceMultiplier || 1), currentLevel));
    }

    // Get skill bonus description
    getSkillBonus(skillKey) {
        const level = this.getSkillLevel(skillKey);
        switch (skillKey) {
            case 'lucky': return `+${level * 100}% Luck`;
            case 'cast': return `+${level * 5}% Double Chance`;
            case 'expert': return `+${level * 10} EXP Gamepass`;
            case 'penawar': return `+${level * 10}% Harga Jual`;
            case 'animalLovers': return level > 0 ? '2 Pet Slots' : '1 Pet Slot';
            default: return '';
        }
    }

    // Check if can upgrade
    canUpgrade(skillKey) {
        const skill = this.skillTree[skillKey];
        if (!skill) return false;

        const currentLevel = this.getSkillLevel(skillKey);
        if (currentLevel >= skill.maxLevel) return false;

        const price = this.getSkillNextPrice(skillKey);
        if (skill.currency === 'diamonds') {
            return Number(gameData.diamonds) >= price;
        }
        return Number(gameData.coins) >= price;
    }

    // Upgrade skill
    upgradeSkill(skillKey) {
        const skill = this.skillTree[skillKey];
        if (!skill) {
            eventBus.emit(EVENTS.NOTIFICATION, { 
                message: '❌ Skill tidak ditemukan!', 
                type: 'error' 
            });
            return false;
        }

        const currentLevel = this.getSkillLevel(skillKey);
        if (currentLevel >= skill.maxLevel) {
            eventBus.emit(EVENTS.NOTIFICATION, { 
                message: '✨ Skill sudah MAX LEVEL!', 
                type: 'warning' 
            });
            return false;
        }

        const price = this.getSkillNextPrice(skillKey);
        const currency = skill.currency || 'coins';

        if (currency === 'diamonds') {
            if (Number(gameData.diamonds) < price) {
                eventBus.emit(EVENTS.NOTIFICATION, { 
                    message: '❌ Diamond tidak cukup!', 
                    type: 'error' 
                });
                return false;
            }
            gameData.diamonds = Number(gameData.diamonds) - price;
        } else {
            if (Number(gameData.coins) < price) {
                eventBus.emit(EVENTS.NOTIFICATION, { 
                    message: '❌ Koin tidak cukup!', 
                    type: 'error' 
                });
                return false;
            }
            gameData.coins = Number(gameData.coins) - price;
        }

        // Apply upgrade
        if (skillKey === 'animalLovers') {
            gameData.skills.animalLovers = { unlocked: true };
            // Fix active pets if needed
            if (!Array.isArray(gameData.pets.active)) {
                if (gameData.pets.active) {
                    gameData.pets.active = [gameData.pets.active];
                } else {
                    gameData.pets.active = [];
                }
            }
            eventBus.emit(EVENTS.NOTIFICATION, { 
                message: '✅ Animal Lovers unlocked! Sekarang bisa pakai 2 pet!', 
                type: 'success' 
            });
        } else {
            if (!gameData.skills[skillKey]) {
                gameData.skills[skillKey] = { level: 0, bonus: 0 };
            }
            gameData.skills[skillKey].level = (gameData.skills[skillKey].level || 0) + 1;
            
            const skillNames = {
                lucky: 'Lucky',
                cast: 'Cast',
                expert: 'Expert',
                penawar: 'Penawar'
            };
            eventBus.emit(EVENTS.NOTIFICATION, { 
                message: `✅ ${skillNames[skillKey] || skillKey} Skill naik ke level ${gameData.skills[skillKey].level}!`, 
                type: 'success' 
            });
        }

        saveManager.forceSave();
        eventBus.emit(EVENTS.STATE_CHANGED, { key: 'skills', value: gameData.skills });
        return true;
    }

    // Get total luck from skills
    getLuckBonus() {
        return (gameData.skills.lucky?.level || 0) * 100;
    }

    // Get total cast bonus
    getCastBonus() {
        return (gameData.skills.cast?.level || 0) * 5;
    }

    // Get total expert bonus
    getExpertBonus() {
        return (gameData.skills.expert?.level || 0) * 10;
    }

    // Get total penawar bonus
    getPenawarBonus() {
        return 1 + ((gameData.skills.penawar?.level || 0) * 0.1);
    }

    // Reset skills (untuk testing)
    reset() {
        gameData.skills = {
            lucky: { level: 0, bonus: 0 },
            cast: { level: 0, bonus: 0 },
            expert: { level: 0, bonus: 0 },
            penawar: { level: 0, bonus: 0 },
            animalLovers: { unlocked: false }
        };
        saveManager.forceSave();
    }
}

// Singleton instance
export const skillSystem = new SkillSystem();

// Export untuk kompatibilitas
export const loadSkillTree = () => skillSystem.getAllSkills();
export const upgradeSkill = (key) => skillSystem.upgradeSkill(key);
export const getSkillLevel = (key) => skillSystem.getSkillLevel(key);
export const getPenawarBonus = () => skillSystem.getPenawarBonus();