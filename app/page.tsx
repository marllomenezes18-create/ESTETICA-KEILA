'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Database, 
  Calendar, 
  TrendingUp, 
  Users, 
  DollarSign, 
  BookOpen, 
  RefreshCw, 
  Briefcase 
} from 'lucide-react';

import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, onSnapshot, doc, setDoc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { Cliente, Servico, Profissional, Agendamento, Transacao } from '../lib/types';
import { 
  INITIAL_CLIENTES, 
  INITIAL_SERVICOS, 
  INITIAL_PROFISSIONAIS, 
  INITIAL_AGENDAMENTOS, 
  INITIAL_TRANSACAES 
} from '../lib/sample-data';

// Component Tabs imports
import DashboardTab from '../components/DashboardTab';
import AgendaTab from '../components/AgendaTab';
import FinanceiroTab from '../components/FinanceiroTab';
import CadastroTab from '../components/CadastroTab';
import DocumentacaoTab from '../components/DocumentacaoTab';

type MainTab = 'dashboard' | 'agenda' | 'financeiro' | 'cadastro' | 'protocolos';

export default function Home() {
  const [activeTab, setActiveTab] = useState<MainTab>('dashboard');
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  // Firestore States
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);

  // Set up 5 synchronous real-time loaders of collections
  useEffect(() => {
    setLoading(true);

    const unsubClientes = onSnapshot(collection(db, 'clientes'), (snapshot) => {
      const list: Cliente[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ ...docSnap.data(), id: docSnap.id } as Cliente);
      });
      setClientes(list);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'clientes');
    });

    const unsubServicos = onSnapshot(collection(db, 'servicos'), (snapshot) => {
      const list: Servico[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ ...docSnap.data(), id: docSnap.id } as Servico);
      });
      setServicos(list);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'servicos');
    });

    const unsubProfissionais = onSnapshot(collection(db, 'profissionais'), (snapshot) => {
      const list: Profissional[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ ...docSnap.data(), id: docSnap.id } as Profissional);
      });
      setProfissionais(list);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'profissionais');
    });

    const unsubAgendamentos = onSnapshot(collection(db, 'agendamentos'), (snapshot) => {
      const list: Agendamento[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ ...docSnap.data(), id: docSnap.id } as Agendamento);
      });
      setAgendamentos(list);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'agendamentos');
    });

    const unsubTransacoes = onSnapshot(collection(db, 'transacoes'), (snapshot) => {
      const list: Transacao[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ ...docSnap.data(), id: docSnap.id } as Transacao);
      });
      setTransacoes(list);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'transacoes');
    });

    // Auto-cleanup of standard mock names if they exist
    const cleanupMockData = async () => {
      try {
        const mockClients = ['c-1', 'c-2', 'c-3', 'c-4'];
        const mockAppointments = ['a-1', 'a-2', 'a-3', 'a-4'];
        const mockTransactions = ['t-1', 't-2', 't-3', 't-4', 't-5', 't-6'];

        const batch = writeBatch(db);
        mockClients.forEach(id => batch.delete(doc(db, 'clientes', id)));
        mockAppointments.forEach(id => batch.delete(doc(db, 'agendamentos', id)));
        mockTransactions.forEach(id => batch.delete(doc(db, 'transacoes', id)));
        await batch.commit();
      } catch (e) {
        console.warn('Mock cleanup omitted or already deleted:', e);
      }
    };
    cleanupMockData();

    return () => {
      unsubClientes();
      unsubServicos();
      unsubProfissionais();
      unsubAgendamentos();
      unsubTransacoes();
    };
  }, []);

  // Database Seeding Logic
  const seedDatabase = async () => {
    setSyncing(true);
    try {
      const batch = writeBatch(db);

      // 1. Seed Clientes
      INITIAL_CLIENTES.forEach(c => {
        const ref = doc(collection(db, 'clientes'), c.id);
        batch.set(ref, c);
      });

      // 2. Seed Servicos
      INITIAL_SERVICOS.forEach(s => {
        const ref = doc(collection(db, 'servicos'), s.id);
        batch.set(ref, s);
      });

      // 3. Seed Profissionais
      INITIAL_PROFISSIONAIS.forEach(p => {
        const ref = doc(collection(db, 'profissionais'), p.id);
        batch.set(ref, p);
      });

      // 4. Seed Agendamentos
      INITIAL_AGENDAMENTOS.forEach(a => {
        const ref = doc(collection(db, 'agendamentos'), a.id);
        batch.set(ref, a);
      });

      // 5. Seed Transacoes
      INITIAL_TRANSACAES.forEach(t => {
        const ref = doc(collection(db, 'transacoes'), t.id);
        batch.set(ref, t);
      });

      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'seeding');
    } finally {
      setSyncing(false);
    }
  };

  // Database Wipe / Reset to fresh structure
  const resetDatabase = async () => {
    if (!confirm('Deseja realmente limpar toda a base de dados desta clínica?')) return;
    setSyncing(true);
    try {
      // Manual sequential delete of current list in batch
      const batch = writeBatch(db);
      
      clientes.forEach(c => batch.delete(doc(db, 'clientes', c.id)));
      servicos.forEach(s => batch.delete(doc(db, 'servicos', s.id)));
      profissionais.forEach(p => batch.delete(doc(db, 'profissionais', p.id)));
      agendamentos.forEach(a => batch.delete(doc(db, 'agendamentos', a.id)));
      transacoes.forEach(t => batch.delete(doc(db, 'transacoes', t.id)));

      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'resetting');
    } finally {
      setSyncing(false);
    }
  };

  // 1. Actions on Clientes
  const handleAddCliente = async (c: Omit<Cliente, 'id'>) => {
    const newId = `c-${Date.now()}`;
    try {
      await setDoc(doc(db, 'clientes', newId), { ...c, id: newId });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'clientes');
    }
  };

  const handleDeleteCliente = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'clientes', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `clientes/${id}`);
    }
  };

  // 2. Actions on Serviços
  const handleAddServico = async (s: Omit<Servico, 'id'>) => {
    const newId = `s-${Date.now()}`;
    try {
      await setDoc(doc(db, 'servicos', newId), { ...s, id: newId });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'servicos');
    }
  };

  const handleDeleteServico = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'servicos', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `servicos/${id}`);
    }
  };

  // 3. Actions on Profissionais
  const handleAddProfissional = async (p: Omit<Profissional, 'id'>) => {
    const newId = `p-${Date.now()}`;
    try {
      await setDoc(doc(db, 'profissionais', newId), { ...p, id: newId });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'profissionais');
    }
  };

  const handleDeleteProfissional = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'profissionais', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `profissionais/${id}`);
    }
  };

  // 4. Actions on Agendamentos (Unified cashier triggers)
  const handleCreateAppointment = async (a: Omit<Agendamento, 'id'>) => {
    const newId = `a-${Date.now()}`;
    try {
      await setDoc(doc(db, 'agendamentos', newId), { ...a, id: newId });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'agendamentos');
    }
  };

  const handleCancelAppointment = async (id: string) => {
    try {
      await updateDoc(doc(db, 'agendamentos', id), { status: 'Cancelado' });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `agendamentos/${id}`);
    }
  };

  const handleCompleteAppointment = async (agendaItem: Agendamento) => {
    setSyncing(true);
    try {
      const batch = writeBatch(db);

      // (A) Update appointment status
      const appRef = doc(db, 'agendamentos', agendaItem.id);
      batch.update(appRef, { status: 'Realizado e Pago' });

      // Retrieve names for descriptions
      const cli = clientes.find(c => c.id === agendaItem.clienteId);
      const serv = servicos.find(s => s.id === agendaItem.servicoId);
      const prof = profissionais.find(p => p.id === agendaItem.profissionalId);

      // (B) Create revenue inflow transaction
      const tInId = `t-in-${Date.now()}`;
      const inflow: Transacao = {
        id: tInId,
        tipo: 'Entrada',
        valor: agendaItem.valorCobrado,
        data: agendaItem.data,
        categoria: 'Serviço',
        descricao: `Atendimento ${cli?.nome || agendaItem.clienteNome || 'Cliente'}: ${serv?.nome || 'Procedimento'}`,
        formaPagamento: 'Pix',
        agendamentoId: agendaItem.id
      };
      const tInRef = doc(db, 'transacoes', tInId);
      batch.set(tInRef, inflow);

      // (C) Create professional commission outflow transaction (if professional exists)
      if (prof) {
        const commPercent = prof.comissaoPercentual;
        const commValue = Number(((agendaItem.valorCobrado * commPercent) / 100).toFixed(2));

        const tOutId = `t-out-${Date.now()}`;
        const outflow: Transacao = {
          id: tOutId,
          tipo: 'Saida',
          valor: commValue,
          data: agendaItem.data,
          categoria: 'Comissão',
          descricao: `Comissão ${prof.nome} ref. atendimento de ${cli?.nome || agendaItem.clienteNome || 'Cliente'}`,
          formaPagamento: 'Dinheiro',
          agendamentoId: agendaItem.id
        };
        const tOutRef = doc(db, 'transacoes', tOutId);
        batch.set(tOutRef, outflow);
      }

      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'completion');
    } finally {
      setSyncing(false);
    }
  };

  // 5. Actions on Transações
  const handleAddTransaction = async (t: Omit<Transacao, 'id'>) => {
    const newId = `t-${Date.now()}`;
    try {
      await setDoc(doc(db, 'transacoes', newId), { ...t, id: newId });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'transacoes');
    }
  };

  return (
    <div id="clinic-viewport-container" className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* Upper Navigation Header */}
      <header id="dashboard-navbar" className="bg-white border-b border-slate-100 py-3.5 px-6 shrink-0 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-2xl text-white shadow-md shadow-indigo-200">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-slate-850 text-lg leading-tight tracking-tight">Clínica de Estética</h1>
              <p className="text-xxs text-slate-400 font-semibold uppercase tracking-wider">Gestalt & Harmonização Integrada</p>
            </div>
          </div>

          {/* System status metadata */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <div className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl border border-indigo-100 flex items-center gap-2 shadow-xs font-semibold">
              <Database className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
              <span className="font-sans text-xxs">Firestore: amigosaru-6a228</span>
            </div>

            <div className="bg-white px-3.5 py-1.5 rounded-xl border border-slate-100 flex items-center gap-2.5 shadow-xs font-semibold text-slate-700">
              <Calendar className="w-4 h-4 text-indigo-500" />
              <span>21 de Maio de 2026</span>
            </div>

            {/* Syncing indicators */}
            <div className="flex items-center gap-2">
              <button
                onClick={seedDatabase}
                disabled={syncing}
                title="Popular banco com dados fictícios de estética"
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 hover:text-emerald-800 disabled:opacity-50 px-3.5 py-1.5 border border-emerald-100 rounded-xl font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${syncing ? 'animate-spin' : ''}`} />
                <span>Popular Clínica</span>
              </button>

              <button
                onClick={resetDatabase}
                disabled={syncing}
                title="Esvaziar todas as tabelas"
                className="bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 disabled:opacity-50 px-3.5 py-1.5 border border-rose-100 rounded-xl font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Limpar</span>
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* Primary Navigation Menubar */}
      <nav id="tabs-menubar" className="bg-slate-100/60 border-b border-slate-200/50 py-2.5 px-6 shrink-0">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 overflow-x-auto">
          
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`py-2 px-4 rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0 transition-all ${
              activeTab === 'dashboard' 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Painel Geral
          </button>

          <button
            onClick={() => setActiveTab('agenda')}
            className={`py-2 px-4 rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0 transition-all ${
              activeTab === 'agenda' 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Agenda de Atendimentos
          </button>

          <button
            onClick={() => setActiveTab('financeiro')}
            className={`py-2 px-4 rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0 transition-all ${
              activeTab === 'financeiro' 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            Fluxo de Caixa
          </button>

          <button
            onClick={() => setActiveTab('cadastro')}
            className={`py-2 px-4 rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0 transition-all ${
              activeTab === 'cadastro' 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            Cadastros Clínicos
          </button>

          <button
            onClick={() => setActiveTab('protocolos')}
            className={`py-2 px-4 rounded-xl text-xs font-semibold flex items-center gap-2 shrink-0 transition-all ${
              activeTab === 'protocolos' 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Protocolos & Dicionário
          </button>

        </div>
      </nav>

      {/* Main viewport workspace content */}
      <main id="clinic-tab-workspace-viewport" className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-24 gap-3 text-slate-500"
              >
                <RefreshCw className="w-7 h-7 text-indigo-500 animate-spin" />
                <span className="text-xs font-medium">Sincronizando com Firestore corporativo...</span>
              </motion.div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.18 }}
              >
                {/* 1. Dashboard */}
                {activeTab === 'dashboard' && (
                  <DashboardTab
                    clientes={clientes}
                    servicos={servicos}
                    profissionais={profissionais}
                    agendamentos={agendamentos}
                    transacoes={transacoes}
                    onCompleteAppointment={handleCompleteAppointment}
                  />
                )}

                {/* 2. Scheduler */}
                {activeTab === 'agenda' && (
                  <AgendaTab
                    clientes={clientes}
                    servicos={servicos}
                    profissionais={profissionais}
                    agendamentos={agendamentos}
                    onCreateAppointment={handleCreateAppointment}
                    onCancelAppointment={handleCancelAppointment}
                    onCompleteAppointment={handleCompleteAppointment}
                  />
                )}

                {/* 3. unified Cash Book ledger */}
                {activeTab === 'financeiro' && (
                  <FinanceiroTab
                    transacoes={transacoes}
                    onAddTransaction={handleAddTransaction}
                  />
                )}

                {/* 4. Clinics Registries */}
                {activeTab === 'cadastro' && (
                  <CadastroTab
                    clientes={clientes}
                    servicos={servicos}
                    profissionais={profissionais}
                    onAddCliente={handleAddCliente}
                    onAddServico={handleAddServico}
                    onAddProfissional={handleAddProfissional}
                    onDeleteCliente={handleDeleteCliente}
                    onDeleteServico={handleDeleteServico}
                    onDeleteProfissional={handleDeleteProfissional}
                  />
                )}

                {/* 5. Medical-Aesthetic dictionaries */}
                {activeTab === 'protocolos' && (
                  <DocumentacaoTab />
                )}

              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>

      {/* Humble Elegant Footer bar */}
      <footer id="workspace-footer" className="bg-white border-t border-slate-100 py-3 px-6 text-center text-xxs text-slate-400 shrink-0 select-none">
        <p>© 2026 Clínica de Estética Integrada • Sistema de ERP & Prontuário</p>
      </footer>

    </div>
  );
}
