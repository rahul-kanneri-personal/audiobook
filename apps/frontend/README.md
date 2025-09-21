# Frontend

A modern Next.js application built with TypeScript, Tailwind CSS, shadcn/ui, ESLint, Prettier, and Zustand for state management.

## 🚀 Features

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** for beautiful UI components
- **ESLint** for code linting
- **Prettier** for code formatting
- **Zustand** for state management

## 📦 Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Code Quality**: ESLint + Prettier

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Installation

1. Navigate to the app directory:

   ```bash
   cd apps/frontend
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Run the development server:

   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Run ESLint with auto-fix
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting

## 🏗️ Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
│   └── ui/            # shadcn/ui components
├── lib/               # Utility functions
│   └── utils.ts       # Utility functions
└── store/             # Zustand stores
    └── useAppStore.ts # Example store
```

## 🎨 UI Components

This project uses shadcn/ui components. To add new components:

```bash
npx shadcn@latest add [component-name]
```

## 🔧 Configuration Files

- `components.json` - shadcn/ui configuration
- `eslint.config.mjs` - ESLint configuration
- `.prettierrc` - Prettier configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration

## 📱 Demo

The application includes a demo counter component that showcases:

- Zustand state management
- shadcn/ui Button components
- Tailwind CSS styling
- TypeScript type safety

## 🤝 Contributing

1. Follow the existing code style (enforced by ESLint and Prettier)
2. Run `pnpm lint` and `pnpm format` before committing
3. Ensure all tests pass

## 📄 License

This project is private and proprietary.
