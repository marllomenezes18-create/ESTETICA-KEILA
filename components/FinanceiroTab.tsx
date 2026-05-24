'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  Settings, 
  Filter, 
  X, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Transacao } from '../lib/types';
import { formatCurrency, formatDateBR } from '../lib/utils';

interface FinanceiroTabProps {
  transacoes: Transacao[];
  onAddTransaction: (t: Omit<Transacao, 'id'>) => void;
  onDeleteTransaction?: (id: string) => void;
}

export const CATEGORIES = ['Serviço', 'Comissão', 'Aluguel', 'Insumos', 'Marketing', 'Outros'];
export const PAY_METHODS = ['Dinheiro', 'Cartão de Crédito', 'Cartão de Débito', 'Pix', 'Outro'];

export default function FinanceiroTab({
  transacoes,
  onAddTransaction,
  onDeleteTransaction
}: FinanceiroTabProps) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'Todos' | 'Entrada' | 'Saida'>('Todos');
  const [filterCategory, setFilterCategory] = useState('Todas');
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [tipo, setTipo] = useState<'Entrada' | 'Saida'>('Saida');
  const [valor, setValor] = useState('');
  const [data, setData] = useState('2026-05-21');
  const [categoria, setCategoria] = useState('Insumos');
  const [descricao, setDescricao] = useState('');
  const [formaPagamento, setFormaPagamento] = useState<'Dinheiro' | 'Cartão de Crédito' | 'Cartão de Débito' | 'Pix' | 'Outro'>('Pix');

  // Math
  const totalEntradas = transacoes
    .filter(t => t.tipo === 'Entrada')
    .reduce((sum, t) => sum + t.valor, 0);

  const totalSaidas = transacoes
    .filter(t => t.tipo === 'Saida')
    .reduce((sum, t) => sum + t.valor, 0);

  const saldoLiquido = totalEntradas - totalSaidas;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const valNum = parseFloat(valor);
    if (isNaN(valNum) || valNum <= 0) {
      alert('Favor inserir um valor válido maior que zero.');
      return;
    }
    if (!descricao) {
      alert('Favor inserir uma descrição conveniente.');
      return;
    }

    onAddTransaction({
      tipo,
      valor: valNum,
      data,
      categoria,
      descricao,
      formaPagamento
    });

    // Reset Form
    setValor('');
    setDescricao('');
    setIsAdding(false);
  };

  const filteredTrans = transacoes.filter(t => {
    const matchesSearch = t.descricao.toLowerCase().includes(search.toLowerCase()) || 
      t.categoria.toLowerCase().includes(search.toLowerCase());
    
    const matchesType = filterType === 'Todos' ? true : t.tipo === filterType;
    const matchesCategory = filterCategory === 'Todas' ? true : t.categoria === filterCategory;

    return matchesSearch && matchesType && matchesCategory;
  }).sort((a, b) => b.data.localeCompare(a.data));

  return (
    <div id="financeiro-tab-root" className="space-y-6">
      
      {/* Dynamic Upper Summary Cards */}
      <div id="financial-highlights" className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Entradas */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-400 text-xs font-semibold block uppercase tracking-wider">Total de Entradas</span>
            <h3 className="text-2xl font-bold text-slate-900">{formatCurrency(totalEntradas)}</h3>
            <span className="text-emerald-500 text-xs font-semibold flex items-center gap-1">
              <ArrowUpRight className="w-4.5 h-4.5" /> Receitas estéticas
            </span>
          </div>
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 m-1 shrink-0">
            <ArrowUpRight className="w-6 h-6" />
          </div>
        </div>

        {/* Saídas */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-400 text-xs font-semibold block uppercase tracking-wider">Total de Saídas</span>
            <h3 className="text-2xl font-bold text-slate-900">{formatCurrency(totalSaidas)}</h3>
            <span className="text-rose-500 text-xs font-semibold flex items-center gap-1">
              <ArrowDownRight className="w-4.5 h-4.5" /> Despesas & Comissões
            </span>
          </div>
          <div className="p-3 rounded-xl bg-rose-50 text-rose-600 m-1 shrink-0">
            <ArrowDownRight className="w-6 h-6" />
          </div>
        </div>

        {/* Saldo Líquido */}
        <div className={`p-5 rounded-2xl border shadow-xs flex items-center justify-between ${
          saldoLiquido >= 0 ? 'bg-indigo-900 text-white border-indigo-950' : 'bg-rose-900 text-white border-rose-950'
        }`}>
          <div className="space-y-1">
            <span className="text-indigo-200 text-xs font-semibold block uppercase tracking-wider">Lucro Líquido Real</span>
            <h3 className="text-2xl font-bold tracking-tight">{formatCurrency(saldoLiquido)}</h3>
            <span className="text-indigo-300 text-xs font-medium">Balanço consolidado</span>
          </div>
          <div className="p-3 rounded-xl bg-white/10 text-white m-1 shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

      </div>

      <div id="finance-grid" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Fluxo de Caixa entries ledger */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h4 className="font-display font-semibold text-slate-800 text-lg">Livro de Caixa Unificado</h4>
              <p className="text-xs text-slate-500">Fluxo financeiro amparado por comissões estéticas sincronizadas</p>
            </div>
            
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs px-3.5 py-2 rounded-xl transition-all shadow-sm"
            >
              {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {isAdding ? 'Fechar Painel' : 'Registrar Fluxo'}
            </button>
          </div>

          {/* Ledger filters and search bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Pesquisar por descrição..."
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Type Filter */}
              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value as any)}
                className="border border-slate-200 rounded-xl text-xs py-2 px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white font-medium"
              >
                <option value="Todos">Tipo: Todos</option>
                <option value="Entrada">Entrada</option>
                <option value="Saida">Saída</option>
              </select>

              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
                className="border border-slate-200 rounded-xl text-xs py-2 px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white font-medium"
              >
                <option value="Todas">Categoria: Todas</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Table entries */}
          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-left text-xs font-medium">
              <thead className="bg-slate-50 text-slate-500 uppercase border-b border-slate-100 text-xxs tracking-wider">
                <tr>
                  <th className="p-3.5 font-semibold">Data</th>
                  <th className="p-3.5 font-semibold">Categoria</th>
                  <th className="p-3.5 font-semibold">Descrição</th>
                  <th className="p-3.5 font-semibold">Forma Pag.</th>
                  <th className="p-3.5 font-semibold text-right">Valor</th>
                  {onDeleteTransaction && <th className="p-3.5"></th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredTrans.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-slate-400">
                      Nenhum lançamento financeiro encontrado para os filtros selecionados.
                    </td>
                  </tr>
                ) : (
                  filteredTrans.map(trans => (
                    <tr key={trans.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3.5 whitespace-nowrap font-mono text-xxs font-semibold">
                        {formatDateBR(trans.data)}
                      </td>
                      <td className="p-3.5 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full font-semibold text-xxs ${
                          trans.categoria === 'Serviço' 
                            ? 'bg-indigo-50 text-indigo-800'
                            : trans.categoria === 'Comissão'
                            ? 'bg-amber-50 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {trans.categoria}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-800">{trans.descricao}</div>
                        {trans.agendamentoId && (
                          <span className="text-xxs text-slate-400 font-mono">Ref agendamento: {trans.agendamentoId}</span>
                        )}
                      </td>
                      <td className="p-3.5 whitespace-nowrap text-slate-500">
                        {trans.formaPagamento || 'Sem info'}
                      </td>
                      <td className={`p-3.5 text-right font-semibold whitespace-nowrap text-sm ${
                        trans.tipo === 'Entrada' ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        {trans.tipo === 'Entrada' ? '+' : '-'} {formatCurrency(trans.valor)}
                      </td>
                      {onDeleteTransaction && (
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => onDeleteTransaction(trans.id)}
                            className="p-1 text-slate-400 hover:text-rose-500 transition-colors rounded-lg hover:bg-rose-50"
                          >
                            <Trash2Icon className="w-4 h-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>

        {/* Right Column: Registries entry form */}
        <AnimatePresence>
          {isAdding && (
            <motion.div
              id="financial-manual-input-box"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs h-fit space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="font-display font-semibold text-slate-800 text-base">Registrar Lançamento</h4>
                <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
                
                {/* Tipo de fluxo toggle button options */}
                <div className="space-y-1.5 font-medium">
                  <label className="text-slate-500">Fluxo de Lançamento</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => { setTipo('Entrada'); setCategoria('Serviço'); }}
                      className={`py-2 px-4 rounded-xl text-center border font-semibold text-xs transition-all ${
                        tipo === 'Entrada'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-2 ring-emerald-100'
                          : 'bg-white text-slate-500 border-slate-200'
                      }`}
                    >
                      Entrada (Receita)
                    </button>
                    <button
                      type="button"
                      onClick={() => { setTipo('Saida'); setCategoria('Insumos'); }}
                      className={`py-2 px-4 rounded-xl text-center border font-semibold text-xs transition-all ${
                        tipo === 'Saida'
                          ? 'bg-rose-50 text-rose-800 border-rose-300 ring-2 ring-rose-100'
                          : 'bg-white text-slate-500 border-slate-200'
                      }`}
                    >
                      Saída (Despesa)
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-500">Valor Máximo *</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-slate-400">R$</span>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={valor}
                      onChange={e => setValor(e.target.value)}
                      placeholder="0,00"
                      className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-slate-500">Data *</label>
                    <input
                      type="date"
                      required
                      value={data}
                      onChange={e => setData(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-500">Categoria *</label>
                    <select
                      value={categoria}
                      onChange={e => setCategoria(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
                      required
                    >
                      {CATEGORIES
                        // filter only logical options
                        .filter(cat => (tipo === 'Entrada' ? cat === 'Serviço' || cat === 'Outros' : true))
                        .map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-500">Forma de Pagamento</label>
                  <select
                    value={formaPagamento}
                    onChange={e => setFormaPagamento(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
                  >
                    {PAY_METHODS.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-500">Descrição do Lançamento *</label>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    value={descricao}
                    onChange={e => setDescricao(e.target.value)}
                    placeholder="Ex: Compra de luvas descartáveis"
                    className="w-full border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
                  />
                </div>

                <button
                  type="submit"
                  className={`w-full text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1 leading-none ${
                    tipo === 'Entrada' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  <Plus className="w-4 h-4" /> Registrar Lançamento
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

// Icon helper
function Trash2Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}
