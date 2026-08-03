// js/ui/gamepass-ui.js

import { gameState, gameData } from '../core/game-state.js';
import { uiManager } from './ui-manager.js';
import { notification } from './notification.js';
import { saveManager } from '../core/save-manager.js';
import { GAMEPASS_LEVELS } from '../config/constants.js';
import { RODS, BAITS, POTIONS } from '../data/equipment.js';
import { PETS } from '../data/pets.js';
import { getAllFishes } from '../data/fishing-spots.js';

// ==================== GAMEPASS UI ====================
class GamepassUI {
    constructor() {
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        this.initialized = true;
        console.log('✅ Gamepass UI initialized');
    }

    loadGamepass() {
        const gamepassContainer = document.getElementById('gamepass-container');
        if (!gamepassContainer) return;

        if (!gameData.gamepass.owned) {
            gamepassContainer.innerHTML = `
                <div style="text-align: center; padding: 30px; background: rgba(255,255,255,0.05); border-radius: 10px; margin: 10px;">
                    <div style="font-size: 4rem; margin-bottom: 20px;">🎟️</div>
                    <h2 style="color: #FFD700; margin-bottom: 20px;">GAMEPASS PREMIUM</h2>
                    <p style="color: #ccc; margin-bottom: 30px;">Buka 40 level eksklusif dengan hadiah spesial!</p>
                    <p style="color: #00ffff; font-size: 1.5rem; margin-bottom: 20px;">Harga: 1000 💎 Diamond</p>
                    <button onclick="window.buyGamepass()" style="padding: 12px 30px; background: #4CAF50; border: none; border-radius: 25px; color: white; font-weight: bold; font-size: 1.2rem; cursor: pointer;">
                        🚀 BELI GAMEPASS
                    </button>
                </div>
            `;
            return;
        }

        const currentLevel = gameData.gamepass.level;
        const currentExp = Number(gameData.gamepass.exp);
        const currentLevelReq = GAMEPASS_LEVELS.find(l => l.level === currentLevel)?.expRequired || 0;
        const progressPercent = currentLevelReq > 0 ? (currentExp / currentLevelReq) * 100 : 0;

        console.log('🎟️ Gamepass Progress - Level:', currentLevel, 'Exp:', currentExp, 'Req:', currentLevelReq);

        let levelsHTML = '';
        for (let i = 1; i <= 40; i++) {
            const levelData = GAMEPASS_LEVELS.find(l => l.level === i);
            if (!levelData) continue;
            
            const isUnlocked = i <= currentLevel;
            const isCurrent = i === currentLevel;
            const rewardClaimed = gameData.gamepass.rewardsClaimed.includes(i);
            
            let rewardText = '';
            if (levelData.rewards.coins) rewardText += `${levelData.rewards.coins} 🪙 `;
            if (levelData.rewards.diamonds) rewardText += `${levelData.rewards.diamonds} 💎 `;
            if (levelData.rewards.bait) rewardText += `${levelData.rewards.bait} `;
            if (levelData.rewards.rod) rewardText += `${levelData.rewards.rod} `;
            if (levelData.rewards.potion) rewardText += `${levelData.rewards.potion} `;
            if (levelData.rewards.fish) rewardText += `${levelData.rewards.fish} `;
            if (levelData.rewards.pet) rewardText += `${levelData.rewards.pet} `;
            
            levelsHTML += `
                <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 8px; margin: 5px; display: flex; align-items: center; gap: 15px; opacity: ${isUnlocked ? 1 : 0.5};">
                    <div style="font-size: 2rem; min-width: 40px; text-align: center;">${isUnlocked ? (rewardClaimed ? '✅' : '🎁') : '🔒'}</div>
                    <div style="flex: 1;">
                        <h4 style="color: #FFD700; margin-bottom: 3px;">Level ${i}</h4>
                        <p style="color: #ccc; font-size: 0.9rem;">Exp: ${levelData.expRequired}</p>
                        <p style="color: #4CAF50; font-size: 0.9rem;">Hadiah: ${rewardText}</p>
                    </div>
                    ${isCurrent ? '<div style="color: #00ffff;">▶ CURRENT</div>' : ''}
                    ${isUnlocked && !rewardClaimed && i <= currentLevel ? 
                        `<button onclick="window.claimGamepassReward(${i})" style="background: #4CAF50; border: none; border-radius: 4px; padding: 5px 10px; color: white; cursor: pointer;">AMBIL</button>` : ''}
                </div>
            `;
        }

        gamepassContainer.innerHTML = `
            <div style="background: rgba(255,255,255,0.05); border-radius: 10px; padding: 20px; margin: 10px;">
                <h2 style="color: #FFD700; text-align: center; margin-bottom: 20px;">🎟️ GAMEPASS PROGRESS (Level 1-40)</h2>
                
                <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span style="color: white;">Level ${currentLevel}/40</span>
                        <span style="color: #4CAF50;">${currentExp}/${currentLevelReq} EXP</span>
                    </div>
                    <div style="width: 100%; height: 15px; background: rgba(255,255,255,0.2); border-radius: 8px; overflow: hidden;">
                        <div style="width: ${Math.min(progressPercent, 100)}%; height: 100%; background: linear-gradient(to right, #4CAF50, #8BC34A);"></div>
                    </div>
                </div>
                
                <div style="max-height: 400px; overflow-y: auto; padding: 10px;">
                    ${levelsHTML}
                </div>
            </div>
        `;
    }

    buyGamepass() {
        if (gameData.gamepass.owned) {
            notification.warning('⚠️ Kamu sudah memiliki Gamepass!');
            return;
        }

        if (Number(gameData.diamonds) < 1000) {
            notification.error('❌ Butuh 1000 💎 diamond untuk membeli Gamepass!');
            return;
        }

        gameData.diamonds = Number(gameData.diamonds) - 1000;
        gameData.gamepass.owned = true;
        gameData.gamepass.level = 1;
        gameData.gamepass.exp = 0;
        gameData.gamepass.rewardsClaimed = [];

        saveManager.forceSave();
        notification.success('🎉 SELAMAT! Kamu sekarang memiliki Gamepass! Level 1');
        uiManager.updateTopBar();
        this.loadGamepass();
    }

    claimGamepassReward(level) {
        if (gameData.gamepass.rewardsClaimed.includes(level)) {
            notification.warning('⚠️ Hadiah sudah diambil!');
            return;
        }

        const levelData = GAMEPASS_LEVELS.find(l => l.level === level);
        if (!levelData) return;

        this.giveGamepassReward(levelData.rewards);
        gameData.gamepass.rewardsClaimed.push(level);

        saveManager.forceSave();
        notification.success(`✅ Hadiah Level ${level} berhasil diambil!`);
        this.loadGamepass();
        uiManager.updateTopBar();
    }

    giveGamepassReward(rewards) {
        if (rewards.coins) gameData.coins = Number(gameData.coins) + Number(rewards.coins);
        if (rewards.diamonds) gameData.diamonds = Number(gameData.diamonds) + Number(rewards.diamonds);

        if (rewards.rod) {
            const rodToGive = RODS.find(r => r.name === rewards.rod);
            if (rodToGive) {
                rodToGive.owned = true;
                notification.success(`🎣 Mendapatkan rod: ${rodToGive.name}!`);
            }
        }

        if (rewards.bait) {
            const baitToGive = BAITS.find(b => b.name === rewards.bait);
            if (baitToGive) {
                baitToGive.owned = true;
                notification.success(`🪱 Mendapatkan umpan: ${baitToGive.name}!`);
            }
        }

        if (rewards.potion) {
            const potionToGive = POTIONS.find(p => p.name === rewards.potion);
            if (potionToGive) {
                gameData.activePotions.push({ ...potionToGive, startTime: Date.now() });
                notification.success(`🧪 Mendapatkan potion: ${potionToGive.name}!`);
            }
        }

        if (rewards.fish) {
            const allFishes = getAllFishes();
            const fishToGive = allFishes.find(f => f.name === rewards.fish);
            if (fishToGive) {
                gameData.backpack.push({ ...fishToGive, catchTime: Date.now(), perfectCatch: false, fromGamepass: true });
                notification.success(`🐟 Mendapatkan ikan: ${fishToGive.name}!`);
            }
        }

        if (rewards.pet) {
            const petToGive = PETS.find(p => p.name === rewards.pet);
            if (petToGive && !gameData.pets.owned.includes(petToGive.id)) {
                gameData.pets.owned.push(petToGive.id);
                notification.success(`🐕 Mendapatkan pet: ${petToGive.name}!`);
            }
        }

        saveManager.forceSave();
    }
}

export const gamepassUI = new GamepassUI();

window.buyGamepass = () => gamepassUI.buyGamepass();
window.claimGamepassReward = (level) => gamepassUI.claimGamepassReward(level);