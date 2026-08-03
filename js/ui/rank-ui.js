// js/ui/rank-ui.js

import { gameState, gameData } from '../core/game-state.js';
import { uiManager } from './ui-manager.js';
import { modalManager } from './modals.js';
import { notification } from './notification.js';
import { saveManager } from '../core/save-manager.js';
import { rankSystem } from '../systems/rank-system.js';
import { RANK_DATA, LEADERBOARD_NPCS } from '../config/constants.js';

// ==================== RANK UI ====================
class RankUI {
    constructor() {
        this.initialized = false;
        this.currentOpponent = null;
    }

    init() {
        if (this.initialized) return;

        // Setup rank modal close
        const rankModal = document.getElementById('rank-modal');
        if (rankModal) {
            const closeBtn = rankModal.querySelector('.close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    modalManager.close('rank-modal');
                });
            }
        }

        this.initialized = true;
        console.log('✅ Rank UI initialized');
    }

    loadRankBattle() {
        const rankContainer = document.getElementById('rank-battle');
        if (!rankContainer) return;

        const currentRank = gameData.rank.current;
        const rankInfo = RANK_DATA[currentRank];

        rankSystem.updateLeaderboardPosition();

        rankContainer.innerHTML = `
            <div style="background: rgba(255,255,255,0.05); border-radius: 10px; padding: 20px; margin: 10px;">
                <h2 style="color: #FFD700; text-align: center; margin-bottom: 20px;">⚔️ RANK BATTLE</h2>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 10px;">
                    <div style="text-align: center; flex: 1; min-width: 100px;">
                        <div style="font-size: 3rem;">${rankInfo.emoji}</div>
                        <h3 style="color: ${rankInfo.color};">${currentRank}</h3>
                    </div>
                    <div style="text-align: center; flex: 2; min-width: 200px;">
                        <p style="color: #ccc;">Menang: ${gameData.rank.wins} | Kalah: ${gameData.rank.losses}</p>
                        <div style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 8px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                <span style="color: white;">Rank EXP</span>
                                <span style="color: #4CAF50;">${gameData.rank.exp}${rankInfo.maxExp !== Infinity ? `/${rankInfo.maxExp}` : ''}</span>
                            </div>
                            ${rankInfo.maxExp !== Infinity ? `
                            <div style="width: 100%; height: 8px; background: rgba(255,255,255,0.2); border-radius: 4px; overflow: hidden;">
                                <div style="width: ${(Number(gameData.rank.exp)/Number(rankInfo.maxExp))*100}%; height: 100%; background: linear-gradient(to right, ${rankInfo.color}, #FFD700);"></div>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
                
                <div style="display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;">
                    <div style="flex: 1; min-width: 100px; background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; text-align: center;">
                        <p style="color: #FF6B6B;">Biaya Masuk</p>
                        <p style="color: #FFD700; font-size: 1.5rem;">${rankInfo.entryFee} 🪙</p>
                    </div>
                    <div style="flex: 1; min-width: 100px; background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; text-align: center;">
                        <p style="color: #4CAF50;">Hadiah Menang</p>
                        <p style="color: #00ffff;">${rankInfo.winReward.diamonds} 💎 +${rankInfo.winReward.exp} EXP</p>
                    </div>
                </div>
                
                <button onclick="window.startRankBattle()" class="rank-battle-btn" style="width: 100%; padding: 12px; background: #FF6B6B; border: none; border-radius: 25px; color: white; font-weight: bold; font-size: 1.2rem; cursor: pointer;">
                    ⚔️ CARI LAWAN (${rankInfo.entryFee} Koin)
                </button>
                
                <div style="margin-top: 30px; background: rgba(0,0,0,0.3); border-radius: 10px; padding: 15px;">
                    <h3 style="color: #FFD700; text-align: center; margin-bottom: 15px;">🏆 TOP 5 GLOBAL</h3>
                    ${this.generateLeaderboardHTML()}
                    <div style="margin-top: 15px; text-align: center; padding: 10px; background: rgba(255,215,0,0.1); border-radius: 8px;">
                        <p style="color: #FFD700;">Posisi kamu: <strong>${gameData.rank.leaderboardPosition > 0 ? `#${gameData.rank.leaderboardPosition}` : 'Tidak masuk leaderboard'}</strong></p>
                        ${gameData.rank.leaderboardPosition === 0 && Number(gameData.rank.exp) > LEADERBOARD_NPCS[4].exp ? 
                            '<p style="color: #00ff00;">✨ Kamu sudah bisa masuk leaderboard! Menang 1x lagi untuk menggeser.</p>' : ''}
                    </div>
                </div>
            </div>
        `;
    }

    generateLeaderboardHTML() {
        let html = '<div style="display: flex; flex-direction: column; gap: 8px;">';

        let allEntries = [...LEADERBOARD_NPCS];

        if (gameData.rank.leaderboardPosition > 0) {
            const playerEntry = {
                rank: gameData.rank.leaderboardPosition,
                name: '👤 Kamu',
                rankTitle: gameData.rank.current,
                exp: gameData.rank.exp,
                wins: gameData.rank.wins,
                emoji: '🎣',
                isPlayer: true
            };

            allEntries.splice(gameData.rank.leaderboardPosition - 1, 0, playerEntry);
            if (allEntries.length > 5) allEntries.pop();
        }

        allEntries.sort((a, b) => Number(b.exp) - Number(a.exp));

        allEntries.forEach((entry, index) => {
            html += `
                <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px; ${entry.isPlayer ? 'border: 2px solid #FFD700;' : ''}">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 1.2rem; min-width: 30px;">${index === 0 ? '👑' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index+1}.`}</span>
                        <span style="font-size: 1.5rem;">${entry.emoji || '🎣'}</span>
                        <div>
                            <div style="font-weight: bold; color: ${entry.isPlayer ? '#FFD700' : 'white'};">${entry.name}</div>
                            <div style="font-size: 0.8rem; color: ${RANK_DATA[entry.rankTitle]?.color || '#ccc'};">${entry.rankTitle}</div>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="color: #FFD700;">${Number(entry.exp).toLocaleString()} EXP</div>
                        <div style="font-size: 0.8rem; color: #ccc;">${entry.wins} wins</div>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        return html;
    }

    showRankBattleSelection(opponent) {
        const rankModal = document.getElementById('rank-modal');
        const rankContent = document.getElementById('rank-content');

        if (!rankModal || !rankContent) return;

        this.currentOpponent = opponent;

        let fishOptions = '';
        gameData.backpack.forEach((fish, index) => {
            const rarityColor = this.getRarityColor(fish.rarity);
            fishOptions += `
                <div onclick="window.selectFishForBattle(${index}, ${opponent.fish.price})" 
                     style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px; margin: 5px; cursor: pointer; display: flex; align-items: center; gap: 10px; border: 1px solid rgba(255,215,0,0.3); transition: all 0.3s;"
                     onmouseenter="this.style.background='rgba(255,215,0,0.2)'"
                     onmouseleave="this.style.background='rgba(255,255,255,0.05)'">
                    <span style="font-size: 2rem;">${fish.emoji}</span>
                    <div style="flex: 1;">
                        <div style="color: white; font-weight: bold;">${fish.name}</div>
                        <div style="color: #FFD700;">💰 ${fish.price} koin</div>
                        <div style="color: ${rarityColor}; font-size: 0.8rem;">${fish.rarity}</div>
                    </div>
                </div>
            `;
        });

        rankContent.innerHTML = `
            <div style="padding: 20px;">
                <h3 style="color: #FFD700; text-align: center; margin-bottom: 20px;">🎣 Pilih Ikan untuk Bertarung!</h3>
                <p style="color: #ccc; text-align: center; margin-bottom: 20px; background: rgba(0,0,0,0.3); padding: 10px; border-radius: 8px;">
                    <strong>Lawan:</strong> ${opponent.name} ${opponent.fish.emoji} (💰 ${opponent.fish.price} koin)
                </p>
                <div style="max-height: 300px; overflow-y: auto; margin: 15px 0; padding: 5px;">
                    ${fishOptions}
                </div>
                <button onclick="modalManager.close('rank-modal')" 
                        style="width: 100%; margin-top: 20px; padding: 10px; background: #666; border: none; border-radius: 8px; color: white; cursor: pointer; font-weight: bold;">
                    ❌ BATAL
                </button>
            </div>
        `;

        modalManager.open('rank-modal');
    }

    getRarityColor(rarity) {
        switch(rarity) {
            case 'basic': return '#87CEEB';
            case 'legendary': return '#FFD700';
            case 'mythical': return '#FF69B4';
            case 'secret': return '#00FFFF';
            case 'special': return '#FF00FF';
            default: return '#FFFFFF';
        }
    }
}

// Singleton instance
export const rankUI = new RankUI();

// Export untuk global
window.startRankBattle = () => {
    const opponent = rankSystem.startRankBattle();
    if (opponent) {
        rankUI.showRankBattleSelection(opponent);
    }
};

window.selectFishForBattle = (fishIndex, opponentPrice) => {
    const isWin = rankSystem.selectFishForBattle(fishIndex, opponentPrice);
    modalManager.close('rank-modal');
    rankUI.loadRankBattle();
    uiManager.updateTopBar();
};