// js/systems/fishing-system.js

import { gameState, gameData } from '../core/game-state.js';
import { eventBus, EVENTS } from '../core/event-bus.js';
import { saveManager } from '../core/save-manager.js';
import { DEPTH_LEVELS, WEATHER, GAMEPASS_LEVELS } from '../config/constants.js';
import { RODS, BAITS } from '../data/equipment.js';
import { FISHING_SPOTS, getAllFishes } from '../data/fishing-spots.js';
import { PETS } from '../data/pets.js';

// ==================== GAME VARIABLES ====================
let currentSpot = 0;
let currentDepth = "surface";
let isFishing = false;
let currentPullHandler = null;
let autoSellSettings = { basic: false, legendary: false, mythical: false };
let caughtSecretSpots = { danau: false, kuil: false, laut: false, sungai: false, angkasa: false, brainrot: false, crypto: false, atlantis: false, valinor: false };

// ==================== FISHING SYSTEM ====================
class FishingSystem {
    constructor() {
        this.isFishing = false;
        this.currentPullHandler = null;
        this.currentSpot = 0;
        this.currentDepth = 'surface';
        this.caughtSecretSpots = caughtSecretSpots;
        this.autoSellSettings = autoSellSettings;
        this.weather = { ...WEATHER };
        this.currentFishingTimeout = null;
    }

    getCurrentSpot() {
        return FISHING_SPOTS[this.currentSpot];
    }

    switchSpot(spotId) {
        this.currentSpot = spotId;
        const spot = this.getCurrentSpot();
        eventBus.emit(EVENTS.STATE_CHANGED, { key: 'currentSpot', value: spotId });
        return spot;
    }

    switchDepth(depth) {
        if (DEPTH_LEVELS[depth]) {
            this.currentDepth = depth;
            eventBus.emit(EVENTS.STATE_CHANGED, { key: 'currentDepth', value: depth });
            return true;
        }
        return false;
    }

    isDepthUnlocked(depth) {
        const depthData = DEPTH_LEVELS[depth];
        if (!depthData || !depthData.requiredGear) return true;
        const gear = gameData.depthGear;
        return depthData.requiredGear.some(gearId => gear[gearId] === true);
    }

    calculateTotalLuck() {
        const currentRod = RODS.find(r => r.id === gameData.currentRod) || RODS[0];
        const currentBait = BAITS.find(b => b.id === gameData.currentBait) || BAITS[0];
        const depthData = DEPTH_LEVELS[this.currentDepth] || DEPTH_LEVELS.surface;

        let totalLuck = Number(currentRod.luck) * Number(currentBait.luck);

        const equippedGachaRod = gameData.gachaStats.rodsObtained.length > 0 ?
            Math.max(...gameData.gachaStats.rodsObtained.map(id =>
                RODS.find(r => r.id === id)?.luck || 1
            )) : 1;
        totalLuck *= equippedGachaRod;

        totalLuck *= (1 + Number(gameData.village.hutLevel) * 0.1);

        const activePets = this.getActivePets();
        for (const pet of activePets) {
            if (pet.effect.type === "luck_multiplier") {
                totalLuck *= Number(pet.effect.value);
            }
        }

        totalLuck *= (1 + (Number(gameData.skills.lucky.level) * 100) / 100);

        if (gameData.activePotions.length > 0) {
            totalLuck *= Number(gameData.activePotions[0].multiplier);
        }

        totalLuck *= this.weather.effects[this.weather.current].luck;
        totalLuck *= depthData.luckMultiplier;

        return totalLuck;
    }

    getActivePets() {
        const activePets = [];
        const slots = gameData.skills.animalLovers?.unlocked ? 2 : 1;

        if (Array.isArray(gameData.pets.active)) {
            for (let i = 0; i < Math.min(slots, gameData.pets.active.length); i++) {
                const petId = gameData.pets.active[i];
                const pet = PETS.find(p => p.id === petId);
                if (pet) activePets.push(pet);
            }
        } else if (gameData.pets.active) {
            const pet = PETS.find(p => p.id === gameData.pets.active);
            if (pet) activePets.push(pet);
        }

        return activePets;
    }

    hasActivePet(petId) {
        const activePets = this.getActivePets();
        return activePets.some(pet => pet.id === petId);
    }

    getRandomFish() {
        console.log('🐟 getRandomFish() called');
        const currentSpotData = this.getCurrentSpot();
        if (!currentSpotData) {
            console.log('❌ No spot data found');
            return FISHING_SPOTS[0]?.fishes[0] || null;
        }

        if (this.currentSpot === 8 && !gameData.depthGear.crownOfSilmarillion) {
            console.log('❌ Butuh Crown of Silmarillion untuk Valinor');
            return null;
        }

        if (this.currentSpot === 6 && !gameData.depthGear.maskOfSatoshi) {
            console.log('❌ Butuh Mask of Satoshi untuk Crypto');
            return null;
        }

        if (this.currentSpot === 7 && !gameData.depthGear.turtleHat) {
            console.log('❌ Butuh Turtle Hat untuk Atlantis');
            return null;
        }

        const totalLuck = this.calculateTotalLuck();
        const luckBonus = Math.min(totalLuck, 10);
        const depthData = DEPTH_LEVELS[this.currentDepth] || DEPTH_LEVELS.surface;

        let availableFishes = [...currentSpotData.fishes];

        if (this.currentSpot === 8 && !this.hasActivePet(7)) {
            availableFishes = availableFishes.filter(fish =>
                fish.rarity === 'legendary' || fish.rarity === 'mythical'
            );
        }

        const weightedFishes = availableFishes.map(fish => {
            let finalChance = fish.chance;

            if (fish.rarity === "basic") {
                finalChance = Math.max(fish.chance / (1 + luckBonus * 0.1 * depthData.rareBonus), 5);
            } else if (fish.rarity === "legendary") {
                finalChance = fish.chance * (1 + luckBonus * 0.3 * depthData.rareBonus);
            } else if (fish.rarity === "mythical") {
                finalChance = fish.chance * (1 + luckBonus * 0.5 * depthData.rareBonus);
            } else if (fish.rarity === "secret") {
                finalChance = fish.chance * (1 + luckBonus * 0.8 * depthData.rareBonus);
            } else if (fish.rarity === "special") {
                finalChance = fish.chance * (1 + luckBonus * 1.5 * depthData.rareBonus);
            }

            return { ...fish, finalChance: Math.max(finalChance, 0.1) };
        });

        const totalChance = weightedFishes.reduce((sum, fish) => sum + fish.finalChance, 0);
        if (totalChance <= 0) {
            console.log('⚠️ Total chance <= 0, returning first fish');
            return availableFishes[0];
        }

        const random = Math.random() * totalChance;
        let cumulativeChance = 0;

        for (const fish of weightedFishes) {
            cumulativeChance += fish.finalChance;
            if (random <= cumulativeChance) {
                console.log(`✅ Got fish: ${fish.name}`);
                return { ...fish };
            }
        }

        console.log('⚠️ No fish selected, returning first');
        return { ...availableFishes[0] };
    }

    startFishing() {
        console.log('🎣 FishingSystem.startFishing() CALLED!');
        
        if (this.isFishing) {
            console.log('⏳ Already fishing, ignoring...');
            return;
        }

        if (this.currentSpot === 6 && !gameData.depthGear.maskOfSatoshi) {
            console.log('❌ Butuh Mask of Satoshi');
            eventBus.emit(EVENTS.NOTIFICATION, { message: '❌ Beli Mask of Satoshi dulu', type: 'error' });
            return;
        }

        if (this.currentSpot === 7 && !gameData.depthGear.turtleHat) {
            console.log('❌ Butuh Turtle Hat');
            eventBus.emit(EVENTS.NOTIFICATION, { message: '❌ Beli Turtle Hat dulu', type: 'error' });
            return;
        }

        if (this.currentSpot === 8 && !gameData.depthGear.crownOfSilmarillion) {
            console.log('❌ Butuh Crown of Silmarillion');
            eventBus.emit(EVENTS.NOTIFICATION, { message: '❌ Beli Crown of Silmarillion dulu', type: 'error' });
            return;
        }

        console.log('✅ All requirements passed, starting fishing...');
        this.isFishing = true;
        eventBus.emit(EVENTS.FISHING_STARTED, { spot: this.currentSpot });

        eventBus.emit(EVENTS.NOTIFICATION, { message: '🎣 Casting line...', type: 'info' });

        const hasPerfectPet = this.hasActivePet(3);
        const minigameIndicator = document.getElementById('minigame-indicator');
        
        if (!hasPerfectPet && minigameIndicator) {
            console.log('🎯 Menampilkan minigame!');
            minigameIndicator.style.display = 'block';
            this.startMinigame();
        } else if (hasPerfectPet) {
            console.log('🐓 Ayam Perfect aktif! Auto perfect catch!');
            eventBus.emit(EVENTS.NOTIFICATION, { message: '🐓 Ayam Perfect: Auto Perfect Catch!', type: 'success' });
        }

        this.currentFishingTimeout = setTimeout(() => {
            console.log('⏰ Fishing timeout complete');
            if (!this.isFishing) {
                console.log('⏳ Fishing cancelled');
                return;
            }

            let perfectCatch = hasPerfectPet ? true : false;
            
            if (!hasPerfectPet && minigameIndicator && minigameIndicator.style.display !== 'none') {
                perfectCatch = this.checkMinigameResult();
                console.log(`🎯 Minigame result: ${perfectCatch ? 'PERFECT!' : 'Normal'}`);
            }

            const fish = this.getRandomFish();

            if (fish) {
                console.log(`🐟 Got fish: ${fish.name}`);
                this.finishFishing(fish, perfectCatch);

                if (this.hasActivePet(6) && Math.random() * 100 < 10) {
                    console.log('🦨 Racoon double catch!');
                    this.finishFishing({ ...fish }, perfectCatch, true);
                    eventBus.emit(EVENTS.NOTIFICATION, { message: '🦨 Racoon: Dapat ikan double!', type: 'success' });
                }
            } else {
                console.log('❌ No fish caught');
                eventBus.emit(EVENTS.NOTIFICATION, { message: '😅 Ikan lolos! Coba lagi.', type: 'info' });
            }

            if (minigameIndicator) {
                minigameIndicator.style.display = 'none';
                this.stopMinigame();
            }

            this.isFishing = false;
            eventBus.emit(EVENTS.FISHING_FINISHED);
            console.log('✅ Fishing finished');
            
            const fishBtn = document.getElementById('fish-btn');
            if (fishBtn) {
                fishBtn.textContent = '🎣 Mancing!';
                fishBtn.disabled = false;
            }
        }, 2500);
    }

    startMinigame() {
        const needle = document.querySelector('.indicator-needle');
        if (needle) {
            needle.style.animation = 'needleSweep 1.5s infinite ease-in-out';
            console.log('🎯 Minigame started!');
        }
    }

    stopMinigame() {
        const needle = document.querySelector('.indicator-needle');
        if (needle) {
            needle.style.animation = 'none';
            needle.style.left = '0';
        }
    }

    checkMinigameResult() {
        const needle = document.querySelector('.indicator-needle');
        const target = document.querySelector('.indicator-target');
        
        if (!needle || !target) {
            console.log('⚠️ Minigame elements not found');
            return false;
        }
        
        const needleRect = needle.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        
        const needleCenter = needleRect.left + needleRect.width / 2;
        const targetLeft = targetRect.left;
        const targetRight = targetRect.right;
        
        const isPerfect = needleCenter >= targetLeft && needleCenter <= targetRight;
        console.log(`🎯 Needle: ${needleCenter}, Target: ${targetLeft}-${targetRight}, Perfect: ${isPerfect}`);
        
        return isPerfect;
    }

    // ============ FINISH FISHING - AUTO SELL FIXED ============
    finishFishing(fish, perfectCatch = false, isDouble = false) {
        console.log(`🎣 finishFishing: ${fish.name}, perfect: ${perfectCatch}, double: ${isDouble}`);
        
        let priceMultiplier = 1;
        if (perfectCatch) {
            priceMultiplier = 1.5;
            eventBus.emit(EVENTS.PERFECT_CATCH, { fish });
            if (!isDouble) {
                eventBus.emit(EVENTS.NOTIFICATION, { message: '🎯 PERFECT CATCH! +50% Bonus', type: 'success' });
            }
        }

        const finalPrice = Math.floor(Number(fish.price) * priceMultiplier);

        // ============ CEK AUTO SELL ============
        const autoSell = window.autoSellSettings || { basic: false, legendary: false, mythical: false };
        const shouldAutoSell = autoSell[fish.rarity] === true;
        
        console.log(`🔍 Auto sell check: ${fish.rarity} = ${shouldAutoSell}`);

        if (shouldAutoSell) {
            // Auto sell - langsung tambah coin
            gameData.coins = Number(gameData.coins) + finalPrice;
            if (!isDouble) {
                eventBus.emit(EVENTS.NOTIFICATION, { 
                    message: `💰 Auto-sold: ${fish.emoji} ${fish.name} (${finalPrice} 🪙)`, 
                    type: 'info' 
                });
            }
            console.log(`💰 Auto-sold: ${fish.name} for ${finalPrice} coins`);
        } else {
            // Masuk ke backpack
            const newFish = {
                ...fish,
                catchTime: Date.now(),
                perfectCatch: perfectCatch,
                finalValue: finalPrice,
                depth: this.currentDepth,
                uniqueId: Date.now() + Math.random()
            };
            gameData.backpack.push(newFish);
            gameData.totalFishCaught = Number(gameData.totalFishCaught) + 1;
            if (!isDouble) {
                eventBus.emit(EVENTS.NOTIFICATION, { 
                    message: `🐟 Dapat ${fish.emoji} ${fish.name} (${finalPrice} 🪙)`, 
                    type: 'success' 
                });
            }
        }

        // ============ EXP GAIN ============
        let expGained = 10;
        if (gameData.skills.expert && gameData.skills.expert.level > 0) {
            expGained += gameData.skills.expert.level * 10;
        }
        gameData.exp = Number(gameData.exp) + expGained;
        this.checkLevelUp();

        // ============ GAMEPASS EXP ============
        this.addGamepassExp(expGained);
        this.addToAquarium(fish);

        eventBus.emit(EVENTS.FISHING_CAUGHT, { fish, price: finalPrice, perfect: perfectCatch });
        eventBus.emit(EVENTS.BACKPACK_UPDATED, gameData.backpack);

        saveManager.forceSave();
        
        // Update UI
        if (window.inventoryUI) {
            window.inventoryUI.loadBackpack();
            window.inventoryUI.loadSellItems();
        }
        if (window.uiManager) {
            window.uiManager.updateTopBar();
        }
        if (window.gamepassUI) {
            window.gamepassUI.loadGamepass();
        }
    }

    addGamepassExp(amount) {
        console.log('🎟️ addGamepassExp called with:', amount);
        
        if (!gameData.gamepass.owned) {
            console.log('❌ Gamepass not owned');
            return;
        }
        if (gameData.gamepass.level >= 40) {
            console.log('✅ Gamepass already max level');
            return;
        }
        
        gameData.gamepass.exp = Number(gameData.gamepass.exp) + Number(amount);
        console.log('📊 Gamepass EXP:', gameData.gamepass.exp);
        
        const currentLevelReq = GAMEPASS_LEVELS.find(l => l.level === gameData.gamepass.level)?.expRequired || Infinity;
        console.log('📊 Current level req:', currentLevelReq);
        
        while (Number(gameData.gamepass.exp) >= currentLevelReq && gameData.gamepass.level < 40) {
            gameData.gamepass.exp = Number(gameData.gamepass.exp) - currentLevelReq;
            gameData.gamepass.level++;
            console.log(`🎁 Gamepass Level ${gameData.gamepass.level} tercapai!`);
            eventBus.emit(EVENTS.NOTIFICATION, { 
                message: `🎁 Gamepass Level ${gameData.gamepass.level} tercapai!`, 
                type: 'success' 
            });
        }
        
        saveManager.forceSave();
        
        if (window.gamepassUI) {
            window.gamepassUI.loadGamepass();
        }
    }

    checkLevelUp() {
        const expNeeded = Number(gameData.level) * 100;
        if (Number(gameData.exp) >= expNeeded) {
            gameData.exp = Number(gameData.exp) - expNeeded;
            gameData.level = Number(gameData.level) + 1;
            eventBus.emit(EVENTS.LEVEL_UPDATED, gameData.level);
            eventBus.emit(EVENTS.NOTIFICATION, { message: `🎉 Level Up! Sekarang level ${gameData.level}!`, type: 'success' });
        }
    }

    addToAquarium(fish) {
        const rarity = fish.rarity;
        if (!gameData.aquarium[rarity]) gameData.aquarium[rarity] = {};
        if (!gameData.aquarium[rarity][fish.id]) gameData.aquarium[rarity][fish.id] = 0;
        gameData.aquarium[rarity][fish.id] = Number(gameData.aquarium[rarity][fish.id]) + 1;
        eventBus.emit(EVENTS.STATE_CHANGED, { key: 'aquarium', value: gameData.aquarium });
    }

    getAllFishes() {
        return getAllFishes();
    }

    changeWeather() {
        const weatherTypes = Object.keys(this.weather.effects);
        const randomIndex = Math.floor(Math.random() * weatherTypes.length);
        this.weather.current = weatherTypes[randomIndex];
        const weatherData = this.weather.effects[this.weather.current];
        eventBus.emit(EVENTS.NOTIFICATION, { message: `🌤️ Cuaca berubah: ${weatherData.text}`, type: 'info' });
        return this.weather.current;
    }

    getCurrentWeather() {
        return this.weather.effects[this.weather.current];
    }

    getCaughtSecretSpots() {
        return this.caughtSecretSpots;
    }

    markSecretSpotCaught(spot) {
        if (this.caughtSecretSpots[spot] !== undefined) {
            this.caughtSecretSpots[spot] = true;
        }
    }
}

export const fishingSystem = new FishingSystem();

export const getRandomFish = () => fishingSystem.getRandomFish();
export const startFishing = () => fishingSystem.startFishing();
export const calculateTotalLuck = () => fishingSystem.calculateTotalLuck();
export const getActivePets = () => fishingSystem.getActivePets();
export const hasActivePet = (id) => fishingSystem.hasActivePet(id);
export const switchFishingSpot = (spotId) => fishingSystem.switchSpot(spotId);
export const getCurrentSpot = () => fishingSystem.getCurrentSpot();
export const changeWeather = () => fishingSystem.changeWeather();
export const getCurrentWeather = () => fishingSystem.getCurrentWeather();

export { currentSpot, currentDepth, isFishing, currentPullHandler, autoSellSettings, caughtSecretSpots };
