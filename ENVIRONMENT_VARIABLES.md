# Environment Variables

## Required Environment Variables

For GitHub Pages deployment, create a `.env.local` file in the root of the project with the following variables:

```bash
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Telegram Configuration (Optional)
# If not set, Telegram notifications will be skipped
NEXT_PUBLIC_TELEGRAM_BOT_TOKEN=your_telegram_bot_token
NEXT_PUBLIC_TELEGRAM_CHAT_ID=your_telegram_chat_id
NEXT_PUBLIC_TELEGRAM_TOPIC_ID=your_telegram_topic_id_if_using_topics
```

## Notes

1. **NEXT_PUBLIC_ Prefix**: All environment variables must have the `NEXT_PUBLIC_` prefix to be available in the client-side code for static export.

2. **Security Warning**: Since these variables are exposed in the client-side JavaScript bundle, only use this setup for internal/trusted deployments. Do not expose sensitive credentials in public deployments.

3. **Telegram Notifications**: These are optional. If not configured, the application will work normally but without Telegram notifications.

4. **Building for Production**: These variables must be present during the build process (`npm run build`) as they are embedded into the static output.

## For GitHub Actions

If using GitHub Actions for deployment, add these as repository secrets:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_TELEGRAM_BOT_TOKEN` (optional)
- `NEXT_PUBLIC_TELEGRAM_CHAT_ID` (optional)
- `NEXT_PUBLIC_TELEGRAM_TOPIC_ID` (optional)
