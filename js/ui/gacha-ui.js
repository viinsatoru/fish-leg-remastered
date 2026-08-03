// js/ui/gacha-ui.js

import { gameState, gameData } from '../core/game-state.js';
import { uiManager } from './ui-manager.js';
import { modalManager } from './modals.js';
import { notification } from './notification.js';
import { saveManager } from '../core/save-manager.js';
import { 
    GACHA_RODS, 
    SECRET_FISH_POOL, 
    CRYPTO_GACHA, 
    ILLUVATAR_GACHA, 
    MYSTERY_BOXES,
    RODS,
    BAITS
} from '../data/equipment.js';
import { getAllFishes } from '../data/fishing-spots.js';
import { petSystem } from '../systems/pet-system.js';

// ==================== GACHA UI ====================
class GachaUI {
    constructor() {
        this.gachaSection = null;
        this.gachaModal = null;
        this.gachaTitle = null;
        this.gachaContent = null;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;

        this.gachaSection = document.querySelector('.gacha-section');
        this.gachaModal = document.getElementById('gacha-modal');
        this.gachaTitle = document.getElementById('gacha-title');
        this.gachaContent = document.getElementById('gacha-content');

        const gachaBtn = document.getElementById('gacha-btn');
        if (gachaBtn) {
            gachaBtn.addEventListener('click', () => this.spinGacha());
        }

        this.initialized = true;
        console.log('✅ Gacha UI initialized');
    }

    updateGachaTab() {
        this.updateGachaStats();
        this.loadGachaRewards();
        this.createGachaButtons();
    }

    updateGachaStats() {
        const totalSpins = document.getElementById('total-spins');
        const rodsObtained = document.getElementById('rods-obtained');
        const secretGachaCount = document.getElementById('secret-gacha-count');
        const cryptoGachaCount = document.getElementById('crypto-gacha-count');
        const illuvatarGachaCount = document.getElementById('illuvatar-gacha-count');

        if (totalSpins) totalSpins.textContent = gameData.gachaStats.totalSpins;
        if (rodsObtained) rodsObtained.textContent = gameData.gachaStats.rodsObtained.length;
        if (secretGachaCount) secretGachaCount.textContent = gameData.gachaStats.secretGachaCount;
        if (cryptoGachaCount) cryptoGachaCount.textContent = gameData.gachaStats.cryptoGachaCount;
        if (illuvatarGachaCount) illuvatarGachaCount.textContent = gameData.gachaStats.illuvatarGachaCount;
    }

    loadGachaRewards() {
        const gachaRewards = document.getElementById('gacha-rewards');
        if (!gachaRewards) return;

        gachaRewards.innerHTML = '';

        GACHA_RODS.forEach(rod => {
            const rewardItem = document.createElement('div');
            rewardItem.className = 'gacha-reward-item';
            const isObtained = gameData.gachaStats.rodsObtained.includes(rod.id);

            rewardItem.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px; margin: 5px 0;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 1.5rem;">${rod.emoji}</span>
                        <div>
                            <div style="font-weight: bold; color: ${this.getRarityColor(rod.rarity)}">${rod.name}</div>
                            <div style="font-size: 0.8rem; color: #00ffff;">Luck: +${rod.luck}x</div>
                        </div>
                    </div>
                    <div style="color: ${isObtained ? '#4CAF50' : '#FF6B6B'}; font-size: 0.9rem;">
                        ${isObtained ? '✓ Obtained' : 'Not Obtained'}
                    </div>
                </div>
            `;

            gachaRewards.appendChild(rewardItem);
        });
    }

    createGachaButtons() {
        if (!this.gachaSection) return;

        const oldSecretBtn = document.getElementById('secret-gacha-btn');
        const oldCryptoBtn = document.getElementById('crypto-gacha-btn');
        const oldIlluvatarBtn = document.getElementById('illuvatar-gacha-btn');
        const oldBasicBox = document.getElementById('basic-box-btn');
        const oldNormalBox = document.getElementById('normal-box-btn');
        const oldSecretBox = document.getElementById('secret-box-btn');

        if (oldSecretBtn) oldSecretBtn.remove();
        if (oldCryptoBtn) oldCryptoBtn.remove();
        if (oldIlluvatarBtn) oldIlluvatarBtn.remove();
        if (oldBasicBox) oldBasicBox.remove();
        if (oldNormalBox) oldNormalBox.remove();
        if (oldSecretBox) oldSecretBox.remove();

        const secretGachaBtn = document.createElement('button');
        secretGachaBtn.id = 'secret-gacha-btn';
        secretGachaBtn.className = 'gacha-btn';
        secretGachaBtn.style.marginTop = '20px';
        secretGachaBtn.style.background = 'linear-gradient(45deg, #00FFFF, #FF00FF)';
        secretGachaBtn.innerHTML = '🎁 Gacha Ikan Secret (75 💎)';
        secretGachaBtn.onclick = () => this.spinSecretGacha();

        const cryptoGachaBtn = document.createElement('button');
        cryptoGachaBtn.id = 'crypto-gacha-btn';
        cryptoGachaBtn.className = 'gacha-btn';
        cryptoGachaBtn.style.marginTop = '10px';
        cryptoGachaBtn.style.background = 'linear-gradient(45deg, #F7931A, #4CAF50)';
        cryptoGachaBtn.innerHTML = '🎰 Gacha Crypto (25 💎)';
        cryptoGachaBtn.onclick = () => this.spinCryptoGacha();

        const illuvatarGachaBtn = document.createElement('button');
        illuvatarGachaBtn.id = 'illuvatar-gacha-btn';
        illuvatarGachaBtn.className = 'gacha-btn';
        illuvatarGachaBtn.style.marginTop = '10px';
        illuvatarGachaBtn.style.background = 'linear-gradient(45deg, #FFD700, #FFA500)';
        illuvatarGachaBtn.innerHTML = `📦 Chest Illüvatar (🎟️ ${gameData.illuvatarTickets || 0})`;
        illuvatarGachaBtn.onclick = () => this.spinIlluvatarGacha();

        const gachaStats = this.gachaSection.querySelector('.gacha-stats');
        if (gachaStats) {
            gachaStats.after(secretGachaBtn);
            secretGachaBtn.after(cryptoGachaBtn);
            cryptoGachaBtn.after(illuvatarGachaBtn);
        }

        const mysteryBoxDiv = document.createElement('div');
        mysteryBoxDiv.className = 'mystery-boxes';
        mysteryBoxDiv.style.marginTop = '30px';
        mysteryBoxDiv.style.padding = '20px';
        mysteryBoxDiv.style.background = 'rgba(0,0,0,0.3)';
        mysteryBoxDiv.style.borderRadius = '10px';

        mysteryBoxDiv.innerHTML = `
            <h3 style="color: #FFD700; margin-bottom: 15px;">🎁 MYSTERY BOXES</h3>
            <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                <div style="flex: 1; min-width: 200px; background: rgba(255,255,255,0.05); padding: 15px; border-radius: 10px; text-align: center;">
                    <div style="font-size: 3rem;">📦</div>
                    <h4 style="color: white;">Basic Box</h4>
                    <p style="color: #ccc;">1000 coin</p>
                    <button id="basic-box-btn" onclick="window.buyMysteryBox('basic')" class="gacha-btn" style="padding: 10px 20px; font-size: 14px; margin: 0;">Beli</button>
                </div>
                <div style="flex: 1; min-width: 200px; background: rgba(255,255,255,0.05); padding: 15px; border-radius: 10px; text-align: center;">
                    <div style="font-size: 3rem;">📦✨</div>
                    <h4 style="color: white;">Normal Box</h4>
                    <p style="color: #ccc;">5000 coin</p>
                    <button id="normal-box-btn" onclick="window.buyMysteryBox('normal')" class="gacha-btn" style="padding: 10px 20px; font-size: 14px; margin: 0;">Beli</button>
                </div>
                <div style="flex: 1; min-width: 200px; background: rgba(255,255,255,0.05); padding: 15px; border-radius: 10px; text-align: center;">
                    <div style="font-size: 3rem;">📦💎</div>
                    <h4 style="color: white;">Secret Box</h4>
                    <p style="color: #00ffff;">100 diamond</p>
                    <button id="secret-box-btn" onclick="window.buyMysteryBox('secret')" class="gacha-btn" style="padding: 10px 20px; font-size: 14px; margin: 0; background: linear-gradient(45deg, #FF00FF, #00FFFF);">Beli</button>
                </div>
            </div>
        `;

        if (illuvatarGachaBtn) {
            illuvatarGachaBtn.after(mysteryBoxDiv);
        } else {
            this.gachaSection.appendChild(mysteryBoxDiv);
        }
    }

    spinGacha() {
        if (Number(gameData.coins) < 500) {
            notification.error('❌ Koin tidak cukup! Butuh 500 koin');
            return;
        }

        gameData.coins = Number(gameData.coins) - 500;
        gameData.gachaStats.totalSpins = Number(gameData.gachaStats.totalSpins) + 1;

        let luckMultiplier = 1;
        if (petSystem.isPetActive(7)) luckMultiplier = 2;

        const random = Math.random() * 100 / luckMultiplier;
        let cumulativeChance = 0;
        let obtainedRod = null;

        for (const rod of GACHA_RODS) {
            cumulativeChance += rod.chance;
            if (random <= cumulativeChance) {
                obtainedRod = rod;
                break;
            }
        }

        if (!obtainedRod) {
            obtainedRod = GACHA_RODS[0];
        }

        if (!gameData.gachaStats.rodsObtained.includes(obtainedRod.id)) {
            gameData.gachaStats.rodsObtained.push(obtainedRod.id);
        }

        saveManager.forceSave();
        this.showGachaResult(obtainedRod);
        uiManager.updateTopBar();
        this.updateGachaTab();
    }

    showGachaResult(rod) {
        if (!this.gachaModal || !this.gachaTitle || !this.gachaContent) return;

        this.gachaTitle.textContent = 'Hasil Gacha!';
        this.gachaContent.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <div style="font-size: 4rem; margin: 20px 0;">${rod.emoji}</div>
                <h3 style="color: ${this.getRarityColor(rod.rarity)}; margin-bottom: 10px;">${rod.name}</h3>
                <p style="color: #ccc;">Rarity: ${rod.rarity.toUpperCase()}</p>
                <p style="color: #00ffff;">Luck Bonus: +${rod.luck}x</p>
                <p style="color: #4CAF50; margin-top: 20px;">🎉 Selamat! Rod baru telah ditambahkan!</p>
                <button onclick="modalManager.close('gacha-modal')" 
                        style="margin-top: 20px; padding: 10px 30px; background: #4CAF50; border: none; border-radius: 25px; color: white; cursor: pointer;">
                    OK
                </button>
            </div>
        `;

        modalManager.open('gacha-modal');
    }

    spinSecretGacha() {
        if (Number(gameData.diamonds) < 75) {
            notification.error('❌ Diamond tidak cukup! Butuh 75 💎');
            return;
        }

        gameData.diamonds = Number(gameData.diamonds) - 75;
        gameData.gachaStats.secretGachaCount = Number(gameData.gachaStats.secretGachaCount) + 1;

        const randomIndex = Math.floor(Math.random() * SECRET_FISH_POOL.length);
        const secretFish = { ...SECRET_FISH_POOL[randomIndex] };

        gameData.backpack.push({
            ...secretFish,
            catchTime: Date.now(),
            perfectCatch: false,
            fromGacha: true,
            uniqueId: Date.now() + Math.random()
        });

        gameState.addToAquarium(secretFish);
        saveManager.forceSave();

        this.showSecretGachaResult(secretFish);
        uiManager.updateTopBar();
        this.updateGachaTab();
    }

    showSecretGachaResult(fish) {
        if (!this.gachaModal || !this.gachaTitle || !this.gachaContent) return;

        this.gachaTitle.textContent = 'Gacha Ikan Secret!';
        this.gachaContent.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <div style="font-size: 5rem; margin: 20px 0; animation: bounce 1s infinite;">${fish.emoji}</div>
                <h3 style="color: #00FFFF; margin-bottom: 10px;">${fish.name}</h3>
                <p style="color: #ccc;">Rarity: ${fish.rarity.toUpperCase()}</p>
                <p style="color: #FFD700; font-size: 1.5rem;">${fish.price} koin</p>
                <p style="color: #4CAF50; margin-top: 20px;">✓ Ditambahkan ke backpack!</p>
                <button onclick="modalManager.close('gacha-modal')" 
                        style="margin-top: 20px; padding: 10px 30px; background: #4CAF50; border: none; border-radius: 25px; color: white; cursor: pointer;">
                    OK
                </button>
            </div>
        `;

        modalManager.open('gacha-modal');
    }

    spinCryptoGacha() {
        if (Number(gameData.diamonds) < 25) {
            notification.error('❌ Diamond tidak cukup! Butuh 25 💎');
            return;
        }

        gameData.diamonds = Number(gameData.diamonds) - 25;
        gameData.gachaStats.cryptoGachaCount = Number(gameData.gachaStats.cryptoGachaCount) + 1;

        const random = Math.random() * 100;
        let cumulative = 0;
        let selectedItem = null;

        for (const item of CRYPTO_GACHA.items) {
            cumulative += item.chance;
            if (random <= cumulative) {
                selectedItem = item;
                break;
            }
        }

        if (!selectedItem) selectedItem = CRYPTO_GACHA.items[0];

        const allFishes = getAllFishes();
        const cryptoFish = allFishes.find(f => f.id === selectedItem.id);

        if (cryptoFish) {
            gameData.backpack.push({
                ...cryptoFish,
                catchTime: Date.now(),
                perfectCatch: false,
                fromCryptoGacha: true,
                uniqueId: Date.now() + Math.random()
            });

            gameState.addToAquarium(cryptoFish);
            saveManager.forceSave();

            this.showCryptoGachaResult(cryptoFish);
            uiManager.updateTopBar();
            this.updateGachaTab();
        }
    }

    showCryptoGachaResult(fish) {
        if (!this.gachaModal || !this.gachaTitle || !this.gachaContent) return;

        this.gachaTitle.textContent = '🎰 Crypto Gacha';
        this.gachaContent.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <div style="font-size: 5rem; margin: 20px 0; animation: bounce 1s infinite;">${fish.emoji}</div>
                <h3 style="color: #F7931A; margin-bottom: 10px;">${fish.name}</h3>
                <p style="color: #ccc;">Rarity: ${fish.rarity.toUpperCase()}</p>
                <p style="color: #FFD700; font-size: 1.5rem;">${fish.price} koin</p>
                <p style="color: #4CAF50; margin-top: 20px;">✓ Ditambahkan ke backpack!</p>
                <button onclick="modalManager.close('gacha-modal')" 
                        style="margin-top: 20px; padding: 10px 30px; background: #4CAF50; border: none; border-radius: 25px; color: white; cursor: pointer;">
                    OK
                </button>
            </div>
        `;

        modalManager.open('gacha-modal');
    }

    spinIlluvatarGacha() {
        if (gameData.illuvatarTickets < 1) {
            notification.error('❌ Ticket tidak cukup! Tukar 10 ikan Mythical di Exchange untuk mendapatkan ticket!');
            return;
        }

        gameData.illuvatarTickets--;
        gameData.gachaStats.illuvatarGachaCount = (gameData.gachaStats.illuvatarGachaCount || 0) + 1;

        const random = Math.random() * 100;
        let cumulative = 0;
        let selectedItem = null;

        for (const item of ILLUVATAR_GACHA.items) {
            cumulative += item.chance;
            if (random <= cumulative) {
                selectedItem = item;
                break;
            }
        }

        if (!selectedItem) selectedItem = ILLUVATAR_GACHA.items[0];

        const fish = {
            id: selectedItem.id,
            name: selectedItem.name,
            emoji: selectedItem.emoji,
            price: selectedItem.price,
            rarity: selectedItem.rarity,
            spot: 'illuvatar'
        };

        gameData.backpack.push({
            ...fish,
            catchTime: Date.now(),
            perfectCatch: false,
            fromIlluvatarGacha: true,
            uniqueId: Date.now() + Math.random()
        });

        gameState.addToAquarium(fish);
        saveManager.forceSave();

        this.showIlluvatarGachaResult(fish);
        uiManager.updateTopBar();
        this.updateGachaTab();
    }

    showIlluvatarGachaResult(fish) {
        if (!this.gachaModal || !this.gachaTitle || !this.gachaContent) return;

        this.gachaTitle.textContent = '📦 Chest Illüvatar';
        this.gachaContent.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <div style="font-size: 5rem; margin: 20px 0; animation: bounce 1s infinite;">${fish.emoji}</div>
                <h3 style="color: ${this.getRarityColor(fish.rarity)}; margin-bottom: 10px;">${fish.name}</h3>
                <p style="color: #ccc;">Rarity: ${fish.rarity.toUpperCase()}</p>
                <p style="color: #FFD700; font-size: 1.5rem;">${fish.price} koin</p>
                <p style="color: #4CAF50; margin-top: 20px;">✓ Ditambahkan ke backpack!</p>
                <button onclick="modalManager.close('gacha-modal')" 
                        style="margin-top: 20px; padding: 10px 30px; background: #4CAF50; border: none; border-radius: 25px; color: white; cursor: pointer;">
                    OK
                </button>
            </div>
        `;

        modalManager.open('gacha-modal');
    }

    buyMysteryBox(boxType) {
        const box = MYSTERY_BOXES[boxType];
        if (!box) return;

        if (box.currency === 'coins') {
            if (Number(gameData.coins) < Number(box.price)) {
                notification.error(`❌ Koin tidak cukup! Butuh ${box.price} koin`);
                return;
            }
            gameData.coins = Number(gameData.coins) - Number(box.price);
        } else if (box.currency === 'diamonds') {
            if (Number(gameData.diamonds) < Number(box.price)) {
                notification.error(`❌ Diamond tidak cukup! Butuh ${box.price} diamond`);
                return;
            }
            gameData.diamonds = Number(gameData.diamonds) - Number(box.price);
        } else {
            return;
        }

        gameData.gachaStats.mysteryBoxes[boxType] = Number(gameData.gachaStats.mysteryBoxes[boxType]) + 1;

        const random = Math.random() * 100;
        let cumulative = 0;
        let selectedItem = null;

        for (const item of box.items) {
            cumulative += item.chance;
            if (random <= cumulative) {
                selectedItem = item;
                break;
            }
        }

        if (!selectedItem) selectedItem = box.items[0];

        this.processMysteryBoxReward(selectedItem, boxType);
    }

    processMysteryBoxReward(item, boxType) {
        let rewardMessage = '';

        switch(item.type) {
            case 'coins':
                gameData.coins = Number(gameData.coins) + Number(item.amount);
                rewardMessage = `💰 +${item.amount} koin!`;
                break;

            case 'diamonds':
                gameData.diamonds = Number(gameData.diamonds) + Number(item.amount);
                rewardMessage = `💎 +${item.amount} diamond!`;
                break;

            case 'rod':
                const rodToGive = RODS.find(r => r.id === item.id);
                if (rodToGive) {
                    rodToGive.owned = true;
                    rewardMessage = `🎣 Mendapatkan ${rodToGive.name}!`;
                }
                break;

            case 'bait':
                const baitToGive = BAITS.find(b => b.id === item.id);
                if (baitToGive) {
                    baitToGive.owned = true;
                    rewardMessage = `🪱 Mendapatkan ${baitToGive.name}!`;
                }
                break;

            case 'secretFish':
                const randomIndex = Math.floor(Math.random() * SECRET_FISH_POOL.length);
                const secretFish = { ...SECRET_FISH_POOL[randomIndex] };

                gameData.backpack.push({
                    ...secretFish,
                    catchTime: Date.now(),
                    perfectCatch: false,
                    fromMysteryBox: true,
                    uniqueId: Date.now() + Math.random()
                });

                gameState.addToAquarium(secretFish);
                rewardMessage = `🐟 Mendapatkan ${secretFish.name}!`;
                break;
        }

        saveManager.forceSave();
        this.showMysteryBoxResult(boxType, item, rewardMessage);
        uiManager.updateTopBar();
    }

    showMysteryBoxResult(boxType, item, rewardMessage) {
        const box = MYSTERY_BOXES[boxType];

        if (!this.gachaModal || !this.gachaTitle || !this.gachaContent) return;

        this.gachaTitle.textContent = `🎁 ${box.name}`;

        let emoji = '🎁';
        if (item.emoji) emoji = item.emoji;
        else if (item.type === 'coins') emoji = '💰';
        else if (item.type === 'diamonds') emoji = '💎';

        this.gachaContent.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <div style="font-size: 5rem; margin: 20px 0; animation: bounce 1s infinite;">${emoji}</div>
                <h3 style="color: #FFD700; margin-bottom: 10px;">Selamat!</h3>
                <p style="color: white; font-size: 1.2rem; margin-bottom: 20px;">${rewardMessage}</p>
                <p style="color: #00ffff;">Dari ${box.name}</p>
                <button onclick="modalManager.close('gacha-modal')" 
                        style="margin-top: 20px; padding: 10px 30px; background: #4CAF50; border: none; border-radius: 25px; color: white; cursor: pointer;">
                    OK
                </button>
            </div>
        `;

        modalManager.open('gacha-modal');
    }

    getRarityColor(rarity) {
        switch(rarity) {
            case 'common': return '#87CEEB';
            case 'rare': return '#4CAF50';
            case 'epic': return '#FF69B4';
            case 'legendary': return '#FFD700';
            case 'mythical': return '#FF0000';
            case 'secret': return '#00FFFF';
            case 'special': return '#FF00FF';
            default: return '#FFFFFF';
        }
    }
}

export const gachaUI = new GachaUI();

window.buyMysteryBox = (type) => gachaUI.buyMysteryBox(type);
window.spinSecretGacha = () => gachaUI.spinSecretGacha();
window.spinCryptoGacha = () => gachaUI.spinCryptoGacha();
window.spinIlluvatarGacha = () => gachaUI.spinIlluvatarGacha();