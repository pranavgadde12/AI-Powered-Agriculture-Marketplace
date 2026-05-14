// API Service - Centralized backend communication
// All backend calls go through here

const API_URL = "http://localhost:8000/api";

// Helper function to handle responses
async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "API Error");
  }
  return response.json();
}

// =====================
// PRODUCTS API
// =====================

export async function getProducts() {
  try {
    const response = await fetch(`${API_URL}/products`);
    return await handleResponse(response);
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

export async function getProductById(id: number) {
  try {
    const response = await fetch(`${API_URL}/products/${id}`);
    return await handleResponse(response);
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
}

export async function createProduct(product: {
  name: string;
  price: number;
  location: string;
  category: string;
  farming_method: string;
  harvest_date: string;
  farmer_id?: string;
}) {
  try {
    const response = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
}

export async function deleteProduct(id: number) {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: "DELETE",
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
}

// =====================
// ORDERS API
// =====================

export async function getOrders() {
  try {
    const response = await fetch(`${API_URL}/orders`);
    return await handleResponse(response);
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
}

export async function createOrder(order: {
  product_id: number;
  customer_id: string;
}) {
  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}

export async function updateOrderStatus(
  orderId: number,
  status: string
) {
  try {
    const response = await fetch(`${API_URL}/orders/${orderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
}

// =====================
// AI API
// =====================

export async function chatWithAI(message: string, mode: "farmer" | "customer" = "farmer") {
  try {
    const response = await fetch(`${API_URL}/ai/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, mode }),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Error chatting with AI:", error);
    throw error;
  }
}
