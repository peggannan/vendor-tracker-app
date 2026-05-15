 const BASE_URL = import.meta.env.VITE_API_URL

export async function getProducts() {
  const res = await fetch(`${BASE_URL}/api/products`)
  return res.json()
}

export async function recordSale(data) {
  const res = await fetch(`${BASE_URL}/api/sales`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  return res.json()
}
