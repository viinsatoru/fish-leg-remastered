// js/ui/depth-gear-ui.js

import { gameData } from '../core/game-state.js';
import { uiManager } from './ui-manager.js';
import { notification } from './notification.js';
import { saveManager } from '../core/save-manager.js';
import { DEPTH_GEAR } from '../config/constants.js';

export class DepthGearUI {
    constructor() {
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        this.initialized = true;
        console.log('✅ Depth Gear UI initialized');
    }

    loadDepthGearShop() {
        const container = document.getElementById('depth-gear-items');
        if (!container) {
            console.warn('❌ depth-gear-items not found');
            return;
        }

        container.innerHTML = '';

        if (!DEPTH_GEAR || DEPTH_GEAR.length === 0) {
            container.innerHTML = '<p class="empty-message">Tidak ada gear tersedia</p>';
            return;
        }

        DEPTH_GEAR.forEach(gear => {
            const isOwned = gameData.depthGear[gear.id] === true;
            const canAfford = gear.currency === "coins" ? 
                Number(gameData.coins) >= Number(gear.price) : 
                Number(gameData.diamonds) >= Number(gear.price);

            const card = document.createElement('div');
            card.className = 'item-card';
            card.style.cssText = 'background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; margin: 5px; text-align: center;';

            const isGhostShip = gear.id === "ghostShip";
            const isCrown = gear.id === "crownOfSilmarillion";
            const isMinerHelm = gear.id === "minerHelm";

            if (isGhostShip) card.style.border = '2px solid #9400D3';
            if (isCrown) card.style.border = '2px solid #FFD700';
            if (isMinerHelm) card.style.border = '2px solid #8B4513';

            let priceDisplay = gear.currency === 'diamonds' ? `${gear.price} 💎` : `${gear.price} 🪙`;

            card.innerHTML = `
                <div style="font-size: 3rem; margin-bottom: 10px;">${gear.emoji}</div>
                <div style="font-weight: bold; color: ${isGhostShip ? '#FF00FF' : isCrown ? '#FFD700' : isMinerHelm ? '#D2691E' : 'white'}; margin-bottom: 5px;">${gear.name}</div>
                <p style="color: #ccc; font-size: 0.9rem; margin-bottom: 10px;">${gear.description}</p>
                ${isGhostShip ? '<p style="color: #FFD700; font-size: 0.8rem;">✨ WAJIB untuk buka dungeon!</p>' : ''}
                ${isCrown ? '<p style="color: #FFD700; font-size: 0.8rem;">👑 WAJIB untuk buka Valinor!</p>' : ''}
                ${isMinerHelm ? '<p style="color: #FFD700; font-size: 0.8rem;">⛏️ WAJIB untuk buka Mining!</p>' : ''}
                <div style="color: ${gear.currency === 'diamonds' ? '#00ffff' : '#FFD700'}; margin: 10px 0;">${priceDisplay}</div>
                ${isOwned ? 
                    `<button disabled style="width: 100%; padding: 8px; background: #4CAF50; border: none; border-radius: 6px; color: white;">✓ DIMILIKI</button>` :
                    `<button class="buy-gear-btn" ${!canAfford ? 'disabled' : ''} 
                            style="width: 100%; padding: 8px; background: ${canAfford ? '#4CAF50' : '#666'}; border: none; border-radius: 6px; color: white; cursor: ${canAfford ? 'pointer' : 'not-allowed'};">
                        ${canAfford ? '🛒 BELI' : '❌ TIDAK CUKUP'}
                    </button>`
                }
            `;

            const buyBtn = card.querySelector('.buy-gear-btn');
            if (buyBtn && !isOwned && canAfford) {
                buyBtn.addEventListener('click', () => this.buyDepthGear(gear));
            }

            container.appendChild(card);
        });
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
        this.loadDepthGearShop();

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
}

export const depthGearUI = new DepthGearUI();