// js/core/event-bus.js

// ==================== QUEST SYSTEM DATA ====================
export const QUESTS = [
    { id: 1, name: "Element Rod Quest", desc: "Tangkap 2 ikan Secret di Kuil Suci", target: 2, progress: 0, completed: false, reward: "Element Rod", type: "secret_kuil" },
    { id: 2, name: "Trident Rod Quest", desc: "Tangkap 1 Secret di semua spot", target: 4, progress: 0, completed: false, reward: "Trident Rod", type: "secret_all_spots" },
    { id: 3, name: "1x1x1 Rod Quest", desc: "Tangkap 5 ikan Secret di Luar Angkasa", target: 5, progress: 0, completed: false, reward: "1x1x1 Rod", type: "secret_angkasa" },
    { id: 4, name: "Bitcoin Bait Quest", desc: "Dapatkan 1 Bitcoin untuk mendapatkan Bitcoin Bait", target: 1, progress: 0, completed: false, reward: "Bitcoin Bait", type: "bitcoin" }
];

// ==================== EVENT BUS ====================
class EventBus {
    constructor() {
        this.events = {};
    }

    // Subscribe ke event
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
        
        // Return unsubscribe function
        return () => {
            this.events[event] = this.events[event].filter(cb => cb !== callback);
        };
    }

    // Emit event
    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(callback => {
                try {
                    callback(data);
                } catch (e) {
                    console.error(`Error in event ${event}:`, e);
                }
            });
        }
    }

    // Hapus semua listener untuk event tertentu
    off(event) {
        delete this.events[event];
    }

    // Hapus semua listener
    clear() {
        this.events = {};
    }
}

// Singleton instance
export const eventBus = new EventBus();

// ==================== EVENT TYPES ====================
export const EVENTS = {
    // Game state events
    STATE_CHANGED: 'state:changed',
    COINS_UPDATED: 'state:coins',
    DIAMONDS_UPDATED: 'state:diamonds',
    LEVEL_UPDATED: 'state:level',
    EXP_UPDATED: 'state:exp',
    BACKPACK_UPDATED: 'state:backpack',
    
    // Fishing events
    FISHING_STARTED: 'fishing:started',
    FISHING_CAUGHT: 'fishing:caught',
    FISHING_FINISHED: 'fishing:finished',
    PERFECT_CATCH: 'fishing:perfect',
    
    // Shop events
    ITEM_BOUGHT: 'shop:item_bought',
    ITEM_EQUIPPED: 'shop:item_equipped',
    ITEM_SOLD: 'shop:item_sold',
    
    // Pet events
    PET_BOUGHT: 'pet:bought',
    PET_ACTIVATED: 'pet:activated',
    PET_DEACTIVATED: 'pet:deactivated',
    
    // Dungeon events
    DUNGEON_ENTERED: 'dungeon:entered',
    DUNGEON_BATTLE_START: 'dungeon:battle_start',
    DUNGEON_BATTLE_END: 'dungeon:battle_end',
    DUNGEON_VICTORY: 'dungeon:victory',
    DUNGEON_DEFEAT: 'dungeon:defeat',
    
    // Mining events
    MINING_STARTED: 'mining:started',
    MINING_FINISHED: 'mining:finished',
    MINING_PERFECT: 'mining:perfect',
    
    // Quest events
    QUEST_PROGRESS: 'quest:progress',
    QUEST_COMPLETED: 'quest:completed',
    
    // UI events
    UI_TAB_CHANGED: 'ui:tab_changed',
    UI_MODAL_OPENED: 'ui:modal_opened',
    UI_MODAL_CLOSED: 'ui:modal_closed',
    
    // Notification events
    NOTIFICATION: 'notification:show'
};