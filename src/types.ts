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

export const CATEGORY_ICONS: Record<Category, string> = {
  Electronicos: 'Smartphone',
  Ropa: 'Shirt',
  Documentos: 'FileText',
  'Mochilas/Bolsos': 'Briefcase',
  Llaves: 'Key',
  Otros: 'Package',
};
