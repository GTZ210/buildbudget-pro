
import React, { useState, useEffect } from 'react';
import { ProjectParams, CostScenario, ShellDeliveryType, DemolitionType, SitePrepType } from '../types';

interface ProjectFormProps {
  onCalculate: (params: ProjectParams) => void;
  isLoading: boolean;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onCalculate, isLoading }) => {
  const [isLocating, setIsLocating] = useState(false);
  const [params, setParams] = useState<ProjectParams>({
    name: 'New Construction Project',
    existingSqft: 0,
    existingSiteSqft: 0,
    siteSqft: 0,
    proposedSqft: 0,
    scenario: CostScenario.MID,
    location: 'Austin, TX',
    includeDemolition: false,
    demolitionTypes: [],
    includeSitePrep: false,
    sitePrepTypes: [],
    includeStructure: false,
    shellDelivery: ShellDeliveryType.VANILLA_BOX,
    includeInterior: false,
    includeCustomScope: false,
    files: [],
    customScope: ''
  });

  const scopeItems = [
    { key: 'includeDemolition', label: 'Demolition & Clearing', icon: 'fa-trowel-bricks' },
    { key: 'includeSitePrep', label: 'Site Prep & Utilities', icon: 'fa-mountain-sun' },
    { key: 'includeStructure', label: 'Structural Shell', icon: 'fa-building' },
    { key: 'includeInterior', label: 'Interior Fit-out', icon: 'fa-couch' },
    { key: 'includeCustomScope', label: 'Custom Scope/Details', icon: 'fa-pen-to-square' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden no-print">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-lg font-bold text-slate-900">Project Parameters</h2>
      </div>
      <div className="p-6 space-y-6">
        <div>
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Project Name</label>
          <input 
            type="text" 
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-900"
            value={params.name}
            onChange={e => setParams({...params, name: e.target.value})}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Location</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={params.location}
              onChange={e => setParams({...params, location: e.target.value})}
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Scenario</label>
            <select className="w-full px-4 py-2 border rounded-lg" value={params.scenario} onChange={e => setParams({...params, scenario: e.target.value as CostScenario})}>
              {Object.values(CostScenario).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="space-y-2">
          {scopeItems.map(item => (
            <label key={item.key} className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${(params as any)[item.key] ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-200'}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${(params as any)[item.key] ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                <i className={`fa-solid ${item.icon} text-[10px]`}></i>
              </div>
              <span className={`text-[12px] font-bold flex-1 ${(params as any)[item.key] ? 'text-blue-900' : 'text-slate-700'}`}>{item.label}</span>
              <input type="checkbox" checked={(params as any)[item.key]} onChange={() => setParams({...params, [item.key]: !(params as any)[item.key]})} className="rounded text-blue-600" />
            </label>
          ))}
        </div>
        <button onClick={() => onCalculate(params)} disabled={isLoading} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center gap-2">
          {isLoading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-bolt"></i>}
          <span className="uppercase text-xs tracking-widest">Generate AI Estimate</span>
        </button>
      </div>
    </div>
  );
};

export default ProjectForm;
