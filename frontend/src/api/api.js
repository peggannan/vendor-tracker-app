// src/api/api.js
import axios from "axios";
import {
  mockUser, mockToken, mockStats, mockProducts, mockSales, mockCustomers
} from "./mockApi";

const USE_MOCK = true; // 👈 flip to false when backend is ready

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms));

// AUTH
export const signup = async (data) => {
  if (USE_MOCK) {
    await delay();
    return { data: { token: mockToken, user: mockUser } };
  }
  return api.post("/api/auth/signup", data);
};

export const login = async (data) => {
  if (USE_MOCK) {
    await delay();
    return { data: { token: mockToken, user: mockUser } };
  }
  return api.post("/api/auth/login", data);
};

export const logout = async () => {
  if (USE_MOCK) { await delay(); return; }
  return api.post("/api/auth/logout");
};

// PRODUCTS
export const getProducts = async () => {
  if (USE_MOCK) {
    await delay();
    return { data: { products: mockProducts } };
  }
  return api.get("/api/products");
};

export const addProduct = async (data) => {
  if (USE_MOCK) {
    await delay();
    const newProduct = { id: Date.now(), ...data };
    mockProducts.push(newProduct);
    return { data: { product: newProduct } };
  }
  return api.post("/api/products", data);
};

export const editProduct = async (id, data) => {
  if (USE_MOCK) {
    await delay();
    const product = { id, ...data };
    return { data: { product } };
  }
  return api.put(`/api/products/${id}`, data);
};

export const deleteProduct = async (id) => {
  if (USE_MOCK) {
    await delay();
    return { data: { message: "Product deleted" } };
  }
  return api.delete(`/api/products/${id}`);
};

// INVENTORY
export const getInventory = async () => {
  if (USE_MOCK) {
    await delay();
    return { data: { products: mockProducts } };
  }
  return api.get("/api/inventory");
};

export const updateStock = async (id, stock) => {
  if (USE_MOCK) {
    await delay();
    return { data: { product: { id, stock } } };
  }
  return api.put(`/api/inventory/${id}`, { stock });
};

// SALES
export const recordSale = async (data) => {
  if (USE_MOCK) {
    await delay();
    return { data: { sale: { id: Date.now(), ...data, total: 20, created_at: new Date().toISOString() } } };
  }
  return api.post("/api/sales", data);
};

export const getSalesHistory = async () => {
  if (USE_MOCK) {
    await delay();
    return { data: { sales: mockSales } };
  }
  return api.get("/api/sales");
};

// DASHBOARD
export const getDashboard = async () => {
  if (USE_MOCK) {
    await delay();
    return { data: mockStats };
  }
  return api.get("/api/dashboard");
};

// CUSTOMERS

export const getCustomers = async () => {
  if (USE_MOCK) {
    await delay();
    return { data: { customers: mockCustomers } };
  }
  return api.get("/api/customers");
};

export const addCustomer = async (data) => {
  if (USE_MOCK) {
    await delay();
    return { data: { customer: { id: Date.now(), ...data, purchases: 0, total: 0, credit_owed: 0 } } };
  }
  return api.post("/api/customers", data);
};

export const editCustomer = async (id, data) => {
  if (USE_MOCK) {
    await delay();
    return { data: { customer: { id, ...data } } };
  }
  return api.put(`/api/customers/${id}`, data);
};






//---old code ---

// //this file connects the backend to the front end and defines all the API calls that the frontend will use to interact with the backend. It uses axios to make HTTP requests to the backend endpoints, and it also handles attaching the authentication token to each request automatically. The functions defined in this file correspond to various actions like signing up, logging in, managing products, inventory, sales, and fetching dashboard data.


// import axios from "axios";

// const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"; //replace with backend url

// const api = axios.create({ baseURL: BASE_URL });

// // Attach token to every request automatically
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// // AUTH
// export const signup = (data) => api.post("/api/auth/signup", data);
// export const login = (data) => api.post("/api/auth/login", data);
// export const logout = () => api.post("/api/auth/logout");

// // PRODUCTS
// export const getProducts = () => api.get("/api/products");
// export const addProduct = (data) => api.post("/api/products", data);
// export const editProduct = (id, data) => api.put(`/api/products/${id}`, data);
// export const deleteProduct = (id) => api.delete(`/api/products/${id}`);

// // INVENTORY
// export const getInventory = () => api.get("/api/inventory");
// export const updateStock = (id, stock) => api.put(`/api/inventory/${id}`, { stock });

// // SALES
// export const recordSale = (data) => api.post("/api/sales", data);
// export const getSalesHistory = () => api.get("/api/sales");

// // DASHBOARD
// export const getDashboard = () => api.get("/api/dashboard");