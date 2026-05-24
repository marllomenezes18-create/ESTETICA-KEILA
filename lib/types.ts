export interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  observacoes?: string;
  dataCadastro: string; // YYYY-MM-DD
}

export interface Servico {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  tempoEstimado: number; // in minutes
}

export interface Profissional {
  id: string;
  nome: string;
  especialidade: string;
  comissaoPercentual: number;
  telefone: string;
}

export interface Agendamento {
  id: string;
  clienteId: string;
  clienteNome?: string;
  servicoId: string;
  profissionalId: string;
  data: string; // YYYY-MM-DD
  hora: string; // HH:MM
  valorCobrado: number;
  status: 'Pendente' | 'Realizado e Pago' | 'Cancelado';
}

export interface Transacao {
  id: string;
  tipo: 'Entrada' | 'Saida';
  valor: number;
  data: string; // YYYY-MM-DD
  categoria: string;
  descricao: string;
  formaPagamento?: 'Dinheiro' | 'Cartão de Crédito' | 'Cartão de Débito' | 'Pix' | 'Outro';
  agendamentoId?: string;
}
