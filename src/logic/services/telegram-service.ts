/**
 * Client-side Telegram notification service for GitHub Pages deployment
 * Note: Bot token and chat IDs are exposed on client-side, only use for internal/trusted deployments
 */

const TELEGRAM_BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;
const TELEGRAM_TOPIC_ID = process.env.NEXT_PUBLIC_TELEGRAM_TOPIC_ID;

interface TelegramNotificationPayload {
  id: string;
  what: string;
  type: string;
  priority: string;
  due: string | null;
}

export async function sendTelegramNotification(payload: TelegramNotificationPayload): Promise<void> {
  // Skip if environment variables are not configured
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn('Telegram notification skipped: Missing NEXT_PUBLIC_TELEGRAM_BOT_TOKEN or NEXT_PUBLIC_TELEGRAM_CHAT_ID');
    return;
  }

  try {
    // Format due date if available
    const dueDateText = payload.due 
      ? new Date(payload.due).toLocaleDateString('en-ZA', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      : 'Not specified';

    const text = `🎭 <b>New Request Submitted</b>

📋 <b>Request: ${payload.what}</b>

📝 <b>Type:</b> ${payload.type}
⭐ <b>Priority:</b> ${payload.priority}
📅 <b>Due Date:</b> ${dueDateText}

🔗 <a href="${window.location.origin}/request?id=${payload.id}">View Full Details</a>`;

    const telegramPayload = {
      chat_id: Number(TELEGRAM_CHAT_ID),
      text,
      parse_mode: 'HTML' as const,
      ...(TELEGRAM_TOPIC_ID ? { message_thread_id: Number(TELEGRAM_TOPIC_ID) } : {})
    };

    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(telegramPayload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to send Telegram notification:', errorText);
    } else {
      console.log('Telegram notification sent successfully');
    }
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
    // Don't throw - we don't want notification failures to break the app
  }
}
