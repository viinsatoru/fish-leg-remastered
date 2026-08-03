// js/systems/rank-system.js

import { gameState, gameData } from '../core/game-state.js';
import { eventBus, EVENTS } from '../core/event-bus.js';
import { saveManager } from '../core/save-manager.js';
import { RANK_DATA, LEADERBOARD_NPCS } from '../config/constants.js';
import { PETS } from '../data/pets.js';  // ← TAMBAHKAN INI

// ==================== RANK SYSTEM ====================
class RankSystem {
    constructor() {
        this.rankData = RANK_DATA;
        this.leaderboardNPCs = LEADERBOARD_NPCS;
        this.currentOpponent = null;
    }

    // Get current rank info
    getCurrentRankInfo() {
        const currentRank = gameData.rank.current;
        return this.rankData[currentRank] || this.rankData.Warrior;
    }

    // Get next rank info
    getNextRankInfo() {
        const currentRank = gameData.rank.current;
        const rankInfo = this.rankData[currentRank];
        if (rankInfo.nextRank && rankInfo.nextRank !== currentRank) {
            return this.rankData[rankInfo.nextRank];
        }
        return null;
    }

    // Update leaderboard position
    updateLeaderboardPosition() {
        const playerExp = Number(gameData.rank.exp);
        let position = 0;

        if (playerExp > this.leaderboardNPCs[4].exp) {
            position = 5;
            for (let i = 4; i >= 0; i--) {
                if (playerExp > this.leaderboardNPCs[i].exp) {
                    position = i + 1;
                    break;
                }
            }
        }

        gameData.rank.leaderboardPosition = position;
        return position;
    }

    // Get leaderboard entries
    getLeaderboard() {
        let allEntries = [...this.leaderboardNPCs];

        if (gameData.rank.leaderboardPosition > 0) {
            const playerEntry = {
                rank: gameData.rank.leaderboardPosition,
                name: "👤 Kamu",
                rankTitle: gameData.rank.current,
                exp: gameData.rank.exp,
                wins: gameData.rank.wins,
                emoji: "🎣",
                isPlayer: true
            };

            allEntries.splice(gameData.rank.leaderboardPosition - 1, 0, playerEntry);
            if (allEntries.length > 5) allEntries.pop();
        }

        allEntries.sort((a, b) => Number(b.exp) - Number(a.exp));
        return allEntries;
    }

    // Get opponent for battle
    getOpponent() {
        const rankInfo = this.getCurrentRankInfo();
        const opponents = rankInfo.opponents;
        return opponents[Math.floor(Math.random() * opponents.length)];
    }

    // Start rank battle
    startRankBattle() {
        const rankInfo = this.getCurrentRankInfo();

        if (Number(gameData.coins) < Number(rankInfo.entryFee)) {
            eventBus.emit(EVENTS.NOTIFICATION, { 
                message: `❌ Koin tidak cukup! Butuh ${rankInfo.entryFee} koin`, 
                type: 'error' 
            });
            return false;
        }

        if (gameData.backpack.length === 0) {
            eventBus.emit(EVENTS.NOTIFICATION, { 
                message: "❌ Tidak ada ikan untuk bertarung!", 
                type: 'error' 
            });
            return false;
        }

        gameData.coins = Number(gameData.coins) - Number(rankInfo.entryFee);
        this.currentOpponent = this.getOpponent();
        saveManager.forceSave();

        return this.currentOpponent;
    }

    // Select fish for battle
    selectFishForBattle(fishIndex, opponentPrice) {
        const fish = gameData.backpack[fishIndex];

        if (!fish) {
            eventBus.emit(EVENTS.NOTIFICATION, { 
                message: "❌ Ikan tidak ditemukan!", 
                type: 'error' 
            });
            return false;
        }

        let fishPrice = Number(fish.price);
        
        // T-Rex pet bonus
        const activePets = this.getActivePets();
        if (activePets.some(p => p.id === 8)) {
            fishPrice = Math.floor(fishPrice * 1.1);
            eventBus.emit(EVENTS.NOTIFICATION, { 
                message: "🦖 T-Rex: +10% kekuatan!", 
                type: 'success' 
            });
        }

        const priceDifference = fishPrice - Number(opponentPrice);
        let winChance = 50 + (priceDifference / 50);
        winChance = Math.min(Math.max(winChance, 10), 95);

        const isWin = Math.random() * 100 < winChance;

        if (!isWin) {
            gameData.backpack.splice(fishIndex, 1);
        }

        this.processBattleResult(isWin, fish, winChance);
        return isWin;
    }

    // Process battle result
    processBattleResult(isWin, fish, winChance) {
        const rankInfo = this.getCurrentRankInfo();
        
        gameData.rank.totalBattles = Number(gameData.rank.totalBattles) + 1;

        if (isWin) {
            gameData.rank.wins = Number(gameData.rank.wins) + 1;
            gameData.diamonds = Number(gameData.diamonds) + Number(rankInfo.winReward.diamonds);
            gameData.rank.exp = Number(gameData.rank.exp) + Number(rankInfo.winReward.exp);

            // Check rank up
            const currentRank = gameData.rank.current;
            if (currentRank !== "Immortal" && Number(gameData.rank.exp) >= Number(rankInfo.maxExp)) {
                gameData.rank.exp = Number(gameData.rank.exp) - Number(rankInfo.maxExp);
                gameData.rank.current = rankInfo.nextRank;
                gameData.rank.highestRank = gameData.rank.current;
                eventBus.emit(EVENTS.NOTIFICATION, { 
                    message: `🏆 SELAMAT! Rank naik dari ${currentRank} ke ${gameData.rank.current}!`, 
                    type: 'success' 
                });
            }

            // Streak bonus
            const streakBonus = Math.floor(Number(gameData.rank.wins) / 10) * 0.1;
            const bonusDiamonds = Math.floor(Number(rankInfo.winReward.diamonds) * streakBonus);
            gameData.diamonds = Number(gameData.diamonds) + bonusDiamonds;

            eventBus.emit(EVENTS.NOTIFICATION, { 
                message: `🎉 MENANG! +${Number(rankInfo.winReward.diamonds) + bonusDiamonds} 💎 (termasuk bonus streak)`, 
                type: 'success' 
            });
            eventBus.emit(EVENTS.NOTIFICATION, { 
                message: `✅ Ikan ${fish.emoji} ${fish.name} kembali dengan selamat! (+${rankInfo.winReward.exp} EXP Rank)`, 
                type: 'success' 
            });

            this.updateLeaderboardPosition();

        } else {
            gameData.rank.losses = Number(gameData.rank.losses) + 1;
            gameData.rank.exp = Math.max(0, Number(gameData.rank.exp) - Number(rankInfo.lossPenalty.exp));

            eventBus.emit(EVENTS.NOTIFICATION, { 
                message: `😢 KALAH! Rank EXP -${rankInfo.lossPenalty.exp}`, 
                type: 'error' 
            });
            eventBus.emit(EVENTS.NOTIFICATION, { 
                message: `❌ Ikan ${fish.emoji} ${fish.name} hilang dalam pertarungan!`, 
                type: 'error' 
            });
        }

        saveManager.forceSave();
        eventBus.emit(EVENTS.STATE_CHANGED, { key: 'rank', value: gameData.rank });
    }

    // ============ GET ACTIVE PETS (FIXED) ============
    getActivePets() {
        const activePets = [];
        const slots = gameData.skills.animalLovers?.unlocked ? 2 : 1;

        if (Array.isArray(gameData.pets.active)) {
            for (let i = 0; i < Math.min(slots, gameData.pets.active.length); i++) {
                const petId = gameData.pets.active[i];
                const pet = PETS.find(p => p.id === petId);  // ← SEKARANG PAKAI PETS
                if (pet) activePets.push(pet);
            }
        } else if (gameData.pets.active) {
            const pet = PETS.find(p => p.id === gameData.pets.active);  // ← SEKARANG PAKAI PETS
            if (pet) activePets.push(pet);
        }

        return activePets;
    }

    // Get rank stats
    getStats() {
        return {
            current: gameData.rank.current,
            exp: gameData.rank.exp,
            wins: gameData.rank.wins,
            losses: gameData.rank.losses,
            totalBattles: gameData.rank.totalBattles,
            leaderboardPosition: gameData.rank.leaderboardPosition,
            highestRank: gameData.rank.highestRank
        };
    }

    // Reset rank (untuk testing)
    reset() {
        gameData.rank = {
            current: "Warrior",
            exp: 0,
            wins: 0,
            losses: 0,
            totalBattles: 0,
            leaderboardPosition: 0,
            highestRank: "Warrior"
        };
        saveManager.forceSave();
    }
}

// Singleton instance
export const rankSystem = new RankSystem();

// Export untuk kompatibilitas
export const startRankBattle = () => rankSystem.startRankBattle();
export const selectFishForBattle = (idx, price) => rankSystem.selectFishForBattle(idx, price);
export const updateLeaderboardPosition = () => rankSystem.updateLeaderboardPosition();
export const getCurrentRankInfo = () => rankSystem.getCurrentRankInfo();