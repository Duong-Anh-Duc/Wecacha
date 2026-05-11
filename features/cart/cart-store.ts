"use client";

import {create} from "zustand";
import {persist} from "zustand/middleware";

export type CartItem = {
  slug: string;
  name: string;
  price: number;
  image: string;
  weight: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item, quantity = 1) =>
        set((state) => {
          const existing = state.items.find(
            (cartItem) => cartItem.slug === item.slug
          );

          if (existing) {
            return {
              items: state.items.map((cartItem) =>
                cartItem.slug === item.slug
                  ? {
                      ...cartItem,
                      quantity: cartItem.quantity + quantity
                    }
                  : cartItem
              )
            };
          }

          return {
            items: [...state.items, {...item, quantity}]
          };
        }),
      removeItem: (slug) =>
        set((state) => ({
          items: state.items.filter((item) => item.slug !== slug)
        })),
      updateQuantity: (slug, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((item) => item.slug !== slug)
              : state.items.map((item) =>
                  item.slug === slug ? {...item, quantity} : item
                )
        })),
      clearCart: () => set({items: []})
    }),
    {
      name: "son-la-coffee-cart"
    }
  )
);

export function getCartTotals(items: CartItem[]) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 0 ? 30000 : 0;
  return {
    subtotal,
    shipping,
    total: subtotal + shipping
  };
}
