import type { LostItem } from '@/types';
import { StatusBadge } from './StatusBadge';
import { MapPin, Calendar, ChevronRight } from 'lucide-react';

interface ItemCardProps {
  item: LostItem;
  onClick: () => void;
}

const categoryColors: Record<string, string> = {
  Electronicos: 'bg-sky-50 text-sky-700',
  Ropa: 'bg-rose-50 text-rose-700',
  Documentos: 'bg-violet-50 text-violet-700',
  'Mochilas/Bolsos': 'bg-teal-50 text-teal-700',
  Llaves: 'bg-amber-50 text-amber-700',
  Otros: 'bg-slate-100 text-slate-700',
};

export function ItemCard({ item, onClick }: ItemCardProps) {
  return (
    <button
      onClick={onClick}
      className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg hover:border-teal-300 transition-all duration-300 text-left flex flex-col"
    >
      <div className="relative h-44 overflow-hidden bg-slate-100">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[item.category] || categoryColors.Otros}`}
          >
            {item.category}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <StatusBadge status={item.status} />
        </div>
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-semibold text-slate-800 text-base leading-snug group-hover:text-teal-700 transition-colors">
          {item.name}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-2">{item.description}</p>
        <div className="flex flex-col gap-1 mt-auto pt-2">
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin size={13} className="text-teal-500" />
            {item.location}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <Calendar size={13} className="text-teal-500" />
            {formatDate(item.foundDate)}
          </span>
        </div>
      </div>
      <div className="px-4 pb-3 flex items-center justify-end text-teal-600 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
        Ver detalles <ChevronRight size={14} />
      </div>
    </button>
  );
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-BO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
