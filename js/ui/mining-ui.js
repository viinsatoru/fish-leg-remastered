// js/ui/mining-ui.js - VERSI SUPER SIMPLE (PASTI JALAN)

import { gameData } from '../core/game-state.js';
import { uiManager } from './ui-manager.js';
import { modalManager } from './modals.js';
import { notification } from './notification.js';
import { saveManager } from '../core/save-manager.js';
import { miningSystem } from '../systems/mining-system.js';
import { MINING_TOOLS, MINING_SKILL_TREE } from '../config/constants.js';
import { MINING_EXCHANGE_RECIPES } from '../data/exchange.js';

export const miningUI = {
    initialized: false,

    init() {
        if (this.initialized) return;
        console.log('⛏️ Mining UI initialized');
        this.initialized = true;
    },

    switchMiningTab(tabId) {
        console.log('📑 switchMiningTab:', tabId);
        
        document.querySelectorAll('.mining-tab').forEach(t => t.classList.remove('active'));
        const tab = document.querySelector(`.mining-tab[data-mining-tab="${tabId}"]`);
        if (tab) tab.classList.add('active');
        
        document.querySelectorAll('.mining-pane').forEach(p => p.classList.remove('active'));
        const pane = document.getElementById(`mining-${tabId}`);
        if (pane) pane.classList.add('active');

        switch(tabId) {
            case 'main': this.loadMiningMain(); break;
            case 'shop': this.loadMiningShop(); break;
            case 'skill': this.loadMiningSkillTree(); break;
            case 'exchange': this.loadMiningExchange(); break;
        }
    },

    loadMiningMain() {
        console.log('⛏️ loadMiningMain()');
        const container = document.getElementById('mining-main-content');
        if (!container) {
            console.warn('⚠️ mining-main-content not found');
            return;
        }

        if (!miningSystem.isUnlocked()) {
            container.innerHTML = `
                <div style="text-align:center;padding:40px;">
                    <div style="font-size:4rem;">🔒</div>
                    <h3 style="color:#FF6B6B;">MINING TERKUNCI!</h3>
                    <p style="color:#ccc;">Butuh Miner Helm (250💎) + Flashlight (1 Bitcoin)</p>
                </div>
            `;
            return;
        }

        const tool = miningSystem.getCurrentTool();
        const luck = tool.luck * (1 + (gameData.mining.skill.lucky.level || 0));

        container.innerHTML = `
            <div style="text-align:center;padding:20px;">
                <div style="background:rgba(0,0,0,0.3);border-radius:15px;padding:20px;margin-bottom:20px;">
                    <h3 style="color:#FFD700;">⛏️ MINING AREA</h3>
                    <div style="display:flex;justify-content:center;gap:40px;margin:15px 0;flex-wrap:wrap;">
                        <div>
                            <div style="color:#00ffff;">Tool</div>
                            <div style="font-size:2rem;">${tool.emoji}</div>
                            <div style="color:white;">${tool.name}</div>
                            <div style="color:#4CAF50;">Luck: ${tool.luck}x</div>
                        </div>
                        <div>
                            <div style="color:#00ffff;">Total Luck</div>
                            <div style="font-size:2rem;">${luck.toFixed(1)}x</div>
                        </div>
                    </div>
                    ${gameData.mining.skill.perfectCut.unlocked ? '<div style="color:#FFD700;">✨ Perfect Cut Aktif!</div>' : ''}
                </div>
                <div id="mining-rock" style="cursor:pointer;font-size:10rem;animation:float 3s infinite ease-in-out;">🪨</div>
                <p style="color:#ccc;">Klik batu untuk mining!</p>
                <div id="mining-minigame-indicator" style="display:none;margin-top:20px;padding:20px;background:rgba(0,0,0,0.5);border-radius:10px;">
                    <p style="color:#FFD700;">🎯 PERFECT TIMING!</p>
                    <div style="width:200px;height:20px;background:#333;border-radius:10px;margin:10px auto;position:relative;overflow:hidden;">
                        <div id="mining-needle" style="width:4px;height:100%;background:#FFD700;position:absolute;left:0;animation:needleSweep 1s infinite linear;"></div>
                        <div style="width:40px;height:100%;background:rgba(255,215,0,0.3);position:absolute;left:80px;"></div>
                    </div>
                    <p style="color:#ccc;">Klik saat jarum di area emas!</p>
                </div>
            </div>
        `;

        document.getElementById('mining-rock')?.addEventListener('click', () => this.startMining());
        this.updateMiningStats();
    },

    startMining() {
        if (miningSystem.isMining) return;
        if (!miningSystem.isUnlocked()) {
            notification.error('🔒 Mining belum dibuka!');
            return;
        }

        const rock = document.getElementById('mining-rock');
        if (rock) {
            rock.style.transform = 'scale(0.95)';
            setTimeout(() => rock.style.transform = 'scale(1)', 100);
        }

        const hasPerfect = gameData.mining.skill.perfectCut.unlocked;
        const indicator = document.getElementById('mining-minigame-indicator');
        
        if (!hasPerfect && indicator) {
            indicator.style.display = 'block';
            document.getElementById('mining-needle')?.style.setProperty('animation', 'needleSweep 1s infinite linear');
        }

        miningSystem.startMining();

        setTimeout(() => {
            if (indicator) indicator.style.display = 'none';
            this.updateMiningStats();
            uiManager.updateTopBar();
        }, 2000);
    },

    // ============ SHOP - DIRECT HTML INJECT ============
    loadMiningShop() {
        console.log('🏪 loadMiningShop() CALLED');
        const container = document.getElementById('mining-shop-items');
        if (!container) {
            console.error('❌ mining-shop-items NOT FOUND!');
            return;
        }

        console.log('✅ Container found, injecting HTML...');
        
        let html = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;padding:10px;width:100%;">';
        
        MINING_TOOLS.forEach(tool => {
            const owned = tool.owned || false;
            const equipped = tool.id === gameData.mining.currentTool;
            const canAfford = Number(gameData.coins) >= (tool.price || 0);

            html += `
                <div style="background:rgba(255,255,255,0.05);padding:15px;border-radius:8px;text-align:center;border:1px solid rgba(255,255,255,0.05);">
                    <div style="font-size:2.5rem;margin-bottom:8px;">${tool.emoji || '🔧'}</div>
                    <div style="font-weight:bold;color:white;font-size:0.95rem;">${tool.name || 'Unknown'}</div>
                    <div style="color:#00ffff;font-size:0.8rem;">+${tool.luck || 0}x Luck</div>
                    <div style="color:#FFD700;margin:10px 0;font-size:0.9rem;">${tool.price || 0} 🪙</div>
                    ${owned ? 
                        `<button ${equipped ? 'disabled' : ''} 
                            style="width:100%;padding:8px;background:${equipped ? '#666' : '#4CAF50'};border:none;border-radius:6px;color:white;cursor:${equipped ? 'not-allowed' : 'pointer'};font-size:0.85rem;"
                            onclick="window.equipMiningTool(${tool.id})">
                            ${equipped ? '✓ DIGUNAKAN' : '🔧 GUNAKAN'}
                        </button>` :
                        `<button ${!canAfford ? 'disabled' : ''}
                            style="width:100%;padding:8px;background:${canAfford ? '#4CAF50' : '#666'};border:none;border-radius:6px;color:white;cursor:${canAfford ? 'pointer' : 'not-allowed'};font-size:0.85rem;"
                            onclick="window.buyMiningTool(${tool.id})">
                            ${canAfford ? '🛒 BELI' : '❌ TIDAK CUKUP'}
                        </button>`
                    }
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
        console.log('✅ Mining shop injected! Items:', MINING_TOOLS.length);
    },

    // ============ SKILL TREE - DIRECT HTML INJECT ============
    loadMiningSkillTree() {
        console.log('🌳 loadMiningSkillTree() CALLED');
        const container = document.getElementById('mining-skill-tree');
        if (!container) {
            console.error('❌ mining-skill-tree NOT FOUND!');
            return;
        }

        console.log('✅ Container found, injecting HTML...');
        
        let html = '<div style="display:flex;flex-wrap:wrap;gap:16px;justify-content:center;padding:10px;width:100%;">';
        
        Object.keys(MINING_SKILL_TREE).forEach(key => {
            const data = MINING_SKILL_TREE[key];
            const isPerfect = key === 'perfectCut';
            const unlocked = isPerfect ? (gameData.mining.skill.perfectCut?.unlocked || false) : false;
            const level = isPerfect ? (unlocked ? 1 : 0) : (gameData.mining.skill.lucky?.level || 0);
            const maxLevel = data.maxLevel || 1;
            
            const price = data.currency === 'diamonds' ? data.basePrice : 
                Math.floor(Number(data.basePrice || 0) * Math.pow(Number(data.priceMultiplier || 1), level));
            
            const canUpgrade = level < maxLevel && (
                data.currency === 'diamonds' ? 
                    Number(gameData.diamonds) >= price : 
                    Number(gameData.coins) >= price
            );

            const bonus = isPerfect ? (unlocked ? '✅ Auto Perfect' : '❌ Manual') : `+${level * 100}% Luck`;

            html += `
                <div style="text-align:center;background:rgba(255,255,255,0.05);padding:20px;border-radius:10px;width:250px;border:1px solid rgba(255,255,255,0.05);">
                    <div style="font-size:3rem;">${data.emoji || '⭐'}</div>
                    <h3 style="color:#FFD700;font-size:1rem;margin:8px 0;">${data.name || key}</h3>
                    <p style="color:#ccc;font-size:0.85rem;">${data.description || ''}</p>
                    <div style="background:rgba(0,0,0,0.3);padding:10px;border-radius:8px;margin:10px 0;">
                        <div style="display:flex;justify-content:space-between;font-size:0.9rem;">
                            <span style="color:#fff;">Level ${level}/${maxLevel}</span>
                            <span style="color:#4CAF50;">${bonus}</span>
                        </div>
                        ${!isPerfect ? `<div style="width:100%;height:6px;background:rgba(255,255,255,0.2);border-radius:3px;margin-top:5px;overflow:hidden;">
                            <div style="width:${(level/maxLevel)*100}%;height:100%;background:linear-gradient(to right,#4CAF50,#8BC34A);"></div>
                        </div>` : ''}
                    </div>
                    ${level < maxLevel ? `
                        <p style="color:${data.currency === 'diamonds' ? '#00ffff' : '#FFD700'};font-size:0.9rem;">Harga: ${price} ${data.currency === 'diamonds' ? '💎' : '🪙'}</p>
                        <button ${!canUpgrade ? 'disabled' : ''}
                            style="width:100%;padding:8px;background:${canUpgrade ? '#4CAF50' : '#666'};border:none;border-radius:6px;color:white;cursor:${canUpgrade ? 'pointer' : 'not-allowed'};font-size:0.85rem;"
                            onclick="window.upgradeMiningSkill('${key}')">
                            ${canUpgrade ? '⬆️ UPGRADE' : '❌ TIDAK CUKUP'}
                        </button>
                    ` : '<p style="color:gold;font-size:0.9rem;">✨ MAX LEVEL</p>'}
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
        console.log('✅ Mining skill tree injected! Skills:', Object.keys(MINING_SKILL_TREE).length);
    },

    // ============ EXCHANGE - DIRECT HTML INJECT ============
    loadMiningExchange() {
        console.log('🔄 loadMiningExchange() CALLED');
        const container = document.getElementById('mining-exchange-items');
        if (!container) {
            console.error('❌ mining-exchange-items NOT FOUND!');
            return;
        }

        console.log('✅ Container found, injecting HTML...');
        
        let html = '<div style="display:flex;flex-direction:column;gap:12px;padding:10px;width:100%;">';
        
        MINING_EXCHANGE_RECIPES.forEach(recipe => {
            const canCraft = recipe.input.type === 'coin' ? 
                Number(gameData.coins) >= (recipe.input.quantity || 0) :
                (gameData.mining.rocks || 0) >= (recipe.input.quantity || 0);

            html += `
                <div style="background:rgba(255,215,0,0.08);border:2px solid rgba(255,215,0,0.2);border-radius:10px;padding:15px;margin:5px 0;">
                    <h3 style="color:#FFD700;font-size:1rem;margin-bottom:5px;">${recipe.name || 'Exchange'}</h3>
                    <p style="color:#ccc;font-size:0.85rem;margin-bottom:10px;">${recipe.description || ''}</p>
                    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin:10px 0;">
                        <div>
                            <h4 style="color:#FF6B6B;font-size:0.8rem;margin-bottom:3px;">INPUT:</h4>
                            <div style="display:flex;align-items:center;gap:8px;">
                                <span style="font-size:1.3rem;">${recipe.input?.emoji || '📦'}</span>
                                <span style="color:white;font-size:0.9rem;">${recipe.input?.quantity || 0}x ${recipe.input?.type === 'coin' ? 'Coin' : 'Rock'}</span>
                            </div>
                        </div>
                        <div style="font-size:1.5rem;color:#FFD700;">→</div>
                        <div>
                            <h4 style="color:#4CAF50;font-size:0.8rem;margin-bottom:3px;">OUTPUT:</h4>
                            <div style="display:flex;align-items:center;gap:8px;">
                                <span style="font-size:1.3rem;">${recipe.output?.emoji || '💎'}</span>
                                <span style="color:white;font-size:0.9rem;">${recipe.output?.quantity || 0}x Diamond</span>
                            </div>
                        </div>
                    </div>
                    <button ${!canCraft ? 'disabled' : ''}
                        style="width:100%;padding:10px;background:${canCraft ? '#4CAF50' : '#666'};border:none;border-radius:6px;color:white;cursor:${canCraft ? 'pointer' : 'not-allowed'};font-size:0.9rem;margin-top:5px;"
                        onclick="window.exchangeMiningItems(${recipe.id})">
                        ${canCraft ? '🔄 TUKAR' : '❌ BAHAN TIDAK CUKUP'}
                    </button>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
        console.log('✅ Mining exchange injected! Recipes:', MINING_EXCHANGE_RECIPES.length);
    },

    updateMiningStats() {
        const stats = miningSystem.getStats();
        const ids = ['mining-rocks', 'mining-total-mines', 'mining-total-coins', 'mining-total-diamonds', 'mining-perfect-count'];
        const values = [stats.rocks, stats.totalMines, stats.totalCoins, stats.totalDiamonds, stats.perfectCount];
        ids.forEach((id, i) => {
            const el = document.getElementById(id);
            if (el) el.textContent = values[i];
        });
    }
};

// Global functions
window.startMining = () => miningUI.startMining();
window.buyMiningTool = (id) => {
    const tool = MINING_TOOLS.find(t => t.id === id);
    if (tool) {
        miningSystem.buyTool(id);
        miningUI.loadMiningShop();
        miningUI.updateMiningStats();
        uiManager.updateTopBar();
    }
};
window.equipMiningTool = (id) => {
    miningSystem.equipTool(id);
    miningUI.loadMiningShop();
    miningUI.loadMiningMain();
};
window.upgradeMiningSkill = (key) => {
    miningSystem.upgradeSkill(key);
    miningUI.loadMiningSkillTree();
    miningUI.loadMiningMain();
};
window.exchangeMiningItems = (id) => {
    const recipe = MINING_EXCHANGE_RECIPES.find(r => r.id === id);
    if (recipe) {
        miningSystem.exchangeResources(recipe);
        miningUI.loadMiningExchange();
        miningUI.updateMiningStats();
        uiManager.updateTopBar();
    }
};