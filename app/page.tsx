"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ImageSkeleton } from "@/components/image-skeleton";
import { useInView } from "react-intersection-observer";
import { Search, ShoppingCart } from "lucide-react";

import { KhareedoLogo } from "@/components/khareedo-logo";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import frame from "@/public/Frame.png";
import cartImg from "@/public/cart.png";
import bag from "@/public/bag.png";

type Product = {
  id: string;
  product_name: string;
  price: string;
  image: string;
};

const PAGE_SIZE = 10;
const API_URL = "/api/products";

function formatPrice(price: string | number) {
  return `Rs. ${Math.round(Number(price)).toLocaleString("en-PK")}`;
}

function ProductCard({ product }: { product: Product }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div>
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
    </div>
  );
}

function ProductCardSkeleton() {
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

async function fetchProducts(search: string, offset: number) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ limit: PAGE_SIZE, offset, search }),
  });
  if (!res.ok) throw new Error("Failed to fetch products");
  const data = await res.json();
  return {
    products: data.products as Product[],
    hasMore: data.hasMore as boolean,
  };
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const offsetRef = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), 400);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    offsetRef.current = 0;
    fetchProducts(debouncedQuery, 0)
      .then(({ products: p, hasMore: more }) => {
        if (cancelled) return;
        setProducts(p);
        setHasMore(more);
        offsetRef.current = p.length;
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setProducts([]);
        setHasMore(false);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    fetchProducts(debouncedQuery, offsetRef.current)
      .then(({ products: p, hasMore: more }) => {
        setProducts((prev) => [...prev, ...p]);
        setHasMore(more);
        offsetRef.current += p.length;
        setLoadingMore(false);
      })
      .catch(() => {
        setLoadingMore(false);
      });
  }, [debouncedQuery, loadingMore, hasMore]);

  const { ref: loadMoreRef } = useInView({
    onChange: (inView) => {
      if (inView) loadMore();
    },
  });

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-900">
      <header
        className={cn(
          "fixed top-0 z-50 w-full right-0 left-0",
          scrolled && "bg-neutral-50/90 backdrop-blur z-20",
        )}
      >
        <div className="mx-auto flex max-w-7xl 2xl:max-w-362.5 items-center justify-between px-6 py-4">
          <KhareedoLogo className="h-4 2xl:h-5 text-neutral-950" />
          <button
            type="button"
            className="cursor-pointer flex items-center gap-2 text-sm font-medium text-neutral-900 transition-colors hover:text-black"
          >
            <ShoppingCart className="size-5" />
            <span className="hidden sm:inline">My Cart</span>
          </button>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <Image
          src={frame}
          alt=""
          aria-hidden
          priority
          className="pointer-events-none absolute inset-x-0 top-0 z-0 h-auto w-full select-none"
        />

        <Image
          src={cartImg}
          alt=""
          aria-hidden
          className="pointer-events-none absolute left-0 top-36 z-20 hidden w-32 select-none sm:block md:w-44 lg:w-54 2xl:w-64"
        />
        <Image
          src={bag}
          alt=""
          aria-hidden
          className="pointer-events-none absolute right-0 top-26 z-20 hidden w-28 select-none sm:block md:w-40 lg:w-45 2xl:w-55"
        />

        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 pb-16 pt-14 text-center sm:pt-20">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-950 md:text-4xl 2xl:text-5xl">
            Welcome to the Marketplace
          </h1>
          <p className="mt-4 max-w-3xl  text-base text-[#474747] 2xl:text-[18px]">
            Your one-stop destination for everything you need. Discover
            thousands of products, unbeatable deals, and a seamless shopping
            experience all in one place.
          </p>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-8 flex w-full max-w-xl items-center gap-2 rounded-full bg-white p-2 shadow-[0px_2px_8px_0px_rgba(99,99,99,0.2)]"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What are you shopping for today?"
              className="w-full bg-transparent px-4 py-1 text-sm outline-none placeholder:text-[#474747]"
            />
            <button
              type="submit"
              aria-label="Search"
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-white transition-colors hover:bg-neutral-800"
            >
              <Search className="size-6" />
            </button>
          </form>


        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-b from-transparent to-white" />
      </section>

      <main className="mx-auto w-full max-w-7xl 2xl:max-w-362.5 flex-1 px-6 pb-16">
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="py-16 text-center text-sm text-neutral-500">
            No products match your search.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 ">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        {hasMore && (
          <p
            ref={loadMoreRef}
            className="py-8 text-center text-sm text-neutral-500"
          >
            Loading more products...
          </p>
        )}
      </main>

      <footer className="border-t border-black/5 py-6">
        <p className="text-center text-sm text-neutral-500">
          © 2026 Khareedo. All Right Reserved.
        </p>
      </footer>
    </div>
  );
}
