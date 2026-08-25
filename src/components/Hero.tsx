"use client";

import { Search } from "lucide-react";

const categories = ["All", "Men", "Women", "Home", "Kids", "Price"];

export default function Hero() {
  return (
    <section className="relative text-center pt-10 pb-6 px-4 overflow-hidden">
      {/* Decorative shopping cart - left */}
      <div className="absolute left-[-20px] top-[40%] -translate-y-1/2 text-[120px] opacity-80 pointer-events-none select-none hidden lg:block rotate-[-15deg]">
        🛒
      </div>

      {/* Decorative shopping bag - right */}
      <div className="absolute right-[-10px] top-[40%] -translate-y-1/2 text-[120px] opacity-80 pointer-events-none select-none hidden lg:block rotate-[10deg]">
        🛍️
      </div>

      <h1 className="text-4xl md:text-[56px] font-bold text-black mb-4 leading-tight">
        Welcome to the Marketplace
      </h1>
      <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
        Your one-stop destination for everything you need. Discover thousands of
        products, unbeatable deals, and a seamless shopping experience all in one
        place.
      </p>

      <div className="max-w-xl mx-auto mb-8">
        <div className="flex items-center border border-gray-200 rounded-full px-5 py-3 bg-white shadow-sm">
          <input
            type="text"
            placeholder="What are you shopping for today?"
            className="flex-1 outline-none text-sm text-gray-500 bg-transparent"
          />
          <button className="w-10 h-10 bg-black rounded-full flex items-center justify-center ml-2 -mr-2">
            <Search className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`px-6 py-2.5 rounded-full text-sm font-medium border transition-colors ${
              cat === "All"
                ? "bg-black text-white border-black"
                : "bg-white text-black border-gray-200 hover:border-gray-400"
            }`}
          >
            {cat}
            {cat === "Price" && (
              <svg
                className="w-3 h-3 inline ml-1.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
