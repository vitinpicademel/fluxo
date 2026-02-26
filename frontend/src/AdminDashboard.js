import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, TrendingUp, Eye, LogOut, Shield } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('projects');

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  }, []);

  const [allProjects, setAllProjects] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAllProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/projects/admin/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Erro ao buscar projetos');
      const data = await response.json();
      setAllProjects(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/projects/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Erro ao buscar usuários');
      const data = await response.json();
      setAllUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (activeTab === 'projects') {
      fetchAllProjects();
    } else if (activeTab === 'users') {
      fetchAllUsers();
    }
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const stats = useMemo(() => {
    return {
      totalProjects: allProjects.length,
      totalUsers: allUsers.length,
      totalUnits: allProjects.reduce((acc, p) => acc + (p.totalUnits || 0), 0),
      approvedProjects: allProjects.filter(p => p.status === 'APPROVED').length,
    };
  }, [allProjects, allUsers]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Shield className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-slate-900">Painel Admin</div>
              <div className="text-xs text-slate-500">Visão geral do sistema</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right text-sm">
              <div className="text-slate-500">Administrador</div>
              <div className="font-semibold text-slate-900">{user?.name}</div>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="p-6">
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total de Projetos</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">{stats.totalProjects}</p>
              </div>
              <div className="rounded-lg bg-blue-50 p-3">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Incorporadoras</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">{stats.totalUsers}</p>
              </div>
              <div className="rounded-lg bg-green-50 p-3">
                <Users className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Unidades Totais</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">{stats.totalUnits}</p>
              </div>
              <div className="rounded-lg bg-purple-50 p-3">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Projetos Aprovados</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">{stats.approvedProjects}</p>
              </div>
              <div className="rounded-lg bg-emerald-50 p-3">
                <Eye className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('projects')}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'projects'
                    ? 'border-b-2 border-blue-600 text-blue-700'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Projetos ({allProjects.length})
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'users'
                    ? 'border-b-2 border-blue-600 text-blue-700'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Incorporadoras ({allUsers.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {loading && (
              <div className="text-center text-slate-500">
                Carregando...
              </div>
            )}
            {error && (
              <div className="rounded-lg bg-red-50 p-4 text-red-700">
                {error}
              </div>
            )}
            {!loading && !error && activeTab === 'projects' && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-slate-500">
                      <th className="pb-3 font-medium">Empresa</th>
                      <th className="pb-3 font-medium">CNPJ</th>
                      <th className="pb-3 font-medium">Responsável</th>
                      <th className="pb-3 font-medium">Cidade/UF</th>
                      <th className="pb-3 font-medium">Unidades</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Criado em</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {allProjects.map((project) => (
                      <tr key={project.id} className="text-slate-800">
                        <td className="py-3">{project.companyName}</td>
                        <td className="py-3">{project.cnpj}</td>
                        <td className="py-3">{project.responsibleName}</td>
                        <td className="py-3">{project.city}/{project.state}</td>
                        <td className="py-3">{project.totalUnits}</td>
                        <td className="py-3">
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                              project.status === 'APPROVED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : project.status === 'REJECTED'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {project.status === 'APPROVED' ? 'Aprovado' : project.status === 'REJECTED' ? 'Rejeitado' : 'Em análise'}
                          </span>
                        </td>
                        <td className="py-3">{new Date(project.createdAt).toLocaleDateString('pt-BR')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {allProjects.length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    Nenhum projeto encontrado.
                  </div>
                )}
              </div>
            )}
            {!loading && !error && activeTab === 'users' && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-slate-500">
                      <th className="pb-3 font-medium">Nome</th>
                      <th className="pb-3 font-medium">Email</th>
                      <th className="pb-3 font-medium">Projetos</th>
                      <th className="pb-3 font-medium">Cadastrado em</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {allUsers.map((userItem) => (
                      <tr key={userItem.id} className="text-slate-800">
                        <td className="py-3">{userItem.name}</td>
                        <td className="py-3">{userItem.email}</td>
                        <td className="py-3">{userItem.projects?.length || 0}</td>
                        <td className="py-3">{new Date(userItem.createdAt).toLocaleDateString('pt-BR')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {allUsers.length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    Nenhum usuário encontrado.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
