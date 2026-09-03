"use client";

import { useSyncExternalStore } from "react";
import { CartItem } from "../types";

type CartState = {
  items: CartItem[];
};

let state: CartState = { items: [] };
const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((l) => l());
}

function getSnapshot() {
  return state;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function addToCart(item: CartItem) {
  const existing = state.items.find(
    (i) => i.id === item.id && i.variation_id === item.variation_id
  );
  if (existing) {
    state = {
      items: state.items.map((i) =>
        i === existing ? { ...i, quantity: i.quantity + item.quantity } : i
      ),
    };
  } else {
    state = { items: [...state.items, item] };
  }
  emitChange();
}

export function removeFromCart(id: string, variationId?: string) {
  state = {
    items: state.items.filter(
      (i) => !(i.id === id && i.variation_id === variationId)
    ),
  };
  emitChange();
}

export function updateQuantity(id: string, variationId: string | undefined, delta: number) {
  state = {
    items: state.items
      .map((i) => {
        if (i.id === id && i.variation_id === variationId) {
          const newQty = i.quantity + delta;
          return newQty <= 0 ? null : { ...i, quantity: newQty };
        }
        return i;
      })
      .filter(Boolean) as CartItem[],
  };
  emitChange();
}

export function clearCart() {
  state = { items: [] };
  emitChange();
}

export function useCart() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
