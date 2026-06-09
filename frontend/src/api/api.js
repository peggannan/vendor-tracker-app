// import axios from "axios";
// import { mockUser, mockToken, mockStats, mockProducts, mockSales, mockCustomers } from "./mockApi";

// const USE_MOCK = false; //false when backend is connected

// const BASE_URL = import.meta.env.VITE_API_URL || "https://vendor-tracker-app.onrender.com";

// const api = axios.create({ baseURL: BASE_URL });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms));

// // AUTH
// export const signup = async (data) => {
//   if (USE_MOCK) { await delay(); return { data: { token: mockToken, user: mockUser } }; }
//   return api.post("/api/v1/auth/register/", data);
// };

// export const login = async (data) => {
//   if (USE_MOCK) { await delay(); return { data: { token: mockToken, user: mockUser } }; }
//   return api.post("/api/v1/auth/login/", data);
// };

// export const logout = async () => {
//   if (USE_MOCK) { await delay(); return; }
//   return api.post("/api/v1/auth/logout/");
// };

// // PRODUCTS
// export const getProducts = async () => {
//   if (USE_MOCK) { await delay(); return { data: { products: mockProducts } }; }
//   return api.get("/api/v1/products/");
// };

// export const addProduct = async (data) => {
//   if (USE_MOCK) {
//     await delay();
//     const p = { id: Date.now(), ...data };
//     mockProducts.push(p);
//     return { data: { product: p } };
//   }
//   return api.post("/api/v1/products/", data);
// };

// export const editProduct = async (id, data) => {
//   if (USE_MOCK) { await delay(); return { data: { product: { id, ...data } } }; }
//   return api.put(`/api/v1/products/${id}/`, data);
// };

// export const deleteProduct = async (id) => {
//   if (USE_MOCK) { await delay(); return { data: { message: "Deleted" } }; }
//   return api.delete(`/api/v1/products/${id}/`);
// };

// // INVENTORY
// export const getInventory = async () => {
//   if (USE_MOCK) { await delay(); return { data: { products: mockProducts } }; }
//   return api.get("/api/v1/products/");
// };

// export const updateStock = async (id, stock) => {
//   if (USE_MOCK) { await delay(); return { data: { product: { id, stock } } }; }
//   return api.patch(`/api/v1/products/${id}/`, { stock });
// };

// // SALES
// export const recordSale = async (data) => {
//   if (USE_MOCK) {
//     await delay();
//     return { data: { sale: { id: Date.now(), ...data, created_at: new Date().toISOString() } } };
//   }
//   return api.post("/api/v1/sales/", data);
// };

// export const getSalesHistory = async () => {
//   if (USE_MOCK) { await delay(); return { data: { sales: mockSales } }; }
//   return api.get("/api/v1/sales/");
// };

// // CUSTOMERS
// export const getCustomers = async () => {
//   if (USE_MOCK) { await delay(); return { data: { customers: mockCustomers } }; }
//   return api.get("/api/v1/customers/");
// };

// export const addCustomer = async (data) => {
//   if (USE_MOCK) {
//     await delay();
//     return { data: { customer: { id: Date.now(), ...data, purchases: 0, total: 0, credit_owed: 0 } } };
//   }
//   return api.post("/api/v1/customers/", data);
// };

// export const editCustomer = async (id, data) => {
//   if (USE_MOCK) { await delay(); return { data: { customer: { id, ...data } } }; }
//   return api.put(`/api/v1/customers/${id}/`, data);
// };

// // CREDITS
// export const getCredits = async () => {
//   if (USE_MOCK) { await delay(); return { data: { credits: [] } }; }
//   return api.get("/api/v1/credits/");
// };

// // DASHBOARD — no endpoint yet, built from other endpoints
// export const getDashboard = async () => {
//   if (USE_MOCK) { await delay(); return { data: mockStats }; }

//   try {
//     const [salesRes, productsRes, customersRes] = await Promise.all([
//       api.get("/api/v1/sales/"),
//       api.get("/api/v1/products/"),
//       api.get("/api/v1/customers/"),
//     ]);

//     const sales = salesRes.data?.results ?? salesRes.data?.sales ?? salesRes.data ?? [];
//     const products = productsRes.data?.results ?? productsRes.data?.products ?? productsRes.data ?? [];
//     const customers = customersRes.data?.results ?? customersRes.data?.customers ?? customersRes.data ?? [];

//     // Calculate total revenue today
//     const today = new Date().toISOString().slice(0, 10);
//     const todaySales = sales.filter((s) => s.created_at?.slice(0, 10) === today);
//     const total_revenue = todaySales.reduce((sum, s) => sum + parseFloat(s.total || 0), 0);

//     // Weekly revenue
//     const weekAgo = new Date();
//     weekAgo.setDate(weekAgo.getDate() - 7);
//     const weeklySales = sales.filter((s) => new Date(s.created_at) >= weekAgo);
//     const weekly_revenue = weeklySales.reduce((sum, s) => sum + parseFloat(s.total || 0), 0);

//     // Top product
//     const productMap = {};
//     sales.forEach((s) => {
//       const name = s.product_name ?? s.product ?? "Unknown";
//       if (!productMap[name]) productMap[name] = 0;
//       productMap[name] += parseInt(s.quantity || 1);
//     });
//     const topEntry = Object.entries(productMap).sort((a, b) => b[1] - a[1])[0];
//     const top_product = topEntry ? { name: topEntry[0], units_sold: topEntry[1] } : null;

//     // Low stock
//     const low_stock = products.filter((p) => parseInt(p.stock ?? p.quantity ?? 0) <= 5);

//     return {
//       data: {
//         total_revenue: total_revenue.toFixed(2),
//         weekly_revenue: weekly_revenue.toFixed(2),
//         weekly_change: 0,
//         total_customers: customers.length,
//         top_product,
//         low_stock,
//       }
//     };
//   } catch (err) {
//     console.error("Dashboard error:", err);
//     return { data: { total_revenue: 0, weekly_revenue: 0, weekly_change: 0, total_customers: 0, top_product: null, low_stock: [] } };
//   }
// };






import axios from "axios";
import { mockUser, mockToken, mockStats, mockProducts, mockSales, mockCustomers } from "./mockApi";

const USE_MOCK = false;

const BASE_URL = import.meta.env.VITE_API_URL || "https://vendor-tracker-app.onrender.com";

const api = axios.create({ baseURL: BASE_URL });

// Attach access_token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms));

// ─── AUTH ───────────────────────────────────────────────

export const signup = async (data) => {
  if (USE_MOCK) { await delay(); return { data: { token: mockToken, user: mockUser } }; }
  const res = await api.post("/api/v1/auth/signup/", {
    username: data.username || data.name,
    email: data.email,
    password: data.password,
    password_confirm: data.password,
  });
  // backend returns: { data: { access_token, refresh_token, user: { id, username, email } } }
  const token = res.data.data.access_token;
  const user = {
    id: res.data.data.user.id,
    name: res.data.data.user.username,
    email: res.data.data.user.email,
  };
  localStorage.setItem("refresh_token", res.data.data.refresh_token);
  return { data: { token, user } };
};

export const login = async (data) => {
  if (USE_MOCK) { await delay(); return { data: { token: mockToken, user: mockUser } }; }
  const res = await api.post("/api/v1/auth/login/", {
    username: data.username, // backend uses username field
    password: data.password,
  });
  // backend returns: { data: { access_token, refresh_token, user: { id, username, email } } }
  const token = res.data.data.access_token;
  const user = {
    id: res.data.data.user.id,
    name: res.data.data.user.username,
    email: res.data.data.user.email,
  };
  localStorage.setItem("refresh_token", res.data.data.refresh_token);
  return { data: { token, user } };
};

export const logout = async () => {
  if (USE_MOCK) { await delay(); return; }
  const refresh_token = localStorage.getItem("refresh_token");
  return api.post("/api/v1/auth/logout/", { refresh_token });
};

export const getProfile = async () => {
  if (USE_MOCK) { await delay(); return { data: mockUser }; }
  const res = await api.get("/api/v1/auth/profile/");
  // backend returns: { data: { id, username, email, shop_name, phone, profile_picture } }
  return { data: res.data.data };
};

export const updateProfile = async (data) => {
  if (USE_MOCK) { await delay(); return { data: mockUser }; }
  const res = await api.patch("/api/v1/auth/profile/", data);
  return { data: res.data.data };
};

// ─── PRODUCTS ────────────────────────────────────────────

export const getProducts = async () => {
  if (USE_MOCK) { await delay(); return { data: { products: mockProducts } }; }
  const res = await api.get("/api/v1/products/");
  // backend returns: { data: [ array of products ] }
  const raw = res.data.data ?? [];
  const products = raw.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.selling_price,       // map selling_price → price
    base_cost: p.cost_price,      // map cost_price → base_cost
    stock: p.stock_quantity,      // map stock_quantity → stock
    category: p.category,
    unit: p.unit,
    unit_custom: p.unit_custom,
    expiry_date: p.expiry_date,
    sku: p.id,                    // no SKU field, use id
    units_sold: 0,                // not in backend yet
    is_low_stock: p.is_low_stock,
    low_stock_threshold: p.low_stock_threshold,
    created_at: p.created_at,
  }));
  return { data: { products } };
};

export const addProduct = async (data) => {
  if (USE_MOCK) {
    await delay();
    const p = { id: Date.now(), ...data };
    mockProducts.push(p);
    return { data: { product: p } };
  }
  const res = await api.post("/api/v1/products/", {
    name: data.name,
    selling_price: data.price,
    cost_price: data.base_cost || data.price,
    stock_quantity: data.stock || 0,
    category: data.category || "General",
    unit: data.unit || "piece",
    expiry_date: data.expiry_date || null,
    low_stock_threshold: data.low_stock_threshold || 5,
  });
  const p = res.data.data;
  return {
    data: {
      product: {
        id: p.id,
        name: p.name,
        price: p.selling_price,
        base_cost: p.cost_price,
        stock: p.stock_quantity,
        category: p.category,
        unit: p.unit,
        is_low_stock: p.is_low_stock,
      }
    }
  };
};


export const editProduct = async (id, data) => {
  if (USE_MOCK) { await delay(); return { data: { product: { id, ...data } } }; }
  const res = await api.patch(`/api/v1/products/${id}/`, {
    name: data.name,
    selling_price: data.price,
    cost_price: data.base_cost,
    category: data.category,
    unit: data.unit,
    expiry_date: data.expiry_date || null,
    low_stock_threshold: data.low_stock_threshold || 5,
  });
  const p = res.data.data;
  return {
    data: {
      product: {
        id: p.id,
        name: p.name,
        price: p.selling_price,
        base_cost: p.cost_price,
        stock: p.stock_quantity,
        category: p.category,
        unit: p.unit,
        is_low_stock: p.is_low_stock,
      }
    }
  };
};

export const deleteProduct = async (id) => {
  if (USE_MOCK) { await delay(); return { data: { message: "Deleted" } }; }
  const res = await api.delete(`/api/v1/products/${id}/`);
  return { data: { message: res.data.data.message } };
};

export const restockProduct = async (id, quantity, cost_price) => {
  if (USE_MOCK) { await delay(); return { data: {} }; }
  return api.post(`/api/v1/products/${id}/restock/`, { quantity, cost_price });
};


// ─── INVENTORY ───────────────────────────────────────────

export const getInventory = async () => {
  return getProducts();
};

export const updateStock = async (id, stock) => {
  return restockProduct(id, stock);
};

// ─── SALES ───────────────────────────────────────────────

// export const recordSale = async (data) => {
//   if (USE_MOCK) {
//     await delay();
//     return { data: { sale: { id: Date.now(), ...data, created_at: new Date().toISOString() } } };
//   }
//   const res = await api.post("/api/v1/sales/", data);
//   return { data: { sale: res.data.data ?? res.data } };
// };

export const recordSale = async (data) => {
  if (USE_MOCK) {
    await delay();
    return { data: { sale: { id: Date.now(), ...data, created_at: new Date().toISOString() } } };
  }

  const paymentMap = {
    "CASH": "cash",
    "MOBILE MONEY": "momo",
    "CARD": "cash",
    "CREDIT": "cash",
  };

  const res = await api.post("/api/v1/sales/", {
    customer_id: data.customer_id || null,
    payment_method: paymentMap[data.payment_method?.toUpperCase()] ?? "cash",
    items: [{
      product_id: parseInt(data.product_id),
      quantity: parseInt(data.quantity),
    }],
  });

  return { data: { sale: res.data.data ?? res.data } };
};

export const getSalesHistory = async () => {
  if (USE_MOCK) { await delay(); return { data: { sales: mockSales } }; }
  
  // fetch list + individual details to get product names
  const res = await api.get("/api/v1/sales/");
  const raw = res.data.data ?? res.data.results ?? [];

  // for each sale fetch detail to get items with product names
 const detailed = await Promise.allSettled(
  raw.map(async (s) => {
    try {
      const detail = await api.get(`/api/v1/sales/${s.id}/`);
      return { ...s, ...detail.data.data };
    } catch {
      return s; // fall back to list data if detail fails
    }
  })
).then((results) => results.map((r) => r.status === "fulfilled" ? r.value : r.reason));

  const sales = detailed.map((s) => {
    const firstItem = s.items?.[0] ?? s.sale_items?.[0];
    return {
      id: s.id,
      customer_name: s.customer_name ?? null,
      customer_id: s.customer_id ?? null,
      product_name: firstItem?.product_name ?? s.product_name ?? `Sale #${s.id}`,
      quantity: firstItem?.quantity ?? 1,
      total: parseFloat(s.sale_total ?? s.total ?? 0),
      payment_method: s.payment_method === "momo"
        ? "MOBILE MONEY"
        : s.payment_method?.toUpperCase() ?? "CASH",
      staff_name: s.customer_name ?? null,
      status: s.status === "completed"
        ? "Approved"
        : s.status === "cancelled"
        ? "Rejected"
        : "Pending",
      created_at: s.created_at,
      product_image: null,
      items: s.items ?? s.sale_items ?? [],
    };
  });

  return { data: { sales } };
};

// ─── CUSTOMERS ───────────────────────────────────────────

export const getCustomers = async () => {
  if (USE_MOCK) { await delay(); return { data: { customers: mockCustomers } }; }
  const res = await api.get("/api/v1/customers/");
  const raw = res.data.data ?? res.data.results ?? res.data ?? [];
  const customers = raw.map((c) => ({
    id: c.id,
    name: c.name ?? c.full_name,
    phone: c.phone ?? c.phone_number ?? "",
    email: c.email ?? "",
    address: c.address ?? "",
    purchases: c.purchases ?? c.total_purchases ?? 0,
    total: parseFloat(c.total ?? c.total_spent ?? 0),
    credit_owed: parseFloat(c.credit_owed ?? c.credit ?? 0),
  }));
  return { data: { customers } };
};

export const addCustomer = async (data) => {
  if (USE_MOCK) {
    await delay();
    return { data: { customer: { id: Date.now(), ...data, purchases: 0, total: 0, credit_owed: 0 } } };
  }
  const res = await api.post("/api/v1/customers/", data);
  return { data: { customer: res.data.data ?? res.data } };
};

export const editCustomer = async (id, data) => {
  if (USE_MOCK) { await delay(); return { data: { customer: { id, ...data } } }; }
  const res = await api.patch(`/api/v1/customers/${id}/`, data);
  return { data: { customer: res.data.data ?? res.data } };
};

// ─── CREDITS ─────────────────────────────────────────────

export const getCredits = async () => {
  if (USE_MOCK) { await delay(); return { data: { credits: [] } }; }
  const res = await api.get("/api/v1/credits/");
  return { data: { credits: res.data.data ?? res.data.results ?? [] } };
};

// ─── DASHBOARD ───────────────────────────────────────────

export const getDashboard = async () => {
  if (USE_MOCK) { await delay(); return { data: mockStats }; }
  try {
    const [salesRes, productsRes, customersRes] = await Promise.all([
      getSalesHistory(),
      getProducts(),
      getCustomers(),
    ]);

    const sales = salesRes.data.sales ?? [];
    const products = productsRes.data.products ?? [];
    const customers = customersRes.data.customers ?? [];

    // Today's revenue
    const today = new Date().toISOString().slice(0, 10);
    const todaySales = sales.filter((s) => s.created_at?.slice(0, 10) === today);
    const total_revenue = todaySales.reduce((sum, s) => sum + parseFloat(s.total || 0), 0);

    // Weekly revenue
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weeklySales = sales.filter((s) => new Date(s.created_at) >= weekAgo);
    const weekly_revenue = weeklySales.reduce((sum, s) => sum + parseFloat(s.total || 0), 0);

    // Weekly change %
    const prevWeekStart = new Date();
    prevWeekStart.setDate(prevWeekStart.getDate() - 14);
    const prevWeekSales = sales.filter((s) => {
      const d = new Date(s.created_at);
      return d >= prevWeekStart && d < weekAgo;
    });
    const prev_weekly = prevWeekSales.reduce((sum, s) => sum + parseFloat(s.total || 0), 0);
    const weekly_change = prev_weekly > 0
      ? parseFloat(((weekly_revenue - prev_weekly) / prev_weekly * 100).toFixed(1))
      : 0;

    // Top product by sales count
    const productMap = {};
    sales.forEach((s) => {
      const name = s.product_name ?? "Unknown";
      if (!productMap[name]) productMap[name] = 0;
      productMap[name] += parseInt(s.quantity || 1);
    });
    const topEntry = Object.entries(productMap).sort((a, b) => b[1] - a[1])[0];
    const top_product = topEntry ? { name: topEntry[0], units_sold: topEntry[1] } : null;


    
    // Low stock from products
    const low_stock = products
      .filter((p) => p.is_low_stock || p.stock <= (p.low_stock_threshold ?? 5))
      .map((p) => ({ id: p.id, name: p.name, stock: p.stock }));

    return {
      data: {
        total_revenue: total_revenue.toFixed(2),
        weekly_revenue: weekly_revenue.toFixed(2),
        weekly_change,
        total_customers: customers.length,
        top_product,
        low_stock,
      }
    };
  } catch (err) {
    console.error("Dashboard error:", err);
    return {
      data: {
        total_revenue: 0,
        weekly_revenue: 0,
        weekly_change: 0,
        total_customers: 0,
        top_product: null,
        low_stock: [],
      }
    };
  }
};

// Forgot Password:
export const forgotPassword = async (email) => {
  if (USE_MOCK) { await delay(); return { data: { message: "Email sent" } }; }
  const res = await api.post("/api/v1/auth/forgot-password/", { email });
  return { data: res.data.data };
};

export const resetPassword = async (uid, token, new_password, new_password_confirm) => {
  if (USE_MOCK) { await delay(); return { data: { message: "Password reset" } }; }
  const res = await api.post("/api/v1/auth/reset-password/", {
    uid,
    token,
    new_password,
    new_password_confirm,
  });
  return { data: res.data.data };
};