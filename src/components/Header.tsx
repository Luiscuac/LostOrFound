import { Compass, LogIn, LogOut, LayoutDashboard, Home } from 'lucide-react';

interface HeaderProps {
  view: 'public' | 'login' | 'dashboard';
  onNavigate: (view: 'public' | 'login' | 'dashboard') => void;
}

export function Header({ view, onNavigate }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => onNavigate('public')}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Compass className="text-white" size={22} />
            </div>
            <div className="text-left">
              <h1 className="text-lg font-bold text-slate-800 leading-tight">
                Lost or Found
              </h1>
              <p className="text-[11px] text-teal-600 font-medium leading-tight hidden sm:block">
                Busca, encuentra y recupera
              </p>
            </div>
          </button>

          <nav className="flex items-center gap-2">
            {view !== 'public' && (
              <button
                onClick={() => onNavigate('public')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <Home size={16} />
                <span className="hidden sm:inline">Catálogo</span>
              </button>
            )}
            {view === 'dashboard' ? (
              <>
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-teal-700 bg-teal-50">
                  <LayoutDashboard size={16} />
                  <span className="hidden sm:inline">Panel</span>
                </div>
                <button
                  onClick={() => onNavigate('public')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Cerrar Sesión</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 transition-colors shadow-sm"
              >
                <LogIn size={16} />
                <span>Staff</span>
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
