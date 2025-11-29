# Vercel Deployment Guide

This guide will help you deploy your MOC Request Platform to Vercel with full Next.js capabilities and Telegram notifications.

## 🚀 Quick Deployment

### 1. Deploy to Vercel

```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Deploy from your project directory
vercel

# Follow the prompts:
# - Link to existing project or create new
# - Choose your settings (defaults are usually fine)
```

### 2. Set Environment Variables

```bash
# Set your Supabase URL
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Enter: your_supabase_project_url

# Set your Supabase anonymous key
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY  
# Enter: your_supabase_anon_key

# Set your Telegram bot token
vercel env add TELEGRAM_BOT_TOKEN
# Enter: 8576049932:AAHJ0DGmeU5nyD4UfeH8FNTMA2KsMy_MkM4

# Set your Telegram chat ID
vercel env add TELEGRAM_CHAT_ID
# Enter: -1001165512639

# Set your Telegram topic ID (optional, for forum groups)
vercel env add TELEGRAM_TOPIC_REQUESTS_ID
# Enter: 21862
```

### 3. Deploy to Production

```bash
# Deploy with environment variables
vercel --prod
```

Your app will be available at: `https://your-project-name.vercel.app`

## 📱 Configure Telegram Webhook

### 1. Update Chat IDs

Edit `/src/app/api/telegram-notification/route.ts` and replace the chat IDs:

```typescript
// Line ~77 - Replace with your actual Telegram group chat IDs
const CHAT_IDS = [
  '-1001234567890', // Replace with your group chat ID
  // Add more groups as needed
];
```

**To get your Chat ID:**
1. Add your bot to your Telegram group
2. Send a test message in the group  
3. Visit: `https://api.telegram.org/bot8576049932:AAHJ0DGmeU5nyD4UfeH8FNTMA2KsMy_MkM4/getUpdates`
4. Find the `"chat":{"id":-123456789}` value in the response

### 2. Configure Supabase Webhook

1. Go to your Supabase Dashboard → Database → Webhooks
2. Click "Create a new webhook"
3. Configure:
   - **Name:** `telegram-notifications`
   - **Table:** `request`
   - **Events:** `INSERT` (only)
   - **Type:** `HTTP Request`
   - **Method:** `POST`
   - **URL:** `https://your-project-name.vercel.app/api/telegram-notification`
   - **Headers:** `Content-Type: application/json`
4. Click "Create webhook"

### 3. Test the Setup

After deployment, test by:
1. Submitting a new request through your form
2. Check if Telegram notification is sent to your group
3. Check Vercel function logs for any errors

## 🔧 Custom Domain (Optional)

If you want to use `request.psape.co.za`:

### 1. Add Domain in Vercel Dashboard
1. Go to your project in Vercel Dashboard
2. Settings → Domains
3. Add `request.psape.co.za`
4. Follow DNS configuration instructions

### 2. Update DNS Records
Add these records in your DNS provider:
```
CNAME record: request.psape.co.za → cname.vercel-dns.com
```

### 3. Update Supabase Webhook URL
Change the webhook URL to: `https://request.psape.co.za/api/telegram-notification`

## 📊 Monitoring & Logs

### Vercel Function Logs
- Go to Vercel Dashboard → Your Project → Functions
- Click on `/api/telegram-notification` to view logs
- Monitor for errors or successful notifications

### Supabase Webhook Logs  
- Go to Supabase Dashboard → Database → Webhooks
- Click on your webhook to view delivery logs
- Check for failed deliveries or errors

## 🚨 Troubleshooting

### Common Issues

1. **Environment Variables Not Working**
   ```bash
   # Check if variables are set
   vercel env ls
   
   # If missing, add them:
   vercel env add VARIABLE_NAME
   ```

2. **Telegram Notifications Not Sending**
   - Check Vercel function logs
   - Verify bot token is correct
   - Ensure bot is added to Telegram groups
   - Confirm chat IDs are correct (negative numbers for groups)

3. **Supabase Webhook Failing**
   - Check webhook logs in Supabase dashboard
   - Verify the webhook URL is correct
   - Test the API route manually with curl

4. **Build Errors**
   ```bash
   # Test build locally first
   npm run build
   
   # Check for TypeScript errors
   npm run lint
   ```

### Test API Route Locally

```bash
# Test the webhook endpoint
curl -X POST https://your-project-name.vercel.app/api/telegram-notification \
  -H "Content-Type: application/json" \
  -d '{
    "type": "INSERT",
    "table": "request", 
    "record": {
      "id": 123,
      "what": "Test request",
      "who": "Test user",
      "request_type": "Audio",
      "created_at": "2024-11-30T00:00:00Z"
    }
  }'
```

## ✅ Verification Checklist

After deployment, verify:

- [ ] App loads at your Vercel URL
- [ ] Login/authentication works
- [ ] Admin dashboard accessible
- [ ] Public form submissions work
- [ ] Telegram notifications are sent
- [ ] Supabase data syncs properly
- [ ] PWA features work (installable)
- [ ] Environment variables are set
- [ ] Custom domain works (if configured)

## 🔄 Redeployment

For future updates:

```bash
# Simply push to your connected Git repository, or
vercel --prod

# Force redeploy without changes
vercel --prod --force
```

## 📞 Support

If you encounter issues:
1. Check Vercel function logs
2. Check Supabase webhook delivery logs  
3. Test API routes manually
4. Verify environment variables are set correctly

Your MOC Request Platform is now fully deployed on Vercel with native Next.js capabilities! 🎉
