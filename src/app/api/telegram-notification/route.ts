import { NextRequest, NextResponse } from 'next/server';

// Telegram Notification API Route for MoC Request Platform
// This route receives Supabase webhooks and sends Telegram notifications

interface SupabaseWebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  schema: string;
  record: RequestRecord;
  old_record?: RequestRecord;
}

interface RequestRecord {
  id: number;
  what: string;
  who?: string;
  when?: string;
  where?: string;
  why?: string;
  how?: string;
  request_type?: string;
  due_date?: string;
  created_at?: string;
}

// Function to format the Telegram message
function formatTelegramMessage(request: RequestRecord): string {
  const { id, what } = request;

  // Build the simple message
  const message = `
🎭 New Request #${id}

${what}

View details: https://request.psape.co.za/admin
`;

  return message.trim();
}

// Function to send Telegram notification
async function sendTelegramNotification(request: RequestRecord) {
  // Get environment variables
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
  const TOPIC_ID = process.env.TELEGRAM_TOPIC_ID;
  
  if (!BOT_TOKEN) {
    throw new Error('TELEGRAM_BOT_TOKEN environment variable not set');
  }
  
  if (!CHAT_ID) {
    throw new Error('TELEGRAM_CHAT_ID environment variable not set');
  }

  // Format the notification message
  const message = formatTelegramMessage(request);
  
  // Prepare the request body
  const body: {
    chat_id: string;
    text: string;
    parse_mode: string;
    disable_web_page_preview: boolean;
    message_thread_id?: number;
  } = {
    chat_id: CHAT_ID,
    text: message,
    parse_mode: 'HTML',
    disable_web_page_preview: true
  };

  // Add topic ID if provided
  if (TOPIC_ID) {
    body.message_thread_id = parseInt(TOPIC_ID);
  }

  // Send to Telegram
  const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('[API] Telegram API error:', data);
    throw new Error(data.description || 'Failed to send Telegram message');
  }

  console.log('[API] Message sent successfully:', data.result?.message_id);
  return data.result;
}

// Handle POST request from Supabase webhook
async function handleWebhook(request: NextRequest) {
  try {
    console.log('[API] Telegram notification webhook received');
    
    // Parse request body
    const payload: SupabaseWebhookPayload = await request.json();
    
    console.log('[API] Webhook payload:', {
      type: payload.type,
      table: payload.table,
      recordId: payload.record?.id
    });

    // Validate webhook payload
    if (!payload.record) {
      return NextResponse.json({
        error: 'Invalid payload',
        message: 'Expected Supabase webhook payload with record data'
      }, { status: 400 });
    }

    // Only process INSERT events on the request table
    if (payload.type !== 'INSERT' || payload.table !== 'request') {
      console.log(`[API] Ignoring webhook: type=${payload.type}, table=${payload.table}`);
      return NextResponse.json({ 
        message: 'Webhook received but not processed (not a request INSERT)' 
      });
    }

    // Send Telegram notification
    const result = await sendTelegramNotification(payload.record);
    
    console.log('[API] Telegram notification sent successfully');
    return NextResponse.json({
      message: 'Telegram notification sent successfully',
      telegramMessageId: result.message_id
    });

  } catch (error) {
    console.error('[API] Webhook error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Handle OPTIONS request for CORS preflight
async function handleOptions() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// Export route handlers
export const POST = handleWebhook;
export const OPTIONS = handleOptions;
