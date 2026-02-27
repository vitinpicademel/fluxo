import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calculator, TrendingUp, Calendar, DollarSign, Building, BarChart3, Eye } from 'lucide-react';

const FluxoForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  
  // Dados básicos do fluxo
  const [fluxoData, setFluxoData] = useState({
    dataInicio: '',
    quantidadeUnidades: '',
    valorMedioUnidade: '',
    periodoVendasMeses: '',
    percentualEntrada: '10',
    percentualParcelado: '20',
    mesesParcelamento: '36'
  });

  // Dados de despesas (valores padrão da planilha)
  const [despesasData, setDespesasData] = useState({
    itbi: '0.75',
    iptuAnual: '0',
    escrituraRegistro: '0.02',
    terrenoPercentual: '9',
    obraPercentual: '65',
    comissaoVenda: '4',
    publicidadePercentual: '1.5',
    taxaAdministracao: '2',
    retPercentual: '4'
  });

  const handleInputChange = (section, field, value) => {
    if (section === 'fluxo') {
      setFluxoData(prev => ({ ...prev, [field]: value }));
    } else {
      setDespesasData(prev => ({ ...prev, [field]: value }));
    }
  };

  const calcularFluxo = async () => {
    setLoading(true);
    
    try {
      // Validação básica
      if (!fluxoData.dataInicio || !fluxoData.quantidadeUnidades || !fluxoData.valorMedioUnidade) {
        alert('Preencha todos os campos obrigatórios');
        setLoading(false);
        return;
      }

      // Converter valores
      const quantidade = parseInt(fluxoData.quantidadeUnidades);
      const valorMedio = parseFloat(fluxoData.valorMedioUnidade.replace(/\./g, '').replace(',', '.'));
      const periodo = parseInt(fluxoData.periodoVendasMeses) || 24; // padrão 24 meses
      const percEntrada = parseFloat(fluxoData.percentualEntrada) / 100;
      const percParcelado = parseFloat(fluxoData.percentualParcelado) / 100;
      
      // Calcular VGV (Valor Geral de Vendas)
      const vgv = quantidade * valorMedio;
      
      // Simular curva de vendas (distribuição normal)
      const curvaVendas = [];
      let unidadesRestantes = quantidade;
      
      for (let mes = 0; mes < periodo; mes++) {
        // Distribuição mais realista: começa devagar, pico no meio, diminui no fim
        let percentualMes;
        if (mes < periodo * 0.2) {
          percentualMes = 0.03; // 3% nos primeiros 20%
        } else if (mes < periodo * 0.6) {
          percentualMes = 0.06; // 6% no meio (60% do período)
        } else {
          percentualMes = 0.04; // 4% nos últimos 20%
        }
        
        const unidadesMes = Math.min(
          Math.floor(quantidade * percentualMes),
          unidadesRestantes
        );
        
        if (unidadesMes > 0) {
          const data = new Date(fluxoData.dataInicio);
          data.setMonth(data.getMonth() + mes);
          
          curvaVendas.push({
            mes: mes + 1,
            data: data.toISOString().split('T')[0],
            unidadesVendidas: unidadesMes,
            valorVendas: unidadesMes * valorMedio,
            valorEntrada: unidadesMes * valorMedio * percEntrada,
            valorParcelado: unidadesMes * valorMedio * percParcelado
          });
          
          unidadesRestantes -= unidadesMes;
        }
      }
      
      // Calcular despesas principais
      const despesas = {
        itbi: vgv * (parseFloat(despesasData.itbi) / 100),
        iptu: parseFloat(despesasData.iptuAnual),
        escritura: vgv * (parseFloat(despesasData.escrituraRegistro) / 100),
        terreno: vgv * (parseFloat(despesasData.terrenoPercentual) / 100),
        obra: vgv * (parseFloat(despesasData.obraPercentual) / 100),
        comissao: vgv * (parseFloat(despesasData.comissaoVenda) / 100),
        publicidade: vgv * (parseFloat(despesasData.publicidadePercentual) / 100),
        taxaAdm: vgv * (parseFloat(despesasData.taxaAdministracao) / 100),
        ret: vgv * (parseFloat(despesasData.retPercentual) / 100)
      };
      
      // Calcular totais
      const totalReceitas = curvaVendas.reduce((sum, mes) => sum + mes.valorVendas, 0);
      const totalDespesas = Object.values(despesas).reduce((sum, valor) => sum + valor, 0);
      const margemBruta = ((totalReceitas - totalDespesas) / totalReceitas) * 100;
      
      // Resultado completo
      const resultado = {
        dadosBasicos: {
          ...fluxoData,
          vgv: vgv,
          quantidadeUnidades: quantidade,
          valorMedioUnidade: valorMedio
        },
        curvaVendas: curvaVendas,
        despesas: despesas,
        resumo: {
          totalReceitas: totalReceitas,
          totalDespesas: totalDespesas,
          margemBruta: margemBruta,
          unidadesVendidas: quantidade - unidadesRestantes
        }
      };
      
      setResults(resultado);
      setCurrentStep(3);
      
    } catch (error) {
      console.error('Erro no cálculo:', error);
      alert('Erro ao calcular fluxo. Verifique os dados.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercent = (value) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="mx-auto max-w-4xl p-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="mb-4 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para Dashboard
          </button>
          
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
              <Calculator className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Fluxo de Caixa do Projeto</h1>
              <p className="text-slate-500">Simulação financeira automatizada</p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium ${
                    currentStep >= step
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-slate-300 bg-white text-slate-500'
                  }`}
                >
                  {step === 1 ? <Calendar className="h-5 w-5" /> : 
                   step === 2 ? <BarChart3 className="h-5 w-5" /> : 
                   <Eye className="h-5 w-5" />}
                </div>
                {step < 3 && (
                  <div
                    className={`mx-4 h-1 w-24 ${
                      currentStep > step ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between text-sm">
            <span className={currentStep >= 1 ? 'font-medium text-blue-600' : 'text-slate-500'}>
              Dados Básicos
            </span>
            <span className={currentStep >= 2 ? 'font-medium text-blue-600' : 'text-slate-500'}>
              Parâmetros
            </span>
            <span className={currentStep >= 3 ? 'font-medium text-blue-600' : 'text-slate-500'}>
              Resultados
            </span>
          </div>
        </div>

        {/* Step 1: Dados Básicos */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-slate-900">
                <Building className="h-5 w-5 text-blue-600" />
                Informações do Fluxo de Vendas
              </h2>
              
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Data de Início das Vendas *
                  </label>
                  <input
                    type="date"
                    value={fluxoData.dataInicio}
                    onChange={(e) => handleInputChange('fluxo', 'dataInicio', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Quantidade Total de Unidades *
                  </label>
                  <input
                    type="number"
                    placeholder="Ex: 195"
                    value={fluxoData.quantidadeUnidades}
                    onChange={(e) => handleInputChange('fluxo', 'quantidadeUnidades', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Valor Médio por Unidade (R$) *
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 632.862"
                    value={fluxoData.valorMedioUnidade}
                    onChange={(e) => handleInputChange('fluxo', 'valorMedioUnidade', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Período de Vendas (meses)
                  </label>
                  <input
                    type="number"
                    placeholder="Ex: 24"
                    value={fluxoData.periodoVendasMeses}
                    onChange={(e) => handleInputChange('fluxo', 'periodoVendasMeses', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setCurrentStep(2)}
                className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
              >
                Próxima Etapa
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Parâmetros */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-slate-900">
                <DollarSign className="h-5 w-5 text-blue-600" />
                Parâmetros Financeiros
              </h2>
              
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    % Entrada
                  </label>
                  <input
                    type="number"
                    value={fluxoData.percentualEntrada}
                    onChange={(e) => handleInputChange('fluxo', 'percentualEntrada', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    % Parcelado
                  </label>
                  <input
                    type="number"
                    value={fluxoData.percentualParcelado}
                    onChange={(e) => handleInputChange('fluxo', 'percentualParcelado', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Meses Parcelamento
                  </label>
                  <input
                    type="number"
                    value={fluxoData.mesesParcelamento}
                    onChange={(e) => handleInputChange('fluxo', 'mesesParcelamento', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    ITBI (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={despesasData.itbi}
                    onChange={(e) => handleInputChange('despesas', 'itbi', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    IPTU Anual (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={despesasData.iptuAnual}
                    onChange={(e) => handleInputChange('despesas', 'iptuAnual', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Escritura/Registro (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={despesasData.escrituraRegistro}
                    onChange={(e) => handleInputChange('despesas', 'escrituraRegistro', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Terreno (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={despesasData.terrenoPercentual}
                    onChange={(e) => handleInputChange('despesas', 'terrenoPercentual', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Obra (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={despesasData.obraPercentual}
                    onChange={(e) => handleInputChange('despesas', 'obraPercentual', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Comissão Venda (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={despesasData.comissaoVenda}
                    onChange={(e) => handleInputChange('despesas', 'comissaoVenda', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Publicidade (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={despesasData.publicidadePercentual}
                    onChange={(e) => handleInputChange('despesas', 'publicidadePercentual', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Taxa Administração (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={despesasData.taxaAdministracao}
                    onChange={(e) => handleInputChange('despesas', 'taxaAdministracao', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    RET (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={despesasData.retPercentual}
                    onChange={(e) => handleInputChange('despesas', 'retPercentual', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                Voltar
              </button>
              <button
                onClick={calcularFluxo}
                disabled={loading}
                className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Calculando...' : 'Calcular Fluxo'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Resultados */}
        {currentStep === 3 && results && (
          <div className="space-y-6">
            {/* Resumo */}
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">VGV</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-900">
                      {formatCurrency(results.resumo.totalReceitas)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-blue-50 p-3">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Despesas</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-900">
                      {formatCurrency(results.resumo.totalDespesas)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-red-50 p-3">
                    <DollarSign className="h-5 w-5 text-red-600" />
                  </div>
                </div>
              </div>
              
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Margem</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-900">
                      {formatPercent(results.resumo.margemBruta)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-green-50 p-3">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </div>
              
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Unidades</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-900">
                      {results.resumo.unidadesVendidas}
                    </p>
                  </div>
                  <div className="rounded-lg bg-purple-50 p-3">
                    <Building className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Tabela de Fluxo */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900">Fluxo Mensal de Vendas</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-slate-500">
                      <th className="px-6 py-3 font-medium">Mês</th>
                      <th className="px-6 py-3 font-medium">Data</th>
                      <th className="px-6 py-3 font-medium">Unidades</th>
                      <th className="px-6 py-3 font-medium">Vendas</th>
                      <th className="px-6 py-3 font-medium">Entrada</th>
                      <th className="px-6 py-3 font-medium">Parcelado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {results.curvaVendas.map((mes, index) => (
                      <tr key={index} className="text-slate-800">
                        <td className="px-6 py-3">{mes.mes}</td>
                        <td className="px-6 py-3">{new Date(mes.data).toLocaleDateString('pt-BR')}</td>
                        <td className="px-6 py-3">{mes.unidadesVendidas}</td>
                        <td className="px-6 py-3">{formatCurrency(mes.valorVendas)}</td>
                        <td className="px-6 py-3">{formatCurrency(mes.valorEntrada)}</td>
                        <td className="px-6 py-3">{formatCurrency(mes.valorParcelado)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(2)}
                className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                Voltar
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
              >
                Concluir
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FluxoForm;
