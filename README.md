# SenangWebs One (SWO)

SenangWebs One (SWO) is a versatile, embeddable web development environment that provides a live HTML/CSS/JS code editor, a real-time preview pane, and an integrated console. It's designed for quick prototyping, live demonstrations, and educational purposes, allowing users to see their code changes reflected instantly.

## Features

- **Live Code Editor:** Powered by CodeMirror for a rich editing experience (syntax highlighting, auto-completion, etc.).
- **Real-time Preview:** Instantly see changes to HTML, CSS, and JavaScript in an sandboxed iframe.
- **Integrated Console:** Captures `console.log`, `console.error`, etc., from the preview iframe and displays them within the SWO interface.
- **Responsive Device Toggles:** Quickly switch preview dimensions to simulate desktop, tablet, and mobile views.
- **Resizable Panes:** Adjust the layout by resizing the editor, preview, and console panes.
- **Code Formatting:** Built-in "Prettier" button using js-beautify for HTML.
- **Persistent Code:** Automatically saves code to `localStorage` for continuity across sessions.
- **Open in New Tab:** Preview your creation in a full browser tab.
- **Easy Integration:** Initialize via simple data attributes or JavaScript.
- **Customizable:** Pass initial code and storage keys via options.
- **Modern Look & Feel:** Styled with a clean, dark theme.

## Examples

[https://unpkg.com/senangwebs-one@latest/examples/index-auto-init.html](https://unpkg.com/senangwebs-one@latest/examples/index-auto-init.html)

[https://unpkg.com/senangwebs-one@latest/examples/index-js-init.html](https://unpkg.com/senangwebs-one@latest/examples/index-js-init.html)

## Dependencies

SWO relies on a few external libraries that you need to include separately (typically via CDN) for full functionality:

- **CodeMirror:** For the code editor.
  - `codemirror.min.js` & `codemirror.min.css`
  - Modes: `xml.min.js`, `javascript.min.js`, `css.min.js`, `htmlmixed.min.js`
  - Addons: `closetag.min.js`, `closebrackets.min.js`
  - Theme (e.g., `hopscotch.min.css`)
- **JS-Beautify:** For the "Prettier" code formatting button.
  - `beautify-html.min.js`
- **Font Awesome:** For icons used in the control panel.
  - `all.min.css`
- **Google Fonts (Outfit):** For the default font.

## Installation

There are a couple of ways to integrate SenangWebs One into your project:

### Using a CDN
For the quickest setup, you can include SenangWebs One's core CSS and JavaScript files directly from a CDN like unpkg. This is often the easiest way to get started.

```html
<link rel="stylesheet" href="https://unpkg.com/senangwebs-one@latest/dist/swo.css">
<script src="https://unpkg.com/senangwebs-one@latest/dist/swo.js"></script>
```

You will then include these links in your HTML page as shown in the "Include Files in Your HTML Page" section below.

### Setting Up with Local Files

If you prefer to host the files yourself, want to work offline, or need to build from source:

**1. Get SWO Files**

**Option A: Build from Source (Recommended for development)**

Clone the repository and build the `dist` files:
```bash
# Clone the repository (if you haven't already)
# git clone <repository-url>
# cd senangwebs-one

npm install
npm run build
```
This will generate `dist/swo.js` and `dist/swo.css`.

**Option B: Using Pre-built Files (If available)**

If pre-built `dist` files are provided with a release, you can download them directly. These are typically `swo.js` and `swo.css` found in a `dist` folder.

### 2. Include Files in Your HTML Page

Place the SWO CSS and JS files (either from the CDN links above or your local `dist` folder), along with its dependencies, in your HTML's `<head>` and `<body>` sections.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My SWO Project</title>

    <!-- SWO Library CSS -->
    <!-- Using CDN (recommended for quick start): -->
    <link rel="stylesheet" href="https://unpkg.com/senangwebs-one@latest/dist/swo.css">
    <!-- Or, if using local files: -->
    <!-- <link rel="stylesheet" href="path/to/your/dist/swo.css"> -->

    <!-- External Dependencies (Order might matter for some libraries) -->
    <!-- CodeMirror Core -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.15/codemirror.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.15/theme/hopscotch.min.css" /> 
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.15/codemirror.min.js"></script>
    <!-- CodeMirror Modes -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.15/mode/xml/xml.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.15/mode/javascript/javascript.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.15/mode/css/css.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.15/mode/htmlmixed/htmlmixed.min.js"></script>
    <!-- CodeMirror Addons -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.15/addon/edit/closetag.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.15/addon/edit/closebrackets.min.js"></script>
    
    <!-- JS-Beautify (for Prettier button) -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.14.11/beautify-html.min.js"></script>

    <!-- Font Awesome (for icons) -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <!-- Google Fonts (Outfit) -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap" rel="stylesheet" />

    <style>
        /* Ensure your target element has a defined height */
        html, body { height: 100%; margin: 0; overflow: hidden; }
        #my-swo-editor { height: 100vh; /* Or any specific height */ }
    </style>
</head>
<body>

    <div id="my-swo-editor">
        <!-- SWO will be initialized here -->
    </div>

    <!-- SWO Library JS (Load after dependencies and target element) -->
    <!-- Using CDN (recommended for quick start): -->
    <script src="https://unpkg.com/senangwebs-one@latest/dist/swo.js"></script>
    <!-- Or, if using local files: -->
    <!-- <script src="path/to/your/dist/swo.js"></script> -->
    <script>
        // Optional: JavaScript initialization (see Usage section)
    </script>
</body>
</html>
```

## Usage

SWO can be initialized in two ways:

### 1. Using Data Attributes (Auto-Initialization)

Simply add the `data-swo` attribute to a container element. SWO will automatically find and initialize itself on this element when the page loads.

```html
<div id="editor-container" data-swo 
     data-swo-storage-key="my-project-code" 
     style="height: 600px; border: 1px solid #ccc;">
    <!-- SWO will populate this -->
</div>
```

**Available Data Attributes:**

-   `data-swo`: (Required) Marks the container element for SWO initialization.
-   `data-swo-code`: (Optional) A string of HTML code to load initially. If not provided, default code is used.
    *Note: For complex initial code, JS initialization is recommended.*
-   `data-swo-storage-key`: (Optional) A custom key for `localStorage`. If not provided, a unique key is generated or a default is used.

### 2. Using JavaScript Initialization

For more control, you can initialize SWO programmatically. This is useful for dynamically creating instances or passing complex initial code.

```html
<div id="my-custom-editor" style="height: 100vh;"></div>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        if (typeof SWO !== 'undefined') {
            const customCode = `<!DOCTYPE html>
<html>
<head><title>My Awesome Page</title></head>
<body><h1>Hello from SWO!</h1><script>console.log("JS Init!");<\/script></body>
</html>`;

            new SWO('#my-custom-editor', { // Target element selector or DOM element
                code: customCode,
                storageKey: 'custom-editor-project-xyz'
            });
        } else {
            console.error("SWO library not loaded.");
        }
    });
</script>
```

**Constructor:**

`new SWO(targetElementOrSelector, options)`

-   `targetElementOrSelector`: A DOM element or a CSS selector string for the container where SWO will be rendered.
-   `options` (Object, Optional):
    -   `code` (String): Initial HTML code to load into the editor. Defaults to a basic HTML structure.
    -   `storageKey` (String): Custom key for `localStorage` to save and load editor content. Defaults to a unique generated key or `senangwebs-one-editor-content-v1` if no other key is found.

## Interface Overview

-   **Code Editor (Left Pane):** Write your HTML, CSS (inline `<style>` tags), and JavaScript (inline `<script>` tags).
    -   **Prettier Button:** Formats the HTML code in the editor.
-   **Resize Handle (Vertical):** Drag to resize the editor and preview/console panes.
-   **Right Pane:**
    -   **Preview Pane (Top of Right Pane):** Displays the live rendering of your code.
    -   **Resize Handle (Horizontal):** Appears when the console is visible. Drag to resize the preview and console areas.
    -   **Console (Bottom of Right Pane):**
        -   Displays messages (`log`, `warn`, `error`, `info`, `debug`) from your previewed code.
        -   **Clear Button:** Clears the SWO console output.
-   **Control Bar (Bottom):**
    -   **Device Toggles (Desktop, Tablet, Mobile icons):** Change the dimensions of the preview iframe.
    -   **Refresh Preview (Sync icon):** Manually re-renders the preview. (Auto-refresh on code change is default).
    -   **Toggle Code Editor (Code icon):** Show/hide the code editor pane.
    -   **Toggle Console (Terminal icon):** Show/hide the console pane.
    -   **Open in New Tab (Bolt icon):** Opens the current preview content in a new browser tab.

## Browser Support

SenangWebs One is designed to work on all modern desktop browsers that support its dependencies (CodeMirror, etc.):

-   Chrome
-   Firefox
-   Safari
-   Edge

## Contributing

Contributions, issues, and feature requests are welcome! Please feel free to:
-   Fork the repository and submit a Pull Request.
-   Open an issue for bugs or suggestions.

## License

This project is licensed under the MIT License - see the `LICENSE` file for details (assuming you will add one).

## Acknowledgments

-   Inspired by various online code playgrounds and editors.
-   Built with the help of amazing open-source libraries like CodeMirror and JS-Beautify.