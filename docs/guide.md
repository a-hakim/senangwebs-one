# User Guide

## Installation

You can install SenangWebs One via npm or include it directly via a script tag.

### NPM

```bash
npm install senangwebs-one
```

### Script Tag

Include the built file from the `dist` folder:

```html
<script src="path/to/swo.js"></script>
```

## Initialization

There are two primary ways to initialize the editor.

### 1. Manual Initialization

Use the `SWO` class constructor.

```javascript
import SWO from 'senangwebs-one';

const editor = new SWO(document.getElementById('my-editor'), {
    code: '<div>Hello</div>',
    storageKey: 'unique-storage-key'
});
```

### 2. Auto Initialization

Add the `data-swo` attribute to your HTML element. The library automatically finds and initializes these elements when the DOM is ready.

```html
<div data-swo></div>
```

You can pass options via data attributes:
- `data-swo-code`: Initial code content.
- `data-swo-storage-key`: LocalStorage key for caching content.

## Configuration Options

| Option | Type | Default | Description |
|Page | Type | Default | Description |
|---|---|---|---|
| `code` | `string` | *Default Template* | The initial HTML code to display. |
| `storageKey` | `string` | *Random ID* | Key used to save/restore content from LocalStorage. |

## Key Bindings

Standard CodeMirror key bindings apply.
- `Ctrl-Space`: Trigger Autocomplete
- `Ctrl-F`: Search
- `Alt-Shift-F` (or similar): Format Code (via Prettier button)
