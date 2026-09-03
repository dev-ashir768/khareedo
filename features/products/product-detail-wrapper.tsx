"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Minus, Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ProductDetail } from "../types";
import { addToCart, useCart } from "../cart/use-cart-store";
import { KhareedoLogo } from "@/components/khareedo-logo";

function formatPrice(price: string | number) {
  return `Rs. ${Math.round(Number(price)).toLocaleString("en-PK")}`;
}

function decodeHtml(html: string) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

interface Props {
  productId: number;
  acno: string;
}

export default function ProductDetailWrapper({ productId, acno }: Props) {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const cart = useCart();

  useEffect(() => {
    let cancelled = false;
    setLoading(true); // eslint-disable-line react-hooks/set-state-in-effect
    fetch("/api/products/detail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: productId, acno }),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setProduct(data);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError(true);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [productId, acno]);

  const activeVariation =
    product?.variations?.find((v) => {
      const totalAttrs = product.attributes?.length ?? 0;
      const selectedCount = Object.keys(selectedAttributes).length;
      if (selectedCount < totalAttrs) return false;
      return Object.entries(selectedAttributes).every(
        ([key, val]) => v.combination[key] === val
      );
    }) ?? null;

  const resolvedPrice = activeVariation
    ? product?.on_sale === "Y"
      ? activeVariation.sale_price
      : activeVariation.price
    : product?.on_sale === "Y"
      ? product?.default_sale_price
      : product?.default_price;

  const resolvedImage =
    activeVariation?.variation_image ||
    product?.default_image ||
    product?.images?.[0]?.url ||
    "";

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    addToCart({
      id: product.id,
      acno: product.acno,
      product_name: product.product_name,
      price: Number(resolvedPrice),
      image: resolvedImage,
      quantity,
      variation_id: activeVariation?.variation_id,
      selectedAttributes:
        Object.keys(selectedAttributes).length > 0
          ? selectedAttributes
          : undefined,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }, [
    product,
    resolvedPrice,
    resolvedImage,
    quantity,
    activeVariation,
    selectedAttributes,
  ]);

  const hasVariations =
    !!product?.variations && product.variations.length > 0;
  const allAttributesSelected =
    !hasVariations ||
    Object.keys(selectedAttributes).length ===
      (product?.attributes?.length ?? 0);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <header className="border-b border-black/5">
          <div className="mx-auto flex max-w-7xl 2xl:max-w-362.5 items-center justify-between px-6 py-4">
            <KhareedoLogo className="h-4 2xl:h-5 text-neutral-950" />
          </div>
        </header>
        <div className="mx-auto w-full max-w-7xl 2xl:max-w-362.5 px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="aspect-square w-full rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen flex-col bg-white items-center justify-center">
        <p className="text-neutral-500 mb-4">Failed to load product.</p>
        <Link href="/" className="text-sm underline">
          Back to Marketplace
        </Link>
      </div>
    );
  }

  const images =
    product.images.length > 0
      ? product.images
      : [{ url: product.default_image, alt: product.product_name }];

  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-900">
      <header className="sticky top-0 z-50 border-b border-black/5 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl 2xl:max-w-362.5 items-center justify-between px-6 py-4">
          <Link href="/">
            <KhareedoLogo className="h-4 2xl:h-5 text-neutral-950" />
          </Link>
          <Link
            href="/cart"
            className="relative flex items-center gap-2 text-sm font-medium text-neutral-900 transition-colors hover:text-black"
          >
            <ShoppingCart className="size-5" />
            <span className="hidden sm:inline">My Cart</span>
            {cart.items.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full bg-neutral-950 text-[10px] font-bold text-white">
                {cart.items.reduce((sum, i) => sum + i.quantity, 0)}
              </span>
            )}
          </Link>
        </div>
      </header>

      <div className="mx-auto w-full max-w-7xl 2xl:max-w-362.5 px-6 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 mb-6"
        >
          <ArrowLeft className="size-4" />
          Back to Marketplace
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-neutral-100">
              <Image
                src={images[selectedImage]?.url || resolvedImage}
                alt={images[selectedImage]?.alt || product.product_name}
                fill
                className="object-contain"
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      "relative size-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100 border-2 transition-all",
                      selectedImage === i
                        ? "border-neutral-950"
                        : "border-transparent hover:border-neutral-300"
                    )}
                  >
                    <Image
                      src={img.url}
                      alt={img.alt || `Thumbnail ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <p className="text-sm text-neutral-500 mb-2">
              {product.business_name}
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
              {product.product_name}
            </h1>
            <p className="text-2xl font-semibold mb-6">
              {formatPrice(resolvedPrice || "0")}
            </p>

            {/* Attributes */}
            {hasVariations &&
              product.attributes.map((attr) => (
                <div key={attr.name} className="mb-5">
                  <p className="text-sm font-medium text-neutral-700 mb-2">
                    {attr.name}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {attr.options.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() =>
                          setSelectedAttributes((prev) => ({
                            ...prev,
                            [attr.name]: opt,
                          }))
                        }
                        className={cn(
                          "rounded-lg border px-4 py-2 text-sm font-medium transition-all",
                          selectedAttributes[attr.name] === opt
                            ? "border-neutral-950 bg-neutral-950 text-white"
                            : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium text-neutral-700">Qty</span>
              <div className="flex items-center rounded-full border border-neutral-200">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="flex size-10 items-center justify-center rounded-l-full text-neutral-600 transition-colors hover:bg-neutral-100 disabled:opacity-40"
                >
                  <Minus className="size-4" />
                </button>
                <span className="w-10 text-center text-sm font-medium">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex size-10 items-center justify-center rounded-r-full text-neutral-600 transition-colors hover:bg-neutral-100"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:max-w-sm">
              <Button
                size="lg"
                className="w-full rounded-xl text-base font-semibold h-12"
                onClick={handleAddToCart}
                disabled={!allAttributesSelected}
              >
                {addedToCart ? "Added!" : "Add to Cart"}
              </Button>
              <Link href="/cart">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full rounded-xl text-base font-semibold h-12"
                  onClick={() => {
                    if (allAttributesSelected) handleAddToCart();
                  }}
                >
                  Buy Now
                </Button>
              </Link>
            </div>

            {/* Description */}
            {product.description && (
              <div className="mt-8 border-t border-neutral-100 pt-6">
                <h3 className="font-semibold mb-3">Description</h3>
                <div
                  className="text-sm text-neutral-600 leading-relaxed [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5"
                  dangerouslySetInnerHTML={{
                    __html: decodeHtml(product.description),
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="mt-auto border-t border-black/5 py-6">
        <p className="text-center text-sm text-neutral-500">
          &copy; 2026 Khareedo. All Right Reserved.
        </p>
      </footer>
    </div>
  );
}
