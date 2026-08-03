// js/core/save-manager.js - FULL FIXED (PASTI JALAN)

import { gameState, gameData } from './game-state.js';
import { GAME_VERSIONS } from '../config/version.js';
import { MINING_TOOLS } from '../config/constants.js';
import { RODS, BAITS } from '../data/equipment.js';
import { FISHING_SPOTS } from '../data/fishing-spots.js';
import { QUESTS } from './event-bus.js';

// ==================== SAVE/LOAD MANAGER ====================
class SaveManager {
    constructor(gameState) {
        this.gameState = gameState;
        this.saveKey = 'fishLegSave';
        this.autoSaveInterval = 30000;
        this.saveTimer = null;
        this.lastSave = Date.now();
    }

    // ============ SAVE - NYIMPEN SEMUA ============
    save() {
        try {
            console.log('💾 Saving game...');
            
            // Ambil semua data dari gameData
            const saveData = {
                // ============ SEMUA DATA GAME ============
                gameData: JSON.parse(JSON.stringify(gameData)), // Deep copy biar aman
                
                // ============ DATA STATIS YANG BERUBAH ============
                rods: RODS.map(r => ({ id: r.id, owned: r.owned || false, unlocked: r.unlocked || false })),
                baits: BAITS.map(b => ({ id: b.id, owned: b.owned || false, unlocked: b.unlocked || false })),
                miningTools: MINING_TOOLS.map(t => ({ id: t.id, owned: t.owned || false })),
                quests: QUESTS.map(q => ({ id: q.id, progress: q.progress || 0, completed: q.completed || false })),
                
                // ============ VARIABEL GLOBAL ============
                currentSpot: window._currentSpot || 0,
                currentDepth: window._currentDepth || "surface",
                caughtSecretSpots: window._caughtSecretSpots || {},
                lastSave: Date.now()
            };

            // Simpan ke localStorage
            const saveString = JSON.stringify(saveData);
            localStorage.setItem(this.saveKey, saveString);
            this.lastSave = Date.now();

            console.log('✅ Game saved successfully!');
            console.log('📊 Saved data:', {
                coins: gameData.coins,
                diamonds: gameData.diamonds,
                level: gameData.level,
                exp: gameData.exp,
                backpack: gameData.backpack.length,
                gamepassLevel: gameData.gamepass.level,
                gamepassExp: gameData.gamepass.exp,
                secretTokens: gameData.secretTokens,
                rodsOwned: RODS.filter(r => r.owned).length,
                baitsOwned: BAITS.filter(b => b.owned).length
            });
            return true;
        } catch (error) {
            console.error('❌ Save error:', error);
            return false;
        }
    }

    // ============ LOAD - MENGEMBALIKAN SEMUA ============
    load() {
        try {
            const saveString = localStorage.getItem(this.saveKey);
            if (!saveString) {
                console.log('ℹ️ No save file found, starting new game');
                return false;
            }

            const saveData = JSON.parse(saveString);
            console.log('📂 Loading save file...');

            // ============ MIGRASI VERSI ============
            if (saveData.gameData && saveData.gameData.version !== GAME_VERSIONS.current) {
                console.log(`⚠️ Migrating from v${saveData.gameData.version} to v${GAME_VERSIONS.current}`);
                this.migrateSaveData(saveData);
            }

            // ============ LOAD GAME DATA - ASSIGN LANGSUNG KE gameData ============
            if (saveData.gameData) {
                // Copy semua properti dari saveData.gameData ke gameData
                Object.keys(saveData.gameData).forEach(key => {
                    gameData[key] = saveData.gameData[key];
                });
                console.log('✅ Game data loaded:', {
                    coins: gameData.coins,
                    diamonds: gameData.diamonds,
                    level: gameData.level,
                    backpack: gameData.backpack.length
                });
            }

            // ============ LOAD RODS ============
            if (saveData.rods) {
                saveData.rods.forEach(savedRod => {
                    const existingRod = RODS.find(r => r.id === savedRod.id);
                    if (existingRod) {
                        existingRod.owned = savedRod.owned || false;
                        existingRod.unlocked = savedRod.unlocked || false;
                    }
                });
                console.log('✅ Rods loaded');
            }

            // ============ LOAD BAITS ============
            if (saveData.baits) {
                saveData.baits.forEach(savedBait => {
                    const existingBait = BAITS.find(b => b.id === savedBait.id);
                    if (existingBait) {
                        existingBait.owned = savedBait.owned || false;
                        existingBait.unlocked = savedBait.unlocked || false;
                    }
                });
                console.log('✅ Baits loaded');
            }

            // ============ LOAD MINING TOOLS ============
            if (saveData.miningTools) {
                saveData.miningTools.forEach(savedTool => {
                    const existingTool = MINING_TOOLS.find(t => t.id === savedTool.id);
                    if (existingTool) {
                        existingTool.owned = savedTool.owned || false;
                    }
                });
                console.log('✅ Mining tools loaded');
            }

            // ============ LOAD QUESTS ============
            if (saveData.quests) {
                saveData.quests.forEach(savedQuest => {
                    const existingQuest = QUESTS.find(q => q.id === savedQuest.id);
                    if (existingQuest) {
                        existingQuest.progress = savedQuest.progress || 0;
                        existingQuest.completed = savedQuest.completed || false;
                    }
                });
                console.log('✅ Quests loaded');
            }

            // ============ LOAD GLOBAL VARIABLES ============
            window._currentSpot = saveData.currentSpot || 0;
            window._currentDepth = saveData.currentDepth || "surface";
            window._caughtSecretSpots = saveData.caughtSecretSpots || {
                danau: false, kuil: false, laut: false, sungai: false,
                angkasa: false, brainrot: false, crypto: false,
                atlantis: false, valinor: false
            };

            console.log('✅ Game loaded successfully!');
            console.log('📊 Loaded data:', {
                coins: gameData.coins,
                diamonds: gameData.diamonds,
                level: gameData.level,
                exp: gameData.exp,
                backpack: gameData.backpack.length,
                gamepassLevel: gameData.gamepass.level,
                gamepassExp: gameData.gamepass.exp,
                secretTokens: gameData.secretTokens
            });
            return true;
        } catch (error) {
            console.error('❌ Load error:', error);
            return false;
        }
    }

    migrateSaveData(saveData) {
        const data = saveData.gameData;
        if (!data) return;

        if (data.version < 6) {
            if (!data.mining) {
                data.mining = {
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
            }
            if (!data.specialItems) data.specialItems = { oneRing: false };
            if (data.specialItems.flashlight === undefined) data.specialItems.flashlight = false;
            if (data.depthGear.minerHelm === undefined) data.depthGear.minerHelm = false;
        }

        if (data.version < 7) {
            if (!data.dungeon) {
                data.dungeon = {
                    unlocked: false,
                    fishEquipment: {
                        equippedFish: null,
                        weapon: null,
                        armor: null
                    },
                    dungeonProgress: {
                        1: { completed: false, bossesDefeated: [] },
                        2: { completed: false, bossesDefeated: [] },
                        3: { completed: false, bossesDefeated: [] },
                        4: { completed: false, bossesDefeated: [] }
                    },
                    currentBattle: null,
                    battleInProgress: false,
                    playerTurn: true
                };
            }
            if (data.secretTokens === undefined) data.secretTokens = 0;
            if (data.illuvatarTickets === undefined) data.illuvatarTickets = 0;
        }

        if (data.version < 8) {
            if (!data.skills.expert) data.skills.expert = { level: 0, bonus: 0 };
            if (!data.skills.penawar) data.skills.penawar = { level: 0, bonus: 0 };
            if (!data.skills.animalLovers) data.skills.animalLovers = { unlocked: false };
        }

        if (!Array.isArray(data.pets.active)) {
            if (data.pets.active) {
                data.pets.active = [data.pets.active];
            } else {
                data.pets.active = [];
            }
        }

        data.version = GAME_VERSIONS.current;
    }

    startAutoSave() {
        if (this.saveTimer) {
            clearInterval(this.saveTimer);
        }
        this.saveTimer = setInterval(() => {
            this.save();
        }, this.autoSaveInterval);
    }

    stopAutoSave() {
        if (this.saveTimer) {
            clearInterval(this.saveTimer);
            this.saveTimer = null;
        }
    }

    forceSave() {
        return this.save();
    }

    getLastSaveTime() {
        return this.lastSave;
    }

    resetSave() {
        if (confirm('⚠️ Yakin ingin mereset semua progress game?')) {
            localStorage.removeItem(this.saveKey);
            location.reload();
        }
    }
}

export const saveManager = new SaveManager(gameState);