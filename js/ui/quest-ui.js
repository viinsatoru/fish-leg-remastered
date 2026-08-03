// js/ui/quest-ui.js

import { questSystem } from '../systems/quest-system.js';

export class QuestUI {
    constructor() {
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        this.initialized = true;
        console.log('✅ Quest UI initialized');
    }

    loadQuests() {
        const container = document.getElementById('quests-list');
        if (!container) {
            console.warn('❌ quests-list not found');
            return;
        }

        container.innerHTML = '';

        const quests = questSystem.getQuests();
        if (!quests || quests.length === 0) {
            container.innerHTML = '<p class="empty-message">Belum ada quest tersedia</p>';
            return;
        }

        quests.forEach(quest => {
            const progressPercent = quest.target > 0 ? Math.min((Number(quest.progress) / Number(quest.target)) * 100, 100) : 0;

            const item = document.createElement('div');
            item.className = 'quest-item';
            item.style.cssText = 'background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; margin: 10px; border-left: 4px solid ' + (quest.completed ? '#4CAF50' : '#FFD700') + ';';

            item.innerHTML = `
                <h4 style="color: #FFD700; margin-bottom: 5px;">${quest.name}</h4>
                <p style="color: #ccc; margin-bottom: 10px;">${quest.desc}</p>
                <div style="background: rgba(0,0,0,0.3); height: 8px; border-radius: 4px; margin: 10px 0;">
                    <div style="width: ${progressPercent}%; height: 100%; background: linear-gradient(to right, #4CAF50, #8BC34A); border-radius: 4px;"></div>
                </div>
                <p style="color: white;">Progress: ${quest.progress}/${quest.target}</p>
                <p style="color: #00ffff;"><strong>Reward:</strong> ${quest.reward}</p>
                ${quest.completed ? '<div style="color: #4CAF50; margin-top: 5px;">✓ Completed</div>' : ''}
            `;

            container.appendChild(item);
        });
    }
}

export const questUI = new QuestUI();