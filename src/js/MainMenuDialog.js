import Dialog from './Dialog.js';
import { STATUS_PAUSED } from './GameModel.js';

/**
 * MainMenuDialog class that extends Dialog with event delegation.
 * @class MainMenuDialog
 * @extends {Dialog}
 */
class MainMenuDialog extends Dialog {
    /**
     * Creates an instance of MainMenuDialog.
     * @param {Object} options - Configuration options.
     * @param {GameModel} options.model - The game model instance.
     * @param {number} [options.width=600] - Width of the dialog in original game coordinates.
     * @param {number} [options.height=810] - Height of the dialog in original game coordinates.
     * @param {number} [options.x] - X position in original game coordinates (centered if not provided).
     * @param {number} [options.y] - Y position in original game coordinates (centered if not provided).
     * @param {number} [options.factor=1] - Scaling factor.
     * @param {Scaling} [options.scaling] - Scaling instance for positioning.
     * @param {Function} [options.onResume] - Callback when resume/exit button is clicked.
     * @param {number} [options.originalWidth=896] - Original game width for centering.
     * @param {number} [options.originalHeight=1152] - Original game height for centering.
     */
    constructor(options = {}) {
        const {
            model,
            x,
            y,
            factor = 1,
            scaling,
            onResume,
            originalWidth,
            originalHeight,
            width = 700,
            height = 810,
        } = options;

        if (!model) {
            throw new Error('MainMenuDialog requires a model');
        }

        // Center dialog if position not provided
        const dialogX = typeof x !== 'undefined' ? x : (originalWidth - width) / 2;
        const dialogY = typeof y !== 'undefined' ? y : (originalHeight - height) / 2;

        // Initialize Dialog with empty content (will be set in render)
        super({
            width,
            height,
            x : dialogX,
            y : dialogY,
            factor,
            scaling,
            dotColor: 'white',
            content: ''
        });

        // Store references after super()
        this.model = model;
        this._onResume = onResume;

        // Listen to model status changes to update menu
        this.model.on('change:status', this._onModelStatusChange.bind(this));
    }

    /**
     * Handles resume button click event.
     * @param {Event} event - The click event.
     */
    onResumeButtonClick(event) {
        if (this._onResume) {
            this._onResume();
        }
    }

    renderContent() {
        const isPause = this.model.status === STATUS_PAUSED;
        const title = isPause ? 'PAUSED' : 'MAIN MENU';
        const exitButtonText = isPause ? 'RESUME' : 'EXIT MENU';
    
        const content = `
            <div class="main-menu">
                <h2 class="menu-title">${title}</h2>
                
                <div class="menu-section">
                    <h3 class="menu-section-title">CONTROLS</h3>
                    
                    <div class="control-info">
                        <div class="control-item">
                            <strong>KEYBOARD:</strong>
                            <div class="control-details">
                                <span>←↑↓→</span> Move
                                <br>
                                <span>ESC</span> Pause/Menu
                            </div>
                        </div>
                        
                        <div class="control-item">
                            <strong>GAMEPAD:</strong>
                            <div class="control-details">
                                <span>D-Pad/Stick</span> Move
                                <br>
                                <span>START</span> Pause/Menu/Start
                            </div>
                        </div>
                        
                        <div class="control-item">
                            <strong>TOUCH:</strong>
                            <div class="control-details">
                                <span>Swipe</span> Move
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="menu-section">
                    <h3 class="menu-section-title">OPTIONS</h3>
                    
                    <div class="option-item">
                        <label class="checkbox-label">
                            <input type="checkbox" class="menu-checkbox" id="sound-checkbox" ${this.model.soundEnabled ? 'checked' : ''}>
                            <span>Sound ON/OFF</span>
                        </label>
                    </div>
                    
                    <div class="option-item">
                        <label class="checkbox-label">
                            <input type="checkbox" class="menu-checkbox" id="overlay-checkbox" ${this.model.overlayEnabled ? 'checked' : ''}>
                            <span>Overlay</span>
                        </label>
                    </div>
                </div>
                
                <div class="menu-section">
                    <button class="menu-button" id="resume-button">${exitButtonText}</button>
                </div>
            </div>
        `;

        this.$contentArea.innerHTML = content;

        return this;
    }

    /**
     * Handles model status changes to update menu dynamically.
     * @private
     */
    _onModelStatusChange() {
        // Re-render with updated content based on new status
        this.render();
    }

    _onSoundCheckboxChange(event) {
        this.model.soundEnabled = event.target.checked;
    }

    _onOverlayCheckboxChange(event) {
        this.model.overlayEnabled = event.target.checked;
    }

    /**
     * Cleans up event handlers when dialog is destroyed.
     */
    onDestroy() {
        if (this.model && this._onModelStatusChange) {
            this.model.off('change:status', this._onModelStatusChange);
        }
    }
}

/**
 * Event delegation map for MainMenuDialog.
 */
MainMenuDialog.prototype.events = {
    'change #sound-checkbox': '_onSoundCheckboxChange',
    'change #overlay-checkbox': '_onOverlayCheckboxChange',
    'click #resume-button': 'onResumeButtonClick'
};

export default MainMenuDialog;

