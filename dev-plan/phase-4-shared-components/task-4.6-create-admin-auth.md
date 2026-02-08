# Task 4.6: Create Admin Authentication Component

## Task Metadata

- **Task ID**: 4.6
- **Phase**: 4 - Shared Components
- **Complexity**: Medium
- **Estimated Time**: 1.5-2 hours
- **Priority**: Medium
- **Dependencies**: Phase 1 (Setup)
- **Component Type**: Client Component (uses state and browser APIs)

## Overview

The AdminAuth component provides a simple password-protected gate for admin pages. It displays a login form that checks credentials against an environment variable, then stores authentication status in sessionStorage. This component wraps admin pages to prevent unauthorized access while providing a user-friendly authentication experience.

### Importance

- **Access Control**: Prevents unauthorized users from accessing admin features
- **Simple Security**: Basic protection without complex auth systems
- **Session Management**: Maintains login state during browsing session
- **User Experience**: Clean, intuitive login interface
- **Development Speed**: Quick implementation without OAuth setup
- **Privacy**: No user data stored, just session token

### User Experience Goals

1. **Simple Login**: Single password field, no username required
2. **Clear Feedback**: Shows errors for wrong password
3. **Session Persistence**: Stay logged in during session
4. **Easy Logout**: Ability to clear session
5. **Responsive Design**: Works on all devices
6. **Keyboard Friendly**: Submit with Enter key

### Security Considerations

**Important**: This is a basic authentication method suitable for:
- Development/demo environments
- Small internal applications
- Single admin user scenarios
- Low-security requirements

**Not Suitable For**:
- Production applications with sensitive data
- Multiple user accounts
- Public-facing admin panels
- Compliance-required environments (HIPAA, PCI, etc.)

For production, implement proper authentication (NextAuth.js, Auth0, Clerk, etc.).

## Prerequisites

### Required Completions

- ✅ Phase 1 completed (Next.js 15, TypeScript, Tailwind CSS setup)
- ✅ Environment variables configured (.env.local)
- ✅ lucide-react package installed
- ✅ Understanding of React hooks (useState, useEffect)

### Required Knowledge

- React hooks (useState, useEffect)
- Browser sessionStorage API
- Environment variables in Next.js
- Form handling in React
- TypeScript interfaces
- Client vs Server Components

### Verify Prerequisites

```bash
# Check if .env.local exists
ls -la .env.local

# Verify lucide-react
grep "lucide-react" package.json

# Run development server
npm run dev
```

## Technical Specifications

### Component Architecture

```
AdminAuth (Client Component)
├── Authenticated State
│   └── Children (admin content)
└── Unauthenticated State
    └── Login Form
        ├── Password Input
        ├── Submit Button
        ├── Error Message
        └── Logo/Branding
```

### Authentication Flow

```
1. Component Mounts
   ↓
2. Check sessionStorage for 'admin-authenticated'
   ↓
3a. If authenticated → Show children (admin content)
3b. If not → Show login form
   ↓
4. User submits password
   ↓
5. Validate against env variable
   ↓
6a. If valid → Set sessionStorage, update state
6b. If invalid → Show error message
   ↓
7. Authenticated → Render children
```

### Session Management

```typescript
// Storage key
const STORAGE_KEY = 'admin-authenticated'

// Check authentication
const isAuthenticated = sessionStorage.getItem(STORAGE_KEY) === 'true'

// Set authentication
sessionStorage.setItem(STORAGE_KEY, 'true')

// Clear authentication (logout)
sessionStorage.removeItem(STORAGE_KEY)
```

### Styling Theme

- **Container**: Centered with max-width
- **Card**: White background with shadow
- **Input**: Border with focus ring
- **Button**: Amber primary color
- **Error**: Red background with white text
- **Logo**: Amber-600 brand color

## Component Interface

### Props Interface

```typescript
interface AdminAuthProps {
  children: React.ReactNode
  redirectPath?: string // Optional redirect after login
}
```

**Prop Descriptions**:
- `children`: Admin content to show when authenticated (required)
- `redirectPath`: Path to redirect to after login (optional, not implemented in basic version)

### Internal State

```typescript
interface AuthState {
  isAuthenticated: boolean
  password: string
  error: string
  isLoading: boolean
}
```

## Files to Create/Modify

### Create New Files

```
app/components/AdminAuth.tsx
```

### Create/Update Environment File

```
.env.local
```

### Usage in Admin Pages

```
app/admin/page.tsx (wrap admin content)
```

## Step-by-Step Implementation

### Step 1: Configure Environment Variable

Create or update `.env.local`:

```env
# Admin Authentication
NEXT_PUBLIC_ADMIN_PASSWORD=admin123
```

**Important Notes**:
- Use `NEXT_PUBLIC_` prefix to expose to client-side
- Change default password in production
- Never commit .env.local to git (add to .gitignore)

### Step 2: Create Component File

```bash
touch app/components/AdminAuth.tsx
```

### Step 3: Import Dependencies

```typescript
'use client'

import { useState, useEffect } from 'react'
import { Lock, Eye, EyeOff, LogOut } from 'lucide-react'
```

**Explanation**:
- `'use client'`: Required for hooks and browser APIs
- `useState, useEffect`: Manage auth state and session check
- Icons: Lock for security, Eye/EyeOff for password toggle, LogOut for logout button

### Step 4: Define Interfaces

```typescript
interface AdminAuthProps {
  children: React.ReactNode
}

const STORAGE_KEY = 'admin-authenticated'
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'
```

### Step 5: Implement Component Structure

```typescript
export default function AdminAuth({ children }: AdminAuthProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  // Check authentication on mount
  useEffect(() => {
    const authenticated = sessionStorage.getItem(STORAGE_KEY) === 'true'
    setIsAuthenticated(authenticated)
    setIsChecking(false)
  }, [])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulate network delay (optional, for UX)
    await new Promise(resolve => setTimeout(resolve, 500))

    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, 'true')
      setIsAuthenticated(true)
      setPassword('')
    } else {
      setError('Invalid password. Please try again.')
      setPassword('')
    }

    setIsLoading(false)
  }

  // Handle logout
  const handleLogout = () => {
    sessionStorage.removeItem(STORAGE_KEY)
    setIsAuthenticated(false)
    setPassword('')
  }

  // Show loading state while checking session
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600" />
      </div>
    )
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        {/* Login form implementation */}
      </div>
    )
  }

  // Show admin content if authenticated
  return (
    <div>
      {/* Logout button */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-end">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-sm text-gray-600 hover:text-amber-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Admin content */}
      {children}
    </div>
  )
}
```

### Step 6: Implement Login Form UI

```typescript
// Replace login form comment with:
<div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
  <div className="max-w-md w-full space-y-8">

    {/* Logo/Header */}
    <div className="text-center">
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center">
          <Lock className="w-8 h-8 text-white" />
        </div>
      </div>
      <h2 className="mt-6 text-3xl font-bold text-gray-900">
        Admin Access
      </h2>
      <p className="mt-2 text-sm text-gray-600">
        Enter your password to continue
      </p>
    </div>

    {/* Login Form */}
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div className="bg-white rounded-lg shadow-md p-8">

        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start">
            <span className="text-sm text-red-800">{error}</span>
          </div>
        )}

        {/* Password Input */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none transition-all"
              placeholder="Enter admin password"
              required
              disabled={isLoading}
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !password}
          className="w-full mt-6 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              <span>Checking...</span>
            </>
          ) : (
            <span>Access Admin Panel</span>
          )}
        </button>

      </div>

      {/* Helper Text */}
      <p className="text-center text-xs text-gray-500">
        Default password: admin123 (change in .env.local)
      </p>
    </form>

  </div>
</div>
```

**Key Features**:
- **Lock Icon**: Visual security indicator
- **Error Display**: Clear error message above form
- **Password Toggle**: Eye icon to show/hide password
- **Loading State**: Spinner while checking
- **Disabled State**: Button disabled when loading or empty
- **Auto Focus**: Cursor in password field on load
- **Keyboard Submit**: Enter key submits form

## Complete Component Code

```typescript
'use client'

import { useState, useEffect } from 'react'
import { Lock, Eye, EyeOff, LogOut } from 'lucide-react'

interface AdminAuthProps {
  children: React.ReactNode
}

const STORAGE_KEY = 'admin-authenticated'
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'

export default function AdminAuth({ children }: AdminAuthProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  // Check authentication on mount
  useEffect(() => {
    const authenticated = sessionStorage.getItem(STORAGE_KEY) === 'true'
    setIsAuthenticated(authenticated)
    setIsChecking(false)
  }, [])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulate network delay for UX
    await new Promise(resolve => setTimeout(resolve, 500))

    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, 'true')
      setIsAuthenticated(true)
      setPassword('')
    } else {
      setError('Invalid password. Please try again.')
      setPassword('')
    }

    setIsLoading(false)
  }

  // Handle logout
  const handleLogout = () => {
    sessionStorage.removeItem(STORAGE_KEY)
    setIsAuthenticated(false)
    setPassword('')
  }

  // Show loading state while checking session
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600" />
      </div>
    )
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8">

          {/* Logo/Header */}
          <div className="text-center">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center">
                <Lock className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Admin Access
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your password to continue
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">

              {/* Error Message */}
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                  <span className="text-sm text-red-800">{error}</span>
                </div>
              )}

              {/* Password Input */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent outline-none transition-all"
                    placeholder="Enter admin password"
                    required
                    disabled={isLoading}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !password}
                className="w-full mt-6 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    <span>Checking...</span>
                  </>
                ) : (
                  <span>Access Admin Panel</span>
                )}
              </button>

            </div>

            {/* Helper Text */}
            <p className="text-center text-xs text-gray-500">
              Default password: admin123 (change in .env.local)
            </p>
          </form>

        </div>
      </div>
    )
  }

  // Show admin content if authenticated
  return (
    <div>
      {/* Logout Button Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-end">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-sm text-gray-600 hover:text-amber-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Admin Content */}
      {children}
    </div>
  )
}
```

## Usage Examples

### Wrap Admin Page

```typescript
// app/admin/page.tsx
import AdminAuth from '../components/AdminAuth'

export default function AdminPage() {
  return (
    <AdminAuth>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        {/* Admin content here */}
      </div>
    </AdminAuth>
  )
}
```

### Wrap Admin Layout

```typescript
// app/admin/layout.tsx
import AdminAuth from '../components/AdminAuth'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminAuth>{children}</AdminAuth>
}
```

### With Custom Logout Position

```typescript
// Modify AdminAuth to accept logout button customization
interface AdminAuthProps {
  children: React.ReactNode
  showLogoutButton?: boolean
}

// Then use custom logout in admin page
<AdminAuth showLogoutButton={false}>
  <div>
    <MyCustomHeader onLogout={handleLogout} />
    {/* Content */}
  </div>
</AdminAuth>
```

## Acceptance Criteria

### Functional Requirements

- ✅ Shows login form when not authenticated
- ✅ Validates password against environment variable
- ✅ Shows error message for incorrect password
- ✅ Stores authentication in sessionStorage
- ✅ Persists authentication during session
- ✅ Shows admin content when authenticated
- ✅ Logout button clears session
- ✅ Logout redirects to login form
- ✅ Submit works with Enter key
- ✅ Password toggle shows/hides password

### Visual Requirements

- ✅ Centered login form on page
- ✅ Professional, clean design
- ✅ Clear error messages
- ✅ Loading spinner during check
- ✅ Disabled state for button
- ✅ Focus ring on input
- ✅ Hover effects on buttons

### Security Requirements

- ✅ Password from environment variable
- ✅ No password in source code
- ✅ Session-only persistence (not localStorage)
- ✅ Clear session on logout
- ✅ Password field type="password"
- ✅ No password in URL or console

### Accessibility Requirements

- ✅ Proper label for password input
- ✅ Auto-focus on password field
- ✅ Keyboard navigation works
- ✅ Submit with Enter key
- ✅ Clear error announcements
- ✅ Disabled state properly indicated

### Responsive Requirements

- ✅ Works on mobile (375px+)
- ✅ Works on tablet (768px+)
- ✅ Works on desktop (1280px+)
- ✅ Form adapts to screen size
- ✅ Touch-friendly button sizes

## Testing Strategy

### Manual Testing

1. **Login Flow**
   ```
   - Navigate to /admin
   - Verify login form shows
   - Enter wrong password
   - Verify error shows
   - Enter correct password
   - Verify admin content shows
   ```

2. **Session Persistence**
   ```
   - Login to admin
   - Navigate to different page
   - Return to admin
   - Verify still logged in
   - Refresh page
   - Verify still logged in
   ```

3. **Logout Flow**
   ```
   - Login to admin
   - Click logout button
   - Verify redirected to login
   - Verify session cleared
   - Try to access admin again
   - Verify login required
   ```

4. **Password Toggle**
   ```
   - Click eye icon
   - Verify password visible
   - Click again
   - Verify password hidden
   ```

5. **Keyboard Navigation**
   ```
   - Tab to password field
   - Type password
   - Press Enter
   - Verify form submits
   - Tab to eye button
   - Press Space/Enter
   - Verify password toggles
   ```

6. **Edge Cases**
   ```
   - Submit empty password
   - Verify button disabled
   - Open DevTools > Application > Session Storage
   - Manually set 'admin-authenticated' to 'true'
   - Refresh page
   - Verify admin content shows
   ```

### Security Testing

```bash
# 1. Check env variable is used
grep "NEXT_PUBLIC_ADMIN_PASSWORD" app/components/AdminAuth.tsx

# 2. Verify no hardcoded password
grep -r "admin123" app/ --exclude="*.md"

# 3. Check sessionStorage (not localStorage)
grep "sessionStorage" app/components/AdminAuth.tsx
```

### Browser Testing

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Mobile Safari
- Chrome Mobile

## Common Pitfalls

### Pitfall 1: Password in Client Code

**Problem**: Hardcoding password directly in component.

**Cause**: Not using environment variable.

**Solution**:
```typescript
// ❌ Bad
const ADMIN_PASSWORD = 'admin123'

// ✅ Good
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'
```

### Pitfall 2: Using localStorage Instead of sessionStorage

**Problem**: Auth persists after browser close.

**Cause**: Using localStorage which persists indefinitely.

**Solution**: Always use sessionStorage for session-based auth:
```typescript
// ❌ Bad
localStorage.setItem(STORAGE_KEY, 'true')

// ✅ Good
sessionStorage.setItem(STORAGE_KEY, 'true')
```

### Pitfall 3: No Initial Check Loading State

**Problem**: Brief flash of login form even when authenticated.

**Cause**: Not showing loading state during initial session check.

**Solution**:
```typescript
const [isChecking, setIsChecking] = useState(true)

useEffect(() => {
  const authenticated = sessionStorage.getItem(STORAGE_KEY) === 'true'
  setIsAuthenticated(authenticated)
  setIsChecking(false) // Done checking
}, [])

if (isChecking) {
  return <LoadingSpinner />
}
```

### Pitfall 4: Form Submits on Password Toggle

**Problem**: Clicking eye icon submits form.

**Cause**: Button inside form without type="button".

**Solution**:
```typescript
<button
  type="button" // Important!
  onClick={() => setShowPassword(!showPassword)}
>
```

### Pitfall 5: Password Visible in DevTools

**Problem**: Password exposed in React DevTools or console.

**Cause**: Not clearing password after use or logging it.

**Solution**:
```typescript
// Clear password after submit
setPassword('')

// Never log password
// console.log('Password:', password) // ❌ Never do this
```

### Pitfall 6: Multiple AdminAuth Wrappers

**Problem**: Nested AdminAuth components cause multiple login prompts.

**Cause**: Wrapping layout and page both with AdminAuth.

**Solution**: Only wrap at layout level:
```typescript
// ✅ Good - wrap layout
// app/admin/layout.tsx
<AdminAuth>{children}</AdminAuth>

// ❌ Bad - don't also wrap page
// app/admin/page.tsx
<AdminAuth><PageContent /></AdminAuth>
```

### Pitfall 7: Environment Variable Not Loading

**Problem**: Password check always fails.

**Cause**: Env variable not accessible or typo in name.

**Solution**:
```typescript
// Debug: Log to check if env var is loaded
console.log('Env var exists:', !!process.env.NEXT_PUBLIC_ADMIN_PASSWORD)

// Must use NEXT_PUBLIC_ prefix for client-side access
// Must restart dev server after changing .env.local
```

## Enhancement Ideas

### 1. Rate Limiting

Prevent brute force attempts:

```typescript
const [attempts, setAttempts] = useState(0)
const [isLocked, setIsLocked] = useState(false)

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  if (isLocked) {
    setError('Too many attempts. Please wait 5 minutes.')
    return
  }

  if (password !== ADMIN_PASSWORD) {
    const newAttempts = attempts + 1
    setAttempts(newAttempts)

    if (newAttempts >= 5) {
      setIsLocked(true)
      setTimeout(() => {
        setIsLocked(false)
        setAttempts(0)
      }, 5 * 60 * 1000) // 5 minutes
    }
  }
}
```

### 2. Session Timeout

Auto-logout after inactivity:

```typescript
useEffect(() => {
  let timeout: NodeJS.Timeout

  const resetTimeout = () => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      handleLogout()
      alert('Session expired due to inactivity')
    }, 30 * 60 * 1000) // 30 minutes
  }

  const events = ['mousedown', 'keydown', 'scroll', 'touchstart']
  events.forEach(event => {
    window.addEventListener(event, resetTimeout)
  })

  resetTimeout()

  return () => {
    clearTimeout(timeout)
    events.forEach(event => {
      window.removeEventListener(event, resetTimeout)
    })
  }
}, [])
```

### 3. Remember Me Option

```typescript
const [rememberMe, setRememberMe] = useState(false)

const handleSubmit = async (e: React.FormEvent) => {
  // ... validation ...

  const storage = rememberMe ? localStorage : sessionStorage
  storage.setItem(STORAGE_KEY, 'true')
}

// In form:
<label className="flex items-center mt-2">
  <input
    type="checkbox"
    checked={rememberMe}
    onChange={(e) => setRememberMe(e.target.checked)}
  />
  <span className="ml-2 text-sm">Remember me</span>
</label>
```

### 4. Multiple Admin Users

```typescript
const ADMIN_USERS = {
  'admin': process.env.NEXT_PUBLIC_ADMIN_PASSWORD,
  'manager': process.env.NEXT_PUBLIC_MANAGER_PASSWORD,
}

// Add username field
const [username, setUsername] = useState('')

const handleSubmit = async (e: React.FormEvent) => {
  if (ADMIN_USERS[username] === password) {
    sessionStorage.setItem(STORAGE_KEY, 'true')
    sessionStorage.setItem('admin-role', username)
    setIsAuthenticated(true)
  }
}
```

### 5. Redirect After Login

```typescript
interface AdminAuthProps {
  children: React.ReactNode
  redirectPath?: string
}

// Store intended path before login
useEffect(() => {
  if (!isAuthenticated) {
    sessionStorage.setItem('admin-redirect', window.location.pathname)
  }
}, [isAuthenticated])

// Redirect after successful login
if (password === ADMIN_PASSWORD) {
  sessionStorage.setItem(STORAGE_KEY, 'true')
  const redirect = sessionStorage.getItem('admin-redirect') || '/admin'
  sessionStorage.removeItem('admin-redirect')
  window.location.href = redirect
}
```

## Production Considerations

### Upgrade Path to Real Auth

When ready for production, consider these alternatives:

1. **NextAuth.js**
   ```bash
   npm install next-auth
   ```
   - Industry standard for Next.js
   - Supports OAuth providers
   - Built-in session management

2. **Clerk**
   ```bash
   npm install @clerk/nextjs
   ```
   - Drop-in authentication
   - Beautiful UI components
   - User management dashboard

3. **Auth0**
   - Enterprise-grade security
   - Compliance certifications
   - Advanced features

4. **Supabase Auth**
   - Open source
   - Built-in with Supabase
   - Magic links, OAuth

### Migration Strategy

```typescript
// Phase 1: Use AdminAuth (current)
<AdminAuth>{children}</AdminAuth>

// Phase 2: Add proper auth alongside
<AdminAuth fallback={<NextAuthProvider />}>
  {children}
</AdminAuth>

// Phase 3: Remove AdminAuth, use only real auth
<NextAuthProvider>{children}</NextAuthProvider>
```

## Related Tasks

- **Phase 6**: Admin Dashboard (uses AdminAuth wrapper)
- **Phase 6**: Admin pages for order management
- **Future**: User authentication for customer accounts
- **Future**: Multi-user admin roles and permissions

## Troubleshooting

### Issue: Login form shows on every page load

**Solution**: Check sessionStorage in browser DevTools:
```
Application tab > Session Storage > localhost
Verify 'admin-authenticated' key exists with value 'true'
```

### Issue: Environment variable not working

**Solution**:
1. Restart dev server after changing .env.local
2. Verify NEXT_PUBLIC_ prefix
3. Check .env.local is in root directory
4. Log value to console during development

### Issue: Can't logout

**Solution**: Verify logout function clears sessionStorage:
```typescript
const handleLogout = () => {
  sessionStorage.removeItem(STORAGE_KEY)
  setIsAuthenticated(false)
}
```

### Issue: Flash of login form when authenticated

**Solution**: Add initial loading state:
```typescript
const [isChecking, setIsChecking] = useState(true)

if (isChecking) {
  return <LoadingSpinner />
}
```

## Resources

- [sessionStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [NextAuth.js](https://next-auth.js.org/)
- [Clerk Documentation](https://clerk.com/docs)
- [Web Security Best Practices](https://owasp.org/www-project-web-security-testing-guide/)

## Completion Checklist

- [ ] Component file created
- [ ] Environment variable configured
- [ ] Login form implemented
- [ ] Password validation working
- [ ] Error messages display correctly
- [ ] Session storage working
- [ ] Logout button functional
- [ ] Password toggle working
- [ ] Loading states implemented
- [ ] Keyboard navigation working
- [ ] Manual testing complete
- [ ] Responsive design verified
- [ ] Accessibility tested
- [ ] Security review done
- [ ] No console warnings
- [ ] Documentation complete

**Phase 4 Complete**: All shared components implemented! Ready for Phase 5!
