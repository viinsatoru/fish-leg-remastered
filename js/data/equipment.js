// js/data/equipment.js

// ==================== RODS ====================
export const RODS = [
    { id: 0, name: "Pancingan Bambu", luck: 1, price: 0, owned: true, emoji: "🎋" },
    { id: 1, name: "Pancingan Besi", luck: 2, price: 350, owned: false, emoji: "🪛" },
    { id: 2, name: "Pancingan Emas", luck: 5, price: 700, owned: false, emoji: "🪈" },
    { id: 3, name: "Pancingan Platinum", luck: 10, price: 1000, owned: false, emoji: "🦯" },
    { id: 4, name: "Pancingan Legendaris", luck: 20, price: 3000, owned: false, emoji: "🎣" },
    { id: 5, name: "Pancingan Dragon", luck: 40, price: 6000, owned: false, emoji: "🐲" },
    { id: 6, name: "Pancingan Cosmic", luck: 80, price: 10000, owned: false, emoji: "🌂" },
    { id: 16, name: "Magic Staff", luck: 150, price: 20000, owned: false, emoji: "🪄" },
    { id: 7, name: "Element Rod", luck: 200, price: 0, owned: false, unlocked: false, special: true, emoji: "⚡" },
    { id: 8, name: "Trident Rod", luck: 250, price: 0, owned: false, unlocked: false, special: true, emoji: "🔱" },
    { id: 15, name: "Needle Rod", luck: 300, price: 35000, owned: false, emoji: "🪡" },
    { id: 200, name: "Airsoft", luck: 600, price: 300, currency: "diamonds", owned: false, emoji: "🔫" },
    { id: 88, name: "Fire and Ash", luck: 1000, price: 200000, owned: false, emoji: "🎏" },
    { id: 60, name: "Galaxy Sword Rod", luck: 4004, price: 440044, owned: false, emoji: "⚔️" },
    { id: 100, name: "Tyo Rod", luck: 5000, price: 600000, owned: false, emoji: "👑" },
    { id: 11, name: "1x1x1 Rod", luck: 1111, price: 0, owned: false, unlocked: false, special: true, emoji: "🪬" },
    { id: 12, name: "GhostFinn Rod", luck: 10000, price: 0, owned: false, fromExchange: false, unlocked: false, emoji: "👻" },
    { id: 20, name: "Timothy Rod", luck: 12000, price: 1200, currency: "diamonds", owned: false, emoji: "⏰" },
    { id: 55, name: "Phantom Rod", luck: 15000, price: 2000000, owned: false, emoji: "⚕️" },
    { id: 14, name: "Satoshi Rod", luck: 20000, price: 0, owned: false, fromExchange: true, unlocked: false, emoji: "₿" }
];

// ==================== BAITS ====================
export const BAITS = [
    { id: 0, name: "Umpan Biasa", luck: 1, price: 0, owned: true, emoji: "🪱" },
    { id: 1, name: "Umpan Cacing", luck: 1.5, price: 200, owned: false, emoji: "🪱" },
    { id: 2, name: "Umpan Udang", luck: 2, price: 300, owned: false, emoji: "🦐" },
    { id: 3, name: "Umpan Ikan Kecil", luck: 5, price: 600, owned: false, emoji: "🐟" },
    { id: 4, name: "Umpan Ajaib", luck: 7, price: 700, owned: false, emoji: "✨" },
    { id: 5, name: "Umpan Emas", luck: 15, price: 1500, owned: false, emoji: "🪙" },
    { id: 11, name: "Shark anchor", luck: 50, price: 6000, owned: false, emoji: "⚓️" },
    { id: 61, name: "Frozen Bait", luck: 80, price: 10000, owned: false, emoji: "❄️" },
    { id: 62, name: "Umpan Dark Matter", luck: 111, price: 12000, owned: false, emoji: "⚫" },
    { id: 71, name: "Umpan Singularity", luck: 125, price: 15000, owned: false, emoji: "🌀" },
    { id: 8, name: "Elshark Bait", luck: 150, price: 25000, owned: false, emoji: "🦈" },
    { id: 86, name: "Ice Bait", luck: 250, price: 50000, owned: false, emoji: "🧊" },
    { id: 97, name: "Devil Fruit Bait", luck: 450, price: 100000, owned: false, emoji: "🫑" },
    { id: 21, name: "Globe Bait", luck: 500, price: 100, currency: "diamonds", owned: false, emoji: "🌐" },
    { id: 22, name: "Phantom Bait", luck: 1500, price: 500, currency: "diamonds", owned: false, emoji: "🪀" },
    { id: 9, name: "Bitcoin Bait", luck: 5000, price: 0, owned: false, fromQuest: true, emoji: "₿" },
    { id: 10, name: "Vitalik Bait", luck: 8000, price: 0, owned: false, fromExchange: true, emoji: "💎" }
];

// ==================== POTIONS ====================
export const POTIONS = [
    { id: 0, name: "Luck Potion x2", multiplier: 2, duration: 10, price: 400, emoji: "🧪" },
    { id: 1, name: "Luck Potion x3", multiplier: 3, duration: 8, price: 600, emoji: "🔮" },
    { id: 2, name: "Luck Potion x5", multiplier: 5, duration: 5, price: 1000, emoji: "💎" },
    { id: 3, name: "Luck Potion x10", multiplier: 10, duration: 3, price: 2000, emoji: "✨" },
    { id: 4, name: "Super Luck Potion x100", multiplier: 100, duration: 1, price: 20000, emoji: "🍺" }
];

// ==================== GACHA RODS ====================
export const GACHA_RODS = [
    { id: 100, name: "Wooden Enchant", luck: 10.0, rarity: "common", chance: 60, emoji: "🎣" },
    { id: 101, name: "Silver Enchant", luck: 20.0, rarity: "rare", chance: 25, emoji: "🥈" },
    { id: 102, name: "Dragon Enchant", luck: 40.0, rarity: "epic", chance: 10, emoji: "🐲" },
    { id: 103, name: "Legendary Enchant", luck: 80.0, rarity: "legendary", chance: 4, emoji: "⚡" },
    { id: 104, name: "Mythic Enchant", luck: 150.0, rarity: "mythical", chance: 1, emoji: "🌟" },
    { id: 105, name: "Celestial Enchant", luck: 300.0, rarity: "mythical", chance: 0.5, emoji: "✨" },
    { id: 106, name: "Divine Enchant", luck: 500.0, rarity: "special", chance: 0.1, emoji: "👼" }
];

// ==================== SECRET FISH GACHA POOL ====================
export const SECRET_FISH_POOL = [
    { id: 11, name: "Ikan Legenda", emoji: "🌟", price: 2000, rarity: "secret", spot: "danau" },
    { id: 12, name: "Ikan Kosmik", emoji: "🌌", price: 3000, rarity: "secret", spot: "danau" },
    { id: 111, name: "Rahata Turtle", emoji: "🐢", price: 2500, rarity: "secret", spot: "kuil" },
    { id: 112, name: "Mbah To Fish", emoji: "🫎", price: 5000, rarity: "secret", spot: "kuil" },
    { id: 113, name: "Raji Fish", emoji: "🪼", price: 10000, rarity: "secret", spot: "kuil" },
    { id: 211, name: "Kraken Raksasa", emoji: "🐙", price: 8000, rarity: "secret", spot: "laut" },
    { id: 212, name: "Leviathan", emoji: "🐍", price: 20000, rarity: "secret", spot: "laut" },
    { id: 213, name: "Cthulhu", emoji: "👹", price: 50000, rarity: "secret", spot: "laut" },
    { id: 311, name: "Golden Leviathan", emoji: "🐉", price: 10000, rarity: "secret", spot: "sungai" },
    { id: 312, name: "Sun Fish", emoji: "☀️", price: 15000, rarity: "secret", spot: "sungai" },
    { id: 313, name: "Moster Locness", emoji: "🦕", price: 50000, rarity: "secret", spot: "sungai" },
    { id: 407, name: "404 Fish", emoji: "🦠", price: 50000, rarity: "secret", spot: "angkasa" },
    { id: 408, name: "1x1x1 Fish", emoji: "💠", price: 60000, rarity: "secret", spot: "angkasa" },
    { id: 409, name: "Elshark Gran Maja", emoji: "🎃", price: 80000, rarity: "secret", spot: "angkasa" },
    { id: 509, name: "Skibidi Toilet Rizzler Sigma", emoji: "🧠", price: 6940, rarity: "secret", spot: "brainrot" },
    { id: 510, name: "Brainrot Overlord", emoji: "👑", price: 99999, rarity: "secret", spot: "brainrot" },
    { id: 606, name: "Bitcoin", emoji: "₿", price: 100000, rarity: "secret", spot: "crypto" },
    { id: 702, name: "Neptunus", emoji: "🧜‍♂️", price: 200000, rarity: "special", spot: "atlantis" },
    { id: 800, name: "Angel Dog", emoji: "🐩", price: 500, rarity: "legendary", spot: "valinor" },
    { id: 801, name: "SwanGod", emoji: "🪿", price: 1000, rarity: "legendary", spot: "valinor" },
    { id: 802, name: "BirdFeather", emoji: "🕊️", price: 2500, rarity: "mythical", spot: "valinor" },
    { id: 803, name: "Dugong", emoji: "🦭", price: 3000, rarity: "mythical", spot: "valinor" },
    { id: 804, name: "Elvish", emoji: "🧝‍♂️", price: 25000, rarity: "secret", spot: "valinor" },
    { id: 805, name: "ButterFly", emoji: "🦋", price: 120000, rarity: "special", spot: "valinor" },
    { id: 1000, name: "Pengu", emoji: "🐧", price: 2000, rarity: "mythical", spot: "illuvatar" },
    { id: 1001, name: "BatFish", emoji: "🦇", price: 10000, rarity: "secret", spot: "illuvatar" },
    { id: 1002, name: "Moyaimorph", emoji: "🗿", price: 25000, rarity: "secret", spot: "illuvatar" },
    { id: 1003, name: "T-Rex", emoji: "🦖", price: 250000, rarity: "special", spot: "illuvatar" }
];

// ==================== CRYPTO GACHA ====================
export const CRYPTO_GACHA = {
    name: "Crypto Gacha",
    price: 25,
    currency: "diamonds",
    emoji: "🎰",
    description: "Dapatkan crypto random!",
    items: [
        { type: "fish", id: 602, name: "HypeLiquid", chance: 30, emoji: "🔋" },
        { type: "fish", id: 603, name: "Solana", chance: 30, emoji: "🌌" },
        { type: "fish", id: 605, name: "Ethereum", chance: 15, emoji: "💎" },
        { type: "fish", id: 604, name: "Binance Coin", chance: 15, emoji: "🪙" },
        { type: "fish", id: 606, name: "Bitcoin", chance: 10, emoji: "₿" }
    ]
};

// ==================== ILLUVATAR GACHA ====================
export const ILLUVATAR_GACHA = {
    name: "Chest Illüvatar",
    price: 1,
    currency: "ticket",
    emoji: "📦✨",
    description: "Peti legendaris berisi makhluk mistis!",
    items: [
        { type: "fish", id: 1000, name: "Pengu", price: 2000, rarity: "mythical", chance: 50, emoji: "🐧" },
        { type: "fish", id: 1001, name: "BatFish", price: 10000, rarity: "secret", chance: 30, emoji: "🦇" },
        { type: "fish", id: 1002, name: "Moyaimorph", price: 25000, rarity: "secret", chance: 18, emoji: "🗿" },
        { type: "fish", id: 1003, name: "T-Rex", price: 250000, rarity: "special", chance: 2, emoji: "🦖" }
    ]
};

// ==================== MYSTERY BOXES ====================
export const MYSTERY_BOXES = {
    basic: {
        name: "Basic Box",
        price: 1000,
        currency: "coins",
        emoji: "📦",
        description: "Berisi hadiah random!",
        items: [
            { type: "coins", amount: 100, chance: 70, emoji: "💰" },
            { type: "diamonds", amount: 10, chance: 20, emoji: "💎" },
            { type: "rod", id: 5, name: "Pancingan Dragon", chance: 10, emoji: "🐲" }
        ]
    },
    normal: {
        name: "Normal Box",
        price: 5000,
        currency: "coins",
        emoji: "📦✨",
        description: "Box dengan hadiah lebih baik!",
        items: [
            { type: "rod", id: 3, name: "Pancingan Platinum", chance: 60, emoji: "🦯" },
            { type: "rod", id: 5, name: "Pancingan Dragon", chance: 30, emoji: "🐲" },
            { type: "bait", id: 62, name: "Dark Matter Bait", chance: 10, emoji: "⚫" }
        ]
    },
    secret: {
        name: "Secret Box",
        price: 100,
        currency: "diamonds",
        emoji: "📦💎",
        description: "Box premium untuk pencari tantangan!",
        items: [
            { type: "secretFish", chance: 80, emoji: "🐟" },
            { type: "bait", id: 8, name: "Elshark Bait", chance: 15, emoji: "🦈" },
            { type: "rod", id: 100, name: "Tyo Rod", chance: 5, emoji: "👑" }
        ]
    }
};