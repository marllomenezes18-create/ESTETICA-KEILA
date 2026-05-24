'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Eye, 
  X, 
  Check, 
  Trash2, 
  AlertTriangle 
} from 'lucide-react';
import { Cliente, Servico, Profissional, Agendamento } from '../lib/types';
import { formatDateBR, formatCurrency } from '../lib/utils';

interface AgendaTabProps {
  clientes: Cliente[];
  servicos: Servico[];
  profissionais: Profissional[];
  agendamentos: Agendamento[];
  onCreateAppointment: (agendamento: Omit<Agendamento, 'id'>) => void;
  onCancelAppointment: (id: string) => void;
  onCompleteAppointment: (agendamento: Agendamento) => void;
}

export default function AgendaTab({
  clientes,
  servicos,
  profissionais,
  agendamentos,
  onCreateAppointment,
  onCancelAppointment,
  onCompleteAppointment
}: AgendaTabProps) {
  const [search, setSearch] = useState('');
  const [filterDate, setFilterDate] = useState('2026-05-21'); // default date for matching initial data
  const [isAdding, setIsAdding] = useState(false);

  // New Booking Form state
  const [clienteId, setClienteId] = useState('');
  const [clienteInput, setClienteInput] = useState('');
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [servicoId, setServicoId] = useState('');
  const [profissionalId, setProfissionalId] = useState('');
  const [bookingDate, setBookingDate] = useState('2026-05-21');
  const [bookingTime, setBookingTime] = useState('09:00');
  const [customPrice, setCustomPrice] = useState('');

  // Handle service price autofill
  const handleServiceChange = (sId: string) => {
    setServicoId(sId);
    const selectedService = servicos.find(s => s.id === sId);
    if (selectedService) {
      setCustomPrice(selectedService.preco.toString());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!servicoId || !profissionalId || !bookingDate || !bookingTime) {
      alert('Favor preencher todos os campos obrigatórios (Procedimento, Especialista, Data e Hora)!');
      return;
    }

    const priceNum = customPrice ? parseFloat(customPrice) : 
      (servicos.find(s => s.id === servicoId)?.preco || 0);

    onCreateAppointment({
      clienteId: clienteId || '',
      clienteNome: clienteInput || '',
      servicoId,
      profissionalId,
      data: bookingDate,
      hora: bookingTime,
      valorCobrado: priceNum,
      status: 'Pendente'
    });

    // Reset Form
    setClienteId('');
    setClienteInput('');
    setServicoId('');
    setProfissionalId('');
    setCustomPrice('');
    setIsAdding(false);
  };

  // Filtered Bookings
  const filteredBookings = agendamentos.filter(a => {
    const cli = clientes.find(c => c.id === a.clienteId);
    const matchesSearch = cli?.nome.toLowerCase().includes(search.toLowerCase()) || false;
    const matchesDate = filterDate ? a.data === filterDate : true;
    return matchesSearch && matchesDate;
  }).sort((a, b) => a.hora.localeCompare(b.hora));

  return (
    <div id="agenda-tab-root" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Left pane: Appointments filters matches & timeline */}
      <div id="agenda-timeline-view" className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h4 className="font-display font-semibold text-slate-800 text-lg">Agenda de Sessões</h4>
            <p className="text-xs text-slate-500">Fluxo unificado de procedimentos e atendimentos</p>
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs px-3.5 py-2 rounded-xl transition-all shadow-sm"
          >
            {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {isAdding ? 'Fechar Painel' : 'Novo Agendamento'}
          </button>
        </div>

        {/* Action Filters Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar agendamentos por cliente..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none bg-slate-50/50"
            />
          </div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="date"
              value={filterDate}
              onChange={e => setFilterDate(e.target.value)}
              className="border border-slate-200 rounded-xl text-xs py-2 px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {filterDate && (
              <button 
                onClick={() => setFilterDate('')}
                className="text-xxs font-medium text-rose-500 bg-rose-50 hover:bg-rose-100 px-2.5 py-1.5 rounded-lg border border-rose-100"
              >
                Limpar Data
              </button>
            )}
          </div>
        </div>

        {/* Timeline Sessions list */}
        <div className="space-y-3.5">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 text-xs">
              Nenhum procedimento agendado para os filtros inseridos.
            </div>
          ) : (
            filteredBookings.map(booking => {
              const cli = clientes.find(c => c.id === booking.clienteId);
              const serv = servicos.find(s => s.id === booking.servicoId);
              const prof = profissionais.find(p => p.id === booking.profissionalId);

              return (
                <div 
                  key={booking.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    booking.status === 'Realizado e Pago'
                      ? 'bg-emerald-50/30 border-emerald-100/70 hover:border-emerald-200'
                      : booking.status === 'Cancelado'
                      ? 'bg-rose-50/20 border-rose-100/60 opacity-60'
                      : 'bg-white border-slate-100 hover:border-indigo-100 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-slate-100 rounded-xl text-slate-600 shrink-0 hidden sm:block">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xxs font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600 flex items-center gap-1 font-semibold">
                          <Clock className="w-3.5 h-3.5" />
                          {booking.hora}
                        </span>
                        <span className="text-xxs font-mono bg-indigo-50 px-2 py-0.5 rounded text-indigo-700 font-semibold">
                          {formatDateBR(booking.data)}
                        </span>
                        <span className={`text-xxs font-semibold px-2 py-0.5 rounded ${
                          booking.status === 'Realizado e Pago'
                            ? 'bg-emerald-100 text-emerald-800'
                            : booking.status === 'Cancelado'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                      <h4 className="font-semibold text-slate-900 text-sm">{cli?.nome || booking.clienteNome || 'Cliente não informado'}</h4>
                      <p className="text-xs text-slate-500 font-medium">
                        Procedimento: <span className="text-indigo-600 font-semibold">{serv?.nome || 'Procedimento avulso'}</span>
                      </p>
                      <p className="text-xxs text-slate-400">
                        Especialista: {prof?.nome} ({prof?.especialidade}) • Comissão: {prof?.comissaoPercentual}%
                      </p>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t sm:border-t-0 sm:pt-0 border-slate-100">
                    <div className="text-right sm:mr-3">
                      <span className="text-xs text-slate-400 font-medium block">Valor cobrado:</span>
                      <span className="text-sm font-semibold text-slate-800">{formatCurrency(booking.valorCobrado)}</span>
                    </div>

                    {booking.status === 'Pendente' && (
                      <div className="flex items-center gap-1.5 w-full sm:w-auto mt-2 sm:mt-0">
                        <button
                          onClick={() => onCompleteAppointment(booking)}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xxs px-3 py-2 rounded-lg transition-colors border border-emerald-500"
                        >
                          <Check className="w-3.5 h-3.5" /> Realizar e Pagar
                        </button>
                        <button
                          onClick={() => onCancelAppointment(booking.id)}
                          className="flex items-center justify-center p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-100 transition-colors"
                          title="Cancelar Agendamento"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right pane: Add session panel Form (collapsible) */}
      <AnimatePresence>
        {(isAdding || agendamentos.length === 0) && (
          <motion.div 
            id="agenda-form-pane"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs h-fit space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-display font-semibold text-slate-800 text-base">Novo Procedimento</h4>
              <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600 lg:hidden">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1.5 relative" id="cliente-autocomplete-container">
                <label className="text-slate-500">Cliente (Digite ou selecione)</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Nome do cliente (opcional, pode deixar limpo)..."
                    value={clienteInput}
                    onChange={e => {
                      setClienteInput(e.target.value);
                      setClienteId(''); // clears the pre-selected client id if typed manually
                      setShowClientDropdown(true);
                    }}
                    onFocus={() => setShowClientDropdown(true)}
                    className="w-full border border-slate-200 rounded-xl p-2.5 pr-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50 font-semibold text-xs"
                  />
                  {clienteInput && (
                    <button
                      type="button"
                      onClick={() => {
                        setClienteInput('');
                        setClienteId('');
                        setShowClientDropdown(false);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition"
                      title="Limpar cliente"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {showClientDropdown && (
                  <div 
                    className="fixed inset-0 z-30" 
                    onClick={() => setShowClientDropdown(false)} 
                  />
                )}

                <AnimatePresence>
                  {showClientDropdown && clientes.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="absolute z-40 w-full bg-white border border-slate-200 rounded-xl mt-1 shadow-lg max-h-48 overflow-y-auto divide-y divide-slate-100 text-xs font-medium"
                    >
                      <div className="p-2 bg-slate-50 text-xxs text-slate-400 font-bold uppercase tracking-wider flex items-center justify-between sticky top-0">
                        <span>Selecione um paciente</span>
                        <button 
                          type="button" 
                          onClick={() => setShowClientDropdown(false)}
                          className="text-slate-400 hover:text-slate-600 font-semibold"
                        >
                          Fechar
                        </button>
                      </div>
                      
                      {clientes
                        .filter(c => c.nome.toLowerCase().includes(clienteInput.toLowerCase()))
                        .map(c => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => {
                              setClienteId(c.id);
                              setClienteInput(c.nome);
                              setShowClientDropdown(false);
                            }}
                            className="w-full text-left p-2.5 hover:bg-indigo-50/50 hover:text-indigo-600 transition flex items-center justify-between"
                          >
                            <span>{c.nome}</span>
                            {c.telefone && <span className="text-xxs font-mono text-slate-400">{c.telefone}</span>}
                          </button>
                        ))
                      }
                      
                      {clientes.filter(c => c.nome.toLowerCase().includes(clienteInput.toLowerCase())).length === 0 && (
                        <div className="p-3 text-slate-400 text-center text-xxs">
                          Utilizar "{clienteInput}" como cliente avulso.
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-500">Procedimento / Serviço *</label>
                <select
                  value={servicoId}
                  onChange={e => handleServiceChange(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
                  required
                >
                  <option value="">Selecione um procedimento...</option>
                  {servicos.map(s => (
                    <option key={s.id} value={s.id}>{s.nome} - {formatCurrency(s.preco)}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-500">Especialista Responsável *</label>
                <select
                  value={profissionalId}
                  onChange={e => setProfissionalId(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
                  required
                >
                  <option value="">Selecione o profissional...</option>
                  {profissionais.map(p => (
                    <option key={p.id} value={p.id}>{p.nome} ({p.especialidade})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-slate-500">Data *</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={e => setBookingDate(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-500">Hora *</label>
                  <input
                    type="time"
                    value={bookingTime}
                    onChange={e => setBookingTime(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-500">Valor Cobrado (Opcional - sobrescreve preço padrão)</label>
                <input
                  type="number"
                  placeholder="R$ Padrão"
                  value={customPrice}
                  onChange={e => setCustomPrice(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50/50"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1 mt-2"
              >
                <Plus className="w-4 h-4" /> Cadastrar Procedimento
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
