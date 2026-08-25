"use client";

import { ShoppingCart } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full border-b border-gray-100">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 py-4">
        <span className="text-2xl font-bold italic text-black tracking-tight">
          bazarify
        </span>
        <button className="flex items-center gap-2 text-sm font-medium text-black">
          <ShoppingCart className="w-5 h-5" />
          My Cart
        </button>
      </div>
    </header>
  );
}
