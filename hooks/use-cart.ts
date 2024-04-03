import { ProductWithCategoryAndImages } from "@/types";
import { toast } from "sonner";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface CartStore {
  items: ProductWithCategoryAndImages[];
  quantities: { [productId: string]: number };
  addItem: (data: ProductWithCategoryAndImages) => void;
  changeQuantity: (id: string, quantity: number) => void;
  addOneItem: (id: string) => void;
  removeOneItem: (id: string) => void;
  removeItem: (id: string) => void;
  removeAll: () => void;
}

const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],
      quantities: {},

      addItem: (data: ProductWithCategoryAndImages) => {
        const quantities = get().quantities;
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === data.id);

        if (existingItem) {
          quantities[data.id]++;
        } else {
          quantities[data.id] = 1;
          set({ items: [...get().items, data] });
        }
        set({ quantities });
        toast.success("Produit ajouté au panier.");
      },

      addOneItem: (id: string) => {
        const quantities = get().quantities;
        quantities[id]++;
        set({ quantities });
      },

      changeQuantity: (id: string, quantity: number) => {
        const quantities = get().quantities;
        quantities[id] = quantity;

        if (quantities[id] === 0) {
          set({ items: [...get().items.filter((item) => item.id !== id)] });
          toast.success("Produit retiré du panier");
        } else {
          set({ quantities });
        }
      },

      removeOneItem: (id: string) => {
        const quantities = get().quantities;
        quantities[id]--;
        if (quantities[id] === 0) {
          set({ items: [...get().items.filter((item) => item.id !== id)] });
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
  ),
);

export default useCart;
