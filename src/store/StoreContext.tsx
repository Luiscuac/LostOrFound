import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { LostItem, Claimant } from '@/types';
import { mockItems } from '@/data/mockData';

const STORAGE_KEY = 'lof_items_v1';

interface StoreContextValue {
  items: LostItem[];
  addItem: (item: Omit<LostItem, 'id' | 'claimant' | 'status'> & Partial<Pick<LostItem, 'status'>>) => void;
  updateItem: (id: string, updates: Partial<LostItem>) => void;
  markClaimed: (id: string, claimant: Claimant, status: 'Reclamado' | 'Entregado') => void;
  deleteItem: (id: string) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

function loadItems(): LostItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore parse errors
  }
  return mockItems;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<LostItem[]>(loadItems);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore write errors
    }
  }, [items]);

  const addItem: StoreContextValue['addItem'] = (item) => {
    const newItem: LostItem = {
      id: `item-${Date.now()}`,
      name: item.name,
      description: item.description,
      category: item.category,
      status: item.status ?? 'Disponible',
      imageUrl: item.imageUrl,
      gallery: item.gallery?.length ? item.gallery : [item.imageUrl],
      location: item.location,
      foundDate: item.foundDate,
      claimant: null,
    };
    setItems((prev) => [newItem, ...prev]);
  };

  const updateItem: StoreContextValue['updateItem'] = (id, updates) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, ...updates } : it)),
    );
  };

  const markClaimed: StoreContextValue['markClaimed'] = (id, claimant, status) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, status, claimant } : it,
      ),
    );
  };

  const deleteItem: StoreContextValue['deleteItem'] = (id) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  return (
    <StoreContext.Provider
      value={{ items, addItem, updateItem, markClaimed, deleteItem }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
