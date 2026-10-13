import { useEffect, useState } from 'react';
import type { LostItem } from '@/types';
import { StatusBadge } from './StatusBadge';
import {
  X,
  MapPin,
  Calendar,
  Tag,
  User,
  Phone,
  IdCard,
  GraduationCap,
  Clock,
  Info,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react';

interface ItemDetailModalProps {
  item: LostItem | null;
  onClose: () => void;
}

export function ItemDetailModal({ item, onClose }: ItemDetailModalProps) {
  const [galleryIndex, setGalleryIndex] = useState(0);

  useEffect(() => {
    setGalleryIndex(0);
  }, [item?.id]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (item) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [item, onClose]);

  if (!item) return null;

  const gallery = item.gallery?.length ? item.gallery : [item.imageUrl];
  const isClaimed = item.status === 'Reclamado' || item.status === 'Entregado';

  const prevImage = () => {
    setGalleryIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  };
  const nextImage = () => {
    setGalleryIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gallery */}
        <div className="relative h-64 sm:h-80 bg-slate-100 rounded-t-2xl overflow-hidden">
          <img
            src={gallery[galleryIndex]}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-md hover:bg-white transition-colors"
          >
            <X size={18} className="text-slate-700" />
          </button>
          {gallery.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-md hover:bg-white transition-colors"
              >
                <ChevronLeft size={18} className="text-slate-700" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-md hover:bg-white transition-colors"
              >
                <ChevronRight size={18} className="text-slate-700" />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {gallery.map((_, idx) => (
                  <span
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-colors ${idx === galleryIndex ? 'bg-white' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            </>
          )}
          <div className="absolute bottom-3 right-3">
            <StatusBadge status={item.status} size="md" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-50 text-teal-700">
                <Tag size={12} />
                {item.category}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-800">{item.name}</h2>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Descripción
            </h3>
            <p className="text-slate-700 text-sm leading-relaxed">
              {item.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50">
              <MapPin className="text-teal-600 mt-0.5 shrink-0" size={18} />
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Lugar de hallazgo
                </p>
                <p className="text-sm text-slate-700">{item.location}</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50">
              <Calendar className="text-teal-600 mt-0.5 shrink-0" size={18} />
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Fecha de hallazgo
                </p>
                <p className="text-sm text-slate-700">
                  {formatDate(item.foundDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Conditional section */}
          {isClaimed && item.claimant ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-3">
              <div className="flex items-center gap-2 text-amber-800">
                <User size={18} />
                <h3 className="font-semibold text-sm">
                  Información de quien reclamó el objeto
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <ClaimantField
                  icon={IdCard}
                  label="Carnet de Identidad"
                  value={item.claimant.ci}
                />
                <ClaimantField
                  icon={User}
                  label="Nombre completo"
                  value={item.claimant.fullName}
                />
                <ClaimantField
                  icon={GraduationCap}
                  label="Carrera"
                  value={item.claimant.carrera}
                />
                <ClaimantField
                  icon={Phone}
                  label="Teléfono"
                  value={item.claimant.phone}
                />
                <ClaimantField
                  icon={Clock}
                  label="Fecha y hora de devolución"
                  value={formatDateTime(item.claimant.returnedAt)}
                />
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-teal-200 bg-teal-50 p-4">
              <div className="flex items-start gap-2.5">
                <Info className="text-teal-600 mt-0.5 shrink-0" size={18} />
                <div>
                  <h3 className="font-semibold text-sm text-teal-800">
                    ¿Es tuyo este objeto?
                  </h3>
                  <p className="text-sm text-teal-700 mt-1 leading-relaxed">
                    Acude a la oficina de <strong>Bienestar Estudiantil</strong>{' '}
                    para reclamarlo. Presenta tu carnet de identidad y describe el
                    objeto en detalle para verificar que es tuyo.
                  </p>
                  <p className="text-xs text-teal-600 mt-2">
                    Horario de atención: Lunes a Viernes, 08:00 - 17:00
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ClaimantField({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon size={15} className="text-amber-600 mt-0.5 shrink-0" />
      <div>
        <p className="text-xs font-medium text-amber-700">{label}</p>
        <p className="text-sm text-slate-800 font-medium">{value}</p>
      </div>
    </div>
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

function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleString('es-BO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
