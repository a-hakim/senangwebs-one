import "../css/swo.css"; // Import CSS to be processed by Webpack
import "@bookklik/senangstart-icons/dist/senangstart-icon.min.js";

import { UIManager, SWOElements } from "./modules/UIManager";
import { EditorManager } from "./modules/EditorManager";
import { PreviewManager } from "./modules/PreviewManager";
import { ConsoleBridge } from "./modules/ConsoleBridge";

export interface SWOOptions {
  code?: string | null;
  storageKey?: string;
}

// Augment HTMLElement to include swoInstance
declare global {
  interface HTMLElement {
    swoInstance?: SWO;
  }
}

class SWO {
  targetElement: HTMLElement;
  options: SWOOptions;
  
  ui: UIManager;
  editor: EditorManager;
  preview: PreviewManager;
  consoleBridge: ConsoleBridge;

  constructor(targetOrOptions?: string | HTMLElement | SWOOptions, optionsIfTarget?: SWOOptions) {
    let targetElement: HTMLElement | null = null;
    let mergedOptions: SWOOptions;

    if (
      typeof targetOrOptions === "string" ||
      targetOrOptions instanceof HTMLElement
    ) {
      targetElement =
        typeof targetOrOptions === "string"
          ? document.querySelector(targetOrOptions)
          : targetOrOptions;
      mergedOptions = optionsIfTarget || {};
    } else {
      mergedOptions = targetOrOptions || {};
      targetElement = document.querySelector("[data-swo]"); // Default target
    }

    if (!targetElement) {
      console.error(
        "SWO: Target element not found. Please provide a valid selector, DOM element, or ensure a [data-swo] element exists."
      );
      throw new Error("Target element not found");
    }
    this.targetElement = targetElement;
    this.targetElement.classList.add("swo-container"); // Add base class for scoping

    const instanceId = `swo-instance-${Math.random().toString(36).substring(2, 9)}`;
    
    // Validate and set options with proper type checking
    const codeOption = typeof mergedOptions.code === 'string' ? mergedOptions.code :
      (this.targetElement.dataset.swoCode || null);
    
    this.options = {
      code: codeOption,
      storageKey:
        mergedOptions.storageKey ||
        this.targetElement.dataset.swoStorageKey ||
        `senangwebs-one-editor-content-${instanceId}`,
    };

    // Initialize Modules
    this.ui = new UIManager(this.targetElement);
    this.consoleBridge = new ConsoleBridge();
    
    // Create UI first to generate elements
    this.ui.createUI();

    // Wiring up dependencies
    if (this.ui.elements.consoleOutput) {
        this.consoleBridge.setConsoleOutputElement(this.ui.elements.consoleOutput);
    }


    this.preview = new PreviewManager({
        getConsoleScript: () => this.consoleBridge.getIframeScript()
    });

    if (this.ui.elements.previewFrame && this.ui.elements.previewDevicesContainer) {
        this.preview.setElements(this.ui.elements.previewFrame, this.ui.elements.previewDevicesContainer);
    }

    this.editor = new EditorManager({
        code: this.options.code,
        storageKey: this.options.storageKey,
        container: this.ui.elements.codeEditorContainer!,
        onUpdate: (code) => {
            this.updatePreview();
        }
    });

    this._initSteps();
  }

  _initSteps() {
      // Init CodeMirror
      this.editor.init();
      
      // Init Event Listeners (Wiring)
      this._initEventListeners();

      // Initial Layout
      this.ui.initialLayout();

      // Load Code (Trigger initial preview update)
      const initialCode = this.editor.loadCode();
      this.updatePreview(initialCode); // Force initial update
  }

  updatePreview(code?: string) {
      this.preview.update(code || this.editor.getCode());
  }

  _initEventListeners() {
    const el = this.ui.elements;

    // Prettier
    if (el.codePrettierBtn) {
      el.codePrettierBtn.addEventListener("click", () => this.editor.formatCode());
    }

    // Console
    if (el.clearConsoleBtn) {
        el.clearConsoleBtn.addEventListener("click", () =>
            this.consoleBridge.clear(true)
        );
    }

    // Control Panel Buttons
    if (el.resizeDesktopBtn) el.resizeDesktopBtn.addEventListener("click", () => this.preview.resizeDevice("100%", "100%"));
    if (el.resizeTabletBtn) el.resizeTabletBtn.addEventListener("click", () => this.preview.resizeDevice("1070px", "100%"));
    if (el.resizeMobileBtn) el.resizeMobileBtn.addEventListener("click", () => this.preview.resizeDevice("390px", "844px"));

    if (el.refreshPreviewBtn) el.refreshPreviewBtn.addEventListener("click", () => this.updatePreview());
    if (el.openNewTabBtn) el.openNewTabBtn.addEventListener("click", () => this.preview.openNewTab(this.editor.getCode()));

    if (el.toggleCodeEditorBtn) el.toggleCodeEditorBtn.addEventListener("click", () => this.ui.toggleCodeEditor());
    if (el.toggleConsoleBtn) el.toggleConsoleBtn.addEventListener("click", () => this.ui.toggleConsole());

    // Listen for messages from iframe (console bridge & SW)
    window.addEventListener("message", (event) => {
        // Handle Console Messages
        this.consoleBridge.handleMessage(event.data);
    });
  }

  // Public Methods Proxy
  formatCode() { this.editor.formatCode(); }
  destroy() { 
      this.editor.destroy(); 
      this.preview.destroy();
      // Clean up target
      this.targetElement.innerHTML = "";
      this.targetElement.classList.remove("swo-container");
      delete this.targetElement.swoInstance;
  }
}

// Auto-initialize
function initializeSWO() {
  document.querySelectorAll("[data-swo]").forEach((el) => {
    const htmlEl = el as HTMLElement;
    if (!htmlEl.swoInstance) {
      htmlEl.swoInstance = new SWO(htmlEl, {}); 
    }
  });
}

if (typeof window !== "undefined") {
  if (
    document.readyState === "complete" ||
    (document.readyState !== "loading")
  ) {
    initializeSWO();
  } else {
    document.addEventListener("DOMContentLoaded", initializeSWO);
  }
}

export default SWO;
