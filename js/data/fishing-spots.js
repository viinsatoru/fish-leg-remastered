// js/data/fishing-spots.js - UPDATE BACKGROUND SPOT

export const BASE_FISHING_SPOTS = [
    {
        id: 0,
        name: "Danau Biasa",
        background: "linear-gradient(135deg, #1a3a5c, #2d6a8f, #4a8db7)",
        color: "#4a8db7",
        fishes: [
            { id: 0, name: "Ikan Mas", rarity: "basic", chance: 25, price: 10, emoji: "🐟" },
            { id: 1, name: "Ikan Lele", rarity: "basic", chance: 20, price: 8, emoji: "🐠" },
            { id: 2, name: "Ikan Nila", rarity: "basic", chance: 15, price: 12, emoji: "🐡" },
            { id: 3, name: "Ikan Guppy", rarity: "basic", chance: 10, price: 6, emoji: "🐠" },
            { id: 4, name: "Ikan Hiu", rarity: "legendary", chance: 8, price: 50, emoji: "🦈" },
            { id: 5, name: "Ikan Pari", rarity: "legendary", chance: 7, price: 45, emoji: "🐠" },
            { id: 6, name: "Ikan Todak", rarity: "legendary", chance: 5, price: 55, emoji: "🐟" },
            { id: 7, name: "Ikan Salmon", rarity: "legendary", chance: 5, price: 60, emoji: "🐠" },
            { id: 8, name: "Ikan Naga", rarity: "mythical", chance: 2, price: 150, emoji: "🐉" },
            { id: 9, name: "Ikan Phoenix", rarity: "mythical", chance: 1.5, price: 180, emoji: "🐦‍🔥" },
            { id: 10, name: "Ikan Unicorn", rarity: "mythical", chance: 1, price: 200, emoji: "🦄" },
            { id: 11, name: "Ikan Legenda", rarity: "secret", chance: 0.8, price: 2000, emoji: "🌟", spot: "danau" },
            { id: 12, name: "Ikan Kosmik", rarity: "secret", chance: 0.5, price: 3000, emoji: "🌌", spot: "danau" }
        ]
    },
    {
        id: 1, 
        name: "Kuil Suci",
        background: "radial-gradient(ellipse at center, #0f0c29, #302b63, #24243e)",
        color: "#6a3a8a",
        fishes: [
            { id: 100, name: "Ikan Suci", rarity: "basic", chance: 20, price: 15, emoji: "🐟" },
            { id: 101, name: "Ikan Monk", rarity: "basic", chance: 18, price: 12, emoji: "🐠" },
            { id: 102, name: "Ikan Bless", rarity: "basic", chance: 12, price: 18, emoji: "🐡" },
            { id: 103, name: "Ikan Zen", rarity: "basic", chance: 10, price: 14, emoji: "🐠" },
            { id: 104, name: "Ikan Divine", rarity: "legendary", chance: 10, price: 80, emoji: "✨" },
            { id: 105, name: "Ikan Angel", rarity: "legendary", chance: 8, price: 95, emoji: "🪽" },
            { id: 106, name: "Ikan Temple", rarity: "legendary", chance: 7, price: 110, emoji: "⛰️" },
            { id: 107, name: "Ikan Spirit", rarity: "legendary", chance: 5, price: 120, emoji: "👻" },
            { id: 108, name: "Ikan Deva", rarity: "mythical", chance: 4, price: 300, emoji: "💥" },
            { id: 109, name: "Ikan Buddha", rarity: "mythical", chance: 3, price: 450, emoji: "🦚" },
            { id: 110, name: "Ikan Nirvana", rarity: "mythical", chance: 1, price: 600, emoji: "🪷" },
            { id: 111, name: "Rahata Turtle", rarity: "secret", chance: 0.1, price: 2500, emoji: "🐢", spot: "kuil" },
            { id: 112, name: "Mbah To Fish", rarity: "secret", chance: 0.09, price: 5000, emoji: "🫎", spot: "kuil" },
            { id: 113, name: "Raji Fish", rarity: "secret", chance: 0.05, price: 10000, emoji: "🪼", spot: "kuil" }
        ]
    },
    {
        id: 2,
        name: "Laut Dalam", 
        background: "radial-gradient(ellipse at bottom, #00008B, #000080, #0a0a2a)",
        color: "#1a3a6a",
        fishes: [
            { id: 200, name: "Ikan Teri", rarity: "basic", chance: 15, price: 20, emoji: "🐟" },
            { id: 201, name: "Ikan Tuna", rarity: "basic", chance: 15, price: 25, emoji: "🐠" },
            { id: 202, name: "Ikan Tongkol", rarity: "basic", chance: 10, price: 30, emoji: "🐡" },
            { id: 203, name: "Ikan Sarden", rarity: "basic", chance: 10, price: 18, emoji: "🐠" },
            { id: 204, name: "Ikan Paus", rarity: "legendary", chance: 10, price: 200, emoji: "🐋" },
            { id: 205, name: "Ikan Gurita", rarity: "legendary", chance: 9, price: 180, emoji: "🦑" },
            { id: 206, name: "Ikan Lumba", rarity: "legendary", chance: 8, price: 220, emoji: "🐬" },
            { id: 207, name: "Ikan Hiu Martil", rarity: "legendary", chance: 5, price: 250, emoji: "🦈" },
            { id: 208, name: "Ikan Naga Laut", rarity: "mythical", chance: 6, price: 800, emoji: "🦎" },
            { id: 209, name: "Ikan Poseidon", rarity: "mythical", chance: 4, price: 1200, emoji: "🔱" },
            { id: 210, name: "Ikan Siren", rarity: "mythical", chance: 2, price: 1500, emoji: "🧜‍♀️" },
            { id: 211, name: "Kraken Raksasa", rarity: "secret", chance: 0.1, price: 8000, emoji: "🐙", spot: "laut" },
            { id: 212, name: "Leviathan", rarity: "secret", chance: 0.05, price: 20000, emoji: "🐍", spot: "laut" },
            { id: 213, name: "Cthulhu", rarity: "secret", chance: 0.01, price: 50000, emoji: "👹", spot: "laut" }
        ]
    },
    {
        id: 3,
        name: "Sungai Emas",
        background: "linear-gradient(135deg, #1a1a0a, #4a3a1a, #7a5a2a, #c49a3a)",
        color: "#c49a3a", 
        fishes: [
            { id: 300, name: "Ikan Koi", rarity: "basic", chance: 15, price: 30, emoji: "🐟" },
            { id: 301, name: "Ikan Komet", rarity: "basic", chance: 12, price: 25, emoji: "🐠" },
            { id: 302, name: "Ikan Mas Koki", rarity: "basic", chance: 8, price: 35, emoji: "🐡" },
            { id: 303, name: "Ikan Kaca", rarity: "basic", chance: 5, price: 28, emoji: "🐠" },
            { id: 304, name: "Ikan Dragon", rarity: "legendary", chance: 10, price: 300, emoji: "🐲" },
            { id: 305, name: "Ikan Phoenix Gold", rarity: "legendary", chance: 9, price: 350, emoji: "🔥" },
            { id: 306, name: "Ikan Unicorn Gold", rarity: "legendary", chance: 8, price: 400, emoji: "🦄" },
            { id: 307, name: "Ikan Titan", rarity: "legendary", chance: 5, price: 450, emoji: "⚡" },
            { id: 308, name: "Ikan Emperor", rarity: "mythical", chance: 4, price: 800, emoji: "🦂" },
            { id: 309, name: "Ikan Celestial", rarity: "mythical", chance: 3, price: 1000, emoji: "⭐" },
            { id: 310, name: "Ikan Eternal", rarity: "mythical", chance: 1, price: 1500, emoji: "💎" },
            { id: 311, name: "Golden Leviathan", rarity: "secret", chance: 0.05, price: 10000, emoji: "🐉", spot: "sungai" },
            { id: 312, name: "Sun Fish", rarity: "secret", chance: 0.05, price: 15000, emoji: "☀️", spot: "sungai" },
            { id: 313, name: "Moster Locness", rarity: "secret", chance: 0.01, price: 50000, emoji: "🦕", spot: "sungai" }
        ]
    },
    {
        id: 4,
        name: "Luar Angkasa",
        background: "radial-gradient(ellipse at center, #0a0a2a, #1a0a3a, #2a0a5a, #0a0a1a)",
        color: "#5a2a8a",
        fishes: [
            { id: 400, name: "Bintang Jatuh", rarity: "basic", chance: 18, price: 60, emoji: "⭐" },
            { id: 401, name: "Komet Kecil", rarity: "basic", chance: 15, price: 55, emoji: "☄️" },
            { id: 402, name: "Debu Kosmik", rarity: "basic", chance: 12, price: 50, emoji: "✨" },
            { id: 403, name: "Alien Fish", rarity: "legendary", chance: 5, price: 800, emoji: "👽" },
            { id: 404, name: "Blob Fish", rarity: "legendary", chance: 5, price: 750, emoji: "🐷" },
            { id: 405, name: "Ikan UFO", rarity: "mythical", chance: 0.5, price: 1000, emoji: "🛸" },
            { id: 406, name: "Ikan Gileg", rarity: "mythical", chance: 0.1, price: 2000, emoji: "🌠" },
            { id: 407, name: "404 Fish", rarity: "secret", chance: 0.09, price: 50000, emoji: "🦠", spot: "angkasa" },
            { id: 408, name: "1x1x1 Fish", rarity: "secret", chance: 0.05, price: 60000, emoji: "💠", spot: "angkasa" },
            { id: 409, name: "Elshark Gran Maja", rarity: "secret", chance: 0.01, price: 80000, emoji: "🎃", spot: "angkasa" }
        ]
    },
    {
        id: 5,
        name: "🧠 Brainrot",
        background: "radial-gradient(ellipse at center, #2a0a2a, #4a1a4a, #6a2a6a, #ff00ff33)",
        color: "#ff00ff",
        fishes: [
            { id: 500, name: "Skibidi Toilet", rarity: "basic", chance: 25, price: 69, emoji: "🚽", spot: "brainrot" },
            { id: 501, name: "Sigma Male", rarity: "basic", chance: 25, price: 42, emoji: "😎", spot: "brainrot" },
            { id: 502, name: "Gyat", rarity: "basic", chance: 20, price: 100, emoji: "🍑", spot: "brainrot" },
            { id: 503, name: "Hawk Tuah", rarity: "legendary", chance: 8, price: 420, emoji: "🌬️", spot: "brainrot" },
            { id: 504, name: "Skull Emoji", rarity: "legendary", chance: 7, price: 500, emoji: "💀", spot: "brainrot" },
            { id: 505, name: "Ohio Final Boss", rarity: "legendary", chance: 5, price: 666, emoji: "👹", spot: "brainrot" },
            { id: 506, name: "Ambatukam", rarity: "mythical", chance: 3, price: 999, emoji: "🏃", spot: "brainrot" },
            { id: 507, name: "Among Us", rarity: "mythical", chance: 2, price: 777, emoji: "ඞ", spot: "brainrot" },
            { id: 508, name: "Big Smoke Order", rarity: "mythical", chance: 2, price: 888, emoji: "🍔", spot: "brainrot" },
            { id: 509, name: "Skibidi Toilet Rizzler Sigma", rarity: "secret", chance: 0.2, price: 6940, emoji: "🧠", spot: "brainrot" },
            { id: 510, name: "Brainrot Overlord", rarity: "secret", chance: 0.01, price: 99999, emoji: "👑", spot: "brainrot" }
        ]
    },
    {
        id: 6,
        name: "₿ Crypto",
        background: "radial-gradient(ellipse at center, #1a1a0a, #2a3a1a, #4a5a2a, #F7931A33)",
        color: "#F7931A",
        fishes: [
            { id: 600, name: "Dogecoin", rarity: "basic", chance: 35, price: 10, emoji: "🐕", spot: "crypto" },
            { id: 601, name: "Shiba Inu", rarity: "basic", chance: 35, price: 8, emoji: "🐕‍🦺", spot: "crypto" },
            { id: 602, name: "HypeLiquid", rarity: "legendary", chance: 15, price: 500, emoji: "🔋", spot: "crypto" },
            { id: 603, name: "Solana", rarity: "legendary", chance: 10, price: 500, emoji: "🌌", spot: "crypto" },
            { id: 604, name: "Binance Coin", rarity: "mythical", chance: 3, price: 3000, emoji: "🪙", spot: "crypto" },
            { id: 605, name: "Ethereum", rarity: "mythical", chance: 2, price: 2500, emoji: "💎", spot: "crypto" },
            { id: 606, name: "Bitcoin", rarity: "secret", chance: 0.01, price: 100000, emoji: "₿", spot: "crypto" }
        ]
    }
];

export const ATLANTIS_SPOT = {
    id: 7,
    name: "🌊 Atlantis",
    background: "radial-gradient(ellipse at center, #001a2a, #003a5a, #005a8a, #00ffff22)",
    color: "#00ddff",
    isEventSpot: false,
    fishes: [
        { id: 700, name: "Dolphin", rarity: "legendary", chance: 70, price: 200, emoji: "🐬", spot: "atlantis" },
        { id: 701, name: "Whale", rarity: "mythical", chance: 29.9, price: 500, emoji: "🐋", spot: "atlantis" },
        { id: 702, name: "Neptunus", rarity: "special", chance: 0.005, price: 200000, emoji: "🧜‍♂️", spot: "atlantis" }
    ]
};

export const VALINOR_SPOT = {
    id: 8,
    name: "🏝️ Valinor",
    background: "radial-gradient(ellipse at center, #1a0a0a, #3a1a0a, #5a2a0a, #FFD70022)",
    color: "#FFD700",
    isEventSpot: false,
    requiresGear: "crownOfSilmarillion",
    requiresPet: 7,
    fishes: [
        { id: 800, name: "Angel Dog", rarity: "legendary", chance: 30, price: 500, emoji: "🐩", spot: "valinor" },
        { id: 801, name: "SwanGod", rarity: "legendary", chance: 30, price: 1000, emoji: "🪿", spot: "valinor" },
        { id: 802, name: "BirdFeather", rarity: "mythical", chance: 18, price: 2500, emoji: "🕊️", spot: "valinor" },
        { id: 803, name: "Dugong", rarity: "mythical", chance: 18, price: 3000, emoji: "🦭", spot: "valinor" },
        { id: 804, name: "Elvish", rarity: "secret", chance: 3, price: 25000, emoji: "🧝‍♂️", spot: "valinor" },
        { id: 805, name: "ButterFly", rarity: "special", chance: 1, price: 120000, emoji: "🦋", spot: "valinor" }
    ]
};

export const FISHING_SPOTS = [...BASE_FISHING_SPOTS, ATLANTIS_SPOT, VALINOR_SPOT];

export function getAllFishes() {
    return FISHING_SPOTS.flatMap(spot => spot.fishes);
}

export function getSpotById(id) {
    return FISHING_SPOTS.find(spot => spot.id === id);
}

export function getFishById(id) {
    return getAllFishes().find(fish => fish.id === id);
}
