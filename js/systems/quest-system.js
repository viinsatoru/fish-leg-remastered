// js/systems/quest-system.js

import { gameState, gameData } from '../core/game-state.js';
import { eventBus, EVENTS } from '../core/event-bus.js';
import { saveManager } from '../core/save-manager.js';
import { QUESTS } from '../core/event-bus.js';
import { RODS, BAITS } from '../data/equipment.js';
import { fishingSystem } from './fishing-system.js';

// ==================== QUEST SYSTEM ====================
class QuestSystem {
    constructor() {
        this.quests = QUESTS;
        this.caughtSecretSpots = fishingSystem.getCaughtSecretSpots();
    }

    getQuests() {
        return this.quests;
    }

    getActiveQuests() {
        return this.quests.filter(q => !q.completed);
    }

    getCompletedQuests() {
        return this.quests.filter(q => q.completed);
    }

    updateQuestProgress(fish) {
        if (fish.id === 606) {
            const quest4 = this.quests.find(q => q.id === 4);
            if (quest4 && !quest4.completed) {
                quest4.progress = Number(quest4.progress) + 1;
                if (quest4.progress >= quest4.target) {
                    quest4.completed = true;
                    this.completeQuest(quest4);
                }
                eventBus.emit(EVENTS.QUEST_PROGRESS, { quest: quest4 });
            }
        }

        if (fish.rarity === "secret" || fish.rarity === "special") {
            if (fish.spot === "kuil") {
                const quest1 = this.quests.find(q => q.id === 1);
                if (quest1 && !quest1.completed) {
                    quest1.progress = Number(quest1.progress) + 1;
                    if (quest1.progress >= quest1.target) {
                        quest1.completed = true;
                        this.completeQuest(quest1);
                    }
                    eventBus.emit(EVENTS.QUEST_PROGRESS, { quest: quest1 });
                }
            }

            if (fish.spot && !this.caughtSecretSpots[fish.spot]) {
                this.caughtSecretSpots[fish.spot] = true;
                
                const quest2 = this.quests.find(q => q.id === 2);
                if (quest2 && !quest2.completed) {
                    quest2.progress = Object.values(this.caughtSecretSpots).filter(Boolean).length;
                    if (quest2.progress >= quest2.target) {
                        quest2.completed = true;
                        this.completeQuest(quest2);
                    }
                    eventBus.emit(EVENTS.QUEST_PROGRESS, { quest: quest2 });
                }
            }

            if (fish.spot === "angkasa") {
                const quest3 = this.quests.find(q => q.id === 3);
                if (quest3 && !quest3.completed) {
                    quest3.progress = Number(quest3.progress) + 1;
                    if (quest3.progress >= quest3.target) {
                        quest3.completed = true;
                        this.completeQuest(quest3);
                    }
                    eventBus.emit(EVENTS.QUEST_PROGRESS, { quest: quest3 });
                }
            }
        }

        saveManager.forceSave();
    }

    completeQuest(quest) {
        eventBus.emit(EVENTS.QUEST_COMPLETED, { quest });
        eventBus.emit(EVENTS.NOTIFICATION, { 
            message: `🎉 Quest "${quest.name}" selesai! Reward: ${quest.reward}`, 
            type: 'success' 
        });
        this.giveQuestReward(quest);
    }

    giveQuestReward(quest) {
        switch (quest.reward) {
            case "Element Rod":
                const elementRod = RODS.find(r => r.id === 7);
                if (elementRod) {
                    elementRod.unlocked = true;
                    elementRod.owned = true;
                    gameData.currentRod = 7;
                    eventBus.emit(EVENTS.NOTIFICATION, { 
                        message: "🔓 Element Rod unlocked! +200x Luck!", 
                        type: 'success' 
                    });
                }
                break;
            case "Trident Rod":
                const tridentRod = RODS.find(r => r.id === 8);
                if (tridentRod) {
                    tridentRod.unlocked = true;
                    tridentRod.owned = true;
                    gameData.currentRod = 8;
                    eventBus.emit(EVENTS.NOTIFICATION, { 
                        message: "🔓 Trident Rod unlocked! +250x Luck!", 
                        type: 'success' 
                    });
                }
                break;
            case "1x1x1 Rod":
                const oneByOneRod = RODS.find(r => r.id === 11);
                if (oneByOneRod) {
                    oneByOneRod.unlocked = true;
                    oneByOneRod.owned = true;
                    gameData.currentRod = 11;
                    eventBus.emit(EVENTS.NOTIFICATION, { 
                        message: "🔓 1x1x1 Rod unlocked! +1111x Luck!", 
                        type: 'success' 
                    });
                }
                break;
            case "Bitcoin Bait":
                const bitcoinBait = BAITS.find(b => b.id === 9);
                if (bitcoinBait) {
                    bitcoinBait.owned = true;
                    eventBus.emit(EVENTS.NOTIFICATION, { 
                        message: "🪱 Bitcoin Bait unlocked! +5000x Luck!", 
                        type: 'success' 
                    });
                }
                break;
        }
        saveManager.forceSave();
    }

    reset() {
        this.quests.forEach(q => {
            q.progress = 0;
            q.completed = false;
        });
        this.caughtSecretSpots = {
            danau: false, kuil: false, laut: false, sungai: false, 
            angkasa: false, brainrot: false, crypto: false, 
            atlantis: false, valinor: false
        };
        saveManager.forceSave();
    }
}

export const questSystem = new QuestSystem();
export const updateQuestProgress = (fish) => questSystem.updateQuestProgress(fish);
export const loadQuests = () => questSystem.getQuests();
export const completeQuest = (quest) => questSystem.completeQuest(quest);