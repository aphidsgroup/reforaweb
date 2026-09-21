import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  variantName?: string;
  slug: string;
  imageUrl: string;
  priceInPaise: number;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  itemCount: number;
  totalInPaise: number;
  couponCode: string | null;
  discountInPaise: number;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string, discountInPaise: number) => void;
  removeCoupon: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      itemCount: 0,
      totalInPaise: 0,
      couponCode: null,
      discountInPaise: 0,

      addItem: (item) => {
        const items = get().items;
        const key = `${item.productId}-${item.variantId ?? "default"}`;
        const existing = items.find(
          (i) => `${i.productId}-${i.variantId ?? "default"}` === key
        );

        let newItems: CartItem[];
        if (existing) {
          newItems = items.map((i) =>
            `${i.productId}-${i.variantId ?? "default"}` === key
              ? { ...i, quantity: i.quantity + (item.quantity ?? 1) }
              : i
          );
        } else {
          newItems = [...items, { ...item, quantity: item.quantity ?? 1 }];
        }

        set({
          items: newItems,
          itemCount: newItems.reduce((sum, i) => sum + i.quantity, 0),
          totalInPaise: newItems.reduce(
            (sum, i) => sum + i.priceInPaise * i.quantity,
            0
          ),
        });
      },

      removeItem: (id) => {
        const newItems = get().items.filter((i) => i.id !== id);
        set({
          items: newItems,
          itemCount: newItems.reduce((sum, i) => sum + i.quantity, 0),
          totalInPaise: newItems.reduce(
            (sum, i) => sum + i.priceInPaise * i.quantity,
            0
          ),
        });
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) {
          get().removeItem(id);
          return;
        }
        const newItems = get().items.map((i) =>
          i.id === id ? { ...i, quantity } : i
        );
        set({
          items: newItems,
          itemCount: newItems.reduce((sum, i) => sum + i.quantity, 0),
          totalInPaise: newItems.reduce(
            (sum, i) => sum + i.priceInPaise * i.quantity,
            0
          ),
        });
      },

      clearCart: () =>
        set({
          items: [],
          itemCount: 0,
          totalInPaise: 0,
          couponCode: null,
          discountInPaise: 0,
        }),

      applyCoupon: (code, discountInPaise) =>
        set({ couponCode: code, discountInPaise }),

      removeCoupon: () => set({ couponCode: null, discountInPaise: 0 }),
    }),
    {
      name: "refora-cart",
      // Only persist in browser
      skipHydration: typeof window === "undefined",
    }
  )
);
