"use client";

import { createContext, useContext, useEffect, useReducer, useState } from "react";

const STORAGE_KEY = "brandy-cart";

// ─── Types ────────────────────────────────────────────────────────────────────

export type CartItem = {
  id:        string; // composite: productId-color-size
  productId: string;
  name:      string;
  brand:     string;
  size:      string;
  color:     string;
  price:     string; // e.g. "4 200 MDL"
  image:     string;
  quantity:  number;
};

type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: "ADD";    item: Omit<CartItem, "quantity"> }
  | { type: "REMOVE"; id: string }
  | { type: "UPDATE"; id: string; quantity: number }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; items: CartItem[] };

// ─── Reducer ──────────────────────────────────────────────────────────────────

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return { items: action.items };

    case "ADD": {
      const existing = state.items.find((i) => i.id === action.item.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === action.item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { ...action.item, quantity: 1 }] };
    }

    case "REMOVE":
      return { items: state.items.filter((i) => i.id !== action.id) };

    case "UPDATE": {
      if (action.quantity <= 0) {
        return { items: state.items.filter((i) => i.id !== action.id) };
      }
      return {
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, quantity: action.quantity } : i
        ),
      };
    }

    case "CLEAR":
      return { items: [] };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

type CartContextValue = {
  items:           CartItem[];
  itemCount:       number;
  isHydrated:      boolean;
  addItem:         (item: Omit<CartItem, "quantity">) => void;
  removeItem:      (id: string) => void;
  updateQuantity:  (id: string, quantity: number) => void;
  clearCart:       () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch]   = useReducer(cartReducer, { items: [] });
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage once on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "HYDRATE", items: JSON.parse(raw) });
    } catch {
      // corrupted storage — start fresh
    }
    setIsHydrated(true);
  }, []);

  // Persist to localStorage on every change (after hydration)
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // storage full or unavailable
    }
  }, [state.items, isHydrated]);

  // Sync across tabs
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== STORAGE_KEY || e.newValue === null) return;
      try {
        dispatch({ type: "HYDRATE", items: JSON.parse(e.newValue) });
      } catch {
        // ignore
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items:          state.items,
      itemCount,
      isHydrated,
      addItem:        (item) => dispatch({ type: "ADD", item }),
      removeItem:     (id)   => dispatch({ type: "REMOVE", id }),
      updateQuantity: (id, quantity) => dispatch({ type: "UPDATE", id, quantity }),
      clearCart:      ()     => dispatch({ type: "CLEAR" }),
    }}>
      {children}
    </CartContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
