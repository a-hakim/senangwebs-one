
export interface IframeMessageData {
    type: string;
    method?: string;
    args?: any[];
    requestId?: string;
    path?: string;
}

export class ConsoleBridge {
    private consoleOutput: HTMLElement | null = null;

    constructor() {}

    setConsoleOutputElement(element: HTMLElement) {
        this.consoleOutput = element;
    }

    getIframeScript(): string {
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

    handleMessage(data: IframeMessageData) {
        if (!this.consoleOutput) return;

        if (data.type === 'iframe-console') {
            const messageLine = document.createElement("div");
            messageLine.classList.add("swo-console-message-line");

            let methodClass = "swo-console-log",
                methodIcon = "➡️"; // Default for log
            
            if (data.method) {
                switch (data.method) {
                    case "error":
                    methodClass = "swo-console-error";
                    methodIcon = "❌";
                    break;
                    case "warn":
                    methodClass = "swo-console-warn";
                    methodIcon = "⚠️";
                    break;
                    case "info":
                    methodClass = "swo-console-info";
                    methodIcon = "ℹ️";
                    break;
                    case "debug":
                    methodClass = "swo-console-debug";
                    methodIcon = "🐞";
                    break;
                    case "clear":
                    this.clear(false); // false = cleared by iframe
                    this.logSpecialMessage(
                        "Console cleared by iframe.",
                        "swo-console-cleared"
                    );
                    return;
                }
            }
            messageLine.classList.add(methodClass);

            const iconSpan = document.createElement("span");
            iconSpan.className = "swo-console-message-icon";
            iconSpan.textContent = methodIcon;
            messageLine.appendChild(iconSpan);

            const contentWrapper = document.createElement("div");
            contentWrapper.className = "swo-console-message-content-wrapper";

            if (data.args && data.args.length > 0) {
                const messageContent = document.createElement("pre");
                messageContent.className = "swo-console-message-content";
                messageContent.textContent = data.args.join(" ");
                contentWrapper.appendChild(messageContent);
            } else {
                const emptyMsg = document.createElement("span");
                emptyMsg.textContent =
                data.method === "log"
                    ? "(empty log)"
                    : `(${data.method} with no arguments)`;
                emptyMsg.style.opacity = "0.7";
                emptyMsg.style.fontStyle = "italic";
                contentWrapper.appendChild(emptyMsg);
            }
            messageLine.appendChild(contentWrapper);
            
            this.consoleOutput.appendChild(messageLine);
            this.consoleOutput.scrollTop = this.consoleOutput.scrollHeight;
        } else if (data.type === "iframe-ready") {
            this.logSpecialMessage(
                "Console connected.",
                "swo-console-connected"
            );
        }
    }

    clear(byEditor: boolean) {
        if (!this.consoleOutput) return;
    
        this.consoleOutput.innerHTML = "";
        if (byEditor) {
          this.logSpecialMessage(
            "Console cleared by editor.",
            "swo-console-cleared"
          );
        }
    }

    logSpecialMessage(text: string, className: string) {
        if (!this.consoleOutput) return;
        const msgDiv = document.createElement("div");
        msgDiv.className = `swo-console-special-message ${className}`;
        msgDiv.textContent = text;
        this.consoleOutput.appendChild(msgDiv);
        this.consoleOutput.scrollTop = this.consoleOutput.scrollHeight;
    }
}
