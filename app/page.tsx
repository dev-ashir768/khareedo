"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ImageSkeleton } from "@/components/image-skeleton";
import { useInView } from "react-intersection-observer";
// import { Popover, Slider } from "radix-ui";
import { Search, ShoppingCart } from "lucide-react";

import { KhareedoLogo } from "@/components/khareedo-logo";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import frame from "@/public/Frame.png";
import cart from "@/public/cart.png";
import bag from "@/public/bag.png";
import productsData from "@/data/products.json";

type Product = {
  id: string;
  product_name: string;
  price: string;
  image: string;
};

const products = productsData.payload.products as Product[];

// const CATEGORIES = ["All", "Men", "Women", "Home", "Kids"];

const allPrices = products.map((p) => Number(p.price));
const PRICE_MIN = 0;
const PRICE_MAX = Math.ceil(Math.max(...allPrices) / 1000) * 1000;
const FULL_RANGE: [number, number] = [PRICE_MIN, PRICE_MAX];

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

export default function Home() {
  const [query, setQuery] = useState("");

  // const [category, setCategory] = useState("All");
  // const [priceOpen, setPriceOpen] = useState(false);
  const [appliedRange] = useState<[number, number]>(FULL_RANGE);
  // const [draftRange, setDraftRange] = useState<[number, number]>(FULL_RANGE);

  // const priceFiltered = appliedRange[0] !== PRICE_MIN || appliedRange[1] !== PRICE_MAX;

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchesQuery = !q || p.product_name.toLowerCase().includes(q);
      const price = Number(p.price);
      const matchesPrice = price >= appliedRange[0] && price <= appliedRange[1];
      return matchesQuery && matchesPrice;
    });
  }, [query, appliedRange]);

  const PAGE_SIZE = 10;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [prevFilteredProducts, setPrevFilteredProducts] =
    useState(filteredProducts);
  if (prevFilteredProducts !== filteredProducts) {
    setPrevFilteredProducts(filteredProducts);
    setVisibleCount(PAGE_SIZE);
  }
  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const [loadingMore, setLoadingMore] = useState(false);
  const { ref: loadMoreRef } = useInView({
    onChange: (inView) => {
      if (!inView || !hasMore || loadingMore) return;
      setLoadingMore(true);
      setTimeout(() => {
        setVisibleCount((c) => c + PAGE_SIZE);
        setLoadingMore(false);
      }, 2000);
    },
  });

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
          src={cart}
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

          {/* <div className="mt-6 flex w-full max-w-full items-center gap-2 overflow-x-auto px-2 pb-1 sm:flex-wrap sm:justify-center sm:overflow-visible">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={cn(
                  "cursor-pointer shadow-md shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-colors",
                  category === c
                    ? "bg-neutral-950 text-white"
                    : "bg-white text-neutral-700 ring-1 ring-black/5 hover:bg-neutral-100"
                )}
              >
                {c}
              </button>
            ))}
            <Popover.Root
              open={priceOpen}
              onOpenChange={(open) => {
                setPriceOpen(open);
                if (open) setDraftRange(appliedRange);
              }}
            >
              <Popover.Trigger asChild>
                <button
                  type="button"
                  className={cn(
                    "cursor-pointer shadow-md group flex shrink-0 items-center gap-1 rounded-full px-5 py-2 text-sm font-medium transition-colors",
                    priceFiltered
                      ? "bg-neutral-950 text-white"
                      : "bg-white text-neutral-700 ring-1 ring-black/5 hover:bg-neutral-100"
                  )}
                >
                  Price
                  <ChevronDown className="size-4 transition-transform group-data-[state=open]:rotate-180" />
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  align="end"
                  sideOffset={10}
                  className="z-30 w-[calc(100vw-3rem)] max-w-80 rounded-2xl bg-white p-5 text-left shadow-xl ring-1 ring-black/5"
                >
                  <Slider.Root
                    className="relative flex h-5 w-full touch-none items-center"
                    min={PRICE_MIN}
                    max={PRICE_MAX}
                    step={50}
                    minStepsBetweenThumbs={1}
                    value={draftRange}
                    onValueChange={(v) => setDraftRange(v as [number, number])}
                  >
                    <Slider.Track className="relative h-1 grow rounded-full bg-neutral-200">
                      <Slider.Range className="absolute h-full rounded-full bg-black" />
                    </Slider.Track>
                    <Slider.Thumb className="block size-5 rounded-full bg-black shadow ring-2 ring-white transition-colors focus-visible:outline-none focus-visible:black" />
                    <Slider.Thumb className="block size-5 rounded-full bg-black shadow ring-2 ring-white transition-colors focus-visible:outline-none focus-visible:black" />
                  </Slider.Root>

                  <div className="mt-6 flex items-center gap-3">
                    <input
                      type="number"
                      inputMode="numeric"
                      min={PRICE_MIN}
                      max={draftRange[1]}
                      value={draftRange[0]}
                      onChange={(e) =>
                        setDraftRange([
                          Math.min(Number(e.target.value) || 0, draftRange[1]),
                          draftRange[1],
                        ])
                      }
                      className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-center text-sm outline-none focus-visible:ring-black"
                    />
                    <span className="shrink-0 text-sm text-neutral-500">to</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      min={draftRange[0]}
                      max={PRICE_MAX}
                      value={draftRange[1]}
                      onChange={(e) =>
                        setDraftRange([
                          draftRange[0],
                          Math.max(Number(e.target.value) || 0, draftRange[0]),
                        ])
                      }
                      className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-center text-sm outline-none "
                    />
                  </div>

                  <div className="mt-5 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setDraftRange(FULL_RANGE);
                        setAppliedRange(FULL_RANGE);
                      }}
                      className="px-5 py-2 flex-1 rounded-xl bg-neutral-100 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-200"
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAppliedRange(draftRange);
                        setPriceOpen(false);
                      }}
                      className="px-5 py-2 flex-1 rounded-xl bg-neutral-950 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
                    >
                      Done
                    </button>
                  </div>
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </div> */}
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-b from-transparent to-white" />
      </section>

      <main className="mx-auto w-full max-w-7xl 2xl:max-w-362.5 flex-1 px-6 pb-16">
        {visibleProducts.length === 0 ? (
          <p className="py-16 text-center text-sm text-neutral-500">
            No products match your filters.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 ">
            {visibleProducts.map((product) => (
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
          © 2026 Khareedo. All Right Reserved.
        </p>
      </footer>
    </div>
  );
}
