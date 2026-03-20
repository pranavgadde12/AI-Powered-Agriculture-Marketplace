export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-50">
      <h1 className="text-5xl font-bold text-green-700">
        AI Farm Advicer 🌱
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        AI-powered platform for farmers and fresh food buyers
      </p>

      <div className="mt-6 space-x-4">
        <a href="/farmer" className="px-6 py-3 bg-green-600 text-white rounded">
          Farmer Dashboard
        </a>
        <a href="/market" className="px-6 py-3 bg-gray-800 text-white rounded">
          Browse Marketplace
        </a>
      </div>
    </div>
  );
}