// js/ui/exchange-ui.js

import { gameState, gameData } from '../core/game-state.js';
import { uiManager } from './ui-manager.js';
import { notification } from './notification.js';
import { saveManager } from '../core/save-manager.js';
import { EXCHANGE_RECIPES } from '../data/exchange.js';
import { RODS, BAITS } from '../data/equipment.js';
import { getAllFishes } from '../data/fishing-spots.js';
import { dungeonSystem } from '../systems/dungeon-system.js';
import { miningSystem } from '../systems/mining-system.js';

// ==================== EXCHANGE UI ====================
class ExchangeUI {
    constructor() {
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        this.initialized = true;
        console.log('✅ Exchange UI initialized');
    }

    loadExchange() {
        const exchangeContainer = document.getElementById('exchange-items');
        if (!exchangeContainer) return;

        exchangeContainer.innerHTML = '';

        EXCHANGE_RECIPES.forEach(recipe => {
            const recipeCard = document.createElement('div');
            recipeCard.className = 'exchange-card';

            const canCraft = this.checkExchangeRequirements(recipe);

            let outputHtml = '';
            if (recipe.output.type === 'diamond') {
                outputHtml = `
                    <div style="display: flex; align-items: center; gap: 10px; margin: 5px 0;">
                        <span style="font-size: 1.5rem;">💎</span>
                        <span style="color: white;">${recipe.output.quantity}x Diamond</span>
                    </div>
                `;
            } else if (recipe.output.type === 'coin') {
                outputHtml = `
                    <div style="display: flex; align-items: center; gap: 10px; margin: 5px 0;">
                        <span style="font-size: 1.5rem;">💰</span>
                        <span style="color: white;">${recipe.output.quantity}x Coin</span>
                    </div>
                `;
            } else if (recipe.output.type === 'special' && recipe.output.id === 'oneRing') {
                outputHtml = `
                    <div style="display: flex; align-items: center; gap: 10px; margin: 5px 0;">
                        <span style="font-size: 2rem;">💍</span>
                        <span style="color: #FFD700; font-weight: bold;">${recipe.output.name}</span>
                    </div>
                    <p style="color: #FF00FF; font-size: 0.8rem;">✨ WAJIB untuk buka dungeon!</p>
                `;
            } else if (recipe.output.type === 'ticket' && recipe.output.id === 'illuvatar') {
                outputHtml = `
                    <div style="display: flex; align-items: center; gap: 10px; margin: 5px 0;">
                        <span style="font-size: 2rem;">🎟️</span>
                        <span style="color: #FFD700; font-weight: bold;">${recipe.output.name}</span>
                    </div>
                    <p style="color: #00FFFF; font-size: 0.8rem;">📦 Untuk membuka Chest Illüvatar!</p>
                `;
            } else if (recipe.output.type === 'special' && recipe.output.id === 'flashlight') {
                outputHtml = `
                    <div style="display: flex; align-items: center; gap: 10px; margin: 5px 0;">
                        <span style="font-size: 2rem;">🔦</span>
                        <span style="color: #FFD700; font-weight: bold;">${recipe.output.name}</span>
                    </div>
                    <p style="color: #FF00FF; font-size: 0.8rem;">🔦 WAJIB untuk buka Mining!</p>
                `;
            } else {
                outputHtml = `
                    <div style="display: flex; align-items: center; gap: 10px; margin: 5px 0;">
                        <span style="font-size: 1.5rem;">${recipe.output.emoji || '🎁'}</span>
                        <span style="color: white;">${recipe.output.quantity}x ${recipe.output.name}</span>
                    </div>
                    ${recipe.output.luck ? `<p style="color: #00ffff;">Luck: +${recipe.output.luck}x</p>` : ''}
                `;
            }

            const isOneRing = recipe.id === 11;
            const isIlluvatar = recipe.id === 12;
            const isFlashlight = recipe.id === 13;

            recipeCard.innerHTML = `
                <div style="background: ${isOneRing ? 'rgba(255,215,0,0.1)' : isIlluvatar ? 'rgba(255,165,0,0.1)' : isFlashlight ? 'rgba(255,255,0,0.1)' : 'rgba(255,255,255,0.05)'}; 
                            border: ${isOneRing ? '2px solid #FFD700' : isIlluvatar ? '2px solid #FFA500' : isFlashlight ? '2px solid #FFFF00' : '1px solid rgba(255,215,0,0.3)'}; 
                            border-radius: 10px; padding: 15px; margin: 10px;">
                    <h3 style="color: ${isOneRing ? '#FFD700' : isIlluvatar ? '#FFA500' : isFlashlight ? '#FFFF00' : '#FFD700'}; margin-bottom: 10px;">${recipe.name}</h3>
                    <p style="color: #ccc; margin-bottom: 15px;">${recipe.description}</p>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                        <div style="flex: 1; min-width: 100px;">
                            <h4 style="color: #FF6B6B; margin-bottom: 5px;">INPUT:</h4>
                            ${recipe.input.map(item => `
                                <div style="display: flex; align-items: center; gap: 10px; margin: 5px 0;">
                                    <span style="font-size: 1.5rem;">📦</span>
                                    <span style="color: white;">${item.quantity}x ${item.name || item.rarity || (item.type === 'coin' ? 'Coin' : (item.type === 'diamond' ? 'Diamond' : ''))}</span>
                                </div>
                            `).join('')}
                        </div>
                        
                        <div style="font-size: 2rem; color: #FFD700;">→</div>
                        
                        <div style="flex: 1; min-width: 100px;">
                            <h4 style="color: #4CAF50; margin-bottom: 5px;">OUTPUT:</h4>
                            ${outputHtml}
                        </div>
                    </div>
                    
                    <button class="exchange-btn" ${!canCraft ? 'disabled' : ''}
                            style="width: 100%; margin-top: 15px; padding: 10px; background: ${canCraft ? '#4CAF50' : '#666'}; border: none; border-radius: 6px; color: white; cursor: ${canCraft ? 'pointer' : 'not-allowed'};"
                            onclick="window.exchangeItems(${recipe.id})">
                        ${canCraft ? '🔄 TUKAR' : '❌ BAHAN TIDAK CUKUP'}
                    </button>
                </div>
            `;

            exchangeContainer.appendChild(recipeCard);
        });
    }

    checkExchangeRequirements(recipe) {
        for (const requirement of recipe.input) {
            let count = 0;

            if (requirement.type === 'fish') {
                if (requirement.exactFish || requirement.id) {
                    count = gameData.backpack.filter(f => f.id === requirement.id).length;
                } else {
                    count = gameData.backpack.filter(f => f.rarity === requirement.rarity).length;
                }
            } else if (requirement.type === 'coin') {
                count = Number(gameData.coins);
            } else if (requirement.type === 'diamond') {
                count = Number(gameData.diamonds);
            }

            if (count < Number(requirement.quantity)) {
                return false;
            }
        }
        return true;
    }

    exchangeItems(recipeId) {
        const recipe = EXCHANGE_RECIPES.find(r => r.id === recipeId);
        if (!recipe) return;

        if (!this.checkExchangeRequirements(recipe)) {
            notification.error('❌ Bahan tidak cukup!');
            this.loadExchange();
            return;
        }

        const backupBackpack = [...gameData.backpack];
        const backupCoins = Number(gameData.coins);
        const backupDiamonds = Number(gameData.diamonds);

        try {
            for (const requirement of recipe.input) {
                if (requirement.type === 'fish') {
                    let removed = 0;
                    for (let i = gameData.backpack.length - 1; i >= 0; i--) {
                        if (removed >= Number(requirement.quantity)) break;

                        const fish = gameData.backpack[i];
                        let matches = false;

                        if (requirement.exactFish || requirement.id) {
                            matches = fish.id === requirement.id;
                        } else {
                            matches = fish.rarity === requirement.rarity;
                        }

                        if (matches) {
                            gameData.backpack.splice(i, 1);
                            removed++;
                        }
                    }

                    if (removed < Number(requirement.quantity)) {
                        throw new Error(`Gagal menghapus ${requirement.quantity} ikan`);
                    }

                } else if (requirement.type === 'coin') {
                    if (Number(gameData.coins) < Number(requirement.quantity)) {
                        throw new Error('Coin tidak cukup');
                    }
                    gameData.coins = Number(gameData.coins) - Number(requirement.quantity);

                } else if (requirement.type === 'diamond') {
                    if (Number(gameData.diamonds) < Number(requirement.quantity)) {
                        throw new Error('Diamond tidak cukup');
                    }
                    gameData.diamonds = Number(gameData.diamonds) - Number(requirement.quantity);
                }
            }

            // Process output
            if (recipe.output.type === 'fish') {
                const allFishes = getAllFishes();
                const outputFish = allFishes.find(f => f.id === recipe.output.id);
                if (outputFish) {
                    gameData.backpack.push({
                        ...outputFish,
                        catchTime: Date.now(),
                        perfectCatch: false,
                        fromExchange: true,
                        uniqueId: Date.now() + Math.random()
                    });
                    notification.success(`✅ Dapat ${outputFish.emoji} ${outputFish.name}!`);
                }
            } else if (recipe.output.type === 'rod') {
                const rodToUnlock = RODS.find(r => r.id === recipe.output.id);
                if (rodToUnlock) {
                    rodToUnlock.owned = true;
                    rodToUnlock.unlocked = true;
                    rodToUnlock.fromExchange = true;
                    notification.success(`🏆 Selamat! Mendapatkan ${recipe.output.name}!`);
                }
            } else if (recipe.output.type === 'diamond') {
                gameData.diamonds = Number(gameData.diamonds) + Number(recipe.output.quantity);
                notification.success(`💎 Mendapatkan ${recipe.output.quantity} Diamond!`);
            } else if (recipe.output.type === 'coin') {
                gameData.coins = Number(gameData.coins) + Number(recipe.output.quantity);
                notification.success(`💰 Mendapatkan ${recipe.output.quantity} Coin!`);
            } else if (recipe.output.type === 'special' && recipe.output.id === 'oneRing') {
                gameData.specialItems.oneRing = true;

                gameData.backpack.push({
                    id: 9999,
                    name: '💍 One Ring',
                    emoji: '💍',
                    price: 0,
                    rarity: 'special',
                    fromExchange: true,
                    catchTime: Date.now(),
                    uniqueId: Date.now() + Math.random()
                });

                gameState.addToAquarium({ id: 9999, name: '💍 One Ring', emoji: '💍', rarity: 'special' });

                notification.success('💍 SELAMAT! Kamu mendapatkan ONE RING! Sekarang cari GHOST SHIP di Depth Gear untuk buka dungeon!');
            } else if (recipe.output.type === 'special' && recipe.output.id === 'flashlight') {
                gameData.specialItems.flashlight = true;

                gameData.backpack.push({
                    id: 9998,
                    name: '🔦 Flashlight',
                    emoji: '🔦',
                    price: 0,
                    rarity: 'special',
                    fromExchange: true,
                    catchTime: Date.now(),
                    uniqueId: Date.now() + Math.random()
                });

                gameState.addToAquarium({ id: 9998, name: '🔦 Flashlight', emoji: '🔦', rarity: 'special' });

                notification.success('🔦 SELAMAT! Kamu mendapatkan FLASHLIGHT! Sekarang cari Miner Helm di Depth Gear untuk buka Mining!');
            } else if (recipe.output.type === 'ticket' && recipe.output.id === 'illuvatar') {
                gameData.illuvatarTickets = (gameData.illuvatarTickets || 0) + 1;
                notification.success('🎟️ Mendapatkan 1 Illüvatar Ticket! Buka di menu Gacha!');
            }

            saveManager.forceSave();
            notification.success('✅ Exchange berhasil!');

            uiManager.updateTopBar();
            this.loadExchange();

            // Check unlocks
            if (window.checkDungeonUnlock) window.checkDungeonUnlock();
            if (window.checkMiningUnlock) window.checkMiningUnlock();
            if (window.updateGachaTab) window.updateGachaTab();

        } catch (error) {
            console.error('Exchange error:', error);
            gameData.backpack = backupBackpack;
            gameData.coins = backupCoins;
            gameData.diamonds = backupDiamonds;
            notification.error('❌ Terjadi error! Transaksi dibatalkan.');
            this.loadExchange();
        }
    }
}

// Singleton instance
export const exchangeUI = new ExchangeUI();

// Export untuk global
window.exchangeItems = (id) => exchangeUI.exchangeItems(id);