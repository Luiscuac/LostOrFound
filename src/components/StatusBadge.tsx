import type { ItemStatus } from '@/types';
import { CheckCircle2, Clock, PackageCheck } from 'lucide-react';

interface StatusBadgeProps {
  status: ItemStatus;
  size?: 'sm' | 'md';
}

const config = {
  Disponible: {
    icon: CheckCircle2,
    classes: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  Reclamado: {
    icon: Clock,
    classes: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  Entregado: {
    icon: PackageCheck,
    classes: 'bg-sky-50 text-sky-700 border-sky-200',
  },
};

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const { icon: Icon, classes } = config[status];
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-semibold ${classes} ${sizeClasses}`}
    >
      <Icon size={size === 'sm' ? 12 : 14} />
      {status}
    </span>
  );
}
