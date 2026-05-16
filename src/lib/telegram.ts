import type { OrderItem } from "@/lib/order-utils";

type TelegramOrder = {
  id: string;
  order_number: number;
  customer_name: string;
  customer_phone: string;
  customer_address?: string;
  delivery: "pickup" | "courier" | "nationwide";
  items: OrderItem[];
  subtotal: string;
};

const DELIVERY_FALLBACK: Record<TelegramOrder["delivery"], string> = {
  pickup: "Pickup in store",
  courier: "Courier — Chișinău",
  nationwide: "Nationwide delivery",
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function formatProductName(item: OrderItem) {
  const brand = item.brand.trim();
  const name = item.name.trim();
  if (!brand) return name;
  if (name.toLowerCase().startsWith(brand.toLowerCase())) return name;
  return `${brand} ${name}`;
}

export function buildTelegramOrderMessage(order: TelegramOrder, baseUrl: string) {
  const separator = "─────────────────";
  const delivery = DELIVERY_FALLBACK[order.delivery];
  const address  = order.customer_address?.trim();

  const itemLines = order.items.map((item) => {
    const name = escapeHtml(formatProductName(item));
    const url  = item.slug ? `${baseUrl}/product/${escapeHtml(item.slug)}` : null;
    const linkedName = url ? `<a href="${url}">${name}</a>` : name;
    return `${linkedName} × ${item.quantity} — ${escapeHtml(item.size)} — ${escapeHtml(item.color)}`;
  });

  const customerLines = [
    `${escapeHtml(order.customer_name)} · ${escapeHtml(order.customer_phone)}`,
    escapeHtml(delivery),
    ...(address ? [escapeHtml(address)] : []),
  ];

  return [
    `<b>New Order — #${order.order_number}</b>`,
    "",
    ...customerLines,
    separator,
    ...itemLines,
    separator,
    `<b>Total: ${escapeHtml(order.subtotal)}</b>`,
  ].join("\n");
}

export async function sendTelegramMessage(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) return;

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });

  if (!response.ok) {
    throw new Error(`Telegram notification failed: ${response.status} ${await response.text()}`);
  }
}
