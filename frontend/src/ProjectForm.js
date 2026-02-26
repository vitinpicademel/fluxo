import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Loader2 } from 'lucide-react';

const ProjectForm = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    cnpj: '',
    responsibleName: '',
    responsibleRole: '',
    corporateEmail: '',
    phone: '',
    city: '',
    state: '',
    projectType: 'VERTICAL',
    totalUnits: 100,
    averageUnitValue: 500000,
    salesStartDate: '2024-01-01',
    salesDurationMonths: 24
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalUnits' || name === 'averageUnitValue' || name === 'salesDurationMonths' 
        ? Number(value) 
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Você precisa estar logado para criar um projeto.');
        navigate('/login');
        return;
      }
      
      const response = await fetch('http://localhost:3001/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        alert('Projeto criado com sucesso!');
        navigate('/dashboard');
      } else {
        alert('Erro: ' + (data.error || 'Erro ao criar projeto'));
      }
    } catch (error) {
      alert('Erro ao criar projeto');
    } finally {
      setLoading(false);
    }
  };

  const estados = useMemo(
    () => [
      'AC',
      'AL',
      'AP',
      'AM',
      'BA',
      'CE',
      'DF',
      'ES',
      'GO',
      'MA',
      'MG',
      'MS',
      'MT',
      'PA',
      'PB',
      'PE',
      'PI',
      'PR',
      'RJ',
      'RN',
      'RO',
      'RR',
      'RS',
      'SC',
      'SE',
      'SP',
      'TO'
    ],
    []
  );

  const inputClassName =
    'w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600 focus:outline-none';

  const labelClassName = 'block text-sm font-medium text-slate-700 mb-1.5';

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">Criar Novo Projeto</h1>
          <p className="mt-1 text-sm text-slate-500">
            Cadastre as premissas da incorporadora e os detalhes iniciais do empreendimento.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-start gap-4 border-b border-slate-200 pb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Cadastro de Projeto</h2>
            <p className="mt-1 text-sm text-slate-500">
              Preencha os campos abaixo. Você poderá complementar dados depois.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
            {/* Sessão 1: Dados da Empresa e Responsável */}
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">
                Dados da Empresa e Responsável
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClassName}>
                    Nome da Empresa
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    required
                    className={inputClassName}
                    placeholder="Nome da incorporadora"
                    value={formData.companyName}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className={labelClassName}>
                    CNPJ
                  </label>
                  <input
                    type="text"
                    name="cnpj"
                    required
                    className={inputClassName}
                    placeholder="00.000.000/0000-00"
                    value={formData.cnpj}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className={labelClassName}>
                    Nome do Responsável
                  </label>
                  <input
                    type="text"
                    name="responsibleName"
                    required
                    className={inputClassName}
                    placeholder="Nome completo"
                    value={formData.responsibleName}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className={labelClassName}>
                    Cargo do Responsável
                  </label>
                  <input
                    type="text"
                    name="responsibleRole"
                    required
                    className={inputClassName}
                    placeholder="Diretor, Gerente, etc."
                    value={formData.responsibleRole}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className={labelClassName}>
                    Email Corporativo
                  </label>
                  <input
                    type="email"
                    name="corporateEmail"
                    required
                    className={inputClassName}
                    placeholder="empresa@exemplo.com"
                    value={formData.corporateEmail}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className={labelClassName}>
                    Telefone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    className={inputClassName}
                    placeholder="(00) 00000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className={labelClassName}>
                    Cidade
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    className={inputClassName}
                    placeholder="São Paulo"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className={labelClassName}>
                    Estado
                  </label>
                  <select
                    name="state"
                    required
                    className={inputClassName}
                    value={formData.state}
                    onChange={handleChange}
                  >
                    <option value="">Selecione um estado</option>
                    {estados.map(estado => (
                      <option key={estado} value={estado}>{estado}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Sessão 2: Detalhes do Projeto */}
            <div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">
                Detalhes do Projeto
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClassName}>
                    Tipo de Projeto
                  </label>
                  <select
                    name="projectType"
                    required
                    className={inputClassName}
                    value={formData.projectType}
                    onChange={handleChange}
                  >
                    <option value="VERTICAL">Vertical</option>
                    <option value="HORIZONTAL">Horizontal</option>
                    <option value="MISTO">Misto</option>
                  </select>
                </div>

                <div>
                  <label className={labelClassName}>
                    Total de Unidades
                  </label>
                  <input
                    type="number"
                    name="totalUnits"
                    required
                    min="1"
                    className={inputClassName}
                    placeholder="100"
                    value={formData.totalUnits}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className={labelClassName}>
                    Valor Médio por Unidade (R$)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-slate-500 text-sm">R$</span>
                    </div>
                    <input
                      type="number"
                      name="averageUnitValue"
                      required
                      min="0"
                      step="0.01"
                      className={`pl-8 ${inputClassName}`}
                      placeholder="500.000,00"
                      value={formData.averageUnitValue}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClassName}>
                    Início das Vendas
                  </label>
                  <input
                    type="date"
                    name="salesStartDate"
                    required
                    className={inputClassName}
                    value={formData.salesStartDate}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className={labelClassName}>
                    Duração das Vendas (meses)
                  </label>
                  <input
                    type="number"
                    name="salesDurationMonths"
                    required
                    min="1"
                    className={inputClassName}
                    placeholder="24"
                    value={formData.salesDurationMonths}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Botão de Ação */}
            <div className="pt-6 border-t border-slate-200">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {loading ? 'Criando...' : 'Criar Projeto'}
              </button>
            </div>
          </form>
      </div>
    </div>
  );
};

export default ProjectForm;
