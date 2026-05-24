'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Sparkles, 
  Briefcase, 
  Plus, 
  Search, 
  Phone, 
  Mail, 
  Clock, 
  DollarSign, 
  Percent, 
  Tag,
  Trash2
} from 'lucide-react';
import { Cliente, Servico, Profissional } from '../lib/types';
import { formatCurrency, formatDateBR } from '../lib/utils';

interface CadastroTabProps {
  clientes: Cliente[];
  servicos: Servico[];
  profissionais: Profissional[];
  onAddCliente: (c: Omit<Cliente, 'id'>) => void;
  onAddServico: (s: Omit<Servico, 'id'>) => void;
  onAddProfissional: (p: Omit<Profissional, 'id'>) => void;
  onDeleteCliente?: (id: string) => void;
  onDeleteServico?: (id: string) => void;
  onDeleteProfissional?: (id: string) => void;
}

type SubTab = 'clientes' | 'servicos' | 'profissionais';

export default function CadastroTab({
  clientes,
  servicos,
  profissionais,
  onAddCliente,
  onAddServico,
  onAddProfissional,
  onDeleteCliente,
  onDeleteServico,
  onDeleteProfissional,
}: CadastroTabProps) {
  const [activeTab, setActiveTab] = useState<SubTab>('clientes');
  const [search, setSearch] = useState('');

  // 1. Cliente fields
  const [cNome, setCNome] = useState('');
  const [cTelefone, setCTelefone] = useState('');
  const [cEmail, setCEmail] = useState('');
  const [cObs, setCObs] = useState('');

  // 2. Servico fields
  const [sNome, setSNome] = useState('');
  const [sDesc, setSDesc] = useState('');
  const [sPreco, setSPreco] = useState('');
  const [sTempo, setSTempo] = useState('');

  // 3. Profissional fields
  const [pNome, setPNome] = useState('');
  const [pEspec, setPEspec] = useState('');
  const [pComis, setPComis] = useState('');
  const [pTelefone, setPTelefone] = useState('');

  // Submits
  const handleAddCli = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cNome || !cTelefone) return;
    onAddCliente({
      nome: cNome,
      telefone: cTelefone,
      email: cEmail || `${cNome.toLowerCase().replace(/\s+/g, '')}@email.com`,
      observacoes: cObs,
      dataCadastro: new Date().toISOString().split('T')[0]
    });
    setCNome(''); setCTelefone(''); setCEmail(''); setCObs('');
  };

  const handleAddServ = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(sPreco);
    const duration = parseInt(sTempo);
    if (!sNome || isNaN(price) || isNaN(duration)) return;
    onAddServico({
      nome: sNome,
      descricao: sDesc,
      preco: price,
      tempoEstimado: duration
    });
    setSNome(''); setSDesc(''); setSPreco(''); setSTempo('');
  };

  const handleAddProf = (e: React.FormEvent) => {
    e.preventDefault();
    const comm = parseFloat(pComis);
    if (!pNome || !pEspec || isNaN(comm)) return;
    onAddProfissional({
      nome: pNome,
      especialidade: pEspec,
      comissaoPercentual: comm,
      telefone: pTelefone
    });
    setPNome(''); setPEspec(''); setPComis(''); setPTelefone('');
  };

  return (
    <div id="cadastro-tab-root" className="space-y-6">
      
      {/* Selector Subtabs Row */}
      <div className="flex border-b border-slate-100 gap-1 bg-white p-1 rounded-2xl border max-w-md">
        <button
          onClick={() => { setActiveTab('clientes'); setSearch(''); }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'clientes'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" /> Clientes
        </button>
        <button
          onClick={() => { setActiveTab('servicos'); setSearch(''); }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'servicos'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" /> Procedimentos
        </button>
        <button
          onClick={() => { setActiveTab('profissionais'); setSearch(''); }}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'profissionais'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Briefcase className="w-4 h-4" /> Especialistas
        </button>
      </div>

      <div id="tab-interaction-grid" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left pane: lists */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h4 className="font-display font-semibold text-slate-800 text-base capitalize">
                Gestão de {activeTab === 'servicos' ? 'Procedimentos' : activeTab === 'profissionais' ? 'Especialistas' : 'Clientes'}
              </h4>
              <p className="text-xs text-slate-400">Clique para adicionar registros na barra lateral</p>
            </div>

            <div className="w-full sm:w-64 relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Filtrar registros..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50 font-medium"
              />
            </div>
          </div>

          {/* Interactive Dynamic Catalog */}
          <div className="space-y-3.5">
            
            {/* 1. Clientes Subtab list */}
            {activeTab === 'clientes' && (
              clientes.filter(c => c.nome.toLowerCase().includes(search.toLowerCase()) || c.telefone.includes(search)).length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">Nenhum cliente cadastrado.</div>
              ) : (
                clientes.filter(c => c.nome.toLowerCase().includes(search.toLowerCase()) || c.telefone.includes(search)).map(c => (
                  <div key={c.id} className="p-4 border border-slate-100 rounded-xl hover:border-indigo-100 bg-slate-50/50 hover:bg-white transition-all space-y-2">
                    <div className="flex items-center justify-between">
                      <h5 className="font-semibold text-slate-800 text-sm">{c.nome}</h5>
                      <div className="flex items-center gap-2">
                        <span className="text-xxs font-mono text-slate-400">Cadastrado: {formatDateBR(c.dataCadastro)}</span>
                        {onDeleteCliente && (
                          <button
                            onClick={() => {
                              if (confirm(`Deseja realmente excluir o cliente ${c.nome}?`)) {
                                onDeleteCliente(c.id);
                              }
                            }}
                            className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition"
                            title="Excluir Cliente"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-400" /> {c.telefone}</span>
                      <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-slate-400" /> {c.email}</span>
                    </div>
                    {c.observacoes && (
                      <div className="border-t border-slate-200/50 pt-2 mt-2">
                        <span className="text-xxs text-amber-600 font-bold uppercase tracking-wider block mb-0.5">Ficha de Anamnese / Observações</span>
                        <p className="text-xxs text-slate-600 bg-amber-50/40 border border-amber-100/50 p-2.5 rounded-lg italic font-medium">
                          &ldquo;{c.observacoes}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>
                ))
              )
            )}

            {/* 2. Serviços Subtab list */}
            {activeTab === 'servicos' && (
              servicos.filter(s => s.nome.toLowerCase().includes(search.toLowerCase())).length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">Nenhum procedimento cadastrado.</div>
              ) : (
                servicos.filter(s => s.nome.toLowerCase().includes(search.toLowerCase())).map(s => (
                  <div key={s.id} className="p-4 border border-slate-100 rounded-xl hover:border-indigo-100 bg-slate-50/50 hover:bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h5 className="font-semibold text-slate-800 text-sm flex items-center gap-1.5">
                        <Tag className="w-4 h-4 text-indigo-500" />
                        {s.nome}
                      </h5>
                      <p className="text-xxs text-slate-500 max-w-lg font-medium">{s.descricao}</p>
                      <div className="flex items-center gap-2 text-xxs bg-slate-100 py-0.5 px-2 rounded-lg w-fit text-slate-600 font-mono">
                        <Clock className="w-3.5 h-3.5" /> {s.tempoEstimado} minutos
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 text-right justify-end sm:flex-row flex-row-reverse">
                      <div className="text-right shrink-0">
                        <span className="text-xxs text-slate-400 font-medium block">Preço de tabela</span>
                        <span className="text-base font-bold text-indigo-600">{formatCurrency(s.preco)}</span>
                      </div>
                      {onDeleteServico && (
                        <button
                          onClick={() => {
                            if (confirm(`Deseja realmente excluir o procedimento ${s.nome}?`)) {
                              onDeleteServico(s.id);
                            }
                          }}
                          className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition"
                          title="Excluir Procedimento"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )
            )}

            {/* 3. Profissionais Subtab list */}
            {activeTab === 'profissionais' && (
              profissionais.filter(p => p.nome.toLowerCase().includes(search.toLowerCase())).length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">Nenhum profissional cadastrado.</div>
              ) : (
                profissionais.filter(p => p.nome.toLowerCase().includes(search.toLowerCase())).map(p => (
                  <div key={p.id} className="p-4 border border-slate-100 rounded-xl hover:border-indigo-100 bg-slate-50/50 hover:bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h5 className="font-semibold text-slate-800 text-sm">{p.nome}</h5>
                      <span className="text-xxs font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-lg border border-indigo-100">
                        {p.especialidade}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
                        <Phone className="w-3.5 h-3.5 text-slate-400 font-semibold" /> {p.telefone}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 text-right justify-end sm:flex-row flex-row-reverse">
                      <div className="text-right shrink-0">
                        <span className="text-xxs text-amber-500 font-bold block uppercase tracking-wider">Apoio Comissão</span>
                        <span className="text-sm font-semibold text-slate-800 flex items-center gap-0.5 justify-end">
                          <Percent className="w-3.5 h-3.5 text-amber-500" /> {p.comissaoPercentual}% faturamento
                        </span>
                      </div>
                      {onDeleteProfissional && (
                        <button
                          onClick={() => {
                            if (confirm(`Deseja realmente excluir o especialista ${p.nome}?`)) {
                              onDeleteProfissional(p.id);
                            }
                          }}
                          className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition"
                          title="Excluir Especialista"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )
            )}

          </div>
        </div>

        {/* Right pane: Collapsible quick form */}
        <div id="quick-forms-sections" className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs h-fit">
          <h4 className="font-display font-semibold text-slate-800 text-base border-b border-slate-100 pb-3 mb-4">
            Adicionar {activeTab === 'servicos' ? 'Procedimento' : activeTab === 'profissionais' ? 'Especialista' : 'Cliente'}
          </h4>

          {/* Form Clientes */}
          {activeTab === 'clientes' && (
            <form onSubmit={handleAddCli} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1.5">
                <label className="text-slate-500">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={cNome}
                  onChange={e => setCNome(e.target.value)}
                  placeholder="Ex: Amanda Silva"
                  className="w-full border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-slate-500">Telefone Contato *</label>
                <input
                  type="text"
                  required
                  value={cTelefone}
                  onChange={e => setCTelefone(e.target.value)}
                  placeholder="Ex: (11) 98765-4321"
                  className="w-full border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-slate-500">Endereço de Email (Opcional)</label>
                <input
                  type="email"
                  value={cEmail}
                  onChange={e => setCEmail(e.target.value)}
                  placeholder="Ex: amanda.silva@email.com"
                  className="w-full border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-slate-500">Ficha de Anamnese (Alergias, pele ou pós-ope observações)</label>
                <textarea
                  value={cObs}
                  onChange={e => setCObs(e.target.value)}
                  placeholder="Ex: Rosácea ativa nas bochechas, pele supersensível..."
                  className="w-full min-h-24 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50 font-medium"
                />
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1">
                <Plus className="w-4 h-4" /> Cadastrar Cliente
              </button>
            </form>
          )}

          {/* Form Serviços */}
          {activeTab === 'servicos' && (
            <form onSubmit={handleAddServ} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1.5">
                <label className="text-slate-500">Nome do Procedimento *</label>
                <input
                  type="text"
                  required
                  value={sNome}
                  onChange={e => setSNome(e.target.value)}
                  placeholder="Ex: Peeling Químico"
                  className="w-full border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-slate-500">Preço de Tabela (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={sPreco}
                  onChange={e => setSPreco(e.target.value)}
                  placeholder="0,00"
                  className="w-full border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50 font-semibold"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-slate-500">Duração Estimada (minutos) *</label>
                <input
                  type="number"
                  required
                  value={sTempo}
                  onChange={e => setSTempo(e.target.value)}
                  placeholder="Ex: 45"
                  className="w-full border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50 font-semibold"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-slate-500">Descrição do Procedimento</label>
                <textarea
                  value={sDesc}
                  onChange={e => setSDesc(e.target.value)}
                  placeholder="Ex: Extração profunda e aplicação de LEDs..."
                  className="w-full border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50 font-medium"
                />
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1">
                <Plus className="w-4 h-4" /> Cadastrar Procedimento
              </button>
            </form>
          )}

          {/* Form Profissionais */}
          {activeTab === 'profissionais' && (
            <form onSubmit={handleAddProf} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1.5">
                <label className="text-slate-500">Nome do Profissional *</label>
                <input
                  type="text"
                  required
                  value={pNome}
                  onChange={e => setPNome(e.target.value)}
                  placeholder="Ex: Dr. Renato Mota"
                  className="w-full border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-slate-500">Especialidade / Cargo *</label>
                <input
                  type="text"
                  required
                  value={pEspec}
                  onChange={e => setPEspec(e.target.value)}
                  placeholder="Ex: Biomédica Esteta"
                  className="w-full border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50 font-medium"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-slate-500">Comissão de Apoio (%) *</label>
                <input
                  type="number"
                  required
                  max="100"
                  value={pComis}
                  onChange={e => setPComis(e.target.value)}
                  placeholder="Ex: 35"
                  className="w-full border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50 font-semibold"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-slate-500">Telefone Contato *</label>
                <input
                  type="text"
                  required
                  value={pTelefone}
                  onChange={e => setPTelefone(e.target.value)}
                  placeholder="Ex: (11) 91234-5678"
                  className="w-full border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
                />
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1">
                <Plus className="w-4 h-4" /> Cadastrar Especialista
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
