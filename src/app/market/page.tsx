"use client";

import { useState } from "react";

export default function Market() {
  const [products] = useState([
    { name: "Milk", price: "5" },
    { name: "Eggs", price: "3" },
  ]);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Marketplace 🛒</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <div
            key={index}
            className="p-6 border rounded shadow"
          >
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-green-600 font-bold mt-2">
              ${product.price}
            </p>

            <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded">
              Request
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}