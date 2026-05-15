# Vendor Tracker — API Contract

> This file is the agreement between frontend and backend.
> Do not change any endpoint without discussing with your partner first.

---

## AUTH

### Sign Up
```
POST /api/auth/signup
Send    → { name, email, password }
Get back → { token, user: { id, name, email } }
```

### Login
```
POST /api/auth/login
Send    → { email, password }
Get back → { token, user: { id, name, email } }
```

### Logout
```
POST /api/auth/logout
Send    → token in request header
Get back → { message: "Logged out" }
```

---

## PRODUCTS

### Get all products
```
GET /api/products
Send    → nothing
Get back → { products: [ { id, name, price, stock } ] }
```

### Add a product
```
POST /api/products
Send    → { name, price, stock }
Get back → { product: { id, name, price, stock } }
```

### Edit a product
```
PUT /api/products/:id
Send    → { name, price, stock }
Get back → { product: { id, name, price, stock } }
```

### Delete a product
```
DELETE /api/products/:id
Send    → nothing
Get back → { message: "Product deleted" }
```

---

## INVENTORY

### Get stock levels
```
GET /api/inventory
Send    → nothing
Get back → { products: [ { id, name, stock, low_stock: true/false } ] }
```

### Update stock level
```
PUT /api/inventory/:id
Send    → { stock }
Get back → { product: { id, name, stock } }
```

---

## SALES

### Record a sale
```
POST /api/sales
Send    → { product_id, quantity }
Get back → { sale: { id, product_id, quantity, total, created_at } }
```

### Get sales history
```
GET /api/sales
Send    → nothing
Get back → { sales: [ { id, product_name, quantity, total, created_at } ] }
```

---

## DASHBOARD STATS

### Get dashboard summary
```
GET /api/dashboard
Send    → nothing
Get back → {
             total_revenue,
             total_sales,
             top_product: { name, units_sold },
             low_stock: [ { id, name, stock } ]
           }
```