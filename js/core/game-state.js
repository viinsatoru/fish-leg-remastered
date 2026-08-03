// js/core/game-state.js

// ==================== DEFAULT GAME STATE ====================
export function createDefaultGameState() {
    return {
        version: 1,
        coins: 1000,
        diamonds: 0,
        exp: 0,
        level: 1,
        currentRod: 0,
        currentBait: 0,
        currentDepth: "surface",
        depthGear: {
            boat: false,
            ship: false,
            snorkel: false,
            submarine: false,
            turtleHat: false,
            maskOfSatoshi: false,
            ghostShip: false,
            crownOfSilmarillion: false,
            minerHelm: false
        },
        backpack: [],
        selectedFish: [],
        totalSellValue: 0,
        activePotions: [],
        totalFishCaught: 0,
        gachaStats: {
            totalSpins: 0,
            rodsObtained: [],
            secretGachaCount: 0,
            cryptoGachaCount: 0,
            illuvatarGachaCount: 0,
            mysteryBoxes: {
                basic: 0,
                normal: 0,
                secret: 0
            }
        },
        village: {
            hutLevel: 1,
            assistants: 0,
            lastAssistantFish: 0
        },
        settings: {
            animations: true,
            notifications: true
        },
        aquarium: {
            basic: {},
            legendary: {},
            mythical: {},
            secret: {},
            special: {}
        },
        pets: {
            owned: [],
            active: [],
            activeSlots: 1
        },
        skills: {
            lucky: { level: 0, bonus: 0 },
            cast: { level: 0, bonus: 0 },
            expert: { level: 0, bonus: 0 },
            penawar: { level: 0, bonus: 0 },
            animalLovers: { unlocked: false }
        },
        gamepass: {
            owned: false,
            level: 1,
            exp: 0,
            rewardsClaimed: []
        },
        rank: {
            current: "Warrior",
            exp: 0,
            wins: 0,
            losses: 0,
            totalBattles: 0,
            leaderboardPosition: 0,
            highestRank: "Warrior"
        },
        updateSettings: {
            lastUpdateCheck: Date.now(),
            updateAvailable: false,
            updateIgnored: false,
            remindLater: false,
            remindTime: null
        },
        atlantis: {
            active: true,
            spotId: 7
        },
        favoriteFish: [],
        dungeon: {
            unlocked: false,
            fishEquipment: {
                equippedFish: null,
                weapon: null,
                armor: null
            },
            dungeonProgress: {
                1: { completed: false, bossesDefeated: [] },
                2: { completed: false, bossesDefeated: [] },
                3: { completed: false, bossesDefeated: [] },
                4: { completed: false, bossesDefeated: [] }
            },
            currentBattle: null,
            battleInProgress: false,
            playerTurn: true
        },
        mining: {
            unlocked: false,
            currentTool: 0,
            rocks: 0,
            isMining: false,
            currentPullHandler: null,
            skill: {
                perfectCut: { unlocked: false },
                lucky: { level: 0, bonus: 0 }
            },
            stats: {
                totalMines: 0,
                totalCoins: 0,
                totalRocks: 0,
                totalDiamonds: 0,
                perfectCount: 0
            }
        },
        specialItems: {
            oneRing: false,
            flashlight: false
        },
        secretTokens: 0,
        illuvatarTickets: 0
    };
}

// ==================== GAME STATE MANAGER ====================
class GameStateManager {
    constructor() {
        this.state = createDefaultGameState();
        this.listeners = [];
    }

    // Getter untuk akses mudah
    get coins() { return Number(this.state.coins); }
    get diamonds() { return Number(this.state.diamonds); }
    get level() { return Number(this.state.level); }
    get exp() { return Number(this.state.exp); }
    get backpack() { return this.state.backpack; }
    get currentRod() { return this.state.currentRod; }
    get currentBait() { return this.state.currentBait; }
    get depthGear() { return this.state.depthGear; }
    get activePotions() { return this.state.activePotions; }
    get pets() { return this.state.pets; }
    get skills() { return this.state.skills; }
    get mining() { return this.state.mining; }
    get dungeon() { return this.state.dungeon; }
    get gamepass() { return this.state.gamepass; }
    get rank() { return this.state.rank; }

    // Update methods dengan notifikasi
    setCoins(value) {
        this.state.coins = Number(value);
        this.notifyListeners('coins', this.state.coins);
        return this.state.coins;
    }

    addCoins(value) {
        return this.setCoins(this.coins + Number(value));
    }

    setDiamonds(value) {
        this.state.diamonds = Number(value);
        this.notifyListeners('diamonds', this.state.diamonds);
        return this.state.diamonds;
    }

    addDiamonds(value) {
        return this.setDiamonds(this.diamonds + Number(value));
    }

    setExp(value) {
        this.state.exp = Number(value);
        this.notifyListeners('exp', this.state.exp);
        return this.state.exp;
    }

    addExp(value) {
        return this.setExp(this.exp + Number(value));
    }

    setLevel(value) {
        this.state.level = Number(value);
        this.notifyListeners('level', this.state.level);
        return this.state.level;
    }

    // Backpack operations
    addFishToBackpack(fish) {
        const newFish = {
            ...fish,
            catchTime: Date.now(),
            uniqueId: Date.now() + Math.random()
        };
        this.state.backpack.push(newFish);
        this.notifyListeners('backpack', this.state.backpack);
        return newFish;
    }

    removeFishFromBackpack(index) {
        if (index >= 0 && index < this.state.backpack.length) {
            const removed = this.state.backpack.splice(index, 1)[0];
            this.notifyListeners('backpack', this.state.backpack);
            return removed;
        }
        return null;
    }

    // Pet operations
    addPet(petId) {
        if (!this.state.pets.owned.includes(petId)) {
            this.state.pets.owned.push(petId);
            this.notifyListeners('pets', this.state.pets);
            return true;
        }
        return false;
    }

    // Gacha operations
    addGachaRod(rodId) {
        if (!this.state.gachaStats.rodsObtained.includes(rodId)) {
            this.state.gachaStats.rodsObtained.push(rodId);
            this.notifyListeners('gachaStats', this.state.gachaStats);
            return true;
        }
        return false;
    }

    // Aquarium operations
    addToAquarium(fish) {
        const rarity = fish.rarity;
        if (!this.state.aquarium[rarity]) this.state.aquarium[rarity] = {};
        if (!this.state.aquarium[rarity][fish.id]) this.state.aquarium[rarity][fish.id] = 0;
        this.state.aquarium[rarity][fish.id] = Number(this.state.aquarium[rarity][fish.id]) + 1;
        this.notifyListeners('aquarium', this.state.aquarium);
    }

    // Subscribe ke perubahan state
    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notifyListeners(key, value) {
        this.listeners.forEach(listener => {
            try {
                listener(key, value);
            } catch (e) {
                console.error('Error in state listener:', e);
            }
        });
    }

    // Reset game
    reset() {
        this.state = createDefaultGameState();
        this.notifyListeners('reset', this.state);
        return this.state;
    }

    // Load state dari object
    loadState(newState) {
        this.state = { ...this.state, ...newState };
        this.notifyListeners('load', this.state);
        return this.state;
    }

    // Get full state (untuk save)
    getState() {
        return this.state;
    }
}

// Singleton instance
export const gameState = new GameStateManager();

// Export state untuk akses langsung (untuk kompatibilitas)
export const gameData = gameState.state;
