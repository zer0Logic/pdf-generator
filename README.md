# PDF Generator

A Web application built with **Angular v21** to generate PDF reports.

## Tech Stack

- **Framework**: [Angular v21+](https://angular.dev/) (Standalone Components, Signals, Host Directives)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **PDF Engine**: [jsPDF](https://rawgit.com/MrRio/jsPDF/master/docs/index.html)
- **State Management**: Angular Signals
- **Notifications**: [ngx-sonner](https://github.com/maximelostan/ngx-sonner)
- **Icons**: [Lucide Icons](https://lucide.dev/) (via `@ng-icons`)

## Getting Started

Follow these steps to get the project up and running locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or later recommended)
- [npm](https://www.npmjs.com/) (v10 or later)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd pdf-generator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development Server

Start the local development server:

```bash
npm start
```

Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## 🏗️ Building for Production

To create an optimized production build:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.
