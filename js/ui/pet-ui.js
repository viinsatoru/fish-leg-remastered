// js/ui/pet-ui.js - FULL FIXED

import { gameData } from '../core/game-state.js';
import { uiManager } from './ui-manager.js';
import { notification } from './notification.js';
import { saveManager } from '../core/save-manager.js';
import { PETS } from '../data/pets.js';

export class PetUI {
    constructor() {
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        this.initialized = true;
        console.log('✅ Pet UI initialized');
    }

    loadPetShop() {
        const container = document.getElementById('pet-shop-items');
        if (!container) {
            console.warn('❌ pet-shop-items not found');
            return;
        }

        container.innerHTML = '';

        if (!PETS || PETS.length === 0) {
            container.innerHTML = '<p class="empty-message">Belum ada pet tersedia</p>';
            return;
        }

        // Tampilkan slot info
        const slots = gameData.skills.animalLovers?.unlocked ? 2 : 1;
        const activeCount = this.getActivePets().length;
        const slotInfo = document.createElement('div');
        slotInfo.style.cssText = 'text-align:center;padding:10px;margin-bottom:15px;background:rgba(255,215,0,0.1);border-radius:8px;';
        slotInfo.innerHTML = `
            <span style="color:#FFD700;">🐕 Slot Pet: ${activeCount}/${slots}</span>
            ${activeCount >= slots ? '<span style="color:#FF6B6B;margin-left:10px;">⚠️ Penuh!</span>' : ''}
            ${!gameData.skills.animalLovers?.unlocked ? '<span style="color:#00ffff;margin-left:10px;">💡 Beli Animal Lovers di Skills untuk +1 slot!</span>' : ''}
        `;
        container.appendChild(slotInfo);

        PETS.forEach(pet => {
            const isOwned = gameData.pets.owned.includes(pet.id);
            const isActive = this.isPetActive(pet.id);
            const canAfford = pet.currency === "coins" ? 
                Number(gameData.coins) >= Number(pet.price) : 
                Number(gameData.diamonds) >= Number(pet.price);

            const card = document.createElement('div');
            card.className = 'pet-card';
            card.style.cssText = 'text-align:center;background:rgba(255,255,255,0.05);padding:15px;border-radius:8px;margin:10px;border:1px solid rgba(255,255,255,0.05);';

            let priceDisplay = pet.currency === 'diamonds' ? `${pet.price} 💎` : `${pet.price} 🪙`;

            let buttonHTML = '';
            if (isOwned) {
                buttonHTML = `
                    <button class="pet-activate-btn"
                            style="width:100%;padding:8px;background:${isActive ? '#FF6B6B' : '#4CAF50'};border:none;border-radius:6px;color:white;cursor:pointer;font-size:0.85rem;"
                            onclick="window.activatePet(${pet.id})">
                        ${isActive ? '❌ DEACTIVATE' : '🔓 ACTIVATE'}
                    </button>
                `;
            } else {
                buttonHTML = `
                    <button class="pet-buy-btn" ${!canAfford ? 'disabled' : ''}
                            style="width:100%;padding:8px;background:${canAfford ? '#4CAF50' : '#666'};border:none;border-radius:6px;color:white;cursor:${canAfford ? 'pointer' : 'not-allowed'};font-size:0.85rem;"
                            onclick="window.buyPet(${pet.id})">
                        ${canAfford ? '🛒 BELI' : '❌ TIDAK CUKUP'}
                    </button>
                `;
            }

            card.innerHTML = `
                <div style="font-size:3rem;margin-bottom:8px;">${pet.emoji}</div>
                <h3 style="color:white;font-size:1rem;margin-bottom:4px;">${pet.name}</h3>
                <p style="color:#ccc;font-size:0.85rem;margin-bottom:8px;">${pet.description}</p>
                <p style="color:${pet.currency === 'diamonds' ? '#00ffff' : '#ffd700'};font-size:0.9rem;margin-bottom:10px;">${priceDisplay}</p>
                ${isActive ? '<div style="color:#4CAF50;font-size:0.8rem;margin-bottom:8px;">✅ ACTIVE</div>' : ''}
                ${buttonHTML}
            `;

            container.appendChild(card);
        });
    }

    isPetActive(petId) {
        const activePets = this.getActivePets();
        return activePets.some(pet => pet.id === petId);
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

    // ============ FIX: buyPet PAKAI petId ============
    buyPet(petId) {
        const pet = PETS.find(p => p.id === petId);
        if (!pet) {
            notification.error('❌ Pet tidak ditemukan!');
            return;
        }

        if (pet.currency === "coins") {
            if (Number(gameData.coins) >= Number(pet.price)) {
                gameData.coins = Number(gameData.coins) - Number(pet.price);
            } else {
                notification.error('❌ Koin tidak cukup!');
                return;
            }
        } else if (pet.currency === "diamonds") {
            if (Number(gameData.diamonds) >= Number(pet.price)) {
                gameData.diamonds = Number(gameData.diamonds) - Number(pet.price);
            } else {
                notification.error('❌ Diamond tidak cukup!');
                return;
            }
        } else {
            notification.error('❌ Tidak cukup resources!');
            return;
        }

        gameData.pets.owned.push(pet.id);
        saveManager.forceSave();
        notification.success(`✅ Berhasil membeli ${pet.name}!`);
        uiManager.updateTopBar();
        this.loadPetShop();
    }

    activatePet(petId) {
        const pet = PETS.find(p => p.id === petId);
        if (!pet) {
            notification.error('❌ Pet tidak ditemukan!');
            return;
        }

        if (!gameData.pets.owned.includes(petId)) {
            notification.error('❌ Kamu belum memiliki pet ini!');
            return;
        }

        const slots = gameData.skills.animalLovers?.unlocked ? 2 : 1;

        if (!Array.isArray(gameData.pets.active)) {
            if (gameData.pets.active) {
                gameData.pets.active = [gameData.pets.active];
            } else {
                gameData.pets.active = [];
            }
        }

        if (gameData.pets.active.includes(petId)) {
            gameData.pets.active = gameData.pets.active.filter(id => id !== petId);
            notification.info(`❌ ${pet.name} dinonaktifkan!`);
            saveManager.forceSave();
            this.loadPetShop();
            uiManager.updateLuckDisplay();
            return;
        }

        if (gameData.pets.active.length >= slots) {
            notification.error(`❌ Slot pet penuh! (max ${slots})`);
            return;
        }

        gameData.pets.active.push(petId);
        notification.success(`✨ ${pet.name} aktif!`);
        saveManager.forceSave();
        this.loadPetShop();
        uiManager.updateLuckDisplay();
    }
}

export const petUI = new PetUI();

window.buyPet = (id) => petUI.buyPet(id);
window.activatePet = (id) => petUI.activatePet(id);
