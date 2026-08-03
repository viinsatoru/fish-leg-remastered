// js/ui/modals.js

import { eventBus, EVENTS } from '../core/event-bus.js';

// ==================== MODAL MANAGER ====================
class ModalManager {
    constructor() {
        this.modals = {};
        this.activeModal = null;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;

        // Register all modals from DOM
        document.querySelectorAll('.modal').forEach(modal => {
            const id = modal.id;
            if (id) {
                this.register(id, modal);
            }
        });

        // Setup close buttons
        document.querySelectorAll('.modal .close').forEach(close => {
            close.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal && modal.id) {
                    this.close(modal.id);
                }
            });
        });

        // Click outside to close
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                const modalId = e.target.id;
                if (modalId) {
                    this.close(modalId);
                }
            }
        });

        this.initialized = true;
        console.log('✅ Modal Manager initialized');
    }

    register(id, element) {
        this.modals[id] = element;
        return this;
    }

    open(id, data = null) {
        const modal = this.modals[id] || document.getElementById(id);
        if (!modal) {
            console.warn(`Modal "${id}" not found`);
            return;
        }

        // Close current modal
        if (this.activeModal && this.activeModal !== id) {
            this.close(this.activeModal);
        }

        modal.style.display = 'block';
        this.activeModal = id;
        document.body.style.overflow = 'hidden';

        eventBus.emit(EVENTS.UI_MODAL_OPENED, { modal: id, data });

        // Trigger custom event
        const event = new CustomEvent('modal:open', { detail: { id, data } });
        document.dispatchEvent(event);

        return modal;
    }

    close(id) {
        const modal = this.modals[id] || document.getElementById(id);
        if (!modal) return;

        modal.style.display = 'none';

        if (this.activeModal === id) {
            this.activeModal = null;
        }

        document.body.style.overflow = '';

        eventBus.emit(EVENTS.UI_MODAL_CLOSED, { modal: id });

        // Trigger custom event
        const event = new CustomEvent('modal:close', { detail: { id } });
        document.dispatchEvent(event);
    }

    closeAll() {
        Object.keys(this.modals).forEach(id => {
            this.close(id);
        });
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
        this.activeModal = null;
        document.body.style.overflow = '';
    }

    isOpen(id) {
        const modal = this.modals[id] || document.getElementById(id);
        return modal && modal.style.display === 'block';
    }

    getActive() {
        return this.activeModal;
    }

    updateContent(id, html) {
        const modal = this.modals[id] || document.getElementById(id);
        if (!modal) return;

        const content = modal.querySelector('.modal-content');
        if (content) {
            // Find or create content area
            let contentArea = content.querySelector('.modal-body');
            if (!contentArea) {
                contentArea = document.createElement('div');
                contentArea.className = 'modal-body';
                // Insert after title
                const title = content.querySelector('h3, h2, .modal-title');
                if (title) {
                    title.after(contentArea);
                } else {
                    content.prepend(contentArea);
                }
            }
            contentArea.innerHTML = html;
        }
    }

    setTitle(id, title) {
        const modal = this.modals[id] || document.getElementById(id);
        if (!modal) return;

        const titleEl = modal.querySelector('h3, h2, .modal-title');
        if (titleEl) {
            titleEl.textContent = title;
        }
    }
}

// Singleton instance
export const modalManager = new ModalManager();

// Export untuk kompatibilitas
export const openModal = (id, data) => modalManager.open(id, data);
export const closeModal = (id) => modalManager.close(id);