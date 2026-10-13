export type ItemStatus = 'Disponible' | 'Reclamado' | 'Entregado';

export type Category =
  | 'Electronicos'
  | 'Ropa'
  | 'Documentos'
  | 'Mochilas/Bolsos'
  | 'Llaves'
  | 'Otros';

export interface Claimant {
  ci: string;
  fullName: string;
  carrera: string;
  phone: string;
  returnedAt: string;
}

export interface LostItem {
  id: string;
  name: string;
  description: string;
  category: Category;
  status: ItemStatus;
  imageUrl: string;
  gallery: string[];
  location: string;
  foundDate: string;
  claimant: Claimant | null;
}

export const CATEGORIES: Category[] = [
  'Electronicos',
  'Ropa',
  'Documentos',
  'Mochilas/Bolsos',
  'Llaves',
  'Otros',
];

// Database row shape from Supabase
export interface LostItemRow {
  id: string;
  name: string;
  description: string;
  category: Category;
  status: ItemStatus;
  image_url: string;
  gallery: string[] | null;
  location: string;
  found_date: string;
  claimant_ci: string | null;
  claimant_full_name: string | null;
  claimant_carrera: string | null;
  claimant_phone: string | null;
  claimant_returned_at: string | null;
  created_at: string;
}

export function rowToItem(row: LostItemRow): LostItem {
  const hasClaimant =
    row.claimant_ci || row.claimant_full_name || row.claimant_phone;
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    category: row.category,
    status: row.status,
    imageUrl: row.image_url,
    gallery: Array.isArray(row.gallery) ? row.gallery : [row.image_url],
    location: row.location,
    foundDate: row.found_date,
    claimant: hasClaimant
      ? {
          ci: row.claimant_ci ?? '',
          fullName: row.claimant_full_name ?? '',
          carrera: row.claimant_carrera ?? '',
          phone: row.claimant_phone ?? '',
          returnedAt: row.claimant_returned_at ?? '',
        }
      : null,
  };
}

export function itemToRow(
  item: Omit<LostItem, 'id' | 'claimant' | 'status'> & Partial<Pick<LostItem, 'status'>>,
) {
  return {
    name: item.name,
    description: item.description,
    category: item.category,
    status: item.status ?? 'Disponible',
    image_url: item.imageUrl,
    gallery: item.gallery ?? [item.imageUrl],
    location: item.location,
    found_date: item.foundDate,
  };
}
