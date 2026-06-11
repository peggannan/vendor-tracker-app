const STORAGE_KEY = "shelfline_notifications_state_v1";

function safeParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch (_) {
    return fallback;
  }
}

export function loadNotificationState() {
  return safeParse(localStorage.getItem(STORAGE_KEY), {});
}

export function saveNotificationState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function formatAmount(value) {
  const number = Number.parseFloat(value ?? 0);
  return Number.isFinite(number) ? number.toFixed(2) : "0.00";
}

function toDate(value) {
  const date = value ? new Date(value) : new Date();
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

export function formatNotificationDateTime(value) {
  const date = toDate(value);
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function buildNotifications(products = [], sales = [], state = {}) {
  const now = new Date().toISOString();
  const notifications = [];

  products.forEach((product) => {
    const threshold = product.low_stock_threshold ?? 5;
    const stock = Number.parseInt(product.stock ?? 0, 10);
    if (!(product.is_low_stock || stock <= threshold)) return;

    const id = `low_stock:${product.id}`;
    const meta = state[id] ?? {};

    notifications.push({
      id,
      type: "low_stock",
      title: "Low Stock Alert",
      message: `${product.name} has only ${Number.isFinite(stock) ? stock : 0} units left.`,
      link: "/products",
      entityId: product.id,
      entityName: product.name,
      createdAt: meta.createdAt || product.created_at || now,
      read: Boolean(meta.read),
    });
  });

  sales.forEach((sale) => {
    if (sale.status !== "Approved") return;

    const id = `sale:${sale.id}`;
    const meta = state[id] ?? {};
    const quantity = Number.parseInt(sale.quantity ?? 1, 10);

    notifications.push({
      id,
      type: "successful_transaction",
      title: "Successful Transaction",
      message: `${sale.product_name} sold successfully${Number.isFinite(quantity) ? ` · ${quantity} unit${quantity === 1 ? "" : "s"}` : ""}${sale.total ? ` · ₵${formatAmount(sale.total)}` : ""}.`,
      link: "/transactions",
      entityId: sale.id,
      entityName: sale.product_name,
      createdAt: meta.createdAt || sale.created_at || now,
      read: Boolean(meta.read),
    });
  });

  return notifications
    .filter((notification) => !state[notification.id]?.deleted)
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));
}
