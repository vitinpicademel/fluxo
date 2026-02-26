import React, { useMemo, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  PlusCircle,
  LogOut,
  Building2,
  Menu,
  X,
  Shield,
  Calculator
} from 'lucide-react';

const navLinkClass = ({ isActive }) =>
  [
    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-blue-50 text-blue-700'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  ].join(' ');

const Layout = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const SidebarContent = (
    <>
      <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
          <Building2 className="h-5 w-5" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold text-slate-900">Imobiliário</div>
          <div className="text-xs text-slate-500">Painel de projetos</div>
        </div>
      </div>

      <nav className="p-4">
        <div className="space-y-1">
          <NavLink to="/dashboard" className={navLinkClass}>
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </NavLink>
          <NavLink to="/dashboard" className={navLinkClass}>
            <FolderKanban className="h-4 w-4" />
            Meus Projetos
          </NavLink>
          <NavLink to="/project-form" className={navLinkClass}>
            <PlusCircle className="h-4 w-4" />
            Novo Projeto
          </NavLink>
          <NavLink to="/fluxo" className={navLinkClass}>
            <Calculator className="h-4 w-4" />
            Fluxo de Caixa
          </NavLink>
          {user?.role === 'ADMIN' && (
            <NavLink to="/admin" className={navLinkClass}>
              <Shield className="h-4 w-4" />
              Admin
            </NavLink>
          )}
        </div>
      </nav>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:block">
          {SidebarContent}
        </aside>

        {mobileMenuOpen ? (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="absolute inset-0 bg-slate-900/30"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full w-72 border-r border-slate-200 bg-white shadow-xl">
              <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div className="leading-tight">
                    <div className="text-sm font-semibold text-slate-900">Imobiliário</div>
                    <div className="text-xs text-slate-500">Painel de projetos</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-slate-100"
                  aria-label="Fechar menu"
                >
                  <X className="h-5 w-5 text-slate-700" />
                </button>
              </div>
              <div onClick={() => setMobileMenuOpen(false)}>{SidebarContent}</div>
            </div>
          </div>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
            <div className="flex h-16 items-center justify-between px-6">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(true)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-slate-100 lg:hidden"
                  aria-label="Abrir menu"
                >
                  <Menu className="h-5 w-5 text-slate-700" />
                </button>

                <div className="min-w-0">
                  <div className="text-sm text-slate-500">Bem-vindo,</div>
                  <div className="truncate text-sm font-semibold text-slate-900">
                    {user?.name || 'Usuário'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </button>
            </div>
          </header>

          <main className="flex-1 p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
