import { useState, useEffect } from 'react';
import { StoreProvider } from '@/store/StoreContext';
import { AuthProvider, useAuth } from '@/store/AuthContext';
import { ToastProvider } from '@/components/ToastContext';
import { Header } from '@/components/Header';
import { PublicCatalog } from '@/components/PublicCatalog';
import { LoginScreen } from '@/components/LoginScreen';
import { AdminDashboard } from '@/components/AdminDashboard';

type View = 'public' | 'login' | 'dashboard';

function AppContent() {
  const { isStaff, logout } = useAuth();
  const [view, setView] = useState<View>('public');

  useEffect(() => {
    if (isStaff && view === 'login') {
      setView('dashboard');
    }
    if (!isStaff && view === 'dashboard') {
      setView('public');
    }
  }, [isStaff, view]);

  const handleNavigate = (target: View) => {
    if (target === 'dashboard' && !isStaff) {
      setView('login');
      return;
    }
    if (target === 'public' && view === 'dashboard') {
      logout();
    }
    setView(target);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header view={view} onNavigate={handleNavigate} />
      {view === 'public' && <PublicCatalog />}
      {view === 'login' && (
        <LoginScreen
          onBack={() => setView('public')}
          onSuccess={() => setView('dashboard')}
        />
      )}
      {view === 'dashboard' && <AdminDashboard />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </StoreProvider>
    </AuthProvider>
  );
}
