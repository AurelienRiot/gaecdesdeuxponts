import type { ProductWithOptionsAndMain } from "@/types";
import { toast } from "sonner";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface CartStore {
  items: ProductWithOptionsAndMain[];
  quantities: { [productId: string]: number };
  addItem: (data: ProductWithOptionsAndMain, quantity?: number) => void;
  changeQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  removeAll: () => void;
}

const cartStorage = persist<CartStore>(
  (set, get) => ({
    items: [],
    quantities: {},

    addItem: (data: ProductWithOptionsAndMain, quantity?: number) => {
      const quantities = get().quantities;
      const currentItems = get().items;
      const existingItem = currentItems.find((item) => item.id === data.id);

      if (existingItem) {
        quantities[data.id] += quantity || 1;
      } else {
        quantities[data.id] = quantity || 1;
        set({ items: [...get().items, data] });
      }
      set({ quantities });
      toast.success("Produit ajouté au panier.");
    },

    changeQuantity: (id: string, quantity: number) => {
      const quantities = get().quantities;
      quantities[id] = quantity;

      if (quantity === 0) {
        set({
          items: [...get().items.filter((item) => item.id !== id)],
          quantities,
        });
        toast.success("Produit retiré du panier");
      } else {
        set({ quantities });
      }
    },

    removeItem: (id: string) => {
      const quantities = get().quantities;
      quantities[id] = 0;
      set({
        items: [...get().items.filter((item) => item.id !== id)],
        quantities,
      });
      toast.success("Produit retiré du panier");
    },

    removeAll: () => {
      const quantities = get().quantities;
      for (const productId of Object.keys(get().quantities)) {
        quantities[productId] = 0;
      }
      set({ items: [], quantities });
    },
  }),
  {
    name: "cart-storage",
    storage: createJSONStorage(() => localStorage),
  },
);

const useCart = create(cartStorage);

export default useCart;
