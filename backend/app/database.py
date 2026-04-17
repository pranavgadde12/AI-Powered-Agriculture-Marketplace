"""Database Connection - Central connection management"""

from supabase import create_client
from app.config import settings

class Database:
    """Manages Supabase connection"""
    
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.client = None
        return cls._instance
    
    def connect(self):
        """Initialize Supabase connection"""
        if self.client is None:
            print("🔌 Connecting to Supabase...")
            self.client = create_client(
                settings.supabase_url,
                settings.supabase_key
            )
            print("✅ Connected to Supabase")
        return self.client
    
    def get_client(self):
        """Get existing connection"""
        if self.client is None:
            self.connect()
        return self.client

db = Database()

def get_supabase():
    """Function to get database connection"""
    return db.get_client()

def test_connection():
    """Test if database is working"""
    try:
        client = get_supabase()
        response = client.table("products").select("count", count="exact").execute()
        print(f"✅ Database connected. Products in database: {response.count or 0}")
        return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False
