"use client";

import {create} from "zustand";
import {persist} from "zustand/middleware";

export type CartItem = {
  slug: string;
  variantId?: string;
  name: string;
  price: number;
  image: string;
  weight: string;
  quantity: number;
  category?: string;
  notes?: string[];
};

type CartState = {
  items: CartItem[];
  buyNowItem: CartItem | null;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setBuyNow: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  updateBuyNowQuantity: (quantity: number) => void;
  clearBuyNow: () => void;
};

export function cartItemId(item: Pick<CartItem, "slug" | "variantId">) {
  return item.variantId ?? item.slug;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      buyNowItem: null,
      addItem: (item, quantity = 1) =>
        set((state) => {
          const existing = state.items.find(
            (cartItem) => cartItemId(cartItem) === cartItemId(item)
          );

          if (existing) {
            return {
              items: state.items.map((cartItem) =>
                cartItemId(cartItem) === cartItemId(item)
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
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => cartItemId(item) !== id)
        })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((item) => cartItemId(item) !== id)
              : state.items.map((item) =>
                  cartItemId(item) === id ? {...item, quantity} : item
                )
        })),
      clearCart: () => set({items: []}),
      setBuyNow: (item, quantity = 1) =>
        set({buyNowItem: {...item, quantity}}),
      updateBuyNowQuantity: (quantity) =>
        set((state) =>
          state.buyNowItem
            ? {buyNowItem: {...state.buyNowItem, quantity: Math.max(1, quantity)}}
            : {}
        ),
      clearBuyNow: () => set({buyNowItem: null})
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
