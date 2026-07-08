export type NotifyPayload = {
  subject: string;
  text: string;
  replyTo?: string;
};

export async function sendAdminNotification(payload: NotifyPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_NOTIFY_EMAIL;
  const from = process.env.CONTACT_NOTIFY_FROM ?? "Tokat Sanayi <onboarding@resend.dev>";

  if (!apiKey || !to) {
    return { sent: false as const, reason: "Bildirim yapılandırması yok." };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: payload.subject,
      text: payload.text,
      reply_to: payload.replyTo,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`E-posta gönderilemedi: ${body}`);
  }

  return { sent: true as const };
}
