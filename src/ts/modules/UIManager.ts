export interface SWOElements {
    editorPane?: HTMLElement;
    codeEditorContainer?: HTMLElement;
    codePrettierBtn?: HTMLElement;
    resizeHandle?: HTMLElement;
    rightPane?: HTMLElement;
    previewPaneContainer?: HTMLElement;
    previewDevicesContainer?: HTMLElement;
    previewFrame?: HTMLIFrameElement;
    resizeHandleConsole?: HTMLElement;
    consoleContainer?: HTMLElement;
    consoleOutput?: HTMLElement;
    clearConsoleBtn?: HTMLElement;
    previewFrameCover?: HTMLElement;
    toggleCodeEditorBtn?: HTMLElement;
    toggleConsoleBtn?: HTMLElement;
    resizeDesktopBtn?: HTMLElement;
    resizeTabletBtn?: HTMLElement;
    resizeMobileBtn?: HTMLElement;
    refreshPreviewBtn?: HTMLElement;
    openNewTabBtn?: HTMLElement;
    codeEditorUIElements?: NodeListOf<Element>;
    consoleUIElements?: NodeListOf<Element>;
}

export class UIManager {
    elements: SWOElements = {};
    
    private targetElement: HTMLElement;
    private isResizingPanes: boolean = false;
    private isResizingConsole: boolean = false;

    private _initialMouseX: number = 0;
    private _initialEditorWidth: number = 0;
    private _boundHandlePaneMouseMove: ((e: MouseEvent) => void) | null = null;
    private _boundHandlePaneMouseUp: (() => void) | null = null;
  
    private _initialMouseYConsole: number = 0;
    private _initialPreviewHeight: number = 0;
    private _boundHandleConsoleResizeMouseMove: ((e: MouseEvent) => void) | null = null;
    private _boundHandleConsoleResizeMouseUp: (() => void) | null = null;

    constructor(targetElement: HTMLElement) {
        this.targetElement = targetElement;
    }

    createUI() {
        this.targetElement.innerHTML = `
            <div class="swo-main-wrapper">
                <section class="swo-panel-editor-preview">
                    <div class="swo-editor-pane">
                        <div class="swo-editor-wrapper">
                            <div class="swo-code-editor-container"></div>
                        </div>
                        <button class="swo-code-prettier-btn"><ss-icon icon="sparkles" thickness="2.2"></ss-icon> PRETTIER</button>
                    </div>
            
                    <div class="swo-resize-handle"></div>
            
                    <div class="swo-right-pane">
                        <div class="swo-preview-pane-container">
                            <div class="swo-preview-devices-container">
                                <iframe class="swo-preview-frame" sandbox="allow-scripts allow-popups allow-forms allow-same-origin allow-modals"></iframe>
                            </div>
                        </div>

                        <div class="swo-resize-handle-console"></div>
            
                        <div class="swo-console-container">
                            <div class="swo-console-header">
                                <span class="swo-console-title">Console</span>
                                <button class="swo-clear-console-btn">Clear</button>
                            </div>
                            <div class="swo-console-output"></div>
                        </div>
            
                        <div class="swo-preview-frame-cover-resizeable swo-hidden"></div>
                    </div>
                </section>
                <section class="swo-panel-control">
                    <div class="swo-panel-control-group-left">
                        <button class="swo-control-button swo-resize-desktop" title="Desktop View">
                            <ss-icon icon="computer-desktop" thickness="2.2"></ss-icon>
                        </button>
                        <button class="swo-control-button swo-resize-tablet" title="Tablet View">
                            <ss-icon icon="device-tablet" thickness="2.2"></ss-icon>
                        </button>
                        <button class="swo-control-button swo-resize-mobile" title="Mobile View">
                            <ss-icon icon="device-phone-mobile" thickness="2.2"></ss-icon>
                        </button>
                    </div>
                    <div class="swo-panel-control-group-center">
                        <button class="swo-control-button swo-refresh-preview" title="Refresh Preview">
                            <ss-icon icon="arrow-path" thickness="2.2"></ss-icon>
                        </button>                
                    </div>
                    <div class="swo-panel-control-group-right">
                        <button class="swo-control-button swo-toggle-code-editor-btn" title="Toggle Code Editor">
                            <ss-icon icon="code" thickness="2.2"></ss-icon>
                        </button>
                        <button class="swo-control-button swo-toggle-console-btn" title="Toggle Console">
                            <ss-icon icon="console" thickness="2.2"></ss-icon>
                        </button>
                        <button class="swo-control-button swo-open-new-tab" title="Open in New Tab">
                            <ss-icon icon="bolt" thickness="2.2"></ss-icon>
                        </button>
                    </div>
                </section>
            </div>
        `;
        this.cacheElements();
        this.initResizeListeners();
    }

    cacheElements() {
        const T = this.targetElement;
        this.elements.editorPane = T.querySelector(".swo-editor-pane") as HTMLElement;
        this.elements.codeEditorContainer = T.querySelector(".swo-code-editor-container") as HTMLElement;
        this.elements.codePrettierBtn = T.querySelector(".swo-code-prettier-btn") as HTMLElement;
        this.elements.resizeHandle = T.querySelector(".swo-resize-handle") as HTMLElement;
    
        this.elements.rightPane = T.querySelector(".swo-right-pane") as HTMLElement;
        this.elements.previewPaneContainer = T.querySelector(".swo-preview-pane-container") as HTMLElement;
        this.elements.previewDevicesContainer = T.querySelector(".swo-preview-devices-container") as HTMLElement;
        this.elements.previewFrame = T.querySelector(".swo-preview-frame") as HTMLIFrameElement;
    
        this.elements.resizeHandleConsole = T.querySelector(".swo-resize-handle-console") as HTMLElement;
        this.elements.consoleContainer = T.querySelector(".swo-console-container") as HTMLElement;
        this.elements.consoleOutput = T.querySelector(".swo-console-output") as HTMLElement;
        this.elements.clearConsoleBtn = T.querySelector(".swo-clear-console-btn") as HTMLElement;
        this.elements.previewFrameCover = T.querySelector(".swo-preview-frame-cover-resizeable") as HTMLElement;
    
        this.elements.toggleCodeEditorBtn = T.querySelector(".swo-toggle-code-editor-btn") as HTMLElement;
        this.elements.toggleConsoleBtn = T.querySelector(".swo-toggle-console-btn") as HTMLElement;
    
        this.elements.resizeDesktopBtn = T.querySelector(".swo-resize-desktop") as HTMLElement;
        this.elements.resizeTabletBtn = T.querySelector(".swo-resize-tablet") as HTMLElement;
        this.elements.resizeMobileBtn = T.querySelector(".swo-resize-mobile") as HTMLElement;
        this.elements.refreshPreviewBtn = T.querySelector(".swo-refresh-preview") as HTMLElement;
        this.elements.openNewTabBtn = T.querySelector(".swo-open-new-tab") as HTMLElement;
    
        this.elements.codeEditorUIElements = T.querySelectorAll(".swo-editor-pane, .swo-resize-handle");
        this.elements.consoleUIElements = T.querySelectorAll(".swo-console-container, .swo-resize-handle-console");
    }

    initialLayout() {
        if (!this.elements.editorPane || !this.elements.consoleUIElements || !this.elements.previewPaneContainer || !this.elements.rightPane) return;
        
        this.elements.editorPane.style.width = "calc(50% - 0.25rem)"; 
    
        // Hide console initially
        this.elements.consoleUIElements.forEach((element) =>
            element.classList.add("swo-hidden")
        );
        this.updateButtonActiveState(this.elements.toggleConsoleBtn, false);
        this.elements.previewPaneContainer.style.height = `${this.elements.rightPane.offsetHeight}px`;
    
        this.updateButtonActiveState(this.elements.toggleCodeEditorBtn, true);
    }
    
    updateButtonActiveState(button: HTMLElement | undefined, isActive: boolean) {
        if (!button) return;
        if (isActive) {
          button.classList.add("swo-active");
        } else {
          button.classList.remove("swo-active");
        }
    }

    toggleConsole() {
        const el = this.elements;
        if (!el.consoleContainer || !el.consoleUIElements || !el.rightPane || !el.previewPaneContainer || !el.resizeHandleConsole) return;
    
        const consoleIsCurrentlyVisible = !el.consoleContainer.classList.contains("swo-hidden");
    
        el.consoleUIElements.forEach((element) => {
            element.classList.toggle("swo-hidden", consoleIsCurrentlyVisible);
        });
    
        const isConsoleVisibleAfterToggle = !consoleIsCurrentlyVisible;
        this.updateButtonActiveState(el.toggleConsoleBtn, isConsoleVisibleAfterToggle);
    
        const rightPaneHeight = el.rightPane.offsetHeight;
        const resizeHandleConsoleHeight = el.resizeHandleConsole.offsetHeight;
    
        if (isConsoleVisibleAfterToggle) {
            el.previewPaneContainer.style.height = `${(rightPaneHeight - resizeHandleConsoleHeight) * 0.66}px`;
            el.consoleContainer.style.height = `${(rightPaneHeight - resizeHandleConsoleHeight) * 0.34}px`;
        } else {
            el.previewPaneContainer.style.height = `${rightPaneHeight}px`;
        }
    }

    toggleCodeEditor() {
        const el = this.elements;
        if (!el.codeEditorUIElements) return;

        let isEditorVisibleAfterToggle = false;
        el.codeEditorUIElements.forEach((element) => {
            const isCurrentlyHidden = element.classList.contains("swo-hidden");
            element.classList.toggle("swo-hidden", !isCurrentlyHidden);
            
            if (element === el.editorPane) {
                isEditorVisibleAfterToggle = isCurrentlyHidden; // If it was hidden, it is now visible
            }
        });
        this.updateButtonActiveState(el.toggleCodeEditorBtn, isEditorVisibleAfterToggle);
    }

    initResizeListeners() {
        if (this.elements.resizeHandle) {
            this.elements.resizeHandle.addEventListener("mousedown", this._onPaneResizeMouseDown.bind(this));
            this.elements.resizeHandle.addEventListener("dblclick", this._onPaneResizeDoubleClick.bind(this));
        }
        if (this.elements.resizeHandleConsole) {
            this.elements.resizeHandleConsole.addEventListener("mousedown", this._onConsoleResizeMouseDown.bind(this));
        }
    }

    // --- Pane Resizing Logic ---
    _onPaneResizeMouseDown(e: MouseEvent) {
        if (!this.elements.editorPane || !this.elements.previewFrameCover) return; 
    
        e.preventDefault();
        this.isResizingPanes = true;
        this._initialMouseX = e.clientX;
        this._initialEditorWidth = this.elements.editorPane.offsetWidth;
        this.elements.previewFrameCover.classList.remove("swo-hidden"); 
        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";
    
        this._boundHandlePaneMouseMove = this._handlePaneMouseMove.bind(this);
        this._boundHandlePaneMouseUp = this._handlePaneMouseUp.bind(this);
    
        document.addEventListener("mousemove", this._boundHandlePaneMouseMove);
        document.addEventListener("mouseup", this._boundHandlePaneMouseUp);
    }

    _handlePaneMouseMove(e: MouseEvent) {
        if (!this.isResizingPanes || !this.elements.editorPane || !this.elements.resizeHandle || !this.elements.editorPane.parentElement) return;
        const deltaX = e.clientX - this._initialMouseX;
        let newEditorWidth = this._initialEditorWidth + deltaX;
    
        const totalWidth = this.elements.editorPane.parentElement.offsetWidth;
        const handleWidth = this.elements.resizeHandle.offsetWidth;
        const minPixelWidth = Math.max(100, totalWidth * 0.15); 
    
        newEditorWidth = Math.max(minPixelWidth, Math.min(newEditorWidth, totalWidth - minPixelWidth - handleWidth));
        this.elements.editorPane.style.width = `${newEditorWidth}px`;
    }

    _handlePaneMouseUp() {
        if (!this.isResizingPanes || !this.elements.previewFrameCover) return;
        this.isResizingPanes = false;
        this.elements.previewFrameCover.classList.add("swo-hidden");
        document.body.style.cursor = "default";
        document.body.style.userSelect = "";
        
        if (this._boundHandlePaneMouseMove) document.removeEventListener("mousemove", this._boundHandlePaneMouseMove);
        if (this._boundHandlePaneMouseUp) document.removeEventListener("mouseup", this._boundHandlePaneMouseUp);
    }
    
    _onPaneResizeDoubleClick() {
        if (!this.elements.editorPane) return;
        this.elements.editorPane.style.width = "calc(50% - 0.25rem)"; 
    }

    // --- Console Resizing Logic ---
    _onConsoleResizeMouseDown(e: MouseEvent) {
        if (!this.elements.previewPaneContainer || !this.elements.previewFrameCover) return;
    
        e.preventDefault();
        this.isResizingConsole = true;
        this._initialMouseYConsole = e.clientY;
        this._initialPreviewHeight = this.elements.previewPaneContainer.offsetHeight;
        this.elements.previewFrameCover.classList.remove("swo-hidden");
        document.body.style.cursor = "row-resize";
        document.body.style.userSelect = "none";
    
        this._boundHandleConsoleResizeMouseMove = this._handleConsoleResizeMouseMove.bind(this);
        this._boundHandleConsoleResizeMouseUp = this._handleConsoleResizeMouseUp.bind(this);
    
        document.addEventListener("mousemove", this._boundHandleConsoleResizeMouseMove);
        document.addEventListener("mouseup", this._boundHandleConsoleResizeMouseUp);
    }
    
    _handleConsoleResizeMouseMove(e: MouseEvent) {
        if (!this.isResizingConsole || !this.elements.rightPane || !this.elements.resizeHandleConsole || !this.elements.previewPaneContainer || !this.elements.consoleContainer) return;
        const deltaY = e.clientY - this._initialMouseYConsole;
        let newPreviewHeight = this._initialPreviewHeight + deltaY;
    
        const totalHeight = this.elements.rightPane.offsetHeight;
        const handleHeight = this.elements.resizeHandleConsole.offsetHeight;
        const minPaneHeight = Math.max(50, totalHeight * 0.1); 
    
        newPreviewHeight = Math.max(minPaneHeight, Math.min(newPreviewHeight, totalHeight - minPaneHeight - handleHeight));
        const newConsoleHeight = totalHeight - newPreviewHeight - handleHeight;
    
        this.elements.previewPaneContainer.style.height = `${newPreviewHeight}px`;
        this.elements.consoleContainer.style.height = `${newConsoleHeight}px`;
    }

    _handleConsoleResizeMouseUp() {
        if (!this.isResizingConsole || !this.elements.previewFrameCover) return;
        this.isResizingConsole = false;
        this.elements.previewFrameCover.classList.add("swo-hidden");
        document.body.style.cursor = "default";
        document.body.style.userSelect = "";
        
        if (this._boundHandleConsoleResizeMouseMove) document.removeEventListener("mousemove", this._boundHandleConsoleResizeMouseMove);
        if (this._boundHandleConsoleResizeMouseUp) document.removeEventListener("mouseup", this._boundHandleConsoleResizeMouseUp);
    }
}
