# Task 8.1: Prepare for Deployment

## Task Metadata

| Property | Value |
|----------|-------|
| **Task ID** | 8.1 |
| **Task Name** | Prepare for Deployment |
| **Phase** | Phase 8: Deployment & Documentation |
| **Estimated Time** | 2-3 hours |
| **Priority** | Critical |
| **Status** | Not Started |
| **Dependencies** | Phase 7 (Authentication & Admin Panel) Complete |
| **Assignee** | Lead Developer |

## Overview

Task 8.1 focuses on preparing the Bella Cucina application for production deployment. This critical preparation phase ensures that all environment variables are properly configured, the production build is tested and optimized, security measures are in place, and potential issues are identified and resolved before deploying to a live environment.

Proper deployment preparation prevents costly mistakes, downtime, and security vulnerabilities in production. This task serves as a quality gate between development and production, ensuring that only production-ready code reaches end users.

## Importance & Impact

### Why This Task Matters

1. **Security**: Proper environment variable management prevents exposure of sensitive data
2. **Performance**: Production build optimization ensures fast page loads and good user experience
3. **Reliability**: Testing the build locally identifies issues before they affect users
4. **Maintainability**: Clear documentation of environment variables helps future developers
5. **Cost Efficiency**: Catching issues pre-deployment saves debugging time in production

### Impact on Project

- **High Impact**: Proper preparation prevents production failures and security breaches
- **Risk Reduction**: Identifies and resolves issues in safe environment
- **Quality Assurance**: Ensures application meets production standards
- **Team Efficiency**: Clear documentation accelerates future deployments

## Prerequisites

### Required Completed Work

- [x] Phase 1: Project setup and UI components complete
- [x] Phase 2: Menu and gallery functionality complete
- [x] Phase 3: Reservation system complete
- [x] Phase 4: Contact and location features complete
- [x] Phase 5: Chef's specials and promotions complete
- [x] Phase 6: Performance optimization complete
- [x] Phase 7: Authentication and admin panel complete

### Required Knowledge

- Understanding of Next.js build process
- Knowledge of environment variables and their security implications
- Familiarity with Node.js production best practices
- Basic understanding of web security concepts
- Experience with package management (npm/yarn)

### Required Tools & Access

- Node.js 18+ installed
- Git repository with latest code
- MongoDB Atlas database configured
- Code editor (VS Code recommended)
- Terminal/command line access
- Access to all environment variable values

### System Requirements

- Minimum 4GB RAM for build process
- 2GB free disk space
- Stable internet connection
- Updated web browser for testing

## Technical Specifications

### Environment Variables Architecture

#### Development vs Production Variables

**Development Variables** (`.env.local`)
- Use localhost URLs
- Development database
- Debug mode enabled
- Verbose logging
- Test API keys

**Production Variables** (Vercel Dashboard)
- Production domain URLs
- Production database
- Debug mode disabled
- Error logging only
- Live API keys

#### Required Environment Variables

```plaintext
# Application Configuration
NEXT_PUBLIC_APP_URL=              # Your production domain URL
NEXT_PUBLIC_APP_NAME=             # "Bella Cucina"
NODE_ENV=                         # "production"

# Database Configuration
MONGODB_URI=                      # MongoDB Atlas connection string
MONGODB_DB_NAME=                  # "bella_cucina"

# Authentication Configuration
NEXTAUTH_URL=                     # Same as NEXT_PUBLIC_APP_URL
NEXTAUTH_SECRET=                  # Random secure string (32+ chars)
NEXTAUTH_URL_INTERNAL=            # Usually same as NEXTAUTH_URL

# Admin User Configuration
ADMIN_EMAIL=                      # Default admin email
ADMIN_PASSWORD=                   # Default admin password (hash on first use)

# Email Service (Optional)
SMTP_HOST=                        # smtp.gmail.com or other provider
SMTP_PORT=                        # 587 for TLS
SMTP_USER=                        # Email address
SMTP_PASSWORD=                    # App-specific password
SMTP_FROM=                        # noreply@bellacucina.com

# External Services (Optional)
GOOGLE_MAPS_API_KEY=              # For maps integration
RECAPTCHA_SITE_KEY=               # For form protection
RECAPTCHA_SECRET_KEY=             # Server-side verification

# Analytics & Monitoring (Optional)
NEXT_PUBLIC_GA_ID=                # Google Analytics tracking ID
SENTRY_DSN=                       # Error tracking
SENTRY_AUTH_TOKEN=                # Sentry authentication

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=     # true/false
NEXT_PUBLIC_ENABLE_NEWSLETTER=    # true/false
NEXT_PUBLIC_MAINTENANCE_MODE=     # true/false
```

### Build Configuration

#### next.config.js Production Settings

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better error detection
  reactStrictMode: true,

  // Optimize production build
  swcMinify: true,

  // Image optimization
  images: {
    domains: ['res.cloudinary.com', 'images.unsplash.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ];
  },

  // Compression
  compress: true,

  // Generate standalone build for optimal deployment
  output: 'standalone',

  // Environment variables to expose to client
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  },

  // Redirects and rewrites
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
```

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "format": "prettier --write \"**/*.{js,jsx,ts,tsx,json,md}\"",
    "analyze": "ANALYZE=true next build",
    "clean": "rm -rf .next out node_modules/.cache"
  }
}
```

## Step-by-Step Implementation Guide

### Step 1: Review Current Environment Variables

**Time Estimate**: 15 minutes

#### 1.1 Audit Existing Variables

```bash
# Check current .env.local file
cat .env.local

# List all environment variables used in code
grep -r "process.env" --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" .
```

#### 1.2 Document All Variables

Create a spreadsheet or document listing:
- Variable name
- Purpose
- Example value
- Required vs optional
- Where it's used
- Security level (public/secret)

#### 1.3 Verify All Values

- [ ] All MongoDB connection strings valid
- [ ] Authentication secrets generated
- [ ] API keys functional
- [ ] Email credentials tested
- [ ] External service credentials verified

### Step 2: Create .env.example Template

**Time Estimate**: 20 minutes

#### 2.1 Create the File

```bash
# Navigate to project root
cd /Users/noorragu/Documents/vibe-code-demo

# Create .env.example
touch .env.example
```

#### 2.2 Populate with Template

```plaintext
# ====================================
# BELLA CUCINA - Environment Variables
# ====================================
#
# Instructions:
# 1. Copy this file to .env.local
# 2. Fill in all required values
# 3. NEVER commit .env.local to Git
# 4. Update this template when adding new variables
#

# ====================================
# APPLICATION CONFIGURATION
# ====================================
# The base URL of your application
# Development: http://localhost:3000
# Production: https://your-domain.com
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Application name displayed in browser
NEXT_PUBLIC_APP_NAME=Bella Cucina

# Node environment (development|production|test)
NODE_ENV=development

# ====================================
# DATABASE CONFIGURATION
# ====================================
# MongoDB Atlas connection string
# Format: mongodb+srv://username:password@cluster.mongodb.net/database
# Get from: MongoDB Atlas Dashboard > Connect > Connect your application
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bella_cucina?retryWrites=true&w=majority

# Database name
MONGODB_DB_NAME=bella_cucina

# ====================================
# AUTHENTICATION CONFIGURATION
# ====================================
# NextAuth URL - should match your application URL
NEXTAUTH_URL=http://localhost:3000

# NextAuth Secret - Generate with: openssl rand -base64 32
# CRITICAL: Keep this secret and unique per environment
NEXTAUTH_SECRET=your-secret-key-here-min-32-characters

# Internal URL for NextAuth (usually same as NEXTAUTH_URL)
NEXTAUTH_URL_INTERNAL=http://localhost:3000

# ====================================
# ADMIN USER CONFIGURATION
# ====================================
# Default admin credentials for initial setup
# CHANGE THESE in production!
ADMIN_EMAIL=admin@bellacucina.com
ADMIN_PASSWORD=ChangeThisPassword123!

# ====================================
# EMAIL SERVICE CONFIGURATION
# ====================================
# SMTP Server Configuration
# Gmail users: Enable 2FA and create app-specific password
# Gmail SMTP: smtp.gmail.com, Port: 587
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-specific-password
SMTP_FROM=noreply@bellacucina.com

# ====================================
# EXTERNAL SERVICES (OPTIONAL)
# ====================================
# Google Maps API Key
# Get from: https://console.cloud.google.com/google/maps-apis
GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Google reCAPTCHA v3 Keys
# Get from: https://www.google.com/recaptcha/admin
RECAPTCHA_SITE_KEY=your-recaptcha-site-key
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key

# ====================================
# ANALYTICS & MONITORING (OPTIONAL)
# ====================================
# Google Analytics Measurement ID
# Get from: https://analytics.google.com/
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Sentry Error Tracking
# Get from: https://sentry.io/
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
SENTRY_AUTH_TOKEN=your-sentry-auth-token

# ====================================
# FEATURE FLAGS
# ====================================
# Enable/disable features without code changes
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_NEWSLETTER=true
NEXT_PUBLIC_MAINTENANCE_MODE=false

# ====================================
# DEVELOPMENT ONLY
# ====================================
# Show detailed error messages (disable in production)
NEXT_PUBLIC_SHOW_DEBUG=false

# Disable Telemetry (optional)
NEXT_TELEMETRY_DISABLED=1
```

#### 2.3 Add Security Notes

Add to `.env.example`:

```plaintext
# ====================================
# SECURITY NOTES
# ====================================
#
# CRITICAL SECURITY GUIDELINES:
#
# 1. NEVER commit .env.local or any file with actual secrets
# 2. Use different secrets for development and production
# 3. Rotate secrets regularly (every 90 days recommended)
# 4. Use strong, randomly generated secrets (32+ characters)
# 5. Limit access to production environment variables
# 6. Use environment-specific databases (dev vs production)
# 7. Enable 2FA on all service accounts (MongoDB, Vercel, etc.)
# 8. Monitor for exposed secrets using tools like GitGuardian
#
# SECRET GENERATION COMMANDS:
#
# Generate random secret:
#   openssl rand -base64 32
#
# Generate UUID:
#   uuidgen
#
# Generate strong password:
#   openssl rand -base64 24
#
# ====================================
```

### Step 3: Verify .gitignore Configuration

**Time Estimate**: 10 minutes

#### 3.1 Check .gitignore

```bash
# View current .gitignore
cat .gitignore
```

#### 3.2 Ensure Environment Files Excluded

Verify `.gitignore` includes:

```plaintext
# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.env*.local

# Vercel
.vercel

# Build outputs
.next/
out/
build/
dist/

# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Testing
coverage/
.nyc_output/

# Misc
*.log
.cache/
```

#### 3.3 Verify No Secrets in Git History

```bash
# Check if any env files are tracked
git ls-files | grep -E "\.env"

# If any found, remove from Git
git rm --cached .env.local
git commit -m "Remove environment file from Git"
```

### Step 4: Run Production Build Test

**Time Estimate**: 30 minutes

#### 4.1 Clean Previous Builds

```bash
# Remove previous build artifacts
rm -rf .next out node_modules/.cache

# Optional: Fresh dependency install
rm -rf node_modules package-lock.json
npm install
```

#### 4.2 Run Type Checking

```bash
# Check TypeScript types
npm run type-check

# If errors found, fix them before proceeding
```

#### 4.3 Run Linting

```bash
# Check code quality
npm run lint

# Auto-fix issues
npm run lint:fix
```

#### 4.4 Build Production Bundle

```bash
# Create production build
npm run build
```

#### 4.5 Analyze Build Output

Review the build output for:

- **Build time**: Should complete in < 5 minutes
- **Page sizes**: All pages should be < 200KB
- **Errors**: Must have zero errors
- **Warnings**: Review and address if critical

Example output:
```
Route (app)                              Size     First Load JS
┌ ○ /                                    5.2 kB          95 kB
├ ○ /menu                                8.4 kB          98 kB
├ ○ /reservations                        12 kB          102 kB
├ ○ /contact                             4.8 kB          94 kB
├ ○ /admin                               15 kB          105 kB
└ ○ /admin/bookings                      18 kB          108 kB

○  (Static)  automatically rendered as static HTML
```

#### 4.6 Start Production Server Locally

```bash
# Start production server
npm run start
```

#### 4.7 Test Production Build

Open browser to `http://localhost:3000` and test:

- [ ] Home page loads correctly
- [ ] Navigation works on all pages
- [ ] Images load properly
- [ ] Menu displays correctly
- [ ] Reservation form works
- [ ] Contact form works
- [ ] Admin login works
- [ ] Admin panel accessible
- [ ] Booking management works
- [ ] All API routes functional
- [ ] No console errors
- [ ] Styles applied correctly
- [ ] Mobile responsive
- [ ] Fast page transitions

### Step 5: Security Audit

**Time Estimate**: 25 minutes

#### 5.1 Check for Exposed Secrets

```bash
# Search for potential hardcoded secrets
grep -r "password\|secret\|api_key\|mongodb" --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" src/

# Check for console.log statements that might expose data
grep -r "console.log" --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" src/
```

#### 5.2 Review API Route Security

Check each API route in `src/app/api/` for:

```typescript
// Verify authentication checks
if (!session) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

// Verify input validation
if (!email || !isValidEmail(email)) {
  return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
}

// Verify error handling doesn't expose sensitive info
catch (error) {
  console.error('Error:', error); // Log for debugging
  return NextResponse.json(
    { error: 'Internal server error' }, // Generic message to client
    { status: 500 }
  );
}
```

#### 5.3 Run Security Audit

```bash
# Check for known vulnerabilities
npm audit

# If vulnerabilities found, fix them
npm audit fix

# For breaking changes, review manually
npm audit fix --force
```

#### 5.4 Verify HTTPS Enforcement

Check `next.config.js` includes security headers (see Technical Specifications section)

#### 5.5 Review Authentication Configuration

Verify in `src/app/api/auth/[...nextauth]/route.ts`:

```typescript
// Ensure secure session configuration
session: {
  strategy: "jwt",
  maxAge: 30 * 24 * 60 * 60, // 30 days
},

// Ensure secure cookies
cookies: {
  sessionToken: {
    name: `__Secure-next-auth.session-token`,
    options: {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: true, // HTTPS only
    },
  },
},
```

### Step 6: Performance Optimization

**Time Estimate**: 20 minutes

#### 6.1 Optimize Images

```bash
# Check for unoptimized images
find public -type f \( -iname "*.jpg" -o -iname "*.png" \) -exec ls -lh {} \;
```

Verify all images use Next.js Image component:

```tsx
// Good
import Image from 'next/image';
<Image src="/images/hero.jpg" alt="Hero" width={1920} height={1080} />

// Bad
<img src="/images/hero.jpg" alt="Hero" />
```

#### 6.2 Check Bundle Size

```bash
# Analyze bundle size
npm run analyze

# Or manually check build output
npm run build
```

#### 6.3 Verify Code Splitting

Ensure dynamic imports for large components:

```tsx
// Dynamic import for heavy components
import dynamic from 'next/dynamic';

const AdminPanel = dynamic(() => import('@/components/AdminPanel'), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});
```

#### 6.4 Check Font Loading

Verify font optimization in layout:

```tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});
```

### Step 7: Create Deployment Checklist

**Time Estimate**: 15 minutes

Create file: `DEPLOYMENT_CHECKLIST.md`

```markdown
# Bella Cucina - Production Deployment Checklist

## Pre-Deployment

### Code Quality
- [ ] All TypeScript errors resolved
- [ ] All ESLint warnings addressed
- [ ] Code formatted with Prettier
- [ ] No console.log statements in production code
- [ ] All TODO comments resolved or documented

### Testing
- [ ] All features tested in development
- [ ] Production build tested locally
- [ ] All forms validated and working
- [ ] Authentication flow tested
- [ ] Admin panel tested
- [ ] API routes tested
- [ ] Error handling tested
- [ ] Mobile responsiveness verified

### Security
- [ ] No hardcoded secrets in code
- [ ] .env.local not in Git
- [ ] .env.example up to date
- [ ] npm audit shows no critical vulnerabilities
- [ ] All API routes protected
- [ ] Input validation on all forms
- [ ] Security headers configured
- [ ] CORS configured correctly

### Database
- [ ] MongoDB Atlas cluster created
- [ ] Database connection string obtained
- [ ] Database user created with appropriate permissions
- [ ] IP whitelist configured (allow all: 0.0.0.0/0)
- [ ] Database indexes created
- [ ] Test data populated (if needed)

### Environment Variables
- [ ] All required variables documented
- [ ] Production values prepared
- [ ] NEXTAUTH_SECRET generated (32+ chars)
- [ ] NEXTAUTH_URL set to production domain
- [ ] MONGODB_URI points to production database
- [ ] ADMIN_EMAIL and ADMIN_PASSWORD set

### Configuration
- [ ] next.config.js optimized for production
- [ ] Security headers configured
- [ ] Image domains whitelisted
- [ ] Redirects configured (if needed)
- [ ] robots.txt created
- [ ] sitemap.xml generated

### Assets
- [ ] All images optimized
- [ ] Favicon added
- [ ] Open Graph images added
- [ ] All external assets accessible

## Deployment

### Vercel Setup
- [ ] Vercel account created
- [ ] GitHub repository connected
- [ ] Project imported to Vercel
- [ ] Environment variables configured
- [ ] Build settings configured
- [ ] Domain configured (if custom domain)

### Initial Deployment
- [ ] First deployment successful
- [ ] Build logs reviewed
- [ ] No build errors
- [ ] No runtime errors

## Post-Deployment

### Verification
- [ ] Production URL accessible
- [ ] Home page loads
- [ ] All pages accessible
- [ ] Images loading correctly
- [ ] Styles applied correctly
- [ ] Navigation working
- [ ] Forms submitting
- [ ] API routes functional
- [ ] Database connection working
- [ ] Authentication working
- [ ] Admin panel accessible

### Testing
- [ ] Mobile responsiveness checked
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Performance audit (Lighthouse > 90)
- [ ] SEO audit (Lighthouse > 90)
- [ ] Accessibility audit (Lighthouse > 90)
- [ ] SSL certificate active

### Monitoring
- [ ] Error tracking configured
- [ ] Analytics configured
- [ ] Vercel analytics enabled
- [ ] Database monitoring enabled

### Documentation
- [ ] README updated
- [ ] Deployment documented
- [ ] Environment variables documented
- [ ] API documented

## Rollback Plan

If deployment fails:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test database connection
4. Review build errors
5. Rollback to previous deployment if necessary
6. Fix issues in development
7. Redeploy when ready

## Support

- Vercel Status: https://www.vercel-status.com/
- Vercel Support: support@vercel.com
- MongoDB Support: https://www.mongodb.com/support
```

### Step 8: Document Environment Variables

**Time Estimate**: 15 minutes

Create file: `docs/ENVIRONMENT_VARIABLES.md`

```markdown
# Environment Variables Documentation

## Overview

This document describes all environment variables used in the Bella Cucina application, their purposes, and how to obtain their values.

## Required Variables

### NEXT_PUBLIC_APP_URL

**Purpose**: Base URL of the application
**Type**: Public (exposed to client)
**Required**: Yes
**Example**: `https://bella-cucina.vercel.app`

**How to set**:
- Development: `http://localhost:3000`
- Production: Your Vercel deployment URL or custom domain

---

### MONGODB_URI

**Purpose**: MongoDB database connection string
**Type**: Secret (server-side only)
**Required**: Yes
**Example**: `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/bella_cucina`

**How to obtain**:
1. Go to MongoDB Atlas dashboard
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace <password> with your database user password

**Security notes**:
- Never commit this to Git
- Use different databases for dev and production
- Use IP whitelist in production (or 0.0.0.0/0 for Vercel)

---

### NEXTAUTH_SECRET

**Purpose**: Secret key for encrypting JWT tokens
**Type**: Secret (server-side only)
**Required**: Yes
**Example**: `your-super-secret-key-min-32-chars-long`

**How to generate**:
```bash
openssl rand -base64 32
```

**Security notes**:
- Must be at least 32 characters
- Use different secrets for dev and production
- Never expose this value
- Rotate every 90 days

---

### NEXTAUTH_URL

**Purpose**: Canonical URL for NextAuth.js
**Type**: Secret (server-side only)
**Required**: Yes
**Example**: `https://bella-cucina.vercel.app`

**How to set**:
- Must match your actual deployment URL
- Include protocol (https://)
- No trailing slash

---

## Optional Variables

### SMTP_* (Email Configuration)

**Purpose**: Send emails for booking confirmations
**Type**: Secret (server-side only)
**Required**: No (if email features not used)

**Gmail Setup**:
1. Enable 2-Factor Authentication
2. Generate app-specific password
3. Use these settings:
   - SMTP_HOST=`smtp.gmail.com`
   - SMTP_PORT=`587`
   - SMTP_USER=`your-email@gmail.com`
   - SMTP_PASSWORD=`your-app-password`

---

### GOOGLE_MAPS_API_KEY

**Purpose**: Display interactive maps
**Type**: Public (with restrictions)
**Required**: No

**How to obtain**:
1. Go to Google Cloud Console
2. Enable Maps JavaScript API
3. Create credentials
4. Restrict by HTTP referrer

---

## Environment-Specific Configuration

### Development (.env.local)

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
MONGODB_URI=mongodb+srv://...dev-database...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=development-secret-key-32-chars-plus
NODE_ENV=development
```

### Production (Vercel Dashboard)

```env
NEXT_PUBLIC_APP_URL=https://bella-cucina.vercel.app
MONGODB_URI=mongodb+srv://...production-database...
NEXTAUTH_URL=https://bella-cucina.vercel.app
NEXTAUTH_SECRET=production-secret-different-from-dev
NODE_ENV=production
```

## Troubleshooting

### Issue: "NEXTAUTH_SECRET not set"

**Solution**: Generate and set NEXTAUTH_SECRET in Vercel dashboard

### Issue: "Cannot connect to MongoDB"

**Solutions**:
- Verify connection string format
- Check database user credentials
- Verify IP whitelist (use 0.0.0.0/0 for Vercel)
- Ensure database user has read/write permissions

### Issue: "Environment variable undefined in production"

**Solutions**:
- Verify variable is set in Vercel dashboard
- Check variable name spelling (case-sensitive)
- For client-side variables, ensure NEXT_PUBLIC_ prefix
- Redeploy after adding new variables

## Best Practices

1. **Never commit secrets**: Use .env.local for local development
2. **Use different values**: Dev and production should have different secrets
3. **Document everything**: Update .env.example when adding variables
4. **Rotate secrets**: Change passwords and secrets regularly
5. **Limit access**: Only give team members access to secrets they need
6. **Monitor for leaks**: Use tools like GitGuardian
7. **Use strong secrets**: Minimum 32 characters, randomly generated
8. **Prefix public vars**: Only NEXT_PUBLIC_* variables are exposed to browser
```

## Acceptance Criteria

### Build Requirements
- [ ] Production build completes without errors
- [ ] Production build starts and runs locally
- [ ] All pages accessible in production build
- [ ] No console errors in production build
- [ ] Build time under 5 minutes
- [ ] Total bundle size under 250KB (gzipped)

### Documentation Requirements
- [ ] `.env.example` created with all variables documented
- [ ] `.env.example` committed to Git
- [ ] `.env.local` added to `.gitignore`
- [ ] Environment variables documented in separate file
- [ ] Deployment checklist created
- [ ] Security notes documented

### Security Requirements
- [ ] No hardcoded secrets in code
- [ ] No sensitive data in Git history
- [ ] npm audit shows no critical vulnerabilities
- [ ] All API routes have authentication checks
- [ ] Input validation on all forms
- [ ] Security headers configured
- [ ] Error messages don't expose sensitive info

### Configuration Requirements
- [ ] `next.config.js` optimized for production
- [ ] Security headers configured
- [ ] Image optimization configured
- [ ] Compression enabled
- [ ] Standalone output configured

### Testing Requirements
- [ ] All features tested in production build locally
- [ ] Authentication flow works in production build
- [ ] Database operations work in production build
- [ ] Forms submit successfully
- [ ] Admin panel accessible and functional

## Common Issues & Solutions

### Issue 1: Build Fails with "Module not found"

**Symptoms**:
```
Error: Cannot find module '@/components/Header'
```

**Causes**:
- Incorrect import path
- File renamed but imports not updated
- Case sensitivity issues

**Solutions**:
```bash
# Check import paths
grep -r "@/components/Header" src/

# Verify file exists
ls -la src/components/Header.tsx

# Fix import to match actual filename
```

### Issue 2: Environment Variables Undefined in Production Build

**Symptoms**:
```
console.log(process.env.MONGODB_URI); // undefined
```

**Causes**:
- Variable not set in environment
- Typo in variable name
- Client-side code accessing server-side variable

**Solutions**:
- Verify variable set: `echo $MONGODB_URI`
- Check spelling (case-sensitive)
- Use NEXT_PUBLIC_ prefix for client-side variables
- Verify .env.local is in project root

### Issue 3: Build Success but Pages Show 404

**Symptoms**:
- Build completes successfully
- Starting production server works
- All pages return 404

**Causes**:
- Incorrect routing configuration
- Missing page files
- Server not restarted after build

**Solutions**:
```bash
# Rebuild
npm run build

# Start fresh
npm run start

# Check route files exist
ls -la src/app
```

### Issue 4: Large Bundle Size

**Symptoms**:
```
First Load JS shared by all: 350 kB (warning)
```

**Causes**:
- Large dependencies included
- No code splitting
- Unoptimized imports

**Solutions**:
```typescript
// Use dynamic imports
import dynamic from 'next/dynamic';
const Heavy = dynamic(() => import('./Heavy'));

// Import only what you need
import { useState } from 'react'; // Good
import * as React from 'react'; // Bad

// Analyze bundle
npm run analyze
```

### Issue 5: "npm audit" Shows Vulnerabilities

**Symptoms**:
```
found 3 high severity vulnerabilities
```

**Solutions**:
```bash
# Try automatic fix
npm audit fix

# For breaking changes
npm audit fix --force

# Review manually
npm audit

# Update specific package
npm update package-name
```

### Issue 6: Images Not Loading in Production

**Symptoms**:
- Images show broken icon
- Console error: "Invalid src prop"

**Causes**:
- Image domain not in next.config.js
- Incorrect image path
- Missing Image component import

**Solutions**:
```javascript
// Add domain to next.config.js
images: {
  domains: ['example.com'],
}

// Use correct path
<Image src="/images/hero.jpg" /> // Relative to public/

// Verify import
import Image from 'next/image';
```

## Testing Strategy

### Local Production Build Testing

1. **Clean build**:
   ```bash
   rm -rf .next
   npm run build
   ```

2. **Start production server**:
   ```bash
   npm run start
   ```

3. **Test checklist**:
   - [ ] Home page loads
   - [ ] All navigation links work
   - [ ] Images display correctly
   - [ ] Styles applied correctly
   - [ ] Forms submit successfully
   - [ ] API routes respond correctly
   - [ ] Authentication works
   - [ ] Admin panel accessible
   - [ ] No console errors
   - [ ] Fast page transitions

### Performance Testing

```bash
# Run Lighthouse audit
# Open Chrome DevTools > Lighthouse > Run audit

# Check Core Web Vitals
# Use PageSpeed Insights: https://pagespeed.web.dev/
```

**Target scores**:
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 95
- SEO: > 95

### Security Testing

```bash
# Check for vulnerabilities
npm audit

# Check for exposed secrets
git log -p | grep -i "password\|secret\|key"

# Verify security headers
curl -I http://localhost:3000
```

## Related Tasks

- **Task 8.2**: Deploy to Vercel (uses environment variables configured in this task)
- **Task 8.3**: Create Project README (references environment variables documentation)
- **Task 8.4**: Create API Documentation (includes environment configuration)
- **Task 8.5**: Testing & Bug Fixes (uses production build for testing)

## Resources

### Official Documentation
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [MongoDB Atlas Setup](https://docs.atlas.mongodb.com/)
- [NextAuth.js Configuration](https://next-auth.js.org/configuration/options)

### Tools
- [OpenSSL](https://www.openssl.org/) - Generate secure secrets
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit) - Security auditing
- [Next.js Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer) - Analyze bundle size

### Best Practices
- [12 Factor App](https://12factor.net/) - Environment configuration principles
- [OWASP Security Guide](https://owasp.org/) - Security best practices

## Completion Checklist

Before moving to Task 8.2, ensure:

- [ ] Production build successful locally
- [ ] All environment variables documented
- [ ] .env.example created and committed
- [ ] Security audit passed
- [ ] No build errors or warnings
- [ ] All features tested in production build
- [ ] Documentation complete and clear
- [ ] Team reviewed and approved
- [ ] Ready for Vercel deployment

**Estimated completion time**: 2-3 hours
**Next task**: Task 8.2 - Deploy to Vercel
