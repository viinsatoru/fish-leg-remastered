// js/ui/notification.js

import { eventBus, EVENTS } from '../core/event-bus.js';

// ==================== NOTIFICATION SYSTEM ====================
class NotificationSystem {
    constructor() {
        this.container = null;
        this.notifications = [];
        this.maxNotifications = 5;
        this.initialized = false;
        this.listenersAttached = false;
    }

    init(containerId = 'notification-container') {
        if (this.initialized) return;
        
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.warn('Notification container not found, creating one...');
            this.container = document.createElement('div');
            this.container.id = containerId;
            this.container.style.position = 'fixed';
            this.container.style.top = '20px';
            this.container.style.right = '20px';
            this.container.style.zIndex = '10000';
            this.container.style.maxWidth = '400px';
            document.body.appendChild(this.container);
        }

        this.initialized = true;
        this.initStyles();
        
        // ============ CEK DUPLICATE LISTENER ============
        if (!this.listenersAttached) {
            eventBus.on(EVENTS.NOTIFICATION, (data) => {
                this.show(data.message, data.type || 'info');
            });
            this.listenersAttached = true;
            console.log('✅ Notification listener attached');
        }
    }

    initStyles() {
        if (document.getElementById('notification-styles')) return;

        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes notifSlideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes notifSlideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            .notification-item {
                padding: 12px 20px;
                border-radius: 8px;
                margin: 10px 0;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                animation: notifSlideIn 0.3s ease;
                color: white;
                font-weight: 500;
                min-width: 200px;
                max-width: 400px;
            }
            .notification-item.info { background: #2196F3; }
            .notification-item.success { background: #4CAF50; }
            .notification-item.warning { background: #FFA500; }
            .notification-item.error { background: #FF6B6B; }
            .notification-item.out {
                animation: notifSlideOut 0.3s ease;
            }
        `;
        document.head.appendChild(style);
    }

    show(message, type = 'info', duration = 3000) {
        if (!this.container) {
            console.warn('Notification container not ready');
            return;
        }

        // Remove old notifications if limit reached
        while (this.notifications.length >= this.maxNotifications) {
            const oldest = this.notifications.shift();
            if (oldest && oldest.parentNode) {
                oldest.parentNode.removeChild(oldest);
            }
        }

        const notification = document.createElement('div');
        notification.className = `notification-item ${type}`;
        notification.textContent = message;

        this.container.appendChild(notification);
        this.notifications.push(notification);

        setTimeout(() => {
            notification.classList.add('out');
            setTimeout(() => {
                if (this.container.contains(notification)) {
                    this.container.removeChild(notification);
                    this.notifications = this.notifications.filter(n => n !== notification);
                }
            }, 300);
        }, duration);
    }

    info(message, duration = 3000) {
        this.show(message, 'info', duration);
    }

    success(message, duration = 3000) {
        this.show(message, 'success', duration);
    }

    warning(message, duration = 3000) {
        this.show(message, 'warning', duration);
    }

    error(message, duration = 3000) {
        this.show(message, 'error', duration);
    }

    clear() {
        this.notifications.forEach(n => {
            if (n.parentNode) n.parentNode.removeChild(n);
        });
        this.notifications = [];
    }
}

export const notification = new NotificationSystem();

export const showNotification = (msg, type) => notification.show(msg, type);