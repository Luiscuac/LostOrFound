import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { supabase } from '@/lib/supabase';
import type { LostItem, LostItemRow, Claimant, ItemStatus } from '@/types';
import { rowToItem, itemToRow } from '@/types';

interface StoreContextValue {
  items: LostItem[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
  addItem: (
    item: Omit<LostItem, 'id' | 'claimant' | 'status'> & Partial<Pick<LostItem, 'status'>>,
  ) => Promise<boolean>;
  updateItem: (id: string, updates: Partial<LostItem>) => Promise<boolean>;
  markClaimed: (
    id: string,
    claimant: Claimant,
    status: 'Reclamado' | 'Entregado',
  ) => Promise<boolean>;
  deleteItem: (id: string) => Promise<boolean>;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<LostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const { data, error } = await supabase
      .from('lost_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
      return;
    }
    setError(null);
    setItems((data as LostItemRow[]).map(rowToItem));
  }, []);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const addItem: StoreContextValue['addItem'] = async (item) => {
    const row = itemToRow(item);
    const { error: insertError } = await supabase
      .from('lost_items')
      .insert(row)
      .select();
    if (insertError) {
      setError(insertError.message);
      return false;
    }
    await refresh();
    return true;
  };

  const updateItem: StoreContextValue['updateItem'] = async (id, updates) => {
    const row: Record<string, unknown> = {};
    if (updates.name !== undefined) row.name = updates.name;
    if (updates.description !== undefined) row.description = updates.description;
    if (updates.category !== undefined) row.category = updates.category;
    if (updates.status !== undefined) row.status = updates.status as ItemStatus;
    if (updates.imageUrl !== undefined) {
      row.image_url = updates.imageUrl;
      row.gallery = updates.gallery ?? [updates.imageUrl];
    }
    if (updates.gallery !== undefined) row.gallery = updates.gallery;
    if (updates.location !== undefined) row.location = updates.location;
    if (updates.foundDate !== undefined) row.found_date = updates.foundDate;

    const { error: updateError } = await supabase
      .from('lost_items')
      .update(row)
      .eq('id', id);

    if (updateError) {
      setError(updateError.message);
      return false;
    }
    await refresh();
    return true;
  };

  const markClaimed: StoreContextValue['markClaimed'] = async (
    id,
    claimant,
    status,
  ) => {
    const { error: updateError } = await supabase
      .from('lost_items')
      .update({
        status,
        claimant_ci: claimant.ci,
        claimant_full_name: claimant.fullName,
        claimant_carrera: claimant.carrera,
        claimant_phone: claimant.phone,
        claimant_returned_at: claimant.returnedAt,
      })
      .eq('id', id);

    if (updateError) {
      setError(updateError.message);
      return false;
    }
    await refresh();
    return true;
  };

  const deleteItem: StoreContextValue['deleteItem'] = async (id) => {
    const { error: deleteError } = await supabase
      .from('lost_items')
      .delete()
      .eq('id', id);

    if (deleteError) {
      setError(deleteError.message);
      return false;
    }
    setItems((prev) => prev.filter((it) => it.id !== id));
    return true;
  };

  return (
    <StoreContext.Provider
      value={{ items, loading, error, refresh, addItem, updateItem, markClaimed, deleteItem }}
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
