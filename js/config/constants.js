// js/config/constants.js

// ==================== WEATHER DATA ====================
export const WEATHER = {
    current: "sunny",
    effects: {
        sunny: { luck: 1.0, text: "Cerah ☀️", color: "#FFD700", buff: "Normal", icon: "☀️" },
        rainy: { luck: 1.3, text: "Hujan 🌧️", color: "#4682B4", buff: "+30% Luck", icon: "🌧️" },
        stormy: { luck: 2.0, text: "Badai ⚡", color: "#4B0082", buff: "+100% Luck", icon: "⚡" },
        foggy: { luck: 0.8, text: "Berkabut 🌫️", color: "#808080", buff: "-20% Luck", icon: "🌫️" },
        windy: { luck: 1.5, text: "Berangin 💨", color: "#87CEEB", buff: "+50% Luck", icon: "💨" }
    }
};

// ==================== DEPTH SYSTEM ====================
export const DEPTH_LEVELS = {
    surface: { name: "Permukaan", description: "Tidak perlu gear", requiredGear: null, luckMultiplier: 1.0, rareBonus: 1.0, icon: "🌊" },
    middle: { name: "Tengah", description: "Butuh Perahu atau Kapal", requiredGear: ["boat", "ship"], luckMultiplier: 1.3, rareBonus: 1.5, icon: "🏊‍♂️" },
    deep: { name: "Dalam", description: "Butuh Snorkel", requiredGear: ["snorkel"], luckMultiplier: 1.8, rareBonus: 2.5, icon: "🐠" },
    abyss: { name: "Abyss", description: "Butuh Kapal Selam", requiredGear: ["submarine"], luckMultiplier: 2.5, rareBonus: 5.0, icon: "👻" }
};

// ==================== DEPTH GEAR ====================
export const DEPTH_GEAR = [
    { id: "boat", name: "Perahu", description: "Bisa memancing di kedalaman Tengah", price: 2000, currency: "coins", emoji: "🚣" },
    { id: "ship", name: "Kapal", description: "Bisa memancing di kedalaman Tengah", price: 5000, currency: "coins", emoji: "🚢" },
    { id: "snorkel", name: "Snorkel", description: "Bisa memancing di kedalaman Dalam", price: 10000, currency: "coins", emoji: "🤿" },
    { id: "submarine", name: "Kapal Selam", description: "Bisa memancing di kedalaman Abyss", price: 100, currency: "diamonds", emoji: "🛸" },
    { id: "turtleHat", name: "🐢 Turtle Hat", description: "Memungkinkan memancing di Atlantis", price: 100000, currency: "coins", emoji: "🐢" },
    { id: "maskOfSatoshi", name: "🎭 Mask of Satoshi", description: "Memungkinkan memancing di Crypto Spot", price: 500, currency: "diamonds", emoji: "🎭" },
    { id: "ghostShip", name: "👻 GHOST SHIP", description: "Kapal hantu mistis - WAJIB untuk buka dungeon", price: 500, currency: "diamonds", emoji: "🚢👻" },
    { id: "crownOfSilmarillion", name: "👑 Crown of Silmarillion", description: "Mahkota legendaris untuk membuka spot Valinor", price: 1000000, currency: "coins", emoji: "👑" },
    { id: "minerHelm", name: "Miner Helm 🪖", description: "WAJIB untuk membuka fitur Mining!", price: 250, currency: "diamonds", emoji: "🪖" }
];

// ==================== MINING TOOLS ====================
export const MINING_TOOLS = [
    { id: 0, name: "Gunting", luck: 1, price: 0, owned: true, emoji: "✂️" },
    { id: 1, name: "Kapak", luck: 5, price: 10000, owned: false, emoji: "🪓" },
    { id: 2, name: "Palu", luck: 10, price: 15000, owned: false, emoji: "🔨" },
    { id: 3, name: "Pickaxe", luck: 20, price: 25000, owned: false, emoji: "⛏️" },
    { id: 4, name: "Hammer", luck: 30, price: 35000, owned: false, emoji: "⚒️" },
    { id: 5, name: "Magnet", luck: 50, price: 60000, owned: false, emoji: "🧲" },
    { id: 6, name: "Alat Bor", luck: 100, price: 120000, owned: false, emoji: "🏗️" }
];

// ==================== MINING SKILL TREE ====================
export const MINING_SKILL_TREE = {
    perfectCut: { name: "Perfect Cut 🌟", description: "Perfect tanpa minigame", maxLevel: 1, basePrice: 500, currency: "diamonds", emoji: "🎯" },
    lucky: { name: "Lucky", description: "+100% luck per level", maxLevel: 5, basePrice: 2000, priceMultiplier: 2, emoji: "🍀" }
};

// ==================== GAMEPASS LEVELS ====================
export const GAMEPASS_LEVELS = [
    { level: 1, expRequired: 100, rewards: { coins: 1000, bait: "Umpan Cacing" } },
    { level: 2, expRequired: 200, rewards: { coins: 2000, potion: "Luck Potion x2" } },
    { level: 3, expRequired: 300, rewards: { coins: 3000, rod: "Pancingan Besi" } },
    { level: 4, expRequired: 400, rewards: { coins: 4000, bait: "Umpan Udang" } },
    { level: 5, expRequired: 500, rewards: { coins: 5000, fish: "Ikan Naga" } },
    { level: 6, expRequired: 600, rewards: { coins: 6000, potion: "Luck Potion x3" } },
    { level: 7, expRequired: 700, rewards: { coins: 7000, bait: "Umpan Ikan Kecil" } },
    { level: 8, expRequired: 800, rewards: { coins: 8000, rod: "Pancingan Emas" } },
    { level: 9, expRequired: 900, rewards: { coins: 9000, fish: "Ikan Phoenix" } },
    { level: 10, expRequired: 1000, rewards: { coins: 10000, pet: "Anjing Keberuntungan" } },
    { level: 11, expRequired: 1100, rewards: { coins: 11000, potion: "Luck Potion x5" } },
    { level: 12, expRequired: 1200, rewards: { coins: 12000, bait: "Umpan Emas" } },
    { level: 13, expRequired: 1300, rewards: { coins: 13000, rod: "Pancingan Platinum" } },
    { level: 14, expRequired: 1400, rewards: { coins: 14000, fish: "Ikan Divine" } },
    { level: 15, expRequired: 1500, rewards: { coins: 15000, pet: "Kucing Koin" } },
    { level: 16, expRequired: 1600, rewards: { coins: 16000, potion: "Luck Potion x10" } },
    { level: 17, expRequired: 1700, rewards: { coins: 17000, bait: "Umpan Dark Matter" } },
    { level: 18, expRequired: 1800, rewards: { coins: 18000, rod: "Pancingan Legendaris" } },
    { level: 19, expRequired: 1900, rewards: { coins: 19000, fish: "Kraken Raksasa" } },
    { level: 20, expRequired: 2000, rewards: { coins: 20000, fish: "Elshark Gran Maja" } },
    { level: 21, expRequired: 2100, rewards: { coins: 21000, bait: "Umpan Singularity" } },
    { level: 22, expRequired: 2200, rewards: { coins: 22000, rod: "Pancingan Cosmic" } },
    { level: 23, expRequired: 2300, rewards: { coins: 23000, potion: "Super Luck Potion x100" } },
    { level: 24, expRequired: 2400, rewards: { coins: 24000, fish: "Leviathan" } },
    { level: 25, expRequired: 2500, rewards: { coins: 25000, fish: "Elshark Gran Maja" } },
    { level: 26, expRequired: 2600, rewards: { coins: 26000, bait: "Vitalik Bait" } },
    { level: 27, expRequired: 2700, rewards: { coins: 27000, rod: "Element Rod" } },
    { level: 28, expRequired: 2800, rewards: { coins: 28000, pet: "Ayam Perfect" } },
    { level: 29, expRequired: 2900, rewards: { coins: 29000, fish: "Cthulhu" } },
    { level: 30, expRequired: 3000, rewards: { coins: 30000, diamonds: 2500 } },
    { level: 31, expRequired: 3100, rewards: { coins: 31000, rod: "Trident Rod" } },
    { level: 32, expRequired: 3200, rewards: { coins: 32000, bait: "Bitcoin Bait" } },
    { level: 33, expRequired: 3300, rewards: { coins: 33000, fish: "1x1x1 Fish" } },
    { level: 34, expRequired: 3400, rewards: { coins: 34000, pet: "Serigala Berlian" } },
    { level: 35, expRequired: 3500, rewards: { coins: 35000, diamonds: 1000 } },
    { level: 36, expRequired: 3600, rewards: { coins: 36000, rod: "1x1x1 Rod" } },
    { level: 37, expRequired: 3700, rewards: { coins: 37000, fish: "Elshark Gran Maja" } },
    { level: 38, expRequired: 3800, rewards: { coins: 38000, bait: "Elshark Bait" } },
    { level: 39, expRequired: 3900, rewards: { coins: 39000, rod: "Timothy Rod" } },
    { level: 40, expRequired: 4000, rewards: { coins: 40000, fish: "Neptunus" } }
];

// ==================== LEADERBOARD NPC RANKS ====================
export const LEADERBOARD_NPCS = [
    { rank: 1, name: "👑 KingFisher", rankTitle: "Immortal", exp: 50000, wins: 500, emoji: "👑" },
    { rank: 2, name: "⚡ AquaMaster", rankTitle: "Immortal", exp: 45000, wins: 450, emoji: "⚡" },
    { rank: 3, name: "🌊 DeepHunter", rankTitle: "Mythical", exp: 9500, wins: 200, emoji: "🌊" },
    { rank: 4, name: "🐋 WhaleSlayer", rankTitle: "Mythical", exp: 9200, wins: 190, emoji: "🐋" },
    { rank: 5, name: "🎣 ProFisher", rankTitle: "Legend", exp: 4800, wins: 100, emoji: "🎣" }
];

// ==================== RANK BATTLE DATA ====================
export const RANK_DATA = {
    Warrior: { nextRank: "Legend", entryFee: 100, winReward: { diamonds: 10, exp: 100 }, lossPenalty: { exp: 25 }, maxExp: 2000, color: "#CD7F32", emoji: "⚔️", opponents: [ { name: "Nelayan Pemula", fish: { price: 1000, emoji: "🐟" } }, { name: "Anak Kampung", fish: { price: 1500, emoji: "🐠" } }, { name: "Mbah Karto", fish: { price: 2000, emoji: "🐡" } } ] },
    Legend: { nextRank: "Mythical", entryFee: 500, winReward: { diamonds: 20, exp: 200 }, lossPenalty: { exp: 50 }, maxExp: 5000, color: "#C0C0C0", emoji: "🏆", opponents: [ { name: "Kapten Nelayan", fish: { price: 8000, emoji: "🦈" } }, { name: "Laksamana", fish: { price: 12000, emoji: "🐋" } }, { name: "Raja Laut", fish: { price: 15000, emoji: "🐉" } } ] },
    Mythical: { nextRank: "Immortal", entryFee: 2000, winReward: { diamonds: 35, exp: 300 }, lossPenalty: { exp: 100 }, maxExp: 10000, color: "#FFD700", emoji: "🌟", opponents: [ { name: "Dewa Laut", fish: { price: 80000, emoji: "🔱" } }, { name: "Kraken Lord", fish: { price: 120000, emoji: "🐙" } }, { name: "Leviathan", fish: { price: 150000, emoji: "🐍" } } ] },
    Immortal: { nextRank: "Immortal", entryFee: 5000, winReward: { diamonds: 50, exp: 500 }, lossPenalty: { exp: 200 }, maxExp: Infinity, color: "#FF00FF", emoji: "👑", opponents: [ { name: "Poseidon", fish: { price: 500000, emoji: "🔱" } }, { name: "Cthulhu Ancient", fish: { price: 750000, emoji: "👹" } }, { name: "God of Sea", fish: { price: 1000000, emoji: "🌊" } } ] }
};

// ==================== SKILL TREE DATA ====================
export const SKILL_TREE = {
    lucky: { name: "Lucky Skill", description: "Menambah keberuntungan +100% per level", maxLevel: 10, basePrice: 1000, priceMultiplier: 2, emoji: "🍀" },
    cast: { name: "Cast Skill", description: "Chance mendapat ikan double +5% per level", maxLevel: 5, basePrice: 2000, priceMultiplier: 2.5, emoji: "🎣" },
    expert: { name: "Expert Skill", description: "Menambah EXP Gamepass saat memancing (+10 EXP per level)", maxLevel: 5, basePrice: 2000, priceMultiplier: 2, emoji: "📚" },
    penawar: { name: "Penawar", description: "Bonus 10% saat menjual ikan per level (max 3 level)", maxLevel: 3, basePrice: 100, currency: "diamonds", priceMultiplier: 1, emoji: "💰" },
    animalLovers: { name: "Animal Lovers", description: "Bisa memakai 2 pet sekaligus", maxLevel: 1, basePrice: 500, currency: "diamonds", priceMultiplier: 1, emoji: "🐕" }
};