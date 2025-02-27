import { useState } from "react";

const products = [
  { id: 1, name: "Shampoo", price: 15, image: "/shampoo.png" },
  { id: 2, name: "Conditioner", price: 18, image: "/conditioner.png" },
];

export default function Shop() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Shop Our Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-4 rounded-lg shadow-lg">
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-md" />
            <h2 className="text-xl font-semibold mt-4">{product.name}</h2>
            <p className="text-gray-600">${product.price}</p>
            <button className="bg-pink-500 text-white px-4 py-2 rounded-md mt-2 w-full hover:bg-pink-700">
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
