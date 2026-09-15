import React from 'react';
import { EconomyEngine } from '../../simulation/economy/EconomyEngine';
import { DollarSign, TrendingUp, TrendingDown, Landmark, X } from 'lucide-react';
import { sound } from '../../audio/SoundEngine';

interface FinanceModalProps {
  economy: EconomyEngine;
  currentDay: number;
  isOpen: boolean;
  onClose: () => void;
}

export const FinanceModal: React.FC<FinanceModalProps> = ({
  economy,
  currentDay,
  isOpen,
  onClose
}) => {
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);

  if (!isOpen) return null;

  const handleTakeLoan = (amount: number, name: string) => {
    const success = economy.takeLoan(name, amount, 0.08, 14);
    if (success) {
      sound.playCashSound();
      forceUpdate();
    }
  };

  const dailyNet = economy.getDailyNetProfit(currentDay);
  const breakdown = economy.getCategoryBreakdown(currentDay);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-['Chakra_Petch'] text-white">
                Financial Ledger & Bank Loans
              </h2>
              <p className="text-xs text-slate-400">
                Current Capital: <span className="text-emerald-400 font-bold font-mono">${economy.cash.toLocaleString()}</span> • Day {currentDay} Net: 
                <span className={`font-mono font-bold ml-1 ${dailyNet >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {dailyNet >= 0 ? `+$${dailyNet.toFixed(2)}` : `-$${Math.abs(dailyNet).toFixed(2)}`}
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={() => { sound.playClickSound(); onClose(); }}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 max-h-[75vh] overflow-y-auto">
          {/* Day P&L Breakdown */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase text-slate-400 font-['Chakra_Petch']">
              Day {currentDay} Income / Expense
            </h3>
            <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-3 space-y-2 text-xs">
              {Object.entries(breakdown).map(([cat, val]) => (
                <div key={cat} className="flex justify-between items-center py-1 border-b border-slate-800">
                  <span className="text-slate-300 font-medium">{cat}</span>
                  <div className="text-right font-mono">
                    {val.income > 0 && <span className="text-emerald-400 block">+${val.income.toFixed(2)}</span>}
                    {val.expense > 0 && <span className="text-red-400 block">-${val.expense.toFixed(2)}</span>}
                  </div>
                </div>
              ))}
              {Object.keys(breakdown).length === 0 && (
                <p className="text-slate-500 text-center py-4">No transactions recorded yet today.</p>
              )}
            </div>

            {/* Bank Loans Section */}
            <h3 className="text-xs font-bold uppercase text-slate-400 font-['Chakra_Petch'] pt-2">
              Commercial Credit Lines
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => handleTakeLoan(15000, 'Small Business Line')}
                disabled={economy.activeLoans.length >= 3}
                className="w-full p-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-xl border border-slate-700 text-left transition"
              >
                <div className="flex justify-between items-center text-xs font-bold text-white">
                  <span>$15,000 Working Capital</span>
                  <span className="text-amber-400 font-mono">8% Int.</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">14-day repayment schedule</p>
              </button>

              <button
                onClick={() => handleTakeLoan(40000, 'Highway Expansion Facility')}
                disabled={economy.activeLoans.length >= 3}
                className="w-full p-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-xl border border-slate-700 text-left transition"
              >
                <div className="flex justify-between items-center text-xs font-bold text-white">
                  <span>$40,000 Highway Facility</span>
                  <span className="text-amber-400 font-mono">8% Int.</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">14-day repayment schedule</p>
              </button>
            </div>
          </div>

          {/* Recent Transaction Log */}
          <div className="md:col-span-2 space-y-2">
            <h3 className="text-xs font-bold uppercase text-slate-400 font-['Chakra_Petch']">
              Live Transaction Stream
            </h3>
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 max-h-96 overflow-y-auto space-y-2 font-mono text-xs">
              {economy.records.slice(0, 40).map((r, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800/80"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-[10px]">D{r.day} {r.hour}:00</span>
                    <span className="text-slate-200 text-xs truncate max-w-xs">{r.description}</span>
                  </div>
                  <span className={`font-bold ${r.amount >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {r.amount >= 0 ? `+$${r.amount.toFixed(2)}` : `-$${Math.abs(r.amount).toFixed(2)}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950/80 border-t border-slate-800 text-xs text-slate-400 flex justify-between items-center">
          <span>💡 Tip: Take loans early to expand pumps and cabins, accelerating daily cashflow.</span>
          <button
            onClick={() => { sound.playClickSound(); onClose(); }}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg text-xs transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
