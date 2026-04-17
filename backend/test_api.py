"""
API TEST SCRIPT
===============

Run this to test all backend endpoints

Usage:
    python test_api.py
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_health():
    """Test: Is backend alive?"""
    print("\n" + "="*50)
    print("TEST 1: Health Check")
    print("="*50)
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_root():
    """Test: Home endpoint"""
    print("\n" + "="*50)
    print("TEST 2: Home Endpoint")
    print("="*50)
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_get_products():
    """Test: Get all products"""
    print("\n" + "="*50)
    print("TEST 3: Get All Products")
    print("="*50)
    try:
        response = requests.get(f"{BASE_URL}/api/products")
        print(f"Status: {response.status_code}")
        data = response.json()
        print(f"Products count: {len(data) if isinstance(data, list) else 0}")
        print(f"Response: {json.dumps(data, indent=2)[:200]}...")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_create_product():
    """Test: Create a product"""
    print("\n" + "="*50)
    print("TEST 4: Create Product")
    print("="*50)
    try:
        product_data = {
            "name": "Fresh Tomatoes",
            "price": 5.50,
            "location": "Farm A, Village X",
            "category": "Vegetables",
            "farming_method": "Organic",
            "harvest_date": "2024-04-17"
        }
        response = requests.post(
            f"{BASE_URL}/api/products",
            json=product_data
        )
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_get_orders():
    """Test: Get all orders"""
    print("\n" + "="*50)
    print("TEST 5: Get All Orders")
    print("="*50)
    try:
        response = requests.get(f"{BASE_URL}/api/orders")
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)[:200]}...")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_ai_chat():
    """Test: AI chat endpoint"""
    print("\n" + "="*50)
    print("TEST 6: AI Chat")
    print("="*50)
    try:
        response = requests.post(
            f"{BASE_URL}/api/ai/chat",
            json={"message": "What should I plant this season?"}
        )
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    """Run all tests"""
    print("\n\n")
    print("╔" + "="*48 + "╗")
    print("║" + " "*10 + "🧪 API TEST SUITE - PHASE 1" + " "*12 + "║")
    print("╚" + "="*48 + "╝")
    
    tests = [
        ("Health Check", test_health),
        ("Home Endpoint", test_root),
        ("Get Products", test_get_products),
        ("Create Product", test_create_product),
        ("Get Orders", test_get_orders),
        ("AI Chat", test_ai_chat),
    ]
    
    results = []
    for name, test_func in tests:
        try:
            result = test_func()
            results.append((name, result))
        except Exception as e:
            print(f"\n❌ Test failed: {e}")
            results.append((name, False))
    
    # Summary
    print("\n\n" + "="*50)
    print("SUMMARY")
    print("="*50)
    
    for name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {name}")
    
    passed = sum(1 for _, r in results if r)
    total = len(results)
    
    print(f"\nTotal: {passed}/{total} tests passed")
    print("="*50 + "\n")
    
    if passed == total:
        print("🎉 ALL TESTS PASSED! Backend is working correctly!\n")
    else:
        print(f"⚠️  {total - passed} test(s) failed. Check errors above.\n")

if __name__ == "__main__":
    main()
