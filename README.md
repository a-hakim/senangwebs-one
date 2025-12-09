# SenangWebs One (SWO)

SenangWebs One (SWO) is a versatile, embeddable web development environment that provides a live HTML/CSS/JS code editor, a real-time preview pane, and an integrated console. It's designed for quick prototyping, live demonstrations, and educational purposes, allowing users to see their code changes reflected instantly.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE.md)
[![Built with Monaco Editor](https://img.shields.io/badge/Built%20with-Monaco%20Editor-0d6efd.svg)](https://microsoft.github.io/monaco-editor/)
[![Built with SenangStart Icons](https://img.shields.io/badge/Built%20with-SenangStart%20Icons-2563EB.svg)](https://github.com/bookklik-technologies/senangstart-icons)

![SenangWebs One Preview](https://raw.githubusercontent.com/a-hakim/senangwebs-one/master/swo_preview.png)

## Features

- **Live Code Editor:** Powered by Monaco Editor (VS Code's editor) for a rich editing experience with syntax highlighting, auto-completion, and modern editor features.
- **Real-time Preview:** Instantly see changes to HTML, CSS, and JavaScript in a sandboxed iframe with automatic refresh on code changes.
- **Integrated Console:** Captures `console.log`, `console.error`, `console.warn`, `console.info`, and `console.debug` from the preview iframe and displays them within the SWO interface.
- **Error Handling:** Automatically captures unhandled JavaScript errors and promise rejections from the preview.
- **Responsive Device Toggles:** Quickly switch preview dimensions to simulate desktop (100%), tablet (1070px), and mobile (390px × 844px) views.
- **Resizable Panes:** Adjust the layout by dragging resize handles between editor/preview and preview/console panes.
- **Code Formatting:** Built-in "Prettier" button using js-beautify for HTML formatting.
- **Persistent Code:** Automatically saves code to `localStorage` with customizable storage keys for continuity across sessions.
- **Toggle UI Elements:** Show/hide the code editor and console panes independently for flexible layouts.
- **Open in New Tab:** Preview your creation in a full browser tab with popup handling.
- **Easy Integration:** Initialize via simple data attributes or JavaScript constructor.
- **Multiple Instances:** Support for multiple SWO instances on the same page with unique identifiers.
- **Crossorigin Asset Support:** Automatic crossorigin attribute addition for media assets (images, audio, video).
- **Modern Look & Feel:** Styled with a clean, dark theme optimized for coding.

## Examples

1. [https://unpkg.com/senangwebs-one@latest/examples/index-auto-init.html](https://unpkg.com/senangwebs-one@latest/examples/index-auto-init.html)
2. [https://unpkg.com/senangwebs-one@latest/examples/index-js-init.html](https://unpkg.com/senangwebs-one@latest/examples/index-js-init.html)

## Dependencies

SWO relies on a few external libraries that you need to include separately (typically via CDN) for full functionality:

- **Monaco Editor:** For the code editor (VS Code's editor engine).
  - Monaco Editor provides its own CSS and JavaScript bundle
  - Includes built-in syntax highlighting, auto-completion, and modern editor features
- **JS-Beautify:** For the "Prettier" code formatting button.
- **SenangStart Icons:** For icons used in the control panel.
- **Google Fonts (Outfit):** For the default font (optional, used for styling).

## Installation

There are a couple of ways to integrate SenangWebs One into your project:

### Using a CDN

For the quickest setup, you can include SenangWebs One's core CSS and JavaScript files directly from a CDN like unpkg. This is often the easiest way to get started.

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/senangwebs-one@latest/dist/swo.css"
/>
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
    <meta charset="UTF-8" />
    <title>My SWO Project</title>

    <!-- SWO Library CSS -->
    <!-- Using CDN (recommended for quick start): -->
    <link
      rel="stylesheet"
      href="https://unpkg.com/senangwebs-one@latest/dist/swo.css"
    />
    <!-- Or, if using local files: -->
    <!-- <link rel="stylesheet" href="path/to/your/dist/swo.css"> -->

    <!-- External Dependencies -->
    <!-- Monaco Editor (VS Code editor engine) -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.54.0/min/vs/loader.min.js"></script>

    <!-- Google Fonts (Outfit) - Optional for styling -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap"
      rel="stylesheet"
    />

    <style>
      /* Ensure your target element has a defined height */
      html,
      body {
        height: 100%;
        margin: 0;
        overflow: hidden;
      }
      #my-swo-editor {
        height: 100vh; /* Or any specific height */
      }
    </style>
  </head>
  <body>
    <div id="my-swo-editor">
      <!-- SWO will be initialized here -->
    </div>

    <!-- Monaco Editor Setup -->
    <script>
      require.config({
        paths: {
          vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.54.0/min/vs",
        },
      });
      require(["vs/editor/editor.main"], function () {
        // Monaco Editor is now loaded and available as global 'monaco'
      });
    </script>

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
<div
  id="editor-container"
  data-swo
  data-swo-storage-key="my-project-code"
  style="height: 600px; border: 1px solid #ccc;"
>
  <!-- SWO will populate this -->
</div>
```

**Available Data Attributes:**

- `data-swo`: (Required) Marks the container element for SWO initialization.
- `data-swo-code`: (Optional) A string of HTML code to load initially. If not provided, default demo code is used.
  _Note: For complex initial code, JavaScript initialization is recommended._
- `data-swo-storage-key`: (Optional) A custom key for `localStorage`. If not provided, a unique key is automatically generated for each instance.

### 2. Using JavaScript Initialization

For more control, you can initialize SWO programmatically. This is useful for dynamically creating instances or passing complex initial code.

```html
<div id="my-custom-editor" style="height: 100vh;"></div>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    if (typeof SWO !== "undefined") {
      const customCode = `<!DOCTYPE html>
<html>
<head><title>My Awesome Page</title></head>
<body><h1>Hello from SWO!</h1><script>console.log("JS Init!");<\/script></body>
</html>`;

      new SWO("#my-custom-editor", {
        // Target element selector or DOM element
        code: customCode,
        storageKey: "custom-editor-project-xyz",
      });
    } else {
      console.error("SWO library not loaded.");
    }
  });
</script>
```

**Constructor:**

`new SWO(targetElementOrSelector, options)`

- `targetElementOrSelector`: A DOM element or a CSS selector string for the container where SWO will be rendered.
- `options` (Object, Optional):
  - `code` (String): Initial HTML code to load into the editor. Defaults to a demo HTML structure with interactive examples.
  - `storageKey` (String): Custom key for `localStorage` to save and load editor content. Defaults to a unique generated key per instance (e.g., `senangwebs-one-editor-content-abc123`).

## Public Methods

After creating an SWO instance, you can call these methods programmatically:

```javascript
const editor = new SWO("#my-editor", { code: "<h1>Hello World</h1>" });

// Update the preview manually
editor.updatePreview();

// Format the code in the editor
editor.formatCode();

// Open preview in new tab
editor.openPreviewInNewTab();

// Toggle UI elements
editor.toggleCodeEditor();
editor.toggleConsole();

// Change device preview size
editor.resizePreviewDevice("768px", "1024px"); // Custom size
editor.resizePreviewDevice("100%", "100%"); // Desktop
editor.resizePreviewDevice("1070px", "100%"); // Tablet
editor.resizePreviewDevice("390px", "844px"); // Mobile

// Clean up the instance
editor.destroy();
```

**Available Methods:**

- `updatePreview()`: Manually refresh the preview iframe
- `formatCode()`: Format the HTML code using js-beautify (requires js-beautify library)
- `openPreviewInNewTab()`: Open current preview in a new browser tab
- `toggleCodeEditor()`: Show/hide the code editor pane
- `toggleConsole()`: Show/hide the console pane
- `resizePreviewDevice(width, height)`: Set custom preview dimensions
- `destroy()`: Clean up the instance and remove event listeners

## Interface Overview

- **Code Editor (Left Pane):** Monaco Editor for writing HTML, CSS (inline `<style>` tags), and JavaScript (inline `<script>` tags).
  - **Prettier Button:** Formats the HTML code in the editor using js-beautify.
  - **Features:** Syntax highlighting, auto-completion, error detection, and VS Code-like editing experience.
- **Vertical Resize Handle:** Drag to adjust the width ratio between editor and preview/console panes.
- **Right Pane:**
  - **Preview Pane (Top):** Displays the live rendering of your code in a sandboxed iframe.
    - **Auto-refresh:** Updates automatically when code changes (300ms debounce).
    - **Device simulation:** Responsive viewport switching for desktop, tablet, and mobile.
  - **Horizontal Resize Handle:** Visible when console is open. Drag to adjust height ratio between preview and console.
  - **Console (Bottom):**
    - Captures and displays `console.log`, `console.warn`, `console.error`, `console.info`, and `console.debug` messages.
    - Shows unhandled JavaScript errors and promise rejections.
    - **Clear Button:** Clears the console output.
    - **Visual indicators:** Different icons and colors for each message type.
- **Control Bar (Bottom):**
  - **Device Toggles:**
    - **Desktop (Monitor icon):** 100% width preview
    - **Tablet (Tablet icon):** 1070px max width preview
    - **Mobile (Phone icon):** 390px × 844px preview (iPhone dimensions)
  - **Refresh Preview (Sync icon):** Manually re-renders the preview iframe.
  - **Toggle Code Editor (Code icon):** Show/hide the entire code editor pane.
  - **Toggle Console (Terminal icon):** Show/hide the console pane.
  - **Open in New Tab (Bolt icon):** Opens the current preview in a new browser tab with popup blocking detection.

## Console Bridge

SWO includes an intelligent console bridge that automatically captures all console output from your preview code:

- **Automatic Integration:** The console bridge is automatically injected into your preview iframe
- **Complete Coverage:** Captures `console.log`, `console.error`, `console.warn`, `console.info`, `console.debug`, and `console.clear`
- **Error Handling:** Automatically catches unhandled JavaScript errors and promise rejections
- **Object Serialization:** Intelligently handles complex objects, circular references, DOM elements, and functions
- **Visual Feedback:** Each message type has distinct styling and icons for easy identification
- **Security:** Uses secure postMessage communication between iframe and parent window

## Browser Support

SenangWebs One is designed to work on all modern browsers that support Monaco Editor and ES6+ features:

- **Chrome** 60+ (recommended)
- **Firefox** 55+
- **Safari** 11+
- **Edge** 79+ (Chromium-based)

**Note:** Internet Explorer is not supported due to ES6+ requirements and Monaco Editor compatibility.

## Troubleshooting

### Monaco Editor Not Loading

If you see "Monaco Editor not loaded" in the code editor:

1. **Check Monaco Editor Setup:** Ensure Monaco Editor is loaded before SWO:

   ```html
   <script src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs/loader.min.js"></script>
   <script>
     require.config({
       paths: {
         vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs",
       },
     });
     require(["vs/editor/editor.main"], function () {
       // Monaco is ready, now load SWO
       // Your SWO initialization code here
     });
   </script>
   ```

2. **CDN Issues:** Try using a different CDN or host Monaco Editor locally.

### Console Not Working

If console messages aren't appearing:

1. **Check Browser Console:** Look for any security or CORS errors
2. **Iframe Restrictions:** Some browser security settings may block iframe communication
3. **Content Security Policy:** Ensure your CSP allows iframe execution and postMessage

### Performance Issues

For better performance with large code:

1. **Debouncing:** SWO automatically debounces preview updates (300ms)
2. **Multiple Instances:** Each instance uses unique storage keys automatically
3. **Memory:** Call `destroy()` method when removing SWO instances to prevent memory leaks

## Contributing

Contributions, issues, and feature requests are welcome! Please feel free to:

- Fork the repository and submit a Pull Request.
- Open an issue for bugs or suggestions.

## License

MIT License

## Acknowledgments

- Inspired by various online code playgrounds like CodePen, JSFiddle, and Glitch.
- Built with amazing open-source libraries:
  - **Monaco Editor** - Microsoft's VS Code editor engine
  - **JS-Beautify** - Code formatting functionality
  - **SenangStart Icons** - Icons and UI elements
- Special thanks to the VS Code team for making Monaco Editor available as a standalone library.
