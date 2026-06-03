// src/api/mockApi.js
export const mockUser = { id: 1, name: "Kwadwo Mensah", email: "kwadwo@gmail.com" };
export const mockToken = "my-app-123";

export const mockStats = {
  total_revenue: 1240,
  daily_change: 12,      // positive = up, negative = down
  weekly_change: -4,     // negative to test the red arrow
  total_sales: 34,
  top_product: { name: "Orange Juice", units_sold: 18 },
  low_stock: [
    { id: 1, name: "Mango Juice", stock: 3 },
    { id: 2, name: "Water Bottle", stock: 2 },
  ],
};

export const mockProducts = [
  { id: 1, name: "Orange Juice Premium", price: 55, stock: 2, sku: "OJP001", category: "Beverages", units_sold: 382, base_cost: 32 },
  { id: 2, name: "E-Learning Kit", price: 55, stock: 45, sku: "TYP8784", category: "Electronics", units_sold: 164, base_cost: 32 },
  { id: 3, name: "Wireless Headphones", price: 120, stock: 12, sku: "BLUE-HEAD", category: "Electronics", units_sold: 40, base_cost: 75 },
  { id: 4, name: "Mango Juice", price: 6, stock: 3, sku: "MJ002", category: "Beverages", units_sold: 90, base_cost: 3 },
  { id: 5, name: "Rice Bag 5kg", price: 45, stock: 20, sku: "RB005", category: "Groceries", units_sold: 60, base_cost: 30 },
];

export const mockSales = [
  { id: 1, product_name: "Orange Juice", quantity: 3, total: 15, created_at: "2026-05-30" },
  { id: 2, product_name: "Energy Drink", quantity: 1, total: 8, created_at: "2026-05-30" },
  { id: 3, product_name: "Water Bottle", quantity: 5, total: 10, created_at: "2026-05-29" },
  { id: 4, product_name: "Mango Juice", quantity: 2, total: 12, created_at: "2026-05-29" },
  { id: 5, product_name: "Orange Juice", quantity: 4, total: 20, created_at: "2026-05-28" },
];

export const mockCustomers = [
  { id: 1, name: "Kwadwo Mensah", phone: "+233 24 567 5647", email: "kwadwom@gmail.com", purchases: 22, total: 1245, credit_owed: 120 },
  { id: 2, name: "Elaine Thompson", phone: "+233 50 123 4567", email: "elaine.t@live.com", purchases: 14, total: 890.50, credit_owed: 0 },
  { id: 3, name: "Richard Boateng", phone: "+233 20 987 6543", email: "richard.b@outlook.com", purchases: 8, total: 678, credit_owed: 350 },
  { id: 4, name: "Abena Osei", phone: "+233 27 345 6789", email: "abena.o@gmail.com", purchases: 5, total: 430, credit_owed: 0 },
];