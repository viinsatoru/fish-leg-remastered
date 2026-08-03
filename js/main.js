// js/main.js - Entry Point (FULLY FIXED - SPOT WORKING)

import { gameState, gameData } from './core/game-state.js';
import { saveManager } from './core/save-manager.js';
import { eventBus, EVENTS } from './core/event-bus.js';
import { uiManager } from './ui/ui-manager.js';
import { modalManager } from './ui/modals.js';
import { notification } from './ui/notification.js';
import { inventoryUI } from './ui/inventory-ui.js';
import { shopUI } from './ui/shop-ui.js';
import { gachaUI } from './ui/gacha-ui.js';
import { dungeonUI } from './ui/dungeon-ui.js';
import { miningUI } from './ui/mining-ui.js';
import { aquariumUI } from './ui/aquarium-ui.js';
import { gamepassUI } from './ui/gamepass-ui.js';
import { rankUI } from './ui/rank-ui.js';
import { exchangeUI } from './ui/exchange-ui.js';
import { villageUI } from './ui/village-ui.js';
import { depthGearUI } from './ui/depth-gear-ui.js';
import { skillUI } from './ui/skill-ui.js';
import { petUI } from './ui/pet-ui.js';
import { questUI } from './ui/quest-ui.js';
import { fishingSystem } from './systems/fishing-system.js';
import { miningSystem } from './systems/mining-system.js';
import { dungeonSystem } from './systems/dungeon-system.js';
import { rankSystem } from './systems/rank-system.js';
import { questSystem } from './systems/quest-system.js';
import { petSystem } from './systems/pet-system.js';
import { skillSystem } from './systems/skill-system.js';
import { GAME_VERSIONS } from './config/version.js';
import { FISHING_SPOTS } from './data/fishing-spots.js';
import { DEPTH_LEVELS } from './config/constants.js';

// ==================== SPOT SYSTEM ====================
let currentSpot = 0;
let currentDepth = "surface";

// ==================== SWITCH FISHING SPOT (FIXED) ====================
function switchFishingSpot(spotId) {
    console.log(`🎣 Pindah ke spot: ${spotId}`);
    
    // ============ UPDATE fishingSystem.currentSpot ============
    fishingSystem.currentSpot = spotId;
    fishingSystem.switchSpot(spotId);
    
    const spot = FISHING_SPOTS[spotId];
    if (!spot) {
        console.error('❌ Spot not found!');
        return;
    }
    
    console.log(`📍 Spot name: ${spot.name}`);
    console.log(`🎨 Background: ${spot.background}`);
    
    // ============ UBAH BACKGROUND ============
    document.body.style.background = spot.background;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.backgroundPosition = 'center';
    document.body.style.transition = 'background 0.8s ease';
    
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.style.background = `linear-gradient(145deg, ${spot.color}33, rgba(15,14,26,0.85))`;
        mainContent.style.transition = 'background 0.8s ease';
        mainContent.style.border = `1px solid ${spot.color}22`;
    }
    
    const fishingArea = document.querySelector('.fishing-area');
    if (fishingArea) {
        fishingArea.style.background = `
            radial-gradient(ellipse at 30% 80%, ${spot.color}44, transparent 70%),
            radial-gradient(ellipse at 70% 20%, ${spot.color}22, transparent 50%),
            linear-gradient(180deg, rgba(15,14,26,0.6), rgba(15,14,26,0.9))
        `;
        fishingArea.style.transition = 'background 1s ease';
        fishingArea.style.border = `1px solid ${spot.color}33`;
    }
    
    // ============ UPDATE UI ============
    updateSpotButtons();
    updateSpotDisplay();
    createFishAnimation();
    updateDepthButtons();
    
    if (window.uiManager) {
        uiManager.updateLuckDisplay();
        uiManager.updateWeatherDisplay();
    }
    
    if (window.notification) {
        notification.success(`🎣 Pindah ke ${spot.name}`);
    }
    
    console.log(`✅ Spot changed to: ${spot.name}`);
    console.log(`✅ fishingSystem.currentSpot: ${fishingSystem.currentSpot}`);
}

// ==================== UPDATE SPOT BUTTONS ====================
function updateSpotButtons() {
    const spotButtons = document.querySelectorAll('.spot-btn');
    spotButtons.forEach(btn => {
        const spotId = parseInt(btn.getAttribute('data-spot'));
        const spot = FISHING_SPOTS[spotId];
        if (spotId === fishingSystem.currentSpot) {
            btn.style.background = '#FFD700';
            btn.style.color = '#000';
            btn.style.boxShadow = '0 0 30px rgba(255,215,0,0.3)';
            btn.classList.add('active');
        } else {
            btn.style.background = spot.color;
            btn.style.color = '#fff';
            btn.style.boxShadow = 'none';
            btn.classList.remove('active');
        }
    });
}

// ==================== UPDATE SPOT DISPLAY ====================
function updateSpotDisplay() {
    const spotDisplay = document.getElementById('spot-display');
    if (!spotDisplay) return;
    const spot = FISHING_SPOTS[fishingSystem.currentSpot];
    if (spot) {
        spotDisplay.innerHTML = `<span style="color: white; font-weight: bold;">📍 ${spot.name}</span>`;
    }
}

// ==================== CREATE FISH ANIMATION ====================
function createFishAnimation() {
    const fishDisplay = document.getElementById('fish-display');
    if (!fishDisplay) return;
    
    fishDisplay.innerHTML = '';
    const spot = FISHING_SPOTS[fishingSystem.currentSpot];
    if (!spot) return;
    
    const fishes = spot.fishes || [];
    for (let i = 0; i < Math.min(8, fishes.length); i++) {
        const fish = document.createElement('div');
        const fishData = fishes[i % fishes.length];
        fish.className = 'fish';
        
        let fishColor = '#87CEEB';
        if (fishData.rarity === 'legendary') fishColor = '#FFD700';
        if (fishData.rarity === 'mythical') fishColor = '#FF69B4';
        if (fishData.rarity === 'secret') fishColor = '#00FFFF';
        if (fishData.rarity === 'special') fishColor = '#FF00FF';
        
        fish.style.color = fishColor;
        fish.style.position = 'absolute';
        fish.style.fontSize = '1.5rem';
        fish.style.textShadow = `0 0 10px ${fishColor}44`;
        
        const top = Math.random() * 150 + 50;
        const delay = Math.random() * 15;
        const speed = 8 + Math.random() * 12;
        
        fish.style.top = `${top}px`;
        fish.style.animation = `swim ${speed}s infinite linear`;
        fish.style.animationDelay = `${delay}s`;
        fish.textContent = fishData.emoji || '🐟';
        
        fishDisplay.appendChild(fish);
    }
}

// ==================== UPDATE DEPTH BUTTONS ====================
function updateDepthButtons() {
    const depthContainer = document.getElementById('depth-buttons');
    if (!depthContainer) return;
    
    depthContainer.innerHTML = '';
    
    Object.keys(DEPTH_LEVELS).forEach(key => {
        const depth = DEPTH_LEVELS[key];
        const btn = document.createElement('button');
        btn.className = 'depth-btn';
        btn.textContent = `${depth.icon} ${depth.name}`;
        
        const isUnlocked = fishingSystem.isDepthUnlocked(key);
        const isActive = key === currentDepth;
        
        if (!isUnlocked) {
            btn.classList.add('locked');
        }
        if (isActive) {
            btn.classList.add('active');
        }
        
        btn.addEventListener('click', () => {
            if (isUnlocked) {
                currentDepth = key;
                fishingSystem.switchDepth(key);
                updateDepthButtons();
                if (window.uiManager) uiManager.updateLuckDisplay();
                if (window.notification) notification.info(`🌊 Pindah ke ${depth.name}`);
            } else {
                if (window.notification) notification.error('🔒 Beli gear dulu!');
            }
        });
        
        depthContainer.appendChild(btn);
    });
}

// ==================== SWITCH TO MINING ====================
function switchToMining() {
    console.log('⛏️⛏️⛏️ switchToMining() CALLED! ⛏️⛏️⛏️');
    
    if (!checkMiningUnlock()) {
        notification.error('🔒 MINING TERKUNCI! Butuh Miner Helm (250💎) + Flashlight (1 Bitcoin)!');
        return;
    }
    
    const mainMenu = document.getElementById('main-menu');
    let miningMenu = document.getElementById('mining-menu');
    
    if (mainMenu) mainMenu.style.display = 'none';
    
    if (!miningMenu) {
        console.warn('⚠️ miningMenu not found! Creating...');
        createMiningMenu();
        setTimeout(() => {
            const newMenu = document.getElementById('mining-menu');
            if (newMenu) {
                newMenu.style.display = 'block';
                console.log('✅ miningMenu created and shown');
                loadMiningContent();
            }
        }, 150);
    } else {
        miningMenu.style.display = 'block';
        console.log('✅ miningMenu shown');
        loadMiningContent();
    }
}

function loadMiningContent() {
    setTimeout(() => {
        if (typeof miningUI !== 'undefined') {
            console.log('✅ miningUI found, loading...');
            miningUI.loadMiningMain();
            miningUI.loadMiningShop();
            miningUI.loadMiningSkillTree();
            miningUI.loadMiningExchange();
            miningUI.updateMiningStats();
            console.log('✅ Mining UI loaded');
        } else {
            console.error('❌ miningUI is undefined!');
        }
    }, 200);
}

// ==================== SWITCH TO DUNGEON ====================
function switchToDungeon() {
    if (!checkDungeonUnlock()) {
        notification.error('🔒 DUNGEON TERKUNCI! Butuh Ghost Ship (500💎) + One Ring (10 Secret Fish)!');
        return;
    }
    
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('dungeon-menu').style.display = 'block';
    
    dungeonUI.loadDungeonCharacter();
    dungeonUI.loadDungeonShop();
    dungeonUI.loadDungeonLevels();
    dungeonUI.loadTokenExchange();
    dungeonUI.updateDungeonStats();
}

function switchToMain() {
    document.getElementById('dungeon-menu').style.display = 'none';
    document.getElementById('main-menu').style.display = 'block';
}

function switchToMainFromMining() {
    console.log('◀ switchToMainFromMining() called');
    const miningMenu = document.getElementById('mining-menu');
    const mainMenu = document.getElementById('main-menu');
    if (miningMenu) miningMenu.style.display = 'none';
    if (mainMenu) mainMenu.style.display = 'block';
}

// ==================== CHECK MINING UNLOCK ====================
function checkMiningUnlock() {
    console.log('🔍 Checking mining unlock...');
    const hasHelm = gameData.depthGear.minerHelm === true;
    const hasFlashlight = gameData.specialItems.flashlight === true;
    gameData.mining.unlocked = hasHelm && hasFlashlight;
    
    const miningBtn = document.getElementById('mining-menu-btn');
    if (miningBtn) {
        if (gameData.mining.unlocked) {
            miningBtn.disabled = false;
            miningBtn.style.background = 'linear-gradient(45deg, #8B4513, #D2691E)';
            miningBtn.style.cursor = 'pointer';
            miningBtn.innerHTML = '⛏️ MINING';
        } else {
            miningBtn.disabled = true;
            miningBtn.style.background = '#666';
            miningBtn.style.cursor = 'not-allowed';
            miningBtn.innerHTML = '🔒 MINING TERKUNCI 🔒';
        }
    }
    return gameData.mining.unlocked;
}

// ==================== CHECK DUNGEON UNLOCK ====================
function checkDungeonUnlock() {
    const isUnlocked = dungeonSystem.isUnlocked();
    const dungeonBtn = document.getElementById('dungeon-menu-btn');
    if (dungeonBtn) {
        if (isUnlocked) {
            dungeonBtn.disabled = false;
            dungeonBtn.style.background = 'linear-gradient(45deg, #ff0000, #ff6b6b)';
            dungeonBtn.innerHTML = '⚔️ MASUK DUNGEON ⚔️';
        } else {
            dungeonBtn.disabled = true;
            dungeonBtn.style.background = '#666';
            dungeonBtn.innerHTML = '🔒 DUNGEON TERKUNCI 🔒';
        }
    }
    return isUnlocked;
}

// ==================== CREATE MINING BUTTON ====================
function createMiningButton() {
    console.log('🔨 createMiningButton() called');
    
    if (document.getElementById('mining-menu-btn')) {
        console.log('✅ Mining button already exists');
        const existingBtn = document.getElementById('mining-menu-btn');
        existingBtn.addEventListener('click', function(e) {
            console.log('⛏️ MINING BUTTON CLICKED!');
            e.preventDefault();
            switchToMining();
        });
        return;
    }
    
    const dungeonBtn = document.getElementById('dungeon-menu-btn');
    if (!dungeonBtn) {
        console.warn('⚠️ Dungeon button not found!');
        return;
    }
    
    const miningBtn = document.createElement('button');
    miningBtn.id = 'mining-menu-btn';
    miningBtn.className = 'dungeon-nav-btn mining-nav-btn';
    miningBtn.innerHTML = '⛏️ MINING';
    miningBtn.style.cssText = `
        padding: 10px 20px;
        background: linear-gradient(45deg, #8B4513, #D2691E);
        border: none;
        border-radius: 25px;
        color: white;
        font-weight: bold;
        font-size: 1.1rem;
        cursor: pointer;
        transition: all 0.3s;
        flex: 1;
        min-width: 140px;
        text-shadow: 0 1px 4px rgba(0,0,0,0.2);
        box-shadow: 0 4px 15px rgba(146, 64, 14, 0.3);
        margin-top: 10px;
    `;
    
    dungeonBtn.parentNode.insertBefore(miningBtn, dungeonBtn.nextSibling);
    console.log('✅ Mining button created!');
    
    miningBtn.addEventListener('click', function(e) {
        console.log('⛏️ MINING BUTTON CLICKED! (direct)');
        e.preventDefault();
        switchToMining();
    });
    
    checkMiningUnlock();
    return miningBtn;
}

// ==================== CREATE MINING MENU ====================
function createMiningMenu() {
    console.log('🔨 createMiningMenu() called');
    
    const container = document.querySelector('.container') || document.getElementById('app');
    if (!container) {
        console.error('❌ Container not found!');
        return;
    }
    
    if (document.getElementById('mining-menu')) {
        console.log('✅ Mining menu already exists');
        attachMiningEvents();
        return;
    }
    
    const miningMenu = document.createElement('div');
    miningMenu.id = 'mining-menu';
    miningMenu.style.display = 'none';
    miningMenu.innerHTML = `
        <div class="mining-header">
            <h1>⛏️ MINING AREA ⛏️</h1>
            <button id="back-to-main-from-mining" class="back-btn">◀ KEMBALI KE MEMANCING</button>
        </div>
        
        <div class="mining-stats">
            <div class="stat-card"><span>🪨 Rock:</span><span id="mining-rocks">0</span></div>
            <div class="stat-card"><span>⛏️ Total Mine:</span><span id="mining-total-mines">0</span></div>
            <div class="stat-card"><span>💰 Total Coin:</span><span id="mining-total-coins">0</span></div>
            <div class="stat-card"><span>💎 Total Diamond:</span><span id="mining-total-diamonds">0</span></div>
            <div class="stat-card"><span>🎯 Perfect:</span><span id="mining-perfect-count">0</span></div>
        </div>
        
        <nav class="mining-tabs">
            <button class="mining-tab active" data-mining-tab="main">⛏️ Mining</button>
            <button class="mining-tab" data-mining-tab="shop">🏪 Shop</button>
            <button class="mining-tab" data-mining-tab="skill">🌳 Skill</button>
            <button class="mining-tab" data-mining-tab="exchange">🔄 Exchange</button>
        </nav>
        
        <div class="mining-content">
            <div id="mining-main" class="mining-pane active"><div id="mining-main-content"></div></div>
            <div id="mining-shop" class="mining-pane"><div id="mining-shop-items"></div></div>
            <div id="mining-skill" class="mining-pane"><div id="mining-skill-tree"></div></div>
            <div id="mining-exchange" class="mining-pane"><div id="mining-exchange-items"></div></div>
        </div>
    `;
    
    const mainMenu = document.getElementById('main-menu');
    if (mainMenu) {
        mainMenu.parentNode.insertBefore(miningMenu, mainMenu.nextSibling);
    } else {
        container.appendChild(miningMenu);
    }
    
    console.log('✅ Mining menu created!');
    attachMiningEvents();
}

// ==================== ATTACH MINING EVENTS ====================
function attachMiningEvents() {
    console.log('🔗 Attaching mining events...');
    
    const backBtn = document.getElementById('back-to-main-from-mining');
    if (backBtn) {
        const newBackBtn = backBtn.cloneNode(true);
        backBtn.parentNode.replaceChild(newBackBtn, backBtn);
        newBackBtn.addEventListener('click', function() {
            console.log('◀ Back to main clicked');
            switchToMainFromMining();
        });
    }
    
    document.querySelectorAll('.mining-tab').forEach(tab => {
        const tabId = tab.getAttribute('data-mining-tab');
        const newTab = tab.cloneNode(true);
        tab.parentNode.replaceChild(newTab, tab);
        newTab.addEventListener('click', function(e) {
            console.log('📑 Mining tab clicked:', tabId);
            e.preventDefault();
            
            document.querySelectorAll('.mining-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            document.querySelectorAll('.mining-pane').forEach(p => p.classList.remove('active'));
            const pane = document.getElementById(`mining-${tabId}`);
            if (pane) pane.classList.add('active');
            
            if (typeof miningUI !== 'undefined') {
                switch(tabId) {
                    case 'main': miningUI.loadMiningMain(); break;
                    case 'shop': miningUI.loadMiningShop(); break;
                    case 'skill': miningUI.loadMiningSkillTree(); break;
                    case 'exchange': miningUI.loadMiningExchange(); break;
                }
            }
        });
    });
    
    console.log('✅ Mining events attached!');
}

// ==================== SETUP FISHING BUTTON ====================
let fishingButtonSetup = false;

function setupFishingButton() {
    if (fishingButtonSetup) {
        console.log('⚠️ Fishing button already setup, skipping...');
        return;
    }
    
    const fishBtn = document.getElementById('fish-btn');
    if (!fishBtn) {
        console.error('❌ Fish button not found!');
        return;
    }
    
    console.log('✅ Fish button found');
    const newFishBtn = fishBtn.cloneNode(true);
    fishBtn.parentNode.replaceChild(newFishBtn, fishBtn);
    
    newFishBtn.addEventListener('click', function(e) {
        console.log('🔄 Fish button clicked!');
        e.preventDefault();
        if (typeof fishingSystem === 'undefined') {
            console.error('❌ fishingSystem is undefined!');
            return;
        }
        fishingSystem.startFishing();
    });
    
    fishingButtonSetup = true;
    console.log('✅ Fishing button listener attached!');
}

// ==================== UPDATE SYSTEM ====================
function checkForUpdateOnStart() {
    const currentVer = gameData.version;
    const latestVer = GAME_VERSIONS.latest;
    if (currentVer < latestVer && !gameData.updateSettings.updateIgnored) {
        gameData.updateSettings.updateAvailable = true;
        if (!gameData.updateSettings.remindLater) {
            showUpdateNotification();
        } else {
            if (gameData.updateSettings.remindTime && Date.now() > gameData.updateSettings.remindTime) {
                gameData.updateSettings.remindLater = false;
                showUpdateNotification();
            }
        }
    }
    updateUIVersion();
}

function showUpdateNotification() {
    let notif = document.getElementById('update-notification');
    if (!notif) {
        notif = document.createElement('div');
        notif.id = 'update-notification';
        notif.className = 'modal';
        notif.innerHTML = `
            <div class="modal-content" style="border: 3px solid #00ffff;">
                <span class="close" onclick="closeUpdateNotif()">&times;</span>
                <h3 style="color: #00ffff;">🎉 UPDATE TERSEDIA!</h3>
                <div style="text-align: center; padding: 20px;">
                    <div style="font-size: 4rem; margin: 20px;">⬇️</div>
                    <p style="font-size: 1.2rem; margin-bottom: 15px;">
                        Versi baru <strong>${GAME_VERSIONS.latest}.0</strong> telah tersedia!
                    </p>
                    <p style="color: #00ff00; margin-bottom: 20px;" id="notif-features">
                        ✨ ${GAME_VERSIONS.features[GAME_VERSIONS.latest] || 'Fitur baru!'}
                    </p>
                    <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                        <button onclick="performUpdate()" style="padding: 10px 20px; background: #4CAF50; border: none; border-radius: 5px; color: white; cursor: pointer;">⬇️ Update Sekarang</button>
                        <button onclick="remindLater()" style="padding: 10px 20px; background: #FFA500; border: none; border-radius: 5px; color: white; cursor: pointer;">⏰ Nanti Saja</button>
                        <button onclick="ignoreUpdate()" style="padding: 10px 20px; background: #666; border: none; border-radius: 5px; color: white; cursor: pointer;">❌ Abaikan</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(notif);
    }
    notif.style.display = 'block';
}

function closeUpdateNotif() {
    const notif = document.getElementById('update-notification');
    if (notif) notif.style.display = 'none';
}

function updateUIVersion() {
    const currentEl = document.getElementById('current-version');
    const latestEl = document.getElementById('latest-version');
    const statusEl = document.getElementById('update-status');
    const updateBtn = document.getElementById('update-now-btn');
    const remindBtn = document.getElementById('remind-later-btn');
    const ignoreBtn = document.getElementById('ignore-update-btn');
    const featuresDiv = document.getElementById('update-features');
    
    if (currentEl) currentEl.textContent = gameData.version + '.0';
    if (latestEl) latestEl.textContent = GAME_VERSIONS.latest + '.0';
    
    if (statusEl) {
        if (gameData.version < GAME_VERSIONS.latest) {
            statusEl.innerHTML = '⚠️ Update tersedia!';
            statusEl.style.color = '#FFA500';
            if (updateBtn) updateBtn.style.display = 'block';
            if (remindBtn) remindBtn.style.display = 'block';
            if (ignoreBtn) ignoreBtn.style.display = 'block';
            if (featuresDiv) {
                let features = '';
                for (let v = gameData.version + 1; v <= GAME_VERSIONS.latest; v++) {
                    if (GAME_VERSIONS.features[v]) {
                        features += `<li>✨ ${GAME_VERSIONS.features[v]}</li>`;
                    }
                }
                featuresDiv.innerHTML = `<strong>✨ Fitur baru yang akan didapat:</strong><ul style="margin-top: 5px; margin-left: 20px;">${features}</ul>`;
            }
        } else {
            statusEl.innerHTML = '✅ Game sudah versi terbaru';
            statusEl.style.color = '#00ff00';
            if (updateBtn) updateBtn.style.display = 'none';
            if (remindBtn) remindBtn.style.display = 'none';
            if (ignoreBtn) ignoreBtn.style.display = 'none';
            if (featuresDiv) featuresDiv.innerHTML = '<p style="color: #00ff00;">✅ Semua fitur terbaru sudah tersedia!</p>';
        }
    }
}

function performUpdate() {
    if (confirm('⚠️ Update akan mereset progress game. Lanjutkan?')) {
        localStorage.removeItem('fishLegSave');
        gameData.version = GAME_VERSIONS.latest;
        gameData.updateSettings.updateAvailable = false;
        gameData.updateSettings.updateIgnored = false;
        gameData.updateSettings.remindLater = false;
        closeUpdateNotif();
        updateUIVersion();
        notification.success('✅ Update berhasil! Game akan direfresh.');
        setTimeout(() => { location.reload(); }, 2000);
    }
}

function remindLater() {
    gameData.updateSettings.remindLater = true;
    gameData.updateSettings.remindTime = Date.now() + (60 * 60 * 1000);
    closeUpdateNotif();
    notification.info('⏰ Akan diingatkan lagi 1 jam lagi');
}

function ignoreUpdate() {
    if (confirm('Yakin ingin mengabaikan update ini?')) {
        gameData.updateSettings.updateIgnored = true;
        gameData.updateSettings.updateAvailable = false;
        closeUpdateNotif();
        updateUIVersion();
        notification.info('❌ Update diabaikan');
    }
}

// ==================== TIMERS ====================
function startPotionTimer() {
    setInterval(() => {
        if (gameData.activePotions.length > 0) {
            const potion = gameData.activePotions[0];
            potion.duration--;
            if (potion.duration <= 0) {
                gameData.activePotions = [];
                notification.info('⏰ Efek potion sudah habis!');
            }
        }
    }, 60000);
}

function startAssistantTimer() {
    setInterval(() => {
        if (gameData.village.assistants > 0 && !fishingSystem.isFishing) {
            const now = Date.now();
            if (now - gameData.village.lastAssistantFish > 30000) {
                gameData.village.lastAssistantFish = now;
                assistantFish();
            }
        }
    }, 5000);
}

function assistantFish() {
    const assistants = gameData.village.assistants;
    for (let i = 0; i < assistants; i++) {
        setTimeout(() => {
            const fish = fishingSystem.getRandomFish();
            if (fish) {
                gameData.backpack.push({ ...fish, catchTime: Date.now(), perfectCatch: false });
                gameData.totalFishCaught++;
                gameState.addToAquarium(fish);
                if (window.autoSellSettings && window.autoSellSettings[fish.rarity]) {
                    gameData.coins = Number(gameData.coins) + Number(fish.price);
                    gameData.backpack.pop();
                }
                notification.info(`👥 Assistant caught: ${fish.emoji} ${fish.name}`);
                uiManager.updateTopBar();
                inventoryUI.loadBackpack();
            }
        }, i * 1000);
    }
}

function startRobotTimer() {
    setInterval(() => {
        if (petSystem.isPetActive(5) && !fishingSystem.isFishing) {
            const fish = fishingSystem.getRandomFish();
            if (fish) {
                gameData.backpack.push({ ...fish, catchTime: Date.now(), perfectCatch: false });
                gameData.totalFishCaught++;
                gameState.addToAquarium(fish);
                if (window.autoSellSettings && window.autoSellSettings[fish.rarity]) {
                    gameData.coins = Number(gameData.coins) + Number(fish.price);
                    gameData.backpack.pop();
                }
                notification.info(`🤖 Robot caught: ${fish.emoji} ${fish.name}`);
                uiManager.updateTopBar();
                inventoryUI.loadBackpack();
            }
        }
    }, 30000);
}

// ==================== WEATHER CYCLE ====================
function startWeatherCycle() {
    fishingSystem.changeWeather();
    setInterval(() => {
        fishingSystem.changeWeather();
        uiManager.updateWeatherDisplay();
        uiManager.updateLuckDisplay();
    }, 300000);
}

// ==================== INITIALIZATION ====================
function initGame() {
    console.log('🎮 Initializing game...');

    uiManager.init();
    modalManager.init();
    notification.init();
    inventoryUI.init();
    shopUI.init();
    gachaUI.init();
    dungeonUI.init();
    miningUI.init();
    aquariumUI.init();
    gamepassUI.init();
    rankUI.init();
    exchangeUI.init();
    villageUI.init();
    depthGearUI.init();
    skillUI.init();
    petUI.init();
    questUI.init();

    const requiredElements = ['coins', 'level', 'fish-btn', 'gacha-btn', 'backpack-items', 'shop-items', 'sell-items'];
    const allExist = requiredElements.every(id => document.getElementById(id) !== null);
    
    if (!allExist) {
        console.log('⏳ Elements not ready, retrying...');
        setTimeout(initGame, 100);
        return;
    }

    saveManager.load();

    // Setup initial spot
    fishingSystem.currentSpot = 0;
    const initialSpot = FISHING_SPOTS[0];
    if (initialSpot) {
        document.body.style.background = initialSpot.background;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundAttachment = 'fixed';
    }

    uiManager.createSpotButtons();
    uiManager.updateTopBar();
    uiManager.updateWeatherDisplay();
    uiManager.updateLuckDisplay();

    // Setup spot buttons
    const spotContainer = document.getElementById('spot-buttons');
    if (spotContainer) {
        spotContainer.innerHTML = '';
        FISHING_SPOTS.forEach(spot => {
            const spotBtn = document.createElement('button');
            spotBtn.className = 'spot-btn';
            spotBtn.setAttribute('data-spot', spot.id);
            spotBtn.textContent = spot.name;
            spotBtn.style.background = spot.id === fishingSystem.currentSpot ? '#FFD700' : spot.color;
            spotBtn.style.color = spot.id === fishingSystem.currentSpot ? '#000' : '#fff';
            spotBtn.style.padding = '8px 16px';
            spotBtn.style.border = 'none';
            spotBtn.style.borderRadius = '20px';
            spotBtn.style.margin = '5px';
            spotBtn.style.cursor = 'pointer';
            spotBtn.style.fontWeight = 'bold';
            spotBtn.style.transition = 'all 0.3s';
            
            if (spot.id === 7) {
                spotBtn.style.animation = 'pulse 2s infinite';
                spotBtn.style.boxShadow = '0 0 15px #00ffff';
            }
            if (spot.id === 8) {
                spotBtn.style.animation = 'valinorPulse 2s infinite';
                spotBtn.style.boxShadow = '0 0 15px #FFD700';
            }
            
            spotBtn.addEventListener('click', () => {
                switchFishingSpot(spot.id);
            });
            
            spotContainer.appendChild(spotBtn);
        });
    }

    inventoryUI.loadBackpack();
    inventoryUI.loadSellItems();
    shopUI.loadShop('rods');
    gachaUI.updateGachaTab();
    aquariumUI.loadAquarium();
    villageUI.loadVillage();
    gamepassUI.loadGamepass();
    rankUI.loadRankBattle();
    exchangeUI.loadExchange();
    depthGearUI.loadDepthGearShop();
    skillUI.loadSkillTree();
    petUI.loadPetShop();
    questUI.loadQuests();

    setupFishingButton();

    const gachaBtn = document.getElementById('gacha-btn');
    if (gachaBtn) {
        gachaBtn.addEventListener('click', () => {
            gachaUI.spinGacha();
        });
    }

    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            uiManager.switchTab(tabId);
            
            switch(tabId) {
                case 'backpack': inventoryUI.loadBackpack(); break;
                case 'shop': shopUI.loadShop(shopUI.currentCategory); break;
                case 'sell': inventoryUI.loadSellItems(); break;
                case 'gacha': gachaUI.updateGachaTab(); break;
                case 'quests': questUI.loadQuests(); break;
                case 'aquarium': aquariumUI.loadAquarium(); break;
                case 'village': villageUI.loadVillage(); break;
                case 'pets': petUI.loadPetShop(); break;
                case 'exchange': exchangeUI.loadExchange(); break;
                case 'skills': skillUI.loadSkillTree(); break;
                case 'gamepass': gamepassUI.loadGamepass(); break;
                case 'rank': rankUI.loadRankBattle(); break;
                case 'depth-gear': depthGearUI.loadDepthGearShop(); break;
                case 'settings': break;
                default: break;
            }
        });
    });

    const dungeonBtn = document.getElementById('dungeon-menu-btn');
    if (dungeonBtn) {
        dungeonBtn.addEventListener('click', switchToDungeon);
    }

    createMiningButton();

    const backToMainBtn = document.getElementById('back-to-main');
    if (backToMainBtn) {
        backToMainBtn.addEventListener('click', switchToMain);
    }

    const backToMainFromMiningBtn = document.getElementById('back-to-main-from-mining');
    if (backToMainFromMiningBtn) {
        backToMainFromMiningBtn.addEventListener('click', switchToMainFromMining);
    }

    startPotionTimer();
    startWeatherCycle();
    startAssistantTimer();
    startRobotTimer();

    checkForUpdateOnStart();
    checkDungeonUnlock();
    checkMiningUnlock();

    saveManager.startAutoSave();

    console.log('✅ Game initialized successfully!');
    notification.success('🎮 Game loaded successfully! Cari Miner Helm & Flashlight untuk buka Mining!');
}

// ==================== START GAME ====================
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('🚀 Starting game...');
        initGame();
    } catch (error) {
        console.error('❌ Game initialization error:', error);
        notification.error('❌ Game initialization failed. Please refresh.');
    }
});

// Export global functions
window.switchFishingSpot = switchFishingSpot;
window.currentSpot = currentSpot;
window.currentDepth = currentDepth;
window.performUpdate = performUpdate;
window.remindLater = remindLater;
window.ignoreUpdate = ignoreUpdate;
window.closeUpdateNotif = closeUpdateNotif;
window.checkMiningUnlock = checkMiningUnlock;
window.checkDungeonUnlock = checkDungeonUnlock;
window.switchToDungeon = switchToDungeon;
window.switchToMining = switchToMining;
window.switchToMain = switchToMain;
window.switchToMainFromMining = switchToMainFromMining;
window.startFishing = () => fishingSystem.startFishing();

window.gameData = gameData;
window.gameState = gameState;
window.saveManager = saveManager;
window.fishingSystem = fishingSystem;
window.miningSystem = miningSystem;
window.dungeonSystem = dungeonSystem;
window.rankSystem = rankSystem;
window.questSystem = questSystem;
window.petSystem = petSystem;
window.skillSystem = skillSystem;
window.uiManager = uiManager;
window.modalManager = modalManager;
window.notification = notification;
window.depthGearUI = depthGearUI;
window.skillUI = skillUI;
window.petUI = petUI;
window.questUI = questUI;
window.miningUI = miningUI;
