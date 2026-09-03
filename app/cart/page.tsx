import CartWrapper from "@/features/cart/cart-wrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart — Khareedo",
};

export default function CartPage() {
  return <CartWrapper />;
}
