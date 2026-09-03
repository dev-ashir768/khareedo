"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { z } from "zod";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { KhareedoLogo } from "@/components/khareedo-logo";
import {
  useCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} from "./use-cart-store";

const orderSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[0-9+\-\s()]+$/, "Please enter a valid phone number"),
  city: z.string().min(2, "City is required"),
  address: z.string().min(5, "Please enter a complete address"),
  remarks: z.string().optional(),
});

type OrderForm = z.infer<typeof orderSchema>;
type FormErrors = Partial<Record<keyof OrderForm, string>>;

function formatPrice(n: number) {
  return `Rs. ${Math.round(n).toLocaleString("en-PK")}`;
}

export default function CartWrapper() {
  const { items } = useCart();
  const [mounted, setMounted] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof OrderForm, boolean>>>({});

  const [form, setForm] = useState<OrderForm>({
    name: "",
    email: "",
    phone: "",
    city: "",
    address: "",
    remarks: "",
  });

  useEffect(() => {
    setMounted(true); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  if (!mounted) return null;

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  function updateField(field: keyof OrderForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const result = orderSchema.shape[field].safeParse(value);
      setErrors((prev) => ({
        ...prev,
        [field]: result.success ? undefined : result.error.issues[0].message,
      }));
    }
  }

  function handleBlur(field: keyof OrderForm) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const result = orderSchema.shape[field].safeParse(form[field]);
    setErrors((prev) => ({
      ...prev,
      [field]: result.success ? undefined : result.error.issues[0].message,
    }));
  }

  if (orderPlaced) {
    return (
      <div className="flex min-h-screen flex-col bg-white text-neutral-900">
        <Header cartCount={0} />
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-green-50">
            <svg
              className="size-10 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Order Placed!</h1>
          <p className="text-neutral-500 mb-6 max-w-md">
            Thank you for your order. Your order has been submitted
            successfully. We&apos;ll get back to you shortly.
          </p>
          <Link href="/">
            <Button size="lg" className="rounded-xl h-12 px-8">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col bg-white text-neutral-900">
        <Header cartCount={0} />
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <ShoppingCart className="size-16 text-neutral-200 mb-6" />
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-neutral-500 mb-6">
            Explore our marketplace to find amazing products!
          </p>
          <Link href="/">
            <Button size="lg" className="rounded-xl h-12 px-8">
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = orderSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      const allTouched: Partial<Record<keyof OrderForm, boolean>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof OrderForm;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
        allTouched[field] = true;
      }
      setErrors(fieldErrors);
      setTouched((prev) => ({ ...prev, ...allTouched }));
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      clearCart();
      setOrderPlaced(true);
      setSubmitting(false);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-900">
      <Header cartCount={totalItems} />

      <div className="mx-auto w-full max-w-7xl 2xl:max-w-362.5 px-6 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 mb-6"
        >
          <ArrowLeft className="size-4" />
          Continue Shopping
        </Link>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
            <div className="lg:col-span-5">
              <h2 className="text-xl font-semibold mb-6">Shipping Details</h2>
              <div className="flex flex-col gap-4">
                <Input
                  label="Full Name"
                  placeholder="e.g. Ahmed Khan"
                  value={form.name}
                  onChange={(v) => updateField("name", v)}
                  onBlur={() => handleBlur("name")}
                  error={touched.name ? errors.name : undefined}
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(v) => updateField("email", v)}
                  onBlur={() => handleBlur("email")}
                  error={touched.email ? errors.email : undefined}
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="03XX XXXXXXX"
                  value={form.phone}
                  onChange={(v) => updateField("phone", v)}
                  onBlur={() => handleBlur("phone")}
                  error={touched.phone ? errors.phone : undefined}
                />
                <Input
                  label="City"
                  placeholder="e.g. Lahore"
                  value={form.city}
                  onChange={(v) => updateField("city", v)}
                  onBlur={() => handleBlur("city")}
                  error={touched.city ? errors.city : undefined}
                />
                <Input
                  label="Address"
                  placeholder="House #, Street, Area"
                  value={form.address}
                  onChange={(v) => updateField("address", v)}
                  onBlur={() => handleBlur("address")}
                  error={touched.address ? errors.address : undefined}
                />
                <Input
                  label="Remarks (optional)"
                  placeholder="Any special instructions"
                  value={form.remarks ?? ""}
                  onChange={(v) => updateField("remarks", v)}
                />
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-3xl bg-neutral-50 p-5 sm:p-7">
                <h2 className="text-xl font-semibold mb-6">Your Order</h2>

                <div className="flex flex-col gap-4 mb-6">
                  {items.map((item) => (
                    <div
                      key={`${item.id}-${item.variation_id}`}
                      className="flex items-center gap-4 rounded-xl bg-white p-4"
                    >
                      <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.product_name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {item.product_name}
                        </p>
                        {item.selectedAttributes && (
                          <p className="text-xs text-neutral-500">
                            {Object.entries(item.selectedAttributes)
                              .map(([k, v]) => `${k}: ${v}`)
                              .join(", ")}
                          </p>
                        )}
                        <p className="text-sm font-semibold mt-0.5">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center rounded-full border border-neutral-200">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.variation_id,
                                -1
                              )
                            }
                            className="flex size-8 items-center justify-center rounded-l-full hover:bg-neutral-100"
                          >
                            <Minus className="size-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-medium">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.variation_id,
                                1
                              )
                            }
                            className="flex size-8 items-center justify-center rounded-r-full hover:bg-neutral-100"
                          >
                            <Plus className="size-3" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            removeFromCart(item.id, item.variation_id)
                          }
                          className="flex size-8 items-center justify-center text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Subtotal</span>
                    <span className="font-semibold">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Shipping</span>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>
                  <div className="border-t border-neutral-200 pt-2 flex justify-between text-base font-bold">
                    <span>Total</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-neutral-700 mb-1">
                    Payment Method
                  </p>
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <div className="size-4 rounded-full border-2 border-neutral-950 flex items-center justify-center">
                      <div className="size-2 rounded-full bg-neutral-950" />
                    </div>
                    Cash on Delivery
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full rounded-xl h-12 text-base font-semibold"
                  disabled={submitting}
                >
                  {submitting ? "Processing..." : "Place Order"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <footer className="mt-auto border-t border-black/5 py-6">
        <p className="text-center text-sm text-neutral-500">
          &copy; 2026 Khareedo. All Right Reserved.
        </p>
      </footer>
    </div>
  );
}

function Header({ cartCount }: { cartCount: number }) {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl 2xl:max-w-362.5 items-center justify-between px-6 py-4">
        <Link href="/">
          <KhareedoLogo className="h-4 2xl:h-5 text-neutral-950" />
        </Link>
        <Link
          href="/cart"
          className="relative flex items-center gap-2 text-sm font-medium text-neutral-900"
        >
          <ShoppingCart className="size-5" />
          <span className="hidden sm:inline">My Cart</span>
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full bg-neutral-950 text-[10px] font-bold text-white">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}

function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
  error,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={cn(
          "w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors",
          "placeholder:text-neutral-400",
          error
            ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
            : "border-neutral-200 focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400"
        )}
      />
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
