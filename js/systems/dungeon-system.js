// js/systems/dungeon-system.js

import { gameState, gameData } from '../core/game-state.js';
import { eventBus, EVENTS } from '../core/event-bus.js';
import { saveManager } from '../core/save-manager.js';
import { 
    DUNGEON_BOSSES, 
    DUNGEON_LEVELS, 
    DUNGEON_WEAPONS, 
    DUNGEON_ARMORS,
    getBossById,
    getLevelById,
    getWeaponById,
    getArmorById
} from '../data/dungeon.js';

// ==================== DUNGEON SYSTEM ====================
class DungeonSystem {
    constructor() {
        this.bosses = DUNGEON_BOSSES;
        this.levels = DUNGEON_LEVELS;
        this.weapons = DUNGEON_WEAPONS;
        this.armors = DUNGEON_ARMORS;
        this.battleInProgress = false;
    }

    // Check if dungeon is unlocked
    isUnlocked() {
        const hasGhostShip = gameData.depthGear.ghostShip === true;
        const hasOneRing = gameData.specialItems.oneRing === true;
        gameData.dungeon.unlocked = hasGhostShip && hasOneRing;
        return gameData.dungeon.unlocked;
    }

    // Get equipped fish
    getEquippedFish() {
        const fishIndex = gameData.dungeon.fishEquipment.equippedFish;
        if (fishIndex !== null && gameData.backpack[fishIndex]) {
            return gameData.backpack[fishIndex];
        }
        return null;
    }

    // Get equipped weapon
    getEquippedWeapon() {
        return getWeaponById(gameData.dungeon.fishEquipment.weapon);
    }

    // Get equipped armor
    getEquippedArmor() {
        return getArmorById(gameData.dungeon.fishEquipment.armor);
    }

    // Get player stats
    getPlayerStats() {
        const fish = this.getEquippedFish();
        const weapon = this.getEquippedWeapon();
        const armor = this.getEquippedArmor();

        return {
            fish: fish,
            hp: fish ? Math.floor(Number(fish.price) / 10) : 0,
            attack: weapon ? Number(weapon.attack) : 0,
            defense: armor ? Number(armor.defense) : 0,
            weapon: weapon,
            armor: armor
        };
    }

    // Select fish for dungeon
    selectFish(fishIndex) {
        const fish = gameData.backpack[fishIndex];
        if (!fish || (fish.rarity !== 'secret' && fish.rarity !== 'special')) {
            eventBus.emit(EVENTS.NOTIFICATION, { 
                message: '❌ Hanya ikan Secret yang bisa dipilih untuk dungeon!', 
                type: 'error' 
            });
            return false;
        }
        gameData.dungeon.fishEquipment.equippedFish = fishIndex;
        saveManager.forceSave();
        eventBus.emit(EVENTS.NOTIFICATION, { 
            message: `✅ ${fish.name} siap bertarung di dungeon!`, 
            type: 'success' 
        });
        return true;
    }

    // Buy weapon
    buyWeapon(weaponId) {
        const weapon = getWeaponById(weaponId);
        if (!weapon) return false;

        if (weapon.currency === "coins") {
            if (Number(gameData.coins) < Number(weapon.price)) {
                eventBus.emit(EVENTS.NOTIFICATION, { message: '❌ Koin tidak cukup!', type: 'error' });
                return false;
            }
            gameData.coins = Number(gameData.coins) - Number(weapon.price);
        } else if (weapon.currency === "diamonds") {
            if (Number(gameData.diamonds) < Number(weapon.price)) {
                eventBus.emit(EVENTS.NOTIFICATION, { message: '❌ Diamond tidak cukup!', type: 'error' });
                return false;
            }
            gameData.diamonds = Number(gameData.diamonds) - Number(weapon.price);
        } else {
            return false;
        }

        gameData.dungeon.fishEquipment.weapon = weapon.id;
        saveManager.forceSave();
        eventBus.emit(EVENTS.ITEM_BOUGHT, { type: 'dungeonWeapon', weapon });
        eventBus.emit(EVENTS.NOTIFICATION, { 
            message: `✅ Berhasil membeli ${weapon.name}! Attack +${weapon.attack}`, 
            type: 'success' 
        });
        return true;
    }

    // Buy armor
    buyArmor(armorId) {
        const armor = getArmorById(armorId);
        if (!armor) return false;

        if (armor.currency === "coins") {
            if (Number(gameData.coins) < Number(armor.price)) {
                eventBus.emit(EVENTS.NOTIFICATION, { message: '❌ Koin tidak cukup!', type: 'error' });
                return false;
            }
            gameData.coins = Number(gameData.coins) - Number(armor.price);
        } else if (armor.currency === "diamonds") {
            if (Number(gameData.diamonds) < Number(armor.price)) {
                eventBus.emit(EVENTS.NOTIFICATION, { message: '❌ Diamond tidak cukup!', type: 'error' });
                return false;
            }
            gameData.diamonds = Number(gameData.diamonds) - Number(armor.price);
        } else {
            return false;
        }

        gameData.dungeon.fishEquipment.armor = armor.id;
        saveManager.forceSave();
        eventBus.emit(EVENTS.ITEM_BOUGHT, { type: 'dungeonArmor', armor });
        eventBus.emit(EVENTS.NOTIFICATION, { 
            message: `✅ Berhasil membeli ${armor.name}! Defense +${armor.defense}`, 
            type: 'success' 
        });
        return true;
    }

    // Get dungeon progress
    getProgress(levelId) {
        return gameData.dungeon.dungeonProgress[levelId] || { completed: false, bossesDefeated: [] };
    }

    // Check if level is completed
    isLevelCompleted(levelId) {
        return this.getProgress(levelId).completed;
    }

    // Get bosses defeated count
    getBossesDefeated(levelId) {
        return this.getProgress(levelId).bossesDefeated.length;
    }

    // Enter dungeon level
    enterLevel(levelId) {
        const level = getLevelById(levelId);
        if (!level) return false;

        const fish = this.getEquippedFish();
        if (!fish) {
            eventBus.emit(EVENTS.NOTIFICATION, { message: '❌ Pilih ikan dulu!', type: 'error' });
            return false;
        }

        if (Number(gameData.level) < Number(level.requiredLevel)) {
            eventBus.emit(EVENTS.NOTIFICATION, { 
                message: `❌ Butuh level ${level.requiredLevel} untuk masuk!`, 
                type: 'error' 
            });
            return false;
        }

        if (Number(gameData.coins) < Number(level.entryFee)) {
            eventBus.emit(EVENTS.NOTIFICATION, { 
                message: `❌ Koin tidak cukup! Butuh ${level.entryFee} koin`, 
                type: 'error' 
            });
            return false;
        }

        if (this.isLevelCompleted(levelId)) {
            eventBus.emit(EVENTS.NOTIFICATION, { 
                message: '✅ Level ini sudah selesai!', 
                type: 'success' 
            });
            return false;
        }

        gameData.coins = Number(gameData.coins) - Number(level.entryFee);

        // Select random boss
        const availableBosses = level.bossIds.filter(id => 
            !this.getProgress(levelId).bossesDefeated.includes(id)
        );

        if (availableBosses.length === 0) {
            eventBus.emit(EVENTS.NOTIFICATION, { 
                message: 'Semua boss sudah dikalahkan!', 
                type: 'success' 
            });
            return false;
        }

        const bossId = availableBosses[Math.floor(Math.random() * availableBosses.length)];
        const boss = getBossById(bossId);

        if (!boss) return false;

        // Start battle
        this.startBattle(level, boss, fish);
        return true;
    }

    // Start battle
    startBattle(level, boss, fish) {
        const weapon = this.getEquippedWeapon();
        const armor = this.getEquippedArmor();

        const playerMaxHP = Math.floor(Number(fish.price) / 10);
        const playerAttack = weapon ? Number(weapon.attack) : 0;
        const playerDefense = armor ? Number(armor.defense) : 0;

        gameData.dungeon.currentBattle = {
            levelId: level.id,
            boss: boss,
            playerHP: playerMaxHP,
            playerMaxHP: playerMaxHP,
            playerAttack: playerAttack,
            playerDefense: playerDefense,
            bossHP: Number(boss.hp),
            bossMaxHP: Number(boss.hp),
            bossAttack: Number(boss.attack),
            bossDefense: Number(boss.defense),
            playerTurn: true,
            fishIndex: gameData.dungeon.fishEquipment.equippedFish
        };

        gameData.dungeon.battleInProgress = true;
        this.battleInProgress = true;
        eventBus.emit(EVENTS.DUNGEON_BATTLE_START, { level, boss });
        return gameData.dungeon.currentBattle;
    }

    // Get current battle
    getCurrentBattle() {
        return gameData.dungeon.currentBattle;
    }

    // Player attack
    playerAttack() {
        const battle = gameData.dungeon.currentBattle;
        if (!battle || !battle.playerTurn) return false;

        const damage = Math.max(1, battle.playerAttack - battle.bossDefense + Math.floor(Math.random() * 10));
        battle.bossHP -= damage;

        if (battle.bossHP <= 0) {
            this.victory();
            return true;
        }

        battle.playerTurn = false;
        return true;
    }

    // Boss attack
    bossAttack() {
        const battle = gameData.dungeon.currentBattle;
        if (!battle || battle.playerTurn) return false;

        const damage = Math.max(1, battle.bossAttack - battle.playerDefense + Math.floor(Math.random() * 15));
        battle.playerHP -= damage;

        if (battle.playerHP <= 0) {
            this.defeat();
            return true;
        }

        battle.playerTurn = true;
        return true;
    }

    // Victory
    victory() {
        const battle = gameData.dungeon.currentBattle;
        if (!battle) return;

        const progress = gameData.dungeon.dungeonProgress[battle.levelId];
        if (!progress.bossesDefeated.includes(battle.boss.id)) {
            progress.bossesDefeated.push(battle.boss.id);
        }

        const tokenReward = battle.levelId === 1 ? 1 : battle.levelId === 2 ? 2 : battle.levelId === 3 ? 3 : 5;
        gameData.secretTokens = (gameData.secretTokens || 0) + tokenReward;

        const level = getLevelById(battle.levelId);
        const allBossesDefeated = level.bossIds.every(id => progress.bossesDefeated.includes(id));

        if (allBossesDefeated) {
            progress.completed = true;
        }

        gameData.dungeon.battleInProgress = false;
        this.battleInProgress = false;
        gameData.dungeon.currentBattle = null;
        saveManager.forceSave();

        eventBus.emit(EVENTS.DUNGEON_VICTORY, { 
            boss: battle.boss, 
            tokenReward, 
            allBossesDefeated 
        });
        eventBus.emit(EVENTS.NOTIFICATION, { 
            message: `🎉 Mengalahkan ${battle.boss.name}! Mendapatkan ${tokenReward} Secret Token!`, 
            type: 'success' 
        });

        if (allBossesDefeated) {
            eventBus.emit(EVENTS.NOTIFICATION, { 
                message: `🎉 DUNGEON LEVEL ${battle.levelId} SELESAI! Total Token: ${gameData.secretTokens}`, 
                type: 'success' 
            });
        }

        return { tokenReward, allBossesDefeated };
    }

    // Defeat
    defeat() {
        const battle = gameData.dungeon.currentBattle;
        if (!battle) return;

        if (battle.fishIndex !== undefined && gameData.backpack[battle.fishIndex]) {
            const fish = gameData.backpack[battle.fishIndex];
            gameData.backpack.splice(battle.fishIndex, 1);
            gameData.dungeon.fishEquipment.equippedFish = null;
            gameData.dungeon.fishEquipment.weapon = null;
            gameData.dungeon.fishEquipment.armor = null;
            eventBus.emit(EVENTS.NOTIFICATION, { 
                message: `😢 KALAH! ${fish.name} hilang dalam pertarungan!`, 
                type: 'error' 
            });
        } else {
            eventBus.emit(EVENTS.NOTIFICATION, { 
                message: `😢 KALAH! ${battle.boss.name} terlalu kuat!`, 
                type: 'error' 
            });
        }

        gameData.dungeon.battleInProgress = false;
        this.battleInProgress = false;
        gameData.dungeon.currentBattle = null;
        saveManager.forceSave();

        eventBus.emit(EVENTS.DUNGEON_DEFEAT, { boss: battle.boss });
    }

    // Flee battle
    flee() {
        if (!this.battleInProgress) return false;

        gameData.dungeon.battleInProgress = false;
        this.battleInProgress = false;
        gameData.dungeon.currentBattle = null;
        saveManager.forceSave();

        eventBus.emit(EVENTS.NOTIFICATION, { message: '🏃 Melarikan diri dari dungeon!', type: 'info' });
        return true;
    }

    // Get dungeon levels
    getLevels() {
        return this.levels;
    }

    // Get secret tokens
    getSecretTokens() {
        return gameData.secretTokens || 0;
    }

    // Reset dungeon progress (untuk testing)
    resetProgress() {
        gameData.dungeon.dungeonProgress = {
            1: { completed: false, bossesDefeated: [] },
            2: { completed: false, bossesDefeated: [] },
            3: { completed: false, bossesDefeated: [] },
            4: { completed: false, bossesDefeated: [] }
        };
        gameData.dungeon.fishEquipment = {
            equippedFish: null,
            weapon: null,
            armor: null
        };
        gameData.secretTokens = 0;
        saveManager.forceSave();
    }
}

// Singleton instance
export const dungeonSystem = new DungeonSystem();

// Export untuk kompatibilitas
export const checkDungeonUnlock = () => dungeonSystem.isUnlocked();
export const selectDungeonFish = (id) => dungeonSystem.selectFish(id);
export const buyDungeonWeapon = (id) => dungeonSystem.buyWeapon(id);
export const buyDungeonArmor = (id) => dungeonSystem.buyArmor(id);
export const enterDungeonLevel = (id) => dungeonSystem.enterLevel(id);
export const playerAttack = () => dungeonSystem.playerAttack();
export const bossAttack = () => dungeonSystem.bossAttack();
export const fleeBattle = () => dungeonSystem.flee();