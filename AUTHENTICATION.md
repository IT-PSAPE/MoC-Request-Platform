# Authentication System

This document describes the authentication and authorization system implemented in the MoC Request Platform.

## Overview

The platform uses a multi-layered authentication system to secure admin routes:

1. **Server-side Protection** - Next.js Middleware
2. **Client-side Protection** - AuthGuard component
3. **Context-based State** - AuthContext for user session management

## Architecture

### 1. Middleware (`middleware.ts`)
- **Purpose**: Server-side route protection
- **Scope**: Protects all `/admin/*` routes
- **Behavior**: 
  - Redirects unauthenticated users to `/login?next=/admin/...`
  - Redirects authenticated users from login page to intended destination
  - Uses Supabase SSR for server-side authentication checks

### 2. AuthGuard Component (`src/components/common/auth-guard.tsx`)
- **Purpose**: Client-side route protection and UX enhancement
- **Features**:
  - Loading states while authentication initializes
  - Automatic redirect to login with return URL
  - Customizable fallback components

### 3. Admin Layout (`src/app/admin/layout.tsx`)
- **Purpose**: Wraps all admin routes with authentication
- **Implementation**: Uses AuthGuard to protect all admin pages

### 4. Enhanced AuthContext (`src/contexts/auth-context.tsx`)
- **Features**:
  - Real-time auth state updates via `onAuthStateChange`
  - Session management and persistence
  - Login/logout functionality with error handling

## Authentication Flow

### Accessing Protected Routes (Admin)
1. User navigates to `/admin` (or any admin route)
2. **Middleware** checks authentication server-side
3. If unauthenticated: Redirect to home page (`/`)
4. If authenticated: Continue to requested page
5. **AuthGuard** provides additional client-side protection

### Smart Home Page Redirects
1. User visits the root page (`/`)
2. **SmartRedirect** component checks authentication status client-side
3. If unauthenticated: Show public home page
4. If authenticated: Automatically redirect to `/admin` dashboard

### Accessing Public Routes
1. User navigates to public routes (`/form`, `/board`, etc.)
2. **No authentication required** - all users can access
3. Public pages display normally regardless of authentication status

### Login Process
1. User manually navigates to `/login` page
2. User enters credentials
3. **LoginForm** submits to Supabase Auth
4. **AuthContext** updates with user session
5. User redirected to `/admin` dashboard

### Logout Process
1. User triggers logout action
2. **AuthContext** calls Supabase signOut
3. Auth state updates via `onAuthStateChange`
4. User redirected to public pages if on admin routes

## Security Features

### Route Protection
- **Double Protection**: Both server-side (middleware) and client-side (AuthGuard)
- **Deep Linking**: Users can bookmark admin URLs and will be redirected back after login
- **Session Validation**: Real-time session validation and updates

### User Experience
- **Loading States**: Smooth transitions with loading indicators
- **Error Handling**: Clear error messages for failed authentication
- **Return URLs**: Users return to intended destination after login

## Configuration

### Required Environment Variables
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Protected Routes
All routes under `/admin/*` are automatically protected by:
- `middleware.ts` - Server-side protection
- `src/app/admin/layout.tsx` - Client-side AuthGuard

## Testing Authentication

### Manual Testing Scenarios
1. **Unauthenticated Access**: Visit `/admin` without logging in
   - Should redirect to home page (`/`)
2. **Smart Home Redirect**: Visit `/` while logged in
   - Should automatically redirect to `/admin` dashboard
3. **Public Home Access**: Visit `/` while NOT logged in
   - Should show the public home page (no redirect)
4. **Public Routes Access**: Visit `/form` or `/board` while logged in or out
   - Should show the page normally (no redirects)
5. **Login Flow**: Login with valid credentials
   - Should redirect to admin dashboard
6. **Logout Flow**: Logout while on admin page
   - Should redirect to public area

### Error Scenarios
1. **Invalid Credentials**: Should show error message
2. **Network Issues**: Should handle gracefully with retry options
3. **Session Expiry**: Should redirect to login automatically

## Customization

### Adding New Protected Routes
1. Routes under `/admin/*` are automatically protected
2. For other routes, wrap components with `<AuthGuard>`
3. Update middleware patterns if needed

### Custom Authentication Logic
- Modify `AuthGuard` for custom redirect behavior
- Update `AuthContext` for additional user properties
- Extend middleware for complex authorization rules

## Dependencies

- `@supabase/ssr` - Server-side Supabase client
- `@supabase/supabase-js` - Client-side Supabase client
- Next.js 13+ App Router - For middleware and layout support
