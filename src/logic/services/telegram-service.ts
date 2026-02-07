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
  who: string;
}

interface TelegramCombinedPayload {
  id: string;
  what: string;
  type: string;
  priority: string;
  due: string | null;
  who: string;
  files: File[];
}

async function sendTelegramNotification(payload: TelegramNotificationPayload): Promise<void> {
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

⭐ <b>Who:</b> ${payload.who}
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

async function sendTelegramMediaGroup(payload: TelegramCombinedPayload): Promise<void> {
  if (!payload.files || payload.files.length === 0) return;

  // Telegram supports 2-10 items in a media group
  const filesToSend = payload.files.slice(0, 10);
  
  // Caption for media group - includes Request ID and Name for identification
  const mediaCaption = `📁 Request: ${payload.what}
🪪 ID: #${payload.id}`;

  if (filesToSend.length === 1) {
    // For single file, send document with caption
    const formData = new FormData();
    formData.append('chat_id', String(TELEGRAM_CHAT_ID));
    if (TELEGRAM_TOPIC_ID) {
      formData.append('message_thread_id', String(TELEGRAM_TOPIC_ID));
    }
    formData.append('document', filesToSend[0], filesToSend[0].name);
    formData.append('caption', mediaCaption);

    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to send Telegram document:', errorText);
    } else {
      console.log('Telegram document sent successfully');
    }
    return;
  }

  try {
    // Create FormData for media group
    const formData = new FormData();
    formData.append('chat_id', String(TELEGRAM_CHAT_ID));
    if (TELEGRAM_TOPIC_ID) {
      formData.append('message_thread_id', String(TELEGRAM_TOPIC_ID));
    }

    // Build media array for sendMediaGroup
    const mediaArray = filesToSend.map((file, index) => {
      const attachName = `file${index + 1}`;
      formData.append(attachName, file, file.name);
      
      return {
        type: 'document',
        media: `attach://${attachName}`,
        // Add caption only to the first file
        caption: index === 0 ? mediaCaption : undefined
      };
    });

    formData.append('media', JSON.stringify(mediaArray));

    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMediaGroup`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to send Telegram media group:', errorText);
    } else {
      console.log(`Telegram media group sent successfully with ${filesToSend.length} files`);
    }
  } catch (error) {
    console.error('Error sending Telegram media group:', error);
  }
}

export async function sendTelegramNotificationWithAttachments(payload: TelegramCombinedPayload): Promise<void> {
  // Skip if environment variables are not configured
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn('Telegram notification with attachments skipped: Missing NEXT_PUBLIC_TELEGRAM_BOT_TOKEN or NEXT_PUBLIC_TELEGRAM_CHAT_ID');
    return;
  }

  try {
    // Step 1: Always send the text notification first
    await sendTelegramNotification({
      id: payload.id,
      what: payload.what,
      type: payload.type,
      priority: payload.priority,
      due: payload.due,
      who: payload.who
    });

    // Step 2: Send media group if files exist
    if (payload.files && payload.files.length > 0) {
      await sendTelegramMediaGroup(payload);
    }
  } catch (error) {
    console.error('Error sending combined Telegram notification:', error);
    // Don't throw - we don't want notification failures to break the app
  }
}
