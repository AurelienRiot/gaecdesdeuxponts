import { ProductWithCategoryAndImages } from "@/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface CartStore {
  items: ProductWithCategoryAndImages[];
  quantities: { [productId: string]: number };
  dates: { [productId: string]: Date[] };
  addItem: (data: ProductWithCategoryAndImages, date?: Date) => void;
  removeOneItem: (id: string, date?: Date) => void;
  removeItem: (id: string, date?: Date) => void;
  removeAll: () => void;
}

const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],
      quantities: {},
      dates: {},

      addItem: (data: ProductWithCategoryAndImages, date?: Date) => {
        const quantities = get().quantities;
        const dates = get().dates;
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === data.id);

        if (existingItem) {
          quantities[data.id]++;
          if (date) {
            dates[data.id].push(date);
          }
        } else {
          quantities[data.id] = 1;
          set({ items: [...get().items, data] });
          if (date) {
            dates[data.id] = [date];
          }
        }

        set({ quantities, dates });
      },

      removeOneItem: (id: string, date?: Date) => {
        const quantities = get().quantities;
        const dates = get().dates;
        if (date) {
          const index = dates[id].indexOf(date);
          if (index > -1) {
            dates[id].splice(index, 1);
          }
          set({ dates });
        }
        quantities[id]--;
        if (quantities[id] === 0) {
          set({ items: [...get().items.filter((item) => item.id !== id)] });
        } else {
          set({ quantities });
        }
      },

      removeItem: (id: string) => {
        const quantities = get().quantities;
        const dates = get().dates;
        quantities[id] = 0;
        dates[id] = [];
        set({
          items: [...get().items.filter((item) => item.id !== id)],
          quantities,
          dates,
        });
      },

      removeAll: () => {
        set({ items: [], quantities: {}, dates: {} });
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCart;
