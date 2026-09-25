# hetam

## 🚀 Quick Start

### Prerequisites

- **Node.js**: Version 20 or higher
- **Bun**: Version 1.2 or higher (managed via `packageManager` in `package.json`)
- **PostgreSQL**: Database for storing application data

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/dzulhelmynazri/hetam.git
   cd hetam
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Set up environment variables**

   ```bash
   # Create environment file in root directory
   cp .env.example .env

   # Create symlinks for environment variables across apps
   bun run sys-link
   ```

4. **Set up the database**

   ```bash
   # Generate database schema
   bun run db:generate

   # Run database migrations
   bun run db:migrate
   ```

5. **Start development server**
   ```bash
   bun dev
   ```

## 🛠️ Tech Stack

### Core Framework

- **Next.js 15.3.1** - React framework with App Router
- **React 19** - UI library
- **TypeScript 5.8.2** - Type-safe JavaScript

### API & State Management

- **tRPC 11.1.2** - End-to-end type-safe APIs
- **TanStack Query 5.76.1** - Server state management
- **Jotai 2.12.3** - Atomic state management
- **Zod 3.25.7** - Schema validation

### UI & Styling

- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Headless UI components
- **Shadcn/ui** - Re-usable components built on Radix
- **Lucide React** - Icon library
- **Motion 12.10.5** - Animation library
- **Next Themes** - Theme management

### Database & Authentication

- **Drizzle ORM 0.43.1** - Type-safe database ORM
- **Neon Database** - Serverless PostgreSQL
- **Better Auth 1.2.8** - Modern authentication library
- **Google OAuth** - Social authentication

### File Storage & PDF

- **Cloudflare R2** - Object storage
- **React PDF 9.2.1** - PDF generation

### Development Tools

- **Turbo 2.5.3** - Monorepo build system
- **ESLint 9** - Code linting
- **Prettier 3.5.3** - Code formatting
- **Husky 9.1.7** - Git hooks

### Analytics & Monitoring

- **PostHog** - Product analytics
- **OpenPanel** - Privacy-focused analytics
- **React Scan** - Performance debugging

### Utilities

- **Date-fns 4.1.0** - Date manipulation
- **Lodash 4.17.21** - Utility functions
- **Decimal.js 10.5.0** - Arbitrary precision decimal arithmetic
- **UUID 11.1.0** - Unique identifier generation

## 📁 Project Structure

```
hetam/
├── apps/
│   └── web/                    # Next.js web application
│       ├── src/
│       │   ├── app/           # App Router pages
│       │   ├── components/    # Reusable UI components
│       │   ├── constants/     # Application constants
│       │   ├── hooks/         # Custom React hooks
│       │   ├── lib/          # Utility libraries
│       │   ├── providers/    # Context providers
│       │   ├── trpc/         # tRPC configuration
│       │   ├── types/        # TypeScript type definitions
│       │   └── zod-schemas/  # Zod validation schemas
│       ├── public/           # Static assets
│       └── package.json      # App dependencies
│
├── packages/
│   ├── db/                   # Database package
│   │   ├── src/
│   │   │   ├── schema/      # Drizzle database schemas
│   │   │   └── index.ts     # Database exports
│   │   └── migrations/      # Database migration files
│   │
│   ├── utilities/           # Shared utilities
│   │   └── src/
│   │       └── env/        # Environment configuration
│   │
│   ├── eslint-config/      # Shared ESLint configuration
│   └── typescript-config/  # Shared TypeScript configuration
│
├── env-links.sh            # Environment symlink script
├── turbo.json             # Turbo configuration
├── package.json           # Root package configuration
└── bun.lock              # Dependency lock file
```

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/hetam"

# Authentication
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Cloudflare R2 Storage
CF_R2_ENDPOINT="your-r2-endpoint"
CF_R2_ACCESS_KEY_ID="your-access-key"
CF_R2_SECRET_ACCESS_KEY="your-secret-key"
CF_R2_BUCKET_NAME="your-bucket-name"
CF_R2_PUBLIC_DOMAIN="your-public-domain"

# Public URLs
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
NEXT_PUBLIC_TRPC_BASE_URL="http://localhost:3000/api/trpc"
```

### Environment Management

The project uses a symlink-based approach for environment management:

- Run `bun run sys-link` to create symlinks from the root `.env` file to all apps
- This ensures consistent environment variables across the monorepo
- Environment variables are validated using `@t3-oss/env-nextjs` and Zod

## 📜 Available Scripts

### Root Level Scripts

```bash
bun dev               # Start development servers for all apps
bun run build         # Build all apps for production
bun run start         # Start production servers
bun run lint          # Lint all packages
bun run lint:fix      # Fix linting issues
bun run format        # Format code with Prettier
bun run check-types   # Type check all packages

# Database Operations
bun run db:generate   # Generate database schema
bun run db:migrate    # Run database migrations
bun run db:push       # Push schema changes to database
bun run db:studio     # Open Drizzle Studio

# Utility Scripts
bun run sys-link      # Create environment symlinks
bun run reset-repo    # Clean all build artifacts
```

### App-Specific Scripts (apps/web)

```bash
bun dev               # Start Next.js development server
bun run build         # Build for production
bun run start         # Start production server
bun run lint          # Lint the web app
```

## 🎯 Naming Conventions

### Files and Directories

- **Directories**: Use lowercase with dashes (e.g., `components/auth-wizard`)
- **Components**: Use PascalCase for component files (e.g., `UserProfile.tsx`)
- **Client Components**: Add `.client.tsx` suffix for components using `"use client"`
- **Utilities**: Use camelCase for utility files (e.g., `formatCurrency.ts`)

### Variables and Functions

- **Variables**: Use camelCase (e.g., `userName`, `isLoading`, `hasError`)
- **Constants**: Use SCREAMING_SNAKE_CASE (e.g., `R2_PUBLIC_URL`, `TOAST_OPTIONS`)
- **Functions**: Use camelCase with descriptive verbs (e.g., `createInvoice`, `validateEmail`)
- **Booleans**: Prefix with auxiliary verbs (e.g., `isLoading`, `hasPermission`, `canEdit`)

### TypeScript Types

- **Interfaces**: Use PascalCase (e.g., `UserProfile`, `InvoiceData`)
- **Zod Schemas**: Prefix with "Zod" (e.g., `ZodInvoiceSchema`, `ZodUserSchema`)
- **Type Exports**: Use named exports, avoid default exports

### Code Style

- Use the `function` keyword for pure functions
- Prefer named exports over default exports
- Use functional and declarative programming patterns
- Structure files: exported component, subcomponents, helpers, static content, types
