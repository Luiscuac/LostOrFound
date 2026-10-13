import { useState, useMemo } from 'react';
import { useStore } from '@/store/StoreContext';
import { ItemCard } from '@/components/ItemCard';
import { ItemDetailModal } from '@/components/ItemDetailModal';
import { Search, PackageSearch, Filter, X, Loader2 } from 'lucide-react';
import type { LostItem, Category } from '@/types';

const ALL_CATEGORIES: Category[] = [
  'Electronicos',
  'Ropa',
  'Documentos',
  'Mochilas/Bolsos',
  'Llaves',
  'Otros',
];

export function PublicCatalog() {
  const { items, loading } = useStore();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | 'Todos'>(
    'Todos',
  );
  const [selectedItem, setSelectedItem] = useState<LostItem | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);
      const matchesCategory =
        activeCategory === 'Todos' || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [items, search, activeCategory]);

  const availableCount = items.filter((i) => i.status === 'Disponible').length;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-bold mb-3 leading-tight">
              Busca, encuentra y recupera
            </h2>
            <p className="text-teal-100 text-sm sm:text-base">
              Catálogo digital de objetos perdidos y encontrados en el campus
              universitario. Explora los objetos disponibles y recupera lo que
              perdiste.
            </p>
          </div>

          {/* Search bar */}
          <div className="max-w-2xl mx-auto mt-7">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre o descripción..."
                className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-white text-slate-800 placeholder-slate-400 shadow-lg outline-none ring-2 ring-transparent focus:ring-teal-300 transition-all text-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filters + Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category filters */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
          <span className="flex items-center gap-1.5 text-sm font-medium text-slate-500 shrink-0 mr-1">
            <Filter size={15} />
            Filtros:
          </span>
          {(['Todos', ...ALL_CATEGORIES] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-teal-300 hover:text-teal-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-slate-500">
            {filtered.length} objeto{filtered.length !== 1 ? 's' : ''}{' '}
            encontrado{filtered.length !== 1 ? 's' : ''}
            {activeCategory !== 'Todos' && ` en ${activeCategory}`}
          </p>
          <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2.5 py-1 rounded-full">
            {availableCount} disponibles
          </span>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Loader2 className="text-teal-500 mb-3 animate-spin" size={40} />
            <p className="text-slate-500 font-medium">Cargando catálogo...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onClick={() => setSelectedItem(item)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <PackageSearch className="text-slate-300 mb-3" size={56} />
            <p className="text-slate-500 font-medium">
              No se encontraron objetos
            </p>
            <p className="text-slate-400 text-sm mt-1">
              Intenta con otra búsqueda o cambia el filtro de categoría
            </p>
          </div>
        )}
      </div>

      <ItemDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}
