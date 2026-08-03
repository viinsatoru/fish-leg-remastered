// js/data/dungeon.js

// ==================== DUNGEON WEAPONS & ARMOR ====================
export const DUNGEON_WEAPONS = [
    { id: 1, name: "Pisau Karang", attack: 10, price: 10000, currency: "coins", emoji: "🔪", description: "Senjata basic +10 ATK" },
    { id: 2, name: "Tombak Nelayan", attack: 25, price: 25000, currency: "coins", emoji: "🔱", description: "Tombak tajam +25 ATK" },
    { id: 3, name: "Pedang Laut", attack: 50, price: 50000, currency: "coins", emoji: "⚔️", description: "Pedang bertenaga ombak +50 ATK" },
    { id: 4, name: "Trident Emas", attack: 100, price: 100, currency: "diamonds", emoji: "🔱✨", description: "Senjata legendaris +100 ATK" },
    { id: 5, name: "Excalibur Ikan", attack: 250, price: 250, currency: "diamonds", emoji: "🗡️👑", description: "Senjata terkuat +250 ATK" }
];

export const DUNGEON_ARMORS = [
    { id: 1, name: "Baju Sisik", defense: 5, price: 5000, currency: "coins", emoji: "🛡️", description: "Armor sisik +5 DEF" },
    { id: 2, name: "Zirah Kerang", defense: 15, price: 15000, currency: "coins", emoji: "🐚", description: "Perlindungan kerang +15 DEF" },
    { id: 3, name: "Baju Baja", defense: 30, price: 30000, currency: "coins", emoji: "🛡️⚙️", description: "Armor baja kokoh +30 DEF" },
    { id: 4, name: "Jubah Hantu", defense: 60, price: 60000, currency: "diamonds", emoji: "👻", description: "Jubah misterius +60 DEF" },
    { id: 5, name: "Armor Naga", defense: 150, price: 150000, currency: "diamonds", emoji: "🐲🛡️", description: "Armor legendaris +150 DEF" }
];

// ==================== DUNGEON BOSSES ====================
export const DUNGEON_BOSSES = [
    { id: 101, name: "Kepiting Raksasa", emoji: "🦀", level: 1, hp: 300, attack: 25, defense: 10, reward: { coins: 2000, exp: 100 } },
    { id: 102, name: "Gurita Pasir", emoji: "🐙", level: 1, hp: 400, attack: 20, defense: 15, reward: { coins: 2500, exp: 120 } },
    { id: 103, name: "Lobster Perang", emoji: "🦞", level: 1, hp: 350, attack: 30, defense: 5, reward: { coins: 2200, exp: 110 } },
    { id: 201, name: "Belut Listrik", emoji: "⚡🐍", level: 2, hp: 600, attack: 40, defense: 20, reward: { coins: 4000, exp: 200 } },
    { id: 202, name: "Ikan Keli Hantu", emoji: "👻🐟", level: 2, hp: 550, attack: 35, defense: 30, reward: { coins: 4500, exp: 220 } },
    { id: 203, name: "Pari Malaikat", emoji: "😇🐠", level: 2, hp: 500, attack: 45, defense: 25, reward: { coins: 4200, exp: 210 } },
    { id: 301, name: "Naga Laut", emoji: "🐉", level: 3, hp: 1000, attack: 70, defense: 40, reward: { coins: 8000, exp: 400 } },
    { id: 302, name: "Kraken Tua", emoji: "🐙👁️", level: 3, hp: 1200, attack: 60, defense: 50, reward: { coins: 9000, exp: 450 } },
    { id: 303, name: "Leviathan", emoji: "🐍🌊", level: 3, hp: 1100, attack: 65, defense: 45, reward: { coins: 8500, exp: 420 } },
    { id: 401, name: "Morgoth", emoji: "👑🔥", level: 4, hp: 3000, attack: 150, defense: 100, reward: { coins: 50000, exp: 2000, special: true } },
    { id: 402, name: "Sauron", emoji: "👁️🗿", level: 4, hp: 3500, attack: 140, defense: 120, reward: { coins: 60000, exp: 2500, special: true } },
    { id: 403, name: "Valar", emoji: "✨👼", level: 4, hp: 4000, attack: 130, defense: 150, reward: { coins: 70000, exp: 3000, special: true } }
];

// ==================== DUNGEON LEVELS ====================
export const DUNGEON_LEVELS = [
    { id: 1, name: "🐚 Pantai Berbisik", description: "Dungeon pemula, ombak berbisik membawa rahasia", entryFee: 5000, requiredLevel: 5, background: "linear-gradient(135deg, #00b4d8, #0077b6)", color: "#00b4d8", bossIds: [101, 102, 103] },
    { id: 2, name: "🕳️ Gua Kegelapan", description: "Gelap gulita, penuh monster mengerikan", entryFee: 10000, requiredLevel: 10, background: "linear-gradient(135deg, #2b2b2b, #1a1a1a)", color: "#2b2b2b", bossIds: [201, 202, 203] },
    { id: 3, name: "🌋 Jurang Maut", description: "Jurang terdalam di lautan", entryFee: 20000, requiredLevel: 15, background: "linear-gradient(135deg, #8b0000, #330000)", color: "#8b0000", bossIds: [301, 302, 303] },
    { id: 4, name: "👑 Throne of Gods", description: "Dungeon terakhir, tempat para dewa", entryFee: 50000, requiredLevel: 20, background: "linear-gradient(135deg, #4a00e0, #8e2de2)", color: "#4a00e0", bossIds: [401, 402, 403] }
];

// ==================== HELPER FUNCTIONS ====================
export function getBossById(id) {
    return DUNGEON_BOSSES.find(boss => boss.id === id);
}

export function getLevelById(id) {
    return DUNGEON_LEVELS.find(level => level.id === id);
}

export function getWeaponById(id) {
    return DUNGEON_WEAPONS.find(weapon => weapon.id === id);
}

export function getArmorById(id) {
    return DUNGEON_ARMORS.find(armor => armor.id === id);
}