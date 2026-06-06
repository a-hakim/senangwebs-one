---
name: senangwebs-one
description: Embeddable live HTML/CSS/JS code editor with CodeMirror, real-time preview in sandboxed iframe, and integrated console.
version: 2.0.4
package: senangwebs-one
---

# SenangWebs One (SWO)

## Quick Reference

- **Purpose**: Browser-based live coding playground with editor, preview, and console
- **Entry**: `dist/swo.js`
- **Dependencies**: `@babel/runtime`, `@bookklik/senangstart-icons`, `@codemirror/*` (6 packages), `@uiw/codemirror-theme-vscode`, `codemirror`, `js-beautify`
- **Scripts**: `npm run build`, `npm run dev`

## Workflow

Start in `C:\wamp64\www\sw-libraries\senangwebs-one`. Read `README.md`, `package.json`, and touched source files. Match existing patterns, CSS prefix `swo-`. **This uses sandboxed iframes - verify the preview pane renders and console captures output after changes.**

## HTML Data Attributes

| Attribute | Description |
|---|---|
| `data-swo` | Editor instance flag |
| `data-swo-code` | Initial code content |
| `data-swo-storage-key` | localStorage key for code persistence |

## JavaScript API

```js
const editor = new SWO(target, {
  code,
  storageKey
})

editor.updatePreview()         // force preview refresh (300ms debounce default)
editor.formatCode()            // format with js-beautify
editor.openPreviewInNewTab()   // open preview in separate window
editor.toggleCodeEditor()      // show/hide code editor pane
editor.toggleConsole()         // show/hide console pane
editor.resizePreviewDevice(width, height)
editor.destroy()               // cleanup
```

## Focus Areas

- CodeMirror 6 integration: HTML, CSS, JavaScript language support with syntax highlighting
- Preview iframe: sandboxed, srcdoc injection, 300ms debounced auto-refresh
- Console capture: intercept `console.log/warn/error/info`, `onerror`, unhandled rejections
- Responsive device toggles: desktop/tablet/mobile widths on preview pane
- Resizable split panes: editor | preview
- Code persistence: localStorage via `data-swo-storage-key`
- Multiple instances per page; window messages must be filtered by the owning preview iframe
- js-beautify integration for code formatting
- Error handling: show runtime errors in console pane, not as broken page

## Implementation Guidance

- Preserve backward compatibility for all constructor options, method names, and CSS classes
- Sandbox security: never allow preview code to access parent window
- Console capture: listen to all console methods and postMessage from iframe
- Lifecycle cleanup: remove global listeners in `destroy()` and keep instance consoles isolated
- Test with code that throws errors, infinite loops (should be isolated), and large payloads
- Update README when API changes; keep examples copy-pasteable

## Validation

```bash
npm run build
npm run dev      # for manual browser verification
```

For console or lifecycle changes, verify two instances on one page: logs must
stay in the owning instance, and a destroyed instance must stop receiving
window messages.
