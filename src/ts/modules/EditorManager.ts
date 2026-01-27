
import { html_beautify, HTMLBeautifyOptions } from "js-beautify";

// CodeMirror Imports
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, lineNumbers, highlightActiveLineGutter, highlightSpecialChars, drawSelection, dropCursor, rectangularSelection, crosshairCursor, highlightActiveLine, ViewUpdate } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { bracketMatching, indentOnInput, syntaxHighlighting, defaultHighlightStyle, foldGutter, foldKeymap } from "@codemirror/language";
import { closeBrackets, closeBracketsKeymap, autocompletion, completionKeymap } from "@codemirror/autocomplete";
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search";
import { lintKeymap } from "@codemirror/lint";

// Language Support
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { xml } from "@codemirror/lang-xml";

// Theme
import { vscodeDark } from "@uiw/codemirror-theme-vscode";

const basicSetup = [
  lineNumbers(),
  highlightActiveLineGutter(),
  highlightSpecialChars(),
  history(),
  foldGutter(),
  drawSelection(),
  dropCursor(),
  EditorState.allowMultipleSelections.of(true),
  indentOnInput(),
  syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
  bracketMatching(),
  closeBrackets(),
  autocompletion(),
  rectangularSelection(),
  crosshairCursor(),
  highlightActiveLine(),
  highlightSelectionMatches(),
  EditorView.lineWrapping,
  keymap.of([
    ...closeBracketsKeymap,
    ...defaultKeymap,
    ...searchKeymap,
    ...historyKeymap,
    ...foldKeymap,
    ...completionKeymap,
    ...lintKeymap
  ])
];

export interface EditorManagerOptions {
    code?: string | null;
    storageKey?: string;
    container: HTMLElement;
    onUpdate: (code: string) => void;
}

export class EditorManager {
    editorView: EditorView | null = null;
    options: EditorManagerOptions;

    constructor(options: EditorManagerOptions) {
        this.options = options;
    }

    init() {
        let debounceTimeout: ReturnType<typeof setTimeout>;
        const updateListener = EditorView.updateListener.of((update: ViewUpdate) => {
            if (update.docChanged) {
                const code = update.state.doc.toString();
                this._saveCode(code);
                clearTimeout(debounceTimeout);
                debounceTimeout = setTimeout(() => {
                    this.options.onUpdate(code);
                }, 300);
            }
        });

        const startState = EditorState.create({
            doc: this.options.code || this._getDefaultInitialCode(),
            extensions: [
                basicSetup,
                html({ autoCloseTags: true, matchClosingTags: true }), 
                css(),
                javascript(),
                xml(), 
                vscodeDark,
                updateListener
            ]
        });

        this.editorView = new EditorView({
            state: startState,
            parent: this.options.container
        });
    }

    getCode(): string {
        return this.editorView ? this.editorView.state.doc.toString() : "";
    }

    setCode(code: string) {
        if (this.editorView) {
            const transaction = this.editorView.state.update({
                changes: { from: 0, to: this.editorView.state.doc.length, insert: code }
            });
            this.editorView.dispatch(transaction);
        }
    }

    loadCode() {
        let savedCode: string | null = null;
        try {
            if (this.options.storageKey) {
                savedCode = localStorage.getItem(this.options.storageKey);
            }
        } catch (e: any) {
            console.warn("SWO: Unable to read from localStorage:", e.message);
        }
        const codeToLoad =
            this.options.code !== null && this.options.code !== undefined ? this.options.code : savedCode;
    
        const initialCode = codeToLoad || this._getDefaultInitialCode();
        this.setCode(initialCode);
        return initialCode;
    }

    _saveCode(code: string) {
        try {
            if (this.options.storageKey) {
                localStorage.setItem(this.options.storageKey, code);
            }
        } catch (e: any) {
            console.warn("SWO: Unable to save to localStorage:", e.message);
        }
    }

    formatCode() {
        if (!this.editorView) return;
    
        const currentCode = this.editorView.state.doc.toString();
        const options: HTMLBeautifyOptions = {
            wrap_line_length: 120,
            indent_size: 2,
            indent_char: " ",
        };
        try {
            const formattedCode = html_beautify(currentCode, options);
            const transaction = this.editorView.state.update({
                changes: { from: 0, to: this.editorView.state.doc.length, insert: formattedCode }
            });
            this.editorView.dispatch(transaction);
        } catch (e) {
            console.error("SWO: Error during code formatting with js-beautify:", e);
            alert("Could not format the code. Check console for errors.");
        }
    }

    destroy() {
        if (this.editorView) {
            this.editorView.destroy();
            this.editorView = null;
        }
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
    </script>
</body>
</html>`;
    }
}
