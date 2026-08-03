// js/ui/shop-ui.js

import { gameState, gameData } from '../core/game-state.js';
import { uiManager } from './ui-manager.js';
import { notification } from './notification.js';
import { saveManager } from '../core/save-manager.js';
import { DEPTH_GEAR } from '../config/constants.js';        // ← HANYA DEPTH_GEAR
import { POTIONS, RODS, BAITS } from '../data/equipment.js'; // ← POTIONS dari sini

// ==================== SHOP UI ====================
class ShopUI {
    constructor() {
        this.shopItems = null;
        this.currentCategory = 'rods';
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;

        this.shopItems = document.getElementById('shop-items');

        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.getAttribute('data-category');
                this.switchCategory(category);
            });
        });

        gameState.subscribe((key, value) => {
            if (key === 'coins' || key === 'diamonds') {
                this.loadShop(this.currentCategory);
            }
        });

        this.initialized = true;
        console.log('✅ Shop UI initialized');
    }

    switchCategory(category) {
        this.currentCategory = category;
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-category') === category);
        });
        this.loadShop(category);
    }

    loadShop(category) {
        if (!this.shopItems) return;

        this.shopItems.innerHTML = '';

        let items = [];
        if (category === 'rods') {
            items = RODS.filter(rod => {
                if (rod.special) return rod.unlocked;
                if (rod.id === 12) return rod.unlocked || rod.owned;
                if (rod.id === 20) return rod.owned;
                if (rod.id === 14) return rod.unlocked || rod.owned;
                return true;
            });
        } else if (category === 'baits') {
            items = BAITS.filter(bait => {
                if (bait.id === 9) return bait.owned;
                if (bait.id === 10) return bait.unlocked || bait.owned;
                return true;
            });
        } else if (category === 'potions') {
            items = POTIONS;
        } else if (category === 'upgrades') {
            items = this.getVillageUpgrades();
        } else if (category === 'depth-gear') {
            items = DEPTH_GEAR;
        }

        if (items.length === 0) {
            this.shopItems.innerHTML = '<p class="empty-message">Tidak ada item</p>';
            return;
        }

        items.forEach(item => {
            const itemCard = this.createItemCard(item, category);
            this.shopItems.appendChild(itemCard);
        });
    }

    createItemCard(item, category) {
        const card = document.createElement('div');
        card.className = 'item-card';

        let isOwned = false, canAfford = false, isEquipped = false;
        let priceDisplay = '';
        let buttonText = 'Beli';
        let isDisabled = false;

        if (category === 'potions') {
            canAfford = Number(gameData.coins) >= Number(item.price);
            buttonText = canAfford ? 'Beli & Pakai' : 'Koin Tidak Cukup';
            isDisabled = !canAfford;
        } else if (category === 'upgrades') {
            canAfford = Number(gameData.coins) >= Number(item.price);
            isOwned = item.owned || false;
            buttonText = canAfford ? 'Beli' : 'Koin Tidak Cukup';
            isDisabled = !canAfford || isOwned;
        } else if (category === 'depth-gear') {
            isOwned = gameData.depthGear[item.id] === true;
            canAfford = item.currency === "coins" ? 
                Number(gameData.coins) >= Number(item.price) : 
                Number(gameData.diamonds) >= Number(item.price);
            buttonText = isOwned ? '✓ DIMILIKI' : (canAfford ? '🛒 BELI' : '❌ TIDAK CUKUP');
            isDisabled = isOwned || !canAfford;
        } else {
            isOwned = item.owned === true;
            if (item.currency === "diamonds") {
                canAfford = Number(gameData.diamonds) >= Number(item.price);
            } else {
                canAfford = Number(gameData.coins) >= Number(item.price);
            }
            isEquipped = category === 'rods' ? item.id === gameData.currentRod : item.id === gameData.currentBait;

            if (isOwned) {
                buttonText = isEquipped ? 'Sedang Digunakan' : 'Gunakan';
                isDisabled = isEquipped;
            } else {
                if (item.special && !item.unlocked) {
                    buttonText = '🔒 Locked (Quest)';
                    isDisabled = true;
                } else if ((item.id === 12 || item.id === 14) && !item.unlocked) {
                    buttonText = '🔒 Locked (Exchange)';
                    isDisabled = true;
                } else if (item.id === 9 && !item.owned) {
                    buttonText = '🔒 Locked (Quest)';
                    isDisabled = true;
                } else if (item.id === 10 && !item.unlocked) {
                    buttonText = '🔒 Locked (Exchange)';
                    isDisabled = true;
                } else if (item.currency === "diamonds") {
                    buttonText = canAfford ? 'Beli (💎)' : 'Diamond Tidak Cukup';
                    isDisabled = !canAfford;
                } else {
                    buttonText = canAfford ? 'Beli' : 'Koin Tidak Cukup';
                    isDisabled = !canAfford;
                }
            }
        }

        const emoji = item.emoji || (category === 'rods' ? '🎣' : '🪱');
        priceDisplay = item.currency === "diamonds" ? `${item.price} 💎` : 
                       (item.price > 0 ? `${item.price} 🪙` : (item.id === 0 ? 'Gratis' : 'Quest/Exchange'));

        card.innerHTML = `
            <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; margin: 5px; text-align: center;">
                <div style="font-size: 2.5rem; margin-bottom: 10px;">${emoji}</div>
                <div style="font-weight: bold; color: white; margin-bottom: 5px;">${item.name}</div>
                ${item.luck ? `<div style="color: #00ffff; font-size: 13px;">+${item.luck}x Luck</div>` : ''}
                ${item.multiplier ? `<div style="color: #4CAF50; font-size: 13px;">${item.multiplier}x Boost</div>` : ''}
                ${item.duration ? `<div style="color: #ccc; font-size: 12px;">${item.duration} menit</div>` : ''}
                ${item.description ? `<div style="color: #ccc; font-size: 12px;">${item.description}</div>` : ''}
                <div style="color: #FFD700; margin: 10px 0; font-size: 14px;">${priceDisplay}</div>
                <button class="shop-btn" ${isDisabled ? 'disabled' : ''}
                        style="width: 100%; padding: 8px; background: ${isDisabled ? '#666' : '#4CAF50'}; 
                               border: none; border-radius: 6px; color: white; cursor: ${isDisabled ? 'not-allowed' : 'pointer'};">
                    ${buttonText}
                </button>
            </div>
        `;

        const btn = card.querySelector('.shop-btn');
        if (!isDisabled) {
            btn.addEventListener('click', () => {
                if (category === 'potions' && canAfford) {
                    this.buyPotion(item);
                } else if (category === 'upgrades' && canAfford && !isOwned) {
                    this.buyUpgrade(item.type);
                } else if (category === 'depth-gear' && canAfford && !isOwned) {
                    this.buyDepthGear(item);
                } else if (!isOwned && canAfford && !item.special && 
                           item.id !== 12 && item.id !== 14 && item.id !== 9 && item.id !== 10) {
                    this.buyItem(item, category);
                } else if (isOwned && !isEquipped && !isDisabled) {
                    this.equipItem(item, category);
                }
            });
        }

        return card;
    }

    buyItem(item, category) {
        if (Number(gameData.coins) < Number(item.price)) {
            notification.error('❌ Koin tidak cukup!');
            return;
        }

        gameData.coins = Number(gameData.coins) - Number(item.price);
        item.owned = true;

        if (category === 'rods') {
            this.equipItem(item, category);
        }

        saveManager.forceSave();
        notification.success(`✅ Berhasil membeli ${item.name}!`);
        uiManager.updateTopBar();
        this.loadShop(category);
    }

    equipItem(item, category) {
        if (category === 'rods') {
            gameData.currentRod = item.id;
        } else if (category === 'baits') {
            gameData.currentBait = item.id;
        }

        saveManager.forceSave();
        notification.success(`🎣 Menggunakan ${item.name}!`);
        this.loadShop(category);
        uiManager.updateLuckDisplay();
    }

    buyPotion(potion) {
        if (Number(gameData.coins) < Number(potion.price)) {
            notification.error('❌ Koin tidak cukup!');
            return;
        }

        gameData.coins = Number(gameData.coins) - Number(potion.price);
        gameData.activePotions.push({ ...potion, startTime: Date.now() });

        saveManager.forceSave();
        notification.success(`🧪 Menggunakan ${potion.name}!`);
        uiManager.updateTopBar();
        this.loadShop('potions');
        uiManager.updateLuckDisplay();
    }

    buyUpgrade(upgradeType) {
        const upgrades = this.getVillageUpgrades();
        const upgrade = upgrades.find(u => u.type === upgradeType);

        if (!upgrade || Number(gameData.coins) < Number(upgrade.price)) {
            notification.error('❌ Koin tidak cukup!');
            return;
        }

        gameData.coins = Number(gameData.coins) - Number(upgrade.price);

        switch(upgradeType) {
            case 'hut':
                gameData.village.hutLevel = Number(gameData.village.hutLevel) + 1;
                notification.success(`🏠 Fishing Hut upgraded to level ${gameData.village.hutLevel}!`);
                break;
            case 'assistant':
                if (gameData.village.assistants < 3) {
                    gameData.village.assistants = Number(gameData.village.assistants) + 1;
                    notification.success(`👥 Assistant hired! Total: ${gameData.village.assistants}`);
                }
                break;
        }

        saveManager.forceSave();
        uiManager.updateTopBar();
        this.loadShop('upgrades');
        uiManager.updateLuckDisplay();
    }

    buyDepthGear(gear) {
        if (!gear) return;

        let cost = Number(gear.price);

        if (gear.currency === "coins") {
            if (Number(gameData.coins) < cost) {
                notification.error('❌ Koin tidak cukup!');
                return;
            }
            gameData.coins = Number(gameData.coins) - cost;
        } else if (gear.currency === "diamonds") {
            if (Number(gameData.diamonds) < cost) {
                notification.error('❌ Diamond tidak cukup!');
                return;
            }
            gameData.diamonds = Number(gameData.diamonds) - cost;
        } else {
            notification.error('❌ Currency tidak valid!');
            return;
        }

        gameData.depthGear[gear.id] = true;
        saveManager.forceSave();

        notification.success(`✅ Berhasil membeli ${gear.name}!`);
        uiManager.updateTopBar();
        this.loadShop('depth-gear');

        if (gear.id === "ghostShip") {
            notification.success('👻 Ghost Ship didapatkan! Sekarang cari One Ring di Exchange!');
        }
        if (gear.id === "crownOfSilmarillion") {
            notification.success('👑 Crown of Silmarillion didapatkan! Sekarang cari Unicorn untuk memancing di Valinor!');
        }
        if (gear.id === "minerHelm") {
            notification.success('🪖 Miner Helm didapatkan! Sekarang cari Flashlight di Exchange untuk buka Mining!');
        }

        if (window.checkDungeonUnlock) window.checkDungeonUnlock();
        if (window.checkMiningUnlock) window.checkMiningUnlock();
    }

    getVillageUpgrades() {
        return [
            { 
                type: 'hut', 
                name: 'Fishing Hut Upgrade', 
                desc: `Level ${gameData.village.hutLevel + 1} (+10% Luck)`, 
                price: gameData.village.hutLevel * 1000 + 1000, 
                owned: false, 
                emoji: '🏠' 
            },
            { 
                type: 'assistant', 
                name: 'Hire Assistant', 
                desc: 'Auto-fish every 30 seconds', 
                price: 2000, 
                owned: gameData.village.assistants >= 3, 
                emoji: '👥' 
            }
        ];
    }
}

export const shopUI = new ShopUI();

export const loadShop = (category) => shopUI.loadShop(category);
export const switchCategory = (category) => shopUI.switchCategory(category);