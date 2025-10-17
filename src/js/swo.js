import '../css/swo.css'; // Import CSS to be processed by Webpack

class SWO {
    constructor(targetOrOptions, optionsIfTarget) {
        let targetElement;
        let mergedOptions;

        if (typeof targetOrOptions === 'string' || targetOrOptions instanceof HTMLElement) {
            targetElement = (typeof targetOrOptions === 'string') ? document.querySelector(targetOrOptions) : targetOrOptions;
            mergedOptions = optionsIfTarget || {};
        } else {
            mergedOptions = targetOrOptions || {};
            targetElement = document.querySelector('[data-swo]'); // Default target
        }

        if (!targetElement) {
            console.error('SWO: Target element not found. Please provide a valid selector, DOM element, or ensure a [data-swo] element exists.');
            return;
        }
        this.targetElement = targetElement;
        this.targetElement.classList.add('swo-container'); // Add base class for scoping

        const instanceId = `swo-instance-${Math.random().toString(36).substring(2, 9)}`;
        this.options = {
            code: mergedOptions.code || this.targetElement.dataset.swoCode || this._getDefaultInitialCode(),
            storageKey: mergedOptions.storageKey || this.targetElement.dataset.swoStorageKey || `senangwebs-one-editor-content-${instanceId}`,
        };

        this.elements = {}; // To store references to important DOM elements
        this.monacoEditor = null;
        this.isResizingPanes = false;
        this.isResizingConsole = false;

        this._createUI();
        this._cacheElements();
        this._initMonaco();
        this._initEventListeners();
        this._initialLayout();
        this._loadCode(); // Load from storage or use initial code
        this.updatePreview();
    }

    _createUI() {
        this.targetElement.innerHTML = `
            <div class="swo-main-wrapper">
                <section class="swo-panel-editor-preview">
                    <div class="swo-editor-pane">
                        <div class="swo-editor-monaco-container">
                            <div class="swo-code-editor-container"></div>
                        </div>
                        <button class="swo-code-prettier-btn">PRETTIER</button>
                    </div>
            
                    <div class="swo-resize-handle"></div>
            
                    <div class="swo-right-pane">
                        <div class="swo-preview-pane-container">
                            <div class="swo-preview-devices-container">
                                <iframe class="swo-preview-frame" sandbox="allow-scripts allow-popups allow-forms allow-same-origin"></iframe>
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
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free v6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M64 0C28.7 0 0 28.7 0 64L0 352c0 35.3 28.7 64 64 64l176 0-10.7 32L160 448c-17.7 0-32 14.3-32 32s14.3 32 32 32l256 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-69.3 0L336 416l176 0c35.3 0 64-28.7 64-64l0-288c0-35.3-28.7-64-64-64L64 0zM512 64l0 224L64 288 64 64l448 0z"/></svg>
                        </button>
                        <button class="swo-control-button swo-resize-tablet" title="Tablet View">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free v5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M400 0H48C21.5 0 0 21.5 0 48v416c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V48c0-26.5-21.5-48-48-48zM224 480c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm176-108c0 6.6-5.4 12-12 12H60c-6.6 0-12-5.4-12-12V60c0-6.6 5.4-12 12-12h328c6.6 0 12 5.4 12 12v312z"/></svg>
                        </button>
                        <button class="swo-control-button swo-resize-mobile" title="Mobile View">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!--!Font Awesome Free v5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M272 0H48C21.5 0 0 21.5 0 48v416c0 26.5 21.5 48 48 48h224c26.5 0 48-21.5 48-48V48c0-26.5-21.5-48-48-48zM160 480c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm112-108c0 6.6-5.4 12-12 12H60c-6.6 0-12-5.4-12-12V60c0-6.6 5.4-12 12-12h200c6.6 0 12 5.4 12 12v312z"/></svg>
                        </button>
                    </div>
                    <div class="swo-panel-control-group-center">
                        <button class="swo-control-button swo-refresh-preview" title="Refresh Preview">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free v5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M370.72 133.28C339.458 104.008 298.888 87.962 255.848 88c-77.458.068-144.328 53.178-162.791 126.85-1.344 5.363-6.122 9.15-11.651 9.15H24.103c-7.498 0-13.194-6.807-11.807-14.176C33.933 94.924 134.813 8 256 8c66.448 0 126.791 26.136 171.315 68.685L463.03 40.97C478.149 25.851 504 36.559 504 57.941V192c0 13.255-10.745 24-24 24H345.941c-21.382 0-32.09-25.851-16.971-40.971l41.75-41.749zM32 296h134.059c21.382 0 32.09 25.851 16.971 40.971l-41.75 41.75c31.262 29.273 71.835 45.319 114.876 45.28 77.418-.07 144.315-53.144 162.787-126.849 1.344-5.363 6.122-9.15 11.651-9.15h57.304c7.498 0 13.194 6.807 11.807 14.176C478.067 417.076 377.187 504 256 504c-66.448 0-126.791-26.136-171.315-68.685L48.97 471.03C33.851 486.149 8 475.441 8 454.059V320c0-13.255 10.745-24 24-24z"/></svg>
                        </button>                
                    </div>
                    <div class="swo-panel-control-group-right">
                        <button class="swo-control-button swo-toggle-code-editor-btn" title="Toggle Code Editor">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--!Font Awesome Free v5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M278.9 511.5l-61-17.7c-6.4-1.8-10-8.5-8.2-14.9L346.2 8.7c1.8-6.4 8.5-10 14.9-8.2l61 17.7c6.4 1.8 10 8.5 8.2 14.9L293.8 503.3c-1.9 6.4-8.5 10.1-14.9 8.2zm-114-112.2l43.5-46.4c4.6-4.9 4.3-12.7-.8-17.2L117 256l90.6-79.7c5.1-4.5 5.5-12.3.8-17.2l-43.5-46.4c-4.5-4.8-12.1-5.1-17-.5L3.8 247.2c-5.1 4.7-5.1 12.8 0 17.5l144.1 135.1c4.9 4.6 12.5 4.4 17-.5zm327.2.6l144.1-135.1c5.1-4.7 5.1-12.8 0-17.5L492.1 112.1c-4.8-4.5-12.4-4.3-17 .5L431.6 159c-4.6 4.9-4.3 12.7.8 17.2L523 256l-90.6 79.7c-5.1 4.5-5.5 12.3-.8 17.2l43.5 46.4c4.5 4.9 12.1 5.1 17 .6z"/></svg>
                        </button>
                        <button class="swo-control-button swo-toggle-console-btn" title="Toggle Console">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--!Font Awesome Free v5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M257.981 272.971L63.638 467.314c-9.373 9.373-24.569 9.373-33.941 0L7.029 444.647c-9.357-9.357-9.375-24.522-.04-33.901L161.011 256 6.99 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L257.981 239.03c9.373 9.372 9.373 24.568 0 33.941zM640 456v-32c0-13.255-10.745-24-24-24H312c-13.255 0-24 10.745-24 24v32c0 13.255 10.745 24 24 24h304c13.255 0 24-10.745 24-24z"/></svg>
                        </button>
                        <button class="swo-control-button swo-open-new-tab" title="Open in New Tab">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free v6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M349.4 44.6c5.9-13.7 1.5-29.7-10.6-38.5s-28.6-8-39.9 1.8l-256 224c-10 8.8-13.6 22.9-8.9 35.3S50.7 288 64 288l111.5 0L98.6 467.4c-5.9 13.7-1.5 29.7 10.6 38.5s28.6 8 39.9-1.8l256-224c10-8.8 13.6-22.9 8.9-35.3s-16.6-20.7-30-20.7l-111.5 0L349.4 44.6z"/></svg>
                        </button>
                    </div>
                </section>
            </div>
        `;
    }

    _cacheElements() {
        const el = this.elements;
        const T = this.targetElement; // Scope queries to the instance's target element
        el.editorPane = T.querySelector('.swo-editor-pane');
        el.codeEditorContainer = T.querySelector('.swo-code-editor-container');
        el.codePrettierBtn = T.querySelector('.swo-code-prettier-btn');
        el.resizeHandle = T.querySelector('.swo-resize-handle');
        
        el.rightPane = T.querySelector('.swo-right-pane');
        el.previewPaneContainer = T.querySelector('.swo-preview-pane-container');
        el.previewDevicesContainer = T.querySelector('.swo-preview-devices-container');
        el.previewFrame = T.querySelector('.swo-preview-frame');
        
        el.resizeHandleConsole = T.querySelector('.swo-resize-handle-console');
        el.consoleContainer = T.querySelector('.swo-console-container');
        el.consoleOutput = T.querySelector('.swo-console-output');
        el.clearConsoleBtn = T.querySelector('.swo-clear-console-btn');
        el.previewFrameCover = T.querySelector('.swo-preview-frame-cover-resizeable');

        el.toggleCodeEditorBtn = T.querySelector('.swo-toggle-code-editor-btn');
        el.toggleConsoleBtn = T.querySelector('.swo-toggle-console-btn');
        
        // Control Buttons
        el.resizeDesktopBtn = T.querySelector('.swo-resize-desktop');
        el.resizeTabletBtn = T.querySelector('.swo-resize-tablet');
        el.resizeMobileBtn = T.querySelector('.swo-resize-mobile');
        el.refreshPreviewBtn = T.querySelector('.swo-refresh-preview');
        el.openNewTabBtn = T.querySelector('.swo-open-new-tab');

        // Collections for toggling
        el.codeEditorUIElements = T.querySelectorAll('.swo-editor-pane, .swo-resize-handle'); // Classes used to identify parts of editor UI
        el.consoleUIElements = T.querySelectorAll('.swo-console-container, .swo-resize-handle-console'); // Classes for console UI parts
    }

    _initMonaco() {
        if (typeof monaco === 'undefined') {
            console.error('SWO: Monaco Editor not found. Please include Monaco Editor.');
            this.elements.codeEditorContainer.innerHTML = '<div style="padding: 20px; color: #fff; background: #1e1e1e;">Monaco Editor not loaded. Please include it.</div>';
            return;
        }

        this.monacoEditor = monaco.editor.create(this.elements.codeEditorContainer, {
            value: this.options.code || this._getDefaultInitialCode(),
            language: 'html',
            theme: 'vs-dark',
            automaticLayout: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: 'on',
            fontSize: 14,
            lineHeight: 1.5,
        });

        let debounceTimeout;
        this.monacoEditor.onDidChangeModelContent(() => {
            this._saveCode(this.monacoEditor.getValue());
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(() => this.updatePreview(), 300);
        });
    }

    _initEventListeners() {
        const el = this.elements;

        // Prettier
        if (el.codePrettierBtn) {
            if (typeof html_beautify === 'function') {
                el.codePrettierBtn.addEventListener('click', () => this.formatCode());
            } else {
                el.codePrettierBtn.disabled = true;
                el.codePrettierBtn.title = "Formatting library (js-beautify) not loaded";
                console.warn('SWO: html_beautify function not found. The "Prettier" button will be disabled.');
            }
        }
        
        // Pane Resizing
        el.resizeHandle.addEventListener('mousedown', this._onPaneResizeMouseDown.bind(this));
        el.resizeHandle.addEventListener('dblclick', this._onPaneResizeDoubleClick.bind(this));
        el.resizeHandleConsole.addEventListener('mousedown', this._onConsoleResizeMouseDown.bind(this));
        
        // Console
        el.clearConsoleBtn.addEventListener('click', () => this._clearConsoleOutput(true));

        // Control Panel Buttons
        el.resizeDesktopBtn.addEventListener('click', () => this.resizePreviewDevice('100%', '100%'));
        el.resizeTabletBtn.addEventListener('click', () => this.resizePreviewDevice('1070px', '100%')); // Max width 1070px, height dynamic
        el.resizeMobileBtn.addEventListener('click', () => this.resizePreviewDevice('390px', '844px'));
        
        el.refreshPreviewBtn.addEventListener('click', () => this.updatePreview());
        el.openNewTabBtn.addEventListener('click', () => this.openPreviewInNewTab());

        el.toggleCodeEditorBtn.addEventListener('click', () => this.toggleCodeEditor());
        el.toggleConsoleBtn.addEventListener('click', () => this.toggleConsole());

        // Listen for messages from iframe (console bridge)
        window.addEventListener('message', this._handleIframeMessage.bind(this));
    }

    _initialLayout() {
        // Default: editor takes 50% width, console hidden
        this.elements.editorPane.style.width = 'calc(50% - 0.25rem)'; // 0.25rem is half of resize handle width

        // Hide console initially
        this.elements.consoleUIElements.forEach(element => element.classList.add('swo-hidden'));
        this._updateButtonActiveState(this.elements.toggleConsoleBtn, false);
        this.elements.previewPaneContainer.style.height = `${this.elements.rightPane.offsetHeight}px`;

        this._updateButtonActiveState(this.elements.toggleCodeEditorBtn, true); // Editor visible by default
    }

    _loadCode() {
        const savedCode = localStorage.getItem(this.options.storageKey);
        const codeToLoad = this.options.code !== null ? this.options.code : savedCode;
        if (this.monacoEditor) {
            this.monacoEditor.setValue(codeToLoad || this._getDefaultInitialCode());
        }
    }

    _saveCode(code) {
        localStorage.setItem(this.options.storageKey, code);
    }

    _getIframeConsoleBridgeScript() {
        return `
<script id="iframe-console-bridge">
(function() {
    'use strict';
    if (window.parent === window) return; // Don't run if not in an iframe or if it's top window

    const originalConsole = {};
    const methods = ['log', 'error', 'warn', 'info', 'debug', 'clear'];
    methods.forEach(method => {
        originalConsole[method] = console[method] ? console[method].bind(console) : () => {};
    });

    function formatArgsForPostMessage(args) {
        return Array.from(args).map(arg => {
            if (arg instanceof Error) return \`Error: \${arg.message}\${arg.stack ? \`\\nStack: \${arg.stack}\` : ''}\`;
            if (arg instanceof HTMLElement) {
                let attrs = Array.from(arg.attributes).map(attr => \`\${attr.name}="\${attr.value}"\`).join(' ');
                return \`<\${arg.tagName.toLowerCase()}\${attrs ? ' ' + attrs : ''}>...\`;
            }
            if (typeof arg === 'function') return '[Function]';
            if (typeof arg === 'symbol') return arg.toString();
            // Basic object serialization, trying to catch circular refs
            if (typeof arg === 'object' && arg !== null) {
                try {
                    const cache = new Set();
                    return JSON.stringify(arg, (key, value) => {
                        if (typeof value === 'object' && value !== null) {
                            if (cache.has(value)) return '[Circular Reference]';
                            cache.add(value);
                        }
                        if (value instanceof HTMLElement) return \`<\${value.tagName.toLowerCase()}> (embedded HTML Element)\`;
                        return value;
                    }, 2);
                } catch (e) { return '[Unserializable Object]'; }
            }
            return String(arg);
        });
    }

    methods.forEach(methodName => {
        if (methodName === 'clear') {
            console.clear = function() {
                originalConsole.clear();
                try { window.parent.postMessage({ type: 'iframe-console', method: 'clear' }, '*'); }
                catch(e) { originalConsole.error('SWO Console bridge error (clear):', e); }
            };
        } else {
            console[methodName] = function(...args) {
                originalConsole[methodName](...args);
                try { window.parent.postMessage({ type: 'iframe-console', method: methodName, args: formatArgsForPostMessage(args) }, '*'); }
                catch(e) { originalConsole.error('SWO Console bridge error ('+methodName+'):', e); }
            };
        }
    });

    window.addEventListener('error', function(event) {
        const errorArgs = [\`Unhandled error: \${event.message}\`, \`at \${event.filename || 'unknown'}:\${event.lineno || 0}:\${event.colno || 0}\`];
        originalConsole.error(...errorArgs);
        try { window.parent.postMessage({ type: 'iframe-console', method: 'error', args: errorArgs }, '*'); }
        catch(e) { originalConsole.error('SWO Console bridge error (onerror):', e); }
    });

    window.addEventListener('unhandledrejection', function(event) {
        const reason = event.reason instanceof Error ? \`\${event.reason.message}\\n\${event.reason.stack}\` : String(event.reason);
        const rejectionArgs = ['Unhandled promise rejection:', reason];
        originalConsole.warn(...rejectionArgs);
        try { window.parent.postMessage({ type: 'iframe-console', method: 'warn', args: rejectionArgs }, '*'); }
        catch(e) { originalConsole.error('SWO Console bridge error (unhandledrejection):', e); }
    });
    
    // Notify parent that bridge is ready
    setTimeout(() => {
        try { 
            window.parent.postMessage({ type: 'iframe-ready' }, '*');
            originalConsole.log("SWO Console bridge initialized in iframe.");
        } catch(e) { originalConsole.error('SWO Console bridge error (ready):', e); }
    }, 0);
})();
<\/script>
`;
    }

    updatePreview() {
        if (!this.elements.previewFrame) return;
        const userCode = this.monacoEditor ? this.monacoEditor.getValue() : '';
        const fullCode = this._getIframeConsoleBridgeScript() + userCode;
        // Use srcdoc for better security and handling relative paths within the iframe (though base tag might be needed for that)
        // However, srcdoc can have issues with complex scripts or iframes being re-used.
        // data: URL is more robust for frequent updates.
        this.elements.previewFrame.src = 'data:text/html;charset=utf-8,' + encodeURIComponent(fullCode);
    }

    openPreviewInNewTab() {
        const userCode = this.monacoEditor ? this.monacoEditor.getValue() : '';
        const fullCode = this._getIframeConsoleBridgeScript() + userCode;
        const blob = new Blob([fullCode], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const newTab = window.open(url, '_blank');
        
        // Revoke object URL after a delay to allow the new tab to load
        setTimeout(() => { URL.revokeObjectURL(url); }, 5000); 

        if (!newTab) {
            URL.revokeObjectURL(url); // Clean up immediately if blocked
            alert('Popup blocked! Please allow popups for this site to open the preview in a new tab.');
        }
    }

    addCrossOriginToAssets(htmlString) {
        if (typeof htmlString !== 'string') {
            console.error("Input must be an HTML string.");
            return htmlString;
        }

        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlString, 'text/html');

            const assetSelectors = [
                'img',                         // Standard images
                'audio',                       // Standard audio
                'video',                       // Standard video
                'a-asset-item',                // A-Frame generic asset item
            ];

            doc.querySelectorAll(assetSelectors.join(', ')).forEach(element => {
                if (element.hasAttribute('src')) {
                    element.setAttribute('crossorigin', 'anonymous');
                }
            });

            return new XMLSerializer().serializeToString(doc);

        } catch (error) {
            console.error("Error processing HTML string to add crossorigin:", error);
            return htmlString; // Return original string in case of error
        }
    }

    resizePreviewDevice(width, height) {
        if (this.elements.previewDevicesContainer) {
            this.elements.previewDevicesContainer.style.maxWidth = width;
            this.elements.previewDevicesContainer.style.height = height;
            // If specific width (not 100%), center it. Else, let it fill.
            this.elements.previewDevicesContainer.style.margin = (width !== '100%') ? 'auto' : '';
        }
    }

    toggleConsole() {
        const el = this.elements;
        const consoleIsCurrentlyVisible = !el.consoleContainer.classList.contains('swo-hidden');
        
        el.consoleUIElements.forEach(element => {
            element.classList.toggle('swo-hidden', consoleIsCurrentlyVisible);
        });

        const isConsoleVisibleAfterToggle = !consoleIsCurrentlyVisible;
        this._updateButtonActiveState(el.toggleConsoleBtn, isConsoleVisibleAfterToggle);
        
        const rightPaneHeight = el.rightPane.offsetHeight;
        const resizeHandleConsoleHeight = el.resizeHandleConsole.offsetHeight;

        if (isConsoleVisibleAfterToggle) {
            // Show console: make preview 66%, console 34% (approx)
            el.previewPaneContainer.style.height = `${(rightPaneHeight - resizeHandleConsoleHeight) * 0.66}px`;
            el.consoleContainer.style.height = `${(rightPaneHeight - resizeHandleConsoleHeight) * 0.34}px`;
        } else {
            // Hide console: preview takes full height
            el.previewPaneContainer.style.height = `${rightPaneHeight}px`;
        }
    }

    toggleCodeEditor() {
        const el = this.elements;
        let isEditorVisibleAfterToggle = false;
        el.codeEditorUIElements.forEach(element => {
            const isCurrentlyHidden = element.classList.contains('swo-hidden');
            element.classList.toggle('swo-hidden', !isCurrentlyHidden);
            if (element === el.editorPane && isCurrentlyHidden) { // If editorPane was hidden and now shown
                isEditorVisibleAfterToggle = true;
            } else if (element === el.editorPane && !isCurrentlyHidden) { // If editorPane was visible and now hidden
                isEditorVisibleAfterToggle = false;
            }
        });
        this._updateButtonActiveState(el.toggleCodeEditorBtn, isEditorVisibleAfterToggle);
    }

    formatCode() {
        if (typeof html_beautify === 'function' && this.monacoEditor) {
            const currentCode = this.monacoEditor.getValue();
            const options = {
                wrap_line_length: 120,
                indent_size: 2,
                indent_char: ' ',
            };
            try {
                const formattedCode = html_beautify(currentCode, options);
                this.monacoEditor.setValue(formattedCode);
            } catch (e) {
                console.error("SWO: Error during code formatting with js-beautify:", e);
                alert("Could not format the code. Check console for errors.");
            }
        }
    }

    _handleIframeMessage(event) {
        // Basic security: check origin if possible, and ensure it's from our iframe.
        // For data: URI, event.source is the window object of the iframe.
        if (event.source !== this.elements.previewFrame.contentWindow || !event.data) return;

        const data = event.data;
        if (data.type === 'iframe-console') {
            const messageLine = document.createElement('div');
            messageLine.classList.add('swo-console-message-line');
            
            let methodClass = 'swo-console-log', methodIcon = '➡️'; // Default for log
            switch (data.method) {
                case 'error': methodClass = 'swo-console-error'; methodIcon = '❌'; break;
                case 'warn':  methodClass = 'swo-console-warn';  methodIcon = '⚠️'; break;
                case 'info':  methodClass = 'swo-console-info';  methodIcon = 'ℹ️'; break;
                case 'debug': methodClass = 'swo-console-debug'; methodIcon = '🐞'; break;
                case 'clear':
                    this._clearConsoleOutput(false); // false = cleared by iframe
                    this._logSpecialMessageToConsole('Console cleared by iframe.', 'swo-console-cleared');
                    return;
            }
            messageLine.classList.add(methodClass);

            const iconSpan = document.createElement('span');
            iconSpan.className = 'swo-console-message-icon'; 
            iconSpan.textContent = methodIcon;
            messageLine.appendChild(iconSpan);

            const contentWrapper = document.createElement('div');
            contentWrapper.className = 'swo-console-message-content-wrapper';
            
            if (data.args && data.args.length > 0) {
                const messageContent = document.createElement('pre');
                messageContent.className = 'swo-console-message-content';
                messageContent.textContent = data.args.join(' ');
                contentWrapper.appendChild(messageContent);
            } else {
                const emptyMsg = document.createElement('span');
                emptyMsg.textContent = (data.method === 'log') ? '(empty log)' : `(${data.method} with no arguments)`;
                emptyMsg.style.opacity = '0.7';
                emptyMsg.style.fontStyle = 'italic';
                contentWrapper.appendChild(emptyMsg);
            }
            messageLine.appendChild(contentWrapper);
            this.elements.consoleOutput.appendChild(messageLine);
            this.elements.consoleOutput.scrollTop = this.elements.consoleOutput.scrollHeight;
        } else if (data.type === 'iframe-ready') {
            this._logSpecialMessageToConsole('Console connected.', 'swo-console-connected');
        }
    }
    
    _clearConsoleOutput(byEditor) {
        this.elements.consoleOutput.innerHTML = '';
        if (byEditor) {
            this._logSpecialMessageToConsole('Console cleared by editor.', 'swo-console-cleared');
        }
    }

    _logSpecialMessageToConsole(text, className) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `swo-console-special-message ${className}`;
        msgDiv.textContent = text;
        this.elements.consoleOutput.appendChild(msgDiv);
        this.elements.consoleOutput.scrollTop = this.elements.consoleOutput.scrollHeight;
    }
    
    _updateButtonActiveState(button, isActive) {
        if (!button) return;
        if (isActive) {
            button.classList.add('swo-active');
        } else {
            button.classList.remove('swo-active');
        }
    }

    // Pane Resizing Logic
    _onPaneResizeMouseDown(e) {
        e.preventDefault();
        this.isResizingPanes = true;
        this._initialMouseX = e.clientX;
        this._initialEditorWidth = this.elements.editorPane.offsetWidth;
        this.elements.previewFrameCover.classList.remove('swo-hidden'); // Show cover
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';

        this._boundHandlePaneMouseMove = this._handlePaneMouseMove.bind(this);
        this._boundHandlePaneMouseUp = this._handlePaneMouseUp.bind(this);

        document.addEventListener('mousemove', this._boundHandlePaneMouseMove);
        document.addEventListener('mouseup', this._boundHandlePaneMouseUp);
    }
    _handlePaneMouseMove(e) {
        if (!this.isResizingPanes) return;
        const deltaX = e.clientX - this._initialMouseX;
        let newEditorWidth = this._initialEditorWidth + deltaX;
        
        const totalWidth = this.elements.editorPane.parentElement.offsetWidth;
        const handleWidth = this.elements.resizeHandle.offsetWidth;
        const minPixelWidth = Math.max(100, totalWidth * 0.15); // Min 15% or 100px

        newEditorWidth = Math.max(minPixelWidth, Math.min(newEditorWidth, totalWidth - minPixelWidth - handleWidth));
        this.elements.editorPane.style.width = `${newEditorWidth}px`;
    }
    _handlePaneMouseUp() {
        if (!this.isResizingPanes) return;
        this.isResizingPanes = false;
        this.elements.previewFrameCover.classList.add('swo-hidden'); // Hide cover
        document.body.style.cursor = 'default';
        document.body.style.userSelect = '';
        document.removeEventListener('mousemove', this._boundHandlePaneMouseMove);
        document.removeEventListener('mouseup', this._boundHandlePaneMouseUp);
    }

    _onPaneResizeDoubleClick() {
        // Reset editor pane to default width (50%)
        this.elements.editorPane.style.width = 'calc(50% - 0.25rem)'; // 0.25rem is half of resize handle width
    }

    // Console Resizing Logic
    _onConsoleResizeMouseDown(e) {
        e.preventDefault();
        this.isResizingConsole = true;
        this._initialMouseYConsole = e.clientY;
        this._initialPreviewHeight = this.elements.previewPaneContainer.offsetHeight;
        this.elements.previewFrameCover.classList.remove('swo-hidden');
        document.body.style.cursor = 'row-resize';
        document.body.style.userSelect = 'none';

        this._boundHandleConsoleResizeMouseMove = this._handleConsoleResizeMouseMove.bind(this);
        this._boundHandleConsoleResizeMouseUp = this._handleConsoleResizeMouseUp.bind(this);

        document.addEventListener('mousemove', this._boundHandleConsoleResizeMouseMove);
        document.addEventListener('mouseup', this._boundHandleConsoleResizeMouseUp);
    }
    _handleConsoleResizeMouseMove(e) {
        if (!this.isResizingConsole) return;
        const deltaY = e.clientY - this._initialMouseYConsole;
        let newPreviewHeight = this._initialPreviewHeight + deltaY;

        const totalHeight = this.elements.rightPane.offsetHeight;
        const handleHeight = this.elements.resizeHandleConsole.offsetHeight;
        const minPaneHeight = Math.max(50, totalHeight * 0.10); // Min 10% or 50px

        newPreviewHeight = Math.max(minPaneHeight, Math.min(newPreviewHeight, totalHeight - minPaneHeight - handleHeight));
        const newConsoleHeight = totalHeight - newPreviewHeight - handleHeight;

        this.elements.previewPaneContainer.style.height = `${newPreviewHeight}px`;
        this.elements.consoleContainer.style.height = `${newConsoleHeight}px`;
    }
    _handleConsoleResizeMouseUp() {
        if (!this.isResizingConsole) return;
        this.isResizingConsole = false;
        this.elements.previewFrameCover.classList.add('swo-hidden');
        document.body.style.cursor = 'default';
        document.body.style.userSelect = '';
        document.removeEventListener('mousemove', this._boundHandleConsoleResizeMouseMove);
        document.removeEventListener('mouseup', this._boundHandleConsoleResizeMouseUp);
    }

    _getDefaultInitialCode() {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Live Preview</title>
    <style>
        body { font-family: sans-serif; background-color: #f0f0f0; color: #333; padding: 20px; margin: 0; }
        h1 { color: steelblue; }
        button { background-color: steelblue; color: white; padding: 10px 15px; border: none; border-radius: 5px; cursor: pointer; margin-top: 10px; }
        button:hover { background-color: darkslateblue; }
        .output { margin-top: 10px; padding: 10px; border: 1px solid #ccc; background-color: #fff; min-height: 20px; }
        .note { font-size: 0.9em; color: #555; margin-top:15px; }
    </style>
</head>
<body>
    <h1>Hello SenangWebs One!</h1>
    <p>This is a live preview. Edit the code on the left. Check the console for messages.</p>
    <button id="testBtn">Log Message</button>
    <button id="errorBtn">Log Error</button>
    <div id="outputDiv" class="output"></div>
    <p class="note">Open your browser's developer console to see original logs too.</p>
    <script>
        console.log("Iframe script loaded!", { a: 1, b: "text" });
        console.warn("This is a warning from iframe.");
        const testBtn = document.getElementById('testBtn');
        const errorBtn = document.getElementById('errorBtn');
        const outputDiv = document.getElementById('outputDiv');
        let clickCount = 0;
        if (testBtn) {
            testBtn.addEventListener('click', () => {
                clickCount++;
                const complexObject = { id: clickCount, timestamp: new Date(), nested: { data: [1,2,3] } };
                console.log("Button clicked:", clickCount, "times.", complexObject);
                if(outputDiv) outputDiv.textContent = "Logged to SWO console. Click: " + clickCount;
            });
        }
        if (errorBtn) {
            errorBtn.addEventListener('click', () => {
                console.error("This is a test error!", new Error("Something went wrong in iframe"));
            });
        }
        // Test unhandled error
        // setTimeout(() => { throw new Error("Test unhandled error from iframe"); }, 2000);
        // Test unhandled promise rejection
        // Promise.reject("Test unhandled promise rejection from iframe");
    <\/script>
</body>
</html>`;
    }

    // Public method to destroy the instance and clean up
    destroy() {
        // Remove event listeners
        window.removeEventListener('message', this._handleIframeMessage.bind(this));
        // Monaco Editor instance cleanup
        if (this.monacoEditor) {
            this.monacoEditor.dispose();
        }
        // Clear HTML
        this.targetElement.innerHTML = '';
        this.targetElement.classList.remove('swo-container');
        // Nullify references
        this.elements = {};
        this.monacoEditor = null;
        // Potentially remove from global/auto-init list if tracked
        delete this.targetElement.swoInstance; 
    }
}

// Auto-initialize for data-swo attribute
// Ensures SWO is available globally for script tag usage after bundle loads
function initializeSWO() {
    document.querySelectorAll('[data-swo]').forEach(el => {
        if (!el.swoInstance) { // Prevent double initialization
            el.swoInstance = new SWO(el, {}); // Pass element directly and empty options (will read from data-attributes)
        }
    });
}

if (typeof window !== 'undefined') {
    // Auto-init if DOM is already loaded, or defer
    if (document.readyState === 'complete' || (document.readyState !== 'loading' && !document.documentElement.doScroll)) {
        initializeSWO();
    } else {
        document.addEventListener('DOMContentLoaded', initializeSWO);
    }
}

export default SWO;