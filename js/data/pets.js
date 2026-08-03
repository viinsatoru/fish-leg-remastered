// js/data/pets.js

// ==================== PETS DATA ====================
export const PETS = [
    { id: 1, name: "Anjing Keberuntungan", description: "x5 Luck saat memancing", effect: { type: "luck_multiplier", value: 5 }, price: 5000, currency: "coins", emoji: "🐕" },
    { id: 2, name: "Kucing Koin", description: "+100 koin bonus setiap dapat ikan", effect: { type: "coin_bonus", value: 100 }, price: 8000, currency: "coins", emoji: "🐈" },
    { id: 3, name: "Ayam Perfect", description: "PERFECT CATCH 100% setiap mancing! (tanpa minigame)", effect: { type: "perfect_chance", value: 100 }, price: 100000, currency: "coins", emoji: "🐓" },
    { id: 4, name: "Serigala Berlian", description: "10% chance mendapat 1 💎 diamond", effect: { type: "diamond_chance", value: 10, diamond_amount: 1 }, price: 50, currency: "diamonds", emoji: "🐺" },
    { id: 5, name: "Robot", description: "Auto-fish setiap 30 detik (seperti assistant)", effect: { type: "auto_fish", interval: 30 }, price: 20000, currency: "coins", emoji: "🤖" },
    { id: 6, name: "Racoon", description: "10% chance mendapat ikan double saat mancing", effect: { type: "double_chance", value: 10 }, price: 200, currency: "diamonds", emoji: "🦨" },
    { id: 7, name: "Unicorn", description: "2x luck di gacha & WAJIB untuk spot Valinor", effect: { type: "gacha_multiplier", value: 2 }, price: 300, currency: "diamonds", emoji: "🦄" },
    { id: 8, name: "T-Rex", description: "+10% nilai ikan saat rank battle", effect: { type: "rank_bonus", value: 10 }, price: 100000, currency: "coins", emoji: "🦖" }
];