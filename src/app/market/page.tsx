"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProducts, createOrder } from "@/lib/api";
import { supabase } from "@/lib/supabase";

interface Product {
  id: number;
  name: string;
  price: number;
  location: string;
  category: string;
  farming_method: string;
  harvest_date: string;
}

export default function Market() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requesting, setRequesting] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getProducts();
      setProducts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (productId: number) => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      router.push("/login");
      return;
    }

    setRequesting(productId);
    setSuccessMsg("");
    try {
      await createOrder({ product_id: productId, customer_id: data.user.id });
      setSuccessMsg("Order placed! The farmer will review your request.");
    } catch (err: any) {
      alert("Error placing order: " + err.message);
    } finally {
      setRequesting(null);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-3xl font-bold mb-6">Marketplace</h1>
        <p className="text-gray-600">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10">
        <h1 className="text-3xl font-bold mb-6">Marketplace</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error loading products: {error}</p>
          <p className="text-sm mt-1">Make sure the backend is running on http://localhost:8000</p>
        </div>
        <button onClick={loadProducts} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-2">Marketplace</h1>
      <p className="mb-6 text-gray-600">
        {products.length} product{products.length !== 1 ? "s" : ""} available from local farmers
      </p>

      {successMsg && (
        <div className="mb-6 bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded">
          {successMsg}
        </div>
      )}

      {products.length === 0 ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded">
          No products yet. Farmers can add products from the Farmer Dashboard.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="p-6 border rounded shadow-md hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
              <p className="text-gray-500 text-xs mt-1 uppercase tracking-wide">{product.category}</p>
              <div className="mt-3 space-y-1 text-sm text-gray-600">
                <p><span className="font-medium">Location:</span> {product.location}</p>
                <p><span className="font-medium">Method:</span> {product.farming_method}</p>
                <p><span className="font-medium">Harvested:</span> {product.harvest_date}</p>
              </div>
              <p className="text-green-600 font-bold mt-4 text-2xl">${product.price.toFixed(2)}</p>
              <button
                onClick={() => handleRequest(product.id)}
                disabled={requesting === product.id}
                className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors font-semibold disabled:bg-gray-400"
              >
                {requesting === product.id ? "Requesting..." : "Request Product"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
