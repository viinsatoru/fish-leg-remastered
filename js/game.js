// ============================================================
// game.js - VERSI GABUNGAN (PASTI JALAN)
// ============================================================

console.log('🔥 GAME.JS LOADED!');

// ============ DATA MINING ============
const MINING_TOOLS = [
    { id: 0, name: "Gunting", luck: 1, price: 0, owned: true, emoji: "✂️" },
    { id: 1, name: "Kapak", luck: 5, price: 10000, owned: false, emoji: "🪓" },
    { id: 2, name: "Palu", luck: 10, price: 15000, owned: false, emoji: "🔨" },
    { id: 3, name: "Pickaxe", luck: 20, price: 25000, owned: false, emoji: "⛏️" },
    { id: 4, name: "Hammer", luck: 30, price: 35000, owned: false, emoji: "⚒️" },
    { id: 5, name: "Magnet", luck: 50, price: 60000, owned: false, emoji: "🧲" },
    { id: 6, name: "Alat Bor", luck: 100, price: 120000, owned: false, emoji: "🏗️" }
];

const MINING_SKILL_TREE = {
    perfectCut: { name: "Perfect Cut 🌟", description: "Perfect tanpa minigame", maxLevel: 1, basePrice: 500, currency: "diamonds", emoji: "🎯" },
    lucky: { name: "Lucky", description: "+100% luck per level", maxLevel: 5, basePrice: 2000, priceMultiplier: 2, emoji: "🍀" }
};

const MINING_EXCHANGE_RECIPES = [
    { id: 101, name: "Coin to Diamond", description: "Tukar 800 Coin dengan 1 Diamond", input: { type: "coin", quantity: 800, emoji: "💰" }, output: { type: "diamond", quantity: 1, emoji: "💎" } },
    { id: 102, name: "Coin to Diamonds", description: "Tukar 70.000 Coin dengan 100 Diamond", input: { type: "coin", quantity: 70000, emoji: "💰" }, output: { type: "diamond", quantity: 100, emoji: "💎" } },
    { id: 103, name: "Rock to Diamond", description: "Tukar 5 Rock dengan 1 Diamond", input: { type: "rock", quantity: 5, emoji: "🪨" }, output: { type: "diamond", quantity: 1, emoji: "💎" } },
    { id: 104, name: "Rock to Diamonds", description: "Tukar 400 Rock dengan 100 Diamond", input: { type: "rock", quantity: 400, emoji: "🪨" }, output: { type: "diamond", quantity: 100, emoji: "💎" } }
];

// ============ MINING SYSTEM ============
const miningSystem = {
    isMining: false,
    rocks: 0,
    currentTool: 0,
    stats: { totalMines: 0, totalCoins: 0, totalRocks: 0, totalDiamonds: 0, perfectCount: 0 },
    skill: { perfectCut: { unlocked: false }, lucky: { level: 0 } },
    
    isUnlocked() {
        return true; // FORCE UNLOCK BIAR GAMPANG TEST
    },
    
    getCurrentTool() {
        return MINING_TOOLS.find(t => t.id === this.currentTool) || MINING_TOOLS[0];
    },
    
    getStats() {
        return {
            rocks: this.rocks,
            totalMines: this.stats.totalMines,
            totalCoins: this.stats.totalCoins,
            totalRocks: this.stats.totalRocks,
            totalDiamonds: this.stats.totalDiamonds,
            perfectCount: this.stats.perfectCount
        };
    },
    
    startMining() {
        if (this.isMining) return;
        this.isMining = true;
        console.log('⛏️ Mining started!');
        
        setTimeout(() => {
            const result = this.finishMining(false);
            this.isMining = false;
            console.log('⛏️ Mining finished:', result);
            updateMiningUI();
        }, 1500);
    },
    
    finishMining(perfect) {
        const tool = this.getCurrentTool();
        const luck = tool.luck * (1 + (this.skill.lucky.level || 0));
        const amount = Math.floor((Math.random() * 400 + 100) * luck);
        
        this.rocks += amount;
        this.stats.totalMines++;
        this.stats.totalRocks += amount;
        
        return { itemType: 'rock', amount, perfectCatch: perfect };
    },
    
    buyTool(id) {
        const tool = MINING_TOOLS.find(t => t.id === id);
        if (!tool || tool.owned) return false;
        tool.owned = true;
        return true;
    },
    
    equipTool(id) {
        this.currentTool = id;
        return true;
    },
    
    upgradeSkill(key) {
        if (key === 'perfectCut') {
            this.skill.perfectCut.unlocked = true;
            return true;
        }
        if (key === 'lucky') {
            this.skill.lucky.level = (this.skill.lucky.level || 0) + 1;
            return true;
        }
        return false;
    },
    
    exchangeResources(recipe) {
        if (recipe.input.type === 'coin') {
            // skip coin check
        } else if (recipe.input.type === 'rock') {
            if (this.rocks < recipe.input.quantity) return false;
            this.rocks -= recipe.input.quantity;
        }
        return true;
    }
};

// ============ MINING UI ============
function loadMiningMain() {
    console.log('⛏️ loadMiningMain()');
    const container = document.getElementById('mining-main-content');
    if (!container) return;
    
    const tool = miningSystem.getCurrentTool();
    const luck = tool.luck * (1 + (miningSystem.skill.lucky.level || 0));
    
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
                ${miningSystem.skill.perfectCut.unlocked ? '<div style="color:#FFD700;">✨ Perfect Cut Aktif!</div>' : ''}
            </div>
            <div onclick="startMining()" style="cursor:pointer;font-size:10rem;animation:float 3s infinite ease-in-out;">🪨</div>
            <p style="color:#ccc;">Klik batu untuk mining!</p>
        </div>
    `;
    updateMiningStats();
}

function loadMiningShop() {
    console.log('🏪 loadMiningShop()');
    const container = document.getElementById('mining-shop-items');
    if (!container) return;
    
    let html = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;padding:10px;">';
    
    MINING_TOOLS.forEach(tool => {
        const owned = tool.owned || false;
        const equipped = tool.id === miningSystem.currentTool;
        
        html += `
            <div style="background:rgba(255,255,255,0.05);padding:15px;border-radius:8px;text-align:center;border:1px solid rgba(255,255,255,0.05);">
                <div style="font-size:2.5rem;">${tool.emoji}</div>
                <div style="font-weight:bold;color:white;">${tool.name}</div>
                <div style="color:#00ffff;">+${tool.luck}x Luck</div>
                <div style="color:#FFD700;margin:10px 0;">${tool.price} 🪙</div>
                ${owned ? 
                    `<button ${equipped ? 'disabled' : ''} 
                        style="width:100%;padding:8px;background:${equipped ? '#666' : '#4CAF50'};border:none;border-radius:6px;color:white;cursor:${equipped ? 'not-allowed' : 'pointer'};"
                        onclick="equipMiningTool(${tool.id})">
                        ${equipped ? '✓ DIGUNAKAN' : '🔧 GUNAKAN'}
                    </button>` :
                    `<button onclick="buyMiningTool(${tool.id})"
                        style="width:100%;padding:8px;background:#4CAF50;border:none;border-radius:6px;color:white;cursor:pointer;">
                        🛒 BELI
                    </button>`
                }
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

function loadMiningSkillTree() {
    console.log('🌳 loadMiningSkillTree()');
    const container = document.getElementById('mining-skill-tree');
    if (!container) return;
    
    let html = '<div style="display:flex;flex-wrap:wrap;gap:16px;justify-content:center;padding:10px;">';
    
    Object.keys(MINING_SKILL_TREE).forEach(key => {
        const data = MINING_SKILL_TREE[key];
        const level = key === 'perfectCut' ? (miningSystem.skill.perfectCut.unlocked ? 1 : 0) : (miningSystem.skill.lucky.level || 0);
        const maxLevel = data.maxLevel;
        const bonus = key === 'perfectCut' ? (miningSystem.skill.perfectCut.unlocked ? 'Auto Perfect' : 'Manual') : `+${level * 100}% Luck`;
        
        html += `
            <div style="text-align:center;background:rgba(255,255,255,0.05);padding:20px;border-radius:10px;width:250px;border:1px solid rgba(255,255,255,0.05);">
                <div style="font-size:3rem;">${data.emoji}</div>
                <h3 style="color:#FFD700;">${data.name}</h3>
                <p style="color:#ccc;font-size:0.85rem;">${data.description}</p>
                <div style="background:rgba(0,0,0,0.3);padding:10px;border-radius:8px;margin:10px 0;">
                    <div style="display:flex;justify-content:space-between;">
                        <span style="color:#fff;">Level ${level}/${maxLevel}</span>
                        <span style="color:#4CAF50;">${bonus}</span>
                    </div>
                </div>
                ${level < maxLevel ? `
                    <button onclick="upgradeMiningSkill('${key}')"
                        style="width:100%;padding:8px;background:#4CAF50;border:none;border-radius:6px;color:white;cursor:pointer;">
                        ⬆️ UPGRADE
                    </button>
                ` : '<p style="color:gold;">✨ MAX LEVEL</p>'}
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

function loadMiningExchange() {
    console.log('🔄 loadMiningExchange()');
    const container = document.getElementById('mining-exchange-items');
    if (!container) return;
    
    let html = '<div style="display:flex;flex-direction:column;gap:12px;padding:10px;">';
    
    MINING_EXCHANGE_RECIPES.forEach(recipe => {
        html += `
            <div style="background:rgba(255,215,0,0.08);border:2px solid rgba(255,215,0,0.2);border-radius:10px;padding:15px;">
                <h3 style="color:#FFD700;">${recipe.name}</h3>
                <p style="color:#ccc;">${recipe.description}</p>
                <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin:10px 0;">
                    <div>
                        <h4 style="color:#FF6B6B;">INPUT:</h4>
                        <div style="display:flex;align-items:center;gap:8px;">
                            <span style="font-size:1.3rem;">${recipe.input.emoji}</span>
                            <span style="color:white;">${recipe.input.quantity}x ${recipe.input.type === 'coin' ? 'Coin' : 'Rock'}</span>
                        </div>
                    </div>
                    <div style="font-size:1.5rem;color:#FFD700;">→</div>
                    <div>
                        <h4 style="color:#4CAF50;">OUTPUT:</h4>
                        <div style="display:flex;align-items:center;gap:8px;">
                            <span style="font-size:1.3rem;">${recipe.output.emoji}</span>
                            <span style="color:white;">${recipe.output.quantity}x Diamond</span>
                        </div>
                    </div>
                </div>
                <button onclick="exchangeMiningItems(${recipe.id})"
                    style="width:100%;padding:10px;background:#4CAF50;border:none;border-radius:6px;color:white;cursor:pointer;font-size:0.9rem;">
                    🔄 TUKAR
                </button>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

function updateMiningStats() {
    const stats = miningSystem.getStats();
    const ids = ['mining-rocks', 'mining-total-mines', 'mining-total-coins', 'mining-total-diamonds', 'mining-perfect-count'];
    const values = [stats.rocks, stats.totalMines, stats.totalCoins, stats.totalRocks, stats.totalDiamonds, stats.perfectCount];
    ids.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el) el.textContent = values[i] || 0;
    });
}

function updateMiningUI() {
    // Cek tab mana yang aktif
    const activeTab = document.querySelector('.mining-tab.active');
    if (activeTab) {
        const tabId = activeTab.getAttribute('data-mining-tab');
        switch(tabId) {
            case 'main': loadMiningMain(); break;
            case 'shop': loadMiningShop(); break;
            case 'skill': loadMiningSkillTree(); break;
            case 'exchange': loadMiningExchange(); break;
        }
    } else {
        loadMiningMain();
    }
    updateMiningStats();
}

// ============ GLOBAL FUNCTIONS ============
window.startMining = function() {
    miningSystem.startMining();
};

window.buyMiningTool = function(id) {
    miningSystem.buyTool(id);
    loadMiningShop();
};

window.equipMiningTool = function(id) {
    miningSystem.equipTool(id);
    loadMiningShop();
    loadMiningMain();
};

window.upgradeMiningSkill = function(key) {
    miningSystem.upgradeSkill(key);
    loadMiningSkillTree();
    loadMiningMain();
};

window.exchangeMiningItems = function(id) {
    const recipe = MINING_EXCHANGE_RECIPES.find(r => r.id === id);
    if (recipe) {
        miningSystem.exchangeResources(recipe);
        loadMiningExchange();
        updateMiningStats();
    }
};

// ============ INIT MINING TABS ============
function initMiningTabs() {
    document.querySelectorAll('.mining-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-mining-tab');
            document.querySelectorAll('.mining-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            document.querySelectorAll('.mining-pane').forEach(p => p.classList.remove('active'));
            const pane = document.getElementById(`mining-${tabId}`);
            if (pane) pane.classList.add('active');
            
            switch(tabId) {
                case 'main': loadMiningMain(); break;
                case 'shop': loadMiningShop(); break;
                case 'skill': loadMiningSkillTree(); break;
                case 'exchange': loadMiningExchange(); break;
            }
        });
    });
}

// ============ INIT ============
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔥 MINING SCRIPT LOADED!');
    initMiningTabs();
    
    // Load default tab
    setTimeout(() => {
        loadMiningMain();
        loadMiningShop();
        loadMiningSkillTree();
        loadMiningExchange();
        updateMiningStats();
        console.log('✅ MINING UI LOADED!');
    }, 100);
});