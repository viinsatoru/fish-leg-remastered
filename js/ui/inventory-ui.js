// js/ui/inventory-ui.js

import { gameState, gameData } from '../core/game-state.js';
import { eventBus, EVENTS } from '../core/event-bus.js';
import { uiManager } from './ui-manager.js';
import { modalManager } from './modals.js';
import { notification } from './notification.js';
import { saveManager } from '../core/save-manager.js';
import { skillSystem } from '../systems/skill-system.js';
import { fishingSystem } from '../systems/fishing-system.js';
import { FISHING_SPOTS, getAllFishes } from '../data/fishing-spots.js';

// ==================== INVENTORY UI ====================
class InventoryUI {
    constructor() {
        this.backpackItems = null;
        this.sellItems = null;
        this.sellTotal = null;
        this.sellBtn = null;
        this.sellAllBtn = null;
        this.selectedFish = [];
        this.totalSellValue = 0;
        this.favoriteFish = [];
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;

        this.backpackItems = document.getElementById('backpack-items');
        this.sellItems = document.getElementById('sell-items');
        this.sellTotal = document.getElementById('sell-total');
        this.sellBtn = document.getElementById('sell-btn');
        this.sellAllBtn = document.getElementById('sell-all-btn');

        // Setup sort buttons
        const sortRarity = document.getElementById('sort-rarity');
        const sortPrice = document.getElementById('sort-price');
        if (sortRarity) sortRarity.addEventListener('click', () => this.sortBackpack('rarity'));
        if (sortPrice) sortPrice.addEventListener('click', () => this.sortBackpack('price'));

        // Setup sell buttons
        if (this.sellBtn) this.sellBtn.addEventListener('click', () => this.sellSelectedFish());
        if (this.sellAllBtn) this.sellAllBtn.addEventListener('click', () => this.sellAllFish());

        // Setup auto-sell toggles
        const autoSellBasic = document.getElementById('auto-sell-basic');
        const autoSellLegendary = document.getElementById('auto-sell-legendary');
        if (autoSellBasic) autoSellBasic.addEventListener('change', (e) => this.toggleAutoSell('basic', e.target.checked));
        if (autoSellLegendary) autoSellLegendary.addEventListener('change', (e) => this.toggleAutoSell('legendary', e.target.checked));

        // Setup minigame click
        this.setupMinigameClick();

        // Listen for state changes
        gameState.subscribe((key, value) => {
            if (key === 'backpack') {
                this.loadBackpack();
                this.loadSellItems();
            }
        });

        this.initialized = true;
        console.log('✅ Inventory UI initialized');
    }

    // ============ SETUP MINIGAME CLICK ============
    setupMinigameClick() {
        const minigameIndicator = document.getElementById('minigame-indicator');
        if (minigameIndicator) {
            minigameIndicator.addEventListener('click', () => {
                console.log('🖱️ Minigame clicked!');
                const result = fishingSystem.checkMinigameResult();
                if (result) {
                    notification.success('🎯 PERFECT TIMING!');
                } else {
                    notification.info('⏰ Coba lagi lain kali!');
                }
                // Sembunyikan minigame setelah diklik
                minigameIndicator.style.display = 'none';
                fishingSystem.stopMinigame();
            });
        }
    }

    // ==================== BACKPACK ====================
    loadBackpack() {
        if (!this.backpackItems) return;

        if (gameData.backpack.length === 0) {
            this.backpackItems.innerHTML = '<p class="empty-message">Belum ada ikan di backpack</p>';
            return;
        }

        this.backpackItems.innerHTML = '';

        gameData.backpack.forEach((fish, index) => {
            const fishCard = document.createElement('div');
            fishCard.className = 'item-card';
            fishCard.setAttribute('data-index', index);

            let rarityColor = this.getRarityColor(fish.rarity);
            const isFavorite = gameData.favoriteFish.includes(index);

            let fishClass = this.getFishClass(fish.id);

            fishCard.innerHTML = `
                <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; margin: 5px; border-left: 5px solid ${rarityColor}; position: relative;">
                    ${isFavorite ? '<div style="position: absolute; top: 5px; right: 5px; font-size: 1.5rem;">⭐</div>' : ''}
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <div style="font-size: 2rem;" class="${fishClass}">${fish.emoji}</div>
                        <div style="flex: 1;">
                            <div style="font-weight: bold; color: white; display: flex; align-items: center; gap: 10px;">
                                ${fish.name}
                                <button onclick="window.toggleFavoriteFish(${index})" 
                                        style="background: none; border: none; color: gold; font-size: 1.2rem; cursor: pointer; padding: 0 5px;">
                                    ${isFavorite ? '★' : '☆'}
                                </button>
                            </div>
                            <div style="color: ${rarityColor};">${fish.rarity.toUpperCase()}</div>
                            <div style="color: #FFD700;">${fish.price} koin</div>
                            ${fish.perfectCatch ? '<div style="color: #FFD700; font-size: 0.8rem;">🎯 Perfect</div>' : ''}
                            ${fish.doubleCatch ? '<div style="color: #4CAF50; font-size: 0.8rem;">✨ Double</div>' : ''}
                            ${fish.depth ? `<div style="color: #00ffff; font-size: 0.8rem;">📍 ${fish.depth}</div>` : ''}
                        </div>
                    </div>
                </div>
            `;

            this.backpackItems.appendChild(fishCard);
        });
    }

    // ==================== SELL ====================
    loadSellItems() {
        if (!this.sellItems || !this.sellTotal || !this.sellBtn || !this.sellAllBtn) return;

        if (gameData.backpack.length === 0) {
            this.sellItems.innerHTML = '<p class="empty-message">Tidak ada ikan untuk dijual</p>';
            this.sellBtn.disabled = true;
            this.sellAllBtn.disabled = true;
            return;
        }

        this.sellItems.innerHTML = '';
        this.selectedFish = [];
        this.totalSellValue = 0;

        const penawarBonus = skillSystem.getPenawarBonus();

        gameData.backpack.forEach((fish, index) => {
            if (gameData.favoriteFish.includes(index)) return;

            const fishCard = document.createElement('div');
            fishCard.className = 'item-card';
            fishCard.dataset.index = index;

            let rarityColor = this.getRarityColor(fish.rarity);

            const basePrice = fish.perfectCatch ? Math.floor(Number(fish.price) * 1.5) : Number(fish.price);
            const finalPrice = Math.floor(basePrice * penawarBonus);

            fishCard.innerHTML = `
                <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; margin: 5px; border-left: 5px solid ${rarityColor};">
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <div style="font-size: 2rem;">${fish.emoji}</div>
                        <div style="flex: 1;">
                            <div style="font-weight: bold; color: white;">${fish.name}</div>
                            <div style="color: ${rarityColor};">${fish.rarity}</div>
                            <div style="color: #FFD700;">${finalPrice} koin</div>
                            ${fish.perfectCatch ? '<div style="color: #FFD700; font-size: 0.7rem;">🎯 +50%</div>' : ''}
                            ${penawarBonus > 1 ? `<div style="color: #4CAF50; font-size: 0.7rem;" class="penawar-badge">💰 Penawar +${(penawarBonus-1)*100}%</div>` : ''}
                        </div>
                        <input type="checkbox" class="fish-checkbox" style="transform: scale(1.5);">
                    </div>
                </div>
            `;

            const checkbox = fishCard.querySelector('.fish-checkbox');
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.selectedFish.push(index);
                    this.totalSellValue = Number(this.totalSellValue) + finalPrice;
                } else {
                    const idx = this.selectedFish.indexOf(index);
                    if (idx > -1) {
                        this.selectedFish.splice(idx, 1);
                        this.totalSellValue = Number(this.totalSellValue) - finalPrice;
                    }
                }

                this.sellTotal.textContent = this.totalSellValue;
                this.sellBtn.disabled = this.selectedFish.length === 0;
            });

            this.sellItems.appendChild(fishCard);
        });

        if (this.sellItems.children.length === 0) {
            this.sellItems.innerHTML = '<p class="empty-message">Semua ikan adalah favorit! Unfavorite dulu untuk menjual.</p>';
        }

        this.sellTotal.textContent = this.totalSellValue;
        this.sellBtn.disabled = true;
        this.sellAllBtn.disabled = gameData.favoriteFish.length > 0;
    }

    sellSelectedFish() {
        if (this.selectedFish.length === 0) return;

        const hasFavorite = this.selectedFish.some(index => gameData.favoriteFish.includes(index));

        if (hasFavorite) {
            notification.error('❌ Tidak bisa menjual ikan favorit! Unfavorite dulu.');
            return;
        }

        const penawarBonus = skillSystem.getPenawarBonus();

        this.selectedFish.sort((a, b) => b - a);

        let totalSold = 0;
        let fishCount = 0;
        this.selectedFish.forEach(index => {
            const fish = gameData.backpack[index];
            const basePrice = fish.perfectCatch ? Math.floor(Number(fish.price) * 1.5) : Number(fish.price);
            const finalPrice = Math.floor(basePrice * penawarBonus);
            totalSold += finalPrice;
            fishCount++;
            gameData.backpack.splice(index, 1);
        });

        this.updateFavoriteIndicesAfterSell(this.selectedFish);

        gameData.coins = Number(gameData.coins) + totalSold;
        this.selectedFish = [];
        this.totalSellValue = 0;

        saveManager.forceSave();
        this.loadBackpack();
        this.loadSellItems();
        uiManager.updateTopBar();

        notification.success(`💰 Berhasil menjual ${fishCount} ikan dan mendapatkan ${totalSold} koin!`);
    }

    sellAllFish() {
        if (gameData.backpack.length === 0) return;

        if (gameData.favoriteFish.length > 0) {
            notification.error('❌ Ada ikan favorit! Unfavorite dulu sebelum jual semua.');
            return;
        }

        const penawarBonus = skillSystem.getPenawarBonus();

        let totalSold = 0;
        let fishCount = gameData.backpack.length;
        gameData.backpack.forEach(fish => {
            const basePrice = fish.perfectCatch ? Math.floor(Number(fish.price) * 1.5) : Number(fish.price);
            const finalPrice = Math.floor(basePrice * penawarBonus);
            totalSold += finalPrice;
        });

        gameData.coins = Number(gameData.coins) + totalSold;
        gameData.backpack = [];
        gameData.favoriteFish = [];

        saveManager.forceSave();
        this.loadBackpack();
        this.loadSellItems();
        uiManager.updateTopBar();

        notification.success(`💰 Berhasil menjual semua ${fishCount} ikan dan mendapatkan ${totalSold} koin!`);
    }

    // ==================== FAVORITE ====================
    toggleFavoriteFish(index) {
        if (index < 0 || index >= gameData.backpack.length) return;

        const fishIndex = gameData.favoriteFish.indexOf(index);

        if (fishIndex === -1) {
            gameData.favoriteFish.push(index);
            notification.success(`⭐ ${gameData.backpack[index].name} ditambahkan ke favorit!`);
        } else {
            gameData.favoriteFish.splice(fishIndex, 1);
            notification.info(`❌ ${gameData.backpack[index].name} dihapus dari favorit`);
        }

        saveManager.forceSave();
        this.loadBackpack();
        this.loadSellItems();
    }

    updateFavoriteIndicesAfterSell(soldIndices) {
        soldIndices.sort((a, b) => b - a);
        gameData.favoriteFish = gameData.favoriteFish.filter(idx => !soldIndices.includes(idx));
        for (const soldIdx of soldIndices) {
            gameData.favoriteFish = gameData.favoriteFish.map(idx => idx > soldIdx ? idx - 1 : idx);
        }
    }

    // ==================== SORT ====================
    sortBackpack(sortType) {
        switch(sortType) {
            case 'rarity':
                gameData.backpack.sort((a, b) => {
                    const rarityOrder = { 'special': 5, 'secret': 4, 'mythical': 3, 'legendary': 2, 'basic': 1 };
                    return rarityOrder[b.rarity] - rarityOrder[a.rarity];
                });
                break;
            case 'price':
                gameData.backpack.sort((a, b) => Number(b.price) - Number(a.price));
                break;
        }
        this.loadBackpack();
        saveManager.forceSave();
    }

    // ==================== AUTO SELL ====================
    toggleAutoSell(rarity, enabled) {
        window.autoSellSettings = window.autoSellSettings || { basic: false, legendary: false };
        window.autoSellSettings[rarity] = enabled;
        notification.info(`⚡ Auto-sell ${rarity}: ${enabled ? 'ON' : 'OFF'}`);
    }

    // ==================== HELPERS ====================
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

    getFishClass(fishId) {
        const specialFish = {
            800: 'fish-angel-dog',
            801: 'fish-swangod',
            802: 'fish-birdfeather',
            803: 'fish-dugong',
            804: 'fish-elvish',
            805: 'fish-butterfly'
        };
        return specialFish[fishId] || '';
    }
}

export const inventoryUI = new InventoryUI();

window.toggleFavoriteFish = (index) => inventoryUI.toggleFavoriteFish(index);
window.autoSellSettings = { basic: false, legendary: false };