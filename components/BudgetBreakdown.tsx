
import React, { useMemo } from 'react';
import { BudgetResult, BudgetCategory, LineItem } from '../types';

interface BudgetBreakdownProps {
  result: BudgetResult;
  onResultChange: (newResult: BudgetResult) => void;
  onUndo: () => void;
  canUndo: boolean;
}

const BudgetBreakdown: React.FC<BudgetBreakdownProps> = ({ result, onResultChange, onUndo, canUndo }) => {
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  const toggleItem = (catId: string, itemId: string) => {
    const updatedCategories = result.categories.map(cat => {
      if (cat.id !== catId) return cat;
      return {
        ...cat,
        items: cat.items.map(item => item.id === itemId ? { ...item, included: !item.included } : item)
      };
    });
    onResultChange({ ...result, categories: updatedCategories });
  };

  const currentTotal = useMemo(() => {
    return result.categories.reduce((total, cat) => {
      return total + cat.items.reduce((sum, item) => sum + (item.included ? item.amount : 0), 0);
    }, 0);
  }, [result.categories]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Total Estimated Project Budget</p>
              <h3 className="text-5xl font-black tracking-tighter tabular-nums">{formatCurrency(currentTotal)}</h3>
            </div>
            {canUndo && (
              <button onClick={onUndo} className="text-[10px] font-bold text-white/50 hover:text-white uppercase flex items-center gap-1.5 transition-colors">
                <i className="fa-solid fa-rotate-left"></i> Undo Change
              </button>
            )}
          </div>
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10">
            <div><p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Building $/SF</p><span className="text-lg font-bold">${result.shellCostPerSqFt}</span></div>
            <div><p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Site $/SF</p><span className="text-lg font-bold">${result.siteCostPerSqFt}</span></div>
            <div><p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Timeline</p><span className="text-lg font-bold">{result.timelineWeeks} Weeks</span></div>
          </div>
        </div>
      </div>
      <div className="space-y-6">
        {result.categories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 bg-slate-50 border-b flex justify-between items-center">
              <h5 className="font-black text-slate-900 text-sm uppercase tracking-tight">{cat.name}</h5>
              <span className="text-lg font-black text-slate-900 tabular-nums">
                {formatCurrency(cat.items.reduce((sum, it) => sum + (it.included ? it.amount : 0), 0))}
              </span>
            </div>
            <div className="divide-y divide-slate-100">
              {cat.items.map((item) => (
                <div key={item.id} className={`flex items-center gap-4 px-6 py-3 transition-colors ${!item.included ? 'bg-slate-50/50 opacity-40 grayscale' : 'hover:bg-blue-50/20'}`}>
                  <input type="checkbox" checked={item.included} onChange={() => toggleItem(cat.id, item.id)} className="rounded text-blue-600" />
                  <span className={`text-xs font-bold flex-1 ${!item.included ? 'line-through text-slate-400' : 'text-slate-700'}`}>{item.name}</span>
                  <span className="text-xs font-black text-slate-800">{formatCurrency(item.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-blue-600">
        <h5 className="font-black text-slate-900 text-sm uppercase mb-4 flex items-center gap-2"><i className="fa-solid fa-user-tie text-blue-600"></i> Expert Advice</h5>
        <p className="text-sm text-slate-700 leading-relaxed font-medium italic">"{result.expertAdvice}"</p>
      </div>
    </div>
  );
};

export default BudgetBreakdown;
