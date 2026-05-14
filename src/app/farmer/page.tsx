"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createProduct, getProducts, getOrders, updateOrderStatus } from "@/lib/api";
import { supabase } from "@/lib/supabase";

interface FormData {
  name: string;
  price: string;
  location: string;
  category: string;
  farming_method: string;
  harvest_date: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  location: string;
  farmer_id: string | null;
}

interface Order {
  id: number;
  product_id: number;
  customer_id: string;
  status: string;
  created_at: string;
}

export default function Farmer() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "", price: "", location: "", category: "", farming_method: "", harvest_date: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [updatingOrder, setUpdatingOrder] = useState<number | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/login");
        return;
      }
      setUserId(data.user.id);
      loadDashboardData(data.user.id);
    });
  }, []);

  const loadDashboardData = async (uid: string) => {
    try {
      const allProducts = await getProducts();
      const farmerProducts = allProducts.filter((p: Product) => p.farmer_id === uid);
      setMyProducts(farmerProducts);

      const allOrders = await getOrders();
      const productIds = farmerProducts.map((p: Product) => p.id);
      const farmerOrders = allOrders.filter((o: Order) => productIds.includes(o.product_id));
      setMyOrders(farmerOrders);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    }
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!userId) return;
    setLoading(true);
    setMessage("");

    if (!formData.name || !formData.price || !formData.location || !formData.category || !formData.farming_method || !formData.harvest_date) {
      setMessage("Please fill in all fields");
      setMessageType("error");
      setLoading(false);
      return;
    }

    try {
      const response = await createProduct({
        ...formData,
        price: parseFloat(formData.price),
        farmer_id: userId,
      });

      if (response.data) {
        setMessage("Product added to marketplace!");
        setMessageType("success");
        setFormData({ name: "", price: "", location: "", category: "", farming_method: "", harvest_date: "" });
        loadDashboardData(userId);
      } else {
        setMessage("Failed to create product. Please try again.");
        setMessageType("error");
      }
    } catch (error: any) {
      setMessage("Error: " + error.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleOrderAction = async (orderId: number, status: "accepted" | "rejected") => {
    setUpdatingOrder(orderId);
    try {
      await updateOrderStatus(orderId, status);
      setMyOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
    } catch (err: any) {
      alert("Error updating order: " + err.message);
    } finally {
      setUpdatingOrder(null);
    }
  };

  const getProductName = (productId: number) =>
    myProducts.find((p) => p.id === productId)?.name ?? `Product #${productId}`;

  const statusColor = (status: string) => {
    if (status === "accepted") return "text-green-600 font-semibold";
    if (status === "rejected") return "text-red-500 font-semibold";
    return "text-yellow-600 font-semibold";
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-8">Farmer Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* Left: Add Product + My Products */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
          <div className="p-6 border rounded shadow-md">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Product Name *</label>
                <input type="text" name="name" placeholder="e.g., Fresh Tomatoes" value={formData.name} onChange={handleChange} required className="border p-3 w-full rounded focus:outline-none focus:border-green-600" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price ($) *</label>
                <input type="number" name="price" placeholder="e.g., 5.50" step="0.01" min="0" value={formData.price} onChange={handleChange} required className="border p-3 w-full rounded focus:outline-none focus:border-green-600" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Farm Location *</label>
                <input type="text" name="location" placeholder="e.g., Austin, Texas" value={formData.location} onChange={handleChange} required className="border p-3 w-full rounded focus:outline-none focus:border-green-600" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category *</label>
                <select name="category" value={formData.category} onChange={handleChange} required className="border p-3 w-full rounded focus:outline-none focus:border-green-600">
                  <option value="">-- Select Category --</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Grains">Grains</option>
                  <option value="Livestock">Livestock</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Farming Method *</label>
                <select name="farming_method" value={formData.farming_method} onChange={handleChange} required className="border p-3 w-full rounded focus:outline-none focus:border-green-600">
                  <option value="">-- Select Method --</option>
                  <option value="Organic">Organic</option>
                  <option value="Conventional">Conventional</option>
                  <option value="Hydroponic">Hydroponic</option>
                  <option value="Biodynamic">Biodynamic</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Harvest Date *</label>
                <input type="date" name="harvest_date" value={formData.harvest_date} onChange={handleChange} required className="border p-3 w-full rounded focus:outline-none focus:border-green-600" />
              </div>

              {message && (
                <div className={`p-4 rounded text-sm ${messageType === "success" ? "bg-green-100 border border-green-400 text-green-800" : "bg-red-100 border border-red-400 text-red-800"}`}>
                  {message}
                </div>
              )}

              <button type="submit" disabled={loading} className="w-full px-6 py-3 bg-green-600 text-white rounded font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400">
                {loading ? "Adding..." : "Add Product to Marketplace"}
              </button>
            </form>
          </div>

          {myProducts.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Your Products ({myProducts.length})</h2>
              <div className="space-y-2">
                {myProducts.map((p) => (
                  <div key={p.id} className="flex justify-between items-center p-3 border rounded bg-gray-50">
                    <span className="font-medium">{p.name}</span>
                    <span className="text-green-600 font-semibold">${p.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Incoming Orders */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Incoming Orders ({myOrders.length})</h2>

          {myOrders.length === 0 ? (
            <div className="p-6 border rounded bg-gray-50 text-gray-500 text-center">
              No orders yet. Orders appear here when customers request your products.
            </div>
          ) : (
            <div className="space-y-4">
              {myOrders.map((order) => (
                <div key={order.id} className="p-5 border rounded shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold text-gray-800">{getProductName(order.product_id)}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Customer: {order.customer_id.slice(0, 8)}...
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`text-sm capitalize ${statusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>

                  {order.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOrderAction(order.id, "accepted")}
                        disabled={updatingOrder === order.id}
                        className="flex-1 py-2 bg-green-600 text-white rounded font-semibold hover:bg-green-700 disabled:bg-gray-400 transition-colors text-sm"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleOrderAction(order.id, "rejected")}
                        disabled={updatingOrder === order.id}
                        className="flex-1 py-2 bg-red-500 text-white rounded font-semibold hover:bg-red-600 disabled:bg-gray-400 transition-colors text-sm"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
