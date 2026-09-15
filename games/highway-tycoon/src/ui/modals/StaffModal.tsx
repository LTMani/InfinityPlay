import React from 'react';
import { StaffManager, ROLE_CONFIGS } from '../../simulation/staff/StaffManager';
import { StaffRole } from '../../types';
import { Users, UserPlus, Trash2, Award, DollarSign, X } from 'lucide-react';
import { sound } from '../../audio/SoundEngine';

interface StaffModalProps {
  staffManager: StaffManager;
  isOpen: boolean;
  onClose: () => void;
}

export const StaffModal: React.FC<StaffModalProps> = ({ staffManager, isOpen, onClose }) => {
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);

  if (!isOpen) return null;

  const handleHire = (role: StaffRole) => {
    staffManager.hireStaff(role);
    sound.playCashSound();
    forceUpdate();
  };

  const handleFire = (id: string) => {
    staffManager.fireStaff(id);
    sound.playClickSound();
    forceUpdate();
  };

  const handleSalaryChange = (id: string, delta: number) => {
    const member = staffManager.staff.find(s => s.id === id);
    if (member) {
      staffManager.setSalary(id, member.salaryPerHour + delta);
      sound.playClickSound();
      forceUpdate();
    }
  };

  const totalHourly = staffManager.getHourlySalariesTotal();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-blue-500/40 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-['Chakra_Petch'] text-white">
                Human Resources & Staff Roster
              </h2>
              <p className="text-xs text-slate-400">
                Total Payroll: ${totalHourly}/hr • {staffManager.staff.length} Active Employees
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
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 max-h-[75vh] overflow-y-auto">
          {/* Active Employees List */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-bold uppercase text-slate-400 font-['Chakra_Petch'] mb-2">
              Current Employees ({staffManager.staff.length})
            </h3>
            {staffManager.staff.length === 0 ? (
              <div className="p-8 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
                No staff currently hired. Select a role on the right to hire.
              </div>
            ) : (
              staffManager.staff.map(member => {
                const config = ROLE_CONFIGS[member.role];
                return (
                  <div
                    key={member.id}
                    className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-3.5 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{member.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-medium">
                          {config.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                        <span>Skill: ⭐ {member.skill}/10</span>
                        <span>Morale: {member.morale}%</span>
                        <span className="text-emerald-400 font-mono font-bold">${member.salaryPerHour}/hr</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-700">
                        <button
                          onClick={() => handleSalaryChange(member.id, -1)}
                          className="px-2 py-1 text-slate-400 hover:text-white text-xs font-bold"
                          title="Decrease wage"
                        >
                          -$1
                        </button>
                        <button
                          onClick={() => handleSalaryChange(member.id, 1)}
                          className="px-2 py-1 text-emerald-400 hover:text-emerald-300 text-xs font-bold"
                          title="Give raise"
                        >
                          +$1
                        </button>
                      </div>

                      <button
                        onClick={() => handleFire(member.id)}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                        title="Fire employee"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Hire New Roles */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase text-slate-400 font-['Chakra_Petch'] mb-2">
              Hire New Roles
            </h3>
            {(Object.keys(ROLE_CONFIGS) as StaffRole[]).map(role => {
              const cfg = ROLE_CONFIGS[role];
              return (
                <div
                  key={role}
                  className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-3 flex flex-col justify-between"
                >
                  <div className="mb-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-200">{cfg.title}</span>
                      <span className="text-xs text-emerald-400 font-mono font-bold">
                        ${cfg.defaultSalary}/hr
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">{cfg.description}</p>
                  </div>
                  <button
                    onClick={() => handleHire(role)}
                    className="w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    Hire Candidate
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950/80 border-t border-slate-800 text-xs text-slate-400 flex justify-between items-center">
          <span>💡 Tip: Fair wages keep morale high, boosting speed and customer satisfaction scores!</span>
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
