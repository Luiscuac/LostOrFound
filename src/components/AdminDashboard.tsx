import { useState, useEffect } from 'react';
import { useStore } from '@/store/StoreContext';
import { useToast } from '@/components/ToastContext';
import { StatusBadge } from '@/components/StatusBadge';
import type { LostItem, Category, ItemStatus, Claimant } from '@/types';
import { CATEGORIES } from '@/types';
import {
  PackagePlus,
  Table2,
  Pencil,
  PackageCheck,
  Search,
  Trash2,
  X,
  Image as ImageIcon,
  Tag,
  MapPin,
  Calendar,
  FileText,
  IdCard,
  User,
  GraduationCap,
  Phone,
  Clock,
  type LucideIcon,
} from 'lucide-react';

type DashboardTab = 'register' | 'manage';

export function AdminDashboard() {
  const [tab, setTab] = useState<DashboardTab>('register');

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-xl font-bold text-slate-800">Panel de Gestión</h2>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-200">
          <button
            onClick={() => setTab('register')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              tab === 'register'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <PackagePlus size={16} />
            Registrar Objeto
          </button>
          <button
            onClick={() => setTab('manage')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              tab === 'manage'
                ? 'border-teal-600 text-teal-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Table2 size={16} />
            Gestionar Objetos
          </button>
        </div>

        {tab === 'register' ? <RegisterForm /> : <ManageObjects />}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Register Form
// ---------------------------------------------------------------------------

function RegisterForm() {
  const { addItem } = useStore();
  const { notify } = useToast();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('Electronicos');
  const [imageUrl, setImageUrl] = useState('');
  const [location, setLocation] = useState('');
  const [foundDate, setFoundDate] = useState(
    new Date().toISOString().split('T')[0],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim() || !imageUrl.trim() || !location.trim()) {
      notify('Completa todos los campos obligatorios', 'error');
      return;
    }
    addItem({
      name: name.trim(),
      description: description.trim(),
      category,
      imageUrl: imageUrl.trim(),
      gallery: [imageUrl.trim()],
      location: location.trim(),
      foundDate,
    });
    notify('Objeto registrado correctamente', 'success');
    setName('');
    setDescription('');
    setCategory('Electronicos');
    setImageUrl('');
    setLocation('');
    setFoundDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-3xl"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Nombre del objeto" icon={Tag} required>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Mochila negra con laptop"
            className={inputClass}
          />
        </Field>

        <Field label="Categoría" icon={Tag} required>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className={inputClass}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>

        <div className="sm:col-span-2">
          <Field label="Descripción detallada" icon={FileText} required>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe el objeto, sus características, contenido, estado..."
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field label="URL de la imagen" icon={ImageIcon} required>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className={inputClass}
            />
          </Field>
          {imageUrl && (
            <div className="mt-2 rounded-xl overflow-hidden border border-slate-200 max-h-48">
              <img
                src={imageUrl}
                alt="Vista previa"
                className="w-full h-48 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        <Field label="Lugar de hallazgo" icon={MapPin} required>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Ej. Aula 302, Edificio de Ing. de Sistemas"
            className={inputClass}
          />
        </Field>

        <Field label="Fecha de hallazgo" icon={Calendar} required>
          <input
            type="date"
            value={foundDate}
            onChange={(e) => setFoundDate(e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-md transition-colors"
        >
          <PackagePlus size={18} />
          Registrar Objeto
        </button>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Manage Objects
// ---------------------------------------------------------------------------

function ManageObjects() {
  const { items, deleteItem } = useStore();
  const { notify } = useToast();
  const [search, setSearch] = useState('');
  const [editItem, setEditItem] = useState<LostItem | null>(null);
  const [claimItem, setClaimItem] = useState<LostItem | null>(null);

  const filtered = items.filter((item) => {
    const q = search.trim().toLowerCase();
    return (
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.location.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  const handleDelete = (id: string, name: string) => {
    deleteItem(id);
    notify(`"${name}" eliminado del catálogo`, 'info');
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative max-w-md">
        <Search
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          size={18}
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar objeto..."
          className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none ring-2 ring-transparent focus:ring-teal-300 focus:border-teal-400 transition-all"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                <th className="text-left px-4 py-3 font-semibold">Objeto</th>
                <th className="text-left px-4 py-3 font-semibold hidden md:table-cell">
                  Categoría
                </th>
                <th className="text-left px-4 py-3 font-semibold hidden lg:table-cell">
                  Lugar
                </th>
                <th className="text-left px-4 py-3 font-semibold">Estado</th>
                <th className="text-right px-4 py-3 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                        loading="lazy"
                      />
                      <span className="font-medium text-slate-800 line-clamp-1">
                        {item.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 hidden md:table-cell">
                    {item.category}
                  </td>
                  <td className="px-4 py-3 text-slate-600 hidden lg:table-cell max-w-[200px] truncate">
                    {item.location}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      {item.status === 'Disponible' && (
                        <button
                          onClick={() => setClaimItem(item)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                          title="Marcar como Entregado/Reclamado"
                        >
                          <PackageCheck size={14} />
                          <span className="hidden sm:inline">Entregar</span>
                        </button>
                      )}
                      <button
                        onClick={() => setEditItem(item)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 transition-colors"
                        title="Editar"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.name)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-slate-400">
                    No hay objetos registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editItem && (
        <EditModal
          item={editItem}
          onClose={() => setEditItem(null)}
        />
      )}
      {claimItem && (
        <DeliveryModal
          item={claimItem}
          onClose={() => setClaimItem(null)}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Edit Modal
// ---------------------------------------------------------------------------

function EditModal({ item, onClose }: { item: LostItem; onClose: () => void }) {
  const { updateItem } = useStore();
  const { notify } = useToast();
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description);
  const [category, setCategory] = useState<Category>(item.category);
  const [imageUrl, setImageUrl] = useState(item.imageUrl);
  const [location, setLocation] = useState(item.location);
  const [foundDate, setFoundDate] = useState(item.foundDate);
  const [status, setStatus] = useState<ItemStatus>(item.status);

  useEffectEscape(onClose);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateItem(item.id, {
      name: name.trim(),
      description: description.trim(),
      category,
      imageUrl: imageUrl.trim(),
      gallery: [imageUrl.trim()],
      location: location.trim(),
      foundDate,
      status,
    });
    notify('Objeto actualizado correctamente', 'success');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">Editar Objeto</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Nombre" icon={Tag}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Categoría" icon={Tag}>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className={inputClass}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <div className="sm:col-span-2">
              <Field label="Descripción" icon={FileText}>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="URL de imagen" icon={ImageIcon}>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>
            <Field label="Lugar" icon={MapPin}>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Fecha" icon={Calendar}>
              <input
                type="date"
                value={foundDate}
                onChange={(e) => setFoundDate(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Estado" icon={PackageCheck}>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ItemStatus)}
                className={inputClass}
              >
                <option value="Disponible">Disponible</option>
                <option value="Reclamado">Reclamado</option>
                <option value="Entregado">Entregado</option>
              </select>
            </Field>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-md transition-colors"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Delivery Modal
// ---------------------------------------------------------------------------

function DeliveryModal({
  item,
  onClose,
}: {
  item: LostItem;
  onClose: () => void;
}) {
  const { markClaimed } = useStore();
  const { notify } = useToast();
  const [ci, setCi] = useState('');
  const [fullName, setFullName] = useState('');
  const [carrera, setCarrera] = useState('');
  const [phone, setPhone] = useState('');
  const [returnedAt, setReturnedAt] = useState(
    new Date().toISOString().slice(0, 16),
  );
  const [status, setStatus] = useState<'Reclamado' | 'Entregado'>('Entregado');

  useEffectEscape(onClose);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ci.trim() || !fullName.trim() || !carrera.trim() || !phone.trim()) {
      notify('Completa todos los datos de quien reclama', 'error');
      return;
    }
    const claimant: Claimant = {
      ci: ci.trim(),
      fullName: fullName.trim(),
      carrera: carrera.trim(),
      phone: phone.trim(),
      returnedAt: new Date(returnedAt).toISOString(),
    };
    markClaimed(item.id, claimant, status);
    notify(
      `Objeto marcado como ${status.toLowerCase()} correctamente`,
      'success',
    );
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-800">Proceso de Entrega</h3>
            <p className="text-xs text-slate-500 mt-0.5">{item.name}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-teal-50 border border-teal-100 text-teal-700 text-sm">
            <PackageCheck size={16} className="shrink-0" />
            Registra los datos de la persona que reclama el objeto
          </div>

          <Field label="Estado de entrega" icon={PackageCheck}>
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as 'Reclamado' | 'Entregado')
              }
              className={inputClass}
            >
              <option value="Entregado">Entregado</option>
              <option value="Reclamado">Reclamado</option>
            </select>
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Carnet de Identidad (CI)" icon={IdCard} required>
              <input
                type="text"
                value={ci}
                onChange={(e) => setCi(e.target.value)}
                placeholder="Ej. 7890123"
                className={inputClass}
              />
            </Field>
            <Field label="Teléfono de contacto" icon={Phone} required>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ej. 70123456"
                className={inputClass}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Nombre completo" icon={User} required>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ej. María Fernanda Choque Mamani"
                  className={inputClass}
                />
              </Field>
            </div>
            <Field label="Carrera" icon={GraduationCap} required>
              <input
                type="text"
                value={carrera}
                onChange={(e) => setCarrera(e.target.value)}
                placeholder="Ej. Ingeniería Civil"
                className={inputClass}
              />
            </Field>
            <Field label="Fecha y hora de devolución" icon={Clock} required>
              <input
                type="datetime-local"
                value={returnedAt}
                onChange={(e) => setReturnedAt(e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md transition-colors"
            >
              Confirmar Entrega
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

const inputClass =
  'w-full pl-0 pr-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 outline-none ring-2 ring-transparent focus:ring-teal-300 focus:border-teal-400 transition-all text-sm';

function Field({
  label,
  icon: Icon,
  required,
  children,
}: {
  label: string;
  icon: LucideIcon;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 mb-1.5">
        <Icon size={15} className="text-slate-400" />
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function useEffectEscape(onClose: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);
}
