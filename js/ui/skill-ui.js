// js/ui/skill-ui.js

import { gameData } from '../core/game-state.js';
import { uiManager } from './ui-manager.js';
import { notification } from './notification.js';
import { saveManager } from '../core/save-manager.js';
import { SKILL_TREE } from '../config/constants.js';

export class SkillUI {
    constructor() {
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        this.initialized = true;
        console.log('✅ Skill UI initialized');
    }

    loadSkillTree() {
        const container = document.getElementById('skill-tree');
        if (!container) {
            console.warn('❌ skill-tree not found');
            return;
        }

        container.innerHTML = '';
        container.style.cssText = 'display: flex; flex-wrap: wrap; justify-content: center; gap: 16px;';

        if (!SKILL_TREE || Object.keys(SKILL_TREE).length === 0) {
            container.innerHTML = '<p class="empty-message">Belum ada skill tersedia</p>';
            return;
        }

        Object.keys(SKILL_TREE).forEach(key => {
            const card = this.createSkillCard(key, SKILL_TREE[key]);
            container.appendChild(card);
        });
    }

    createSkillCard(skillKey, skillData) {
        let currentLevel, isUnlocked;

        if (skillKey === 'animalLovers') {
            isUnlocked = gameData.skills.animalLovers?.unlocked || false;
            currentLevel = isUnlocked ? 1 : 0;
        } else {
            currentLevel = gameData.skills[skillKey]?.level || 0;
        }

        const maxLevel = skillData.maxLevel;
        const nextPrice = skillData.currency === 'diamonds' ? 
            skillData.basePrice : 
            Math.floor(Number(skillData.basePrice) * Math.pow(Number(skillData.priceMultiplier || 1), currentLevel));

        const canUpgrade = currentLevel < maxLevel && (
            skillData.currency === 'diamonds' ? 
                Number(gameData.diamonds) >= nextPrice : 
                Number(gameData.coins) >= nextPrice
        );

        let bonusText = '';
        if (skillKey === 'lucky') bonusText = `+${currentLevel * 100}% Luck`;
        else if (skillKey === 'cast') bonusText = `+${currentLevel * 5}% Double Chance`;
        else if (skillKey === 'expert') bonusText = `+${currentLevel * 10} EXP Gamepass`;
        else if (skillKey === 'penawar') bonusText = `+${currentLevel * 10}% Harga Jual`;
        else if (skillKey === 'animalLovers') bonusText = isUnlocked ? '2 Pet Slots' : '1 Pet Slot';

        const card = document.createElement('div');
        card.className = 'skill-card';
        card.style.cssText = 'text-align: center; background: rgba(255,255,255,0.05); padding: 20px; border-radius: 10px; width: 250px;';

        card.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 10px;">${skillData.emoji}</div>
            <h3 style="color: #FFD700; margin-bottom: 5px;">${skillData.name}</h3>
            <p style="color: #ccc; font-size: 0.9rem; margin-bottom: 15px;">${skillData.description}</p>
            
            <div style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 8px; margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span style="color: #fff;">Level ${currentLevel}/${maxLevel}</span>
                    <span style="color: #4CAF50;">${bonusText}</span>
                </div>
                ${skillKey !== 'animalLovers' ? `
                <div style="width: 100%; height: 8px; background: rgba(255,255,255,0.2); border-radius: 4px; overflow: hidden;">
                    <div style="width: ${(currentLevel/maxLevel)*100}%; height: 100%; background: linear-gradient(to right, #4CAF50, #8BC34A);"></div>
                </div>
                ` : ''}
            </div>
            
            ${currentLevel < maxLevel ? `
                <p style="color: ${skillData.currency === 'diamonds' ? '#00ffff' : '#FFD700'}; margin-bottom: 10px;">
                    Harga: ${nextPrice} ${skillData.currency === 'diamonds' ? '💎' : '🪙'}
                </p>
                <button class="upgrade-skill-btn" ${!canUpgrade ? 'disabled' : ''}
                        style="width: 100%; padding: 8px; background: ${canUpgrade ? '#4CAF50' : '#666'}; border: none; border-radius: 6px; color: white; cursor: ${canUpgrade ? 'pointer' : 'not-allowed'};">
                    ${canUpgrade ? '⬆️ UPGRADE' : '❌ TIDAK CUKUP'}
                </button>
            ` : '<p style="color: gold;">✨ MAX LEVEL</p>'}
        `;

        const upgradeBtn = card.querySelector('.upgrade-skill-btn');
        if (upgradeBtn && canUpgrade) {
            upgradeBtn.addEventListener('click', () => this.upgradeSkill(skillKey, nextPrice, skillData.currency));
        }

        return card;
    }

    upgradeSkill(skillKey, price, currency = 'coins') {
        if (currency === 'diamonds') {
            if (Number(gameData.diamonds) < price) {
                notification.error('❌ Diamond tidak cukup!');
                return;
            }
            gameData.diamonds = Number(gameData.diamonds) - price;
        } else {
            if (Number(gameData.coins) < price) {
                notification.error('❌ Koin tidak cukup!');
                return;
            }
            gameData.coins = Number(gameData.coins) - price;
        }

        if (skillKey === 'animalLovers') {
            gameData.skills.animalLovers = { unlocked: true };
            notification.success('✅ Animal Lovers unlocked! Sekarang bisa pakai 2 pet!');
            
            if (!Array.isArray(gameData.pets.active)) {
                if (gameData.pets.active) {
                    gameData.pets.active = [gameData.pets.active];
                } else {
                    gameData.pets.active = [];
                }
            }
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
            notification.success(`✅ ${skillNames[skillKey] || skillKey} Skill naik ke level ${gameData.skills[skillKey].level}!`);
        }

        saveManager.forceSave();
        this.loadSkillTree();
        uiManager.updateLuckDisplay();
    }
}

export const skillUI = new SkillUI();