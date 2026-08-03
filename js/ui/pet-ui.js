// js/ui/pet-ui.js

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

        PETS.forEach(pet => {
            const isOwned = gameData.pets.owned.includes(pet.id);
            const isActive = this.isPetActive(pet.id);
            const canAfford = pet.currency === "coins" ? 
                Number(gameData.coins) >= Number(pet.price) : 
                Number(gameData.diamonds) >= Number(pet.price);

            const card = document.createElement('div');
            card.className = 'pet-card';
            card.style.cssText = 'text-align: center; background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px;';

            let priceDisplay = pet.currency === 'diamonds' ? `${pet.price} 💎` : `${pet.price} 🪙`;

            card.innerHTML = `
                <div style="font-size: 3rem; margin-bottom: 10px;">${pet.emoji}</div>
                <h3 style="color: white; margin-bottom: 5px;">${pet.name}</h3>
                <p style="color: #ccc; font-size: 0.9rem; margin-bottom: 10px;">${pet.description}</p>
                <p style="color: ${pet.currency === 'diamonds' ? '#00ffff' : '#ffd700'}; margin-bottom: 15px;">${priceDisplay}</p>
                ${isOwned ? 
                    `<button class="pet-activate-btn" ${isActive ? 'disabled' : ''}
                            style="width: 100%; padding: 8px; background: ${isActive ? '#666' : '#4CAF50'}; border: none; border-radius: 6px; color: white; cursor: ${isActive ? 'not-allowed' : 'pointer'};">
                        ${isActive ? '✓ ACTIVE' : '🔓 ACTIVATE'}
                    </button>` :
                    `<button class="pet-buy-btn" ${!canAfford ? 'disabled' : ''}
                            style="width: 100%; padding: 8px; background: ${canAfford ? '#4CAF50' : '#666'}; border: none; border-radius: 6px; color: white; cursor: ${canAfford ? 'pointer' : 'not-allowed'};">
                        ${canAfford ? '🛒 BELI' : '❌ TIDAK CUKUP'}
                    </button>`
                }
            `;

            const btn = card.querySelector('.pet-buy-btn, .pet-activate-btn');
            if (btn) {
                btn.addEventListener('click', () => {
                    if (isOwned) {
                        this.activatePet(pet.id);
                    } else if (canAfford) {
                        this.buyPet(pet);
                    }
                });
            }

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

    buyPet(pet) {
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
            notification.info(`❌ ${PETS.find(p => p.id === petId).name} dinonaktifkan!`);
        } else {
            if (gameData.pets.active.length >= slots) {
                notification.error(`❌ Slot pet penuh! (max ${slots})`);
                return;
            }
            gameData.pets.active.push(petId);
            notification.success(`✨ ${PETS.find(p => p.id === petId).name} aktif!`);
        }

        saveManager.forceSave();
        this.loadPetShop();
        uiManager.updateLuckDisplay();
    }
}

export const petUI = new PetUI();