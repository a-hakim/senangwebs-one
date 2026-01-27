
import { ConsoleBridge } from "./ConsoleBridge";

export interface PreviewManagerOptions {
    getConsoleScript: () => string;
}

export class PreviewManager {
    private previewFrame: HTMLIFrameElement | null = null;
    private previewDevicesContainer: HTMLElement | null = null;
    
    private _currentPreviewUrl: string | null = null;
    private options: PreviewManagerOptions;

    constructor(options: PreviewManagerOptions) {
        this.options = options;
    }

    setElements(frame: HTMLIFrameElement, devicesContainer: HTMLElement) {
        this.previewFrame = frame;
        this.previewDevicesContainer = devicesContainer;
    }

    update(userCode: string) {
        if (!this.previewFrame) return;

        // Cleanup previous URL
        if (this._currentPreviewUrl) {
            URL.revokeObjectURL(this._currentPreviewUrl);
            this._currentPreviewUrl = null;
        }

        // Base Tag Injection (Pre-processing)
        // This allows relative paths (e.g., ./img.png) to resolve against the current hosting page/base.
        const baseUrl = window.location.origin + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
        const baseTag = `<base href="${baseUrl}">`;
        
        // Simple injection logic: try to put it in head, otherwise prepend
        let fullCode = "";
        if (userCode.includes("<head>")) {
            fullCode = userCode.replace("<head>", `<head>\n${baseTag}`);
        } else if (userCode.includes("<html>")) {
             fullCode = userCode.replace("<html>", `<html><head>${baseTag}</head>`);
        } else {
             fullCode = `${baseTag}\n${userCode}`;
        }

        fullCode = this.options.getConsoleScript() + fullCode;

        const blob = new Blob([fullCode], { type: "text/html" });
        this._currentPreviewUrl = URL.createObjectURL(blob);
        this.previewFrame.src = this._currentPreviewUrl;
    }

    openNewTab(userCode: string) {
        const fullCode = this.options.getConsoleScript() + userCode;
        const blob = new Blob([fullCode], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const newTab = window.open(url, "_blank");
    
        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 5000);
    
        if (!newTab) {
          URL.revokeObjectURL(url); 
          alert("Popup blocked! Please allow popups for this site to open the preview in a new tab.");
        }
    }

    resizeDevice(width: string, height: string) {
        if (this.previewDevicesContainer) {
            this.previewDevicesContainer.style.maxWidth = width;
            this.previewDevicesContainer.style.height = height;
            this.previewDevicesContainer.style.margin = width !== "100%" ? "auto" : "";
        }
    }

    // SW Message handling removed


    destroy() {
        if (this._currentPreviewUrl) {
            URL.revokeObjectURL(this._currentPreviewUrl);
            this._currentPreviewUrl = null;
        }
    }
}
