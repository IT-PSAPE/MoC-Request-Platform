# MOC Request Platform

A comprehensive Next.js (App Router) + Tailwind CSS application for the Ministry of Culture to manage requests and assistance submissions. Features a Supabase backend, real-time notifications via Telegram, and a modern Progressive Web App (PWA) experience.

## 🚀 Live Application

**Production:** [https://request.psape.co.za](https://request.psape.co.za)

## ✨ Features

- **📱 Progressive Web App (PWA)** - Install on mobile/desktop devices
- **🔐 Authentication** - Secure Supabase Auth with server-side protection
- **⚡ Real-time Updates** - Live data synchronization across all users
- **📱 Telegram Notifications** - Instant notifications for new requests
- **🎯 Request Management** - Complete CRUD operations with 5W+1H methodology
- **📊 Admin Dashboard** - Comprehensive management with Kanban and list views
- **🎨 Modern UI** - Clean, responsive design with dark/light theme support
- **⚡ Fast Caching** - Optimized with TanStack Query for lightning-fast UX

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS v4
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **State Management:** TanStack Query (React Query)
- **Deployment:** Vercel
- **Notifications:** Telegram Bot API
- **PWA:** Custom Service Worker

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (public)/          # Public routes (home, form, board)
│   ├── admin/             # Protected admin dashboard
│   ├── api/               # API routes (Telegram notifications)
│   └── login/             # Authentication page
├── components/            # Reusable UI components
│   ├── common/           # Shared components (buttons, forms, etc.)
│   ├── layout/           # Layout components
│   └── navigation/       # Navigation components
├── contexts/             # React contexts (auth, admin, board)
├── features/             # Feature-specific components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and configurations
├── providers/            # Context providers (query, auth, etc.)
├── services/             # API service functions
└── types/                # TypeScript type definitions
```

## 🔄 Routes

### Public Routes
- `/` - Home page with navigation cards
- `/form` - Request submission form (5W+1H methodology)
- `/board` - Public Kanban board view of all requests
- `/login` - Authentication page with return URL support

### Protected Admin Routes
- `/admin` - Admin dashboard (automatically redirects from `/` if authenticated)
- `/admin/requests` - Request management with advanced filtering
- `/admin/equipment` - Equipment catalog management
- `/admin/songs` - Song library management
- `/admin/venues` - Venue directory management

## 🚀 Development Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd moc-request-platform
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create `.env.local` with your Supabase credentials:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_group_chat_id
TELEGRAM_TOPIC_ID=your_telegram_topic_id  # Optional, for forum groups
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Open Application
Visit [http://localhost:3000](http://localhost:3000)

## 📊 Database Schema

The application uses Supabase with the following main tables:

- **`request`** - Core request data with 5W+1H fields
- **`equipment`** - Available equipment catalog
- **`song`** - Song library with lyrics/instrumental status
- **`venue`** - Available venues and locations
- **`request_item`** - Request items and quantities
- **`member`** - Team member directory
- **`assignee`** - Request-member assignments (many-to-many)

## 🔔 Telegram Notifications

New request submissions automatically trigger Telegram notifications via the API route at `/api/telegram-notification`. The webhook is configured in Supabase to call this endpoint when new requests are inserted.

### Setup Instructions:
1. Create a Telegram bot and get the bot token
2. Add the bot to your Telegram groups
3. Update chat IDs in the API route
4. Configure Supabase webhook to call your deployment URL

## 🚀 Deployment (Vercel)

The application is optimized for Vercel deployment with full Next.js capabilities:

### Environment Variables (Vercel)
```bash
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY  
TELEGRAM_BOT_TOKEN
TELEGRAM_CHAT_ID
TELEGRAM_TOPIC_ID
```

### Deploy
```bash
# Connect to Vercel
vercel

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add TELEGRAM_BOT_TOKEN

# Deploy to production
vercel --prod
```

## 🔐 Authentication & Security

- **Server-side Protection:** Middleware handles authentication before pages load
- **Automatic Redirects:** Smart routing based on authentication status
- **Session Management:** Supabase handles secure session management
- **Return URLs:** Deep linking support with automatic redirects after login

## 🎨 Design System

The application uses a comprehensive design system with:

- **Tokens:** Semantic color and spacing tokens
- **Typography:** Consistent text styles and hierarchy
- **Components:** Reusable UI primitives
- **Patterns:** Consistent interaction patterns across features

## 🧪 Testing

### Local Testing
```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### API Testing
The Telegram notification API can be tested locally:
```bash
# Test the webhook endpoint
curl -X POST http://localhost:3000/api/telegram-notification \
  -H "Content-Type: application/json" \
  -d '{"type": "INSERT", "table": "request", "record": {...}}'
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for the Ministry of Culture** 
