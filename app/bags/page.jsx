"use client";

import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard.jsx";

export default function BagsPage() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${backendUrl}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        // ✅ FRONTEND FILTER ONLY
        const bagsProducts = data.filter(
          (item) => item.category?.toLowerCase() === "bags"
        );
        setProducts(bagsProducts);
      })
      .catch(() => console.error("Failed to load products"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading bags...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        👜 Bags Collection
      </h1>

      {products.length === 0 ? (
        <p className="text-center text-gray-500">No bags products found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
