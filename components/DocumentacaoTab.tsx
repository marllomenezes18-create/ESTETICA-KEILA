'use client';

import React, { useState } from 'react';
import { BookOpen, ShieldAlert, Sparkles, CheckCircle, ArrowRight, Sun, Info } from 'lucide-react';

interface ProcedureDoc {
  id: string;
  name: string;
  category: string;
  spacing: string;
  recovery: string;
  indications: string[];
  contraindications: string[];
  preCare: string[];
  postCare: string[];
}

const CLINICAL_REVIEWS: ProcedureDoc[] = [
  {
    id: 'doc-1',
    name: 'Limpeza de Pele Profunda',
    category: 'Facial / Higienização',
    spacing: 'A cada 30 a 40 dias',
    recovery: 'Imediata (leve vermelhidão por até 12 horas)',
    indications: [
      'Remoção de cravos (comedões) e milium',
      'Desobstrução de poros dilatados',
      'Renovação do relevo cutâneo',
      'Controle do excesso de sebo/oleosidade'
    ],
    contraindications: [
      'Acne inflamatória severa (graus III e IV)',
      'Herpes ativa',
      'Pele extremamente queimada de sol'
    ],
    preCare: [
      'Suspender ácidos dermatológicos 48h antes',
      'Não realizar esfoliações físicas no dia'
    ],
    postCare: [
      'Evitar exposição solar direta nas próximas 48h',
      'Utilizar regenerador labial/cutâneo e filtro solar FPS 50+',
      'Não usar maquiagem pesada ou ácidos por 24h'
    ]
  },
  {
    id: 'doc-2',
    name: 'Toxina Botulínica (Botox)',
    category: 'Harmonização / Rugas',
    spacing: 'A cada 4 a 6 meses',
    recovery: 'Imediata (pequenas pápulas no local da injeção por 30 min)',
    indications: [
      'Atenuação de rugas dinâmicas da testa',
      'Rugas glabelares (entre as sobrancelhas)',
      'Linhas periorbitais (pés de galinha)',
      'Tratamento de hiperidrose'
    ],
    contraindications: [
      'Gravidez ou amamentação em curso',
      'Doenças neuromusculares (ex: Miastenia Gravis)',
      'Infeções ativas no local da aplicação'
    ],
    preCare: [
      'Evitar anti-inflamatórios e AAS por 3 dias antes (reduz hematomas)',
      'Informar sobre o uso de suplementos de fitoterápicos'
    ],
    postCare: [
      'Não deitar ou abaixar a cabeça por 4 horas',
      'Não realizar atividades físicas intensas nas próximas 24h',
      'Não massagear o rosto ou as áreas de aplicação'
    ]
  },
  {
    id: 'doc-3',
    name: 'Peeling Químico Clareador',
    category: 'Facial / Renovação',
    spacing: 'Intervalos de 15 a 21 dias (ciclos de até 4 sessões)',
    recovery: '3 a 7 dias (descamação leve a moderada)',
    indications: [
      'Tratamento auxiliar de Melasma e hipercromia',
      'Suavização de sequelas de acne',
      'Estímulo de colágeno e brilho natural'
    ],
    contraindications: [
      'Uso de Isotretinoína nos últimos 6 meses',
      'Fototipos muito altos sem preparo adequado da pele',
      'Feridas abertas ou dermatite de contato'
    ],
    preCare: [
      'Preparar a pele com pré-peeling recomendado por 14 dias',
      'Suspender ácidos 3 dias antes do procedimento'
    ],
    postCare: [
      'Uso estrito e obrigatório de protetor solar de 3 em 3 horas',
      'Não puxar ou arrancar as peles que descamarem (evitar hiperpigmentação pós-inflamatória)',
      'Lavar o rosto apenas com sabonete neutro/hidratante suave'
    ]
  },
  {
    id: 'doc-4',
    name: 'Drenagem Linfática Corporal',
    category: 'Corporal / Redução',
    spacing: '1 a 3 vezes por semana',
    recovery: 'Nenhum tempo pós-operatório (totalmente imediata)',
    indications: [
      'Melhoria do edema e retenção de líquidos',
      'Pós-operatório de cirurgias plásticas (Lipoaspiração, Abdominoplastia)',
      'Alívio nos sintomas de pernas cansadas e má circulação'
    ],
    contraindications: [
      'Insuficiência cardíaca congestiva crônica',
      'Trombose Venosa Profunda (TVP) ativa',
      'Infecção sistêmica aguda ou febre'
    ],
    preCare: [
      'Estar bem hidratado antes da sessão',
      'Realizar refeição leve até 1 hora antes'
    ],
    postCare: [
      'Manter a ingestão hídrica abundante ao longo do dia',
      'Adotar alimentação de baixa carga sódica pós-procedimento'
    ]
  }
];

export default function DocumentacaoTab() {
  const [activeDoc, setActiveDoc] = useState<string>(CLINICAL_REVIEWS[0].id);

  const selected = CLINICAL_REVIEWS.find(d => d.id === activeDoc) || CLINICAL_REVIEWS[0];

  return (
    <div id="documentacao-tab-root" className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      
      {/* Sidebar Selector */}
      <div className="lg:col-span-1 bg-white p-4 rounded-2xl border border-slate-100 shadow-xs h-fit space-y-2">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-3">Protocolos Clínicos</h4>
        <div className="space-y-1">
          {CLINICAL_REVIEWS.map(doc => (
            <button
              key={doc.id}
              onClick={() => setActiveDoc(doc.id)}
              className={`w-full text-left py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                activeDoc === doc.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className="truncate">{doc.name}</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
          ))}
        </div>

        <div className="p-3 bg-indigo-50/50 border border-indigo-100/70 rounded-xl mt-4 space-y-1.5">
          <div className="flex items-center gap-1.5 text-indigo-800 text-xxs font-bold uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-indigo-600" />
            <span>Aviso de Segurança</span>
          </div>
          <p className="text-xxs text-slate-600 font-medium">
            Todos os procedimentos injetáveis ou de aplicação ácida exigem avaliação prévia e ficha de consentimento assinada pelo paciente.
          </p>
        </div>
      </div>

      {/* Main Documentation display content */}
      <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-6">
        
        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <span className="text-xxs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">{selected.category}</span>
            <h3 className="text-xl font-display font-semibold text-slate-800 mt-2">{selected.name}</h3>
          </div>
          <div className="space-y-1 text-right text-xs">
            <div className="text-slate-400 font-medium">Intervalo recomendado</div>
            <div className="font-semibold text-slate-800">{selected.spacing}</div>
          </div>
        </div>

        {/* Double Column content grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          
          {/* Indications and Contraindications */}
          <div className="space-y-4">
            
            {/* Indications */}
            <div className="space-y-2">
              <h5 className="font-bold text-slate-800 border-l-2 border-indigo-500 pl-2 uppercase tracking-wide text-xxs">Principais Indicações</h5>
              <ul className="space-y-1.5 pl-1 font-medium text-slate-600">
                {selected.indications.map((ind, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{ind}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contraindications */}
            <div className="p-4 bg-rose-50/40 border border-rose-100 rounded-xl space-y-2">
              <h5 className="font-bold text-rose-800 flex items-center gap-1.5 text-xxs uppercase tracking-wide">
                <ShieldAlert className="w-4.5 h-4.5 text-rose-600" />
                <span>Contraindicações Estritas</span>
              </h5>
              <ul className="space-y-1.5 pl-1 font-medium text-slate-600">
                {selected.contraindications.map((contra, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-1.5 shrink-0" />
                    <span>{contra}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Pre and Post care protocols */}
          <div className="space-y-4">
            
            {/* Pre Care */}
            <div className="space-y-2">
              <h5 className="font-bold text-slate-800 border-l-2 border-amber-500 pl-2 uppercase tracking-wide text-xxs">Orientações Pré-Procedimento</h5>
              <ul className="space-y-1.5 pl-1 font-medium text-slate-600">
                {selected.preCare.map((pre, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{pre}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Post care */}
            <div className="p-4 bg-indigo-50/30 border border-indigo-100 rounded-xl space-y-2">
              <h5 className="font-bold text-indigo-900 flex items-center gap-1.5 text-xxs uppercase tracking-wide">
                <Sun className="w-4.5 h-4.5 text-indigo-600 animate-pulse" />
                <span>Cuidados Pós-Sessão Essenciais</span>
              </h5>
              <ul className="space-y-1.5 pl-1 font-medium text-slate-600">
                {selected.postCare.map((post, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-indigo-600 text-xxs mt-0.5 shrink-0 font-bold">●</span>
                    <span>{post}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>

        {/* Bottom Recovery Specs Bar */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3 text-xs justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping"></span>
            <span className="text-slate-400 font-medium">Evolução / Tempo de recuperação clínica esperado:</span>
          </div>
          <span className="font-semibold text-slate-800">{selected.recovery}</span>
        </div>

      </div>

    </div>
  );
}
