# Task 1.1: Initialize Next.js 15 Project

**Task ID:** 1.1
**Task Name:** Initialize Next.js Project
**Phase:** 1 - Project Setup & Foundation
**Estimated Time:** 1 hour
**Complexity:** Low
**Prerequisites:** None (First task)

## Overview

This task establishes the foundation of the Bella Cucina restaurant management application by initializing a new Next.js 15 project with the App Router architecture, TypeScript for type safety, and ESLint for code quality. This is the critical first step that determines the project structure and configuration for all subsequent development.

## Importance

Proper project initialization is crucial because:

1. **Architecture Foundation** - App Router provides the modern routing and data fetching patterns
2. **Type Safety** - TypeScript catches errors during development, reducing production bugs
3. **Code Quality** - ESLint enforces consistent coding standards across the team
4. **Performance** - Next.js 15 includes automatic optimizations and the latest React features
5. **Developer Experience** - Correct setup ensures smooth development workflow

## Prerequisites

### System Requirements
- **Node.js:** v18.17.0 or higher (v20+ recommended)
- **Package Manager:** npm (comes with Node.js) or yarn
- **Operating System:** macOS, Windows, or Linux
- **Terminal Access:** Command line interface

### Verification Commands
```bash
# Check Node.js version
node --version
# Should output: v18.17.0 or higher

# Check npm version
npm --version
# Should output: 9.0.0 or higher

# Verify npx is available
npx --version
```

### Knowledge Prerequisites
- Basic command line operations
- Understanding of project directory structures
- Familiarity with package.json files
- Basic Git knowledge (optional but recommended)

## Technical Specifications

### Next.js Version
- **Version:** 15.x (latest stable)
- **Architecture:** App Router (not Pages Router)
- **React Version:** 18.x or 19.x (automatically installed)

### TypeScript Configuration
- **Mode:** Strict
- **Target:** ES2020
- **Module:** ESNext
- **JSX:** preserve

### Project Structure
```
bella-cucina/
├── app/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── public/
├── node_modules/
├── .eslintrc.json
├── .gitignore
├── next.config.js
├── package.json
├── tsconfig.json
└── README.md
```

## Files to Create/Modify

### Auto-Generated Files
These files are created automatically by `create-next-app`:

1. **`/Users/noorragu/Documents/vibe-code-demo/package.json`**
   - Dependencies and scripts configuration

2. **`/Users/noorragu/Documents/vibe-code-demo/tsconfig.json`**
   - TypeScript compiler configuration

3. **`/Users/noorragu/Documents/vibe-code-demo/next.config.js`**
   - Next.js framework configuration

4. **`/Users/noorragu/Documents/vibe-code-demo/.eslintrc.json`**
   - ESLint rules and configuration

5. **`/Users/noorragu/Documents/vibe-code-demo/app/layout.tsx`**
   - Root layout component

6. **`/Users/noorragu/Documents/vibe-code-demo/app/page.tsx`**
   - Homepage component

### Files to Modify After Creation
- `.gitignore` - Add custom ignore patterns
- `package.json` - Update project metadata
- `tsconfig.json` - Enable strict mode and path aliases

## Step-by-Step Implementation Guide

### Step 1: Navigate to Project Directory

Open your terminal and navigate to the parent directory where you want to create the project:

```bash
cd /Users/noorragu/Documents/vibe-code-demo
```

**Note:** If this directory doesn't exist, create it first:
```bash
mkdir -p /Users/noorragu/Documents/vibe-code-demo
cd /Users/noorragu/Documents/vibe-code-demo
```

### Step 2: Run Next.js Initialization Command

Execute the `create-next-app` command with specific options:

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"
```

**Command Breakdown:**
- `npx create-next-app@latest` - Uses the latest version of create-next-app
- `.` - Creates project in current directory (not a subdirectory)
- `--typescript` - Enables TypeScript
- `--tailwind` - Includes Tailwind CSS
- `--eslint` - Sets up ESLint
- `--app` - Uses App Router (not Pages Router)
- `--src-dir=false` - Places app folder at root level
- `--import-alias="@/*"` - Enables `@/` path aliases

**Interactive Prompts:** If the command prompts you, answer:
- ✅ Would you like to use TypeScript? → **Yes**
- ✅ Would you like to use ESLint? → **Yes**
- ✅ Would you like to use Tailwind CSS? → **Yes**
- ✅ Would you like to use `src/` directory? → **No**
- ✅ Would you like to use App Router? → **Yes**
- ✅ Would you like to customize the default import alias? → **No** (or specify `@/*`)

### Step 3: Verify Installation

Once installation completes, verify the project structure:

```bash
ls -la
```

**Expected Output:**
```
app/
node_modules/
public/
.eslintrc.json
.gitignore
next.config.js
package.json
package-lock.json
README.md
tsconfig.json
```

### Step 4: Review and Update package.json

Open `package.json` and verify the content:

```json
{
  "name": "bella-cucina",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "next": "^15.0.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "eslint": "^8.55.0",
    "eslint-config-next": "^15.0.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

**Update the following fields:**
```json
{
  "name": "bella-cucina",
  "version": "0.1.0",
  "description": "Restaurant management web application for Bella Cucina",
  "author": "Your Name",
  "private": true
}
```

### Step 5: Configure TypeScript Strict Mode

Open `tsconfig.json` and ensure strict mode is enabled:

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**Key Configuration Points:**
- `"strict": true` - Enables all strict type-checking options
- `"paths": { "@/*": ["./*"] }` - Allows imports like `@/lib/utils`
- `"jsx": "preserve"` - Required for Next.js
- `"moduleResolution": "bundler"` - Modern module resolution

### Step 6: Update ESLint Configuration

Open `.eslintrc.json` and verify/update:

```json
{
  "extends": ["next/core-web-vitals", "next/typescript"],
  "rules": {
    "react/no-unescaped-entities": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }
    ]
  }
}
```

**Configuration Explanation:**
- `next/core-web-vitals` - Enforces Next.js best practices
- `next/typescript` - TypeScript-specific rules
- `no-unused-vars` - Warns on unused variables (allows `_` prefix for intentionally unused)

### Step 7: Enhance .gitignore

Add additional patterns to `.gitignore`:

```gitignore
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db
```

### Step 8: Create Basic Directory Structure

Create additional directories that will be used in subsequent tasks:

```bash
mkdir -p lib public/assets
```

**Directory Purpose:**
- `lib/` - Utility functions, data stores, and shared logic
- `public/assets/` - Static images, icons, and other assets

### Step 9: Test Development Server

Start the development server to verify everything works:

```bash
npm run dev
```

**Expected Output:**
```
   ▲ Next.js 15.0.0
   - Local:        http://localhost:3000
   - Environments: .env

 ✓ Ready in 2.5s
```

Open your browser and navigate to `http://localhost:3000`. You should see the default Next.js welcome page.

### Step 10: Test Build Process

Stop the dev server (Ctrl+C) and test the production build:

```bash
npm run build
```

**Expected Output:**
```
   ▲ Next.js 15.0.0

   Creating an optimized production build ...
 ✓ Compiled successfully
 ✓ Linting and checking validity of types
 ✓ Collecting page data
 ✓ Generating static pages (5/5)
 ✓ Collecting build traces
 ✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                    5.2 kB         87.2 kB
└ ○ /_not-found                          871 B          82.8 kB

○  (Static)  prerendered as static content

✓ Build completed successfully
```

### Step 11: Initialize Git Repository (Optional but Recommended)

If you haven't already, initialize a Git repository:

```bash
git init
git add .
git commit -m "Initial commit: Next.js 15 project setup with TypeScript and Tailwind"
```

### Step 12: Create Project README

Update the `README.md` file with project-specific information:

```markdown
# Bella Cucina Restaurant Management

A modern restaurant management web application built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- Menu management
- Order processing
- Real-time order status tracking
- Analytics dashboard

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Notifications:** Sonner

## Getting Started

### Prerequisites

- Node.js 18.17 or higher
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000)

## Development

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
├── app/              # Next.js App Router pages
├── lib/              # Utilities, types, and data stores
├── public/           # Static assets
└── tailwind.config.ts # Tailwind configuration
```

## License

Private - All rights reserved
```

## Code Examples

### Example: Basic App Router Page

**File:** `app/page.tsx`

```typescript
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold">Bella Cucina</h1>
        <p className="mt-4 text-lg">Restaurant Management System</p>
      </div>
    </main>
  );
}
```

### Example: Root Layout Structure

**File:** `app/layout.tsx`

```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bella Cucina',
  description: 'Restaurant Management System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

### Example: Next.js Configuration

**File:** `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [], // Add image domains as needed
  },
};

module.exports = nextConfig;
```

## Acceptance Criteria

This task is considered complete when:

1. ✅ Next.js 15 project is initialized in `/Users/noorragu/Documents/vibe-code-demo/`
2. ✅ TypeScript is configured with strict mode enabled
3. ✅ ESLint configuration is present and functional
4. ✅ Tailwind CSS is installed (will be configured in Task 1.3)
5. ✅ Development server runs without errors (`npm run dev`)
6. ✅ Production build completes successfully (`npm run build`)
7. ✅ No TypeScript compilation errors (`npx tsc --noEmit`)
8. ✅ No ESLint errors (`npm run lint`)
9. ✅ Path aliases (`@/*`) are configured in `tsconfig.json`
10. ✅ Project structure matches specifications
11. ✅ README.md contains project information
12. ✅ `.gitignore` includes all necessary patterns

## Testing Strategy

### Manual Testing

1. **Development Server Test**
   ```bash
   npm run dev
   ```
   - Server starts without errors
   - No console warnings
   - Page accessible at http://localhost:3000

2. **Build Test**
   ```bash
   npm run build
   ```
   - Build completes without errors
   - All pages compile successfully
   - No TypeScript errors

3. **Linting Test**
   ```bash
   npm run lint
   ```
   - No linting errors
   - No critical warnings

4. **Type Check Test**
   ```bash
   npx tsc --noEmit
   ```
   - No type errors reported
   - Strict mode is working

### Automated Testing

Create a simple test script to verify configuration:

**File:** `test-setup.js`

```javascript
const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'package.json',
  'tsconfig.json',
  'next.config.js',
  '.eslintrc.json',
  'app/layout.tsx',
  'app/page.tsx',
  'app/globals.css',
];

console.log('Checking project setup...\n');

let allValid = true;

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  const exists = fs.existsSync(filePath);

  if (exists) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allValid = false;
  }
});

// Check package.json dependencies
const packageJson = require('./package.json');
const requiredDeps = ['next', 'react', 'react-dom'];
const requiredDevDeps = ['typescript', '@types/react', '@types/node', 'eslint', 'tailwindcss'];

console.log('\nChecking dependencies...\n');

requiredDeps.forEach(dep => {
  if (packageJson.dependencies[dep]) {
    console.log(`✅ ${dep}`);
  } else {
    console.log(`❌ ${dep} - MISSING`);
    allValid = false;
  }
});

requiredDevDeps.forEach(dep => {
  if (packageJson.devDependencies[dep]) {
    console.log(`✅ ${dep}`);
  } else {
    console.log(`❌ ${dep} - MISSING`);
    allValid = false;
  }
});

// Check TypeScript strict mode
const tsConfig = require('./tsconfig.json');
console.log('\nChecking TypeScript configuration...\n');

if (tsConfig.compilerOptions.strict === true) {
  console.log('✅ Strict mode enabled');
} else {
  console.log('❌ Strict mode not enabled');
  allValid = false;
}

console.log('\n' + (allValid ? '✅ All checks passed!' : '❌ Some checks failed'));
process.exit(allValid ? 0 : 1);
```

Run test:
```bash
node test-setup.js
```

## Common Pitfalls and Debugging Tips

### Pitfall 1: Node.js Version Too Old

**Symptom:** Installation fails with compatibility errors

**Solution:**
```bash
# Update Node.js using nvm (recommended)
nvm install 20
nvm use 20

# Or download from nodejs.org
```

### Pitfall 2: Port 3000 Already in Use

**Symptom:** Error: "Port 3000 is already in use"

**Solution:**
```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

### Pitfall 3: Module Not Found Errors

**Symptom:** Import errors with `@/` prefix

**Solution:**
- Verify `tsconfig.json` has correct `paths` configuration
- Restart TypeScript server in your editor
- Restart development server

### Pitfall 4: Turbopack Issues (Next.js 15)

**Symptom:** Development server errors with Turbopack

**Solution:**
```bash
# Disable Turbopack temporarily
npm run dev -- --no-turbo
```

### Pitfall 5: ESLint Conflicts

**Symptom:** Conflicting ESLint rules or versions

**Solution:**
```bash
# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Pitfall 6: TypeScript Strict Mode Errors

**Symptom:** Numerous type errors after enabling strict mode

**Solution:**
- This is expected - fix errors one by one
- Use `any` type temporarily (with `// @ts-expect-error` comment)
- Gradually improve type coverage

### Debugging Commands

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check for outdated packages
npm outdated

# Verify npm cache
npm cache verify

# Check Node.js and npm versions
node -v && npm -v
```

## Performance Considerations

1. **Installation Speed**
   - Use `npm ci` for faster, reproducible installs (if package-lock.json exists)
   - Consider using `pnpm` or `yarn` for faster installations

2. **Build Optimization**
   - Next.js 15 uses Turbopack by default for faster builds
   - Initial build will take longer than subsequent builds due to caching

3. **Development Experience**
   - Hot Module Replacement (HMR) is automatically enabled
   - TypeScript checking runs in parallel with development server

## Related Tasks

- **Next Task:** [Task 1.2: Install Dependencies](./task-1.2-install-dependencies.md)
- **Dependent Tasks:**
  - Task 1.3: Configure Tailwind CSS (depends on this task)
  - Task 1.4: Create Type Definitions (depends on this task)
  - All subsequent Phase 1 tasks

## Resources and Documentation

### Official Documentation
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [TypeScript Configuration](https://www.typescriptlang.org/tsconfig)
- [ESLint Rules](https://eslint.org/docs/rules/)

### Guides and Tutorials
- [Create Next App CLI](https://nextjs.org/docs/app/api-reference/create-next-app)
- [Next.js TypeScript Guide](https://nextjs.org/docs/app/building-your-application/configuring/typescript)
- [Configuring Absolute Imports](https://nextjs.org/docs/app/building-your-application/configuring/absolute-imports-and-module-aliases)

### Community Resources
- [Next.js GitHub Repository](https://github.com/vercel/next.js)
- [Next.js Discord Community](https://nextjs.org/discord)
- [Stack Overflow - Next.js Tag](https://stackoverflow.com/questions/tagged/next.js)

### Video Tutorials
- [Next.js 15 Overview](https://www.youtube.com/results?search_query=next.js+15+tutorial)
- [App Router Deep Dive](https://www.youtube.com/results?search_query=next.js+app+router)

## Notes

- This task establishes the foundation for the entire project
- Take time to understand the configuration files
- Keep notes of any customizations made
- Document any issues encountered for future reference
- Consider creating a `.env.example` file for environment variables (will be needed in later phases)

---

**Task Status:** Ready for Implementation
**Last Updated:** 2026-02-09
**Version:** 1.0.0
