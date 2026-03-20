"use client";

import { useEffect, useState } from "react";

export default function Farmer() {
  const [products, setProducts] = useState<{ name: string; price: string; location: string }[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  
   useEffect(() => {
    const saved = localStorage.getItem("products");
    if (saved) {
      setProducts(JSON.parse(saved));
    }
  }, []);
  
  const addProduct = () => {
    if (!name || !price || !location) return;

    const newProduct = { name,price,location };

    setProducts([...products, newProduct]);

    localStorage.setItem("products", JSON.stringify([...products, newProduct]));

    setName("");
    setPrice("")
    setLocation("");
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Farmer Dashboard 🌾</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Add Product */}
        <div className="p-6 border rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Add Product</h2>

          <input
            className="border p-2 w-full mb-2"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="border p-2 w-full mb-2"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <input
            className="border p-2 w-full mb-2"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <button
            onClick={addProduct}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Add Product
          </button>
        </div>

        {/* Product List */}
        <div className="p-6 border rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Your Products</h2>

          {products.length === 0 ? (
            <p>No products added</p>
          ) : (
            <ul>
              {products.map((p, i) => (
                <li key={i}>
                  {p.name} - ${p.price} - {p.location}
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}
