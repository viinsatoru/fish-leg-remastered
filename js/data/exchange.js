// js/data/exchange.js

// ==================== EXCHANGE RECIPES ====================
export const EXCHANGE_RECIPES = [
    { id: 1, name: "Mythic to Rahata", description: "Tukar 5 ikan Mythic dengan 1 Rahata Turtle", input: [ { type: "fish", rarity: "mythical", quantity: 5, exactFish: false } ], output: { type: "fish", id: 111, name: "Rahata Turtle", emoji: "🐢", quantity: 1 } },
    { id: 2, name: "Rahata to 1x1x1", description: "Tukar 10 Rahata Turtle dengan 1 1x1x1 Fish", input: [ { type: "fish", id: 111, quantity: 10, name: "Rahata Turtle" } ], output: { type: "fish", id: 408, name: "1x1x1 Fish", emoji: "💠", quantity: 1 } },
    { id: 3, name: "1x1x1 to Elshark", description: "Tukar 2 1x1x1 Fish dengan 1 Elshark Gran Maja", input: [ { type: "fish", id: 408, quantity: 2, name: "1x1x1 Fish" } ], output: { type: "fish", id: 409, name: "Elshark Gran Maja", emoji: "🎃", quantity: 1 } },
    { id: 4, name: "Elshark to GhostFinn Rod", description: "Tukar 5 Elshark Gran Maja dengan GhostFinn Rod (10,000 Luck)", input: [ { type: "fish", id: 409, quantity: 5, name: "Elshark Gran Maja" } ], output: { type: "rod", id: 12, name: "GhostFinn Rod", luck: 10000, emoji: "👻", quantity: 1 } },
    { id: 5, name: "Bitcoin to Diamond", description: "Tukar 1 Bitcoin dengan 250 Diamond", input: [ { type: "fish", id: 606, quantity: 1, name: "Bitcoin" } ], output: { type: "diamond", quantity: 250, emoji: "💎" } },
    { id: 6, name: "Coin to Diamond", description: "Tukar 1000 Coin dengan 1 Diamond", input: [ { type: "coin", quantity: 1000 } ], output: { type: "diamond", quantity: 1, emoji: "💎" } },
    { id: 7, name: "Coin to Diamonds", description: "Tukar 9000 Coin dengan 10 Diamond (Hemat 1000!)", input: [ { type: "coin", quantity: 9000 } ], output: { type: "diamond", quantity: 10, emoji: "💎" } },
    { id: 8, name: "Diamond to Coin", description: "Tukar 1 Diamond dengan 200 Coin", input: [ { type: "diamond", quantity: 1 } ], output: { type: "coin", quantity: 200, emoji: "💰" } },
    { id: 9, name: "Satoshi Rod", description: "Tukar 5 Bitcoin dengan Satoshi Rod (20,000 Luck)", input: [ { type: "fish", id: 606, quantity: 5, name: "Bitcoin" } ], output: { type: "rod", id: 14, name: "Satoshi Rod", luck: 20000, emoji: "₿", quantity: 1 } },
    { id: 10, name: "Vitalik Bait", description: "Tukar 10 Ethereum dengan Vitalik Bait (8,000 Luck)", input: [ { type: "fish", id: 605, quantity: 10, name: "Ethereum" } ], output: { type: "bait", id: 10, name: "Vitalik Bait", luck: 8000, emoji: "💎", quantity: 1 } },
    { id: 11, name: "💍 ONE RING", description: "Tukar 10 ikan Secret dengan One Ring (WAJIB untuk buka dungeon)", input: [ { type: "fish", rarity: "secret", quantity: 10, exactFish: false } ], output: { type: "special", id: "oneRing", name: "One Ring", emoji: "💍", quantity: 1 } },
    { id: 12, name: "🎟️ Illüvatar Ticket", description: "Tukar 10 ikan Mythical dengan 1 Ticket Chest Illüvatar", input: [ { type: "fish", rarity: "mythical", quantity: 10, exactFish: false } ], output: { type: "ticket", id: "illuvatar", name: "Illüvatar Ticket", emoji: "🎟️", quantity: 1 } },
    { id: 13, name: "🔦 Flashlight", description: "Tukar 1 Bitcoin dengan Flashlight (WAJIB untuk Mining!)", input: [ { type: "fish", id: 606, quantity: 1, name: "Bitcoin" } ], output: { type: "special", id: "flashlight", name: "Flashlight", emoji: "🔦", quantity: 1 } }
];

// ==================== TOKEN EXCHANGE RECIPES ====================
export const TOKEN_EXCHANGE_RECIPES = [
    { id: 1, name: "20000 Coin", description: "Tukar 1 Secret Token dengan 20000 Coin", input: { type: "token", quantity: 1 }, output: { type: "coin", quantity: 20000, emoji: "💰" } },
    { id: 2, name: "10 Diamond", description: "Tukar 1 Secret Token dengan 10 Diamond", input: { type: "token", quantity: 1 }, output: { type: "diamond", quantity: 10, emoji: "💎" } },
    { id: 3, name: "Ikan Secret Random", description: "Tukar 5 Secret Token dengan 1 Ikan Secret Random", input: { type: "token", quantity: 5 }, output: { type: "secretFish", random: true, emoji: "🐟" } },
    { id: 4, name: "Bitcoin", description: "Tukar 20 Secret Token dengan 1 Bitcoin", input: { type: "token", quantity: 20 }, output: { type: "fish", id: 606, name: "Bitcoin", emoji: "₿" } },
    { id: 5, name: "Elshark Gran Maja", description: "Tukar 20 Secret Token dengan 1 Elshark Gran Maja", input: { type: "token", quantity: 20 }, output: { type: "fish", id: 409, name: "Elshark Gran Maja", emoji: "🎃" } }
];

// ==================== MINING EXCHANGE RECIPES ====================
export const MINING_EXCHANGE_RECIPES = [
    { 
        id: 101, 
        name: "Coin to Diamond", 
        description: "Tukar 800 Coin dengan 1 Diamond", 
        input: { type: "coin", quantity: 800, emoji: "💰" }, 
        output: { type: "diamond", quantity: 1, emoji: "💎" } 
    },
    { 
        id: 102, 
        name: "Coin to Diamonds", 
        description: "Tukar 70.000 Coin dengan 100 Diamond", 
        input: { type: "coin", quantity: 70000, emoji: "💰" }, 
        output: { type: "diamond", quantity: 100, emoji: "💎" } 
    },
    { 
        id: 103, 
        name: "Rock to Diamond", 
        description: "Tukar 5 Rock dengan 1 Diamond", 
        input: { type: "rock", quantity: 5, emoji: "🪨" }, 
        output: { type: "diamond", quantity: 1, emoji: "💎" } 
    },
    { 
        id: 104, 
        name: "Rock to Diamonds", 
        description: "Tukar 400 Rock dengan 100 Diamond", 
        input: { type: "rock", quantity: 400, emoji: "🪨" }, 
        output: { type: "diamond", quantity: 100, emoji: "💎" } 
    }
];