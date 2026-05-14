# 🎓 PHASE 2: FRONTEND INTEGRATION - STEP BY STEP

## 🎯 What is Phase 2?

**Transform dummy data into REAL data from your backend!**

```
BEFORE Phase 2 (❌)          AFTER Phase 2 (✅)
────────────────────        ─────────────────
Hardcoded products    →     Fetch from backend
LocalStorage data     →     Supabase database
Static UI             →     Real live data
Farmer form dummy     →     Creates real products
```

---

## 📊 Phase 2 Architecture

```
Next.js Frontend (React Components)
        ↓
        │ fetch('http://localhost:8000/api/products')
        │
FastAPI Backend (Already Built!)
        ↓
        │ query("SELECT * FROM products")
        │
Supabase Database (PostgreSQL)
        ↓
        │ Returns product rows
        │
Backend Response (JSON)
        ↓
        │ [{"id": 1, "name": "Tomatoes", "price": 5.5}, ...]
        │
Frontend renders products
        ↓
User sees real marketplace! ✅
```

---

## 🔄 Communication Protocol

### Frontend REQUESTS to Backend

#### 1. Fetch Products
```javascript
// frontend/src/app/market/page.tsx
fetch('http://localhost:8000/api/products')
  .then(res => res.json())
  .then(data => setProducts(data))
```

#### 2. Create Product
```javascript
// frontend/src/app/farmer/page.tsx
fetch('http://localhost:8000/api/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: "Tomatoes",
    price: 5.50,
    location: "Farm A",
    category: "Vegetables",
    farming_method: "Organic",
    harvest_date: "2024-04-18"
  })
})
```

#### 3. Get Orders
```javascript
fetch('http://localhost:8000/api/orders')
  .then(res => res.json())
  .then(data => setOrders(data.data))
```

### Backend RESPONDS with JSON

```json
{
  "data": [
    {
      "id": 1,
      "name": "Fresh Tomatoes",
      "price": 5.5,
      "location": "Farm A, Village X",
      "category": "Vegetables",
      "farming_method": "Organic",
      "harvest_date": "2024-04-18",
      "farmer_id": null,
      "created_at": "2026-04-18T10:30:00"
    }
  ]
}
```

---

## 🧠 Key Concepts for Phase 2

### 1. API URL Configuration
```typescript
// Where to find your backend
const API_URL = "http://localhost:8000";
const PRODUCTS_API = `${API_URL}/api/products`;
```

### 2. useEffect for Data Fetching
```typescript
import { useEffect, useState } from "react";

export default function Marketplace() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Runs when component mounts
    fetch(`${API_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []); // Empty dependency array = run once

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

### 3. Async Form Submission
```typescript
const handleSubmit = async (e) => {
  e.preventDefault(); // Don't reload page
  setLoading(true);

  try {
    const response = await fetch(`${API_URL}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (response.ok) {
      setMessage("✅ Product created!");
      refreshProducts(); // Reload marketplace
    } else {
      setMessage("❌ Error: " + result.detail);
    }
  } catch (error) {
    setMessage("❌ Error: " + error.message);
  } finally {
    setLoading(false);
  }
};
```

---

## 📋 Step-by-Step Building Plan

### Step 1: Create API Service (Keep URLs centralized)
**File:** Create `src/lib/api.ts`

```typescript
// Centralize all API calls

const API_URL = "http://localhost:8000/api";

export async function getProducts() {
  const response = await fetch(`${API_URL}/products`);
  return response.json();
}

export async function createProduct(product: any) {
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  });
  return response.json();
}

export async function getOrders() {
  const response = await fetch(`${API_URL}/orders`);
  return response.json();
}

export async function createOrder(order: any) {
  const response = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order)
  });
  return response.json();
}
```

### Step 2: Update Marketplace Page
**File:** Update `src/app/market/page.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { getProducts } from '@/lib/api';

export default function Market() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading products...</div>;
  if (error) return <div className="p-10 text-red-600">Error: {error}</div>;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Marketplace 🛒</h1>
      <p className="mb-6 text-gray-600">Total products: {products.length}</p>

      {products.length === 0 ? (
        <div className="text-gray-500">No products available yet</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product: any) => (
            <div key={product.id} className="p-6 border rounded shadow hover:shadow-lg">
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-gray-600 text-sm mt-2">📍 {product.location}</p>
              <p className="text-gray-600 text-sm">🌾 {product.farming_method}</p>
              <p className="text-gray-600 text-sm">📅 {product.harvest_date}</p>
              <p className="text-green-600 font-bold mt-4 text-2xl">${product.price}</p>
              <button className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Request Product
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Step 3: Update Farmer Dashboard
**File:** Update `src/app/farmer/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { createProduct, getProducts } from '@/lib/api';

export default function Farmer() {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    location: '',
    category: '',
    farming_method: '',
    harvest_date: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await createProduct({
        ...formData,
        price: parseFloat(formData.price),
      });

      if (response.data) {
        setMessage('✅ Product created successfully!');
        setFormData({
          name: '',
          price: '',
          location: '',
          category: '',
          farming_method: '',
          harvest_date: '',
        });
      } else {
        setMessage('❌ Error creating product');
      }
    } catch (error: any) {
      setMessage('❌ Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Farmer Dashboard 🌾</h1>

      <div className="max-w-2xl">
        <div className="p-6 border rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Add Your Product</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="border p-3 w-full rounded"
            />

            <input
              type="number"
              name="price"
              placeholder="Price (e.g., 5.50)"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              required
              className="border p-3 w-full rounded"
            />

            <input
              type="text"
              name="location"
              placeholder="Farm Location"
              value={formData.location}
              onChange={handleChange}
              required
              className="border p-3 w-full rounded"
            />

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="border p-3 w-full rounded"
            >
              <option value="">Select Category</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Fruits">Fruits</option>
              <option value="Dairy">Dairy</option>
              <option value="Grains">Grains</option>
              <option value="Livestock">Livestock</option>
            </select>

            <input
              type="text"
              name="farming_method"
              placeholder="Farming Method (e.g., Organic, Conventional)"
              value={formData.farming_method}
              onChange={handleChange}
              required
              className="border p-3 w-full rounded"
            />

            <input
              type="date"
              name="harvest_date"
              value={formData.harvest_date}
              onChange={handleChange}
              required
              className="border p-3 w-full rounded"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-green-600 text-white rounded font-semibold hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? 'Adding...' : 'Add Product'}
            </button>
          </form>

          {message && (
            <div className={`mt-4 p-4 rounded ${message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

### Step 4: Create AI Chat Interface
**File:** Create/Update `src/app/ai/page.tsx`

```typescript
'use client';

import { useState } from 'react';

export default function AI() {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = { role: 'user', text: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });

      const data = await response.json();

      // Add AI response
      const aiMessage = { role: 'ai', text: data.response };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error: any) {
      const errorMessage = { role: 'ai', text: '❌ Error: ' + error.message };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">🤖 Farm Advisor AI</h1>

      <div className="border rounded p-6 h-96 overflow-y-auto mb-4 bg-gray-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block p-3 rounded ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask farming advice..."
          className="flex-1 border p-3 rounded"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
```

---

## ⚙️ Testing Phase 2

### Prerequisites
```bash
# Terminal 1: Backend running
cd backend
python -m uvicorn main:app --reload

# Terminal 2: Frontend running
npm run dev
```

### Test 1: Marketplace Shows Products
```
1. Open http://localhost:3000/market
2. Should show products from database
3. Not hardcoded dummy data
4. Real farmer locations, methods, harvest dates
```

**Expected Result:**
- If backend has 1 product: show 1 card
- If backend has 3 products: show 3 cards
- Each card shows real data

### Test 2: Add Product from Dashboard
```
1. Open http://localhost:3000/farmer
2. Fill form with: Tomatoes, 5.50, Farm A, Vegetables, Organic, 2024-04-18
3. Click "Add Product"
4. See "✅ Product created successfully!"
5. Go to marketplace
6. Your product appears!
```

### Test 3: API Communication
```bash
# In browser console
fetch('http://localhost:8000/api/products')
  .then(r => r.json())
  .then(d => console.log('Backend:', d))

# Should show your products
```

---

## 🐛 Common Issues & Fixes

### Issue: CORS Error
```
Error: Access to XMLHttpRequest blocked by CORS policy

Reason: Frontend (port 3000) calling backend (port 8000)
Fix: Backend already has CORSMiddleware configured ✅
Status: Backend allows all origins
```

### Issue: 404 Products Not Found
```
Error: TypeError: Cannot read property 'name' of undefined

Reason: Data structure mismatch
Fix: Check backend response format in /docs
Solution: Use correct field names
```

### Issue: Form Not Submitting
```
Error: Network error or 500 response

Reason: Missing required fields
Fix: Check all fields filled: name, price, location, category, farming_method, harvest_date
```

### Issue: "Loading..." Never Ends
```
Problem: Marketplace stuck on loading

Reason 1: Backend not running
Fix: Start backend with `python -m uvicorn main:app --reload`

Reason 2: Wrong URL
Fix: Check API_URL in code = http://localhost:8000
```

---

## 🎯 Success Checklist for Phase 2

- [ ] Backend running on port 8000
- [ ] Frontend running on port 3000
- [ ] Marketplace loads products from backend
- [ ] Farmer dashboard form works
- [ ] Adding product appears on marketplace
- [ ] No errors in browser console
- [ ] No errors in terminal

---

## 📊 What Data Flows Where

### Product Creation Flow
```
User fills form
↓
Farmer clicks "Add Product"
↓
handleSubmit() runs
↓
POST http://localhost:8000/api/products
{name, price, location, category, farming_method, harvest_date}
↓
Backend validates with Pydantic
↓
Inserts into Supabase
↓
Returns {message, data}
↓
Frontend shows "✅ Product created!"
↓
New product appears on marketplace
```

### Product Display Flow
```
User opens marketplace
↓
Component mounts
↓
useEffect() runs
↓
GET http://localhost:8000/api/products
↓
Backend queries Supabase
↓
Returns [product1, product2, ...]
↓
React renders product cards
↓
User sees real products
```

---

## 🚀 Next: Actually Build It

Ready? I'll now:
1. Create the API service file
2. Update marketplace page
3. Update farmer dashboard
4. Update AI chat
5. Test everything

Say "Build Phase 2 now" and we'll make it happen! 💪

