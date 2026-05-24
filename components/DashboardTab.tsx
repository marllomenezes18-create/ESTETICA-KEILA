'use client';

import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  Users, 
  ChevronRight, 
  CheckCircle, 
  Clock, 
  Sparkles 
} from 'lucide-react';
import { Cliente, Servico, Profissional, Agendamento, Transacao } from '../lib/types';
import { formatCurrency, formatDateBR } from '../lib/utils';

interface DashboardTabProps {
  clientes: Cliente[];
  servicos: Servico[];
  profissionais: Profissional[];
  agendamentos: Agendamento[];
  transacoes: Transacao[];
  onCompleteAppointment?: (agendamento: Agendamento) => void;
}

export default function DashboardTab({
  clientes,
  servicos,
  profissionais,
  agendamentos,
  transacoes,
  onCompleteAppointment
}: DashboardTabProps) {
  // 1. Finance math
  const totalEntradas = transacoes
    .filter(t => t.tipo === 'Entrada')
    .reduce((sum, t) => sum + t.valor, 0);

  const totalSaidas = transacoes
    .filter(t => t.tipo === 'Saida')
    .reduce((sum, t) => sum + t.valor, 0);

  const saldoCaixa = totalEntradas - totalSaidas;

  // Commissions calculation
  const totalComissoes = transacoes
    .filter(t => t.categoria === 'Comissão' || t.descricao.toLowerCase().includes('comissão'))
    .reduce((sum, t) => sum + t.valor, 0);

  // Active bookings count for the month (May 2026)
  const pendentesCount = agendamentos.filter(a => a.status === 'Pendente').length;

  // Today stats (mocking today as May 21, 2026 because of data alignment)
  const todayStr = '2026-05-21';
  const todayAgendamentos = agendamentos.filter(a => a.data === todayStr);

  // 2. Prepare chart data by day for May 21st & near dates
  const dailyFlows: { [date: string]: { entrada: number, saida: number } } = {};
  transacoes.forEach(t => {
    if (!dailyFlows[t.data]) {
      dailyFlows[t.data] = { entrada: 0, saida: 0 };
    }
    if (t.tipo === 'Entrada') dailyFlows[t.data].entrada += t.valor;
    if (t.tipo === 'Saida') dailyFlows[t.data].saida += t.valor;
  });

  const sortedDates = Object.keys(dailyFlows).sort();
  const maxFlowValue = Math.max(
    ...sortedDates.map(d => Math.max(dailyFlows[d].entrada, dailyFlows[d].saida)),
    100
  );

  return (
    <div id="dashboard-tab-root" className="space-y-6">
      {/* Upper Grid Card Stats */}
      <div id="stats-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Caixa Net */}
        <motion.div 
          id="stat-box-caixa"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 text-sm font-medium">Saldo em Caixa</span>
            <div className={`p-2 rounded-xl ${saldoCaixa >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-semibold tracking-tight text-slate-900">
              {formatCurrency(saldoCaixa)}
            </h3>
            <span className="text-xs text-slate-400 mt-1 block">Faturamento líquido</span>
          </div>
        </motion.div>

        {/* Faturamento */}
        <motion.div 
          id="stat-box-faturamento"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 text-sm font-medium">Faturamento Total</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-semibold tracking-tight text-slate-900">
              {formatCurrency(totalEntradas)}
            </h3>
            <span className="text-xs text-emerald-500 mt-1 font-medium inline-flex items-center gap-1">
              {transacoes.filter(t => t.tipo === 'Entrada').length} lançamentos
            </span>
          </div>
        </motion.div>

        {/* Comissões pagas */}
        <motion.div 
          id="stat-box-comissoes"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 text-sm font-medium">Comissões Pagas</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-semibold tracking-tight text-slate-900">
              {formatCurrency(totalComissoes)}
            </h3>
            <span className="text-xs text-slate-400 mt-1 block">Apoio a profissionais</span>
          </div>
        </motion.div>

        {/* Pacientes cadastrados */}
        <motion.div 
          id="stat-box-agendamentos"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 text-sm font-medium">Agendamentos</span>
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-semibold tracking-tight text-slate-900">
              {agendamentos.length} realizados
            </h3>
            <span className="text-xs text-sky-600 mt-1 font-medium block">
              {pendentesCount} na fila de espera
            </span>
          </div>
        </motion.div>

      </div>

      {/* Main Grid: Charts & Next sessions */}
      <div id="dashboard-two-column-layout" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: Micro Interactive Chart */}
        <div id="chart-section" className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-display font-semibold text-slate-800 text-base">Fluxo de Caixa Diário</h4>
              <p className="text-xs text-slate-500">Acompanhamento contínuo de entradas e saídas</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-indigo-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 block"></span> Entradas
              </span>
              <span className="flex items-center gap-1.5 text-rose-500 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 block"></span> Saídas
              </span>
            </div>
          </div>

          {/* Micro SVG Bar Visualizer */}
          <div id="svg-cashflow-chart" className="h-64 flex items-end gap-6 sm:gap-10 pt-4 border-b border-slate-100">
            {sortedDates.length === 0 ? (
              <div className="m-auto text-slate-400 text-sm font-medium">Nenhum dado financeiro para exibir no gráfico</div>
            ) : (
              sortedDates.map(date => {
                const dayFlow = dailyFlows[date];
                const entHeight = (dayFlow.entrada / maxFlowValue) * 80; // 80% maximum height
                const saiHeight = (dayFlow.saida / maxFlowValue) * 80;

                return (
                  <div key={date} className="flex-1 flex flex-col items-center gap-2 group relative">
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 pointer-events-none absolute -top-12 bg-slate-900 text-white text-xxs px-2.5 py-1.5 rounded-lg shadow-lg flex flex-col gap-0.5 z-10 transition-opacity whitespace-nowrap">
                      <span>Data: {formatDateBR(date)}</span>
                      <span className="text-emerald-400">Entrada: {formatCurrency(dayFlow.entrada)}</span>
                      <span className="text-rose-400">Saída: {formatCurrency(dayFlow.saida)}</span>
                    </div>

                    <div className="w-full flex justify-center items-end gap-1.5 h-44">
                      {/* Entrada bar */}
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.max(entHeight, 4)}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="w-4 sm:w-6 bg-indigo-500 hover:bg-indigo-600 rounded-t-md transition-colors"
                      />
                      {/* Saida bar */}
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.max(saiHeight, 4)}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="w-4 sm:w-6 bg-rose-400 hover:bg-rose-500 rounded-t-md transition-colors"
                      />
                    </div>
                    
                    <span className="text-slate-500 font-mono text-xxs">{date.substring(8, 10)}/{date.substring(5, 7)}</span>
                  </div>
                );
              })
            )}
          </div>
          <div className="flex justify-between items-center text-xs text-slate-400 pt-1">
            <span>Visualização diária consolidada</span>
            <span>Exibindo os últimos lançamentos</span>
          </div>
        </div>

        {/* Right column: Dynamic queue list for today */}
        <div id="today-queue-section" className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-display font-semibold text-slate-800 text-base">Fila de Hoje</h4>
              <p className="text-xs text-slate-500">{formatDateBR(todayStr)}</p>
            </div>
            <Sparkles className="w-4.5 h-4.5 text-indigo-500" />
          </div>

          <div className="space-y-3.5 overflow-y-auto max-h-72 flex-1 pr-1">
            {todayAgendamentos.length === 0 ? (
              <div className="m-auto py-12 text-center text-slate-400 text-xs">
                Nenhum agendamento cadastrado para hoje.
              </div>
            ) : (
              todayAgendamentos.map(agen => {
                const cli = clientes.find(c => c.id === agen.clienteId);
                const serv = servicos.find(s => s.id === agen.servicoId);
                const prof = profissionais.find(p => p.id === agen.profissionalId);

                return (
                  <div 
                    key={agen.id} 
                    className="p-3.5 rounded-xl border border-slate-100 hover:border-indigo-100 bg-slate-50/50 hover:bg-white transition-all flex items-start justify-between gap-2"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xxs font-mono bg-slate-200/80 px-1.5 py-0.5 rounded text-slate-700 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {agen.hora}
                        </span>
                        <span className={`text-xxs font-semibold px-1.5 py-0.5 rounded ${
                          agen.status === 'Realizado e Pago' 
                            ? 'bg-emerald-50 text-emerald-700' 
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {agen.status}
                        </span>
                      </div>
                      <h5 className="font-semibold text-slate-800 text-xs">{cli?.nome || agen.clienteNome || 'Cliente não informado'}</h5>
                      <p className="text-xxs text-slate-500 line-clamp-1">
                        {serv?.nome || 'Procedimento'} • Prof. {prof?.nome || 'Profissional'}
                      </p>
                      <span className="text-xs font-semibold text-indigo-600 block mt-1">
                        {formatCurrency(agen.valorCobrado)}
                      </span>
                    </div>

                    {agen.status === 'Pendente' && onCompleteAppointment && (
                      <button
                        onClick={() => onCompleteAppointment(agen)}
                        title="Concluir procedimento e gerar comissão"
                        className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 p-1.5 rounded-lg border border-indigo-100 transition-colors text-xxs flex items-center gap-1 font-semibold"
                      >
                        <CheckCircle className="w-4 h-4 text-indigo-600" />
                        Pagar
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
