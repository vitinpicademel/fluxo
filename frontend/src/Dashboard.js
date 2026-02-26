import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  CheckCircle2,
  Clock4,
  FolderKanban,
  Home,
  MapPin,
  PlusCircle
} from 'lucide-react';
import StatCard from './components/StatCard';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch('http://localhost:3001/api/projects/my-projects', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setProjects(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Erro ao buscar projetos:', error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const stats = useMemo(() => {
    const totalProjects = projects.length;
    const totalUnits = projects.reduce((sum, p) => sum + (p.totalUnits || 0), 0);
    const approved = projects.filter((p) => p.status === 'APPROVED').length;
    const pending = totalProjects - approved;

    return {
      totalProjects,
      totalUnits,
      approved,
      pending
    };
  }, [projects]);

  const createProject = () => navigate('/project-form');

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-transparent" />
          <div className="text-sm font-medium text-slate-700">Carregando seus projetos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-slate-500">Visão geral</div>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            Acompanhe seus projetos e principais indicadores.
          </p>
        </div>

        <button
          type="button"
          onClick={createProject}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          <PlusCircle className="h-4 w-4" />
          Novo Projeto
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total de Projetos"
          value={stats.totalProjects}
          icon={FolderKanban}
          helper="Cadastrados no sistema"
        />
        <StatCard
          title="Unidades Totais"
          value={stats.totalUnits}
          icon={Home}
          helper="Somatório dos projetos"
        />
        <StatCard
          title="Projetos Aprovados"
          value={stats.approved}
          icon={CheckCircle2}
          helper="Com análise concluída"
        />
        <StatCard
          title="Em Análise"
          value={stats.pending}
          icon={Clock4}
          helper="Aguardando aprovação"
        />
      </div>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Meus Projetos</h2>
            <p className="mt-1 text-sm text-slate-500">
              {projects.length} {projects.length === 1 ? 'projeto' : 'projetos'}
            </p>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="px-6 py-10">
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm">
                <Building2 className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-slate-900">
                Nenhum projeto cadastrado
              </h3>
              <p className="mt-1 max-w-md text-sm text-slate-500">
                Cadastre seu primeiro projeto para preencher premissas e acompanhar indicadores.
              </p>
              <button
                type="button"
                onClick={createProject}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <PlusCircle className="h-4 w-4" />
                Criar Primeiro Projeto
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Empresa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Localização
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Unidades
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {projects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-slate-900">{p.companyName}</div>
                      <div className="mt-0.5 text-xs text-slate-500">{p.projectType}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        {p.city} - {p.state}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">{p.totalUnits}</td>
                    <td className="px-6 py-4">
                      <span
                        className={
                          'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ' +
                          (p.status === 'APPROVED'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700')
                        }
                      >
                        {p.status === 'APPROVED' ? 'Aprovado' : 'Em análise'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
