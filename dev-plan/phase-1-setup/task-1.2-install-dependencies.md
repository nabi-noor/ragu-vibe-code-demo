# Task 1.2: Install Dependencies

**Task ID:** 1.2
**Task Name:** Install Dependencies
**Phase:** 1 - Project Setup & Foundation
**Estimated Time:** 30 minutes
**Complexity:** Low
**Prerequisites:** Task 1.1 (Initialize Next.js)

## Overview

This task involves installing all the required npm packages that the Bella Cucina application will depend on. Beyond the base Next.js dependencies installed in Task 1.1, we'll add essential libraries for UI components (icons), user notifications (toasts), date handling, and development utilities. These dependencies form the toolkit that will be used throughout the application development.

## Importance

Installing the right dependencies upfront is crucial because:

1. **Consistent Icon System** - lucide-react provides a comprehensive, tree-shakeable icon library
2. **User Feedback** - Toast notifications (sonner) are essential for user experience
3. **Type Safety** - Additional TypeScript types ensure compile-time safety
4. **Development Efficiency** - Having all tools available prevents mid-development interruptions
5. **Version Control** - Installing everything now locks compatible versions together
6. **Bundle Size Management** - Selecting lightweight, modern libraries keeps the app performant

## Prerequisites

### Required Completion
- ✅ Task 1.1: Initialize Next.js project completed
- ✅ `package.json` exists in project root
- ✅ Node.js and npm are working correctly

### Verification
```bash
# Verify you're in the correct directory
pwd
# Should output: /Users/noorragu/Documents/vibe-code-demo

# Check package.json exists
ls -la package.json

# Verify npm is functional
npm --version
```

## Technical Specifications

### Core Dependencies

| Package | Version | Purpose | Bundle Impact |
|---------|---------|---------|---------------|
| `lucide-react` | ^0.344.0 | Icon library | ~50KB (tree-shakeable) |
| `sonner` | ^1.3.1 | Toast notifications | ~10KB |
| `clsx` | ^2.1.0 | Conditional class utility | ~1KB |
| `tailwind-merge` | ^2.2.0 | Merge Tailwind classes | ~5KB |

### Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@types/node` | ^20.11.0 | Node.js type definitions |
| `prettier` | ^3.2.0 | Code formatting |
| `prettier-plugin-tailwindcss` | ^0.5.11 | Auto-sort Tailwind classes |

### Why These Specific Packages?

**lucide-react:**
- Modern, well-maintained icon library
- Tree-shakeable (only imports icons you use)
- Consistent design language
- TypeScript support out of the box
- 1000+ icons available

**sonner:**
- Lightweight toast notification library
- Beautiful default styling
- Supports promise-based toasts
- Accessible (ARIA compliant)
- Works seamlessly with React Server Components

**clsx:**
- Tiny utility for constructing className strings
- Conditional classes made easy
- Used by many major projects
- Works perfectly with Tailwind

**tailwind-merge:**
- Intelligently merges Tailwind CSS classes
- Prevents style conflicts
- Essential for component libraries
- Handles specificity correctly

## Files to Modify

### 1. `/Users/noorragu/Documents/vibe-code-demo/package.json`

This file will be automatically updated with new dependencies and their versions.

**Before (from Task 1.1):**
```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "next": "^15.0.0"
  }
}
```

**After (this task):**
```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "next": "^15.0.0",
    "lucide-react": "^0.344.0",
    "sonner": "^1.3.1",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0"
  }
}
```

### 2. `/Users/noorragu/Documents/vibe-code-demo/package-lock.json`

Automatically updated with dependency tree and exact versions for reproducible installs.

### 3. `/Users/noorragu/Documents/vibe-code-demo/.prettierrc` (New File)

Configuration for Prettier code formatter (to be created).

### 4. `/Users/noorragu/Documents/vibe-code-demo/.prettierignore` (New File)

Files to exclude from Prettier formatting (to be created).

## Step-by-Step Implementation Guide

### Step 1: Verify Current Directory and State

Ensure you're in the project root and that Task 1.1 is complete:

```bash
# Navigate to project directory
cd /Users/noorragu/Documents/vibe-code-demo

# Verify Next.js installation
ls app/layout.tsx
# Should exist from Task 1.1

# Check current dependencies
npm list --depth=0
```

### Step 2: Install Core UI Dependencies

Install the main runtime dependencies:

```bash
npm install lucide-react sonner clsx tailwind-merge
```

**What This Command Does:**
- Downloads packages from npm registry
- Installs them in `node_modules/`
- Updates `package.json` dependencies section
- Updates `package-lock.json` with exact versions
- Runs post-install scripts if any

**Expected Output:**
```
added 4 packages, and audited 324 packages in 8s

122 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

**Installation Time:** Approximately 10-20 seconds depending on internet speed.

### Step 3: Install Development Dependencies

Install development-only dependencies (not included in production bundle):

```bash
npm install --save-dev prettier prettier-plugin-tailwindcss
```

**Why `--save-dev`?**
- These tools are only used during development
- They won't be included in production builds
- Keeps production dependencies minimal

**Expected Output:**
```
added 2 packages, and audited 326 packages in 4s

found 0 vulnerabilities
```

### Step 4: Verify Installation

Check that all packages were installed correctly:

```bash
# List all dependencies with versions
npm list --depth=0

# Verify specific packages
npm list lucide-react sonner clsx tailwind-merge prettier
```

**Expected Output:**
```
bella-cucina@0.1.0 /Users/noorragu/Documents/vibe-code-demo
├── lucide-react@0.344.0
├── sonner@1.3.1
├── clsx@2.1.0
├── tailwind-merge@2.2.0
└── prettier@3.2.0
```

### Step 5: Create Prettier Configuration

Create a `.prettierrc` file for consistent code formatting:

```bash
cat > .prettierrc << 'EOF'
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "tabWidth": 2,
  "useTabs": false,
  "printWidth": 100,
  "arrowParens": "avoid",
  "endOfLine": "lf",
  "plugins": ["prettier-plugin-tailwindcss"]
}
EOF
```

**Configuration Explanation:**
- `semi: true` - Use semicolons
- `trailingComma: "es5"` - Trailing commas where valid in ES5
- `singleQuote: true` - Use single quotes
- `tabWidth: 2` - 2 spaces for indentation
- `printWidth: 100` - Wrap lines at 100 characters
- `arrowParens: "avoid"` - Omit parens when possible in arrow functions
- `plugins` - Auto-sort Tailwind classes

### Step 6: Create Prettier Ignore File

Create `.prettierignore` to exclude certain files:

```bash
cat > .prettierignore << 'EOF'
# Dependencies
node_modules/

# Next.js
.next/
out/

# Build outputs
build/
dist/

# Logs
*.log

# Environment
.env
.env*.local

# Misc
.DS_Store
*.pem
package-lock.json
EOF
```

### Step 7: Add Formatting Scripts to package.json

Update `package.json` to include formatting scripts. Open the file and modify the `scripts` section:

**Before:**
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

**After:**
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write \"**/*.{js,jsx,ts,tsx,json,css,md}\"",
    "format:check": "prettier --check \"**/*.{js,jsx,ts,tsx,json,css,md}\""
  }
}
```

**Script Purposes:**
- `format` - Auto-format all files
- `format:check` - Check if files are formatted (useful for CI)

### Step 8: Test Prettier Installation

Run Prettier to format existing files:

```bash
npm run format
```

**Expected Output:**
```
app/layout.tsx 45ms
app/page.tsx 23ms
app/globals.css 12ms
next.config.js 8ms
tailwind.config.ts 15ms
```

### Step 9: Create a Utility File to Test Dependencies

Create a test file to verify all packages are importable:

```bash
mkdir -p lib
cat > lib/test-imports.ts << 'EOF'
// Test file to verify all dependencies are installed correctly
import { Check, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility function combining clsx and tailwind-merge
export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

// Test exports
export const testIcons = { Check, X, Loader2 };
export const testToast = toast;
EOF
```

### Step 10: Verify TypeScript Compilation

Check that TypeScript recognizes all the new packages:

```bash
npx tsc --noEmit
```

**Expected Output:**
```
# No output means success!
# If there are errors, they will be displayed
```

### Step 11: Check for Vulnerabilities

Run npm audit to check for security vulnerabilities:

```bash
npm audit
```

**Expected Output:**
```
found 0 vulnerabilities
```

**If vulnerabilities are found:**
```bash
# Automatically fix vulnerabilities
npm audit fix

# Or fix with breaking changes if needed
npm audit fix --force
```

### Step 12: Update Package.json Metadata

Open `package.json` and ensure all metadata is correct:

```json
{
  "name": "bella-cucina",
  "version": "0.1.0",
  "description": "Restaurant management web application for Bella Cucina",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write \"**/*.{js,jsx,ts,tsx,json,css,md}\"",
    "format:check": "prettier --check \"**/*.{js,jsx,ts,tsx,json,css,md}\""
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "lucide-react": "^0.344.0",
    "sonner": "^1.3.1",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "eslint": "^8.55.0",
    "eslint-config-next": "^15.0.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "prettier": "^3.2.0",
    "prettier-plugin-tailwindcss": "^0.5.11"
  }
}
```

## Code Examples

### Example 1: Using lucide-react Icons

```typescript
// app/test-icons/page.tsx
import { Home, Menu, ShoppingCart, User, Settings } from 'lucide-react';

export default function IconTest() {
  return (
    <div className="flex gap-4 p-8">
      <Home className="h-6 w-6" />
      <Menu className="h-6 w-6" />
      <ShoppingCart className="h-6 w-6" />
      <User className="h-6 w-6" />
      <Settings className="h-6 w-6" />
    </div>
  );
}
```

### Example 2: Using Sonner for Toasts

```typescript
// app/test-toast/page.tsx
'use client';

import { toast } from 'sonner';
import { Toaster } from 'sonner';

export default function ToastTest() {
  return (
    <div className="p-8">
      <Toaster />
      <button
        onClick={() => toast.success('Order placed successfully!')}
        className="rounded bg-blue-500 px-4 py-2 text-white"
      >
        Show Toast
      </button>
    </div>
  );
}
```

### Example 3: Using clsx and tailwind-merge

```typescript
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines clsx and tailwind-merge for conditional classes
 * Handles Tailwind class conflicts intelligently
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Usage example
const buttonClass = cn(
  'px-4 py-2 rounded',
  'bg-blue-500 hover:bg-blue-600',
  isDisabled && 'opacity-50 cursor-not-allowed',
  isLarge ? 'text-lg' : 'text-sm'
);
```

### Example 4: Component Using All Dependencies

```typescript
// components/notification-button.tsx
'use client';

import { Bell, Check } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface NotificationButtonProps {
  count: number;
  className?: string;
}

export function NotificationButton({ count, className }: NotificationButtonProps) {
  const handleClick = () => {
    toast.success('Notifications cleared', {
      icon: <Check className="h-4 w-4" />,
    });
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'relative rounded-full p-2 hover:bg-gray-100',
        count > 0 && 'bg-amber-50',
        className
      )}
    >
      <Bell className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
          {count}
        </span>
      )}
    </button>
  );
}
```

## Acceptance Criteria

This task is considered complete when:

1. ✅ All core dependencies are installed (`lucide-react`, `sonner`, `clsx`, `tailwind-merge`)
2. ✅ All dev dependencies are installed (`prettier`, `prettier-plugin-tailwindcss`)
3. ✅ `package.json` contains all dependencies with correct versions
4. ✅ `package-lock.json` is updated and committed
5. ✅ Prettier configuration file (`.prettierrc`) exists
6. ✅ Prettier ignore file (`.prettierignore`) exists
7. ✅ Format scripts added to `package.json`
8. ✅ `npm run format` executes without errors
9. ✅ `npm run lint` executes without errors
10. ✅ `npx tsc --noEmit` shows no type errors
11. ✅ `npm audit` shows 0 vulnerabilities
12. ✅ All packages can be imported without errors
13. ✅ Test file (`lib/test-imports.ts`) compiles successfully

## Testing Strategy

### Manual Testing

#### Test 1: Verify Package Installation
```bash
# Check all packages are installed
npm list lucide-react sonner clsx tailwind-merge prettier

# Expected: All packages listed with versions
```

#### Test 2: Test Icon Import
Create a test page:
```typescript
// app/test/page.tsx
import { Check, AlertCircle } from 'lucide-react';

export default function Test() {
  return (
    <div className="p-8 flex gap-4">
      <Check className="h-8 w-8 text-green-500" />
      <AlertCircle className="h-8 w-8 text-red-500" />
    </div>
  );
}
```

Run dev server and visit http://localhost:3000/test

#### Test 3: Test Toast Functionality
Create toast test page:
```typescript
// app/test-toast/page.tsx
'use client';

import { toast, Toaster } from 'sonner';

export default function TestToast() {
  return (
    <div className="p-8">
      <Toaster />
      <div className="flex flex-col gap-2">
        <button onClick={() => toast('Basic toast')}>Basic</button>
        <button onClick={() => toast.success('Success!')}>Success</button>
        <button onClick={() => toast.error('Error!')}>Error</button>
      </div>
    </div>
  );
}
```

#### Test 4: Test Utility Function
Create utility test:
```typescript
// lib/utils.test.ts (for manual testing)
import { cn } from './utils';

// Test cases
console.log(cn('px-2', 'px-4')); // Should output: px-4 (last one wins)
console.log(cn('text-red-500', 'text-blue-500')); // Should output: text-blue-500
console.log(cn('p-4', false && 'hidden')); // Should output: p-4
```

#### Test 5: Prettier Formatting
```bash
# Format all files
npm run format

# Check if files would be formatted
npm run format:check
```

### Automated Testing

Create a verification script:

**File:** `scripts/verify-dependencies.js`

```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying dependencies installation...\n');

// Read package.json
const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8')
);

const requiredDependencies = {
  dependencies: ['lucide-react', 'sonner', 'clsx', 'tailwind-merge'],
  devDependencies: ['prettier', 'prettier-plugin-tailwindcss'],
};

let allValid = true;

// Check dependencies
console.log('Dependencies:');
requiredDependencies.dependencies.forEach(dep => {
  if (packageJson.dependencies[dep]) {
    console.log(`  ✅ ${dep} (${packageJson.dependencies[dep]})`);
  } else {
    console.log(`  ❌ ${dep} - MISSING`);
    allValid = false;
  }
});

// Check devDependencies
console.log('\nDev Dependencies:');
requiredDependencies.devDependencies.forEach(dep => {
  if (packageJson.devDependencies[dep]) {
    console.log(`  ✅ ${dep} (${packageJson.devDependencies[dep]})`);
  } else {
    console.log(`  ❌ ${dep} - MISSING`);
    allValid = false;
  }
});

// Check Prettier config
console.log('\nConfiguration Files:');
const prettierRc = fs.existsSync(path.join(__dirname, '../.prettierrc'));
const prettierIgnore = fs.existsSync(path.join(__dirname, '../.prettierignore'));

console.log(`  ${prettierRc ? '✅' : '❌'} .prettierrc`);
console.log(`  ${prettierIgnore ? '✅' : '❌'} .prettierignore`);

if (!prettierRc || !prettierIgnore) allValid = false;

// Check scripts
console.log('\nPackage Scripts:');
const hasFormatScript = packageJson.scripts.format;
const hasFormatCheckScript = packageJson.scripts['format:check'];

console.log(`  ${hasFormatScript ? '✅' : '❌'} format script`);
console.log(`  ${hasFormatCheckScript ? '✅' : '❌'} format:check script`);

if (!hasFormatScript || !hasFormatCheckScript) allValid = false;

console.log('\n' + (allValid ? '✅ All checks passed!' : '❌ Some checks failed'));
process.exit(allValid ? 0 : 1);
```

Make executable and run:
```bash
mkdir -p scripts
# Create the file above, then:
chmod +x scripts/verify-dependencies.js
node scripts/verify-dependencies.js
```

## Common Pitfalls and Debugging Tips

### Pitfall 1: Package Installation Fails

**Symptoms:**
- `npm install` hangs or fails
- "ERESOLVE unable to resolve dependency tree" error

**Solutions:**
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Use legacy peer deps if conflicts persist
npm install --legacy-peer-deps
```

### Pitfall 2: Version Conflicts

**Symptom:** Warnings about peer dependency conflicts

**Solution:**
```bash
# Check for conflicts
npm ls

# Update to compatible versions
npm update

# Or specify exact compatible version
npm install lucide-react@0.344.0 --save-exact
```

### Pitfall 3: Prettier Not Formatting

**Symptoms:**
- `npm run format` doesn't change files
- Formatting is inconsistent

**Solutions:**
1. Check `.prettierrc` exists and is valid JSON
2. Verify `.prettierignore` isn't excluding your files
3. Clear prettier cache:
```bash
npx prettier --clear-cache
npm run format
```

### Pitfall 4: TypeScript Can't Find Packages

**Symptoms:**
- "Cannot find module 'lucide-react'" error
- Import statements have red underlines

**Solutions:**
```bash
# Reinstall dependencies
npm install

# Restart TypeScript server in VS Code
# Cmd+Shift+P → "TypeScript: Restart TS Server"

# Check node_modules exists
ls node_modules/lucide-react
```

### Pitfall 5: Icons Not Displaying

**Symptoms:**
- Icons show as [Object] or don't render
- Console errors about invalid elements

**Solutions:**
```typescript
// ❌ Wrong - importing entire package
import lucide from 'lucide-react';

// ✅ Correct - importing specific icons
import { Home, Menu } from 'lucide-react';

// Use as React components
<Home className="h-6 w-6" />
```

### Pitfall 6: Toast Notifications Not Showing

**Symptoms:**
- `toast()` calls don't show anything
- No errors but no toast appears

**Solutions:**
```typescript
// Make sure Toaster component is rendered
import { Toaster } from 'sonner';

export default function Layout({ children }) {
  return (
    <html>
      <body>
        <Toaster /> {/* Must be included! */}
        {children}
      </body>
    </html>
  );
}
```

### Debugging Commands

```bash
# List all installed packages
npm list --depth=0

# Check specific package version
npm list lucide-react

# View package details
npm info lucide-react

# Check for outdated packages
npm outdated

# Verify package integrity
npm audit

# Reinstall specific package
npm uninstall lucide-react
npm install lucide-react

# Check npm configuration
npm config list
```

## Performance Considerations

### Bundle Size Impact

After installation, analyze bundle size:

```bash
# Build the project
npm run build

# Analyze bundle (Next.js shows size breakdown)
# Look for the package sizes in build output
```

**Expected Sizes:**
- lucide-react: ~2KB per icon (tree-shakeable)
- sonner: ~10KB
- clsx: ~1KB
- tailwind-merge: ~5KB

**Total Impact:** ~18-20KB + icons used

### Optimization Tips

1. **Tree-shake lucide-react:**
```typescript
// ✅ Good - only imports what you need
import { Home, Menu } from 'lucide-react';

// ❌ Bad - imports everything
import * as Icons from 'lucide-react';
```

2. **Use dynamic imports for toast:**
```typescript
// For pages that don't always show toasts
const { toast } = await import('sonner');
```

3. **Minimize utility function usage:**
```typescript
// Only use cn() when you need conditional classes
// For static classes, use string literals
```

## Related Tasks

- **Previous Task:** [Task 1.1: Initialize Next.js](./task-1.1-initialize-nextjs.md)
- **Next Task:** [Task 1.3: Configure Tailwind CSS](./task-1.3-configure-tailwind.md)
- **Dependent Tasks:**
  - Task 1.7: Setup Root Layout (needs Toaster from sonner)
  - Task 1.6: Create Utility Functions (uses clsx and tailwind-merge)
  - All Phase 2+ tasks (use lucide-react icons)

## Resources and Documentation

### Official Documentation
- [lucide-react](https://lucide.dev/guide/packages/lucide-react)
- [Sonner](https://sonner.emilkowal.ski/)
- [clsx](https://github.com/lukeed/clsx)
- [tailwind-merge](https://github.com/dcastil/tailwind-merge)
- [Prettier](https://prettier.io/docs/en/index.html)

### Icon Resources
- [Lucide Icon Search](https://lucide.dev/icons/)
- [Icon Naming Convention](https://lucide.dev/guide/design/icon-design)

### Community Examples
- [Shadcn UI utils.ts](https://ui.shadcn.com/docs/installation/manual) - Uses cn() pattern
- [Next.js Toast Examples](https://github.com/vercel/next.js/tree/canary/examples)

## Notes

- All dependencies are compatible with Next.js 15 and React 18/19
- lucide-react is the React port of Lucide icons (forked from Feather Icons)
- Sonner was chosen over react-hot-toast for better Next.js 15 compatibility
- clsx + tailwind-merge pattern is industry standard for Tailwind projects
- Prettier with Tailwind plugin ensures consistent class ordering

---

**Task Status:** Ready for Implementation
**Last Updated:** 2026-02-09
**Version:** 1.0.0
