"use client";

import { useState } from "react";
import Link from "next/link";
import { ImageSkeleton } from "@/components/image-skeleton";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "../types";

function formatPrice(price: string | number) {
  return `Rs. ${Math.round(Number(price)).toLocaleString("en-PK")}`;
}

export function ProductCard({ product }: { product: Product }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Link href={`/products/${product.acno}/${product.id}`}>
      <Card className="gap-0 py-0 ring-0 shadow-none transition-transform hover:-translate-y-0.5 border border-[#F6F6F6]">
        <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
          <ImageSkeleton
            src={product.image}
            alt={product.product_name}
            fill
            sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover"
            onLoadingChange={setLoaded}
          />
        </div>
      </Card>
      <div className="px-1 py-3">
        {loaded ? (
          <>
            <p className="line-clamp-2 text-[12px] text-[#474747]">
              {product.product_name}
            </p>
            <p className="mt-1 text-[14px] font-semibold text-black">
              {formatPrice(product.price)}
            </p>
          </>
        ) : (
          <>
            <Skeleton className="h-3 w-4/5" />
            <Skeleton className="mt-2 h-3.5 w-1/2" />
          </>
        )}
      </div>
    </Link>
  );
}

export function ProductCardSkeleton() {
  return (
    <div>
      <Card className="gap-0 py-0 ring-0 shadow-none border border-[#F6F6F6]">
        <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
          <Skeleton className="absolute inset-0" />
        </div>
      </Card>
      <div className="px-1 py-3">
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="mt-2 h-3.5 w-1/2" />
      </div>
    </div>
  );
}
