function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function validateFeedback(body) {
  if (!body || typeof body !== 'object') return null;

  const message = body.message?.trim();
  if (!message || message.length > 2000) return null;

  return {
    type: (body.type?.trim() || 'feedback').slice(0, 20),
    message,
    contact: (body.contact?.trim() || '').slice(0, 100),
    selectedText: (body.selectedText?.trim() || '').slice(0, 1000),
    honeypot: body.honeypot ? String(body.honeypot) : null,
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const data = validateFeedback(req.body);
  if (!data) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  if (data.honeypot) {
    return res.status(200).json({ success: true });
  }

  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    return res.status(500).json({ error: 'Server configuration missing' });
  }

  const safeType = escapeHtml(data.type);
  const safeMessage = escapeHtml(data.message);
  const safeContact = escapeHtml(data.contact);
  const safeSelectedText = escapeHtml(data.selectedText);

  let text = `<b>Новий відгук [${safeType}]</b>\n\n`;

  if (safeSelectedText) {
    text += `<blockquote>${safeSelectedText}</blockquote>\n\n`;
  }

  text += `<b>Повідомлення:</b>\n${safeMessage}`;

  if (safeContact) {
    text += `\n\n<b>Контакт:</b> ${safeContact}`;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    if (response.ok) {
      return res.status(200).json({ success: true });
    }

    const errData = await response.json();
    console.error('Telegram API Error:', errData);
    return res.status(500).json({ error: 'Telegram dispatch failed' });
  } catch (err) {
    console.error('Server Request Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}