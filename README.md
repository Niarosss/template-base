[English](./README.md) | [Українська](./README.uk.md)

# Template Base 🐼

A modern React-based template for creating interactive documentation and knowledge bases from Markdown. It provides a ready-to-use interface with navigation, search, theme switching, responsive layouts, feedback support, and configurable content blocks, allowing you to focus on the content instead of building the documentation interface from scratch.

## Features

* **Markdown-Based Content**: Write documentation using standard Markdown with GitHub Flavored Markdown support.
* **Structured Navigation**: Automatically builds a navigation tree from Markdown headings.
* **Powerful Search**: Search through the entire documentation with highlighted matches and keyboard navigation.
* **Responsive Layout**: Adapts the documentation interface to desktop, tablet, and mobile screens.
* **Dark Mode**: Supports light, dark, and system themes with the selected preference stored locally.
* **Custom Content Columns**: Supports `cols-2`, `cols-3`, and other configurable Markdown grid layouts for organizing content into cards and columns.
* **Text Selection Feedback**: Select any text and use `Ctrl + Enter` / `Cmd + Enter` to send it as feedback.
* **Feedback API**: Includes a serverless API endpoint for receiving user feedback.
* **Settings**: Provides a settings interface for controlling the theme and automatic text selection behavior.
* **Loading Animation**: Includes a lightweight loading screen displayed while the Markdown content is being prepared.
* **Modern React Architecture**: Built with React 19, the React Compiler, Vite, and modern frontend tooling.
* **Tailwind CSS**: Uses Tailwind CSS v4 for styling and responsive layouts.
* **Easy to Customize**: The template is designed to be adapted for support documentation, knowledge bases, internal guides, FAQs, and other structured content.

## Technologies Used

* **Framework**: [React](https://react.dev/)
* **Build Tool**: [Vite](https://vite.dev/)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **Animations**: [Motion](https://motion.dev/)
* **Markdown**: [React Markdown](https://github.com/remarkjs/react-markdown)
* **Markdown Extensions**: [remark-gfm](https://github.com/remarkjs/remark-gfm)
* **Raw HTML Support**: [rehype-raw](https://github.com/remarkjs/rehype-raw)
* **Icons**: [Phosphor Icons](https://phosphoricons.com/)
* **Language**: JavaScript (ES Modules)

## Getting Started

### Prerequisites

* Node.js and npm installed.
* Basic knowledge of React and Markdown.
* A modern browser with JavaScript enabled.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Niarosss/template-base.git
   ```

2. Navigate to the project directory:

   ```bash
   cd template-base
   ```

3. Install dependencies:

   ```bash
   pnpm install
   ```

### Development

Start the local development server:

```bash
pnpm dev
```

The application will be available at the local Vite development URL shown in your terminal.

### Production Build

Create an optimized production build:

```bash
pnpm build
```

To preview the production build locally:

```bash
pnpm preview
```

### Linting

Run ESLint to check the project:

```bash
pnpm lint
```

## Content Configuration

The documentation content is currently provided through the `<x-md>` element in `index.html`.

The template supports special Markdown sections for defining reusable global content:

```md
::: greeting
Hello! Thank you for contacting our support team.

::: signature
Best regards,
Support Team
:::
```

These values can then be used by the template when rendering content blocks.

### Multi-Column Layouts

Content can be grouped into responsive columns using special `cols-*` blocks:

```md
::: cols-3
## ACCOUNT

Information about the account.

## SECURITY

Information about security.

## BILLING

Information about billing.
:::
```

The template automatically converts these blocks into responsive grid layouts.

### Markdown Support

The content renderer supports standard Markdown together with GitHub Flavored Markdown features such as:

- Tables
- Task lists
- Strikethrough
- Links
- Lists
- Code blocks
- Raw HTML

### Keyboard Shortcuts

| Shortcut                       | Action                         |
| ------------------------------ | ------------------------------ |
| `Ctrl + F` / `Cmd + F`         | Focus documentation search     |
| `Ctrl + K` / `Cmd + K`         | Focus documentation search     |
| `/`                            | Focus documentation search     |
| `F3`                           | Next search result             |
| `Shift + F3`                   | Previous search result         |
| `Ctrl + Enter` / `Cmd + Enter` | Send selected text as feedback |

### Feedback API

The project includes a serverless feedback endpoint located in:
```bash
api/feedback.js
```

Users can select a piece of documentation and submit it as feedback using `Ctrl + Enter` or `Cmd + Enter`.

This makes it possible to build a documentation system where users can report incorrect, unclear, or outdated information directly from the interface.

### Project Structure
```
template-base/
├── 📁 api/                       # Serverless API endpoints
│   └── 📄 feedback.js            # Feedback API endpoint
├── 📁 src/                       # Application source code
│   ├── 📁 components/            # UI components
│   ├── 📁 context/               # React contexts
│   ├── 📁 utils/                 # Utility functions
│   ├── 📄 App.jsx                # Main application component
│   ├── 📄 index.css              # Global styles
│   └── 📄 main.jsx               # Application entry point
├── 📄 index.html                 # HTML entry point and documentation content
├── 📄 eslint.config.js           # ESLint configuration
├── 📄 package.json               # Project dependencies and scripts
├── 📄 pnpm-lock.yaml             # Dependency lockfile
└── 📄 vite.config.js             # Vite configuration
```

### Customization

The template is intentionally structured so that the application interface and documentation content can be modified independently.

You can customize:

- Documentation content
- Navigation structure
- Header and sidebar
- Search behavior
- Theme settings
- Markdown rendering
- Column layouts
- Feedback handling
- Loading animation
- Footer
- UI components and styling

The main documentation content can be replaced directly in `index.html`, while the application interface is organized inside `src/`.

### Deployment

The project can be deployed to any platform that supports static Vite applications.

#### Vercel
1. Push the project to a Git repository.
2. Import the repository into Vercel.
3. Set the build command to:
    ```
    pnpm build
    ```
4. Set the output directory to:
    ```
    dist
    ```
5. Deploy the project.

The same production build can also be hosted on GitHub Pages, Netlify, Cloudflare Pages, or any other static hosting provider.

### Use Cases

Template Base can be used as a foundation for:

- Customer support knowledge bases
- Product documentation
- FAQ pages
- Internal company documentation
- Help centers
- Technical documentation
- Project guides
- Interactive Markdown documentation
- Structured information portals

### License

This project is provided as a reusable template. You can adapt the source code and documentation structure to fit your own project requirements.