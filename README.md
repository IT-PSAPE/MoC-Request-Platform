# MOC Request Platform

A comprehensive Next.js (App Router) + Tailwind CSS application for the Ministry of Culture to manage requests and assistance submissions. Features a Supabase backend, real-time notifications via Telegram, and a modern Progressive Web App (PWA) experience. Deployed as a static site to GitHub Pages.

## 🚀 Live Application

**Production:** `https://[username].github.io/[repository-name]/`

## ✨ Features

- **📱 Progressive Web App (PWA)** - Install on mobile/desktop devices
- **🔐 Authentication** - Secure Supabase Auth with client-side protection
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
- **Deployment:** GitHub Pages (Static Export)
- **Notifications:** Telegram Bot API
- **PWA:** Custom Service Worker

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (public)/          # Public routes (home, form, board)
│   ├── admin/             # Protected admin dashboard
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
Create `.env.local` with your credentials:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_TELEGRAM_BOT_TOKEN=your_telegram_bot_token  # Optional
NEXT_PUBLIC_TELEGRAM_CHAT_ID=your_telegram_group_chat_id  # Optional
NEXT_PUBLIC_TELEGRAM_TOPIC_ID=your_telegram_topic_id  # Optional, for forum groups
```

**Note:** All variables must have `NEXT_PUBLIC_` prefix for static export.

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
## 🚀 Deployment

### GitHub Pages Deployment

1. **Build the static export**:
```bash
npm run build
```

2. **Deploy to GitHub Pages**:
```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

3. **GitHub Actions** will automatically:
   - Build the static site
   - Deploy to GitHub Pages
   - Site will be available at `https://[username].github.io/[repository-name]/`

### Important Notes

- **Static Export**: The app is deployed as a static site with client-side functionality only
- **Environment Variables**: Must be set as GitHub repository secrets (without `NEXT_PUBLIC_` prefix)
- **Authentication**: Handled entirely client-side through Supabase Auth
- **Telegram Notifications**: Sent from the client-side after successful request creation

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

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
