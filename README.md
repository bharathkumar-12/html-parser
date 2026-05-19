# JSON to HTML/Markdown Converter

<div align="center">

![Demo Screenshot](https://github.com/user-attachments/assets/6793eb06-569f-4af4-b84b-51db4429f5a3)

**Transform JSON data into beautifully formatted HTML or Markdown with real-time preview**

[![Nuxt](https://img.shields.io/badge/Nuxt-3.x-00DC82?style=flat&logo=nuxt.js&logoColor=white)](https://nuxt.com/)
[![Vue](https://img.shields.io/badge/Vue-3.x-4FC08D?style=flat&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[Demo](#demo) • [Features](#features) • [Quick Start](#quick-start) • [Usage](#usage) • [Tech Stack](#tech-stack)

</div>

---

## Overview

A production-ready Nuxt 3 application that converts JSON data into structured HTML or Markdown with live preview capabilities. Perfect for API documentation, data visualization, and content generation workflows.

### Key Highlights

- 🎨 **Modern UI/UX** - Clean, Apple-inspired interface with intuitive split-pane editor
- ⚡ **Real-time Preview** - Instant visual feedback as you edit JSON
- 🔄 **Bidirectional Conversion** - Seamlessly switch between HTML and Markdown output
- 🌐 **API Integration** - Fetch and transform data from any REST endpoint
- 📱 **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- 🛡️ **Type-Safe** - Built with TypeScript for enhanced developer experience
- 🎯 **Zero Config** - Works out of the box with sensible defaults

---

## Features

### Core Functionality

- **Dynamic JSON Parsing** - Handles complex nested structures, arrays, and edge cases
- **Smart Formatting** - Automatically formats output with proper indentation and syntax
- **HTML Sanitization** - DOMPurify integration for secure HTML rendering
- **Markdown Rendering** - Powered by markdown-it with full GFM support
- **PDF Export** - Generate PDF documents from converted content (html2pdf.js)
- **Error Handling** - Graceful error states with helpful validation messages

### Developer Experience

- **SSR Support** - Server-side rendering for optimal performance and SEO
- **Hot Module Replacement** - Lightning-fast development with instant updates
- **Component Architecture** - Modular, reusable Vue 3 Composition API components
- **Tailwind CSS** - Utility-first styling with custom design system
- **Font Awesome** - Professional icon library for enhanced UI

---

## Tech Stack

### Core Framework

- **[Nuxt 3](https://nuxt.com/)** - Vue-based meta-framework with SSR/SSG capabilities
- **[Vue 3](https://vuejs.org/)** - Composition API, `<script setup>`, and reactive state management
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development with full IntelliSense

### UI & Styling

- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Font Awesome](https://fontawesome.com/)** - Icon library via `@fortawesome/vue-fontawesome`
- **PostCSS & Autoprefixer** - CSS processing and vendor prefixing

### Libraries & Tools

- **[markdown-it](https://github.com/markdown-it/markdown-it)** - Markdown parser with plugin support
- **[DOMPurify](https://github.com/cure53/DOMPurify)** - XSS sanitizer for HTML content
- **[html2pdf.js](https://github.com/eKoopmans/html2pdf.js)** - Client-side PDF generation
- **[vue-markdown-render](https://www.npmjs.com/package/vue-markdown-render)** - Vue 3 markdown renderer

---

## Quick Start

### Prerequisites

- **Node.js** >= 18.x
- **npm** / **pnpm** / **yarn** / **bun**

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/html-parser.git
cd html-parser

# Install dependencies (choose one)
npm install
# or
pnpm install
# or
yarn install
# or
bun install
```

### Development

Start the development server at `http://localhost:3000`:

```bash
npm run dev
```

The app features:

- 🔥 Hot module replacement
- 🎯 Auto-import for components and composables
- 📊 Vue DevTools integration

### Build

Generate production-ready build:

```bash
npm run build
```

Preview production build locally:

```bash
npm run preview
```

### Deployment

This app can be deployed to:

- **Vercel** / **Netlify** - Zero-config deployment
- **Cloudflare Pages** - Edge network with SSR support
- **Node.js Server** - Self-hosted with PM2 or Docker
- **Static Hosting** - Pre-render with `npm run generate`

See [Nuxt Deployment Docs](https://nuxt.com/docs/getting-started/deployment) for detailed guides.

---

## Usage

### Basic Workflow

1. **Input JSON Data**
   - Paste JSON directly into the editor
   - Or fetch from any public API endpoint

2. **Convert**
   - Click "Convert to HTML" for HTML output
   - Click "Convert to Markdown" for Markdown output

3. **Preview & Export**
   - View formatted output in real-time
   - Copy or export as needed

### Example API Endpoints

Try these public APIs:

```bash
# User data
https://reqres.in/api/users?page=2

# Posts
https://jsonplaceholder.typicode.com/posts

# GitHub repos
https://api.github.com/users/github/repos
```

### Code Structure

```
html-parser/
├── app.vue                 # Root component with main logic
├── components/
│   └── ViewBox.vue        # Reusable code preview component
├── plugins/
│   └── fontawesome.js     # Font Awesome configuration
├── assets/
│   └── css/
│       └── main.css       # Global styles & Tailwind imports
├── nuxt.config.ts         # Nuxt configuration
├── tailwind.config.js     # Tailwind customization
└── tsconfig.json          # TypeScript configuration
```

---

## Architecture

### Component Design

The application follows Vue 3 Composition API patterns with:

- **Reactive State Management** - Using `reactive()` for mutable state
- **Composable Utilities** - Reusable logic extraction
- **Type Safety** - TypeScript interfaces for props and emits

### Performance Optimizations

- **Code Splitting** - Automatic route-based chunks
- **Lazy Loading** - Dynamic imports for heavy libraries
- **SSR Hydration** - Fast initial page load with client takeover
- **Tree Shaking** - Minimal bundle size via ES modules

---

## Roadmap

- [ ] Custom transformation templates
- [ ] JSON schema validation
- [ ] Batch file processing
- [ ] Export to React/Vue components
- [ ] Dark mode support
- [ ] Collaborative editing
- [ ] API authentication support

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

## Acknowledgments

Built with modern web technologies and inspired by developer-first design principles.

**Made with ❤️ using Nuxt 3 & Vue 3**

---

## Maintenance

Last maintenance update: <!--LAST_UPDATED-->2026-05-19<!--/LAST_UPDATED-->
