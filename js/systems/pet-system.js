// js/systems/pet-system.js

import { gameState, gameData } from '../core/game-state.js';
import { eventBus, EVENTS } from '../core/event-bus.js';
import { saveManager } from '../core/save-manager.js';
import { PETS } from '../data/pets.js';

// ==================== PET SYSTEM ====================
class PetSystem {
    constructor() {
        this.pets = PETS;
    }

    // Get all pets
    getAllPets() {
        return this.pets;
    }

    // Get owned pets
    getOwnedPets() {
        return this.pets.filter(p => gameData.pets.owned.includes(p.id));
    }

    // Get unowned pets
    getUnownedPets() {
        return this.pets.filter(p => !gameData.pets.owned.includes(p.id));
    }

    // Get active pets
    getActivePets() {
        const activePets = [];
        const slots = gameData.skills.animalLovers?.unlocked ? 2 : 1;

        if (Array.isArray(gameData.pets.active)) {
            for (let i = 0; i < Math.min(slots, gameData.pets.active.length); i++) {
                const petId = gameData.pets.active[i];
                const pet = this.pets.find(p => p.id === petId);
                if (pet) activePets.push(pet);
            }
        } else if (gameData.pets.active) {
            const pet = this.pets.find(p => p.id === gameData.pets.active);
            if (pet) activePets.push(pet);
        }

        return activePets;
    }

    // Check if pet is active
    isPetActive(petId) {
        return this.getActivePets().some(pet => pet.id === petId);
    }

    // Check if pet is owned
    isPetOwned(petId) {
        return gameData.pets.owned.includes(petId);
    }

    // Get max pet slots
    getMaxSlots() {
        return gameData.skills.animalLovers?.unlocked ? 2 : 1;
    }

    // Get available slots
    getAvailableSlots() {
        const maxSlots = this.getMaxSlots();
        const activeCount = this.getActivePets().length;
        return Math.max(0, maxSlots - activeCount);
    }

    // Buy pet
    buyPet(petId) {
        const pet = this.pets.find(p => p.id === petId);
        if (!pet) return false;

        if (this.isPetOwned(petId)) {
            eventBus.emit(EVENTS.NOTIFICATION, { 
                message: '⚠️ Kamu sudah memiliki pet ini!', 
                type: 'warning' 
            });
            return false;
        }

        if (pet.currency === "coins") {
            if (Number(gameData.coins) < Number(pet.price)) {
                eventBus.emit(EVENTS.NOTIFICATION, { 
                    message: '❌ Koin tidak cukup!', 
                    type: 'error' 
                });
                return false;
            }
            gameData.coins = Number(gameData.coins) - Number(pet.price);
        } else if (pet.currency === "diamonds") {
            if (Number(gameData.diamonds) < Number(pet.price)) {
                eventBus.emit(EVENTS.NOTIFICATION, { 
                    message: '❌ Diamond tidak cukup!', 
                    type: 'error' 
                });
                return false;
            }
            gameData.diamonds = Number(gameData.diamonds) - Number(pet.price);
        } else {
            return false;
        }

        gameData.pets.owned.push(petId);
        saveManager.forceSave();
        
        eventBus.emit(EVENTS.PET_BOUGHT, { pet });
        eventBus.emit(EVENTS.NOTIFICATION, { 
            message: `✅ Berhasil membeli ${pet.name}!`, 
            type: 'success' 
        });
        return true;
    }

    // Activate pet
    activatePet(petId) {
        const pet = this.pets.find(p => p.id === petId);
        if (!pet) return false;

        if (!this.isPetOwned(petId)) {
            eventBus.emit(EVENTS.NOTIFICATION, { 
                message: '❌ Kamu belum memiliki pet ini!', 
                type: 'error' 
            });
            return false;
        }

        if (!Array.isArray(gameData.pets.active)) {
            if (gameData.pets.active) {
                gameData.pets.active = [gameData.pets.active];
            } else {
                gameData.pets.active = [];
            }
        }

        if (gameData.pets.active.includes(petId)) {
            // Deactivate
            gameData.pets.active = gameData.pets.active.filter(id => id !== petId);
            saveManager.forceSave();
            eventBus.emit(EVENTS.PET_DEACTIVATED, { pet });
            eventBus.emit(EVENTS.NOTIFICATION, { 
                message: `❌ ${pet.name} dinonaktifkan!`, 
                type: 'info' 
            });
            return true;
        }

        // Activate
        const maxSlots = this.getMaxSlots();
        if (gameData.pets.active.length >= maxSlots) {
            eventBus.emit(EVENTS.NOTIFICATION, { 
                message: `❌ Slot pet penuh! (max ${maxSlots})`, 
                type: 'error' 
            });
            return false;
        }

        gameData.pets.active.push(petId);
        saveManager.forceSave();
        eventBus.emit(EVENTS.PET_ACTIVATED, { pet });
        eventBus.emit(EVENTS.NOTIFICATION, { 
            message: `✨ ${pet.name} aktif!`, 
            type: 'success' 
        });
        return true;
    }

    // Toggle pet active status
    togglePet(petId) {
        if (this.isPetActive(petId)) {
            return this.activatePet(petId); // This will deactivate
        } else {
            return this.activatePet(petId);
        }
    }

    // Get pet effect description
    getPetEffectDescription(petId) {
        const pet = this.pets.find(p => p.id === petId);
        if (!pet) return '';
        return pet.description;
    }

    // Get pet by id
    getPetById(petId) {
        return this.pets.find(p => p.id === petId);
    }

    // Reset pets (untuk testing)
    reset() {
        gameData.pets = {
            owned: [],
            active: [],
            activeSlots: 1
        };
        saveManager.forceSave();
    }
}

// Singleton instance
export const petSystem = new PetSystem();

// Export untuk kompatibilitas
export const getActivePets = () => petSystem.getActivePets();
export const hasActivePet = (id) => petSystem.isPetActive(id);
export const loadPetShop = () => petSystem.getAllPets();
export const buyPet = (id) => petSystem.buyPet(id);
export const activatePet = (id) => petSystem.activatePet(id);