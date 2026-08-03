// js/ui/dungeon-ui.js

import { gameState, gameData } from '../core/game-state.js';
import { uiManager } from './ui-manager.js';
import { modalManager } from './modals.js';
import { notification } from './notification.js';
import { saveManager } from '../core/save-manager.js';
import { dungeonSystem } from '../systems/dungeon-system.js';
import { DUNGEON_WEAPONS, DUNGEON_ARMORS, DUNGEON_LEVELS, DUNGEON_BOSSES } from '../data/dungeon.js';
import { TOKEN_EXCHANGE_RECIPES } from '../data/exchange.js';
import { SECRET_FISH_POOL } from '../data/equipment.js';
import { getAllFishes } from '../data/fishing-spots.js';

// ==================== DUNGEON UI ====================
class DungeonUI {
    constructor() {
        this.initialized = false;
        this.battleInterval = null;
    }

    init() {
        if (this.initialized) return;

        // Setup dungeon tabs
        document.querySelectorAll('.dungeon-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.getAttribute('data-dungeon-tab');
                this.switchDungeonTab(tabId);
            });
        });

        // Setup battle modal close
        const battleModal = document.getElementById('battle-modal');
        if (battleModal) {
            const closeBtn = battleModal.querySelector('.close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    if (dungeonSystem.battleInProgress) {
                        if (confirm('Yakin ingin meninggalkan pertarungan? Ini akan dianggap kalah!')) {
                            dungeonSystem.flee();
                            this.closeBattleModal();
                        }
                    } else {
                        this.closeBattleModal();
                    }
                });
            }
        }

        this.initialized = true;
        console.log('✅ Dungeon UI initialized');
    }

    // ==================== SWITCH TAB ====================
    switchDungeonTab(tabId) {
        document.querySelectorAll('.dungeon-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.dungeon-pane').forEach(p => p.classList.remove('active'));

        const activeTab = document.querySelector(`[data-dungeon-tab="${tabId}"]`);
        const activePane = document.getElementById(`dungeon-${tabId}-pane`);

        if (activeTab) activeTab.classList.add('active');
        if (activePane) activePane.classList.add('active');

        switch(tabId) {
            case 'character': this.loadDungeonCharacter(); break;
            case 'equip': this.loadDungeonShop(); break;
            case 'shop': this.loadDungeonShop(); break;
            case 'battle': this.loadDungeonLevels(); break;
            case 'token': this.loadTokenExchange(); break;
        }
    }

    // ==================== CHARACTER ====================
    loadDungeonCharacter() {
        const charContainer = document.getElementById('dungeon-character-list');
        if (!charContainer) return;

        const secretFish = gameData.backpack.filter(fish => 
            fish.rarity === 'secret' || fish.rarity === 'special'
        );

        if (secretFish.length === 0) {
            charContainer.innerHTML = `
                <div style="text-align: center; padding: 30px; background: rgba(255,255,255,0.05); border-radius: 10px;">
                    <div style="font-size: 3rem; margin-bottom: 20px;">🐟</div>
                    <h3 style="color: #FFD700;">Tidak ada ikan Secret!</h3>
                    <p style="color: #ccc;">Kamu butuh ikan Secret untuk bertarung di dungeon</p>
                    <p style="color: #00ffff;">Dapatkan ikan Secret dari memancing di spot khusus atau Gacha!</p>
                </div>
            `;
            return;
        }

        const equippedFishIndex = gameData.dungeon.fishEquipment.equippedFish;

        let fishHTML = '';
        secretFish.forEach((fish, idx) => {
            const fishIndex = gameData.backpack.findIndex(f => f === fish);
            const isSelected = fishIndex === equippedFishIndex;
            const hp = Math.floor(Number(fish.price) / 10);

            fishHTML += `
                <div onclick="window.selectDungeonFish(${fishIndex})" 
                     style="background: ${isSelected ? 'rgba(255,215,0,0.3)' : 'rgba(255,255,255,0.05)'}; 
                            padding: 15px; border-radius: 8px; margin: 10px; cursor: pointer; 
                            display: flex; align-items: center; gap: 15px; 
                            border: ${isSelected ? '2px solid #FFD700' : '1px solid rgba(255,255,255,0.1)'};
                            transition: all 0.3s;">
                    <div style="font-size: 3rem;">${fish.emoji}</div>
                    <div style="flex: 1;">
                        <div style="font-weight: bold; color: #00ffff;">${fish.name}</div>
                        <div style="color: #FFD700;">💰 ${fish.price} koin</div>
                        <div style="color: #4CAF50;">❤️ HP: ${hp}</div>
                    </div>
                    ${isSelected ? '<div style="color: #FFD700; font-size: 2rem;">✓</div>' : ''}
                </div>
            `;
        });

        charContainer.innerHTML = `
            <div style="background: rgba(0,0,0,0.3); border-radius: 10px; padding: 20px;">
                <h3 style="color: #FFD700; margin-bottom: 20px;">🐟 Pilih Ikan Secret untuk Bertarung</h3>
                <div style="max-height: 400px; overflow-y: auto;">
                    ${fishHTML}
                </div>
            </div>
        `;

        this.updateDungeonStats();
    }

    // ==================== SHOP ====================
    loadDungeonShop() {
        const weaponContainer = document.getElementById('dungeon-weapons');
        const armorContainer = document.getElementById('dungeon-armors');

        if (!weaponContainer || !armorContainer) return;

        weaponContainer.innerHTML = '';
        DUNGEON_WEAPONS.forEach(weapon => {
            const isEquipped = gameData.dungeon.fishEquipment.weapon === weapon.id;
            const canAfford = weapon.currency === 'coins' ? 
                Number(gameData.coins) >= Number(weapon.price) : 
                Number(gameData.diamonds) >= Number(weapon.price);

            const weaponCard = document.createElement('div');
            weaponCard.className = 'item-card';
            weaponCard.innerHTML = `
                <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; margin: 5px; text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: 10px;">${weapon.emoji}</div>
                    <div style="font-weight: bold; color: white; margin-bottom: 5px;">${weapon.name}</div>
                    <p style="color: #ccc; font-size: 0.9rem; margin-bottom: 10px;">${weapon.description}</p>
                    <div style="color: #ff6b6b; font-size: 1.2rem;">⚔️ Attack: +${weapon.attack}</div>
                    <div style="color: ${weapon.currency === 'diamonds' ? '#00ffff' : '#FFD700'}; margin: 10px 0;">
                        ${weapon.price} ${weapon.currency === 'diamonds' ? '💎' : '🪙'}
                    </div>
                    ${isEquipped ? 
                        `<button class="owned-btn" disabled style="width: 100%; padding: 8px; background: #4CAF50; border: none; border-radius: 6px; color: white;">✓ EQUIPPED</button>` :
                        `<button class="buy-weapon-btn" ${!canAfford ? 'disabled' : ''} 
                                onclick="window.buyDungeonWeapon(${weapon.id})"
                                style="width: 100%; padding: 8px; background: ${canAfford ? '#4CAF50' : '#666'}; border: none; border-radius: 6px; color: white; cursor: ${canAfford ? 'pointer' : 'not-allowed'};">
                            ${canAfford ? '🛒 BELI' : '❌ TIDAK CUKUP'}
                        </button>`
                    }
                </div>
            `;
            weaponContainer.appendChild(weaponCard);
        });

        armorContainer.innerHTML = '';
        DUNGEON_ARMORS.forEach(armor => {
            const isEquipped = gameData.dungeon.fishEquipment.armor === armor.id;
            const canAfford = armor.currency === 'coins' ? 
                Number(gameData.coins) >= Number(armor.price) : 
                Number(gameData.diamonds) >= Number(armor.price);

            const armorCard = document.createElement('div');
            armorCard.className = 'item-card';
            armorCard.innerHTML = `
                <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; margin: 5px; text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: 10px;">${armor.emoji}</div>
                    <div style="font-weight: bold; color: white; margin-bottom: 5px;">${armor.name}</div>
                    <p style="color: #ccc; font-size: 0.9rem; margin-bottom: 10px;">${armor.description}</p>
                    <div style="color: #4CAF50; font-size: 1.2rem;">🛡️ Defense: +${armor.defense}</div>
                    <div style="color: ${armor.currency === 'diamonds' ? '#00ffff' : '#FFD700'}; margin: 10px 0;">
                        ${armor.price} ${armor.currency === 'diamonds' ? '💎' : '🪙'}
                    </div>
                    ${isEquipped ? 
                        `<button class="owned-btn" disabled style="width: 100%; padding: 8px; background: #4CAF50; border: none; border-radius: 6px; color: white;">✓ EQUIPPED</button>` :
                        `<button class="buy-armor-btn" ${!canAfford ? 'disabled' : ''} 
                                onclick="window.buyDungeonArmor(${armor.id})"
                                style="width: 100%; padding: 8px; background: ${canAfford ? '#4CAF50' : '#666'}; border: none; border-radius: 6px; color: white; cursor: ${canAfford ? 'pointer' : 'not-allowed'};">
                            ${canAfford ? '🛒 BELI' : '❌ TIDAK CUKUP'}
                        </button>`
                    }
                </div>
            `;
            armorContainer.appendChild(armorCard);
        });

        this.updateDungeonStats();
    }

    // ==================== LEVELS ====================
    loadDungeonLevels() {
        const levelsContainer = document.getElementById('dungeon-levels-list');
        if (!levelsContainer) return;

        const equippedFish = dungeonSystem.getEquippedFish();

        if (equippedFish === null) {
            levelsContainer.innerHTML = `
                <div style="text-align: center; padding: 30px; background: rgba(255,255,255,0.05); border-radius: 10px;">
                    <p style="color: #FF6B6B;">Pilih ikan dulu di menu Karakter!</p>
                </div>
            `;
            return;
        }

        let levelsHTML = '';

        DUNGEON_LEVELS.forEach(level => {
            const progress = gameData.dungeon.dungeonProgress[level.id];
            const isCompleted = progress.completed;
            const bossesDefeated = progress.bossesDefeated.length;
            const canEnter = Number(gameData.level) >= Number(level.requiredLevel) && 
                           Number(gameData.coins) >= Number(level.entryFee);

            const tokenReward = level.id === 1 ? 1 : level.id === 2 ? 2 : level.id === 3 ? 3 : 5;

            levelsHTML += `
                <div style="background: linear-gradient(135deg, ${level.color}40, #00000080); 
                            border: 2px solid ${level.color}; border-radius: 10px; padding: 20px; margin: 15px 0;">
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                        <div>
                            <h3 style="color: ${level.color};">${level.name}</h3>
                            <p style="color: #ccc;">${level.description}</p>
                            <div style="display: flex; gap: 15px; margin-top: 10px; flex-wrap: wrap;">
                                <span style="color: #FFD700;">💰 Fee: ${level.entryFee}</span>
                                <span style="color: #00ffff;">📊 Required Level: ${level.requiredLevel}</span>
                                <span style="color: #FF00FF;">🎫 Token Reward: ${tokenReward}</span>
                            </div>
                            ${isCompleted ? 
                                '<div style="color: #4CAF50; margin-top: 10px;">✓ SELESAI</div>' : 
                                `<div style="color: #FFA500; margin-top: 10px;">⚔️ Bosses: ${bossesDefeated}/3</div>`
                            }
                        </div>
                        <button onclick="window.enterDungeonLevel(${level.id})" 
                                ${!canEnter || isCompleted ? 'disabled' : ''}
                                style="padding: 10px 20px; background: ${canEnter && !isCompleted ? '#4CAF50' : '#666'}; 
                                       border: none; border-radius: 5px; color: white; cursor: ${canEnter && !isCompleted ? 'pointer' : 'not-allowed'};">
                            ${isCompleted ? '✅ Selesai' : (canEnter ? '🎮 MASUK' : '❌ TERKUNCI')}
                        </button>
                    </div>
                </div>
            `;
        });

        levelsContainer.innerHTML = levelsHTML;
    }

    // ==================== TOKEN EXCHANGE ====================
    loadTokenExchange() {
        const tokenContainer = document.getElementById('token-exchange-items');
        if (!tokenContainer) return;

        tokenContainer.innerHTML = '';

        TOKEN_EXCHANGE_RECIPES.forEach(recipe => {
            const recipeCard = document.createElement('div');
            recipeCard.className = 'exchange-card';

            const canCraft = (gameData.secretTokens || 0) >= recipe.input.quantity;

            let outputHtml = '';
            if (recipe.output.type === 'coin') {
                outputHtml = `
                    <div style="display: flex; align-items: center; gap: 10px; margin: 5px 0;">
                        <span style="font-size: 1.5rem;">💰</span>
                        <span style="color: white;">${recipe.output.quantity}x Coin</span>
                    </div>
                `;
            } else if (recipe.output.type === 'diamond') {
                outputHtml = `
                    <div style="display: flex; align-items: center; gap: 10px; margin: 5px 0;">
                        <span style="font-size: 1.5rem;">💎</span>
                        <span style="color: white;">${recipe.output.quantity}x Diamond</span>
                    </div>
                `;
            } else if (recipe.output.type === 'secretFish') {
                outputHtml = `
                    <div style="display: flex; align-items: center; gap: 10px; margin: 5px 0;">
                        <span style="font-size: 1.5rem;">🐟</span>
                        <span style="color: white;">Ikan Secret Random</span>
                    </div>
                `;
            } else if (recipe.output.type === 'fish') {
                outputHtml = `
                    <div style="display: flex; align-items: center; gap: 10px; margin: 5px 0;">
                        <span style="font-size: 1.5rem;">${recipe.output.emoji}</span>
                        <span style="color: white;">${recipe.output.name}</span>
                    </div>
                `;
            }

            recipeCard.innerHTML = `
                <div style="background: rgba(255,215,0,0.1); border: 2px solid #FFD700; border-radius: 10px; padding: 15px; margin: 10px;">
                    <h3 style="color: #FFD700; margin-bottom: 10px;">${recipe.name}</h3>
                    <p style="color: #ccc; margin-bottom: 15px;">${recipe.description}</p>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                        <div style="flex: 1; min-width: 100px;">
                            <h4 style="color: #FF6B6B; margin-bottom: 5px;">INPUT:</h4>
                            <div style="display: flex; align-items: center; gap: 10px; margin: 5px 0;">
                                <span style="font-size: 1.5rem;">🎫</span>
                                <span style="color: white;">${recipe.input.quantity}x Secret Token</span>
                            </div>
                        </div>
                        
                        <div style="font-size: 2rem; color: #FFD700;">→</div>
                        
                        <div style="flex: 1; min-width: 100px;">
                            <h4 style="color: #4CAF50; margin-bottom: 5px;">OUTPUT:</h4>
                            ${outputHtml}
                        </div>
                    </div>
                    
                    <button class="exchange-btn" data-recipe-id="${recipe.id}" ${!canCraft ? 'disabled' : ''}
                            style="width: 100%; margin-top: 15px; padding: 10px; background: ${canCraft ? '#4CAF50' : '#666'}; border: none; border-radius: 6px; color: white; cursor: ${canCraft ? 'pointer' : 'not-allowed'};"
                            onclick="window.exchangeToken(${recipe.id})">
                        ${canCraft ? '🔄 TUKAR' : '❌ TOKEN TIDAK CUKUP'}
                    </button>
                </div>
            `;

            tokenContainer.appendChild(recipeCard);
        });
    }

    // ==================== STATS ====================
    updateDungeonStats() {
        const fishIndex = gameData.dungeon.fishEquipment.equippedFish;
        const selectedFishSpan = document.getElementById('dungeon-selected-fish');
        const attackSpan = document.getElementById('dungeon-attack');
        const defenseSpan = document.getElementById('dungeon-defense');
        const tokenSpan = document.getElementById('dungeon-tokens');
        const tokenDisplaySpan = document.getElementById('dungeon-tokens-display');

        if (!selectedFishSpan || !attackSpan || !defenseSpan) return;

        const stats = dungeonSystem.getPlayerStats();

        if (stats.fish) {
            selectedFishSpan.textContent = `${stats.fish.emoji} ${stats.fish.name}`;
            attackSpan.textContent = stats.attack;
            defenseSpan.textContent = stats.defense;

            const equippedWeapon = document.getElementById('equipped-weapon');
            const equippedArmor = document.getElementById('equipped-armor');

            if (equippedWeapon) {
                equippedWeapon.innerHTML = stats.weapon ? 
                    `<span style="color: #ff6b6b;">${stats.weapon.emoji} ${stats.weapon.name} (+${stats.weapon.attack} ATK)</span>` : 
                    '<span>Belum ada senjata</span>';
            }

            if (equippedArmor) {
                equippedArmor.innerHTML = stats.armor ? 
                    `<span style="color: #4CAF50;">${stats.armor.emoji} ${stats.armor.name} (+${stats.armor.defense} DEF)</span>` : 
                    '<span>Belum ada armor</span>';
            }
        } else {
            selectedFishSpan.textContent = 'Belum dipilih';
            attackSpan.textContent = '0';
            defenseSpan.textContent = '0';
        }

        const tokens = gameData.secretTokens || 0;
        if (tokenSpan) tokenSpan.textContent = tokens;
        if (tokenDisplaySpan) tokenDisplaySpan.textContent = tokens;
    }

    // ==================== BATTLE ====================
    showBattleModal() {
        const battle = dungeonSystem.getCurrentBattle();
        if (!battle) return;

        const battleModal = document.getElementById('battle-modal');
        const battleContent = document.getElementById('battle-content');

        if (!battleModal || !battleContent) return;

        const fish = gameData.backpack[gameData.dungeon.fishEquipment.equippedFish];

        battleContent.innerHTML = `
            <div style="padding: 20px;">
                <h2 style="color: #FFD700; text-align: center; margin-bottom: 30px;">⚔️ DUNGEON BATTLE ⚔️</h2>
                
                <div style="display: flex; justify-content: space-between; gap: 20px; margin-bottom: 30px; flex-wrap: wrap;">
                    <div style="flex: 1; min-width: 200px; background: rgba(0,0,0,0.3); padding: 20px; border-radius: 10px; text-align: center;">
                        <div style="font-size: 4rem;">${fish.emoji}</div>
                        <h3 style="color: #00ffff;">${fish.name}</h3>
                        <div style="margin: 15px 0;">
                            <div style="color: #4CAF50;">❤️ HP: <span id="battle-player-hp">${battle.playerHP}</span>/${battle.playerMaxHP}</div>
                            <div style="width: 100%; height: 10px; background: rgba(255,255,255,0.2); border-radius: 5px; margin-top: 5px;">
                                <div id="player-hp-bar" style="width: ${(battle.playerHP/battle.playerMaxHP)*100}%; height: 100%; background: #4CAF50; border-radius: 5px;"></div>
                            </div>
                        </div>
                        <div style="color: #ff6b6b;">⚔️ Attack: ${battle.playerAttack}</div>
                        <div style="color: #4CAF50;">🛡️ Defense: ${battle.playerDefense}</div>
                    </div>
                    
                    <div style="display: flex; align-items: center; font-size: 3rem; color: #FFD700;">VS</div>
                    
                    <div style="flex: 1; min-width: 200px; background: rgba(255,0,0,0.1); padding: 20px; border-radius: 10px; text-align: center;">
                        <div style="font-size: 4rem;">${battle.boss.emoji}</div>
                        <h3 style="color: #FF6B6B;">${battle.boss.name}</h3>
                        <div style="margin: 15px 0;">
                            <div style="color: #4CAF50;">❤️ HP: <span id="battle-boss-hp">${battle.bossHP}</span>/${battle.bossMaxHP}</div>
                            <div style="width: 100%; height: 10px; background: rgba(255,255,255,0.2); border-radius: 5px; margin-top: 5px;">
                                <div id="boss-hp-bar" style="width: ${(battle.bossHP/battle.bossMaxHP)*100}%; height: 100%; background: #ff6b6b; border-radius: 5px;"></div>
                            </div>
                        </div>
                        <div style="color: #ff6b6b;">⚔️ Attack: ${battle.bossAttack}</div>
                        <div style="color: #4CAF50;">🛡️ Defense: ${battle.bossDefense}</div>
                    </div>
                </div>
                
                <div style="text-align: center; margin: 20px 0;">
                    <p id="turn-indicator" style="color: #ccc;">Giliran: <span style="color: ${battle.playerTurn ? '#00ffff' : '#FF6B6B'};">${battle.playerTurn ? 'Giliranmu' : 'Giliran Boss'}</span></p>
                </div>
                
                <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                    <button id="attack-btn" onclick="window.playerAttack()" ${!battle.playerTurn ? 'disabled' : ''}
                            style="padding: 15px 30px; background: ${battle.playerTurn ? '#ff6b6b' : '#666'}; border: none; border-radius: 25px; color: white; font-weight: bold; font-size: 1.2rem; cursor: ${battle.playerTurn ? 'pointer' : 'not-allowed'};">
                        ⚔️ ATTACK
                    </button>
                    <button onclick="window.fleeBattle()"
                            style="padding: 15px 30px; background: #666; border: none; border-radius: 25px; color: white; font-weight: bold; font-size: 1.2rem; cursor: pointer;">
                        🏃 FLEE
                    </button>
                </div>
            </div>
        `;

        battleModal.style.display = 'block';

        // Start auto battle check
        if (this.battleInterval) {
            clearInterval(this.battleInterval);
        }
        this.battleInterval = setInterval(() => {
            this.updateBattleUI();
        }, 500);
    }

    updateBattleUI() {
        const battle = dungeonSystem.getCurrentBattle();
        if (!battle) {
            if (this.battleInterval) {
                clearInterval(this.battleInterval);
                this.battleInterval = null;
            }
            return;
        }

        const playerHpEl = document.getElementById('battle-player-hp');
        const bossHpEl = document.getElementById('battle-boss-hp');
        const playerHpBar = document.getElementById('player-hp-bar');
        const bossHpBar = document.getElementById('boss-hp-bar');
        const turnIndicator = document.getElementById('turn-indicator');
        const attackBtn = document.getElementById('attack-btn');

        if (playerHpEl) playerHpEl.textContent = battle.playerHP;
        if (bossHpEl) bossHpEl.textContent = battle.bossHP;
        if (playerHpBar) {
            playerHpBar.style.width = `${(battle.playerHP/battle.playerMaxHP)*100}%`;
            playerHpBar.style.background = battle.playerHP < battle.playerMaxHP * 0.3 ? '#ff6b6b' : '#4CAF50';
        }
        if (bossHpBar) {
            bossHpBar.style.width = `${(battle.bossHP/battle.bossMaxHP)*100}%`;
            bossHpBar.style.background = battle.bossHP < battle.bossMaxHP * 0.3 ? '#FFD700' : '#ff6b6b';
        }
        if (turnIndicator) {
            turnIndicator.innerHTML = `Giliran: <span style="color: ${battle.playerTurn ? '#00ffff' : '#FF6B6B'};">${battle.playerTurn ? 'Giliranmu' : 'Giliran Boss'}</span>`;
        }
        if (attackBtn) {
            attackBtn.disabled = !battle.playerTurn;
            attackBtn.style.background = battle.playerTurn ? '#ff6b6b' : '#666';
            attackBtn.style.cursor = battle.playerTurn ? 'pointer' : 'not-allowed';
        }
    }

    closeBattleModal() {
        const battleModal = document.getElementById('battle-modal');
        if (battleModal) {
            battleModal.style.display = 'none';
        }
        if (this.battleInterval) {
            clearInterval(this.battleInterval);
            this.battleInterval = null;
        }
    }

    // ==================== TOKEN EXCHANGE ====================
    exchangeToken(recipeId) {
        const recipe = TOKEN_EXCHANGE_RECIPES.find(r => r.id === recipeId);
        if (!recipe) return;

        if ((gameData.secretTokens || 0) < recipe.input.quantity) {
            notification.error('❌ Token tidak cukup!');
            return;
        }

        try {
            gameData.secretTokens = (gameData.secretTokens || 0) - recipe.input.quantity;

            if (recipe.output.type === 'coin') {
                gameData.coins = Number(gameData.coins) + Number(recipe.output.quantity);
                notification.success(`💰 Mendapatkan ${recipe.output.quantity} Coin!`);
            } else if (recipe.output.type === 'diamond') {
                gameData.diamonds = Number(gameData.diamonds) + Number(recipe.output.quantity);
                notification.success(`💎 Mendapatkan ${recipe.output.quantity} Diamond!`);
            } else if (recipe.output.type === 'secretFish') {
                const randomIndex = Math.floor(Math.random() * SECRET_FISH_POOL.length);
                const secretFish = { ...SECRET_FISH_POOL[randomIndex] };

                gameData.backpack.push({
                    ...secretFish,
                    catchTime: Date.now(),
                    perfectCatch: false,
                    fromTokenExchange: true,
                    uniqueId: Date.now() + Math.random()
                });

                gameState.addToAquarium(secretFish);
                notification.success(`🐟 Mendapatkan ${secretFish.name}!`);
            } else if (recipe.output.type === 'fish') {
                const allFishes = getAllFishes();
                const fish = allFishes.find(f => f.id === recipe.output.id);
                if (fish) {
                    gameData.backpack.push({
                        ...fish,
                        catchTime: Date.now(),
                        perfectCatch: false,
                        fromTokenExchange: true,
                        uniqueId: Date.now() + Math.random()
                    });
                    gameState.addToAquarium(fish);
                    notification.success(`✅ Dapat ${fish.emoji} ${fish.name}!`);
                }
            }

            saveManager.forceSave();
            uiManager.updateTopBar();
            this.loadTokenExchange();
            this.updateDungeonStats();

        } catch (error) {
            console.error('Token exchange error:', error);
            notification.error('❌ Terjadi error! Transaksi dibatalkan.');
        }
    }
}

// Singleton instance
export const dungeonUI = new DungeonUI();

// Export untuk global
window.selectDungeonFish = (index) => {
    dungeonSystem.selectFish(index);
    dungeonUI.loadDungeonCharacter();
    dungeonUI.loadDungeonLevels();
    dungeonUI.updateDungeonStats();
};

window.buyDungeonWeapon = (id) => {
    dungeonSystem.buyWeapon(id);
    dungeonUI.loadDungeonShop();
    dungeonUI.updateDungeonStats();
};

window.buyDungeonArmor = (id) => {
    dungeonSystem.buyArmor(id);
    dungeonUI.loadDungeonShop();
    dungeonUI.updateDungeonStats();
};

window.enterDungeonLevel = (id) => {
    const success = dungeonSystem.enterLevel(id);
    if (success) {
        dungeonUI.showBattleModal();
        dungeonUI.loadDungeonLevels();
        dungeonUI.updateDungeonStats();
    }
};

window.playerAttack = () => {
    const success = dungeonSystem.playerAttack();
    if (success) {
        const battle = dungeonSystem.getCurrentBattle();
        if (battle && battle.bossHP <= 0) {
            // Victory already handled in dungeonSystem
            dungeonUI.closeBattleModal();
            dungeonUI.loadDungeonLevels();
            dungeonUI.updateDungeonStats();
        } else if (battle) {
            // Boss turn after delay
            setTimeout(() => {
                dungeonSystem.bossAttack();
                dungeonUI.updateBattleUI();
                const updatedBattle = dungeonSystem.getCurrentBattle();
                if (updatedBattle && updatedBattle.playerHP <= 0) {
                    dungeonUI.closeBattleModal();
                    dungeonUI.loadDungeonLevels();
                    dungeonUI.updateDungeonStats();
                }
            }, 1000);
        }
    }
};

window.fleeBattle = () => {
    dungeonSystem.flee();
    dungeonUI.closeBattleModal();
    dungeonUI.loadDungeonLevels();
};

window.exchangeToken = (id) => dungeonUI.exchangeToken(id);