import "./globals.css";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>

        <nav className="flex justify-between items-center px-8 py-4 bg-green-600 text-white shadow">
          <h1 className="text-xl font-bold">AI Farm Advicer 🌱</h1>
          <div className="space-x-6">
            <Link href="/">Home</Link>
            <Link href="/farmer">Farmer</Link>
            <Link href="/market">Marketplace</Link>
            <Link href="/ai">AI</Link>
          </div>
        </nav>

        <main>{children}</main>

      </body>
    </html>
  );
}