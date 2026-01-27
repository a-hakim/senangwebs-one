# API Reference

## Class: `SWO`

The main class for the SenangWebs One editor.

### Constructor

```typescript
new SWO(targetOrOptions: string | HTMLElement | SWOOptions, optionsIfTarget?: SWOOptions)
```

**Parameters:**

1.  `targetOrOptions`:
    *   **Type**: `string` (CSS Selector) | `HTMLElement` | `SWOOptions`
    *   **Description**: The DOM element to transform into an editor, or its CSS selector. If an object is passed, it is treated as `options` and the default selector `[data-swo]` is used.
2.  `optionsIfTarget` (Optional):
    *   **Type**: `SWOOptions`
    *   **Description**: Configuration object if the first argument was a target.

**Example:**

```javascript
// Target by ID
const editor = new SWO('#my-editor');

// Target by Element with Options
const el = document.getElementById('my-editor');
new SWO(el, { code: '...' });
```

### Methods

#### `destroy()`

Destroys the editor instance, removes the CodeMirror editor from the DOM, and cleans up event listeners.

```javascript
editor.destroy();
```

---

## Interfaces

### `SWOOptions`

Configuration object for the editor.

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `code` | `string` | `null` | The initial content of the editor. If not provided, checks `data-swo-code` or loads from localStorage. |
| `storageKey` | `string` | *Random* | The key used to persist editor content in `localStorage`. Defaults to a random string if not provided. |

---

## HTML Attributes (Auto-Init)

You can initialize the editor automatically by adding attributes to your HTML elements.

| Attribute | Description |
| :--- | :--- |
| `data-swo` | Marker attribute to trigger auto-initialization. |
| `data-swo-code` | Sets the initial code content. |
| `data-swo-storage-key` | Sets the `storageKey` option. |

**Example:**

```html
<div 
  data-swo 
  data-swo-code="<h1>Hi!</h1>" 
  data-swo-storage-key="my-app-editor">
</div>
```
