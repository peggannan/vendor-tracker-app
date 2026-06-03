import axios from "axios";
import { mockUser, mockToken, mockStats, mockProducts, mockSales, mockCustomers } from "./mockApi";

const USE_MOCK = true;

const BASE_URL = import.meta.env.VITE_API_URL || "https://vendor-tracker-app.onrender.com";

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms));

// AUTH
export const signup = async (data) => {
  if (USE_MOCK) { await delay(); return { data: { token: mockToken, user: mockUser } }; }
  return api.post("/api/v1/auth/register/", data);
};

export const login = async (data) => {
  if (USE_MOCK) { await delay(); return { data: { token: mockToken, user: mockUser } }; }
  return api.post("/api/v1/auth/login/", data);
};

export const logout = async () => {
  if (USE_MOCK) { await delay(); return; }
  return api.post("/api/v1/auth/logout/");
};

// PRODUCTS
export const getProducts = async () => {
  if (USE_MOCK) { await delay(); return { data: { products: mockProducts } }; }
  return api.get("/api/v1/products/");
};

export const addProduct = async (data) => {
  if (USE_MOCK) {
    await delay();
    const p = { id: Date.now(), ...data };
    mockProducts.push(p);
    return { data: { product: p } };
  }
  return api.post("/api/v1/products/", data);
};

export const editProduct = async (id, data) => {
  if (USE_MOCK) { await delay(); return { data: { product: { id, ...data } } }; }
  return api.put(`/api/v1/products/${id}/`, data);
};

export const deleteProduct = async (id) => {
  if (USE_MOCK) { await delay(); return { data: { message: "Deleted" } }; }
  return api.delete(`/api/v1/products/${id}/`);
};

// INVENTORY
export const getInventory = async () => {
  if (USE_MOCK) { await delay(); return { data: { products: mockProducts } }; }
  return api.get("/api/v1/products/");
};

export const updateStock = async (id, stock) => {
  if (USE_MOCK) { await delay(); return { data: { product: { id, stock } } }; }
  return api.patch(`/api/v1/products/${id}/`, { stock });
};

// SALES
export const recordSale = async (data) => {
  if (USE_MOCK) {
    await delay();
    return { data: { sale: { id: Date.now(), ...data, created_at: new Date().toISOString() } } };
  }
  return api.post("/api/v1/sales/", data);
};

export const getSalesHistory = async () => {
  if (USE_MOCK) { await delay(); return { data: { sales: mockSales } }; }
  return api.get("/api/v1/sales/");
};

// CUSTOMERS
export const getCustomers = async () => {
  if (USE_MOCK) { await delay(); return { data: { customers: mockCustomers } }; }
  return api.get("/api/v1/customers/");
};

export const addCustomer = async (data) => {
  if (USE_MOCK) {
    await delay();
    return { data: { customer: { id: Date.now(), ...data, purchases: 0, total: 0, credit_owed: 0 } } };
  }
  return api.post("/api/v1/customers/", data);
};

export const editCustomer = async (id, data) => {
  if (USE_MOCK) { await delay(); return { data: { customer: { id, ...data } } }; }
  return api.put(`/api/v1/customers/${id}/`, data);
};

// CREDITS
export const getCredits = async () => {
  if (USE_MOCK) { await delay(); return { data: { credits: [] } }; }
  return api.get("/api/v1/credits/");
};

// DASHBOARD — no endpoint yet, built from other endpoints
export const getDashboard = async () => {
  if (USE_MOCK) { await delay(); return { data: mockStats }; }

  try {
    const [salesRes, productsRes, customersRes] = await Promise.all([
      api.get("/api/v1/sales/"),
      api.get("/api/v1/products/"),
      api.get("/api/v1/customers/"),
    ]);

    const sales = salesRes.data?.results ?? salesRes.data?.sales ?? salesRes.data ?? [];
    const products = productsRes.data?.results ?? productsRes.data?.products ?? productsRes.data ?? [];
    const customers = customersRes.data?.results ?? customersRes.data?.customers ?? customersRes.data ?? [];

    // Calculate total revenue today
    const today = new Date().toISOString().slice(0, 10);
    const todaySales = sales.filter((s) => s.created_at?.slice(0, 10) === today);
    const total_revenue = todaySales.reduce((sum, s) => sum + parseFloat(s.total || 0), 0);

    // Weekly revenue
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weeklySales = sales.filter((s) => new Date(s.created_at) >= weekAgo);
    const weekly_revenue = weeklySales.reduce((sum, s) => sum + parseFloat(s.total || 0), 0);

    // Top product
    const productMap = {};
    sales.forEach((s) => {
      const name = s.product_name ?? s.product ?? "Unknown";
      if (!productMap[name]) productMap[name] = 0;
      productMap[name] += parseInt(s.quantity || 1);
    });
    const topEntry = Object.entries(productMap).sort((a, b) => b[1] - a[1])[0];
    const top_product = topEntry ? { name: topEntry[0], units_sold: topEntry[1] } : null;

    // Low stock
    const low_stock = products.filter((p) => parseInt(p.stock ?? p.quantity ?? 0) <= 5);

    return {
      data: {
        total_revenue: total_revenue.toFixed(2),
        weekly_revenue: weekly_revenue.toFixed(2),
        weekly_change: 0,
        total_customers: customers.length,
        top_product,
        low_stock,
      }
    };
  } catch (err) {
    console.error("Dashboard error:", err);
    return { data: { total_revenue: 0, weekly_revenue: 0, weekly_change: 0, total_customers: 0, top_product: null, low_stock: [] } };
  }
};