
import React, { useState, useEffect, useRef, useCallback } from 'react';
import ProjectForm from './components/ProjectForm';
import BudgetBreakdown from './components/BudgetBreakdown';
import { ProjectParams, BudgetResult } from './types';
import { generateAIBudget } from './services/geminiService';

interface AppState {
  params: ProjectParams;
  result: BudgetResult | null;
}

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState(true);
  
  const [currentState, setCurrentState] = useState<AppState>({
    params: {
      name: 'New Construction Project',
      existingSqft: 0,
      existingSiteSqft: 0,
      siteSqft: 0,
      proposedSqft: 0,
      scenario: 'Standard/Market' as any,
      location: 'Austin, TX',
      includeDemolition: false,
      demolitionTypes: [],
      includeSitePrep: false,
      sitePrepTypes: [],
      includeStructure: false,
      shellDelivery: 'Vanilla Box (White Box)' as any,
      includeInterior: false,
      includeCustomScope: false,
      customScope: '',
      files: []
    },
    result: null
  });
  
  const [history, setHistory] = useState<AppState[]>([]);
  const progressInterval = useRef<number | null>(null);

  useEffect(() => {
    if (!process.env.API_KEY || process.env.API_KEY === 'undefined') {
      setHasApiKey(false);
    }
  }, []);

  useEffect(() => {
    if (loading) {
      setProgress(0);
      progressInterval.current = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= 98) return 98;
          const increment = prev < 60 ? 12 : prev < 90 ? 2 : 0.5;
          return Math.min(99, prev + increment);
        });
      }, 100);
    } else {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      if (currentState.result) {
        setProgress(100);
      }
    }
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, [loading, currentState.result]);

  const saveToHistory = useCallback(() => {
    setHistory(prev => [JSON.parse(JSON.stringify(currentState)), ...prev].slice(0, 50));
  }, [currentState]);

  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const [lastState, ...remainingHistory] = history;
    setCurrentState(lastState);
    setHistory(remainingHistory);
  }, [history]);

  const updateResult = useCallback((newResult: BudgetResult) => {
    saveToHistory();
    setCurrentState(prev => ({ ...prev, result: newResult }));
  }, [saveToHistory]);

  const handleCalculate = async (params: ProjectParams) => {
    setLoading(true);
    setError(null);
    try {
      const budget = await generateAIBudget(params);
      if (budget) {
        saveToHistory();
        setCurrentState({ params, result: budget });
      } else {
        setError("The estimator encountered an issue. Please check your project parameters.");
      }
    } catch (err) {
      setError("A server error occurred. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
              <i className="fa-solid fa-helmet-safety text-lg"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                BuildBudget <span className="text-blue-600 ml-1">Pro</span>
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Construction Estimation Suite</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {!hasApiKey && (
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg text-amber-700 text-[10px] font-bold uppercase tracking-wider animate-pulse">
                <i className="fa-solid fa-key"></i>
                Missing API Key
              </div>
            )}
            <div className="hidden md:flex items-center gap-4">
              <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-800 transition-all">
                Project Dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-4 space-y-6">
          <ProjectForm onCalculate={handleCalculate} isLoading={loading} />
          {error && (
            <div className="bg-red-50 border border-red-100 p-5 rounded-xl text-red-700 text-xs font-semibold flex items-start gap-3 shadow-sm animate-in fade-in slide-in-from-top-2">
              <i className="fa-solid fa-circle-exclamation mt-0.5 text-red-500"></i>
              <p>{error}</p>
            </div>
          )}
          <div className="bg-blue-600/5 border border-blue-100 p-6 rounded-xl hidden lg:block">
            <h4 className="text-[11px] font-bold text-blue-700 uppercase tracking-widest mb-2">Live Data Index</h4>
            <p className="text-xs text-blue-600/80 leading-relaxed font-medium">
              Calculations are indexed against real-time local labor and material costs from major vendors in your selected region.
            </p>
          </div>
        </aside>

        <section className="lg:col-span-8 h-full">
          {loading ? (
            <div className="h-full min-h-[500px] bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col items-center justify-center p-12">
              <div className="w-full max-w-md space-y-8">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Generating Quote</p>
                    <h3 className="text-xl font-bold text-slate-800 tracking-tight">AI Quantities & Material Take-off</h3>
                  </div>
                  <span className="text-3xl font-black text-slate-200 tabular-nums">{Math.round(progress)}%</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                  <div 
                    className="h-full bg-blue-600 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ) : currentState.result ? (
            <BudgetBreakdown 
              result={currentState.result} 
              onResultChange={updateResult}
              onUndo={handleUndo}
              canUndo={history.length > 0}
            />
          ) : (
            <div className="h-full min-h-[500px] bg-white border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 group hover:border-blue-200 transition-all">
              <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all">
                <i className="fa-solid fa-calculator text-4xl"></i>
              </div>
              <p className="font-bold uppercase tracking-widest text-xs text-slate-500">Ready to Estimate</p>
              <p className="text-xs text-slate-400 mt-2 max-w-[320px] text-center px-6 leading-relaxed">
                Configure your project details in the sidebar and click generate to receive a professional AI-driven budget breakdown.
              </p>
            </div>
          )}
        </section>
      </main>

      <footer className="mt-auto border-t border-slate-200 py-8 px-8 bg-white no-print">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 opacity-60 text-slate-400">
          <p className="text-[10px] font-bold uppercase tracking-widest">
            © 2026 BuildBudget Technologies Inc.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
