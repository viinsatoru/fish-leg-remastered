// js/ui/ui-manager.js

import { gameState, gameData } from '../core/game-state.js';
import { eventBus, EVENTS } from '../core/event-bus.js';
import { fishingSystem } from '../systems/fishing-system.js';
import { saveManager } from '../core/save-manager.js';
import { DEPTH_LEVELS } from '../config/constants.js';
import { RODS, BAITS } from '../data/equipment.js';
import { FISHING_SPOTS } from '../data/fishing-spots.js';

// ==================== UI MANAGER ====================
class UIManager {
    constructor() {
        this.elements = {};
        this.currentTab = 'backpack';
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;

        this.elements = {
            coins: document.getElementById('coins'),
            diamonds: document.getElementById('diamonds'),
            exp: document.getElementById('exp'),
            level: document.getElementById('level'),
            fishBtn: document.getElementById('fish-btn'),
            gachaBtn: document.getElementById('gacha-btn'),
            backpackItems: document.getElementById('backpack-items'),
            shopItems: document.getElementById('shop-items'),
            sellItems: document.getElementById('sell-items'),
            sellTotal: document.getElementById('sell-total'),
            sellBtn: document.getElementById('sell-btn'),
            sellAllBtn: document.getElementById('sell-all-btn'),
            resultModal: document.getElementById('result-modal'),
            gachaModal: document.getElementById('gacha-modal'),
            exchangeModal: document.getElementById('exchange-modal'),
            rankModal: document.getElementById('rank-modal'),
            dungeonModal: document.getElementById('dungeon-modal'),
            battleModal: document.getElementById('battle-modal'),
            miningModal: document.getElementById('mining-modal'),
            miningResultModal: document.getElementById('mining-result-modal'),
            resultTitle: document.getElementById('result-title'),
            resultContent: document.getElementById('result-content'),
            gachaTitle: document.getElementById('gacha-title'),
            gachaContent: document.getElementById('gacha-content'),
            miningResultContent: document.getElementById('mining-result-content'),
            minigameIndicator: document.getElementById('minigame-indicator'),
            miningMinigameIndicator: document.getElementById('mining-minigame-indicator'),
            spotButtons: document.getElementById('spot-buttons'),
            weatherDisplay: document.getElementById('weather-display'),
            luckDisplay: document.getElementById('luck-display'),
            notificationContainer: document.getElementById('notification-container')
        };

        this.initialized = true;
        this.setupStateListeners();
        console.log('✅ UI Manager initialized');
    }

    setupStateListeners() {
        gameState.subscribe((key, value) => {
            switch(key) {
                case 'coins':
                case 'diamonds':
                case 'level':
                case 'exp':
                    this.updateTopBar();
                    break;
                case 'backpack':
                    break;
                default:
                    break;
            }
        });

        // ============ HAPUS DUPLICATE NOTIFICATION ============
        // Notification sudah di-handle oleh notification.js
        // eventBus.on(EVENTS.NOTIFICATION, (data) => {
        //     this.showNotification(data.message, data.type);
        // });
    }

    updateTopBar() {
        if (this.elements.coins) {
            this.elements.coins.textContent = gameData.coins;
        }
        if (this.elements.diamonds) {
            this.elements.diamonds.textContent = gameData.diamonds;
        }
        if (this.elements.level) {
            this.elements.level.textContent = gameData.level;
        }
        if (this.elements.exp) {
            this.elements.exp.textContent = `${gameData.exp}/${gameData.level * 100}`;
        }
    }

    showNotification(message, type = 'info') {
        if (!this.elements.notificationContainer) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const colors = {
            success: '#4CAF50',
            error: '#FF6B6B',
            warning: '#FFA500',
            info: '#2196F3'
        };

        notification.style.background = colors[type] || colors.info;
        notification.style.color = 'white';
        notification.style.padding = '12px 20px';
        notification.style.borderRadius = '8px';
        notification.style.margin = '10px';
        notification.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
        notification.style.animation = 'slideIn 0.3s ease';
        notification.textContent = message;

        this.elements.notificationContainer.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (this.elements.notificationContainer.contains(notification)) {
                    this.elements.notificationContainer.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    switchTab(tabId) {
        this.currentTab = tabId;
        
        document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));

        const activeTab = document.querySelector(`[data-tab="${tabId}"]`);
        const activePane = document.getElementById(tabId);

        if (activeTab) activeTab.classList.add('active');
        if (activePane) activePane.classList.add('active');

        eventBus.emit(EVENTS.UI_TAB_CHANGED, { tab: tabId });
    }

    createSpotButtons() {
        if (!this.elements.spotButtons) return;

        this.elements.spotButtons.innerHTML = '';

        FISHING_SPOTS.forEach(spot => {
            const spotBtn = document.createElement('button');
            spotBtn.className = 'spot-btn';
            spotBtn.setAttribute('data-spot', spot.id);
            spotBtn.textContent = spot.name;
            
            const isActive = spot.id === fishingSystem.currentSpot;
            spotBtn.style.background = isActive ? '#FFD700' : spot.color;
            spotBtn.style.color = isActive ? '#000' : '#fff';
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
                fishingSystem.switchSpot(spot.id);
                this.createSpotButtons();
                this.updateWeatherDisplay();
                this.updateLuckDisplay();
            });

            this.elements.spotButtons.appendChild(spotBtn);
        });
    }

    updateWeatherDisplay() {
        if (!this.elements.weatherDisplay) return;
        const weather = fishingSystem.getCurrentWeather();
        this.elements.weatherDisplay.innerHTML = `${weather.icon} ${weather.text}`;
        this.elements.weatherDisplay.style.color = weather.color;
    }

    updateLuckDisplay() {
        if (!this.elements.luckDisplay) return;

        const totalLuck = fishingSystem.calculateTotalLuck();
        const activePets = fishingSystem.getActivePets();
        const currentDepth = fishingSystem.currentDepth;
        const depthData = DEPTH_LEVELS[currentDepth] || DEPTH_LEVELS.surface;
        const weather = fishingSystem.getCurrentWeather();

        let petBonusText = '';
        if (activePets.length > 0) {
            petBonusText = activePets.map(pet => {
                if (pet.effect.type === 'perfect_chance') return '🐓 Perfect Catch';
                if (pet.effect.type === 'auto_fish') return '🤖 Auto-fish';
                if (pet.effect.type === 'double_chance') return '🦨 Double Chance';
                if (pet.effect.type === 'gacha_multiplier') return '🦄 2x Gacha Luck';
                if (pet.effect.type === 'rank_bonus') return '🦖 +10% Rank';
                return pet.description;
            }).join(', ');
        }

        const currentRod = RODS.find(r => r.id === gameData.currentRod);
        const currentBait = BAITS.find(b => b.id === gameData.currentBait);

        this.elements.luckDisplay.innerHTML = `
            <div style="text-align: center; padding: 15px; background: rgba(0,0,0,0.2); border-radius: 8px; margin: 15px 0;">
                <h4 style="color: #FFD700; margin-bottom: 10px;">🎯 Total Luck: ${totalLuck.toFixed(1)}x</h4>
                <div style="font-size: 0.9rem; text-align: left;">
                    <div>🎣 Rod: ${currentRod?.name || 'Unknown'} (${currentRod?.luck || 1}x)</div>
                    <div>🪱 Bait: ${currentBait?.name || 'Unknown'} (${currentBait?.luck || 1}x)</div>
                    <div>🏠 Hut: +${gameData.village.hutLevel * 10}%</div>
                    ${activePets.length > 0 ? `<div>🐕 Pet(s): ${petBonusText}</div>` : ''}
                    <div>🍀 Lucky Skill: +${gameData.skills.lucky.level * 100}%</div>
                    ${gameData.skills.expert ? `<div>📚 Expert Skill: +${gameData.skills.expert.level * 10} EXP Gamepass</div>` : ''}
                    ${gameData.skills.penawar ? `<div>💰 Penawar Skill: +${gameData.skills.penawar.level * 10}% Harga Jual</div>` : ''}
                    ${gameData.activePotions.length > 0 ? 
                        `<div>🧪 Potion: ${gameData.activePotions[0].name} (${gameData.activePotions[0].multiplier}x)</div>` : ''}
                    <div>🌤️ Weather: ${weather.text} (${weather.luck}x)</div>
                    <div>📍 Depth: ${depthData.name} (${depthData.luckMultiplier}x luck)</div>
                </div>
            </div>
        `;
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            eventBus.emit(EVENTS.UI_MODAL_OPENED, { modal: modalId });
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            eventBus.emit(EVENTS.UI_MODAL_CLOSED, { modal: modalId });
        }
    }

    getElement(id) {
        return this.elements[id] || document.getElementById(id);
    }
}

export const uiManager = new UIManager();

export const updateUI = () => uiManager.updateTopBar();
export const showNotification = (msg, type) => uiManager.showNotification(msg, type);
export const switchTab = (tabId) => uiManager.switchTab(tabId);
export const createSpotButtons = () => uiManager.createSpotButtons();
export const updateWeatherDisplay = () => uiManager.updateWeatherDisplay();
export const updateLuckDisplay = () => uiManager.updateLuckDisplay();