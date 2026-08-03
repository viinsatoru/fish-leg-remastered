// js/ui/aquarium-ui.js

import { gameState, gameData } from '../core/game-state.js';
import { getAllFishes } from '../data/fishing-spots.js';

// ==================== AQUARIUM UI ====================
class AquariumUI {
    constructor() {
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        this.initialized = true;
        console.log('✅ Aquarium UI initialized');
    }

    loadAquarium() {
        this.updateAquariumStats();
        this.loadFishTank('basic', 'basic-tank');
        this.loadFishTank('legendary', 'legendary-tank');
        this.loadFishTank('mythical', 'mythical-tank');
        this.loadFishTank('secret', 'secret-tank');
        this.loadFishTank('special', 'special-tank');
    }

    loadFishTank(rarity, tankId) {
        const tank = document.getElementById(tankId);
        if (!tank) return;

        const rarityNames = {
            basic: 'Basic Fish',
            legendary: 'Legendary Fish',
            mythical: 'Mythical Fish',
            secret: 'Secret Fish',
            special: 'Special Fish'
        };

        tank.innerHTML = `<h4 style="color: #FFD700; margin-bottom: 10px;">${rarityNames[rarity] || rarity}</h4>`;

        const fishInTank = gameData.aquarium[rarity] || {};

        if (Object.keys(fishInTank).length === 0) {
            tank.innerHTML += '<div class="empty-tank" style="color: #ccc; padding: 20px; text-align: center;">Belum ada ikan</div>';
            return;
        }

        const allFishes = getAllFishes();
        const fishContainer = document.createElement('div');
        fishContainer.style.cssText = 'display: flex; flex-wrap: wrap; gap: 10px; padding: 10px;';

        Object.keys(fishInTank).forEach(fishId => {
            const fish = allFishes.find(f => f.id == fishId);
            if (fish) {
                const fishElement = document.createElement('div');
                fishElement.className = 'fish-in-tank';
                fishElement.style.cssText = `
                    font-size: 2rem;
                    padding: 10px;
                    background: rgba(255,255,255,0.05);
                    border-radius: 8px;
                    cursor: pointer;
                    text-align: center;
                    min-width: 60px;
                    transition: all 0.3s;
                `;
                fishElement.title = `${fish.name} (${fishInTank[fishId]}x)`;
                fishElement.innerHTML = `
                    <div>${fish.emoji}</div>
                    <div style="font-size: 0.7rem; color: #888;">${fishInTank[fishId]}x</div>
                `;

                fishElement.addEventListener('mouseenter', () => {
                    fishElement.style.background = 'rgba(255,215,0,0.2)';
                    fishElement.style.transform = 'scale(1.1)';
                });
                fishElement.addEventListener('mouseleave', () => {
                    fishElement.style.background = 'rgba(255,255,255,0.05)';
                    fishElement.style.transform = 'scale(1)';
                });

                fishContainer.appendChild(fishElement);
            }
        });

        tank.appendChild(fishContainer);
    }

    updateAquariumStats() {
        const speciesCount = document.getElementById('species-count');
        const totalSpecies = document.getElementById('total-species');
        const collectionPercent = document.getElementById('collection-percent');

        if (!speciesCount || !totalSpecies || !collectionPercent) return;

        const totalCollected = Object.values(gameData.aquarium).reduce((total, rarity) => {
            return total + Object.keys(rarity).length;
        }, 0);

        const allFishes = getAllFishes();
        const totalPossible = allFishes.length;
        const percent = totalPossible > 0 ? Math.round((totalCollected / totalPossible) * 100) : 0;

        speciesCount.textContent = totalCollected;
        totalSpecies.textContent = totalPossible;
        collectionPercent.textContent = percent + '%';
    }

    // Helper untuk mendapatkan semua ikan
    getAllFishes() {
        return getAllFishes();
    }
}

// Singleton instance
export const aquariumUI = new AquariumUI();