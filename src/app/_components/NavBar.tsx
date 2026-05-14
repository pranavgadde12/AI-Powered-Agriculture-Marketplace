"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function NavBar() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-green-600 text-white shadow">
      <Link href="/" className="text-xl font-bold">
        AI Farm Advisor
      </Link>
      <div className="flex items-center gap-6">
        <Link href="/" className="hover:underline">Home</Link>
        <Link href="/farmer" className="hover:underline">Farmer</Link>
        <Link href="/market" className="hover:underline">Marketplace</Link>
        <Link href="/ai" className="hover:underline">AI</Link>

        {userEmail ? (
          <div className="flex items-center gap-4 ml-4 pl-4 border-l border-green-400">
            <span className="text-green-100 text-sm">{userEmail}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-white text-green-700 rounded font-semibold text-sm hover:bg-green-50 transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 ml-4 pl-4 border-l border-green-400">
            <Link
              href="/login"
              className="px-3 py-1 bg-white text-green-700 rounded font-semibold text-sm hover:bg-green-50 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-3 py-1 border border-white text-white rounded font-semibold text-sm hover:bg-green-500 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
