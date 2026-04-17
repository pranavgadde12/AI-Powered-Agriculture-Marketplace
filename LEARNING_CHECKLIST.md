# 🧑‍🎓 Learning Checklist - Phase 1

## What You Built (Understand Each)

### ✅ Configuration System
- [ ] Understand why secrets go in `.env` not in code
- [ ] Know how `config.py` centralizes all settings
- [ ] Can explain why `SUPABASE_KEY` is sensitive

**Quick Test:** Can you answer?
- Q: Why shouldn't we commit `.env` to GitHub? 
- Your Answer: _______________

---

### ✅ Database Connection (Singleton Pattern)
- [ ] Understand what a "singleton" is
- [ ] Know why we create connection ONCE
- [ ] Can explain `db.get_client()` vs `db.connect()`

**Quick Test:** Can you answer?
- Q: What happens if we create new Supabase connection every request?
- Your Answer: _______________

---

### ✅ Pydantic Models (Validation)
- [ ] Understand how Pydantic validates data
- [ ] Know what `Field(...)` does
- [ ] Can explain `gt=0` (greater than 0)

**Quick Test:** Can you answer?
- Q: What happens when user sends `price = -100`?
- Your Answer: _______________

---

### ✅ Organized Routes
- [ ] Understand why we split into `products.py`, `orders.py`, `ai.py`
- [ ] Know how `@router.get()` works
- [ ] Can explain `app.include_router()`

**Quick Test:** Can you answer?
- Q: Where should I add a new "reviews" endpoint?
- Your Answer: _______________

---

### ✅ Main Entry Point
- [ ] Understand role of `main.py`
- [ ] Know what `lifespan` does
- [ ] Can explain startup/shutdown events

**Quick Test:** Can you answer?
- Q: What runs first when backend starts?
- Your Answer: _______________

---

## Hands-On Exercises

### Exercise 1: Add a New Field
**Task:** Add `stock_quantity` to Product

Steps:
1. Open `app/models.py`
2. Find `ProductBase` class
3. Add: `stock_quantity: int = Field(..., ge=0)`

**Check:** Run `test_api.py` - should still work

---

### Exercise 2: Create New Endpoint
**Task:** Add endpoint to get product by category

Steps:
1. Open `app/routes/products.py`
2. Add new function:
```python
@router.get("/products/category/{category}")
async def get_by_category(category: str):
    supabase = get_supabase()
    response = supabase.table("products").select("*").eq("category", category).execute()
    return response.data
```
3. Test: `http://localhost:8000/api/products/category/Vegetables`

---

### Exercise 3: Add Validation
**Task:** Make product name at least 3 characters

Steps:
1. Open `app/models.py`
2. Find `name: str` in ProductBase
3. Change to: `name: str = Field(..., min_length=3, max_length=255)`

**Check:** Try to create product with name="ab" - should fail

---

### Exercise 4: Read & Understand One File
**Task:** Read `app/database.py` and explain:
- What is `_instance`?
- Why do we use `if self.client is None`?
- What's the benefit?

**Your Explanation:** _______________

---

## Interview-Style Questions

These are real questions you might get in interviews:

### 1. Architecture
**Q:** Why do we separate frontend and backend?
- [ ] I can answer confidently
- [ ] I'm not sure
- [ ] No idea

**Your Answer:** _______________

---

### 2. Security
**Q:** Why should `.env` never be committed?
- [ ] I can answer confidently
- [ ] I'm not sure
- [ ] No idea

**Your Answer:** _______________

---

### 3. Validation
**Q:** What happens when Pydantic rejects data?
- [ ] I can answer confidently
- [ ] I'm not sure
- [ ] No idea

**Your Answer:** _______________

---

### 4. Scalability
**Q:** If we had 1000 requests/second, why would singleton connection help?
- [ ] I can answer confidently
- [ ] I'm not sure
- [ ] No idea

**Your Answer:** _______________

---

### 5. Testing
**Q:** Why is testing important early?
- [ ] I can answer confidently
- [ ] I'm not sure
- [ ] No idea

**Your Answer:** _______________

---

## Code Deep Dive

### Understanding this Chain
When user enters product in Farmer Dashboard:

```
User clicks "Add Product"
        ↓
JavaScript fetch() sends data
        ↓
HTTP POST to /api/products
        ↓
FastAPI receives at @router.post()
        ↓
Pydantic validates with ProductCreate model
        ↓
supabase.table("products").insert()
        ↓
Data stored in Supabase PostgreSQL
        ↓
Frontend shows "✅ Product added!"
```

**Task:** Trace where each file is used:
- [ ] models.py - _______
- [ ] routes/products.py - _______
- [ ] database.py - _______
- [ ] config.py - _______
- [ ] main.py - _______

---

## Advanced Understanding

### Why Pydantic Over Simple Dict?

**Without Pydantic (❌ Bad):**
```python
@app.post("/products")
def create(data: dict):
    # data could have anything
    # No validation
    # Could crash database
    # Hard to debug
```

**With Pydantic (✅ Good):**
```python
@app.post("/products")
def create(data: ProductCreate):
    # data is validated
    # Wrong types rejected
    # Safe for database
    # Easy to debug
```

**Can you explain the difference?** _______________

---

### Why Singleton for Database?

**Without Singleton (❌ Bad):**
```python
# Every endpoint creates new connection
@app.get("/api/products")
def get_products():
    client = create_client(url, key)  # New each time!
    
# 1000 requests = 1000 connections ❌
```

**With Singleton (✅ Good):**
```python
# Only one connection ever
db = Database()  # Created once
db.get_client()  # Reused forever

# 1000 requests = 1 connection ✅
```

**Performance Impact?** _______________

---

## Testing Knowledge

### Test 1: Can you read API documentation?
Open: `http://localhost:8000/docs`

Questions:
- [ ] Can you find the POST /api/products endpoint?
- [ ] Can you see what fields are required?
- [ ] Can you click "Try it out" and test?

---

### Test 2: Can you debug an error?
**Scenario:** Test creates product but returns 500 error

Debug Steps:
1. [ ] Check terminal where uvicorn is running
2. [ ] Read error message
3. [ ] Check .env file has credentials
4. [ ] Check database table exists
5. [ ] Try with valid data

---

### Test 3: Can you add a new field?
**Task:** Add `farmer_name` to Product

What files need to change?
- [ ] app/models.py - _______
- [ ] app/routes/products.py - _______
- [ ] Database table - _______

---

## Self-Assessment

### Rate yourself (1-5)

Understanding Configuration
```
1 ☐ No idea what .env is
2 ☐ Heard of it but confused
3 ☐ Understand basics
4 ☐ Can explain to others
5 ☐ Could teach this
```

---

Understanding Database Connection
```
1 ☐ No idea what singleton is
2 ☐ Heard of it but confused
3 ☐ Understand basics
4 ☐ Can explain to others
5 ☐ Could teach this
```

---

Understanding Pydantic Validation
```
1 ☐ No idea how validation works
2 ☐ Heard of it but confused
3 ☐ Understand basics
4 ☐ Can explain to others
5 ☐ Could teach this
```

---

Understanding API Design
```
1 ☐ No idea how REST works
2 ☐ Heard of it but confused
3 ☐ Understand basics
4 ☐ Can explain to others
5 ☐ Could teach this
```

---

## What to Review Before Phase 2

Before moving to Phase 2 (Frontend Integration), make sure:

- [ ] You can start the backend without help
- [ ] All 6 tests pass when you run `test_api.py`
- [ ] You can explain each file's purpose
- [ ] You understand why we organize code this way
- [ ] You're comfortable with Pydantic validation
- [ ] You know what a singleton pattern is

---

## Quick Reference for Phase 1

### Knowledge You Need:
- **HTTP methods:** GET (read), POST (create), PUT (update), DELETE (delete)
- **REST:** Representational State Transfer (API design pattern)
- **Pydantic:** Python validation library
- **Supabase:** Database as a service
- **FastAPI:** Python web framework

### Skills You Learned:
- How to organize backend code
- How to validate user input
- How to manage configuration
- How to write tests
- How to debug errors

### Projects You Can Build Now:
- Any REST API backend
- Data validation systems
- Configuration management

---

## Resources for Deeper Learning

If you want to understand more:

**About FastAPI:**
- Official docs: https://fastapi.tiangolo.com/
- Topic: Dependency Injection (next level)

**About Pydantic:**
- Official docs: https://docs.pydantic.dev/
- Topic: Custom validators

**About REST:**
- Topic: HTTP Status Codes
- Topic: RESTful design principles

**About PostgreSQL:**
- Topic: SQL queries
- Topic: Database design

---

## Before You Call Me Done

Can you do this WITHOUT looking at code?

**1. Explain what .env file does** _______________
**2. Explain why singleton connection helps** _______________
**3. Explain how Pydantic validates** _______________
**4. Explain where to add new endpoint** _______________
**5. Explain what each file does** _______________

If you can answer all 5 → You're ready for Phase 2! 🎉

