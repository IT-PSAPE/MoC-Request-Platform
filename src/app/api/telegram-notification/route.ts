import { NextResponse } from "next/server";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const TELEGRAM_TOPIC_ID = process.env.TELEGRAM_TOPIC_ID;

export async function POST(req: Request) {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        return NextResponse.json(
            { error: "Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID environment variables." },
            { status: 500 }
        );
    }

    const body = await req.json().catch(() => null);
    const record = body?.record;
    const id = record?.id;
    const what = record?.what;

    if (id === undefined || what === undefined) {
        return NextResponse.json({ error: "Request payload must include record.id and record.what." }, { status: 400 });
    }

    const text = `New request ${id}: ${what}`;

    const payload = {
        chat_id: Number(TELEGRAM_CHAT_ID),
        text,
        ...(TELEGRAM_TOPIC_ID ? { message_thread_id: Number(TELEGRAM_TOPIC_ID) } : {})
    };

    const telegramResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    if (!telegramResponse.ok) {
        const errorText = await telegramResponse.text();
        return NextResponse.json(
            { error: "Failed to send Telegram message.", detail: errorText },
            { status: 502 }
        );
    }

    const data = await telegramResponse.json();
    return NextResponse.json({ ok: true, result: data });
}
