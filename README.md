# 🎣 Fishing Legend

<div align="center">

![Fishing Legend Banner](https://via.placeholder.com/800x200/1a1a2e/FFD700?text=Fishing+Legend)

**Game Memancing Interaktif dengan Sistem RPG, Dungeon, dan Mining**

[![Version](https://img.shields.io/badge/version-6.0-blue.svg)](https://github.com/viinsatoru/fish-leg-remastered)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)

</div>

---

## 📖 **Deskripsi**

**Fishing Legend** adalah game memancing interaktif berbasis web yang menggabungkan elemen RPG, idle game, dan petualangan. Kumpulkan berbagai jenis ikan, tingkatkan peralatan, hadapi dungeon, dan bangun kerajaan memancingmu sendiri!

Dikembangkan dengan JavaScript murni tanpa framework, game ini menawarkan pengalaman bermain yang kaya dengan sistem progresi yang dalam.

---

## ✨ **Fitur Utama**

### 🎣 **Sistem Memancing**
- 9+ Spot Memancing unik (Danau, Kuil, Laut Dalam, Luar Angkasa, Brainrot, Crypto, Atlantis, Valinor)
- Sistem Kedalaman dengan 4 tingkat (Permukaan, Tengah, Dalam, Abyss)
- Sistem Cuaca dinamis yang mempengaruhi keberuntungan
- Minigame Perfect Catch untuk bonus 50%
- 40+ Jenis Ikan dengan rarity berbeda (Basic, Legendary, Mythical, Secret, Special)

### 🎣 **Equipment & Progresi**
- 20+ Rod dengan tingkat luck berbeda
- 20+ Bait dengan efek khusus
- Potion untuk meningkatkan luck sementara
- Depth Gear untuk mengakses area baru
- Sistem Gacha untuk mendapatkan rod langka

### 🐕 **Sistem Pet**
- 8 Pet dengan efek unik (Luck, Coin, Perfect Catch, Auto-fish, Double Catch)
- 2 Slot pet (bisa di-unlock via Skill Tree)
- Pet aktif memberikan bonus pasif saat memancing

### 🌳 **Skill Tree**
- Lucky Skill: +100% Luck per level
- Cast Skill: +5% Double Catch chance per level
- Expert Skill: +10 EXP Gamepass per level
- Penawar Skill: +10% Harga Jual per level
- Animal Lovers: Buka 2 slot pet

### ⚔️ **Dungeon System**
- 4 Level Dungeon dengan 12 Boss
- Sistem pertarungan turn-based
- Equipment (Senjata & Armor) untuk meningkatkan stats
- Secret Token sebagai mata uang dungeon
- Token Exchange untuk hadiah langka

### ⛏️ **Mining System**
- Sistem mining dengan 7 tools (Gunting, Kapak, Palu, Pickaxe, Hammer, Magnet, Alat Bor)
- Mining Skill Tree (Perfect Cut, Lucky)
- Exchange Coin/Rock → Diamond
- Statistik mining (Total Mine, Perfect Count, dll)

### 🏆 **Rank Battle**
- 4 Rank (Warrior, Legend, Mythical, Immortal)
- Sistem leaderboard dengan NPC
- Battle reward: Diamond + EXP
- Streak bonus

### 🎟️ **Gamepass Premium**
- 40 Level dengan hadiah eksklusif
- EXP didapat dari memancing
- Reward: Rod, Bait, Potion, Pet, Fish, Coin, Diamond

### 📦 **Sistem Lainnya**
- Aquarium untuk koleksi ikan
- Exchange Center (Tukar ikan langka)
- Mystery Box (Basic, Normal, Secret)
- Favorite Fish system
- Auto-sell untuk rarity tertentu
- Auto-save setiap 30 detik
- Update system bawaan

---

## 🛠️ **Teknologi**

| Teknologi | Keterangan |
|-----------|------------|
| ![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow) | Bahasa pemrograman utama |
| ![HTML5](https://img.shields.io/badge/HTML5-E34F26) | Struktur UI |
| ![CSS3](https://img.shields.io/badge/CSS3-1572B6) | Styling & Animasi |
| ![LocalStorage](https://img.shields.io/badge/LocalStorage-FFA500) | Penyimpanan data |
| ![ES Modules](https://img.shields.io/badge/ES%20Modules-6A5ACD) | Struktur kode modular |

---

## 📁 **Struktur Proyek**
fishing-legend/
├── index.html # Halaman utama
├── style.css # Styling global
├── game.js # Standalone mining module
├── js/
│ ├── main.js # Entry point
│ ├── config/
│ │ ├── version.js # Version control
│ │ └── constants.js # Global constants
│ ├── data/
│ │ ├── fishing-spots.js # Spot & fish data
│ │ ├── equipment.js # Rods, baits, potions
│ │ ├── pets.js # Pet data
│ │ ├── dungeon.js # Dungeon data
│ │ └── exchange.js # Exchange recipes
│ ├── core/
│ │ ├── game-state.js # State management
│ │ ├── save-manager.js # Save/Load system
│ │ └── event-bus.js # Event system
│ ├── systems/
│ │ ├── fishing-system.js # Fishing logic
│ │ ├── mining-system.js # Mining logic
│ │ ├── dungeon-system.js # Dungeon logic
│ │ ├── rank-system.js # Rank battle logic
│ │ ├── quest-system.js # Quest logic
│ │ ├── pet-system.js # Pet logic
│ │ └── skill-system.js # Skill logic
│ └── ui/
│ ├── ui-manager.js # UI management
│ ├── notification.js # Notification system
│ ├── modals.js # Modal management
│ ├── inventory-ui.js # Backpack & sell
│ ├── shop-ui.js # Shop UI
│ ├── gacha-ui.js # Gacha UI
│ ├── dungeon-ui.js # Dungeon UI
│ ├── mining-ui.js # Mining UI
│ ├── aquarium-ui.js # Aquarium UI
│ ├── gamepass-ui.js # Gamepass UI
│ ├── rank-ui.js # Rank UI
│ ├── exchange-ui.js # Exchange UI
│ ├── village-ui.js # Village UI
│ ├── depth-gear-ui.js # Depth Gear UI
│ ├── skill-ui.js # Skill UI
│ └── pet-ui.js # Pet UI
└── README.md # Dokumentasi

🎮 Cara Bermain
Dasar
Pilih spot memancing - Klik tombol spot di atas

Klik "Mancing!" - Tunggu ikan dapat

Perfect Catch - Klik saat jarum di area emas

Kumpulkan ikan - Masuk ke backpack

Jual ikan - Buka tab Sell

Beli equipment - Buka tab Shop

Progresi
Naik level - Dapat EXP dari memancing

Beli rod & bait - Meningkatkan luck

Dapatkan pet - Bantuan pasif

Upgrade skill - Tingkatkan kemampuan

Buka depth gear - Akses area baru

Kumpulkan ikan langka - Untuk exchange

End Game
Dungeon - Hadapi boss dapat token

Mining - Dapatkan rock & diamond

Rank Battle - Naik rank dapat hadiah

Gamepass - 40 level eksklusif

Koleksi semua ikan - Lengkapi aquarium

