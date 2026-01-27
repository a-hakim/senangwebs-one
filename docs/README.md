# SenangWebs One (SWO)

> A lightweight, modern code editor component, designed for seamless integration and a premium visual experience.

![SenangWebs One Preview](https://raw.githubusercontent.com/a-hakim/senangwebs-one/master/swo_preview.png)

## Introduction

**SenangWebs One** is a specialized code editor library. It is built on top of [CodeMirror 6](https://codemirror.net/) but pre-configured with a "VS Code-like" dark theme, essential features like autocomplete and syntax highlighting, and a built-in live preview system.

It is designed to be:
- **Lightweight**: Far smaller bundle size.
- **Modern**: Uses the latest CodeMirror 6 architecture.
- **Drop-in Ready**: Easy initialization on any DOM element.

## Quick Start

### Installation

```bash
npm install senangwebs-one
```

### Usage

**Vanilla JS:**

```html
<link rel="stylesheet" href="https://unpkg.com/senangwebs-one@latest/dist/swo.min.css" />

<div id="editor"></div>

<script src="https://unpkg.com/senangwebs-one@latest/dist/swo.min.js"></script>
<script>
    new SWO("#editor", {
        code: "<h1>Hello World</h1>"
    });
</script>
```

**Auto-Initialization:**

Add the `data-swo` attribute to any element:

```html
<link rel="stylesheet" href="https://unpkg.com/senangwebs-one@latest/dist/swo.min.css" />

<div data-swo data-swo-code="<h1>Auto Init</h1>"></div>

<script src="https://unpkg.com/senangwebs-one@latest/dist/swo.min.js"></script>
```

## Features

- **Syntax Highlighting** (HTML, CSS, JS)
- **Autocompletion**
- **Live Preview Pane**
- **Integrated Console**
- **Responsive Preview** (Desktop, Tablet, Mobile)

## License

MIT License

Copyright (c) 2025 A.Hakim

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
