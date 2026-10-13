import { useState } from 'react';
import { useAuth } from '@/store/AuthContext';
import { useToast } from '@/components/ToastContext';
import { Compass, Mail, Lock, ArrowLeft, AlertCircle, UserPlus, LogIn } from 'lucide-react';

interface LoginScreenProps {
  onBack: () => void;
  onSuccess: () => void;
}

type Mode = 'login' | 'signup';

export function LoginScreen({ onBack, onSuccess }: LoginScreenProps) {
  const { login, signUp } = useAuth();
  const { notify } = useToast();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('Por favor completa todos los campos.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setSubmitting(true);
    const result =
      mode === 'login'
        ? await login(email, password)
        : await signUp(email, password);
    setSubmitting(false);

    if (result.ok) {
      notify(
        mode === 'login'
          ? 'Bienvenido al panel de Bienestar Estudiantil'
          : 'Cuenta creada correctamente. Bienvenido.',
        'success',
      );
      onSuccess();
    } else {
      setError(
        result.error ?? 'Ocurrió un error. Intenta nuevamente.',
      );
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-slate-50 to-teal-50/30 px-4 py-12">
      <div className="w-full max-w-md">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Volver al catálogo
        </button>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-md mx-auto mb-4">
              <Compass className="text-white" size={28} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">
              Bienestar Estudiantil
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {mode === 'login'
                ? 'Inicia sesión para gestionar el catálogo de objetos'
                : 'Crea una cuenta de personal para acceder al panel'}
            </p>
          </div>

          {/* Mode tabs */}
          <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-5">
            <button
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === 'login'
                  ? 'bg-white text-teal-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <LogIn size={15} />
              Iniciar Sesión
            </button>
            <button
              onClick={() => { setMode('signup'); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === 'signup'
                  ? 'bg-white text-teal-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <UserPlus size={15} />
              Crear Cuenta
            </button>
          </div>

          {error && (
            <div className="mb-4 flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="bienestar@campus.edu"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 outline-none ring-2 ring-transparent focus:ring-teal-300 focus:border-teal-400 transition-all text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimo 6 caracteres"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 outline-none ring-2 ring-transparent focus:ring-teal-300 focus:border-teal-400 transition-all text-sm"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm shadow-md transition-colors"
            >
              {submitting
                ? 'Procesando...'
                : mode === 'login'
                  ? 'Iniciar Sesión'
                  : 'Crear Cuenta'}
            </button>
          </form>

          {mode === 'login' && (
            <div className="mt-6 p-3 rounded-lg bg-teal-50 border border-teal-100 text-center">
              <p className="text-xs text-teal-700">
                Si es la primera vez, crea una cuenta con la pestana{' '}
                <strong>Crear Cuenta</strong>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
