import { Cliente, Servico, Profissional, Agendamento, Transacao } from './types';

export const INITIAL_CLIENTES: Cliente[] = [];

export const INITIAL_SERVICOS: Servico[] = [
  {
    id: 's-1',
    nome: 'Limpeza de Pele Profunda',
    descricao: 'Extração de comedões, esfoliação facial ultra-sônica, máscara calmante e LEDterapia.',
    preco: 180,
    tempoEstimado: 60
  },
  {
    id: 's-2',
    nome: 'Toxina Botulínica (Botox)',
    descricao: 'Aplicação preventiva ou corretiva de toxina botulínica na testa, glabela e olhos (rugas dinâmicas).',
    preco: 1200,
    tempoEstimado: 45
  },
  {
    id: 's-3',
    nome: 'Drenagem Linfática Corporal',
    descricao: 'Massagem manual suave para redução de edema, ativação do sistema linfático e relaxamento pós-cirúrgico.',
    preco: 130,
    tempoEstimado: 55
  },
  {
    id: 's-4',
    nome: 'Peeling Químico Clareador',
    descricao: 'Aplicação de blend de ácidos renovadores para atenuar melasma e melhorar textura geral cutânea.',
    preco: 250,
    tempoEstimado: 40
  }
];

export const INITIAL_PROFISSIONAIS: Profissional[] = [
  {
    id: 'p-1',
    nome: 'Dra. Patricia Ramos',
    especialidade: 'Biomédica Esteta / Harmonização',
    comissaoPercentual: 35,
    telefone: '(11) 94321-8765'
  },
  {
    id: 'p-2',
    nome: 'Letícia Albuquerque',
    especialidade: 'Esteticista Corporal e Massoterapeuta',
    comissaoPercentual: 45,
    telefone: '(11) 93210-7654'
  },
  {
    id: 'p-3',
    nome: 'Priscila Rocha',
    especialidade: 'Esteticista Facial e Tecnóloga Esteta',
    comissaoPercentual: 40,
    telefone: '(11) 92109-6543'
  }
];

export const INITIAL_AGENDAMENTOS: Agendamento[] = [];

export const INITIAL_TRANSACAES: Transacao[] = [];
